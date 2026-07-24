# RALPH LOOP – NeXify AI Website final integrieren und abnehmen

## LOOP-ID

`NEXIFY-WEBSITE-FINAL-2026-06-20`

## OWNER

Pascal Courbois / NeXifyAI by NeXify – Chat it. Automate it.

## AUSFÜHRENDE INSTANZ

Claude Code / NeXify AI Systemmaster oder ein gleichwertiger, kontrollierter Engineering-Agent.

## FÜHRENDE KOMMUNIKATION

Alle Statusänderungen, Blocker, Entscheidungen, Handoffs und Evidence sind über die Hermes-Auftragszentrale und das zugehörige Kanban-Board zu dokumentieren. Keine parallele Änderung derselben Dateien ohne sichtbare Task-Zuordnung und Lock/Owner.

## ZIEL

Die lokal erstellte Next.js-Website in das echte Repository `NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform` integrieren, gegen vorhandenen Code und Live-Stand prüfen, als Preview bereitstellen, vollständig testen und erst nach ausdrücklicher Freigabe mergen beziehungsweise produktiv deployen.

## EINGANGSQUELLEN

1. dieser Projektordner;
2. `NEXIFY_WEBSITE_GESAMTKONZEPT.md`;
3. aktuelle Agenten-Seele, Pascal-Profil und NeXify-Regelwerke;
4. NeXify Brain und Supermemory;
5. echtes Zielrepository, Branches, Issues, PRs und Actions;
6. aktuelle Vercel-Projekte, Domains, Deployments, Build- und Runtime-Logs;
7. offizielle Next.js-, React-, Tailwind-, shadcn-, Resend- und Vercel-Dokumentation;
8. aktueller Live-Stand von `nexify-automate.com`;
9. tatsächliche Rechts-, Tracking-, Hosting- und Datenverarbeitungskonfiguration.

## STARTREGEL

Vor Änderungen:

1. richtigen Repo- und Projektpfad beweisen;
2. Brain-/Memory-Kontext abrufen;
3. Arbeitsbaum, Branch, letzte Commits und bestehende App-Struktur erfassen;
4. aktuelle Website und Vercel-Deployments prüfen;
5. vorhandene Seiten, Komponenten, APIs, Umgebungsvariablen und rechtliche Texte mit dem neuen Paket vergleichen;
6. Integrationsplan und Rollbackpunkt dokumentieren;
7. keine bestehende Funktion blind überschreiben.

## WIP-LIMIT

`1` vertikales Produktinkrement gleichzeitig.

## LOOP

### 1. OBSERVE

- Repo, Preview, Production, Logs, Tests und Kanban laden.
- Abweichung zwischen lokalem Paket, Zielrepo und Live-System bestimmen.
- neuesten erfolgreichen Rollbackpunkt festhalten.

### 2. SELECT

Genau das kleinste vollständige Inkrement auswählen, das sichtbaren Produktfortschritt erzeugt, zum Beispiel:

- Fundament und Design-Tokens;
- Header, Footer und Navigation;
- Startseite;
- Leistungen und Preise;
- Kontakt und Versand;
- rechtliche Seiten;
- SEO, Performance und Accessibility.

### 3. IMPLEMENT

- bestehende Muster bevorzugen;
- keine unnötige neue Architektur oder SaaS-Abhängigkeit;
- AI-gestützte, aber fachlich überprüfte Umsetzung;
- responsive und barrierearme Zustände direkt mitbauen;
- Secrets nur als Secret-Referenzen und Umgebungsvariablen.

### 4. VERIFY

Für jedes Inkrement mindestens:

```bash
npm run typecheck
npm run lint
npm run build
```

Zusätzlich je Relevanz:

- Desktop-, Tablet- und Mobile-Browser-Smoke;
- Screenshots gegen das freigegebene Design;
- Overflow-, Fokus-, Keyboard- und Kontrastprüfung;
- interne Links, Formulare und Fehlerzustände;
- Lighthouse-/Web-Vitals-Basis;
- API- und Resend-Zustellung;
- Security Header und Secret Scan;
- Sitemap, Robots und Metadaten;
- Preview- und Runtime-Logs.

### 5. REVIEW

Ein unabhängiger Reviewer prüft:

- Abweichung vom Zielbild;
- versteckte Regressionen;
- unnötige Komplexität;
- Sicherheits- und Datenschutzrisiken;
- nicht belegte Inhalte oder Preisbehauptungen;
- Konsistenz von Leistungen, Tagen und Preisen;
- rechtliche Seiten gegen den echten Betriebszustand.

### 6. RECORD

In Hermes/Kanban/Evidence dokumentieren:

- geänderte Dateien;
- Tests und konkrete Ergebnisse;
- Screenshots und Preview-URL;
- offene Risiken und Blocker;
- Rollbackpunkt;
- nächste sichere Aktion.

