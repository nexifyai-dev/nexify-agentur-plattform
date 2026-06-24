# NeXify AI — Goose Automations-Regeln

> **Version:** 1.0.0  
> **Status:** VERBINDLICH  
> **Letztes Audit:** 2026-06-10  
> **Gültigkeit:** Ab sofort für Goose-Auto-Chat-Sessions

---

## 0. Geltende Grundregeln (aus GOOSE.md)

| Regel | Kurzform |
|-------|----------|
| **Brain-First** | Vor jeder Aktion: Brain/agentmemory/Pending konsultieren |
| **Skill-First** | Skills vor Arbeitsbeginn laden |
| **Memory-Pflicht** | agentmemory ist zentrale Memory-Schicht |
| **Policy Gate** | Prüfung vor jeder Dispatch-/Produktiv-Aktion |
| **Evidence-Pflicht** | Jede Aktion produziert Evidence |
| **Fake-Done-Verbot** | Nur DONE melden, wenn wirklich fertig |
| **Keine Secrets** | Kein API-Key/Token/Passwort in Logs/Docs/Chat |
| **Positive Surprise** | Sinnvolle Zusatzverbesserungen mitliefern |

## 1. Auto-Chat-Rahmen

```text
MODUS: SAFE_INTERNAL_SUPERVISED
POLICY_GATE: ON
LOOP_GUARD: ON
EVIDENCE: ON
```

## 2. Automations-Erlaubnis

| Aktion | Erlaubt | Begründung |
|--------|---------|------------|
| Dateien lesen | ✅ Immer | `cat`, `tree`, `rg`, `find`, `ls` |
| Analysieren | ✅ Immer | `analyze`, Code-Review |
| Dokumentation schreiben | ✅ Immer | Markdown, Register, Docs |
| Evidence schreiben | ✅ Immer | `/workspace/nexify/10_evidence/` |
| Pending-Dateien | ✅ Immer | `/workspace/nexify/12_agentmemory/` |
| Regelwerke verbessern | ✅ Immer | `/workspace/nexify/03_regelwerke/` |
| Kanban pflegen | ✅ Immer | Status-Updates |
| Skills verbessern | ✅ Immer | `/workspace/nexify/05_skills/` |
| Tools/CLI | ✅ Immer | `/workspace/nexify/07_tools_cli/` |
| Auto-Chat-Fortsetzung | ✅ Safe-Internal | Nächste `[ FORTSETZUNG ... ]` |
| Goose.md laden | ✅ Pflicht | Vor jeder Arbeit |
| Skills laden | ✅ Pflicht | Skill-First |

## 3. Automations-Verbot

| Aktion | Status |
|--------|--------|
| DNS ändern | `WAITING_FOR_APPROVAL` |
| Cloudflare ändern | `WAITING_FOR_APPROVAL` |
| Vercel deployen | `WAITING_FOR_APPROVAL` |
| Git Push/Merge | `WAITING_FOR_APPROVAL` |
| Deployment | `WAITING_FOR_APPROVAL` |
| Supabase produktiv | `WAITING_FOR_APPROVAL` |
| Secrets setzen | `BLOCKED` |
| SimpleX Outbound | `BLOCKED` |
| E-Mail/Kunde | `BLOCKED` |
| PUBLIC_PATHS | `BLOCKED` |
| Produktive Kundenänderung | `WAITING_FOR_APPROVAL` |
| Irreversible Löschung | `BLOCKED` |

## 4. Loop-Guard-Grenzen

```text
Min-Intervall: 180s (3 Minuten)
Max pro Stunde: 5
Max gleicher Stop-Grund: 3
Blockierte Stop-Gründe: BLOCKED_APPROVAL, GATE_PENDING, MISSING_LLM_CAPABILITY
Automatischer Unblock: 30 Minuten
```

## 5. Evidence-Pflicht

Jede Aktion erzeugt Evidence in:

```text
/workspace/nexify/10_evidence/<bereich>/<aktion>_EVIDENCE.md
```

Evidence enthält: Datum, Aktion, Ergebnis, Prüfung, Nächster Schritt.

## 6. Fehlerbehandlung

```text
1. Stoppen oder pausieren falls Risiko
2. Ursache erkennen
3. Sichere Korrektur
4. Evidence schreiben
5. Regel/Prompt/Skill verbessern
6. Task aktualisieren
7. Fortsetzung prüfen
8. Weiterlaufen
```

## 7. GOOSE.md ist Pflicht vor jeder Arbeit

```text
Vor jedem Task: GOOSE.md laden (load_skill oder cat)
Nach GOOSE.md-Ladung: Aktuelle Arbeit damit validieren
```

---

*Version 1.0.0 | 2026-06-10 | Audit-Pflichtig*
