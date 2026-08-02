#!/usr/bin/env python3
# FILE: /scripts/outreach/run_daily.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: CLI entry — daily lead outreach job (Hostinger SMTP drip, opt-in only)
# WHY: Cron / GitHub Actions / Cursor Agent invoke one command
# BEST-PRACTICE: Exit 2 = human-gate (missing SMTP); 0 = ok; 1 = soft errors
# PITFALL: V-OUT-06/UWG-01: Never print passwords; --live requires consent=true leads
# DEPENDS: scripts/outreach/*
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md, docs/gtm/UWG-EMAIL-OPTIN-ONLY.md
# SESSION: uwg-optin-only-7dd5

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from pathlib import Path

# Allow `python3 scripts/outreach/run_daily.py` without PYTHONPATH
_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from outreach.config import load_config  # noqa: E402
from outreach.runner import run_daily  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("nexify.outreach.cli")


def _load_secrets_file(path: str) -> None:
    """Source KEY=VALUE into os.environ if not already set. Never prints values."""
    p = Path(path)
    if not p.is_file():
        return
    for line in p.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        if not key or key in os.environ:
            continue
        val = val.strip().strip("'").strip('"')
        os.environ[key] = val


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="NeXify AI daily lead outreach (opt-in / §7 UWG)"
    )
    parser.add_argument(
        "--live",
        action="store_true",
        help="Actually send (OUTREACH_LIVE=1); leads MUST have consent=true",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Force dry-run even if OUTREACH_LIVE=1",
    )
    parser.add_argument(
        "--secrets-file",
        default=os.environ.get("SECRETS_FILE", "/etc/nexifyai/secrets.env"),
        help="Optional env file (default /etc/nexifyai/secrets.env)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print RunResult as JSON",
    )
    args = parser.parse_args(argv)

    _load_secrets_file(args.secrets_file)

    if args.live:
        os.environ["OUTREACH_LIVE"] = "1"
        logger.warning(
            "UWG-WARN (§7): --live only for opt-in leads with consent=true. "
            "Cold email without consent is illegal in DE (also B2B)."
        )
    if args.dry_run:
        os.environ["OUTREACH_LIVE"] = "0"

    cfg = load_config()
    result = run_daily(cfg)

    payload = {
        "ok": result.blocked is None and result.errors == 0,
        "live": cfg.live,
        "daily_cap": cfg.daily_cap,
        "firecrawl_url": cfg.firecrawl_url,
        "smtp_ready": cfg.smtp_ready,
        "queue_dir": str(cfg.queue_dir),
        **result.as_dict(),
    }

    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        logger.info("result=%s", json.dumps(payload, ensure_ascii=False))

    if result.blocked and "missing_smtp" in (result.blocked or ""):
        logger.error(
            "HUMAN-GATE: SMTP credentials missing — see docs/operations/"
            "LEAD-OUTREACH-AUTOMATION.md and issue #123"
        )
        return 2
    if result.blocked:
        logger.warning("blocked: %s", result.blocked)
        return 0 if "daily_cap" in result.blocked else 2
    if result.errors:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
