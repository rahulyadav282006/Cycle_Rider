import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.api.deps import get_current_user, require_organizer
from backend.app.models.schemas import (
    RiderCreateRequest,
    RiderUpdateRequest,
    RiderPaymentUpdateRequest,
    RiderResponse,
    APIResponse,
    UserRole,
)

router = APIRouter(tags=["Riders"])

async def generate_next_rider_id(event_id: str, db: AsyncIOMotorDatabase) -> str:
    count = await db.riders.count_documents({})
    next_num = count + 1
    # Check for collisions across all riders
    while True:
        cand = f"RT-{next_num:04d}"
        exists = await db.riders.find_one({"riderId": cand})
        if not exists:
            return cand
        next_num += 1

@router.get("/events/{event_id}/riders", response_model=APIResponse)
async def list_riders(
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
        
    cursor = db.riders.find({"eventId": event_id}).sort("createdAt", -1)
    riders = await cursor.to_list(length=500)
    
    ev_payment_required = bool(ev.get("paymentRequired") or ev.get("payment_required", False))
    result = []
    for r in riders:
        p_status = r.get("paymentStatus", r.get("payment_status", "pending" if ev_payment_required else "verified"))
        result.append(RiderResponse(
            id=r["id"],
            riderId=r["riderId"],
            eventId=r["eventId"],
            name=r["name"],
            mobile=r["mobile"],
            emergencyContact=r["emergencyContact"],
            bloodGroup=r.get("bloodGroup", "O+"),
            age=r.get("age"),
            gender=r.get("gender", "Male"),
            club=r.get("club", "Independent"),
            bicycleType=r.get("bicycleType", "Road Bike"),
            jerseyNumber=str(r.get("jerseyNumber", "101")),
            medicalNotes=r.get("medicalNotes", "None reported"),
            qrCodeValue=r.get("qrCodeValue", r["riderId"]),
            status=r.get("status", "Registered"),
            paymentStatus=p_status,
            paymentRequired=ev_payment_required,
            createdAt=r.get("createdAt", ""),
            updatedAt=r.get("updatedAt", ""),
            timeline=[],
        ).model_dump())
        
    return APIResponse(success=True, data=result)

@router.post("/events/{event_id}/riders", response_model=APIResponse)
async def register_rider(
    event_id: str,
    req: RiderCreateRequest,
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
            detail={"code": "FORBIDDEN", "message": "Cannot register rider for another organizer's event"},
        )
        
    now_str = datetime.now(timezone.utc).isoformat()
    doc_id = f"rdr-{uuid.uuid4().hex[:10]}"
    stable_rider_id = await generate_next_rider_id(event_id, db)
    
    # QR code contains ONLY the stable Rider ID as per rule 5
    qr_value = stable_rider_id
    
    is_payment_required = bool(ev.get("paymentRequired") or ev.get("payment_required", False))
    initial_payment_status = "pending" if is_payment_required else "verified"
    if req.paymentStatus:
        initial_payment_status = req.paymentStatus.strip().lower()
    
    rider_doc = {
        "id": doc_id,
        "riderId": stable_rider_id,
        "eventId": event_id,
        "name": req.name.strip(),
        "mobile": req.mobile.strip(),
        "emergencyContact": req.emergencyContact.strip(),
        "bloodGroup": req.bloodGroup.strip() if req.bloodGroup else "O+",
        "age": req.age,
        "gender": req.gender.strip() if req.gender else "Male",
        "club": req.club.strip() if req.club else "Independent",
        "bicycleType": req.bicycleType.strip() if req.bicycleType else "Road Bike",
        "jerseyNumber": str(req.jerseyNumber) if req.jerseyNumber else "101",
        "medicalNotes": req.medicalNotes.strip() if req.medicalNotes else "None reported",
        "qrCodeValue": qr_value,
        "status": "Registered",
        "paymentStatus": initial_payment_status,
        "payment_status": initial_payment_status,
        "createdAt": now_str,
        "updatedAt": now_str,
    }
    
    await db.riders.insert_one(rider_doc)
    
    res = RiderResponse(
        id=doc_id,
        riderId=stable_rider_id,
        eventId=event_id,
        name=rider_doc["name"],
        mobile=rider_doc["mobile"],
        emergencyContact=rider_doc["emergencyContact"],
        bloodGroup=rider_doc["bloodGroup"],
        age=rider_doc["age"],
        gender=rider_doc["gender"],
        club=rider_doc["club"],
        bicycleType=rider_doc["bicycleType"],
        jerseyNumber=rider_doc["jerseyNumber"],
        medicalNotes=rider_doc["medicalNotes"],
        qrCodeValue=qr_value,
        status="Registered",
        paymentStatus=initial_payment_status,
        paymentRequired=is_payment_required,
        createdAt=now_str,
        updatedAt=now_str,
        timeline=[],
    )
    return APIResponse(success=True, data=res.model_dump())

@router.get("/riders/{rider_id}", response_model=APIResponse)
async def get_rider_profile(
    rider_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # Match by internal id or stable riderId
    r = await db.riders.find_one({
        "$or": [{"id": rider_id}, {"id": rider_id.lower()}, {"riderId": rider_id.upper()}, {"riderId": rider_id}]
    }, sort=[("createdAt", -1)])
    if not r:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RIDER_NOT_FOUND", "message": f"Rider '{rider_id}' not found"},
        )
        
    # Build real checkpoint progression timeline from database
    checkpoints = await db.checkpoints.find({"eventId": r["eventId"]}).sort("sequenceNumber", 1).to_list(100)
    scans = await db.scans.find({"riderId": r["riderId"]}).sort("scanTime", 1).to_list(200)
    scans_by_cp = {s["checkpointId"]: s for s in scans}

    timeline = []
    has_current = False
    for cp in checkpoints:
        s = scans_by_cp.get(cp["id"])
        if s:
            status_val = "Completed"
            time_val = s.get("scanTime", s.get("createdAt", ""))
        else:
            if not has_current and r.get("status") in ["Active", "In-Transit", "Started"]:
                status_val = "Current"
                has_current = True
            else:
                status_val = "Pending"
            time_val = None

        timeline.append({
            "sequence": f"{cp.get('sequenceNumber', len(timeline) + 1):02d}",
            "checkpointId": cp["id"],
            "name": cp["name"],
            "type": cp.get("type", "Checkpoint"),
            "status": status_val,
            "time": time_val,
        })

        
    ev = await db.events.find_one({"id": r["eventId"]})
    ev_payment_required = bool(ev.get("paymentRequired") or ev.get("payment_required", False)) if ev else False
    p_status = r.get("paymentStatus", r.get("payment_status", "pending" if ev_payment_required else "verified"))
    
    res = RiderResponse(
        id=r["id"],
        riderId=r["riderId"],
        eventId=r["eventId"],
        name=r["name"],
        mobile=r["mobile"],
        emergencyContact=r["emergencyContact"],
        bloodGroup=r.get("bloodGroup", "O+"),
        age=r.get("age"),
        gender=r.get("gender", "Male"),
        club=r.get("club", "Independent"),
        bicycleType=r.get("bicycleType", "Road Bike"),
        jerseyNumber=str(r.get("jerseyNumber", "101")),
        medicalNotes=r.get("medicalNotes", "None reported"),
        qrCodeValue=r.get("qrCodeValue", r["riderId"]),
        status=r.get("status", "Registered"),
        paymentStatus=p_status,
        paymentRequired=ev_payment_required,
        createdAt=r.get("createdAt", ""),
        updatedAt=r.get("updatedAt", ""),
        timeline=timeline,
    )
    return APIResponse(success=True, data=res.model_dump())

@router.put("/riders/{rider_id}", response_model=APIResponse)
async def update_rider(
    rider_id: str,
    req: RiderUpdateRequest,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    r = await db.riders.find_one({
        "$or": [{"id": rider_id}, {"id": rider_id.lower()}, {"riderId": rider_id.upper()}, {"riderId": rider_id}]
    }, sort=[("createdAt", -1)])
    if not r:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RIDER_NOT_FOUND", "message": "Rider not found"},
        )
        
    update_data = {}
    if req.name is not None:
        update_data["name"] = req.name.strip()
    if req.mobile is not None:
        update_data["mobile"] = req.mobile.strip()
    if req.emergencyContact is not None:
        update_data["emergencyContact"] = req.emergencyContact.strip()
    if req.bloodGroup is not None:
        update_data["bloodGroup"] = req.bloodGroup.strip()
    if req.age is not None:
        update_data["age"] = req.age
    if req.gender is not None:
        update_data["gender"] = req.gender.strip()
    if req.club is not None:
        update_data["club"] = req.club.strip()
    if req.bicycleType is not None:
        update_data["bicycleType"] = req.bicycleType.strip()
    if req.jerseyNumber is not None:
        update_data["jerseyNumber"] = str(req.jerseyNumber)
    if req.medicalNotes is not None:
        update_data["medicalNotes"] = req.medicalNotes.strip()
    if req.status is not None:
        update_data["status"] = req.status.strip()
    if req.paymentStatus is not None:
        update_data["paymentStatus"] = req.paymentStatus.strip().lower()
        update_data["payment_status"] = req.paymentStatus.strip().lower()
    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    await db.riders.update_one({"id": r["id"]}, {"$set": update_data})
    updated = await db.riders.find_one({"id": r["id"]})
    
    ev = await db.events.find_one({"id": updated["eventId"]})
    ev_payment_required = bool(ev.get("paymentRequired") or ev.get("payment_required", False)) if ev else False
    p_status = updated.get("paymentStatus", updated.get("payment_status", "pending" if ev_payment_required else "verified"))
    
    res = RiderResponse(
        id=updated["id"],
        riderId=updated["riderId"],
        eventId=updated["eventId"],
        name=updated["name"],
        mobile=updated["mobile"],
        emergencyContact=updated["emergencyContact"],
        bloodGroup=updated.get("bloodGroup", "O+"),
        age=updated.get("age"),
        gender=updated.get("gender", "Male"),
        club=updated.get("club", "Independent"),
        bicycleType=updated.get("bicycleType", "Road Bike"),
        jerseyNumber=str(updated.get("jerseyNumber", "101")),
        medicalNotes=updated.get("medicalNotes", "None reported"),
        qrCodeValue=updated.get("qrCodeValue", updated["riderId"]),
        status=updated.get("status", "Registered"),
        paymentStatus=p_status,
        paymentRequired=ev_payment_required,
        createdAt=updated.get("createdAt", ""),
        updatedAt=updated.get("updatedAt", ""),
        timeline=[],
    )
    return APIResponse(success=True, data=res.model_dump())

@router.patch("/riders/{rider_id}/payment", response_model=APIResponse)
async def update_rider_payment_status(
    rider_id: str,
    req: RiderPaymentUpdateRequest,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    r = await db.riders.find_one({
        "$or": [{"id": rider_id}, {"id": rider_id.lower()}, {"riderId": rider_id.upper()}, {"riderId": rider_id}]
    }, sort=[("createdAt", -1)])
    if not r:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RIDER_NOT_FOUND", "message": "Rider not found"},
        )
        
    status_val = req.paymentStatus.strip().lower()
    norm_status = "verified" if "veri" in status_val or "paid" in status_val else "pending"
    now_str = datetime.now(timezone.utc).isoformat()
    
    await db.riders.update_one(
        {"id": r["id"]},
        {"$set": {"paymentStatus": norm_status, "payment_status": norm_status, "updatedAt": now_str}}
    )
    updated = await db.riders.find_one({"id": r["id"]})
    ev = await db.events.find_one({"id": updated["eventId"]})
    ev_payment_required = bool(ev.get("paymentRequired") or ev.get("payment_required", False)) if ev else False
    
    res = RiderResponse(
        id=updated["id"],
        riderId=updated["riderId"],
        eventId=updated["eventId"],
        name=updated["name"],
        mobile=updated["mobile"],
        emergencyContact=updated["emergencyContact"],
        bloodGroup=updated.get("bloodGroup", "O+"),
        age=updated.get("age"),
        gender=updated.get("gender", "Male"),
        club=updated.get("club", "Independent"),
        bicycleType=updated.get("bicycleType", "Road Bike"),
        jerseyNumber=str(updated.get("jerseyNumber", "101")),
        medicalNotes=updated.get("medicalNotes", "None reported"),
        qrCodeValue=updated.get("qrCodeValue", updated["riderId"]),
        status=updated.get("status", "Registered"),
        paymentStatus=norm_status,
        paymentRequired=ev_payment_required,
        createdAt=updated.get("createdAt", ""),
        updatedAt=updated.get("updatedAt", ""),
        timeline=[],
    )
    return APIResponse(success=True, data=res.model_dump())

@router.delete("/riders/{rider_id}", response_model=APIResponse)
async def delete_rider(
    rider_id: str,
    current_user: dict = Depends(require_organizer),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    r = await db.riders.find_one({
        "$or": [{"id": rider_id}, {"id": rider_id.lower()}, {"riderId": rider_id.upper()}, {"riderId": rider_id}]
    }, sort=[("createdAt", -1)])
    if not r:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RIDER_NOT_FOUND", "message": "Rider not found"},
        )
    await db.riders.delete_one({"id": r["id"]})
    await db.scans.delete_many({"riderId": r["riderId"]})
    return APIResponse(success=True, data={"message": "Rider deleted successfully"})
