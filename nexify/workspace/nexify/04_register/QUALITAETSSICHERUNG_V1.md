---
ralph_loop_file: true
file_type: qualitaetssicherung
title: NeXify AI OS — Qualitätsicherung V1
version: 1.0.0
date: 2026-06-22
status: VERBINDLICH
priority: P0
owner: NeXify CEO (nexify-ceo)
---

# QUALITÄTSSICHERUNG V1 — Standards für Planung, Umsetzung, Steuerung

> **Leitsatz:** Qualität ist kein Zufall. Sie ist das Ergebnis systematischer Planung,
> disziplinierter Umsetzung und permanenter Kontrolle.

---

## 1. Qualitätsdimensionen

| Dimension | Beschreibung | Messgröße | Zielwert |
|-----------|-------------|-----------|----------|
| **Funktionalität** | Tut das System was es soll? | Feature-Completion-Rate | 100% |
| **Zuverlässigkeit** | Läuft es stabil? | Uptime, Error-Rate | ≥99%, <1% |
| **Sicherheit** | Ist es gegen Angriffe geschützt? | CVEs, Security-Audits | 0 kritische |
| **Effizienz** | Nutzt es Ressourcen optimal? | Token-Verbrauch, Latenz | ≤120k Tokens/Tag |
| **Wartbarkeit** | Ist es änderbar? | Code-Qualität, Dokumentation | 100% dokumentiert |
| **Portabilität** | Läuft es überall? | Kompatibilitätstests | 100% |

---

## 2. Qualitätsstandards pro Phase

### 2.1 Phase: PLANUNG

| Standard | Beschreibung | Prüfpunkt | Verantwortlich |
|----------|-------------|-----------|----------------|
| QS-P01 | Anforderungen vollständig dokumentiert | DOS GATE G01 | Ausführender Agent |
| QS-P02 | Zieldefinition SMART (spezifisch, messbar, attraktiv, realistisch, terminiert) | DOS GATE G02 | Ausführender Agent |
| QS-P03 | Risikoanalyse durchgeführt | DOS GATE G06 | Ausführender Agent |
| QS-P04 | Akzeptanzkriterien definiert | DOS GATE G08 | Ausführender Agent |
| QS-P05 | Skill-First-Prüfung durchgeführt | SKILL_FIRST_REGEL | Ausführender Agent |
| QS-P06 | Brain-Query durchgeführt | BRAIN_FIRST_POLICY | Ausführender Agent |
| QS-P07 | YAGNI-Check (Ponytail) | PONYTAIL_RULE_01 | Ausführender Agent |
| QS-P08 | Reuse-Check (Ponytail) | PONYTAIL_RULE_02 | Ausführender Agent |
| QS-P09 | Budget definiert (Zeit, Tokens, Ressourcen) | DOS GATE G14 | Ausführender Agent |
| QS-P10 | Abbruchkriterien definiert | DOS GATE G15 | Ausführender Agent |

**Gate:** Alle P01-P10 = GRÜN → Freigabe zur Umsetzung  
**Evidence:** `evidence_planung_<task_id>.md`

### 2.2 Phase: UMSETZUNG

| Standard | Beschreibung | Prüfpunkt | Verantwortlich |
|----------|-------------|-----------|----------------|
| QS-U01 | Code erfüllt Akzeptanzkriterien | Unit-Tests | Ausführender Agent |
| QS-U02 | Keine TODOs in Production-Code | Code-Review | Ausführender Agent |
| QS-U03 | Keine hardcoded Secrets | Security-Scan | Ausführender Agent |
| QS-U04 | RTK bei Tool-Outputs aktiv | Bolt-Audit | Ausführender Agent |
| QS-U05 | Headroom bei Context aktiv | Bolt-Audit | Ausführender Agent |
| QS-U06 | Caveman korrekt konfiguriert | Bolt-Audit | Ausführender Agent |
| QS-U07 | Ponytail: Mehr gelöscht als hinzugefügt | Diff-Check | Ausführender Agent |
| QS-U08 | Keine Kompression bei Evidence | Bolt-Audit | Ausführender Agent |
| QS-U09 | Keine Kompression bei Kundendokumenten | Bolt-Audit | Ausführender Agent |
| QS-U10 | Error-Handling implementiert | NO_FULL_CRASH | Ausführender Agent |
| QS-U11 | Fallback definiert für externe Abhängigkeiten | Architecture-Review | Ausführender Agent |
| QS-U12 | Skill-Tests: Coverage ≥ 80% | Test-Runner | Ausführender Agent |
| QS-U13 | Dokumentation erstellt (README/SKILL.md) | File-Check | Ausführender Agent |

