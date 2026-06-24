# NeXify AI — Normenregister V2
> Stand: 23.06.2026 | Version: 2.0
> Dreigeteilt: Normen (DIN/ISO/EN) | Gesetze (EU/DE/NL) | Standards/Frameworks (WCAG/OWASP/CIS)
> Artefakt-getrieben: Jeder Output-Typ bestimmt seine Pflichtprüfungen

## Prioritätsstufen
- **P0**: Rechtlich zwingend oder existenziell für Betrieb
- **P1**: Erforderlich für Professionalität, Kundenvertrauen, Haftungsminimierung
- **P2**: Empfohlen zur Qualitätssicherung und Marktdifferenzierung
- **P3**: Optional, strategisch für Wachstum

---

## TEIL A — NORMEN (DIN, DIN EN ISO, ISO/IEC, EN)

### Bereich 1: Webdesign / UX / Barrierefreiheit

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| DIN EN ISO 9241-11:2018 | Gebrauchstauglichkeit (Effectiveness, Efficiency, Satisfaction) | P1 | WebUI, Kundenportale, Landingpages |
| DIN EN ISO 9241-110:2020 | Dialogprinzipien (Aufgabenangemessenheit, Selbstbeschreibungsfähigkeit, Steuerbarkeit, etc.) | P1 | UI-Komponenten, Formulare, Workflows |
| DIN EN ISO 9241-210:2020 | Human-Centred Design für interaktive Systeme | P0 | Alle nutzerinteraktiven Systeme |
| DIN EN ISO 9241-143:2014 | Formulare | P2 | Formulargestaltung, Validierung, Fehlermeldungen |
| DIN EN ISO 9241-302:2009 | Elektronische Sichtanzeigen | P3 | Farbschemata, Kontraste, Auflösung |
| DIN EN ISO 9241-125:2019 | Visuelle Informationsdarstellung | P2 | Dashboard-Design, Datenvisualisierung |
| DIN EN ISO 9241-220:2020 | HCD-Prozesse für agile Entwicklung | P2 | UX in Sprint-Zyklen |
| EN 301 549 V3.2.1 | Barrierefreiheit von ICT-Produkten (EU) | P0 | WebUI, PDFs, mobile Ansichten |
| DIN EN ISO 21542:2022 | Barrierefreiheit von Gebäuden | P3 | Nur bei physischen Standorten |

### Bereich 2: AI-Agenten / KI-Systeme

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| ISO/IEC 42001:2023 | AI-Managementsystem (AIMS) | P0 | Alle Agenten, Modelle, 9Router |
| ISO/IEC 23894:2023 | KI-Risikomanagement | P0 | AI-Risikoklassifizierung |
| ISO/IEC 22989:2022 | KI-Begriffe und Konzepte | P1 | Terminologie, Rollenmodell |
| ISO/IEC 23053:2022 | Framework für KI-Systeme | P1 | KI-Systemarchitektur |
| ISO/IEC 24027:2021 | Bias in KI-Systemen | P1 | Bias-Prüfungen, Datensatzqualität |
| ISO/IEC 24028:2020 | KI-Sicherheit (Trustworthiness) | P1 | Robustheit, Zuverlässigkeit |
| ISO/IEC 38507:2022 | AI Governance für Organisationen | P2 | AI-Strategie, Führungsrollen |
| ISO/IEC 42005:2024 | KI-System-Impact-Assessment | P2 | Wirkungsanalyse |

