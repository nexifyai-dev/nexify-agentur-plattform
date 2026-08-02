#!/usr/bin/env python3
# FILE: /scripts/outreach/promote_leads.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 11:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Promote scraped/CRM-pending leads → outreach_pending JSONL (with UWG gates)
# WHY: Only opt-in leads (consent=true) become send-eligible in DE
# BEST-PRACTICE: Default send_allowed=false; --allow-send requires consent=true
# PITFALL: V-OUT-03/UWG-01: Refuse without email/source/consent for send path
# DEPENDS: scripts/outreach/store.py
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md, docs/gtm/UWG-EMAIL-OPTIN-ONLY.md
# SESSION: zero-cost-leads-mailing-7dd5

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

UWG_WARN = (
    "UWG-WARN (§7): DE cold email without consent is illegal (also B2B). "
    "--allow-send only sets send_allowed when consent=true on the lead."
)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        description="Promote leads to outreach queue (opt-in / UWG-safe)"
    )
    p.add_argument("--input", required=True, help="JSON/JSONL file or directory")
    p.add_argument(
        "--allow-send",
        action="store_true",
        help="Set send_allowed=true ONLY when lead already has consent=true",
    )
    p.add_argument(
        "--out-name",
        default="promoted.jsonl",
        help="Output filename inside OUTREACH_QUEUE_DIR",
    )
    args = p.parse_args(argv)

    if args.allow_send:
        print(UWG_WARN, file=sys.stderr)

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
    blocked_no_consent = 0
    with out_path.open("a", encoding="utf-8") as fh:
        for raw in raw_items:
            lead = store.normalize_lead(raw)
            if not lead.get("email"):
                skipped += 1
                continue
            if (lead.get("source_type") or "").lower() in store.FORBIDDEN_SOURCES:
                skipped += 1
                continue
            lead["status"] = "outreach_pending"
            has_consent = lead.get("consent") is True or raw.get("consent") is True
            lead["consent"] = has_consent
            if args.allow_send and has_consent:
                lead["send_allowed"] = True
                lead["legal_basis"] = "consent"
                if not lead.get("consent_recorded_at"):
                    lead["consent_recorded_at"] = store.utc_now()
            else:
                lead["send_allowed"] = False
                if args.allow_send and not has_consent:
                    blocked_no_consent += 1
                lead["legal_basis"] = lead.get("legal_basis") or "opt_in_required"
            fh.write(json.dumps(lead, ensure_ascii=False) + "\n")
            written += 1

    print(
        json.dumps(
            {
                "written": written,
                "skipped": skipped,
                "blocked_no_consent": blocked_no_consent,
                "out": str(out_path),
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
