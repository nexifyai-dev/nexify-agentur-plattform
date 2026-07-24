# Informationssicherheitsrichtlinie (ISMS Policy)

**Dokument-ID:** IS-POL-001
**Version:** 1.1
**Datum:** 2026-07-08
**Klassifikation:** Vertraulich
**Verantwortlich:** Geschäftsführung / ISB
**Standard:** ISO/IEC 27001:2022 §5.2, BSI IT-Grundschutz
**Vorgänger:** v1.0 (2026-06-23)

---

## 0. Management-Bekenntnis (ISO 27001:2022 §5.1)

Die Geschäftsführung der NeXify GmbH bekennt sich zur Einführung, Aufrechterhaltung und kontinuierlichen Verbesserung eines Informationssicherheits-Managementsystems (ISMS) nach ISO/IEC 27001:2022. Sie stellt die erforderlichen Ressourcen bereit und kommuniziert die Bedeutung wirksamen Informationssicherheitsmanagements an alle Mitarbeitenden und Stakeholder.

---

## 1. Zweck und Geltungsbereich (§5.2 a)

Diese Richtlinie definiert das ISMS der NeXify GmbH. Sie gilt für:

- **Organisation:** NeXify GmbH, alle Standorte (VPS srv1243952, Cloud-Infrastruktur)
- **Personen:** Alle Mitarbeitenden, Auftragnehmer, Subunternehmer mit Zugang zu NeXifyAI-Systemen
- **Systeme:** Hermes Agent, Paperclip, 9Router, agentmemory, LightRAG, Spaether, alle Docker-Container und Datenbanken
- **Daten:** Alle Informationen im Besitz der NeXify GmbH — Kundendaten, Mandantendaten (NeXify Internal, Studienkolleg, Bookando), Betriebsdaten, Personaldaten
- **Prozesse:** Entwicklung, Deployment, Monitoring, Incident Response, Change Management

**Ausgeschlossen:** Keine. Die Richtlinie gilt organisationsweit.

---

## 2. Sicherheitsziele und Rahmenwerk (§5.2 b)

### 2.1 CIA-Triade

| Ziel | Definition | Messgröße |
|------|-----------|-----------|
| **Vertraulichkeit** | Schutz vor unbefugtem Zugriff | Access-Review-Quote ≥ 95% |
| **Integrität** | Korrektheit und Vollständigkeit | Backup-Integrität 100% |
| **Verfügbarkeit** | Zugänglichkeit bei Bedarf | Uptime ≥ 99,5% (Core-Dienste) |

### 2.2 Sicherheitsprinzipien

- **Defense-in-Depth** — Mehrschichtiger Schutz (Netzwerk, Host, Anwendung, Daten)
- **Least Privilege** — Minimalrechte-Prinzip, jeder Zugriff nur auf das Notwendigste
- **Need-to-Know** — Zugang nur bei dienstlicher Notwendigkeit
- **Separation of Duties** — Trennung von Entwicklung, Deployment und Betrieb
- **Secure-by-Default** — Systeme werden im sichersten Zustand ausgeliefert
- **Privacy-by-Design** — Datenschutz ist integraler Bestandteil der Architektur

### 2.3 Sicherheitsziele 2026

1. ISO 27001-Zertifizierungsreife erreichen (Ziel: Q4 2026)
2. Tenant-Isolation für alle 3 Mandanten vollständig implementiert und getestet
3. DSGVO-Compliance lückenlos dokumentiert (VVT, DPIA, AVV)
4. Security-Awareness-Schulung: 100% aller Mitarbeitenden geschult
5. Schwachstellen-Management: Kritische Patches ≤ 24h, Hohe ≤ 72h

---

## 3. Verpflichtung zur Erfüllung anwendbarer Anforderungen (§5.2 c)

Die NeXify GmbH verpflichtet sich zur Einhaltung aller anwendbaren:

- **Gesetzliche Anforderungen:** DSGVO (EU 2016/679), BDSG, BSI-KritisV (sofern anwendbar)
- **Regulatorische Anforderungen:** ISO/IEC 27001:2022, ISO/IEC 27701, BSI IT-Grundschutz
- **Vertragliche Anforderungen:** Kundenverträge, Auftragsverarbeitungsverträge (AVV), SLA-Verpflichtungen
- **Interne Anforderungen:** REGELWERK_MASTER.md, P0-Verbote, Governance-Dokumente (139)

---

## 4. Verpflichtung zur kontinuierlichen Verbesserung (§5.2 d)

Das ISMS folgt dem **PDCA-Zyklus** (Plan-Do-Check-Act):

### 4.1 Plan
- Jährliche Risikoanalyse (GAP-Analyse gegen ISO 27001:2022)
- Ableitung des Maßnahmenkatalogs (SOA — Statement of Applicability)
- Definition messbarer Sicherheitsziele

### 4.2 Do
- Implementierung der Sicherheitsmaßnahmen
- Jährliche Security-Awareness-Schulungen (100% Pflicht)
- Kommunikation der Richtlinien an alle Betroffenen
- Ressourcenbereitstellung durch Geschäftsführung

### 4.3 Check
- **Interne Audits:** Halbjährlich (durch ISB oder externen Auditor)
- **Management-Review:** Vierteljährlich (Geschäftsführung + ISB)
- **KPI-Monitoring:** Monatlich
  - Compliance-Score ≥ 90%
  - Schwachstellen-Patch-Zeit: Kritisch ≤ 24h, Hoch ≤ 72h
  - Schulungsquote: 100%
  - Incident-Response-Zeit: Kritisch ≤ 15 Min

