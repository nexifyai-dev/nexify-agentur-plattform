#!/bin/bash
# health-check.sh — System-Health-Check für VPS-Endpunkte
# Getriggert täglich 06:00 via Cron: 0 6 * * * /opt/nexify/scripts/health-check.sh
# Extern via: ssh root@VPS 'bash -s' < scripts/health-check.sh

set -euo pipefail

VPS_HOST="${VPS_HOST:-72.62.152.47}"
TIMEOUT=5
FAILS=0

check_url() {
    local label="$1"
    local url="$2"
    local expected="${3:-200}"
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" -m "${TIMEOUT}" "${url}" 2>/dev/null || echo "000")
    if [[ "$code" == "$expected" ]]; then
        echo "✅ ${label}: ${code}"
    else
        echo "❌ ${label}: ${code} (expected ${expected}) ← ${url}"
        FAILS=$((FAILS + 1))
    fi
}

check_tcp() {
    local label="$1"
    local host="$2"
    local port="$3"
    if timeout "${TIMEOUT}" bash -c "echo >/dev/tcp/${host}/${port}" 2>/dev/null; then
        echo "✅ ${label}: TCP/${port} open"
    else
        echo "❌ ${label}: TCP/${port} CLOSED"
        FAILS=$((FAILS + 1))
    fi
}

echo "=== NeXify Health Check $(date -Iseconds) ==="
echo ""

# Externe Endpunkte (Cloudflare Tunnel)
check_url "webui"        "https://webui.nexifyai.cloud"
check_url "ai-router"    "https://ai-router.nexifyai.cloud/health"
check_url "api"          "https://api.nexifyai.cloud"
check_url "dashboard"    "https://dashboard.nexifyai.cloud"
check_url "rag"          "https://rag.nexifyai.cloud"
check_url "open"         "https://open.nexifyai.cloud"

# Interne Endpunkte (nur VPS-lokal)
if hostname &>/dev/null && [[ "$(hostname)" == "srv1243952"* ]]; then
    echo ""
    echo "--- VPS-Interne Checks ---"
    check_tcp "hermes-api"     "127.0.0.1" 8642
    check_tcp "9router"        "127.0.0.1" 20128
    check_tcp "agentmemory"    "127.0.0.1" 3113
    check_tcp "qdrant"         "127.0.0.1" 6333
    check_tcp "redis"          "127.0.0.1" 6379
    check_tcp "webhook-gw"     "127.0.0.1" 8644
    check_tcp "workflow"       "127.0.0.1" 13062

    # Docker Container Status
    echo ""
    echo "--- Docker Container ---"
    docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo "⚠️ Docker nicht erreichbar"
fi

echo ""
echo "=== Health Check: ${FAILS} Fehler ==="
exit "${FAILS}"