### Bereich 3: Software / API

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| ISO/IEC 25010:2023 | System-/Software-Qualitätsmodell (SQuaRE) | P0 | Code-Qualität, Tests, Wartbarkeit |
| ISO/IEC 25012:2008 | Datenqualitätsmodell | P1 | RAGFlow-Daten, Brain-Daten |
| ISO/IEC 25030:2019 | Qualitätsanforderungen | P1 | Anforderungsmanagement |
| ISO/IEC 25040:2011 | Qualitätsbewertung | P2 | Release-Qualitätsgates |
| ISO/IEC/IEEE 12207:2017 | Software-Lifecycle-Prozesse | P0 | Entwicklungsprozess |
| ISO/IEC/IEEE 15288:2015 | System-Lifecycle-Prozesse | P1 | System-Engineering |
| ISO/IEC/IEEE 29119-1:2021 | Software-Testing (Konzepte) | P1 | Teststrategie |
| ISO/IEC 330xx (SPICE) | Prozess-Assessment-Modell | P3 | Bei Kundenanfrage |

### Bereich 4: Informationssicherheit

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| ISO/IEC 27001:2022 | ISMS (Anforderungen) | P0 | Kernsysteme, Zugriff, Incident, Backup |
| ISO/IEC 27002:2022 | ISMS-Maßnahmen (93 Controls) | P0 | Konkrete Security-Umsetzung |
| ISO/IEC 27005:2022 | ISRM (InfoSec Risk Management) | P1 | Risikobewertungen |
| ISO/IEC 27017:2015 | Cloud-Sicherheit | P1 | Cloudflare, Vercel, Hetzner |
| ISO/IEC 27018:2019 | PII in Cloud-Umgebungen | P0 | DSGVO-konforme Cloud-Nutzung |
| ISO/IEC 27031:2011 | ICT Readiness for Business Continuity | P1 | IT-Notfallvorsorge |

### Bereich 5: Datenschutz / Privacy

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| ISO/IEC 27701:2019 | PIMS (Privacy Information Management) | P0 | VT, AVV, Betroffenenrechte, Löschung |
| ISO/IEC 27018:2019 | PII-Schutz in Clouds | P0 | Cloud-Dienste (s.o.) |

### Bereich 6: Inhalte / Texte / Briefe / E-Mails / PDFs

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| DIN 5008:2020 | Schreib- und Gestaltungsregeln | P1 | Briefe, E-Mails, Angebote, PDFs |
| DIN 676:2020 | Geschäftsbrief-Vorlage | — | ZURÜCKGEZOGEN — in DIN 5008 integriert [Quelle: dinmedia.de 404] |
| DIN 5009:2022 | Texttelefon-/Vorlesekommunikation | P2 | Barrierefreie Kommunikation |
| ISO 24495-1:2022 | Verständliche Sprache (Plain Language) | P1 | Landingpages, Hilfe, Angebote |
| ISO 8601:2019 | Datums- und Zeitangaben | P2 | Formatvorgaben |

### Bereich 7: Betrieb / Service / Management

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| ISO/IEC 20000-1:2018 | IT-Service-Management | P0 | SLA, Incident, Change, Release |
| ISO 22301:2019 | Business Continuity (BCMS) | P0 | RTO/RPO, Notfallpläne, Übungen |
| ISO 22313:2022 | Business Continuity (Leitfaden) | P2 | BCM-Leitfaden |
| ISO 31000:2018 | Risikomanagement | P1 | Alle Risikobewertungen |
| ISO 37301:2021 | Compliance-Management | P1 | Compliance-Struktur |
| ISO 9001:2015 | Qualitätsmanagement (QMS) | P1 | Prozesse, Audits, Verbesserung |
| ISO 10006:2018 | Qualität im Projektmanagement | P2 | Projekt-QM |
| ISO 26000:2010 | Gesellschaftliche Verantwortung (CSR) | P3 | Nachhaltigkeit, Transparenz |

### Bereich 8: Kundendienst / Support

| Norm | Titel | P | Scope bei NeXify |
|------|-------|---|-------------------|
| ISO 9001 (A.8) | Customer Communication | P1 | Kundenfeedback, Beschwerden |
| DIN EN ISO 9241-220:2020 | HCD in Dienstleistungen | P2 | Support-Interaktionen |

---

## TEIL B — GESETZE (EU, DE, NL)

