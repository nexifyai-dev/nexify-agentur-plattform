# FILE: /scripts/leads/mail_batch.py
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Rate-limited Hostinger SMTP batch — dry-run default, --send for live
# WHY: Activate first compliant B2B mails without Resend cold-quota burn
# BEST-PRACTICE: Cap small (≤10 first batch); require send_allowed + business email
# PITFALL: V-LEAD-05: Never print passwords; load mail-nexifyai.env quietly
# DEPENDS: schema, templates_ai_begleiter, scripts/outreach/smtp_hostinger
# DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md
# SESSION: zero-cost-leads-mailing-7dd5

from __future__ import annotations

import os
import sys
import time
import random
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
from urllib.parse import quote

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from leads.schema import (
    is_business_email,
    load_queue,
    queue_path,
    save_queue,
    set_status,
    validate_for_queue,
)
from leads import templates_ai_begleiter as tpl

try:
    from outreach import smtp_hostinger
    from outreach.store import unsub_token
except ImportError:  # pragma: no cover
    smtp_hostinger = None  # type: ignore

    def unsub_token(email: str, secret_salt: str = "nexify-outreach") -> str:
        return "dry"


def load_env_files(*paths: str) -> None:
    for path in paths:
        p = Path(path)
        if not p.is_file():
            continue
        for line in p.read_text(encoding="utf-8", errors="replace").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            k = k.strip()
            if not k or k in os.environ:
                continue
            os.environ[k] = v.strip().strip("'").strip('"')


@dataclass
class BatchResult:
    attempted: int = 0
    dry_run: int = 0
    sent: int = 0
    skipped: int = 0
    errors: int = 0
    details: list[dict[str, Any]] = field(default_factory=list)

    def as_dict(self) -> dict[str, Any]:
        return {
            "attempted": self.attempted,
            "dry_run": self.dry_run,
            "sent": self.sent,
            "skipped": self.skipped,
            "errors": self.errors,
            "details": self.details[:30],
        }


def _smtp_creds() -> dict[str, Any]:
    user = os.environ.get("SMTP_USER") or os.environ.get("IMAP_USER") or ""
    password = os.environ.get("SMTP_PASSWORD") or os.environ.get("IMAP_PASSWORD") or ""
    return {
        "host": os.environ.get("SMTP_HOST", "smtp.hostinger.com"),
        "port": int(os.environ.get("SMTP_PORT", "465") or "465"),
        "user": user,
        "password": password,
        "sender_email": os.environ.get("SENDER_EMAIL") or user or "mail@nexifyai.cloud",
        "sender_name": os.environ.get("SENDER_NAME", "Pascal Courbois · NeXify AI"),
        "reply_to": os.environ.get("REPLY_TO_EMAIL") or "mail@nexifyai.cloud",
    }


def _unsubscribe_url(email: str) -> str:
    base = os.environ.get(
        "OUTREACH_UNSUBSCRIBE_URL",
        "https://www.nexifyai.cloud/api/outreach/unsubscribe",
    )
    return f"{base}?email={quote(email)}&token={unsub_token(email)}"


def eligible(lead: dict[str, Any], *, require_send_allowed: bool = True) -> str | None:
    if lead.get("do_not_mail"):
        return "do_not_mail"
    if require_send_allowed and not lead.get("send_allowed"):
        return "send_allowed=false"
    if lead.get("status") not in {"researched", "new"}:
        return f"status={lead.get('status')}"
    if not lead.get("email") or not is_business_email(lead["email"]):
        return "missing_or_invalid_business_email"
    reason = validate_for_queue(lead)
    if reason:
        return reason
    return None


def run_batch(
    leads: list[dict[str, Any]],
    *,
    send: bool = False,
    limit: int = 10,
    pace_min: float = 8.0,
    pace_max: float = 20.0,
    require_send_allowed: bool = True,
    booking_url: str | None = None,
) -> BatchResult:
    result = BatchResult()
    creds = _smtp_creds()
    booking = booking_url or os.environ.get("OUTREACH_BOOKING_URL") or tpl.BOOKING_DEFAULT
    candidates = []
    for lead in leads:
        why = eligible(lead, require_send_allowed=require_send_allowed)
        if why:
            result.skipped += 1
            result.details.append({"id": lead.get("id"), "company": lead.get("company"), "skip": why})
            continue
        candidates.append(lead)
        if len(candidates) >= limit:
            break

    for lead in candidates:
        result.attempted += 1
        email = lead["email"]
        subject = tpl.build_subject(lead)
        unsub = _unsubscribe_url(email)
        text = tpl.build_text_body(lead, booking_url=booking, unsubscribe_url=unsub)
        html = tpl.build_html_body(lead, booking_url=booking, unsubscribe_url=unsub)
        domain = email.split("@", 1)[-1]
        detail = {"id": lead.get("id"), "company": lead.get("company"), "to_domain": domain, "subject": subject}
        if not send:
            result.dry_run += 1
            detail["mode"] = "dry-run"
            result.details.append(detail)
            continue
        if not creds["password"] or not creds["user"]:
            result.errors += 1
            detail["error"] = "missing_smtp"
            result.details.append(detail)
            continue
        if smtp_hostinger is None:
            result.errors += 1
            detail["error"] = "smtp_module_missing"
            result.details.append(detail)
            continue
        try:
            smtp_hostinger.send_hostinger(
                host=creds["host"],
                port=creds["port"],
                user=creds["user"],
                password=creds["password"],
                sender_email=creds["sender_email"],
                sender_name=creds["sender_name"],
                reply_to=creds["reply_to"],
                to_email=email,
                subject=subject,
                text_body=text,
                html_body=html,
            )
            result.sent += 1
            detail["mode"] = "sent"
            set_status(lead, "contacted", send_allowed=False)
        except Exception as exc:  # noqa: BLE001
            result.errors += 1
            detail["error"] = type(exc).__name__
        result.details.append(detail)
        time.sleep(random.uniform(pace_min, pace_max))
    return result


def run_from_queue(
    *,
    send: bool = False,
    limit: int = 10,
    data_dir: Path | None = None,
    require_send_allowed: bool = True,
) -> BatchResult:
    path = queue_path(data_dir)
    leads = load_queue(path)
    result = run_batch(
        leads, send=send, limit=limit, require_send_allowed=require_send_allowed
    )
    if send and result.sent:
        by_id = {x["id"]: x for x in leads}
        for d in result.details:
            if d.get("mode") == "sent" and d.get("id") in by_id:
                by_id[d["id"]] = set_status(by_id[d["id"]], "contacted", send_allowed=False)
        save_queue(path, by_id.values())
    return result
