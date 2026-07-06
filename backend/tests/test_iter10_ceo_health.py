"""
Iteration 10 backend tests:
TEST 1: CEO-Queue lifecycle (enqueue via SQL, GET, claim, double-claim=409, complete, recommendations)
TEST 2: /api/admin/health/infra returns proper aggregated shape
"""
import os
import uuid
import time
import pytest
import requests

ADMIN_TOKEN = "10e5a1213fc000a71df803a6101a1285c7324a8feb33327b"
PREVIEW = "https://rebranding-hub-2.preview.emergentagent.com"


def _enqueue_via_db(subject: str, body: str) -> str:
    """Direct DB insert; the API-side helper is only exposed through email_agent."""
    import asyncio, asyncpg  # noqa
    from dotenv import load_dotenv
    load_dotenv('/app/backend/.env')

    async def go():
        conn = await asyncpg.connect(
            host=os.environ['SUPABASE_DB_HOST'], port=int(os.environ['SUPABASE_DB_PORT']),
            user=os.environ['SUPABASE_DB_USER'], password=os.environ['SUPABASE_DB_PASSWORD'],
            database=os.environ['SUPABASE_DB_NAME'], ssl='require')
        # ensure table exists
        await conn.execute("""
            create table if not exists nexify_ceo_queue (
                id uuid primary key, kind text not null, ref_id uuid,
                subject text, body_snippet text, status text not null default 'pending',
                recommendation text, claimed_by text, claimed_at timestamptz,
                created_at timestamptz default now(), updated_at timestamptz default now())""")
        qid = uuid.uuid4()
        await conn.execute(
            "insert into nexify_ceo_queue (id,kind,ref_id,subject,body_snippet) values ($1,$2,null,$3,$4)",
            qid, 'test', subject, body)
        await conn.close()
        return str(qid)
    return asyncio.run(go())


class TestCeoQueueLifecycle:
    def test_full_lifecycle(self):
        subj = f"pytest-{uuid.uuid4().hex[:8]}"
        qid = _enqueue_via_db(subj, "Testinhalt für Roundtrip-Verifikation.")
        headers = {"X-Admin-Token": ADMIN_TOKEN}

        # list pending → contains our subject
        r = requests.get(f"{PREVIEW}/api/admin/ceo-queue?status=pending&limit=20",
                         headers=headers, timeout=15)
        assert r.status_code == 200, r.text[:200]
        matching = [row for row in r.json() if row.get("subject") == subj]
        assert matching, f"newly-enqueued id {qid} with subject {subj} not in pending list"

        # claim
        r = requests.post(f"{PREVIEW}/api/admin/ceo-queue/{qid}/claim",
                          headers={**headers, "Content-Type": "application/json"},
                          json={"worker_id": "pytest"}, timeout=15)
        assert r.status_code == 200, f"claim: {r.status_code} {r.text[:200]}"
        assert r.json().get("ok") is True

        # double-claim → 409
        r = requests.post(f"{PREVIEW}/api/admin/ceo-queue/{qid}/claim",
                          headers={**headers, "Content-Type": "application/json"},
                          json={"worker_id": "pytest2"}, timeout=15)
        assert r.status_code == 409, f"double-claim: {r.status_code}"

        # complete
        recommendation = "**Test-Empfehlung**\n\nAlles gut."
        r = requests.post(f"{PREVIEW}/api/admin/ceo-queue/{qid}/complete",
                          headers={**headers, "Content-Type": "application/json"},
                          json={"recommendation": recommendation, "status": "done"}, timeout=15)
        assert r.status_code == 200
        assert r.json().get("ok") is True

        # recommendations includes our row with correct text
        r = requests.get(f"{PREVIEW}/api/admin/ceo-recommendations?limit=50",
                         headers=headers, timeout=15)
        assert r.status_code == 200
        rows = r.json()
        ours = [row for row in rows if row.get("id") == qid]
        assert ours, "completed row not in recommendations"
        assert ours[0]["status"] == "done"
        assert ours[0]["recommendation"] == recommendation

    def test_auth_gates(self):
        headers_no = {}
        headers_bad = {"X-Admin-Token": "wrong"}
        for m, p in [("GET", "/api/admin/ceo-queue"),
                     ("GET", "/api/admin/ceo-recommendations")]:
            r = requests.request(m, f"{PREVIEW}{p}", headers=headers_no, timeout=10)
            assert r.status_code == 401
            r = requests.request(m, f"{PREVIEW}{p}", headers=headers_bad, timeout=10)
            assert r.status_code == 401


class TestHealthInfra:
    def test_shape(self):
        r = requests.get(f"{PREVIEW}/api/admin/health/infra",
                         headers={"X-Admin-Token": ADMIN_TOKEN}, timeout=15)
        assert r.status_code == 200, r.text[:200]
        d = r.json()
        assert "ok" in d and isinstance(d["ok"], bool)
        assert "degraded" in d and isinstance(d["degraded"], list)
        assert "email_agent" in d and set(d["email_agent"].keys()) >= {"enabled", "last_poll", "polls", "errors"}
        assert "ceo_queue" in d and "counts" in d["ceo_queue"]
        for k in ("pending", "processing", "done", "failed"):
            assert k in d["ceo_queue"]["counts"], f"missing count {k}"
        assert "checked_at" in d

    def test_auth(self):
        r = requests.get(f"{PREVIEW}/api/admin/health/infra", timeout=10)
        assert r.status_code == 401
