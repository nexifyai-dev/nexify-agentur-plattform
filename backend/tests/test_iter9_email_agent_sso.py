"""
Iteration 9 backend tests:
TEST 1: Email-Agent API (status + log) with X-Admin-Token
TEST 3: Service-Token Auth (stats, offers, portal PDF)
TEST 4: SSO hardening (persisted nonces + admin identity in HMAC token)
TEST 6: Regression - webui-sso hinweg (Cockpit -> WebUI)
"""
import os
import re
import subprocess
import pytest
import requests

ADMIN_TOKEN = "10e5a1213fc000a71df803a6101a1285c7324a8feb33327b"
ADMIN_PW = "***REDACTED***"

WWW = "https://www.nexifyai.cloud"
WEBUI = "https://webui.nexifyai.cloud"


# ------------------------- TEST 1: Email-Agent API -------------------------

class TestEmailAgentAPI:
    def test_status_with_token(self):
        import time
        # email_worker() sleeps 10s before flipping enabled=True.
        # Backend hot-reload can restart the process during tests; wait up to ~30s.
        last = None
        for attempt in range(15):
            r = requests.get(
                f"{WWW}/api/admin/email-agent/status",
                headers={"X-Admin-Token": ADMIN_TOKEN},
                timeout=15,
            )
            assert r.status_code == 200, f"expected 200 got {r.status_code}: {r.text[:400]}"
            data = r.json()
            last = data
            for k in ["enabled", "started_at", "last_poll", "polls", "processed", "spam", "inquiries", "errors"]:
                assert k in data, f"missing field {k} in {data}"
            if data["enabled"] is True:
                return
            time.sleep(2)
        pytest.fail(f"enabled never became true within 30s, last data={last}")

    def test_status_no_token(self):
        r = requests.get(f"{WWW}/api/admin/email-agent/status", timeout=15)
        assert r.status_code == 401, f"expected 401 got {r.status_code}"

    def test_status_wrong_token(self):
        r = requests.get(
            f"{WWW}/api/admin/email-agent/status",
            headers={"X-Admin-Token": "wrong"},
            timeout=15,
        )
        assert r.status_code == 401, f"expected 401 got {r.status_code}"

    def test_log_with_token(self):
        r = requests.get(
            f"{WWW}/api/admin/email-agent/log?limit=5",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=15,
        )
        assert r.status_code == 200, f"expected 200 got {r.status_code}: {r.text[:400]}"
        data = r.json()
        assert isinstance(data, list), f"expected list, got {type(data)}"

    def test_log_no_token(self):
        r = requests.get(f"{WWW}/api/admin/email-agent/log?limit=5", timeout=15)
        assert r.status_code == 401

    def test_log_wrong_token(self):
        r = requests.get(
            f"{WWW}/api/admin/email-agent/log?limit=5",
            headers={"X-Admin-Token": "wrong"},
            timeout=15,
        )
        assert r.status_code == 401


# --------------------- TEST 2: Manual Poll Endpoint (Iter 10) ---------------------

# Preview-Backend, weil neuer Endpoint erst nach Save-to-GitHub auf www.nexifyai.cloud landet.
PREVIEW = "https://rebranding-hub-2.preview.emergentagent.com"


class TestEmailAgentManualPoll:
    def test_poll_with_token(self):
        r = requests.post(
            f"{PREVIEW}/api/admin/email-agent/poll",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=60,  # IMAP-Zyklus kann dauern
        )
        assert r.status_code == 200, f"expected 200 got {r.status_code}: {r.text[:400]}"
        data = r.json()
        assert data.get("ok") is True, f"unexpected: {data}"
        assert "last_poll" in data and data["last_poll"], f"no last_poll: {data}"
        assert isinstance(data.get("found"), int)
        assert isinstance(data.get("processed"), int)

    def test_poll_no_token(self):
        r = requests.post(f"{PREVIEW}/api/admin/email-agent/poll", timeout=15)
        assert r.status_code == 401

    def test_poll_wrong_token(self):
        r = requests.post(
            f"{PREVIEW}/api/admin/email-agent/poll",
            headers={"X-Admin-Token": "wrong"},
            timeout=15,
        )
        assert r.status_code == 401


# ------------------------- TEST 3: Service-Token generally -------------------------

class TestServiceTokenAuth:
    def test_admin_stats(self):
        r = requests.get(
            f"{WWW}/api/admin/stats",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=15,
        )
        assert r.status_code == 200, f"stats {r.status_code}: {r.text[:400]}"
        data = r.json()
        for k in ["leads", "offers", "pipeline_value"]:
            assert k in data, f"missing {k}"

    def test_admin_offers_and_portal_pdf(self):
        r = requests.get(
            f"{WWW}/api/admin/offers",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=15,
        )
        assert r.status_code == 200
        offers = r.json()
        assert isinstance(offers, list) and len(offers) > 0, "need at least 1 offer"
        offer_id = offers[0].get("id") or offers[0].get("_id")
        assert offer_id, f"no id in first offer: {offers[0]}"

        pdf = requests.get(
            f"{WWW}/api/portal/offers/{offer_id}/pdf",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=20,
        )
        assert pdf.status_code == 200, f"pdf {pdf.status_code}: {pdf.text[:400]}"
        ctype = pdf.headers.get("content-type", "")
        assert "application/pdf" in ctype, f"expected application/pdf got {ctype}"
        assert pdf.content[:4] == b"%PDF", f"body does not start with %PDF, got {pdf.content[:20]!r}"


