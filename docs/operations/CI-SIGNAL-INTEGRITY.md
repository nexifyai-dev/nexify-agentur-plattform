# FILE: docs/operations/CI-SIGNAL-INTEGRITY.md
# NIR: 02.08.2026 08:55
# UPDATED: 02.08.2026 08:55
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Ops note — honest CI conclusions for deploy workflows (no skip-as-success)
# WHY: Filling secrets (#123) alone does not fix false confidence if jobs stay green while skipping
# BEST-PRACTICE: Required deploy credentials missing → fail the job; log secret NAMES only
# PITFALL: V-01: Preflight that sets skip=true and exits 0 produces fake-green (issue #138)
# DEPENDS: .github/workflows/deploy-vercel.yml; GitHub Secrets VERCEL_* (human-filled via #123)
# DOCS-REF: https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/138

# CI Signal Integrity

## Rule

Production deploy workflows must **not** conclude `success` when they only skipped
because required credentials were missing. Missing secrets → **job failure** with
an error listing **secret names only** (never values).

## Related issues

| Issue | Role |
|-------|------|
| [#138](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/138) | Signal integrity (this note) |
| [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123) | Human fills product secrets / runners |

**Secrets filled ≠ signal fixed.** #123 supplies credentials; #138 ensures the
workflow turns red when they are absent so “Deploy success” cannot mean “did nothing”.

## Primary fix

`deploy-vercel.yml` preflight **exits 1** when `VERCEL_TOKEN` is missing
(fallbacks: `VERCEL_ACCESS_TOKEN`, secret or variable). `VERCEL_ORG_ID` and
`VERCEL_PROJECT_ID` are optional context hints and emit warnings when absent.

## Follow-up (not in this change)

- Consolidate overlapping `ci.yml` + `test.yml` on PRs to `main` (dual lint/test waste).
- Align required checks / ruleset names so skip-green cannot satisfy a “deployed” gate.
