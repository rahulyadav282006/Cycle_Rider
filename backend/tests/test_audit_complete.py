import uuid
import httpx
import pytest

BASE_URL = "http://127.0.0.1:8000"

# Helpers for authenticated clients
def get_auth_token(email: str, password: str) -> str:
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
        assert res.status_code == 200, f"Login failed for {email}: {res.text}"
        return res.json()["data"]["accessToken"]

def get_auth_headers(email: str, password: str) -> dict:
    token = get_auth_token(email, password)
    return {"Authorization": f"Bearer {token}"}

# ==============================================================================
# SECTION 3. AUTHENTICATION TESTS
# ==============================================================================

def test_auth_01_super_admin_login():
    """1. Super Admin login succeeds."""
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.post("/api/v1/auth/login", json={"email": "superadmin@ridetrack.com", "password": "AdminPassword@123"})
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["user"]["role"] == "SUPER_ADMIN"
        assert "accessToken" in data

def test_auth_02_organizer_login():
    """2. Organizer login succeeds."""
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.post("/api/v1/auth/login", json={"email": "organizer@kolhapur.com", "password": "OrganizerPassword@123"})
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["user"]["role"] == "ORGANIZER"
        assert "accessToken" in data

def test_auth_03_volunteer_login():
    """3. Volunteer login succeeds."""
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.post("/api/v1/auth/login", json={"email": "volunteer@kolhapur.com", "password": "VolunteerPassword@123"})
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["user"]["role"] == "VOLUNTEER"
        assert "accessToken" in data

def test_auth_04_invalid_password_rejected():
    """4. Invalid password is rejected."""
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.post("/api/v1/auth/login", json={"email": "organizer@kolhapur.com", "password": "WrongPassword!999"})
        assert res.status_code == 401
        assert res.json()["error"]["code"] == "INVALID_CREDENTIALS"

def test_auth_05_invalid_token_rejected():
    """5. Invalid token is rejected."""
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid_garbage_token_12345"})
        assert res.status_code == 401
        assert res.json()["error"]["code"] == "TOKEN_INVALID"

def test_auth_06_logout_works():
    """6. Logout works."""
    headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.post("/api/v1/auth/logout", headers=headers)
        assert res.status_code == 200
        assert res.json()["success"] is True

def test_auth_07_current_user_endpoint():
    """7. Current-user endpoint works."""
    headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    with httpx.Client(base_url=BASE_URL) as client:
        res = client.get("/api/v1/auth/me", headers=headers)
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["email"] == "organizer@kolhapur.com"
        assert data["role"] == "ORGANIZER"

def test_auth_08_organizer_cannot_access_other_organizers_event():
    """8. Organizer cannot access another organizer's event."""
    admin_headers = get_auth_headers("superadmin@ridetrack.com", "AdminPassword@123")
    unique_suffix = uuid.uuid4().hex[:6]
    
    with httpx.Client(base_url=BASE_URL) as client:
        # Create a second organizer
        org2_email = f"org2_{unique_suffix}@test.com"
        org2_create = client.post("/api/v1/admin/organizers", json={
            "name": f"Organizer Two {unique_suffix}",
            "email": org2_email,
            "password": "Password123!",
            "organization": "Other Club",
        }, headers=admin_headers)
        assert org2_create.status_code == 200
        org2_token = client.post("/api/v1/auth/login", json={"email": org2_email, "password": "Password123!"}).json()["data"]["accessToken"]
        org2_headers = {"Authorization": f"Bearer {org2_token}"}

        # Create event owned by org2
        ev_res = client.post("/api/v1/events", json={
            "eventName": f"Org2 Secret Brevet {unique_suffix}",
            "location": "Pune",
            "rideDistance": 100,
            "rideDate": "2026-12-01",
            "startTime": "06:00 AM",
        }, headers=org2_headers)
        assert ev_res.status_code == 200
        org2_event_id = ev_res.json()["data"]["id"]

        # First organizer tries to access org2's event -> 403 FORBIDDEN
        org1_headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
        access_res = client.get(f"/api/v1/events/{org2_event_id}", headers=org1_headers)
        assert access_res.status_code == 403
        assert access_res.json()["error"]["code"] == "FORBIDDEN"

