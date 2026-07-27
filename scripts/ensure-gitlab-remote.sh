#!/usr/bin/env bash
# FILE: /scripts/ensure-gitlab-remote.sh
# WHAT: Git remote 'gitlab' auf VPS GitLab OSS verdrahten (Token aus Env).
# WHY: Dual-VCS Push/Mirror lokal und in CI ohne Secrets im Repo.
# PITFALL: Token in Remote-URL landet in .git/config — nur lokal, nie committen.
# DOCS-REF: docs/operations/REPO-SYNC-STRATEGY.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

HOST="${GITLAB_HOST:-gitlab.nexifyai.cloud}"
GROUP="${GITLAB_GROUP:-nexifyai}"
PROJECT="${GITLAB_PROJECT:-nexify-agentur-plattform}"
TOKEN="${GITLAB_PERSONAL_ACCESS_TOKEN:-${GITLAB_TOKEN:-${VPS_GITLAB_TOKEN:-}}}"
USER="${GITLAB_USERNAME:-${VPS_GITLAB_USERNAME:-oauth2}}"

if [[ -n "${VPS_GITLAB_URL:-}" ]]; then
  URL="$VPS_GITLAB_URL"
elif [[ -n "$TOKEN" ]]; then
  URL="https://${USER}:${TOKEN}@${HOST}/${GROUP}/${PROJECT}.git"
else
  URL="https://${HOST}/${GROUP}/${PROJECT}.git"
  echo "⚠️  Kein Token — Remote ohne Auth (nur Public/Clone-fähig)"
fi

# Redact for display
DISPLAY_URL=$(echo "$URL" | sed -E 's#://([^:@/]+):[^@/]+@#://\1:***@#')

if git remote get-url gitlab >/dev/null 2>&1; then
  git remote set-url gitlab "$URL"
  echo "✅ gitlab remote aktualisiert → $DISPLAY_URL"
else
  git remote add gitlab "$URL"
  echo "✅ gitlab remote hinzugefügt → $DISPLAY_URL"
fi

git remote -v | sed -E 's#(://[^:@/]+:)[^@/]+@#\1***@#g'
