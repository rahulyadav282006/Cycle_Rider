import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.app.core.database import get_database
from backend.app.core.security import get_password_hash
from backend.app.api.deps import require_super_admin
from backend.app.models.schemas import APIResponse, UserRole, EventStatus

router = APIRouter(prefix="/admin", tags=["Super Admin"])

# --------------------------------------------------
# SCHEMAS FOR ADMIN REQUESTS
# --------------------------------------------------
class AdminCreateOrganizerRequest(BaseModel):
    name: str
    email: str
    organization: Optional[str] = None
    mobile: Optional[str] = None
    password: Optional[str] = "Organizer@123"
    status: Optional[str] = "Active"

class AdminUpdateSettingsRequest(BaseModel):
    platformName: Optional[str] = "RideTrack"
    supportEmail: Optional[str] = "support@ridetrack.com"
    allowPublicRegistration: Optional[bool] = True
    allowEventCreation: Optional[bool] = True
    allowOrganizerRegistration: Optional[bool] = True
    offlineScanning: Optional[bool] = True
    automaticSync: Optional[bool] = True
    platformNotifications: Optional[bool] = True
    qrCodeGracePeriodHours: Optional[int] = 48
    offlineSyncWindowHours: Optional[int] = 72
    maintenanceMode: Optional[bool] = False

