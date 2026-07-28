# FILE: /docs/governance/12_register/SYSTEM_SERVICE_PORT_ENDPOINT_REGISTER_V1.md
# NIR: 28.07.2026 13:18
# UPDATED: 28.07.2026 13:18
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Verbindliches Register für Service-, Port- und Kern-Endpoint-Matrix als Single Source in Phase P0-A.
# WHY: Beseitigt Dokumentationsdrift bei Integrationspfaden und konsolidiert den n8n-Widerspruch als Legacy-Ausschluss.
# BEST-PRACTICE: Eine kanonische Matrix je Service mit Status, Zweck und Integrationspfad; Legacy explizit kennzeichnen statt implizit mitschleppen.
# PITFALL: F32 bleibt ungelöst und darf nicht per Registereintrag „technisch“ aufgelöst werden.
# DEPENDS: docs/governance/GOVERNANCE.md, docs/GESAMT-INTEGRATION-STATUS.md, AGENTS.md, .cursor/rules/10-hermes-consolidation.mdc
# DOCS-REF: /docs/governance/07_audits_reports/PHASE0_VOLLINTEGRATION_BASELINE_2026-07-28.md

# System Service/Port/Endpoint Register V1

**Stand:** 2026-07-28 | **Status:** VERBINDLICH (Phase P0-A) | **Version:** 1.0.0  
**Zweck:** Kanonische Service-Matrix zur Reduktion von Port-/Service-Drift (G01) und zur normativen Konsolidierung des n8n-Widerspruchs (F33).

---

## 1. Kanonische Matrix (Single Source)

| Service | Port(s) | Kern-Endpoints / Pfade | Rolle im Zielsystem | Normstatus |
|---|---|---|---|---|
| Hermes WebUI | `:8787` | `/api/health`, `/api/files` | Zentrale Operator-Workstation / Control Plane | `ACTIVE` |
| 9Router | `:20128` | `/v1/models`, `/v1/chat/completions` | LLM-Routing + Fallback-Pfade | `ACTIVE` |
| AgentMemory API | `:3111` | `/agentmemory/health`, `/agentmemory/actions` | High-Frequency Memory (runtime) | `ACTIVE` |
| AgentMemory Viewer | `:3113` | `/memories` | Memory-Transparenz/Inspection | `ACTIVE` |
| LightRAG | `:9622` | `/health`, `/documents/*`, `/query` | Graph/Vector-Knowledge-Layer | `ACTIVE` |
| MCP-Proxy / Tool-Schnitt | `:8650` | `/api/mcp/servers`, `/api/mcp/tools` | Werkzeug- und Server-Orchestrierung | `ACTIVE` |
| Backend (1Backend/OpenAPI) | `:3100` (SOLL), laufzeitabhängig | API-Routen gemäß Backend-Service | Geschäftslogik, Integrations- und Event-Flows | `ACTIVE` |
| Dashboard | `:4001` | `/api/health`, `/api/memory` | Monitoring-/Memory-Ansicht, in WebUI zu integrieren | `ACTIVE` |
| OpenDesign | `:3002` | `/api/*` | Design-/Editor-Subsystem | `ACTIVE` |
| Prometheus | infra-abhängig | Metrics Endpoints gemäß Deployment | Telemetrie-Basis | `ACTIVE` |
| Grafana | infra-abhängig | `/api/health` | Monitoring-Visualisierung | `ACTIVE` |
| Redis | `:6379` | n/a (Redis protocol) | Cache/Queue | `ACTIVE` |
| n8n | ehem. `:5678` | ehem. Workflow/UI-Endpoints | **Kein Zielbestandteil der Hermes-Konsolidierung** | `LEGACY_AUSGESCHLOSSEN` |

---

## 2. Normative Klarstellung zu F33 (n8n)

- `AGENTS.md` und `.cursor/rules/10-hermes-consolidation.mdc` setzen n8n als **ausgeschlossen**.
- Ältere Governance-/Evidence-Referenzen mit n8n werden als **Legacy-Historie** behandelt.
- Für neue Integrationsarbeit gilt: **kein n8n-Re-Entry ohne explizites neues Mandat**.

---

## 3. Verwendungsvorgabe

Dieses Register ist bei folgenden Änderungen zwingend zu referenzieren:

1. Service-/Port-Änderungen
2. Neue Integrationsadapter (API/MCP/Webhook)
3. Monitoring-/Tracing-Anbindung
4. Phase-1/2-Umsetzungen in `apps/hermes`

Bei Abweichung ist ein Register-Update im selben Change verpflichtend.

---

## 4. Harte Grenzen (unverändert)

- **F32 bleibt eskaliert:** kein eigenständiges Auflösen der Produktionsfreigabe-Kollision durch Agenten.
- **Rollout-Grenze bleibt aktiv:** keine Live-Cutover-Änderung ohne Endabnahme.
- Dieses Register ist **dokumentarische Konsolidierung**, keine Produktionsmutation.