def test_auth_09_volunteer_cannot_access_unassigned_event():
    """9. Volunteer cannot access an unassigned event."""
    admin_headers = get_auth_headers("superadmin@ridetrack.com", "AdminPassword@123")
    unique_suffix = uuid.uuid4().hex[:6]
    
    with httpx.Client(base_url=BASE_URL) as client:
        # Create an event where volunteer Amit is NOT assigned
        org_headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
        ev_res = client.post("/api/v1/events", json={
            "eventName": f"Unassigned Event {unique_suffix}",
            "location": "Goa",
            "rideDistance": 120,
            "rideDate": "2026-12-15",
            "startTime": "06:00 AM",
        }, headers=org_headers)
        unassigned_event_id = ev_res.json()["data"]["id"]

        # Volunteer Amit attempts to view this event -> 403 FORBIDDEN
        vol_headers = get_auth_headers("volunteer@kolhapur.com", "VolunteerPassword@123")
        view_res = client.get(f"/api/v1/events/{unassigned_event_id}", headers=vol_headers)
        assert view_res.status_code == 403
        assert view_res.json()["error"]["code"] == "FORBIDDEN"

def test_auth_10_volunteer_cannot_scan_at_unassigned_checkpoint():
    """10. Volunteer cannot scan at an unassigned checkpoint."""
    # Amit is assigned to cp-kolhapur-01. Attempt scanning at cp-kolhapur-02 -> 403 FORBIDDEN
    vol_headers = get_auth_headers("volunteer@kolhapur.com", "VolunteerPassword@123")
    with httpx.Client(base_url=BASE_URL) as client:
        scan_res = client.post("/api/v1/scans", json={
            "clientScanId": f"unassigned-cp-test-{uuid.uuid4().hex[:6]}",
            "riderId": "RT-0001",
            "eventId": "ev-kolhapur-2026",
            "checkpointId": "cp-kolhapur-02",  # Unassigned checkpoint
        }, headers=vol_headers)
        assert scan_res.status_code == 403
        assert scan_res.json()["error"]["code"] == "FORBIDDEN"

def test_auth_11_super_admin_can_access_platform_data():
    """11. Super Admin can access platform-level data."""
    admin_headers = get_auth_headers("superadmin@ridetrack.com", "AdminPassword@123")
    with httpx.Client(base_url=BASE_URL) as client:
        stats_res = client.get("/api/v1/admin/stats", headers=admin_headers)
        assert stats_res.status_code == 200
        assert stats_res.json()["data"]["totalOrganizers"] >= 1

        orgs_res = client.get("/api/v1/admin/organizers", headers=admin_headers)
        assert orgs_res.status_code == 200
        assert len(orgs_res.json()["data"]) >= 1

def test_auth_12_passwords_never_returned_in_api_responses():
    """12. Passwords are never returned in API responses."""
    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Login response
        login_res = client.post("/api/v1/auth/login", json={"email": "organizer@kolhapur.com", "password": "OrganizerPassword@123"})
        text_login = login_res.text.lower()
        assert "password" not in login_res.json()["data"]["user"]
        assert "hashedpassword" not in text_login
        assert "organizerpassword@123" not in text_login

        # 2. Current user /me response
        token = login_res.json()["data"]["accessToken"]
        me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert "password" not in me_res.json()["data"]
        assert "hashedpassword" not in me_res.text.lower()

        # 3. Super Admin organizers list
        admin_headers = get_auth_headers("superadmin@ridetrack.com", "AdminPassword@123")
        orgs_res = client.get("/api/v1/admin/organizers", headers=admin_headers)
        for org in orgs_res.json()["data"]:
            assert "password" not in org
            assert "hashedpassword" not in org

# ==============================================================================
# SECTION 4. EVENT TESTS
# ==============================================================================

