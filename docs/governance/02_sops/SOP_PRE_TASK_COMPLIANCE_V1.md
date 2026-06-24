# SOP: PRE-TASK COMPLIANCE (6 Gates)
> **Pre-Task Phase (SOUL.md 3-Phase Model)**
> **Version:** 1.0 — 2026-06-20  
> **Status:** AKTIV  
> **Owner:** network-engineer (Hermes Agent System)

## 1. Zweck

Automatisierte Sicherstellung aller 6 Pre-Task-Bedingungen vor jeder Aufgabe.
Beseitigt Compliance-Lücke (bisher 0/6).

## 2. Die 6 Gates

| Gate | Prüfung | Automatisierung | Fehler-Fix |
|------|---------|-----------------|------------|
| G01 | Aufgabenverständnis (CLAUDE.md) | `test -r CLAUDE.md` | CLAUDE.md erstellen |
| G02 | Zieldefinition (MASTER_PLAN.md) | `test -r MASTER_PLAN.md` | MASTER_PLAN.md erstellen |
| G03 | Kontext-Prüfung (Brain API) | `curl brain.nexifyai.cloud/health` | Brain-Service neustarten |
| G04 | Umgebungserkennung | `which python3 curl git` | Fehlende Tools installieren |
| G05 | Skills + Memory | `ls ~/.hermes/skills/*/SKILL.md` | Skill-Index laden |
| G06 | Tenant-Trennung | `ls /workspace/customers/` | Isolation prüfen |

## 3. Ausführung

```bash
# Manuell
bash /workspace/nexify/03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh

# Output: 0 = alle grün, 1+ = Gate-Fail(s)
# Report: /workspace/nexify/10_evidence/pre_task/PRE_TASK_AUDIT_*.md
```

## 4. Integration in Agent Workflow

Jeder Hermes-Agent ruft vor Task-Beginn:
1. `skill_view(name='environment-reconnaissance')` — Umgebung scannen
2. `bash PRE_TASK_CHECKLIST_AUTOMATION.sh` — 6 Gates prüfen
3. Bei FAIL: Fix laut Spalte "Fehler-Fix" ausführen
4. Erst bei 6/6 grün: Task beginnen

## 5. Audit

- Intervall: Bei jedem neuen Hermes-Session-Start
- Evidence: `/workspace/nexify/10_evidence/pre_task/`
- Bei 3+ aufeinanderfolgenden FAIL: Eskalation an CEO
