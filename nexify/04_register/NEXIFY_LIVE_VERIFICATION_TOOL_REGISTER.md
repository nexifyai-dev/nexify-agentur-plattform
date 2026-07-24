# NEXIFY LIVE VERIFICATION TOOL REGISTER V1

**Welches Tool prüft welche Fehlerkategorie – mit Konfigurationsstand und Status.**

| Feld | Wert |
|------|------|
| **Dokument-ID** | `NLVL-REG-TOOL-001` |
| **Version** | 1.0 |
| **Stand** | 2026-06-11 |
| **Status** | `aktiv` |
| **Brain-Kategorie** | `claude-code-infrastructure` |

---

## 1. Tool-Übersicht

### 1.1 TypeScript/JavaScript/Frontend

| Tool | Version | Kategorie | Prüfung | Config-Pfad | Status |
|------|---------|-----------|---------|-------------|--------|
| TypeScript | 5.x | type | `tsc --noEmit` | `tsconfig.json` | ✅ aktiv |
| ESLint | 9.x | lint | `eslint . --max-warnings=0` | `eslint.config.*` | ✅ aktiv |
| Biome | 1.x | lint/format | `biome check .` | `biome.json` | ✅ aktiv |
| Oxlint | 0.x | lint | `oxlint .` | `.oxlintrc.json` | ⏳ optional |
| Knip | 5.x | deadcode | `knip` | `knip.json` / `knip.ts` | ✅ aktiv |
| Vitest | 3.x | test | `vitest run` | `vitest.config.ts` | ✅ aktiv |
| Storybook | 8.x | ui-test | `vitest --project=storybook` | `.storybook/` | ✅ aktiv |
| Playwright | 1.58+ | e2e | `playwright test` | `playwright.config.ts` | ✅ aktiv |
| axe-core | 4.x | a11y | `playwright test tests/a11y` | via Playwright | ✅ aktiv |
| Lighthouse CI | 11.x | perf/seo | `lhci autorun` | `lighthouserc.*` | ✅ aktiv |
| React Scan | - | perf | dev-only | via import | ⏳ optional |

### 1.2 Python/Backend

| Tool | Version | Kategorie | Prüfung | Config-Pfad | Status |
|------|---------|-----------|---------|-------------|--------|
| Ruff | 0.x | lint/format | `ruff check .` + `ruff format --check .` | `pyproject.toml` | ✅ aktiv |
| Pyright | 1.x | type | `pyright` | `pyproject.toml` | ✅ aktiv |
| pytest | 8.x | test | `pytest -q` | `pyproject.toml` / `pytest.ini` | ✅ aktiv |
| coverage | 7.x | test-abdeckung | `pytest --cov` | `pyproject.toml` / `.coveragerc` | ✅ aktiv |
| bandit | 1.x | security | `bandit -r .` | `pyproject.toml` | ✅ aktiv |
| pip-audit | 2.x | deps | `pip-audit` | - | ✅ aktiv |
| uv | 0.x | lock-check | `uv lock --check` | `pyproject.toml` + `uv.lock` | ✅ aktiv |

### 1.3 API/Contract

| Tool | Version | Kategorie | Prüfung | Config-Pfad | Status |
|------|---------|-----------|---------|-------------|--------|
| OpenAPI 3.1 | - | spec | manuell | `openapi.yaml` | ✅ aktiv |
| Spectral | 6.x | lint | `spectral lint openapi.yaml` | `.spectral.yaml` | ✅ aktiv |
| Schemathesis | 3.x | fuzz | `schemathesis run` | `pyproject.toml` | ✅ aktiv |
| Pact | - | contract | `pact-broker can-i-deploy` | `pact/` | ⏳ bei MS |

### 1.4 Security/Secrets