**Gate:** Alle U01-U13 = GRÜN → Freigabe zur Steuerung  
**Evidence:** `evidence_umsetzung_<task_id>.md`

### 2.3 Phase: STEUERUNG

| Standard | Beschreibung | Prüfpunkt | Verantwortlich |
|----------|-------------|-----------|----------------|
| QS-S01 | Monitoring aktiv (Prometheus/Grafana) | Health-Check | Systemmaster |
| QS-S02 | Alerts konfiguriert | Alertmanager | Systemmaster |
| QS-S03 | Backup läuft (restic + Timer) | Backup-Log | Systemmaster |
| QS-S04 | Audit-Zyklen eingehalten | AUDIT_SYSTEM_V1 | Systemmaster |
| QS-S05 | Token-Verbrauch im Budget | Kosten-Report | Systemmaster |
| QS-S06 | Bolt-Compliance ≥ 80% | Bolt-Audit | 9Router-Admin |
| QS-S07 | Regelwerke aktuell | Regelwerk-Audit | Systemmaster |
| QS-S08 | Memory-Sync aktuell | Brain-Sync-Audit | Systemmaster |
| QS-S09 | Incident-Response getestet | Incident-Drill | Systemmaster |
| QS-S10 | Feedback-Loop aktiv | FEEDBACK_LOOP_MASTER | Systemmaster |

**Gate:** Alle S01-S10 = GRÜN → System im SOLL-Zustand  
**Evidence:** `evidence_steuerung_<datum>.md`

---

## 3. Qualitätsprüfungen (Aggregiert)

### 3.1 Prüfmatrix — Alle Phasen

| Prüfpunkt | Planung | Umsetzung | Steuerung | Intervall |
|-----------|---------|-----------|-----------|-----------|
| Brain-Query | ✅ | ✅ | ✅ | Per-Task |
| DOS GATES | ✅ | — | — | Per-Task |
| Skill-First | ✅ | — | — | Per-Task |
| YAGNI (Ponytail) | ✅ | ✅ | — | Per-Task |
| RTK-Compliance | — | ✅ | ✅ | 7 Tage |
| Headroom-Compliance | — | ✅ | ✅ | 7 Tage |
| Caveman-Compliance | — | ✅ | ✅ | 7 Tage |
| Evidence | — | ✅ | ✅ | Per-Task |
| Security | ✅ | ✅ | ✅ | 7 Tage |
| Monitoring | — | — | ✅ | Echtzeit |
| Backup | — | — | ✅ | Täglich |
| Audit | — | — | ✅ | Per-Zyklus |

---

## 4. Qualitätskennzahlen (KPIs)

### 4.1 Produktivitäts-KPIs

| KPI | Ziel | Messung | Intervall |
|-----|------|---------|-----------|
| Task-Completion-Rate | ≥95% | Tasks abgeschlossen / Tasks gestartet | Wöchentlich |
| First-Time-Right-Rate | ≥80% | Tasks ohne Rework / Tasks gesamt | Wöchentlich |
| Avg. Task-Dauer | ≤2h | Durchschnittliche Task-Dauer | Wöchentlich |
| Escalation-Rate | ≤5% | Eskalationen / Tasks gesamt | Monatlich |

### 4.2 Qualitäts-KPIs

| KPI | Ziel | Messung | Intervall |
|-----|------|---------|-----------|
| Defect-Rate | ≤2% | Fehler nach Deployment / Deployments | Monatlich |
| Audit-Bestehensrate | ≥90% | Bestandene Audits / Audits gesamt | Monatlich |
| Regelwerk-Compliance | 100% | Regelwerke eingehalten / Prüfpunkte | Wöchentlich |
| Evidence-Vollständigkeit | 100% | Evidence vorhanden / Tasks abgeschlossen | Wöchentlich |

