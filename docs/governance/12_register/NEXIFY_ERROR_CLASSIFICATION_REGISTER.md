# NEXIFY ERROR CLASSIFICATION REGISTER V1

| Feld | Wert |
|------|------|
| **Dokument-ID** | `NLVL-REG-ERR-001` |
| **Version** | 1.0 |
| **Stand** | 2026-06-11 |
| **Status** | `aktiv` |
| **Brain-Kategorie** | `claude-code-infrastructure` |

---

## 1. Fehlerklassen

### 1.1 Syntaxfehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| TypeScript-Parse-Error | TypeScript, ESLint | P0 | ✅ Editor + CLI |
| JavaScript-Parse-Error | ESLint, Biome | P0 | ✅ Editor + CLI |
| Python-Syntax-Error | Ruff, Pyright | P0 | ✅ Editor + CLI |
| JSON/YAML-Parse-Error | Biome, ESLint | P0 | ✅ Editor + CLI |
| JSX/TSX-Syntax-Error | TypeScript, ESLint | P0 | ✅ Editor + CLI |

### 1.2 Typfehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Type-Mismatch | TypeScript, Pyright | P0 | ✅ `tsc --noEmit` |
| Missing-Import | TypeScript, ESLint | P0 | ✅ Editor + CLI |
| Wrong-Export | TypeScript, Knip | P1 | ✅ `tsc --noEmit` |
| Generic-Type-Error | TypeScript | P0 | ✅ `tsc --noEmit` |
| Null/Undefined-Check | TypeScript strict | P1 | ✅ `tsc --noEmit` |
| Any-Type-Escaped | TypeScript strict | P1 | ✅ ESLint `no-explicit-any` |

### 1.3 Import-/Exportfehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Ungenutzter Import | ESLint, Biome, Knip | P2 | ✅ `eslint` / `knip` |
| Fehlender Export | TypeScript, Knip | P1 | ✅ `tsc --noEmit` |
| Circular Dependency | Knip, ESLint | P2 | ✅ `knip` |
| Barrel-Overhead | Knip | P2 | ✅ `knip` |
| Ungenutzte Datei | Knip | P2 | ✅ `knip` |

### 1.4 Format-/Stylefehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Format-Abweichung | Biome, Ruff | P2 | ✅ `biome check .` |
| Indentation | Biome | P2 | ✅ `biome check .` |
| Quotes/Semicolons | Biome | P2 | ✅ `biome check .` |
| Trailing-Commas | Biome | P3 | ✅ `biome check .` |
| Line-Length | Biome, Ruff | P2 | ✅ `biome check .` |

### 1.5 React-/UI-Fehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Missing-Key-in-List | ESLint react | P0 | ✅ `eslint` |
| Missing-Hook-Deps | ESLint react-hooks | P1 | ✅ `eslint` |
| Unnecessary-Rerender | React Scan | P2 | ✅ DevTools |
| Missing-Error-Boundary | ESLint | P1 | ✅ `eslint` |
| Broken-Component-State | Storybook | P0 | ✅ Storybook UI |
| Missing-Props | TypeScript | P0 | ✅ `tsc --noEmit` |
| Server/Client-Mismatch | Next.js build | P0 | ✅ `pnpm build` |

### 1.6 UI-/Layout-/Responsive-Fehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Overflow/Scroll-Broken | Playwright | P1 | ✅ Screenshot |
| Broken-Responsive | Playwright viewports | P1 | ✅ Screenshot |
| Missing-Mobile-Layout | Playwright mobile | P1 | ✅ Screenshot |
| Visual-Regression | Storybook/Chromatic | P1 | ✅ visueller Diff |
| Font-Load-Failure | Playwright, Lighthouse | P1 | ✅ Console |

### 1.7 Accessibility-Fehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Missing-Alt-Text | axe-core, ESLint jsx-a11y | P0 | ✅ Playwright axe |
| Missing-Aria-Labels | axe-core, ESLint jsx-a11y | P0 | ✅ Playwright axe |
| Keyboard-Navigation | axe-core, Playwright | P1 | ✅ Playwright |
| Color-Contrast | axe-core, Lighthouse | P1 | ✅ axe-core |
| Focus-Trap | Playwright | P1 | ✅ E2E |
| Missing-Skip-Link | axe-core, Lighthouse | P2 | ✅ axe-core |

### 1.8 API-Vertragsfehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| OpenAPI-Syntax-Error | Spectral | P0 | ✅ `spectral lint` |
| Breaking-Change | OpenAPI Diff | P0 | ✅ CI |
| Missing-Response-Schema | Spectral | P1 | ✅ `spectral lint` |
| Wrong-Status-Code | Spectral | P1 | ✅ `spectral lint` |
| Missing-Auth-Scheme | Spectral | P0 | ✅ `spectral lint` |
| Property-Fuzz-Failure | Schemathesis | P0 | ✅ `schemathesis run` |
| Contract-Violation | Pact | P0 | ✅ `pact verify` |

### 1.9 Datenbank-/Migrationsfehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Migration-Conflict | Prisma validate | P0 | ✅ `prisma validate` |
| Schema-Drift | Prisma migrate diff | P0 | ✅ CLI |
| SQL-Syntax | SQLFluff | P0 | ✅ `sqlfluff lint` |
| RLS-Missing | Supabase Policy Check | P0 | ✅ Review |
| Broken-Rollback | Migration Dry Run | P0 | ✅ `migrate diff` |

