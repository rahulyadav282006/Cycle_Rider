import urllib.request
import urllib.error
import json
import uuid

API_BASE = "http://localhost:8000/api/v1"

def api_call(method, path, body=None, token=None):
    url = f"{API_BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            return status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            parsed = json.loads(content)
        except Exception:
            parsed = {"raw": content}
        return e.code, parsed

def run():
    print("==================================================")
    print("VERIFICATION: EMPTY DATABASE & REAL DATA WORKFLOW")
    print("==================================================")

    # 1. Register a fresh organizer to test 100% clean/empty account state
    unique_suffix = uuid.uuid4().hex[:6]
    org_email = f"fresh_organizer_{unique_suffix}@ridetrack.in"
    org_pass = "TestPass@123"

    status, reg_res = api_call("POST", "/auth/register", {
        "email": org_email,
        "password": org_pass,
        "name": "Fresh Test Organizer",
        "role": "ORGANIZER",
        "organizationName": "Clean Test Cycling Club",
        "phone": "9876543210"
    })
    assert status == 200, f"Register failed: {reg_res}"
    token = reg_res["data"]["accessToken"]
    print(f"[PASS] 1. Created fresh organizer account: {org_email}")

    # 2. Check events for fresh organizer -> MUST BE EMPTY
    status, events_res = api_call("GET", "/events", token=token)
    assert status == 200, f"Events fetch failed: {events_res}"
    events = events_res["data"]
    assert len(events) == 0, f"Expected 0 events for fresh organizer, got {len(events)}"
    print("[PASS] 2. Verified zero events for fresh organizer (empty state)")

    # 3. Verify dashboard metrics for fresh organizer
    total_riders = sum(e.get("riderCount", 0) for e in events)
    active_events = len([e for e in events if e.get("status") == "active"])
    upcoming_events = len([e for e in events if e.get("status") == "upcoming"])
    completed_events = len([e for e in events if e.get("status") == "completed"])

    assert total_riders == 0
    assert active_events == 0
    assert upcoming_events == 0
    assert completed_events == 0
    print(f"[PASS] 3. Verified empty dashboard metrics: Total Riders={total_riders}, Active Events={active_events}, Upcoming Events={upcoming_events}, Completed Events={completed_events}")

    # 4. Create a REAL event in MongoDB through FastAPI
    event_name = f"Official Pune Brevet {unique_suffix}"
    status, create_ev_res = api_call("POST", "/events", {
        "eventName": event_name,
        "description": "200 km endurance cycling ride through western ghats",
        "location": "Pune",
        "rideDistance": 200,
        "rideDate": "2026-10-15",
        "startTime": "06:00",
        "status": "active",
        "paymentRequired": True
    }, token=token)
    assert status == 200, f"Create event failed: {create_ev_res}"
    created_event = create_ev_res["data"]
    event_id = created_event["id"]
    print(f"[PASS] 4. Created real event in MongoDB: '{event_name}' (ID: {event_id})")

    # 5. Create real checkpoints for this event
    status, cp1_res = api_call("POST", f"/events/{event_id}/checkpoints", {
        "name": "Start Line - SPPU Gate",
        "type": "Start",
        "sequenceNumber": 1,
        "isMandatory": True,
        "latitude": 18.5529,
        "longitude": 73.8262
    }, token=token)
    assert status == 200
    cp1 = cp1_res["data"]

    status, cp2_res = api_call("POST", f"/events/{event_id}/checkpoints", {
        "name": "CP2 - Lonavala Ghat",
        "type": "Checkpoint",
        "sequenceNumber": 2,
        "isMandatory": True,
        "latitude": 18.7557,
        "longitude": 73.4091
    }, token=token)
    assert status == 200
    cp2 = cp2_res["data"]
    print(f"[PASS] 5. Created 2 real checkpoints in MongoDB: '{cp1['name']}', '{cp2['name']}'")

    # 6. Register a real rider through the application
    status, rider_res = api_call("POST", f"/events/{event_id}/riders", {
        "name": f"Aditya Shirole {unique_suffix}",
        "mobile": "9822012345",
        "emergencyContact": "9822054321",
        "bloodGroup": "B+",
        "age": 29,
        "gender": "Male",
        "club": "Pune Randonneurs",
        "bicycleType": "Road Bike",
        "jerseyNumber": "204",
        "medicalNotes": "None",
        "paymentStatus": "verified"
    }, token=token)
    assert status == 200, f"Rider registration failed: {rider_res}"
    rider = rider_res["data"]
    stable_rider_id = rider["riderId"]
    qr_code_value = rider["qrCodeValue"]
    print(f"[PASS] 6. Registered real rider: {rider['name']} (ID: {stable_rider_id}, QR: {qr_code_value})")

    # 7. Verify dashboard metrics updated dynamically from real MongoDB data
    status, updated_events_res = api_call("GET", "/events", token=token)
    updated_events = updated_events_res["data"]
    assert len(updated_events) == 1
    updated_ev = updated_events[0]
    assert updated_ev["riderCount"] == 1
    assert updated_ev["checkpointCount"] == 2
    print(f"[PASS] 7. Verified dynamic dashboard metrics updated from real DB: riderCount={updated_ev['riderCount']}, checkpointCount={updated_ev['checkpointCount']}")

    # 8. Record a scan in MongoDB
    status, scan_res = api_call("POST", "/scans", {
        "clientScanId": str(uuid.uuid4()),
        "eventId": event_id,
        "checkpointId": cp1["id"],
        "riderId": stable_rider_id,
        "scannedAt": "2026-10-15T06:05:00Z",
        "location": {"lat": 18.5529, "lng": 73.8262}
    }, token=token)
    assert status == 200, f"Scan failed: {scan_res}"
    print(f"[PASS] 8. Successfully recorded real scan in MongoDB for {stable_rider_id} at {cp1['name']}")

    # 9. Verify duplicate scan detection
    status, dup_scan_res = api_call("POST", "/scans", {
        "clientScanId": str(uuid.uuid4()),
        "eventId": event_id,
        "checkpointId": cp1["id"],
        "riderId": stable_rider_id,
        "scannedAt": "2026-10-15T06:06:00Z",
        "location": {"lat": 18.5529, "lng": 73.8262}
    }, token=token)
    assert status == 409, f"Expected 409 duplicate, got {status}"
    print(f"[PASS] 9. Duplicate-scan correctly rejected with 409 from MongoDB")

    # 10. Verify report generation from real MongoDB records
    status, report_res = api_call("GET", f"/events/{event_id}/reports/event_summary", token=token)
    assert status == 200, f"Report failed: {report_res}"
    report_data = report_res["data"]
    assert report_data["eventName"] == event_name
    assert report_data["totalRiders"] == 1
    print(f"[PASS] 10. Verified report generated from real MongoDB data: eventName='{report_data['eventName']}', totalRiders={report_data['totalRiders']}")

    print("==================================================")
    print("ALL 10 REAL DATA AND EMPTY STATE TESTS PASSED!")
    print("==================================================")

if __name__ == "__main__":
    run()
