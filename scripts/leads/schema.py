# FILE: /scripts/leads/schema.py
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 11:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Lead queue schema + status machine + normalization (UWG consent fields)
# WHY: Shared CSV/JSON queue for discover → research → contact → reply → won/lost
# BEST-PRACTICE: Explicit consent + source_url; never treat LI as email-send basis
# PITFALL: V-LEAD-02/UWG-01: Refuse purchased_list; seeds ≠ consent (§7 UWG)
# DEPENDS: stdlib only
# DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md, docs/gtm/UWG-EMAIL-OPTIN-ONLY.md
# SESSION: zero-cost-leads-mailing-7dd5

from __future__ import annotations

import csv
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

STATUSES = (
    "new",
    "researched",
    "contacted",
    "replied",
    "won",
    "lost",
    "skipped",
)

OUTREACH_STATUS_MAP = {
    "new": "scraped",
    "researched": "outreach_pending",
    "contacted": "sent",
    "replied": "sent",
    "won": "sent",
    "lost": "skipped",
    "skipped": "skipped",
}

FORBIDDEN_SOURCES = frozenset(
    {
        "purchased_list",
        "bought_list",
        "spam_list",
        "scraped_personal_consumer",
        "leak",
        "breach",
    }
)

BUSINESS_LOCAL_PARTS = frozenset(
    {
        "info",
        "kontakt",
        "contact",
        "office",
        "hello",
        "hallo",
        "mail",
        "team",
        "anfrage",
        "inquiry",
        "sales",
        "vertrieb",
        "service",
        "support",
        "buchhaltung",
        "admin",
        "webmaster",
        "presse",
        "press",
        "partner",
        "partners",
        "agency",
        "agentur",
    }
)

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
FREEMAIL = frozenset(
    {
        "gmail.com",
        "googlemail.com",
        "yahoo.com",
        "yahoo.de",
        "hotmail.com",
        "outlook.com",
        "live.com",
        "gmx.de",
        "gmx.net",
        "web.de",
        "t-online.de",
        "icloud.com",
        "mail.de",
        "aol.com",
    }
)

# Own-domain self-test may send without external opt-in (SMTP smoke only).
SELF_TEST_DOMAINS = frozenset({"nexifyai.cloud", "nexifyai.nl", "nexifyai.de"})

OPTIN_SOURCE_TYPES = frozenset(
    {
        "optin",
        "opt_in",
        "consent",
        "form",
        "checkliste",
        "kontakt",
        "newsletter",
        "booking",
        "self_test",
    }
)

FIELDNAMES = [
    "id",
    "company",
    "website",
    "email",
    "role_hypothesis",
    "source",
    "source_url",
    "source_type",
    "region",
    "service_slug",
    "contact_reason",
    "legal_basis",
    "consent",
    "consent_recorded_at",
    "status",
    "send_allowed",
    "do_not_mail",
    "created_at",
    "updated_at",
    "notes",
]


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def lead_id(company: str, website: str = "", email: str = "") -> str:
    raw = f"{(email or '').lower()}|{(company or '').strip().lower()}|{(website or '').strip().lower()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def is_business_email(email: str) -> bool:
    email = (email or "").strip().lower()
    if not EMAIL_RE.fullmatch(email):
        return False
    local, _, domain = email.partition("@")
    if not domain or domain in FREEMAIL:
        return False
    return True


def email_domain(email: str) -> str:
    return (email or "").strip().lower().partition("@")[2]


def is_self_test_email(email: str) -> bool:
    """Own-domain addresses only — SMTP self-test, not external cold mail."""
    return email_domain(email) in SELF_TEST_DOMAINS


def has_send_consent(lead: dict[str, Any]) -> bool:
    """§7 UWG: explicit consent, or self-test to own domain."""
    if lead.get("consent") is True:
        return True
    if is_self_test_email(lead.get("email") or ""):
        return True
    return False


def normalize_lead(raw: dict[str, Any]) -> dict[str, Any]:
    email = (raw.get("email") or raw.get("contact_email") or "").strip().lower()
    company = (raw.get("company") or raw.get("name") or "").strip()
    website = (raw.get("website") or raw.get("url") or raw.get("source_url") or "").strip()
    source_type = (raw.get("source_type") or raw.get("source") or "public_website").strip()
    if isinstance(raw.get("source"), dict):
        source_type = raw["source"].get("type") or source_type
        website = website or (raw["source"].get("url") or "")
    status = (raw.get("status") or "new").strip().lower()
    if status not in STATUSES:
        status = "new"
    now = utc_now()
    consent = raw.get("consent") is True
    # Seeds / scrape never imply consent — only explicit true or self-test domain.
    if is_self_test_email(email) and raw.get("source_type") == "self_test":
        consent = True
    legal = (raw.get("legal_basis") or "").strip()
    if not legal:
        legal = "consent" if consent else "opt_in_required"
    return {
        "id": raw.get("id") or lead_id(company, website, email),
        "company": company,
        "website": website,
        "email": email,
        "role_hypothesis": (
            raw.get("role_hypothesis") or raw.get("role") or "Geschäftsführung / Marketing"
        ).strip(),
        "source": raw.get("source") if isinstance(raw.get("source"), str) else source_type,
        "source_url": (raw.get("source_url") or website).strip(),
        "source_type": source_type,
        "region": (raw.get("region") or "DACH").strip(),
        "service_slug": (raw.get("service_slug") or "ai-agenten").strip(),
        "contact_reason": (raw.get("contact_reason") or raw.get("enrichment_summary") or "").strip(),
        "legal_basis": legal,
        "consent": consent,
        "consent_recorded_at": raw.get("consent_recorded_at"),
        "status": status,
        "send_allowed": bool(raw.get("send_allowed", False)),
        "do_not_mail": bool(raw.get("do_not_mail", False)),
        "created_at": raw.get("created_at") or now,
        "updated_at": now,
        "notes": (raw.get("notes") or "").strip(),
    }


