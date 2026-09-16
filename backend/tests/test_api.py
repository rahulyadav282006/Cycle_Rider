import httpx

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

def test_auth_login_organizer():
    with httpx.Client(base_url=BASE_URL) as client:
        resp = client.post(
            "/api/v1/auth/login",
            json={"email": "organizer@kolhapur.com", "password": "OrganizerPassword@123"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert "accessToken" in data["data"]
        assert data["data"]["user"]["role"] == "ORGANIZER"

def test_auth_login_super_admin():
    with httpx.Client(base_url=BASE_URL) as client:
        resp = client.post(
            "/api/v1/auth/login",
            json={"email": "superadmin@ridetrack.com", "password": "AdminPassword@123"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert data["data"]["user"]["role"] == "SUPER_ADMIN"

def test_events_and_checkpoints():
    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Login as organizer
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "organizer@kolhapur.com", "password": "OrganizerPassword@123"},
        )
        token = login_res.json()["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. List events
        events_res = client.get("/api/v1/events", headers=headers)
        assert events_res.status_code == 200
        events = events_res.json()["data"]
        assert len(events) >= 1
        kolhapur_event = next((e for e in events if e["id"] == "ev-kolhapur-2026"), events[-1])
        event_id = kolhapur_event["id"]

        # 3. Checkpoints (10 checkpoints: 7 mandatory, 3 optional)
        cp_res = client.get(f"/api/v1/events/{event_id}/checkpoints", headers=headers)
        assert cp_res.status_code == 200
        cps = cp_res.json()["data"]
        assert len(cps) == 10
        mandatory_cnt = sum(1 for c in cps if c["mandatory"])
        assert mandatory_cnt == 7

        # 4. List riders
        riders_res = client.get(f"/api/v1/events/{event_id}/riders", headers=headers)
        assert riders_res.status_code == 200
        riders = riders_res.json()["data"]
        assert len(riders) >= 6
        assert riders[0]["riderId"].startswith("RT-")

        # 5. Live tracking
        live_res = client.get(f"/api/v1/events/{event_id}/live", headers=headers)
        assert live_res.status_code == 200
        live_data = live_res.json()["data"]
        assert live_data["registeredRiders"] >= 6
        assert len(live_data["checkpointProgress"]) == 10

        # 6. Reports summary
        rep_res = client.get(f"/api/v1/events/{event_id}/reports/event_summary", headers=headers)
        assert rep_res.status_code == 200
        assert rep_res.json()["success"] is True

def test_duplicate_scan_protection():
    with httpx.Client(base_url=BASE_URL) as client:
        # Login as volunteer
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "volunteer@kolhapur.com", "password": "VolunteerPassword@123"},
        )
        token = login_res.json()["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        # Submit an already recorded scan: RT-0001 at cp-kolhapur-01
        scan_payload = {
            "clientScanId": "test-dup-scan-999",
            "riderId": "RT-0001",
            "eventId": "ev-kolhapur-2026",
            "checkpointId": "cp-kolhapur-01",
        }
        res = client.post("/api/v1/scans", json=scan_payload, headers=headers)
        assert res.status_code == 409
        assert res.json()["error"]["code"] == "DUPLICATE_SCAN"

def test_admin_stats_and_settings():
    with httpx.Client(base_url=BASE_URL) as client:
        # Login as Super Admin
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "superadmin@ridetrack.com", "password": "AdminPassword@123"},
        )
        token = login_res.json()["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        # Stats
        stats_res = client.get("/api/v1/admin/stats", headers=headers)
        assert stats_res.status_code == 200
        stats = stats_res.json()["data"]
        assert stats["totalOrganizers"] >= 1
        assert stats["totalEvents"] >= 1
        assert stats["totalCheckpoints"] >= 10

        # Organizers
        orgs_res = client.get("/api/v1/admin/organizers", headers=headers)
        assert orgs_res.status_code == 200
        orgs = orgs_res.json()["data"]
        assert len(orgs) >= 1
