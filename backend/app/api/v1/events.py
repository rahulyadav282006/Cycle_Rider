import uuid
import re
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.api.deps import get_current_user, require_organizer
from backend.app.models.schemas import (
    EventCreateRequest,
    EventUpdateRequest,
    EventResponse,
    APIResponse,
    UserRole,
)

router = APIRouter(prefix="/events", tags=["Events"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text[:30]

@router.get("", response_model=APIResponse)
async def list_events(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    query = {}
    if current_user["role"] == UserRole.ORGANIZER.value:
        query["organizerId"] = current_user["id"]
    
    events_cursor = db.events.find(query).sort("createdAt", -1)
    events = await events_cursor.to_list(length=100)
    
    result = []
    for ev in events:
        ev_id = ev["id"]
        rider_cnt = await db.riders.count_documents({"eventId": ev_id})
        cp_cnt = await db.checkpoints.count_documents({"eventId": ev_id})
        vol_cnt = await db.volunteers.count_documents({"eventId": ev_id})
        
        result.append(EventResponse(
            id=ev["id"],
            eventName=ev["eventName"],
            description=ev.get("description", ""),
            location=ev["location"],
            rideDistance=float(ev.get("rideDistance", 0)),
            rideDate=ev["rideDate"],
            startTime=ev["startTime"],
            organizerId=ev["organizerId"],
            organizerName=ev.get("organizerName", "Organizer"),
            status=ev.get("status", "upcoming"),
            riderCount=rider_cnt,
            checkpointCount=cp_cnt,
            volunteerCount=vol_cnt,
            createdAt=ev.get("createdAt", ""),
            updatedAt=ev.get("updatedAt", ""),
        ).model_dump())
        
    return APIResponse(success=True, data=result)

@router.post("", response_model=APIResponse)
async def create_event(
    req: EventCreateRequest,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    now_str = datetime.now(timezone.utc).isoformat()
    slug = slugify(req.eventName) or "event"
    event_id = f"ev-{slug}-{uuid.uuid4().hex[:6]}"
    
    try:
        distance_val = float(req.rideDistance)
    except (ValueError, TypeError):
        distance_val = 0.0

    event_doc = {
        "id": event_id,
        "eventName": req.eventName.strip(),
        "description": req.description.strip() if req.description else "",
        "location": req.location.strip(),
        "rideDistance": distance_val,
        "rideDate": req.rideDate.strip(),
        "startTime": req.startTime.strip(),
        "organizerId": current_user["id"],
        "organizerName": current_user.get("name", req.organizerName or "RideTrack Organizer"),
        "status": req.status.value if hasattr(req.status, "value") else str(req.status),
        "createdAt": now_str,
        "updatedAt": now_str,
    }
    
    await db.events.insert_one(event_doc)
    
    event_res = EventResponse(
        id=event_id,
        eventName=event_doc["eventName"],
        description=event_doc["description"],
        location=event_doc["location"],
        rideDistance=event_doc["rideDistance"],
        rideDate=event_doc["rideDate"],
        startTime=event_doc["startTime"],
        organizerId=event_doc["organizerId"],
        organizerName=event_doc["organizerName"],
        status=event_doc["status"],
        riderCount=0,
        checkpointCount=0,
        volunteerCount=0,
        createdAt=now_str,
        updatedAt=now_str,
    )
    
    return APIResponse(success=True, data=event_res.model_dump())

@router.get("/{event_id}", response_model=APIResponse)
async def get_event(
    event_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    ev = await db.events.find_one({"id": event_id})
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "EVENT_NOT_FOUND", "message": f"Event '{event_id}' does not exist"},
        )
    
    # Organizer isolation: organizer can only view own event unless super admin
    if current_user["role"] == UserRole.ORGANIZER.value and ev["organizerId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Access to this event is restricted to its organizer"},
        )

    # Volunteer isolation: volunteer can only access assigned event
    if current_user["role"] == UserRole.VOLUNTEER.value:
        vol_assigned = await db.volunteers.find_one({
            "eventId": event_id,
            "$or": [
                {"userId": current_user["id"]},
                {"mobile": current_user.get("phone", "")},
                {"name": current_user.get("name", "")},
            ],
        })
        if not vol_assigned:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "Volunteer is not assigned to this event"},
            )
        
    rider_cnt = await db.riders.count_documents({"eventId": event_id})
    cp_cnt = await db.checkpoints.count_documents({"eventId": event_id})
    vol_cnt = await db.volunteers.count_documents({"eventId": event_id})
    
    event_res = EventResponse(
        id=ev["id"],
        eventName=ev["eventName"],
        description=ev.get("description", ""),
        location=ev["location"],
        rideDistance=float(ev.get("rideDistance", 0)),
        rideDate=ev["rideDate"],
        startTime=ev["startTime"],
        organizerId=ev["organizerId"],
        organizerName=ev.get("organizerName", "Organizer"),
        status=ev.get("status", "upcoming"),
        riderCount=rider_cnt,
        checkpointCount=cp_cnt,
        volunteerCount=vol_cnt,
        createdAt=ev.get("createdAt", ""),
        updatedAt=ev.get("updatedAt", ""),
    )
    
    return APIResponse(success=True, data=event_res.model_dump())

