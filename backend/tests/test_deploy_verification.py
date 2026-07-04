"""
Deployment verification tests for NeXify AI website:
- Vercel API deployment + project rootDirectory
- Live domain www.nexifyai.cloud pages + API proxy
- Admin login E2E via live domain
- Regression preview
"""
import os
import re
import pytest
import requests
from pathlib import Path

# Load VERCEL_TOKEN from /app/backend/.env explicitly
def _load_env():
    env_path = Path("/app/backend/.env")
    env = {}
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = _load_env()
VERCEL_TOKEN = ENV.get("VERCEL_TOKEN")
LIVE = "https://www.nexifyai.cloud"
PREVIEW = "https://rebranding-hub-2.preview.emergentagent.com"
DEPLOY_ID = "dpl_DMWGNubdoKc1fnbMCs6xi7rtA8eU"
ADMIN_EMAIL = "mail@nexifyai.cloud"
ADMIN_PASS = "1def!xO2022!!"


# ---------- Vercel API ----------

class TestVercelAPI:
    def test_deployment_ready_and_production(self):
        assert VERCEL_TOKEN, "VERCEL_TOKEN missing in /app/backend/.env"
        r = requests.get(
            f"https://api.vercel.com/v13/deployments/{DEPLOY_ID}",
            headers={"Authorization": f"Bearer {VERCEL_TOKEN}"},
            timeout=30,
        )
        assert r.status_code == 200, f"Status {r.status_code}: {r.text[:400]}"
        data = r.json()
        ready = data.get("readyState") or data.get("status")
        assert ready == "READY", f"readyState={ready}, data={data}"
        assert data.get("target") == "production", f"target={data.get('target')}"

    def test_project_root_directory(self):
        assert VERCEL_TOKEN
        r = requests.get(
            "https://api.vercel.com/v9/projects/website",
            headers={"Authorization": f"Bearer {VERCEL_TOKEN}"},
            timeout=30,
        )
        assert r.status_code == 200, f"Status {r.status_code}: {r.text[:400]}"
        data = r.json()
        assert data.get("rootDirectory") == "apps/website", \
            f"rootDirectory={data.get('rootDirectory')}"


# ---------- Live domain pages ----------

class TestLiveDomainPages:
    def test_apex_redirects_to_www(self):
        r = requests.get("https://nexifyai.cloud", allow_redirects=False, timeout=30)
        assert r.status_code in (301, 308), f"Expected 308/301, got {r.status_code}"
        assert "www.nexifyai.cloud" in r.headers.get("Location", ""), \
            f"Location={r.headers.get('Location')}"

    def test_home_loads_with_hero(self):
        r = requests.get(f"{LIVE}/", timeout=30)
        assert r.status_code == 200, f"Status {r.status_code}"
        html = r.text
        assert "hero-visual" in html, "data-testid='hero-visual' not found"
        # Ensure no obvious Next error page
        assert "Application error" not in html, "Application error present"
        assert "This page could not be found" not in html

    def test_ueber_mich_contains_new_content(self):
        r = requests.get(f"{LIVE}/ueber-mich", timeout=30)
        assert r.status_code == 200, f"Status {r.status_code}"
        html = r.text
        assert "Grenzregion Limburg" in html, "'Grenzregion Limburg' not found in HTML"
        assert "about-portrait" in html, "data-testid='about-portrait' not found"

    def test_rueckruf_loads(self):
        r = requests.get(f"{LIVE}/rueckruf", timeout=30)
        assert r.status_code == 200, f"Status {r.status_code}"
        # Booking page should contain some booking-related keywords
        low = r.text.lower()
        assert any(k in low for k in ["rückruf", "rueckruf", "buchung", "termin", "booking"]), \
            "Booking page keywords missing"


# ---------- API Proxy via live domain ----------

class TestApiProxyLive:
    def test_health(self):
        r = requests.get(f"{LIVE}/api/health", timeout=30)
        assert r.status_code == 200, f"Status {r.status_code}: {r.text[:400]}"
        data = r.json()
        assert data.get("status") == "ok", f"status={data.get('status')}"
        assert data.get("db") == "supabase", f"db={data.get('db')}"

    def test_booking_slots(self):
        r = requests.get(f"{LIVE}/api/booking/slots", timeout=30)
        assert r.status_code == 200, f"Status {r.status_code}: {r.text[:400]}"
        data = r.json()
        # Accept either bare array or object containing an array
        if isinstance(data, list):
            slots = data
        elif isinstance(data, dict):
            slots = data.get("slots") or data.get("data") or []
        else:
            slots = []
        assert isinstance(slots, list), f"Expected list, got {type(data).__name__}"


# ---------- Admin login E2E via live domain ----------

class TestAdminAuthLive:
    def test_login_and_admin_stats(self):
        s = requests.Session()
        r = s.post(
            f"{LIVE}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASS},
            timeout=30,
        )
        assert r.status_code == 200, f"Login status {r.status_code}: {r.text[:400]}"
        # httpOnly cookie should be set
        cookie_names = [c.name for c in s.cookies]
        assert any("session" in n.lower() or "token" in n.lower() or "auth" in n.lower()
                   for n in cookie_names) or len(cookie_names) > 0, \
            f"No auth cookie set; cookies={cookie_names}"

        r2 = s.get(f"{LIVE}/api/admin/stats", timeout=30)
        assert r2.status_code == 200, f"admin/stats status {r2.status_code}: {r2.text[:400]}"
        data = r2.json()
        assert isinstance(data, dict) and len(data) > 0, f"Empty stats: {data}"


# ---------- Local repo hygiene ----------

class TestRepoHygiene:
    def test_no_package_lock_in_apps_website(self):
        assert not Path("/app/apps/website/package-lock.json").exists(), \
            "apps/website/package-lock.json still exists"

    def test_yarn_lock_present(self):
        assert Path("/app/apps/website/yarn.lock").exists(), \
            "apps/website/yarn.lock missing"


# ---------- Regression preview ----------

class TestPreviewRegression:
    def test_preview_home(self):
        r = requests.get(f"{PREVIEW}/", timeout=30)
        assert r.status_code == 200, f"Status {r.status_code}"
        assert "hero-visual" in r.text, "hero-visual missing on preview"
