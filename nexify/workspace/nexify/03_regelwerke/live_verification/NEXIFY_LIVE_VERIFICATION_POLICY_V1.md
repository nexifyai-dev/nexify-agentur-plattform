# NEXIFY LIVE VERIFICATION POLICY V1

**NeXify Live Verification Layer (NLVL)**

| Feld | Wert |
|------|------|
| **Dokument-ID** | `NLVL-POL-001` |
| **Version** | 1.0 |
| **Stand** | 2026-06-11 |
| **Status** | `in-kraft` |
| **Klassifikation** | `nexify-intern` |
| **Brain-Kategorie** | `claude-code-infrastructure` |
| **Letzte Prüfung** | 2026-06-11 |

---

## 1. Zweck

Die NLVL definiert die permanente Live-Gegenprüfung bei jeder Code-Erstellung, Config-Änderung, UI-Änderung, API-Änderung, Agentenänderung, Deployment-Vorbereitung und Runtime-Abweichung.

Fehler werden nicht erst am Ende geprüft, sondern während der Entstehung permanent gegengeprüft. Jede Änderung erzeugt sofort sichtbare Fehler, Warnungen, Tests, Logs, Screenshots, Traces und Evidence.

---

## 2. Geltungsbereich

Diese Policy gilt für:

- Claude Code (alle Instanzen)
- Goose AI (CLI + ACC)
- Hermes (CLI + WebUI)
- GitHub Actions Workflows
- Vercel Previews und Deployments
- Lokale Entwicklungsumgebungen
- CI/CD-Pipelines
- Runtime-Überwachung (OTel, Sentry/GlitchTip, Prometheus/Grafana)
- NeXify Workstation
- NeXify Brain und agentmemory
- Kanban und Evidence-System

---

## 3. Grundprinzipien

### 3.1 Live-Gegenprüfung (Kern)

```
Code wird nicht erst am Ende geprüft.
Code wird während der Entstehung permanent gegengeprüft.
Jede Änderung erzeugt sofort sichtbare Fehler, Warnungen, Tests, Logs,
Screenshots, Traces und Evidence.
Kein Agent darf DONE melden, solange Live-Gegenprüfung, Tests, Build,
Security, UI und Deployment-Check fehlen.
```

### 3.2 Official-Docs-First

Vor Einrichtung oder Änderung eines Prüfwerkzeugs müssen die **offiziellen Dokumentationen** geladen werden. Nicht aus Erinnerung konfigurieren.

Betroffene Tools: TypeScript, ESLint, Biome, Oxlint, Vitest, Playwright, Storybook, Ruff, Pyright, Semgrep, Gitleaks, Trivy, CodeQL, Dependabot, Schemathesis, Pact, Spectral, Lighthouse CI, OpenTelemetry, Sentry/GlitchTip, Prometheus, Grafana.

### 3.3 Keine Änderung ohne passende Gegenprüfung

| Änderungstyp | Pflichtprüfung |
|---|---|
| Frontend geändert | Storybook + Playwright + Accessibility + Screenshot |
| Backend geändert | Unit + Integration + OpenAPI/Schemathesis |
| API geändert | Contract + Schemathesis + OpenAPI Diff |
| DB geändert | Migration Dry Run + Rollback + RLS Check |
| Auth geändert | Security Review + E2E Login/Logout/Session |
| Mail geändert | Preview + Sandbox-Test + Anti-Spam/DSGVO-Gate |
| 9Router geändert | Provider Health + Fallback + Kosten/Quota Check |
| Brain geändert | Query/Store/Reindex Test + Embedding Check |
| Agent geändert | Prompt Test + Safety Gate + Evidence |
| Deployment geändert | Preview + Smoke + Rollback Plan |

### 3.4 Gate-Pflicht

Diese Aktionen benötigen ein bestandenes Gate:

