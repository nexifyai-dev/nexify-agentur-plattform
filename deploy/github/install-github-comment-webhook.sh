#!/usr/bin/env bash
# NeXifyAI: Register GitHub repo webhook → Hermes Gateway /webhooks/github-comment
# NIR: 03.08.2026
# NAME: NeXifyAI Autopilot
# TEAM: NeXifyAI Core
# WHAT: Alle GitHub-Meldungen (Actions, Issues, PRs, Kommentare, alles) als Webhook an den Hermes-Gateway leiten
# WHY: Vorgabe v2.0 — alle Rückmeldungen laufen auf http://127.0.0.1:8644/webhooks/github-comment auf
# DEPENDS: GITHUB_TOKEN (fine-grained, admin:repo_hook oder repo), Tunnel webui.nexifyai.cloud → localhost:8644
# USAGE: ./deploy/github/install-github-comment-webhook.sh [owner/repo] [public-base-url]
set -euo pipefail

REPO="${1:-nexifyai-dev/nexify-agentur-plattform}"
BASE_URL="${2:-https://webui.nexifyai.cloud}"
WEBHOOK_URL="${BASE_URL}/webhooks/github-comment"

# Token aus Env oder ~/.hermes/.env oder /etc/nexifyai/secrets.env
TOKEN="${GITHUB_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  for fp in ~/.hermes/.env /etc/nexifyai/secrets.env; do
    if [ -f "$fp" ] && grep -q "^GITHUB_TOKEN=" "$fp"; then
      TOKEN=$(grep "^GITHUB_TOKEN=" "$fp" | head -1 | cut -d= -f2- | tr -d '\n\r')
      break
    fi
  done
fi
if [ -z "$TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN fehlt (Env, ~/.hermes/.env, /etc/nexifyai/secrets.env)" >&2
  exit 1
fi

API="https://api.github.com/repos/$REPO/hooks"

# Idempotent: existierenden Hook mit gleicher URL finden
EXISTING="$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" "$API" \
  | python3 -c "import sys,json; hs=json.load(sys.stdin); print(next((h['id'] for h in hs if h.get('config',{}).get('url')=='$WEBHOOK_URL'), ''))" 2>/dev/null || true)"

if [ -n "$EXISTING" ]; then
  echo "exists: hook=$EXISTING url=$WEBHOOK_URL"
  exit 0
fi

# Alle Events aktivieren: push, pull_request, issues, issue_comment, workflow_run, check_run, status, u.v.m.
curl -s -X POST "$API" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d "{\"name\":\"web\",\"active\":true,\"events\":[\"*\"],\"config\":{\"url\":\"$WEBHOOK_URL\",\"content_type\":\"json\",\"insecure_ssl\":\"0\"}}" \
  | python3 -c "import sys,json; r=json.load(sys.stdin); print('created: hook='+str(r.get('id','?'))+' url='+r.get('config',{}).get('url','?')) if 'id' in r else print('ERROR: '+json.dumps(r))"
