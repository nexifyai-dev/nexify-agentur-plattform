#!/usr/bin/env bash
# FILE: .cursor/hooks/auto-push-agent-branch.sh
# NIR: 02.08.2026 08:35
# UPDATED: 02.08.2026 08:35
# WHAT: After agent stop / shell git commit — auto-push agent branch (no Diff-Tab).
# WHY: User-Mandat: alles automatisiert inkl. Push.
# BEST-PRACTICE: Nur cursor|feature|bugfix|fix Branches; nie main/develop; no force.
# PITFALL: V-PUSH-01: Skip without network/auth; never --force.
set -euo pipefail

input="$(cat || true)"

# Optional: only act when last shell looked like a commit (when invoked from afterShell)
if [[ -n "$input" ]]; then
  cmd="$(printf '%s' "$input" | python3 -c 'import json,sys
try:
 d=json.load(sys.stdin); print(d.get("command") or d.get("tool_input",{}).get("command") or "")
except Exception:
 print("")' 2>/dev/null || true)"
  # From stop hook there may be no command — still try push
  if [[ -n "$cmd" ]] && ! printf '%s' "$cmd" | grep -Eqi '(^|[[:space:]])git[[:space:]]+commit'; then
    # Not a commit shell — allow without push
    if [[ "${NEXIFY_AUTO_PUSH_ALWAYS:-0}" != "1" ]]; then
      printf '%s\n' '{"permission":"allow"}'
      exit 0
    fi
  fi
fi

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$ROOT" ]]; then
  printf '%s\n' '{"permission":"allow","agent_message":"auto-push skip: not a git repo"}'
  exit 0
fi
cd "$ROOT"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)"
case "$branch" in
  main|master|develop|HEAD)
    printf '%s\n' '{"permission":"allow","agent_message":"auto-push skip: protected branch"}'
    exit 0
    ;;
  cursor/*|feature/*|bugfix/*|fix/*) ;;
  *)
    printf '%s\n' '{"permission":"allow","agent_message":"auto-push skip: branch pattern"}'
    exit 0
    ;;
esac

# Detached / dirty index without commits ahead — still try push of existing commits
ahead="$(git rev-list --count @{u}..HEAD 2>/dev/null || git rev-list --count origin/main..HEAD 2>/dev/null || echo 1)"
if [[ "$ahead" == "0" ]]; then
  printf '%s\n' '{"permission":"allow","agent_message":"auto-push skip: nothing ahead"}'
  exit 0
fi

# Circuit breaker soft
curl -sS -m 2 -X POST http://127.0.0.1:8912/check \
  -H 'Content-Type: application/json' \
  -d "{\"actor\":\"cursor\",\"tool\":\"git_push\",\"params\":{\"branch\":\"$branch\"},\"cost\":0.01,\"state_hash\":\"autopush-$(date +%s)\"}" \
  >/dev/null 2>&1 || true

unset GITHUB_TOKEN || true
if git push -u origin "HEAD:refs/heads/$branch" 2>/tmp/nexify-autopush.err; then
  msg="auto-push ok: $branch (Draft-PR via agent-branch-autopilot workflow)"
  printf '%s\n' "{\"permission\":\"allow\",\"agent_message\":$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$msg")}"
else
  err="$(tr '\n' ' ' </tmp/nexify-autopush.err | head -c 200)"
  printf '%s\n' "{\"permission\":\"allow\",\"agent_message\":$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "auto-push soft-fail: $err")}"
fi
exit 0
