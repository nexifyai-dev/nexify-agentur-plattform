# AgentMemory / Autopilot Gap-Actions — Agentic Bootstrap 2026-07-27

**Status:** aktualisiert nach VPS-Übernahme
**Kategorie:** platform
**Kein Chat-Ask** — Secrets nur Env-Namen.

| ID | Action | Status | Gap |
|----|--------|--------|-----|
| ACT-GL-001 | `GITLAB_PERSONAL_ACCESS_TOKEN` für gitlab-oss MCP | resolved | `/etc/nexifyai/gitlab-mcp.env` vorhanden |
| ACT-GL-002 | GitLab Projekt `nexifyai_group/nexifyai` verifizieren | resolved | API-Projekt und GitHub-Mirror-Secrets vorhanden |
| ACT-GH-001 | Write-Recht auf `nexifyai-dev/nexify-agentur-plattform` | resolved | VPS ist via `gh` als `nexifyai-dev` authentifiziert |
| ACT-AM-001 | AgentMemory Worker `:3111` erreichbar machen | resolved | `/agentmemory/livez` antwortet 200 |
| ACT-9R-001 | 9Router `:20128` Health | pending | Dienst erreichbar, aber `/health` liefert keinen 2xx-Nachweis |
| ACT-GH-002 | GitHub Secrets `VPS_GITLAB_URL`, `VPS_GITLAB_USERNAME`, `VPS_GITLAB_TOKEN` | resolved | Repository-Secrets vorhanden |
| ACT-GL-003 | Lokales SSH-Leserecht auf Projekt 7 | blocked | SSH-Identität meldet GitLab-Login, darf Projekt derzeit nicht lesen |

## Unblock (VPS, automatisch wenn Keys da)

```bash
set -a; source /etc/nexifyai/gitlab-mcp.env; set +a
bash scripts/gitlab-oss-smoke.sh
bash scripts/ensure-gitlab-remote.sh
bash scripts/agentic-bootstrap.sh
```

## Evidence

- `test_reports/soll-deviation-scan.json`
- `test_reports/gitlab-oss-smoke.json` (nach Smoke mit Token)
