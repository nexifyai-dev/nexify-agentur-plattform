# Health Sweep Report — 2026-06-20 08:25 UTC

## Zusammenfassung

| Bereich | Status | Details |
|---------|--------|---------|
| Bookando API (prod) | ⚠️ Uncommitted | 1 staged + 15 untracked files |
| Bookando DE (frontend) | ✅ Clean | 0 changes |
| Bookando API (depr) | ✅ Clean | 0 changes |
| Nexify Platform | ⚠️ Uncommitted | 14 modified + 14 untracked (NeXify-intern) |
| API Health | ✅ 200 OK | https://bookando-de-riw8.vercel.app/api/health |
| Bookando.de | ✅ 308 Redirect | https://bookando.de — normales Vercel-Verhalten |
| Disk | ✅ 39% (148/387G) | 239G frei |
| Cron | ✅ 2 jobs | `agentur-health-check` (15min), `weekly-deep-audit` (Mo 6:00) |
| Permissions | ⚠️ Root-owned | Beide Bookando-Repos root:root → read-only |


## Findings (prio-sortiert)

### 🔴 P1 — Security: Secrets nicht in .gitignore

**`/workspace/customers/fixdigital/bookando/bookando-api/config/system_connections.env`** existiert physikalisch aber ist NICHT in `.gitignore`. Aktuell untracked (nicht committed), aber bei `git add config/` oder `git add .` landen Secrets im Index.

**Betroffene Files:**
- `config/system_connections.env` — echte Secrets (1443 bytes)
- `.env.local` — existiert physikalisch, nicht in .gitignore

**Fix:**
- `.gitignore` ergänzen um:
  ```
  config/
  config/*
  .env.local
  ```
- Chown und Commit nötig → blockiert durch root-Owner

**Workaround bis dahin:** Manuell `git add config/` vermeiden.

### 🟡 P2 — Staged Änderung in api/audit_routes.py

`M api/audit_routes.py` ist staged aber noch nicht committed. Enthält wahrscheinlich die neuen Audit-Features.

### 🟡 P3 — 15 neue Test-Dateien uncommitted

12 Test-Dateien in `tests/` + diverse Features (rate_limiter, security_headers, Dockerfile, docker-compose) — alle uncommitted. Blockiert durch root-Owner.

### ℹ️ P4 — Veraltetes Repo `/workspace/bookando-api/`

Deprecated copy. Letzter Commit 2026-06-19. Sollte ggf. entfernt werden — 2 Versionen desselben Backends verwirren.

### ℹ️ Cron — Nie gelaufen

Beide Cron-Jobs sind enabled aber `last_run_at: null`. Beim nächsten Lauf (`08:28` UTC) sollte `health_check.py` erstmals feuern.

### ℹ️ Nexify Platform — Uncommitted

Nicht agentur-admin-Zuständigkeit. Nur notiert: 28 Änderungen seit Merge PR #118 (2026-06-11).


## Blockiert

| Problem | Fix benötigt |
|---------|-------------|
| .gitignore fixen (config/, .env.local) | chown auf repo, dann edit + commit |
| git push unmöglich | SSH-Key oder PAT konfigurieren |
| Root-owned repos | Besitzerwechsel nötig für Write |

## Nächste Schritte

1. **KEIN Schreibzugriff von Hermes** — root-Owner blockiert alle edits
2. Manuell: Repos chown + .gitignore fix + commit
3. Cron-Erstlauf abwarten (08:28 UTC)
