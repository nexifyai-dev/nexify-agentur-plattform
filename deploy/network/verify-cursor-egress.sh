#!/usr/bin/env bash
# FILE: /deploy/network/verify-cursor-egress.sh
# WHAT: Smoke-test TCP/TLS reachability to Cursor required domains.
# WHY: Confirm firewall/SWG allowlist before blaming the IDE/agent.
set -euo pipefail

DOMAINS=(
  api2.cursor.sh
  api3.cursor.sh
  api4.cursor.sh
  authenticator.cursor.sh
  marketplace.cursorapi.com
  cursor-cdn.com
  downloads.cursor.com
)

ok=0
fail=0

echo "=== Cursor egress verify (TLS :443) ==="
for d in "${DOMAINS[@]}"; do
  if curl -sfI --connect-timeout 5 --max-time 10 "https://${d}" >/dev/null 2>&1 \
    || curl -skI --connect-timeout 5 --max-time 10 "https://${d}" >/dev/null 2>&1; then
    echo "OK   ${d}"
    ok=$((ok + 1))
  else
    # Some endpoints reject HEAD/anonymous; treat TCP+TLS handshake success as OK
    if timeout 5 bash -c "echo >/dev/tcp/${d}/443" 2>/dev/null; then
      echo "OK   ${d} (tcp/443)"
      ok=$((ok + 1))
    else
      echo "FAIL ${d}"
      fail=$((fail + 1))
    fi
  fi
done

echo "=== issuer check api2.cursor.sh (expect Amazon RSA unless SWG MITM) ==="
curl -v --connect-timeout 5 --max-time 10 "https://api2.cursor.sh" 2>&1 | grep -iE 'issuer:|subject:' | head -5 || true

echo "=== result: ${ok} ok, ${fail} fail ==="
exit "$([[ "$fail" -eq 0 ]] && echo 0 || echo 1)"
