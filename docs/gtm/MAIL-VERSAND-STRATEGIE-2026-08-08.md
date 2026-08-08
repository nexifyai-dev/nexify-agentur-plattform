# Mail-Versandstrategie 2026-08-08 (Pascal-Direktive)

**Gültig ab:** 2026-08-08 · **Status:** aktiv · **Owner:** System-CEO (Hermes)

## Grundsatz (Direktive)

> „Mails via Hostinger: nur die normalen Mails laufen lassen. Alles andere via Kontingent von Resend (3000/Monat; Systemmails brauchen ebenfalls Kontingent → Bulk zunächst auf 2500/Monat begrenzen). Weitere kostenlose Lösungen im exakt gleichen CI-Design finden und integrieren. Wenn alle kostenlosen Optionen ausgeschöpft: günstigste bezahlte Lösungen für Massenversand. CI + eigene Mail als Absender + Rückantworten (Reply-To) müssen überall funktionieren."

## Transportwege (verbindlich)

| Zweck | Transport | Absender / Reply-To | Limit | Guard |
|---|---|---|---|---|
| System-/normale Mails (Auto-Reply, Angebote, Invites, Tagesberichte, Team-Notify) | **Hostinger-SMTP** (`email_lead.send_email`, smtp.hostinger.com:465) | mail@nexifyai.cloud | Hostinger-Kontingent | — |
| Bulk-Outreach + Drip (send_to_qualified_v2.py, drip-campaign.py, Follow-up-Welle) | **Resend** (`email_lead.send_email_resend`, api.resend.com) | NeXify AI `<mail@nexifyai.cloud>` + Reply-To mail@nexifyai.cloud | **2.500/Monat** (RESEND_MONTHLY_BULK_LIMIT) | Monatszähler `/var/log/nexifyai/resend-usage.json`; bei Limit → STOP (kein Versand) |
| WhatsApp-Welle | Baileys-Bridge (bis Cloud-API live) | 31613318856 | **10/Lauf, hart 25** | Cap in whatsapp-wave.py + Timer 08:30/16:30 |

## DNS-/Deliverability-Basis (2026-08-08 verifiziert, dns.google)

- SPF: `v=spf1 include:_spf.mail.hostinger.com include:amazonses.com ~all` ✅
- DMARC: `v=DMARC1; p=quarantine; rua=mailto:nexify.login@gmail.com` ✅
- DKIM Hostinger: CNAMEs `hostingermail-a/b/c._domainkey` → `*.dkim.mail.hostinger.com` ✅ (MAIL-03)
- Resend: Domain `nexifyai.cloud` verifiziert, Region **eu-west-1** (DSGVO-freundlich) ✅

## Resend-Guard (Implementierung)

- `send_email_resend(to, subject, html, reply_to=mail@nexifyai.cloud)` in `/workspace/src/pipeline/email_lead.py`
- Zähler: Monatsschlüssel `YYYY-MM`, Datei `/var/log/nexifyai/resend-usage.json`
- Verhalten bei Limit: Log-Meldung, Rückgabe `False`, kein Versand
- **Pitfall:** Resend blockt `Python-urllib`-User-Agent (Cloudflare 1010) → eigener User-Agent `NeXifyAI-Hermes/1.0` gesetzt
- Env: `RESEND_API_KEY`, `RESEND_MONTHLY_BULK_LIMIT=2500` in `/opt/nexifyai/config/pipeline.env`

## E2E-Nachweis (2026-08-08)

1. Primärnachweis: `send_email_resend("mail@nexifyai.cloud", …)` → True, Usage-Zähler inkrementiert
2. Gegentest Zustellung: Mail in Hostinger-Mailbox per IMAP bestätigt (From: NeXify AI <mail@nexifyai.cloud>)
3. Gegentest Guard: Zähler künstlich auf 2500 → Versand blockiert (False, Log-Meldung)
→ **GEGENTEST BESTANDEN**

## Provider-Recherche (Stand 2026-08-08, offizielle Preisseiten verifiziert)

| Provider | Free-Kontingent | Kreditkarte | Branding? | EU/DSGVO | API/SMTP | Bewertung |
|---|---|---|---|---|---|---|
| **Brevo** (brevo.com/pricing) | **300/Tag ≈ 9.000/Mo** | nein | nein (Free ohne Logo-Footer? — Prüfpunkt) | Paris/EU ✅ | beide | **PRIMÄR-Kandidat** (größtes Free-Kontingent ohne Karte) |
| **Mailjet** (mailjet.com/pricing) | **6.000/Mo** (200/Tag) | nein | nein | FR/EU ✅ | beide | **PRIMÄR-Kandidat** |
| **Resend** (aktiv) | 3.000/Mo (Guard 2.500) | nein | nein | eu-west-1 ✅ | beide | aktiv |
| EmailOctopus | 10.000/Mo | nein | **JA (Footer)** | AWS | API | ❌ CI-Bruch (Branding) |
| Loops.so | 4.000/Mo | nein | **JA (Footer)** | US | API | ❌ CI-Bruch |
| MailerSend | 500/Mo | **JA (Pflicht)** | nein | EU | beide | ❌ zu wenig + Karte |
| Amazon SES | 3.000/Mo (ohne EC2) | AWS-Konto nötig | nein | eu-central/fra | beide | Option, kein AWS-Konto vorhanden |

**Kombi-Empfehlung:** Brevo (9.000) + Mailjet (6.000) + Resend (2.500) = **17.500 Mails/Mo kostenlos** — deckt Ziel 500/Tag (15.000/Mo) mit Redundanz. Je Provider: eigener DKIM-Selector + SPF-include (Lookup-Budget: aktuell 2 includes + 3 neue = 5/10, OK). CI: Templates bleiben providerunabhängig (HTML), Absender/Reply-To überall mail@nexifyai.cloud.

## Nächste Schritte

- **MAIL-05 (Kanban t_…):** Brevo- + Mailjet-Konto anlegen (mail@nexifyai.cloud, IMAP-Verifikation; Signup JS-lastig → Host-Chrome/CDP), Sende-Freischaltung beantragen, Domain verifizieren (DNS via Cloudflare), API-Keys in pipeline.env, Multi-Provider-Router in email_lead.py (Fallback-Kette Resend→Brevo→Mailjet mit je eigenem Monatszähler), E2E-Testmail je Provider + Gegentest.
- M2/M3-Template-Deploy (t_86c628f4) läuft über denselben Resend-Weg.
- Nach Cloud-API-Live: WhatsApp-Welle über offizielle API (WA-API-01).
