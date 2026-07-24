# NeXify AI — Normenregister
> Stand: 23.06.2026 | Version: 1.0
> Erstellt nach DIN, ISO/IEC, BSI, CEN/CENELEC und EU-Regelwerken
> Scope: NeXify AI by NeXify — AI-/Automatisierungsagentur, SaaS, autonome Agenten

## Prioritätsstufen
- **P0**: Unmittelbar umsetzungspflichtig (rechtlich oder existenziell)
- **P1**: Notwendig für Betrieb, Qualität und Kundenvertrauen
- **P2**: Empfohlen für Professionalität und Wettbewerbsfähigkeit
- **P3**: Optional, strategisch für Wachstum

---

## 1. Relevante Normen

### ISO/IEC 27001:2022 — Informationssicherheit-Managementsystem (ISMS)
- **Priorität:** P0
- **Kategorie:** security
- **Begründung:** Kern-Norm für alle Systeme. Zugriffskontrolle, Asset-Management, Incident-Response, Lieferantenprüfung, Backup/Recovery, CI/CD-Sicherheit
- **Scope:** Alle Systeme (VPS, Cloudflare, GitHub, Brain, Qdrant, 9Router, RAGFlow), Kundenprojekte, AV-Management
- **Controls:** Asset-Inventar, Risikobehandlungsplan, Zugriffsmatrix, Incident-Prozess, Backup-Test, Lieferantenbewertung, Awareness, interne Audits
- **Quelle:** https://www.iso.org/standard/27001

### ISO/IEC 27002:2022 — Informationssicherheits-Maßnahmen
- **Priorität:** P0
- **Kategorie:** security
- **Begründung:** Konkrete Controls zu 27001. 93 Maßnahmen, u.a. Zugriff, Krypto, Löschung, Logging, Schulung
- **Scope:** Ergänzung zu 27001. Konkrete Umsetzungsvorgaben für alle Systeme
- **Controls:** 93 Controls in 4 Bereichen: Organisatorisch, Personenbezogen, Physisch, Technisch
- **Quelle:** https://www.iso.org/standard/27002

### ISO/IEC 27701:2019 — Datenschutz-Management (PIMS)
- **Priorität:** P0
- **Kategorie:** privacy
- **Begründung:** Erweiterung 27001 für DSGVO-Compliance. AVV-Management, Betroffenenrechte, Löschkonzepte, Verzeichnis VT
- **Scope:** DSGVO-pflichtige Systeme: Brain (Speicher), RAGFlow (Dokumente), GitHub (Code), Cloudflare (Logs), Kundendaten
- **Controls:** Verzeichnis VT, AVV-Matrix, Betroffenenrechte-Prozess, Löschfristen, Drittanbieter-Prüfung, Datenschutz-Folgenabschätzung
- **Quelle:** https://www.iso.org/standard/27701

### ISO/IEC 42001:2023 — KI-Managementsystem (AIMS)
- **Priorität:** P0
- **Kategorie:** ai
- **Begründung:** Kerngeschäft: Autonome AI-Agenten. Rollenmodell, Risikoklassifizierung, Human Oversight, Bias, Logging, Modellfreigabe, Monitoring
- **Scope:** Alle Agenten (Hermes, Recherche, Content), 9Router (Modell-Routing), RAGFlow (Dokumenten-RAG), Brain (Wissen)
- **Controls:** AI-Systeminventar, Rollenmodell, Risikoklassifizierung, Human Oversight, Logging, Datenqualität, Modellfreigabe, Monitoring, Bias/Robustheit, Kundenhinweise, Agenten-Aktionssperren
- **Quelle:** https://www.iso.org/standard/42001

### ISO/IEC 23894:2023 — KI-Risikomanagement
- **Priorität:** P0
- **Kategorie:** ai
- **Begründung:** Risikomanagement speziell für KI. Ergänzt 42001 und 31000
- **Scope:** Alle KI-Systeme: Agenten, Modelle via 9Router, RAGFlow, automatisierte Entscheidungen
- **Controls:** KI-Risikoidentifikation, -Bewertung, -Behandlung, Auswirkungsanalyse, kontinuierliches Monitoring
- **Quelle:** https://www.iso.org/standard/23894

### ISO 9001:2015 — Qualitätsmanagementsystem (QMS)
- **Priorität:** P1
- **Kategorie:** quality
- **Begründung:** Kundenprojekte: Qualitätssicherung, Prozessdokumentation, kontinuierliche Verbesserung
- **Scope:** Projektmanagement, Delivery-Prozess, Kundenkommunikation, Agenten-Output-Qualität
- **Controls:** Qualitätspolitik, Prozessdokumentation, interne Audits, Korrekturmaßnahmen, Kundenfeedback, Management-Review
- **Quelle:** https://www.iso.org/standard/9001