### 4.3 Effizienz-KPIs (Bolt)

| KPI | Ziel | Messung | Intervall |
|-----|------|---------|-----------|
| Token-Reduktion | ≥60% | Tokens mit Bolt / Tokens ohne Bolt | Wöchentlich |
| Bolt-Compliance | 100% | Bolt-Regeln eingehalten / Prüfpunkte | 7 Tage |
| Kosten/Task | ≤$0.10 | Monatskosten / Tasks gesamt | Monatlich |
| Ponytail-Deletions-Rate | ≥50% | Gelöschte Zeilen / Hinzugefügte Zeilen | Per-Task |

---

## 5. Quality Gates (Aggregiert)

### 5.1 QG-01: Planungs-Gate

```
Voraussetzung: Aufgabe erhalten
□ QS-P01 bis QS-P10 alle GRÜN
□ DOS GATES G01-G17 alle GRÜN
→ FREIGABE: Umsetzung beginnen
```

### 5.2 QG-02: Umsetzungs-Gate

```
Voraussetzung: Implementierung abgeschlossen
□ QS-U01 bis QS-U13 alle GRÜN
□ Ponytail: Diff zeigt mehr Löschungen als Hinzufügungen
□ Evidence erstellt
→ FREIGABE: Steuerung / Deployment
```

### 5.3 QG-03: Steuerungs-Gate

```
Voraussetzung: System in Production
□ QS-S01 bis QS-S10 alle GRÜN
□ Monitoring aktiv
□ Alerts konfiguriert
□ Backup läuft
→ BESTÄTIGUNG: System im SOLL-Zustand
```

### 5.4 QG-04: Bolt-Spezial-Gate

```
Voraussetzung: Bolt-Feature-Konfiguration geändert
□ RTK-Modus korrekt pro Endpunkt
□ Headroom-Endpoint erreichbar
□ Caveman-Modus korrekt (OFF bei SSE)
□ Kompatibilitätstest bestanden
□ Token-Ersparnis ≥ Zielwert
→ FREIGABE: Bolt-Konfiguration aktiv
```

---

## 6. Fehlerbehandlung

| Fehlertyp | Reaktion | Eskalation | Dokumentation |
|-----------|----------|------------|---------------|
| Qualitätsmangel (P0) | SOFORT stoppen, fixen | → NeXify CEO | Incident-Report |
| Qualitätsmangel (P1) | Innerhalb 24h fixen | → Systemmaster | Finding im Audit |
| Qualitätsmangel (P2) | Nächster Sprint | → Systemmaster | Backlog |
| Bolt-Compliance-Verstoß | Konfiguration korrigieren | → 9Router-Admin | Bolt-Audit-Report |
| Regelwerks-Verstoß | Eskalation + Korrektur | → NeXify CEO | RULE_CONFLICT_REGISTER |

---

## 7. Continuous Improvement

| Maßnahme | Intervall | Verantwortlich | Output |
|----------|-----------|----------------|--------|
| Retrospektive | 14 Tage | Systemmaster | Verbesserungsliste |
| KPI-Review | Monatlich | NeXify CEO | KPI-Report |
| Bolt-Optimierung | Monatlich | 9Router-Admin | Bolt-Tuning-Report |
| Regelwerks-Review | 30 Tage | Systemmaster | Regelwerks-Update |
| Skill-Review | 14 Tage | Systemmaster | Skill-Update |

---

## 8. Owner & Accountability

| Bereich | Owner | Eskalation |
|---------|-------|------------|
| QS-P (Planung) | Ausführender Agent | Systemmaster |
| QS-U (Umsetzung) | Ausführender Agent | Systemmaster |
| QS-S (Steuerung) | Systemmaster | NeXify CEO |
| Bolt-Qualität | 9Router-Admin | NeXify CEO |
| KPI-Monitoring | Systemmaster | NeXify CEO |
| Continuous Improvement | Systemmaster | NeXify CEO |
| Gesamtverantwortung Qualität | NeXify CEO | — |

---

*Generiert: 2026-06-22 | Nächster QS-Review: 2026-06-29*
