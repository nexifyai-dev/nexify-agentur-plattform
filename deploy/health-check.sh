#!/bin/sh
set -e
echo "=== Health ==="
for t in 3000 8787 3100; do
  curl -sf --max-time 3 http://127.0.0.1:$t/health >/dev/null 2>&1 && echo "OK :$t" || echo "FAIL :$t"
done
curl -sf --max-time 5 https://nexifyai.cloud/api/health >/dev/null 2>&1 && echo "OK external" || echo "FAIL external"
