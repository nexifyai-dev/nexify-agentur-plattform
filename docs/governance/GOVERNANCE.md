# NeXify AI — Governance & Betriebsabläufe

> **Single Source of Truth für alle Regelwerke, SOPs, Policies, Workflows und Produktionsabläufe.**
> Alle Dateien unter `docs/governance/` sind verbindlich für jeden Agenten und Entwickler.

---

## 0. Charta §0–§16 — Geltungsbereich

**Primärquelle:** dieser Ordnerbaum (`docs/governance/`). Der vereinfachte Betriebsauszug liegt in [`CHARTA.md`](./CHARTA.md) (bestätigt §0–§13; ergänzt §14–§16). Bei Konflikt gilt dieser Ordnerbaum, nicht der Chat-Auszug.

| Charta | Governance-Ordner | Zweck |
|--------|------------------|-------|
| §0 Geltungsbereich | gesamtes System | VPS-Gesamtsystem / Kundenprojekt / NeXifyAI-Projekt |
| §1 Auftrag & Datenbasis | `01_regelwerke/` | Server-, Festplatten-, Netzwerk-, Prozess-, Logdaten |
| §2 Vollprüfung SOLL/IST | `02_sops/`, `07_audits_reports/` | Lückenlose Prüfung, Abweichungsanalyse, Fix |
| §3 Integrationsprinzip | `04_workflows/` | API, MCP, Webhooks vollständig integriert |
| §4 Propagationspflicht | alle Ordner | Standards fließen bei jeder Änderung neu ein |
| §5 Fach-/Governance-Ebene | `01_regelwerke/`, `02_sops/` | Fachexperten-Agenten verwalten Regelwerke |
| §6 Agenten-Architektur | `11_fuehrung/` | Spezialagenten pro Bereich |
| §7 Wissens-/Gedächtnisschicht | `08_evidence/`, `12_register/` | AgentMemory + LightRAG zentral |
| §8 Autonomie & Rückfragegrenzen | `11_fuehrung/` | Volle Autonomie, protokollierte Änderungen — ⚠️ siehe §16 / **F32** |
| §9 Betriebsrahmen | `13_betriebshandbuch/` | Live-Terminal, Deutsch, Best-Practice |
| §10 Modellstrategie | `09_konzepte/` | Upstage + DeepSeek, gestaffelte Migration |
| §11 Monitoring | `07_audits_reports/`, `14_production/` | Durchgehende Überwachung aller Komponenten |
| §12 Circuit Breaker | `12_register/` | Budget-/Iterationsgrenzen, Notabschaltung |
| §13 Arbeitsweise | `10_quality_gates/` | Verifikation vor Übernahme, Ehrlichkeit |
| §14 Pre-Task-Gates | `03_checklisten/`, `02_sops/SOP_PRE_TASK_COMPLIANCE_V1.md` | BRAIN_FIRST … TENANT_ISOLATION (+ FLOWSEARCH_KNOWLEDGE) |
| §15 Design-System | `/design_guidelines.json` | Dark/Luxury, Outfit+Manrope, Background `#0A0A0A` |
| §16 Primärquellen-Rang + offene Konflikte | `CHARTA.md` §16, `12_register/OFFENE_FRAGEN_REGISTER.md` | Auszug ≠ Ersatz; **F32** Eskalation |

---
## 1. Verzeichnisstruktur

