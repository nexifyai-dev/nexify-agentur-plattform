# NeXify System-Architektur-Karte V1 (2026-06-20)
## Alle Services, Ports, Verbindungen, Lücken

### Services (aktiv)

```
┌────────────────────────────────────────────────────────────────────┐
│                    NeXify Workflow Runtime                          │
│  PID 7959, 25 Module, /var/.../start_workflow_runtime.py            │
└────────┬──────────────────────────────┬─────────────────────────────┘
         │                              │
    ┌────▼──────────────────┐     ┌─────▼──────────────────────────────┐
    │  Event Bus (memory)   │     │  Health Cron (300s) │ Backup (600s)│
    │  25 Subscriber-Typen  │     │  evidence/          │ state/       │
    └────┬──────────────────┘     └────────────────────────────────────┘
         │
    ┌────▼─────────────────────────────────────────────────────────────┐
    │  PF-004 Pipeline: ContextLoader→PolicyGate→Executor→Evidence     │
    └──────────────────────────────────────────────────────────────────┘
```

### Port-Map

| Port | Service | Typ | Status | Abhängigkeit |
|------|---------|-----|--------|--------------|
| **9090** | **Brain API** | HTTP (Go/Systemd) | 🟢 | Qdrant (6333) |
| **6333** | **Qdrant** | HTTP (Rust/Systemd) | 🟢 | — |
| **40000** | **agentmemory** | HTTP (Python/FastAPI) | 🟢 NEU | SQLite DB |
| **6379** | **FakeRedis** | TCP (Python) | 🟢 NEU | fakeredis |
| 8001 | API Server | HTTP (FastAPI) | 🔴 | MongoDB |
| 27017 | MongoDB | TCP | 🔴 | Docker |
| 11434 | Ollama | HTTP | 🔴 | — |
| 8420 | Brain API (legacy) | HTTP (FastAPI) | 🔴 | — |

### MCP-Server (stdio, über Hermes-Gateway)

| MCP Server | Funktion | Hintergrund-API |
|-----------|----------|-----------------|
| mcp-brain-server.py | Brain Query | brain.nexifyai.cloud:443 |
| mcp-qdrant-server.py | Qdrant Query | localhost:6333 |
| mcp-agentmemory-server.py | agentmemory | localhost:40000 |
| mcp-tavily-search-server.py | Web Search | api.tavily.com:443 |

### Daten-Pfade

```
Brain API (9090) ──► Qdrant (6333) — Vektorsuche, 8.769 Punkte
agentmemory (40000) ──► SQLite — FTS5-Volltextsuche, 438 Einträge
  ├── 28 agentmemory (generisch)
  ├── 401 oracle_rules (kanonische Regeln) ← NEU
  └── 9 system_state
FakeRedis (6379) ──► In-Memory — Redis-Kompatibilität ← NEU

Workflow State (/state/workflow_persist.json)
  └── 52 Workflows, Rotation 100, Backup alle 600s
```

### Integrationen (Workflow Runtime → Services)

| Runtime Module | Verbindet zu | Protokoll |
|---------------|-------------|-----------|
| context_loader | Brain API 9090 | HTTP /query |
| trigger_executor | Brain API 9090 | HTTP /query |
| runtime_watcher | Qdrant 6333 | HTTP /collections |
| policy_gate | — (lokal) | EventBus |
| evidence_writer | Dateisystem | JSON |
| workflow_backup | Dateisystem | JSON |
| fake_redis | Port 6379 | TCP/RESP |
| planner_memory_sync | Dateisystem | JSON (gefixt: war Qdrant) |

### Offene Integrationen (S-05)

| Potenzial | Service | Nutzen |
|-----------|---------|--------|
| Context Loader + agentmemory | 40000 | Oracle Rules für Task-Kontext |
| Policy Gate + agentmemory | 40000 | Regel-Prüfung vor Dispatch |
| Trigger Executor + Tavily | MCP | Web-Suche für Trigger Tasks |
| Trigger Executor + agentmemory | 40000 | Oracle Rules als Wissensbasis |

### Blockaden-Diagramm

```
Root (nicht verfügbar)
├── Kein apt → kein redis-server → FAKEREDIS (Workaround ✅)
├── Kein apt → kein mongod → API Server 8001 tot ❌
├── Kein Docker → kein agentmemory Docker → agentmemory_server.py (Workaround ✅)
├── Kein Docker → kein Qdrant Docker → Systemd-Qdrant läuft ✅
└── X-Brain-Token unbekannt → /store Endpoint blockiert → agentmemory (Workaround ✅)
```

### Lücken-Bilanz (aktuell)

| Gap | Status | Workaround |
|-----|--------|-----------|
| Redis-Server fehlt | 🟢 GEFIXT | FakeRedis (Python, Port 6379) |
| agentmemory Docker fehlt | 🟢 GEFIXT | agentmemory_server.py (SQLite) |
| 403 Oracle Rules nicht geladen | 🟢 GEFIXT | 401 Regeln in agentmemory |
| X-Brain-Token unbekannt | 🟡 Workaround | agentmemory statt /store |
| MongoDB fehlt | 🔴 Offen | Kein Workaround |
| Trigger Stubs (4 Tasks) | 🟢 GEFIXT | Alle auf Brain API |
| planner_memory_sync 4-dim Bug | 🟢 GEFIXT | Schreibt in workflow_persist |
| PF-004 St.8 Review Hook | ⬜ Fehlt | Nicht implementiert |
