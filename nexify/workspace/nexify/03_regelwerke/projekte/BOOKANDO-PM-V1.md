# Regelwerk: Bookando — Projektmanagement (PMBOK)

**Regelwerk-ID:** BOOKANDO-PM-V1
**Template:** TPL-PMBOK-PROJECT-V1
**Kategorie:** Projektmanagement / PMBOK
**Version:** 1.0
**Status:** AKTIV
**Erstellt:** 2026-06-23

---

## 1. Metadaten

| Feld | Beschreibung |
|------|-------------|
| Projektname | Bookando |
| Projekt-ID | PRJ-BOOKANDO |
| Projekttyp | Neuentwicklung / SaaS-Plattform |
| Sponsor | NeXify AI |
| Projektleiter | Systemmaster Agent |
| Startdatum | 2026-01-01 |
| Geplantes Ende | 2026-12-31 |
| Status | AKTIV |

## 2. Projektcharter

### 2.1 Zielsetzung
Entwicklung einer KI-gestützten Buchungsplattform (Bookando) als SaaS-Lösung für Dienstleister.

### 2.2 Nutzen / Business Case

| Nutzen | Metrik | Erwarteter Wert |
|--------|--------|----------------|
| Automatisierte Buchungen | Buchungen/Monat | > 1000 |
| KI-gestützte Terminplanung | Optimierungsrate | > 30% |
| Kundenzufriedenheit | NPS | > 50 |

### 2.3 Umfang
- **In Scope:** Buchungsengine, KI-Terminoptimierung, Kundenportal, Admin-Dashboard
- **Out of Scope:** Mobile App (Phase 2), Drittanbieter-Integrationen (Phase 2)

### 2.4 Annahmen und Einschränkungen

| Typ | Beschreibung |
|-----|-------------|
| Annahme | Cloud-Infrastruktur (Cloudflare) ist verfügbar |
| Annahme | KI-Modelle (9Router) sind performant |
| Einschränkung | Budget für externe Dienste limitiert |

### 2.5 Meilensteine

| # | Meilenstein | Geplant | Ist | Status |
|---|-------------|---------|-----|--------|
| M1 | Projektstart | 2026-01-01 | 2026-01-01 | ✅ |
| M2 | MVP-Release | 2026-06-30 | [Datum] | IN_ARBEIT |
| M3 | Beta-Release | 2026-09-30 | [Datum] | GEPLANT |
| M4 | Produktivsetzung | 2026-12-31 | [Datum] | GEPLANT |

## 3. Projektstrukturplan (PSP)

### 3.1 Arbeitspakete

| AP-ID | Arbeitspaket | Verantwortlich | Vorgänger | Dauer | Status |
|-------|-------------|----------------|-----------|-------|--------|
| AP-01 | Anforderungsanalyse | Systemmaster | - | 30 Tage | ✅ |
| AP-02 | Architektur-Design | Systemmaster | AP-01 | 30 Tage | ✅ |
| AP-03 | Backend-Entwicklung | Agent | AP-02 | 60 Tage | IN_ARBEIT |
| AP-04 | Frontend-Entwicklung | Agent | AP-02 | 60 Tage | IN_ARBEIT |
| AP-05 | KI-Integration | Agent | AP-03 | 30 Tage | GEPLANT |
| AP-06 | Testing & QA | Agent | AP-03, AP-04 | 30 Tage | GEPLANT |
| AP-07 | Deployment | Agent | AP-06 | 15 Tage | GEPLANT |

## 4. Risikomanagement

### 4.1 Risikoregister

| Risk-ID | Risiko | Eintritt | Auswirkung | Risikowert | Maßnahme | Verantwortlich | Status |
|---------|--------|----------|------------|------------|----------|----------------|--------|
| R-01 | KI-Modell-Performance | 3 | 4 | 12 | Fallback-Strategie | Agent | Offen |
| R-02 | Skalierbarkeit | 2 | 4 | 8 | Cloud-native Architektur | Agent | Gemindert |
| R-03 | Datenschutz (DSGVO) | 2 | 5 | 10 | Privacy-by-Design | Agent | Gemindert |

### 4.2 Chancenregister

| Chancen-ID | Chance | Eintritt | Nutzen | Maßnahme | Status |
|-----------|--------|----------|--------|----------|--------|
| C-01 | Marktführerschaft KI-Buchung | 3 | 5 | Schneller MVP | Offen |
| C-02 | Upselling bestehender Kunden | 4 | 4 | Feature-Expansion | Offen |

## 5. Stakeholder-Management

### 5.1 Stakeholder-Register

| Stakeholder | Rolle | Interesse | Einfluss | Strategie |
|-------------|-------|-----------|----------|-----------|
| NeXify AI | Sponsor | H | H | Managen |
| Endkunden | Nutzer | H | M | Informieren |
| Systemmaster | PL | H | H | Managen |

### 5.2 Kommunikationsplan

| Was | Zielgruppe | Medium | Frequenz | Verantwortlich |
|-----|-----------|--------|----------|----------------|
| Status-Report | Sponsor | Brain/Evidence | Wöchentlich | PL |
| Sprint-Review | Team | Kanban | 2-wöchentlich | PL |
| Steering | Sponsor | Dokument | Monatlich | PL/Sponsor |

## 6. Status-Tracking

### 6.1 Aktueller Status

| Dimension | Status | Kommentar |
|-----------|--------|-----------|
| Zeitplan | 🟡 | Leichte Verzögerung bei AP-03 |
| Budget | 🟢 | Im Rahmen |
| Umfang | 🟢 | Stabil |
| Qualität | 🟢 | Gut |
| Risiken | 🟡 | KI-Performance beobachten |

## 7. Compliance-Check

- [x] Projektcharter definiert
- [x] PSP erstellt
- [x] Risiken identifiziert
- [x] Stakeholder informiert
- [x] Qualitätskriterien definiert
- [x] Brain-Sync aktualisiert

## 8. Änderungshistorie

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0 | 2026-06-23 | Initiale Erstellung aus Template | Systemmaster Agent |

---

**Erstellt von:** Systemmaster Agent
**Template-Pfad:** /workspace/nexify/03_regelwerke/templates/TPL-PMBOK-PROJECT-V1.md
**Regelwerks-Pfad:** /workspace/nexify/03_regelwerke/projekte/BOOKANDO-PM-V1.md
