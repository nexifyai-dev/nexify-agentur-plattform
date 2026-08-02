#!/usr/bin/env python3
# FILE: /scripts/gtm/icp_mail_send.py
# NIR: 02.08.2026 11:00
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Segmented ICP mail dry-run / small SMTP|Resend send
# WHY: Pain→Outcome→CTA je ICP; default dry-run
# BEST-PRACTICE: consent=true OR legal_gate; --limit cap; block .invalid on send
# PITFALL: V-MAIL-03: Never skip STOP footer
# DEPENDS: SMTP_* or RESEND_API_KEY, icp_mail_templates.py
# DOCS-REF: docs/gtm/ICP-MAIL-TEMPLATES-DE.md
# SESSION: icp-demand-competitor-copy-7dd5

from __future__ import annotations

import argparse
import json
import os
import smtplib
import sys
import urllib.request
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from icp_mail_templates import TEMPLATES, render  # noqa: E402

ALLOWED_GATES = {"b2b_legitimate_interest", "consent"}


def load_leads(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("list must be a JSON array")
    return data


def validate_lead(lead: dict[str, Any], icp: str) -> str | None:
    if lead.get("unsubscribed"):
        return "unsubscribed"
    email = (lead.get("email") or "").strip().lower()
    if "@" not in email:
        return "invalid email"
    consent = lead.get("consent") is True
    gate = (lead.get("legal_gate") or "").strip().lower()
    if not consent and gate not in ALLOWED_GATES:
        return "need consent=true or legal_gate=b2b_legitimate_interest"
    lead_icp = (lead.get("icp") or icp).strip().lower()
    if lead_icp != icp:
        return f"icp mismatch {lead_icp!r} != {icp!r}"
    if icp not in TEMPLATES:
        return f"no template for {icp}"
    return None


def send_smtp(to: str, subject: str, body: str) -> str:
    host = os.environ.get("SMTP_HOST", "smtp.hostinger.com").strip()
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = (os.environ.get("SMTP_USER") or os.environ.get("IMAP_USER") or "").strip()
    password = (os.environ.get("SMTP_PASSWORD") or os.environ.get("IMAP_PASSWORD") or "").strip()
    if not user or not password:
        raise RuntimeError("SMTP_USER/SMTP_PASSWORD missing")
    sender = os.environ.get("CONTACT_FROM_EMAIL", user).strip()
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Pascal Courbois <{sender}>"
    msg["To"] = to
    msg["Reply-To"] = "mail@nexifyai.cloud"
    msg["List-Unsubscribe"] = "<mailto:mail@nexifyai.cloud?subject=STOP>"
    msg.attach(MIMEText(body, "plain", "utf-8"))
    html = (
        "<pre style='font-family:Manrope,Arial,sans-serif;white-space:pre-wrap;"
        "background:#0A0A0A;color:#e5e5e5;padding:24px;border-radius:12px'>"
        + body.replace("&", "&amp;").replace("<", "&lt;")
        + "</pre>"
    )
    msg.attach(MIMEText(html, "html", "utf-8"))
    with smtplib.SMTP_SSL(host, port, timeout=60) as smtp:
        smtp.login(user, password)
        smtp.send_message(msg)
    return f"smtp:ok:{to}"


def send_resend(to: str, subject: str, body: str) -> str:
    key = os.environ.get("RESEND_API_KEY", "").strip()
    if not key:
        raise RuntimeError("RESEND_API_KEY missing")
    from_addr = os.environ.get("CONTACT_FROM_EMAIL", "mail@nexifyai.cloud").strip()
    html = f"<pre style='white-space:pre-wrap'>{body}</pre>"
    payload = json.dumps(
        {"from": from_addr, "to": [to], "subject": subject, "html": html, "text": body}
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        return f"resend:{resp.status}:{raw[:180]}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="ICP segmented mail send/dry-run")
    parser.add_argument("--icp", required=True, choices=sorted(TEMPLATES.keys()))
    parser.add_argument("--list", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true", default=True)
    parser.add_argument("--send", action="store_true")
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--channel", choices=("smtp", "resend", "auto"), default="auto")
    parser.add_argument("--log", type=Path, default=ROOT / "docs/gtm/evidence/icp-mail-log.jsonl")
    args = parser.parse_args(argv)
    do_send = bool(args.send)
    leads = load_leads(args.list)
    sent = 0
    skipped = 0
    args.log.parent.mkdir(parents=True, exist_ok=True)

    for lead in leads:
        if sent >= args.limit:
            break
        err = validate_lead(lead, args.icp)
        firma = (lead.get("company") or lead.get("firma") or "Ihr Unternehmen").strip()
        anrede = (lead.get("name") or lead.get("anrede") or "Team").strip()
        subject, body = render(args.icp, firma=firma, anrede=anrede)
        email = (lead.get("email") or "").strip()
        entry: dict[str, Any] = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "icp": args.icp,
            "email": email,
            "firma": firma,
            "subject": subject,
            "mode": "send" if do_send else "dry-run",
        }
        if err:
            entry["status"] = "skipped"
            entry["reason"] = err
            skipped += 1
        elif not do_send:
            entry["status"] = "dry-run"
            entry["body_preview"] = body[:180]
            sent += 1
        elif email.endswith(".invalid") or email.endswith("example.com"):
            entry["status"] = "skipped"
            entry["reason"] = "demo/invalid domain blocked on send"
            skipped += 1
        else:
            channel = args.channel
            if channel == "auto":
                channel = (
                    "smtp"
                    if os.environ.get("SMTP_PASSWORD") or os.environ.get("IMAP_PASSWORD")
                    else "resend"
                )
            try:
                if channel == "smtp":
                    entry["result"] = send_smtp(email, subject, body)
                else:
                    entry["result"] = send_resend(email, subject, body)
                entry["status"] = "sent"
                sent += 1
            except Exception as exc:  # noqa: BLE001
                entry["status"] = "error"
                entry["reason"] = str(exc)[:300]
                skipped += 1
        with args.log.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(entry, ensure_ascii=False) + "\n")
        print(json.dumps(entry, ensure_ascii=False))

    print(json.dumps({"icp": args.icp, "processed_ok": sent, "skipped_or_error": skipped, "mode": "send" if do_send else "dry-run"}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
