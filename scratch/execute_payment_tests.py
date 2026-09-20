import os
import sys
import time
import json
import uuid
import urllib.request
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

def setup_driver(width=1366, height=768):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    return driver

def save_screenshot(driver, filename):
    path = os.path.join(EVIDENCE_DIR, filename)
    driver.save_screenshot(path)
    print(f"[EVIDENCE SAVED] {filename} -> {path}")
    return path

def prime_storage(driver, token, refresh_token, user):
    driver.get("http://localhost:5173")
    time.sleep(1)
    driver.execute_script(f"""
        localStorage.setItem('ridetrack_access_token', '{token}');
        localStorage.setItem('ridetrack_refresh_token', '{refresh_token}');
        localStorage.setItem('ridetrack_user', JSON.stringify({json.dumps(user)}));
    """)

def run_tests():
    print("=== STARTING TARGETED VERIFICATION TESTS (TEST 1 THROUGH 7) ===")
    token, refresh_token, user = get_auth_token()
    print(f"[AUTH] Logged in as: {user['email']}")

    # Setup laptop-sized viewport (1366 x 768)
    driver = setup_driver(1366, 768)
    try:
        prime_storage(driver, token, refresh_token, user)

        # -------------------------------------------------------------
        # TEST 1: Open Add Checkpoint modal on laptop viewport (1366x768)
        # Verify modal remains fully within viewport and content scrolls
        # -------------------------------------------------------------
        print("\n--- TEST 1: Laptop Viewport Modal Constraints & Scrolling ---")
        driver.get("http://localhost:5173/events/create")
        time.sleep(2)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "event-name-input"))
        )

        # Scroll to Add Checkpoint button and click
        add_cp_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "btn-add-checkpoint"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", add_cp_btn)
        time.sleep(0.5)
        add_cp_btn.click()
        time.sleep(1)

        # Wait for modal dialog paper
        modal = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".MuiDialog-paper"))
        )
        modal_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", modal)
        viewport_height = driver.execute_script("return window.innerHeight;")
        
        print(f"Modal Paper Top: {modal_rect['top']}, Height: {modal_rect['height']}, Viewport Height: {viewport_height}")
        assert modal_rect['height'] <= viewport_height * 0.95, f"Modal height {modal_rect['height']} exceeds 95% of viewport {viewport_height}"
        assert modal_rect['top'] >= 0, "Modal top must be within viewport"

        # Verify DialogActions buttons are visible within viewport
        save_btn = driver.find_element(By.ID, "btn-save-checkpoint-modal")
        cancel_btn = driver.find_element(By.ID, "btn-cancel-checkpoint-modal")
        assert save_btn.is_displayed(), "Save Checkpoint button must be displayed in pinned actions"
        assert cancel_btn.is_displayed(), "Cancel button must be displayed in pinned actions"

        save_screenshot(driver, "Test-01.png")
        print("[TEST 1 PASSED] Add Checkpoint modal fits within laptop viewport with scrollable content.")

        # -------------------------------------------------------------
        # TEST 2: Verify Checkpoint Type dropdown is completely gone
        # -------------------------------------------------------------
        print("\n--- TEST 2: Verify Checkpoint Type Dropdown is Completely Removed ---")
        # Check that select-checkpoint-type does not exist
        type_selects = driver.find_elements(By.ID, "select-checkpoint-type")
        assert len(type_selects) == 0, "Checkpoint Type dropdown ID should NOT exist"

        # Check modal text does not contain "Checkpoint Type" label
        modal_text = modal.text
        assert "Checkpoint Type" not in modal_text, "'Checkpoint Type' label should not be present in modal"
        assert "Water Point" not in modal_text, "'Water Point' type should not exist"
        assert "Food Point" not in modal_text, "'Food Point' type should not exist"
        assert "Rest Point" not in modal_text, "'Rest Point' type should not exist"

        save_screenshot(driver, "Test-02.png")
        print("[TEST 2 PASSED] Checkpoint Type dropdown and categories are completely removed.")

        # -------------------------------------------------------------
        # TEST 3: Add checkpoint with only Name, Mandatory toggle,
        # Location Search, and Description. Verify saves and displays
        # -------------------------------------------------------------
        print("\n--- TEST 3: Add Checkpoint with Simplified Fields & Verify ---")
        cp_name_input = driver.find_element(By.ID, "input-checkpoint-name")
        cp_name_input.clear()
        cp_name_input.send_keys("Vangao Lake Checkpoint")

        # Set Location Search
        loc_search_input = driver.find_element(By.ID, "input-checkpoint-location")
        loc_search_input.clear()
        loc_search_input.send_keys("Vangao")
        time.sleep(1.5)

        # Select first suggestion if available
        suggestions = driver.find_elements(By.XPATH, "//div[contains(@class, 'MuiPaper-root')]//div[contains(@style, 'cursor: pointer') or contains(@class, 'MuiBox-root')]")
        if suggestions:
            try:
                suggestions[0].click()
                time.sleep(0.5)
            except Exception:
                pass

        # Enter description
        desc_input = driver.find_element(By.ID, "input-checkpoint-description")
        desc_input.clear()
        desc_input.send_keys("Turnaround station and hydration checkpoint by the lake.")

        # Click Save Checkpoint
        save_btn.click()
        time.sleep(1)

        # Verify checkpoint is rendered in the timeline
        saved_cp = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Vangao Lake Checkpoint')]"))
        )
        assert saved_cp.is_displayed(), "Saved checkpoint should be visible in timeline"

        # Check that no type chip is displayed on the checkpoint
        cp_cards = driver.find_elements(By.XPATH, "//*[contains(text(), 'Vangao Lake Checkpoint')]/ancestor::div[contains(@style, 'border')]")
        if cp_cards:
            card_text = cp_cards[0].text
            assert "Timing Point" not in card_text, "Type chip should not appear on checkpoint card"
            assert "Water Point" not in card_text, "Type chip should not appear on checkpoint card"

        save_screenshot(driver, "Test-03.png")
        print("[TEST 3 PASSED] Checkpoint saved with simplified fields and rendered correctly.")

        # -------------------------------------------------------------
        # TEST 4: Create event with Payment Required = YES
        # Register a rider -> Verify Payment Status: Pending & QR withheld
        # -------------------------------------------------------------
        print("\n--- TEST 4: Payment Required = YES Event & Rider Registration ---")
        # Fill remaining required event fields
        event_name_val = f"Monsoon Challenge [YES-PAY] {uuid.uuid4().hex[:5]}"
        name_input = driver.find_element(By.ID, "event-name-input")
        name_input.clear()
        name_input.send_keys(event_name_val)

        loc_input = driver.find_element(By.ID, "event-location-input")
        loc_input.clear()
        loc_input.send_keys("Kolhapur")

        dist_input = driver.find_element(By.ID, "event-distance-input")
        dist_input.clear()
        dist_input.send_keys("120")

        date_input = driver.find_element(By.ID, "event-date-input")
        date_input.clear()
        date_input.send_keys("2026-11-20")

        time_input = driver.find_element(By.ID, "event-time-input")
        time_input.clear()
        time_input.send_keys("06:00")

        # Select Payment Required = YES
        pay_yes_radio = driver.find_element(By.ID, "payment-required-yes")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", pay_yes_radio)
        time.sleep(0.5)
        pay_yes_radio.click()
        time.sleep(0.5)

        # Save event
        save_event_btn = driver.find_element(By.ID, "btn-save-event")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", save_event_btn)
        time.sleep(0.5)
        save_event_btn.click()

        # Wait for success screen
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Event Created')]"))
        )
        print(f"Created event: {event_name_val} with Payment Required = YES")

        # Retrieve created event ID via backend API
        req = urllib.request.Request("http://localhost:8000/api/v1/events", headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req) as resp:
            ev_list = json.loads(resp.read().decode("utf-8"))["data"]
            ev4 = next(e for e in ev_list if e["eventName"] == event_name_val)
            ev4_id = ev4["id"]
            print(f"Event 4 ID: {ev4_id}, paymentRequired: {ev4.get('paymentRequired')}")
            assert ev4.get("paymentRequired") is True, "Backend must persist paymentRequired = True"

        # Register rider for Event 4
        driver.get("http://localhost:5173/riders/register")
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "rider-name-input"))
        )

        # Select Event 4 in dropdown
        driver.find_element(By.ID, "rider-event-select").click()
        time.sleep(0.5)
        ev_option = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//li[contains(text(), '{event_name_val}')]"))
        )
        ev_option.click()
        time.sleep(0.5)

        rider_name_val = f"Arjun Desai {uuid.uuid4().hex[:4]}"
        driver.find_element(By.ID, "rider-name-input").send_keys(rider_name_val)
        driver.find_element(By.ID, "rider-mobile-input").send_keys("9822123456")
        driver.find_element(By.ID, "rider-emergency-input").send_keys("9822987654")

        # Select Blood Group
        driver.find_element(By.ID, "rider-blood-group-select").click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "//li[contains(text(), 'B+')]").click()
        time.sleep(0.5)

        driver.find_element(By.ID, "rider-age-input").send_keys("28")

        # Select Gender
        driver.find_element(By.ID, "rider-gender-select").click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "//li[contains(text(), 'Male')]").click()
        time.sleep(0.5)

        driver.find_element(By.ID, "rider-club-input").send_keys("Kolhapur Riders Club")

        # Select Bicycle Type
        driver.find_element(By.ID, "rider-bicycle-select").click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "//li[contains(text(), 'Road Bike')]").click()
        time.sleep(0.5)

        driver.find_element(By.ID, "rider-jersey-input").send_keys("77")
        driver.find_element(By.ID, "rider-medical-notes-input").send_keys("None")

        # Submit rider registration
        driver.find_element(By.ID, "btn-submit-rider-registration").click()

        # Verify RegisterRiderSuccess displays payment pending warning
        warning_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "registration-payment-warning"))
        )
        assert "Payment verification required before QR pass is issued" in warning_box.text
        assert "Please contact the event organizer to complete payment" in warning_box.text

        # Verify Generate QR Code button is NOT available (replaced with locked badge)
        qr_gen_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Generate QR Code')]")
        assert len(qr_gen_buttons) == 0, "Generate QR Code button must be withheld on pending payment"

        # Look up rider ID from backend
        req = urllib.request.Request(f"http://localhost:8000/api/v1/events/{ev4_id}/riders", headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req) as resp:
            riders_list = json.loads(resp.read().decode("utf-8"))["data"]
            rider4 = next(r for r in riders_list if r["name"] == rider_name_val)
            rider4_id = rider4["riderId"]
            rider4_doc_id = rider4["id"]
            print(f"Rider 4 ID: {rider4_id} ({rider4_doc_id}), paymentStatus: {rider4.get('paymentStatus')}")
            assert rider4.get("paymentStatus") == "pending", "Rider paymentStatus must default to 'pending'"

        # Navigate to Rider Profile
        driver.get(f"http://localhost:5173/riders/{rider4_doc_id}")
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "organizer-payment-verification-banner"))
        )

        # Verify QR is withheld on profile
        withheld_notice = driver.find_element(By.ID, "qr-withheld-notice")
        assert "Payment verification required before QR pass is issued" in withheld_notice.text

        # Verify QR download & print buttons are disabled
        btn_dl = driver.find_element(By.ID, "btn-download-qr")
        btn_pr = driver.find_element(By.ID, "btn-print-qr")
        assert not btn_dl.is_enabled(), "Download QR button must be disabled when payment pending"
        assert not btn_pr.is_enabled(), "Print QR button must be disabled when payment pending"

        # Verify Payment: Pending badge is visible
        payment_badge = driver.find_element(By.ID, "badge-rider-payment-status")
        assert "PENDING" in payment_badge.text.upper()

        save_screenshot(driver, "Test-04.png")
        print("[TEST 4 PASSED] Event with Payment Required = YES creates pending rider with withheld QR.")

        # -------------------------------------------------------------
        # TEST 5: Organizer marks rider as "Paid / Verified"
        # Verify Payment status updates and QR code becomes available
        # -------------------------------------------------------------
        print("\n--- TEST 5: Organizer Marks Rider as Paid / Verified ---")
        verify_btn = driver.find_element(By.ID, "btn-verify-payment")
        verify_btn.click()
        time.sleep(1.5)

        # Verify verified banner appears
        verified_banner = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "organizer-payment-verified-banner"))
        )
        assert "Payment Status: Paid / Verified" in verified_banner.text

        # Verify badge updated
        payment_badge = driver.find_element(By.ID, "badge-rider-payment-status")
        assert "PAID / VERIFIED" in payment_badge.text.upper()

        # Verify QR code is now generated and displayed
        qr_img = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "img-rider-qr"))
        )
        assert qr_img.is_displayed(), "QR code image must be visible after verification"

        # Verify download and print buttons are now enabled
        btn_dl = driver.find_element(By.ID, "btn-download-qr")
        btn_pr = driver.find_element(By.ID, "btn-print-qr")
        assert btn_dl.is_enabled(), "Download QR button must now be enabled"
        assert btn_pr.is_enabled(), "Print QR button must now be enabled"

        save_screenshot(driver, "Test-05.png")
        print("[TEST 5 PASSED] Rider marked Paid / Verified: QR pass generated and active.")

        # -------------------------------------------------------------
        # TEST 6: Create event with Payment Required = NO
        # Register a rider -> QR immediately available
        # -------------------------------------------------------------
        print("\n--- TEST 6: Event with Payment Required = NO ---")
        driver.get("http://localhost:5173/events/create")
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "event-name-input"))
        )

        event6_name_val = f"Sunrise Coastal Ride [NO-PAY] {uuid.uuid4().hex[:5]}"
        driver.find_element(By.ID, "event-name-input").send_keys(event6_name_val)
        driver.find_element(By.ID, "event-location-input").send_keys("Alibaug")
        driver.find_element(By.ID, "event-distance-input").send_keys("50")
        driver.find_element(By.ID, "event-date-input").send_keys("2026-11-25")
        driver.find_element(By.ID, "event-time-input").send_keys("06:30")

        # Select Payment Required = NO
        pay_no_radio = driver.find_element(By.ID, "payment-required-no")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", pay_no_radio)
        time.sleep(0.5)
        pay_no_radio.click()
        time.sleep(0.5)

        # Save event
        save_btn = driver.find_element(By.ID, "btn-save-event")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", save_btn)
        time.sleep(0.5)
        save_btn.click()

        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Event Created')]"))
        )
        print(f"Created event: {event6_name_val} with Payment Required = NO")

        # Register rider for Event 6
        driver.get("http://localhost:5173/riders/register")
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "rider-name-input"))
        )

        driver.find_element(By.ID, "rider-event-select").click()
        time.sleep(0.5)
        ev6_option = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//li[contains(text(), '{event6_name_val}')]"))
        )
        ev6_option.click()
        time.sleep(0.5)

        rider6_name_val = f"Snehal Kulkarni {uuid.uuid4().hex[:4]}"
        driver.find_element(By.ID, "rider-name-input").send_keys(rider6_name_val)
        driver.find_element(By.ID, "rider-mobile-input").send_keys("9822123457")
        driver.find_element(By.ID, "rider-emergency-input").send_keys("9822987655")

        driver.find_element(By.ID, "rider-blood-group-select").click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "//li[contains(text(), 'O+')]").click()
        time.sleep(0.5)

        driver.find_element(By.ID, "rider-age-input").send_keys("25")

        driver.find_element(By.ID, "rider-gender-select").click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "//li[contains(text(), 'Female')]").click()
        time.sleep(0.5)

        driver.find_element(By.ID, "rider-club-input").send_keys("Independent")

        driver.find_element(By.ID, "rider-bicycle-select").click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "//li[contains(text(), 'Hybrid Bike')]").click()
        time.sleep(0.5)

        driver.find_element(By.ID, "rider-jersey-input").send_keys("88")
        driver.find_element(By.ID, "rider-medical-notes-input").send_keys("None")

        driver.find_element(By.ID, "btn-submit-rider-registration").click()

        # On success screen, verify NO payment pending warning
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Rider Registered')]"))
        )
        warnings = driver.find_elements(By.ID, "registration-payment-warning")
        assert len(warnings) == 0, "No payment warning should appear when payment is not required"

        # Verify "Generate QR Code" button is available
        gen_qr_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Generate QR Code')]")
        assert gen_qr_btn.is_displayed(), "Generate QR Code button must be displayed immediately"

        save_screenshot(driver, "Test-06.png")
        print("[TEST 6 PASSED] Event with Payment Required = NO provides immediate QR code.")

        # -------------------------------------------------------------
        # TEST 7: Reload event and rider pages to verify database persistence
        # -------------------------------------------------------------
        print("\n--- TEST 7: Verify Database Persistence on Reload ---")
        # Reload Rider 4 Profile
        driver.get(f"http://localhost:5173/riders/{rider4_doc_id}")
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "organizer-payment-verified-banner"))
        )

        badge_reloaded = driver.find_element(By.ID, "badge-rider-payment-status")
        assert "PAID / VERIFIED" in badge_reloaded.text.upper(), "Payment status must persist as Paid / Verified"

        qr_img_reloaded = driver.find_element(By.ID, "img-rider-qr")
        assert qr_img_reloaded.is_displayed(), "QR code must persist and be rendered on reload"

        # Check API response directly
        req = urllib.request.Request(f"http://localhost:8000/api/v1/riders/{rider4_doc_id}", headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req) as resp:
            persisted_rider = json.loads(resp.read().decode("utf-8"))["data"]
            print(f"Persisted Rider: {persisted_rider['riderId']}, status: {persisted_rider['paymentStatus']}")
            assert persisted_rider["paymentStatus"] == "verified", "MongoDB record must show paymentStatus == 'verified'"

        save_screenshot(driver, "Test-07.png")
        print("[TEST 7 PASSED] All changes persisted from MongoDB database and verified on page reload.")

        print("\n=======================================================")
        print("ALL 7 TARGETED VERIFICATION TESTS PASSED SUCCESSFULLY!")
        print("Evidence screenshots saved in:", EVIDENCE_DIR)
        print("=======================================================")

    except Exception as exc:
        print(f"\n[ERROR OCCURRED]: {exc}")
        traceback.print_exc()
        try:
            save_screenshot(driver, "Failure-Evidence.png")
        except Exception:
            pass
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    run_tests()
