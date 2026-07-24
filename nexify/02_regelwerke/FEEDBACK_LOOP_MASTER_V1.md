# FEEDBACK_LOOP_MASTER V1 — Feedback-Loop-Definition

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja

---

## 1. Zweck

Dieses Dokument definiert, wie **Feedback aus allen Quellen** (Agenten, Tests,
Crush-Reviews, Audits) systematisch zurück in die **Regelwerke, Skills und Prompts**
fließt — und so einen kontinuierlichen Verbesserungszyklus sicherstellt.

> **Leitsatz:** Feedback ist der Treibstoff der Selbstoptimierung.
> Ein System, das nicht aus Feedback lernt, ist ein sterbendes System.

---

## 2. Feedback-Quellen

```
                   ┌──────────────┐
                   │  Agenten     │ ◄── Ausführungs-Feedback
                   ├──────────────┤
                   │  Tests       │ ◄── Qualitäts-Feedback
                   ├──────────────┤
                   │ Crush-Reviews│ ◄── Architektur-Feedback
                   ├──────────────┤
                   │  Audits      │ ◄── Compliance-Feedback
                   ├──────────────┤
                   │  Nutzer      │ ◄── Erfahrungs-Feedback
                   ├──────────────┤
                   │  Metriken    │ ◄── Performance-Feedback
                   └──────────────┘
                            │
                            ▼
                   ┌─────────────────────┐
                   │  FEEDBACK-PROZESSOR  │
                   └─────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │ Regel-   │   │  Skills  │   │  Prompts  │
      │ werke    │   │          │   │          │
      └──────────┘   └──────────┘   └──────────┘
```

### 2.1 Agenten-Feedback

| Quelle | Inhalt | Format | Frequenz |
|--------|--------|--------|----------|
| Eigene Erfahrung | Was hat funktioniert/nicht funktioniert? | Evidence-Notes, Memory | Nach jeder Aufgabe |
| Sub-Agenten | Rückmeldung von gespawneten Agenten | Sub-Agent-Report | Nach Sub-Agent-Rückkehr |
| Policy-Gate | Gate-Ergebnisse, Auffälligkeiten | Policy-Gate-Log | Bei jedem Gate-Durchlauf |

### 2.2 Test-Feedback

| Quelle | Inhalt | Format | Frequenz |
|--------|--------|--------|----------|
| Unit-Tests | Fehler, Coverage-Lücken | Test-Report | Nach jedem Testlauf |
| Integrationstests | Schnittstellenprobleme | Test-Report | Nach jedem Testlauf |
| E2E-Tests | System-Fehler | Test-Report | Nach jedem Testlauf |
| Coverage-Report | Ungetestete Bereiche | Coverage-JSON | Nach jedem Testlauf |

### 2.3 Crush-Review-Feedback

| Quelle | Inhalt | Format | Frequenz |
|--------|--------|--------|----------|
| Code-Review | Qualitätsmängel, Verbesserungen | Crush-Report | Nach jedem CR |
| Architektur-Review | Design-Verstöße | Architektur-Report | Nach jedem Architektur-Review |
| Security-Review | Sicherheitslücken | Security-Report | Nach jedem Security-Review |

### 2.4 Audit-Feedback

| Quelle | Inhalt | Format | Frequenz |
|--------|--------|--------|----------|
| Regelwerk-Audit | Regelverstöße, Inkonsistenzen | Audit-Bericht | Nach jedem Audit |
| DONE-Audit | Fehlende DONE-Kriterien | Audit-Bericht | Nach jedem Task |
| Security-Audit | Sicherheitslücken | Audit-Bericht | Nach jedem Security-Audit |
| Memory-Audit | Memory-Probleme | Audit-Bericht | Nach jedem Memory-Audit |

### 2.5 Nutzer-Feedback

| Quelle | Inhalt | Format | Frequenz |
|--------|--------|--------|----------|
| Direktes Feedback | Anmerkungen, Wünsche, Kritik | Freitext | Bei Bedarf |
| Issue-Tracker | Bug-Reports, Feature-Requests | Issue | Kontinuierlich |
| Nutzungsmetriken | Verhalten, Fehler, Abbrüche | Metrik | Kontinuierlich |

### 2.6 Metrik-Feedback

| Quelle | Inhalt | Format | Frequenz |
|--------|--------|--------|----------|
| Performance | Latenz, Durchsatz, Fehlerraten | Metrik-Dashboard | Kontinuierlich |
| Qualität | Fehlerrate, Coverage, Code-Smells | Qualitäts-Dashboard | Täglich |
| Security | CVE-Count, Audit-Fail-Rate | Security-Dashboard | Täglich |

