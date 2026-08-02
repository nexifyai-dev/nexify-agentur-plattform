# FILE: docs/operations/GITHUB-SECURITY-OVERVIEW.md
# NIR: 02.08.2026 09:45
# UPDATED: 02.08.2026 11:15
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Kurznotiz zu GitHub Security Overview (Policy, Private Reporting, CodeQL).
# WHY: Security-Overview-Lücken (SECURITY.md / Private Reporting) nachvollziehbar halten.
# BEST-PRACTICE: Policy im Repo-Root; Private Reporting via API; CodeQL Advanced Setup.
# PITFALL: V-SEC-02: Keine Secrets in SECURITY.md — nur öffentliche Kontaktmail.
# DEPENDS: GitHub Advanced Security Features am Repo
# DOCS-REF: https://docs.github.com/en/code-security
# SESSION: security-policy-7dd5

# GitHub Security Overview — Betrieb

## Aktivierte Features (Soll)

| Feature | Status | Hinweis |
|---------|--------|---------|
| Dependabot alerts + security updates | Enabled | PRs/Alert-Triage fortlaufend |
| Code scanning (CodeQL) | Enabled | Workflow `.github/workflows/codeql.yml` |
| Secret scanning + push protection | Enabled | — |
| Security advisories | Enabled | — |
| Security policy (`SECURITY.md`) | Enabled wenn gemerged | Root `SECURITY.md` |
| Private vulnerability reporting | Enabled via API | `PUT .../private-vulnerability-reporting` |

## Kontakt

Öffentlich: `mail@nexifyai.cloud` (siehe `SECURITY.md`). Keine Secrets in diesem Dokument.

## CodeQL

- Advanced Setup: Matrix `javascript-typescript` + `python` (`github/codeql-action@v4`)
- `apps/hermes/**` (vendored Upstream) ist per `paths-ignore` aus der Analyse ausgeschlossen — Findings dort werden nicht als Produkt-Alerts geführt
- Backend-/Website-Findings: Fixes über Security-Triage-PRs (z. B. Dependabot-Close)

## Verifikation

```bash
unset GITHUB_TOKEN
gh api repos/nexifyai-dev/nexify-agentur-plattform/private-vulnerability-reporting
# → {"enabled":true}

gh api repos/nexifyai-dev/nexify-agentur-plattform --jq .security_and_analysis
```

## Accepted risks (Dependabot — do not fake-dismiss)

| Package | Severity | Reason | Status |
|---------|----------|--------|--------|
| `ecdsa` (via python-jose) | high | No upstream patched release for Minerva-class timing; Linux JWT stack; migrate when alternative ready | Keep `tolerable_risk` with comment — do not silent-dismiss |
| Starlette **1.x** bumps | various | Incompatible with pinned FastAPI until FastAPI supports Starlette 1.x (closed #149 / #251) | Documented; Dependabot 1.x PRs closed |
| CVE-2025-62727 (Range DoS) starlette ≤0.49.0 | high | **Fixable on 0.x**: `starlette==0.49.1` needs FastAPI ≥0.121 (`starlette<0.50`) — not a 1.x-only fix | PR #260 |

Dismiss alerts only with `tolerable_risk` + written reason when no patch exists, or after the fix lands on `main` (auto → fixed). Never dismiss critical/high without reason.

## Triage snapshot (2026-08-02)

- Code scanning open: 0
- Secret scanning open: 0
- Repo security advisories: 0
- Dependabot open (pre-merge #260): 2× high (#86, #87, GHSA-7f5h-v6xp-fcq8)

