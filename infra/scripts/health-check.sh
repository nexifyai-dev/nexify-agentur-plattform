#!/bin/bash
# NeXify AI — VPS Health-Check
# Run: bash infra/scripts/health-check.sh
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

FAILURES=0

check() {
  local name=$1 url=$2
  if curl -sf --max-time 5 "$url" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $name ($url)"
  else
    echo -e "${RED}✗${NC} $name ($url) — UNREACHABLE"
    FAILURES=$((FAILURES + 1))
  fi
}

check_internal() {
  local name=$1 port=$2 path=$3
  if curl -sf --max-time 3 "http://127.0.0.1:${port}${path}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $name (127.0.0.1:${port}${path})"
  else
    echo -e "${YELLOW}⚠${NC} $name (127.0.0.1:${port}${path}) — not ready"
    FAILURES=$((FAILURES + 1))
  fi
}

echo "=== NeXify VPS Health-Check ==="
echo ""

# Docker Compose Services
echo "--- Docker Compose Status ---"
if cd /opt/nexifyai-cloud 2>/dev/null; then
  RUNNING=$(docker compose ps --format '{{.Name}} {{.Status}}' 2>/dev/null)
  if [ -n "$RUNNING" ]; then
    echo "$RUNNING" | while read -r line; do
      if echo "$line" | grep -q "Up"; then
        echo -e "${GREEN}✓${NC} $line"
      else
        echo -e "${RED}✗${NC} $line"
      fi
    done
  else
    echo -e "${RED}✗${NC} No containers running"
    FAILURES=$((FAILURES + 1))
  fi
else
  echo -e "${YELLOW}⚠${NC} /opt/nexifyai-cloud not found — skipping compose status"
fi

echo ""
echo "--- Internal Endpoints ---"
check_internal "Website"    3000 "/api/health"
check_internal "Hermes"    8787 "/health"
check_internal "Paperclip" 3100 "/api/health"

echo ""
echo "--- External Endpoints (via Traefik) ---"
check "Website"     "https://nexifyai.cloud/api/health"
check "Hermes"      "https://webui.nexifyai.cloud/health"
check "Paperclip"   "https://app.nexifyai.cloud/api/health"

echo ""
echo "--- Traefik ---"
check "Traefik"     "http://127.0.0.1:8080/health" 2>/dev/null || \
  docker ps --filter name=traefik --format '{{.Names}} {{.Status}}' | grep -q "Up" && \
  echo -e "${GREEN}✓${NC} Traefik container running"

echo ""
if [ "$FAILURES" -eq 0 ]; then
  echo -e "${GREEN}All checks passed.${NC}"
  exit 0
else
  echo -e "${RED}$FAILURES check(s) failed.${NC}"
  exit 1
fi
