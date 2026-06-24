# Design Quality Gate — Gesamttext (DE)

Version: 2026-06-21
Quelle: Commit 7cfbc6190c4a170558702a651e11cd57691593e1
Repo: nexifyai-dev/nexify-agentur-plattform

Zweck

Dieses Dokument fasst zusammen, was im Commit "Add browser design quality gate" implementiert wurde, warum es wichtig ist, wie es lokal und in CI ausgeführt wird, welche Artefakte erzeugt werden, welche Limitationen bestehen, welche Werte und Lernpunkte sich ergeben und welche nächsten Schritte empfohlen sind. Ziel ist eine langlebige, leicht auffindbare Wissensbasis unter myapi.nexifyai.cloud und im Repository unter docs/.

Zusammenfassung der Änderungen

- Neue Playwright-basierte visuelle Designprüfung:
  - Datei: playwright.config.ts
  - Tests: tests/e2e/design-audit.spec.ts
  - Script: "test:design" in package.json -> führt Playwright-Tests aus
  - Script: "test:all" kombiniert unit tests, typecheck, lint, build und test:design
- Package-Anpassungen:
  - @playwright/test und playwright (DevDeps) wurden ergänzt (package.json und package-lock.json aktualisiert)
- Artefakte und Ignorierregeln:
  - .gitignore erweitert um playwright-report/ und test-results/
  - Tests speichern Screenshots in test-results/design-audit/ und HTML-Report in playwright-report/
- Dokumentation:
  - docs/DESIGN_VORGABE.md aktualisiert, Pflichtprüfung auf "npm run test:all"
  - docs/QUALITY_AUDIT_2026-06-21.md ergänzt um Audit-Details

Technische Details

- Playwright Version: 1.61.0
- Node Requirement: >= 18 (Playwright-Engines setzen node >=18)
- Konfiguration:
  - testDir: ./tests/e2e
  - project: chromium-design (Desktop Chrome)
  - baseURL: env PLAYWRIGHT_BASE_URL (default http://127.0.0.1:3137)
  - reporter: list + html (outputFolder playwright-report)
  - webServer: npm run start -- -p 3137 (URL http://127.0.0.1:3137)
- Tests prüfen:
  - Responsive viewports: 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1480, 1920
  - Kritische Routen: /, /leistungen, /preise, /prozess, /ueber-mich, /kontakt, /faq, /plattform, /wissen, /impressum, /datenschutz
  - Redirects: mehrere definierte Canonical-Redirect-Paare
  - Assertions: Seitenstatus < 400, Hauptinhalt sichtbar, Footer sichtbar
  - Visuelle Checks: Kein horizontaler Overflow > 2px, keine „escaped“ primary boxes (Selectors list)
  - Artefakte: Screenshots pro Viewport pro Route, saved to test-results/design-audit/home-<width>.png

Wie lokal ausführen

Voraussetzungen:
- Node.js 18.x
- npx playwright installiert via devDeps (npm ci installiert Abhängigkeiten)
- Optional: Xvfb oder CI Runner mit Browser Support

Schritte:
1. npm ci
2. npx playwright install --with-deps
3. npm run build
4. npm run start -- -p 3137 &
5. npx wait-on http://127.0.0.1:3137
6. PLAYWRIGHT_BASE_URL=http://127.0.0.1:3137 npm run test:design

Erwartetes Ergebnis:
- Playwright-Tests laufen durch, erzeugen playwright-report/ und screenshots unter test-results/design-audit/.
- Exit code 0 bei Erfolg.

CI-Integration (Kurzform)

- Node 18 verwenden (actions/setup-node)
- npm ci
- npx playwright install --with-deps
- npm run build
- npm run start -- -p 3137 &
- wait-on http://127.0.0.1:3137
- npm run test:all
- Upload artifacts: playwright-report und test-results/design-audit/

Dokumentation der Limitationen und Risiken

- Keine absolute Garantie: Automatisierte Tests können nicht alle zukünftigen Inhalte, Browser-Bugs oder nicht-determinierte Umgebungsabweichungen abdecken.
- Flaky Tests: Dynamische Inhalte (z. B. A/B Tests, Third-Party-Snippets, langsame Ressourcen) können Tests instabil machen.
- CI Ressourcen / Timeouts: Playwright mit vollem Rendering erhöht CI-Laufzeit.
- Node/OS Kompatibilität: Playwright hat native Abhängigkeiten (z. B. fsevents optional auf macOS). Browser-Install ist erforderlich.

Werte & Lernpunkte (Selbstreflexion)

- Wert: Früherkennung visueller Regressionen, klare Artefakte für PR-Reviews, zentrale Audit-Historie.
- Lernen: Integriere visuelle Checks früh im Review; speichere Artefakte an zentraler Stelle; baue Retry/Resilience für flakey Szenarien.
- Permanenz: Dokumentiere dieses Setup in KB (myapi.nexifyai.cloud), damit Wissen nicht verlorengeht.

Nächste Schritte (empfohlen)

1. CI-Workflow hinzufügen (GitHub Actions) zum Ausführen von npm run test:all und Hochladen von Artefakten.
2. PR-Annotation: Automatisch Testergebnisse / Links in PR-Kommentaren publizieren.
3. Knowledge Ingest: Jeden Audit-Run per API an myapi.nexifyai.cloud übermitteln und indexieren.
4. Dashboard: Visualisiere Trends (Regressionsfrequenz, Flaky Tests, häufig betroffene Routen).
5. Remediation-Flow: Wenn derselbe Fehler N‑mal auftritt -> automatisches Issue erstellen mit Reproduktionsstatements und Screenshots.

Abschließende Akzeptanzkriterien

- Alle Playwright-Tests laufen stabil in CI (oder haben documented retries/mitigations).
- Artefakte sind in jedem PR verlinkt.
- Knowledge Base zeigt Audit-Historie und ist durchsuchbar.
- Team hat klar definierte Schritte zur Behebung und Verifikation von Problemen.

---
Dokument Ende
