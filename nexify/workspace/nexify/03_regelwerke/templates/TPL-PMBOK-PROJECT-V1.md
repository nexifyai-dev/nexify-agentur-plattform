# Regelwerks-Template: PMBOK Projektmanagement

**Template-ID:** TPL-PMBOK-PROJECT-V1
**Kategorie:** Projektmanagement / PMBOK
**Version:** 1.0
**Status:** AKTIV

---

## 1. Metadaten

| Feld | Beschreibung |
|------|-------------|
| Projektname | [Name] |
| Projekt-ID | [PRJ-XXX] |
| Projekttyp | [Neuentwicklung / Wartung / Optimierung / Migration] |
| Sponsor | [Name / Rolle] |
| Projektleiter | [Name / Rolle] |
| Startdatum | [YYYY-MM-DD] |
| Geplantes Ende | [YYYY-MM-DD] |
| Status | [Geplant / Aktiv / Abgeschlossen / Abgebrochen] |

## 2. Projektcharter

### 2.1 Zielsetzung
[SMART-Ziele des Projekts]

### 2.2 Nutzen / Business Case
| Nutzen | Metrik | Erwarteter Wert |
|--------|--------|----------------|
| [Nutzen 1] | [Metrik] | [Wert] |
| [Nutzen 2] | [Metrik] | [Wert] |

### 2.3 Umfang
- **In Scope:** [Liste]
- **Out of Scope:** [Liste]

### 2.4 Annahmen und Einschränkungen
| Typ | Beschreibung |
|-----|-------------|
| Annahme | [Beschreibung] |
| Einschränkung | [Beschreibung] |

### 2.5 Meilensteine

| # | Meilenstein | Geplant | Ist | Status |
|---|-------------|---------|-----|--------|
| M1 | Projektstart | [Datum] | [Datum] | [Status] |
| M2 | [Name] | [Datum] | [Datum] | [Status] |
| M3 | Projektabschluss | [Datum] | [Datum] | [Status] |

## 3. Projektstrukturplan (PSP)

### 3.1 Arbeitspakete

| AP-ID | Arbeitspaket | Verantwortlich | Vorgänger | Dauer | Status |
|-------|-------------|----------------|-----------|-------|--------|
| AP-01 | [Name] | [Rolle] | - | [X Tage] | [Status] |
| AP-02 | [Name] | [Rolle] | AP-01 | [X Tage] | [Status] |
| AP-03 | [Name] | [Rolle] | AP-02 | [X Tage] | [Status] |

### 3.2 Ressourcenplanung

| Rolle | Person | Einsatz (h/Woche) | Zeitraum |
|-------|--------|-------------------|----------|
| [Rolle] | [Name] | [Xh] | [Von - Bis] |

## 4. Risikomanagement

### 4.1 Risikoregister

| Risk-ID | Risiko | Eintritt | Auswirkung | Risikowert | Maßnahme | Verantwortlich | Status |
|---------|--------|----------|------------|------------|----------|----------------|--------|
| R-01 | [Beschreibung] | [1-5] | [1-5] | [Wert] | [Maßnahme] | [Rolle] | [Offen/Gemindert/Eingetreten] |

### 4.2 Chancenregister

| Chancen-ID | Chance | Eintritt | Nutzen | Maßnahme | Status |
|-----------|--------|----------|--------|----------|--------|
| C-01 | [Beschreibung] | [1-5] | [1-5] | [Maßnahme] | [Status] |

## 5. Stakeholder-Management

### 5.1 Stakeholder-Register

| Stakeholder | Rolle | Interesse | Einfluss | Strategie |
|-------------|-------|-----------|----------|-----------|
| [Name] | [Rolle] | [H/M/N] | [H/M/N] | [Managen/Informieren/Mitnehmen/Überwachen] |

### 5.2 Kommunikationsplan

| Was | Zielgruppe | Medium | Frequenz | Verantwortlich |
|-----|-----------|--------|----------|----------------|
| Status-Report | Sponsor, Stakeholder | E-Mail/Dokument | Wöchentlich | PL |
| Team-Meeting | Projektteam | Meeting | Täglich/Wöchentlich | PL |
| Steering | Lenkungsausschuss | Meeting | Monatlich | PL/Sponsor |

## 6. Qualitätsmanagement

### 6.1 Qualitätskriterien

| Kriterium | Ziel | Messung | Verantwortlich |
|-----------|------|---------|----------------|
| [Kriterium] | [Ziel] | [Methode] | [Rolle] |

### 6.2 Abnahmekriterien
| # | Kriterium | Priorität | Status |
|---|-----------|-----------|--------|
| 1 | [Kriterium] | [P0-P3] | [Offen/Erfüllt] |

## 7. Status-Tracking

### 7.1 Aktueller Status

| Dimension | Status | Kommentar |
|-----------|--------|-----------|
| Zeitplan | 🟢 / 🟡 / 🔴 | [Kommentar] |
| Budget | 🟢 / 🟡 / 🔴 | [Kommentar] |
| Umfang | 🟢 / 🟡 / 🔴 | [Kommentar] |
| Qualität | 🟢 / 🟡 / 🔴 | [Kommentar] |
| Risiken | 🟢 / 🟡 / 🔴 | [Kommentar] |

### 7.2 Offene Punkte (Action Items)

| ID | Action | Verantwortlich | Deadline | Status |
|----|--------|----------------|----------|--------|
| AI-01 | [Beschreibung] | [Rolle] | [Datum] | [Status] |

## 8. Lessons Learned

| Datum | Lesson | Kategorie | Maßnahme für nächstes Projekt |
|-------|--------|-----------|------------------------------|
| [Datum] | [Lesson] | [Zeit/Umfang/Qualität/Kommunikation] | [Maßnahme] |

## 9. Projektabschluss

### 9.1 Abnahme
| Kriterium | Erfüllt | Nachweis |
|-----------|---------|----------|
| [Kriterium] | [JA/NEIN] | [Dokument/Versuch] |

### 9.2 Übergabe an Betrieb
| Was | An wen | Dokument |
|-----|--------|----------|
| [Artifact] | [Rolle] | [Dokument] |

## 10. Compliance-Check

- [ ] Projektcharter genehmigt
- [ ] PSP erstellt und abgestimmt
- [ ] Risiken identifiziert und bewertet
- [ ] Stakeholder informiert
- [ ] Qualitätskriterien definiert
- [ ] Lessons Learned dokumentiert
- [ ] Brain-Sync aktualisiert

---

**Template bereitgestellt von:** NeXify AI OS — Systemmaster Agent
**Template-Pfad:** /workspace/nexify/03_regelwerke/templates/TPL-PMBOK-PROJECT-V1.md
