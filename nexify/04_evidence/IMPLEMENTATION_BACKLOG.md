# Implementierungsbacklog — NeXify AI OS
## Version: 1.0 | Stand: 2026-06-23
## Basis: CONTROL_CATALOG.yaml, NORMENREGISTER.yaml, Compliance-Audit

---

## 1. Backlog-Übersicht

| Priorität | Items | Ziel | Fälligkeit |
|---|---|---|---|
| **P0 — Kritisch** | 21 | Innerhalb 30 Tagen | 2026-07-23 |
| **P1 — Hoch** | 15 | Innerhalb 90 Tagen | 2026-09-23 |
| **P2 — Mittel** | 10 | Innerhalb 180 Tagen | 2026-12-23 |
| **Gesamt** | **46** | | |

---

## 2. P0 — Kritisch (21 Items, sofort)

### P0-001 | BCM-Runbook erstellen
| Feld | Wert |
|---|---|
| **Control-Bezug** | BC-01 (ISO 22301) |
| **Beschreibung** | Business Continuity Runbook mit BIA, RTO/RPO, Notfallplänen erstellen |
| **Akzeptanzkriterien** | BIA für alle Systeme; RTO/RPO definiert; 5 Notfallpläne; Übungsplan |
| **Geschätzter Aufwand** | 8 PT |
| **Status** | ✅ ERSTELLT (siehe BUSINESS_CONTINUITY_RUNBOOK.md) |

### P0-002 | Incident-Response-Runbook erstellen
| Feld | Wert |
|---|---|
| **Control-Bezug** | INC-01/02 (ISO 27001 A.16) |
| **Beschreibung** | IR-Runbook mit Phasen, Klassifizierung, Meldepflichten, Templates |
| **Akzeptanzkriterien** | 7 Phasen dokumentiert; P0-P3 Klassifizierung; DSGVO 72h-Meldepflicht |
| **Geschätzter Aufwand** | 6 PT |
| **Status** | ✅ ERSTELLT (siehe INCIDENT_RESPONSE_RUNBOOK.md) |

### P0-003 | Lieferantenregister mit AVV-Status
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-01/03 (ISO 27001 A.14, DSGVO Art. 28) |
| **Beschreibung** | Alle externen Dienstleister mit Datenart, Standort, AVV-Status, Risiko |
| **Akzeptanzkriterien** | 8+ Lieferanten erfasst; AVV-Status pro Lieferant; Risikobewertung |
| **Geschätzter Aufwand** | 4 PT |
| **Status** | ✅ ERSTELLT (siehe SUPPLIER_AND_TOOL_RISK_REGISTER.md) |

### P0-004 | TOM-Matrix nach DSGVO Art. 32
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-02 (ISO 27701, DSGVO Art. 32) |
| **Beschreibung** | Datenverarbeitungsmatrix mit TOM für alle VT |
| **Akzeptanzkriterien** | 6+ VT dokumentiert; TOM-Zuordnung; AVV-Bezug |
| **Geschätzter Aufwand** | 5 PT |
| **Status** | ✅ ERSTELLT (siehe DATA_PROCESSING_AND_TOM_MATRIX.md) |

### P0-005 | Audit-Evidenzindex erstellen
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-05 (ISO 27001 A.5) |
| **Beschreibung** | Vollständiges Verzeichnis aller Evidence-Dateien mit Control-Zuordnung |
| **Akzeptanzkriterien** | Evidence-IDs E-001 bis E-999; Control-ID Mapping; Prüfintervall, Owner |
| **Geschätzter Aufwand** | 4 PT |
| **Status** | ✅ ERSTELLT (siehe AUDIT_EVIDENCE_INDEX.md) |

### P0-006 | ISMS-Policy-Review durchführen
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-01 (ISO 27001 A.5.1) |
| **Beschreibung** | ISMS-Policy auf Vollständigkeit prüfen, Lücken identifizieren |
| **Akzeptanzkriterien** | Review-Bericht; identifizierte Lücken mit Maßnahmen |
| **Geschätzter Aufwand** | 3 PT |
| **Status** | 🔴 OFFEN |

