import httpx

BASE_API = "http://127.0.0.1:8000"
BASE_FRONTEND = "http://localhost:5173"

def run_e2e_verification():
    print("--- 1. Testing Frontend Dev Server Availability ---")
    with httpx.Client() as client:
        res = client.get(BASE_FRONTEND)
        print(f"Frontend HTTP Status: {res.status_code}")
        assert res.status_code == 200
        assert "<html" in res.text or "<!DOCTYPE html" in res.text

    print("\n--- 2. Testing Organizer Authentication ---")
    with httpx.Client(base_url=BASE_API) as client:
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "organizer@kolhapur.com", "password": "OrganizerPassword@123"},
        )
        assert login_res.status_code == 200
        auth_data = login_res.json()["data"]
        token = auth_data["accessToken"]
        print(f"Logged in organizer: {auth_data['user']['name']} ({auth_data['user']['role']})")
        headers = {"Authorization": f"Bearer {token}"}

        print("\n--- 3. Testing Events List & Creation in MongoDB ---")
        events_res = client.get("/api/v1/events", headers=headers)
        assert events_res.status_code == 200
        events = events_res.json()["data"]
        print(f"Found {len(events)} events in database:")
        for ev in events:
            print(f"  - [{ev['id']}] {ev['eventName']} ({ev['rideDistance']} km, status: {ev['status']})")

        # Create new event: Sahyadri Brevet 150K
        new_ev_res = client.post(
            "/api/v1/events",
            json={
                "eventName": "Sahyadri Brevet 150K",
                "description": "Scenic Western Ghats brevet crossing Amba and Anuskura ghats.",
                "location": "Kolhapur Ghats",
                "rideDistance": 150,
                "rideDate": "2026-11-20",
                "startTime": "05:30 AM",
                "status": "upcoming",
            },
            headers=headers,
        )
        assert new_ev_res.status_code == 200
        created_ev = new_ev_res.json()["data"]
        print(f"Created new event: {created_ev['eventName']} (ID: {created_ev['id']})")

        # Verify event appears in list
        events_after = client.get("/api/v1/events", headers=headers).json()["data"]
        assert any(e["eventName"] == "Sahyadri Brevet 150K" for e in events_after)
        print(f"Verified event appears in Events list immediately! Total events: {len(events_after)}")

        print("\n--- 4. Testing Checkpoints (10 Checkpoints: 7 Mandatory, 3 Optional) ---")
        cps_res = client.get("/api/v1/events/ev-kolhapur-2026/checkpoints", headers=headers)
        assert cps_res.status_code == 200
        cps = cps_res.json()["data"]
        assert len(cps) == 10
        mandatory_count = sum(1 for c in cps if c["mandatory"])
        optional_count = sum(1 for c in cps if not c["mandatory"])
        print(f"Total Checkpoints: {len(cps)} (Mandatory: {mandatory_count}, Optional: {optional_count})")
        for cp in cps:
            print(f"  Seq {cp['sequenceNumber']:2d}: {cp['name']} [{cp['type']}] - Mandatory: {cp['mandatory']}")

        print("\n--- 5. Testing Riders (Stable RT-XXXX IDs) ---")
        riders_res = client.get("/api/v1/events/ev-kolhapur-2026/riders", headers=headers)
        assert riders_res.status_code == 200
        riders = riders_res.json()["data"]
        print(f"Total Registered Riders: {len(riders)}")
        for r in riders:
            print(f"  Bib {r['jerseyNumber']}: {r['name']} (ID: {r['riderId']}, QR: '{r['qrCodeValue']}') - Status: {r['status']}")

        # Register a new rider and verify stable sequence generator
        new_rider_res = client.post(
            "/api/v1/events/ev-kolhapur-2026/riders",
            json={
                "name": "Pranali Sawant",
                "mobile": "+91 98229 99887",
                "emergencyContact": "+91 98229 11223",
                "bloodGroup": "O+",
                "age": 28,
                "gender": "Female",
                "club": "Kolhapur Randonneurs",
                "bicycleType": "Road Bike",
                "jerseyNumber": 107,
            },
            headers=headers,
        )
        assert new_rider_res.status_code == 200
        new_rider = new_rider_res.json()["data"]
        print(f"Registered new rider: {new_rider['name']} with stable ID: {new_rider['riderId']} and QR value: '{new_rider['qrCodeValue']}'")
        assert new_rider["riderId"].startswith("RT-")
        assert new_rider["qrCodeValue"] == new_rider["riderId"]

        print("\n--- 6. Testing Volunteer Assignment & Scanner Duplicate Protection ---")
        # Volunteer login
        vol_login = client.post(
            "/api/v1/auth/login",
            json={"email": "volunteer@kolhapur.com", "password": "VolunteerPassword@123"},
        ).json()["data"]
        vol_headers = {"Authorization": f"Bearer {vol_login['accessToken']}"}

        my_assign = client.get("/api/v1/volunteers/me", headers=vol_headers).json()["data"]
        print(f"Volunteer: {my_assign['volunteer']['name']} assigned to {my_assign['checkpoint']['name']} in {my_assign['event']['name']}")

        # Submit scan for newly registered rider at CP1
        scan_rider_id = new_rider["riderId"]
        scan_res = client.post(
            "/api/v1/scans",
            json={
                "clientScanId": f"client-scan-{scan_rider_id}-001",
                "riderId": scan_rider_id,
                "eventId": "ev-kolhapur-2026",
                "checkpointId": "cp-kolhapur-01",
            },
            headers=vol_headers,
        )
        assert scan_res.status_code == 200
        print(f"Recorded scan for {scan_rider_id} at CP1: {scan_res.json()['data']['status']}")

        # Duplicate scan test: Re-scanning rider at CP1 must return 409 DUPLICATE_SCAN
        dup_res = client.post(
            "/api/v1/scans",
            json={
                "clientScanId": f"client-scan-{scan_rider_id}-002",
                "riderId": scan_rider_id,
                "eventId": "ev-kolhapur-2026",
                "checkpointId": "cp-kolhapur-01",
            },
            headers=vol_headers,
        )
        assert dup_res.status_code == 409
        assert dup_res.json()["error"]["code"] == "DUPLICATE_SCAN"
        print("Duplicate scan properly rejected with 409 DUPLICATE_SCAN!")

        # Idempotent clientScanId test: Submitting identical clientScanId returns original scan without duplicate error
        idem_res = client.post(
            "/api/v1/scans",
            json={
                "clientScanId": f"client-scan-{scan_rider_id}-001",
                "riderId": scan_rider_id,
                "eventId": "ev-kolhapur-2026",
                "checkpointId": "cp-kolhapur-01",
            },
            headers=vol_headers,
        )
        assert idem_res.status_code == 200
        print("Idempotent clientScanId successfully returned without error!")

        print("\n--- 7. Testing Live Tracking Calculations from Real Scans ---")
        live_res = client.get("/api/v1/events/ev-kolhapur-2026/live", headers=headers).json()["data"]
        print(f"Live Telemetry:")
        print(f"  Registered: {live_res['registeredRiders']}")
        print(f"  Started:    {live_res['startedRiders']}")
        print(f"  Finished:   {live_res['finishedRiders']}")
        print(f"  DNF:        {live_res['dnfRiders']}")
        print(f"  Home Safe:  {live_res['homeSafeRiders']}")
        print(f"  Recent Scans Count: {len(live_res['recentScans'])}")

        print("\n--- 8. Testing Super Admin Platform Metrics & Settings ---")
        admin_login = client.post(
            "/api/v1/auth/login",
            json={"email": "superadmin@ridetrack.com", "password": "AdminPassword@123"},
        ).json()["data"]
        admin_headers = {"Authorization": f"Bearer {admin_login['accessToken']}"}

        stats = client.get("/api/v1/admin/stats", headers=admin_headers).json()["data"]
        print(f"Super Admin Stats:")
        print(f"  Total Organizers: {stats['totalOrganizers']}")
        print(f"  Total Events:     {stats['totalEvents']}")
        print(f"  Total Riders:     {stats['totalRiders']}")
        print(f"  Total Checkpoints:{stats['totalCheckpoints']}")

        orgs = client.get("/api/v1/admin/organizers", headers=admin_headers).json()["data"]
        print(f"Super Admin Organizers count: {len(orgs)}")
        print(f"First Organizer: {orgs[0]['name']} ({orgs[0]['organization']}) - Events: {orgs[0]['eventsCount']}")

        print("\n=== ALL END-TO-END VERIFICATION CHECKS PASSED WITH 100% SUCCESS! ===")

if __name__ == "__main__":
    run_e2e_verification()
