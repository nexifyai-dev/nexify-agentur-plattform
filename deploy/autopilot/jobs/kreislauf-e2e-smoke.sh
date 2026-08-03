#!/bin/bash
# E2E Smoke Test — Sense→Decide→Act→Verify→Learn
# NIR: 29.07.2026 11:30
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: E2E-Smoke über alle Brain-Dienste (Health-Probes) plus realer LightRAG→AgentMemory-Sync-Beweis (Marker-Doc, track_status, smart-search), nicht nur HTTP-200-Checks
# WHY: Regressionsschutz der Kern-Kreisläufe; Sync-Beweis statt Blindvertrauen auf Health-Endpoints; erkennt Auth-/Key-Regressionen (X-API-Key) früh
# DEPENDS: AgentMemory (127.0.0.1:3111), Hermes Gateway (8644), Hermes Dashboard (9119), LightRAG (9622), OTel (4317/4318), 9Router (20128), Docker; LIGHTRAG_API_KEY aus /etc/nexifyai/hermes.env

PASS=0
FAIL=0

probe() {
  local name="$1"
  local url="$2"
  local expect="${3:-200}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 6 "$url" 2>/dev/null || echo 000)
  if [ "$code" = "$expect" ]; then
    echo "OK   ${name} (${code})"
    PASS=$((PASS + 1))
  else
    echo "FAIL ${name} (got ${code} want ${expect})"
    FAIL=$((FAIL + 1))
  fi
}

probe_tcp() {
  local name="$1"
  local host="$2"
  local port="$3"
  local ok
  ok="$(python3 - "$host" "$port" <<'PY'
import socket, sys
host=sys.argv[1]
port=int(sys.argv[2])
s=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(2.0)
try:
  s.connect((host, port))
  print("true")
except Exception:
  print("false")
finally:
  s.close()
PY
)"
  if [ "$ok" = "true" ]; then
    echo "OK   ${name} (tcp ${host}:${port})"
    PASS=$((PASS + 1))
  else
    echo "FAIL ${name} (tcp ${host}:${port})"
    FAIL=$((FAIL + 1))
  fi
}

secret_available() {
  python3 - <<'PY'
from pathlib import Path
paths = ["/opt/nexifyai/.agentmemory-mcp.env", "/root/.agentmemory/.env", "/etc/nexifyai/secrets.env"]
secret = None
for fp in paths:
  p = Path(fp)
  if not p.exists():
    continue
  try:
    lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
  except PermissionError:
    continue  # existiert, aber nicht lesbar → nächster Pfad
  for line in lines:
    line=line.strip()
    if not line or line.startswith("#") or "=" not in line:
      continue
    k,v=line.split("=",1)
    k=k.strip()
    v=v.strip().strip('"').strip("'")
    if k in ("AGENTMEMORY_SECRET","AGENTMEMORY_BEARER_TOKEN","AGENTMEMORY_TOKEN") and v:
      secret=v
      break
  if secret:
    break
print("true" if secret else "false")
PY
}

# Sense: Health endpoints
probe am_health http://127.0.0.1:3111/agentmemory/livez 200
probe hermes_gateway_health http://127.0.0.1:8644/health 200
probe hermes_dashboard_probe http://127.0.0.1:9119/api/status 200
probe lightrag_health http://127.0.0.1:9622/health 200
probe_tcp otel_otlp_http 127.0.0.1 4318
probe_tcp otel_otlp_grpc 127.0.0.1 4317

# Act: 9Router models (HTTP contract)
if curl -s --max-time 6 http://127.0.0.1:20128/v1/models >/dev/null 2>&1; then
  PASS=$((PASS + 1))
else
  FAIL=$((FAIL + 1))
fi

# Verify: Docker
DEAD=$(docker ps --filter status=exited -q 2>/dev/null | wc -l)
if [ "$DEAD" -eq 0 ]; then
  PASS=$((PASS + 1))
else
  FAIL=$((FAIL + 1))
fi

# Verify: LightRAG → AgentMemory reverse sync (real payload, not only HTTP 200)
SYNC_PREFIX="e2e-l2am-$(date +%Y%m%d%H%M%S)"
SYNC_TEXT="e2e Lightrag->AgentMemory sync test ${SYNC_PREFIX}"
echo "INFO sync_prefix=${SYNC_PREFIX}"
VERIFY_NEEDLE="${SYNC_PREFIX:0:15}"

if [ "$(secret_available)" != "true" ]; then
  echo "FAIL agentmemory_secret missing — cannot verify sync"
  FAIL=$((FAIL + 1))