| Verzeichnis | Inhalt | Anzahl |
|-------------|--------|--------|
| `01_regelwerke/` | Kern-Regeln, Verbote, Pflichtregeln, Normenregister | 14 |
| `02_sops/` | Standard Operating Procedures inkl. Register | 16 |
| `03_checklisten/` | Pre-Task, Post-Go-Live, Compliance, Quality-Checklisten | 11 |
| `04_workflows/` | Dispatcher, Automation, Health-Workflows | (referenziert) |
| `05_masterplan/` | Masterplan, Pascal-Arbeitsweise, Bolt-Integration | 6 |
| `06_sicherheit_policies/` | Security, Tenant-Isolation, Change-Management, DR | 20 |
| `07_audits_reports/` | System-Audits, Deviation-Reports, Voll-Scans | 12 |
| `08_evidence/` | Integration-Evidence, Templates, Compliance-Nachweise | 12 |
| `09_konzepte/` | Pflichtenheft, Brand-Konzept, OS-Gesamtkonzept | 5 |
| `10_quality_gates/` | Production-Gates, HITL-Gate, CI-CD-Compliance | 11 |
| `11_fuehrung/` | Governance-Rules, Agent-Governance, Promptmaster | 7 |
| `12_register/` | Shared-Agent-State, MCP-Health, Kanban, Cron-Register | 14 |
| `13_betriebshandbuch/` | Betriebsanleitung V3, Normalbetrieb, SOP V5 | 6 |
| `14_production/` | Production-Skripte, Docker-Compose, Cron-Register | 5 |

**Gesamt: 139 Governance-Dokumente**

---

## 2. Verbindliche Regeln (Kurzform)

### 2.1 Prä-Task-Compliance (6 + 1 Gates)

Vor JEDER Aufgabe müssen die 6 Basis-Gates grün sein; bei agentischen Workflows zusätzlich Gate 7:

1. **BRAIN_FIRST** — Brain-Query vor jeder Änderung
2. **DOCS_FIRST** — Offizielle Docs vor Tool-Config (inkl. DOC-018–020 / Knowledge Register)
3. **SHARED_STATE** — Shared Agent State konsultiert
4. **PRE_TASK_CHECKLIST** — Skript ausgeführt
5. **SECRET_SCAN** — Keine Secrets in Config/Code
6. **TENANT_ISOLATION** — Kundenprojekte isoliert
7. **FLOWSEARCH_KNOWLEDGE** — **Nutzungspflicht** bei Workflow-/Agent-Design: Knowledge Register + Operator-Register + FlowSearch-Abgleich (oder Waiver)

Siehe: `03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh` · `02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md` · `12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md`

### 2.2 Verbindliche Verbote

Siehe: `01_regelwerke/VERBOTE_UND_PFLICHTREGELN_V2.md`

- **ECC VERBOTEN** — kein Pro-Account, kein Paid-Upgrade
- **Kein Secret im Code** — API-Keys nur in env (mode 600)
- **Kein blinder Write** — Lesen vor Schreiben
- **Kein Fake-Done** — Evidence verpflichtend
- **Kein interaktiver Eingriff** in Produktionsprozesse ohne Freigabe  
  ⚠️ **NORMKONFLIKT F32 (ungeklärt):** widerspricht Charta §8 („volle Autonomie… wartet auf niemanden“) und eng verwandt mit Verbot **V08**. **Nicht selbst auflösen — Eskalation CEO/CTO.** Siehe `CHARTA.md` §16 und `OFFENE_FRAGEN_REGISTER.md` F32.

### 2.3 Post-Go-Live-Checkliste

Siehe: `03_checklisten/POST_GOLIVE_CHECKLISTE.md`

- [ ] Health-Check alle Endpunkte
- [ ] DNS-Auflösung verifiziert
- [ ] TLS-Zertifikat aktiv
- [ ] Backup erstellt
- [ ] Monitoring aktiv
- [ ] Rollback-Plan dokumentiert

---

## 3. System-Port-Matrix (SOLL)

| Komponente | Port(s) | Typ | Status SOLL |
|---|---|---|---|
| Paperclip (Factory) | 3100 | Control Plane | ✅ 200 |
| Hermes Agent (Headroom) | 8787 | Runtime + Gateway | ✅ 200 |
| Hermes Agent (Gateway) | 8642 | CLI/Telegram/Cron | ✅ |
| Hermes Dashboard | 9119 | Monitoring | ✅ |
| 9Router | 20128 | LLM-Router | ✅ |
| agentmemory API | 3111 | Memory REST | ✅ |
| agentmemory Viewer | 3113 | Node-Viewer | ✅ |
| LightRAG | 9621 | Vektor-Suche | ✅ |
| Spaether | 8900 | Monitoring | ✅ |
| n8n | 5678 | Automation | ✅ |
| Traefik | 80/443 | Reverse Proxy | ✅ |
| Portainer | 9000/9443 | Container-Mgmt | ✅ |
| GitLab | 8081/8929/22 | DevOps | ✅ |
| Nexify Proxy | 32768 | Proxy | ✅ |
| Redis | 6379 | Cache | ✅ |

