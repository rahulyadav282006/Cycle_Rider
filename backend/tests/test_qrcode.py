import httpx
import pytest

BASE_URL = "http://127.0.0.1:8000"

def test_qr_generation_and_svg_streaming():
    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Generate dynamic QR code
        dest_url = "https://newrider.com/events/kolhapur-2026"
        gen_res = client.post(
            "/api/v1/qr/generate",
            json={"destinationUrl": dest_url, "title": "Kolhapur 2026 QR"}
        )
        assert gen_res.status_code == 200, f"Generate failed: {gen_res.text}"
        data = gen_res.json()
        assert data["success"] is True
        qr_data = data["data"]
        short_id = qr_data["shortId"]
        assert short_id.startswith("rider_")
        assert qr_data["destinationUrl"] == dest_url
        assert "/track/" in qr_data["trackingUrl"]
        assert qr_data["totalScans"] == 0

        # 2. Fetch SVG stream
        svg_res = client.get(f"/api/v1/qr/{short_id}/svg")
        assert svg_res.status_code == 200
        assert "image/svg+xml" in svg_res.headers.get("content-type", "")
        svg_content = svg_res.text
        assert "<svg" in svg_content
        assert "</svg>" in svg_content

        # 3. Fetch direct SVG stream
        direct_res = client.get("/api/v1/qr/direct/svg", params={"url": "https://newrider.com"})
        assert direct_res.status_code == 200
        assert "image/svg+xml" in direct_res.headers.get("content-type", "")
        assert "<svg" in direct_res.text

        # 4. Check initial analytics
        ana_res1 = client.get(f"/api/v1/qr/{short_id}/analytics")
        assert ana_res1.status_code == 200
        assert ana_res1.json()["data"]["totalScans"] == 0

        # 5. Scan Phase: hit /track/{short_id} (disallow following redirects to inspect 302 Found)
        track_client = httpx.Client(base_url=BASE_URL, follow_redirects=False)
        track_res = track_client.get(
            f"/track/{short_id}",
            headers={"User-Agent": "MobileSafari/iPhone-Test-Scanner"}
        )
        assert track_res.status_code == 302
        assert track_res.headers.get("location") == dest_url

        # 6. Analytics Phase: verify scan count incremented and logged user agent
        ana_res2 = client.get(f"/api/v1/qr/{short_id}/analytics")
        assert ana_res2.status_code == 200
        ana_data = ana_res2.json()["data"]
        assert ana_data["totalScans"] == 1
        assert len(ana_data["scans"]) == 1
        assert ana_data["scans"][0]["userAgent"] == "MobileSafari/iPhone-Test-Scanner"

def test_qr_not_found():
    with httpx.Client(base_url=BASE_URL, follow_redirects=False) as client:
        res = client.get("/track/rider_nonexistent_99999")
        assert res.status_code == 404
        svg_res = client.get("/api/v1/qr/rider_nonexistent_99999/svg")
        assert svg_res.status_code == 404
