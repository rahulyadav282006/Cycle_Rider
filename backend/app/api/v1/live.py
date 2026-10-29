from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.api.deps import get_current_user
from backend.app.models.schemas import LiveTrackingResponse, APIResponse

router = APIRouter(tags=["Live Tracking"])

@router.get("/events/{event_id}/live", response_model=APIResponse)
async def get_live_tracking_data(
    event_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "EVENT_NOT_FOUND", "message": "Event not found"},
        )

    # 1. Riders
    riders_cursor = db.riders.find({"eventId": event_id})
    riders = await riders_cursor.to_list(length=1000)
    total_registered = len(riders)

    # 2. Checkpoints
    cps_cursor = db.checkpoints.find({"eventId": event_id}).sort("sequenceNumber", 1)
    checkpoints = await cps_cursor.to_list(length=100)

    # 3. Scans
    scans_cursor = db.scans.find({"eventId": event_id}).sort("scanTime", -1)
    scans = await scans_cursor.to_list(length=2000)

    # Map scans by riderId
    scans_by_rider = {}
    scans_by_cp = {}
    for s in scans:
        r_id = s["riderId"]
        cp_id = s["checkpointId"]
        
        if r_id not in scans_by_rider:
            scans_by_rider[r_id] = []
        scans_by_rider[r_id].append(s)
        
        scans_by_cp[cp_id] = scans_by_cp.get(cp_id, 0) + 1

    # Calculations
    started_count = len(scans_by_rider)
    dnf_count = sum(1 for r in riders if r.get("status") == "DNF")
    
    # Identify Finish / Destination checkpoint
    finish_cp = None
    home_safe_cp = None
    for cp in checkpoints:
        name_lower = cp["name"].lower()
        if "finish" in name_lower or "destination" in name_lower:
            finish_cp = cp
        if "home safe" in name_lower:
            home_safe_cp = cp
            
    if not finish_cp and checkpoints:
        finish_cp = checkpoints[-2] if len(checkpoints) >= 2 else checkpoints[-1]
    if not home_safe_cp and checkpoints:
        home_safe_cp = checkpoints[-1]

    finished_count = scans_by_cp.get(finish_cp["id"], 0) if finish_cp else 0
    home_safe_count = scans_by_cp.get(home_safe_cp["id"], 0) if home_safe_cp else 0

    # Checkpoint progress breakdown
    checkpoint_progress = []
    for cp in checkpoints:
        passed_cnt = scans_by_cp.get(cp["id"], 0)
        pct = round((passed_cnt / total_registered * 100), 1) if total_registered > 0 else 0.0
        checkpoint_progress.append({
            "checkpointId": cp["id"],
            "sequenceNumber": cp["sequenceNumber"],
            "name": cp["name"],
            "type": cp.get("type", "Standard"),
            "mandatory": cp.get("mandatory", True),
            "scannedCount": passed_cnt,
            "totalRiders": total_registered,
            "percentage": pct,
            "status": "Active" if passed_cnt > 0 else "Pending",
        })

    # Recent scans feed (latest 15)
    recent_scans = []
    rider_map = {r["riderId"]: r for r in riders}
    cp_map = {cp["id"]: cp for cp in checkpoints}
    for s in scans[:15]:
        r = rider_map.get(s["riderId"])
        cp = cp_map.get(s["checkpointId"])
        recent_scans.append({
            "id": s["id"],
            "riderId": s["riderId"],
            "riderName": r["name"] if r else "Rider",
            "jerseyNumber": r.get("jerseyNumber", "101") if r else "101",
            "checkpointName": cp["name"] if cp else "Checkpoint",
            "scanTime": s.get("scanTime", s.get("createdAt")),
            "status": s.get("status", "Recorded"),
        })

    # Detailed riders status list
    riders_status_list = []
    for r in riders:
        r_scans = scans_by_rider.get(r["riderId"], [])
        last_cp_name = "Not Started"
        last_scan_time = "--:--"
        if r_scans:
            last_s = r_scans[0]
            last_cp = cp_map.get(last_s["checkpointId"])
            last_cp_name = last_cp["name"] if last_cp else "Checkpoint"
            last_scan_time = last_s.get("scanTime", "")[11:16] if len(last_s.get("scanTime", "")) >= 16 else "--:--"

        r_status = r.get("status", "Registered")
        if r_status != "DNF":
            if home_safe_cp and any(s["checkpointId"] == home_safe_cp["id"] for s in r_scans):
                r_status = "Home Safe"
            elif finish_cp and any(s["checkpointId"] == finish_cp["id"] for s in r_scans):
                r_status = "Finished"
            elif r_scans:
                r_status = "Active"

        riders_status_list.append({
            "id": r["id"],
            "riderId": r["riderId"],
            "name": r["name"],
            "jerseyNumber": str(r.get("jerseyNumber", "101")),
            "club": r.get("club", "Independent"),
            "status": r_status,
            "lastCheckpoint": last_cp_name,
            "lastScanTime": last_scan_time,
            "emergencyContact": r.get("emergencyContact", ""),
        })

    data = LiveTrackingResponse(
        eventId=event["id"],
        eventName=event["eventName"],
        registeredRiders=total_registered,
        startedRiders=started_count,
        finishedRiders=finished_count,
        dnfRiders=dnf_count,
        homeSafeRiders=home_safe_count,
        checkpointProgress=checkpoint_progress,
        recentScans=recent_scans,
        ridersStatusList=riders_status_list,
    )
    return APIResponse(success=True, data=data.model_dump())
