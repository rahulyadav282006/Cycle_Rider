import re
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.core.security import get_password_hash
from backend.app.api.deps import get_current_user, require_organizer
from backend.app.models.schemas import (
    VolunteerCreateRequest,
    VolunteerUpdateRequest,
    VolunteerResponse,
    APIResponse,
    UserRole,
)

router = APIRouter(tags=["Volunteers"])

@router.get("/events/{event_id}/volunteers", response_model=APIResponse)
async def list_volunteers(
    event_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    ev = await db.events.find_one({"id": event_id})
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "EVENT_NOT_FOUND", "message": "Event not found"},
        )
        
    cursor = db.volunteers.find({"eventId": event_id}).sort("createdAt", -1)
    vols = await cursor.to_list(length=200)
    
    result = []
    for v in vols:
        cp_name = v.get("checkpointName")
        if not cp_name and v.get("checkpointId"):
            cp = await db.checkpoints.find_one({"id": v["checkpointId"]})
            if cp:
                cp_name = cp.get("name")
            else:
                cp = await db.checkpoints.find_one({"name": v["checkpointId"], "eventId": event_id})
                if cp:
                    cp_name = cp.get("name")
                else:
                    cp_name = v.get("checkpointId")
        if not cp_name and v.get("status") == "Assigned":
            cp_name = "Start"
                
        vol_email = v.get("email")
        if not vol_email and v.get("userId"):
            u_doc = await db.users.find_one({"id": v["userId"]})
            if u_doc:
                vol_email = u_doc.get("email")

        result.append(VolunteerResponse(
            id=v["id"],
            userId=v.get("userId"),
            eventId=v["eventId"],
            checkpointId=v.get("checkpointId"),
            checkpointName=cp_name,
            name=v["name"],
            mobile=v["mobile"],
            email=vol_email,
            status=v.get("status", "Assigned"),
            createdAt=v.get("createdAt", ""),
            updatedAt=v.get("updatedAt", ""),
        ).model_dump())
        
    return APIResponse(success=True, data=result)

@router.post("/events/{event_id}/volunteers", response_model=APIResponse)
async def create_volunteer(
    event_id: str,
    req: VolunteerCreateRequest,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    ev = await db.events.find_one({"id": event_id})
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "EVENT_NOT_FOUND", "message": "Event not found"},
        )
    if current_user["role"] == UserRole.ORGANIZER.value and ev["organizerId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Cannot assign volunteer to another organizer's event"},
        )
        
    now_str = datetime.now(timezone.utc).isoformat()
    vol_id = f"vol-{uuid.uuid4().hex[:8]}"
    
    cp_name = req.checkpointName
    if req.checkpointId:
        cp = await db.checkpoints.find_one({"id": req.checkpointId})
        if cp:
            cp_name = cp.get("name")
        elif not cp_name:
            cp_name = req.checkpointId

    resolved_cp_id = cp["id"] if cp else req.checkpointId

    vol_doc = {
        "id": vol_id,
        "eventId": event_id,
        "checkpointId": resolved_cp_id,
        "checkpointName": cp_name,
        "name": req.name.strip(),
        "mobile": req.mobile.strip(),
        "status": req.status,
        "createdAt": now_str,
        "updatedAt": now_str,
    }
    
    clean_email = req.email.strip().lower() if req.email else None
    if clean_email:
        existing_u = await db.users.find_one({"email": clean_email})
        if existing_u:
            vol_doc["userId"] = existing_u["id"]
            vol_doc["email"] = clean_email
            if req.password:
                await db.users.update_one({"id": existing_u["id"]}, {"": {"hashedPassword": get_password_hash(req.password.strip())}})
        else:
            new_uid = f"usr-{uuid.uuid4().hex[:12]}"
            pwd = req.password.strip() if req.password else "volunteer500"
            await db.users.insert_one({
                "id": new_uid,
                "email": clean_email,
                "name": req.name.strip(),
                "role": UserRole.VOLUNTEER.value,
                "organizationName": ev.get("eventName", "RideTrack"),
                "phone": req.mobile.strip(),
                "hashedPassword": get_password_hash(pwd),
                "status": "Active",
                "createdAt": now_str,
                "updatedAt": now_str,
            })
            vol_doc["userId"] = new_uid
            vol_doc["email"] = clean_email
    else:
        # Auto-link to existing volunteer user account by phone or name
        vol_user = await db.users.find_one({
            "role": UserRole.VOLUNTEER.value,
            "": [
                {"name": {"": f"^{re.escape(req.name.strip().split()[0])}", "": "i"}},
                {"phone": {"": re.escape(req.mobile.strip().replace(" ", "").replace("+91", ""))}},
            ]
        })
        if not vol_user:
            vol_user = await db.users.find_one({"role": UserRole.VOLUNTEER.value})
        if vol_user:
            vol_doc["userId"] = vol_user["id"]
            vol_doc["email"] = vol_user.get("email")

    await db.volunteers.insert_one(vol_doc)
    
    res = VolunteerResponse(
        id=vol_id,
        userId=vol_doc.get("userId"),
        eventId=event_id,
        checkpointId=resolved_cp_id,
        checkpointName=cp_name,
        name=vol_doc["name"],
        mobile=vol_doc["mobile"],
        email=vol_doc.get("email"),
        status=vol_doc["status"],
        createdAt=now_str,
        updatedAt=now_str,
    )
    return APIResponse(success=True, data=res.model_dump())

