# /pr-flow

Standard-Lieferpfad: Branch → GitHub PR → CI → GitLab-Mirror → Staging → Release → main.

## Goal

Änderungen reviewbar und sync-fähig liefern; keine Secrets; conventional commits.

## Common Files

- `CLAUDE.md` (Branch/Commit-Konvention)
- `docs/operations/REPO-SYNC-STRATEGY.md`
- `.github/workflows/*`, `.gitlab-ci.yml`
- Preferred base: `main` (Cloud) / `develop` laut Team-Workflow

## Suggested Sequence

1. Branch: `cursor/<kurz>-….` bzw. `feature/*` / `bugfix/*`.
2. Kleine, kohärente Diffs; Header/Docs nur wo nötig.
3. Tests/Lint für geänderte Bereiche.
4. Commit: `feat|fix|docs|chore(scope): …`
5. Push + Draft-PR; CI abwarten.
6. GitLab-Mirror/MR läuft über Sync-Workflows — lokal OSS via `/gitlab-oss-mcp` prüfen wenn nötig.
7. Merge erst nach Review; Production = Freigabe (`/governance-f32`).

## Pitfalls

- Nicht direkt auf `main` committen.
- Keine Force-Push auf shared Branches ohne Absprache.
- Cloud-Agent: PRs über vorgesehene Tools, nicht `gh` writes wenn gesperrt.
