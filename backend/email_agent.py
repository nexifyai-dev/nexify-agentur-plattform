import os
import re
import json
import uuid
import email
import imaplib
import asyncio
import logging
from datetime import datetime, timezone
from email.header import decode_header
from email.utils import parseaddr

from memory import mem_add

logger = logging.getLogger("nexify.email_agent")

IMAP_HOST = os.environ.get("IMAP_HOST", "imap.hostinger.com")
IMAP_PORT = int(os.environ.get("IMAP_PORT", "993"))
IMAP_USER = os.environ.get("IMAP_USER")
IMAP_PASSWORD = os.environ.get("IMAP_PASSWORD")
POLL_SECONDS = int(os.environ.get("MAIL_POLL_SECONDS", "300"))

_deps: dict = {}

STATE: dict = {"enabled": False, "started_at": None, "last_poll": None, "polls": 0,
              "processed": 0, "spam": 0, "inquiries": 0, "other": 0, "errors": 0}

_poll_lock = asyncio.Lock()


async def _ensure_table():
    pool = await _deps["db"]()
    if not pool:
        return
    async with pool.acquire() as con:
        await con.execute("""
            create table if not exists nexify_email_agent_log (
                id uuid primary key,
                ts timestamptz default now(),
                from_addr text,
                subject text,
                category text,
                action text,
                detail text
            )""")


async def _log_action(m: dict, category: str, action: str, detail: str = ""):
    try:
        pool = await _deps["db"]()
        if not pool:
            return
        async with pool.acquire() as con:
            await con.execute(
                "insert into nexify_email_agent_log (id,from_addr,subject,category,action,detail) values ($1,$2,$3,$4,$5,$6)",
                uuid.uuid4(), m.get("from_addr", ""), (m.get("subject") or "")[:250], category, action, detail[:500])
    except Exception as e:
        logger.warning(f"email agent: log write failed: {e}")


def get_status() -> dict:
    return dict(STATE)


async def get_log(limit: int = 50) -> list[dict]:
    pool = await _deps["db"]()
    if not pool:
        return []
    async with pool.acquire() as con:
        rows = await con.fetch(
            "select id,ts,from_addr,subject,category,action,detail from nexify_email_agent_log order by ts desc limit $1",
            min(max(limit, 1), 200))
    return [{"id": str(r["id"]), "ts": r["ts"].isoformat(), "from_addr": r["from_addr"],
             "subject": r["subject"], "category": r["category"], "action": r["action"],
             "detail": r["detail"]} for r in rows]


def init(db, llm_complete, ai_ticket_reply, send_email, ci_email, frontend_url):
    _deps.update(db=db, llm=llm_complete, ai_ticket_reply=ai_ticket_reply,
                 send_email=send_email, ci_email=ci_email, frontend_url=frontend_url)


CLASSIFY_PROMPT = """Du bist der E-Mail-Triage-Agent von "NeXify AI by NeXify" (Premium-Agentur fuer Websites, Shops, Apps und AI-Automatisierung, B2B, Inhaber Pascal Courbois).
Klassifiziere die folgende eingehende E-Mail. Antworte NUR mit JSON, kein Markdown:
{"category": "spam" | "inquiry" | "other", "language": "de" | "nl" | "en", "reason": "kurze Begruendung"}
Kategorien:
- spam: unerwuenschte Werbung, Phishing, SEO-/Linkbuilding-Angebote, Krypto, Gewinnspiele, Massenmails ohne Bezug
- inquiry: echte geschaeftliche Anfrage, Projektanfrage, Kundenfrage, Antwort eines Kunden oder Interessenten
- other: automatische Benachrichtigungen, Rechnungen, System-Mails, Newsletter, interne Mails"""


def _decode(s: str | None) -> str:
    if not s:
        return ""
    out = ""
    for val, enc in decode_header(s):
        out += val.decode(enc or "utf-8", "replace") if isinstance(val, bytes) else val
    return out.strip()


def _strip_html(html: str) -> str:
    text = re.sub(r"<(style|script)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<br\s*/?>|</p>|</div>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"[ \t]+", " ", text).strip()


def _body_text(msg) -> str:
    plain, html = None, None
    parts = msg.walk() if msg.is_multipart() else [msg]
    for part in parts:
        if part.get_content_disposition() == "attachment":
            continue
        ct = part.get_content_type()
        if ct not in ("text/plain", "text/html"):
            continue
        try:
            payload = part.get_payload(decode=True)
        except Exception:
            payload = None
        if not payload:
            continue
        text = payload.decode(part.get_content_charset() or "utf-8", "replace")
        if ct == "text/plain" and plain is None:
            plain = text
        elif ct == "text/html" and html is None:
            html = text
    return (plain or _strip_html(html or "")).strip()


def _connect():
    conn = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT)
    conn.login(IMAP_USER, IMAP_PASSWORD)
    return conn