### P0-007 | Management-Bekenntnis dokumentieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-03, ISMS-03 (ISO 27001 A.5.1) |
| **Beschreibung** | Explizite Management-Verpflichtung zur Informationssicherheit |
| **Akzeptanzkriterien** | Von GF unterzeichnete Policy; Kommunikation an MA |
| **Geschätzter Aufwand** | 2 PT |
| **Status** | 🔴 OFFEN |

### P0-008 | Risikomanagement-Prozess etablieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-04 (ISO 27001 A.5.2, A.6) |
| **Beschreibung** | Formellen Risikomanagement-Prozess inkl. Risikoregister aufsetzen |
| **Akzeptanzkriterien** | Risikoregister; Bewertungsmethode; Review-Zyklus |
| **Geschätzter Aufwand** | 5 PT |
| **Status** | 🔴 OFFEN |

### P0-009 | DSGVO-DPIA durchführen
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-01 (DSGVO Art. 35) |
| **Beschreibung** | Data Protection Impact Assessment für alle VT mit hohem Risiko |
| **Akzeptanzkriterien** | DPIA-Bericht; Risikobewertung; Maßnahmenplan |
| **Geschätzter Aufwand** | 5 PT |
| **Status** | 🔴 OFFEN |

### P0-010 | Vollständige AVV-Matrix abschließen
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-03 (DSGVO Art. 28) |
| **Beschreibung** | Alle fehlenden AVV abschließen (DeepSeek, Qdrant Cloud prüfen) |
| **Akzeptanzkriterien** | AVV für 8+ Lieferanten; Qdrant Cloud AVV-Klärung |
| **Geschätzter Aufwand** | 4 PT |
| **Status** | 🔴 OFFEN |

### P0-011 | Security-Awareness-Programm starten
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-06 (ISO 27001 A.7) |
| **Beschreibung** | Security-Awareness-Programm für alle Mitarbeiter aufsetzen |
| **Akzeptanzkriterien** | Schulungsplan; Erstschulung durchgeführt; Nachweis |
| **Geschätzter Aufwand** | 3 PT |
| **Status** | 🔴 OFFEN |

### P0-012 | Zugriffsberechtigungen reviewen
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-07 (ISO 27001 A.9) |
| **Beschreibung** | Systematischen Review aller Zugriffsberechtigungen durchführen |
| **Akzeptanzkriterien** | Berechtigungsmatrix; Least-Privilege-Nachweis; Quarterly-Review |
| **Geschätzter Aufwand** | 4 PT |
| **Status** | 🔴 OFFEN |

### P0-013 | Kryptographie-Policy erstellen
| Feld | Wert |
|---|---|
| **Control-Bezug** | SE-02 (ISO 27001 A.10) |
| **Beschreibung** | Kryptographie-Policy mit Schlüsselmanagement-Prozess |
| **Akzeptanzkriterien** | Policy; Schlüsselklassifikation; Rotation-Plan |
| **Geschätzter Aufwand** | 3 PT |
| **Status** | 🔴 OFFEN |

### P0-014 | Datensicherungs-Tests automatisieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | AV-02 (ISO 27001 A.12) |
| **Beschreibung** | Automatisierte Restore-Tests für alle Systeme einrichten |
| **Akzeptanzkriterien** | Monatlicher Test; Restore-Nachweis; Testprotokoll |
| **Geschätzter Aufwand** | 5 PT |
| **Status** | 🔴 OFFEN |

### P0-015 | Notfallübungsplan durchführen
| Feld | Wert |
|---|---|
| **Control-Bezug** | BC-02 (ISO 22301) |
| **Beschreibung** | Erste BCM-Notfallübung durchführen (VPS-Ausfall-Szenario) |
| **Akzeptanzkriterien** | Übungsprotokoll; Lessons Learned; Verbesserungsmaßnahmen |
| **Geschätzter Aufwand** | 3 PT |
| **Status** | 🔴 OFFEN |

### P0-016 | Netzwerksicherheit auditieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | SE-01 (ISO 27001 A.13, BSI SYS.1.1) |
| **Beschreibung** | Netzwerksegmentierung, Firewall-Regeln, VLANs auditieren |
| **Akzeptanzkriterien** | Netzwerkplan; Segmentierungsschema; Firewall-Regel-Review |
| **Geschätzter Aufwand** | 5 PT |
| **Status** | 🔴 OFFEN |

