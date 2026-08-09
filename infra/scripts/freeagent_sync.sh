#!/bin/bash
# FreeAgent Vollintegration — Sync/Belege/Status (NeXifyAI, systemd-Timer alle 30min)
# NIR: 09.08.2026 18:09
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# Usage: freeagent_sync.sh {sync|belege|refresh|status}
ENV=/etc/nexifyai/hermes.env
LOG=/var/log/freeagent-sync.log
DROP=/opt/nexifyai/freeagent/belege
DONE=/opt/nexifyai/freeagent/belege/done
BASE=https://api.freeagent.com/v2
UA="User-Agent: NeXifyAI (mail@nexifyai.cloud)"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"; }

get_at() { grep -E '^FREEAGENT_ACCESS_TOKEN=' "$ENV" | head -1 | cut -d= -f2-; }

refresh_token() {
  local RT CID CS RESP NEWAT NEWRT
  RT=$(grep -E '^FREEAGENT_REFRESH_TOKEN=' "$ENV" | head -1 | cut -d= -f2-)
  CID=$(grep -E '^FREEAGENT_CLIENT_ID=' "$ENV" | head -1 | cut -d= -f2-)
  CS=$(grep -E '^FREEAGENT_CLIENT_SECRET=' "$ENV" | head -1 | cut -d= -f2-)
  RESP=$(curl -s --max-time 25 -u "$CID:$CS" -X POST https://api.freeagent.com/v2/token_endpoint \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=refresh_token&refresh_token=$RT")
  NEWAT=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null)
  if [ -z "$NEWAT" ]; then log "REFRESH FAIL: $(echo "$RESP" | head -c 120)"; return 1; fi
  sed -i "s|^FREEAGENT_ACCESS_TOKEN=.*|FREEAGENT_ACCESS_TOKEN=$NEWAT|" "$ENV" /root/.hermes/hermes.env
  NEWRT=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('refresh_token',''))" 2>/dev/null)
  [ -n "$NEWRT" ] && sed -i "s|^FREEAGENT_REFRESH_TOKEN=.*|FREEAGENT_REFRESH_TOKEN=$NEWRT|" "$ENV" /root/.hermes/hermes.env
  log "TOKEN REFRESHED"
  return 0
}

api() { # api METHOD PATH [body-file]
  local AT code
  AT=$(get_at)
  if [ "$1" = "GET" ]; then
    code=$(curl -s -o /tmp/fa-api-out.json -w '%{http_code}' --max-time 30 -H "Authorization: Bearer $AT" -H "$UA" -H "Accept: application/json" "$BASE$2")
  else
    code=$(curl -s -o /tmp/fa-api-out.json -w '%{http_code}' --max-time 30 -X "$1" -H "Authorization: Bearer $AT" -H "$UA" \
      -H "Accept: application/json" -H "Content-Type: application/json" --data @"${3:-/dev/null}" "$BASE$2")
  fi
  if [ "$code" = "401" ]; then
    refresh_token || return 1
    AT=$(get_at)
    if [ "$1" = "GET" ]; then
      code=$(curl -s -o /tmp/fa-api-out.json -w '%{http_code}' --max-time 30 -H "Authorization: Bearer $AT" -H "$UA" -H "Accept: application/json" "$BASE$2")
    else
      code=$(curl -s -o /tmp/fa-api-out.json -w '%{http_code}' --max-time 30 -X "$1" -H "Authorization: Bearer $AT" -H "$UA" \
        -H "Accept: application/json" -H "Content-Type: application/json" --data @"${3:-/dev/null}" "$BASE$2")
    fi
  fi
  echo "$code"
}

