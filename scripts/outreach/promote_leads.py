#!/usr/bin/env python3
# FILE: /scripts/outreach/promote_leads.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Promote scraped/CRM-pending leads → outreach_pending JSONL (with gates)
# WHY: Only leads with public B2B email + source become send-eligible
# BEST-PRACTICE: Default send_allowed=false unless --allow-send; never purchased lists
# PITFALL: V-OUT-03: Refuse without email/source
# DEPENDS: scripts/outreach/store.py
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from outreach import store  # noqa: E402
from outreach.config import load_config  # noqa: E402


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True, help="JSON/JSONL file or directory")
    p.add_argument(
        "--allow-send",
        action="store_true",
        help="Set send_allowed=true and status=outreach_pending",
    )
    p.add_argument(
        "--out-name",
        default="promoted.jsonl",
        help="Output filename inside OUTREACH_QUEUE_DIR",
    )
    args = p.parse_args(argv)

    cfg = load_config()
    cfg.queue_dir.mkdir(parents=True, exist_ok=True)
    src = Path(args.input)
    raw_items: list[dict] = []

    if src.is_file():
        paths = [src]
    elif src.is_dir():
        paths = sorted(
            set(src.rglob("*.json")) | set(src.rglob("*.jsonl"))
        )
    else:
        print(json.dumps({"error": f"input not found: {src}"}))
        return 1

    for path in paths:
        if path.suffix == ".jsonl":
            raw_items.extend(store.iter_jsonl(path))
        elif path.suffix == ".json":
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, list):
                raw_items.extend(x for x in data if isinstance(x, dict))
            elif isinstance(data, dict):
                if "leads" in data and isinstance(data["leads"], list):
                    raw_items.extend(x for x in data["leads"] if isinstance(x, dict))
                else:
                    raw_items.append(data)

    out_path = cfg.queue_dir / args.out_name
    written = 0
    skipped = 0
    with out_path.open("a", encoding="utf-8") as fh:
        for raw in raw_items:
            lead = store.normalize_lead(raw)
            if not lead.get("email"):
                skipped += 1
                continue
            if (lead.get("source_type") or "").lower() in store.FORBIDDEN_SOURCES:
                skipped += 1
                continue
            if args.allow_send:
                lead["status"] = "outreach_pending"
                lead["send_allowed"] = True
            else:
                lead["status"] = "outreach_pending"
                lead["send_allowed"] = False
            lead["legal_basis"] = lead.get("legal_basis") or "legitimate_interest_b2b"
            fh.write(json.dumps(lead, ensure_ascii=False) + "\n")
            written += 1

    print(json.dumps({"written": written, "skipped": skipped, "out": str(out_path)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
