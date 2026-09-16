import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from backend.app.models.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    APIResponse,
    UserRole,
)
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=APIResponse)
async def register_user(
    req: UserRegisterRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    email = req.email.strip().lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "EMAIL_EXISTS", "message": "An account with this email address already exists"},
        )
    
    user_id = f"usr-{uuid.uuid4().hex[:12]}"
    now_str = datetime.now(timezone.utc).isoformat()
    hashed = hash_password(req.password)
    
    user_doc = {
        "id": user_id,
        "email": email,
        "name": req.name.strip(),
        "role": req.role.value if hasattr(req.role, "value") else str(req.role),
        "hashedPassword": hashed,
        "organizationName": req.organizationName.strip() if req.organizationName else "",
        "phone": req.phone.strip() if req.phone else "",
        "createdAt": now_str,
        "updatedAt": now_str,
    }
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token({"sub": user_id, "email": email, "role": user_doc["role"]})
    refresh_token = create_refresh_token({"sub": user_id, "email": email})
    
    user_res = UserResponse(
        id=user_id,
        email=email,
        name=user_doc["name"],
        role=user_doc["role"],
        organizationName=user_doc["organizationName"],
        phone=user_doc["phone"],
        createdAt=now_str,
    )
    
    return APIResponse(
        success=True,
        data=TokenResponse(
            accessToken=access_token,
            refreshToken=refresh_token,
            user=user_res,
        ).model_dump(),
    )

@router.post("/login", response_model=APIResponse)
async def login_user(
    req: UserLoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    email = req.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user.get("hashedPassword", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"},
        )
    
    access_token = create_access_token({"sub": user["id"], "email": email, "role": user["role"]})
    refresh_token = create_refresh_token({"sub": user["id"], "email": email})
    
    user_res = UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        organizationName=user.get("organizationName", ""),
        phone=user.get("phone", ""),
        createdAt=user.get("createdAt", datetime.now(timezone.utc).isoformat()),
    )
    
    return APIResponse(
        success=True,
        data=TokenResponse(
            accessToken=access_token,
            refreshToken=refresh_token,
            user=user_res,
        ).model_dump(),
    )

@router.post("/refresh", response_model=APIResponse)
async def refresh_token_endpoint(
    refreshToken: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    payload = decode_token(refreshToken)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_TOKEN", "message": "Refresh token is invalid or expired"},
        )
    
    user_id = payload.get("sub")
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "USER_NOT_FOUND", "message": "User does not exist"},
        )
    
    new_access_token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})
    return APIResponse(
        success=True,
        data={"accessToken": new_access_token, "tokenType": "bearer"},
    )

@router.post("/logout", response_model=APIResponse)
async def logout():
    return APIResponse(success=True, data={"message": "Logged out successfully"})

@router.get("/me", response_model=APIResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_res = UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        name=current_user["name"],
        role=current_user["role"],
        organizationName=current_user.get("organizationName", ""),
        phone=current_user.get("phone", ""),
        createdAt=current_user.get("createdAt", ""),
    )
    return APIResponse(success=True, data=user_res.model_dump())
