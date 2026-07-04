# Test-Zugänge NeXify AI

## Admin
- URL: /login → /admin (Preview: https://rebranding-hub-2.preview.emergentagent.com, Live: https://www.nexifyai.cloud)
- E-Mail: mail@nexifyai.cloud
- Passwort: ***REDACTED***

## Test-Kunde (vom Testing-Agent angelegt)
- E-Mail: support@nexify-automate.com
- Passwort: TestKunde2026!

## Infrastruktur
- Vercel-Projekt: "website" (Token in /app/backend/.env als VERCEL_TOKEN)
- Cloudflare: Global Key in /app/backend/.env (CLOUDFLARE_EMAIL + CLOUDFLARE_GLOBAL_KEY); Bearer-Token hat nur Zone-Read
- Supabase, Resend, Revolut, MiMo: Keys in /app/backend/.env
