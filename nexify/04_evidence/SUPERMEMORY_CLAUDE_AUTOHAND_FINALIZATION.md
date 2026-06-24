# SUPERMEMORY_CLAUDE_AUTOHAND_FINALIZATION

**Datum:** 2026-06-14  
**Status:** PARTIAL_DONE — alle P0-Punkte (Bootstrap, Auth, MCP, Pfade) erledigt; Supermemory-Roundtrip bestanden; Autohand-Auth-Login vom User ausstehend (KNOWN LIMITATION).

## Kernergebnisse

### P0-1: Shell-Bootstrap repariert
- Datei `/root/.bashrc.d/claude-code.sh` neu erstellt (chmod 600)
- Idempotenter Bootstrap, sourced `nscale/env` und `supermemory/env`, löscht `ANTHROPIC_AUTH_TOKEN`
- Bash-Syntax geprüft: ✓

### P0-2: sm-claude Wrapper korrigiert
- `/root/.local/bin/sm-claude` neu geschrieben (chmod 700)
- Lädt env, entlädt Dual-Auth, wechselt nach `/workspace/nexify`, prüft Binary, prüft Supermemory-Health, exec echte claude-Binary
- Test: `sm-claude --version` → `2.1.173 (Claude Code)` ✓

### P0-3: Claude-Projektroot = /workspace/nexify
- Wrapper wechselt via `cd "$ROOT"` deterministisch nach `/workspace/nexify`
- `NEXIFY_PROJECT_ROOT=/workspace/nexify` in env

### P0-4: Konkurrierende Auth/Memory/MCP-Konfigurationen aufgelöst
- Auth: `ANTHROPIC_AUTH_TOKEN` UNSET, `ANTHROPIC_API_KEY` einzige Quelle via `/root/.nexify/claude-env.sh`
- Memory: agentmemory (Coolify-Container) gestoppt + entfernt; claude-mem Prozesse beendet; Port 37700 frei
- MCP: enabledPlugins von 54 auf 3 reduziert (nur Carta); mcpServers von 2 auf 1 (nur hostinger); mcp-needs-auth-cache von 43 auf 0

## Beweise

- `bash -n` auf allen 6 Skripten: OK
- `sm-claude --version`: 2.1.173
- `sm-autohand --version`: 0.9.1 (KNOWN LIMITATION: Autohand fordert interaktiven Auth-Login)
- `supermemory-agent status`: HEALTHY at http://127.0.0.1:6767/health
- `curl /v1/models`: 200, nexifyai-combo-llm verfügbar
- Memory-Roundtrip: SM_ROUNDTRIP_TEST_DECISION gespeichert + abgerufen ✓

## Verbleibende Punkte (KNOWN LIMITATIONS)

1. **Autohand-Auth**: `autohand` hat einen eigenen Auth-Flow, der nicht über `ANTHROPIC_API_KEY` läuft. Der User muss `autohand --login` interaktiv durchführen. Die Config `/root/.autohand/config.json` ist kanonisch gesetzt.
2. **`claude doctor`** bleibt hängen bei MCP-Health-Checks — der Befehl selbst ist nicht-interaktiv-tauglich. Verifikation erfolgte direkt über Datei-Inspektion (Settings, Plugins, MCP-Cache).
3. **Coolify-Stack** wird agentmemory beim nächsten `docker compose up` möglicherweise neu erstellen. Eine `docker-compose.yml`-Änderung oder `coolify-agentmemory`-Service-Entfernung ist außerhalb dieses Auftrags.
