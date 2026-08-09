# Website — NeXify AI by NeXify

Öffentliche Agentur-Website: **AUTOMATE IT.**

| | |
|---|---|
| **Pfad** | `apps/website` |
| **Stack** | Next.js 16 · React 19 · Tailwind v4 · pnpm |
| **Paketname** | `nexifyai-agency-website` (privat) |
| **Live** | https://www.nexifyai.cloud |
| **Vercel** | https://nexify-agentur-plattform.vercel.app |
| **Design** | Root-`design_guidelines.json` — Dark/Luxury, Outfit/Manrope, `#0A0A0A` |

## Befehle (immer aus diesem Verzeichnis)

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test         # nur tests/*.test.mjs
pnpm build
```

Oder vom Repo-Root: `pnpm --dir apps/website <script>`.

## Hinweise

- `GET /api/health` → `{"status":"ok"}`; `/` bleibt unprefixed, Legacy-Locale-Pfade werden per 308 auf die kanonische unprefixed Route zurückgeführt
- Mehrere Lockfiles / „inferred workspace root“-Warnung von Next.js: harmlos
- Ohne Backend: `/api/planner/plan` lokal nutzbar; Contact/Offers brauchen `BACKEND_ORIGIN` / `RESEND_API_KEY`
- Ausführliche Stolpersteine: `.cursor/skills/website-dev/SKILL.md` und `AGENTS.md`

## Deploy

Push auf `main` → GitHub Action `deploy-vercel.yml` (Credentials müssen als Secrets gesetzt sein). Docker-Image: `ghcr.io/nexifyai-dev/nexify-agentur-plattform:website-*`.
