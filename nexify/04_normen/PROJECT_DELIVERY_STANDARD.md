# PROJECT_DELIVERY_STANDARD — Projektdurchführungs-Standard

| Feld | Wert |
|------|------|
| **Dokumenttyp** | Standard (ISO 9001:2015, DIN 69901-5:2009) |
| **Version** | 1.0 |
| **Stand** | 23.06.2026 |
| **Nächste Prüfung** | 23.06.2027 |
| **Verantwortlich** | Pascal |
| **Geltungsbereich** | Alle Kunden- und internen Projekte der NeXify AI |

---

## 1. Geltungsbereich

Dieser Standard gilt für alle Projekte:

- **Kundenprojekte** (z. B. KI-Agenten-Integration, Automatisierung, SaaS-Anpassung)
- **Interne Projekte** (Plattformentwicklung, Infrastruktur, Governance)
- **Agenten-Projekte** (Von KI-Agenten ausgeführte Aufgaben)

Referenz: ISO 9001:2015 (QMS), DIN 69901-5:2009 (Projektmanagement), ISO 31000 (Risikomanagement).

---

## 2. Projektphasen (DIN 69901)

Jedes Projekt durchläuft 5 Phasen:

### 2.1 Init (Projektstart)

| Aktivität | Artefakt | Verantwortlich |
|-----------|----------|---------------|
| Projektauftrag definieren | Project Charter | Pascal |
| Stakeholder identifizieren | Stakeholder-Matrix | Pascal |
| Ziele und Scope festlegen | Ziel-Definition | Pascal + Kunde |
| Grobe Aufwandsschätzung | Schätzung (T-Shirt-Sizing) | Pascal |
| Kundenvertrag / Angebot | Angebot + AGB | Pascal |

### 2.2 Plan (Projektplanung)

| Aktivität | Artefakt | Verantwortlich |
|-----------|----------|---------------|
| Projektplan erstellen | Projektplan (GitHub Milestones) | Pascal |
| Ressourcenplanung | Ressourcen-Matrix | Pascal |
| Risikoanalyse | Risiko-Protokoll | Pascal |
| Kommunikationsplan | Kommunikations-Matrix | Pascal |
| Qualitätsplan | Qualitätskriterien (ISO 25010) | Pascal |
| AVV-Prüfung (falls personenbezogen) | AVV / DPA | Pascal |

### 2.3 Execute (Projektdurchführung)

| Aktivität | Artefakt | Verantwortlich |
|-----------|----------|---------------|
| Sprint-Planung (2-Wochen-Sprints) | Sprint-Backlog | Pascal |
| Entwicklung nach SE-Standard | Code, Tests, Doku | Pascal |
| Regelmäßige Kundenkommunikation | Status-E-Mail / Dashboard | Pascal |
| Änderungsmanagement | Change-Request | Pascal |
| Qualitätssicherung | Test-Ergebnisse, Review | Pascal |

### 2.4 Monitor (Überwachung und Steuerung)

| Metrik | Messung | Frequenz |
|--------|---------|----------|
| Projektfortschritt | % Abgeschlossen (vs. Plan) | Wöchentlich |
| Budget | Ist vs. Soll (Stunden) | Wöchentlich |
| Qualität | Test-Coverage, Bug-Rate | Nach jedem Release |
| Risiko | Risiko-Status (offen/geschlossen) | Wöchentlich |
| Kundenzufriedenheit | Feedback-Runde | Nach Meilenstein |

### 2.5 Close (Projektabschluss)

| Aktivität | Artefakt | Verantwortlich |
|-----------|----------|---------------|
| Abnahme durch Kunden | Abnahmeprotokoll | Pascal + Kunde |
| Übergabe-Dokumentation | Handbuch, API-Doku | Pascal |
| Lessons Learned | Lessons-Learned-Protokoll | Pascal |
| Daten-Löschung (nach Vertragsende) | Löschprotokoll (AVV-konform) | Pascal |
| Rechnung | Schlussrechnung | Pascal |

---

## 3. Qualitätssicherung (QM-01 bis QM-05)