### ISO/IEC 20000-1:2018 — IT-Service-Management (ITSMS)
- **Priorität:** P1
- **Kategorie:** service
- **Begründung:** Betrieb unserer SaaS-Plattform work.nexifyai.cloud. SLA, Incident, Change, Service-Level
- **Scope:** work.nexifyai.cloud, VPS-Betrieb, API-Services (Brain, Qdrant, 9Router, RAGFlow)
- **Controls:** Service-Level-Vereinbarungen, Incident-Management, Change-Management, Konfigurationsmanagement, Release-Management, Kapazitätsmanagement
- **Quelle:** https://www.iso.org/standard/20000

### ISO 22301:2019 — Business Continuity (BCMS)
- **Priorität:** P1
- **Kategorie:** resilience
- **Begründung:** Ausfallsicherheit: VPS, Docker, Cloudflare Tunnel, Brain, Qdrant müssen wiederherstellbar sein
- **Scope:** Kern-Infrastruktur: VPS, Docker, Brain, Qdrant, 9Router, RAGFlow, Cloudflare-Konfiguration
- **Controls:** BCM-Policy, BIA (Business Impact Analysis), Wiederherstellungsziele (RTO/RPO), Notfallpläne, Übungen, Evaluierung
- **Quelle:** https://www.iso.org/standard/22301

### ISO 31000:2018 — Risikomanagement
- **Priorität:** P1
- **Kategorie:** risk
- **Begründung:** Grundlage für alle risikobasierten Entscheidungen: Security, Betrieb, Compliance, Kundenprojekte
- **Scope:** Organisationsweit: IT-Risiken, Compliance-Risiken, Kundenprojektrisiken, AI-Risiken
- **Controls:** Risikoidentifikation, Risikoanalyse, Risikobewertung, Risikobehandlung, Überwachung, Kommunikation
- **Quelle:** https://www.iso.org/standard/31000

### ISO 37301:2021 — Compliance-Management
- **Priorität:** P1
- **Kategorie:** compliance
- **Begründung:** Systematisches Compliance-Management. DSGVO, EU AI Act, NIS-2, GoBD
- **Scope:** Alle Compliance-Anforderungen: Datenschutz, Security, AI-Regulierung, Buchhaltung
- **Controls:** Compliance-Policy, Verpflichtungsregister, Risikobewertung, Schulungen, Berichterstattung, Whistleblowing
- **Quelle:** https://www.iso.org/standard/37301

### ISO/IEC 25010:2023 — Software-Qualitätsmodell (SQuaRE)
- **Priorität:** P1
- **Kategorie:** software
- **Begründung:** Qualitätsmodell für Softwareentwicklung. Funktionalität, Performance, Sicherheit, Wartbarkeit
- **Scope:** Eigenentwicklungen: Platform, Agenten, WebUI, API-Services
- **Controls:** Qualitätsmerkmale, Metriken, Messung, Bewertung, verbesserung
- **Quelle:** https://www.iso.org/standard/25010

### ISO/IEC/IEEE 12207:2017 — Software-Lifecycle-Prozesse
- **Priorität:** P1
- **Kategorie:** software
- **Begründung:** Standardisierte Softwareentwicklungsprozesse: Anforderung, Architektur, Implementierung, Test, Betrieb
- **Scope:** Softwareentwicklung, CI/CD, Deployment, Betrieb
- **Controls:** Prozessdefinition, Anforderungsmanagement, Architekturdefinition, Implementierungsprozess, Testprozess, Lieferprozess
- **Quelle:** https://www.iso.org/standard/12207

### DIN EN ISO 9241-210:2020 — Menschzentrierte Gestaltung interaktiver Systeme
- **Priorität:** P2
- **Kategorie:** ux
- **Begründung:** UX-Standard für WebUI, Kundenportale, Agenten-Interfaces
- **Scope:** WebUI work.nexifyai.cloud, Kundenprojekt-Interfaces
- **Controls:** Nutzungskontextanalyse, Nutzungsanforderungen, Gestaltungslösungen, Evaluation
- **Quelle:** https://www.beuth.de/de/norm/din-en-iso-9241-210

### DIN 69901-5:2009 — Projektmanagement (PM)
- **Priorität:** P2
- **Kategorie:** management
- **Begründung:** Deutscher PM-Standard. Begriffe, Prozesse, Prozessmodelle
- **Scope:** Interne Projekte, Kundenprojekte, Agenten-Projekte
- **Controls:** Projektphasen, Meilensteine, Risikomanagement, Kommunikationsmanagement
- **Quelle:** https://www.beuth.de/de/norm/din-69901-5

