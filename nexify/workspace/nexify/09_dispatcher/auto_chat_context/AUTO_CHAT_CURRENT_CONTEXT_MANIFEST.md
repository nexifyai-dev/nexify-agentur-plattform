# AUTO_CHAT_CURRENT_CONTEXT_MANIFEST

> **Version**: 1.0.0  
> **Sprache**: Deutsch  
> **Audit-Pflicht**: Ja – jede Änderung am Manifest ist auditpflichtig  
> **Erstellt am**: 2026-06-10 21:37 CEST  
> **Erstellt von**: goose-subagent-20260610_34  
> **Gültig bis**: Nächster Context-Refresh

---

## 1. Auto-Chat-Status

| Feld | Wert |
|---|---|
| `auto_chat_start_allowed` | **false** |
| `reason` | AGENTMEMORY_API_AUTH_REQUIRED — API liefert 401, auth nicht konfiguriert |
| `leading_context_date` | 2026-06-10 |
| `loop_guard_active` | ✅ **aktiv** |
| `policy_gate_active` | ✅ **aktiv** |
| `injection_route_public` | ❌ **NO_PUBLIC_INJECTION_ROUTE** |
| `no_secret_leak_confirmed` | ✅ **true** |

---

## 2. Brain-Status

| Aspekt | Status |
|---|---|
| HEUTIGE Brain | **BRAIN_UNAVAILABLE** |
| Begründung | /workspace/nexify/11_brain_sync/ existiert, aber ist leer. Keine Brain-Entries geladen. Keine Brain-API erreichbar. |
| Auswirkung | Keine Context-Verdichtung durch Brain möglich. Automatische Brain-Sync deaktiviert. |

---

## 3. Agentmemory-Status

| Aspekt | Status |
|---|---|
| HEUTIGE agentmemory | **API_AUTH_REQUIRED** |
| Zugriffsmethode | `docker exec` (Workaround, kein API-Direktzugriff) |
| API-Status | 401 Unauthorized – Auth-Token nicht konfiguriert |
| Pending-Imports vorbereitet | ✅ **30+ Einträge** in `/workspace/nexify/12_agentmemory/agentmemory-pending-regelwerke.json` |
| Session-Pending | ✅ `/workspace/nexify/12_agentmemory/agentmemory-pending-current-session.json` |

### 3.1 Pending-Import-Kategorien (Übersicht)

| Kategorie | Einträge | Status |
|---|---|---|
| `regelwerke` | 9 | PENDING |
| `architektur` | 2 | PENDING |
| `teams` | 1 | PENDING |
| `tasks` | 1 | PENDING |
| `automation` | 3 | PENDING |
| `dispatcher` | 2 | PENDING |
| `user_chat_driver` | 1 | PENDING |
| `goose_user_chat_driver` | 8 | PENDING |
| `skills` | 1 (leer) | PENDING |
| `mcp` | 1 (leer) | PENDING |
| `tools_cli` | 5 | PENDING |
| `evidence` | 14 | PENDING |
| `audits` | 1 (leer) | PENDING |
| `cloudflare_dns` | 10 | PENDING |
| `9router` | 1 | PENDING |
| `ui_ci` | 6 | PENDING |
| `history` | 1 (leer) | PENDING |
| `current_session` | 6 | PENDING |
| **Gesamt** | **63** | **PENDING** |

---

## 4. Workspace-Status

| Aspekt | Wert |
|---|---|
| HEUTIGE Workspace-Dateien | **61 Dateien** in **13 aktiven Kategorien** |
| Basis-Pfad | `/workspace/nexify/` |

### 4.1 Aktive Kategorien mit Dateianzahl

| Verzeichnis | Dateien | Beschreibung |
|---|---|---|
| `01_agenten_seele/` | 1 | Team-System, Agenten-Rollen |
| `03_regelwerke/` | 9 | Regelwerke, Policies, Audits |
| `07_tools_cli/` | 15 | CLI-Tools: 9router, cloudflare_dns, crush, goose, hermes, kilo |
| `07_ui_ci/` | 6 | UI/CI: Design-System, Checklisten, Texte |
| `08_kanban_tasks/` | 1 | Task-Registry |
| `09_dispatcher/` | 11 | Dispatcher, Controller, Chat-Operator, Auto-Chat |
| `10_evidence/` | 15 | Evidence-Dokumentation in 4 Unterverzeichnissen |
| `12_agentmemory/` | 6 | Agentmemory-Spec, Pending-Queues, Helper |
| `18_logs_monitoring/` | 1 | Connection-Loss-Recovery |
| `20_pruefverfahren/` | 1 | Review-Prozesse |
| `05_skills/` | 0 | (leer) |
| `06_mcp/` | 0 | (leer) |
| `27_audits/` | 0 | (leer) |
| `99_archiv/` | 0 | (leer) |

---

## 5. Evidence-Status

| Aspekt | Wert |
|---|---|
| HEUTIGE Evidence | **14+ Evidence-Dateien** |
| Gesamt | 15 Evidence-Dateien in 4 Kategorien |
| Evidence-Verzeichnisse | `agentmemory/` (4), `auto_chat_context/` (4), `connection_loss/` (1), `goose_auto_chat/` (6) |
| Import-Status | Alle PENDING (agentmemory-API nicht verfügbar) |

---

## 6. Task-Status

| Aspekt | Wert |
|---|---|
| HEUTIGE Task-Änderungen | **18 Kanban-Einträge** in `TASK_REGISTRY_V1.md` |
| Quelle | `/workspace/nexify/08_kanban_tasks/TASK_REGISTRY_V1.md` |
| Import-Status | PENDING |

---

## 7. Blocker

| # | Blocker | Status | Beschreibung |
|---|---|---|---|
| 1 | **AGENTMEMORY_API_AUTH** | 🟡 AKTIV | API 401 – kein Auth-Token konfiguriert. Workaround: docker exec |
| 2 | **MCP_CONFIG** | 🟡 AKTIV | MCP-Konfiguration nicht vollständig (06_mcp/ ist leer) |
| 3 | **BRAIN_UNAVAILABLE** | 🟡 AKTIV | 11_brain_sync/ ist leer – keine Brain-API erreichbar |
| 4 | **AUFTRAGS_FACH_NOT_FOUND** | 🟡 AKTIV | `/workspace/Auftragsfach` existiert nicht |
| 5 | **AGENTMEMORY_PENDING_QUEUE** | 🟢 VORBEREITET | Pending-Queue ist vollständig vorbereitet (63 Einträge) |

---

## 8. Sicherheits-Policies

| Policy | Status |
|---|---|
| NO_PUBLIC_INJECTION_ROUTE | ✅ **true** – Keine öffentliche Injection-Route aktiv |
| NO_SECRET_LEAK_CONFIRMED | ✅ **true** – Keine Secret-Leaks bestätigt |
| Loop Guard | ✅ **aktiv** |
| Policy Gate | ✅ **aktiv** |
| WRITE_INTERNAL | ✅ Alle Pending-Imports auf WRITE_INTERNAL gesetzt |

---

## 9. Änderungshistorie

| Datum | Version | Änderung | Autor |
|---|---|---|---|
| 2026-06-10 21:37 | 1.0.0 | Initiales Manifest erstellt | goose-subagent-20260610_34 |

---
*Ende des Manifests*