Kanonische technische und geschäftliche Erkenntnisse nach erfolgreicher Änderung in Brain/Supermemory speichern. Keine Secrets, personenbezogenen Rohdaten oder ungeprüften Zwischenstände als kanonische Wahrheit ablegen.

### 7. DECIDE

- `KEEP`: alle Akzeptanzkriterien des Inkrements erfüllt;
- `FIX`: begrenzter, reproduzierbarer Fehler mit sicherem Fix;
- `ROLLBACK`: Regression, Sicherheitsproblem oder Zielabweichung;
- `BLOCKED_ACCESS`: notwendiger Zugriff fehlt;
- `BLOCKED_APPROVAL`: Merge, Production, rechtliche Freigabe oder andere gate-pflichtige Aktion fehlt.

Danach nächsten Loop starten, bis alle Production-Gates geschlossen sind.

## ABNAHMEKRITERIEN

`DONE_TRUE` nur, wenn:

1. die vollständige neue Website im richtigen Repo integriert ist;
2. Typecheck, Lint und Production-Build bestehen;
3. alle vorgesehenen Routen und responsiven Zustände funktionieren;
4. das bekannte Operator-Card-Overflow behoben und visuell geprüft ist;
5. Preise exakt aus 999 Euro netto pro Arbeitstag berechnet werden;
6. ausschließlich die Formulierung „AI-gestützt“ verwendet wird;
7. Pascal, Erfahrung und persönliche Verantwortung klar sichtbar sind, ohne erfundene Alters- oder Erfahrungszahlen;
8. Kontaktversand und Fehlerpfade nachweislich funktionieren;
9. Preview-Deployment und Browser-/Mobile-Smokes bestehen;
10. rechtliche Seiten gegen den realen Betrieb geprüft sind;
11. Evidence, Kanban, Brain/Supermemory und Übergabe aktualisiert sind;
12. Pascal die ausdrückliche Kennzeichnung `PR-FREIGABE: JA` erteilt hat;
13. Merge und Production-Deployment danach erfolgreich und live geprüft wurden.

## ABBRUCHKRITERIEN

Sofort stoppen und `BLOCKED_*` setzen bei:

- falschem Repo, Branch, Vercel-Projekt oder Domain-Mapping;
- Gefahr eines Secret-Leaks oder Datenverlusts;
- nicht rückrollbarer Migration ohne Freigabe;
- Widerspruch zwischen Rechtsseite und realem Tracking/Hosting;
- ungeklärter Überschreibung produktiver Funktionen;
- fehlender ausdrücklicher Freigabe für Merge oder Production.

Nicht stoppen bei einem einzelnen behebbaren Build-, Lint-, Styling- oder Testfehler, solange sichere Diagnose und Rollback möglich sind.

## ROLLBACK

- vor Integration separaten Branch und dokumentierten Ausgangs-SHA verwenden;
- bestehende produktive Konfiguration nicht überschreiben;
- Preview vor Merge;
- bei Regression PR zurücksetzen beziehungsweise Deployment auf letzten gesunden Stand zurückrollen;
- Rollback und Ursache als Evidence dokumentieren.

## AKTUELLER STATUS

```text
LOCAL_IMPLEMENTATION = COMPLETE
DESIGN_OVERFLOW_FIX = COMPLETE
MULTIPAGE_STRUCTURE = COMPLETE
PRICING_LOGIC = COMPLETE
LEGAL_DRAFTS = COMPLETE_REVIEW_REQUIRED
CONTACT_API = COMPLETE_CONFIGURATION_REQUIRED
NPM_INSTALL = PASSED
TYPESCRIPT_TYPECHECK = PASSED
ESLINT = PASSED
NEXT_PRODUCTION_BUILD = PASSED
ROUTE_SMOKE = PASSED_27_OF_27
CONTACT_INVALID_PAYLOAD_TEST = PASSED_HTTP_422
TARGET_REPO_INTEGRATION = BLOCKED_CONNECTOR_MISROUTING
TARGET_REPO_BUILD_RECHECK = PENDING_AFTER_INTEGRATION
VERCEL_PREVIEW = PENDING
LEGAL_TAX_REVIEW = PENDING
PR_FREIGABE = NOT_GRANTED
PRODUCTION_DEPLOYMENT = NOT_EXECUTED
DONE_TRUE = FALSE
```

## NÄCHSTE SICHERE AKTION

Einen korrekt auf `nexifyai-platform` begrenzten Repo-Zugriff herstellen, das Paket in einem neuen Integrationsbranch einspielen, bestehende Strukturen vergleichen und anschließend Installation, Typecheck, Lint und Production-Build ausführen. Kein Merge und kein Production-Deployment ohne `PR-FREIGABE: JA`.
