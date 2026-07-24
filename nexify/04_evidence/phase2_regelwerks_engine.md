# Regelwerks-Engine — Konfiguration

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** Installiert

---

## 1. Übersicht

Die Regelwerks-Engine verwaltet und verarbeitet alle 403 Regelwerke des NeXify AI OS.

### 1.1 Komponenten

```
┌─────────────────────────────────────────────────────────┐
│              Regelwerks-Engine v1.0                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Rule Loader                                      │  │
│  │  - DIN Rules (100)                                │  │
│  │  - ISO Rules (100)                                │  │
│  │  - VDI Rules (80)                                 │  │
│  │  - BSI Rules (60)                                 │  │
│  │  - ITIL Rules (33)                                │  │
│  │  - PMBOK Rules (30)                               │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────┴──────────────────────────┐    │
│  │  Mapping Engine                                   │  │
│  │  - Regelwerks-Mapping                             │  │
│  │  - Konsolidierung                                 │  │
│  │  - Priorisierung                                  │  │
│  └──────────────────────┬──────────────────────────┘    │
│                         │                               │
│  ┌──────────────────────┴──────────────────────────┐    │
│  │  Compliance Checker                               │  │
│  │  - DIN Compliance                                 │  │
│  │  - ISO Compliance                                 │  │
│  │  - BSI Compliance                                 │  │
│  │  - DSGVO Compliance                               │  │
│  │  - ITIL Compliance                                │  │
│  │  - PMBOK Compliance                               │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Report Generator                                 │  │
│  │  - Compliance Reports                             │  │
│  │  - Audit Reports                                  │  │
│  │  - Status Reports                                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Regelwerks-Katalog

### 2.1 DIN-Normen (100)

| Kategorie | Anzahl | Priorität | Automation |
|-----------|--------|-----------|------------|
| IT & Software | 25 | Hoch | Ja |
| Qualitätssicherung | 20 | Hoch | Ja |
| Projektmanagement | 10 | Mittel | Ja |
| Sicherheit | 15 | Hoch | Ja |
| Umwelt & Energie | 15 | Mittel | Ja |
| Gesundheit & Arbeitsschutz | 15 | Mittel | Ja |

### 2.2 ISO-Normen (100)

| Kategorie | Anzahl | Priorität | Automation |
|-----------|--------|-----------|------------|
| IT-Management | 25 | Kritisch | Ja |
| Risiko & Compliance | 20 | Kritisch | Ja |
| Business Continuity | 10 | Hoch | Ja |
| Datenschutz | 10 | Kritisch | Ja |
| KI & Automatisierung | 15 | Hoch | Ja |
| Cloud & DevOps | 10 | Hoch | Ja |
| Prozessverbesserung | 10 | Mittel | Ja |

### 2.3 VDI-Richtlinien (80)

| Kategorie | Anzahl | Priorität | Automation |
|-----------|--------|-----------|------------|
| Technische Systeme | 20 | Mittel | Ja |
| Automatisierung | 15 | Hoch | Ja |
| Energie & Umwelt | 15 | Mittel | Ja |
| Qualität | 15 | Mittel | Ja |
| Sicherheit | 15 | Hoch | Ja |

### 2.4 BSI-Standards (60)

| Kategorie | Anzahl | Priorität | Automation |
|-----------|--------|-----------|------------|
| IT-Grundschutz | 20 | Kritisch | Ja |
| Datenschutz | 10 | Kritisch | Ja |
| Kryptographie | 10 | Hoch | Ja |
| Zertifizierung | 10 | Hoch | Ja |
| Technische Richtlinien | 10 | Hoch | Ja |

### 2.5 ITIL (33)

| Kategorie | Anzahl | Priorität | Automation |
|-----------|--------|-----------|------------|
| Service Management | 15 | Hoch | Ja |
| Change Management | 8 | Hoch | Ja |
| Incident Management | 10 | Kritisch | Ja |

### 2.6 PMBOK (30)

| Kategorie | Anzahl | Priorität | Automation |
|-----------|--------|-----------|------------|
| Projektinitiierung | 8 | Hoch | Ja |
| Projektplanung | 10 | Hoch | Ja |
| Projektausführung | 7 | Mittel | Ja |
| Projektabschluss | 5 | Mittel | Ja |

---

## 3. Automatisierungsregeln

| ID | Regel | Standard | Trigger | Aktion |
|----|-------|----------|---------|--------|
| RULE-001 | ISO 27001 Compliance Scan | ISO 27001 | Täglich 02:00 | Compliance-Scan |
| RULE-002 | ITIL Incident Auto-Escalation | ITIL 4 | Bei Incident | Eskalation |
| RULE-003 | BSI Vulnerability Scan | BSI 200-2 | Montags 03:00 | Schwachstellenscan |
| RULE-004 | GDPR Data Breach Notification | DSGVO | Bei Verstoß | 72h-Meldung |
| RULE-005 | DIN EN ISO 9001 Audit Planning | DIN EN ISO 9001 | Jährlich | Audit planen |
| RULE-006 | ISO 22301 BCM Test | ISO 22301 | Monatlich | BCM-Test |
| RULE-007 | VDI 4610 Energy Monitoring | VDI 4610 | Monatlich | Energiebericht |
| RULE-008 | PMBOK Project Status | DIN 69901 | Wöchentlich | Statusbericht |

---

## 4. Integration

### 4.1 Brain API
- Endpoint: http://127.0.0.1:9090
- Regelwerks-Abfragen über Brain API
- Automatische Synchronisation

### 4.2 Qdrant Vektordatenbank
- Endpoint: http://127.0.0.1:6333
- 4 Collections für Regelwerke
- Semantische Suche

### 4.3 Cloudflare Tunnel
- Endpoint: brain+agentmemory.nexifyai.cloud
- Sichere externe Erreichbarkeit

---

**Status:** INSTALLIERT
**Version:** 1.0
**Regelwerke:** 403
