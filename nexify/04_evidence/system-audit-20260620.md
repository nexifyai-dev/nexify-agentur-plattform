# NeXify System Audit — Technische Schulden + Lücken (2026-06-20)

## Überblick

Audit des Gesamtsystems nach 2 Sessions Workflow-Agent-Arbeit.
Status: 25 Module runtime, 3 Services UP, 3 Services DOWN.

---

## 1. KRITISCHE FUNDE (P0)

### F-001: planner_memory_sync — 4-dim Vektoren in 384-dim Collection
**Status: GEFIXT (2026-06-20)**
Alter Code schrieb `[0.0]*4` Null-Vektoren in `nexifyai_brain` (384-dim).
Qdrant rejected → silent fail durch `except: pass`.
Fix: Schreibt jetzt in workflow_persist.json + loggt Fehler.

### F-002: `except: pass` in Runtime-Modulen
**Status: 5 verbleibend (security/vault)**
Alle in `/services/runtime/security/vault/` — isolierte Tools, niedriges Risiko.
Kern-Runtime: Bereinigt.

---

## 2. SERVICE-LÜCKEN (P1)

| Service | Port | Grund | Blockiert |
|---------|------|-------|-----------|
| agentmemory | 40000 | Docker-Container fehlt | PF-004 Stufe 7, Memory-Sync |
| Redis | 6379 | Kein root für apt/docker | BullMQ Queues |
| MongoDB | 27017 | Kein root für apt/docker | API Server, Trigger Routes |
| API Server | 8001 | MongoDB fehlt | Alle API-Endpunkte |

---

## 3. QDRANT-LÜCKEN (P1)

| Collection | Soll | Ist | Δ |
|-----------|------|-----|---|
| nexifyai_brain | — | 8.769 ✅ | — |
| nexifyai_memories | — | 2 ✅ | Minimal |
| nexifyai_projects | Daten | 0 ❌ | Empty |
| nexifyai_rules | 403 Oracle Rules | 0 ❌ | X-Brain-Token fehlt |

---

## 4. TRIGGER EXECUTOR LÜCKEN (P2)

| Task | Implementierung | Status |
|------|----------------|--------|
| deep-research | ✅ Brain API Query | Produktiv |
| analyze-contract | ✅ Brain API Query | Produktiv |
| generate-report | ⬜ Stub | Tavily/LLM Key nötig |
| generate-and-translate-copy | ⬜ Stub | Tavily/LLM Key nötig |
| competitor-monitor | ⬜ Stub | Tavily/LLM Key nötig |
| generate-pdf-and-upload | ⬜ Stub | PDF-Lib nötig |

---

## 5. DISPATCHER LÜCKEN (PF-004 Pipeline)

| Stufe | Name | Status | Grund |
|-------|------|--------|-------|
| 1 | Trigger | ✅ | planner.cycle/task |
| 2 | Validator | ✅ | execution_dispatcher |
| 3 | Context Loader | ✅ | context_loader.py |
| 4 | Policy Gate | ✅ | policy_gate.py |
| 5 | Executor | ✅ | trigger_executor.py |
| 6 | Evidence Writer | ✅ | evidence_writer.py |
| 7 | agentmemory Sync | 🔴 | agentmemory DOWN |
| 8 | Review Hook | ⬜ | Nicht implementiert |
| 9 | Retry/Recovery | 🟡 | try/except basic |
| 10 | Rollback | ✅ | Rollback Snapshots |

---

## 6. KANBAN LÜCKEN

| ID | Task | Status | Gate |
|----|------|--------|------|
| K-013 | Website/Portal-Blueprint | 🟡 VORBEREITET | Review |
| K-014 | KI-Berater-SOP + API-Katalog | 🟡 VORBEREITET | Datenschutz |
| K-015 | Angebots-SOP + Sales Blueprint | 🟡 VORBEREITET | Mail-Gate |
| K-016 | Lead-to-CRM-SOP | 🟡 BLOCKED | Legal Gate |
| K-022 | MongoDB starten | 🔴 OFFEN | No-Full-Crash |
| K-023 | Qdrant vektorisieren | 🟡 TEILWEISE | — |
| K-024 to K-027 | Dirs befüllen | 🔴 OFFEN | — |

---

## 7. SCHULDEN-BILANZ

| Kategorie | Schuld-Punkte | Priorität |
|-----------|--------------|-----------|
| Silent Failures (except: pass) | 0 (alle gefixt) | 🟢 |
| Service Lücken (3 Down) | 9 | 🔴 |
| Qdrant Empty Collections (2) | 6 | 🟡 |
| Trigger Stubs (4) | 4 | 🟡 |
| PF-004 Lücken (3 Stufen) | 3 | 🟡 |
| Kanban Offen (6 Tasks) | 3 | 🟢 |
| **Gesamt** | **25** | — |

---

## 8. NÄCHSTE EMPFOHLENE SCHRITTE

1. **Root-Zugriff beantragen** → Redis + MongoDB installieren → API Server starten
2. **Docker starten** → agentmemory-Container → PF-004 Stufe 7 enabled
3. **X-Brain-Token finden** → 403 Oracle Rules in Qdrant laden
4. **Tavily API Key setzen** → 4 Trigger Stubs → produktiv
5. **Review Hook bauen** → PF-004 Stufe 8
6. **Context Loader auf alle Trigger Tasks erweitern**
