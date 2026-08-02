# FILE: /deploy/mcp/gitlab-oss/README.md
# NIR: 25.07.2026 08:59
# UPDATED: 25.07.2026 08:59
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Cursor MCP Setup für self-hosted GitLab OSS (nicht gitlab.com)
# WHY: Built-in Cursor `Gitlab` MCP zielt auf SaaS/OAuth; NeXify betreibt GitLab OSS lokal
# BEST-PRACTICE: `@zereight/mcp-gitlab` + PAT gegen `GITLAB_API_URL=…/api/v4`
# PITFALL: V-GL-01: Token niemals committen; V-GL-02: API-URL muss auf `/api/v4` enden
# DEPENDS: GitLab OSS `https://gitlab.nexifyai.cloud` (VPS `127.0.0.1:8922`), Node/npx
# DOCS-REF: https://github.com/zereight/gitlab-mcp/blob/main/docs/clients/cursor.md
# SESSION: cursor/gitlab-oss-mcp-9368

# GitLab OSS → Cursor MCP

## Ziel

Cursor spricht mit der **lokalen GitLab-OSS-Instanz** (`gitlab.nexifyai.cloud` / VPS `:8922`), nicht mit gitlab.com.

| Endpoint | Nutzung |
|----------|---------|
| `https://gitlab.nexifyai.cloud` | Public / Desktop / Cloud-Agent |
| `http://127.0.0.1:8922` | Nur auf dem VPS (Docker-Bind) |
| `…/api/v4` | REST für `@zereight/mcp-gitlab` |
| `…/api/v4/mcp` | Native GitLab HTTP-MCP (OAuth/Duo; auf OSS oft 403) |

## Empfohlener Server: `@zereight/mcp-gitlab`

Native GitLab MCP (`/api/v4/mcp`) braucht typischerweise Duo/OAuth und liefert auf dieser Instanz **403**. Für OSS nutzen wir den Community-Server mit Personal Access Token.

### 1. PAT auf dem VPS

Scopes mindestens: `api` (oder `read_api` für Read-Only).

Auf dem VPS liegt die Betriebsdatei (nicht im Repo):

```text
/etc/nexifyai/gitlab-mcp.env
```

Keys:

- `GITLAB_API_URL=https://gitlab.nexifyai.cloud/api/v4`
- `GITLAB_PERSONAL_ACCESS_TOKEN=glpat-…`
- `GITLAB_READ_ONLY_MODE=false`

Token rotieren (Rails, als root auf VPS):

```bash
docker exec -it gitlab gitlab-rails runner '
u = User.find_by_username("root")
PersonalAccessToken.where(user_id: u.id, name: "cursor-mcp-gitlab-oss").where(revoked: false).find_each(&:revoke!)
t = PersonalAccessToken.create!(
  user: u,
  name: "cursor-mcp-gitlab-oss",
  scopes: %w[api read_api read_repository write_repository],
  expires_at: 1.year.from_now
)
puts t.token
'
# Token in /etc/nexifyai/gitlab-mcp.env + credentials.env schreiben (chmod 600)
```

### 2. Cursor Desktop / Workspace

**Kanonisches Gesamt-Example** (agentmemory + context7 + gitlab-oss):

```bash
cp .cursor/mcp.json.example .cursor/mcp.json
# GITLAB_PERSONAL_ACCESS_TOKEN und AGENTMEMORY_SECRET lokal setzen
# Cursor neu laden / MCP restart
```

Nur GitLab-Ausschnitt (Legacy): `deploy/mcp/gitlab-oss/mcp.json.example`

Server-Name in Beispielen: **`gitlab-oss`** (bewusst getrennt vom built-in `Gitlab`).

### 3. Smoke-Check

```bash
set -a; source /etc/nexifyai/gitlab-mcp.env; set +a   # bzw. lokale Env
curl -sS -H "PRIVATE-TOKEN: $GITLAB_PERSONAL_ACCESS_TOKEN" \
  "$GITLAB_API_URL/user" | jq '{username, id}'
```

Erwartung: HTTP 200, User `root` (oder euer Admin).

## Was nicht committen

- `.cursor/mcp.json` mit echtem PAT
- `/etc/nexifyai/gitlab-mcp.env`
- `GITLAB_TOKEN` / `GITLAB_PERSONAL_ACCESS_TOKEN` in Issues/PRs

Nur `mcp.json.example` und diese Doku gehören ins Repo.

## Beziehung zu GitHub

- **GitHub** bleibt Primary für PRs/Issues der Cloud-Agenten.
- **GitLab OSS** ist Mirror + CI auf dem VPS (siehe `docs/operations/REPO-SYNC-STRATEGY.md`).
- MCP `gitlab-oss` steuert MRs/Pipelines/Repos auf dem Self-Hosted System.

## Codespace Schnellstart

Fuer diese Repo-Umgebung existiert ein lokaler Bootstrap mit Health-Check:

```bash
bash scripts/setup-codespace-mcp.sh
set -a; source .env.mcp.codespace; set +a
bash scripts/mcp-health-codespace.sh
```

Abdeckung:

- `.cursor/mcp.json` (agentmemory + context7 + gitlab-oss) — Cursor Agent / Cloud Agent
- Erreichbarkeit von context7, agentmemory und GitLab OSS API/UI
- OpenAI Codex: entfernt 2026-08-02 (kein `.codex/` mehr im Repo)
