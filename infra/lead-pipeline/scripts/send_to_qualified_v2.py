#!/usr/bin/env python3
"""
NeXifyAI Lead‑Generierung Bulk‑Send (365‑Tage Live‑Betrieb)
Stabilisiert: Logging + State‑File + Retry + Crash‑Recovery
v2.2 (2026-08-07): Fetch-Retry (Kong-Disconnect), Reaktivierungs-Logik (Welle 1: 24h), 500 Mails/Lauf, M2-Follow-up-Welle (--followup-only)
"""
import os
import sys
import logging
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from supabase import create_client
import random, time as time_module
from datetime import datetime, timezone

# Logging setup
Path('/var/log/nexifyai').mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/nexifyai/bulk-send.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load pipeline.env
with open('/opt/nexifyai/config/pipeline.env') as f:
    for line in f:
        line = line.strip()
        if line and '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            os.environ[k] = v

SB_URL = "http://127.0.0.1:8000"
SB_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_ANON_KEY') or ''
# Kong keyauth: apikey-Header = Kong-Consumer-Key; PostgREST braucht echtes JWT als Bearer
import jwt as _jwt, time as _time
SB_JWT = _jwt.encode(
    {"role": "service_role", "iss": "supabase", "iat": int(_time.time()), "exp": int(_time.time()) + 31536000},
    os.environ.get('SUPABASE_JWT_SECRET', ''),
    algorithm="HS256"
)
os.environ['SMTP_PASSWORD'] = os.environ.get('SMTP_PASSWORD', '')

# State file für Resume nach Absturz
STATE_FILE = '/var/log/nexifyai/bulk-send-state.json'
def load_state():
    if Path(STATE_FILE).exists():
        try:
            with open(STATE_FILE) as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load state file: {e}")
    return {'processed_emails': [], 'last_index': 0, 'reengagement': []}

def save_state(state):
    try:
        Path(STATE_FILE).parent.mkdir(parents=True, exist_ok=True)
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f)
    except Exception as e:
        logger.error(f"Could not save state file: {e}")

state = load_state()
state.setdefault('reengagement', [])

# Connect via Supabase client
logger.info("Verbinde zu Supabase...")
try:
    from supabase.lib.client_options import SyncClientOptions
    client = create_client(SB_URL, SB_KEY, options=SyncClientOptions(headers={'Authorization': f'Bearer {SB_JWT}'}))
    logger.info(f"Connected to {SB_URL}")
except Exception as e:
    logger.error(f"Supabase Verbindung fehlgeschlagen: {e}")
    exit(1)

# Templates laden
try:
    template_new = Path('templates/lead_email.html').read_text()
    template_reengage = Path('templates/lead_email_reengage.html').read_text()
    try:
        template_followup = Path('templates/lead_email_followup_m2.html').read_text()
    except FileNotFoundError:
        template_followup = Path('templates/lead_email_followup.html').read_text()
    logger.info("Templates loaded")
except Exception as e:
    logger.error(f"Template laden fehlgeschlagen: {e}")
    exit(1)

def render_template(template, email, company_name):
    return template.replace('{{email}}', email).replace('{{company_name}}', company_name or 'Ihr Unternehmen')

# Load send_email
from src.pipeline.email_lead import send_email

# Get leads via Supabase client (Retry: 4 Versuche, Backoff 5/15/45s, frischer Client pro Versuch)
logger.info("Fetching leads from Supabase...")
leads = None
for attempt in (1, 2, 3, 4):
    try:
        from supabase.lib.client_options import SyncClientOptions as _SCO
        client = create_client(SB_URL, SB_KEY, options=_SCO(headers={'Authorization': f'Bearer {SB_JWT}'}))
        response = client.table('leads').select('contact_email,name,score,status,id,created_at,contacted_at,unsubscribed').execute()
        leads = response.data
        logger.info(f"Fetched {len(leads)} leads")
        break
    except Exception as e:
        logger.error(f"Error fetching leads (Versuch {attempt}/4): {e}")
        if attempt < 4:
            wait = {1: 5, 2: 15, 3: 45}[attempt]
            logger.info(f"Retry in {wait}s...")
            time_module.sleep(wait)
if leads is None:
    logger.error("Fetch fehlgeschlagen nach 4 Versuchen – Abbruch")
    exit(1)

now = datetime.now(timezone.utc)

def _valid_email(l):
    e = l.get('contact_email')
    return bool(e) and '@' in str(e) and str(e).strip()

