#!/usr/bin/env bash
# FILE: scripts/lightrag-sot-seed.sh
# NIR: 02.08.2026 09:00
# UPDATED: 02.08.2026 09:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Seed LightRAG with ops SoT files + Kern-SoT-Texte (Design, Charta, Hermes, AM).
# WHY: Semantic search must find automation/human-gate docs and marked Brain sources.
# BEST-PRACTICE: Prefer local insert; soft-fail if offline; no secrets in payload.
# PITFALL: Do not POST Bearer secrets; Circuit Breaker may rate-limit inserts.
# DEPENDS: LIGHTRAG_URL (default bridge :9621); LIGHTRAG_API_KEY optional for auth
# DOCS-REF: docs/operations/BRAIN-DUAL-WRITE.md, docs/operations/ACTIVATION-OVERLOOKED.md
# SESSION: issues-triage-followup-merge

set -euo pipefail

# Timezone mandate — Europe/Berlin (docs/operations/TIMEZONE-EUROPE-BERLIN.md)
export TZ=Europe/Berlin

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

# Kern-SoT inline texts (Brain/Docs-Alignment #125) — skip if no API key
if [[ -n "${LIGHTRAG_API_KEY:-}" ]]; then
  insert() {
    local source="$1"
    local text="$2"
    python3 - "$LIGHTRAG_URL" "$source" "$text" <<'PY' || true
import json, os, sys, urllib.request
base, source, text = sys.argv[1], sys.argv[2], sys.argv[3]
key = os.environ["LIGHTRAG_API_KEY"]
body = json.dumps({"text": text, "file_source": source}).encode()
req = urllib.request.Request(
    f"{base.rstrip('/')}/documents/text",
    data=body,
    headers={"X-API-Key": key, "Content-Type": "application/json"},
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(source, resp.status, resp.read()[:160].decode())
except Exception as e:
    print(f"seed_skip={source} err={e}")
PY
  }

  insert "sot/design_guidelines.json" "$(cat <<'EOT'
SOURCE: /opt/nexifyai/repos/nexify-agentur-plattform/design_guidelines.json
NeXify AI Design-SoT (verbindlich, nicht Graphite Premium):
Theme Dark / Archetype Luxury. Brand NeXify AI.
Typografie: Headings Outfit (300/500/700), Body Manrope.
Farben: background #0A0A0A, surface rgba(255,255,255,0.03), border rgba(255,255,255,0.1),
accent #E0E0E0 / #9E9E9E, text #FFFFFF / #A1A1AA.
Layout: Bento Grid, Glass-Cards (backdrop-blur), Pill-Buttons (rounded-full gradient),
DE/NL Language Switcher. data-testid überall. Brand: chat it. Automate it.
EOT
)"

  insert "sot/docs/governance/CHARTA.md" "$(cat <<'EOT'
SOURCE: docs/governance/CHARTA.md (Auszug, nicht Primärquelle — Primär = docs/governance/)
Rangfolge: docs/governance/ > CHARTA > .cursor/rules.
§7 Wissensschicht: AgentMemory + LightRAG zentral.
§8 Autonomie vs Production-Freigabe = offener Widerspruch F32 — eskalieren.
§10 Modellstrategie: Upstage + DeepSeek / 9Router, gestaffelt.
§12 Circuit Breaker Pflicht vor kostenrelevanten Aktionen.
Cutover/Live-Hermes erst nach expliziter Endabnahme.
EOT
)"

  insert "sot/decisions/hermes-bleiben-141" "$(cat <<'EOT'
SOURCE: GitHub Issue #141 — [decision] Hermes WebUI bleiben — Native-Panels Härten
Entscheidung: Hermes Agent WebUI bleibt die visuelle/technische Basis der Workstation.
Kein Cutover auf Konkurrenz-Dashboard. Native Integration (kein Iframe) für 9Router,
AgentMemory (11 Views), LightRAG. Isolierte Entwicklung parallel; Cutover erst nach Endabnahme.
Product name: NeXify AI Workstation auf Hermes-Basis.
EOT
)"

  insert "sot/agentmemory-pflicht-onepager" "$(cat <<'EOT'
SOURCE: /opt/nexifyai/docs/architecture/AGENTMEMORY-PFLICHT-GESAMTLOESUNG-2026-07-25.md (+ AGENTS.md)
AgentMemory ist Pflicht-Brain für alle Cursor-Agents und AI-Lösungen — nicht optional.
REST :3111, Viewer :3113, MCP AGENTMEMORY_TOOLS=all + INJECT_CONTEXT=true.
save_mandatory nach Tasks; recall_mandatory vor Planung; Actions statt Chat-Ask.
LightRAG ergänzt als Vektorschicht (Embedding IST: Upstage embedding-passage), ersetzt AgentMemory nicht.
Kein Shadow-Gedächtnis. Session-ID mitspeichern. Dual-Write optional via scripts/brain-dual-write.sh.
EOT
)"
fi

echo "lightrag_sot_seed_done=1 root=$ROOT"