- **Git Push** — typecheck, lint, build, test, security criticals
- **Deployment** — alle Gates + API-Contract + E2E + Lighthouse
- **DNS/Cloudflare/Vercel produktiv** — Preview-Check + Rollback-Plan
- **Secrets** — Gitleaks + Semgrep + Brain-Benachrichtigung
- **Produktive Kundenmails** — Preview + Sandbox + DSGVO
- **Irreversible Löschung** — Change Intent + Backup + Bestätigung

Gates entscheiden per Ampellogik:

| Farbe | Bedeutung |
|-------|-----------|
| GRÜN | Alle Gates bestanden |
| GELB | Warnungen, aber keine Blocker |
| ROT | Blocker – kein Merge/Deploy |
| BLAU | Wartet auf Freigabe |
| GRAU | Quelle nicht erreichbar, Ersatzprüfung aktiv |

---

## 4. Pflichtstack

### 4.1 TypeScript/Next.js/Frontend

| Tool | Einsatzzweck | Pflicht seit |
|------|-------------|-------------|
| TypeScript strict + `tsc --noEmit` | Typsicherheit | sofort |
| ESLint Flat Config | Fachliche JS/TS-Regeln, React, Security | sofort |
| Biome | Schneller Formatter + Basis-Linting | sofort |
| Oxlint | Extrem schneller Zusatz-Linter | optional |
| Knip | Ungenutzte Dateien, Exports, Dependencies | sofort |
| Vitest | Unit- + Component-Tests | sofort |
| Storybook + Vitest Addon | UI-Komponenten-Tests | sofort |
| Playwright UI Mode + Trace | E2E-Tests | sofort |
| axe-core | Accessibility | sofort |
| Lighthouse CI | Performance/SEO/Best-Practices | sofort |
| React Scan | React Render-Optimierung | optional |

### 4.2 Python/Backend

| Tool | Einsatzzweck | Pflicht seit |
|------|-------------|-------------|
| Ruff | Linter + Formatter | sofort |
| Pyright | Typ-Prüfung | sofort |
| pytest | Tests | sofort |
| coverage | Testabdeckung | sofort |
| bandit | Security-Scanner | sofort |
| pip-audit | Dependency-Security | sofort |
| uv lock/check | Lock-File-Validierung | sofort |

### 4.3 API/Contract

| Tool | Einsatzzweck | Pflicht seit |
|------|-------------|-------------|
| OpenAPI 3.1 Spec | API-Vertrag | sofort |
| Spectral | OpenAPI-Lint | sofort |
| Schemathesis | Property-based API-Fuzzing | sofort |
| Pact | Consumer-driven Contracts | bei Microservices |

### 4.4 Security/Secrets/Supply Chain

| Tool | Einsatzzweck | Pflicht seit |
|------|-------------|-------------|
| Gitleaks | Secret-Erkennung | sofort |
| Semgrep | SAST + Custom Rules | sofort |
| CodeQL | GitHub-native Code-Scanning | sofort |
| Dependabot | Dependency-Updates | sofort |
| Trivy | Filesystem/Container/DB-Scan | sofort |
| pnpm audit / npm audit | Dependency-Security | sofort |
| pip-audit | Python-Dependency-Security | bei Python |
| OSV-Scanner | Open-Source-Vulnerability-Scan | optional |

### 4.5 Runtime/Monitoring

| Tool | Einsatzzweck | Pflicht seit |
|------|-------------|-------------|
| OpenTelemetry | Tracing/Metrics/Logging | sofort |
| Sentry oder GlitchTip | Error Tracking | sofort |
| Prometheus + Grafana | Metriken/Dashboards | sofort |
| Uptime Kuma | Uptime Checks | sofort |
| Vercel Logs | Deployment/Runtime-Logs | bei Vercel |
| Brain Logs | Service-Monitoring | sofort |
| 9Router Logs | Provider-Routing | sofort |

---

## 5. NLVL-Ablauf (SOP)

