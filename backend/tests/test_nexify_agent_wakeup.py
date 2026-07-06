"""
Backend test for NeXify AI Platform agent execution bugfix verification.

Tests target the external API at https://app.nexifyai.cloud (NOT the local /app FastAPI).
Verifies that the 'nexifyai' wrapper script fix on the paperclip-nexify VPS container
resolves the previously reported 'Failed to start command "nexifyai" in "."' bug.
"""

import os
import time
import pytest
import requests

BASE_URL = "https://app.nexifyai.cloud"
EMAIL = "mail@nexifyai.cloud"
PASSWORD = "1def!xO2022!!"
COMPANY_ID = "150dc80b-d302-4d66-8102-142299652c2a"
DEVELOPER_AGENT_ID = "5b78974e-1cc4-49f8-8807-118181714e16"
CEO_AGENT_ID = "ac23ed0a-c87a-4e83-a930-90be7aae1ef2"

ORIGIN_HEADER = {"Origin": BASE_URL}


@pytest.fixture(scope="module")
def session():
    """Authenticated session with better-auth session cookie."""
    s = requests.Session()
    s.headers.update({"User-Agent": "nexify-testing-agent/1.0"})

    # Sign in via better-auth email endpoint
    r = s.post(
        f"{BASE_URL}/api/auth/sign-in/email",
        json={"email": EMAIL, "password": PASSWORD},
        headers={"Content-Type": "application/json", **ORIGIN_HEADER},
        timeout=30,
    )
    print(f"[login] status={r.status_code} body_snippet={r.text[:200]}")
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text[:500]}"
    data = r.json()
    assert "token" in data or "user" in data, f"Missing token/user in login response: {data}"

    # Verify secure session cookie
    cookies = {c.name: c for c in s.cookies}
    print(f"[login] cookies received: {list(cookies.keys())}")
    session_cookie_names = [n for n in cookies if "session_token" in n]
    assert session_cookie_names, f"No session_token cookie set: {list(cookies.keys())}"
    return s


def _poll_run(session, run_id, max_seconds=960, interval=15):
    """Poll GET /api/heartbeat-runs/{id} until terminal state or timeout."""
    deadline = time.time() + max_seconds
    last_status = None
    while time.time() < deadline:
        r = session.get(
            f"{BASE_URL}/api/heartbeat-runs/{run_id}",
            headers=ORIGIN_HEADER,
            timeout=30,
        )
        assert r.status_code == 200, f"Poll failed: {r.status_code} {r.text[:300]}"
        body = r.json()
        status = body.get("status")
        if status != last_status:
            print(f"[poll {run_id}] status={status} exitCode={body.get('exitCode')} error={str(body.get('error'))[:200]}")
            last_status = status
        if status in ("succeeded", "failed", "cancelled", "error", "timed_out"):
            return body
        time.sleep(interval)
    pytest.fail(f"Run {run_id} did not reach terminal state within {max_seconds}s (last status={last_status})")


class TestNexifyAgentExecution:
    """End-to-end verification of agent wakeup + run success on external NeXify platform."""

    def test_1_login_returns_session(self, session):
        # Fixture already validated login; assert cookie is httpOnly-secure named
        secure = [c.name for c in session.cookies if c.name.startswith("__Secure-") and "session_token" in c.name]
        assert secure, f"Expected __Secure-*session_token cookie, got: {[c.name for c in session.cookies]}"
        print(f"Secure session cookie confirmed: {secure}")

    def test_2_list_agents_contains_developer(self, session):
        r = session.get(
            f"{BASE_URL}/api/companies/{COMPANY_ID}/agents",
            headers=ORIGIN_HEADER,
            timeout=30,
        )
        assert r.status_code == 200, f"List agents failed: {r.status_code} {r.text[:500]}"
        agents = r.json()
        # API may wrap in envelope
        if isinstance(agents, dict) and "agents" in agents:
            agents = agents["agents"]
        assert isinstance(agents, list), f"Expected list, got {type(agents)}: {str(agents)[:300]}"
        print(f"[agents] count={len(agents)} names={[a.get('name') for a in agents]}")
        assert len(agents) == 6, f"Expected 6 agents, got {len(agents)}"

        dev = next((a for a in agents if a.get("id") == DEVELOPER_AGENT_ID), None)
        assert dev is not None, f"Developer agent {DEVELOPER_AGENT_ID} not in list"
        assert dev.get("name") == "NeXify AI Developer", f"Unexpected dev name: {dev.get('name')}"
        assert dev.get("adapterType") == "hermes_local", f"Unexpected adapterType: {dev.get('adapterType')}"

    def test_3_developer_agent_wakeup_and_run_succeeds(self, session):
        """CORE BUGFIX TEST: nexifyai wrapper script must allow the agent run to succeed."""
        r = session.post(
            f"{BASE_URL}/api/agents/{DEVELOPER_AGENT_ID}/wakeup",
            json={},
            headers={"Content-Type": "application/json", **ORIGIN_HEADER},
            timeout=30,
        )
        print(f"[wakeup developer] status={r.status_code} body={r.text[:400]}")
        assert r.status_code == 202, f"Wakeup expected 202, got {r.status_code}: {r.text[:400]}"
        body = r.json()
        run_id = body.get("id") or body.get("runId") or body.get("heartbeatRunId")
        assert run_id, f"No run id returned: {body}"
        status = body.get("status")
        assert status in ("queued", "running", "pending"), f"Unexpected initial status: {status}"
        print(f"[wakeup developer] run_id={run_id} status={status}")

        result = _poll_run(session, run_id, max_seconds=960, interval=15)
        err = str(result.get("error") or "")
        assert "Failed to start command" not in err, (
            f"BUG REGRESSION: 'Failed to start command' still present in error: {err}"
        )
        assert result.get("status") == "succeeded", (
            f"Developer run did not succeed. status={result.get('status')} "
            f"exitCode={result.get('exitCode')} error={err[:500]}"
        )
        assert result.get("exitCode") == 0, f"exitCode expected 0, got {result.get('exitCode')}"
        print(f"[developer] SUCCESS run_id={run_id} exitCode=0")

    def test_4_ceo_agent_regression(self, session):
        """Regression: CEO agent uses cmd 'hermes' (unaffected by fix) - must still work."""
        run_id = None
        for attempt in range(1, 3):
            r = session.post(
                f"{BASE_URL}/api/agents/{CEO_AGENT_ID}/wakeup",
                json={},
                headers={"Content-Type": "application/json", **ORIGIN_HEADER},
                timeout=30,
            )
            print(f"[wakeup ceo attempt={attempt}] status={r.status_code} body={r.text[:400]}")
            if r.status_code == 202:
                body = r.json()
                run_id = body.get("id") or body.get("runId") or body.get("heartbeatRunId")
                if run_id:
                    break
            if r.status_code in (409,) or "skipped" in r.text.lower():
                print("[ceo] wakeup skipped (run already active); waiting 60s")
                time.sleep(60)
                continue
            pytest.fail(f"CEO wakeup unexpected: {r.status_code} {r.text[:400]}")

        if not run_id:
            pytest.skip("CEO wakeup returned skipped/409 twice; developer test already validated fix")

        result = _poll_run(session, run_id, max_seconds=960, interval=15)
        assert result.get("status") == "succeeded", (
            f"CEO run did not succeed. status={result.get('status')} "
            f"exitCode={result.get('exitCode')} error={str(result.get('error'))[:500]}"
        )
        assert result.get("exitCode") == 0
        print(f"[ceo] SUCCESS run_id={run_id}")
