#!/usr/bin/env python3
# FILE: /scripts/gtm/discover_and_optin_mail.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Demand discover (--demo) + opt-in nurture dry-run/send (UWG-safe)
# WHY: Runnable free CAC ops without illegal cold mail
# BEST-PRACTICE: Default --dry-run; require consent=true; small batch cap
# PITFALL: V-CAC-01: Refuse send if consent missing; no bought lists
# DEPENDS: demand_scan_prepare.py, RESEND_API_KEY or SMTP_*, docs/gtm/EMAIL-NURTURE-OPTIN.md
# DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
# SESSION: research-free-cac-full-7dd5

"""Discover demand hits + optionally send opt-in nurture mails.

Usage:
  python3 scripts/gtm/discover_and_optin_mail.py --discover-demo
  python3 scripts/gtm/discover_and_optin_mail.py --mail-list leads.json --dry-run
  python3 scripts/gtm/discover_and_optin_mail.py --mail-list leads.json --send --limit 5

leads.json: list of {email, name?, consent: true, source, unsubscribed?: false}
"""

from __future__ import annotations

import argparse
import json
import os
import smtplib
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from demand_scan_prepare import demo_hits, prepare  # noqa: E402

ALLOWED_SOURCES = {
    "checkliste",
    "kontakt",
    "planner",
    "partner",
    "botschafter",
    "sprechstunde",
    "optin",
}

NURTURE_1 = {
    "subject": "Ihre nächsten Schritte — NeXify AI Checkliste",
    "html": """<p>Hallo {name},</p>
<p>danke für Ihr Interesse. Kurzüberblick:</p>
<ul>
<li>Checkliste / Überblick: <a href="https://www.nexifyai.cloud/checkliste">/checkliste</a></li>
<li>Preisvergleich: <a href="https://www.nexifyai.cloud/vergleich">/vergleich</a></li>
<li>20-Min-Sprechstunde: <a href="https://www.nexifyai.cloud/sprechstunde">/sprechstunde</a></li>
</ul>
<p>Tagessatz: 449 € netto. B2B only.</p>
<p>Abmelden: antworten Sie mit „STOP“ oder schreiben Sie an mail@nexifyai.cloud.</p>
<p>— Pascal Courbois, NeXify AI</p>""",
}


def load_leads(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("mail-list must be a JSON array")
    return data


def validate_lead(lead: dict[str, Any]) -> str | None:
    if not lead.get("consent") is True:
        return "missing consent=true"
    if lead.get("unsubscribed"):
        return "unsubscribed"
    email = (lead.get("email") or "").strip()
    if "@" not in email:
        return "invalid email"
    source = (lead.get("source") or "").strip().lower()
    if source not in ALLOWED_SOURCES:
        return f"source not allowed: {source!r}"
    return None


def send_resend(to: str, subject: str, html: str) -> str:
    key = os.environ.get("RESEND_API_KEY", "").strip()
    if not key:
        raise RuntimeError("RESEND_API_KEY missing")
    from_addr = os.environ.get("CONTACT_FROM_EMAIL", "mail@nexifyai.cloud").strip()
    payload = json.dumps(
        {
            "from": from_addr,
            "to": [to],
            "subject": subject,
            "html": html,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8", errors="replace")
    return f"resend:{resp.status}:{body[:200]}"


def send_smtp(to: str, subject: str, html: str) -> str:
    host = os.environ.get("SMTP_HOST", "smtp.hostinger.com")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER", "").strip()
    password = os.environ.get("SMTP_PASS", "").strip()
    from_addr = os.environ.get("CONTACT_FROM_EMAIL", user or "mail@nexifyai.cloud").strip()
    if not user or not password:
        raise RuntimeError("SMTP_USER/SMTP_PASS missing")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to
    msg.attach(MIMEText(html, "html", "utf-8"))
    with smtplib.SMTP_SSL(host, port, timeout=30) as smtp:
        smtp.login(user, password)
        smtp.sendmail(from_addr, [to], msg.as_string())
    return "smtp:ok"


def send_one(to: str, subject: str, html: str) -> str:
    if os.environ.get("RESEND_API_KEY", "").strip():
        try:
            return send_resend(to, subject, html)
        except Exception as exc:  # noqa: BLE001 — fallback to SMTP
            print(f"resend failed ({exc}); trying SMTP", file=sys.stderr)
    return send_smtp(to, subject, html)


def run_discover_demo(out_dir: Path) -> int:
    out_dir.mkdir(parents=True, exist_ok=True)
    pending = prepare(demo_hits())
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = out_dir / f"discover_{stamp}.json"
    path.write_text(json.dumps(pending, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"discover: wrote {len(pending)} pending leads → {path}")
    return len(pending)


def run_mail(leads: list[dict[str, Any]], *, dry_run: bool, limit: int) -> dict[str, int]:
    stats = {"skipped": 0, "dry_run": 0, "sent": 0, "failed": 0}
    batch = 0
    for lead in leads:
        if batch >= limit:
            break
        err = validate_lead(lead)
        if err:
            print(f"skip {lead.get('email')}: {err}")
            stats["skipped"] += 1
            continue
        batch += 1
        name = (lead.get("name") or "dort").strip() or "dort"
        html = NURTURE_1["html"].format(name=name)
        subject = NURTURE_1["subject"]
        email = lead["email"].strip()
        if dry_run:
            print(f"DRY-RUN → {email} | {subject}")
            stats["dry_run"] += 1
            continue
        try:
            result = send_one(email, subject, html)
            print(f"SENT → {email} | {result}")
            stats["sent"] += 1
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL → {email}: {exc}", file=sys.stderr)
            stats["failed"] += 1
    return stats


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Discover + opt-in nurture (UWG-safe)")
    p.add_argument("--discover-demo", action="store_true", help="Run demand demo → JSON")
    p.add_argument(
        "--discover-out",
        type=Path,
        default=ROOT / "docs/gtm/evidence/demand-pending",
        help="Output dir for discover JSON",
    )
    p.add_argument("--mail-list", type=Path, help="JSON array of opt-in leads")
    p.add_argument("--dry-run", action="store_true", default=False, help="Print mails only")
    p.add_argument(
        "--send",
        action="store_true",
        help="Actually send (requires creds + consent=true per lead; §7 UWG)",
    )
    p.add_argument("--limit", type=int, default=5, help="Max mails this run (default 5)")
    args = p.parse_args(argv)

    if not args.discover_demo and not args.mail_list:
        p.print_help()
        return 2

    if args.discover_demo:
        run_discover_demo(args.discover_out)

    if args.mail_list:
        dry = not args.send
        if args.dry_run:
            dry = True
        if args.send and args.dry_run:
            print("refusing: --send and --dry-run together", file=sys.stderr)
            return 2
        if args.send:
            print(
                "UWG-WARN (§7): --send only for opt-in leads with consent=true. "
                "Cold email without consent is illegal in DE (also B2B).",
                file=sys.stderr,
            )
        leads = load_leads(args.mail_list)
        stats = run_mail(leads, dry_run=dry, limit=max(1, args.limit))
        print(json.dumps({"mail_stats": stats}, ensure_ascii=False))
        if stats["failed"]:
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
