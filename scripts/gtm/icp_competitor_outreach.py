#!/usr/bin/env python3
# FILE: /scripts/gtm/icp_competitor_outreach.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: ICP-segmented lead discover (demo) + competitor-angle mail dry-run/send
# WHY: Run pain→audit→pilot outreach without paid tools; default dry-run
# BEST-PRACTICE: --dry-run default; consent gate for --send; tiny batch cap
# PITFALL: V-GTM-OUT-02: No bought lists; refuse send without consent=true
# DEPENDS: competitor_angle_templates_de.py, demand_scan_prepare.py
# DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md
# SESSION: strongest-competitors-tactics-7dd5

"""ICP discover + competitor-angle outreach.

Usage:
  python3 scripts/gtm/icp_competitor_outreach.py --discover-demo
  python3 scripts/gtm/icp_competitor_outreach.py --mail-list leads.json --dry-run
  python3 scripts/gtm/icp_competitor_outreach.py --mail-list leads.json --send --limit 3
"""

from __future__ import annotations

import argparse
import json
import os
import smtplib
import sys
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from competitor_angle_templates_de import (  # noqa: E402
    build_html_body,
    build_subject,
    build_text_body,
)
from demand_scan_prepare import build_pending  # noqa: E402

BOOKING = "https://www.nexifyai.cloud/rueckruf?utm_source=outreach&utm_campaign=competitor_angle"
UNSUB = "https://www.nexifyai.cloud/kontakt?utm_source=outreach&utm_campaign=unsubscribe"
AUDIT = "https://www.nexifyai.cloud/audit"

ICP_DEMO_HITS: list[dict[str, Any]] = [
    {
        "source_id": "demo-handwerk-01",
        "title": "Schreinerei sucht Digitalisierung Angebotswesen",
        "url": "https://example.invalid/handwerk",
        "summary": "KMU Handwerk, Anfragen aus Portalen, kein CRM-Flow",
        "company": "Demo Schreinerei GmbH",
        "region": "NRW",
        "service_slug": "automatisierung",
        "icp": "handwerk",
        "decision_maker_visible": True,
        "remote_ok": True,
        "staffing_only": False,
    },
    {
        "source_id": "demo-steuer-01",
        "title": "Steuerkanzlei will Mandantenportal",
        "url": "https://example.invalid/steuer",
        "summary": "Onboarding und Belegnachfass manuell",
        "company": "Demo Steuerberatung",
        "region": "Bayern",
        "service_slug": "web-apps",
        "icp": "steuerberater",
        "decision_maker_visible": True,
        "remote_ok": True,
        "staffing_only": False,
    },
    {
        "source_id": "demo-ecom-01",
        "title": "Online-Shop Support-Automatisierung",
        "url": "https://example.invalid/ecom",
        "summary": "Ticketvolumen steigt, Checkout-Reibung",
        "company": "Demo Shop UG",
        "region": "Hamburg",
        "service_slug": "onlineshops",
        "icp": "ecommerce",
        "decision_maker_visible": True,
        "remote_ok": True,
        "staffing_only": False,
    },
]


def discover_demo(out_dir: Path) -> list[dict[str, Any]]:
    out_dir.mkdir(parents=True, exist_ok=True)
    records = [build_pending(h) | {"icp": h.get("icp", "default"), "source_id": h.get("source_id")} for h in ICP_DEMO_HITS]
    # use prepare pipeline scoring via build_pending already
    path = out_dir / f"icp_demo_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.json"
    path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(records)} pending → {path}")
    return records


def load_leads(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("mail-list must be a JSON array")
    return data


def validate_lead(lead: dict[str, Any]) -> str | None:
    if lead.get("consent") is not True:
        return "missing consent=true"
    if lead.get("unsubscribed"):
        return "unsubscribed"
    email = (lead.get("email") or "").strip()
    if "@" not in email:
        return "invalid email"
    return None


def smtp_send(msg: MIMEMultipart) -> None:
    host = os.environ.get("SMTP_HOST") or os.environ.get("SMTP_HOSTINGER_HOST")
    port = int(os.environ.get("SMTP_PORT") or os.environ.get("SMTP_HOSTINGER_PORT") or "465")
    user = os.environ.get("SMTP_USER") or os.environ.get("SMTP_HOSTINGER_USER")
    password = os.environ.get("SMTP_PASS") or os.environ.get("SMTP_HOSTINGER_PASS")
    if not all([host, user, password]):
        raise RuntimeError("SMTP credentials missing (SMTP_HOST/USER/PASS)")
    with smtplib.SMTP_SSL(host, port, timeout=30) as smtp:
        smtp.login(user, password)
        smtp.send_message(msg)


def run_mail(leads: list[dict[str, Any]], *, dry_run: bool, limit: int) -> dict[str, int]:
    sent = skipped = errors = 0
    for lead in leads[:limit]:
        err = validate_lead(lead)
        if err:
            print(f"SKIP {lead.get('email')}: {err}")
            skipped += 1
            continue
        subject = build_subject(lead)
        text = build_text_body(lead, booking_url=BOOKING, unsubscribe_url=UNSUB, audit_url=AUDIT)
        html = build_html_body(lead, booking_url=BOOKING, unsubscribe_url=UNSUB, audit_url=AUDIT)
        if dry_run:
            print("--- DRY-RUN ---")
            print("To:", lead["email"])
            print("Subject:", subject)
            print(text[:500], "...")
            sent += 1
            continue
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = os.environ.get("SMTP_FROM", "mail@nexifyai.cloud")
        msg["To"] = lead["email"]
        msg.attach(MIMEText(text, "plain", "utf-8"))
        msg.attach(MIMEText(html, "html", "utf-8"))
        try:
            smtp_send(msg)
            print(f"SENT {lead['email']}")
            sent += 1
        except Exception as exc:  # noqa: BLE001
            print(f"ERROR {lead.get('email')}: {exc}")
            errors += 1
    return {"sent": sent, "skipped": skipped, "errors": errors}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--discover-demo", action="store_true")
    ap.add_argument("--out", type=Path, default=ROOT / "docs/gtm/evidence/demand-pending")
    ap.add_argument("--mail-list", type=Path)
    ap.add_argument("--dry-run", action="store_true", default=False)
    ap.add_argument("--send", action="store_true")
    ap.add_argument("--limit", type=int, default=5)
    args = ap.parse_args()

    if args.discover_demo:
        discover_demo(args.out)

    if args.mail_list:
        dry = not args.send
        if args.dry_run:
            dry = True
        leads = load_leads(args.mail_list)
        stats = run_mail(leads, dry_run=dry, limit=args.limit)
        print("STATS", stats)
        return 0 if stats["errors"] == 0 else 1

    if not args.discover_demo:
        ap.print_help()
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
