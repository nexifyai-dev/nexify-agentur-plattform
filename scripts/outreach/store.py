# FILE: /scripts/outreach/store.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: JSONL lead queue + sent/bounce/unsub state (GDPR source/consent fields)
# WHY: File-backed store works without DB when Supabase is down; auditable
# BEST-PRACTICE: Append-only state; never store purchased list provenance as OK
# PITFALL: V-OUT-03: Refuse leads without source + email
# DEPENDS: data/outreach/*
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

import hashlib
import json
import re
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Iterator
from urllib.parse import quote

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
OUTREACH_STATUSES = frozenset(
    {"scraped", "outreach_pending", "sent", "bounced", "unsubscribed", "skipped"}
)
FORBIDDEN_SOURCES = frozenset(
    {"purchased_list", "bought_list", "spam_list", "scraped_personal_consumer"}
)


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def lead_id(lead: dict[str, Any]) -> str:
    if lead.get("id"):
        return str(lead["id"])
    email = (lead.get("email") or lead.get("contact_email") or "").lower().strip()
    raw = f"{email}|{lead.get('company') or lead.get('name') or ''}|{lead.get('source_url') or ''}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def unsub_token(email: str, secret_salt: str = "nexify-outreach") -> str:
    return hashlib.sha256(f"{secret_salt}:{email.lower().strip()}".encode()).hexdigest()[:32]


def normalize_lead(raw: dict[str, Any]) -> dict[str, Any]:
    """Normalize CRM-pending / pipeline lead into outreach schema."""
    src = raw.get("source") if isinstance(raw.get("source"), dict) else {}
    email = (
        raw.get("email")
        or raw.get("contact_email")
        or raw.get("to")
        or ""
    ).strip().lower()
    company = (
        raw.get("company")
        or raw.get("name")
        or src.get("company")
        or ""
    ).strip()
    if isinstance(raw.get("source"), str):
        source_id = raw.get("source_id") or raw.get("source") or "unknown"
    else:
        source_id = raw.get("source_id") or src.get("id") or "unknown"
    if isinstance(source_id, dict):
        source_id = source_id.get("id") or "unknown"

    lead = {
        "id": raw.get("id") or None,
        "email": email,
        "company": company,
        "name": raw.get("name") or company,
        "contact_name": raw.get("contact_name") or "",
        "website": raw.get("website") or raw.get("url") or src.get("url") or "",
        "source": str(source_id),
        "source_url": raw.get("source_url") or src.get("url") or raw.get("url") or "",
        "source_type": raw.get("source_type") or "public_b2b",
        "legal_basis": raw.get("legal_basis") or "legitimate_interest_b2b",
        "consent_recorded_at": raw.get("consent_recorded_at"),
        "contact_reason": raw.get("contact_reason") or "",
        "service_slug": raw.get("service_slug") or "",
        "status": raw.get("status") or "scraped",
        "send_allowed": bool(raw.get("send_allowed", False)),
        "enrichment_summary": raw.get("enrichment_summary") or "",
        "created_at": raw.get("created_at") or utc_now(),
        "updated_at": utc_now(),
    }
    lead["id"] = lead_id(lead)
    return lead


def validate_for_send(lead: dict[str, Any], *, require_send_allowed: bool) -> str | None:
    """Return error reason or None if sendable."""
    email = (lead.get("email") or "").strip().lower()
    if not email or not EMAIL_RE.match(email):
        return "invalid_email"
    if not (lead.get("source") or lead.get("source_url")):
        return "missing_source"
    st = (lead.get("source_type") or "").lower()
    if st in FORBIDDEN_SOURCES or (lead.get("source") or "").lower() in FORBIDDEN_SOURCES:
        return "forbidden_source"
    if require_send_allowed and not lead.get("send_allowed"):
        return "send_not_allowed"
    status = lead.get("status") or ""
    if status not in ("outreach_pending", "scraped") and status not in OUTREACH_STATUSES:
        return f"bad_status:{status}"
    if status in ("sent", "bounced", "unsubscribed", "skipped"):
        return f"already_{status}"
    if status == "scraped" and require_send_allowed:
        return "status_not_outreach_pending"
    return None


def iter_jsonl(path: Path) -> Iterator[dict[str, Any]]:
    if not path.exists():
        return
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(obj, dict):
                yield obj


def load_queue(queue_dir: Path) -> list[dict[str, Any]]:
    queue_dir.mkdir(parents=True, exist_ok=True)
    leads: list[dict[str, Any]] = []
    seen: set[str] = set()
    files = sorted(queue_dir.glob("*.jsonl")) + sorted(queue_dir.glob("*.json"))
    for path in files:
        if path.suffix == ".json":
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                continue
            items = data if isinstance(data, list) else data.get("leads") or [data]
            for raw in items:
                if isinstance(raw, dict):
                    lead = normalize_lead(raw)
                    if lead["id"] not in seen:
                        seen.add(lead["id"])
                        leads.append(lead)
        else:
            for raw in iter_jsonl(path):
                lead = normalize_lead(raw)
                if lead["id"] not in seen:
                    seen.add(lead["id"])
                    leads.append(lead)
    return leads


def load_email_set(path: Path) -> set[str]:
    emails: set[str] = set()
    if not path.exists():
        return emails
    if path.suffix == ".jsonl":
        for obj in iter_jsonl(path):
            e = (obj.get("email") or "").lower().strip()
            if e:
                emails.add(e)
    else:
        for line in path.read_text(encoding="utf-8").splitlines():
            e = line.strip().lower()
            if e and not e.startswith("#") and "@" in e:
                emails.add(e)
    return emails


def append_jsonl(path: Path, record: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False) + "\n")


def today_sent_count(state_dir: Path, day: date | None = None) -> int:
    day = day or date.today()
    path = state_dir / f"sent-{day.isoformat()}.jsonl"
    return sum(1 for _ in iter_jsonl(path))


def record_sent(state_dir: Path, lead: dict[str, Any], meta: dict[str, Any]) -> None:
    day = date.today().isoformat()
    append_jsonl(
        state_dir / f"sent-{day}.jsonl",
        {
            "ts": utc_now(),
            "lead_id": lead.get("id"),
            "email": lead.get("email"),
            "company": lead.get("company"),
            "channel": "hostinger_smtp",
            **meta,
        },
    )


def record_event(state_dir: Path, kind: str, payload: dict[str, Any]) -> None:
    append_jsonl(state_dir / f"{kind}.jsonl", {"ts": utc_now(), **payload})


def is_unsubscribed(unsub_dir: Path, email: str) -> bool:
    email = email.lower().strip()
    for path in unsub_dir.glob("*"):
        if path.is_file() and email in load_email_set(path):
            return True
    return False


def already_sent_email(state_dir: Path, email: str, lookback_days: int = 90) -> bool:
    email = email.lower().strip()
    if not state_dir.exists():
        return False
    for path in state_dir.glob("sent-*.jsonl"):
        for obj in iter_jsonl(path):
            if (obj.get("email") or "").lower() == email:
                return True
    return False


def unsubscribe_url_for(base: str, email: str) -> str:
    token = unsub_token(email)
    sep = "&" if "?" in base else "?"
    return f"{base}{sep}email={quote(email)}&token={token}"
