# NEXIFY CAPABILITY MCP TARGET ARCHITECTURE V1

**Status:** 🟢 Entwurf / Draft
**Version:** 1.0.0
**Datum:** 2026-06-11
**Autor:** Subagent 20260611_5
**Audit-Pflicht:** Ja

---

## 1. Überblick

Dieses Dokument beschreibt die **Zielarchitektur für den zentralen NeXify Capability MCP (Model Context Protocol)**. Der Capability MCP dient als zentrale Registrierung und Zugriffssteuerung aller Fähigkeiten im NeXify-System — Tools, CLIs, Agents, Workflows, Skills und Prompts.

> **Leitsatz:** Jede Fähigkeit hat einen MCP-Endpunkt. Jeder Endpunkt hat eine Berechtigungsstufe. Kein Agent nutzt eine Fähigkeit ohne MCP-Zugriff.

---

## 2. Architekturprinzipien

### 2.1 Zentraler Capability MCP

| Prinzip | Beschreibung |
|---------|-------------|
| **Single Source of Truth** | Der Capability MCP ist die einzige autoritative Quelle für alle Fähigkeiten |
| **Berechtigungsgesteuert** | Jeder Zugriff wird gegen die Permission Matrix geprüft |
| **Kategorisiert** | Fähigkeiten sind in 7 Kategorien eingeteilt (siehe Abschnitt 4) |
| **Erweiterbar** | Neue Fähigkeiten werden durch Registrierung hinzugefügt, nicht durch Code-Änderungen |
| **Observable** | Jeder Zugriff wird geloggt und kann auditiert werden |

### 2.2 Architektur-Entscheidungen

| Entscheidung | Begründung |
|-------------|-----------|
| **Zentraler MCP + agentenspezifische MCPs** | Der zentrale MCP verwaltet Registry und Berechtigungen. Agentenspezifische MCPs (z. B. für Spezialaufgaben) werden beim zentralen MCP registriert und sind über ihn auffindbar. Dies kombiniert zentrale Governance mit verteilter Ausführung. |
| **Python-basierte Implementierung** | Python hat das reifste MCP-Ökosystem (mcp-Python SDK). Die agentmemory-Integration, das Brain/Qdrant-Backend und die vorhandenen CLI-Tools sind mehrheitlich Python-basiert. |
| **Redis als MCP-Backend** | Redis bietet schnelle Lookups, Pub/Sub für Echtzeit-Updates und Persistenz. Supabase als Langzeitspeicher für Audits. |
| **MCP over SSE/Streamable HTTP** | SSE (Server-Sent Events) für Streaming-Fähigkeiten, Streamable HTTP für Request/Response. Beides MCP-Standard. |

---

## 3. Zielarchitektur

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NeXify Capability System                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   CENTRAL CAPABILITY MCP                           │  │
│  │                                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │  │
│  │  │ Registry     │  │ Permission   │  │ Audit & Observability│  │  │
│  │  │ Service      │  │ Engine       │  │ Logger               │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │  │
│  │                                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │  │
│  │  │ Capability   │  │ Frequency    │  │ Health Checker       │  │  │
│  │  │ Discovery    │  │ Tracker      │  │ & Rate Limiter       │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │  │
│  │                                                                   │  │
│  │  Datastores: Redis (Cache/Registry) ←→ Supabase (Audit/Persist)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                         │
│        ┌───────────────────────┼───────────────────────┐                │
│        │                       │                       │                │
│  ┌─────▼─────┐          ┌─────▼─────┐          ┌─────▼─────┐          │
│  │ Agent     │          │ Agent     │          │ Agent     │          │
│  │ MCP A    │          │ MCP B    │          │ MCP C    │          │
│  │ (Goose)   │          │ (Hermes)  │          │ (Kilo)    │          │
│  └─────┬─────┘          └─────┬─────┘          └─────┬─────┘          │
│        │                      │                      │                │
│  ┌─────▼─────┐          ┌─────▼─────┐          ┌─────▼─────┐          │
│  │ Tools A   │          │ Tools B   │          │ Tools C   │          │
│  │ Skills A  │          │ Skills B  │          │ Skills C  │          │
│  └───────────┘          └───────────┘          └───────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Fähigkeitskategorien (7 Stufen)

