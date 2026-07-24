# TESTPLAN_COMPLIANCE — Compliance-Testplan

| Feld | Wert |
|------|------|
| **Dokumenttyp** | Testplan (ISO 27001, ISO 42001, ISO 9001, DSGVO) |
| **Version** | 1.0 |
| **Stand** | 23.06.2026 |
| **Nächste Prüfung** | 23.06.2027 |
| **Verantwortlich** | Pascal |
| **Geltungsbereich** | Alle Controls aus CONTROL_CATALOG.yaml + Verbote |

---

## 1. Testmethoden

| Methode | Kürzel | Beschreibung |
|---------|--------|--------------|
| Automatisiert | AUTO | CI/CD-gesteuerter Test |
| Manuell | MAN | Manuelle Prüfung durch Verantwortlichen |
| Stichprobe | STP | Stichprobenartige Prüfung |
| Audit | AUD | Formelle Prüfung (extern/intern) |
| Log-Review | LOG | Analyse von Log-Dateien |

---

## 2. Testfälle — Informationssicherheit (IS)

| # | Test-ID | Control-ID | Testbeschreibung | Methode | Frequenz | Erwartetes Ergebnis | Owner |
|---|---------|-----------|------------------|---------|----------|---------------------|-------|
| 1 | T-IS-01 | IS-01 | **Sicherheits-Policy-Prüfung**: Policy existiert, versioniert, freigegeben, kommuniziert | AUD | Jährlich | Policy dokumentiert, unterschrieben, verteilt | Pascal |
| 2 | T-IS-02 | IS-02 | **Awareness-Prüfung**: Alle Mitarbeiter haben Sicherheits-Schulung absolviert | MAN | Jährlich | Schulungsnachweise für 100% der Mitarbeiter | Pascal |
| 3 | T-IS-03 | IS-03 | **Asset-Inventar-Prüfung**: Asset-Inventar vollständig, aktuelle Klassifizierung | MAN | Halbjährlich | Alle Assets erfasst, klassifiziert, Owner zugewiesen | Pascal |
| 4 | T-IS-04 | IS-04 | **Zugriffskontrolle**: RBAC durchgesetzt, keine überflüssigen Berechtigungen | AUTO | Quartalsweise | Keine orphaned Accounts, Berechtigungen nach Bedarf | Pascal |
| 5 | T-IS-05 | IS-05 | **Verschlüsselung**: Data-at-Rest (VPS) und Data-in-Transit (TLS) aktiv | AUTO | Monatlich | TLS 1.2+ aktiv, Festplattenverschlüsselung aktiv | Pascal |
| 6 | T-IS-06 | IS-06 | **Physische Sicherheit**: VPS-Datacenter (Hetzner) Sicherheitszertifikate gültig | MAN | Jährlich | Hetzner ISO 27001 Zertifikat aktuell | Pascal |
| 7 | T-IS-07 | IS-07 | **Backup-Test**: Backup wurde erfolgreich wiederhergestellt | AUTO | Monatlich | Restore-Test erfolgreich (RPO ≤ 24 h, RTO ≤ 4 h) | Pascal |
| 8 | T-IS-08 | IS-08 | **Lieferantenprüfung**: Alle AV aktuell, AVV abgeschlossen | MAN | Halbjährlich | AVV-Status 100% (Standort, SCC, Dauer) | Pascal |
| 9 | T-IS-09 | IS-09 | **Incident-Response-Test**: IR-Prozess durchgespielt (Tabletop-Exercise) | MAN | Halbjährlich | Incident innerhalb 24 h erkannt, 72 h Meldung | Pascal |
| 10 | T-IS-10 | IS-10 | **Compliance-Prüfung**: Regulatorische Änderungen (DSGVO, AI Act, NIS-2) geprüft | AUD | Jährlich | Compliance-Gap-Analyse durchgeführt | Pascal |
| 11 | T-IS-11 | SE-01 | **Netzwerksicherheit**: Tenant-Trennung zwischen Projekten bestätigt | AUTO | Quartalsweise | Keine Datenlecks zwischen Project-Collections | Pascal |
| 12 | T-IS-12 | SE-04 | **Change-Management**: Jeder Production-Change via PR/Release-Prozess | AUTO | Kontinuierlich | 100% der Changes tracked in Git | Pascal |

---

## 3. Testfälle — KI-Governance (AI)