---

## 3. Feedback-Prozessor

### 3.1 Feedback-Eingang

Jedes Feedback durchläuft diese Verarbeitungskette:

```
Eingang → 1. Klassifizierung → 2. Priorisierung → 3. Analyse → 4. Maßnahme → 5. Umsetzung → 6. Validierung
```

#### Schritt 1: Klassifizierung

| Kriterium | Werte |
|-----------|-------|
| **Quelle** | Agent / Test / Crush / Audit / Nutzer / Metrik |
| **Typ** | Bug / Improvement / Security / Performance / Compliance / Usability |
| **Betrifft** | Regelwerk / Skill / Prompt / MCP / Tool / UI / Sonstiges |
| **Schwere** | 🔴 CRITICAL / 🟡 HIGH / 🟢 MEDIUM / ⚪ LOW |

#### Schritt 2: Priorisierung

| Priorität | Kriterium | Reaktionszeit |
|-----------|-----------|---------------|
| **P0** | Security-Lücke, Systemausfall, Datenverlust | < 1 Stunde |
| **P1** | Regelverstoß, fehlerhafter Skill, DONE-Verletzung | < 24 Stunden |
| **P2** | Performance, Optimierung, Verbesserung | < 7 Tage |
| **P3** | Kosmetik, Dokumentation, Nice-to-have | < 30 Tage |

#### Schritt 3: Analyse

Pro Feedback-Eintrag wird analysiert:

```
- Tritt das Problem wiederholt auf? (→ Systemisch)
- Ist eine einzelne Komponente betroffen? (→ Lokal)
- Sind mehrere Komponenten betroffen? (→ Architekturell)
- Gibt es einen bekannten Konflikt? (→ RULE_CONFLICT_REGISTER)
- Ist der Aufwand der Behebung gerechtfertigt? (→ Kosten/Nutzen)
```

#### Schritt 4: Maßnahme

| Befund | Empfohlene Maßnahme |
|--------|---------------------|
| Regelwerk fehlerhaft/unvollständig | Regelwerk aktualisieren |
| Skill unzureichend | Skill erweitern/reparieren |
| Prompt unklar | Prompt verbessern |
| MCP/Tool-Fehler | Konfiguration korrigieren |
| Wiederkehrendes Muster | Neuen Skill/Pattern ableiten |
| Systemisches Problem | Regelwerk erweitern |

#### Schritt 5: Umsetzung

- P0: Sofort-Maßnahme, parallel zur Ursachenanalyse
- P1: In aktuelle Iteration aufnehmen
- P2: Für nächste Iteration planen
- P3: Ins Backlog aufnehmen, bei nächster Revision prüfen

#### Schritt 6: Validierung

Nach der Umsetzung wird geprüft:
- Ist das Feedback adressiert?
- Tritt das Problem nicht mehr auf?
- Wurde die Änderung evidence-pflichtig dokumentiert?
- Wurde agentmemory aktualisiert?

---

## 4. Feedback → Regelwerke

### 4.1 Wann fließt Feedback in Regelwerke?

| Bedingung | Maßnahme |
|-----------|----------|
| Regelwerk wird durch Audit kritisiert | Regelwerk überarbeiten, neue Version |
| Regelwerk erzeugt wiederholt Konflikte | Konflikt im RULE_CONFLICT_REGISTER eintragen, Regelwerk anpassen |
| Regel-Lücke identifiziert | Neues Regelwerk erstellen oder bestehendes erweitern |
| Regel ist obsolet | Regelwerk inaktiv setzen, ins Archiv |
| Regel-Verstoß durch Unklarheit | Regelwerk präzisieren, Beispiele ergänzen |

### 4.2 Prozess

```
Feedback → Regelwerk-Revision beantragen → Änderung draften → Review → Audit → Freigabe → Release
```

Dokumentiert in: REGELWERKS_INDEX (neue Version)

---

## 5. Feedback → Skills

### 5.1 Wann fließt Feedback in Skills?

| Bedingung | Maßnahme |
|-----------|----------|
| Skill produziert Fehler | Skill reparieren, Test ergänzen |
| Skill deckt Anwendungsfall nicht ab | Skill erweitern |
| Skill ist veraltet | Skill aktualisieren |
| Neuer Anwendungsfall ohne Skill | Neuen Skill erstellen |
| Skill ist ineffizient | Skill optimieren |

