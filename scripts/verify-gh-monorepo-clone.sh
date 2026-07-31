#!/usr/bin/env bash
# FILE: /scripts/verify-gh-monorepo-clone.sh
# WHAT: Verifiziert die GitHub-Monorepo-Klonfaehigkeit ueber gh (autonomer Check).
# WHY: Stellt sicher, dass "gh repo clone nexifyai-dev/nexify-agentur-plattform" im Betrieb verfuegbar ist.
set -euo pipefail

REPO="${1:-nexifyai-dev/nexify-agentur-plattform}"
WORKDIR_BASE="${WORKDIR_BASE:-/tmp}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-90}"

if ! command -v gh >/dev/null 2>&1; then
  echo "status=warn reason=gh_cli_missing repo=$REPO"
  exit 2
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "status=warn reason=gh_not_authenticated repo=$REPO"
  exit 3
fi

STAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
TARGET_DIR="$WORKDIR_BASE/gh-clone-check-$STAMP"

mkdir -p "$TARGET_DIR"
trap 'rm -rf "$TARGET_DIR"' EXIT

if timeout "$TIMEOUT_SECONDS" gh repo clone "$REPO" "$TARGET_DIR/repo" -- --depth 1 >/dev/null 2>&1; then
  if [[ -d "$TARGET_DIR/repo/.git" ]]; then
    echo "status=ok repo=$REPO path=$TARGET_DIR/repo"
    exit 0
  fi
  echo "status=fail reason=missing_git_dir repo=$REPO"
  exit 4
fi

echo "status=fail reason=clone_timeout_or_error repo=$REPO timeout=${TIMEOUT_SECONDS}s"
exit 5
