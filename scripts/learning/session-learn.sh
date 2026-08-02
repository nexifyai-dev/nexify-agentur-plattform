#!/usr/bin/env bash
# FILE: scripts/learning/session-learn.sh
# NIR: 02.08.2026 10:00
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Session-End learning hook — AgentMemory lesson+workflow + optional LightRAG index.
# WHY: Continuous learning must run even when the agent forgets explicit memory_save.
# BEST-PRACTICE: Fail-soft (exit 0); never echo secrets; TZ Europe/Berlin; DE payloads.
# PITFALL: V-LEARN-01: Blocking agent on AM/LightRAG outage — always soft-fail.
# DEPENDS: AGENTMEMORY_URL/SECRET optional; LIGHTRAG_URL + LIGHTRAG_API_KEY optional
# DOCS-REF: docs/operations/CONTINUOUS-LEARNING.md
# SESSION: continuous-learning-7dd5

set -u

emit_allow() {
  local msg="${1:-session-learn ok}"
  printf '%s\n' "{\"permission\":\"allow\",\"agent_message\":$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$msg")}"
}

HOOK_INPUT="$(cat || true)"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" 2>/dev/null || true

export TZ="${TZ:-Europe/Berlin}"
NOW="$(date '+%Y-%m-%d %H:%M:%S %Z')"
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
HASH="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
REPO_SLUG="nexify-agentur-plattform"

SUMMARY="$(
  printf '%s' "$HOOK_INPUT" | python3 -c '
import json,sys
raw=sys.stdin.read().strip()
if not raw:
  print("")
  raise SystemExit
try:
  d=json.loads(raw)
except Exception:
  print(raw[:400])
  raise SystemExit
parts=[]
for k in ("status","reason","message","summary","last_message","completion"):
  v=d.get(k)
  if isinstance(v,str) and v.strip():
    parts.append(v.strip()[:300])
st=d.get("status") or d.get("loop_count") or ""
if st and not isinstance(st, str):
  parts.append(f"status={st}")
elif isinstance(st, str) and st:
  parts.append(f"status={st}")
print(" | ".join(parts)[:500])
' 2>/dev/null || true
)"

if [[ -z "${SUMMARY}" ]]; then
  LAST_MSG="$(git log -1 --pretty=%s 2>/dev/null || true)"
  SUMMARY="Session-Ende auf ${BRANCH}@${HASH}. Letzter Commit: ${LAST_MSG:-keiner}"
fi

SUMMARY="$(
  printf '%s' "$SUMMARY" | python3 -c '
import re,sys
t=sys.stdin.read()
patterns=[
  r"(?i)((?:api[_-]?key|token|secret|password|bearer|authorization)\s*[:=]\s*)\S+",
  r"(?i)ghp_[A-Za-z0-9]+",
  r"(?i)glpat-[A-Za-z0-9_-]+",
  r"(?i)sk-[A-Za-z0-9]+",
]
for p in patterns:
  t=re.sub(p, lambda m: (m.group(1)+"[REDACTED]") if m.lastindex else "[REDACTED]", t)
print(t[:2000])
'
)"

AM_BASE="${AGENTMEMORY_URL:-http://127.0.0.1:3111}"
AM_BASE="${AM_BASE%/}"
case "$AM_BASE" in
  */agentmemory) ;;
  *) AM_BASE="${AM_BASE}/agentmemory" ;;
esac

export NEXIFY_LEARN_SUMMARY="$SUMMARY"
export NEXIFY_LEARN_BRANCH="$BRANCH"
export NEXIFY_LEARN_HASH="$HASH"
export NEXIFY_LEARN_NOW="$NOW"
export NEXIFY_LEARN_AM_BASE="$AM_BASE"
export NEXIFY_LEARN_LR_URL="${LIGHTRAG_URL:-}"
export NEXIFY_LEARN_REPO="$REPO_SLUG"

AM_OK=0
LR_OK=0

