# CHANGE SAFETY BASELINE EVIDENCE

> **Stand**: 2026-06-11 | **Template-Version**: 1.0 | **Dokumentiert durch**: Systemmaster

---

## 1. Baselinestatus aller geschützten Systeme

Erfasst am: **2026-06-11 11:04 Berlin**

| System | Status | Letzte bekannte Änderung | Evidence vorhanden |
|---|---|---|---|
| **9Router** | ✅ AKTIV / DRAFT | 2026-06-10 — Config erstellt | ✅ 9ROUTER_SAFE_CHANGE_EVIDENCE.md |
| **Brain/Qdrant** | ⚠️ NICHT_VERBUNDEN | Nicht geprüft | ❌ Kein Evidence |
| **agentmemory** | ⚠️ MCP_BLOCKED | 2026-06-10 — MCP-Fix versucht | ✅ AGENTMEMORY_MCP_FIX_EVIDENCE.md |
| **Oracle** | 🟢 ENTWURF | 2026-06-11 — Target Architecture erstellt | ⚠️ Nur Konzept, kein Live-Test |
| **Hermes WebUI / Workstation** | ✅ KONZEPT | 2026-06-10 — UI-Audit durchgeführt | ✅ WORKSTATION_UI_AUDIT.md |
| **Auto-Chat / User-Chat Driver** | ✅ KONZEPT / TEST | 2026-06-10 — Dry-Run + Start | ✅ GOOSE_AUTO_CHAT_DRY_RUN_EVIDENCE.md |
| **Cloudflare / Tunnel / DNS** | ✅ PLAN_VORHANDEN | 2026-06-10 — DNS-Plan | ✅ CLOUDFLARE_DNS_TARGET_STATE_V1.md |
| **Vercel** | ✅ PLAN_VORHANDEN | 2026-06-10 — Domain-Plan | ✅ VERCEL_DOMAIN_PLAN_V1.md |
| **Supabase** | ⚠️ NICHT_ANGESCHLOSSEN | Nicht geprüft | ❌ Kein Evidence |
| **Redis / Postgres** | ⚠️ NICHT_ANGESCHLOSSEN | Nicht geprüft | ❌ Kein Evidence |
| **Goose ACC** | ✅ KONZEPT | 2026-06-10 — ACC-Plan erstellt | ✅ GOOSE_ACC_CLI_PLAN_V1.md |
| **Claude Code Systemmaster** | ✅ AKTIV | Laufend — P0 in Arbeit | ✅ Diese Datei |
| **SimpleX Gateway** | ⚠️ NICHT_KONFIGURIERT | Nicht geprüft | ❌ Kein Evidence |
| **MCP Server** | 🟢 ENTWURF | 2026-06-11 — Capability Registry erstellt | ⚠️ Nur Konzept |
| **Secret-Management** | 🟢 ENTWURF | 2026-06-11 — Target Architecture erstellt | ⚠️ Nur Konzept |
| **Compression (RTK/Caveman)** | 🟢 ENTWURF | 2026-06-11 — Evaluation erstellt | ⚠️ Nur Konzept |
| **Promptmaster** | 🟢 ENTWURF | 2026-06-11 — Governance erstellt | ✅ PROMPTMASTER_GOVERNANCE_V1.md |

---

## 2. Baseline-Metriken (aktuell bekannt)

| Metrik | Wert | Quelle |
|---|---|---|
| Workspace-Dateien gesamt | 94 | `find /workspace/nexify/` |
| Sub-Agenten verfügbar | 112 | System |
| Extensions aktiv | 8 (17 Tools) | System |
| 9Router-Modelle definiert | 7 | 9ROUTER_TARGET_STATE_V1.md |
| 9Router-Default-Modell | nexifyai-combo-llm | 9ROUTER_TARGET_STATE_V1.md |
| Security-Secrets-Dateien | 10 | /workspace/nexify/07_security_secrets/ |
| Operating-Data-Dateien | 8 | /workspace/nexify/30_operating_data/ |
| MCP-Dateien | 5 | /workspace/nexify/06_mcp/ |
| Oracle-Dateien | 6 | /workspace/nexify/31_oracle/ |
| Regelwerke-Dateien | 13 | /workspace/nexify/03_regelwerke/ |
| Evidence-Dateien | 28 | /workspace/nexify/10_evidence/ |

---

## 3. Bekannte Risiken und Blockierer

| ID | Risiko | Status | Next Action |
|---|---|---|---|
| R1 | agentmemory MCP nicht verbunden | BLOCKED | MCP-Endpunkt prüfen oder alternative Konfiguration |
| R2 | Brain/Qdrant nicht verbunden | UNKNOWN | Verbindung prüfen, wenn Oracle-Migration ansteht |
| R3 | Supabase nicht angeschlossen | UNKNOWN | Für DB-geplante Systeme prüfen |
| R4 | SimpleX nicht konfiguriert | UNKNOWN | Konfiguration bei Gateway-Bedarf |
| R5 | Secret-Rotation nicht live | GEPLANT | Nach Secret-Management-Test + Approval |
| R6 | Code-Review-Plugin nicht installiert | BLOCKED | Manuellen Review-Fallback aktivieren |
| R7 | Playwright-Plugin nicht installiert | BLOCKED | Manuellen Test-Fallback aktivieren |

---

## 4. Änderungshistorie dieser Baseline

| Datum | Änderung | Autor |
|---|---|---|
| 2026-06-11 | Initiale Baseline erstellt | Systemmaster |

---

## 5. Nächster geplanter Check

**Datum**: 2026-06-12
**Verantwortlich**: Systemmaster
**Scope**: Alle Systeme mit ❌ oder ⚠️ Status
