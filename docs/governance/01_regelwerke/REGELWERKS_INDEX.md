# Regelwerks-Index — NeXify AI Systemmaster

> Stand: 2026-07-25 (aktualisiert)
> Canonical: Ja — dieser Index ist die führende Referenz.
> Governance-Pfade: `docs/governance/` ist die **Primärquelle**. Legacy-Pfade unter `nexify/` bleiben, Verweise zeigen auf kanonische Pfade.
> Charta-Auszug: `docs/governance/CHARTA.md` (§0–§16) — bestätigt Struktur, ersetzt Ordnerbaum nicht. Offener Normkonflikt: **F32**.
> Design-System: `/design_guidelines.json` — Dark/Luxury, Outfit+Manrope, bg `#0A0A0A` (verbindlich).

## Charta / Primärquelle

| Regelwerk | Kanonischer Pfad | Status |
|---|---|---|
| Governance Index (SSOT) | `docs/governance/GOVERNANCE.md` | ✅ Primärquelle |
| Charta Auszug §0–§16 | `docs/governance/CHARTA.md` | ✅ Auszug (2026-07-25) |
| Offene Fragen (inkl. F32) | `docs/governance/12_register/OFFENE_FRAGEN_REGISTER.md` | ✅ F32 OFFEN |
| Design-System | `/design_guidelines.json` | ✅ bg `#0A0A0A` |

## Claude-Code-CLI-first (P0)

| Regelwerk | Kanonischer Pfad | Legacy-Pfad | Status |
|---|---|---|---|
| Claude-Code-CLI-first | — | /workspace/nexify/09_ausfuehrungsauftraege/ | ✅ Führender Auftrag |
| Startup-Sanierung | — | /workspace/nexify/10_evidence/claude_startup/ | ✅ Abgeschlossen |
| Nicht-Interaktive Ausführung | `docs/governance/01_regelwerke/` | `/workspace/nexify/03_regelwerke/NEXIFY_NONINTERACTIVE_EXECUTION_POLICY.md` | ⏳ Noch zu erstellen |
| Autoresearch Capability | `docs/governance/01_regelwerke/` | `/workspace/nexify/03_regelwerke/NEXIFY_AUTORESEARCH_CAPABILITY_POLICY.md` | ⏳ Noch zu erstellen |

## Sicherheit

| Regelwerk | Kanonischer Pfad | Legacy-Pfad | Status |
|---|---|---|---|
| Cursor Egress Allowlist | `deploy/network/CURSOR_EGRESS_ALLOWLIST.md` (+ `.json`) | — | ✅ 2026-07-25 |
| OIDC Auth Target State | — | /workspace/nexify/07_security_auth/OIDC_AUTH_TARGET_STATE.md | ✅ Plan |
| Break-Glass-Policy | — | /workspace/nexify/07_security_auth/BREAK_GLASS_LOGIN_POLICY.md | ✅ Plan |
| Secret-Zugriffspolitik | — | /workspace/nexify/07_security_secrets/SECRET_ACCESS_POLICY.md | ✅ Existiert |
| Change Management | `docs/governance/06_sicherheit_policies/CHANGE_MANAGEMENT_POLICY_V1.md` | `/workspace/nexify/03_regelwerke/CHANGE_MANAGEMENT_POLICY_V1.md` | ✅ Neu (MA-010) |
| Incident Response | `docs/governance/06_sicherheit_policies/INCIDENT_RESPONSE_POLICY_V1.md` | `/workspace/nexify/03_regelwerke/INCIDENT_RESPONSE_POLICY_V1.md` | ✅ Neu (MA-011) |
| Backup/DR | `docs/governance/06_sicherheit_policies/BACKUP_RETENTION_FINAL_P1-005.md` | `/workspace/nexify/03_regelwerke/BACKUP_RESTORE_DR_POLICY_V1.md` | ✅ Neu (MA-012) |

## Betrieb

| Regelwerk | Kanonischer Pfad | Status |
|---|---|---|
| 9Router Betrieb | `docs/governance/02_sops/SOP_9ROUTER_OFFICIAL_DOCS_CONFIGURATION_V1.md` | ✅ Skills geladen |
| Proxy/MITM Policy | — | ✅ OFF |
| VPS Service Naming | — | ⏳ Noch zu erstellen |

## Architektur

| Regelwerk | Kanonischer Pfad | Status |
|---|---|---|
| System Blueprint | `docs/governance/09_konzepte/NEXIFY_AI_OS_GESAMTKONZEPT_KONSOLIDIERT_V1.md` | ✅ Vorhanden |
| Research: AFlow (ICLR 2025 Oral) | `docs/research/AFLOW_OPENREVIEW_z5uVAKwmjf.md` | ✅ 2026-07-25 |
| FlowSearch Synthesis (AFlow/ADAS) | `docs/research/AFLOW_ADAS_NEXIFY_SYNTHESIS.md` | ✅ 2026-07-25 |
| Operator Register v1 | `docs/research/operators/NEXIFY_OPERATOR_REGISTER_V1.json` | ✅ 2026-07-25 |
| FlowSearch Package | `backend/flowsearch/` | ✅ Offline MCTS |
| Knowledge Source Register | `docs/governance/12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md` | ✅ VERBINDLICH |
| FlowSearch Nutzungspflicht SOP | `docs/governance/02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md` | ✅ VERBINDLICH |
| FLOWSEARCH_KNOWLEDGE_FIRST Regel | `docs/governance/01_regelwerke/FLOWSEARCH_KNOWLEDGE_FIRST_REGEL_V1.md` | ✅ Aktiv |
| Source/Repo/Plugin/CLI Register | `docs/governance/12_register/NEXIFY_CAPABILITY_MCP_SOURCE_REGISTER.md` | ✅ Vorhanden |
| Dependency/Flow Map | — | ⏳ Wird erstellt |
| Real Progress Gate | `docs/governance/10_quality_gates/REAL_PROGRESS_GATE_V1.md` | ✅ Neu (MA-015) |

## Kundenprojekte

| Regelwerk | Kanonischer Pfad | Status |
|---|---|---|
| Kundenprojekt-Isolation | `docs/governance/06_sicherheit_policies/TENANT_ISOLATION_POLICY_V1.md` | ✅ Neu (MA-003) |
| Datenklassifikation | `docs/governance/06_sicherheit_policies/DATENKLASSIFIKATION_POLICY_V1.md` | ✅ Neu (MA-005) |

## Memory

| Regelwerk | Kanonischer Pfad | Status |
|---|---|---|
| agentmemory/claude-mem/Brain Integration | `docs/governance/02_sops/SOP_BRAIN_FIRST_AGENTMEMORY_WISSENSSICHERUNG_V3.md` | ✅ Neu |
| agentmemory Sync Final | `docs/governance/08_evidence/AGENTMEMORY_MCP_FIX_EVIDENCE.md` | ✅ READY_FOR_NEXT_SESSION |
| agentmemory/Claude/Goose Sync | — | ⏳ Noch zu erstellen |

## Agenten

| Regelwerk | Kanonischer Pfad | Status |
|---|---|---|
| Agent Registry | `docs/governance/12_register/KANBAN_TASK_REGISTER_V4_FINAL.md` | ✅ Core + On-Demand |
| Goose Fallback | — | ✅ Fallback |
| 9Remote Security | — | ✅ Plan |
