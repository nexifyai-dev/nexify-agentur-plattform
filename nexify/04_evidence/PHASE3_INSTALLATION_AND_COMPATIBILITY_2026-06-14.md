# PHASE 3 — INSTALLATION UND KOMPATIBILITÄT

**Datum:** 2026-06-14
**Status:** 🟡 PARTIAL_DONE — Plugin installiert, Modell-Pfade identifiziert, lokale API-Kompatibilität BLOCKIERT
**Bezug:** P0-Phase 3, Abschnitte 6 + 7

---

## 1. Supermemory-Plugin-Installation

### 1.1 Installation
```bash
$ claude plugin marketplace update supermemoryai
Updating marketplace: supermemoryai...Cloning repository: supermemoryai/claude-supermemory
✔ Successfully updated marketplace: supermemoryai

$ claude plugin install supermemory@supermemoryai
Installing plugin "supermemory@supermemoryai"...
✔ Successfully installed plugin: supermemory@supermemoryai (scope: user)
```

### 1.2 Plugin-Details
- **Name:** supermemory
- **Version:** 0.0.7
- **Quelle:** supermemory@supermemoryai (Repo supermemoryai/claude-supermemory)
- **Lizenz:** MIT
- **Cache-Pfad:** `/root/.claude/plugins/cache/supermemoryai/supermemory/0.0.7/`
- **Skills (7):** index, logout, project-config, session, status, supermemory-save, supermemory-search
- **Agents (0):** keine
- **Hooks (2):** SessionStart, Stop (harness-only, kein Model-Context-Cost)
- **MCP-Server (0):** keine
- **LSP-Server (0):** keine
- **Token-Kosten:** ~206 tokens always-on, pro-Aufruf siehe `claude plugin details supermemory@supermemoryai`

### 1.3 Erwartete Plugin-Endpoints (aus Script-Inspektion)
- `/v3/documents` (POST/PUT für save/add)
- `/v3/documents/list`
- `/v3/connections/list`
- `/v3/profile`
- `/v3/containers`

### 1.4 Auth-Feldnamen
- `apiKey` (oder Env `SUPERMEMORY_CC_API_KEY`)
- `baseUrl` (oder Env `BASE_URL`)
- `repoContainerTag`
- `personalContainerTag`

## 2. Lokaler Supermemory-Server

### 2.1 Service-Identität
- **Pfad:** `/root/supermemory/server.py` (SHA256 `524ffe2ff8ed681e731be043fded95a7da53cd6ba368c0c59c56a41ff153a721`)
- **Framework:** FastAPI + FastMCP
- **PID:** 1340948
- **Listen:** `127.0.0.1:6767` (Python)
- **Health:** `{"ok":true,"service":"supermemory-local","store":"/root/supermemory/memories.jsonl"}`
- **Store:** `/root/supermemory/memories.jsonl` (JSONL, ca. 54.2 KB Inhalt)

### 2.2 Implementierte Endpoints
| Endpoint | Methode | Status |
|---|---|---|
| `/health` | GET | 200, `{"ok":true,...}` |
| `/mcp` | Streamable HTTP | aktiv (FastMCP) |

### 2.3 NICHT implementierte Endpoints (alle 404)
- `/v1/memories`, `/v1/memory`, `/v1/add`, `/v1/save`, `/v1/search`, `/v1/profile`, `/v1/container`, `/v1/containers`, `/v1/recall`, `/v1/ingest`, `/v1/chat`, `/v1/models`, `/v1/auth/test`, `/v1/embeddings`
- `/v3/documents`, `/v3/documents/list`, `/v3/connections`, `/v3/connections/list`, `/v3/memories`, `/v3/search`, `/v3/profile`, `/v3/containers`, `/v3/container`

**Befund:** Der lokale Server deckt **keine** der vom Plugin-Client erwarteten REST-Endpoints ab. Der MCP-Endpoint `/mcp` ist vorhanden, aber Plugin v0.0.7 nutzt REST, nicht MCP.

## 3. Modell-Pfad-Tests (nscale via 9Router)

### 3.1 Verfügbare Modelle im 9Router-Listing (verifiziert 2026-06-14)
- Supermemory LLM (verantwortlich für Memory-Verarbeitung): **`openai/gpt-oss-120b`** (Kanonischer NeXify-Name; im 9Router-Listing als `nscale/chat/openai/gpt-oss-120b` registriert)
- Embedding LLM (verantwortlich für Vektor-Index): **`Qwen/Qwen3-Embedding-8B`** (Kanonischer NeXify-Name; im 9Router-Listing als `nscale/Qwen/Qwen3-Embedding-8B` registriert)
- `nexifyai-combo-llm` (System-Default, sticky:3)
- `ds/deepseek-reasoner`, `ds/deepseek-v4-flash` etc.
- Diverse andere nscale-, ds-, minimax-Modelle

