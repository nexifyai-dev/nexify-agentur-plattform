# /agentic-bootstrap

Agentic AI Mode Session-Start — Vorgaben, MCP, GitHub+GitLab, Deviation-Scan.

## Goal

Jede Session startet mit demselben Bootstrap: keine Arbeit ohne geladene Vorgaben und sichtbare Abweichungen.

## Run

```bash
bash scripts/agentic-bootstrap.sh
```

## Checks

1. Pflicht-Vorgaben (`AGENTS.md`, `CHARTA.md`, `agent-config.yaml`, Sync-Strategie)
2. `.cursor/mcp.json` (aus Example wenn fehlend; nicht git-getrackt)
3. GitHub `gh` Auth
4. GitLab OSS PAT/API (`gitlab-oss` MCP, nicht built-in Gitlab)
5. AgentMemory Health (:3111 / :3113)
6. `scripts/soll-deviation-scan.py`
7. `scripts/check_knowledge_mandate.py`

## Docs

- `docs/operations/AGENTIC-AI-MODE.md`
- `docs/operations/REPO-SYNC-STRATEGY.md`
- `deploy/mcp/gitlab-oss/README.md`

## Pitfalls

- Cloud-Agent ohne VPS: AgentMemory/GitLab WARN ist erwartbar → Actions `blocked`, kein Chat-Ask
- `.cursor/mcp.json` mit echtem PAT niemals committen
