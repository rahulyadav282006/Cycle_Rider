from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from backend.app.core.config import settings
from backend.app.core.database import init_db, close_db, get_database
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.events import router as events_router
from backend.app.api.v1.checkpoints import router as checkpoints_router
from backend.app.api.v1.riders import router as riders_router
from backend.app.api.v1.volunteers import router as volunteers_router
from backend.app.api.v1.scans import router as scans_router
from backend.app.api.v1.live import router as live_router
from backend.app.api.v1.reports import router as reports_router
from backend.app.api.v1.admin import router as admin_router
from backend.app.api.v1.qrcode import router as qr_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()

app = FastAPI(
    title="NewRider API",
    version="1.0.0",
    description="RideTrack Cycling Event Management System API",
    lifespan=lifespan,
)

# CORS middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler for structured error responses
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail
    if isinstance(detail, dict):
        code = detail.get("code", "ERROR")
        message = detail.get("message", "An error occurred")
    else:
        code = "HTTP_ERROR"
        message = str(detail)
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message,
            },
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": str(exc),
            },
        },
    )

# Mount API Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(events_router, prefix="/api/v1")
app.include_router(checkpoints_router, prefix="/api/v1")
app.include_router(riders_router, prefix="/api/v1")
app.include_router(volunteers_router, prefix="/api/v1")
app.include_router(scans_router, prefix="/api/v1")
app.include_router(live_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(qr_router, prefix="/api/v1")

@app.get("/track/{short_id}", tags=["QR Tracking"])
async def track_and_redirect(short_id: str, request: Request):
    """
    Scan Phase & Instant Redirection:
    - Pointing a camera hits /track/{short_id}.
    - Performs immediate asynchronous database increments (totalScans, timestamp, userAgent, clientIp).
    - Instantly returns HTTP 302 Found redirect forwarding the browser to destinationUrl.
    """
    database = get_database()
    qr_doc = await database.qr_codes.find_one({"shortId": short_id})
    if not qr_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "QR_NOT_FOUND", "message": f"QR code with tracking ID '{short_id}' was not found."}
        )

    # Analytics / Scan Tracking Lifecycle
    timestamp = datetime.now(timezone.utc).isoformat()
    user_agent = request.headers.get("user-agent", "Unknown")
    client_ip = request.client.host if request.client else "Unknown"

    await database.qr_codes.update_one(
        {"shortId": short_id},
        {
            "$inc": {"totalScans": 1},
            "$push": {
                "scans": {
                    "$each": [
                        {
                            "timestamp": timestamp,
                            "userAgent": user_agent,
                            "clientIp": client_ip,
                        }
                    ],
                    "$slice": -100,
                }
            },
            "$set": {"updatedAt": timestamp},
        },
    )

    destination_url = qr_doc.get("destinationUrl", "/")
    return RedirectResponse(url=destination_url, status_code=status.HTTP_302_FOUND)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "newrider-api", "version": "1.0.0"}