| Gesetz | Titel | P | Scope |
|--------|-------|---|-------|
| DSGVO (2016/679) | Datenschutzgrundverordnung | P0 | Alle personenbezogenen Daten |
| EU AI Act (2024/1689) | KI-Verordnung | P0 | Alle KI-Systeme (Agenten, Modelle) |
| NIS-2 (2022/2555) | Netz- und Informationssicherheit | P1 | Kritische Dienste, VPS |
| Cyber Resilience Act | Cybersicherheit Digitalprodukte | P1 | Software-Produkte |
| ePrivacy-RL / TTDSG | E-Privacy (Cookies, Tracking) | P1 | WebUI, Landingpages |
| Data Act (2023/2854) | Datennutzung | P2 | Datenzugriff, Datenportabilität |
| Data Governance Act (2022/868) | Daten-Governance | P2 | Datenqualität, Nachnutzung |
| BDSG | Bundesdatenschutzgesetz (DE) | P0 | DSGVO-Ergänzung |
| BFSG | Barrierefreiheitsstärkungsgesetz (DE) | P1 | Digitale Produkte ab 28.06.2025 |
| BITV 2.0 | Barrierefreie IT-Verordnung | P2 | Öffentliche Kunden |
| UAVG | Uitvoeringswet AVG (NL) | P2 | Niederländische Kunden |
| UWG | Gesetz gegen unlauteren Wettbewerb | P1 | Werbung, Angebote, Claims |
| BGB | Bürgerliches Gesetzbuch | P2 | Verträge, AGB, Haftung |
| GoBD (2019) | Grundsätze ordnungsmäßiger DV-gestützter Buchführung | P2 | Buchhaltung/Finanzen |
| HGB | Handelsgesetzbuch | P2 | Buchführungspflicht |
| MarkenG / UrhG | Markenrecht / Urheberrecht | P1 | Logos, Claims, Referenzen |

---

## TEIL C — STANDARDS & FRAMEWORKS (WCAG, OWASP, CIS, BSI, NIST)

| Standard | Bereich | P | Scope |
|----------|---------|---|-------|
| WCAG 2.2 (A/AA/AAA) | Barrierefreiheit | P0 | WebUI, Landingpages, PDFs |
| OWASP Top 10 Web | Web Security | P0 | API, WebUI, Landingpages |
| OWASP ASVS 4.0 | Application Security Verification | P1 | Security-Tests |
| OWASP LLM Top 10 | LLM Security | P0 | 9Router, Agenten-Prompts |
| OWASP Agentic AI Top 10 | Agentic AI Security | P0 | Autonome Agenten |
| OWASP AI Agent Security Cheat Sheet | AI Agent Security | P1 | Agenten-Konfiguration |
| CIS Controls V8 | Basis-Sicherheitsmaßnahmen | P1 | Infrastruktur |
| BSI IT-Grundschutz | Basis-Sicherheit (DE) | P2 | Ergänzung zu ISO 27001 |
| BSI TR-03161 | KI-Sicherheitsprüfung | P2 | KI-Systemprüfung |
| BSI-KRITIS-V | KRITIS-Verordnung | P3 | Bei kritischen Kunden (selten) |
| ENISA Guidelines | AI Threat Landscape | P2 | Bedrohungsanalyse |
| ISO/IEC 38500 | IT-Governance | P3 | Organisationssteuerung |
| COBIT 2019 | IT-Governance-Framework | P3 | Bei Kundenanfrage |
| ITIL 4 | ITSM-Framework | P2 | Betriebsprozesse |
| NIST AI RMF 1.0 | AI Risk Management | P2 | AI-Risikomanagement (US, Referenz) |
| SAE J3016 | Automatisierungsstufen | P3 | Agenten-Autonomie (Referenz) |

---

## TEIL D — ARTEFAKT-TYP -> NORM-MATRIX

