#!/usr/bin/env bash
# FILE: scripts/lightrag-sot-seed.sh
# NIR: 02.08.2026 09:05
# UPDATED: 02.08.2026 09:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Seed LightRAG with ops SoT pointers (HUMAN-GATE, status, activation).
# WHY: Semantic search must find automation/human-gate docs without inventing content.
# BEST-PRACTICE: Prefer local :9622 insert; soft-fail if offline; no secrets in payload.
# PITFALL: Do not POST Bearer secrets; Circuit Breaker may rate-limit inserts.
# DEPENDS: LIGHTRAG_URL (default http://127.0.0.1:9622); curl/python3
# DOCS-REF: docs/operations/ACTIVATION-OVERLOOKED.md
# SESSION: full-auto-config-close-7dd5

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LIGHTRAG_URL="${LIGHTRAG_URL:-http://127.0.0.1:9621}"
# Origin UI/health often on :9622; document insert bridge is :9621 (see sync-to-lightrag.py)
DOC_IDS=(
  "docs/operations/HUMAN-GATE-5MIN.md"
  "docs/operations/GITHUB-ACTIONS-SECRET-REGISTRY.md"
  "docs/operations/STATUS-DASHBOARD.md"
  "docs/operations/ACTIVATION-OVERLOOKED.md"
  "docs/operations/CLOUD-AGENT-EVENT-INGEST.md"
  "docs/operations/VERCEL-ENV.md"
)

if ! curl -sf --max-time 3 "$LIGHTRAG_URL/documents/pipeline_status" >/dev/null 2>&1 \
  && ! curl -sf --max-time 3 "${LIGHTRAG_ORIGIN:-http://127.0.0.1:9622}/health" >/dev/null 2>&1; then
  echo "lightrag_unreachable=$LIGHTRAG_URL"
  exit 0
fi

for rel in "${DOC_IDS[@]}"; do
  path="$ROOT/$rel"
  [[ -f "$path" ]] || continue
  python3 - "$LIGHTRAG_URL" "$path" "$rel" <<'PY' || true
import json, pathlib, sys, urllib.request
base, path, rel = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3]
text = path.read_text(encoding="utf-8", errors="replace")[:12000]
payload = json.dumps({"text": f"SoT file {rel}\n\n{text}", "file_source": rel}).encode()
endpoint = "/documents/text"
headers = {"Content-Type": "application/json"}
import os
key = os.environ.get("LIGHTRAG_API_KEY") or os.environ.get("LIGHTRAG_KEY") or ""
if key:
    headers["X-API-Key"] = key
    headers["Authorization"] = f"Bearer {key}"
try:
    req = urllib.request.Request(
        base.rstrip("/") + endpoint,
        data=payload,
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        print(f"seeded={rel} via={endpoint} status={resp.status}")
except Exception as e:
    print(f"seed_skip={rel} err={e}")
PY
done

echo "lightrag_sot_seed_done=1"