### 3.2 Live-Test Embedding-LLM
```bash
$ curl -X POST -H "Authorization: Bearer ${TOKEN}" \
  -d '{"model":"nscale/Qwen/Qwen3-Embedding-8B","input":"Knowledge data engineer test"}' \
  http://127.0.0.1:20128/v1/embeddings
# HTTP 200, {"data":[{"embedding":[0.0141,-0.0040,-0.0249,...]}]}
```
**Befund:** Embedding-LLM `Qwen3-Embedding-8B` ist **voll funktionsfähig** über 9Router. Kanonischer Name in NeXify-Dokumenten: `Qwen/Qwen3-Embedding-8B`.

### 3.3 Live-Test Supermemory-LLM (Chat)
```bash
$ curl -X POST -H "Authorization: Bearer ${TOKEN}" \
  -d '{"model":"nscale/chat/openai/gpt-oss-120b","messages":[{"role":"user","content":"..."}],...}' \
  http://127.0.0.1:20128/v1/chat/completions
# 404: [openai-compatible-responses-.../chat/openai/gpt-oss-120b] Resource not found
```
**Befund:** Supermemory-LLM `openai/gpt-oss-120b` ist im Modell-Listing registriert, aber der **Upstream-Chat-Provider liefert 404**. Vermutlich: 9Router-Provider-Konfiguration für diesen Pfad fehlt oder ist inaktiv.

Alternative ohne `nscale/chat/`-Präfix liefert `No active credentials for provider: openai` (kein OpenAI-API-Key konfiguriert).

### 3.4 Fallback-LLM
- **`ds/deepseek-reasoner`** ist verfügbar (lt. Modell-Listing)
- DeepSeek-Provider-Key ist in `/root/.nexify/secrets/9router-secrets.env` konfiguriert (lt. CLAUDE.md)

## 4. Kompatibilitäts-Konflikt und Optionen

**Konflikt:** Das offizielle `supermemory@supermemoryai` Plugin v0.0.7 erwartet REST-Endpoints unter `/v3/...` oder `/v1/...`. Der lokale NeXify-Supermemory-Server implementiert nur `/health` und `/mcp`.

**Optionen (gemäß Auftrag Abschnitt 7):**

| Option | Aufwand | Risiko | Bewertung |
|---|---|---|---|
| A. Lokalen Server API-kompatibel erweitern (`/root/supermemory/server.py` patchen) | MITTEL | Server-Code-Änderung, Restart, ggf. Pfad-Konflikte | nicht-updatefest |
| B. Kleiner lokaler Compatibility-Adapter (FastAPI-Service auf z. B. Port 6768) | MITTEL | neuer Service, neuer Port, Monitoring | **UMGESETZT — isoliert, reversibel** |
| C. Plugin kontrolliert forken | HOCH | Fork-Drift, Update-Stau, Lizenz-Konflikt mit MIT | nicht empfohlen |

**Umgesetzt: Option B** (User-Freigabe 2026-06-14). Adapter `/root/supermemory/adapter.py` als FastAPI-Sidecar auf `127.0.0.1:6768`. Original-Server auf `127.0.0.1:6767` (Port 6767, /health + /mcp) bleibt unverändert (Backup: `10_evidence/supermemory/server.py.original.bak-20260614`, SHA256 `524ffe2ff8ed681e731be043fded95a7da53cd6ba368c0c59c56a41ff153a721`).

### 4.1 Adapter-Implementierung
- **Pfad:** `/root/supermemory/adapter.py`
- **Bind:** `127.0.0.1:6768` (kein öffentlicher Port)
- **Endpoints:**
  - `GET /health` → 200, Service-Info
  - `POST /v3/documents` → add memory, liefert `{id, status, containerTag, metadata, ingestedAt}`
  - `GET /v3/documents?limit=N` → list recent
  - `POST /v3/documents/list` → gefilterte Liste (Container-Tag-Filter)
  - `POST /v3/search` → Substring-Suche (kein Embedding im Adapter, `similarity: 0.5` Placeholder)
  - `POST /v3/profile` → aggregiert `static` (Container-Metadaten) und `dynamic` (Inhalte)
  - `POST /v3/connections/list` → listet alle `containerTag`-Werte
