# Regelwerks-Template: ITIL Service Management

**Template-ID:** TPL-ITIL-SERVICE-MGMT-V1
**Kategorie:** Service Management / ITIL
**Version:** 1.0
**Status:** AKTIV

---

## 1. Metadaten

| Feld | Beschreibung |
|------|-------------|
| Regelwerk-Name | [ITIL 4 Praktik / Prozess] |
| Version | [4.x] |
| Geltungsbereich | [Service / Team] |
| Service Owner | [Name / Rolle] |
| Review-Frequenz | [Quartalsweise] |
| Letztes Review | [YYYY-MM-DD] |

## 2. Service-Beschreibung

### 2.1 Service-Katalog-Eintrag
| Feld | Wert |
|------|------|
| Service-Name | [Name] |
| Service-ID | [SVC-XXX] |
| Kategorie | [Infrastruktur / Anwendung / Support] |
| SLA-Stufe | [Gold / Silver / Bronze] |
| Verfügbarkeit | [99.X%] |
| Service Window | [24/7 / Mo-Fri 8-18 / Custom] |

### 2.2 Service Desk Integration
- **Kanal:** [Telefon / E-Mail / Portal / Chat]
- **Erstreaktion:** [X Stunden]
- **Lösungszeit:** [X Stunden / Tage]
- **Eskalationspfad:** [Level 1 → 2 → 3]

## 3. Prozessdefinition

### 3.1 Prozessfluss
```
[Trigger] → [Schritt 1] → [Schritt 2] → [Entscheidung] → [Schritt 3] → [Abschluss]
```

### 3.2 Rollen

| Rolle | Verantwortlich | Genehmigung | Informiert |
|-------|---------------|-------------|------------|
| Service Owner | X | | X |
| Prozessverantwortlicher | X | X | X |
| Technischer Ansprechpartner | | | X |
| Eskalationskontakt | | X | |

### 3.3 Aktivitäten

| # | Aktivität | Beschreibung | Eingabe | Ausgabe | Verantwortlich |
|---|-----------|-------------|---------|---------|----------------|
| 1 | [Name] | [Beschreibung] | [Input] | [Output] | [Rolle] |
| 2 | [Name] | [Beschreibung] | [Input] | [Output] | [Rolle] |

## 4. SLA-Definition

### 4.1 Service Level

| Kennzahl | Ziel | Messung | Eskalation bei Abweichung |
|----------|------|---------|--------------------------|
| Verfügbarkeit | 99.X% | Monatlich | < 99.X% |
| Reaktionszeit | X min | Pro Incident | > X min |
| Lösungszeit | X h | Pro Incident | > X h |
| First-Call-Resolution | X% | Monatlich | < X% |
| Customer Satisfaction | > X/5 | Quartalsweise | < X/5 |

### 4.2 Underpinning Contracts
| Vertragspartner | Leistung | SLA | Status |
|----------------|----------|-----|--------|
| [Partner] | [Leistung] | [SLA] | [Aktiv/Inaktiv] |

## 5. Incident Management

### 5.1 Klassifizierung

| Priorität | Auswirkung | Dringlichkeit | Reaktionszeit | Lösungszeit |
|-----------|-----------|---------------|---------------|-------------|
| P0 - Kritisch | Geschäftskritisch | Sofort | 15 min | 2 h |
| P1 - Hoch | Erheblich | Hoch | 30 min | 4 h |
| P2 - Mittel | Mittel | Mittel | 2 h | 8 h |
| P3 - Niedrig | Gering | Niedrig | 4 h | 24 h |

### 5.2 Eskalationsmatrix
| Level | Trigger | Kontakt | Reaktionszeit |
|-------|---------|---------|---------------|
| L1 - Service Desk | Erstes Auftreten | [Kontakt] | Sofort |
| L2 - Spezialist | L1 nicht lösbar nach X min | [Kontakt] | 15 min |
| L3 - Management | P0/P1 nach X min nicht gelöst | [Kontakt] | 30 min |

## 6. Change Enablement

### 6.1 Change-Typen

| Typ | Genehmigung | Vorlaufzeit | Beispiel |
|-----|-------------|-------------|----------|
| Standard | Vorab genehmigt | 0 | Routine-Updates |
| Normal | CAB | 5 Werktage | Konfigurationsänderung |
| Emergency | Notfall-CAB | Sofort | Hotfix |

### 6.2 CAB-Meeting
- **Frequenz:** [Wöchentlich]
- **Teilnehmer:** [Liste]
- **Agenda-Template:** Standard-Change-Review

## 7. Monitoring und KPIs

| KPI | Ziel | Aktuell | Trend |
|-----|------|---------|-------|
| MTTR (Mean Time to Resolve) | < X h | [Wert] | [↑↓→] |
| Incident Volume | < X/Monat | [Wert] | [↑↓→] |
| Reopen Rate | < X% | [Wert] | [↑↓→] |
| Change Success Rate | > X% | [Wert] | [↑↓→] |
| SLA-Einhaltung | > X% | [Wert] | [↑↓→] |

## 8. Continual Improvement

### 8.1 Lessons Learned
| Datum | Lesson | Maßnahme | Status |
|-------|--------|----------|--------|
| [Datum] | [Lesson] | [Maßnahme] | [Status] |

### 8.2 Verbesserungsvorschläge
| ID | Vorschlag | Priorität | Status |
|----|-----------|-----------|--------|
| [ID] | [Vorschlag] | [P0-P3] | [Status] |

## 9. Compliance-Check

- [ ] Service-Katalog aktualisiert
- [ ] SLAs definiert und kommuniziert
- [ ] Prozesse dokumentiert
- [ ] Rollen zugewiesen
- [ ] Monitoring konfiguriert
- [ ] Review-Zyklus etabliert
- [ ] Brain-Sync aktualisiert

## 10. Änderungshistorie

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0 | [YYYY-MM-DD] | Initiale Erstellung | [Agent] |

---

**Template bereitgestellt von:** NeXify AI OS — Systemmaster Agent
**Template-Pfad:** /workspace/nexify/03_regelwerke/templates/TPL-ITIL-SERVICE-MGMT-V1.md
