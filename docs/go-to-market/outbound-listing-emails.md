# Outbound listing emails — Status 2026-08-01

## Autonom eingereicht (Form)

1. **agenturen.app** — SUCCESS, wartet auf E-Mail-Verifizierung an mail@nexifyai.cloud
2. **Zukko.nl** — SUCCESS, Profil-Link innerhalb 24h an mail@nexifyai.cloud

## Entwürfe (Mail-Versand vom VPS blockiert)

Resend API: Cloudflare 1010. SMTP_USER/SMTP_PASS fehlen in backend/.env.

### GoodFirms — an listing@goodfirms.com
Betreff: Free listing request — NeXify AI (Venlo, NL / B2B)
Inhalt: siehe docs/go-to-market/listing-copy.json (long_en) + Firmendaten aus channels.json

### AI Agency Search — an hello@aiagencysearch.com
Betreff: Free agency listing — NeXify AI (Venlo, NL)
Inhalt: Free tier, Kategorien Process Automation / Generative AI / Custom AI / Integration / Conversational AI

## Manuell in Browser nötig (Cloudflare / Captcha / SSO)

- GoodFirms Register (Passwort + Turnstile)
- Sortlist Agency Register
- Clutch (Google/LinkedIn)
- Google Business
- profis.ai (Passwort + reCAPTCHA)
