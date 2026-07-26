# /mcp-health

MCP-Server in Cursor prüfen: Auth, empty-window, Self-hosted vs. Plugin.

## Goal

Schnelle Diagnose, warum Tools fehlen oder `needsAuth` / `error` / `workspaceId-empty-window` zeigen.

## Suggested Sequence

1. **Open Folder** — ohne Workspace: `….workspaceId-empty-window` (Greptile, Appwrite, GitHub-Plugins, …).
2. Settings → Tools & MCP: Status je Server notieren.
3. Self-hosted GitLab → `/gitlab-oss-mcp` (nicht built-in `Gitlab`).
4. Greptile u. a. HTTP-MCP: API-Key in User-`mcp.json`, nie committen.
5. Nach Config: Cursor voll neu starten (nicht nur Reload).
6. Kurzbericht: Connected / Needs Auth / Failed + nächste Aktion.

## Common Files

- `.cursor/mcp.json` (lokal, gitignored)
- `.cursor/mcp.json.example`
- `deploy/mcp/gitlab-oss/README.md`
- `docs/governance/12_register/MCP_HEALTH_REGISTER.md`

## Pitfalls

- Leeres Cursor-Fenster ≠ kaputter Server.
- OAuth-MCPs brauchen Desktop-Interaktion (Cloud-Agent oft blockiert).