| Tool | Version | Kategorie | Prüfung | Config-Pfad | Status |
|------|---------|-----------|---------|-------------|--------|
| Gitleaks | 8.x | secrets | `gitleaks detect --redact --source .` | `.gitleaks.toml` | ✅ aktiv |
| Semgrep | 1.x | sast | `semgrep scan --config auto` | `.semgrep/` | ✅ aktiv |
| CodeQL | - | code-scan | via GitHub Action | `.github/codeql/` | ✅ aktiv |
| Dependabot | - | deps | via GitHub | `.github/dependabot.yml` | ✅ aktiv |
| Trivy | 0.x | vuln | `trivy fs .` | - | ✅ aktiv |
| pnpm audit | - | deps | `pnpm audit --audit-level moderate` | - | ✅ aktiv |
| OSV-Scanner | 1.x | deps | `osv-scanner -r .` | `.osv-scanner.toml` | ⏳ optional |

### 1.5 Runtime/Monitoring

| Tool | Version | Kategorie | Prüfung | Status |
|------|---------|-----------|---------|--------|
| OpenTelemetry | - | tracing | SDK-Integration | ✅ aktiv |
| Sentry / GlitchTip | - | errors | SDK-Integration | ✅ aktiv |
| Prometheus | 2.x | metrics | `/metrics` Endpoint | ✅ aktiv |
| Grafana | 11.x | dashboards | Dashboard-Konfiguration | ✅ aktiv |
| Uptime Kuma | - | uptime | HTTP(S)-Check | ✅ aktiv |
| Vercel Logs | - | deploy/runtime | Vercel-Dashboard | ✅ bei Vercel |
| Brain Logs | - | service | Brain-Endpoint | ✅ aktiv |
| 9Router Logs | - | routing | 9Router-Dashboard | ✅ aktiv |

---

## 2. Pflichtbefehle (lokal)

```bash
# TypeScript
pnpm check:types          # tsc --noEmit
pnpm check:lint           # eslint . --max-warnings=0
pnpm check:lint:fast      # oxlint . (optional)
pnpm check:format         # biome check .
pnpm deadcode             # knip

# Tests
pnpm test                 # vitest run
pnpm test:ui              # vitest --ui
pnpm test:e2e             # playwright test
pnpm test:a11y            # playwright test tests/a11y
pnpm test:api             # schemathesis run openapi.yaml

# Security
pnpm security:secrets     # gitleaks detect --redact --source .
pnpm security:sast        # semgrep scan --config auto
pnpm security:deps        # pnpm audit --audit-level moderate
pnpm security:fs          # trivy fs .

# Full verification
pnpm build:verify         # check + build
pnpm verify:full          # build:verify + e2e + security:secrets + security:sast

# Python
ruff check .
ruff format --check .
pyright
pytest -q
pytest --cov
pip-audit
```

---

## 3. CI/CD-Pflichtjobs

| Job | Runner | Steps |
|-----|--------|-------|
| `quality` | ubuntu-latest | install, typecheck, lint, format, deadcode, test, build |
| `e2e` | playwright-container | install, playwright-test, upload-report |
| `security` | ubuntu-latest | gitleaks, semgrep, trivy, upload-sarif |
| `api-contract` | ubuntu-latest | spectral, schemathesis (bei API-Änderung) |
| `ui-visual` | ubuntu-latest | storybook-test, lighthouse-ci |
| `preview` | vercel | deploy, smoke, playwight-preview, lhci-preview |

---

## 4. SARIF-Ausgabe

Folgende Tools müssen SARIF-konform ausgeben (für GitHub Code Scanning):

| Tool | SARIF-fähig | Status |
|------|-------------|--------|
| Semgrep | ✅ `--sarif` | aktiv |
| Trivy | ✅ `--format sarif` | aktiv |
| Gitleaks | ✅ `--format sarif` | aktiv |
| ESLint | ✅ `--format @microsoft/eslint-formatter-sarif` | aktiv |
| CodeQL | ✅ nativ | aktiv |

SARIF-Upload via `github/codeql-action/upload-sarif@v3`.

---

## 5. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-06-11 | Claude Code | Initialer Tool-Register gemäß NLVL-POL-001 |

---

## 6. Verweise

- [NLVL Policy](nexify-live-verification-policy-v1.html)
- [NLVL Error Classification Register](error-classification-register-v1.html)
- [NLVL Kanban Board](nexify-live-verification-kanban-v1.html)
- [NLVL Baseline Evidence](live-verification-baseline-evidence-v1.html)
