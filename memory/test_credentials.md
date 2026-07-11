# Test-Zugänge NeXify AI

**⚠️ ROTIERT & ENTFERNT (2026-07-11):** Diese Datei enthielt bis zu diesem Commit
Klartext-Zugangsdaten (Admin-Passwort, Test-Kunden-Passwort, Service-API-Token),
die auf `main` committet waren. Siehe `docs/architecture/SECURITY-INCIDENT-2026-07-11.md`
für den vollständigen Befund und die Rotations-Checkliste. Alle unten referenzierten
Werte gelten als kompromittiert und müssen rotiert werden, falls das noch nicht
geschehen ist.

## Admin
- URL: /login → /admin (Preview: https://rebranding-hub-2.preview.emergentagent.com, Live: https://www.nexifyai.cloud)
- E-Mail: mail@nexifyai.cloud
- Passwort: **[ROTIEREN — siehe Security-Incident-Doku, nicht mehr in Git]**

## Test-Kunde (vom Testing-Agent angelegt)
- E-Mail: support@nexify-automate.com
- Passwort: **[ROTIEREN — siehe Security-Incident-Doku, nicht mehr in Git]**

## Infrastruktur
- Vercel-Projekt: "website" (Token in Secret-Store, NICHT in Git — z. B. Vercel Env Vars / VPS `.env`)
- Cloudflare: Global Key im Secret-Store; Bearer-Token hat nur Zone-Read
- Supabase, Resend, Revolut, MiMo: Keys im Secret-Store (z. B. `.env`, nie in Git)

## Service-Token (Server-zu-Server Admin-API)
- Header: `X-Admin-Token: <ROTIERT — siehe Security-Incident-Doku>`
- Quelle: Secret-Store `ADMIN_API_TOKEN` (identisch als `NEXIFY_CRM_API_TOKEN` in VPS `/root/.hermes/.env` für den Hermes-Skill nexify-crm)