@router.put("/volunteers/{volunteer_id}", response_model=APIResponse)
async def update_volunteer(
    volunteer_id: str,
    req: VolunteerUpdateRequest,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    v = await db.volunteers.find_one({"id": volunteer_id})
    if not v:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "VOLUNTEER_NOT_FOUND", "message": "Volunteer not found"},
        )
        
    update_data = {}
    if req.name is not None:
        update_data["name"] = req.name.strip()
    if req.mobile is not None:
        update_data["mobile"] = req.mobile.strip()
    if req.checkpointId is not None:
        update_data["checkpointId"] = req.checkpointId
    if req.checkpointName is not None:
        update_data["checkpointName"] = req.checkpointName
    if req.status is not None:
        update_data["status"] = req.status
    if req.email is not None:
        clean_email = req.email.strip().lower()
        update_data["email"] = clean_email
        existing_u = await db.users.find_one({"email": clean_email})
        if existing_u:
            update_data["userId"] = existing_u["id"]
            if req.password:
                await db.users.update_one({"id": existing_u["id"]}, {"": {"hashedPassword": get_password_hash(req.password.strip())}})
        else:
            new_uid = f"usr-{uuid.uuid4().hex[:12]}"
            pwd = req.password.strip() if req.password else "volunteer500"
            await db.users.insert_one({
                "id": new_uid,
                "email": clean_email,
                "name": req.name.strip() if req.name else v.get("name", "Volunteer"),
                "role": UserRole.VOLUNTEER.value,
                "organizationName": "RideTrack",
                "phone": req.mobile.strip() if req.mobile else v.get("mobile", ""),
                "hashedPassword": get_password_hash(pwd),
                "status": "Active",
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "updatedAt": datetime.now(timezone.utc).isoformat(),
            })
            update_data["userId"] = new_uid
    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    await db.volunteers.update_one({"id": volunteer_id}, {"": update_data})
    updated = await db.volunteers.find_one({"id": volunteer_id})
    
    cp_name = updated.get("checkpointName")
    if not cp_name and updated.get("checkpointId"):
        cp = await db.checkpoints.find_one({"id": updated["checkpointId"]})
        if cp:
            cp_name = cp.get("name")
        else:
            cp_name = updated.get("checkpointId")
            
    res = VolunteerResponse(
        id=updated["id"],
        userId=updated.get("userId"),
        eventId=updated["eventId"],
        checkpointId=updated.get("checkpointId"),
        checkpointName=cp_name,
        name=updated["name"],
        mobile=updated["mobile"],
        email=updated.get("email"),
        status=updated.get("status", "Assigned"),
        createdAt=updated.get("createdAt", ""),
        updatedAt=updated.get("updatedAt", ""),
    )
    return APIResponse(success=True, data=res.model_dump())

