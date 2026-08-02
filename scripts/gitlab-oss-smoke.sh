#!/usr/bin/env bash
# FILE: /scripts/gitlab-oss-smoke.sh
# WHAT: Smoke-Check GitLab OSS (API + optional PAT) für Agentic AI Mode.
# WHY: Built-in Cursor Gitlab-MCP = SaaS; OSS braucht gitlab.nexifyai.cloud + PAT.
# BEST-PRACTICE: Env-Namen only; Token nie echo'n.
# DOCS-REF: deploy/mcp/gitlab-oss/README.md
set -euo pipefail

# Timezone mandate — Europe/Berlin (docs/operations/TIMEZONE-EUROPE-BERLIN.md)
export TZ=Europe/Berlin

API_URL="${GITLAB_API_URL:-https://gitlab.nexifyai.cloud/api/v4}"
BASE="${API_URL%/api/v4}"
PROJECT_PATH="${GITLAB_PROJECT_PATH:-nexifyai_group/nexifyai}"
PASS=0
FAIL=0
WARN=0

if [[ -r /etc/nexifyai/gitlab-mcp.env ]]; then
  set -a
  # shellcheck source=/dev/null
  source /etc/nexifyai/gitlab-mcp.env
  set +a
  API_URL="${GITLAB_API_URL:-$API_URL}"
  BASE="${API_URL%/api/v4}"
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

ok()   { PASS=$((PASS+1)); echo "✅ $*"; }
bad()  { FAIL=$((FAIL+1)); echo "❌ $*"; }
warn() { WARN=$((WARN+1)); echo "⚠️  $*"; }

echo "# GitLab OSS Smoke"
echo "API_URL=$API_URL"
echo

# Public reachability
code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 8 "$BASE/users/sign_in" || echo 000)
if [[ "$code" == "200" || "$code" == "302" ]]; then
  ok "Public UI erreichbar ($BASE/users/sign_in → $code)"
else
  bad "Public UI nicht erreichbar ($code)"
fi

# Unauthenticated API (projects list often 200 empty)
code=$(curl -sS -o "$TMP_DIR/projects.json" -w "%{http_code}" --max-time 8 "$API_URL/projects?per_page=1" || echo 000)
if [[ "$code" == "200" ]]; then
  ok "GET /projects → $code (public API)"
else
  warn "GET /projects → $code"
fi

# Authenticated checks
if [[ -z "${GITLAB_PERSONAL_ACCESS_TOKEN:-${GITLAB_TOKEN:-}}" ]]; then
  warn "GITLAB_PERSONAL_ACCESS_TOKEN / GITLAB_TOKEN fehlt → Action blocked"
  warn "Fix: /etc/nexifyai/gitlab-mcp.env auf VPS oder lokale Env setzen"
else
  TOKEN="${GITLAB_PERSONAL_ACCESS_TOKEN:-$GITLAB_TOKEN}"
  code=$(curl -sS -o "$TMP_DIR/user.json" -w "%{http_code}" --max-time 8 \
    -H "PRIVATE-TOKEN: $TOKEN" "$API_URL/user" || echo 000)
  if [[ "$code" == "200" ]]; then
    user=$(python3 -c "import json;print(json.load(open('$TMP_DIR/user.json')).get('username','?'))" 2>/dev/null || echo '?')
    ok "GET /user → 200 (username=$user)"
  else
    bad "GET /user → $code (Token ungültig oder Scope fehlt)"
  fi

  enc=$(python3 -c "import urllib.parse;print(urllib.parse.quote('$PROJECT_PATH',safe=''))")
  code=$(curl -sS -o "$TMP_DIR/project.json" -w "%{http_code}" --max-time 8 \
    -H "PRIVATE-TOKEN: $TOKEN" "$API_URL/projects/$enc" || echo 000)
  if [[ "$code" == "200" ]]; then
    ok "Projekt gefunden: $PROJECT_PATH"
  else
    bad "Projekt nicht gefunden: $PROJECT_PATH ($code)"
  fi
fi

echo
echo "PASS=$PASS WARN=$WARN FAIL=$FAIL"
# FAIL only on hard errors; missing token = warn (Cloud-Agent expected)
exit "$([[ $FAIL -eq 0 ]] && echo 0 || echo 1)"
