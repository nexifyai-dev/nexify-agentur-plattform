#!/bin/sh
# FILE: /deploy/health-check.sh
# WHAT: Smoke health for local services + 9router + public site.
set -e
echo "=== Health ==="
for t in 3000 8787 3100; do
  curl -sf --max-time 3 "http://127.0.0.1:$t/health" >/dev/null 2>&1 && echo "OK :$t" || echo "FAIL :$t"
done

# 9router (VPS-local OpenAI-compat router)
if curl -sf --max-time 3 http://127.0.0.1:20128/api/health >/dev/null 2>&1; then
  echo "OK :20128 9router"
else
  echo "FAIL :20128 9router"
fi

# Public Cloudflare edge (optional)
curl -sf --max-time 5 https://ai-router.nexifyai.cloud/api/health >/dev/null 2>&1 \
  && echo "OK ai-router.nexifyai.cloud" || echo "FAIL ai-router.nexifyai.cloud"

curl -sf --max-time 5 https://nexifyai.cloud/api/health >/dev/null 2>&1 && echo "OK external" || echo "FAIL external"
