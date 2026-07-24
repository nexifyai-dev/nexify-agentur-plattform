# NeXify AI — Verbote und Pflichtregeln V2
> Version: 2.0 | Stand: 23.06.2026
> Erweitert: Webdesign, AI-Agenten, Content, Barrierefreiheit
> 10 Verbote, 28 Pflichtregeln, 12 Erlaubnisse, 10 Artefakt-Verpflichtungen

## 💀 Harte Verbote (P0 — Verstoß = sofortige Eskalation)

| # | Verbot | Norm/Gesetz/Standard | Konsequenz |
|---|--------|----------------------|------------|
| V01 | **Keine Secrets in Repos, Prompts, Logs, Brain** | ISO 27001 A.8/A.10 | Sperrung, Eskalation |
| V02 | **Keine Production-Änderung ohne Rollback-Plan** | ISO 20000-1 A.10 | Release-Rücknahme |
| V03 | **Keine Kundendaten an unfreigegebene Modelle/Tools** | DSGVO Art. 28, ISO 42001 A.2 | AVV-Verstoß, Meldepflicht |
| V04 | **Kein Merge in main ohne PR-Review + Tests** | ISO 12207 A.6, ISO 25010 | Commit-Rücknahme |
| V05 | **Keine Abschlussmeldung ohne Evidence (Dateien/Diffs/Tests/Quellen)** | ISO 9001 A.8 | Task zurückgewiesen |
| V06 | **Kein Kundenprojekt ohne Tenant-Trennung** | ISO 27001 A.13 | Projekt gestoppt |
| V07 | **Kein Dashboard/Service ohne /health-Endpunkt** | ISO 20000-1 A.6 | Service nicht freigegeben |
| V08 | **Keine autonome Aktion auf Production/Secrets/Delete** | ISO 42001 A.4/A.8, EU AI Act | Agent gestoppt |
| V09 | **Keine KI-Inhalte als menschlich deklarieren (Kennzeichnungspflicht)** | EU AI Act Art. 50, UWG | Landingpage gesperrt |
| V10 | **Kein Tracking ohne Einwilligung** | DSGVO Art. 6, ePrivacy | Bußgeldrisiko |

## ⚠️ Pflichtregeln (P1 — Nachbesserung)

| # | Regel | Norm | Intervall |
|---|-------|------|-----------|
| R01 | Asset-Inventar aktuell halten | ISO 27001 A.8 | monatlich |
| R02 | Zugriffsmatrix reviewen | ISO 27001 A.9 | quartalsweise |
| R03 | Backup-Restore-Test durchführen | ISO 27001 A.12 | monatlich |
| R04 | Incident-Runbook üben | ISO 27001 A.16 | quartalsweise |
| R05 | Lieferantenbewertung durchführen | ISO 27001 A.14 | jährlich |
| R06 | AI-Inventar + Risikoklassifizierung aktualisieren | ISO 42001 A.2/A.3 | monatlich |
| R07 | Bias-/Robustheitstest durchführen | ISO 42001 A.9, ISO 24027 | quartalsweise |
| R08 | Human-Oversight-Matrix reviewen | ISO 42001 A.4 | monatlich |
| R09 | VT-Verzeichnis aktualisieren | ISO 27701 A.7 | jährlich |
| R10 | AVV mit allen Lieferanten prüfen | ISO 27701 A.7 | jährlich |
| R11 | Löschkonzept testen | ISO 27701 A.9 | monatlich |
| R12 | DPA bei neuen Verarbeitungen | ISO 27701 A.10 | vor neuer V. |
| R13 | Code-Review (jeder PR) | ISO 12207 A.6 | pro PR |
| R14 | Testabdeckung >80% | ISO 25010 | pro Release |
| R15 | SLA-Verfügbarkeit messen | ISO 20000-1 A.6 | monatlich |
| R16 | HCD-Prozess (Nutzungskontext, Anforderung, Gestaltung, Evaluation) | DIN EN ISO 9241-210 | pro Release |
| R17 | WCAG 2.2 AA Check (automatisiert + manuell) | WCAG 2.2, EN 301 549 | pro Release |
| R18 | Kontrast-Prüfung (mind. 4.5:1 Text, 3:1 groß) | WCAG 2.2, EN 301 549 | pro UI-Komponente |
| R19 | Prompt-Injection + Insecure Output Handling testen (LLM01, LLM02) | OWASP LLM Top 10 2.0 | monatlich |
| R20 | Agenten-Tool-Rechte-Matrix reviewen (ASI02 Tool Misuse) | OWASP Agentic Top 10 2026 | monatlich |
| R21 | BFSG-Konformitätserklärung prüfen | BFSG/EAA | jährlich |
| R22 | KI-Content-Kennzeichnung prüfen | EU AI Act Art. 50 | pro Inhalt |
| R23 | DIN 5008-Formate prüfen (Briefe, E-Mails) | DIN 5008 | pro Dokument |
| R24 | Verständliche Sprache prüfen (ISO 24495-1) | ISO 24495-1 | pro Landingpage |
| R25 | DPA bei neuen Systemen/Verarbeitungen | DSGVO Art. 35 | vor Inbetriebnahme |
| R26 | BCM-Übung durchführen | ISO 22301 A.8 | jährlich |
| R27 | NIS-2-Meldepflicht prüfen | NIS-2 | vor Inkrafttreten |
| R28 | IT-Notfallvorsorge testen (Strom/Netz/Cloudflare) | ISO 27031 | jährlich |

