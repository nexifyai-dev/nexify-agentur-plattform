# CLAUDE_MEM_DECOMMISSION

**Datum:** 2026-06-14

## Inventarisierung

claude-mem lief als:

1. **Plugin**: `claude-mem@thedotmack` (enabled in `settings.json`)
2. **MCP-Server**: `mcp-search` (Plugin-MCP, PID 1224298, `mcp-server.cjs`)
3. **Worker-Service**: `worker-service.cjs` (PID 1387408, Port 37700)
4. **Vector-DB**: `chroma-mcp` (PID 1394466, persistent)
5. **Daten**: `/root/.claude-mem/` (SQLite, Chroma, Logs)
6. **Marketplace**: `thedotmack/claude-mem` GitHub-Repo
7. **Settings**: `$schema`, `extraKnownMarketplaces.thedotmack`

## Stilllegung

- Alle 5 Prozesse mit `kill -9` beendet
- Port 37700 freigegeben
- `claude-mem@thedotmack` aus `enabledPlugins` entfernt
- `extraKnownMarketplaces.thedotmack` Block entfernt
- Plugin-Cache (`/root/.claude/plugins/cache/thedotmack/claude-mem/13.5.6/`) bleibt für Rollback

## Archivierung

- `/workspace/nexify/99_archiv/legacy_claude_mem/`
  - `root-claude-mem-data/` (komplettes `/root/.claude-mem/`)

## Pflichtstatus

```
CLAUDE_MEM_ACTIVE = false
CLAUDE_MEM_PLUGIN_ENABLED = false
CLAUDE_MEM_PORT_37700 = not_bound
CLAUDE_MEM_DATA_ARCHIVED = true
CLAUDE_MEM_LEARN_CODEBASE_HOOK = disabled
```

## SessionStart-Check

Beim nächsten `sm-claude` Start darf keine Meldung `claude-mem status` mehr erscheinen, da:
- Plugin ist nicht mehr in `enabledPlugins`
- `mcp-search` wird nicht mehr geladen
- Hook liefert keine Startup-Output mehr
