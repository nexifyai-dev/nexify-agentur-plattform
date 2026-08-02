# FILE: docs/gtm/ONBOARDING-EMAIL-TEMPLATES.md
# SESSION: neukunden-begeisterung-7dd5

## Versand-Hook

```bash
python3 scripts/gtm/send-onboarding-email.py --template lead_magnet --to prospect@example.com --name "Max"
python3 scripts/gtm/send-onboarding-email.py --template booking_confirmed --to … --name … --slot "Mo 10:00" --send
```

Env (Namen only): `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, oder `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` / `SMTP_PORT`.
Optional Hostinger: `source /etc/nexifyai/mail-nexifyai.env` — **nie Secrets committen oder ausgeben**.

Website-Fallback: `apps/website/lib/mail.ts` (Resend).

## Templates

### `lead_magnet` — Betreff: Ihre Checkliste folgt – NeXify AI
Links: `/danke?variant=lead_magnet`, `/rueckruf`, WhatsApp. Ziel ≤ 1 Werktag.

### `booking_confirmed` — Betreff: Ihr Rückruf ist bestätigt – NeXify AI
Platzhalter `{{slot}}`. Links: `/danke?variant=booking`, `/konto`.

### `offer_sent` — Betreff: Ihr Angebot ist unterwegs – NeXify AI
Links: `/danke?variant=offer`, `/konto`, `/rueckruf`. Keine Fake-Kennzahlen.

## Compliance

B2B, klare Absender-Identität. Outbound-Cold-Mail = Zero-Cost-Leads-Playbook — diese Templates sind **Inbound/Onboarding**.