def _fetch_unseen(limit: int = 10) -> list[dict]:
    conn = _connect()
    msgs = []
    try:
        conn.select("INBOX")
        typ, data = conn.search(None, "UNSEEN")
        nums = data[0].split() if typ == "OK" and data and data[0] else []
        for num in nums[:limit]:
            typ, md = conn.fetch(num, "(RFC822)")
            if typ != "OK" or not md or not md[0]:
                continue
            msg = email.message_from_bytes(md[0][1])
            name, addr = parseaddr(_decode(msg.get("From")))
            auto = (msg.get("Auto-Submitted") or "no").lower() != "no" or \
                   (msg.get("Precedence") or "").lower() in ("bulk", "junk", "list") or \
                   bool(msg.get("List-Unsubscribe"))
            msgs.append({
                "from_name": name,
                "from_addr": (addr or "").lower(),
                "subject": _decode(msg.get("Subject")) or "(kein Betreff)",
                "message_id": (msg.get("Message-ID") or "").strip(),
                "auto": auto,
                "text": _body_text(msg)[:6000],
            })
    finally:
        try:
            conn.logout()
        except Exception:
            pass
    return msgs


def _find_spam_folder(conn) -> str | None:
    typ, data = conn.list()
    if typ != "OK":
        return None
    for raw in data or []:
        line = raw.decode(errors="replace") if isinstance(raw, bytes) else str(raw)
        m = re.search(r'"([^"]+)"\s*$', line)
        folder = m.group(1) if m else line.split()[-1]
        if re.search(r"spam|junk", folder, re.I):
            return folder
    return None


def _move_to_spam(message_id: str) -> bool:
    if not message_id:
        return False
    conn = _connect()
    try:
        folder = _find_spam_folder(conn)
        if not folder:
            logger.warning("no spam folder found on IMAP server")
            return False
        conn.select("INBOX")
        typ, data = conn.search(None, "HEADER", "Message-ID", message_id)
        nums = data[0].split() if typ == "OK" and data and data[0] else []
        if not nums:
            return False
        for num in nums:
            conn.copy(num, f'"{folder}"')
            conn.store(num, "+FLAGS", "\\Deleted")
        conn.expunge()
        return True
    finally:
        try:
            conn.logout()
        except Exception:
            pass


async def _classify(m: dict) -> dict:
    raw = await _deps["llm"]([
        {"role": "system", "content": CLASSIFY_PROMPT},
        {"role": "user", "content": f"Von: {m['from_name']} <{m['from_addr']}>\nBetreff: {m['subject']}\n\n{m['text'][:3000]}"},
    ], max_tokens=300)
    raw = raw.strip()
    start, end = raw.find("{"), raw.rfind("}")
    try:
        return json.loads(raw[start:end + 1])
    except Exception:
        return {"category": "other", "language": "de", "reason": "classification parse failed"}


async def _create_ticket(m: dict, language: str):
    pool = await _deps["db"]()
    if not pool:
        return None
    name = m["from_name"] or m["from_addr"].split("@")[0]
    subject = m["subject"]
    clean_subject = re.sub(r"^(re|aw|fwd?|antw)\s*:\s*", "", subject, flags=re.I).strip()
    async with pool.acquire() as con:
        existing = await con.fetchrow(
            "select id from nexify_tickets where lower(email)=$1 and lower(subject) like $2 order by created_at desc limit 1",
            m["from_addr"], f"%{clean_subject.lower()[:60]}%") if clean_subject else None
        if existing and re.match(r"^(re|aw|antw)\s*:", subject, re.I):
            ticket_id = existing["id"]
            await con.execute("update nexify_tickets set status='open' where id=$1", ticket_id)
        else:
            ticket_id = uuid.uuid4()
            await con.execute(
                "insert into nexify_tickets (id,name,email,subject,language,source) values ($1,$2,$3,$4,$5,'email')",
                ticket_id, name, m["from_addr"], subject[:250], language)
        await con.execute(
            "insert into nexify_ticket_messages (id,ticket_id,sender,body) values ($1,$2,'customer',$3)",
            uuid.uuid4(), ticket_id, m["text"] or "(kein Inhalt)")
        has_lead = await con.fetchval("select 1 from nexify_leads where lower(email)=$1 limit 1", m["from_addr"])
        if not has_lead:
            await con.execute(
                "insert into nexify_leads (id,name,email,language,message,source) values ($1,$2,$3,$4,$5,'email')",
                uuid.uuid4(), name, m["from_addr"], language, f"E-Mail an mail@nexifyai.cloud: {subject}")
    return ticket_id


