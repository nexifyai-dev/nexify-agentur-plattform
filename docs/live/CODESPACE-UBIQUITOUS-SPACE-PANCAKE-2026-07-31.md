# FILE: docs/live/CODESPACE-UBIQUITOUS-SPACE-PANCAKE-2026-07-31.md
# NIR: 31.07.2026 11:10
# UPDATED: 31.07.2026 11:10
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Befund GitHub Codespace / github.dev Workspace „ubiquitous space pancake“
# WHY: Mandat — Fremd-Workspace prüfen, Drift vs Monorepo, Integrationsbedarf WebUI
# DEPENDS: gh codespaces API, PR#90, GITHUB-ORG-MONOREPO-DRIFT
# KATEGORIE: platform
# SESSION: fix-run-gesamtsystem-2026-07-31

## Kurzfazit

Kein Fremd-Fork. Der Workspace zeigt auf **dasselbe** Feature-SoT-Repo und einen bestehenden CI-Fix-Branch.

| Feld | Wert |
|------|------|
| URL | `https://ubiquitous-space-pancake-q7r5qvj444wxc46pg.github.dev/` |
| Codespace-Name | `ubiquitous-space-pancake-q7r5qvj444wxc46pg` |
| Display | ubiquitous space pancake |
| State | Available (2026-07-31) |
| Repo | `nexifyai-dev/nexify-agentur-plattform` |
| Branch | `copilot/fix-github-actions-build-backend-image` |
| Drift vs `main` | ahead 5 / behind 0 |
| Uncommitted | null (API) |
| Machine | 2 cores / 8 GB / 32 GB |
| Erstellt | 2026-07-31 ~10:46 CEST |

## Inhalt / Commits (vs main)

1. Initial plan (Copilot)
2. `fix: remove private packages from backend requirements to fix Docker build CI`
3. Merge `origin/main` (Conflict-Resolution `Dockerfile.backend`)
4. `test(website): escape regex inputs in seo test assertions`
5. Re-merge `origin/main`

**Geänderte Dateien:** `backend/requirements.txt`, `deploy/docker/Dockerfile.backend`, `apps/website/tests/seo.test.mjs`

## Zugehörige PR

| PR | Status | Rolle |
|----|--------|-------|
| [#90](https://github.com/nexifyai-dev/nexify-agentur-plattform/pull/90) | OPEN **draft** | CI: private PyPI/`emergentintegrations`/litellm-Wheel entfernen bzw. public pin |

github.dev verlangt Login — Inhalt über `gh api user/codespaces/…` + Branch-Compare verifiziert (kein Secret-Leak).

## Voll-Integration WebUI / Produktion?

| Frage | Antwort |
|-------|---------|
| Neues Produkt-Surface? | **Nein** — reiner CI/Docker-Build-Fix |
| Native WebUI-Module? | **Nein** |
| Monorepo-Import nötig? | **Bereits im Monorepo** (Branch/PR) |
| Produktions-Cutover? | Nach CI-Grün + Review Merge von #90; kein Hermes-Live-Patch |

## Handlung

- PR #90 als Draft belassen bis Checks grün / Review.
- Kein separater Import-PR, kein Stub — würde Duplikat erzeugen.
- Action: Codespace nach Merge stoppen/löschen (Kosten), optional.

## Evidence

```bash
unset GITHUB_TOKEN
gh api user/codespaces/ubiquitous-space-pancake-q7r5qvj444wxc46pg
gh api repos/nexifyai-dev/nexify-agentur-plattform/compare/main...copilot/fix-github-actions-build-backend-image
gh pr view 90 --json state,isDraft,url,headRefName
```
