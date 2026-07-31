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
  local scan_json="$REPORT_DIR/soll-deviation-scan-${stamp}.json"
  local delta_json="$REPORT_DIR/soll-deviation-delta-${stamp}.json"

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

    if [[ -f "$ROOT/test_reports/soll-deviation-scan.json" ]]; then
    cp "$ROOT/test_reports/soll-deviation-scan.json" "$scan_json"
    fi

    prev_scan="$(ls -1 "$REPORT_DIR"/soll-deviation-scan-*.json 2>/dev/null | grep -v "$scan_json" | tail -n 1 || true)"
    if [[ -n "${prev_scan:-}" && -f "$scan_json" ]]; then
    python3 - "$prev_scan" "$scan_json" "$delta_json" <<'PY'
  import json
  import sys
  from pathlib import Path

  prev_path = Path(sys.argv[1])
  curr_path = Path(sys.argv[2])
  delta_path = Path(sys.argv[3])

  prev = json.loads(prev_path.read_text(encoding="utf-8"))
  curr = json.loads(curr_path.read_text(encoding="utf-8"))

  def sig(f):
    return (f.get("severity", ""), f.get("code", ""), f.get("message", ""))

  prev_set = {sig(f) for f in prev.get("findings", [])}
  curr_set = {sig(f) for f in curr.get("findings", [])}

  new_items = sorted(curr_set - prev_set)
  resolved_items = sorted(prev_set - curr_set)

  delta = {
    "previous": str(prev_path.name),
    "current": str(curr_path.name),
    "counts": {
      "previous": {
        "ok": prev.get("ok", 0),
        "warn": prev.get("warn", 0),
        "error": prev.get("error", 0),
      },
      "current": {
        "ok": curr.get("ok", 0),
        "warn": curr.get("warn", 0),
        "error": curr.get("error", 0),
      },
    },
    "delta": {
      "ok": curr.get("ok", 0) - prev.get("ok", 0),
      "warn": curr.get("warn", 0) - prev.get("warn", 0),
      "error": curr.get("error", 0) - prev.get("error", 0),
    },
    "new_findings": [
      {"severity": s, "code": c, "message": m} for s, c, m in new_items
    ],
    "resolved_findings": [
      {"severity": s, "code": c, "message": m} for s, c, m in resolved_items
    ],
  }

  delta_path.write_text(json.dumps(delta, indent=2), encoding="utf-8")
  print(f"delta_report={delta_path}")
  PY
    fi

  echo "report=$out"
    echo "scan_snapshot=$scan_json"
    [[ -f "$delta_json" ]] && echo "delta_snapshot=$delta_json"
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