| Stufe | Kategorie | Beschreibung | Beispiele |
|-------|-----------|-------------|-----------|
| **S0** | 🟢 **Dauerhafte Nutzung** | Immer aktiv, keine Einschränkung | MCP-Standard-Tools (read, write, edit), Brain-Zugriff, Memory-Sync |
| **S1** | 🔵 **Häufige Nutzung** | Regelmäßig genutzt, automatisierte Freigabe | 9Router-Calls, CLI-Tools, Skill-Loading |
| **S2** | 🟡 **Normale Nutzung** | Standard-Freigabe, aber mit Frequenz-Tracking | Code-Generierung, File-Operationen, Git-Operationen |
| **S3** | 🟠 **Seltene Nutzung** | Nur bei Bedarf, mit Begründung | Datenbank-Migrationen, Deployment, Rollback |
| **S4** | 🔴 **Riskante Nutzung** | Potentiell schädlich, mit Risk-Check | System-Änderungen, Berechtigungs-Änderungen, Secret-Management |
| **S5** | ⚠️ **Nur nach Freigabe** | Erfordert explizite Autorisierung | Produktiv-Deployments, Domain-Änderungen, Datenlöschung |
| **S6** | ⛔ **Verboten** | Niemals ausführen | Unautorisierte API-Calls, Datenexfiltration, System-Manipulation |

---

## 5. MCP-Endpunkt-Struktur

### 5.1 MCP-Ressourcen-URI-Schema

```
mcp://nexify.capability/{capability_id}
mcp://nexify.capability/{kategorie}/{tool_name}
mcp://nexify.capability/search?q={query}
mcp://nexify.capability/permissions/{agent_id}
```

### 5.2 MCP-Tool-Endpunkte

| Endpunkt | Methode | Beschreibung |
|----------|---------|-------------|
| `capability.list` | list_resources | Alle registrierten Fähigkeiten abrufen |
| `capability.get` | read_resource | Details einer Fähigkeit abrufen |
| `capability.search` | read_resource | Fähigkeiten durchsuchen |
| `capability.register` | call_tool | Neue Fähigkeit registrieren (nur Admin) |
| `capability.update` | call_tool | Fähigkeit aktualisieren (nur Admin) |
| `capability.deregister` | call_tool | Fähigkeit entfernen (nur Admin) |
| `capability.check_permission` | call_tool | Berechtigung für eine Aktion prüfen |
| `capability.get_frequency` | call_tool | Nutzungsfrequenz einer Fähigkeit abrufen |

### 5.3 MCP-Prompt-Endpunkte

| Endpunkt | Beschreibung |
|----------|-------------|
| `capability.prompt.usage_report` | Prompt für Nutzungsbericht einer Fähigkeit |
| `capability.prompt.permission_check` | Prompt für Berechtigungsprüfung |
| `capability.prompt.register_new` | Prompt für Registrierung einer neuen Fähigkeit |

---

## 6. Implementierungs-Empfehlung

### 6.1 Python-basiert (Empfohlen)

| Komponente | Technologie | Begründung |
|-----------|-------------|-----------|
| **MCP Server** | Python + `mcp` SDK | Reifstes MCP-Ökosystem, agentmemory-Integration |
| **Registry** | Redis (JSON) + Supabase (SQL) | Redis für schnelle Lookups, Supabase für Audits |
| **Permission Engine** | Python (OPA/Polar oder Custom) | Regelbasierte Berechtigungsprüfung |
| **Frequenz-Tracking** | Redis TimeSeries oder Prometheus | Metrik-Erfassung und Trending |
| **CLI** | Click/Typer | Einfache CLI für Admin-Operationen |

### 6.2 Node-basiert (Alternative)

| Komponente | Technologie | Begründung |
|-----------|-------------|-----------|
| **MCP Server** | TypeScript + `@modelcontextprotocol/sdk` | Wachsendes Ökosystem, Next.js-Integration |
| **Registry** | Redis + Supabase | Gleiche Vorteile wie Python |
| **Permission Engine** | TypeScript (Casbin oder Custom) | TypeScript-native Bibliotheken |
| **Frequenz-Tracking** | Redis + Prometheus Client | Gleiche Metriken |

**Empfehlung:** Python-basiert starten, da die vorhandene Infrastruktur (agentmemory, Brain/Qdrant, CLI-Tools) bereits Python-zentrisch ist. Node-basierte agentenspezifische MCPs (z. B. für Hermes WebUI) können später parallel betrieben werden.

---

## 7. MCP-Endpunkt-Definitionen (Alle Fähigkeiten)

### 7.1 Basisfähigkeiten (S0 — Dauerhaft)

| ID | Name | MCP-Endpunkt | CLI |
|----|------|-------------|-----|
| `mcp_read` | MCP Resource Read | `mcp://nexify/base/read_resource` | — |
| `mcp_write` | MCP Resource Write | `mcp://nexify/base/write_resource` | — |
| `mcp_tool_call` | MCP Tool Call | `mcp://nexify/base/call_tool` | — |
| `brain_query` | Brain/Qdrant Query | `mcp://nexify/base/brain_query` | `brain-cli query` |
| `memory_sync` | agentmemory Sync | `mcp://nexify/base/memory_sync` | `memory-cli sync` |

### 7.2 Tools/CLIs (S1–S3 — Häufig bis Normal)