| # | Test-ID | Control-ID | Testbeschreibung | Methode | Frequenz | Erwartetes Ergebnis | Owner |
|---|---------|-----------|------------------|---------|----------|---------------------|-------|
| 13 | T-AI-01 | AI-01 | **AI-Systeminventar**: Alle KI-Systeme dokumentiert (Agenten, Modelle, 9Router-Routen) | MAN | Quartalsweise | Inventar vollständig, Version aktuell | Pascal |
| 14 | T-AI-02 | AI-02 | **Risikoklassifizierung**: Jedes KI-System korrekt klassifiziert (hoch/mittel/niedrig) | MAN | Quartalsweise | Klassifizierung dokumentiert, begründet | Pascal |
| 15 | T-AI-03 | AI-03 | **Human Oversight**: Kritische Agenten-Aktionen erfordern Freigabe | AUTO | Kontinuierlich | V08-Verbot durchgesetzt: Keine autonome Aktion auf Prod/Secrets/Delete | Pascal |
| 16 | T-AI-04 | AI-04 | **Transparenzhinweis**: Kunden erhalten Hinweis auf KI-Nutzung | MAN | Bei Projektstart | Hinweis in Angebot/Dokumentation enthalten | Pascal |
| 17 | T-AI-05 | AI-05 | **Bias-Prävention**: Stichproben auf diskriminierende Outputs | STP | Quartalsweise | Keine diskriminierenden Muster in Outputs | Pascal |
| 18 | T-AI-06 | AI-06 | **Agenten-Aktionssperren**: Sperren konfiguriert und wirksam | AUTO | Monatlich | Sperrlogik blockiert verbotene Aktionen (V08) | Pascal |
| 19 | T-AI-07 | AI-07 | **Datenqualität**: Brain-Daten auf Aktualität und PII-Freiheit geprüft | AUTO | Monatlich | Keine PII in Brain-Chunks, Quellen dokumentiert | Pascal |
| 20 | T-AI-08 | AI-08 | **Modell-Monitoring**: 9Router-Routen Performance, Latenz, Fehlerrate | AUTO | Kontinuierlich | <5% Fehlerrate, Latenz < 10 s | Pascal |
| 21 | T-AI-09 | AI-09 | **KI-Logging**: Jede Agenten-Aktion geloggt (Timestamp, Agent, Action, Status) | AUTO | Kontinuierlich | Logs vollständig, auswertbar, 12 Mo Retention | Pascal |
| 22 | T-AI-10 | AI-10 | **Modell-Freigabe**: Neues Modell durchläuft Freigabeprozess vor Production | MAN | Bei Änderung | Freigabe dokumentiert (Performance, Bias, Kosten) | Pascal |
| 23 | T-AI-11 | AI-11 | **Prompt-Injection-Schutz**: Agenten gegen Injection-Angriffe getestet | AUTO | Quartalsweise | Keine erfolgreiche Prompt-Injection im Test | Pascal |
| 24 | T-AI-12 | AI-12 | **Output-Validierung**: Agenten-Output auf PII, Schadcode, Halluzination geprüft | AUTO | Kontinuierlich | Filter blockiert schädliche/PII-Outputs | Pascal |

---

## 4. Testfälle — Software Engineering (SE)

| # | Test-ID | Control-ID | Testbeschreibung | Methode | Frequenz | Erwartetes Ergebnis | Owner |
|---|---------|-----------|------------------|---------|----------|---------------------|-------|
| 25 | T-SE-01 | SE-01 | **Anforderungsmanagement**: Requirements dokumentiert, versioniert, getrackt | MAN | Pro Projekt | GitHub Issues + Akzeptanzkriterien vorhanden | Pascal |
| 26 | T-SE-02 | SE-02 | **Testabdeckung**: Code-Coverage ≥ 80% Unit-Tests | AUTO | Je PR | CI zeigt Coverage ≥ 80%, sonst Merge-Block | Pascal |
| 27 | T-SE-03 | SE-03 | **Code-Review-Pflicht**: Kein Merge ohne PR-Review und grüne CI | AUTO | Kontinuierlich | Branch Protection: PR + Tests required | Pascal |
| 28 | T-SE-04 | SE-04 | **CI/CD-Pipeline intakt**: Build, Test, Lint, Security-Scan laufen durch | AUTO | Je Push/PR | Pipeline grün, Security-Scans ohne Findings | Pascal |
| 29 | T-SE-05 | SE-05 | **Secrets-Scan**: Keine Secrets in Code, Logs, Brain, Agent-Output | AUTO | Kontinuierlich | git-secrets + CI-Scan: 0 Findings (V01) | Pascal |
| 30 | T-SE-06 | SE-06 | **Release-Prozess**: SemVer, Changelog, Docker-Image-Tag dokumentiert | AUTO | Je Release | Release-Note, Tag, Docker-Image vorhanden | Pascal |

---

## 5. Testfälle — Qualitätsmanagement (QM)

| # | Test-ID | Control-ID | Testbeschreibung | Methode | Frequenz | Erwartetes Ergebnis | Owner |
|---|---------|-----------|------------------|---------|----------|---------------------|-------|
| 31 | T-QM-01 | QM-01 | **Qualitätspolicy**: Policy existiert, kommuniziert, verstanden | AUD | Jährlich | Policy dokumentiert, unterschrieben | Pascal |
| 32 | T-QM-02 | QM-02 | **Prozessdokumentation**: Alle Prozesse dokumentiert, versioniert | MAN | Halbjährlich | Prozess-Dokumente aktuell, in 10_evidence/ | Pascal |
| 33 | T-QM-03 | QM-03 | **Internes Audit**: Audit durchgeführt, Ergebnisse dokumentiert | AUD | Halbjährlich | Audit-Bericht, Maßnahmen-Plan erstellt | Pascal |
| 34 | T-QM-04 | QM-04 | **Korrekturmaßnahmen**: Abweichungen behoben, Nachweis erbracht | MAN | Vierteljährlich | Alle offenen Maßnahmen geschlossen | Pascal |
| 35 | T-QM-05 | QM-05 | **Kundenfeedback**: Feedback systematisch erfasst, ausgewertet | MAN | Nach Projekt | Feedback-Protokoll, Verbesserungsmaßnahmen | Pascal |