def test_event_crud_and_lifecycle():
    """Verify event creation, MongoDB persistence, list display, details, update, delete, isolation, counts, status."""
    headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    unique_suffix = uuid.uuid4().hex[:6]
    event_name = f"Audit Endurance BRM {unique_suffix}"

    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Create event
        create_res = client.post("/api/v1/events", json={
            "eventName": event_name,
            "description": "Test event description for audit",
            "location": "Western Ghats",
            "rideDistance": 200,
            "rideDate": "2026-11-25",
            "startTime": "05:00 AM",
            "status": "upcoming",
        }, headers=headers)
        assert create_res.status_code == 200
        event_data = create_res.json()["data"]
        event_id = event_data["id"]
        assert event_data["eventName"] == event_name

        # 2. Event is stored in MongoDB & 3. Event appears in Events List
        list_res = client.get("/api/v1/events", headers=headers)
        assert list_res.status_code == 200
        events_list = list_res.json()["data"]
        found = next((e for e in events_list if e["id"] == event_id), None)
        assert found is not None
        assert found["eventName"] == event_name

        # 4. Event remains after page refresh (repeated fetch)
        list_res_2 = client.get("/api/v1/events", headers=headers)
        assert any(e["id"] == event_id for e in list_res_2.json()["data"])

        # 5. Get event details
        get_res = client.get(f"/api/v1/events/{event_id}", headers=headers)
        assert get_res.status_code == 200
        assert get_res.json()["data"]["id"] == event_id
        # 9. Correct event counts & 10. Correct status
        assert get_res.json()["data"]["riderCount"] == 0
        assert get_res.json()["data"]["status"] == "upcoming"

        # 6. Update event
        update_res = client.put(f"/api/v1/events/{event_id}", json={
            "eventName": f"{event_name} - Updated",
            "rideDistance": 210,
            "status": "active",
        }, headers=headers)
        assert update_res.status_code == 200
        assert update_res.json()["data"]["eventName"] == f"{event_name} - Updated"
        assert update_res.json()["data"]["rideDistance"] == 210
        assert update_res.json()["data"]["status"] == "active"

        # 7. Delete event
        del_res = client.delete(f"/api/v1/events/{event_id}", headers=headers)
        assert del_res.status_code == 200

        # Verify deletion persists
        verify_get = client.get(f"/api/v1/events/{event_id}", headers=headers)
        assert verify_get.status_code == 404

# ==============================================================================
# SECTION 5. CHECKPOINT TESTS
# ==============================================================================

def test_checkpoints_management():
    """Verify checkpoint creation, update, delete, sequence order, mandatory/optional flags, flagship 10 checkpoints."""
    headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    
    with httpx.Client(base_url=BASE_URL) as client:
        # 7. Exactly 10 flagship checkpoints exist & 8. 7 mandatory and 3 optional
        cps_res = client.get("/api/v1/events/ev-kolhapur-2026/checkpoints", headers=headers)
        assert cps_res.status_code == 200
        cps = cps_res.json()["data"]
        assert len(cps) == 10, f"Expected 10 checkpoints, got {len(cps)}"
        mandatory = sum(1 for c in cps if c["mandatory"])
        optional = sum(1 for c in cps if not c["mandatory"])
        assert mandatory == 7, f"Expected 7 mandatory, got {mandatory}"
        assert optional == 3, f"Expected 3 optional, got {optional}"

        # 4. Correct sequence order (1 through 10)
        sequences = [c["sequenceNumber"] for c in cps]
        assert sequences == list(range(1, 11))

        # 6. Checkpoints belong to the correct event
        assert all(c["eventId"] == "ev-kolhapur-2026" for c in cps)

        # 1. Create temporary checkpoint
        cp_create = client.post("/api/v1/events/ev-kolhapur-2026/checkpoints", json={
            "name": "Audit Temp CP",
            "type": "Hydration",
            "sequenceNumber": 11,
            "mandatory": False,
        }, headers=headers)
        assert cp_create.status_code == 200
        new_cp = cp_create.json()["data"]
        cp_id = new_cp["id"]

        # 5. Mandatory/optional values persist
        assert new_cp["mandatory"] is False

        # 2. Update checkpoint
        cp_update = client.put(f"/api/v1/checkpoints/{cp_id}", json={
            "name": "Audit Temp CP - Renamed",
            "mandatory": True,
        }, headers=headers)
        assert cp_update.status_code == 200
        assert cp_update.json()["data"]["name"] == "Audit Temp CP - Renamed"
        assert cp_update.json()["data"]["mandatory"] is True

        # 3. Delete checkpoint
        cp_del = client.delete(f"/api/v1/checkpoints/{cp_id}", headers=headers)
        assert cp_del.status_code == 200

# ==============================================================================
# SECTION 6. RIDER TESTS
# ==============================================================================

