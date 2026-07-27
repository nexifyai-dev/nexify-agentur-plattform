# AgentMemory / Autopilot Gap-Actions — Agentic Bootstrap 2026-07-27

**Status:** blocked (Cloud-Agent ohne VPS-Runtime / ohne Write auf Ziel-Repo)  
**Kategorie:** platform  
**Kein Chat-Ask** — Secrets nur Env-Namen.

| ID | Action | Status | Gap |
|----|--------|--------|-----|
| ACT-GL-001 | `GITLAB_PERSONAL_ACCESS_TOKEN` für gitlab-oss MCP | blocked | Env fehlt im Cloud-Agent; VPS: `/etc/nexifyai/gitlab-mcp.env` |
| ACT-GL-002 | GitLab Projekt `nexifyai/nexify-agentur-plattform` Mirror verifizieren | blocked | braucht PAT (ACT-GL-001) |
| ACT-GH-001 | Write-Recht `cursor[bot]` → `nexifyai-dev/nexify-agentur-plattform` | blocked | push 403; Branch lokal `cursor/agentic-ai-mode-bootstrap-7dd5` |
| ACT-AM-001 | AgentMemory Worker `:3111` erreichbar machen | blocked | Cloud-Agent ohne VPS Bind |
| ACT-9R-001 | 9Router `:20128` Health | blocked | Cloud-Agent ohne VPS Bind |
| ACT-GH-002 | GitHub Secrets `VPS_GITLAB_URL` + `VPS_GITLAB_TOKEN` / `GITLAB_TOKEN` | pending | für mirror-to-gitlab.yml + gitlab-sync.yml |

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