# Filter A: neue Leads (noch nie kontaktiert)
# Art. 21 DSGVO: Leads mit Widerspruch (unsubscribed) werden NIE erneut kontaktiert
new_leads = [l for l in leads if l.get('status') in ('discovered', 'enriched') and _valid_email(l) and not l.get('unsubscribed')]

# Filter B: Reaktivierung (contacted, letzter Kontakt > 48h her, noch nicht reengaged)
reengage_candidates = []
for l in leads:
    if l.get('status') != 'contacted' or not _valid_email(l):
        continue
    if l.get('unsubscribed'):  # Art. 21: Widerspruch = keine weitere Kontaktaufnahme
        continue
    if l['contact_email'] in state.get('reengagement', []):
        continue
    ca = l.get('contacted_at')
    if not ca:
        continue
    try:
        contacted_at = datetime.fromisoformat(str(ca).replace('Z', '+00:00'))
    except Exception:
        continue
    # 2026-08-07 CEO-Auftrag ≥500 Mails: RE-Fenster 48h -> 24h (06.08-Welle sofort reaktivierbar)
    if (now - contacted_at).total_seconds() > 24 * 3600:
        reengage_candidates.append(l)

# 2026-08-07 GO-LIVE: Email-Dedupe (Lead-Pool enthält Duplikat-Emails -> keine Doppel-Mail)
_seen = set()
reengage_candidates = [l for l in reengage_candidates if not (l['contact_email'] in _seen or _seen.add(l['contact_email']))]

logger.info(f"Qualifiziert: {len(new_leads)} neue Leads, {len(reengage_candidates)} Reaktivierungs-Kandidaten")
logger.info("Senden an qualifizierte Leads (langsam + unregelmäßig)...")

MAX_MAILS = int(os.environ.get('BULK_MAX_MAILS', '500'))
sends = 0

def _delay(i, total):
    if i < total - 1:
        delay = random.randint(30, 60)
        logger.info(f"--- Warte {delay}s bis zur nächsten Mail ({i+1}/{total}) ---")
        time_module.sleep(delay)

# A) Neue Leads (Resume über last_index)
start_index = state.get('last_index', 0)
new_leads = new_leads[start_index:]
logger.info(f"Resume ab Index {start_index}, verbleibende neue Leads: {len(new_leads)}")

for i, lead in enumerate(new_leads):
    if sends >= MAX_MAILS:
        logger.info("Max-Mails-Limit erreicht – Rest im nächsten Lauf.")
        break
    email = lead['contact_email']
    company = lead.get('name', '')
    if email in state.get('processed_emails', []):
        logger.info(f"[{i+1}/{len(new_leads)}] {email} bereits verarbeitet – überspringe.")
        continue
    html = render_template(template_new, email, company)
    subject = (company or 'Ihr Unternehmen')[:44] + ': Wie viel Zeit kostet Ihr Angebotsprozess aktuell?'
    subject = subject[:60]
    logger.info(f"[{i+1}/{len(new_leads)}] Sende an {email}...")
    ok = False
    for attempt in range(3):
        ok = send_email(email, subject, html)
        if ok:
            break
        logger.warning(f"Versuch {attempt+1}/3 für {email} fehlgeschlagen – retry in 30s...")
        time_module.sleep(30)
    if ok:
        logger.info(f"✓ {email} ({company})")
        try:
            client.table('leads').update({'status': 'contacted', 'contacted_at': now.isoformat()}).eq('id', lead['id']).execute()
        except Exception as e:
            logger.error(f"  → Status update fehlgeschlagen: {e}")
        state['processed_emails'].append(email)
        state['last_index'] = start_index + i + 1
        save_state(state)
        sends += 1
    else:
        logger.error(f"✗ {email} ({company}) – nach 3 Versuchen aufgegeben")
        try:
            client.table('leads').update({'status': 'bounced'}).eq('id', lead['id']).execute()
        except Exception as e:
            logger.error(f"  → bounced update fehlgeschlagen: {e}")
        state['processed_emails'].append(email)
        state['last_index'] = start_index + i + 1
        save_state(state)
    _delay(i, len(new_leads))