| ID | Name | MCP-Endpunkt | CLI | Kategorie |
|----|------|-------------|-----|-----------|
| `9router_query` | 9Router KI-Router | `mcp://nexify/tools/9router_query` | `9router-cli query` | S1 |
| `goose_acc` | Goose ACC | `mcp://nexify/tools/goose_acc` | `goose-acc` | S2 |
| `hermes_cli` | Hermes CLI | `mcp://nexify/tools/hermes_cli` | `hermes-cli` | S2 |
| `kilo_cli` | Kilo CLI | `mcp://nexify/tools/kilo_cli` | `kilo-cli` | S2 |
| `crush_audit` | Crush Audit | `mcp://nexify/tools/crush_audit` | `crush-cli audit` | S2 |
| `cloudflare_dns` | Cloudflare DNS | `mcp://nexify/tools/cloudflare_dns` | `cf-dns-cli` | S3 |
| `domain_management` | Domain-Management | `mcp://nexify/tools/domain_mgmt` | `domain-cli` | S4 |
| `rollback_exec` | Rollback-Execution | `mcp://nexify/tools/rollback_exec` | `rollback-cli` | S4 |

### 7.3 Agenten-Fähigkeiten (S1–S3)

| ID | Name | MCP-Endpunkt | Genutzt von |
|----|------|-------------|-------------|
| `goose_session` | Goose-CLI-Session | `mcp://nexify/agents/goose_session` | Goose CLI |
| `goose_acc_chain` | ACC Task Chain | `mcp://nexify/agents/goose_acc_chain` | Goose ACC |
| `hermes_webui` | Hermes WebUI | `mcp://nexify/agents/hermes_webui` | Hermes WebUI |
| `hermes_automation` | Hermes Automation | `mcp://nexify/agents/hermes_automation` | Hermes CLI |
| `oracle_dispatch` | Oracle Dispatch | `mcp://nexify/agents/oracle_dispatch` | Oracle |
| `promptmaster_gov` | Promptmaster Governance | `mcp://nexify/agents/promptmaster_gov` | Promptmaster |

### 7.4 Wissens-Fähigkeiten (S0–S2)

| ID | Name | MCP-Endpunkt | Beschreibung |
|----|------|-------------|-------------|
| `evidence_system` | Evidence-System | `mcp://nexify/knowledge/evidence` | Evidence-Erfassung und -Archiv |
| `kanban_task` | Kanban/Task-System | `mcp://nexify/knowledge/kanban` | Task-Verwaltung und Status-Tracking |
| `regelwerke` | Regelwerke | `mcp://nexify/knowledge/regelwerke` | Regelwerks-Zugriff und -Prüfung |
| `skill_registry` | Skill-Registry | `mcp://nexify/knowledge/skills` | Skill-Verzeichnis und -Loading |

---

## 8. Sicherheit & Governance

### 8.1 Zugriffskontrolle

| Mechanismus | Beschreibung |
|------------|-------------|
| **MCP-Authentifizierung** | Jeder MCP-Call enthält einen API-Token des aufrufenden Agents |
| **Permission Engine** | Prüft Token + Capability-ID + Kontext gegen Permission Matrix |
| **Rate Limiting** | Pro Agent und Capability konfigurierbare Limits |
| **Audit Log** | Jeder Zugriff wird in Supabase mit vollständigem Kontext geloggt |

### 8.2 Security-Maßnahmen

- Alle MCP-Endpunkte nur über verschlüsselte Verbindungen (TLS)
- Tokens mit Ablaufdatum und rotierenden Secrets
- Keine direkte Datenbank-Exposition — alles über MCP-API
- Regelmäßige Permission-Audits (siehe MCP_PERMISSION_MATRIX_V1)

---

## 9. Nächste Schritte

| # | Aktion | Priorität | Aufwand |
|---|--------|-----------|---------|
| 1 | Capability Registry befüllen (siehe NEXIFY_CAPABILITY_REGISTRY.md) | P1 | 1 Tag |
| 2 | Permission Matrix finalisieren (siehe MCP_PERMISSION_MATRIX_V1.md) | P1 | 1 Tag |
| 3 | Python-MCP-Server aufsetzen (Basis: FastAPI + mcp SDK) | P1 | 2 Tage |
| 4 | Redis-Backend für Registry konfigurieren | P2 | 1 Tag |
| 5 | Agentenspezifische MCPs registrieren (Goose, Hermes, Kilo) | P2 | 2 Tage |
| 6 | Permission Engine implementieren | P2 | 2 Tage |
| 7 | Audit-Logging in Supabase | P3 | 1 Tag |
| 8 | Frequenz-Tracking integrieren | P3 | 1 Tag |

---

## 10. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-11 | 1.0.0 | Initiale Zielarchitektur | Subagent 20260611_5 |

---

*Ende der Zielarchitektur. Alle Änderungen an diesem Dokument sind evidence-pflichtig.*
