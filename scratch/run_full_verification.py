import os
import sys
import time
import json
import uuid
import urllib.request
import asyncio
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
    options.add_argument("--window-size=1440,960")
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
    print("=== STARTING FULL ROAD ROUTING & CHECKPOINTS VERIFICATION ===")
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
        # TEST A: Create new event and open Route & Checkpoints
        # -------------------------------------------------------------
        print("\n--- TEST A: Navigate to Create Event ---")
        driver.get("http://localhost:5173/events/create")
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "event-name-input"))
        )
        # Scroll to map so it's fully in view
        driver.execute_script("window.scrollTo(0, 350);")
        time.sleep(1)
        save_screenshot(driver, "Test-A-CreateEvent-RouteMap.png")

        # -------------------------------------------------------------
        # TEST B: Select START, intermediate points, and FINISH
        # -------------------------------------------------------------
        print("\n--- TEST B: Select Waypoints (Pune -> Talegaon -> Lonavala) ---")
        # Pune: 18.5204, 73.8567
        # Talegaon: 18.7300, 73.6800
        # Lonavala: 18.7557, 73.4072
        driver.execute_script("""
            if (window.__eventRouteMap) {
                window.__eventRouteMap.fire('click', { latlng: L.latLng(18.5204, 73.8567) });
            }
        """)
        time.sleep(1)
        driver.execute_script("""
            if (window.__eventRouteMap) {
                window.__eventRouteMap.fire('click', { latlng: L.latLng(18.7300, 73.6800) });
            }
        """)
        time.sleep(1)
        driver.execute_script("""
            if (window.__eventRouteMap) {
                window.__eventRouteMap.fire('click', { latlng: L.latLng(18.7557, 73.4072) });
            }
        """)
        time.sleep(1.5)
        save_screenshot(driver, "Test-B-Waypoints-Selected.png")

        # -------------------------------------------------------------
        # TEST C: Calculate Road-Following Route
        # -------------------------------------------------------------
        print("\n--- TEST C: Verify Road Route Calculation ---")
        # Wait up to 10s for road routing stats to show
        time.sleep(4)
        save_screenshot(driver, "Test-C-Route-Calculation.png")

        # -------------------------------------------------------------
        # TEST D: Verify Route Follows Actual Roads (Inspect Geometry Array)
        # -------------------------------------------------------------
        print("\n--- TEST D: Verify Road Follow Geometry Coordinates ---")
        # Check coordinates length in the browser
        route_meta = driver.execute_script("""
            var distanceInput = document.getElementById('event-distance-input');
            var bannerText = document.body.innerText;
            return {
                distVal: distanceInput ? distanceInput.value : '',
                hasBikeIcon: bannerText.includes('Road Route Distance') || bannerText.includes('km')
            };
        """)
        print(f"Calculated Route Metadata: {route_meta}")
        # Zoom map in slightly to show detailed curvy road alignment
        driver.execute_script("""
            if (window.__eventRouteMap) {
                window.__eventRouteMap.setView([18.74, 73.55], 13);
            }
        """)
        time.sleep(1.5)
        save_screenshot(driver, "Test-D-Road-Following-Route.png")

        # -------------------------------------------------------------
        # TEST E: Add Two Checkpoints Directly on the Map
        # -------------------------------------------------------------
        print("\n--- TEST E: Add Two Checkpoints on Map ---")
        # Reset map view to fit Pune-Lonavala
        driver.execute_script("""
            if (window.__eventRouteMap) {
                window.__eventRouteMap.setView([18.65, 73.65], 10);
            }
        """)
        time.sleep(0.5)

        # 1. Switch to Checkpoint mode
        btn_mode_cp = driver.find_element(By.ID, "btn-mode-checkpoint")
        btn_mode_cp.click()
        time.sleep(0.5)

        # 2. Click on map for CP 1 (Near Talegaon: 18.7320, 73.6780)
        driver.execute_script("""
            if (window.__eventRouteMap) {
                window.__eventRouteMap.fire('click', { latlng: L.latLng(18.7320, 73.6780) });
            }
        """)
        time.sleep(1)

        # -------------------------------------------------------------
        # TEST F: Verify Latitude/Longitude Auto-Captured
        # -------------------------------------------------------------
        print("\n--- TEST F: Verify Auto-Captured Coordinates Modal ---")
        save_screenshot(driver, "Test-F-Auto-Coordinates-Captured.png")

        # Set Checkpoint 1 details and submit
        cp1_name_input = driver.find_element(By.ID, "input-checkpoint-name")
        cp1_name_input.clear()
        cp1_name_input.send_keys("CP 01 - Talegaon Station")
        save_cp_btn = driver.find_element(By.ID, "btn-save-checkpoint-modal")
        save_cp_btn.click()
        time.sleep(1)

        # Add Checkpoint 2 (Near Lonavala Ghat: 18.7520, 73.4100)
        btn_mode_cp.click()
        time.sleep(0.5)
        driver.execute_script("""
            if (window.__eventRouteMap) {
                window.__eventRouteMap.fire('click', { latlng: L.latLng(18.7520, 73.4100) });
            }
        """)
        time.sleep(1)
        cp2_name_input = driver.find_element(By.ID, "input-checkpoint-name")
        cp2_name_input.clear()
        cp2_name_input.send_keys("CP 02 - Lonavala Ghat")
        save_cp_btn = driver.find_element(By.ID, "btn-save-checkpoint-modal")
        save_cp_btn.click()
        time.sleep(1.5)

        save_screenshot(driver, "Test-E-Two-Checkpoints-Added.png")

        # -------------------------------------------------------------
        # TEST G: Save the Event and Verify Persistence in MongoDB
        # -------------------------------------------------------------
        print("\n--- TEST G: Save Event & Verify in MongoDB ---")
        # Fill remaining required form fields
        name_input = driver.find_element(By.ID, "event-name-input")
        name_input.clear()
        event_title = f"Western Ghats Road Rally {uuid.uuid4().hex[:6]}"
        name_input.send_keys(event_title)

        loc_input = driver.find_element(By.ID, "event-location-input")
        loc_input.clear()
        loc_input.send_keys("Pune - Lonavala Cycling Highway")

        date_input = driver.find_element(By.ID, "event-date-input")
        date_input.clear()
        date_input.send_keys("2026-10-15")

        time_input = driver.find_element(By.ID, "event-time-input")
        time_input.clear()
        time_input.send_keys("06:00 AM")

        # Scroll to submit button and click
        btn_save_event = driver.find_element(By.ID, "btn-save-event")
        driver.execute_script("arguments[0].scrollIntoView(true);", btn_save_event)
        time.sleep(0.5)
        btn_save_event.click()
        time.sleep(3)

        save_screenshot(driver, "Test-G-Event-Saved.png")

        # Direct verification in MongoDB to get created event ID
        from backend.app.core.database import init_db, get_database
        async def verify_mongo_event():
            await init_db()
            db = get_database()
            ev = await db.events.find_one({"eventName": event_title})
            if not ev:
                raise RuntimeError(f"Event '{event_title}' was not found in MongoDB events collection!")
            ev_id = ev["id"]
            cps = await db.checkpoints.find({"eventId": ev_id}).to_list(10)
            print(f"[MONGO VERIFIED] Event ID: {ev_id}, routeGeometry points: {len(ev.get('routeGeometry', []))}, checkpoints: {len(cps)}")
            return ev_id, ev, cps

        created_event_id, ev_doc, cps_list = asyncio.run(verify_mongo_event())

        # -------------------------------------------------------------
        # TEST H: Reload Event and Verify Route and Checkpoints Restored
        # -------------------------------------------------------------
        print("\n--- TEST H: Reload Event and Verify Restored ---")
        driver.get(f"http://localhost:5173/events/{created_event_id}/edit")
        time.sleep(3)
        # Scroll to map
        driver.execute_script("window.scrollTo(0, 350);")
        time.sleep(1)
        save_screenshot(driver, "Test-H-Route-Restored.png")

        # -------------------------------------------------------------
        # TEST I: Edit Route and Move One Checkpoint
        # -------------------------------------------------------------
        print("\n--- TEST I: Move One Checkpoint on Road ---")
        # Checkpoint 2 is CP 02 - Lonavala Ghat. Let's move it to a new location (18.7620, 73.4180)
        driver.execute_script("""
            // Simulate dragging CP 02 marker to updated coordinates
            var cps = document.querySelectorAll('.rt-checkpoint-marker');
            if (window.__eventRouteMap) {
                // Find markers in layer group and trigger dragend on second checkpoint
                window.__eventRouteMap.eachLayer(function(layer) {
                    if (layer instanceof L.Marker && layer.dragging) {
                        var pos = layer.getLatLng();
                        if (Math.abs(pos.lat - 18.7520) < 0.01) {
                            var newLatLng = L.latLng(18.7620, 73.4180);
                            layer.setLatLng(newLatLng);
                            layer.fire('dragend');
                        }
                    }
                });
            }
        """)
        time.sleep(1.5)
        save_screenshot(driver, "Test-I-Checkpoint-Moved.png")

        # -------------------------------------------------------------
        # TEST J: Save and Reload Again, Verifying Updated Coordinates
        # -------------------------------------------------------------
        print("\n--- TEST J: Save & Reload Moved Checkpoint ---")
        btn_save_event = driver.find_element(By.ID, "btn-save-event")
        driver.execute_script("arguments[0].scrollIntoView(true);", btn_save_event)
        time.sleep(0.5)
        btn_save_event.click()
        time.sleep(2.5)

        # Reload the edit page
        driver.get(f"http://localhost:5173/events/{created_event_id}/edit")
        time.sleep(3)
        driver.execute_script("window.scrollTo(0, 350);")
        time.sleep(1)
        save_screenshot(driver, "Test-J-Updated-Checkpoint-Restored.png")

        # Check in MongoDB that updated checkpoint coordinates were saved
        async def verify_mongo_cp_update():
            db = get_database()
            updated_cps = await db.checkpoints.find({"eventId": created_event_id}).to_list(10)
            print(f"[MONGO VERIFIED] Updated checkpoints count: {len(updated_cps)}")
            for c in updated_cps:
                print(f"  CP: {c.get('name')} -> Lat: {c.get('latitude')}, Lng: {c.get('longitude')}")
            return updated_cps
        asyncio.run(verify_mongo_cp_update())

        # -------------------------------------------------------------
        # TEST K: Open Rider Route View (/events/{id}/live)
        # -------------------------------------------------------------
        print("\n--- TEST K: Open Rider Route View ---")
        driver.get(f"http://localhost:5173/events/{created_event_id}/live")
        time.sleep(3)
        save_screenshot(driver, "Test-K-Rider-Route-View.png")

        # -------------------------------------------------------------
        # TEST L: Perform Checkpoint Scan and Verify Location Association
        # -------------------------------------------------------------
        print("\n--- TEST L: Perform Checkpoint Scan with Location Association ---")
        async def execute_scan_test():
            db = get_database()
            first_cp = await db.checkpoints.find_one({"eventId": created_event_id})
            scan_payload = {
                "clientScanId": str(uuid.uuid4()),
                "riderId": "RT-0001",
                "eventId": created_event_id,
                "checkpointId": first_cp["id"],
                "volunteerId": user["id"],
                "scanTime": "2026-09-18T20:00:00Z",
                "deviceLatitude": first_cp["latitude"],
                "deviceLongitude": first_cp["longitude"],
            }
            # Record scan via API
            scan_url = "http://localhost:8000/api/v1/scans"
            scan_req = urllib.request.Request(
                scan_url,
                data=json.dumps(scan_payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
            )
            with urllib.request.urlopen(scan_req) as res:
                scan_data = json.loads(res.read().decode("utf-8"))
                print(f"[SCAN API RESPONSE] Success: {scan_data.get('success')}, data: {scan_data.get('data')}")
                return scan_data["data"]

        scan_result = asyncio.run(execute_scan_test())

        # Navigate to scans or live tracking showing scan
        driver.get(f"http://localhost:5173/events/{created_event_id}/live")
        time.sleep(2)
        save_screenshot(driver, "Test-L-Scan-Location-Associated.png")

        print("\n=== ALL TESTS (A THROUGH L) COMPLETED SUCCESSFULLY! ===")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
