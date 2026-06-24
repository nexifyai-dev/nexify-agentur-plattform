# Evidence: Vollständige Pending-Muster-Suche (Systemweit)

> **Erstellt:** 2026-06-13T00:27+02:00  
> **Ersteller:** goose  
> **Status:** ABGESCHLOSSEN  
> **Scope:** Gesamtes Dateisystem (`/root/`), exkl. node_modules, .npm, .git  

---

## Auftrag

Suche nach exakten Patterns aus Task-Result:

```
pending_goal|pending.goal|pending_user|pending_reply|
pending_turn|pending_session|pending_message|
pending_stream|pending_ta
```

(Interpretation von `pending_ta` als `pending_task`)

---

## Ergebnisse pro Pattern

### 1. `pending_goal` / `PENDING_GOAL` — ✅ GEFUNDEN

**Quellcode (Hermes WebUI API):**

| Datei | Zeile | Verwendung |
|-------|-------|------------|
| `api/config.py` | 4988 | `PENDING_GOAL_CONTINUATION: set = set()` — globale Definition |
| `api/streaming.py` | 7092 | `PENDING_GOAL_CONTINUATION.add(session_id)` — setzen bei goal_continue |
| `api/streaming.py` | 7393 | Kommentar: "do NOT discard PENDING_GOAL_CONTINUATION here" |
| `api/routes.py` | 11405-11407 | `session_id in PENDING_GOAL_CONTINUATION` + `.discard()` — atomare Konsumption |

**Tests:**
- `tests/test_stage326_pending_goal_continuation_race.py` (5 Tests)
- `tests/test_issue_1932_goal_hook_unrelated_turns.py` (3 Tests)