Jede Code-Aufgabe läuft ab sofort so:

```text
1. Ziel verstehen
2. Brain/agentmemory/Repo/Live-Kontext laden
3. Official Docs laden, wenn Tool/API/Config betroffen
4. Vorhandene Architektur prüfen
5. Testplan vor Codeänderung schreiben
6. Kleine Änderung umsetzen
7. Sofort prüfen:
   - typecheck
   - lint
   - unit/component test
   - build
8. UI falls sichtbar:
   - Storybook
   - Playwright
   - screenshot
   - accessibility
9. API falls betroffen:
   - OpenAPI/Spectral
   - Schemathesis
   - Pact
10. Security:
    - gitleaks
    - semgrep
    - dependency scan
11. Preview/Deployment nur nach Gate
12. Evidence schreiben
13. Brain/agentmemory/Kanban aktualisieren
14. DONE_TRUE nur nach Endkontrolle
```

---

## 6. Ports und Dienste (NLVL-Infrastruktur)

| Dienst | Port | Zweck |
|--------|------|-------|
| Vitest UI | 51204 | Test-UI |
| Storybook | 6006 | Komponenten-Browser |
| Playwright UI | 54000 | E2E-Test-UI |
| Lighthouse CI | 9001 | Performance-Reports |
| Prometheus | 9090 | Metriken |
| Grafana | 3000 | Dashboards |
| Uptime Kuma | 3001 | Uptime |
| GlitchTip/Sentry | 8000 | Error Tracking |

---

## 7. Evidence-Pflichtschema

Jeder erkannte Fehler wird strukturiert dokumentiert:

```json
{
  "finding_id": "NLVL-YYYYMMDD-0001",
  "source_tool": "playwright|eslint|tsc|semgrep|gitleaks|vercel|runtime",
  "severity": "P0|P1|P2|P3",
  "category": "type|lint|ui|api|security|secret|runtime|deployment",
  "file": "",
  "route": "",
  "component": "",
  "error": "",
  "reproduction": "",
  "evidence_path": "",
  "brain_sync": "pending|done|not_relevant",
  "agentmemory_sync": "pending|done|not_relevant",
  "kanban_task": "",
  "status": "open|fixed|verified|accepted_risk"
}
```

---

## 8. Verbotene Zustände

Verboten:

- Code schreiben ohne Testplan
- UI ändern ohne Screenshot/Playwright
- API ändern ohne OpenAPI-/Contract-Prüfung
- Config ändern ohne offizielle Docs
- Security-relevante Änderung ohne Secret-/SAST-Scan
- DONE melden ohne Evidence

---

## 9. Verantwortlichkeiten

| Rolle | Verantwortung |
|-------|---------------|
| Claude Code | Primäre Ausführung, Live-Prüfung, Brain-Sync |
| Goose AI | System-CLI, MCP, lokale Runtime |
| Hermes | Webhook-Gateway, Agent-Delegation |
| GitHub Actions | CI/CD-Gates, SARIF-Upload |
| Vercel | Preview-Deployment, Smoke-Checks |
| Workstation | Live-Panel, Ampeln, Finding-Anzeige |

---

## 10. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-06-11 | Claude Code | Initiale Policy gemäß NLVL-Auftrag |

---

## 11. Verweise

- `/workspace/nexify/03_regelwerke/` — bestehende Regelwerke
- `/workspace/nexify/04_register/live_verification/` — Tool- und Error-Register
- `/workspace/nexify/08_kanban_tasks/live_verification/` — Kanban-Tasks
- `/workspace/nexify/10_evidence/live_verification/` — Evidence
- `/root/.nexify/agent-system/` — Agentensystem
- [NLVL Live Verification Tool Register](tool-register-link)
- [NLVL Error Classification Register](error-classification-link)
- [NLVL Kanban Board](kanban-link)
- [NLVL Baseline Evidence](baseline-evidence-link)
