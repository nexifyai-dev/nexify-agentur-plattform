import smtplib
import socket
socket.setdefaulttimeout(60)
import ssl
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Hostinger-SMTP-Konfig (aus pipeline.env oder default)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.resend.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "mail@nexifyai.cloud")
# Hostinger-SMTP nutzt IMAP_PASSWORD (nicht API-Token)
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD") or os.getenv("IMAP_PASSWORD", "")


def _html_to_text(html: str) -> str:
    """Robuster Plain-Text aus Mail-HTML (multipart/alternative, Deliverability-Pflicht)."""
    s = re.sub(r"(?i)<(br|/tr|/p|/li|/h1|/h2|/h3|/div)[^>]*>", "\n", html)
    s = re.sub(r"(?i)<a [^>]*href=\"([^\"]+)\"[^>]*>(.*?)</a>", r"\2 (\1)", s)
    s = re.sub(r"(?i)<[^>]+>", "", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """Sende E-Mail über Hostinger-SMTP (SSL), HTML + Plain-Text. Return True bei Erfolg."""
    msg = MIMEMultipart("alternative")
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg["X-Mailer"] = "NeXifyAI"
    msg["List-Unsubscribe"] = f"<https://www.nexifyai.cloud/unsubscribe?email={to_email}>"
    msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"

    msg.attach(MIMEText(_html_to_text(html_body), "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        context = ssl.create_default_context()
        if int(SMTP_PORT) == 465:
            server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=60)
        else:
            server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=60)
            server.starttls(context=context)
        with server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"SMTP-Error für {to_email}: {e}")
        if "quota" in str(e).lower():
            print("Tages-Quota erreicht – Lauf sofort beendet (nächster Timer-Lauf erneut).")
            raise SystemExit(0)  # sauber beenden — kein Restart-Loop (Timer startet beim nächsten Fenster)
        return False