## 🟢 Erlaubt mit Auflagen

| # | Aktion | Auflage | Norm |
|---|--------|---------|------|
| E01 | Staging-Deployment | Test-Suite bestanden | ISO 25010 |
| E02 | Production-Deployment | Rollback-Plan + Freigabe | ISO 20000-1 A.10 |
| E03 | Neue Datasets in RAGFlow | DPA-Geprüft | ISO 27701 |
| E04 | Neuer LLM-Provider | AVV geprüft + Risikoklasse | DSGVO Art. 28 |
| E05 | Neuer Agent in Production | Risikoklassifizierung + Tool-Matrix | ISO 42001 |
| E06 | Kundenprojekt anlegen | Tenant isolieren | ISO 27001 A.13 |
| E07 | Code in main mergen | PR-Review + Tests + Secret-Scan | ISO 12207 |
| E08 | API-Key rotieren | Alter Key sofort sperren | ISO 27001 A.10 |
| E09 | KI-Content veröffentlichen | Kennzeichnung + Prüfung | EU AI Act Art. 50 |
| E10 | Landingpage veröffentlichen | WCAG + DSGVO + UWG-Check | WCAG/DSGVO/UWG |
| E11 | Neue UI-Komponente | Tastaturtest + Screenreader + Kontrast | WCAG 2.2/EN 301 549 |
| E12 | Geschäftsbrief versenden | DIN 5008 + Empfänger-Prüfung | DIN 5008, DIN 676 |

## 📋 Artefakt-Verpflichtungen

| Artefakttyp | Verpflichtung |
|-------------|---------------|
| Landingpage/WebApp | WCAG 2.2 AA + DSGVO + UWG + EU AI Act (KI-Kennzeichnung) |
| AI-Agent | EU AI Act Risikoklasse + OWASP LLM + Agenten-Sperren |
| Software/API | OWASP ASVS + Tests >80% + Secrets-Check |
| Brief/E-Mail/Angebot/PDF | DIN 5008 + ISO 24495 + DSGVO + keine KI-Täuschung |
| Datenschutzdoku/AVV/TOM | ISO 27701 + DSGVO + Löschkonzept |
| UI-Komponente/Formular | WCAG 2.2 AA + Tastatur + EN 301 549 |
| Projektplan | ISO 9001 + DIN 69901 + Tenant-Trennung |
| Monitoring/Incident/Deploy | ISO 20000 + NIS-2-Meldung + Rollback |