### 4.4 Act
- Korrekturmaßnahmen bei Abweichungen (CAPA-Prozess)
- Lessons-Learned nach jedem Incident
- Jährliche Policy-Revision (nächste: 2027-07-08)

---

## 5. Rollen und Verantwortlichkeiten (§5.2 e)

| Rolle | Verantwortung | Benannt? |
|---|---|---|
| **Geschäftsführung (Pascal)** | Gesamtverantwortung, Budget, Management-Review, Policy-Freigabe | ✅ |
| **Informationssicherheitsbeauftragter (ISB)** | ISMS-Betrieb, Risikoanalyse, Audit-Programm, Incident-Response-Leitung | 🔴 Zu benennen |
| **Datenschutzbeauftragter (DSB)** | DSGVO-Compliance, DPIA, Verarbeitungsverzeichnis, Betroffenenrechte | 🔴 Zu benennen |
| **IT-Leitung / CTO** | Technische Umsetzung, Schwachstellen-Management, Backup/Restore, Härtung | 🔴 Zu benennen |
| **Alle Mitarbeitenden** | Einhaltung der Policies, Meldepflicht bei Vorfällen, Schulungsteilnahme | ✅ |

**Hinweis:** Die Rolle des ISB kann durch externen Dienstleister besetzt werden. DSB-Pflicht nach DSGVO §38 i.V.m. BDSG §5 ist zu prüfen.

---

## 6. Risikomanagement-Prozess

1. **Asset-Inventarisierung** — Alle Informationswerte (Systeme, Daten, Prozesse) werden erfasst
2. **Bedrohungsanalyse** — Identifikation von Bedrohungen und Schwachstellen
3. **Risikobewertung** — Bewertung nach Eintrittswahrscheinlichkeit × Schadensausmaß (5×5-Matrix)
4. **Risikobehandlung** — Akzeptieren, Vermindern, Übertragen (Versicherung), Vermeiden
5. **Restrisikoakzeptanz** — Dokumentierte Entscheidung der Geschäftsführung

**Risikomatrix siehe:** `phase2_isms_dokumentation.md` §4.1

---

## 7. Kommunikation der Richtlinie (§5.2 f)

Diese Richtlinie wird:

- Als **documented information** verfügbar gehalten (dieses Dokument)
- Innerhalb der Organisation kommuniziert (Onboarding, Schulungen, Aushang)
- **Interessierten Parteien** auf Anforderung in geeigneter Form zugänglich gemacht
- Bei **wesentlichen Änderungen** unverzüglich aktualisiert und erneut kommuniziert

---

## 8. Dokumentation

Alle ISMS-Dokumente werden im Repository unter `nexify/04_evidence/` versioniert (Git). Dokumentenregister siehe `phase2_isms_dokumentation.md` §6.

---

## 9. Konsequenzen bei Nichteinhaltung

Verstöße gegen diese Richtlinie können:

- Zu Sicherheitsvorfällen mit potenziell schwerwiegenden Folgen führen
- Rechtliche Konsequenzen für die NeXify GmbH und verantwortliche Personen haben
- Disziplinarische Maßnahmen bis zur Kündigung nach sich ziehen

Jeder Verstoß ist unverzüglich dem ISB zu melden.

---

## 10. Review-Zyklus

- **Jährlich:** Vollständige Policy-Revision durch ISB + Geschäftsführung
- **Ereignisgetrieben:** Bei wesentlichen Änderungen der Organisation, IT-Architektur oder Gesetzeslage
- **Nächste planmäßige Revision:** 2027-07-08

---

## 11. Referenzen

| Dokument | ID |
|---|---|
| ISO/IEC 27001:2022 | Internationaler Standard |
| ISO/IEC 27002:2022 | Code of Practice |
| BSI IT-Grundschutz | BSI 200-1, 200-2, 200-3 |
| REGELWERK_MASTER.md | Internes Regelwerk |
| GESAMTPROJEKTZIEL.md | Projektziele & Backlog |
| phase2_isms_dokumentation.md | Detaillierte ISMS-Dokumentation (93 Controls) |

---

## 12. ISO 27001:2022 §5.2 — Konformitätsmatrix

| Anforderung §5.2 | Erfüllt durch | Abschnitt |
|---|---|---|
| a) dem Zweck der Organisation angemessen | Geltungsbereich, Scope-Definition | §1 |
| b) Rahmen für Sicherheitsziele | CIA-Triade, Ziele 2026 | §2 |
| c) Verpflichtung zur Erfüllung von Anforderungen | Gesetze, Normen, Verträge | §3 |
| d) Verpflichtung zur kont. Verbesserung | PDCA-Zyklus | §4 |
| e) Rollen & Verantwortlichkeiten | RACI-Matrix | §5 |
| f) Kommunikation & Verfügbarkeit | Richtlinien-Kommunikation | §7 |

**Konformitätsstatus:** ✅ VOLLSTÄNDIG (alle §5.2-Anforderungen abgedeckt)

---

**Freigabe:** Geschäftsführung NeXify GmbH
**Datum:** 2026-07-08
**Unterschrift (digital):** _Pascal — Geschäftsführer_

---

*Dieses Dokument ist gelenkt. Die aktuelle Version befindet sich im Git-Repository `nexify-agentur-plattform` unter `nexify/04_evidence/isms_policy.md`. Gedruckte oder lokale Kopien sind ungelenkt.*