@router.put("/{event_id}", response_model=APIResponse)
async def update_event(
    event_id: str,
    req: EventUpdateRequest,
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
            detail={"code": "FORBIDDEN", "message": "Cannot modify another organizer's event"},
        )
        
    update_data = {}
    if req.eventName is not None:
        update_data["eventName"] = req.eventName.strip()
    if req.description is not None:
        update_data["description"] = req.description.strip()
    if req.location is not None:
        update_data["location"] = req.location.strip()
    if req.rideDistance is not None:
        try:
            update_data["rideDistance"] = float(req.rideDistance)
        except (ValueError, TypeError):
            pass
    if req.rideDate is not None:
        update_data["rideDate"] = req.rideDate.strip()
    if req.startTime is not None:
        update_data["startTime"] = req.startTime.strip()
    if req.organizerName is not None:
        update_data["organizerName"] = req.organizerName.strip()
    if req.status is not None:
        update_data["status"] = req.status.value if hasattr(req.status, "value") else str(req.status)
        
    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    await db.events.update_one({"id": event_id}, {"$set": update_data})
    updated_ev = await db.events.find_one({"id": event_id})
    
    rider_cnt = await db.riders.count_documents({"eventId": event_id})
    cp_cnt = await db.checkpoints.count_documents({"eventId": event_id})
    vol_cnt = await db.volunteers.count_documents({"eventId": event_id})
    
    event_res = EventResponse(
        id=updated_ev["id"],
        eventName=updated_ev["eventName"],
        description=updated_ev.get("description", ""),
        location=updated_ev["location"],
        rideDistance=float(updated_ev.get("rideDistance", 0)),
        rideDate=updated_ev["rideDate"],
        startTime=updated_ev["startTime"],
        organizerId=updated_ev["organizerId"],
        organizerName=updated_ev.get("organizerName", "Organizer"),
        status=updated_ev.get("status", "upcoming"),
        riderCount=rider_cnt,
        checkpointCount=cp_cnt,
        volunteerCount=vol_cnt,
        createdAt=updated_ev.get("createdAt", ""),
        updatedAt=updated_ev.get("updatedAt", ""),
    )
    return APIResponse(success=True, data=event_res.model_dump())

@router.delete("/{event_id}", response_model=APIResponse)
async def delete_event(
    event_id: str,
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
            detail={"code": "FORBIDDEN", "message": "Cannot delete another organizer's event"},
        )
        
    await db.events.delete_one({"id": event_id})
    await db.checkpoints.delete_many({"eventId": event_id})
    await db.riders.delete_many({"eventId": event_id})
    await db.volunteers.delete_many({"eventId": event_id})
    await db.scans.delete_many({"eventId": event_id})
    
    return APIResponse(success=True, data={"message": f"Event '{event_id}' deleted successfully"})
