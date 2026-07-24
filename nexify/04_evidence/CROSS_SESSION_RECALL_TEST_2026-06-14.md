# CROSS_SESSION_RECALL_TEST (Vorbereitung)

**Datum:** 2026-06-14
**Bezug:** P0-Phase 3, Abschnitt 8 + 13 (Cross-Session-Recall-Beweis)
**Status:** 🟡 PREPARED — Test-Marker gespeichert, User-Aktion für Cross-Session-Verifikation erforderlich

---

## 1. Was wurde gemacht

In **Session A (aktuelle Session, 2026-06-14)** wurde ein eindeutiger Test-Record im Adapter gespeichert. Die Speicherung wurde sofort per Substring-Search verifiziert (intra-session passed).

### 1.1 Test-Marker
```text
Test-ID:                nexify-cross-session-marker-2026-06-14T11-33-00Z-marker-cs7x9p2a
Adapter-Record-ID:      1a6990599b86d6eb
SHA256(Test-ID):        bc539ac982c7be3cff7dd18407cb52b5e666f1a968dae636863846092157031f
Container:              nexify:capabilities:data-engineering
Decision (gespeichert): nexify-systemmaster phase 3 cross-session test marker
Verified at Berlin:     2026-06-14T11:33:00+02:00
```

### 1.2 Verifikations-Befund Session A
```bash
# Save
$ curl -X POST -H "Content-Type: application/json" -d '{...}' http://127.0.0.1:6768/v3/documents
# {"id":"1a6990599b86d6eb","status":"stored","containerTag":"nexify:capabilities:data-engineering",...}

# Search (gleiche Session)
$ curl -X POST -H "Content-Type: application/json" \
  -d '{"q":"nexify-cross-session-marker-2026-06-14T11-33-00Z-marker-cs7x9p2a","containerTag":"nexify:capabilities:data-engineering","limit":3}' \
  http://127.0.0.1:6768/v3/search
# {"results":[{"id":"1a6990599b86d6eb","content":"CROSS_SESSION_TEST_RECORD: ...",...}],"total":1}
```

## 2. Was Session B beweisen muss (User-Aktion)

### 2.1 Voraussetzungen
- Aktuelle Session A vollständig beendet (Ctrl+D oder `exit`)
- Frische Login-Shell auf `srv1243952` gestartet
- `sm-claude` (nicht `claude` direkt) startet interaktiv — bestätigt Phase-2-Block-A-Auth-Wrapper
- `supermemory@supermemoryai` v0.0.7 ist geladen (in `claude plugin list` sichtbar)
- Plugin-Config zeigt `baseUrl=http://127.0.0.1:6768` (Adapter läuft)
- REST-Adapter läuft auf `127.0.0.1:6768` (PID 1539662) — startet nicht automatisch neu, muss persistent sein

### 2.2 Test-Befehl (in Session B)
Im frischen `sm-claude`-Prompt:
```
Suche im Supermemory nach dem Cross-Session-Test-Marker
nexify-cross-session-marker-2026-06-14T11-33-00Z-marker-cs7x9p2a
und bestätige, dass die Quelle ausschließlich Supermemory ist
(nicht CLAUDE.md, nicht Shell-History, nicht agentmemory, nicht claude-mem).
```

### 2.3 Erwartete Antwort
- Plugin-Befehl `supermemory-search` (oder Skill `nexify-knowledge-data-engineer`) wird ausgeführt
- Test-Marker wird im Container `nexify:capabilities:data-engineering` gefunden
- SHA256 stimmt mit `bc539ac9...031f` überein
- Verifikations-Hinweis: "Quelle: Supermemory Local über 9Router-Adapter"

### 2.4 Akzeptanz
```text
SUPERMEMORY_NEW_SESSION_RECALL = passed
CROSS_SESSION_SOURCE = supermemory (ausschließlich)
PROJECT_ISOLATION = passed
NO_CLAUDE_MD_SOURCE = passed
NO_SHELL_HISTORY_SOURCE = passed
NO_AGENTMEMORY_SOURCE = passed
NO_CLAUDE_MEM_SOURCE = passed
```

### 2.5 Falls `sm-claude` /login verlangt
**Phase-2-Block-A-Auth-Wrapper ist kaputt.** Rollback: `cp 10_evidence/claude_startup/wrapper-fix-20260614T*/sm-claude.bak /root/.local/bin/sm-claude`. Diagnose in Block-A-Bericht nachschlagen.

### 2.6 Falls REST-Adapter nicht läuft
Diagnose: `ps aux | grep adapter.py` — wenn fehlt, neu starten:
```bash
cd /root/supermemory && nohup python3 adapter.py > /root/supermemory/adapter.log 2>&1 &
```
Hinweis: kein automatischer Restart eingerichtet (Phase-4-Investigationspunkt: systemd-Unit).

## 3. Bekannte Limitationen

- **Adapter hat keine Auto-Restart-Logik** — bei Server-Reboot startet er nicht automatisch
- **Embedding-basiertes semantisches Search** fehlt im Adapter — Cross-Session-Recall nutzt Substring-Match (ausreichend für exakte Test-IDs, nicht für semantische Queries)
- **Plugin-Hooks (SessionStart, Stop)** sind installiert, aber in der aktuellen Session A nicht aktiv (Hooks werden beim nächsten Session-Start initialisiert)
- **`openai/gpt-oss-120b` liefert 404** über 9Router — Plugin-Kommunikation läuft trotzdem über den Adapter, weil das Plugin die `/v3/...`-REST-Endpoints direkt aufruft, nicht über LLM-Inferenz

## 4. Status-Block (Section 20)

```text
PREPARED_TEST = yes
INTRA_SESSION_RECALL = passed
CROSS_SESSION_RECALL = pending_user_action
```

---

*Ende Cross-Session-Recall-Vorbereitung. Stand 2026-06-14, erstellt durch Claude Code Phase 3 Block A.*