### P0-017 | Lieferanten-Risikobewertung durchführen
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-03 (ISO 27001 A.14) |
| **Beschreibung** | Formelle Risikobewertung aller Lieferanten nach ISO 27001 A.14 |
| **Akzeptanzkriterien** | Risikobewertungsmatrix; Audit-Bericht; Maßnahmen |
| **Geschätzter Aufwand** | 4 PT |
| **Status** | 🔴 OFFEN |

### P0-018 | Asset-Inventar erstellen
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-02 (ISO 27001 A.5.9) |
| **Beschreibung** | Vollständiges Inventar aller Informations-Assets erstellen |
| **Akzeptanzkriterien** | Asset-Register; Klassifizierung; Owner-Zuordnung |
| **Geschätzter Aufwand** | 4 PT |
| **Status** | 🔴 OFFEN |

### P0-019 | Vorfallsmanagement-Prozess etablieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | INC-01 (ISO 27001 A.16) |
| **Beschreibung** | Formellen Vorfallsmelde- und Bearbeitungsprozess leben |
| **Akzeptanzkriterien** | Erster gemeldeter Vorfall; ITIL-konforme Bearbeitung |
| **Geschätzter Aufwand** | 3 PT |
| **Status** | 🔴 OFFEN |

### P0-020 | Compliance-Lücken aus Audit schließen
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-08 (ISO 27001 A.5) |
| **Beschreibung** | 21 offene Compliance-Anforderungen aus Audit abarbeiten |
| **Akzeptanzkriterien** | 21/21 offene Anforderungen geschlossen; Score >90% |
| **Geschätzter Aufwand** | 15 PT |
| **Status** | 🔴 OFFEN |

### P0-021 | DSGVO-Meldeprozess etablieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-03 (DSGVO Art. 33, 34) |
| **Beschreibung** | Prozess für Meldung von Datenschutzverletzungen an Aufsichtsbehörde |
| **Akzeptanzkriterien** | 72h-Meldeprozess; Template; Verantwortliche benannt |
| **Geschätzter Aufwand** | 2 PT |
| **Status** | 🔴 OFFEN |

---

## 3. P1 — Kurzfristig (15 Items)

### P1-001 | Change-Management-Leben einführen
| Feld | Wert |
|---|---|
| **Control-Bezug** | INC-03 (ITIL Change Management) |
| **Beschreibung** | Change-Advisory-Board (CAB) einrichten; Change-Prozess leben |
| **Akzeptanzkriterien** | Erstes Change-Meeting; Change-Protokoll |
| **Geschätzter Aufwand** | 3 PT |

### P1-002 | BCM-Übungsplan für Q3/2026
| Feld | Wert |
|---|---|
| **Control-Bezug** | BC-01 (ISO 22301) |
| **Beschreibung** | Konkreten Übungsplan Q3/2026 erstellen (3 Szenarien) |
| **Akzeptanzkriterien** | Terminplan; Szenarien; Verantwortliche |
| **Geschätzter Aufwand** | 2 PT |

### P1-003 | Vorefallsstatistik aufbauen
| Feld | Wert |
|---|---|
| **Control-Bezug** | INC-03 (ISO 27001 A.16) |
| **Beschreibung** | Incident-Statistik mit KPIs (MTTR, MTBF) aufbauen |
| **Akzeptanzkriterien** | Dashboard; monatlicher Report; Trendanalyse |
| **Geschätzter Aufwand** | 4 PT |

### P1-004 | Pentest Q3/2026 planen
| Feld | Wert |
|---|---|
| **Control-Bezug** | SE-03 (ISO 27001 A.14) |
| **Beschreibung** | Externen Pentest für Q3/2026 beauftragen |
| **Akzeptanzkriterien** | Angebot; Scope-Definition; Zeitplan |
| **Geschätzter Aufwand** | 3 PT |

### P1-005 | Backup-Retention-Richtlinie finalisieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | AV-01 (BSI SYS.1.1) |
| **Beschreibung** | Backup-Retention für alle Systeme final dokumentieren |
| **Akzeptanzkriterien** | Retention-Tabelle; Löschfristen; Compliance-Nachweis |
| **Geschätzter Aufwand** | 2 PT |

### P1-006 | ISO 27701-Zertifizierung vorbereiten
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-01 (ISO 27701) |
| **Beschreibung** | Vorbereitung für ISO 27701-Zertifizierung starten |
| **Akzeptanzkriterien** | Gap-Analyse; Maßnahmenplan; Zeitplan |
| **Geschätzter Aufwand** | 8 PT |

