# Incident-Response-Runbook — NeXify AI OS
## Version: 1.0 | Stand: 2026-06-23
## Normbasis: ISO 27001 A.16, BSI OPS.1.1.5, DSGVO Art. 33/34

---

## 1. Rollen und Verantwortlichkeiten

| Rolle | Verantwortung | Person/Team |
|---|---|---|
| **Incident Detector** | Erkennt und meldet Vorfälle (Monitoring, Agents, Nutzer) | Automatisiert/Agents |
| **Incident Commander (IC)** | Leitet Incident Response, koordiniert Maßnahmen, Eskalation | Sec-Ops (L1-L4) |
| **Incident Responder** | Führt Eindämmung und Behebung durch | IT-Ops, Engineering |
| **Communication Lead** | Externe und interne Kommunikation | Geschäftsführung |
| **Post-Incident Reviewer** | Führt Nachbereitung durch, erstellt Lessons Learned | QMB |
| **DSB (Datenschutz)** | Prüft DSGVO-Meldepflicht bei Datenschutzverletzungen | Philipp Gros (extern) |

---

## 2. Incident-Klassifizierung

| Level | Bezeichnung | Definition | Reaktionszeit | Lösungsziel | Eskalation |
|---|---|---|---|---|---|
| **P0** | KRITISCH | Produktionsausfall, Datenverlust, Sicherheitsverletzung mit Datenexfiltration | < 15 Min | < 2h | L3 IT-Team + GF |
| **P1** | HOCH | Signifikante Beeinträchtigung, Teilausfall, nicht-autorisierter Zugriff (kein Datenverlust) | < 30 Min | < 8h | L3 IT-Team |
| **P2** | MITTEL | Eingeschränkte Funktion, Performance-Problem, einzelner Nutzer betroffen | < 2h | < 24h | L2 Governance Agent |
| **P3** | NIEDRIG | Kosmetische Probleme, Informationsanfragen, Log-Warnungen | < 8h | < 72h | L1 Systemmaster |

### P0-Beispiele
- VPS-Vollausfall (Hetzner)
- Brain API-Komplettausfall
- Qdrant-Datenverlust/Korruption
- Unautorisierter Root-Zugriff auf Produktionssystem
- Cloudflare-Tunnel-Kompromittierung
- MongoDB-Korruption

### P1-Beispiele
- 9Router-Ausfall (LLM-Gateway)
- Hermes WebUI-Teilausfall
- Hohe Fehlerrate (>5%) in Brain-API
- Erfolgloser SSH-Brute-Force (erkannt)
- SSL-Zertifikat läuft ab (< 7 Tage)

### P2-Beispiele
- Einzelne RAGFlow-Dokumente nicht verarbeitet
- Agent-Speicher (agentmemory) Timeout
- MongoDB-Replikationsverzögerung
- Prometheus-Scrape-Fehler

### P3-Beispiele
- Grafana-Dashboard-Discrepancy
- Unkritische Log-Warnungen
- Dokumentationsfehler
- Kosmetische UI-Probleme

---

## 3. Incident-Response-Phasen

### Phase 1: Erkennung (Detection)

| Quelle | Methode | Reaktionszeit |
|---|---|---|
| **Prometheus Alertmanager** | Automatisierte 13 Alert-Regeln | < 1 Min |
| **Agent-Selbstdiagnose** | Brain-Health-Check, Qdrant-Ping | < 5 Min |
| **Benutzermeldung** | WebUI-Kontaktformular/Slack | < 15 Min |
| **Fail2ban/IDS** | SSH-Brute-Force-Erkennung | < 2 Min |
| **Blackbox-Exporter** | Externer Endpoint-Monitoring | < 1 Min |

### Phase 2: Meldung & Klassifizierung (Reporting)

```text
1. Alert empfangen → Inzidenz-ID generieren (INC-YYYYMMDD-XXX)
2. Klassifizierung nach P0-P3 (siehe Matrix oben)
3. Incident Commander bestimmen (je nach P-Level)
4. Ticket im Incident-Log anlegen
5. Bei P0: GF + Team informieren (Telefon/Slack)
```

### Phase 3: Eindämmung (Containment)

| Szenario | Sofortmaßnahme | Verantwortlich |
|---|---|---|
| **VPS-Ausfall** | Failover auf Backup-Host vorbereiten | IT-Ops |
| **Datenverlust** | Schreibzugriff stoppen → Read-Only-Mode | IT-Ops |
| **Security-Incident** | Betroffenes System isolieren (iptables DROP) | Sec-Ops |
| **Cloudflare-Ausfall** | Direktverbindung via Hetzner-IP | IT-Ops |
| **9Router-Ausfall** | Backup-Router aktivieren (OpenRouter Fallback) | Engineering |
| **DDoS** | Cloudflare-Rate-Limiting aktivieren; Scrubbing-Center | Sec-Ops |