else
  # 1) Insert a marker document into LightRAG (returns track_id).
  # 2026-07-31 bestpraxis-patch: token aus hermes.env, parse stdout sauber via temp-var.
  LIGHTRAG_API_KEY="$(awk -F= '/^LIGHTRAG_API_KEY=/{print $2}' /etc/nexifyai/hermes.env | head -1)"
  INSERT_RESP="$(curl -s -m 15 \
    -H "Content-Type: application/json" \
    -H "X-API-Key: ${LIGHTRAG_API_KEY}" \
    -X POST http://127.0.0.1:9622/documents/text \
    --data "{\"text\":\"${SYNC_TEXT}\",\"file_source\":\"${SYNC_PREFIX}\"}")"
  TRACK_ID="$(printf '%s' "$INSERT_RESP" | python3 -c 'import json,sys;d=json.load(sys.stdin);print(d.get("track_id",""))' 2>/dev/null)"

  if [ -z "$TRACK_ID" ]; then
    echo "FAIL lightrag_insert track_id missing"
    FAIL=$((FAIL + 1))
  else
    # 2) Wait for PROCESSED status (bounded).
    SEEN=""
    for i in $(seq 1 40); do
      SEEN="$(curl -s -m 10 -H "X-API-Key: ${LIGHTRAG_API_KEY}" "http://127.0.0.1:9622/documents/track_status/${TRACK_ID}" \
        | python3 -c 'import json,sys; d=json.load(sys.stdin); docs=d.get("documents") or []; print((docs[0] if docs else {}).get("status",""))' 2>/dev/null || true)"
      SEEN_UP="${SEEN^^}"
      if [ "$SEEN_UP" = "PROCESSED" ]; then
        break
      fi
      sleep 1
    done

    SEEN_UP="${SEEN^^}"
    if [ "$SEEN_UP" != "PROCESSED" ]; then
      echo "FAIL lightrag_track not PROCESSED (status=${SEEN})"
      FAIL=$((FAIL + 1))
    else
      # 3) Sync into AgentMemory (idempotent; prefix filter keeps it small).
      SYNC_FILE_PATH="$(curl -s -m 10 -H "X-API-Key: ${LIGHTRAG_API_KEY}" "http://127.0.0.1:9622/documents/track_status/${TRACK_ID}" \
        | python3 -c 'import json,sys; d=json.load(sys.stdin); docs=d.get("documents") or []; print((docs[0] if docs else {}).get("file_path",""))' 2>/dev/null)"

      # Prefer exact LightRAG file_path when present (avoids /documents/ prefix mismatch).
      SYNC_PREFIX_ARG="${SYNC_PREFIX}"
      if [ -n "${SYNC_FILE_PATH}" ]; then
        SYNC_PREFIX_ARG="${SYNC_FILE_PATH}"
      fi
      SYNC_OUT="$(python3 /opt/nexifyai/scripts/sync-lightrag-to-agentmemory.py --prefix "$SYNC_PREFIX_ARG" --max-docs 3 2>&1)"
      SYNC_RC=$?
      SYNCED_COUNT="$(echo "$SYNC_OUT" | python3 -c 'import sys,re; s=sys.stdin.read(); m=re.search(r"synced=(\d+)",s); print(m.group(1) if m else "0")')"

      echo "INFO sync_file_path=${SYNC_FILE_PATH}"
      echo "INFO sync_result: ${SYNC_OUT}"

      if [ "$SYNC_RC" -ne 0 ]; then
        echo "FAIL lightrag->agentmemory sync script rc=$SYNC_RC"
        FAIL=$((FAIL + 1))
      elif [ "$SYNCED_COUNT" -le 0 ]; then
        echo "FAIL lightrag->agentmemory synced=0"
        FAIL=$((FAIL + 1))
      else
        PASS=$((PASS + 1))
      fi

      # 4) Verify AgentMemory now contains our marker (smart-search).
      if [ "$SYNCED_COUNT" -gt 0 ]; then
        QUERY="${VERIFY_NEEDLE}"
        sleep 3  # brief indexing delay
        FOUND="$(NX_SMART_QUERY="${QUERY}" python3 - <<'PY'
import json, os, pathlib, urllib.request
needle = os.environ.get("NX_SMART_QUERY", "")
secret = None
for fp in ["/opt/nexifyai/.agentmemory-mcp.env","/root/.agentmemory/.env","/etc/nexifyai/secrets.env"]:
    p = pathlib.Path(fp)
    if not p.exists():
        continue
    try:
        lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
    except PermissionError:
        continue
    for line in lines:
        line=line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k,v=line.split("=",1)
        k=k.strip()
        v=v.strip().strip('"').strip("'")
        if k in ("AGENTMEMORY_SECRET","AGENTMEMORY_BEARER_TOKEN","AGENTMEMORY_TOKEN") and v:
            secret=v
            break
    if secret:
        break
if not secret or not needle:
    print("false")
    raise SystemExit(0)

url='http://127.0.0.1:3111/agentmemory/smart-search'
req = urllib.request.Request(
    url,
    data=json.dumps({"query": needle, "limit": 50, "format":"full"}).encode(),
    headers={"Content-Type":"application/json","Authorization":"Bearer "+secret},
    method="POST"
)
try:
    with urllib.request.urlopen(req, timeout=15) as r:
        resp=json.loads(r.read().decode("utf-8", errors="replace"))
except Exception:
    print("false")
    raise SystemExit(0)

def contains(x):
    if isinstance(x,str):
        return needle in x
    if isinstance(x,dict):
        return any(contains(v) for v in x.values())
    if isinstance(x,list):
        return any(contains(v) for v in x)
    return False

print("true" if contains(resp) else "false")
PY
)"

        if [ "$FOUND" = "true" ]; then
          echo "OK   agentmemory smart-search contains marker"
          PASS=$((PASS + 1))
        else
          echo "FAIL agentmemory smart-search does not contain marker"
          FAIL=$((FAIL + 1))
        fi
      fi
    fi
  fi
fi

echo "e2e-smoke: pass=$PASS fail=$FAIL"
exit $FAIL
