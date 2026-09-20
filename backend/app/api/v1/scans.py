import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.api.deps import get_current_user
from backend.app.models.schemas import (
    ScanRecordRequest,
    ScanResponse,
    ScanValidateRequest,
    ScanValidateResponse,
    APIResponse,
    UserRole,
)

router = APIRouter(prefix="/scans", tags=["Scans"])

@router.post("/validate", response_model=APIResponse)
async def validate_scan(
    req: ScanValidateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Verify Event exists
    event = await db.events.find_one({"id": req.eventId})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "EVENT_NOT_FOUND", "message": f"Event '{req.eventId}' not found"},
        )

    # 2. Verify Checkpoint exists and belongs to Event
    checkpoint = await db.checkpoints.find_one({"id": req.checkpointId, "eventId": req.eventId})
    if not checkpoint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CHECKPOINT_NOT_FOUND", "message": "Checkpoint not found or does not belong to event"},
        )

    # 3. Volunteer authorization: volunteer can only scan at assigned event and checkpoint
    if current_user.get("role") == UserRole.VOLUNTEER.value:
        vol_assigned = await db.volunteers.find_one({
            "eventId": req.eventId,
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
        if vol_assigned.get("checkpointId") and vol_assigned["checkpointId"] != req.checkpointId:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "Volunteer is not assigned to scan at this checkpoint"},
            )

    # 4. Verify Rider exists and belongs to the same Event
    clean_rider_id = req.riderId.strip().upper()
    rider = await db.riders.find_one({
        "eventId": req.eventId,
        "$or": [{"riderId": clean_rider_id}, {"id": req.riderId.strip()}]
    })
    if not rider:
        # Check if rider exists in another event
        other_event_rider = await db.riders.find_one({
            "$or": [{"riderId": clean_rider_id}, {"id": req.riderId.strip()}]
        })
        if other_event_rider:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "WRONG_EVENT", "message": f"Rider '{clean_rider_id}' is registered for a different event"},
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RIDER_NOT_FOUND", "message": f"Rider '{clean_rider_id}' not found in event roster"},
        )

    # 5. Check duplicate scan for same rider and checkpoint
    duplicate_scan = await db.scans.find_one({
        "eventId": req.eventId,
        "checkpointId": req.checkpointId,
        "riderId": rider["riderId"],
    })
    if duplicate_scan:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "DUPLICATE_SCAN",
                "message": f"Rider {rider['name']} ({rider['riderId']}) was already scanned at {checkpoint['name']}",
                "scanId": duplicate_scan["id"],
                "scanTime": duplicate_scan.get("scanTime"),
                "riderName": rider["name"],
                "riderId": rider["riderId"],
            },
        )

    now_str = datetime.now(timezone.utc).isoformat()
    return APIResponse(
        success=True,
        data=ScanValidateResponse(
            riderId=rider["riderId"],
            riderName=rider["name"],
            jerseyNumber=str(rider.get("jerseyNumber", "101")),
            eventId=req.eventId,
            eventName=event["eventName"],
            checkpointId=req.checkpointId,
            checkpointName=checkpoint["name"],
            scanTime=now_str,
        ).model_dump(),
    )

