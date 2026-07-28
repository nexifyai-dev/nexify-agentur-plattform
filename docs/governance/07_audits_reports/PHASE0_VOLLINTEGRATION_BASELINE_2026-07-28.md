# FILE: /docs/governance/07_audits_reports/PHASE0_VOLLINTEGRATION_BASELINE_2026-07-28.md
# NIR: 28.07.2026 13:10
# UPDATED: 28.07.2026 13:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Phase-0-Baseline für Vollintegration mit SOLL/IST-Matrix, Konfliktliste und priorisierten Umsetzungsblöcken.
# WHY: Startpunkt für die schrittweise Master-Direktive ohne Annahmen, auf Basis der Primärquellen.
# BEST-PRACTICE: Erst normativ konsolidieren (SOLL/IST), dann phasenweise umsetzen und je Phase evidenzbasiert validieren.
# PITFALL: F32/F33-Normkonflikte und n8n-Widerspruch nicht implizit auflösen, sondern explizit steuern.
# DEPENDS: docs/governance/**, design_guidelines.json, apps/hermes/ROADMAP.md, docs/GESAMT-INTEGRATION-STATUS.md, docs/governance/12_register/SYSTEM_SERVICE_PORT_ENDPOINT_REGISTER_V1.md
# DOCS-REF: /docs/governance/GOVERNANCE.md

# Phase 0 — Vollintegration Baseline (SOLL/IST)

> **Stand:** 2026-07-28  
> **Status:** VERBINDLICHE ARBEITSBASIS (Phase 0)  
> **Scope:** ausschließlich `nexifyai-dev/nexify-agentur-plattform`

---

## 1) Primärquellen-Stack (verbindlich)

1. `docs/governance/` + `docs/governance/GOVERNANCE.md` (Primärquelle)
2. `docs/governance/CHARTA.md` (bestätigter Auszug, nicht Ersatz)
3. `design_guidelines.json` (verbindliches UI/Brand-System)
4. `.cursor/rules/10-hermes-consolidation.mdc` + `AGENTS.md` (Hermes-Workstation-Auftrag)
5. `docs/GESAMT-INTEGRATION-STATUS.md` + `apps/hermes/ROADMAP.md` (aktueller IST-Stand)

---

## 2) Einheitliche SOLL/IST-Zielmatrix

| Bereich | SOLL | IST | Gap | Priorität |
|---|---|---|---|---|
| Governance-Rangfolge | Entscheidungen auf Primärquelle `docs/governance/` | Rangfolge dokumentiert und bestätigt | Kein technischer Gap, aber Drift-Risiko zwischen alten Reports und neueren Evidence-Dateien | P1 |
| Zentrale WebUI | Eine zentrale Arbeitsumgebung auf Hermes-WebUI, keine Fragmentierung | Hermes-WebUI ist stark ausgebaut, aber Integrationsflächen sind nicht als einheitliche Control Plane standardisiert | Fehlende konsistente Operator-Flüsse (Monitoring/Execution/Memory zentral zusammengeführt) | P0 |
| Native Integration | 9Router, AgentMemory, LightRAG, Backend/OpenMCP/OpenAPI ohne Iframes | Dienste sind einzeln vorhanden, aber Integrationspfade/Adapter heterogen dokumentiert | Keine einheitliche Adapter-/Fehler-/Health-Norm für alle Kernschnittstellen | P0 |
| Memory + RAG | Gekoppelte Hybrid-Schicht mit semantischem Cache | AgentMemory/LightRAG sind aktiv, Kopplung und Cache-Layer nicht als Standard definiert | Fehlende verbindliche Integrations-Spezifikation (Retrieval-Flow + Cache + Fehlermodi) | P0 |
| Resilienz + Tracing | Fallback-Kaskaden, Retry/Backoff, E2E-Observability/Tracing | Teilweise vorhanden, aber nicht als durchgehender Standard über alle Dienste | Fehlende Ende-zu-Ende-Norm inkl. Security-/PII-Guardrails pro kritischem Pfad | P1 |
| CI/CD + Repo-Sync | Mono-Repo als Single Source mit synchroner Governance/Automation | GitHub/GitLab-Mirror und Register existieren | Drift zwischen Dokumentenstand, Evidence und Runtime möglich | P1 |
| Rollout-Grenze | Isolierte Umsetzung; Live-Cutover erst nach Endabnahme | Governance fordert Produktionsfreigabegrenze | Muss in jeder Umsetzungsphase explizit als Hard-Gate geführt werden | P0 |