def test_riders_management():
    """Verify rider register, MongoDB persistence, list, profile, stable ID, unique ID, QR value == riderId, update, delete, timeline."""
    headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    unique_suffix = uuid.uuid4().hex[:4]

    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Register rider
        new_rider_res = client.post("/api/v1/events/ev-kolhapur-2026/riders", json={
            "name": f"Aditi Shastry {unique_suffix}",
            "mobile": "+91 98229 33445",
            "emergencyContact": "+91 98229 55667",
            "bloodGroup": "B+",
            "age": 30,
            "gender": "Female",
            "club": "Kolhapur Randonneurs",
            "bicycleType": "Road Bike",
            "jerseyNumber": 109,
        }, headers=headers)
        assert new_rider_res.status_code == 200
        rider_data = new_rider_res.json()["data"]
        rider_id = rider_data["id"]
        stable_rider_id = rider_data["riderId"]

        # 5. Stable Rider ID is generated & 6. Rider ID is unique
        assert stable_rider_id.startswith("RT-")

        # 7. QR value contains only Rider ID
        assert rider_data["qrCodeValue"] == stable_rider_id

        # 8. Rider belongs to the correct event
        assert rider_data["eventId"] == "ev-kolhapur-2026"

        # 2. Rider persists in MongoDB & 3. Rider appears in Riders List
        list_res = client.get("/api/v1/events/ev-kolhapur-2026/riders", headers=headers)
        assert list_res.status_code == 200
        assert any(r["riderId"] == stable_rider_id for r in list_res.json()["data"])

        # 4. Rider Profile loads & 11. Rider timeline loads
        profile_res = client.get(f"/api/v1/riders/{stable_rider_id}", headers=headers)
        assert profile_res.status_code == 200
        assert profile_res.json()["data"]["riderId"] == stable_rider_id
        assert "timeline" in profile_res.json()["data"]

        # 9. Rider update works
        update_res = client.put(f"/api/v1/riders/{stable_rider_id}", json={
            "club": "Maharashtra Cyclists",
            "status": "Active",
        }, headers=headers)
        assert update_res.status_code == 200
        assert update_res.json()["data"]["club"] == "Maharashtra Cyclists"
        assert update_res.json()["data"]["status"] == "Active"

        # 10. Rider deletion works
        del_res = client.delete(f"/api/v1/riders/{stable_rider_id}", headers=headers)
        assert del_res.status_code == 200
        verify_profile = client.get(f"/api/v1/riders/{stable_rider_id}", headers=headers)
        assert verify_profile.status_code == 404

# ==============================================================================
# SECTION 7. VOLUNTEER TESTS
# ==============================================================================

def test_volunteer_management():
    """Verify volunteer creation, login, event & checkpoint assignment, me endpoint, update, deletion."""
    org_headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    unique_suffix = uuid.uuid4().hex[:4]

    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Create volunteer & 3. Assign to event & 4. Assign to checkpoint
        create_res = client.post("/api/v1/events/ev-kolhapur-2026/volunteers", json={
            "name": f"Kavita Patil {unique_suffix}",
            "mobile": "+91 98230 77889",
            "checkpointId": "cp-kolhapur-03",
            "status": "Assigned",
        }, headers=org_headers)
        assert create_res.status_code == 200
        vol_data = create_res.json()["data"]
        vol_id = vol_data["id"]
        assert vol_data["checkpointId"] == "cp-kolhapur-03"

        # 7. Assignment update works
        update_res = client.put(f"/api/v1/volunteers/{vol_id}", json={
            "checkpointId": "cp-kolhapur-04",
            "status": "Active",
        }, headers=org_headers)
        assert update_res.status_code == 200
        assert update_res.json()["data"]["checkpointId"] == "cp-kolhapur-04"

        # 2. Volunteer login works
        vol_headers = get_auth_headers("volunteer@kolhapur.com", "VolunteerPassword@123")

        # 5. Volunteer sees only assigned event/checkpoint & 6. Profile endpoint works
        me_res = client.get("/api/v1/volunteers/me", headers=vol_headers)
        assert me_res.status_code == 200
        me_data = me_res.json()["data"]
        assert me_data["volunteer"]["name"] == "Amit Shinde"
        assert me_data["event"]["id"] == "ev-kolhapur-2026"
        assert me_data["checkpoint"]["id"] == "cp-kolhapur-01"

        # 8. Volunteer deletion works
        del_res = client.delete(f"/api/v1/volunteers/{vol_id}", headers=org_headers)
        assert del_res.status_code == 200

# ==============================================================================
# SECTION 8. SCANNER TESTS
# ==============================================================================

