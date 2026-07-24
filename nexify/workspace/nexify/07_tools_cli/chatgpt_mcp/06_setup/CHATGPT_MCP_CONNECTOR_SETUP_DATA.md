# ChatGPT MCP Connector — Setup Data für Pascal

> Stand: 2026-06-12
> Status: NOCH NICHT LIVE — Vorbereitungsdaten

## Server-Konfiguration

| Feld | Wert |
|---|---|
| MCP Server URL | `https://mcp.nexifyai.cloud/mcp` (geplant) |
| Transport | `streamable_http` (Streaming HTTP via SSE) |
| Auth Mode | Cloudflare Access (OIDC) + Bearer Token |
| Raw Shell Exposed | `false` |
| Public Unauthenticated | `false` |

## Tools (geplant)

### Read-Only (kein Approval)

| Tool | Beschreibung |
|---|---|
| `get_status` | MCP-Server-Status, System-Health |
| `list_open_blockers` | Aktuelle P0-Blocker aus Kanban |
| `read_latest_evidence` | Letzten Evidence-Report lesen |
| `read_task_status` | Status eines Claude Code Tasks |

### Write (Gate-pflichtig)

| Tool | Beschreibung |
|---|---|
| `create_claude_task` | Neuen Task an Claude Code senden |
| `continue_claude_task` | Bestehenden Task fortsetzen |
| `approve_gate_package` | Approval für blockierte Aktion geben |
| `sync_brain_agentmemory` | Sync zwischen Brain und agentmemory auslösen |

## Nächste Schritte

1. MCP-Server lokal bauen und testen (`get_status`, `create_dry_run_task`)
2. Per OpenAI API Playground / MCP Inspector testen
3. ChatGPT Developer Mode: Connector registrieren
4. Test-Chat: `What is your status?` → erwartet JSON-Response
5. Erst danach Write-Tools freigeben

## Sicherheit

- KEIN raw_shell-Tool
- KEIN sudo
- KEIN git push ohne Gate
- KEIN Deployment ohne Approval
- KEINE Secret-Ausgabe
- Jede Write-Aktion wird geloggt und in Brain gespeichert
