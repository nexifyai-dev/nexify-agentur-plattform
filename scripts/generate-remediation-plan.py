#!/usr/bin/env python3
# FILE: /scripts/generate-remediation-plan.py
# WHAT: Erzeugt einen priorisierten Maßnahmenplan aus dem SOLL-Deviation-Scan.
# WHY: Aus Findings direkt umsetzbare P0/P1/P2-Aktionen ableiten.

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Action:
    priority: str
    owner: str
    code: str
    finding: str
    runbook: str
    blocked: bool


PRIO_ORDER = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}


def classify_priority(code: str, message: str, severity: str, fix: str) -> tuple[str, str, bool]:
    msg = message.lower()
    fix_l = (fix or "").lower()

    if severity == "error":
        return "P0", "platform", False

    if code in {"TUNNEL-HOST-MISSING", "CONTROL-PLANE-SPLIT", "MCP-TRACKED"}:
        return "P0", "platform", False

    if code == "RUNTIME-DOWN":
        if "127.0.0.1" in msg or "action blocked" in fix_l:
            return "P2", "ops", True
        if any(key in msg for key in ("openapi", "grafana", "prometheus", "api.nexifyai.cloud")):
            return "P1", "ops", False
        return "P1", "ops", False

    if code.startswith("VCS-"):
        return "P1", "devops", False

    if code.startswith("MCP-"):
        return "P1", "platform", False

    if severity == "warn":
        return "P2", "platform", False

    return "P3", "platform", False


def build_actions(scan: dict) -> list[Action]:
    findings = scan.get("findings", [])
    actions: list[Action] = []

    for f in findings:
        severity = str(f.get("severity", ""))
        if severity not in {"warn", "error"}:
            continue
        code = str(f.get("code", "UNKNOWN"))
        message = str(f.get("message", ""))
        fix = str(f.get("fix", ""))
        priority, owner, blocked = classify_priority(code, message, severity, fix)
        runbook = fix or "Governance/Runbook konsultieren und Fix-PR erstellen"
        actions.append(
            Action(
                priority=priority,
                owner=owner,
                code=code,
                finding=message,
                runbook=runbook,
                blocked=blocked,
            )
        )

    actions.sort(key=lambda a: (PRIO_ORDER.get(a.priority, 99), a.owner, a.code, a.finding))
    return actions


def to_dict(actions: list[Action], scan: dict) -> dict:
    grouped = {"P0": 0, "P1": 0, "P2": 0, "P3": 0}
    blocked = 0
    for a in actions:
        grouped[a.priority] = grouped.get(a.priority, 0) + 1
        if a.blocked:
            blocked += 1

    return {
        "source": "test_reports/soll-deviation-scan.json",
        "summary": {
            "scan": {
                "ok": int(scan.get("ok", 0)),
                "warn": int(scan.get("warn", 0)),
                "error": int(scan.get("error", 0)),
            },
            "actions_total": len(actions),
            "priorities": grouped,
            "blocked_actions": blocked,
        },
        "actions": [a.__dict__ for a in actions],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate remediation plan from deviation scan")
    parser.add_argument("--input", default="test_reports/soll-deviation-scan.json")
    parser.add_argument("--output", default="test_reports/remediation-plan.json")
    args = parser.parse_args()

    in_path = Path(args.input)
    out_path = Path(args.output)
    if not in_path.exists():
        print(f"missing_input={in_path}")
        return 1

    scan = json.loads(in_path.read_text(encoding="utf-8"))
    actions = build_actions(scan)
    plan = to_dict(actions, scan)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(plan, indent=2), encoding="utf-8")

    p0 = plan["summary"]["priorities"].get("P0", 0)
    p1 = plan["summary"]["priorities"].get("P1", 0)
    p2 = plan["summary"]["priorities"].get("P2", 0)
    p3 = plan["summary"]["priorities"].get("P3", 0)
    print(f"remediation_plan={out_path}")
    print(f"actions_total={len(actions)} p0={p0} p1={p1} p2={p2} p3={p3}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
