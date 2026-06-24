# NeXify AI — Verbote und Pflichtregeln
> Stand: 23.06.2026 | Version: 1.0
> Abgeleitet aus: ISO 27001, ISO 42001, ISO 27701, DSGVO, EU AI Act

## 💀 Harte Verbote (P0 — Verstoß = sofortige Eskalation)

| # | Verbot | Norm | Konsequenz |
|---|--------|------|------------|
| V01 | **Keine Secrets in Repos, Prompts, Logs, Brain oder Agenten-Output** | ISO 27001 A.8, A.10 | Sperrung, sofortige Eskalation |
| V02 | **Keine Production-Änderung ohne Rollback-Plan und Nachweis** | ISO 20000-1 A.10 | Release-Rücknahme, Audit |
| V03 | **Keine Kundendaten an unfreigegebene Modelle/Tools senden** | ISO 42001 A.2, DSGVO Art. 28 | AVV-Verstoß, Meldepflicht |
| V04 | **Kein Merge in main ohne PR-Review und bestandene Tests** | ISO 12207 A.6 | Commit-Rücknahme |
| V05 | **Keine Abschlussmeldung ohne Evidence (Dateien, Diffs, Tests, Quellen)** | ISO 9001 A.8 | Task zurückgewiesen |
| V06 | **Kein Dashboard/Service ohne /health-Endpunkt** | ISO 20000-1 A.6 | Service nicht freigegeben |
| V07 | **Kein Kundenprojekt ohne Tenant-Trennung** | ISO 27001 A.13 | Projekt gestoppt |
| V08 | **Keine autonome Agenten-Aktion auf Production/Secrets/Delete** | ISO 42001 A.4, A.8 | Agent gestoppt |
| V09 | **Kein Data-Sharing über LLM-Provider ohne AVV** | DSGVO Art. 28, ISO 27701 A.7 | Provider gesperrt |
| V10 | **Kein AI-System ohne Risikoklassifizierung** | ISO 42001 A.3, EU AI Act | System gestoppt |

## ⚠️ Pflichtregeln (P1 — Verstoß = Nachbesserungspflicht)

| # | Regel | Norm | Intervall |
|---|-------|------|-----------|
| R01 | Asset-Inventar aktuell halten | ISO 27001 A.8 | monatlich |
| R02 | Zugriffsmatrix reviewen | ISO 27001 A.9 | quartalsweise |
| R03 | Backup-Restore-Test durchführen | ISO 27001 A.12 | monatlich |
| R04 | Incident-Runbook üben | ISO 27001 A.16 | quartalsweise |
| R05 | Lieferantenbewertung durchführen | ISO 27001 A.14 | jährlich |
| R06 | AI-Systeminventar aktualisieren | ISO 42001 A.2 | monatlich |
| R07 | Bias-/Robustheitstest durchführen | ISO 42001 A.9 | quartalsweise |
| R08 | Human-Oversight-Matrix reviewen | ISO 42001 A.4 | monatlich |
| R09 | Verzeichnis VT aktualisieren | ISO 27701 A.7 | jährlich |
| R10 | AVV mit allen Lieferanten prüfen | ISO 27701 A.7 | jährlich |
| R11 | Löschkonzept testen | ISO 27701 A.9 | monatlich |
| R12 | DPA bei neuen Verarbeitungen durchführen | ISO 27701 A.10 | vor neuer V. |
| R13 | Code-Review durchführen (jeder PR) | ISO 12207 A.6 | pro PR |
| R14 | Testabdeckung >80% halten | ISO 25010 | pro Release |
| R15 | SLA-Verfügbarkeit messen | ISO 20000-1 A.6 | monatlich |
| R16 | Incident-Ticket innerhalb SLA schließen | ISO 20000-1 A.8 | laufend |
| R17 | Change-Dokumentation führen | ISO 20000-1 A.9 | pro Change |
| R18 | BCM-Übung durchführen | ISO 22301 A.8 | jährlich |
| R19 | Kundenfeedback dokumentieren | ISO 9001 A.7 | laufend |
| R20 | Capa-Log führen | ISO 9001 A.10 | laufend |

## 🟢 Erlaubt mit Auflagen

| # | Aktion | Auflage |
|---|--------|---------|
| E01 | Deployment auf Staging | Test-Suite bestanden |
| E02 | Production-Deployment | Rollback-Plan + 2. Person |
| E03 | Neue Datasets in RAGFlow | DPA vorhanden |
| E04 | Neuer LLM-Provider | AVV geprüft |
| E05 | Neuer Agent in Production | Risikoklassifizierung durchlaufen |
| E06 | Kundenprojekt anlegen | Tenant isolieren |
| E07 | Code in main mergen | PR-Review + Tests |
| E08 | API-Key rotieren | Alter Key sofort sperren |

## 📋 Prüfintervalle

| Intervall | Controls | Format |
|-----------|----------|--------|
| Täglich | AI-Monitoring (AI-06), Logging (AI-09) | Automatisiert |
| Wöchentlich | Malware-Scan (AV-01) | Trivy |
| Monatlich | Backup (BC-01), Asset (AM-01), AI-Inventar (AI-01), Löschung (DP-04) | Script + manuell |
| Quartalsweise | Zugriff (AC-03), Incident (INC-01), Bias (AI-08), Betroffenenrechte (DP-03) | Review |
| Jährlich | Lieferanten (TR-01), BCM (BC-02), Audit (QM-04), AVV (DP-02) | Formelles Audit |