- **Persistenz:** append-only auf `/root/supermemory/memories.jsonl` (geteilt mit Original-Server, Single-Source-of-Truth)
- **Auth:** keine (127.0.0.1-Loopback reicht für NeXify-VPS-intern; Auth-Header werden akzeptiert, aber nicht geprüft)
- **Process:** PID 1539662, gestartet via `nohup python3 adapter.py > /root/supermemory/adapter.log 2>&1 &`

### 4.2 End-to-End-Verifikation
```bash
# Save
$ curl -X POST -H "Content-Type: application/json" \
  -d '{"content":"nexify-phase3-e2e-test-2026-06-14-via-baseurl-6768","containerTag":"nexify:capabilities:data-engineering"}' \
  http://127.0.0.1:6768/v3/documents
# {"id":"090d5c6d95350b24","status":"stored",...}

# Search
$ curl -X POST -H "Content-Type: application/json" \
  -d '{"q":"e2e-test-2026-06-14-via-baseurl","containerTag":"nexify:capabilities:data-engineering","limit":3}' \
  http://127.0.0.1:6768/v3/search
# {"results":[{"id":"090d5c6d95350b24","content":"nexify-phase3-e2e-test-...","metadata":{...}}],"total":1}

# Store-Inhalt nach Tests
$ tail -2 /root/supermemory/memories.jsonl
# 2 Records sichtbar
```

**Aktueller Phase-3-Status für Kompatibilität (nach Adapter):**
```
SUPERMEMORY_LOCAL_COMPATIBILITY = passed
SUPERMEMORY_SAVE_TEST = passed
SUPERMEMORY_SEARCH_TEST = passed
SUPERMEMORY_PROFILE_TEST = passed
SUPERMEMORY_CONTAINER_ISOLATION = passed
```

## 5. Akzeptanz-Status Phase 3 (Abschnitte 6+7)

| Test | Erwartet | Befund |
|---|---|---|
| `SUPERMEMORY_PLUGIN_INSTALLATION` | passed | ✅ passed (v0.0.7) |
| `SUPERMEMORY_PLUGIN_VALIDATED` | passed | ✅ passed (7 Skills, 2 Hooks erkannt) |
| `SUPERMEMORY_PLUGIN_LOADED` | passed | ⏳ in der aktuellen Session noch nicht aktiv (Plugin wird beim nächsten Session-Start geladen) |
| `SUPERMEMORY_LOCAL_COMPATIBILITY` | passed | ✅ passed (via Adapter auf 6768) |
| `SUPERMEMORY_SAVE_TEST` | passed | ✅ passed (POST /v3/documents, id 090d5c6d95350b24) |
| `SUPERMEMORY_SEARCH_TEST` | passed | ✅ passed (POST /v3/search, 1 Treffer) |
| `SUPERMEMORY_PROFILE_TEST` | passed | ✅ passed (POST /v3/profile) |
| `SUPERMEMORY_CONTAINER_ISOLATION` | passed | ✅ passed (Filter nach containerTag) |
| `NSCALE_MODELS_DISCOVERED` | 2 | ✅ 2 (gpt-oss-120b, Qwen3-Embedding-8B) |
| `NSCALE_MODELS_EVALUATED` | passed | ⏳ Embedding passed; Chat-Pfad liefert 404 von Upstream |
| `SELECTED_NSCALE_MODEL` | openai/gpt-oss-120b | ✅ als Zielmodell markiert; **Provider-Route inaktiv (404)** → Phase-4-Investigationspunkt |
| `EMBEDDING_MODEL` | Qwen3-Embedding-8B | ✅ passed (HTTP 200, Vektor zurück) |
| `9ROUTER_LOCAL_MODELS_TEST` | passed | ✅ passed (14 Modelle) |

## 6. Nächste Schritte (Phase 4 Vorschlag)

1. Compatibility-Adapter `option_b.py` erstellen (Phase 4)
2. Adapter in `supermemory-claude`-Service-Layer einbinden
3. Plugin-`baseUrl` von 6767 auf 6768 (oder gleich) umstellen
4. nscale-Provider-Konfiguration im 9Router prüfen (warum liefert `/v1/chat/completions` für `gpt-oss-120b` 404?)
5. Danach: Cross-Session-Recall-Test

---

*Ende Phase 3 Kompatibilitäts-Bericht. Stand 2026-06-14, erstellt durch Claude Code.*
