#!/usr/bin/env python3
# FILE: scripts/gtm/send-onboarding-email.py
# SESSION: neukunden-begeisterung-7dd5
"""Dry-run / optional send for onboarding delight email templates. Never prints secrets."""

from __future__ import annotations

import argparse
import json
import os
import smtplib
import sys
import urllib.error
import urllib.request
from email.message import EmailMessage
from typing import Callable

SITE = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://www.nexifyai.cloud").rstrip("/")
FROM_DEFAULT = os.environ.get("CONTACT_FROM_EMAIL", "NeXify AI <website@nexifyai.cloud>")


def _html_lead_magnet(name: str, slot: str) -> tuple[str, str]:
    _ = slot
    subject = "Ihre Checkliste folgt – NeXify AI"
    html = f"""<div style="font-family:Manrope,Arial,sans-serif;background:#0A0A0A;color:#E0E0E0;padding:32px">
  <p style="font-family:Outfit,Arial,sans-serif;font-size:22px;color:#fff">Danke, {name}.</p>
  <p>Ihre Anfrage zur Website-/KI-Checkliste ist eingegangen. Die Liste folgt per E-Mail (PDF-Asset wird ergänzt).</p>
  <p><strong>Rückmeldung · Ziel:</strong> bei Fragen persönliche Antwort in der Regel innerhalb eines Werktags.</p>
  <ul>
    <li><a href="{SITE}/danke?variant=lead_magnet">Was als Nächstes passiert</a></li>
    <li><a href="{SITE}/rueckruf">Rückruf-Termin sichern</a></li>
    <li><a href="https://wa.me/31613318856">WhatsApp</a></li>
  </ul>
  <p style="color:#A1A1AA;font-size:13px">Pascal Courbois · NeXify AI</p>
</div>"""
    return subject, html


def _html_booking(name: str, slot: str) -> tuple[str, str]:
    when = slot or "Ihr gebuchtes Zeitfenster"
    subject = "Ihr Rückruf ist bestätigt – NeXify AI"
    html = f"""<div style="font-family:Manrope,Arial,sans-serif;background:#0A0A0A;color:#E0E0E0;padding:32px">
  <p style="font-family:Outfit,Arial,sans-serif;font-size:22px;color:#fff">Termin bestätigt, {name}.</p>
  <p>Ihr Rückruf-Termin: <strong>{when}</strong> (Europe/Berlin). Pascal ruft persönlich und pünktlich an.</p>
  <p>Verschiebung? Kurze Mail an mail@nexifyai.cloud oder WhatsApp reicht.</p>
  <ul>
    <li><a href="{SITE}/danke?variant=booking">Nächste Schritte</a></li>
    <li><a href="{SITE}/konto">Kundenportal</a></li>
  </ul>
  <p style="color:#A1A1AA;font-size:13px">Pascal Courbois · NeXify AI</p>
</div>"""
    return subject, html


def _html_offer(name: str, slot: str) -> tuple[str, str]:
    _ = slot
    subject = "Ihr Angebot ist unterwegs – NeXify AI"
    html = f"""<div style="font-family:Manrope,Arial,sans-serif;background:#0A0A0A;color:#E0E0E0;padding:32px">
  <p style="font-family:Outfit,Arial,sans-serif;font-size:22px;color:#fff">Angebot für {name}.</p>
  <p>Sie erhalten eine transparente Aufwandsspanne mit Annahmen — ohne versteckte Positionen und ohne Fake-Kennzahlen.</p>
  <p><strong>Rückmeldung · Ziel:</strong> Klärung persönlich, in der Regel innerhalb eines Werktags.</p>
  <ul>
    <li><a href="{SITE}/danke?variant=offer">Was als Nächstes passiert</a></li>
    <li><a href="{SITE}/konto">Angebot im Portal öffnen</a></li>
    <li><a href="{SITE}/rueckruf">Rückruf buchen</a></li>
  </ul>
  <p style="color:#A1A1AA;font-size:13px">Pascal Courbois · NeXify AI</p>
</div>"""
    return subject, html


TEMPLATES: dict[str, Callable[[str, str], tuple[str, str]]] = {
    "lead_magnet": _html_lead_magnet,
    "booking_confirmed": _html_booking,
    "offer_sent": _html_offer,
}


def _send_resend(to: str, subject: str, html: str) -> bool:
    key = (os.environ.get("RESEND_API_KEY") or "").strip()
    if not key:
        return False
    payload = json.dumps(
        {"from": FROM_DEFAULT, "to": [to], "subject": subject, "html": html}
    ).encode()
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return 200 <= resp.status < 300
    except urllib.error.HTTPError as exc:
        print(f"resend_http_error status={exc.code}", file=sys.stderr)
        return False
    except urllib.error.URLError as exc:
        print(f"resend_url_error={type(exc.reason).__name__}", file=sys.stderr)
        return False


def _send_smtp(to: str, subject: str, html: str) -> bool:
    host = (os.environ.get("SMTP_HOST") or "").strip()
    user = (os.environ.get("SMTP_USER") or "").strip()
    password = os.environ.get("SMTP_PASS") or os.environ.get("SMTP_PASSWORD") or ""
    port = int(os.environ.get("SMTP_PORT") or "587")
    if not host or not user or not password:
        return False
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = FROM_DEFAULT
    msg["To"] = to
    msg.set_content("Bitte HTML-fähigen Client nutzen.")
    msg.add_alternative(html, subtype="html")
    with smtplib.SMTP(host, port, timeout=30) as smtp:
        smtp.starttls()
        smtp.login(user, password)
        smtp.send_message(msg)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Onboarding delight email hook")
    parser.add_argument("--template", required=True, choices=sorted(TEMPLATES))
    parser.add_argument("--to", required=True)
    parser.add_argument("--name", default="Interessent/in")
    parser.add_argument("--slot", default="")
    parser.add_argument("--send", action="store_true")
    args = parser.parse_args()

    subject, html = TEMPLATES[args.template](args.name, args.slot)
    meta = {
        "template": args.template,
        "to_domain": args.to.split("@")[-1] if "@" in args.to else "invalid",
        "subject": subject,
        "html_chars": len(html),
        "mode": "send" if args.send else "dry-run",
        "resend_configured": bool((os.environ.get("RESEND_API_KEY") or "").strip()),
        "smtp_configured": bool(
            (os.environ.get("SMTP_HOST") or "").strip()
            and (os.environ.get("SMTP_USER") or "").strip()
            and (os.environ.get("SMTP_PASS") or os.environ.get("SMTP_PASSWORD") or "")
        ),
    }
    print(json.dumps(meta, ensure_ascii=False, indent=2))
    if not args.send:
        print("dry-run: no email sent")
        return 0
    if _send_resend(args.to, subject, html):
        print("sent_via=resend")
        return 0
    if _send_smtp(args.to, subject, html):
        print("sent_via=smtp")
        return 0
    print("send_failed: neither RESEND_API_KEY nor SMTP_* usable (secrets not printed)", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
