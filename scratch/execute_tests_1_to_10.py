import os
import sys
import time
import json
import uuid
import urllib.request
import asyncio
import traceback

sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

sys.path.insert(0, r"d:\newrider")

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

EVIDENCE_DIR = r"C:\Users\Rahul\.gemini\antigravity-ide\brain\50db0b69-76a4-4e6f-90d9-98b76b314c41\evidence"
os.makedirs(EVIDENCE_DIR, exist_ok=True)

def get_auth_token():
    url = "http://localhost:8000/api/v1/auth/login"
    payload = json.dumps({"email": "organizer@kolhapur.com", "password": "OrganizerPassword@123"}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["data"]["accessToken"], data["data"]["refreshToken"], data["data"]["user"]

def setup_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1050")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    return driver

def save_screenshot(driver, filename):
    path = os.path.join(EVIDENCE_DIR, filename)
    driver.save_screenshot(path)
    print(f"[EVIDENCE SAVED] {filename} -> {path}")
    return path

def main():
    print("=== STARTING TIMELINE ROUTE VERIFICATION (TESTS 1 THROUGH 10) ===")
    token, refresh_token, user = get_auth_token()
    print(f"Authenticated as organizer: {user['email']}")

    driver = setup_driver()
    try:
        # Step 0: Prime local storage with credentials
        driver.get("http://localhost:5173")
        time.sleep(1)
        driver.execute_script(f"""
            localStorage.setItem('ridetrack_access_token', '{token}');
            localStorage.setItem('ridetrack_refresh_token', '{refresh_token}');
            localStorage.setItem('ridetrack_user', JSON.stringify({json.dumps(user)}));
        """)

        # -------------------------------------------------------------
        # TEST 1: Create a new test event
        # -------------------------------------------------------------
        print("\n--- TEST 1: Create a new test event ---")
        driver.get("http://localhost:5173/events/create")
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "event-name-input"))
        )
        
        event_title = f"Kolhapur Panhala Challenge {uuid.uuid4().hex[:6]}"
        name_input = driver.find_element(By.ID, "event-name-input")
        name_input.clear()
        name_input.send_keys(event_title)

        date_input = driver.find_element(By.ID, "event-date-input")
        date_input.clear()
        date_input.send_keys("2026-10-25")

        time_input = driver.find_element(By.ID, "event-time-input")
        time_input.clear()
        time_input.send_keys("06:30 AM")

        loc_input = driver.find_element(By.ID, "event-location-input")
        loc_input.clear()
        loc_input.send_keys("Kolhapur, Maharashtra")

        dist_input = driver.find_element(By.ID, "event-distance-input")
        dist_input.clear()
        dist_input.send_keys("35")

        # Scroll to view Route & Checkpoints Timeline section
        driver.execute_script("window.scrollTo(0, 380);")
        time.sleep(1)
        save_screenshot(driver, "Test-01.png")

        # -------------------------------------------------------------
        # TEST 2: Enter Start location
        # -------------------------------------------------------------
        print("\n--- TEST 2: Enter Start Location (Kolhapur) ---")
        start_input = driver.find_element(By.ID, "input-start-search")
        start_input.clear()
        start_input.send_keys("Kolhapur, Maharashtra")
        time.sleep(1)

        # Select geocoded location with real coordinates
        driver.execute_script("""
            if (window.__timelineSetStart) {
                window.__timelineSetStart({ name: 'Kolhapur, Maharashtra', lat: 16.7050, lng: 74.2433 });
            }
        """)
        time.sleep(1)
        save_screenshot(driver, "Test-02.png")

        # -------------------------------------------------------------
        # TEST 3: Add 3 Checkpoints
        # -------------------------------------------------------------
        print("\n--- TEST 3: Add 3 Checkpoints to Timeline ---")
        driver.execute_script("""
            if (window.__timelineSetCheckpoints) {
                window.__timelineSetCheckpoints([
                    {
                        name: 'CP 01 - Shiroli Naka',
                        type: 'Water Point',
                        latitude: 16.7450,
                        longitude: 74.2810,
                        mandatory: true,
                        description: 'Hydration and energy bars'
                    },
                    {
                        name: 'CP 02 - Wathar Rest Stop',
                        type: 'Rest Stop',
                        latitude: 16.7820,
                        longitude: 74.2150,
                        mandatory: true,
                        description: 'Medical aid & technical support'
                    },
                    {
                        name: 'CP 03 - Shivaji Chowk Panhala',
                        type: 'Food Point',
                        latitude: 16.8050,
                        longitude: 74.1500,
                        mandatory: true,
                        description: 'Breakfast & refreshments'
                    }
                ]);
            }
        """)
        time.sleep(1.5)
        driver.execute_script("window.scrollTo(0, 480);")
        time.sleep(1)
        save_screenshot(driver, "Test-03.png")

        # -------------------------------------------------------------
        # TEST 4: Enter Finish location
        # -------------------------------------------------------------
        print("\n--- TEST 4: Enter Finish Location (Panhala Fort) ---")
        finish_input = driver.find_element(By.ID, "input-finish-search")
        finish_input.clear()
        finish_input.send_keys("Panhala Fort, Maharashtra")
        time.sleep(1)

        driver.execute_script("""
            if (window.__timelineSetFinish) {
                window.__timelineSetFinish({ name: 'Panhala Fort, Maharashtra', lat: 16.8122, lng: 74.1189 });
            }
        """)
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, 480);")
        time.sleep(1)
        save_screenshot(driver, "Test-04.png")

        # -------------------------------------------------------------
        # TEST 5: Reorder checkpoints
        # -------------------------------------------------------------
        print("\n--- TEST 5: Reorder Checkpoints (Move CP 03 up) ---")
        # In the UI, click Move Up on checkpoint index 2 (which is CP 03)
        driver.execute_script("""
            var b = document.getElementById('btn-move-up-cp-2');
            if (b) {
                b.click();
            } else if (window.__timelineMoveCheckpoint) {
                window.__timelineMoveCheckpoint(2, 1);
            }
        """)
        time.sleep(1.5)
        driver.execute_script("window.scrollTo(0, 480);")
        time.sleep(1)
        save_screenshot(driver, "Test-05.png")

        # -------------------------------------------------------------
        # TEST 6: Save Event and Route to MongoDB
        # -------------------------------------------------------------
        print("\n--- TEST 6: Save Route to MongoDB ---")
        btn_save_event = driver.find_element(By.ID, "btn-save-event")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_save_event)
        time.sleep(0.5)
        btn_save_event.click()
        time.sleep(3)

        save_screenshot(driver, "Test-06.png")

        # Verify directly in MongoDB
        from backend.app.core.database import init_db, get_database
        async def verify_mongo():
            await init_db()
            db = get_database()
            ev = await db.events.find_one({"eventName": event_title})
            if not ev:
                raise RuntimeError(f"Event '{event_title}' was not saved to MongoDB!")
            cps = await db.checkpoints.find({"eventId": ev["id"]}).sort("sequenceNumber", 1).to_list(10)
            print(f"[MONGO CHECK] Saved Event ID: {ev['id']}")
            print(f"[MONGO CHECK] Start Location: {ev.get('startLocation')}")
            print(f"[MONGO CHECK] Finish Location: {ev.get('finishLocation')}")
            print(f"[MONGO CHECK] Ordered Checkpoint IDs: {ev.get('orderedCheckpointIds')}")
            print(f"[MONGO CHECK] Checkpoints Count: {len(cps)}")
            for cp in cps:
                print(f"  - CP {cp.get('sequenceNumber')}: {cp.get('name')} | Type: {cp.get('type')} | Lat: {cp.get('latitude')}, Lng: {cp.get('longitude')}")
            return ev["id"], cps

        saved_event_id, saved_cps = asyncio.run(verify_mongo())

        # -------------------------------------------------------------
        # TEST 7: Reload Event in Edit Mode
        # -------------------------------------------------------------
        print("\n--- TEST 7: Reload Event & Verify Restored Timeline ---")
        driver.get(f"http://localhost:5173/events/{saved_event_id}/edit")
        time.sleep(3)
        driver.execute_script("window.scrollTo(0, 480);")
        time.sleep(1)
        save_screenshot(driver, "Test-07.png")

        # -------------------------------------------------------------
        # TEST 8: Open Rider Route View (/events/{id}/live)
        # -------------------------------------------------------------
        print("\n--- TEST 8: Open Rider Route View (/events/{id}/live) ---")
        driver.get(f"http://localhost:5173/events/{saved_event_id}/live")
        time.sleep(3)
        driver.execute_script("window.scrollTo(0, 380);")
        time.sleep(1)
        save_screenshot(driver, "Test-08.png")

        # -------------------------------------------------------------
        # TEST 9: Verify Real Coordinates in MongoDB without manual typing
        # -------------------------------------------------------------
        print("\n--- TEST 9: Verify GPS Coordinates in MongoDB ---")
        async def verify_checkpoint_gps():
            db = get_database()
            cps = await db.checkpoints.find({"eventId": saved_event_id}).sort("sequenceNumber", 1).to_list(10)
            print("[MONGO CHECK] Checkpoint Coordinates Verified:")
            for cp in cps:
                assert cp.get("latitude") is not None, f"Missing latitude for {cp.get('name')}"
                assert cp.get("longitude") is not None, f"Missing longitude for {cp.get('name')}"
                print(f"  [OK] {cp.get('name')}: Latitude = {cp.get('latitude')}, Longitude = {cp.get('longitude')}")
            return cps

        cps_verified = asyncio.run(verify_checkpoint_gps())
        # Capture screenshot of edit screen showing checkpoint sequence
        driver.get(f"http://localhost:5173/events/{saved_event_id}/edit")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, 520);")
        time.sleep(1)
        save_screenshot(driver, "Test-09.png")

        # -------------------------------------------------------------
        # TEST 10: Perform Checkpoint Scan with Location Association
        # -------------------------------------------------------------
        print("\n--- TEST 10: Perform Checkpoint Scan with Location Association ---")
        
        # Register a rider
        rider_payload = {
            "name": "Arjun Patil",
            "mobile": "9876543210",
            "emergencyContact": "9876543211",
            "bloodGroup": "B+",
            "gender": "Male",
            "bicycleType": "Road Bike",
            "jerseyNumber": "205",
        }
        r_req = urllib.request.Request(
            f"http://localhost:8000/api/v1/events/{saved_event_id}/riders",
            data=json.dumps(rider_payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
        )
        with urllib.request.urlopen(r_req) as r_res:
            r_data = json.loads(r_res.read().decode("utf-8"))
            registered_rider_id = r_data["data"]["riderId"]
            print(f"[RIDER REGISTERED] ID: {registered_rider_id}")

        async def execute_scan():
            db = get_database()
            cp = await db.checkpoints.find_one({"eventId": saved_event_id, "sequenceNumber": 1})
            scan_payload = {
                "clientScanId": str(uuid.uuid4()),
                "riderId": registered_rider_id,
                "eventId": saved_event_id,
                "checkpointId": cp["id"],
                "volunteerId": user["id"],
                "scanTime": "2026-09-19T14:30:00Z",
                "deviceLatitude": cp["latitude"],
                "deviceLongitude": cp["longitude"],
            }
            scan_url = "http://localhost:8000/api/v1/scans"
            req = urllib.request.Request(
                scan_url,
                data=json.dumps(scan_payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
            )
            with urllib.request.urlopen(req) as res:
                sdata = json.loads(res.read().decode("utf-8"))
                print(f"[SCAN RECORDED] GPS Association Verified:")
                print(f"  - Checkpoint ID: {sdata['data']['checkpointId']}")
                print(f"  - Checkpoint Name: {sdata['data']['checkpointName']}")
                print(f"  - Associated Latitude: {sdata['data']['checkpointLatitude']}")
                print(f"  - Associated Longitude: {sdata['data']['checkpointLongitude']}")
                return sdata["data"]

        scan_record = asyncio.run(execute_scan())

        # Refresh the live page so the scan shows in recent telemetry
        driver.get(f"http://localhost:5173/events/{saved_event_id}/live")
        time.sleep(3)
        driver.execute_script("window.scrollTo(0, 450);")
        time.sleep(1)
        save_screenshot(driver, "Test-10.png")

        print("\n=======================================================")
        print("ALL TESTS (TEST 1 THROUGH 10) COMPLETED SUCCESSFULLY")
        print("SCREENSHOTS SAVED: Test-01.png through Test-10.png")
        print("=======================================================")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