# ------------------------- TEST 4: SSO hardening -------------------------

class TestSSOHardening:
    @pytest.fixture(scope="class")
    def hermes_cookie(self, tmp_path_factory):
        cookiejar = str(tmp_path_factory.mktemp("hermes") / "cookies.txt")
        # Login via curl (Python requests hangs on webui redirect body reads intermittently)
        cmd = [
            "curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}",
            "-c", cookiejar,
            "-X", "POST", "-H", "Content-Type: application/json",
            "-d", f'{{"password":"{ADMIN_PW}"}}',
            f"{WEBUI}/api/auth/login",
        ]
        out = subprocess.check_output(cmd, timeout=30).decode()
        assert out.strip() in ("200", "204"), f"login failed: {out}"
        return cookiejar

    def _get_sso_redirect(self, cookiejar):
        # WebUI /crm returns 302 immediately but hangs on body; use header dump + short timeout
        cmd = [
            "curl", "-sS", "-D", "-", "-o", "/dev/null",
            "--max-time", "5",
            "-b", cookiejar,
            f"{WEBUI}/crm",
        ]
        # curl exits non-zero on timeout, but we don't care - we only need headers
        proc = subprocess.run(cmd, capture_output=True, timeout=15)
        out = proc.stdout.decode(errors="ignore")
        loc_m = re.search(r"^[Ll]ocation:\s*(.+)$", out, re.MULTILINE)
        assert loc_m, f"no Location header in webui /crm response: {out[:400]}"
        return loc_m.group(1).strip()

    def _curl_redirect(self, url):
        """Follow-less request. Returns (status_code, location, set_cookie_all_lines)."""
        cmd = [
            "curl", "-sS", "-D", "-", "-o", "/dev/null",
            "--max-time", "10",
            url,
        ]
        proc = subprocess.run(cmd, capture_output=True, timeout=20)
        out = proc.stdout.decode(errors="ignore")
        code_m = re.search(r"^HTTP/[\d.]+\s+(\d+)", out, re.MULTILINE)
        code = int(code_m.group(1)) if code_m else 0
        loc_m = re.search(r"^[Ll]ocation:\s*(.+)$", out, re.MULTILINE)
        loc = loc_m.group(1).strip() if loc_m else ""
        cookies = "\n".join(re.findall(r"^[Ss]et-[Cc]ookie:.*$", out, re.MULTILINE))
        return code, loc, cookies

    def test_b_redirect_contains_admin_identity_in_token(self, hermes_cookie):
        loc = self._get_sso_redirect(hermes_cookie)
        assert "sso-consume" in loc, f"no sso-consume in {loc}"
        # token format: <exp>:<nonce>:<email>.<sig>
        m = re.search(r"[?&]t=([^&]+)", loc)
        assert m, f"no t= in {loc}"
        token = m.group(1)
        # Expected pattern: exp:nonce:email.sig
        # email should be mail@nexifyai.cloud
        # Structure: three parts separated by ':' and then '.' before signature
        # Split by ':' first (max 3 parts) then last part has the .sig
        parts = token.split(":")
        assert len(parts) == 3, f"expected 3 ':' segments, got {len(parts)}: {token}"
        exp, nonce, email_and_sig = parts
        assert exp.isdigit(), f"exp not digit: {exp}"
        assert "." in email_and_sig, f"no '.sig' in third part: {email_and_sig}"
        email = email_and_sig.rsplit(".", 1)[0]
        assert email == "mail@nexifyai.cloud", f"expected admin email in token, got {email}"

    def test_c_consume_once(self, hermes_cookie):
        loc = self._get_sso_redirect(hermes_cookie)
        code, final_loc, cookies = self._curl_redirect(loc)
        assert code == 302, f"consume {code}, loc={final_loc}"
        assert "/admin" in final_loc, f"expected /admin got {final_loc}"
        assert "access_token" in cookies, f"no access_token set-cookie: {cookies[:400]}"

    def test_d_replay_blocked(self, hermes_cookie):
        loc = self._get_sso_redirect(hermes_cookie)
        code1, _, _ = self._curl_redirect(loc)
        assert code1 == 302
        code2, final2, _ = self._curl_redirect(loc)
        assert code2 == 302
        assert "sso=invalid" in final2, f"replay must -> sso=invalid, got {final2}"

    def test_e_tampered_signature(self, hermes_cookie):
        loc = self._get_sso_redirect(hermes_cookie)
        tampered = loc[:-1] + ("0" if loc[-1] != "0" else "1")
        code, final, _ = self._curl_redirect(tampered)
        assert code == 302
        assert "sso=invalid" in final, f"tampered must -> sso=invalid, got {final}"


# ------------------------- TEST 6: Regression Hinweg -------------------------

class TestSSOHinwegRegression:
    def test_webui_sso_from_cockpit(self):
        r = requests.get(
            f"{WWW}/api/admin/webui-sso",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=15,
        )
        assert r.status_code == 200, f"{r.status_code}: {r.text[:400]}"
        data = r.json()
        assert "url" in data, f"no url field in {data}"
        assert "webui.nexifyai.cloud" in data["url"], f"url not pointing to WebUI: {data['url']}"