# B) Reaktivierungswelle (Status bleibt 'contacted', nur reengaged_at wird gesetzt)
for i, lead in enumerate(reengage_candidates):
    if sends >= MAX_MAILS:
        logger.info("Max-Mails-Limit erreicht – Reaktivierungs-Rest im nächsten Lauf.")
        break
    email = lead['contact_email']
    company = lead.get('name', '')
    html = render_template(template_reengage, email, company)
    subject = 'Wir waren im August bei Ihnen – kurze Frage'
    logger.info(f"[RE] [{i+1}/{len(reengage_candidates)}] Sende an {email}...")
    ok = False
    for attempt in range(3):
        ok = send_email(email, subject, html)
        if ok:
            break
        logger.warning(f"Versuch {attempt+1}/3 für {email} fehlgeschlagen – retry in 30s...")
        time_module.sleep(30)
    if ok:
        logger.info(f"✓ [RE] {email} ({company})")
        try:
            client.table('leads').update({'reengaged_at': now.isoformat()}).eq('id', lead['id']).execute()
        except Exception as e:
            logger.error(f"  → reengaged_at update fehlgeschlagen: {e}")
        state['reengagement'].append(email)
        save_state(state)
        sends += 1
    else:
        logger.error(f"✗ [RE] {email} ({company}) – nach 3 Versuchen aufgegeben")
        try:
            client.table('leads').update({'status': 'bounced'}).eq('id', lead['id']).execute()
        except Exception as e:
            logger.error(f"  → bounced update fehlgeschlagen: {e}")
        state['reengagement'].append(email)
        save_state(state)
    _delay(i, len(reengage_candidates))

# Reset last_index wenn neuer Pool abgearbeitet (damit neu eintreffende Leads nicht übersprungen werden)
if not new_leads and state.get('last_index', 0) > 0:
    state['last_index'] = 0
    state['processed_emails'] = []
    save_state(state)
    logger.info("Neuer-Lead-Pool abgearbeitet – Resume-Index zurückgesetzt.")

# C) M2-Follow-up-Welle (CEO-Auftrag 2026-08-07: ≥500 Mails bis morgen)
#    Ziel: kontaktierte Leads >24h, gültige Email, noch kein M2 (State 'followup').
#    Läuft NUR mit --followup-only (eigener Timer 00:30, ~6h Abstand zur RE-Welle 18:10).
FOLLOWUP_ONLY = '--followup-only' in sys.argv
if FOLLOWUP_ONLY:
    logger.info("MODUS: --followup-only (nur M2-Welle – A/B-Pools leer)")
    new_leads = []
    reengage_candidates = []
    followup_candidates = []
    for l in leads:
        if l.get('status') != 'contacted' or not _valid_email(l):
            continue
        if l.get('unsubscribed'):  # Art. 21: Widerspruch = keine M2-Follow-up
            continue
        if l['contact_email'] in state.get('followup', []):
            continue
        ca = l.get('contacted_at')
        if not ca:
            continue
        try:
            cat = datetime.fromisoformat(str(ca).replace('Z', '+00:00'))
        except Exception:
            continue
        if (now - cat).total_seconds() > 24 * 3600:
            followup_candidates.append(l)
    _seen3 = set()
    followup_candidates = [l for l in followup_candidates if not (l['contact_email'] in _seen3 or _seen3.add(l['contact_email']))]
    logger.info(f"Follow-up-Kandidaten (kontaktiert >24h, ohne M2): {len(followup_candidates)}")
    for i, lead in enumerate(followup_candidates):
        if sends >= MAX_MAILS:
            logger.info("Max-Mails-Limit erreicht – Follow-up-Rest im nächsten Lauf.")
            break
        email = lead['contact_email']
        company = lead.get('name', '')
        html = render_template(template_followup, email, company)
        subject = 'Kurze Nachfrage zu meiner letzten Mail'
        logger.info(f"[M2] [{i+1}/{len(followup_candidates)}] Sende an {email}...")
        ok = False
        for attempt in range(3):
            ok = send_email(email, subject, html)
            if ok:
                break
            logger.warning(f"Versuch {attempt+1}/3 für {email} fehlgeschlagen – retry in 30s...")
            time_module.sleep(30)
        if ok:
            logger.info(f"✓ [M2] {email} ({company})")
            state.setdefault('followup', []).append(email)
            save_state(state)
            sends += 1
        else:
            logger.error(f"✗ [M2] {email} ({company}) – nach 3 Versuchen aufgegeben")
            try:
                client.table('leads').update({'status': 'bounced'}).eq('id', lead['id']).execute()
            except Exception as e:
                logger.error(f"  → bounced update fehlgeschlagen: {e}")
            state.setdefault('followup', []).append(email)
            save_state(state)
        _delay(i, len(followup_candidates))

logger.info(f"Done. {sends} Mails in diesem Lauf gesendet (Limit {MAX_MAILS}).")
