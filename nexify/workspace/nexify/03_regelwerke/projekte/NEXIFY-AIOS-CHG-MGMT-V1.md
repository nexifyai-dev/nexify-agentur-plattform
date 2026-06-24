# Regelwerk: NeXify AI OS — Change Management

**Regelwerk-ID:** NEXIFY-AIOS-CHG-MGMT-V1
**Template:** TPL-CHANGE-MGMT-V1
**Kategorie:** Service Management / Change Enablement
**Version:** 1.0
**Status:** AKTIV
**Erstellt:** 2026-06-23

---

## 1. Metadaten

| Feld | Beschreibung |
|------|-------------|
| Regelwerk-Name | NeXify AI OS — Change Management Policy |
| Version | 1.0 |
| Geltungsbereich | Alle Änderungen an NeXify AI OS |
| Verantwortlich | Systemmaster Agent |
| Review-Frequenz | Quartalsweise |
| Letztes Review | 2026-06-23 |

## 2. Zweck und Scope

### 2.1 Zweck
Sicherstellen, dass alle Änderungen an NeXify AI OS kontrolliert, bewertet und nachverfolgt werden.

### 2.2 Scope
- Regelwerks-Änderungen
- Brain/Agentmemory-Updates
- Skill-Änderungen
- Plugin-Änderungen
- Konfigurationsänderungen

## 3. Change-Kategorien

### 3.1 Typen

| Typ | Definition | Genehmigung | Vorlaufzeit |
|-----|-----------|-------------|-------------|
| **Standard** | Routine-Updates (Brain-Sync, Evidence) | Vorab genehmigt | Keine |
| **Normal** | Regelwerks-Änderungen, neue Skills | Systemmaster | 1 Stunde |
| **Emergency** | Kritische Fixes | Systemmaster | Sofort |
| **Minor** | Dokumentations-Updates | Agent | 30 Minuten |

### 3.2 Risikobewertung

| Faktor | Gewichtung | 1 (Niedrig) | 2 (Mittel) | 3 (Hoch) | 4 (Kritisch) |
|--------|-----------|-------------|------------|----------|--------------|
| Service Impact | 30% | Kein Einfluss | Wenige Services | Viele Services | Gesamte Plattform |
| Komplexität | 25% | Einfach | Moderat | Komplex | Sehr komplex |
| Reversibilität | 25% | Leicht reversibel | Aufwändig | Schwierig | Nicht reversibel |
| Erfahrung | 20% | Mehrfach durchgeführt | Einmal durchgeführt | Erstmalig | Vollständig neu |

**Risikoscore:** Σ(Faktor × Gewichtung) → Niedrig (1-1.5), Mittel (1.5-2.5), Hoch (2.5-3.5), Kritisch (3.5-4)

## 4. Change-Prozess

### 4.1 Workflow

```
RFC erstellt → Klassifizierung → Risikobewertung → Genehmigung →
Planung → Implementierung → Review → Schließung
```

### 4.2 Detailprozess

#### Schritt 1: RFC (Request for Change) erstellen
Pflichtfelder im RFC:
- Change-Typ
- Beschreibung der Änderung
- Begründung / Business Case
- Betroffene Systeme/Services
- Geplantes Implementierungsdatum
- Rollback-Plan
- Risikobewertung

#### Schritt 2: Klassifizierung & Risikobewertung
- Typ zuordnen (Standard/Normal/Emergency/Minor)
- Risikoscore berechnen
- Genehmigungspfad bestimmen

#### Schritt 3: Genehmigung

| Risikoscore | Genehmiger | Frist |
|------------|-----------|-------|
| Niedrig | Agent (autonom) | Sofort |
| Mittel | Systemmaster | 1 Stunde |
| Hoch | Systemmaster + Human Review | 4 Stunden |
| Kritisch | Human Approval Required | 24 Stunden |

#### Schritt 4: Planung
- Implementierungsplan erstellen
- Rollback-Plan verifizieren
- Brain-Sync vorbereiten

#### Schritt 5: Implementierung
- Gemäß Implementierungsplan
- Rollback bei Abweichung
- Evidence sammeln

#### Schritt 6: Post-Implementation Review (PIR)
- Erfolg bewerten
- Brain/Agentmemory aktualisieren
- Lessons Learned erfassen

## 5. Standard-Changes (Pre-Approved)

| Change-ID | Beschreibung | Risiko | Genehmigt seit |
|-----------|-------------|--------|---------------|
| SC-001 | Brain-Sync Updates | Niedrig | 2026-06-23 |
| SC-002 | Evidence Collection | Niedrig | 2026-06-23 |
| SC-003 | Agentmemory Updates | Niedrig | 2026-06-23 |
| SC-004 | Template-basierte Regelwerke | Niedrig | 2026-06-23 |

## 6. Metriken und KPIs

| KPI | Ziel | Aktuell | Trend |
|-----|------|---------|-------|
| Change Success Rate | > 98% | [Wert] | [↑↓→] |
| Emergency Change Rate | < 5% | [Wert] | [↑↓→] |
| Rollback Rate | < 2% | [Wert] | [↑↓→] |
| RFC Lead Time | < 2 Stunden | [Wert] | [↑↓→] |
| Brain-Sync nach Change | 100% | [Wert] | [↑↓→] |

## 7. Compliance-Check

- [x] Change-Policy dokumentiert
- [x] RFC-Template etabliert
- [x] Risikobewertungsmatrix definiert
- [x] Standard-Changes katalogisiert
- [x] Rollback-Verfahren definiert
- [x] Metriken etabliert
- [x] Brain-Sync aktualisiert

## 8. Änderungshistorie

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0 | 2026-06-23 | Initiale Erstellung aus Template | Systemmaster Agent |

---

**Erstellt von:** Systemmaster Agent
**Template-Pfad:** /workspace/nexify/03_regelwerke/templates/TPL-CHANGE-MGMT-V1.md
**Regelwerks-Pfad:** /workspace/nexify/03_regelwerke/projekte/NEXIFY-AIOS-CHG-MGMT-V1.md
