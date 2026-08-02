#!/usr/bin/env bash
# FILE: apps/website/scripts/e2e-webserver.sh
# NIR: 02.08.2026 09:25
# UPDATED: 02.08.2026 09:25
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Quality
# WHAT: Start Next standalone server for Playwright (output:standalone incompatible with next start).
# WHY: CI e2e must boot reliably after pnpm build.
# PITFALL: Do not use $HOSTNAME (system hostname) — bind 127.0.0.1 for Playwright.
# DEPENDS: pnpm build → .next/standalone/apps/website/server.js
# DOCS-REF: docs/operations/QUALITY-GATES.md
# SESSION: quality-gates-absolute-7dd5
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${E2E_PORT:-3137}"
HOST="${E2E_BIND_HOST:-127.0.0.1}"
STANDALONE="$ROOT/.next/standalone/apps/website"
if [[ ! -f "$STANDALONE/server.js" ]]; then
  echo "missing standalone build at $STANDALONE/server.js — run pnpm build first" >&2
  exit 1
fi
mkdir -p "$STANDALONE/.next"
rm -rf "$STANDALONE/.next/static"
cp -a "$ROOT/.next/static" "$STANDALONE/.next/static"
if [[ -d "$ROOT/public" ]]; then
  rm -rf "$STANDALONE/public"
  cp -a "$ROOT/public" "$STANDALONE/public"
fi
export PORT HOSTNAME="$HOST"
exec node "$STANDALONE/server.js"
