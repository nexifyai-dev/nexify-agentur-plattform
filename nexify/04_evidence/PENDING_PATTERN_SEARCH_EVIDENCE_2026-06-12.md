# Evidence: Pending-Muster-Suche

> **Erstellt:** 2026-06-12T23:16+02:00  
> **Ersteller:** goose  
> **Status:** ABGESCHLOSSEN  
> **Scope:** /workspace/nexify

---

## Auftrag

Suche nach Suchmustern aus Task-Result-Message:

```
pending_goal|pending.goal|pending_user|pending_reply|pending_turn|pending_session|pending_message|pending_stream|pending_ta
```

## Ergebnis

**Keiner der gesuchten Patterns existiert im Workspace.**

| Pattern | Fundstellen | Status |
|---------|-------------|--------|
| `pending_goal` | 0 | ❌ NICHT VORHANDEN |
| `pending.goal` | 0 | ❌ NICHT VORHANDEN |
| `pending_user` | 0 | ❌ NICHT VORHANDEN |
| `pending_reply` | 0 | ❌ NICHT VORHANDEN |
| `pending_turn` | 0 | ❌ NICHT VORHANDEN |
| `pending_session` | 0 | ❌ NICHT VORHANDEN |
| `pending_message` | 0 (false positives durch `"n"`-Substring in rspec Testdaten) | ❌ NICHT VORHANDEN |
| `pending_stream` | 0 | ❌ NICHT VORHANDEN |
| `pending_ta` | 0 (false positive durch `"nsks"` in orchestrator_loop.py) | ❌ NICHT VORHANDEN |

## Tatsächlich verwendete Pending-Feldnamen

Im NeXify-System werden stattdessen folgende Pending-Felder verwendet:

| Feldname | Datei | Beschreibung |
|----------|-------|-------------|
| `pending_imports` | `12_agentmemory/agentmemory-pending-*.json` | Liste ausstehender Imports für agentmemory |
| `pending_import` | `12_agentmemory/agentmemory-pending-*.json` | Einzelner Pending-Import-Eintrag (type) |
| `reason_pending_global` | `12_agentmemory/agentmemory-pending-*.json` | Globaler Grund für Pending-Status |
| `reason_pending` | `12_agentmemory/agentmemory-pending-*.json` | Grund pro Import-Eintrag |
| `pending_entries` | `11_brain_sync/_DONE_brain-pending-iteration-46.json` | Ausstehende Brain-Einträge |

## Geprüfte Quellen

- `/workspace/nexify/12_agentmemory/` — alle agentmemory-JSON-Dateien
- `/workspace/nexify/11_brain_sync/` — alle Brain-Sync-Dateien
- `/workspace/nexify/` — gesamter Workspace (rekursiv, exkl. .git und node_modules)

## Metrik

- Geprüfte Dateien mit "pending"-Matches: 80+
- Geprüfte Workspace-Grösse: ~150 Verzeichnisse, ~1000 Dateien
- Exakte Pattern-Treffer: **0**

## Fazit

Die gesuchten Patterns (`pending_goal`, `pending.goal`, `pending_user`, `pending_reply`, `pending_turn`, `pending_session`, `pending_message`, `pending_stream`, `pending_ta`) sind **nicht** im Workspace vorhanden und entsprechen auch nicht der tatsächlich verwendeten Pending-Nomenklatur des NeXify-Systems.