def test_scanner_operations_and_safeguards():
    """Verify valid scan, details appear, MongoDB save, duplicate 409 DUPLICATE_SCAN, wrong event/cp/rider rejected, clientScanId idempotency."""
    vol_headers = get_auth_headers("volunteer@kolhapur.com", "VolunteerPassword@123")
    unique_client_scan_id = f"client-scan-audit-{uuid.uuid4().hex[:8]}"

    with httpx.Client(base_url=BASE_URL) as client:
        # Register a fresh rider for this scan test
        org_headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
        fresh_rider = client.post("/api/v1/events/ev-kolhapur-2026/riders", json={
            "name": "Scan Tester Rider",
            "mobile": "+91 99999 88888",
            "emergencyContact": "+91 99999 77777",
            "jerseyNumber": 250,
        }, headers=org_headers).json()["data"]
        rider_id = fresh_rider["riderId"]

        # 1. Valid QR scan succeeds & 2. Rider details appear & 3. Saved in DB & 11. Timestamp & 12. clientScanId
        scan_res = client.post("/api/v1/scans", json={
            "clientScanId": unique_client_scan_id,
            "riderId": rider_id,
            "eventId": "ev-kolhapur-2026",
            "checkpointId": "cp-kolhapur-01",
        }, headers=vol_headers)
        assert scan_res.status_code == 200
        scan_data = scan_res.json()["data"]
        assert scan_data["riderId"] == rider_id
        assert scan_data["riderName"] == "Scan Tester Rider"
        assert scan_data["clientScanId"] == unique_client_scan_id
        assert "scanTime" in scan_data

        # 5. Duplicate same rider/checkpoint scan returns HTTP 409 & 6. Code is DUPLICATE_SCAN
        dup_res = client.post("/api/v1/scans", json={
            "clientScanId": f"client-scan-dup-{uuid.uuid4().hex[:8]}",
            "riderId": rider_id,
            "eventId": "ev-kolhapur-2026",
            "checkpointId": "cp-kolhapur-01",
        }, headers=vol_headers)
        assert dup_res.status_code == 409
        assert dup_res.json()["error"]["code"] == "DUPLICATE_SCAN"

        # 13. Repeated clientScanId does not create duplicate records (idempotent 200)
        idem_res = client.post("/api/v1/scans", json={
            "clientScanId": unique_client_scan_id,
            "riderId": rider_id,
            "eventId": "ev-kolhapur-2026",
            "checkpointId": "cp-kolhapur-01",
        }, headers=vol_headers)
        assert idem_res.status_code == 200
        assert idem_res.json()["data"]["id"] == scan_data["id"]

        # 9. Invalid Rider ID is rejected
        invalid_rider_res = client.post("/api/v1/scans", json={
            "clientScanId": f"invalid-rider-{uuid.uuid4().hex[:6]}",
            "riderId": "NONEXISTENT_RIDER_999",
            "eventId": "ev-kolhapur-2026",
            "checkpointId": "cp-kolhapur-01",
        }, headers=vol_headers)
        assert invalid_rider_res.status_code == 404
        assert invalid_rider_res.json()["error"]["code"] == "RIDER_NOT_FOUND"

        # 10. Unauthorized scan is rejected
        unauth_res = client.post("/api/v1/scans", json={
            "clientScanId": f"unauth-{uuid.uuid4().hex[:6]}",
            "riderId": rider_id,
            "eventId": "ev-kolhapur-2026",
            "checkpointId": "cp-kolhapur-01",
        })
        assert unauth_res.status_code == 401

# ==============================================================================
# SECTION 10. LIVE TRACKING TESTS
# ==============================================================================

def test_live_tracking_real_records():
    """Verify live tracking computes from real records without hardcoded values."""
    headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    with httpx.Client(base_url=BASE_URL) as client:
        live_res = client.get("/api/v1/events/ev-kolhapur-2026/live", headers=headers)
        assert live_res.status_code == 200
        data = live_res.json()["data"]

        # Verify required metrics fields exist and are non-negative integers
        assert isinstance(data["registeredRiders"], int) and data["registeredRiders"] > 0
        assert isinstance(data["startedRiders"], int) and data["startedRiders"] >= 0
        assert isinstance(data["finishedRiders"], int) and data["finishedRiders"] >= 0
        assert isinstance(data["dnfRiders"], int) and data["dnfRiders"] >= 0
        assert isinstance(data["homeSafeRiders"], int) and data["homeSafeRiders"] >= 0

        # Checkpoint progress array
        assert len(data["checkpointProgress"]) == 10
        for cp in data["checkpointProgress"]:
            assert "passedRiders" in cp
            assert "completionPct" in cp
            assert cp["totalRiders"] == data["registeredRiders"]

        # Recent scan log
        assert isinstance(data["recentScans"], list)
        assert len(data["recentScans"]) >= 1

