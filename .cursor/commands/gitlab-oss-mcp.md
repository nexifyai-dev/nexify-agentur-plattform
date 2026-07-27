# /gitlab-oss-mcp

Verdraht Cursor MCP auf die **self-hosted GitLab-OSS-Instanz** (`gitlab.nexifyai.cloud`), nicht gitlab.com.

## Goal

`gitlab-oss` MCP via `@zereight/mcp-gitlab` mit `GITLAB_API_URL=…/api/v4` und PAT (lokal, nie im Git).

## Common Files

- `deploy/mcp/gitlab-oss/README.md`
- `deploy/mcp/gitlab-oss/mcp.json.example`
- `.cursor/mcp.json.example`
- `scripts/gitlab-oss-smoke.sh`
- VPS (nicht committen): `/etc/nexifyai/gitlab-mcp.env`

## Suggested Sequence

1. Open Folder im Repo (sonst `workspaceId-empty-window`).
2. `cp .cursor/mcp.json.example .cursor/mcp.json` (lokal; enthält agentmemory+context7+gitlab-oss).
3. Token aus `/etc/nexifyai/gitlab-mcp.env` einsetzen — **nicht** in Chat/Commit.
4. Cursor MCP neu laden. Server-Name: **`gitlab-oss`** (nicht built-in `Gitlab`).
5. Smoke: `bash scripts/gitlab-oss-smoke.sh` (erwartet `GET /api/v4/user` → 200 mit PAT).
6. Native `/api/v4/mcp` kann 403 sein (Duo/OAuth) — Community-Server ist Soll.

## Pitfalls

- API-URL ohne `/api/v4` → Fehler.
- Built-in Cursor `Gitlab` = SaaS/OAuth → für OSS ignorieren.
- PAT nie in Issues/PRs.
