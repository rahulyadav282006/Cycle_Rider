import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.database import get_database
from backend.app.api.deps import get_current_user
from backend.app.models.schemas import APIResponse

router = APIRouter(tags=["Reports"])

@router.get("/events/{event_id}/reports/{report_type}", response_model=APIResponse)
async def get_report(
    event_id: str,
    report_type: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail={"code": "EVENT_NOT_FOUND", "message": "Event not found"})

    riders = await db.riders.find({"eventId": event_id}).to_list(1000)
    checkpoints = await db.checkpoints.find({"eventId": event_id}).sort("sequenceNumber", 1).to_list(100)
    scans = await db.scans.find({"eventId": event_id}).to_list(2000)

    # Scans mapping
    scans_by_rider = {}
    scans_by_cp = {}
    for s in scans:
        scans_by_rider.setdefault(s["riderId"], []).append(s)
        scans_by_cp[s["checkpointId"]] = scans_by_cp.get(s["checkpointId"], 0) + 1

    finish_cp = next((cp for cp in checkpoints if "finish" in cp["name"].lower() or "destination" in cp["name"].lower()), checkpoints[-1] if checkpoints else None)
    home_safe_cp = next((cp for cp in checkpoints if "home safe" in cp["name"].lower()), checkpoints[-1] if checkpoints else None)
    cp_map = {cp["id"]: cp for cp in checkpoints}

    data = {}
    if report_type in ["rider_list", "rider-list"]:
        items = []
        for r in riders:
            r_scans = scans_by_rider.get(r["riderId"], [])
            last_cp = cp_map.get(r_scans[-1]["checkpointId"])["name"] if r_scans and cp_map.get(r_scans[-1]["checkpointId"]) else "None"
            items.append({
                "riderId": r["riderId"],
                "name": r["name"],
                "category": r.get("bicycleType", "Road Bike"),
                "jerseyNumber": r.get("jerseyNumber", "101"),
                "status": r.get("status", "Registered"),
                "emergencyContact": r.get("emergencyContact", ""),
                "lastCheckpoint": last_cp,
            })
        data = {"type": "Rider List Report", "items": items, "total": len(items)}

    elif report_type in ["checkpoint_summary", "checkpoints"]:
        items = []
        for cp in checkpoints:
            count = scans_by_cp.get(cp["id"], 0)
            pct = round(count / len(riders) * 100, 1) if riders else 0
            items.append({
                "checkpointId": cp["id"],
                "sequenceNumber": cp["sequenceNumber"],
                "name": cp["name"],
                "mandatory": cp.get("mandatory", True),
                "passedCount": count,
                "completionPct": pct,
            })
        data = {"type": "Checkpoint Summary Report", "items": items}

    elif report_type == "finishers":
        items = []
        for r in riders:
            r_scans = scans_by_rider.get(r["riderId"], [])
            if finish_cp and any(s["checkpointId"] == finish_cp["id"] for s in r_scans):
                finish_scan = next(s for s in r_scans if s["checkpointId"] == finish_cp["id"])
                items.append({
                    "riderId": r["riderId"],
                    "name": r["name"],
                    "jerseyNumber": r.get("jerseyNumber", "101"),
                    "finishTime": finish_scan.get("scanTime", "")[11:19] if len(finish_scan.get("scanTime", "")) >= 19 else "--:--",
                    "status": "Verified Finisher",
                })
        data = {"type": "Official Finishers Report", "items": items, "totalFinishers": len(items)}

    elif report_type == "dnf":
        items = []
        for r in riders:
            if r.get("status") == "DNF":
                r_scans = scans_by_rider.get(r["riderId"], [])
                last_cp = cp_map.get(r_scans[-1]["checkpointId"])["name"] if r_scans and cp_map.get(r_scans[-1]["checkpointId"]) else "Start"
                items.append({
                    "riderId": r["riderId"],
                    "name": r["name"],
                    "jerseyNumber": r.get("jerseyNumber", "101"),
                    "lastCheckpoint": last_cp,
                    "reason": r.get("dnfReason", "Mechanical issue"),
                })
        data = {"type": "DNF Incident Report", "items": items, "totalDnf": len(items)}

    elif report_type in ["home_safe", "home-safe"]:
        items = []
        for r in riders:
            r_scans = scans_by_rider.get(r["riderId"], [])
            is_home_safe = home_safe_cp and any(s["checkpointId"] == home_safe_cp["id"] for s in r_scans)
            if is_home_safe:
                hs_scan = next(s for s in r_scans if s["checkpointId"] == home_safe_cp["id"])
                items.append({
                    "riderId": r["riderId"],
                    "name": r["name"],
                    "confirmedTime": hs_scan.get("scanTime", "")[11:19] if len(hs_scan.get("scanTime", "")) >= 19 else "--:--",
                    "status": "Confirmed Safe",
                })
        data = {"type": "Home Safe Confirmation Report", "items": items, "totalSafe": len(items)}

    else:  # event_summary
        total_r = len(riders)
        fin_count = sum(1 for r in riders if finish_cp and any(s["checkpointId"] == finish_cp["id"] for s in scans_by_rider.get(r["riderId"], [])))
        data = {
            "type": "Event Summary Report",
            "eventName": event["eventName"],
            "date": event["rideDate"],
            "location": event["location"],
            "distanceKm": event["rideDistance"],
            "totalRegistered": total_r,
            "totalStarted": len(scans_by_rider),
            "totalFinished": fin_count,
            "totalDnf": sum(1 for r in riders if r.get("status") == "DNF"),
            "completionRate": round(fin_count / total_r * 100, 1) if total_r else 0,
        }

    return APIResponse(success=True, data=data)

@router.get("/events/{event_id}/reports/{report_type}/export")
async def export_report_csv(
    event_id: str,
    report_type: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # Fetch report data and stream CSV
    res = await get_report(event_id, report_type, current_user, db)
    report_data = res.data

    output = io.StringIO()
    writer = csv.writer(output)

    items = report_data.get("items", [])
    if items:
        headers = list(items[0].keys())
        writer.writerow(headers)
        for item in items:
            writer.writerow([item.get(h, "") for h in headers])
    else:
        writer.writerow(["Key", "Value"])
        for k, v in report_data.items():
            writer.writerow([k, str(v)])

    csv_content = output.getvalue()
    filename = f"{report_type}_{event_id}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
