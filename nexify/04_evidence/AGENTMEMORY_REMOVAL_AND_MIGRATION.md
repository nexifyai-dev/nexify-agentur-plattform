# AGENTMEMORY_REMOVAL_AND_MIGRATION

**Datum:** 2026-06-14

## Inventarisierung

agentmemory lief als:

1. **Systemd-Service**: `/etc/systemd/system/agentmemory.service` (enabled, active 2+ Tage)
2. **Docker-Container**: `coolify-agentmemory-1` (Image `coolify-agentmemory`, Port 3111, RestartPolicy `unless-stopped`)
3. **Sub-Prozesse**: `tini`, `node`, `iii-engine`
4. **Helper-Watcher**: Python-Skript, das Goose-Tasks überwacht
5. **Daten**: `/root/.agentmemory/` (env, standalone.json, preferences.json, engine-state.json)
6. **Pending-Files**: `/workspace/nexify/12_agentmemory/agentmemory-pending-*.json` (9 Items)

## Migration

- 9 Items aus 3 pending-Dateien in `/root/.supermemory/memories.jsonl` mit Namespace `agentmemory-legacy-migration` importiert
- SHA256-Hashes für jeden Eintrag berechnet und verifiziert (roundtrip)
- Migrations-Log: `/root/.supermemory/agentmemory_migration.json`

```json
{
  "ts": "2026-06-14T11:30:00Z",
  "namespace": "agentmemory-legacy-migration",
  "migrated": 9,
  "skipped": 0
}
```

## Stilllegung

- `systemctl stop agentmemory.service` (Timeout → killed)
- `systemctl disable agentmemory.service` (Symlink entfernt)
- `docker stop coolify-agentmemory-1` + `docker rm coolify-agentmemory-1`
- Sub-Prozesse manuell beendet (tini, node, iii-engine, goose-watcher)
- `agentmemory` MCP-Eintrag aus `/root/.claude/settings.json` entfernt

## Archivierung

- `/workspace/nexify/99_archiv/legacy_agentmemory/`
  - `12_agentmemory_legacy/` (komplettes Verzeichnis)
  - `root_agentmemory_data/` (`/root/.agentmemory/`)
  - `agentmemory.service.systemd`

## Pflichtstatus

```
AGENTMEMORY_ACTIVE = false
AGENTMEMORY_MCP_REGISTERED = false
AGENTMEMORY_HOOKS_ACTIVE = false
AGENTMEMORY_SERVICES_RUNNING = false
AGENTMEMORY_DATA_MIGRATION = verified (9/9 items, SHA256 roundtrip)
```