def validate_for_queue(lead: dict[str, Any]) -> str | None:
    st = (lead.get("source_type") or lead.get("source") or "").lower()
    if st in FORBIDDEN_SOURCES:
        return f"forbidden_source:{st}"
    if lead.get("email") and not is_business_email(lead["email"]):
        return "non_business_or_freemail"
    if not lead.get("company") and not lead.get("website"):
        return "missing_company_or_website"
    return None


def default_data_dir() -> Path:
    for cand in (
        Path("/var/lib/nexifyai/leads"),
        Path(__file__).resolve().parents[2] / "data" / "leads",
    ):
        try:
            cand.mkdir(parents=True, exist_ok=True)
            probe = cand / ".write_probe"
            probe.write_text("ok")
            probe.unlink(missing_ok=True)
            return cand
        except OSError:
            continue
    return Path(__file__).resolve().parents[2] / "data" / "leads"


def queue_path(data_dir: Path | None = None) -> Path:
    base = data_dir or default_data_dir()
    base.mkdir(parents=True, exist_ok=True)
    return base / "queue.jsonl"


def load_queue(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    out: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            out.append(normalize_lead(json.loads(line)))
        except json.JSONDecodeError:
            continue
    return out


def save_queue(path: Path, leads: Iterable[dict[str, Any]]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    n = 0
    with path.open("w", encoding="utf-8") as fh:
        for raw in leads:
            lead = normalize_lead(raw)
            fh.write(json.dumps(lead, ensure_ascii=False) + "\n")
            n += 1
    return n


def append_leads(path: Path, leads: Iterable[dict[str, Any]]) -> tuple[int, int]:
    existing = {x["id"]: x for x in load_queue(path)}
    added = 0
    skipped = 0
    for raw in leads:
        lead = normalize_lead(raw)
        reason = validate_for_queue(lead)
        if reason and reason.startswith("forbidden"):
            skipped += 1
            continue
        if lead["id"] in existing:
            prev = existing[lead["id"]]
            for k, v in lead.items():
                if v and k not in ("created_at", "id"):
                    prev[k] = v
            prev["updated_at"] = utc_now()
            skipped += 1
            continue
        existing[lead["id"]] = lead
        added += 1
    save_queue(path, existing.values())
    return added, skipped


def export_csv(path: Path, leads: Iterable[dict[str, Any]]) -> None:
    rows = [normalize_lead(x) for x in leads]
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=FIELDNAMES, extrasaction="ignore")
        w.writeheader()
        for row in rows:
            row = dict(row)
            row["send_allowed"] = "true" if row.get("send_allowed") else "false"
            row["do_not_mail"] = "true" if row.get("do_not_mail") else "false"
            row["consent"] = "true" if row.get("consent") else "false"
            w.writerow({k: row.get(k, "") for k in FIELDNAMES})


def set_status(lead: dict[str, Any], status: str, **extra: Any) -> dict[str, Any]:
    if status not in STATUSES:
        raise ValueError(f"invalid status: {status}")
    normalized = normalize_lead(lead)
    normalized["status"] = status
    normalized["updated_at"] = utc_now()
    for k, v in extra.items():
        normalized[k] = v
    # mutate caller's dict so queue list updates stick
    lead.clear()
    lead.update(normalized)
    return lead


def to_outreach_record(lead: dict[str, Any]) -> dict[str, Any]:
    consent = has_send_consent(lead)
    return {
        "id": lead.get("id"),
        "company": lead.get("company"),
        "email": lead.get("email"),
        "website": lead.get("website"),
        "source_url": lead.get("source_url") or lead.get("website"),
        "source": lead.get("source_type") or lead.get("source"),
        "source_type": lead.get("source_type") or "public_website",
        "service_slug": lead.get("service_slug") or "ai-agenten",
        "contact_reason": lead.get("contact_reason"),
        "legal_basis": lead.get("legal_basis") or ("consent" if consent else "opt_in_required"),
        "consent": consent,
        "consent_recorded_at": lead.get("consent_recorded_at"),
        "region": lead.get("region") or "DACH",
        "status": OUTREACH_STATUS_MAP.get(lead.get("status") or "new", "scraped"),
        # Never promote scrape seeds as send_allowed unless consent/self-test.
        "send_allowed": bool(lead.get("send_allowed")) and consent,
        "role_hypothesis": lead.get("role_hypothesis"),
    }
