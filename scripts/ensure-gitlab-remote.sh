#!/usr/bin/env bash
# FILE: /scripts/ensure-gitlab-remote.sh
# WHAT: Git remote 'gitlab' sicher auf das aktive VPS-GitLab-Projekt verdrahten.
# WHY: Dual-VCS Push/Mirror lokal und in CI ohne Secrets im Repo.
# PITFALL: Keine Tokens in Remote-URLs oder .git/config persistieren.
# DOCS-REF: docs/operations/REPO-SYNC-STRATEGY.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

URL="${GITLAB_REMOTE_URL:-git@gitlab.nexifyai.cloud:nexifyai_group/nexifyai.git}"

if git remote get-url gitlab >/dev/null 2>&1; then
  git remote set-url gitlab "$URL"
  echo "✅ gitlab remote aktualisiert → $URL"
else
  git remote add gitlab "$URL"
  echo "✅ gitlab remote hinzugefügt → $URL"
fi

git remote -v
