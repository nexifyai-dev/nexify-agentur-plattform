#!/usr/bin/env python3
# FILE: /scripts/evaluate-remediation-gates.py
# WHAT: Bewertet den Remediation-Plan gegen konfigurierbare Qualitaetsgrenzen.
# WHY: Langlauf soll optional nicht nur messen, sondern bei Ueberschreitungen hart signalisieren.

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="Evaluate remediation plan against quality gates")
    parser.add_argument("--input", required=True, help="Path to remediation plan JSON")
    parser.add_argument("--output", required=True, help="Path to gate result JSON")
    parser.add_argument("--max-p0", type=int, default=0)
    parser.add_argument("--max-p1", type=int, default=10)
    parser.add_argument("--max-p2", type=int, default=50)
    parser.add_argument("--max-blocked", type=int, default=999)
    parser.add_argument("--enforce", action="store_true", help="Exit non-zero when any gate fails")
    args = parser.parse_args()

    in_path = Path(args.input)
    out_path = Path(args.output)
    if not in_path.exists():
        print(f"missing_input={in_path}")
        return 1

    plan = json.loads(in_path.read_text(encoding="utf-8"))
    summary = plan.get("summary", {})
    priorities = summary.get("priorities", {})
    p0 = int(priorities.get("P0", 0))
    p1 = int(priorities.get("P1", 0))
    p2 = int(priorities.get("P2", 0))
    blocked = int(summary.get("blocked_actions", 0))

    checks = {
        "p0": {"actual": p0, "limit": args.max_p0, "ok": p0 <= args.max_p0},
        "p1": {"actual": p1, "limit": args.max_p1, "ok": p1 <= args.max_p1},
        "p2": {"actual": p2, "limit": args.max_p2, "ok": p2 <= args.max_p2},
        "blocked": {"actual": blocked, "limit": args.max_blocked, "ok": blocked <= args.max_blocked},
    }
    gate_ok = all(c["ok"] for c in checks.values())

    result = {
        "source": str(in_path),
        "enforced": bool(args.enforce),
        "gate_ok": gate_ok,
        "checks": checks,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

    print(f"gate_result={out_path}")
    print(
        "gate_ok="
        + ("true" if gate_ok else "false")
        + f" p0={p0}/{args.max_p0} p1={p1}/{args.max_p1} p2={p2}/{args.max_p2} blocked={blocked}/{args.max_blocked}"
    )

    if args.enforce and not gate_ok:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
