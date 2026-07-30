#!/bin/bash
# FILE: /opt/nexifyai/scripts/autopilot/check-hermes-dash.sh
# NIR: 2026-07-28 10:40
# WHAT: Health-Check Hermes Dashboard Stack (Proxy + Dashboard + CF-Tunnel)
# WHY: Fruehwarnung bei Ausfall; Autopilot-Integration
set -e

PROXY=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:9119/health 2>/dev/null || echo "000")
DASH=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:9118/ 2>/dev/null || echo "000")
CF=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://hermes-dash.nexifyai.cloud/ 2>/dev/null || echo "000")

OK=true
[ "$PROXY" != "200" ] && OK=false
[ "$DASH" != "200" ] && OK=false
[ "$CF" != "200" ] && OK=false

if $OK; then
    echo "OK proxy=$PROXY dash=$DASH cf=$CF"
    exit 0
else
    echo "FAIL proxy=$PROXY dash=$DASH cf=$CF" >&2
    # Auto-Recovery: Proxy restart falls nur Proxy kaputt
    if [ "$PROXY" != "200" ] && [ "$DASH" = "200" ]; then
        systemctl restart hermes-dash-proxy 2>/dev/null || true
        echo "AUTO-RECOVER: proxy restarted"
    fi
    exit 1
fi