### Phase 4: Analyse (Analysis)

```text
1. Logs sichern (nicht verändern)
2. Root-Cause ermitteln
3. Betroffene Systeme/Daten identifizieren
4. Schweregrad ggf. nach oben korrigieren
5. Datenexfiltration prüfen (bei Security-Vorfällen)
6. Beweise sichern (forensisches Image wenn nötig)
```

### Phase 5: Beseitigung (Eradication)

| Szenario | Beseitigungsmaßnahme |
|---|---|
| **Malware/Kompromittierung** | System neu aufsetzen, Credentials rotieren, Schwachstelle schließen |
| **Konfigurationsfehler** | Rollback auf letzte stabile Konfiguration, Change-RCA |
| **Software-Bug** | Patch einspielen, Hotfix deployen |
| **Kapazitätsengpass** | Ressourcen skalieren, Auto-Scaling konfigurieren |

### Phase 6: Wiederherstellung (Recovery)

Siehe BUSINESS_CONTINUITY_RUNBOOK.md → Abschnitt 4 (Wiederherstellungsprozeduren)

Grundsätzlich:
1. System aus sauberem Backup wiederherstellen
2. Funktionstests durchführen
3. Monitoring wieder aktivieren
4. Benutzer informieren
5. SLA-Status zurücksetzen

### Phase 7: Nachbereitung (Post-Incident)

```text
1. Post-Mortem innerhalb von 5 Werktagen
2. Lessons Learned dokumentieren
3. Maßnahmen zur Vermeidung identifizieren
4. Incident-Log abschließen
5. Kennzahlen aktualisieren (MTTR, MTBF)
6. Ggf. DSGVO-Meldung veranlassen
```

---

## 4. Meldepflichten

### 4.1 DSGVO-Meldepflicht (Art. 33, 34)

| Kriterium | Wert |
|---|---|
| **Meldepflichtig bei** | Verletzung des Schutzes personenbezogener Daten |
| **Frist an Aufsichtsbehörde** | ≤ 72 Stunden nach Bekanntwerden |
| **Frist an betroffene Personen** | Unverzüglich, wenn hohes Risiko |
| **Zuständige Behörde** | Landesbeauftragter für Datenschutz (BW) |
| **Meldeweg** | Formular auf www.baden-wuerttemberg.datenschutz.de |
| **Meldepflicht prüfen** | DSB (Philipp Gros) |
| **Template** | Siehe Abschnitt 7 |

### 4.2 BSI-Meldepflicht (BSI-Gesetz)

| Kriterium | Wert |
|---|---|
| **Meldepflichtig bei** | Erhebliche IT-Sicherheitsvorfälle (KRITIS) |
|---|---|
| **Schwellwert** | Nicht erreicht (kein KRITIS-Betreiber) |
|---|---|
| **Freiwillige Meldung** | Möglich über BSI-CERT |

### 4.3 Kunden-Meldepflicht

| Vertragstyp | Meldepflicht | Frist |
|---|---|---|
| **Aktive Kundenprojekte** | Ausfall oder Datenvorfall | < 1h bei P0 |
| **SaaS-Nutzer** | Service-Unterbrechung | < 2h |
| **Alle Kunden** | Datenschutzverletzung | < 24h |

---

## 5. Kommunikationsmatrix

| Situation | Ansprechpartner | Kanal | Vorlage | Frist |
|---|---|---|---|---|
| **P0-Incident** | Alle Teammitglieder | Slack #incidents + Telefon | — | < 5 Min |
| **Team-Update** | Incident-Team | Slack #incidents | Status-Template | Alle 30 Min |
| **Kunden-Benachrichtigung** | Aktive Kunden | E-Mail | Kunden-Vorlage | < 1h |
| **DSGVO-Meldung** | Aufsichtsbehörde | Formular | DSGVO-Template | < 72h |
| **Öffentliche Status-Seite** | Alle Nutzer | status.nexifyai.cloud | Status-Update | < 30 Min |
| **Post-Mortem** | Team + Management | E-Mail + Meeting | Post-Mortem-Template | < 5 Werktage |

---

## 6. Incident-Log-Template

