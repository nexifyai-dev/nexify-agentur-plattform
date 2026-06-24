# SECURITY_POLICY — Informationssicherheits-Policy (ISMS)

| Feld | Wert |
|------|------|
| **Dokumenttyp** | Policy (ISO 27001:2022) |
| **Version** | 1.0 |
| **Stand** | 23.06.2026 |
| **Nächste Prüfung** | 23.06.2027 |
| **Verantwortlich** | Geschäftsführung (Pascal) |
| **Klassifizierung** | Intern — vertraulich |
| **Geltungsbereich** | NeXify AI — gesamte Organisation |

---

## 1. Geltungsbereich

Diese Informationssicherheits-Policy gilt für:

- **Organisation**: NeXify AI by NeXify (Pascal, D/A/CH)
- **Standorte**: Remote-First, VPS (Hetzner), Cloud-Infrastruktur
- **Systeme**: VPS, Cloudflare Tunnel, GitHub, 9Router (Modell-Router), Brain (Vektor-DB), Qdrant, RAGFlow, Agenten (Hermes, Recherche, Content)
- **Mitarbeiter**: Geschäftsführung, Auftragsverarbeiter, KI-Agenten
- **Kundenprojekte**: Alle Projekte auf work.nexifyai.cloud

Die Policy gilt für alle Informationswerte (Assets) in elektronischer und physischer Form.

---

## 2. Sicherheitsziele (CIA-Triade)

| Ziel | Beschreibung | Metrik |
|------|-------------|--------|
| **Vertraulichkeit** | Unbefugter Zugriff auf Kundendaten, Secrets, Modelle verhindert | < 1 schwerwiegender Vorfall/Q |
| **Integrität** | Daten und Systeme unverfälscht; Änderungen nachvollziehbar | 100% Change-Tracking |
| **Verfügbarkeit** | Kerndienste (Brain, 9Router, Agenten) ≥ 99,5% Verfügbarkeit | Monitoring-Up-Time |
| **Nachvollziehbarkeit** | Jeder Zugriff und jede Änderung geloggt | Log-Complete-Check |

---

## 3. Rollen und Verantwortlichkeiten

| Rolle | Verantwortung |
|------|--------------|
| **ISB (Informationssicherheitsbeauftragter)** | Pascal — ISMS-Betrieb, Audits, Incident-Response |
| **Asset Owner** | Pascal — jeweiliges System (Brain, Agent, VPS) |
| **AV-Manager** | Pascal — Lieferanten- und AVV-Management |
| **Alle Mitarbeiter** | Meldepflicht bei Sicherheitsvorfällen, Einhaltung dieser Policy |

---

## 4. Asset-Klassifizierung

| Klasse | Beispiele | Schutzbedarf |
|--------|----------|-------------|
| **Kritisch** | Secrets, Kundendaten, Production-Envs, AVV | Sehr hoch |
| **Hoch** | Brain-Daten, Agenten-Konfiguration, CI/CD | Hoch |
| **Mittel** | Quellcode, Dokumentation, Logs | Mittel |
| **Niedrig** | Öffentliche Webseiten, Marketingmaterial | Niedrig |

Asset-Inventar geführt in `CONTROL_CATALOG.yaml` (Asset-ID, Owner, Klassifizierung, Speicherort).

---

## 5. Kontrollziele (CONTROL_CATALOG-Bezug)

Nach ISO 27001:2022 Anhang A (A.5–A.18) und CONTROL_CATALOG:

