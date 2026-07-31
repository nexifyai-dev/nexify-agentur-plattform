# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/docs/live/GITHUB-ORG-MONOREPO-DRIFT-2026-07-31.md
# NIR: 31.07.2026 10:55
# WHAT: Drift GitHub Org vs Monorepo Feature-SoT (keine Secrets)
# WHY: Mandat — GitHub-Codebase einbeziehen; Features nur im Monorepo
# DEPENDS: DECISION-2026-07-26-MONOREPO, MONOREPO-KONSOLIDIERUNG-PLAN, REPO-SYNC-STRATEGY

## Inventar-Methode

```bash
unset GITHUB_TOKEN
gh repo list nexifyai-dev --limit 200 --json name,pushedAt,isPrivate
```

Stand: **~48+ Repos** in `nexifyai-dev` (2026-07-31).

## Drift-Klassifikation

| Klasse | Bedeutung | Handlung |
|--------|-----------|----------|
| A Feature-SoT | nur `nexify-agentur-plattform` | PRs hier |
| B Runtime-Fork | agentmemory, LightRAG, 9router, hermes-* | read-only außer Security-Hotfix → zurückporten |
| C Migrate-pending | open-design, portal, cockpit, html-anything | Spec → apps/services Import |
| D Archive-candidate | Legacy Website/Workstation Duplikate | README pointer + archive |
| E Never-monorepo | root-9router-runtime-snapshot, secrets dumps | bleibt privat isoliert |
| F Customer | bookando, studienkolleg, lv-ai, … | Isolation-Policy |
| G VPS-only | 1backend, openmcp | GitHub Import oder Monorepo stub + Action |

## Codespace (2026-07-31)

`ubiquitous-space-pancake` = Branch `copilot/fix-github-actions-build-backend-image` / PR#90 — siehe `CODESPACE-UBIQUITOUS-SPACE-PANCAKE-2026-07-31.md`. Kein Fremd-Fork.

## CI/Hooks Drift

| Item | IST | SOLL | Status |
|------|-----|------|--------|
| `.github/workflows/mirror-to-gitlab.yml` | vorhanden | GitHub→GitLab Spiegel | OK |
| GitHub CI (build/test/secret-scan/…) | vorhanden | green on PR | prüfen je PR |
| GitLab `deploy:vps` | soll-deviation WARN | vorhanden oder dokumentiert optional | WARN |
| `.git/hooks/post-commit` | nur deviation-auto-fix | + Dual-Write AM/LightRAG | GAP |
| `.cursor/mcp.json` | fehlte LightRAG | AM+Context7+LightRAG+gitlab-oss | FIX dieser PR |

## Sync-Pointer

- `docs/operations/REPO-SYNC-STRATEGY.md`
- Autopilot Live Gap: `/opt/nexifyai/docs/live/GESAMTSYSTEM-INTEGRATION-GAP-2026-07-31.md`

## Deferred (lint gate)

`/health` alias on `backend/server.py` deferred — pre-commit ruff E402 + mypy debt on portal/agent/booking. Live probe remains `/api/health` (200).
