import io
import random
import string
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Request, Response, HTTPException, status, Query
from fastapi.responses import JSONResponse

import segno

from backend.app.core.database import get_database
from backend.app.models.schemas import (
    APIResponse,
    QRCodeCreateRequest,
    QRCodeResponse,
    QRCodeAnalyticsResponse,
)

logger = logging.getLogger("newrider.qrcode")

router = APIRouter(prefix="/qr", tags=["Dynamic QR Codes"])


def generate_short_id(length: int = 4) -> str:
    """
    Generate unique short index string hash (e.g., rider_7x9A).
    """
    chars = string.ascii_letters + string.digits
    suffix = "".join(random.choice(chars) for _ in range(length))
    return f"rider_{suffix}"


def generate_qr_svg_stream(content: str) -> bytes:
    """
    Generates QR code on-the-fly in-memory using segno.
    Enforces:
    - High Error Correction (Level H) for up to 30% damage tolerance
    - Standard quiet zone margin (border size of 4 modules)
    - Pure in-memory BytesIO buffer (no local disk writes)
    """
    qr = segno.make(content, error="H")
    buff = io.BytesIO()
    # Save as pure scalable vector graphic (SVG) with border=4 quiet zone
    qr.save(buff, kind="svg", border=4)
    return buff.getvalue()


@router.post("/generate", response_model=APIResponse)
async def create_dynamic_qr(payload: QRCodeCreateRequest, request: Request):
    """
    Generation Phase:
    - Saves long destination payload into the database alongside unique short index hash (rider_XXXX).
    - Generates dynamic tracking URL passed to the QR matrix.
    - Zero local disk writes; stores only database metadata.
    """
    dest_url = payload.destinationUrl.strip()
    if not dest_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_URL", "message": "Destination URL cannot be empty."}
        )

    # Automatically prefix http/https if missing
    if not (dest_url.startswith("http://") or dest_url.startswith("https://")):
        dest_url = f"https://{dest_url}"

    database = get_database()

    # Generate collision-free short ID
    for _ in range(10):
        short_id = generate_short_id()
        existing = await database.qr_codes.find_one({"shortId": short_id})
        if not existing:
            break
    else:
        # Fallback to 8 chars if high collision
        short_id = f"rider_{uuid.uuid4().hex[:6]}"

    # Compute base tracking URL pointing to /track/{short_id}
    # Using request.base_url ensures correct protocol/host (e.g. http://localhost:8000/track/rider_XXXX)
    base_url = str(request.base_url).rstrip("/")
    tracking_url = f"{base_url}/track/{short_id}"
    svg_url = f"/api/v1/qr/{short_id}/svg"

    now_iso = datetime.now(timezone.utc).isoformat()
    qr_doc = {
        "id": str(uuid.uuid4()),
        "shortId": short_id,
        "destinationUrl": dest_url,
        "trackingUrl": tracking_url,
        "svgUrl": svg_url,
        "title": payload.title or "New Rider Dynamic QR",
        "metadata": payload.metadata or {},
        "totalScans": 0,
        "scans": [],
        "createdAt": now_iso,
        "updatedAt": now_iso,
    }

    await database.qr_codes.insert_one(qr_doc)

    qr_response = QRCodeResponse(
        id=qr_doc["id"],
        shortId=short_id,
        destinationUrl=dest_url,
        trackingUrl=tracking_url,
        svgUrl=svg_url,
        totalScans=0,
        title=qr_doc["title"],
        createdAt=now_iso,
    )

    return APIResponse(
        success=True,
        data=qr_response.model_dump(),
        error=None,
    )


@router.get("/direct/svg")
async def stream_direct_svg(url: str = Query(..., description="Destination URL or payload to encode")):
    """
    On-the-fly in-memory SVG generator for any arbitrary URL or string.
    - Error correction: Level H
    - Quiet zone: border=4
    - Media type: image/svg+xml
    """
    cleaned_url = url.strip()
    if not cleaned_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "EMPTY_PAYLOAD", "message": "Payload string cannot be empty."}
        )

    svg_content = generate_qr_svg_stream(cleaned_url)
    return Response(
        content=svg_content,
        media_type="image/svg+xml",
        headers={
            "Content-Disposition": 'inline; filename="new-rider-qr.svg"',
            "Cache-Control": "public, max-age=3600",
        },
    )


@router.get("/{short_id}/svg")
async def stream_qr_svg(short_id: str):
    """
    Streams the high-resolution Scalable Vector Graphic (.svg) directly to the client.
    - Media type: image/svg+xml
    - Error correction: Level H
    - Quiet zone: border=4
    - Generated entirely in-memory with segno (no disk files).
    """
    database = get_database()
    qr_doc = await database.qr_codes.find_one({"shortId": short_id})
    if not qr_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "QR_NOT_FOUND", "message": f"QR Code with ID '{short_id}' not found."}
        )

    # Encode the dynamic redirect tracking URL into the matrix
    tracking_url = qr_doc.get("trackingUrl", f"/track/{short_id}")
    svg_content = generate_qr_svg_stream(tracking_url)

    return Response(
        content=svg_content,
        media_type="image/svg+xml",
        headers={
            "Content-Disposition": 'inline; filename="new-rider-qr.svg"',
            "Cache-Control": "public, max-age=3600",
        },
    )



@router.get("/{short_id}/analytics", response_model=APIResponse)
async def get_qr_analytics(short_id: str):
    """
    Retrieve real-time scan metrics and scan tracking lifecycle logs for a dynamic QR code.
    """
    database = get_database()
    qr_doc = await database.qr_codes.find_one({"shortId": short_id})
    if not qr_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "QR_NOT_FOUND", "message": f"QR Code with ID '{short_id}' not found."}
        )

    analytics_data = QRCodeAnalyticsResponse(
        shortId=qr_doc["shortId"],
        destinationUrl=qr_doc["destinationUrl"],
        trackingUrl=qr_doc.get("trackingUrl", f"/track/{short_id}"),
        totalScans=qr_doc.get("totalScans", 0),
        scans=qr_doc.get("scans", []),
        createdAt=qr_doc.get("createdAt", ""),
        updatedAt=qr_doc.get("updatedAt", ""),
    )

    return APIResponse(
        success=True,
        data=analytics_data.model_dump(),
        error=None,
    )