**Zweck:** Race-Condition-Fix (#1951). Set-Marker, der eine Session als "wartend auf goal_continuation-Turn" kennzeichnet. Wird in `streaming.py` gesetzt und in `routes.py` atomar konsumiert (discard on read).

---

### 2. `pending_user` (`pending_user_message`) — ✅ GEFUNDEN

**Dies ist das häufigste Pending-Feld im gesamten System.**

**Definition (Session Model):**
- `api/models.py:557,604` — `pending_user_message: str = None` im Session-Init
- `api/models.py:558,605` — `pending_attachments: list = []`
- `api/models.py:559,606` — `pending_started_at: float/int = None`

**Verwendet in:** `models.py` (40+ Stellen), `routes.py` (30+ Stellen), `streaming.py` (25+ Stellen), `session_recovery.py`, `gateway_chat.py`, `webui_session_db.py`

**Frontend (JavaScript):**
- `static/boot.js` — Session-Status-Prüfung, Reattach-Logik
- `static/sessions.js` — Optimistische Updates, Server-Abgleich
- `static/messages.js` — Eingabe-UI-Logik
- `static/ui.js` — Anzeige "pending" Text
- `static/panels.js` — Panel-Status
- `static/commands.js` — Command-Handling

**Zweck:** Temporäre Speicherung der User-Eingabe während des Streamings. Wird vor dem Streaming gesetzt und nach dem Materialisieren als Turn gelöscht. Kritisch für Cancel/Recovery.

**Zentrale Funktionen:**
- `_materialize_pending_user_turn_before_error()` — Fehler-Recovery
- `_append_recovered_pending_turn()` — Recovery-Turn-Erzeugung
- `_clear_stale_stream_state()` — Stale-Cleanup

---

### 3. `pending_reply` / `pending.reply` — ❌ NICHT VORHANDEN

Keine einzige Fundstelle im gesamten System.

---

### 4. `pending_turn` — ✅ GEFUNDEN

| Datei | Fundstelle | Verwendung |
|-------|-----------|------------|
| `api/models.py:375` | `def _append_recovered_pending_turn()` | Recovery-Funktion |
| `api/session_recovery.py:522` | `"turn_journal_pending_turn"` | Audit/Journal-Eintrag |
| `api/session_recovery.py:524` | `"audit_only_pending_turn_journal"` | Audit-Empfehlung |

**Zweck:** Recovery-Mechanismus: Wenn ein User-Turn während des Streamings verloren geht (Cancel, Error), wird ein Pending-Turn-Journal-Eintrag erzeugt.

---

### 5. `pending_session` / `pending.session` — ✅ GEFUNDEN

**Backend:**
- `tests/` — `_make_pending_session()` — Test-Helper (mehrere Testdateien)

**Frontend:**
- `static/commands.js:937` — `pending.sessionId` — Session-Identitäts-Prüfung
- `static/messages.js:573` — `_pending.sessionId` — Nachrichten-Panel-Logik

**Zweck:** Frontend-seitiger Pending-Session-Indikator, der anzeigt, ob eine Session noch auf Antwort wartet (streaming).

---

### 6. `pending_message` — ✅ GEFUNDEN

**Hermes WebUI (Backend):**
- `pending_user_message` — siehe Punkt 2 (das dominante Muster)
- `api/config.py:368` — Kommentar zur pending_user_message/runtime-Logik

**Extern (Claude Code Plugin — `thedotmack`):**
- SQLite-Tabelle `pending_messages` — Datenbank-Persistenz für ausstehende Nachrichten
- `CREATE TABLE pending_messages (...)` — volles Schema mit Indizes
- Spalten: `session_db_id`, `content_session_id`, `status`, `failed_at_epoch`, `agent_type`
- Verwendet in: `SessionStore.ts`, `SessionMessageBuffer.ts`, `GeneratorExitHandler.ts`, `CleanupV12_4_3.ts`, `WorktreeAdoption.ts`
- Cleanup-Skripte: `clear-pending-queue.ts`, `fix-corrupted-timestamps.ts`

---

### 7. `pending_stream` — ✅ GEFUNDEN

- `api/routes.py:1262` — `"_clear_stale_stream_state: failed to repair stale pending stream %s"` — Log-Message
- `tests/` — `"fresh-pending-stream"` — Test-Stream-ID
- `tests/` — Kommentar: "immediately close all pending streams"

**Zweck:** Stale-Stream-Detection und -Reparatur für hängengebliebene Stream-Sessions.

---

### 8. `pending_task` / `pending_ta` — ✅ GEFUNDEN

- `nexifyai-platform/services/api/scripts/orchestrator_loop.py:41` — `"pending_tasks": []` — Leeres Array im Orchestrator-Status

---

## Zusammenfassung

| Pattern | Status | System | Fundstellen |
|---------|--------|--------|-------------|
| `pending_goal` / `PENDING_GOAL` | ✅ Gefunden | Hermes WebUI API | 8 Code + 5 Testdateien |
| `pending_user` | ✅ Gefunden | Hermes WebUI (API + Frontend) | ~100+ Stellen (Kernfeld) |
| `pending_reply` | ❌ Fehlt | — | 0 |
| `pending_turn` | ✅ Gefunden | Hermes WebUI API | 3+ Stellen |
| `pending_session` | ✅ Gefunden | Hermes WebUI (Frontend + Tests) | 5+ Stellen |
| `pending_message` | ✅ Gefunden | Hermes WebUI + Claude Plugin | 30+ Stellen (DB-Tabelle) |
| `pending_stream` | ✅ Gefunden | Hermes WebUI API | 3+ Stellen |
| `pending_task` | ✅ Gefunden | NexifyAI Platform | 1 Stelle |

**Dominantes Pending-Modell:**
Das Hermes WebUI-System verwendet ein zentrales `Session`-Objekt mit drei Pending-Feldern:
- `pending_user_message: str` — die vom User eingegebene, noch nicht streamende Nachricht
- `pending_attachments: list` — begleitende Dateianhänge
- `pending_started_at: float/int` — Zeitstempel des Streaming-Starts

Dazu kommen globale Sets/Stores:
- `PENDING_GOAL_CONTINUATION: set[str]` — Goal-Continue-Race-Guard
- `pending_messages` (SQLite) — Persistenz-Layer (externes Plugin)

## Offene Frage

Das Pattern `pending_reply` wurde **gar nicht** gefunden. Dieses existiert weder im Quellcode, noch in Konfigurationen, Tests oder Datenbanken. Möglicherweise handelt es sich um ein antizipiertes/zukünftiges Feld oder um einen Tippfehler.
