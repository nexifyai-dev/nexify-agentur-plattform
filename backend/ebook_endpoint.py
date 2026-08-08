"""M-01 E-Book-Lead-Magnet: Endpoint-Logik für /api/ebook (im Backend-Server eingebunden).

NIR: 08.08.2026 15:45
WHAT: Schreibt Opt-in-Lead in Drip-Tabelle `leads` (PostgREST) + `nexify_leads` (Pool),
      sendet E-Book-Mail via send_email (Resend→SMTP-Fallback).
WHY: Vercel-Lambda kann 127.0.0.1:8000 (Supabase-Kong) nicht erreichen → 500.
      Backend läuft auf dem VPS mit Zugriff.
DEPENDS: server.py (send_email, db-Pool, hmac/hashlib/time), Env: SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
import uuid

from fastapi import APIRouter

from pydantic import BaseModel, EmailStr

PDF_URL = "https://www.nexifyai.cloud/docs/nexify-ebook-ki-automation.pdf"

router = APIRouter()


class EbookIn(BaseModel):
    name: str = ""
    email: EmailStr
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None


def _b64url(o: dict) -> str:
    return base64.urlsafe_b64encode(
        json.dumps(o, separators=(",", ":")).encode()
    ).rstrip(b"=").decode()


def _service_jwt() -> str | None:
    """Echtes HS256-JWT für PostgREST (PGRST301-Pitfall).

    Secret = PGRST_JWT_SECRET des lokalen supabase-rest-Containers. In den
    Service-Env-Files als SUPABASE_JWT_SECRET vorhanden (NICHT GOTRUE_JWT_SECRET —
    das hat eine andere Länge und decodiert nicht).
    """
    secret = (os.environ.get("SUPABASE_JWT_SECRET") or "").strip()
    if not secret:
        return None
    now = int(time.time())
    header = _b64url({"alg": "HS256", "typ": "JWT"})
    payload = _b64url(
        {"role": "service_role", "iss": "supabase", "iat": now, "exp": now + 3600}
    )
    sig = base64.urlsafe_b64encode(
        hmac.new(secret.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
    ).rstrip(b"=").decode()
    return f"{header}.{payload}.{sig}"


async def _insert_drip_lead(name: str, email: str, source: str) -> bool:
    """Insert in Drip-Tabelle `leads` via PostgREST (service_role).

    Spalten nach tatsächlichem Schema (id bigint, name, contact_email, status,
    source, metadata, ...). Rückgabe: True bei 2xx.
    """
    url = (os.environ.get("SUPABASE_URL") or "").strip().rstrip("/")
    # WICHTIG: pipeline.env (nexifyai-backend.service) hat den VOLLEN Service-Role-Key
    # (…GoV4). credentials.env hat einen gekürzten (…UzB). hermes.env überschreibt
    # beide mit einem sb_secret_*-Key, der am Kong 401 gibt (JWT-Dekodier-Fehler).
    # Deshalb: bevorzugt den pipeline-Key explizit aus /opt/nexifyai/config/pipeline.env
    # lesen, wenn vorhanden — NICHT aus dem systemd-Environment (Last-Write-Wins).
    key = ""
    try:
        with open("/opt/nexifyai/config/pipeline.env") as _f:
            for _line in _f:
                _line = _line.strip()
                if _line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
                    key = _line.split("=", 1)[1].strip()
    except FileNotFoundError:
        pass
    if not key:
        key = (
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
            or os.environ.get("SUPABASE_SERVICE_KEY")
            or ""
        ).strip()
    jwt = _service_jwt()
    if not url or not key or not jwt:
        return False
    import httpx

    payload = {
        "name": name or "E-Book-Interessent",
        "contact_email": email,
        "status": "new",
        "source": source or "ebook",
        "metadata": {"magnet": "ebook-ki-automation", "consent": True},
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(
                f"{url}/rest/v1/leads",
                headers={
                    "apikey": key,
                    "Authorization": f"Bearer {jwt}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                json=payload,
            )
            return r.status_code < 300
    except Exception:
        return False


async def _insert_nexify_lead(db, name: str, email: str, source: str) -> bool:
    """Insert in interne nexify_leads-Tabelle (Backend-Pool) — DSGVO-konforme Zuordnung."""
    if db is None:
        return False
    try:
        async with db.acquire() as con:
            await con.execute(
                "insert into nexify_leads (id,name,email,language,message,source,status) values ($1,$2,$3,'de','','ebook','new')",
                uuid.uuid4(),
                name or "E-Book-Interessent",
                email,
            )
            # source-Spalte ist default 'contact'; wir setzen sie explizit
            await con.execute(
                "update nexify_leads set source=$1 where email=$2 and source='ebook'",
                source or "ebook",
                email,
            )
        return True
    except Exception:
        return False


def _ebook_mail_html(name: str) -> str:
    """CI-Mail (dunkle Karte #111114 auf #0a0a0a, Lime #C8FF00) — M-01."""
    from server import ci_email

    esc_name = name.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
    body = (
        f"<p>vielen Dank für Ihr Interesse an <strong>KI-Automation für den Mittelstand — "
        f"10 Strategien, die sofort Zeit &amp; Geld sparen</strong>.</p>"
        f"<p>Hier geht es direkt zum Download:</p>"
    )
    return ci_email(
        f"Ihr E-Book ist da, {esc_name or 'dort'}.",
        body,
        cta_label="E-Book jetzt herunterladen",
        cta_url=PDF_URL,
        label="Ihr E-Book · KI-Automation",
    )


@router.post("/api/ebook")
async def ebook(body: EbookIn):
    from server import db, send_email

    email = body.email.strip().lower()
    name = (body.name or "").strip()[:120]
    utm = "|".join(
        x
        for x in [
            (body.utm_source or "").strip()[:60],
            (body.utm_medium or "").strip()[:60],
            (body.utm_campaign or "").strip()[:60],
        ]
        if x
    )
    source = f"ebook:{utm}" if utm else "ebook"

    lead_stored = await _insert_drip_lead(name, email, source)
    pool = await db()
    lead_nex = await _insert_nexify_lead(pool, name, email, source)

    mail_id = await send_email(
        email,
        "Ihr E-Book: KI-Automation für den Mittelstand",
        _ebook_mail_html(name),
    )

    return {
        "ok": True,
        "pdf": PDF_URL,
        "leadStored": lead_stored,
        "leadNex": lead_nex,
        "mailSent": bool(mail_id),
    }