| Control | Maßnahme | Frequenz |
|---------|---------|----------|
| **QM-01** | Qualitätspolicy definiert und kommuniziert | Jährlich |
| **QM-02** | Prozessdokumentation aktuell | Jährlich |
| **QM-03** | Interne Audits (Prozesse, Projekte) | Halbjährlich |
| **QM-04** | Korrekturmaßnahmen bei Abweichungen | Nach Bedarf |
| **QM-05** | Kundenfeedback systematisch erfassen | Nach jedem Projekt |

---

## 4. Kommunikationsmanagement (QM-02)

| Kommunikationsweg | Inhalt | Frequenz | Empfänger |
|-------------------|--------|----------|-----------|
| **Status-E-Mail** | Fortschritt, nächste Schritte, Risiken | Wöchentlich | Kunde |
| **Sprint-Review** | Demo abgeschlossener Arbeit | Alle 2 Wochen | Kunde |
| **Dashboard** | Live-Status auf work.nexifyai.cloud | Permanent | Kunde |
| **Incident-Meldung** | Sicherheits-/Ausfall-Vorfall | Sofort | Kunde |
| **Rechnung** | Abrechnung | Monatlich / Meilenstein | Kunde |

---

## 5. Risikomanagement (ISO 31000)

| Schritt | Beschreibung | Tool |
|---------|-------------|------|
| **Identifikation** | Risiken pro Projekt erfassen | Risiko-Protokoll (10_evidence/risiko/) |
| **Bewertung** | Eintrittswahrscheinlichkeit × Schaden | Risk-Matrix |
| **Behandlung** | Vermeiden, Vermindern, Überwälzen, Akzeptieren | Maßnahmenplan |
| **Überwachung** | Regelmäßiges Risiko-Review | Wöchentlich im Status |

Risiko-Kategorien:
- **Technisch** (Ausfall, Security, Performance)
- **Organisatorisch** (Ressourcen, Kommunikation)
- **Compliance** (DSGVO, AI Act, Vertrag)
- **Kaufmännisch** (Budget, Zahlungsausfall)

---

## 6. Dokumentation (QM-02)

Jedes Projekt erhält:

| Dokument | Zweck | Ablage |
|----------|-------|--------|
| Project Charter | Projektziele, Scope, Budget | `02_auftraege/` |
| Projektplan | Meilensteine, Aufgaben | GitHub / `02_auftraege/` |
| Architektur-Doku | ADR + Tech-Stack | `03_regelwerke/adr/` |
| Test-Dokumentation | Testfälle, Ergebnisse | `10_evidence/tests/` |
| Abnahmeprotokoll | Formelle Abnahme | `10_evidence/projekte/` |
| Lessons Learned | Verbesserungspotenzial | `10_evidence/projekte/` |

---

## 7. Evidence-Pflicht (V05)

Jede Abschlussmeldung enthält:

- ✅ Fertige Dateien / Diffs / Commits
- ✅ Erfolgreiche Test-Logs (CI-Grün)
- ✅ Quellenangaben (Brain, Recherche, Referenzen)
- ✅ Änderungsnachweis (Changelog, Git-Log)

Ohne Evidence: Task zurückgewiesen (V05).

---

## 8. Tenant-Trennung (V07)

- Jedes Kundenprojekt: Eigener Tenant (Daten-Isolation)
- Tenant-Trennung auf Brain-Ebene (Collection-Isolation)
- Tenant-Trennung auf Agenten-Ebene (Agent-Tenant-Context)
- Keine Datenvermischung zwischen Projekten

---

## 9. Verweise

| Dokument | Pfad |
|----------|------|
| Normenregister | `NORMENREGISTER.md` |
| CONTROL_CATALOG (QM-01 bis QM-05) | `CONTROL_CATALOG.yaml` |
| Verbote und Pflichtregeln | `VERBOTE_UND_PFLICHTREGELN.md` |
| Software-Engineering-Standard | `SOFTWARE_ENGINEERING_STANDARD.md` |
| Security Policy | `SECURITY_POLICY.md` |
| Aufgaben-Register | `08_kanban_tasks/` |

---

*Ende der PROJECT_DELIVERY_STANDARD*
