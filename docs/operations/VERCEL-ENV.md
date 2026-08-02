# Vercel Environment — Website (`apps/website`)

**NIR:** 02.08.2026 09:05  
**UPDATED:** 02.08.2026 09:05  
**WHAT:** Env-Namen für Vercel Project + lokale `.env` (keine Werte).  
**WHY:** Production 502/empty-host Bugs vermeiden; Agents brauchen SoT.  
**PITFALL:** `BACKEND_ORIGIN` leer lassen bis DNS/host live — nie `"https://"` als Placeholder.  
**Refs:** `apps/website/.env.example` · GitHub Secrets Registry · Human Gate

## Where to set

| Layer | Path |
|-------|------|
| Local | `apps/website/.env.local` (gitignored) from `.env.example` |
| Vercel | Project → **Settings → Environment Variables** (Production / Preview / Development) |
| GitHub Actions deploy | Repo secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |

## Variable names

| Name | Scope | Required | Notes |
|------|-------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | all | yes | Canonical public URL, e.g. `https://www.nexifyai.cloud` |
| `NEXT_PUBLIC_BACKEND_URL` | client | optional | Empty = same-origin Next API routes |
| `NEXT_PUBLIC_WEBUI_URL` | client | optional | Hermes WebUI link |
| `BACKEND_ORIGIN` | server | when FastAPI live | Absolute origin with host; empty until ready |
| `RESEND_API_KEY` | server | for contact/offers email | Without it routes return honest 503 |
| `CONTACT_TO_EMAIL` | server | recommended | Default `mail@nexifyai.cloud` |
| `CONTACT_FROM_EMAIL` | server | recommended | From header |

## GitHub → Vercel deploy

Workflow: `.github/workflows/deploy-vercel.yml` (push `main` + `workflow_dispatch`).

Missing secrets → preflight **skips deploy** (see CI signal integrity docs / #147 — skip must not look like success for gated checks).

## Preview vs Production

- Preview: Vercel Git integration often injects its own; keep `BACKEND_ORIGIN` empty unless preview API exists.  
- Production: set `NEXT_PUBLIC_SITE_URL` + `RESEND_API_KEY` first; add `BACKEND_ORIGIN` only after API host resolves.

## Smoke after change

```bash
curl -sS https://www.nexifyai.cloud/api/health
# expect JSON {"status":"ok"} or equivalent
```

Hosted daily check: `.github/workflows/daily-smoke.yml`.