@router.post("", response_model=APIResponse)
async def record_scan(
    req: ScanRecordRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Idempotency Check via clientScanId (crucial for offline-sync retry)
    existing_scan_by_client_id = await db.scans.find_one({"clientScanId": req.clientScanId})
    if existing_scan_by_client_id:
        # Already processed idempotently; return existing record
        rider = await db.riders.find_one({"riderId": existing_scan_by_client_id["riderId"]})
        event = await db.events.find_one({"id": existing_scan_by_client_id["eventId"]})
        cp = await db.checkpoints.find_one({"id": existing_scan_by_client_id["checkpointId"]})
        
        return APIResponse(
            success=True,
            data=ScanResponse(
                id=existing_scan_by_client_id["id"],
                clientScanId=existing_scan_by_client_id["clientScanId"],
                riderId=existing_scan_by_client_id["riderId"],
                riderName=rider["name"] if rider else "Rider",
                jerseyNumber=rider.get("jerseyNumber", "101") if rider else "101",
                eventId=existing_scan_by_client_id["eventId"],
                eventName=event["eventName"] if event else "Event",
                checkpointId=existing_scan_by_client_id["checkpointId"],
                checkpointName=cp["name"] if cp else "Checkpoint",
                volunteerId=existing_scan_by_client_id["volunteerId"],
                scanTime=existing_scan_by_client_id["scanTime"],
                status="Recorded",
                checkpointLatitude=cp.get("latitude") if cp else None,
                checkpointLongitude=cp.get("longitude") if cp else None,
                deviceLatitude=existing_scan_by_client_id.get("deviceLatitude"),
                deviceLongitude=existing_scan_by_client_id.get("deviceLongitude"),
                createdAt=existing_scan_by_client_id["createdAt"],
            ).model_dump(),
        )

    # 2. Verify Event exists
    event = await db.events.find_one({"id": req.eventId})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "EVENT_NOT_FOUND", "message": f"Event '{req.eventId}' not found"},
        )

    # 3. Verify Checkpoint exists and belongs to Event
    checkpoint = await db.checkpoints.find_one({"id": req.checkpointId, "eventId": req.eventId})
    if not checkpoint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CHECKPOINT_NOT_FOUND", "message": "Checkpoint not found or does not belong to event"},
        )

    # 3b. Volunteer authorization: volunteer can only scan at assigned event and checkpoint
    if current_user.get("role") == UserRole.VOLUNTEER.value:
        vol_assigned = await db.volunteers.find_one({
            "eventId": req.eventId,
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
        if vol_assigned.get("checkpointId") and vol_assigned["checkpointId"] != req.checkpointId:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "Volunteer is not assigned to scan at this checkpoint"},
            )

    # 4. Verify Rider exists and belongs to the same Event
    # Match by riderId or id
    clean_rider_id = req.riderId.strip().upper()
    rider = await db.riders.find_one({
        "eventId": req.eventId,
        "$or": [{"riderId": clean_rider_id}, {"id": req.riderId.strip()}]
    })
    if not rider:
        # Check if rider exists in another event
        other_event_rider = await db.riders.find_one({
            "$or": [{"riderId": clean_rider_id}, {"id": req.riderId.strip()}]
        })
        if other_event_rider:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "WRONG_EVENT", "message": f"Rider '{clean_rider_id}' is registered for a different event"},
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RIDER_NOT_FOUND", "message": f"Rider '{clean_rider_id}' not found in event roster"},
        )

    # 5. Check duplicate scan for same rider and checkpoint
    duplicate_scan = await db.scans.find_one({
        "eventId": req.eventId,
        "checkpointId": req.checkpointId,
        "riderId": rider["riderId"],
    })
    if duplicate_scan:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "DUPLICATE_SCAN",
                "message": f"Rider {rider['name']} ({rider['riderId']}) was already scanned at {checkpoint['name']} at {duplicate_scan.get('scanTime', duplicate_scan.get('createdAt'))}",
                "scanId": duplicate_scan["id"],
                "scanTime": duplicate_scan.get("scanTime"),
            },
        )

    # 6. Record Scan
    now_str = datetime.now(timezone.utc).isoformat()
    scan_time = req.scanTime if req.scanTime else now_str
    scan_id = f"scn-{uuid.uuid4().hex[:10]}"

    scan_doc = {
        "id": scan_id,
        "clientScanId": req.clientScanId,
        "riderId": rider["riderId"],
        "eventId": req.eventId,
        "checkpointId": req.checkpointId,
        "volunteerId": current_user["id"],
        "scanTime": scan_time,
        "checkpointLatitude": checkpoint.get("latitude"),
        "checkpointLongitude": checkpoint.get("longitude"),
        "deviceLatitude": req.deviceLatitude,
        "deviceLongitude": req.deviceLongitude,
        "status": "Recorded",
        "createdAt": now_str,
    }

    await db.scans.insert_one(scan_doc)

    # Update rider status dynamically based on checkpoint sequence
    total_checkpoints = await db.checkpoints.count_documents({"eventId": req.eventId})
    if checkpoint.get("sequenceNumber") == total_checkpoints or "Home Safe" in checkpoint["name"]:
        await db.riders.update_one({"id": rider["id"]}, {"$set": {"status": "Finished", "homeSafe": True}})
    elif rider.get("status") == "Registered":
        await db.riders.update_one({"id": rider["id"]}, {"$set": {"status": "Active"}})

    res = ScanResponse(
        id=scan_id,
        clientScanId=req.clientScanId,
        riderId=rider["riderId"],
        riderName=rider["name"],
        jerseyNumber=str(rider.get("jerseyNumber", "101")),
        eventId=req.eventId,
        eventName=event["eventName"],
        checkpointId=req.checkpointId,
        checkpointName=checkpoint["name"],
        volunteerId=current_user["id"],
        scanTime=scan_time,
        status="Recorded",
        checkpointLatitude=checkpoint.get("latitude"),
        checkpointLongitude=checkpoint.get("longitude"),
        deviceLatitude=req.deviceLatitude,
        deviceLongitude=req.deviceLongitude,
        createdAt=now_str,
    )
    return APIResponse(success=True, data=res.model_dump())
