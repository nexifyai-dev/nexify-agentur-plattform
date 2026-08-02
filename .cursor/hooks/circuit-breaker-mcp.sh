#!/usr/bin/env bash
# FILE: .cursor/hooks/circuit-breaker-mcp.sh
# NIR: 02.08.2026 08:30
# UPDATED: 02.08.2026 08:30
# WHAT: beforeMCPExecution — Circuit Breaker vor kostenrelevanten MCP-Calls.
# WHY: Cursor-Budget stoppt nicht automatisch; harte Grenze bei allow:false.
# DEPENDS: http://127.0.0.1:8912/check (soft-allow wenn unreachable)
set -euo pipefail

input="$(cat || true)"
tool="$(printf '%s' "$input" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("tool_name") or d.get("toolName") or d.get("command") or "mcp")' 2>/dev/null || echo mcp)"
server="$(printf '%s' "$input" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("server") or d.get("mcp_server") or "")' 2>/dev/null || true)"

# Cheap local tools: allow without breaker
case "$tool" in
  *memory_recall*|*memory_smart_search*|*lightrag_health*|*health*)
    printf '%s\n' '{"permission":"allow"}'
    exit 0
    ;;
esac

cost="0.05"
case "$tool" in
  *create_agent*|*Agent.prompt*|*cloud*) cost="0.5" ;;
  *memory_save*|*lightrag_insert*) cost="0.02" ;;
esac

hash="$(printf '%s' "$input" | sha256sum | awk '{print $1}' | cut -c1-24)"
payload="$(python3 -c 'import json,sys; print(json.dumps({"actor":"cursor","tool":sys.argv[1],"params":{"server":sys.argv[2]},"cost":float(sys.argv[3]),"state_hash":sys.argv[4]}))' "$tool" "$server" "$cost" "$hash")"

resp="$(curl -sS -m 2 -X POST http://127.0.0.1:8912/check \
  -H 'Content-Type: application/json' \
  -d "$payload" 2>/dev/null || echo '{"allow":true,"reason":"breaker_unreachable"}')"

allow="$(printf '%s' "$resp" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("allow", True))' 2>/dev/null || echo True)"
reason="$(printf '%s' "$resp" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("reason") or "")' 2>/dev/null || true)"

if [ "$allow" = "False" ] || [ "$allow" = "false" ]; then
  python3 -c 'import json,sys; print(json.dumps({"permission":"deny","user_message":"Circuit Breaker blockiert kostenrelevante Aktion.","agent_message":sys.argv[1]}))' "${reason:-denied}"
  exit 0
fi

printf '%s\n' '{"permission":"allow"}'
exit 0
