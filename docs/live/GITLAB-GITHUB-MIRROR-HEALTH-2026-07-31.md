# FILE: docs/live/GITLAB-GITHUB-MIRROR-HEALTH-2026-07-31.md
# NIR: 31.07.2026 11:33
# UPDATED: 31.07.2026 11:33
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: GitHub↔GitLab Mirror Health Evidence (keine Secrets)
# WHY: Dual-VCS SoT GitHub; Mirror Workflow Pflicht nach Merge auf main
# DEPENDS: .github/workflows/mirror-to-gitlab.yml · docs/operations/REPO-SYNC-STRATEGY.md
# KATEGORIE: platform

## IST 2026-07-31

| Event | Mirror Run | Conclusion |
|-------|------------|------------|
| `#100` OpenMCP stub merge | [30619965418](https://github.com/nexifyai-dev/nexify-agentur-plattform/actions/runs/30619965418) | **success** (~09:26Z) |
| `#99` OfferCatalog merge | [30619942784](https://github.com/nexifyai-dev/nexify-agentur-plattform/actions/runs/30619942784) | **success** (~09:26Z) |
| `#98` Gap/MCP merge | [30619319283](https://github.com/nexifyai-dev/nexify-agentur-plattform/actions/runs/30619319283) | **success** (~09:16Z) |

GitLab HTTP: `127.0.0.1:8922/` → **302** (alive). `/-/health` / `/-/readiness` → 404 (Endpoint-Layout; nicht als Down werten).

## Workflow-Gates

- Secrets nur Env-Namen: `VPS_GITLAB_URL`, `VPS_GITLAB_USERNAME`, `VPS_GITLAB_TOKEN`
- Trigger: push `main`/`develop` + `workflow_dispatch`
- Repo-Gate: nur `nexifyai-dev/nexify-agentur-plattform`

## GitLab CI Note

Monorepo `.gitlab-ci.yml`: Manual Job `deploy:vps` (allow_failure) schließt soll-deviation WARN „deploy:vps fehlt“ — **kein** Blind-Prod-Cutover.

## Verify

```bash
unset GITHUB_TOKEN
gh run list --workflow=mirror-to-gitlab.yml --limit 5
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8922/
```
