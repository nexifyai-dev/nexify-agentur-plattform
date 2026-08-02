---
name: website-dev
description: Dev-Workflow und Konventionen für das Website-Paket (apps/website, Next.js 16 + pnpm). Verwenden bei Arbeit an der NeXify-Website — Install, Lint, Typecheck, Test, Build und Dev-Server sowie deren nicht-offensichtliche Stolpersteine.
paths:
  - "apps/website/**"
---

# Website Dev (apps/website)

Das einzige voll lauffähige Produkt im Repo ist die Website unter `apps/website`
(Next.js 16, React 19, Tailwind v4, Paketmanager **pnpm**). Alle Befehle **aus
`apps/website` heraus** ausführen.

## When to Use
- Beim Ändern von Code, Styles, Tests oder Config unter `apps/website/`.
- Wenn Lint/Typecheck/Test/Build/Dev-Server für die Website laufen sollen.

## Standard-Befehle (aus `apps/website`)
- Install: `pnpm install`
- Lint: `pnpm lint`  (0 Fehler erwartet; Warnungen sind ok)
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`  (Node-Test-Runner, nur `tests/*.test.mjs`)
- Build: `pnpm build`
- Dev-Server: `pnpm dev` → http://localhost:3000 (Health: `GET /api/health`; `/` bleibt unprefixed, Legacy-`/{locale}` wird per 308 auf die kanonische Route zurückgeführt)

## Nicht-offensichtliche Konventionen / Stolpersteine
- **pnpm** verwenden, nicht npm/yarn. Es liegen `pnpm-lock.yaml` **und** eine
  verwaiste `yarn.lock` — pnpm passt zu Lockfile + `engines`.
- `apps/website/pnpm-workspace.yaml` macht `apps/website` zum eigenen
  pnpm-Workspace-Root → Install aus diesem Verzeichnis. Next.js warnt wegen
  mehrerer Lockfiles / „inferred workspace root" — **harmlos**.
- `pnpm test` führt die Site-Contract-Tests unter `tests/*.test.mjs` aus; die
  früheren `*.test.tsx`-Contracts wurden in diesen Runner überführt.
- `test:design` / `test:design-audit` (Playwright) brauchen Browser-Binaries;
  lokal ggf. erst `pnpm exec playwright install --with-deps chromium` ausführen.
- Der volle Design-Audit läuft in GitHub Actions für website-/CI-relevante PRs
  sowie nightly; lokal bleibt er optional.
- pnpm meldet beim Install „Ignored build scripts: sharp, unrs-resolver" — für
  Dev ok.
- Ohne Backend liefert `/api/planner/plan` eine deterministische lokale
  Schätzung, während `/api/contact` und `/api/offers/request` bewusst 5xx
  zurückgeben („honest failure"). `BACKEND_ORIGIN` setzen, um `/api/*` an ein
  echtes Backend zu proxien.

## Verweise
- Repo-weite Cursor-Cloud-Hinweise und Backend-Grenzen: siehe `AGENTS.md`
  (Abschnitt „Cursor Cloud specific instructions").
- Backend (`backend/`) ist in dieser Umgebung nicht voll lauffähig (privates
  Paket `emergentintegrations`, externe Dienste) — Details in `AGENTS.md`.
