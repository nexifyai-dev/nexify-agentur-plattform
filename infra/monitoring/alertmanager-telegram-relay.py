#!/usr/bin/env python3
# NeXifyAI Alertmanager -> Telegram Relay
# NIR: 14.08.2026 01:36
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# 2026-08-14 (Europe/Berlin): Erstfassung — empfängt Alertmanager-Webhooks
# (127.0.0.1:9094/alert) und sendet sie via Telegram Bot API.
# Stdlib-only, keine externen Abhängigkeiten. systemd: nexifyai-alertmanager-relay.service
import json
import os
import re
import sys
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ENV_FILE = "/etc/nexifyai/secrets.env"
LISTEN = ("127.0.0.1", 9094)
LOG = "/var/log/nexifyai/alertmanager-relay.log"

SEVERITY_ICON = {"critical": "\u26d4", "warning": "\u26a0\ufe0f", "info": "\u2139\ufe0f"}
SEVERITY_LABEL = {"critical": "KRITISCH", "warning": "WARNUNG", "info": "INFO"}

_env = {}


def load_env():
    global _env
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    _env[k.strip()] = v.strip().strip("'\"")


def log(msg):
    with open(LOG, "a") as f:
        f.write(f"[{time.strftime('%Y-%m-%dT%H:%M:%S%z')}] {msg}\n")


def telegram_send(text):
    token = _env.get("TELEGRAM_BOT_TOKEN", "")
    chat = _env.get("TELEGRAM_HOME_CHANNEL", "")
    if not token or not chat:
        log("TELEGRAM creds missing (BOT_TOKEN/HOME_CHANNEL) — skip")
        return False
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({"chat_id": chat, "text": text, "disable_web_page_preview": True}).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            ok = resp.status == 200
            log(f"telegram send -> {resp.status}")
            return ok
    except Exception as e:
        log(f"telegram send failed: {e}")
        return False


def esc(s):
    # Telegram MarkdownV2-escapen: nur zur Sicherheit, wir nutzen Plain-HTML-frei
    return re.sub(r"([_*\[\]()~`>#+\-=|{}.!])", r"\\\1", str(s))


def fmt_alert(a):
    labels = a.get("labels", {})
    annot = a.get("annotations", {})
    name = labels.get("alertname", "unknown")
    sev = labels.get("severity", "info")
    icon = SEVERITY_ICON.get(sev, "\u2753")
    label = SEVERITY_LABEL.get(sev, "INFO")
    status = a.get("status", "firing")
    lines = [
        f"{icon} *[{label}] {name}*",
        f"Status: {status}",
    ]
    if labels.get("instance"):
        lines.append(f"Instanz: {labels['instance']}")
    if labels.get("job"):
        lines.append(f"Job: {labels['job']}")
    for key in ("summary", "description"):
        if annot.get(key):
            lines.append(f"{annot[key]}")
            break
    if a.get("startsAt"):
        lines.append(f"Start: {a['startsAt']}")
    return "\n".join(lines)


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            payload = json.loads(body)
        except Exception as e:
            log(f"bad json: {e}")
            self.send_response(400)
            self.end_headers()
            return
        alerts = payload.get("alerts", [])
        log(f"webhook: {len(alerts)} alerts")
        for a in alerts:
            text = fmt_alert(a)
            telegram_send(text)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status":"ok"}')

    def log_message(self, fmt, *args):
        log("http: %s" % (fmt % args))


def main():
    load_env()
    srv = ThreadingHTTPServer(LISTEN, Handler)
    log(f"listening on {LISTEN[0]}:{LISTEN[1]}")
    srv.serve_forever()


if __name__ == "__main__":
    main()
