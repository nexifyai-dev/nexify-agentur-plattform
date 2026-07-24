# Evidence: Pending-Pattern-Suche — Zweite Verifikation (2026-06-13 07:55)

> **Erstellt:** 2026-06-13T07:55+02:00
> **Erstellt von:** goose (Session 2026-06-13 07:55)
> **Status:** BESTÄTIGT — deckungsgleich mit vorheriger Evidence
> **Basiert auf:** Task-Result-Eingang + Frische-Verifikation #2

---

## Auftrag

Task-Result: Suche nach `pending_goal|pending.goal|pending_user|pending_reply|pending_turn|pending_session|pending_message|pending_stream|pending_ta`

## Verifikationsmethode

1. **Brain-Query** → 5 relevante Einträge gefunden (darunter Evidence vom 13.06.)
2. **Frische rg-Suche** über `/root/hermes-webui-nexify/`, `/root/nexifyai-platform/`, `/root/agentmemory/`
3. **Ausschluss** von `node_modules`, `.git`, `.npm`, `__pycache__`, `.bin`/`.db`/`.sqlite`-Binärdateien
4. **Cross-Reference mit bestehender Evidence** aus dem 13.06.

## Ergebnisse (Verifikation)

| Pattern | 12.06. Evidence (/workspace) | 13.06. Evidence (systemweit) | 13.06.07:55 Verifikation | Änderung |
|---------|------|------|------|----------|
| `pending_goal` / `PENDING_GOAL` | ❌ nicht in Workspace | ✅ 7 Dateien in Hermes API + Tests | ✅ Bestätigt: config.py:4988, streaming.py:7092/7393, routes.py:1102/11403-11407, 2 Testdateien | Keine |
| `pending.goal` | ❌ | ❌ Keine Source-Treffer (nur agentmemory DB-Binaries) | ❌ Bestätigt | Keine |
| `pending_user` / `pending_user_message` | ❌ nicht in Workspace | ✅ ~100+ Stellen (API, Frontend, Tests) | ✅ Bestätigt: 19 API/Frontend + 40+ Test-Dateien | Keine |
| `pending_reply` | ❌ | ❌ Keine Source-Treffer | ❌ Bestätigt | Keine |
| `pending_turn` | ❌ | ✅ 3+ Code-Stellen (models.py, session_recovery.py) + Tests | ✅ Bestätigt: 3 Code-Stellen + 4 Test-Dateien | Keine |
| `pending_session` / `pending.sessionId` | ❌ | ✅ Frontend JS + Tests | ✅ Bestätigt: commands.js, messages.js (×2), 4 Test-Dateien | Keine |
| `pending_message` / `pending_messages` | ❌ | ✅ 30+ Stellen (Tests + Session-Modell) | ✅ Bestätigt: Tests + pending_user_message (das dominante Feld) | Keine |
| `pending_stream` | ❌ | ✅ 1 Datei (test_katex_streaming.py) | ✅ Bestätigt: test_katex_streaming.py + Log-Referenz in routes.py:1262 (stale stream repair) | Keine |
| `pending_task` / `pending_ta` | ❌ (nur false positive) | ✅ 1 Code (orchestrator_loop.py:41) + Tests | ✅ Bestätigt: orchestrator_loop.py:41 + test_settings_navigation tests | Keine |

## Detail: Schlüsselfundstellen (Quellcode, keine Binaries)

### `pending_goal` / `PENDING_GOAL_CONTINUATION`
- `/root/hermes-webui-nexify/api/config.py:4988` — Globale Set-Definition
- `/root/hermes-webui-nexify/api/streaming.py:7092` — `.add(session_id)` bei goal_continue
- `/root/hermes-webui-nexify/api/streaming.py:7393` — Kommentar: kein discard hier
- `/root/hermes-webui-nexify/api/routes.py:11405-11407` — Atomare discard-Prüfung

### `pending_user_message`
- Definition: `/root/hermes-webui-nexify/api/models.py:557-559,604-606`
- Kernfeld in: models.py (32x), routes.py (21x), streaming.py (20x)
- Frontend: boot.js, sessions.js, messages.js, ui.js, panels.js, commands.js

### `pending_turn`
- `/root/hermes-webui-nexify/api/models.py:375` — `_append_recovered_pending_turn()`
- `/root/hermes-webui-nexify/api/session_recovery.py:522-524` — Journal-Einträge

### `pending.sessionId` (Frontend)
- `/root/hermes-webui-nexify/static/commands.js:937` — `!pending.sessionId`
- `/root/hermes-webui-nexify/static/messages.js:573` — `_pending.sessionId`

### `pending_task`
- `/root/nexifyai-platform/services/api/scripts/orchestrator_loop.py:41` — `"pending_tasks": []`

## Offene Frage: `pending_reply`

**`pending_reply`** existiert an keiner Stelle im gesamten System. Auch die Variante `pending.reply` wurde nicht gefunden.

Mögliche Erklärungen:
1. **Noch nicht implementiertes/zukünftiges Feature** — kein Code, kein Kommentar, kein Test
2. **Tippfehler** im originären Task-Result (gemeint war evtl. `pending_user_message`?)
3. **Externes Plugin/Subsystem** — nicht im Scan-Pfad `/root/` enthalten

## Fazit

Keine Änderungen seit der Evidence vom 13.06. 00:27. Alle Pattern-Ergebnisse sind deckungsgleich.

