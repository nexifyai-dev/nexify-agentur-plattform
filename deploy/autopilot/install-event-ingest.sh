#!/usr/bin/env bash
# Install / refresh VPS Autopilot event-ingest job from repo mirror.
set -euo pipefail
REPO="${NEXIFY_REPO:-/opt/nexifyai/repos/nexify-agentur-plattform}"
SRC="$REPO/deploy/autopilot/jobs/event-ingest-to-cloud-agent.sh"
DST="/opt/nexifyai/scripts/autopilot/jobs/event-ingest-to-cloud-agent.sh"
mkdir -p "$(dirname "$DST")"
install -m 0755 "$SRC" "$DST"
echo "installed=$DST"

# Patch jobs.yaml if entry missing (idempotent)
REG="/opt/nexifyai/config/autopilot/jobs.yaml"
if [[ -f "$REG" ]] && ! grep -q 'id: event-ingest-to-cloud-agent' "$REG"; then
  python3 - "$REG" <<'PY'
import pathlib, sys
p = pathlib.Path(sys.argv[1])
text = p.read_text()
block = '''
  - id: event-ingest-to-cloud-agent
    name: Event Ingest → Cursor Cloud Agent (PC-off)
    layer: [sense, decide, act]
    trigger: [cron, webhook, health-fail, memory-event]
    schedule: "*:0/20"
    autopilot_wrapper: /opt/nexifyai/scripts/autopilot/jobs/event-ingest-to-cloud-agent.sh
    self_heal: false
    note: "PC-off path: AgentMemory Actions + health → CURSOR_API_KEY Cloud Agent. Secrets only env names."
    docs_pointer:
      - /opt/nexifyai/repos/nexify-agentur-plattform/docs/operations/CLOUD-AGENT-EVENT-INGEST.md
    related_jobs: [pending-actions, auto-tasks-from-gaps, health, deviation-auto-fix]
    enabled: true
    severity: high
'''
# insert before skills_map:
if "skills_map:" in text:
    text = text.replace("skills_map:", block + "\nskills_map:", 1)
    p.write_text(text)
    print("jobs.yaml_patched=1")
else:
    print("jobs.yaml_skills_map_missing=1")
PY
fi

# Ensure skills_map includes the job
if [[ -f "$REG" ]] && grep -q 'nexifyai-automatisierung:' "$REG" && ! grep -q 'event-ingest-to-cloud-agent' "$REG"; then
  sed -i 's/inbox-triage-cycle]/inbox-triage-cycle, event-ingest-to-cloud-agent]/' "$REG" || true
fi

echo "done"