### 5.2 Prozess

```
Feedback → Skill-Revision beantragen → Skill bearbeiten → Test → Audit → Release
```

---

## 6. Feedback → Prompts

### 6.1 Wann fließt Feedback in Prompts?

| Bedingung | Maßnahme |
|-----------|----------|
| Prompt erzeugt unerwünschte Ausgabe | Prompt verfeinern, Einschränkungen ergänzen |
| Prompt ist mehrdeutig | Prompt präzisieren, Beispiele ergänzen |
| Prompt ist zu lang/ineffizient | Prompt optimieren, auf das Wesentliche reduzieren |
| Prompt hat Security-Lücke | Prompt sichern (Injection-Schutz) |

### 6.2 Prozess

```
Feedback → Prompt-Revision beantragen → Prompt bearbeiten → Testen → Audit → Release
```

---

## 7. Feedback-Fluss-Diagramm

```
                    ┌──────────────────┐
                    │  FEEDBACK-EINGANG │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Klassifizierung  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Priorisierung   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ Regelwerk? │  │  Skill?   │  │  Prompt?   │
     ├────────────┤  ├────────────┤  ├────────────┤
     │ → Revision │  │ → Revision │  │ → Revision │
     │ → RCI ein- │  │ → Test    │  │ → Test     │
     │   tragen   │  │ → Release │  │ → Release  │
     └────────────┘  └────────────┘  └────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Validierung    │
                    │  (Hat's geholfen?)│
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              ┌──────────┐    ┌────────────┐
              │  Geschl. │    │ Erneuter   │
              │  (✅)    │    │ Zyklus     │
              └──────────┘    │ (↩ Schritt  │
                             │  3/4/5)    │
                             └────────────┘
```

---

## 8. Feedback-Dokumentation

Jeder Feedback-Durchlauf wird dokumentiert:

```yaml
feedback_entry:
  id: "FB-20260610-001"
  source: "audit"  # agent | test | crush | audit | user | metric
  type: "improvement"  # bug | improvement | security | performance | compliance
  severity: "HIGH"  # CRITICAL | HIGH | MEDIUM | LOW
  component_type: "rule"  # rule | skill | prompt | mcp | tool | ui
  
  description: "Kurze Beschreibung des Feedbacks"
  
  actions:
    - action: "rule_update"
      target: "GLOBAL_POLICY_V1.md"
      change: "Specifiche Änderung"
      evidence: "EV_CHANGE_20260610_001.md"
  
  validation:
    status: "PASS"  # PASS | FAIL | PENDING
    validated_at: "2026-06-11T10:00:00Z"
  
  closed_at: "2026-06-11T10:00:00Z"
```

---

## 9. Feedback-Loop-Metriken

Die Gesundheit der Feedback-Loops wird anhand dieser Metriken gemessen:

| Metrik | Beschreibung | Ziel |
|--------|--------------|------|
| **Feedback-Volumen** | Anzahl Feedback-Einträge pro Woche | ≥ 5 |
| **Durchlaufzeit** | Zeit von Eingang bis Validierung | P0 < 1h, P1 < 24h, P2 < 7d |
| **Umsetzungsrate** | % der Feedbacks, die zu einer Änderung führen | ≥ 80% |
| **Regressionsrate** | % der Feedbacks, die erneut auftreten | < 5% |
| **Closed-Loop-Quote** | % der Feedbacks mit abgeschlossener Validierung | 100% |

---

## 10. Verhältnis zu anderen Regelwerken

| Regelwerk | Bezug |
|-----------|-------|
| AUDIT_MASTER_V1 | Audit-Feedback ist eine Hauptquelle für den Loop |
| GLOBAL_POLICY_V1 | Policy-Gate-Feedback fließt in Regelwerks-Optimierung |
| DONE_REGEL_V1 | DONE-Audit-Feedback fließt in Prozessverbesserung |
| RULE_CONFLICT_REGISTER | Feedback kann auf neue Konflikte hinweisen |
| SKILL_FIRST_REGEL_V1 | Skill-Feedback führt zu Skill-Verbesserungen |
| MEMORY_PFLICHT_V1 | Memory-Probleme werden via Feedback adressiert |

---

## 11. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiale Version — Feedback-Loop-System | NeXify Governance |

---

*Ein Feedback, das nicht geschlossen wird, ist kein Feedback — es ist Rauschen.
Jeder Eintrag muss validiert und geschlossen werden.*