# --------------------------------------------------
# 1. PLATFORM STATS
# --------------------------------------------------
@router.get("/stats", response_model=APIResponse)
async def get_admin_stats(
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    total_organizers = await db.users.count_documents({"role": UserRole.ORGANIZER.value})
    total_events = await db.events.count_documents({})
    active_events = await db.events.count_documents({"status": EventStatus.ACTIVE.value})
    total_riders = await db.riders.count_documents({})
    total_checkpoints = await db.checkpoints.count_documents({})

    # Active organizers are those with at least one active or upcoming event, or total organizers if none yet
    active_org_ids = await db.events.distinct("organizerId", {"status": {"$in": ["active", "upcoming"]}})
    active_organizers = len(active_org_ids) if active_org_ids else total_organizers

    return {
        "success": True,
        "data": {
            "totalOrganizers": total_organizers,
            "activeOrganizers": active_organizers,
            "totalEvents": total_events,
            "activeEvents": active_events,
            "totalRiders": total_riders,
            "totalCheckpoints": total_checkpoints,
        },
    }

# --------------------------------------------------
# 2. ORGANIZERS LIST & CREATE
# --------------------------------------------------
@router.get("/organizers", response_model=APIResponse)
async def list_organizers(
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    org_cursor = db.users.find({"role": UserRole.ORGANIZER.value}).sort("createdAt", -1)
    org_users = await org_cursor.to_list(length=100)

    result = []
    for org in org_users:
        org_id = org["id"]
        # Find events for this organizer
        events_cursor = db.events.find({"organizerId": org_id}).sort("createdAt", -1)
        events = await events_cursor.to_list(length=20)

        events_count = len(events)
        active_events = [e for e in events if e.get("status") == "active"]
        completed_events = [e for e in events if e.get("status") == "completed"]

        # Calculate total riders
        event_ids = [e["id"] for e in events]
        total_riders = 0
        if event_ids:
            total_riders = await db.riders.count_documents({"eventId": {"$in": event_ids}})

        recent_events = [
            {
                "id": e["id"],
                "name": e.get("eventName", "Event"),
                "date": e.get("rideDate", ""),
                "location": e.get("location", ""),
                "distance": f"{e.get('rideDistance', 0)} km",
                "status": e.get("status", "upcoming"),
            }
            for e in events[:5]
        ]

        result.append({
            "id": org_id,
            "name": org.get("name", "Organizer"),
            "email": org.get("email", ""),
            "mobile": org.get("phone", org.get("mobile", "")),
            "organization": org.get("organizationName", org.get("organization", "Cycling Club")),
            "eventsCount": events_count,
            "activeEventsCount": len(active_events),
            "completedEventsCount": len(completed_events),
            "totalRiders": total_riders,
            "status": org.get("status", "Active"),
            "joinedDate": org.get("createdAt", datetime.now(timezone.utc).strftime("%d %b %Y")),
            "recentEvents": recent_events,
        })

    return {"success": True, "data": result}

@router.post("/organizers", response_model=APIResponse)
async def create_organizer(
    req: AdminCreateOrganizerRequest,
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    normalized_email = req.email.strip().lower()
    existing = await db.users.find_one({"email": normalized_email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "EMAIL_EXISTS", "message": "An account with this email already exists"},
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    org_id = f"org-{uuid.uuid4().hex[:8]}"

    new_user = {
        "id": org_id,
        "email": normalized_email,
        "name": req.name.strip(),
        "hashedPassword": get_password_hash(req.password or "Organizer@123"),
        "role": UserRole.ORGANIZER.value,
        "organizationName": req.organization or "Cycling Club",
        "phone": req.mobile or "",
        "status": req.status or "Active",
        "createdAt": now_iso,
        "updatedAt": now_iso,
    }

    await db.users.insert_one(new_user)

    return {
        "success": True,
        "data": {
            "id": org_id,
            "name": new_user["name"],
            "email": new_user["email"],
            "organization": new_user["organizationName"],
            "mobile": new_user["phone"],
            "status": new_user["status"],
            "createdAt": new_user["createdAt"],
        },
    }

@router.get("/organizers/{organizer_id}", response_model=APIResponse)
async def get_organizer_details(
    organizer_id: str,
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    org = await db.users.find_one({"id": organizer_id, "role": UserRole.ORGANIZER.value})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Organizer not found"},
        )

    events_cursor = db.events.find({"organizerId": organizer_id}).sort("createdAt", -1)
    events = await events_cursor.to_list(length=50)

    events_count = len(events)
    active_events = [e for e in events if e.get("status") == "active"]
    completed_events = [e for e in events if e.get("status") == "completed"]

    event_ids = [e["id"] for e in events]
    total_riders = 0
    if event_ids:
        total_riders = await db.riders.count_documents({"eventId": {"$in": event_ids}})

    recent_events = [
        {
            "id": e["id"],
            "name": e.get("eventName", "Event"),
            "date": e.get("rideDate", ""),
            "location": e.get("location", ""),
            "distance": f"{e.get('rideDistance', 0)} km",
            "status": e.get("status", "upcoming"),
            "ridersCount": await db.riders.count_documents({"eventId": e["id"]}),
        }
        for e in events
    ]

    return {
        "success": True,
        "data": {
            "id": org["id"],
            "name": org.get("name", "Organizer"),
            "email": org.get("email", ""),
            "mobile": org.get("phone", ""),
            "organization": org.get("organizationName", "Cycling Club"),
            "eventsCount": events_count,
            "activeEventsCount": len(active_events),
            "completedEventsCount": len(completed_events),
            "totalRiders": total_riders,
            "status": org.get("status", "Active"),
            "joinedDate": org.get("createdAt", datetime.now(timezone.utc).strftime("%d %b %Y")),
            "events": recent_events,
        },
    }

# --------------------------------------------------
# 3. PLATFORM-WIDE EVENTS
# --------------------------------------------------
@router.get("/events", response_model=APIResponse)
async def list_all_admin_events(
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    events_cursor = db.events.find({}).sort("createdAt", -1)
    events = await events_cursor.to_list(length=100)

    result = []
    for ev in events:
        ev_id = ev["id"]
        rider_cnt = await db.riders.count_documents({"eventId": ev_id})
        cp_cnt = await db.checkpoints.count_documents({"eventId": ev_id})

        result.append({
            "id": ev_id,
            "name": ev.get("eventName", "Event"),
            "organizer": ev.get("organizerName", "RideTrack Organizer"),
            "organizerId": ev.get("organizerId", ""),
            "date": ev.get("rideDate", ""),
            "location": ev.get("location", ""),
            "distance": f"{ev.get('rideDistance', 0)} km",
            "ridersCount": rider_cnt,
            "checkpointsCount": cp_cnt,
            "status": ev.get("status", "upcoming"),
            "createdAt": ev.get("createdAt", ""),
        })

    return {"success": True, "data": result}

# --------------------------------------------------
# 4. SYSTEM SETTINGS
# --------------------------------------------------
DEFAULT_SETTINGS = {
    "platformName": "RideTrack",
    "supportEmail": "support@ridetrack.com",
    "allowPublicRegistration": True,
    "allowEventCreation": True,
    "allowOrganizerRegistration": True,
    "offlineScanning": True,
    "automaticSync": True,
    "platformNotifications": True,
    "qrCodeGracePeriodHours": 48,
    "offlineSyncWindowHours": 72,
    "maintenanceMode": False,
    "updatedAt": datetime.now(timezone.utc).isoformat(),
}

@router.get("/settings", response_model=APIResponse)
async def get_system_settings(
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    settings_doc = await db.settings.find_one({"type": "system"})
    if not settings_doc:
        settings_doc = DEFAULT_SETTINGS.copy()
        settings_doc["type"] = "system"
        await db.settings.insert_one(settings_doc)

    return {
        "success": True,
        "data": {
            "platformName": settings_doc.get("platformName", "RideTrack"),
            "supportEmail": settings_doc.get("supportEmail", "support@ridetrack.com"),
            "allowPublicRegistration": settings_doc.get("allowPublicRegistration", True),
            "allowEventCreation": settings_doc.get("allowEventCreation", True),
            "allowOrganizerRegistration": settings_doc.get("allowOrganizerRegistration", True),
            "offlineScanning": settings_doc.get("offlineScanning", True),
            "automaticSync": settings_doc.get("automaticSync", True),
            "platformNotifications": settings_doc.get("platformNotifications", True),
            "platformStatus": "Operational" if not settings_doc.get("maintenanceMode", False) else "Maintenance",
            "qrCodeGracePeriodHours": settings_doc.get("qrCodeGracePeriodHours", 48),
            "offlineSyncWindowHours": settings_doc.get("offlineSyncWindowHours", 72),
            "maintenanceMode": settings_doc.get("maintenanceMode", False),
            "updatedAt": settings_doc.get("updatedAt", ""),
        },
    }

@router.put("/settings", response_model=APIResponse)
async def update_system_settings(
    req: AdminUpdateSettingsRequest,
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()

    await db.settings.update_one(
        {"type": "system"},
        {"$set": update_data},
        upsert=True,
    )

    settings_doc = await db.settings.find_one({"type": "system"})
    return {
        "success": True,
        "data": {
            "platformName": settings_doc.get("platformName", "RideTrack"),
            "supportEmail": settings_doc.get("supportEmail", "support@ridetrack.com"),
            "allowPublicRegistration": settings_doc.get("allowPublicRegistration", True),
            "allowEventCreation": settings_doc.get("allowEventCreation", True),
            "allowOrganizerRegistration": settings_doc.get("allowOrganizerRegistration", True),
            "offlineScanning": settings_doc.get("offlineScanning", True),
            "automaticSync": settings_doc.get("automaticSync", True),
            "platformNotifications": settings_doc.get("platformNotifications", True),
            "platformStatus": "Operational" if not settings_doc.get("maintenanceMode", False) else "Maintenance",
            "qrCodeGracePeriodHours": settings_doc.get("qrCodeGracePeriodHours", 48),
            "offlineSyncWindowHours": settings_doc.get("offlineSyncWindowHours", 72),
            "maintenanceMode": settings_doc.get("maintenanceMode", False),
            "updatedAt": settings_doc.get("updatedAt", ""),
        },
    }
