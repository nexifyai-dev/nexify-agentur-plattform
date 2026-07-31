#!/usr/bin/env bash
# FILE: /scripts/integration-longrun.sh
# WHAT: Zyklischer Integrations-Check fuer das NeXify-Gesamtsystem im Codespace/VPS.
# WHY: Proaktive Langlauf-Ueberwachung fuer MCP, OpenAPI, Monitoring und VCS-Wiring.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

INTERVAL_SECONDS="${INTERVAL_SECONDS:-900}"
MAX_CYCLES="${MAX_CYCLES:-1}"
REPORT_DIR="${REPORT_DIR:-$ROOT/test_reports/longrun}"

mkdir -p "$REPORT_DIR"

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

run_cycle() {
  local cycle="$1"
  local stamp
  stamp="$(date -u +"%Y%m%dT%H%M%SZ")"
  local out="$REPORT_DIR/integration-longrun-${stamp}.log"

  {
    echo "# Integration Longrun"
    echo "cycle=${cycle}"
    echo "timestamp=$(ts)"
    echo

    echo "## 1) SOLL-Deviation"
    python3 scripts/soll-deviation-scan.py || true
    echo

    echo "## 2) MCP Health (Codespace)"
    if [[ -x scripts/mcp-health-codespace.sh ]]; then
      bash scripts/mcp-health-codespace.sh || true
    else
      echo "missing: scripts/mcp-health-codespace.sh"
    fi
    echo

    echo "## 3) GitLab OSS Smoke"
    if [[ -x scripts/gitlab-oss-smoke.sh ]]; then
      bash scripts/gitlab-oss-smoke.sh || true
    else
      echo "missing: scripts/gitlab-oss-smoke.sh"
    fi
    echo

    echo "## 4) Git remotes"
    git remote -v || true
    echo
  } | tee "$out"

  echo "report=$out"
}

echo "# Start integration-longrun"
echo "root=$ROOT"
echo "interval=${INTERVAL_SECONDS}s"
echo "max_cycles=$MAX_CYCLES"
echo

for ((i=1; i<=MAX_CYCLES; i++)); do
  run_cycle "$i"
  if [[ "$i" -lt "$MAX_CYCLES" ]]; then
    echo "sleep_until_next_cycle=${INTERVAL_SECONDS}s"
    sleep "$INTERVAL_SECONDS"
  fi
done

echo "# integration-longrun completed"