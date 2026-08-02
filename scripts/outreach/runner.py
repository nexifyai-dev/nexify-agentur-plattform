# FILE: /scripts/outreach/runner.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Daily outreach runner — cap ≤800, slow jitter, GDPR gates
# WHY: Win B2B customers without Hostinger spam trips or Resend quota burn
# BEST-PRACTICE: Dry-run when OUTREACH_LIVE≠1 or SMTP missing; agent owns retries
# PITFALL: V-OUT-01/03: Cap + source/consent checks are non-negotiable
# DEPENDS: config, store, templates_de, smtp_hostinger, firecrawl_client
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

import logging
import random
import time
from dataclasses import dataclass, field
from typing import Any

from .config import OutreachConfig, UWG_WARNING
from . import firecrawl_client
from . import smtp_hostinger
from . import store
from . import templates_de

logger = logging.getLogger("nexify.outreach.runner")


@dataclass
class RunResult:
    attempted: int = 0
    sent: int = 0
    dry_run: int = 0
    skipped: int = 0
    errors: int = 0
    blocked: str | None = None
    details: list[dict[str, Any]] = field(default_factory=list)

    def as_dict(self) -> dict[str, Any]:
        return {
            "attempted": self.attempted,
            "sent": self.sent,
            "dry_run": self.dry_run,
            "skipped": self.skipped,
            "errors": self.errors,
            "blocked": self.blocked,
            "details": self.details[:50],
        }


def select_candidates(cfg: OutreachConfig, leads: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for lead in leads:
        email = (lead.get("email") or "").lower()
        # Only drip from outreach_pending (scraped stays in queue until promoted)
        if (lead.get("status") or "") != "outreach_pending":
            continue
        reason = store.validate_for_send(
            lead, require_send_allowed=cfg.require_send_allowed
        )
        if reason:
            continue
        if store.is_unsubscribed(cfg.unsub_dir, email):
            continue
        if store.already_sent_email(cfg.state_dir, email):
            continue
        out.append(lead)
    return out


def run_daily(cfg: OutreachConfig, *, sleep_fn=time.sleep) -> RunResult:
    result = RunResult()
    cfg.queue_dir.mkdir(parents=True, exist_ok=True)
    cfg.state_dir.mkdir(parents=True, exist_ok=True)
    cfg.unsub_dir.mkdir(parents=True, exist_ok=True)

    already = store.today_sent_count(cfg.state_dir)
    remaining = max(0, cfg.daily_cap - already)
    if remaining == 0:
        result.blocked = f"daily_cap_reached:{cfg.daily_cap}"
        return result

    # UWG §7: --live without --allow-opt-in-send must not send
    if cfg.live and not cfg.allow_opt_in_send:
        result.blocked = "uwg_opt_in_required:need_--allow-opt-in-send_and_consent=true"
        logger.error("%s", UWG_WARNING)
        store.record_event(
            cfg.state_dir,
            "blocked",
            {"reason": result.blocked, "uwg": True, "human_gate": True, "warning": UWG_WARNING},
        )
        return result

    if cfg.effective_live and not cfg.smtp_ready:
        result.blocked = cfg.blocked_reason or "smtp_not_ready"
        store.record_event(
            cfg.state_dir,
            "blocked",
            {"reason": result.blocked, "human_gate": True},
        )
        return result

    leads = store.load_queue(cfg.queue_dir)
    candidates = select_candidates(cfg, leads)[:remaining]
    logger.info(
        "outreach: queue=%d candidates=%d remaining_cap=%d live=%s allow_opt_in=%s",
        len(leads),
        len(candidates),
        remaining,
        cfg.live,
        cfg.allow_opt_in_send,
    )
    do_live = cfg.effective_live

    for i, lead in enumerate(candidates):
        result.attempted += 1
        email = lead["email"]

        if cfg.enrich and (lead.get("website") or lead.get("source_url")):
            try:
                lead = firecrawl_client.enrich_lead(
                    lead,
                    base_url=cfg.firecrawl_url,
                    api_key=cfg.firecrawl_api_key,
                )
            except Exception as e:
                logger.warning("enrich skipped: %s", e)

        unsub = store.unsubscribe_url_for(cfg.unsubscribe_base_url, email)
        subject = lead.get("subject") or templates_de.build_subject(lead)
        text_body = lead.get("body") or templates_de.build_text_body(
            lead, booking_url=cfg.booking_url, unsubscribe_url=unsub
        )
        html_body = templates_de.build_html_body(
            lead, booking_url=cfg.booking_url, unsubscribe_url=unsub
        )

        if not do_live:
            result.dry_run += 1
            result.details.append(
                {"email": email, "status": "dry_run", "subject": subject[:80]}
            )
            store.record_event(
                cfg.state_dir,
                "dry_run",
                {"lead_id": lead.get("id"), "email": email, "subject": subject},
            )
        else:
            try:
                smtp_hostinger.send_hostinger(
                    host=cfg.smtp_host,
                    port=cfg.smtp_port,
                    user=cfg.smtp_user,
                    password=cfg.smtp_password,
                    sender_email=cfg.sender_email,
                    sender_name=cfg.sender_name,
                    reply_to=cfg.reply_to,
                    to_email=email,
                    subject=subject,
                    text_body=text_body,
                    html_body=html_body,
                )
                result.sent += 1
                store.record_sent(
                    cfg.state_dir,
                    lead,
                    {"subject": subject, "source": lead.get("source")},
                )
                result.details.append({"email": email, "status": "sent"})
            except Exception as e:
                result.errors += 1
                err = str(e)[:160]
                logger.error("send failed %s: %s", email, err)
                store.record_event(
                    cfg.state_dir,
                    "errors",
                    {"lead_id": lead.get("id"), "email": email, "error": err},
                )
                result.details.append({"email": email, "status": "error", "error": err})

        # Pace only for live sends (dry-run stays fast for CI/agent loops)
        if do_live and i < len(candidates) - 1:
            delay = random.uniform(cfg.pace_min_sec, cfg.pace_max_sec)
            sleep_fn(delay)

    result.skipped = len(leads) - result.attempted
    return result
