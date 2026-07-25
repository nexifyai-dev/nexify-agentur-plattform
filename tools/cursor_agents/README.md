# Cursor Cloud Agents API – Client (v1)

Abhängigkeitsfreier Python-Client (nur Stdlib) für die [Cursor Cloud Agents API v1](https://cursor.com/docs)
als Grundlage für programmatische Agenten-Orchestrierung.

## Auth
API-Key als Umgebungsvariable setzen (User-Key oder Service-Account-Key aus
Cursor Dashboard → API-Schlüssel). **Niemals** den Key committen.

```bash
export CURSOR_API_KEY="..."   # besser: als Secret injizieren
```

Auth-Modus: `basic` (Default, wie die `-u KEY:`-curl-Beispiele) oder `bearer`.

## CLI

```bash
python3 client.py me
python3 client.py models
python3 client.py list-agents --limit 20
python3 client.py get-agent bc-...
python3 client.py list-runs bc-... --limit 20
python3 client.py get-run bc-... run-...
# Agent erstellen (bewusst explizit – kein Auto-Launch):
python3 client.py create-agent "Add a README" --repo https://github.com/org/repo --ref main --auto-pr
```

## Als Bibliothek

```python
from client import CursorAgentsClient
c = CursorAgentsClient()                      # liest CURSOR_API_KEY
agents = c.list_agents(limit=10)
for ev in c.stream_run("bc-...", "run-..."):  # SSE-Stream (status/assistant/tool_call/result/done)
    print(ev["event"], ev.get("data"))
```

## Abgedeckte Endpunkte
Agenten (create/list/get/archive/unarchive/delete), Runs (create/list/get/cancel/usage),
SSE-Stream (`stream_run`), Artefakte (list/download), Metadaten (`me`/`models`/`repositories`).

## Sicherheit / Betrieb
- **Kein Auto-Launch:** `create_agent` startet Agenten nur bei explizitem Aufruf
  (Runaway-/Budget-Schutz; passt zum §12-Circuit-Breaker).
- Fehler werden als `CursorAgentsError` mit `status`/`code`/`message` geworfen.
- Ratenlimits beachten (v.a. `/v1/repositories`: 1/Min, 30/Std).

## Tests
```bash
python3 -m unittest test_client -v   # 9 Tests, gemockt, kein echter Call
```