Siehe: `08_evidence/SYSTEM_INTEGRATION_EVIDENCE_2026-07-13.md`

---
## 4. Produktionsablauf (Production Pipeline)

```
┌─────────────────────────────────────────────────────────┐
│  1. Entwicklung (Feature-Branch)                         │
│     ├─ Pre-Task 6 Gates                                  │
│     ├─ Brain-First Query                                  │
│     ├─ Code + Tests                                      │
│     └─ Docs sync                                         │
├─────────────────────────────────────────────────────────┤
│  2. Pull Request                                         │
│     ├─ GitHub Actions: Build (3 Images)                  │
│     ├─ Smoke-Test (Docker Health)                        │
│     └─ Code Review (Human/AI Gate)                       │
├─────────────────────────────────────────────────────────┤
│  3. Merge → Main                                         │
│     ├─ Auto-Deploy via SSH                                │
│     ├─ docker compose pull                               │
│     ├─ docker compose up -d --remove-orphans             │
│     └─ Traefik Dynamic-Config reload                     │
├─────────────────────────────────────────────────────────┤
│  4. Post-Deploy Verification                             │
│     ├─ health-check.sh (7 Endpoints)                     │
│     ├─ Internal: localhost:{3000,8787,3100}               │
│     ├─ External: {nexifyai,webui,app}.nexifyai.cloud      │
│     └─ Rollback bei Failure                              │
├─────────────────────────────────────────────────────────┤
│  5. Normalbetrieb                                        │
│     ├─ Monitoring (Prometheus/Grafana)                   │
│     ├─ Cron-Jobs (Healthchecks, Backups)                 │
│     ├─ Evidence-Sicherung (Brain/Qdrant/Agentmemory)      │
│     └─ Incident-Response (SOP)                           │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Modellstrategie (§10)

| Modell | Status | Strategie |
|--------|--------|-----------|
| DeepSeek V4 (flash/chat/pro/pro-max/pro-none/reasoner) | ✅ Bestehen + Vollintegriert | Primär-Router über 9Router :20128 |
| Upstage (alle Modelle) | ⏳ Migration geplant | Gestaffelter Ersatz, Validierung pro Modell |
| GitHub Models (GPT-4o, GPT-5-mini, Claude-Haiku, MAI-Code) | ⏳ Zu ersetzen | Ersatz durch Upstage, Rückfallebene DeepSeek |
| CX Models (GPT-5.x) | ⏳ Zu ersetzen | Ersatz durch Upstage |
| Claude-Chat (Sonnet/Opus/Haiku) | ⏳ Zu ersetzen | Ersatz durch Upstage |

**Cost-Brake:** Budget >150% → Task-Abbruch. >200% → P0-Escalation.
Siehe: [`12_register/FINANCE_COST_VALUE_MARGIN_REGISTER.md`](12_register/FINANCE_COST_VALUE_MARGIN_REGISTER.md)

---

## 6. Monitoring & Audit-Zyklus (§11)

### Kontinuierlich (pro Agent-Turn)
| Prüfung | Trigger | Werkzeug |
|---------|---------|----------|
| Pre-Task 6 Gates | Jeder Task | `03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh` |
| Secret-Scan | Vor jedem Commit | `.pre-commit-config.yaml` |
| Charta-Deviation-Scan | Jeder Zyklus (dieses Dokument) | Vollprüfung §2 |

### Wöchentlich (Montag)
- Voll-Scan in `07_audits_reports/`
- Memory-Audit (Agentmemory + Qdrant)
- Backup-Verifikation

### Monatlich
- Deviation-Audit (expert-dev)
- Design-Quality-Gate (expert-design)
- Security-Audit (CISO-Profil)
- FinOps-Review (CFO-Profil)

---

## 7. Betriebsablauf (Daily/Weekly/Monthly)

### 7.1 Täglich

| Zeit | Aktion | Skript/Tool |
|------|--------|-------------|
| 06:00 | System-Health-Check | `infra/scripts/health-check.sh` |
| 06:15 | Brain-Sync prüfen | `12_register/SHARED_AGENT_STATE.json` |
| 06:30 | Cron-Job-Status | `12_register/AUTOMATION_CRONREGISTER_V1.md` |
| 18:00 | Daily-Report | `07_audits_reports/` |

### 7.2 Wöchentlich

| Tag | Aktion |
|-----|--------|
| Mo | Voll-Scan + Charta-Deviation-Scan |
| Mi | Memory-Audit (Agentmemory + Qdrant) |
| Fr | Backup-Verifikation |

### 7.3 Monatlich

| Aktion | Verantwortlich |
|--------|---------------|
| Deviation-Audit | expert-dev |
| Design-Quality-Gate | expert-design |
| Security-Audit | CISO-Profil |
| FinOps-Review | CFO-Profil |

---

## 8. Incident-Response

Siehe: `06_sicherheit_policies/INCIDENT_RESPONSE_POLICY_V1.md`

| Severity | Response-Zeit | Eskalation |
|----------|--------------|------------|
| **P0** (Service Down) | < 5 Min | CEO + CTO sofort |
| **P1** (Degraded) | < 15 Min | CTO + DevOps |
| **P2** (Minor) | < 1 Std | DevOps |
| **P3** (Cosmetic) | Next Sprint | Standard |

### §12 Circuit Breaker
| Level | Maßnahme |
|-------|----------|
| <50% Budget | Normalbetrieb |
| 50-80% | Cost-Warning (Event-Bus) |
| 80-100% | Fallback günstigeres Modell |
| 100-150% | Task P2, Prüfung optional |
| >150% | **Task-Abbruch** |
| >200% | **P0-Escalation** |

---

## 9. Quality-Gate-Hierarchie

```
Pre-Task Gate (6 Checks)
    ↓
