#!/usr/bin/env python3
"""Spam-/Junk-Ordner-Monitor (NeXifyAI): scannt Junk-Ordner per IMAP, extrahiert neue
# NIR: 08.08.2026 08:49
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

Mails, markiert geschäftsrelevante Inhalte, schreibt Report. State: last UID pro Ordner."""
import email
import imaplib
import json
import os
import re
import sys
import datetime
from email.header import decode_header, make_header

ENV = "/etc/nexifyai/mail-nexifyai.env"
STATE = "/var/log/nexifyai/spam-monitor-state.json"
OUTDIR = "/var/log/nexifyai/spam-monitor"
PIPEOUT = "/home/hermeswebui/.hermes/cron/output/spam-monitor-report.md"
MAX_PER_RUN = 25

KEYWORDS = {
    "adresswechsel": r"deactiv|deaktiv|address|adresse|instead|künftig|künftig|forwarded|umzug",
    "rechnung": r"rechnung|invoice|accounting|payment|zahlung|mahnung",
    "lieferung": r"shipment|lieferung|versand|aog|logistik",
    "angebot": r"angebot|offer|quote|kostenvoranschlag",
    "beschwerde": r"beschwerde|complaint|reklamation|refund|erstattung",
    "kündigung": r"kündig|terminat|cancel|storno",
    "termin": r"termin|appointment|meeting|ruf.?mich|call me",
    "recht": r"anwalt|lawyer|abmahnung|dsgvo|unterlassung",
}

def getenv():
    d = {}
    with open(ENV) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                d[k.strip()] = v.strip()
    return d

def dec(s):
    try:
        return str(make_header(decode_header(s or "")))
    except Exception:
        return s or ""

def body_text(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    return part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", "replace")[:1200]
                except Exception:
                    continue
    try:
        return msg.get_payload(decode=True).decode(msg.get_content_charset() or "utf-8", "replace")[:1200]
    except Exception:
        return ""

def main():
    env = getenv()
    host, port = env["IMAP_HOST"], int(env["IMAP_PORT"])
    user, pw = env["IMAP_USER"], env["IMAP_PASSWORD"]
    os.makedirs(OUTDIR, exist_ok=True)
    os.makedirs(os.path.dirname(PIPEOUT), exist_ok=True)

    state = {}
    if os.path.exists(STATE):
        try:
            state = json.load(open(STATE))
        except Exception:
            state = {}

    M = imaplib.IMAP4_SSL(host, port)
    M.login(user, pw)
    status, folders = M.list()
    junk_folders = []
    for f in (folders or []):
        raw = f.decode(errors="replace")
        m = re.findall(r'"([^"]+)"', raw)
        name = m[-1] if m else raw.split()[-1]
        low = name.lower()
        if "junk" in low or "spam" in low or "bulk" in low:
            junk_folders.append(name)
    if not junk_folders:
        junk_folders = ["Junk", "Spam", "INBOX.Junk"]
    print("Junk-Ordner:", junk_folders)

    now = datetime.datetime.now()
    report = [f"# Spam-Monitor Report — {now.strftime('%Y-%m-%d %H:%M')}", ""]
    total_new = 0
    for folder in junk_folders:
        try:
            status, _ = M.select(f'"{folder}"', readonly=True)
            if status != "OK":
                continue
        except Exception as e:
            print(f"Ordner {folder}: {e}")
            continue
        status, data = M.uid("search", None, "ALL")
        if status != "OK" or not data or not data[0]:
            continue
        uids = data[0].split()
        last = state.get(folder, 0)
        new = [u for u in uids if int(u) > last][-MAX_PER_RUN:]
        if not new:
            continue
        for u in new:
            status, d = M.uid("fetch", u, "(RFC822)")
            if status != "OK" or not d or not d[0]:
                continue
            msg = email.message_from_bytes(d[0][1])
            frm = dec(msg.get("From"))
            subj = dec(msg.get("Subject"))
            date = msg.get("Date", "?")
            txt = body_text(msg)
            hits = [k for k, rx in KEYWORDS.items() if re.search(rx, (subj + " " + txt).lower())]
            total_new += 1
            report.append(f"## {subj}")
            report.append(f"- **Von:** {frm}")
            report.append(f"- **Datum:** {date}")
            report.append(f"- **Ordner:** {folder} (UID {u.decode()})")
            report.append(f"- **Relevanz:** {', '.join(hits) if hits else 'unbekannt'}")
            report.append("")
            report.append("```")
            report.append((txt or "(kein Text)").strip()[:800])
            report.append("```")
            report.append("")
            state[folder] = int(u)
    M.logout()

    json.dump(state, open(STATE, "w"), indent=1)
    if total_new:
        out = os.path.join(OUTDIR, f"report-{now.strftime('%Y%m%d-%H%M')}.md")
        open(out, "w").write("\n".join(report))
        open(PIPEOUT, "w").write("\n".join(report))
        print(f"REPORT: {out} ({total_new} neue Junk-Mails)")
    else:
        print(f"Keine neuen Junk-Mails (State: {state})")
    sys.exit(0)

if __name__ == "__main__":
    main()
