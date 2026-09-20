import uuid
import httpx
import pytest

BASE_URL = "http://127.0.0.1:8000"


def test_full_scans_and_checkpoint_workflow():
    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Organizer Login
        org_login = client.post(
            "/api/v1/auth/login",
            json={"email": "organizer@kolhapur.com", "password": "OrganizerPassword@123"},
        )
        assert org_login.status_code == 200
        org_token = org_login.json()["data"]["accessToken"]
        org_headers = {"Authorization": f"Bearer {org_token}"}

        # 2. Volunteer Login
        vol_login = client.post(
            "/api/v1/auth/login",
            json={"email": "volunteer@kolhapur.com", "password": "VolunteerPassword@123"},
        )
        assert vol_login.status_code == 200
        vol_token = vol_login.json()["data"]["accessToken"]
        vol_headers = {"Authorization": f"Bearer {vol_token}"}

        # 3. Create a test event for this workflow
        unique_suffix = uuid.uuid4().hex[:6]
        event_res = client.post(
            "/api/v1/events",
            json={
                "eventName": f"Real Scanner Event {unique_suffix}",
                "description": "Event for end-to-end scanner & checkpoint verification",
                "location": "Kolhapur Stadium",
                "rideDistance": 100,
                "rideDate": "2026-10-15",
                "startTime": "06:00 AM",
            },
            headers=org_headers,
        )
        assert event_res.status_code == 200
        event_id = event_res.json()["data"]["id"]

        # 4. Create 2 checkpoints
        cp1_res = client.post(
            f"/api/v1/events/{event_id}/checkpoints",
            json={"name": "Start Checkpoint", "type": "Start", "sequenceNumber": 1, "mandatory": True},
            headers=org_headers,
        )
        assert cp1_res.status_code == 200
        cp1_id = cp1_res.json()["data"]["id"]

        cp2_res = client.post(
            f"/api/v1/events/{event_id}/checkpoints",
            json={"name": "Breakfast Checkpoint", "type": "Refreshment", "sequenceNumber": 2, "mandatory": True},
            headers=org_headers,
        )
        assert cp2_res.status_code == 200
        cp2_id = cp2_res.json()["data"]["id"]

        # 5. Register a real rider
        rider_res = client.post(
            f"/api/v1/events/{event_id}/riders",
            json={
                "name": f"Scanner Test Rider {unique_suffix}",
                "mobile": "9823456789",
                "emergencyContact": "9823456780",
                "bloodGroup": "B+",
                "jerseyNumber": 204,
                "bicycleType": "Gravel Bike",
            },
            headers=org_headers,
        )
        assert rider_res.status_code == 200
        rider_data = rider_res.json()["data"]
        rider_id = rider_data["riderId"]  # e.g. RT-0001

        # 6. Check initial rider profile timeline (all checkpoints pending or current)
        profile_res = client.get(f"/api/v1/riders/{rider_data['id']}", headers=org_headers)
        assert profile_res.status_code == 200
        initial_timeline = profile_res.json()["data"]["timeline"]
        assert len(initial_timeline) == 2
        assert initial_timeline[0]["status"] in ["Pending", "Current"]
        assert initial_timeline[0]["time"] is None

        # 7. Record Online Scan as Organizer/Volunteer (let's use organizer to avoid volunteer unassigned checkpoint block)
        client_scan_id_1 = f"client-scan-{uuid.uuid4().hex}"
        scan_payload = {
            "clientScanId": client_scan_id_1,
            "riderId": rider_id,
            "eventId": event_id,
            "checkpointId": cp1_id,
            "scanTime": "2026-10-15T06:15:00Z",
        }
        scan_res = client.post("/api/v1/scans", json=scan_payload, headers=org_headers)
        assert scan_res.status_code == 200, f"Scan recording failed: {scan_res.text}"
        scan_data = scan_res.json()["data"]
        assert scan_data["riderId"] == rider_id
        assert scan_data["checkpointId"] == cp1_id
        assert scan_data["status"] == "Recorded"

        # 8. Idempotency Check: Re-submitting the exact same clientScanId must return the existing record with 200 OK
        re_scan_res = client.post("/api/v1/scans", json=scan_payload, headers=org_headers)
        assert re_scan_res.status_code == 200
        assert re_scan_res.json()["data"]["id"] == scan_data["id"]

        # 9. Duplicate Scan Check: Submitting a NEW clientScanId for the same rider & checkpoint must return HTTP 409 DUPLICATE_SCAN
        dup_scan_payload = {
            "clientScanId": f"client-scan-{uuid.uuid4().hex}",
            "riderId": rider_id,
            "eventId": event_id,
            "checkpointId": cp1_id,
            "scanTime": "2026-10-15T06:20:00Z",
        }
        dup_res = client.post("/api/v1/scans", json=dup_scan_payload, headers=org_headers)
        assert dup_res.status_code == 409
        dup_err = dup_res.json()["error"]
        assert dup_err["code"] == "DUPLICATE_SCAN"

        # 10. Checkpoint Timeline Update: Check Rider Profile
        updated_profile = client.get(f"/api/v1/riders/{rider_data['id']}", headers=org_headers).json()["data"]
        timeline = updated_profile["timeline"]
        assert len(timeline) == 2
        # CP1 is now Completed with real scan timestamp
        assert timeline[0]["name"] == "Start Checkpoint"
        assert timeline[0]["status"] == "Completed"
        assert timeline[0]["time"] == "2026-10-15T06:15:00Z"

        # 11. Validation Endpoint (Preview before confirmation)
        # 11a. Validate CP2 for same rider (allowed, not yet scanned at CP2)
        val_cp2_res = client.post("/api/v1/scans/validate", json={
            "riderId": rider_id,
            "eventId": event_id,
            "checkpointId": cp2_id,
        }, headers=org_headers)
        assert val_cp2_res.status_code == 200
        val_data = val_cp2_res.json()["data"]
        assert val_data["riderId"] == rider_id
        assert val_data["riderName"] == f"Scanner Test Rider {unique_suffix}"
        assert val_data["checkpointId"] == cp2_id
        assert val_data["checkpointName"] == "Breakfast Checkpoint"

        # 11b. Validate CP1 for same rider (already scanned -> 409 DUPLICATE_SCAN)
        val_dup_res = client.post("/api/v1/scans/validate", json={
            "riderId": rider_id,
            "eventId": event_id,
            "checkpointId": cp1_id,
        }, headers=org_headers)
        assert val_dup_res.status_code == 409
        assert val_dup_res.json()["error"]["code"] == "DUPLICATE_SCAN"

        # 11c. Progress to CP2: Confirm arrival at CP2 -> 200 OK
        client_scan_id_2 = f"client-scan-{uuid.uuid4().hex}"
        cp2_scan_res = client.post("/api/v1/scans", json={
            "clientScanId": client_scan_id_2,
            "riderId": rider_id,
            "eventId": event_id,
            "checkpointId": cp2_id,
            "scanTime": "2026-10-15T08:30:00Z",
        }, headers=org_headers)
        assert cp2_scan_res.status_code == 200
        assert cp2_scan_res.json()["data"]["status"] == "Recorded"

        # Both checkpoints now Completed in rider profile timeline
        final_profile = client.get(f"/api/v1/riders/{rider_data['id']}", headers=org_headers).json()["data"]
        assert final_profile["timeline"][0]["status"] == "Completed"
        assert final_profile["timeline"][1]["status"] == "Completed"

        # 12. Invalid Rider Check: Submitting non-existent rider returns 404
        bad_scan_payload = {
            "clientScanId": f"client-scan-{uuid.uuid4().hex}",
            "riderId": "RT-NONEXISTENT",
            "eventId": event_id,
            "checkpointId": cp1_id,
        }
        bad_res = client.post("/api/v1/scans", json=bad_scan_payload, headers=org_headers)
        assert bad_res.status_code == 404
        assert bad_res.json()["error"]["code"] == "RIDER_NOT_FOUND"

        # 13. Wrong Event Validation: Scan rider against a different event returns 400 WRONG_EVENT
        wrong_event_res = client.post("/api/v1/events", json={
            "eventName": f"Other Event {unique_suffix}",
            "location": "Pune",
            "rideDistance": 50,
            "rideDate": "2026-10-20",
            "startTime": "07:00 AM",
        }, headers=org_headers)
        assert wrong_event_res.status_code == 200
        other_event_id = wrong_event_res.json()["data"]["id"]

        other_cp_res = client.post(f"/api/v1/events/{other_event_id}/checkpoints", json={
            "name": "Other CP", "type": "Start", "sequenceNumber": 1, "mandatory": True,
        }, headers=org_headers)
        other_cp_id = other_cp_res.json()["data"]["id"]

        wrong_event_scan = client.post("/api/v1/scans/validate", json={
            "riderId": rider_id,
            "eventId": other_event_id,
            "checkpointId": other_cp_id,
        }, headers=org_headers)
        assert wrong_event_scan.status_code == 400
        assert wrong_event_scan.json()["error"]["code"] == "WRONG_EVENT"