AM_RESULT="$(python3 - <<'PY' 2>/dev/null || true
import json, os, urllib.request

secret = (os.environ.get("AGENTMEMORY_SECRET") or os.environ.get("AGENTMEMORY_TOKEN") or "").strip()
base = os.environ["NEXIFY_LEARN_AM_BASE"].rstrip("/")
summary = os.environ.get("NEXIFY_LEARN_SUMMARY", "")
branch = os.environ.get("NEXIFY_LEARN_BRANCH", "")
h = os.environ.get("NEXIFY_LEARN_HASH", "")
now = os.environ.get("NEXIFY_LEARN_NOW", "")
repo = os.environ.get("NEXIFY_LEARN_REPO", "nexify-agentur-plattform")

headers = {"Content-Type": "application/json"}
if secret:
    headers["Authorization"] = f"Bearer {secret}"

results = []

def post(path, body):
    req = urllib.request.Request(
        f"{base}{path}",
        data=json.dumps(body).encode(),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            return resp.status, True
    except Exception as exc:  # noqa: BLE001
        return getattr(exc, "code", 0), False

lesson = {
    "content": (
        f"Session-Lernen ({now}): Branch {branch}@{h}. "
        f"{summary}. Protokoll: Recall→Act→Verify→Learn→Index. Keine Secrets speichern."
    ),
    "confidence": 0.55,
    "context": f"cursor-session|{repo}|Europe/Berlin|DE",
    "tags": ["continuous-learning", "session-end", "cursor-agent", "de"],
}
code, ok = post("/lessons", lesson)
results.append(("lessons", code, ok))

remember = {
    "content": f"[continuous-learning] Session-Ende {now} {branch}@{h}: {summary}",
    "type": "workflow",
    "project": repo,
    "concepts": ["continuous-learning", "session-end", "cursor", "Europe/Berlin"],
}
code, ok = post("/remember", remember)
results.append(("remember", code, ok))

print(json.dumps({"ok": any(r[2] for r in results), "results": results}))
PY
)"

if echo "$AM_RESULT" | grep -q '"ok": true'; then
  AM_OK=1
fi

if [[ -n "${LIGHTRAG_URL:-}" ]]; then
  LR_RESULT="$(python3 - <<'PY' 2>/dev/null || true
import json, os, urllib.request

url = os.environ.get("NEXIFY_LEARN_LR_URL", "").rstrip("/")
key = (os.environ.get("LIGHTRAG_API_KEY") or "").strip()
if not url:
    print(json.dumps({"ok": False, "reason": "no_url"}))
    raise SystemExit
summary = os.environ.get("NEXIFY_LEARN_SUMMARY", "")
branch = os.environ.get("NEXIFY_LEARN_BRANCH", "")
h = os.environ.get("NEXIFY_LEARN_HASH", "")
now = os.environ.get("NEXIFY_LEARN_NOW", "")
text = (
    f"# Continuous Learning Session\n"
    f"Zeit: {now} (Europe/Berlin)\n"
    f"Branch: {branch}@{h}\n"
    f"Zusammenfassung: {summary}\n"
    f"Quelle: scripts/learning/session-learn.sh\n"
)
headers = {"Content-Type": "application/json"}
if key:
    headers["X-API-Key"] = key
body = {
    "text": text,
    "file_source": f"continuous-learning/session/{branch}/{h}",
}
req = urllib.request.Request(
    f"{url}/documents/text",
    data=json.dumps(body).encode(),
    headers=headers,
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=12) as resp:
        print(json.dumps({"ok": resp.status in (200, 201, 202), "status": resp.status}))
except Exception as exc:  # noqa: BLE001
    print(json.dumps({"ok": False, "err": type(exc).__name__}))
PY
)"
  if echo "$LR_RESULT" | grep -q '"ok": true'; then
    LR_OK=1
  fi
fi

emit_allow "session-learn am=${AM_OK} lightrag=${LR_OK} branch=${BRANCH}"
exit 0