---

## 6. Testfälle — Verbote (V01–V10)

| # | Test-ID | Control-ID | Testbeschreibung | Methode | Frequenz | Erwartetes Ergebnis | Owner |
|---|---------|-----------|------------------|---------|----------|---------------------|-------|
| 36 | T-V-01 | V01 | **Secrets-Verbot**: Keine Secrets in Repos, Prompts, Logs, Brain | AUTO | Kontinuierlich | Scan blockiert Commit/Deployment bei Fund | Pascal |
| 37 | T-V-02 | V02 | **Rollback-Plan**: Jeder Production-Change hat Rollback-Dokumentation | MAN | Je Change | Rollback-Schritte dokumentiert, getestet | Pascal |
| 38 | T-V-03 | V03 | **Daten-Governance**: Kundendaten nur an freigegebene Modelle/Tools | AUTO | Kontinuierlich | Route-Block bei nicht-freigegebenem Ziel | Pascal |
| 39 | T-V-04 | V04 | **Merge-Protection**: Kein Merge ohne PR-Review + bestandene Tests | AUTO | Kontinuierlich | GitHub Branch-Protection aktiv | Pascal |
| 40 | T-V-05 | V05 | **Evidence-Pflicht**: Abschlussmeldung enthält Dateien, Diffs, Tests, Quellen | MAN | Pro Task | Evidence vollständig, Task akzeptiert | Pascal |
| 41 | T-V-06 | V06 | **Health-Endpoint**: Jeder Service hat /health-Endpunkt | AUTO | Monatlich | /health antwortet 200 OK | Pascal |
| 42 | T-V-07 | V07 | **Tenant-Trennung**: Kundenprojekt-Daten isoliert | AUTO | Quartalsweise | Kein Cross-Tenant-Zugriff möglich | Pascal |
| 43 | T-V-08 | V08 | **Agenten-Sperre**: Keine autonome Aktion auf Production/Secrets/Delete | AUTO | Kontinuierlich | Agent erhält Block/403 bei Sperraktion | Pascal |
| 44 | T-V-09 | V09 | **AVV-Prüfung LLM-Provider**: Data-Sharing nur mit gültigem AVV | MAN | Halbjährlich | AVV-Status aller LLM-Provider grün | Pascal |
| 45 | T-V-10 | V10 | **Sicherheitsumgehung**: Keine bewusste Umgehung von Sicherheitskontrollen | AUD | Jährlich | Keine Umgehungsfälle dokumentiert | Pascal |

---

## 7. Zusammenfassung

| Kategorie | Testfälle | Automatisiert | Manuell | Frequenz |
|-----------|-----------|---------------|---------|----------|
| Informationssicherheit (IS) | 12 | 6 | 6 | Monatlich–Jährlich |
| KI-Governance (AI) | 12 | 8 | 4 | Kontinuierlich–Quartalsweise |
| Software Engineering (SE) | 6 | 5 | 1 | Je PR/Release |
| Qualitätsmanagement (QM) | 5 | 0 | 5 | Quartalsweise–Jährlich |
| Verbote (V01–V10) | 10 | 7 | 3 | Kontinuierlich–Jährlich |
| **Gesamt** | **45** | **26** | **19** | — |

Alle Tests dokumentiert in `10_evidence/tests/compliance/`.

---

## 8. Test-Durchführungsprotokoll

Jeder ausgeführte Test wird dokumentiert:

| Feld | Beschreibung |
|------|-------------|
| **Test-ID** | Referenz (z. B. T-IS-01) |
| **Datum** | Durchführungsdatum |
| **Durchführender** | Name/Rolle |
| **Ergebnis** | PASS / FAIL / BLOCKED |
| **Nachweis** | Link zu Log/Datei/Screenshot |
| **Abweichung** | Falls FAIL: Beschreibung + Maßnahme |
| **Maßnahmen-Frist** | Datum für Korrektur |

---

## 9. Verweise

| Dokument | Pfad |
|----------|------|
| CONTROL_CATALOG | `CONTROL_CATALOG.yaml` |
| Verbote und Pflichtregeln | `VERBOTE_UND_PFLICHTREGELN.md` |
| Security Policy | `SECURITY_POLICY.md` |
| AI Governance Policy | `AI_GOVERNANCE_POLICY.md` |
| Software-Engineering-Standard | `SOFTWARE_ENGINEERING_STANDARD.md` |
| Projekt-Delivery-Standard | `PROJECT_DELIVERY_STANDARD.md` |
| Test-Ergebnisse | `10_evidence/tests/compliance/` |

---

*Ende des TESTPLAN_COMPLIANCE*
