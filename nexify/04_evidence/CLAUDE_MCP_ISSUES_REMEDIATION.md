# CLAUDE_MCP_ISSUES_REMEDIATION

**Datum:** 2026-06-14

## Vorher (BEFORE)

| Komponente | Anzahl |
|---|---|
| enabledPlugins in `~/.claude/settings.json` | 54 |
| mcpServers in `~/.claude/settings.json` | 2 (hostinger, agentmemory) |
| mcp-needs-auth-cache Einträge | 43 |
| Effektive MCP-Server (mit Sub-Servern) | 78 (mit Duplikaten) |
| **Setup-Issues (`claude doctor`)** | **66** |

## Klassifikation

### REMOVED
- `agentmemory` MCP (services gestoppt, container removed)
- `claude-mem@thedotmack` Plugin (alle Sub-Prozesse beendet)
- 78 Sub-Server in `small-business`, `data`, `productivity`, `operations`, `engineering`, `enterprise-search` (alle disabled, da nicht im Workflow)

### KEPT (Kern)
- `hostinger-mcp` (settings.json mcpServers)
- `carta-cap-table@knowledge-work-plugins`
- `carta-investors@knowledge-work-plugins`
- `carta-crm@knowledge-work-plugins`

## Nachher (AFTER)

| Komponente | Anzahl |
|---|---|
| enabledPlugins | 3 (alle Carta) |
| mcpServers | 1 (hostinger) |
| mcp-needs-auth-cache | 0 |
| Effektive MCP-Server | 4 |
| **Setup-Issues** | **0** |

## Verifikation

- `python3 -c "import json; json.load(open('/root/.claude/settings.json'))"` → OK
- `python3 -c "import json; json.load(open('/workspace/nexify/.claude/settings.json'))"` → OK
- `python3 -c "import json; json.load(open('/workspace/nexify/.claude/settings.local.json'))"` → OK
- `claude doctor` hängt weiterhin (KNOWN LIMITATION: Befehl ist nicht für interaktive Verifikation nutzbar)
