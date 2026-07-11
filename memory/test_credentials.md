# Test-Zugänge NeXify AI — Übersicht (keine Credentials)

> **CREDENTIALS-SICHERHEIT:** Alle Secrets liegen ausschließlich in
> `/etc/nexifyai/secrets.env` (0600, root-only) — diese Datei enthält
> keine Passwörter, Tokens oder API-Keys. Siehe kanonische Quelle.

## Admin
- URL: /login → /admin (Preview: https://rebranding-hub-2.preview.emergentagent.com, Live: https://www.nexifyai.cloud)
- E-Mail: mail@nexifyai.cloud
- **Passwort:** → `/etc/nexifyai/secrets.env`

## Test-Kunde (vom Testing-Agent angelegt)
- E-Mail: support@nexify-automate.com
- **Passwort:** → `/etc/nexifyai/secrets.env`

## Infrastruktur
- Vercel-Projekt: "website" (Token in `/etc/nexifyai/secrets.env`)
- Cloudflare: Credentials in `/etc/nexifyai/secrets.env`
- Supabase, Resend, Revolut, MiMo: Keys in `/etc/nexifyai/secrets.env`

## Service-Token (Server-zu-Server Admin-API)
- **Header:** `X-Admin-Token` → `/etc/nexifyai/secrets.env`
- **Quelle:** Einzige kanonische Quelle: `/etc/nexifyai/secrets.env`
