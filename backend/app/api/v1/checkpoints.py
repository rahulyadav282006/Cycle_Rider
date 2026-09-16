import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.api.deps import get_current_user, require_organizer
from backend.app.models.schemas import (
    CheckpointCreateRequest,
    CheckpointUpdateRequest,
    CheckpointResponse,
    APIResponse,
    UserRole,
)

router = APIRouter(tags=["Checkpoints"])

@router.get("/events/{event_id}/checkpoints", response_model=APIResponse)
async def list_checkpoints(
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
        
    cursor = db.checkpoints.find({"eventId": event_id}).sort("sequenceNumber", 1)
    cps = await cursor.to_list(length=100)
    
    result = [
        CheckpointResponse(
            id=cp["id"],
            eventId=cp["eventId"],
            name=cp["name"],
            type=cp.get("type", "Standard"),
            sequenceNumber=cp["sequenceNumber"],
            mandatory=cp.get("mandatory", True),
            createdAt=cp.get("createdAt", ""),
            updatedAt=cp.get("updatedAt", ""),
        ).model_dump()
        for cp in cps
    ]
    return APIResponse(success=True, data=result)

@router.post("/events/{event_id}/checkpoints", response_model=APIResponse)
async def create_checkpoint(
    event_id: str,
    req: CheckpointCreateRequest,
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
            detail={"code": "FORBIDDEN", "message": "Cannot add checkpoint to another organizer's event"},
        )
        
    now_str = datetime.now(timezone.utc).isoformat()
    cp_id = f"cp-{uuid.uuid4().hex[:8]}"
    
    cp_doc = {
        "id": cp_id,
        "eventId": event_id,
        "name": req.name.strip(),
        "type": req.type.strip() if req.type else "Standard",
        "sequenceNumber": req.sequenceNumber,
        "mandatory": req.mandatory,
        "createdAt": now_str,
        "updatedAt": now_str,
    }
    
    await db.checkpoints.insert_one(cp_doc)
    
    res = CheckpointResponse(
        id=cp_id,
        eventId=event_id,
        name=cp_doc["name"],
        type=cp_doc["type"],
        sequenceNumber=cp_doc["sequenceNumber"],
        mandatory=cp_doc["mandatory"],
        createdAt=now_str,
        updatedAt=now_str,
    )
    return APIResponse(success=True, data=res.model_dump())

@router.put("/checkpoints/{checkpoint_id}", response_model=APIResponse)
async def update_checkpoint(
    checkpoint_id: str,
    req: CheckpointUpdateRequest,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    cp = await db.checkpoints.find_one({"id": checkpoint_id})
    if not cp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CHECKPOINT_NOT_FOUND", "message": "Checkpoint not found"},
        )
        
    ev = await db.events.find_one({"id": cp["eventId"]})
    if current_user["role"] == UserRole.ORGANIZER.value and ev and ev["organizerId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Cannot modify checkpoint of another organizer's event"},
        )
        
    update_data = {}
    if req.name is not None:
        update_data["name"] = req.name.strip()
    if req.type is not None:
        update_data["type"] = req.type.strip()
    if req.sequenceNumber is not None:
        update_data["sequenceNumber"] = req.sequenceNumber
    if req.mandatory is not None:
        update_data["mandatory"] = req.mandatory
    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    await db.checkpoints.update_one({"id": checkpoint_id}, {"$set": update_data})
    updated_cp = await db.checkpoints.find_one({"id": checkpoint_id})
    
    res = CheckpointResponse(
        id=updated_cp["id"],
        eventId=updated_cp["eventId"],
        name=updated_cp["name"],
        type=updated_cp["type"],
        sequenceNumber=updated_cp["sequenceNumber"],
        mandatory=updated_cp["mandatory"],
        createdAt=updated_cp.get("createdAt", ""),
        updatedAt=updated_cp.get("updatedAt", ""),
    )
    return APIResponse(success=True, data=res.model_dump())

@router.delete("/checkpoints/{checkpoint_id}", response_model=APIResponse)
async def delete_checkpoint(
    checkpoint_id: str,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    cp = await db.checkpoints.find_one({"id": checkpoint_id})
    if not cp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CHECKPOINT_NOT_FOUND", "message": "Checkpoint not found"},
        )
    ev = await db.events.find_one({"id": cp["eventId"]})
    if current_user["role"] == UserRole.ORGANIZER.value and ev and ev["organizerId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Cannot delete checkpoint of another organizer's event"},
        )
        
    await db.checkpoints.delete_one({"id": checkpoint_id})
    return APIResponse(success=True, data={"message": "Checkpoint deleted successfully"})