### P1-007 | Agent-Aktivitäts-Logging einführen
| Feld | Wert |
|---|---|
| **Control-Bezug** | TR-01 (ISO 27001 A.12.4) |
| **Beschreibung** | Audit-fähiges Logging aller Agent-Aktionen |
| **Akzeptanzkriterien** | Log-Schema; Retention; Auswertbarkeit |
| **Geschätzter Aufwand** | 5 PT |

### P1-008 | Kundendaten-Isolation verifizieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-02 (CUSTOMER_PROJECT_ISOLATION_POLICY) |
| **Beschreibung** | Technische Isolation aller Kundenprojekte verifizieren |
| **Akzeptanzkriterien** | Isolation-Test; Bericht; ggf. Nachbesserung |
| **Geschätzter Aufwand** | 3 PT |

### P1-009 | AI-Fairness-Prüfprozess einführen
| Feld | Wert |
|---|---|
| **Control-Bezug** | AI-03 (ISO 42001) |
| **Beschreibung** | Regelmäßigen AI-Fairness-Prüfprozess etablieren |
| **Akzeptanzkriterien** | Prüfkriterien; Testdatensatz; Berichtsformat |
| **Geschätzter Aufwand** | 4 PT |

### P1-010 | SECURITY_POLICY.md reviewen und updaten
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-01 (ISO 27001 A.5.1) |
| **Beschreibung** | Security-Policy auf aktuellen Stand bringen |
| **Akzeptanzkriterien** | Review-Log; Änderungen dokumentiert |
| **Geschätzter Aufwand** | 2 PT |

### P1-011 | BCM-Wissenstransfer dokumentieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | BC-01 (ISO 22301) |
| **Beschreibung** | BCM-Verantwortlichkeiten und Erreichbarkeiten dokumentieren |
| **Akzeptanzkriterien** | Rufbereitschaftsplan; Vertretungsregelung |
| **Geschätzter Aufwand** | 1 PT |

### P1-012 | Monitoring-Playbook erstellen
| Feld | Wert |
|---|---|
| **Control-Bezug** | TR-02 (ITIL) |
| **Beschreibung** | Runbook für Monitoring-Alarme mit Handlungsanweisungen |
| **Akzeptanzkriterien** | Alarm-Katalog; Reaktionsmatrix; Escalation-Pfade |
| **Geschätzter Aufwand** | 4 PT |

### P1-013 | Cloudflare-Config-Dokumentation vervollständigen
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-11 |
| **Beschreibung** | Vollständige Dokumentation der Cloudflare-Tunnel, WAF-Regeln |
| **Akzeptanzkriterien** | Netzwerkdiagramm; Config-Backup; Change-Log |
| **Geschätzter Aufwand** | 3 PT |

### P1-014 | CIF-Review-Zyklus automatisieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-09 (CIF PDCA) |
| **Beschreibung** | Continuous-Improvement-Review als Cron-Job automatisieren |
| **Akzeptanzkriterien** | Automatischer Report; Alert bei Überfälligkeit |
| **Geschätzter Aufwand** | 3 PT |

### P1-015 | Geschäftsprozess-Kontinuitätsstrategie
| Feld | Wert |
|---|---|
| **Control-Bezug** | BC-01 (ISO 22301) |
| **Beschreibung** | BCM-Strategie für längerfristige Ausfälle (>24h) |
| **Akzeptanzkriterien** | Ausweichstandorte; Kommunikationsstrategie |
| **Geschätzter Aufwand** | 4 PT |

---

## 4. P2 — Mittelfristig (10 Items)

### P2-001 | BSI IT-Grundschutz-Vollzertifizierung
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-01 (BSI-Standard 200-1) |
| **Beschreibung** | Vollständige BSI IT-Grundschutz-Zertifizierung vorbereiten |
| **Akzeptanzkriterien** | Gap-Analyse; Maßnahmenplan; Zertifizierungsaudit |
| **Geschätzter Aufwand** | 20 PT |