sync_bank() {
  api GET /categories || return 1
  python3 - <<'PYEOF' > /tmp/fa-cats.json
import json
try:
    d = json.load(open('/tmp/fa-api-out.json'))
    out = {}
    for k, v in d.items():
        if k.endswith('_categories') and isinstance(v, list):
            for c in v:
                out[c.get('nominal_code')] = c.get('description', '')
    print(json.dumps(out))
except Exception:
    print('{}')
PYEOF
  api GET /bank_accounts || return 1
  python3 - <<'PYEOF' > /tmp/fa-ba-list.txt
import json
try:
    d = json.load(open('/tmp/fa-api-out.json'))
    for b in d.get('bank_accounts', []):
        print(b['url'])
except Exception:
    pass
PYEOF
  while read -r BA; do
    [ -z "$BA" ] && continue
    api GET "/bank_transactions?bank_account=$BA" || continue
    python3 - <<'PYEOF'
import json, re, os
try:
    cats = json.load(open('/tmp/fa-cats.json'))
except Exception:
    cats = {}
if not cats:
    print("SKIP: keine Kategorien (FreeAgent-Setup unvollstaendig — MwSt-Registrierung fehlt)")
    raise SystemExit
RULES = [
    (r'(?i)hostinger|domain|hosting|vercel|cloudflare|digitalocean|hetzner|contabo|openrouter|deepseek|9router|nscale', ['Office Costs']),
    (r'(?i)revolut.*fee|bank.*fee|commission', ['Bank/Finance Charges']),
    (r'(?i)salary|loon|pascal', ['Wages and salaries', 'Wages', 'Salaries']),
    (r'(?i)invoice|payment received|ontvangen|betaling|sales|factuur', ['Sales']),
]

def find_cat(cats, needles):
    for code, desc in cats.items():
        if all(n.lower() in desc.lower() for n in needles):
            return code
    return None
try:
    d = json.load(open('/tmp/fa-api-out.json'))
except Exception:
    raise SystemExit
txs = [t for t in d.get('bank_transactions', []) if not t.get('explanation_url')]
print(f"unexplained: {len(txs)}")
for t in txs:
    desc = (t.get('full_description') or t.get('description') or '')
    if re.search(r'(?i)to eur|from eur|transfer|own account|eigen', desc):
        print("SKIP (interner Transfer):", t.get('id'), desc[:60]); continue
    cat_code = None
    for rx, needles in RULES:
        if re.search(rx, desc):
            cat_code = find_cat(cats, needles)
            if cat_code:
                break
    if not cat_code:
        cat_code = find_cat(cats, ['Office Costs']) or find_cat(cats, ['General expenses']) or next(iter(cats), None)
    if not cat_code:
        print("SKIP (keine Kategorie):", t.get('id')); continue
    cat = cat_code
    body = json.dumps({"bank_transaction_explanation": {
        "bank_transaction": t['url'],
        "explanation_type": "BankTransactionExplanation::ManualExplanation",
        "category": f"https://api.freeagent.com/v2/categories/{cat}",
        "dated_on": t.get('dated_on'),
        "description": "Automatisch klassifiziert (NeXify AI)",
    }})
    open('/tmp/fa-expl-body.json', 'w').write(body)
    import subprocess, os
    at = os.popen("grep -E '^FREEAGENT_ACCESS_TOKEN=' /etc/nexifyai/hermes.env | head -1 | cut -d= -f2-").read().strip()
    r = subprocess.run(["curl", "-s", "-o", "/tmp/fa-expl-resp.json", "-w", "%{http_code}",
        "--max-time", "30", "-X", "POST",
        "-H", "Authorization: Bearer " + at,
        "-H", "User-Agent: NeXifyAI (mail@nexifyai.cloud)",
        "-H", "Accept: application/json", "-H", "Content-Type: application/json",
        "--data", "@" + "/tmp/fa-expl-body.json",
        "https://api.freeagent.com/v2/bank_transaction_explanations"], capture_output=True, text=True)
    print("EXPLAIN:", t.get('id'), "->", cat, "| http", r.stdout.strip())
PYEOF
  done < /tmp/fa-ba-list.txt
}

upload_belege() {
  mkdir -p "$DROP" "$DONE"
  local AT f code
  AT=$(get_at)
  find "$DROP" -maxdepth 1 -type f \( -iname '*.pdf' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.eml' \) | while read -r f; do
    code=$(curl -s -o /tmp/fa-att.json -w '%{http_code}' --max-time 60 -X POST -H "Authorization: Bearer $AT" -H "$UA" \
      -H "Accept: application/json" \
      -F "attachment[content_type]=$(file -b --mime-type "$f")" -F "attachment[file]=@$f" \
      "$BASE/attachments")
    if [ "$code" = "201" ] || [ "$code" = "200" ]; then
      URL=$(python3 -c "import json; print(json.load(open('/tmp/fa-att.json')).get('attachment',{}).get('url',''))" 2>/dev/null)
      log "BELEG OK: $(basename "$f") -> $URL"
      mv "$f" "$DONE/"
    else
      log "BELEG FAIL ($code): $(basename "$f") — $(head -c 150 /tmp/fa-att.json)"
    fi
  done
  echo "belege done: $(ls "$DONE" | wc -l) total"
}

status() {
  local AT
  AT=$(get_at)
  echo "== company =="
  curl -s --max-time 20 -H "Authorization: Bearer $AT" -H "$UA" -H "Accept: application/json" "$BASE/company" | python3 -c "import json,sys; c=json.load(sys.stdin)['company']; print(c.get('name'), c.get('currency'))" 2>/dev/null || echo FAIL
  echo "== counts =="
  for r in contacts products invoices bills bank_accounts; do
    n=$(curl -s --max-time 20 -H "Authorization: Bearer $AT" -H "$UA" -H "Accept: application/json" "$BASE/$r" | python3 -c "import json,sys; d=json.load(sys.stdin); k=list(d.keys())[0] if d else ''; print(len(d.get(k, [])))" 2>/dev/null)
    echo "$r: $n"
  done
}

case "${1:-status}" in
  sync) log "SYNC START"; sync_bank; log "SYNC END";;
  belege) log "BELEGE START"; upload_belege; log "BELEGE END";;
  refresh) refresh_token && echo REFRESH_OK;;
  status) status;;
esac