| Bereich | Control-ID | Beschreibung |
|---------|-----------|--------------|
| **A.5 — Informationssicherheits-Policies** | IS-01 | Sicherheits-Policy, Review, Kommunikation |
| **A.6 — Organisatorische Aspekte** | SE-01 | Rollen, Zuständigkeiten, Projektsicherheit |
| **A.7 — Personelle Sicherheit** | IS-02 | Hintergrundprüfung, Sensibilisierung, Sanktionen |
| **A.8 — Asset-Management** | IS-03 | Asset-Inventar, Klassifizierung, Eigentümer |
| **A.9 — Zugriffskontrolle** | IS-04 | Berechtigungen, RBAC, Trennung von Umgebungen |
| **A.10 — Kryptografie** | IS-05 | Verschlüsselung (Data-at-Rest, Data-in-Transit) |
| **A.11 — Physische Sicherheit** | IS-06 | Remote-Work-Sicherheit, VPS-Datacenter |
| **A.12 — Betriebssicherheit** | IS-07 | Backup, Monitoring, Kapazitätsplanung |
| **A.13 — Netzwerksicherheit** | SE-03 | Tenant-Trennung, Netzwerksegmentierung |
| **A.14 — Systembeschaffung** | SE-04 | Sichere SW-Entwicklung, Change-Management |
| **A.15 — Lieferantenbeziehungen** | IS-08 | AVV-Pflicht, Lieferantenprüfung |
| **A.16 — Incident-Management** | IS-09 | Meldepflicht, Incident-Response, Lessons Learned |
| **A.17 — Business Continuity** | QM-04 | BCM, Backup-Tests, RTO/RPO |
| **A.18 — Compliance** | IS-10 | Datenschutz, GoBD, EU AI Act, NIS-2 |

---

## 6. Sanktionen bei Verstoß (Verweis V01–V10)

Verstöße gegen diese Policy werden nach **VERBOTE_UND_PFLICHTREGELN.md** sanktioniert:

| Verbot | Verstoß | Sanktion |
|--------|---------|----------|
| **V01** | Secrets in Repos/Prompts/Logs/Brain/Output | Sperrung, sofortige Eskalation |
| **V02** | Production-Änderung ohne Rollback-Plan | Release-Rücknahme, Audit |
| **V03** | Kundendaten an unfreigegebene Modelle/Tools | AVV-Verstoß, Meldepflicht |
| **V04** | Merge in main ohne PR-Review/Tests | Commit-Rücknahme |
| **V05** | Abschlussmeldung ohne Evidence | Task zurückgewiesen |
| **V06** | Service ohne /health-Endpunkt | Service nicht freigegeben |
| **V07** | Kundenprojekt ohne Tenant-Trennung | Projekt gestoppt |
| **V08** | Autonome Aktion auf Production/Secrets/Delete | Agent gestoppt |
| **V09** | Data-Sharing über LLM-Provider ohne AVV | Provider gesperrt |
| **V10** | Bewusste Umgehung von Sicherheitskontrollen | Fristlose Kündigung / Rechtsfolgen |

---

## 7. Awareness und Schulung

- Jährliche Sicherheits-Schulung für alle Mitarbeiter
- Einweisung neuer Mitarbeiter bei Onboarding
- Phishing-Simulation (quartalsweise)
- Dokumentation in `10_evidence/awareness/`

---

## 8. Interne Audits

- **ISMS-Internaudit**: halbjährlich (ISO 27001 A.9.2)
- **Compliance-Audit**: jährlich (ISO 37301)
- **KI-Audit**: jährlich (ISO 42001 / EU AI Act)
- Audit-Dokumente in `10_evidence/audits/`

---

## 9. Kontinuierliche Verbesserung

- Management-Review: quartalsweise
- Lessons Learned nach jedem Incident
- Jährliche Policy-Überprüfung und -Aktualisierung
- Kennzahlen: Anzahl Incidents, Patches, Audit-Ergebnisse

---

## 10. Verweise

| Dokument | Pfad |
|----------|------|
| Normenregister | `NORMENREGISTER.md` |
| Control Catalog | `CONTROL_CATALOG.yaml` |
| Verbote und Pflichtregeln | `VERBOTE_UND_PFLICHTREGELN.md` |
| Datenschutz-Richtlinie (intern) | `PRIVACY_POLICY_INTERNAL.md` |
| KI-Governance-Policy | `AI_GOVERNANCE_POLICY.md` |
| Software-Engineering-Standard | `SOFTWARE_ENGINEERING_STANDARD.md` |
| Projekt-Delivery-Standard | `PROJECT_DELIVERY_STANDARD.md` |

---

*Ende der SECURITY_POLICY*
