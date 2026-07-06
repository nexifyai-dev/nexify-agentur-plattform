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

## Service-Token (Server-zu-Server Admin-API)
- Header: `X-Admin-Token: 10e5a1213fc000a71df803a6101a1285c7324a8feb33327b`
- Quelle: /app/backend/.env ADMIN_API_TOKEN (identisch als NEXIFY_CRM_API_TOKEN in VPS /root/.hermes/.env für den Hermes-Skill nexify-crm)