---

## 3) Explizite Konflikt- und Gap-Liste (Phase-0-Kern)

| ID | Konflikt / Gap | Quelle A | Quelle B | Behandlung |
|---|---|---|---|---|
| F32 | Autonomie vs. Produktionsfreigabe | `CHARTA.md` §8 (Autonomie) | `GOVERNANCE.md` §2.2 + `OFFENE_FRAGEN_REGISTER.md` F32 | **Nicht selbst auflösen**, als eskalierter Hard-Blocker führen |
| F33 | n8n-Widerspruch (integriert vs. ausgeschlossen) | `GOVERNANCE.md` Service-Matrix/Evidence mit n8n | `AGENTS.md` + Hermes-Konsolidierung: n8n abgeschafft | Normativ auf „ausgeschlossen“ konsolidieren und Alt-Referenzen als Legacy markieren |
| G01 | Port-/Service-Drift in Integrationsdokumenten | ältere/abweichende Auditstände | aktuelle Integrationsstatus-Dokumente | Service-Quellen harmonisieren, eine verbindliche Port-/Endpoint-Matrix definieren |
| G02 | Uneinheitliche Integrationsadapter | diverse Einzelpfade je Dienst | Ziel „Single Control Plane“ | Adapter-/Health-/Error-Standard als gemeinsame Integrationsnorm definieren |
| G03 | Fehlende zentrale Sicht auf Tool-Execution + Monitoring + Memory | vorhandene Einzelflächen | Ziel „nahtlose Dashboard-Synthese“ | UI- und API-Orchestrierung als priorisierter Block umsetzen |

---

## 4) Priorisierte Umsetzungsblöcke (direkte Folge auf Phase 0)

### Block P0-A — Normative Konsolidierung (sofort)
- F33 dokumentiert schließen: n8n als ausgeschlossene Komponente behandeln, Legacy-Doku markieren.
- Eine verbindliche Service-/Port-/Endpoint-Matrix als Single Source erstellen (**erfüllt** via `docs/governance/12_register/SYSTEM_SERVICE_PORT_ENDPOINT_REGISTER_V1.md`).
- F32 als fortlaufender Hard-Gate in allen Folgephasen referenzieren.

### Block P0-B — Control-Plane-Schnitt (Phase 1 Start)
- Hermes-WebUI als zentrale Operator-Fläche mit konsistenter Navigation für:
  - Runtime-Status,
  - Tool-Execution,
  - Monitoring,
  - Memory/RAG-Zugriffe.
- Keine Iframe-basierte Integration.

### Block P0-C — Integrationsstandard (Phase 2 Start)
- Einheitliches Schema für Adapter, Health, Events, Fehlermeldungen und Fallback-Verhalten.
- Gültig für 9Router, AgentMemory, LightRAG, Backend/OpenMCP/OpenAPI.

### Block P1-D — Resilienz/Tracing/Security-Basis (Phase 3)
- Mindeststandard für Retry/Backoff, asynchrone Entkopplung und End-to-End-Transparenz.
- Guardrails für I/O, PII und Sandbox-Ausführung als Pflichtkontrollen.

### Block P1-E — Automation/Governance-Sync (Phase 4)
- Hook-/Webhook-/CI-Pfade gegen Automation-Register synchronisieren.
- Evidence- und Register-Update als Pflichtbestandteil jeder Integrationsänderung.

### Block P0-F — Isolierter Rolloutpfad (Phase 5)
- Umsetzungswellen nur isoliert; Produktions-Cutover ausschließlich nach Endabnahme.
- Quality-Gates je Welle als Abbruchkriterium bei Abweichungen.

---

## 5) Definition of Done für Phase 0

- [x] Primärquellen-Stack eindeutig festgelegt
- [x] Einheitliche SOLL/IST-Matrix erstellt
- [x] Explizite Konflikt- und Gap-Liste erstellt (inkl. F32 und n8n-Widerspruch)
- [x] Priorisierte Umsetzungsblöcke für Folgephasen definiert
- [x] Scope-Grenze und Rollout-Grenze als Hard Constraints dokumentiert

---

## 6) Nächster operativer Schritt

Weiter mit **Block P0-A Rest**: Legacy-Verweise auf n8n in Governance-/Evidence-Dokumenten systematisch markieren, danach **Block P0-B** als erster technischer Integrationsschnitt in `apps/hermes`.
