#!/usr/bin/env python3
"""
NeXifyAI Drip Campaign (3 Mails / 10 Tage) — NXAI-KOMM-001 v2.0-konform
Mail 1 (Tag 0):  Erstkontakt   -> lead_email_v2.html
Mail 2 (Tag 4):  Zusatzargument -> lead_email_followup.html
Mail 3 (Tag 10): Breakup-Mail   -> lead_email_breakup.html
"""
import os
import sys
import logging
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, '/workspace')
from supabase import create_client
from supabase.lib.client_options import SyncClientOptions
import random, time
from datetime import datetime, timedelta, timezone
import jwt as _jwt

Path('/var/log/nexifyai').mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('/var/log/nexifyai/drip-campaign.log'), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Load pipeline.env
with open('/opt/nexifyai/config/pipeline.env') as f:
    for line in f:
        line = line.strip()
        if line and '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            os.environ[k] = v

SB_URL = os.environ.get('SUPABASE_URL')
SB_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_SERVICE_KEY')
SMTP_PASSWORD = os.environ.get('IMAP_PASSWORD', '')
os.environ['SMTP_PASSWORD'] = SMTP_PASSWORD

# PostgREST braucht echtes HS256-JWT als Bearer (PGRST301-Pitfall)
JWT_SECRET = os.environ.get('SUPABASE_JWT_SECRET') or os.environ.get('GOTRUE_JWT_SECRET') or ''
SB_JWT = _jwt.encode(
    {"role": "service_role", "iss": "supabase",
     "iat": int(time.time()), "exp": int(time.time()) + 31536000},
    JWT_SECRET, algorithm="HS256") if JWT_SECRET else ''

STATE_FILE = '/var/log/nexifyai/drip-campaign-state.json'
def load_state():
    if Path(STATE_FILE).exists():
        try:
            with open(STATE_FILE) as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load state file: {e}")
    return {'mails_sent': {}, 'last_run': None}
def save_state(state):
    try:
        Path(STATE_FILE).parent.mkdir(parents=True, exist_ok=True)
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f)
    except Exception as e:
        logger.error(f"Could not save state file: {e}")
state = load_state()

TEMPLATE_DIR = Path('/usr/local/share/nexifyai-templates')

def render_template(template_path, email, company):
    with open(template_path) as f:
        template = f.read()
    return template.replace('{{email}}', email).replace('{{company_name}}', company or 'Ihr Unternehmen')

def subject_for(company, pattern):
    """Betreff: max 60 Zeichen, Firmenbezug, keine Emojis/Kaps/Ausrufezeichen (KOMM-001 §4)."""
    s = pattern.format(company=company or 'Ihr Unternehmen')
    return s[:60]

# Connect Supabase
logger.info("Verbinde zu Supabase...")
try:
    opts = SyncClientOptions(headers={'Authorization': f'Bearer {SB_JWT}'}) if SB_JWT else None
    client = create_client(SB_URL, SB_KEY, options=opts)
    logger.info(f"Connected to {SB_URL}")
except Exception as e:
    logger.error(f"Supabase Verbindung fehlgeschlagen: {e}")
    exit(1)

from src.pipeline.email_lead import send_email

logger.info("Fetching leads from Supabase...")
leads = None
for attempt in (1, 2, 3, 4):
    try:
        # Frischer Client pro Versuch: stale Pool-Verbindungen zum Kong
        # verursachen "Server disconnected" — neuer Client = neuer Verbindungsaufbau.
        opts = SyncClientOptions(headers={'Authorization': f'Bearer {SB_JWT}'}) if SB_JWT else None
        client = create_client(SB_URL, SB_KEY, options=opts)
        response = client.table('leads').select('contact_email,name,score,status,id,created_at').execute()
        leads = response.data
        logger.info(f"Fetched {len(leads)} leads")
        break
    except Exception as e:
        logger.error(f"Error fetching leads (Versuch {attempt}/4): {e}")
        if attempt < 4:
            wait = {1: 5, 2: 15, 3: 45}[attempt]
            logger.info(f"Retry in {wait}s...")
            time.sleep(wait)
if leads is None:
    logger.error("Fetch fehlgeschlagen nach 4 Versuchen – Abbruch")
    exit(1)

# Drip Campaign Logic — Sequenz Tag 0 / 4 / 10 (KOMM-001 §12)
now = datetime.now(timezone.utc)
mails_sent = 0

for lead in leads:
    email = lead.get('contact_email')
    if not email:
        continue
    company = lead.get('name', '')
    lead_id = lead['id']
    created_at = datetime.fromisoformat(lead['created_at'].replace('Z', '+00:00'))
    days_since = (now - created_at).days

    if lead.get('status') == 'contacted':
        continue

    # Mail 1: Tag 0
    if email not in state['mails_sent'].get('mail1', []) and days_since >= 0:
        html = render_template(TEMPLATE_DIR / 'lead_email_v2.html', email, company)
        subject = subject_for(company, '{company}: Wie viel Zeit kostet Ihr Angebotsprozess aktuell?')
        logger.info(f"[Mail 1] Sende an {email}...")
        ok = send_email(email, subject, html)
        if ok:
            logger.info(f"[Mail 1] OK {email}")
            state['mails_sent'].setdefault('mail1', []).append(email)
            save_state(state)
            mails_sent += 1
            time.sleep(random.randint(60, 180))
        else:
            logger.error(f"[Mail 1] FEHLER {email}")

    # Mail 2: Tag 4
    elif email not in state['mails_sent'].get('mail2', []) and days_since >= 4:
        html = render_template(TEMPLATE_DIR / 'lead_email_followup.html', email, company)
        subject = subject_for(company, '{company}: kurze Nachfrage zu meiner letzten Mail')
        logger.info(f"[Mail 2] Sende an {email}...")
        ok = send_email(email, subject, html)
        if ok:
            logger.info(f"[Mail 2] OK {email}")
            state['mails_sent'].setdefault('mail2', []).append(email)
            save_state(state)
            mails_sent += 1
            time.sleep(random.randint(60, 180))
        else:
            logger.error(f"[Mail 2] FEHLER {email}")

    # Mail 3: Tag 10 (Breakup)
    elif email not in state['mails_sent'].get('mail3', []) and days_since >= 10:
        html = render_template(TEMPLATE_DIR / 'lead_email_breakup.html', email, company)
        subject = subject_for(company, '{company}: letzte Nachricht von NeXify AI')
        logger.info(f"[Mail 3] Sende an {email}...")
        ok = send_email(email, subject, html)
        if ok:
            logger.info(f"[Mail 3] OK {email}")
            state['mails_sent'].setdefault('mail3', []).append(email)
            save_state(state)
            mails_sent += 1
            time.sleep(random.randint(60, 180))
        else:
            logger.error(f"[Mail 3] FEHLER {email}")

    if mails_sent >= 10:
        logger.info("Max 10 Mails erreicht – beende Run...")
        break

state['last_run'] = now.isoformat()
save_state(state)
logger.info(f"Done. {mails_sent} Mails gesendet.")
