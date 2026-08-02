# FILE: docs/operations/GITHUB-SECURITY-OVERVIEW.md
# NIR: 02.08.2026 09:45
# UPDATED: 02.08.2026 09:45
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

- Advanced Setup: Matrix `javascript-typescript` + `python`
- `apps/hermes/**` (vendored Upstream) ist per `paths-ignore` aus der Analyse ausgeschlossen — Findings dort werden nicht als Produkt-Alerts geführt
- Backend-/Website-Findings: Fixes über Security-Triage-PRs (z. B. Dependabot-Close)

## Verifikation

```bash
unset GITHUB_TOKEN
gh api repos/nexifyai-dev/nexify-agentur-plattform/private-vulnerability-reporting
# → {"enabled":true}

gh api repos/nexifyai-dev/nexify-agentur-plattform --jq .security_and_analysis
```