Build Gate (Docker Build + Lint)
    ↓
Smoke Gate (Container Health)
    ↓
HITL Gate (Human-in-the-Loop Review)
    ↓
Deploy Gate (VPS Health-Check)
    ↓
Post-Go-Live Gate (24h Observance)
    ↓
Normalbetrieb Gate (Continuous Monitoring)
```

Siehe: `10_quality_gates/BOUNDARY_ENFORCEMENT_GATES_V1.md`

---

## 10. Agenten-Orchestrierung

Siehe: `11_fuehrung/DOS_AGENT_GOVERNANCE.md`

| Rolle | Profil | Kern-Verantwortung |
|-------|--------|-------------------|
| CEO | `ceo` | Orchestrierung, Freigaben, Eskalation |
| CTO | `cto` | Architektur, Code-Review, Tech-Entscheidungen |
| CISO | `ciso` | Security-Audit, Tenant-Isolation, Secrets |
| COO | `coo` | Betriebsabläufe, SLA, Monitoring |
| DevOps | `automation-agent` | CI/CD, Deploy, Health-Checks |
| Dev | `expert-dev` | Full-Stack-Entwicklung, Code, Tests |
| Design | `expert-design` | UI/UX, Design-System, Brand-Consistency |
| QA | `expert-qa` | Test-Automatisierung, Evidence, Abnahme |

---

*Alle Dokumente unter `docs/governance/` sind versioniert und verbindlich. Bei Widerspruch gilt: Live-System schlägt alter Doku. Aktuellste Version im Git-Repo schlägt Kopie. `CHARTA.md` ist bestätigter Auszug — Primärquelle bleibt dieser Ordnerbaum (§16). Design-System: `design_guidelines.json` (`#0A0A0A`, Outfit/Manrope). Offener Normkonflikt: F32.*
