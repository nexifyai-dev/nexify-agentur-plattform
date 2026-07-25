#!/usr/bin/env python3
# FILE: /scripts/run_flowsearch_offline.py
# WHAT: Offline NeXify FlowSearch CLI (AFlow-inspired MCTS, no network).
"""Run: python scripts/run_flowsearch_offline.py --iterations 40"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from flowsearch.mcts import search  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="NeXify FlowSearch offline MCTS")
    p.add_argument("--iterations", type=int, default=40)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--lambda-cost", type=float, default=0.08)
    p.add_argument("--out", type=Path, default=ROOT / "docs/research/operators/last_flowsearch_result.json")
    args = p.parse_args()

    result = search(iterations=args.iterations, seed=args.seed, lambda_cost=args.lambda_cost)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"best_score": result["best_score"], "best_workflow": result["best_workflow"]}, indent=2))
    print(f"wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
