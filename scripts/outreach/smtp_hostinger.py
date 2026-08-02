# FILE: /scripts/outreach/smtp_hostinger.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Hostinger SMTP sender for cold/drip outreach (never Resend)
# WHY: Split: Hostinger for cold batch; Resend reserved for transactional website flows
# BEST-PRACTICE: SMTP_SSL :465; login via IMAP_USER/IMAP_PASSWORD (Hostinger mailbox)
# PITFALL: V-OUT-05: Do not fall back to Resend for outreach — burns quota + mixes channels
# DEPENDS: SMTP_HOST, SMTP_PORT, SMTP_USER|IMAP_USER, SMTP_PASSWORD|IMAP_PASSWORD
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

logger = logging.getLogger("nexify.outreach.smtp")


def send_hostinger(
    *,
    host: str,
    port: int,
    user: str,
    password: str,
    sender_email: str,
    sender_name: str,
    reply_to: str,
    to_email: str,
    subject: str,
    text_body: str,
    html_body: str,
) -> dict[str, Any]:
    """Send one email via Hostinger SMTP. Raises on hard failure."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{sender_name} <{sender_email}>"
    msg["To"] = to_email
    if reply_to:
        msg["Reply-To"] = reply_to
    # Help mailbox providers classify as 1:1 B2B
    msg["X-Mailer"] = "NeXifyAI-Outreach/1.0"
    msg["List-Unsubscribe"] = f"<mailto:{reply_to or sender_email}?subject=unsubscribe>"
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP_SSL(host, port, timeout=60) as smtp:
        smtp.login(user, password)
        smtp.send_message(msg)

    logger.info("hostinger smtp sent to %s subject=%s", to_email, subject[:60])
    return {"ok": True, "channel": "hostinger_smtp", "to": to_email}