### DIN 5008:2020 — Schreib- und Gestaltungsregeln für Texte
- **Priorität:** P2
- **Kategorie:** documentation
- **Begründung:** Professionelle Dokumentation: Angebote, Verträge, Berichte, Kommunikation
- **Scope:** Kundenkommunikation, Angebote, Verträge, Berichte, Dokumentation
- **Controls:** Schreibregeln, Gestaltungsregeln, Formatvorgaben
- **Quelle:** https://www.beuth.de/de/norm/din-5008

### EN 301 549 V3.2.1 — Barrierefreiheit (ICT)
- **Priorität:** P2
- **Kategorie:** accessibility
- **Begründung:** EU-rechtlich gefordert für öffentliche Aufträge. WCAG-basiert
- **Scope:** Öffentliche Kundenprojekte, WebUI falls öffentlich
- **Controls:** WCAG 2.1 AA, Screenreader, Tastaturbedienung, Kontraste, Alternativtexte
- **Quelle:** https://www.etsi.org/deliver/etsi_en/301500_301599/301549

### BSI IT-Grundschutz — IT-Grundschutz-Kompendium
- **Priorität:** P3
- **Kategorie:** security
- **Begründung:** De facto-Standard für deutsche Unternehmen. Elementare Gefährdungen, Bausteine
- **Scope:** VPS, Docker, Cloudflare, Brain, Qdrant, 9Router
- **Controls:** Bausteine: Sicherheitsmanagement, Infrastruktur, IT-Systeme, Netze, Anwendungen
- **Quelle:** https://www.bsi.bund.de/dok/IT-Grundschutz

### ISO 26000:2010 — Gesellschaftliche Verantwortung (CSR)
- **Priorität:** P3
- **Kategorie:** csr
- **Begründung:** Nachhaltigkeit, Ethik, Transparenz für Kundenkommunikation
- **Scope:** Kundenkommunikation, Angebote, Marketing
- **Controls:** Organisationsführung, Menschenrechte, Arbeitspraktiken, Umwelt, faire Betriebs- und Geschäftspraktiken
- **Quelle:** https://www.iso.org/standard/26000

---

## 2. Ausgeschlossene Normen (mit Begründung)

- **ISO 13485**: Medizinprodukte — nicht relevant (kein Medizin-Kunde)

- **ISO 14001**: Umweltmanagement — nicht kernrelevant für AI-Agentur

- **ISO 45001**: Arbeitsschutz — nicht kernrelevant für remote-first Agentur

- **ISO 50001**: Energiemanagement — nicht relevant für reine Software/Dienstleistung

- **ISO 41001**: Facility Management — nicht relevant (kein Standort)

- **ISO 37001**: Antikorruption — erst bei öffentlichen Aufträgen > Schwellenwert

- **IEC 62304**: Medizin-Software — kein Medizinprodukt

- **IEC 61508**: Funktionale Sicherheit — sicherheitskritische Systeme nicht betroffen

- **ISO 26262**: Automotive Safety — kein Automotive-Bereich

- **DIN EN 50173**: Netzwerkverkabelung — nicht relevant für Cloud-Infrastruktur

---

## 3. Normen-Priorisierungsmatrix

| Norm | P | Security | Privacy | AI | Quality | Service | Doc |
|------|---|----------|---------|-----|---------|---------|-----|
| ISO/IEC 27001:2022 | P0 | ✓ |  |  |  |  |  |
| ISO/IEC 27002:2022 | P0 | ✓ |  |  |  |  |  |
| ISO/IEC 27701:2019 | P0 | ✓ | ✓ |  |  |  |  |
| ISO/IEC 42001:2023 | P0 |  |  | ✓ |  |  |  |
| ISO/IEC 23894:2023 | P0 |  |  | ✓ |  |  |  |
| ISO 9001:2015 | P1 |  |  |  | ✓ |  |  |
| ISO/IEC 20000-1:2018 | P1 |  |  |  | ✓ | ✓ |  |
| ISO 22301:2019 | P1 |  |  |  |  | ✓ |  |
| ISO 31000:2018 | P1 |  |  |  |  | ✓ |  |
| ISO 37301:2021 | P1 |  |  |  |  | ✓ |  |
| ISO/IEC 25010:2023 | P1 |  |  |  | ✓ |  |  |
| ISO/IEC/IEEE 12207:2017 | P1 |  |  |  | ✓ |  |  |
| DIN EN ISO 9241-210:2020 | P2 |  |  |  | ✓ |  |  |
| DIN 69901-5:2009 | P2 |  |  |  | ✓ |  |  |
| DIN 5008:2020 | P2 |  |  |  |  |  | ✓ |
| EN 301 549 V3.2.1 | P2 |  |  |  |  |  | ✓ |
| BSI IT-Grundschutz | P3 | ✓ |  |  |  |  |  |
| ISO 26000:2010 | P3 |  |  |  |  |  |  |
