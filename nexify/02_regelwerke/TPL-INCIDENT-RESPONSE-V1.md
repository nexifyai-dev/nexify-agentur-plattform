# Regelwerks-Template: Incident Response

**Template-ID:** TPL-INCIDENT-RESPONSE-V1
**Kategorie:** Sicherheit / Incident Management
**Version:** 1.0
**Status:** AKTIV

---

## 1. Metadaten

| Feld | Beschreibung |
|------|-------------|
| Regelwerk-Name | Incident Response Policy |
| Version | [X.Y] |
| Geltungsbereich | Gesamte IT-Infrastruktur |
| Verantwortlich | [CISO / Security Officer] |
| Review-Frequenz | Nach jedem Major Incident + quartalsweise |
| Letztes Review | [YYYY-MM-DD] |

## 2. Incident-Klassifizierung

### 2.1 Schweregrade

| Level | Name | Auswirkung | Reaktionszeit | Eskalation |
|-------|------|-----------|---------------|------------|
| SEV-1 | Kritisch | Geschäft total beeinträchtigt | 15 min | Sofort Management + CISO |
| SEV-2 | Hoch | Geschäft erheblich beeinträchtigt | 30 min | Innerhalb 1h Management |
| SEV-3 | Mittel | Geschäft teilweise beeinträchtigt | 2 h | Nächster Arbeitstag |
| SEV-4 | Niedrig | Geringe Auswirkung | 8 h | Keine |

### 2.2 Incident-Typen

| Typ | Beschreibung | Beispiele |
|-----|-------------|-----------|
| Security | Sicherheitsverletzung | Datenleck, Malware, unbefugter Zugriff |
| Availability | Ausfall / Degradation | Service-Down, Performance-Problem |
| Data | Datenverlust / Korruption | Backup-Fehler, Datenkorruption |
| Compliance | Compliance-Verstoß | Datenschutzverstoß, Policy-Verstoß |

## 3. Response-Prozess

### 3.1 Phasen

```
1. Detection & Reporting → 2. Triage & Classification → 3. Containment →
4. Eradication → 5. Recovery → 6. Lessons Learned
```

### 3.2 Detailprozess

#### Phase 1: Detection & Reporting
- **Wer kann melden:** Alle Mitarbeiter, automatische Alerts
- **Wie:** [E-Mail security@nexifyai.cloud / Ticket / Telefon]
- **Dokumentation:** Incident-ID vergeben, Zeitstempel erfassen

#### Phase 2: Triage & Classification
- Schweregrad bestimmen (SEV-1 bis SEV-4)
- Incident-Commander benennen (bei SEV-1/SEV-2)
- Response-Team zusammenstellen

#### Phase 3: Containment
- **Sofortmaßnahmen:**
  - [ ] Betroffene Systeme isolieren
  - [ ] Kompromittierte Credentials sperren
  - [ ] Network-Segmentation aktivieren
  - [ ] Forensische Sicherung (Disk-Image, Logs)

#### Phase 4: Eradication
- Root Cause identifizieren
- Schadsoftware / Angreifer entfernen
- Schwachstelle schließen

#### Phase 5: Recovery
- Systeme aus sauberem Backup wiederherstellen
- Monitoring intensivieren
- Gradual service restoration

#### Phase 6: Lessons Learned
- Post-Incident-Review (PIR) innerhalb 5 Tage
- Maßnahmen definieren und zuweisen
- Regelwerke aktualisieren

## 4. Rollen und Verantwortlichkeiten

### 4.1 Incident Response Team (IRT)

| Rolle | Verantwortlich | Aufgaben |
|-------|---------------|----------|
| Incident Commander | [Name] | Gesamtkoordination, Entscheidungen |
| Technical Lead | [Name] | Technische Analyse, Containment |
| Communications Lead | [Name] | Interne/externe Kommunikation |
| Legal/Compliance | [Name] | Rechtliche Bewertung, Meldungen |

### 4.2 Eskalationspfad

```
L1: Support-Team (First Response)
  ↓ nach 15 min / SEV ≥ 2
L2: Incident Response Team
  ↓ nach 30 min / SEV = 1
L3: CISO + Management
  ↓ nach 1h / Geschäftskritisch
L4: Externe Partner (CERT, Forensik, Rechtsanwalt)
```

## 5. Kommunikation

### 5.1 Interne Kommunikation

| Anlass | Zielgruppe | Medium | Frist |
|--------|-----------|--------|-------|
| Incident erkannt | IRT | Slack/Teams | Sofort |
| SEV-1/2 Update | Management | E-Mail | Stündlich |
| Abschluss | Alle | E-Mail | Innerhalb 24h |

### 5.2 Externe Kommunikation

| Anlass | Zielgruppe | Verantwortlich | Vorlage |
|--------|-----------|----------------|---------|
| Datenpanne (DSGVO) | Aufsichtsbehörde | Legal | Vorlage DSGVO |
| Kunden-Information | Betroffene Kunden | Communications | Vorlage Kundenbrief |
| Presse | Medien | PR/Management | Vorlage Pressemitteilung |

## 6. Tooling

| Tool | Zweck | Zugang |
|------|-------|--------|
| Ticket-System | Incident-Tracking | [URL] |
| SIEM | Log-Analyse, Detection | [URL] |
| Forensik-Workstation | Disk-Image, Memory-Dump | [Standort] |
| Kommunikationskanal | War Room | [Slack/Teams Channel] |

## 7. Meldewesen (Gesetzliche Pflichten)

| Pflicht | Frist | Verantwortlich | An wen |
|---------|-------|----------------|--------|
| DSGVO Art. 33 (Datenpanne) | 72 Stunden | DSB / Legal | Aufsichtsbehörde |
| DSGVO Art. 34 (Betroffene) | Unverzüglich | DSB / Legal | Betroffene Personen |
| BSI Meldung | Unverzüglich | CISO | BSI |
| Versicherung | 48 Stunden | Legal | Cyber-Versicherung |

## 8. Übungen und Tests

| Übungstyp | Frequenz | Beschreibung | Nächster Termin |
|-----------|----------|-------------|-----------------|
| Tabletop Exercise | Quartalsweise | Szenario-Durchsprache | [Datum] |
| Phishing Simulation | Monatlich | Awareness-Test | [Datum] |
| Full Simulation | Jährlich | Realitätsnaher Test | [Datum] |

## 9. Compliance-Check

- [ ] Incident-Response-Plan dokumentiert
- [ ] Rollen zugewiesen und geschult
- [ ] Eskalationspfade definiert
- [ ] Kommunikationsvorlagen erstellt
- [ ] Tooling eingerichtet
- [ ] Übungen durchgeführt
- [ ] Brain-Sync aktualisiert

## 10. Änderungshistorie

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0 | [YYYY-MM-DD] | Initiale Erstellung | [Agent] |

---

**Template bereitgestellt von:** NeXify AI OS — Systemmaster Agent
**Template-Pfad:** /workspace/nexify/03_regelwerke/templates/TPL-INCIDENT-RESPONSE-V1.md
