# FILE: docs/operations/CI-SIGNAL-INTEGRITY.md
# NIR: 02.08.2026 08:55
# UPDATED: 12.08.2026 (Vercel-Deploy entfernt → deploy-vps.yml + Host-Timer)
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Ops note — honest CI conclusions for deploy workflows (no skip-as-success)
# WHY: Filling secrets (#123) alone does not fix false confidence if jobs stay green while skipping
# BEST-PRACTICE: Required deploy credentials missing → fail the job; log secret NAMES only
# PITFALL: V-01: Preflight that sets skip=true and exits 0 produces fake-green (issue #138)
# DEPENDS: .github/workflows/deploy-vps.yml; Host-Timer `nexifyai-website-sync.timer`
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

## Primary fix (2026-08-10/11: Vercel raus, VPS rein)

Website-Deploy läuft NICHT mehr über Vercel. Einziger Deploy-Pfad:

1. **CI:** `.github/workflows/deploy-vps.yml` → Self-Hosted-Runner (`nexifyai`) oder
   SSH-Fallback (`VPS_HOST`/`VPS_USER`/`VPS_PORT`/`DEPLOY_KEY_VPS`) auf den Host.
2. **Host:** `nexifyai-website-sync.timer` (alle 5 min) → `/opt/nexifyai/scripts/website-sync.sh`
   → fetch `origin/main`, Build nur bei `apps/website`-Änderung, `systemctl restart nexifyai-website`.

Signal-Integrität: Fehlende Deploy-Credentials → Job FAIL (secret names only), kein skip-success.
`VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` existieren nicht mehr (Vercel-Altlast, entfernt 2026-08-11).

## Follow-up (not in this change)

- Consolidate overlapping `ci.yml` + `test.yml` on PRs to `main` (dual lint/test waste).
- Align required checks / ruleset names so skip-green cannot satisfy a “deployed” gate.
