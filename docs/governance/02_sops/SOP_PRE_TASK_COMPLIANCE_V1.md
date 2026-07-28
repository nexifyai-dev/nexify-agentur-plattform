# FILE: /docs/governance/02_sops/SOP_PRE_TASK_COMPLIANCE_V1.md
# NIR: 20.06.2026
# UPDATED: 27.07.2026 12:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Definiert die portablen Pre-Task-Compliance-Gates.
# WHY: Governance-Prüfungen müssen im VPS-Workspace und in Git-Clones identisch gelten.
# BEST-PRACTICE: Repository-Pfade automatisch erkennen und Runtime-Pfade überschreibbar halten.
# PITFALL: V-GATE-01: VPS-spezifische Pfade dürfen keine falschen Gate-Fehler erzeugen.
# DEPENDS: PRE_TASK_CHECKLIST_AUTOMATION.sh, AgentMemory, Shared Agent State
# DOCS-REF: docs/governance/GOVERNANCE.md
# SESSION: copilot-cli-6ad64251

# SOP: PRE-TASK COMPLIANCE (7 Gates)
> **Pre-Task Phase (SOUL.md 3-Phase Model)**
> **Version:** 1.0 — 2026-06-20  
> **Status:** AKTIV  
> **Owner:** network-engineer (Hermes Agent System)

## 1. Zweck

Automatisierte Sicherstellung aller sieben Pre-Task-Bedingungen vor jeder Aufgabe.
Beseitigt Compliance-Lücke (bisher 0/6).

## 2. Die 7 Gates

| Gate | Prüfung | Automatisierung | Fehler-Fix |
|------|---------|-----------------|------------|
| G01 | Aufgabenverständnis (CLAUDE.md) | `test -r CLAUDE.md` | CLAUDE.md erstellen |
| G02 | Zieldefinition (MASTER_PLAN.md) | Governance-Masterplan im Repo prüfen | MASTER_PLAN.md erstellen |
| G03 | Kontext-Prüfung | Shared Agent State + AgentMemory Health | AgentMemory/State reparieren |
| G04 | Umgebungserkennung | `which python3 curl git` | Fehlende Tools installieren |
| G05 | Skills + Memory | bekannte Skill-Verzeichnisse auf `SKILL.md` prüfen | Skill-Index laden |
| G06 | Tenant-Trennung | Isolation-Policy + optionale Runtime-Kundenpfade prüfen | Isolation prüfen |
| G07 | FlowSearch Knowledge | Knowledge-Mandate-Skript ausführen | Knowledge-Integration reparieren |

## 3. Ausführung

```bash
# Manuell
bash docs/governance/03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh

# Output: 0 = alle grün, 1+ = Gate-Fail(s)
# Report: VPS-Evidence-Pfad oder $TMPDIR/nexify-pre-task-evidence/
```

## 4. Integration in Agent Workflow

Jeder Hermes-Agent ruft vor Task-Beginn:
1. `skill_view(name='environment-reconnaissance')` — Umgebung scannen
2. `bash PRE_TASK_CHECKLIST_AUTOMATION.sh` — 6 Gates prüfen
3. Bei FAIL: Fix laut Spalte "Fehler-Fix" ausführen
4. Erst bei 7/7 grün: Task beginnen

## 5. Audit

- Intervall: Bei jedem neuen Hermes-Session-Start
- Evidence: `/workspace/nexify/10_evidence/pre_task/`
- Bei 3+ aufeinanderfolgenden FAIL: Eskalation an CEO