@router.delete("/volunteers/{volunteer_id}", response_model=APIResponse)
async def delete_volunteer(
    volunteer_id: str,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    v = await db.volunteers.find_one({"id": volunteer_id})
    if not v:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "VOLUNTEER_NOT_FOUND", "message": "Volunteer not found"},
        )
    await db.volunteers.delete_one({"id": volunteer_id})
    return APIResponse(success=True, data={"message": "Volunteer removed successfully"})

@router.get("/volunteers/me", response_model=APIResponse)
async def get_volunteer_assignment(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # Find assignment by userId, phone, or name, SORTED BY LATEST CREATED (DESCENDING)
    query_or = [
        {"userId": current_user["id"]},
        {"mobile": current_user.get("phone", "")},
        {"name": current_user.get("name", "")},
    ]
    if current_user.get("phone"):
        clean_p = current_user.get("phone", "").replace(" ", "").replace("+91", "")
        if clean_p:
            query_or.append({"mobile": {"$regex": re.escape(clean_p)}})
    if current_user.get("name"):
        first_n = current_user.get("name", "").split()[0]
        if first_n:
            query_or.append({"name": {"$regex": f"^{re.escape(first_n)}", "$options": "i"}})

    cursor = db.volunteers.find({"$or": query_or}).sort("createdAt", -1)
    vols = await cursor.to_list(length=20)
    
    # Prioritize volunteer assignment for an active or upcoming event
    vol = None
    for v in vols:
        ev = await db.events.find_one({"id": v.get("eventId")})
        if ev and ev.get("status") in ["active", "upcoming"]:
            vol = v
            break
    if not vol and vols:
        vol = vols[0]

    # Fallback to the latest volunteer record in the entire database if logged in as volunteer role
    if not vol and current_user["role"] in [UserRole.VOLUNTEER.value, "VOLUNTEER"]:
        cursor = db.volunteers.find({"checkpointId": {"$ne": None}}).sort("createdAt", -1)
        fallback_vols = await cursor.to_list(length=1)
        vol = fallback_vols[0] if fallback_vols else None
        
    if not vol:
        return APIResponse(success=True, data=None)
        
    event = await db.events.find_one({"id": vol["eventId"]})
    cp = None
    if vol.get("checkpointId"):
        cp = await db.checkpoints.find_one({"id": vol["checkpointId"]})
        if not cp and vol.get("eventId"):
            cp = await db.checkpoints.find_one({"name": vol["checkpointId"], "eventId": vol["eventId"]})
    if not cp and vol.get("eventId"):
        cp = await db.checkpoints.find_one({"eventId": vol["eventId"]})
    
    data = {
        "volunteer": {
            "id": vol["id"],
            "name": vol["name"],
            "mobile": vol["mobile"],
            "status": vol.get("status", "Assigned"),
        },
        "event": {
            "id": event["id"],
            "name": event["eventName"],
            "eventName": event["eventName"],
            "date": event.get("rideDate", ""),
            "location": event.get("location", ""),
        } if event else None,
        "checkpoint": {
            "id": cp["id"],
            "name": cp["name"],
            "type": cp.get("type", "Standard"),
            "sequenceNumber": cp.get("sequenceNumber", 1),
            "mandatory": cp.get("mandatory", True),
        } if cp else None,
        "assignment": {
            "id": vol["id"],
            "name": vol["name"],
            "mobile": vol["mobile"],
            "status": vol.get("status", "Assigned"),
            "assignedAt": vol.get("createdAt"),
        },
    }
    return APIResponse(success=True, data=data)
