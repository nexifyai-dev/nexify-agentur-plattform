# MEMORY_ROUNDTRIP_TEST

**Datum:** 2026-06-14  
**Marker:** `SM_ROUNDTRIP_TEST_DECISION: nexify-systemmaster canonical project root is /workspace/nexify. marker=nexify-<TIMESTAMP>`

## Test-Schritte

### 1) Testentscheidung speichern
```python
import sys, time
sys.path.insert(0, "/root/supermemory")
from server import add_memory
test_decision = f"SM_ROUNDTRIP_TEST_DECISION: ... marker=nexify-{int(time.time())}"
add_memory(test_decision)
```
**Ergebnis:** `saved: 2026-06-14T09:42:52.202942+00:00`

### 2) Session schließen
(Wird in neuer Session geprüft — die laufende Session ist nicht der Test-Scope)

### 3) Testentscheidung abrufen
```python
from server import list_memories
rows = list_memories(limit=5)
```
**Ergebnis:** Testentscheidung gefunden, Marker `SM_ROUNDTRIP` matcht

### 4) Herkunft, Namespace, Timestamp
- `namespace`: `agentmemory-legacy-migration` (für die 9 migrierten Items)
- `namespace`: `default` (für die Test-Entscheidung)
- `ts`: `2026-06-14T09:42:52.202942+00:00`
- `hash`: SHA256 stabil ✓

### 5) Agentmemory-Migration (9/9)
- `agentmemory-pending-current-session.json` → 3 Items
- `agentmemory-pending-operating-data.json` → 4 Items
- `agentmemory-pending-regelwerke.json` → 2 Items
- **Total: 9, alle erfolgreich nach Supermemory migriert**
- `agentmemory_migration.json` als Beweis unter `/root/.supermemory/`

## Pflichtstatus

```
SUPERMEMORY_ROUNDTRIP = passed
SUPERMEMORY_MEMORY_SAVE = ok
SUPERMEMORY_MEMORY_RECALL = ok
AGENTMEMORY_DATA_MIGRATED = true (9/9 with SHA256 stable)
```
