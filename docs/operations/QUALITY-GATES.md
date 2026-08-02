# FILE: docs/operations/QUALITY-GATES.md
# NIR: 02.08.2026 09:15
# UPDATED: 02.08.2026 11:24
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Quality
# WHAT: Inventory of tests, CI jobs, and L1/L2/L3 verification levels for absolute error-freedom.
# WHY: Single SoT for the Quality System — coordinate with production backlog via separate PRs.
# BEST-PRACTICE: L1 live → L2 marker → L3 functional; fail CI on ERROR only for audits; no secrets in logs.
# PITFALL: V-QG-01: Hosted ubuntu-latest cannot reach VPS localhost (:3111/:8644/:9622) — skip with note.
# DEPENDS: .github/workflows/{ci,test,quality-smoke,quality-audit,secret-scan,design-system-guard}.yml
# DOCS-REF: docs/governance/10_quality_gates/ · AGENTS.md (3-stufige Verifikation)
# SESSION: quality-gates-absolute-7dd5

# Quality Gates — NeXify

**Issues:** #165 · #166 · #167 · #168 Agentur-Plattform

**Owner:** Quality System (`cursor/quality-gates-*`)  
**Production backlog:** separate PRs (do not fight merges)  
**Hard stop:** no Hermes cutover; no secrets in logs/artifacts


## Website unit contracts (CI)

- Runner: `pnpm --dir apps/website test` → `node --test tests/*.test.mjs`
- Former `*.test.tsx` contracts renamed to `*.test.mjs` (node:test; no React/Vitest needed)
- Wired in `ci.yml` (website job) and `test.yml` (unit-test job)

## Playwright design-audit (PR + nightly)

- Spec: `apps/website/tests/e2e/design-audit.spec.ts`
- CI: `.github/workflows/quality-design-audit.yml` (PRs nach `main` bei Website-/CI-Pfaden, plus `0 4 * * *` und `workflow_dispatch`)
- Local/script: `pnpm --dir apps/website test:design-audit`
- Nicht auf jedem Repo-PR, sondern gezielt auf relevanten Website-/CI-Änderungen (Runtime-Budget)

## Backend pytest (offline unit lane)

- Offline unit lane: `pytest tests/unit -m unit` — **fail-hard** in CI
- Integration: remaining `tests/` with `continue-on-error` (needs `REACT_APP_BACKEND_URL`)
- Markers: `backend/pytest.ini`

## VPS-local L1 (self-hosted)

- Requires self-hosted runner labels `[self-hosted, vps, nexifyai]` — blocked on #123 / #168 until runner count > 0

## Verification levels (mandatory)

| Level | Name | Meaning | Pass signal |
|-------|------|---------|-------------|
| **L1** | Live | Process/endpoint answers | HTTP 2xx / process up |
| **L2** | Marker | Expected payload/marker present | JSON `status`, CSS marker, file exists |
| **L3** | Functional | Behaviour under real path | Unit/e2e/asserted user flow |

Never claim “done” on L1 alone (AGENTS.md).

---

## Quality matrix

### Website (`apps/website`)

| Gate | Tool / job | L1 | L2 | L3 | CI path | Severity |
|------|------------|----|----|----|---------|----------|
| Public health | `GET /api/health` via quality-smoke | ✅ | ✅ `{"status":"ok"}` | — | `quality-smoke.yml` | **fail** |
| Unit (contract) | `pnpm test` → `tests/*.test.mjs` | — | ✅ | ✅ | `ci.yml` website + `test.yml` unit-test | **fail** |
| Typecheck | `pnpm typecheck` | — | ✅ | — | `ci.yml` website | **fail** |
| Lint | `pnpm lint` | — | ✅ | — | `ci.yml` + `test.yml` | **fail** |
| Build | `pnpm build` | — | ✅ | — | `ci.yml` website | **fail** |
| Design CSS guard | marker in `globals.css` | — | ✅ | — | `design-system-guard.yml` | **fail** |
| Playwright critical | `tests/e2e/critical-path.spec.ts` | ✅ | ✅ | ✅ home+health | `quality-smoke.yml` (PR) | **fail** |
| Playwright design audit | `tests/e2e/design-audit.spec.ts` | ✅ | ✅ | ✅ multi-viewport | `quality-design-audit.yml` (PR website/CI paths + nightly) | **fail** |

### Backend (`backend/`)

| Gate | Tool / job | L1 | L2 | L3 | CI path | Severity |
|------|------------|----|----|----|---------|----------|
| Flake8 critical | E9,F63,F7,F82 | — | ✅ | — | `ci.yml` backend | **fail** |
| AST syntax | `server.py`, `portal/server.py` | — | ✅ | — | `ci.yml` backend | **fail** |
| Pytest | `backend/tests/` | — | — | ⚠️ needs remote DB/env | `ci.yml` / `test.yml` | **warn** (`continue-on-error`) |
| FlowSearch mandate | `check_knowledge_mandate.py` | — | ✅ paths/IDs | ✅ import | `ci.yml` + `quality-audit.yml` | **fail** |

