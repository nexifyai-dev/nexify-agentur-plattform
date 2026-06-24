# Regelwerks-Template: Change Management

**Template-ID:** TPL-CHANGE-MGMT-V1
**Kategorie:** Service Management / Change Enablement
**Version:** 1.0
**Status:** AKTIV

---

## 1. Metadaten

| Feld | Beschreibung |
|------|-------------|
| Regelwerk-Name | Change Management Policy |
| Version | [X.Y] |
| Geltungsbereich | Alle IT-Änderungen |
| Verantwortlich | Change Manager |
| Review-Frequenz | Quartalsweise |
| Letztes Review | [YYYY-MM-DD] |

## 2. Zweck und Scope

### 2.1 Zweck
Sicherstellen, dass alle Änderungen an der IT-Infrastruktur kontrolliert, bewertet, genehmigt und nachverfolgt werden, um Risiken zu minimieren und Stabilität zu gewährleisten.

### 2.2 Scope
- Alle Änderungen an Produktivsystemen
- Konfigurationsänderungen
- Software-Updates und Patches
- Infrastruktur-Änderungen
- Sicherheitsrelevante Änderungen

## 3. Change-Kategorien

### 3.1 Typen

| Typ | Definition | Genehmigung | Vorlaufzeit |
|-----|-----------|-------------|-------------|
| **Standard** | Vorab genehmigt, risikoarm, dokumentiert | Vorab (CAB) | Keine |
| **Normal** | Regulärer Change, erfordert Genehmigung | CAB | 5 Werktage |
| **Emergency** | Dringend, um Incident zu lösen | Emergency-CAB | Sofort |
| **Minor** | Geringes Risiko, keine Service-Auswirkung | Change Manager | 2 Werktage |

### 3.2 Risikobewertung

| Faktor | Gewichtung | 1 (Niedrig) | 2 (Mittel) | 3 (Hoch) | 4 (Kritisch) |
|--------|-----------|-------------|------------|----------|--------------|
| Service Impact | 30% | Kein Einfluss | Wenige User | Viele User | Alle User |
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
- Testergebnisse

#### Schritt 2: Klassifizierung & Risikobewertung
- Typ zuordnen (Standard/Normal/Emergency/Minor)
- Risikoscore berechnen
- Genehmigungspfad bestimmen

#### Schritt 3: Genehmigung

| Risikoscore | Genehmiger | Frist |
|------------|-----------|-------|
| Niedrig | Change Manager | 2 Werktage |
| Mittel | Change Manager + Service Owner | 5 Werktage |
| Hoch | CAB | 10 Werktage |
| Kritisch | CAB + Management | 15 Werktage |

#### Schritt 4: Planung
- Implementierungsplan erstellen
- Rollback-Plan verifizieren
- Testplan definieren
- Kommunikationsplan erstellen
- Wartungsfenster koordinieren

#### Schritt 5: Implementierung
- Gemäß Implementierungsplan
- Rollback bei Abweichung
- Dokumentation in Echtzeit

#### Schritt 6: Post-Implementation Review (PIR)
- Erfolg bewerten
- Abweichungen dokumentieren
- Lessons Learned erfassen
- CMDB aktualisieren

## 5. CAB (Change Advisory Board)

### 5.1 Zusammensetzung

| Rolle | Verantwortlich |
|-------|---------------|
| Change Manager (Vorsitz) | [Name] |
| Service Owner | [Name] |
| Technischer Experte | [Name] |
| Security-Repräsentant | [Name] |
| Business-Repräsentant | [Name] |

### 5.2 Meeting-Rhythmus
- **Reguläres CAB:** Wöchentlich, [Tag], [Uhrzeit]
- **Emergency-CAB:** Bedarfsweise, innerhalb von 2 Stunden
- **Agenda:** RFC-Review, Risiko-Assessment, Genehmigungen

## 6. Standard-Changes (Pre-Approved)

| Change-ID | Beschreibung | Risiko | Genehmigt seit |
|-----------|-------------|--------|---------------|
| SC-001 | OS-Security-Patches (innerhalb 48h) | Niedrig | [Datum] |
| SC-002 | SSL-Zertifikat-Erneuerung | Niedrig | [Datum] |
| SC-003 | DNS-Einträge (intern) | Niedrig | [Datum] |
| SC-004 | Firewall-Regel (Freigabe via Ticket) | Niedrig | [Datum] |

## 7. Rollback-Plan

### 7.1 Rollback-Kriterien
- Implementierung weicht > 10% vom Plan ab
- Unerwartete Service-Auswirkung
- Testfälle schlagen fehl
- Zeitlimit überschritten

### 7.2 Rollback-Verfahren
1. Entscheidung: Rollback oder Weiter
2. Rollback-Plan ausführen
3. Service-Verfügbarkeit verifizieren
4. Stakeholder informieren
5. Root Cause analysieren

## 8. Metriken und KPIs

| KPI | Ziel | Aktuell | Trend |
|-----|------|---------|-------|
| Change Success Rate | > 95% | [Wert] | [↑↓→] |
| Emergency Change Rate | < 10% | [Wert] | [↑↓→] |
| Rollback Rate | < 5% | [Wert] | [↑↓→] |
| RFC Lead Time | < 10 Tage | [Wert] | [↑↓→] |
| CAB Meeting Attendance | > 90% | [Wert] | [↑↓→] |
| Post-Implementation Review Rate | 100% | [Wert] | [↑↓→] |

## 9. Compliance-Check

- [ ] Change-Policy dokumentiert
- [ ] CAB zusammengestellt und eingewiesen
- [ ] RFC-Template etabliert
- [ ] Risikobewertungsmatrix definiert
- [ ] Standard-Changes katalogisiert
- [ ] Rollback-Verfahren getestet
- [ ] Metriken etabliert
- [ ] Brain-Sync aktualisiert

## 10. Änderungshistorie

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0 | [YYYY-MM-DD] | Initiale Erstellung | [Agent] |

---

**Template bereitgestellt von:** NeXify AI OS — Systemmaster Agent
**Template-Pfad:** /workspace/nexify/03_regelwerke/templates/TPL-CHANGE-MGMT-V1.md
