# NeXify AI — Normen- und Compliance-System
> Version: 1.0 | Stand: 23.06.2026
> Erstellt nach DIN, DIN EN ISO, ISO/IEC, BSI, CEN/CENELEC, EU-Regelwerken
> Scope: NeXify AI by NeXify — AI-/Automatisierungsagentur, SaaS, autonome Agenten

## Übersicht

| Bereich | Dateien | Normen |
|---------|---------|--------|
| **Kernregister** | NORMENREGISTER.md / .yaml | 19 Normen P0-P3 + 10 ausgeschlossene |
| **Controls** | CONTROL_CATALOG.yaml | 46 maschinenlesbare Controls |
| **Verbote & Regeln** | VERBOTE_UND_PFLICHTREGELN.md | 10 Verbote, 20 Regeln, 8 Erlaubnisse |
| **Policies (6)** | SECURITY / AI_GOVERNANCE / PRIVACY / SOFTWARE / DELIVERY / TESTPLAN | ISO 27001, 42001, 27701, 12207, 9001 |
| **Runbooks (2)** | INCIDENT_RESPONSE / BUSINESS_CONTINUITY | ISO 27001 A.16, ISO 22301 |
| **Register (2)** | SUPPLIER_AND_TOOL / AUDIT_EVIDENCE | ISO 27001 A.14, ISO 27701 |
| **Backlog** | IMPLEMENTATION_BACKLOG | P0:21, P1:15, P2:10 |
| **CI/CD Gates** | CICD_COMPLIANCE_GATES | Pre-Merge, Pre-Deploy, Cron, DoD |
| **Agent Prompts** | AGENT_PROMPT_EXTENSION | Norm-Based Execution Directive |
| **Scope** | sCOPE_PROFIL | Systeme, Daten, Rollen |

## Normen-Priorität

```
P0 ████████████  ISO 27001, 27002, 27701, 42001, 23894  (Security, Privacy, AI)
P1 ████████     ISO 9001, 20000, 22301, 31000, 37301, 25010, 12207  (Qualität, Service, Software)
P2 ████         DIN 9241, 69901, 5008, EN 301549  (UX, PM, Doku, Barrierefreiheit)
P3 ██           BSI IT-Grundschutz, ISO 26000  (Optional)
```

## Normen-Betriebssystem (Architektur)

```
NORMENREGISTER → CONTROL_CATALOG → VERBOTE → POLICIES → CI/CD GATES
     ↓               ↓                ↓          ↓            ↓
  Brain (AI)    Brain (AI)      Agent-Prompt  Agent-Env     Git-Hook
  RAGFlow       RAGFlow         Kanban        Kanban        Cron
```

## Sync-Status

| System | Status | Details |
|--------|--------|---------|
| Brain (nexifyai_brain) | ✅ 21 Einträge | governance, compliance, security, ai, privacy, quality, resilience, evidence |
| RAGFlow (Governance) | ✅ Upload | 20 Norm-Dokumente |
| RAGFlow (System Arch) | ✅ Upload | 4 Security-Dokumente |
| RAGFlow Datasets | ✅ | embd_id auf 15 Datasets gesetzt |
| Dateien (10_evidence) | ✅ 22 Dateien | policies, registers, runbooks, backlog, gates |

## Nächste Schritte (aus Backlog)

1. Asset-Inventar + Zugriffsmatrix implementieren
2. AI-Systeminventar + Risikoklassifizierung
3. AVV mit allen Lieferanten abschließen
4. Incident-Response-Prozess beüben
5. Backup-Restore-Test automatisieren