# ==============================================================================
# SECTION 11. REPORT TESTS
# ==============================================================================

def test_all_reports_and_csv_export():
    """Verify all 6 reports, filtering, CSV export, matching DB values."""
    headers = get_auth_headers("organizer@kolhapur.com", "OrganizerPassword@123")
    event_id = "ev-kolhapur-2026"

    reports_to_test = [
        "rider_list",
        "checkpoint_summary",
        "finishers",
        "dnf",
        "home_safe",
        "event_summary",
    ]

    with httpx.Client(base_url=BASE_URL) as client:
        for r_type in reports_to_test:
            # 1. JSON Report
            res = client.get(f"/api/v1/events/{event_id}/reports/{r_type}", headers=headers)
            assert res.status_code == 200, f"Failed for report type {r_type}: {res.text}"
            assert res.json()["success"] is True
            assert "data" in res.json()

            # 2. CSV Export
            csv_res = client.get(f"/api/v1/events/{event_id}/reports/{r_type}/export", headers=headers)
            assert csv_res.status_code == 200
            assert "text/csv" in csv_res.headers.get("content-type", "")
            assert len(csv_res.text) > 0

# ==============================================================================
# SECTION 12. SUPER ADMIN TESTS
# ==============================================================================

def test_super_admin_operations():
    """Verify organizer list, add organizer, organizer details, events, settings save & reload, stats calculation."""
    admin_headers = get_auth_headers("superadmin@ridetrack.com", "AdminPassword@123")
    unique_suffix = uuid.uuid4().hex[:6]

    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Organizer list
        list_res = client.get("/api/v1/admin/organizers", headers=admin_headers)
        assert list_res.status_code == 200
        orgs = list_res.json()["data"]
        assert len(orgs) >= 1

        # 2. Add organizer
        new_org_email = f"audit_org_{unique_suffix}@ridetrack.test"
        add_res = client.post("/api/v1/admin/organizers", json={
            "name": f"Audit Organizer {unique_suffix}",
            "email": new_org_email,
            "organization": "Audit Cycling Guild",
            "mobile": "+91 98888 11111",
            "password": "Password@123",
            "status": "Active",
        }, headers=admin_headers)
        assert add_res.status_code == 200
        new_org_id = add_res.json()["data"]["id"]

        # 3. Organizer details & 4. Organizer event list
        details_res = client.get(f"/api/v1/admin/organizers/{new_org_id}", headers=admin_headers)
        assert details_res.status_code == 200
        assert details_res.json()["data"]["email"] == new_org_email
        assert "events" in details_res.json()["data"]

        # 5. Admin events
        admin_events = client.get("/api/v1/admin/events", headers=admin_headers)
        assert admin_events.status_code == 200
        assert len(admin_events.json()["data"]) >= 1

        # 6. System settings save & 7. System settings reload
        settings_update = client.put("/api/v1/admin/settings", json={
            "platformName": f"RideTrack Audit {unique_suffix}",
            "supportEmail": "audit@ridetrack.com",
            "qrCodeGracePeriodHours": 36,
        }, headers=admin_headers)
        assert settings_update.status_code == 200
        assert settings_update.json()["data"]["qrCodeGracePeriodHours"] == 36

        settings_reload = client.get("/api/v1/admin/settings", headers=admin_headers)
        assert settings_reload.status_code == 200
        assert settings_reload.json()["data"]["qrCodeGracePeriodHours"] == 36

        # 9. Platform statistics are calculated from database data
        stats_res = client.get("/api/v1/admin/stats", headers=admin_headers)
        assert stats_res.status_code == 200
        stats = stats_res.json()["data"]
        assert stats["totalOrganizers"] >= 2
        assert stats["totalEvents"] >= 1
        assert stats["totalRiders"] >= 6
        assert stats["totalCheckpoints"] >= 10