### Hermes (`apps/hermes`) — **no cutover**

| Gate | Tool / job | Notes | Severity |
|------|------------|-------|----------|
| Syntax + pytest structure | `ci.yml` hermes | Runtime agent not required for structure | warn on full e2e |
| Docker build verify | `test.yml` docker-build-test | push=false | warn (`continue-on-error`) |

### Agentic / governance audits

| Gate | Script | L1 | L2 | L3 | Workflow | Fail rule |
|------|--------|----|----|----|----------|-----------|
| SOLL deviation | `scripts/soll-deviation-scan.py` | runtime optional | file SoT | — | `ci.yml` + `quality-audit.yml` | **ERROR only** (WARN ok) |
| Knowledge mandate | `scripts/check_knowledge_mandate.py` | — | register IDs | import | same | **fail** on any miss |
| Doc↔impl gap | `scripts/doc-implementation-gap-scan.py` | — | MUST/PFLICHT heuristics | — | `quality-audit.yml` | **ERROR only** |
| Secret scan | TruffleHog | — | verified secrets | — | `ci.yml` + `secret-scan.yml` | **fail** verified |
| GitLab OSS smoke | `scripts/gitlab-oss-smoke.sh` | ✅ | — | — | local / bootstrap | report |

### Runtime / edge smoke (hosted runners)

| Probe | URL pattern | Hosted `ubuntu-latest` | Self-hosted / VPS SSH |
|-------|-------------|------------------------|------------------------|
| Website health | `https://www.nexifyai.cloud/api/health` | **required** | required |
| API health (optional) | `SMOKE_API_HEALTH_URL` / `https://api.nexifyai.cloud/api/health` | soft | soft |
| AI Router | `https://ai-router.nexifyai.cloud/api/health` | soft (edge) | soft |
| AgentMemory public | `https://agentmemory.nexifyai.cloud` | soft | soft |
| AgentMemory REST | `http://127.0.0.1:3111/...` | **SKIP** (note in log) | L1+L2 when live |
| Hermes Gateway | `http://127.0.0.1:8644/...` | **SKIP** | L1 when live |
| LightRAG | `http://127.0.0.1:9622/health` | **SKIP** | L1 when live |

---

## CI workflow map

| Workflow | Trigger | Owns |
|----------|---------|------|
| `ci.yml` | push/PR → `main` | backend lint, website typecheck/lint/build/**test**, hermes structure, secrets, agentic-governance |
| `test.yml` | PR → `main`, `feature/**`, Mon schedule | lint, website unit, docker verify |
| `quality-smoke.yml` | PR → `main`, schedule, dispatch | public curl smoke + Playwright critical path |
| `quality-audit.yml` | PR → `main`, schedule, dispatch | SOLL + knowledge + doc-gap artifacts |
| `design-system-guard.yml` | CSS path changes | L2 CSS marker |
| `secret-scan.yml` | (standalone) | secrets |
| `build.yml` | path filters | GHCR images |
| `mirror-to-gitlab.yml` | after GitHub | Dual-VCS (not a quality gate) |

---

## Local commands (Quality System)

```bash
# L1/L2 public smoke (no secrets)
bash scripts/quality-smoke.sh

# Audits — fail on ERROR only for SOLL/doc-gap; knowledge is hard fail
python3 scripts/soll-deviation-scan.py
python3 scripts/check_knowledge_mandate.py
python3 scripts/doc-implementation-gap-scan.py

# Website L3 contract tests
pnpm --dir apps/website test
pnpm --dir apps/website typecheck && pnpm --dir apps/website lint && pnpm --dir apps/website build

# Playwright critical (needs build + browsers once)
pnpm --dir apps/website build
pnpm --dir apps/website exec playwright install --with-deps chromium
pnpm --dir apps/website exec playwright test tests/e2e/critical-path.spec.ts
```

Optional local runtime probes:

```bash
QUALITY_SMOKE_LOCAL=1 bash scripts/quality-smoke.sh
```

---

## Known gaps (tracked issues)

1. **Backend pytest** — integration against remote URL; CI soft-fails.
2. **VPS-local L1** for AM/Gateway/LightRAG — not enforceable on GitHub-hosted runners.
3. **Hermes cutover / live functional** — blocked until Endabnahme (HARD STOP).

Open follow-ups with label `agent-fix` when Cursor-owned; `human-gate` for secrets/cutover.
