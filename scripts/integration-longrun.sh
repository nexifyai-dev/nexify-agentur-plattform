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
KEEP_LAST="${KEEP_LAST:-20}"
ENFORCE_GATES="${ENFORCE_GATES:-0}"
MAX_P0="${MAX_P0:-0}"
MAX_P1="${MAX_P1:-10}"
MAX_P2="${MAX_P2:-50}"
MAX_BLOCKED="${MAX_BLOCKED:-999}"
KILL_SWITCH_FILE="${KILL_SWITCH_FILE:-$ROOT/test_reports/longrun/KILL_SWITCH}"
AUTO_INSTALL_HOOKS="${AUTO_INSTALL_HOOKS:-1}"
CHECK_GH_CLONE="${CHECK_GH_CLONE:-1}"
GH_CLONE_REPO="${GH_CLONE_REPO:-nexifyai-dev/nexify-agentur-plattform}"

mkdir -p "$REPORT_DIR"

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

prune_pattern() {
  local pattern="$1"
  mapfile -t files < <(ls -1t $pattern 2>/dev/null || true)
  local candidates=()
  local f
  for f in "${files[@]}"; do
    if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
      continue
    fi
    candidates+=("$f")
  done

  local count="${#candidates[@]}"
  if [[ "$count" -le "$KEEP_LAST" ]]; then
    return
  fi
  for ((idx=KEEP_LAST; idx<count; idx++)); do
    rm -f "${candidates[$idx]}"
  done
}

run_cycle() {
  local cycle="$1"
  local stamp
  stamp="$(date -u +"%Y%m%dT%H%M%SZ")"
  local out="$REPORT_DIR/integration-longrun-${stamp}.log"
  local scan_json="$REPORT_DIR/soll-deviation-scan-${stamp}.json"
  local delta_json="$REPORT_DIR/soll-deviation-delta-${stamp}.json"
  local remediation_json="$REPORT_DIR/remediation-plan-${stamp}.json"
  local gate_json="$REPORT_DIR/remediation-gates-${stamp}.json"
  local gate_rc=0

  {
    echo "# Integration Longrun"
    echo "cycle=${cycle}"
    echo "timestamp=$(ts)"
    echo

    echo "## 0) Hook Guardrails"
    if [[ "$AUTO_INSTALL_HOOKS" == "1" && -x scripts/install-agent-hooks.sh ]]; then
      bash scripts/install-agent-hooks.sh || true
    else
      echo "hook_install=skipped"
    fi
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

    echo "## 5) GitHub Monorepo Clone Check"
    if [[ "$CHECK_GH_CLONE" == "1" && -x scripts/verify-gh-monorepo-clone.sh ]]; then
      bash scripts/verify-gh-monorepo-clone.sh "$GH_CLONE_REPO" || true
    else
      echo "gh_clone_check=skipped"
    fi
    echo
  } | tee "$out"

  if [[ -f "$ROOT/test_reports/soll-deviation-scan.json" ]]; then
    cp "$ROOT/test_reports/soll-deviation-scan.json" "$scan_json"
  fi

  if [[ -f "$scan_json" ]]; then
    python3 scripts/generate-remediation-plan.py --input "$scan_json" --output "$remediation_json" || true
  fi

  if [[ -f "$remediation_json" ]]; then
    gate_args=(
      --input "$remediation_json"
      --output "$gate_json"
      --max-p0 "$MAX_P0"
      --max-p1 "$MAX_P1"
      --max-p2 "$MAX_P2"
      --max-blocked "$MAX_BLOCKED"
    )
    if [[ "$ENFORCE_GATES" == "1" ]]; then
      gate_args+=(--enforce)
    fi
    python3 scripts/evaluate-remediation-gates.py "${gate_args[@]}" || gate_rc=$?
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
  [[ -f "$remediation_json" ]] && echo "remediation_snapshot=$remediation_json"
  [[ -f "$gate_json" ]] && echo "gates_snapshot=$gate_json"

  cp "$out" "$REPORT_DIR/latest-integration-longrun.log"
  [[ -f "$scan_json" ]] && cp "$scan_json" "$REPORT_DIR/latest-soll-deviation-scan.json"
  [[ -f "$delta_json" ]] && cp "$delta_json" "$REPORT_DIR/latest-soll-deviation-delta.json"
  [[ -f "$remediation_json" ]] && cp "$remediation_json" "$REPORT_DIR/latest-remediation-plan.json"
  [[ -f "$gate_json" ]] && cp "$gate_json" "$REPORT_DIR/latest-remediation-gates.json"

  prune_pattern "$REPORT_DIR/integration-longrun-*.log"
  prune_pattern "$REPORT_DIR/soll-deviation-scan-*.json"
  prune_pattern "$REPORT_DIR/soll-deviation-delta-*.json"
  prune_pattern "$REPORT_DIR/remediation-plan-*.json"
  prune_pattern "$REPORT_DIR/remediation-gates-*.json"

  if [[ "$ENFORCE_GATES" == "1" && "$gate_rc" -ne 0 ]]; then
    return "$gate_rc"
  fi
}

echo "# Start integration-longrun"
echo "root=$ROOT"
echo "interval=${INTERVAL_SECONDS}s"
echo "max_cycles=$MAX_CYCLES"
echo "enforce_gates=$ENFORCE_GATES"
echo "thresholds: p0<=${MAX_P0} p1<=${MAX_P1} p2<=${MAX_P2} blocked<=${MAX_BLOCKED}"
echo "kill_switch_file=$KILL_SWITCH_FILE"
echo "auto_install_hooks=$AUTO_INSTALL_HOOKS"
echo "check_gh_clone=$CHECK_GH_CLONE repo=$GH_CLONE_REPO"
echo

if [[ "$MAX_CYCLES" == "0" ]]; then
  i=0
  while true; do
    if [[ -f "$KILL_SWITCH_FILE" ]]; then
      echo "kill_switch_detected=$KILL_SWITCH_FILE"
      break
    fi
    i=$((i + 1))
    if ! run_cycle "$i"; then
      echo "cycle_failed=$i"
      break
    fi
    echo "sleep_until_next_cycle=${INTERVAL_SECONDS}s"
    sleep "$INTERVAL_SECONDS"
  done
else
  for ((i=1; i<=MAX_CYCLES; i++)); do
    run_cycle "$i"
    if [[ "$i" -lt "$MAX_CYCLES" ]]; then
      echo "sleep_until_next_cycle=${INTERVAL_SECONDS}s"
      sleep "$INTERVAL_SECONDS"
    fi
  done
fi

echo "# integration-longrun completed"