```markdown
## Incident-Log

| Feld | Wert |
|---|---|
| **Incident-ID** | INC-YYYYMMDD-XXX |
| **Datum** | 2026-06-23 |
| **Severity** | P0/P1/P2/P3 |
| **Status** | detected/contained/eradicated/recovered/closed |
| **Incident Commander** | Name |
| **Erkannt durch** | Monitoring/Agent/User |
| **Betroffene Systeme** | Brain, Qdrant, VPS, ... |
| **Root Cause** | ... |
| **Aktionen** | 1. ... 2. ... 3. ... |
| **RTO erreicht?** | Ja/Nein (Wenn Nein: Grund) |
| **DSGVO-meldepflichtig?** | Ja/Nein |
| **Dauer (TL) ** | 00:00 (von) - 00:00 (bis) |
| **MTTR** | XX Minuten |

### Zeitstrahl
| Zeit | Aktion | Status |
|---|---|---|
| HH:MM | Incident erkannt | ✅ |
| HH:MM | Klassifiziert als PX | ✅ |
| HH:MM | Eindämmung gestartet | ✅ |
| HH:MM | System wiederhergestellt | ✅ |

### Lessons Learned
1. ...
```

---

## 7. Post-Mortem-Template

```markdown
# Post-Mortem: INC-YYYYMMDD-XXX
**Datum:** YYYY-MM-DD | **Autor:** [Name]

## Zusammenfassung
[Kurzbeschreibung des Vorfalls in 2-3 Sätzen]

## Zeitstrahl
| Zeit | Ereignis |
|---|---|
| HH:MM | Erstes Anzeichen |
| HH:MM | Incident ausgerufen |
| HH:MM | Eindämmung |
| HH:MM | Wiederherstellung |
| HH:MM | Incident geschlossen |

## Root Cause
[Technische Ursache]

## Auswirkung
- **Downtime:** XX Minuten
- **Betroffene Nutzer:** XX
- **Datenverlust:** Ja/Nein (Details)
- **Kosten:** € XX

## Was lief gut?
1. ...

## Was lief schlecht?
1. ...

## Maßnahmen
| Maßnahme | Verantwortlich | Fällig | Status |
|---|---|---|---|
| ... | ... | ... | 🔴/🟡/🟢 |

## DSGVO-Meldung erforderlich?
[X] Ja — Meldung erfolgt am [Datum]
[ ] Nein — Begründung: [keine personenbezogenen Daten betroffen]

## Anhänge
- Log-Auszüge
- Screenshots
- Chatverläufe
```

---

## 8. DSGVO-Meldetemplate

```markdown
## Meldung einer Verletzung des Schutzes personenbezogener Daten
**Gemäß Art. 33 DSGVO**

### 1. Verantwortlicher
- Name: Pascal Courbois
- Organisation: NeXify AI OS
- Kontakt: [Kontaktdaten]

### 2. Datenschutzbeauftragter
- Name: Philipp Gros (extern)
- Kontakt: [Kontaktdaten]

### 3. Beschreibung der Verletzung
- Datum/Uhrzeit: ...
- Art der Verletzung: ...
- Betroffene Datenkategorien: ...
- Anzahl betroffener Personen: ...
- Anzahl betroffener Datensätze: ...

### 4. Wahrscheinliche Folgen
- ...

### 5. Ergriffene Maßnahmen
- ...
- ...

### 6. Übermittlung an Dritte
- ...

### 7. Zeitstrahl
- Entdeckt: ...
- Gemeldet: ...
- Fristende (72h): ...
```

---

## 9. Maßnahmen zur Vermeidung (Prävention)

| Maßnahme | Beschreibung | Priorität |
|---|---|---|
| **Monitoring-Erweiterung** | Automatisierte Integritätsprüfung vor Backup-Einspielung | P1 |
| **Fail2ban-Konfiguration** | Rate-Limiting für SSH und API-Endpoints | ✅ AKTIV |
| **Read-Only-Mode** | Automatischer Read-Only bei Daten-Inkonsistenz | P0 |
| **3-2-1-Backup-Regel** | 3 Kopien, 2 Medien, 1 off-site | ✅ AKTIV |
| **Security-Schulung** | Mitarbeiter-Sensibilisierung für Phishing/Social Engineering | P1 |
| **Patch-Management** | Regelmäßige Sicherheits-Updates (wöchentlich) | ✅ AKTIV |
| **Pentest** | Externer Pentest Q3/2026 | P1 |

---

## 10. Metadaten

| Attribut | Wert |
|---|---|
| Erstellungsdatum | 2026-06-23 |
| Nächstes IR-Review | 2026-12-23 |
| Letzte Übung | (Noch nicht durchgeführt) |
| Nächste IR-Übung | Q1 2026 (Tabletop) |
| Incident Commander | Sec-Ops (Rotation) |
| DSGVO-Meldepflicht | Geprüft bei jedem P0/P1 mit Datenbezug |
