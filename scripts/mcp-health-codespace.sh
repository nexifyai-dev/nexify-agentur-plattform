#!/usr/bin/env bash
# FILE: /scripts/mcp-health-codespace.sh
# WHAT: Prueft MCP-relevante Endpunkte und Credentials im Codespace.
# WHY: Schnelle Diagnose, ob agentmemory/context7/gitlab-oss einsatzbereit sind.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_ENV_FILE="$ROOT_DIR/.env.mcp.codespace"

if [[ -f "$LOCAL_ENV_FILE" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$LOCAL_ENV_FILE"
  set +a
fi

PASS=0
WARN=0
FAIL=0

ok() {
  PASS=$((PASS + 1))
  echo "[ok] $*"
}

warn() {
  WARN=$((WARN + 1))
  echo "[warn] $*"
}

bad() {
  FAIL=$((FAIL + 1))
  echo "[fail] $*"
}

require_cmd() {
  if command -v "$1" >/dev/null 2>&1; then
    ok "Tool vorhanden: $1"
  else
    bad "Tool fehlt: $1"
  fi
}

echo "# MCP Health (Codespace)"
echo

require_cmd node
require_cmd npx
require_cmd curl

echo

CONTEXT7_URL="https://mcp.context7.com/mcp"
C7_CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "$CONTEXT7_URL" || true)
if [[ "$C7_CODE" == "200" || "$C7_CODE" == "405" || "$C7_CODE" == "400" ]]; then
  ok "context7 erreichbar ($C7_CODE)"
else
  warn "context7 unerwarteter Status ($C7_CODE)"
fi

AGENTMEMORY_URL="${AGENTMEMORY_URL:-http://127.0.0.1:3111}"
if [[ -n "${AGENTMEMORY_SECRET:-}" ]]; then
  AM_CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 -H "Authorization: Bearer ${AGENTMEMORY_SECRET}" "$AGENTMEMORY_URL/agentmemory/health" || true)
else
  AM_CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "$AGENTMEMORY_URL/agentmemory/health" || true)
fi
if [[ "$AM_CODE" == "200" ]]; then
  ok "agentmemory health erreichbar ($AM_CODE)"
elif [[ "$AM_CODE" == "401" ]]; then
  warn "agentmemory erreichbar, aber Secret fehlt/ungueltig ($AM_CODE)"
else
  warn "agentmemory nicht verifiziert ($AM_CODE)"
fi

GITLAB_API_URL="${GITLAB_API_URL:-https://gitlab.nexifyai.cloud/api/v4}"
GITLAB_BASE="${GITLAB_API_URL%/api/v4}"
GL_UI_CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "$GITLAB_BASE/users/sign_in" || true)
if [[ "$GL_UI_CODE" == "200" || "$GL_UI_CODE" == "302" ]]; then
  ok "gitlab-oss UI erreichbar ($GL_UI_CODE)"
else
  bad "gitlab-oss UI nicht erreichbar ($GL_UI_CODE)"
fi

TOKEN="${GITLAB_PERSONAL_ACCESS_TOKEN:-${GITLAB_TOKEN:-}}"
if [[ -z "$TOKEN" ]]; then
  warn "Kein GitLab PAT gesetzt (GITLAB_PERSONAL_ACCESS_TOKEN/GITLAB_TOKEN)"
else
  GL_USER_CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 -H "PRIVATE-TOKEN: $TOKEN" "$GITLAB_API_URL/user" || true)
  if [[ "$GL_USER_CODE" == "200" ]]; then
    ok "gitlab-oss API auth ok ($GL_USER_CODE)"
  else
    bad "gitlab-oss API auth fehlgeschlagen ($GL_USER_CODE)"
  fi
fi

echo
echo "PASS=$PASS WARN=$WARN FAIL=$FAIL"
if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