### 1.10 Security-Fehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| SQL-Injection | Semgrep, CodeQL | P0 | ✅ `semgrep scan` |
| XSS | Semgrep, ESLint, CodeQL | P0 | ✅ `semgrep scan` |
| CSRF | Semgrep, CodeQL | P0 | ✅ `semgrep scan` |
| Insecure-Crypto | Semgrep, bandit | P0 | ✅ `semgrep scan` |
| Hardcoded-Credentials | Semgrep, bandit | P0 | ✅ `semgrep scan` |
| Open-Redirect | Semgrep, CodeQL | P0 | ✅ `semgrep scan` |
| Path-Traversal | Semgrep, CodeQL | P0 | ✅ `semgrep scan` |
| Command-Injection | Semgrep, CodeQL | P0 | ✅ `semgrep scan` |

### 1.11 Secrets

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| API-Key-in-Code | Gitleaks, Semgrep | P0 | ✅ `gitleaks detect` |
| Token-in-Git-History | Gitleaks | P0 | ✅ `gitleaks detect` |
| Password-in-Config | Gitleaks | P0 | ✅ `gitleaks detect` |
| JWT-in-Repo | Gitleaks | P0 | ✅ `gitleaks detect` |
| Private-Key | Gitleaks | P0 | ✅ `gitleaks detect` |
| Connection-String | Gitleaks, Semgrep | P0 | ✅ `gitleaks detect` |

### 1.12 Dependency-Fehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Critical-Vulnerability | Dependabot, pnpm audit | P0 | ✅ CI |
| High-Vulnerability | Dependabot, Trivy | P1 | ✅ CI |
| Moderate-Vulnerability | Dependabot, pip-audit | P2 | ✅ CI |
| Outdated-Dep | Dependabot | P2 | ✅ PR |
| Deprecated-Dep | Knip, Dependabot | P2 | ✅ `knip` |
| Unused-Dep | Knip | P2 | ✅ `knip` |
| License-Violation | Trivy | P1 | ✅ `trivy fs .` |

### 1.13 Build-/Deployment-Fehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| Build-Failure | Next.js build, tsc | P0 | ✅ `pnpm build` |
| Bundle-Size-Over-Budget | Lighthouse CI, bundle-analyzer | P1 | ✅ `lhci` |
| Preview-Deploy-Failure | VPS (Preview) | P0 | ✅ VPS-Logs |
| Missing-Env-Var | Next.js build, VPS | P0 | ✅ Build Logs |
| Dockerfile-Syntax | Hadolint | P1 | ✅ `hadolint` |
| IaC-Drift | Checkov, Trivy | P1 | ✅ `checkov` |

### 1.14 Runtime-Fehler

| Fehler | Erkennung durch | Severity | Sofort sichtbar |
|--------|----------------|----------|-----------------|
| 500-Error | Sentry/GlitchTip | P0 | ✅ Dashboard |
| 404-Error | Sentry/GlitchTip | P1 | ✅ Dashboard |
| Uncaught-Exception | Sentry/GlitchTip | P0 | ✅ Dashboard |
| Memory-Leak | Prometheus/Grafana | P0 | ✅ Metriken |
| High-Latency | OpenTelemetry, Prometheus | P1 | ✅ Tracing |
| Provider-Failure | 9Router Logs | P0 | ✅ Dashboard |
| Brain-Unreachable | Brain Health Check | P0 | ✅ CLI |
| Mail-Delivery-Failure | Resend Logs | P0 | ✅ Dashboard |

---

## 2. Severity-Definition

| Level | Bedeutung | Reaktionszeit |
|-------|-----------|---------------|
| **P0** | Kritisch – Blockade, Sicherheitslücke, Datenverlust | sofort |
| **P1** | Hoch – Funktion beeinträchtigt, Workaround nötig | < 4h |
| **P2** | Mittel – Kosmetik, nicht-blockierend | < 24h |
| **P3** | Niedrig – Nice-to-have, Optimierung | < 1 Woche |

---

## 3. Fehler-Quelle-zu-Tool-Matrix

```
Syntaxfehler:
  TypeScript, ESLint, Biome, Ruff, Pyright

Typ-/Importfehler:
  tsc --noEmit, Pyright, Next.js build

Ungenutzte Dateien/Exports/Dependencies:
  Knip, depcheck, ts-prune

Format-/Stylefehler:
  Biome, Ruff format

React-UI-Fehler:
  Storybook, Vitest Browser Mode, Playwright, React Scan

Responsive-/Layoutfehler:
  Playwright screenshots, Storybook viewports

Accessibility:
  axe-core, Storybook a11y, Playwright axe, Lighthouse

API-Vertragsfehler:
  OpenAPI, Spectral, Schemathesis, Pact

DB-/Migration-Fehler:
  Prisma validate/migrate diff, SQLFluff

Security-Codefehler:
  Semgrep, CodeQL

Secrets:
  Gitleaks, GitHub Secret Scanning

Dependencies:
  Dependabot, OSV-Scanner, Trivy, pnpm/pip audit

Container/IaC:
  Trivy, Hadolint, ShellCheck, Checkov

Performance:
  Lighthouse CI, Web Vitals, React Scan, bundle analyzer

Deployment:
  GitHub Actions, VPS-Deploy, Playwright Preview Tests

Runtime:
  OpenTelemetry, Sentry/GlitchTip, Prometheus, Grafana
```

---

## 4. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-06-11 | Claude Code | Initiales Error-Classification-Register |

---

## 5. Verweise

- [NLVL Policy](nexify-live-verification-policy-v1.html)
- [NLVL Tool Register](nexify-live-verification-tool-register-v1.html)
- [NLVL Kanban Board](nexify-live-verification-kanban-v1.html)
- [NLVL Baseline Evidence](live-verification-baseline-evidence-v1.html)
