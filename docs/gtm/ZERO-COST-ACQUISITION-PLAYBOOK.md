# FILE: /docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md
# NIR: 02.08.2026 10:45
# UPDATED: 02.08.2026 10:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Weekly zero-cost lead discovery + compliant mailing + free-channel cadence
# WHY: Activate customer acquisition without paid ads or new SaaS
# BEST-PRACTICE: Discover → allow gate → dry-run → small send; Hostinger cold / Resend transactional
# PITFALL: V-GTM-ZC-01: No spam lists; no WhatsApp LLM cron; coordinate open GTM PRs
# DEPENDS: scripts/leads/*, scripts/outreach/*, docs/gtm/FREE-ACQUISITION-PLAYBOOK-DACH.md (#175)
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: zero-cost-leads-mailing-7dd5

# Zero-Cost Acquisition Playbook (aktiv)

**Ziel:** Neue B2B-Kunden in DACH/NL **ohne** Paid Ads und **ohne** neue kostenpflichtige SaaS.  
**Preisanker:** 449 € netto / Tag · Angebot: AI-Begleiter (Website, Automation, KI-Agenten).  
**Live:** [www.nexifyai.cloud](https://www.nexifyai.cloud) · Booking [`/rueckruf`](https://www.nexifyai.cloud/rueckruf) · Lead-Magnet [`/checkliste`](https://www.nexifyai.cloud/checkliste) · Danke [`/danke`](https://www.nexifyai.cloud/danke)

## Was war inaktiv → was ist aktiv

| Bereich | Vorher | Jetzt |
|---------|--------|-------|
| Lead-Discovery (öffentlich) | Kein laufendes Scraping | `scripts/leads/discover.py` + Seeds |
| Lead-Queue | Fehlt / fragmentiert | `data/leads` oder `/var/lib/nexifyai/leads` Statusmaschine |
| Cold/Drip Mail | Code in PR #173, nicht aktiv | Hostinger SMTP + dry-run/`--send` Pipeline |
| WhatsApp Cron | Pausiert (Model-Drift) | **bleibt aus** — kein Re-Enable |
| Verzeichnisse / LinkedIn | Playbooks in #175 | Wöchentliche Checkliste unten + Drafts |
| Inbound CTAs | `/checkliste`, `/rueckruf` live | Templates verlinken Booking + Checkliste + Danke |

## Koordination (nicht blind duplizieren)

| Track | Issue/PR | Rolle |
|-------|----------|-------|
| Free GTM Playbook / Directories | #175 | Supply-Sichtbarkeit |
| Outreach drip automation | #173 | Tägliches Cap-Drip (nach Promote) |
| Proactive gaps / Vergleich | #213 | Radar + `/vergleich` |
| Gesamtkonzept Portal | #214 | Website Story |
| Human GSC/GBP/WhatsApp | #210 | Login-Gates |
| Partner Intro | #206 | Warm-Intro |

Dieses Playbook **aktiviert** Demand (Leads + Mail). Supply bleibt Eigentum von #175.

## Legal (DACH) — Hard Rules

1. Nur **geschäftliche** Adressen (Firmen-Domain `info@`/`kontakt@`/…) oder öffentliche Kontaktformulare.
2. Quelle + `legal_basis=legitimate_interest_b2b_uwg` speichern; kein Leak-/Kauf-Listen-Import.
3. Jede Mail: Identität NeXifyAI, KvK, Abmelde-Link, keine Fake-Metriken.
4. Kammern/Verbände (IHK/HWK/Bitkom) = **Quellen**, nicht Cold-Sales-Ziele.
5. Resend = transactional (Kontaktformular). Cold = **Hostinger** (`/etc/nexifyai/mail-nexifyai.env`).

## Wöchentlicher Agent-Cadence (Pflicht bei GTM-Arbeit)

```bash
# 0) Env laden (Keys existieren lokal — nie committen)
#    /etc/nexifyai/mail-nexifyai.env  + optional secrets.env

# 1) Discover öffentliche Kontaktseiten
python3 scripts/leads/run_pipeline.py discover \
  --seed data/leads/seeds/dach_smb_agencies.json --limit 20

# 2) Queue prüfen
python3 scripts/leads/run_pipeline.py status

# 3) Policy-Gate (nur klare B2B-Treffer)
python3 scripts/leads/run_pipeline.py allow --limit 8

# 4) Dry-run (immer zuerst)
python3 scripts/leads/run_pipeline.py mail --limit 8

# 5) Kleiner Live-Batch (nur wenn Dry-run + SMTP OK)
python3 scripts/leads/run_pipeline.py mail --send --limit 8

# 6) Optional: in Outreach-Drip (#173) überführen
python3 scripts/leads/run_pipeline.py promote --allow-send
python3 scripts/outreach/run_daily.py --dry-run
```

**Cursor-Regel:** Bei GTM-Tasks Queue vorrücken (discover/status/allow/mail dry-run) — siehe `.cursor/rules/60-proactive-acquisition-gaps.mdc`.

## Freie Kanäle jenseits Mail (diese Woche)

| Tag | Aktion | Owner |
|-----|--------|-------|
| Mo | Discover + dry-run Mail; Radar updaten | Agent |
| Di | 1–2 Free-Verzeichnis-Drafts (`DIRECTORY_SUBMISSION_CHECKLIST` / #175) | Agent → Human Submit |
| Mi | LinkedIn-Post posten (Draft: `docs/gtm/drafts/linkedin-week-organic.md`) | **Human** |
| Do | Warm-Intro / Partner (Draft: `docs/gtm/drafts/partner-warm-intro.md`) — 3 Nachrichten | Human + Agent Text |
| Fr | Checkliste/Inbound smoke (`POST /api/contact` type=lead_magnet); Queue status | Agent |
| Sa/So | Optional: 1 FAQ/Blog-Support für #190 — nicht duplizieren | Agent |

### Directory (free only)

Siehe `docs/gtm/DIRECTORY_SUBMISSION_CHECKLIST.md` (#175) und `docs/gtm/FREE-ACQUISITION-PLAYBOOK-DACH.md`.  
**Human-Gate:** Captcha/Login (GBP, Gelbe Seiten Verify, GSC).

### LinkedIn organic

Drafts unter `docs/gtm/drafts/linkedin-week-organic.md` — User postet manuell (kein API-Abo).

### Partner / Warm-Intro

Skript: `docs/gtm/drafts/partner-warm-intro.md` · Issue #206.

## Inbound sicherstellen

| Endpoint | Erwartung |
|----------|-----------|
| `GET /checkliste` | 200 Form |
| `POST /api/contact` | Backend oder Resend-Fallback |
| `GET /rueckruf` | Booking CTA |
| `GET /danke` | Thank-you + Booking-Link |
| `GET /api/outreach/unsubscribe` | Abmeldung (nach Merge Outreach-API) |

## Env (Namen only)

```
SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASSWORD SENDER_EMAIL REPLY_TO_EMAIL
RESEND_API_KEY RESEND_DOMAIN          # transactional only
OUTREACH_LIVE=0                       # drip default dry
LEADS_DATA_DIR=/var/lib/nexifyai/leads
OUTREACH_BOOKING_URL=https://www.nexifyai.cloud/rueckruf
```

## Erwartete 7-Tage-Actions (kostenfrei)

1. 2× Discover-Läufe (≥20 neue Firmen-URLs in Queue).
2. ≥1 Dry-run + 1 kleiner Send-Batch (5–10) **oder** Human-Command dokumentiert.
3. 3 LinkedIn-Posts (manuell) aus Drafts.
4. 2 Verzeichnis-Submits (Human klickt).
5. 5 Warm-Intros (Partner/Steuerberater/SEO-Freelancer).
6. GSC + GBP Verify vorantreiben (#210) — Human.
7. Radar + AgentMemory Save nach Session.

## Commands für Human falls Send blockiert

```bash
# SMTP-Login testen (kein Versand):
python3 - <<'PY'
import os, smtplib
from pathlib import Path
def load(p):
  for line in Path(p).read_text().splitlines():
    if not line.strip() or line.startswith('#') or '=' not in line: continue
    k,v=line.split('=',1); os.environ.setdefault(k.strip(), v.strip().strip('"'))
load('/etc/nexifyai/mail-nexifyai.env')
with smtplib.SMTP_SSL(os.environ['SMTP_HOST'], int(os.environ.get('SMTP_PORT','465'))) as s:
  s.login(os.environ['SMTP_USER'], os.environ['SMTP_PASSWORD'])
print('SMTP_OK')
PY

python3 scripts/leads/run_pipeline.py allow --limit 8
python3 scripts/leads/run_pipeline.py mail --send --limit 8
```