| Artefakttyp | Pflicht-Normen | Pflicht-Gesetze | Pflicht-Standards | Verbot |
|-------------|----------------|-----------------|-------------------|--------|
| **Website / Landingpage / Web-App** | 9241-11, 9241-110, 9241-210, 9241-143, EN 301 549, 24495-1 | DSGVO, ePrivacy, BFSG, EU AI Act (Transparenz), UWG | WCAG 2.2 AA, OWASP Top 10 | Keine ungeprüften Inhalte, kein Tracking ohne Einwilligung |
| **AI-Agent / Automatisierung** | 42001, 23894, 22989, 23053, 24027, 24028 | EU AI Act, DSGVO | OWASP LLM Top 10, OWASP Agentic Top 10, OWASP AI Agent Cheat | Keine autonome Aktion auf Production/Secrets/Delete |
| **Software / API / Backend / DB** | 25010, 12207, 15288, 29119 | Cyber Resilience Act, DSGVO (PII) | OWASP ASVS, CIS Controls | Kein Merge ohne Tests, keine Secrets im Code |
| **Geschäftsbrief / E-Mail / Angebot / PDF / Vertrag** | DIN 5008, DIN 676, ISO 24495-1, EN 301 549 | DSGVO, UWG, BGB, MarkenG/UrhG | WCAG/PDF Accessibility | Keine irreführenden Aussagen, keine ungeprüfte KI als „menschlich“ |
| **Datenschutzdokument / AVV / TOM / Policy** | ISO 27701, 27018 | DSGVO, BDSG/UAVG | BSI IT-Grundschutz | Keine unvollständigen Verarbeitungsverzeichnisse |
| **Designsystem / UI-Komponente / Formular** | 9241-11, 9241-110, 9241-210, 9241-143, EN 301 549 | BFSG | WCAG 2.2 AA | Keine nicht-tastaturbedienbaren Komponenten |
| **Projektplan / Kundenprozess / Support** | ISO 9001, 20000-1, 69901 (DIN) | DSGVO | ITIL 4 | Keine Kundenprojekt-Vermischung (Tenant-Trennung) |
| **Monitoring / Betrieb / Incident / Deployment** | ISO 27001, 22301, 20000-1, 27031 | NIS-2, DSGVO (Logs) | CIS Controls, OWASP | Kein Deployment ohne Rollback-Plan |

---

## TEIL E — AUSGESCHLOSSENE NORMEN (mit Begründung)

| Norm | Begründung |
|------|------------|
| ISO 13485 | Medizinprodukte — kein Medizin-Kunde |
| ISO 14001 | Umweltmanagement — nicht kernrelevant für AI-Agentur |
| ISO 45001 | Arbeitsschutz — remote-first Agentur |
| ISO 50001 | Energiemanagement — nicht relevant |
| ISO 41001 | Facility Management — kein physischer Standort |
| ISO 37001 | Antikorruption — noch unter Schwellenwert |
| ISO 28000 | Lieferkettensicherheit — keine physische Lieferkette |
| ISO 20121 | Veranstaltungen — keine Events |
| IEC 62304 | Medizin-Software — kein Medizinprodukt |
| IEC 61508 | Funktionale Sicherheit — keine sicherheitskrit. Systeme |
| ISO 26262 | Automotive Safety — kein Automotive |
| DIN EN 50173 | Netzwerkverkabelung — Cloud-Infrastruktur |
| ISO 22000 | Lebensmittel — nicht relevant |
| ISO 39001 | Verkehrssicherheit — nicht relevant |
| ISO 55001 | Asset-Management — keine physischen Assets |
| ISO 37101 | Nachhaltige Städte — nicht relevant |
| ISO 50001 | Energiemanagement — nicht relevant für Software |
| ISO/IEC 19770 | IT-Asset-Management — nicht eingeführt |
| ISO 21500 | Projektmanagement — durch DIN 69901 + ISO 9001 abgedeckt |
