# AGENTS.md

## Cursor Cloud specific instructions

### What runs here
The fully runnable product in this repo is the **website** at `apps/website` (Next.js 16, React 19, Tailwind v4, package manager **pnpm**). Standard scripts live in `apps/website/package.json` (`dev`, `build`, `lint`, `typecheck`, `test`). Run them from `apps/website`.

- Dev server: `pnpm dev` (Turbopack) → http://localhost:3000. Health: `GET /api/health`. `/` redirects (307) to `/de`.
- Lint/typecheck/test/build all pass: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

### Non-obvious gotchas (website)
- Use **pnpm**, not npm/yarn. There is both a `pnpm-lock.yaml` and a stray `yarn.lock`; pnpm matches the lockfile and `engines`. Next.js prints a "multiple lockfiles / inferred workspace root" warning because of this plus the nested `apps/website/pnpm-workspace.yaml` — it is harmless.
- `apps/website/pnpm-workspace.yaml` makes `apps/website` its own pnpm workspace root, so install from inside that dir (the update script uses `pnpm --dir apps/website install`).
- `pnpm test` only runs `tests/*.test.mjs` (the site-contract tests). The many `tests/*.test.tsx` / `*.test.ts` files are **not** wired into a runner. `test:design` (`playwright`) needs browser binaries that are not installed.
- pnpm reports "Ignored build scripts: sharp, unrs-resolver" on install — fine for dev.
- With no backend configured, `/api/planner/plan` returns a deterministic local estimate, while `/api/contact` and `/api/offers/request` intentionally return 5xx ("honest failure"). Set `BACKEND_ORIGIN` to proxy `/api/*` to a real backend.

### Backend (`backend/`) — cannot be fully run here
The FastAPI backend is **not** set up in this environment and cannot be without external access:
- `requirements.txt` / `requirements-ci.txt` need the private package `emergentintegrations` (not on public PyPI) and a custom `litellm` wheel URL, so a full `pip install` fails.
- It also needs external services (Supabase Postgres, Resend email, an OpenAI-compatible LLM / 9router) with real keys — see `backend/.env.example`.
- `backend/tests/*.py` are **integration tests that hit a live/remote HTTP backend** (`REACT_APP_BACKEND_URL`), not local unit tests.
- The only backend check that passes offline is the CI lint gate (needs just `flake8`), run from `backend/`:
  `python -m flake8 . --select=E9,F63,F7,F82 --exclude=.venv` and `python -c "import ast; ast.parse(open('server.py').read())"` (same for `portal/server.py`).
