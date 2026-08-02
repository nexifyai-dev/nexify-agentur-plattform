# Quality Gates

**UPDATED:** 2026-08-02  
**Issues:** #165 · #166 · #167 · #168

## Website unit contracts

- Runner: `pnpm --dir apps/website test` → `node --test tests/*.test.mjs`
- Former `*.test.tsx` contracts renamed to `*.test.mjs` (node:test; no React/Vitest needed)
- Wired in `ci.yml` (website job) and `test.yml` (unit-test job)

## Playwright design-audit

- Spec: `apps/website/tests/e2e/design-audit.spec.ts`
- Nightly: `.github/workflows/quality-design-audit.yml` (`0 4 * * *` + `workflow_dispatch`)
- Not on every PR (runtime cost)

## Backend pytest

- Offline unit lane: `pytest tests/unit -m unit` — **fail-hard** in CI
- Integration: remaining `tests/` with `continue-on-error` (needs `REACT_APP_BACKEND_URL`)
- Markers: `backend/pytest.ini`

## VPS-local L1

- Requires self-hosted runner labels `[self-hosted, vps, nexifyai]` — blocked on #123 / #168 until runner count > 0