async def _handle(m: dict):
    addr = m["from_addr"]
    if not addr or addr.endswith("@nexifyai.cloud") or "mailer-daemon" in addr or addr.split("@")[0] in ("noreply", "no-reply", "postmaster"):
        return
    if m["auto"]:
        logger.info(f"email agent: auto-mail from {addr} ignored ({m['subject'][:60]})")
        return
    verdict = await _classify(m)
    category = verdict.get("category", "other")
    language = verdict.get("language", "de")
    if language not in ("de", "nl"):
        language = "de"
    logger.info(f"email agent: {addr} · '{m['subject'][:60]}' → {category} ({verdict.get('reason','')})")
    STATE["processed"] += 1

    if category == "spam":
        moved = await asyncio.to_thread(_move_to_spam, m["message_id"])
        STATE["spam"] += 1
        await _log_action(m, "spam", "moved_to_spam" if moved else "move_failed", verdict.get("reason", ""))
        logger.info(f"email agent: spam from {addr} {'moved to spam folder' if moved else 'left in inbox (move failed)'}")
        return

    if category == "inquiry":
        ticket_id = await _create_ticket(m, language)
        if not ticket_id:
            return
        STATE["inquiries"] += 1
        await _log_action(m, "inquiry", "ticket_created", f"Ticket {ticket_id}, AI-Antwort geplant")
        # Fabrik CEO-Queue: proaktive Empfehlung anfordern (kein automatischer Versand)
        try:
            import portal
            await portal.ceo_queue_enqueue(
                kind="lead_inquiry",
                ref_id=ticket_id,
                subject=m["subject"][:250],
                body_snippet=(m["text"] or "")[:2000],
            )
        except Exception as e:
            logger.warning(f"email agent: ceo-queue enqueue failed: {e}")
        asyncio.create_task(mem_add(addr, [
            {"role": "user", "content": f"E-Mail von {m['from_name'] or addr} – Betreff: {m['subject']}\n{m['text'][:2000]}"},
        ], {"source": "email"}))
        asyncio.create_task(_deps["ai_ticket_reply"](str(ticket_id)))
        asyncio.create_task(_deps["send_email"](
            IMAP_USER, f"Eingehende Anfrage: {m['subject'][:120]} ({addr})",
            _deps["ci_email"]("Eingehende E-Mail-Anfrage",
                              f"<p><b>{m['from_name'] or addr}</b> ({addr}):</p><p style='border-left:2px solid #52525b;padding-left:12px;white-space:pre-wrap;'>{m['text'][:1500]}</p><p>Die AI antwortet automatisch zeitversetzt. Im Admin-Bereich können Sie vorher selbst antworten.</p>",
                              cta_label="Im CRM öffnen", cta_url=f"{_deps['frontend_url']}/admin")))
        logger.info(f"email agent: inquiry from {addr} → ticket {ticket_id}, AI reply scheduled")
        return

    STATE["other"] += 1
    await _log_action(m, "other", "ignored", verdict.get("reason", ""))


async def _process_cycle():
    msgs = await asyncio.to_thread(_fetch_unseen)
    STATE["last_poll"] = datetime.now(timezone.utc).isoformat()
    STATE["polls"] += 1
    for m in msgs:
        try:
            await _handle(m)
        except Exception as e:
            STATE["errors"] += 1
            logger.error(f"email agent: handling mail from {m.get('from_addr')} failed: {e}")
    return len(msgs)


async def trigger_poll() -> dict:
    """Manual on-demand poll. Serialised via lock so admin clicks cannot stack."""
    if not IMAP_USER or not IMAP_PASSWORD:
        return {"ok": False, "reason": "imap_disabled"}
    if _poll_lock.locked():
        return {"ok": False, "reason": "already_running"}
    async with _poll_lock:
        try:
            await _ensure_table()
        except Exception:
            pass
        try:
            found = await _process_cycle()
        except Exception as e:
            STATE["errors"] += 1
            return {"ok": False, "reason": str(e)[:200]}
    return {"ok": True, "found": int(found), "last_poll": STATE["last_poll"], "processed": STATE["processed"]}


async def email_worker():
    if not IMAP_USER or not IMAP_PASSWORD:
        logger.warning("email agent disabled: IMAP credentials missing")
        return
    STATE["enabled"] = True
    STATE["started_at"] = datetime.now(timezone.utc).isoformat()
    await asyncio.sleep(10)
    try:
        await _ensure_table()
    except Exception as e:
        logger.warning(f"email agent: table setup failed: {e}")
    logger.info(f"email agent started: polling {IMAP_USER} every {POLL_SECONDS}s")
    while True:
        try:
            await _process_cycle()
        except Exception as e:
            STATE["errors"] += 1
            logger.error(f"email agent cycle failed: {e}")
        await asyncio.sleep(POLL_SECONDS)