### P2-002 | ISO 27001-Zertifizierungsaudit vorbereiten
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-01 (ISO 27001) |
| **Beschreibung** | Zertifizierungsaudit bei akkreditierter Stelle beantragen |
| **Akzeptanzkriterien** | Audit-Termin; vollständige Dokumentation |
| **Geschätzter Aufwand** | 15 PT |

### P2-003 | Sicherheitsvorfall-Übung (Tabletop)
| Feld | Wert |
|---|---|
| **Control-Bezug** | INC-02 (ISO 27001 A.16) |
| **Beschreibung** | Tabletop-Exercise für Ransomware-Szenario |
| **Akzeptanzkriterien** | Übungsleitfaden; Teilnehmer; Ergebnisbericht |
| **Geschätzter Aufwand** | 4 PT |

### P2-004 | Lieferanten-Audit-Programm
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-03 (ISO 27001 A.14) |
| **Beschreibung** | Jährliches Audit-Programm für kritische Lieferanten |
| **Akzeptanzkriterien** | Audit-Plan; Fragebogen; Berichte |
| **Geschätzter Aufwand** | 6 PT |

### P2-005 | DSGVO-Verfahrensverzeichnis erstellen
| Feld | Wert |
|---|---|
| **Control-Bezug** | DP-01 (DSGVO Art. 30) |
| **Beschreibung** | Vollständiges Verarbeitungsverzeichnis nach DSGVO Art. 30 |
| **Akzeptanzkriterien** | Alle VT; Zwecke, Rechtsgrundlagen, Empfänger |
| **Geschätzter Aufwand** | 6 PT |

### P2-006 | Business-Impact-Analyse (BIA) formalisieren
| Feld | Wert |
|---|---|
| **Control-Bezug** | BC-01 (ISO 22301) |
| **Beschreibung** | Formelle BIA mit Geschäftsprozess-Abhängigkeiten |
| **Akzeptanzkriterien** | BIA-Bericht; Abhängigkeiten; finanzielle Auswirkungen |
| **Geschätzter Aufwand** | 5 PT |

### P2-007 | Security-Architektur-Review
| Feld | Wert |
|---|---|
| **Control-Bezug** | SE-01 (ISO 27001 A.13, 42001) |
| **Beschreibung** | Security-Architektur-Review mit Threat Modeling |
| **Akzeptanzkriterien** | Threat-Model; STRIDE-Analyse; Verbesserungen |
| **Geschätzter Aufwand** | 8 PT |

### P2-008 | Mitarbeiter-Sicherheitsschulung
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-06 (ISO 27001 A.7) |
| **Beschreibung** | E-Learning-Plattform für Sicherheitsschulungen evaluieren |
| **Akzeptanzkriterien** | Plattform-Auswahl; First Course; Teilnahmequote |
| **Geschätzter Aufwand** | 5 PT |

### P2-009 | SOC-2-Vorbereitung
| Feld | Wert |
|---|---|
| **Control-Bezug** | IS-01 (SOC 2) |
| **Beschreibung** | SOC-2-Berichtsvoraussetzungen prüfen und vorbereiten |
| **Akzeptanzkriterien** | Gap-Analyse; Trust-Service-Kriterien-Zuordnung |
| **Geschätzter Aufwand** | 10 PT |

### P2-010 | Notfall-Handbuch in Druckform
| Feld | Wert |
|---|---|
| **Control-Bezug** | BC-01 (ISO 22301) |
| **Beschreibung** | Notfall-Handbuch als PDF für papierbasierte Notfälle |
| **Akzeptanzkriterien** | Druckversion; Notfall-Kontaktdaten; Offline-Verfügbar |
| **Geschätzter Aufwand** | 3 PT |

---

## 5. Metadaten & Status

| Attribut | Wert |
|---|---|
| Backlog erstellt | 2026-06-23 |
| Nächster Review | 2026-07-23 |
| Gesamtaufwand P0 | ~84 PT |
| Gesamtaufwand P1 | ~46 PT |
| Gesamtaufwand P2 | ~82 PT |
| **Gesamt** | **~212 PT** |
| Abhängigkeiten | BCM-Runbook → P1-015, TOM-Matrix → P2-005, AVV-Matrix → P2-004 |

**Legende:** ✅ ERSTELLT = im Rahmen dieses Tasks erstellt | 🔴 OFFEN = noch nicht umgesetzt | ⏳ IN ARBEIT = aktuell in Bearbeitung
