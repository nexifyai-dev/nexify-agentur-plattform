# NeXify Regelwerks-Templates — README

**Version:** 1.1
**Erstellt:** 2026-06-23
**Agent:** Systemmaster Agent
**Status:** ✅ AKTIV
**Letztes Update:** 2026-06-23 (Template-Erweiterung: KI-Sicherheit)

---

## Zweck

Regelwerks-Templates bieten wiederverwendbare Vorlagen für die Erstellung neuer Regelwerke im NeXify AI OS. Sie stellen sicher, dass alle Regelwerke:
- **Konsistent** strukturiert sind
- **Vollständig** alle relevanten Bereiche abdecken
- **Prüfbar** Compliance-Checks enthalten
- **Brain-integriert** Brain-Sync vorsehen
- **Evidence-fähig** Nachweise ermöglichen

## Verfügbare Templates

| Template | Kategorie | ID | Beschreibung |
|----------|-----------|-----|-------------|
| [BSI IT-Grundschutz](TPL-BSI-IT-GRUNDSCHUTZ-V1.md) | Sicherheit | TPL-BSI-IT-GRUNDSCHUTZ-V1 | BSI-Standard 200er-Reihe |
| [ISO 27001 ISMS](TPL-ISO27001-ISMS-V1.md) | Informationssicherheit | TPL-ISO27001-ISMS-V1 | ISMS nach ISO 27001/27002 |
| [ITIL Service Management](TPL-ITIL-SERVICE-MGMT-V1.md) | Service Management | TPL-ITIL-SERVICE-MGMT-V1 | ITIL 4 Praktiken |
| [PMBOK Projektmanagement](TPL-PMBOK-PROJECT-V1.md) | Projektmanagement | TPL-PMBOK-PROJECT-V1 | Projektmanagement nach PMBOK |
| [Incident Response](TPL-INCIDENT-RESPONSE-V1.md) | Sicherheit | TPL-INCIDENT-RESPONSE-V1 | Incident-Response-Prozess |
| [Change Management](TPL-CHANGE-MGMT-V1.md) | Service Management | TPL-CHANGE-MGMT-V1 | Change-Enablement-Prozess |
| [KI-Sicherheit](TPL-AI-SECURITY-V1.md) | Sicherheit / KI | TPL-AI-SECURITY-V1 | KI-Sicherheitsrichtlinie |

## Nutzung

### 1. Template auswählen
Wähle das passende Template basierend auf der Art des Regelwerks.

### 2. Kopieren und anpassen
```bash
cp /workspace/nexify/03_regelwerke/templates/TPL-XXX-V1.md /workspace/nexify/03_regelwerke/NEUES_REGELWERK.md
```

### 3. Platzhalter ausfüllen
Alle `[Platzhalter]` durch konkrete Inhalte ersetzen.

### 4. Compliance-Check durchführen
Die Checkliste am Ende jedes Templates vollständig abarbeiten.

### 5. Brain-Sync
Im Template enthaltenen Brain-Sync-Check ausführen.

## Template-Struktur

Jedes Template enthält:
1. **Metadaten** — Versionsinfo, Verantwortlichkeiten, Review-Zyklen
2. **Zweck und Scope** — Zielsetzung, Geltungsbereich
3. **Anforderungen/Prozesse** — Kerninhalt des Regelwerks
4. **Rollen** — Verantwortlichkeiten und Eskalationen
5. **Metriken/KPIs** — Messgrößen und Ziele
6. **Risikobewertung** — Risikomatrix
7. **Compliance-Check** — Prüfliste
8. **Änderungshistorie** — Versionsverwaltung

## Erweiterung

Neue Templates können jederzeit hinzugefügt werden:
1. Template-ID-Format: `TPL-{KATEGORIE}-{NAME}-V{VERSION}.md`
2. Struktur gemäß bestehenden Templates
3. Compliance-Check am Ende ist Pflicht
4. Brain-Sync-Hinweis ist Pflicht

## Template-Nutzung für Projekte

| Projekt | Template | Regelwerk-ID | Status |
|---------|----------|--------------|--------|
| NeXify AI OS | ITIL Service Management | NEXIFY-AIOS-ITIL-SVC-V1 | ✅ AKTIV |
| NeXify AI OS | Change Management | NEXIFY-AIOS-CHG-MGMT-V1 | ✅ AKTIV |
| Bookando | PMBOK Projektmanagement | BOOKANDO-PM-V1 | ✅ AKTIV |
| Studienkolleg Aachen | BSI IT-Grundschutz | STUDIENKOLLEG-BSI-V1 | ✅ AKTIV |

---

**Erstellt von:** Systemmaster Agent (CI-002)
**Kontinuierliche Verbesserung:** Regelmäßiges Review im Rahmen des CIF
