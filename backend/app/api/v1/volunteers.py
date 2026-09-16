import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
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
                
        result.append(VolunteerResponse(
            id=v["id"],
            userId=v.get("userId"),
            eventId=v["eventId"],
            checkpointId=v.get("checkpointId"),
            checkpointName=cp_name,
            name=v["name"],
            mobile=v["mobile"],
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

    vol_doc = {
        "id": vol_id,
        "eventId": event_id,
        "checkpointId": req.checkpointId,
        "checkpointName": cp_name,
        "name": req.name.strip(),
        "mobile": req.mobile.strip(),
        "status": req.status,
        "createdAt": now_str,
        "updatedAt": now_str,
    }
    
    await db.volunteers.insert_one(vol_doc)
    
    res = VolunteerResponse(
        id=vol_id,
        eventId=event_id,
        checkpointId=req.checkpointId,
        checkpointName=cp_name,
        name=vol_doc["name"],
        mobile=vol_doc["mobile"],
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
    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    await db.volunteers.update_one({"id": volunteer_id}, {"$set": update_data})
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
    # Find assignment by userId or user email/mobile/name
    vol = await db.volunteers.find_one({
        "$or": [
            {"userId": current_user["id"]},
            {"mobile": current_user.get("phone", "")},
            {"name": current_user.get("name", "")},
        ]
    })
    
    # Fallback to the latest volunteer record if logged in as volunteer role
    if not vol and current_user["role"] in [UserRole.VOLUNTEER.value, "VOLUNTEER"]:
        vol = await db.volunteers.find_one({"checkpointId": {"$ne": None}})
        
    if not vol:
        return APIResponse(success=True, data=None)
        
    event = await db.events.find_one({"id": vol["eventId"]})
    cp = await db.checkpoints.find_one({"id": vol.get("checkpointId")}) if vol.get("checkpointId") else None
    
    data = {
        "volunteer": {
            "id": vol["id"],
            "name": vol["name"],
            "mobile": vol["mobile"],
            "status": vol["status"],
        },
        "event": {
            "id": event["id"],
            "name": event["eventName"],
            "date": event["rideDate"],
            "location": event["location"],
        } if event else None,
        "checkpoint": {
            "id": cp["id"],
            "name": cp["name"],
            "type": cp.get("type", "Standard"),
            "sequenceNumber": cp["sequenceNumber"],
            "mandatory": cp.get("mandatory", True),
        } if cp else None,
    }
    return APIResponse(success=True, data=data)
