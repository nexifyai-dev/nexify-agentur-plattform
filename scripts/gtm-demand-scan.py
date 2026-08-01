#!/usr/bin/env python3
# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/scripts/gtm-demand-scan.py
# NIR: 01.08.2026 19:15
# UPDATED: 01.08.2026 19:15
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Kostenfreier Demand-/Listing-Scan für NeXify AI Go-to-Market
# WHY: Käufer-Intent und Free-Directory-Checkliste ohne Paid Ads/Scraping-ToS-Bruch
# BEST-PRACTICE: Queries + manuelle/OTP-Kanäle listen; keine CAPTCHA-Bypass, kein Reddit wenn geblockt
# PITFALL: V-GTM-01: Reddit API vom VPS oft 403 — nicht als Hard-Fail behandeln
# DEPENDS: Python3 stdlib, docs/go-to-market/channels.json
# DOCS-REF: docs/go-to-market/
# SESSION: gtm-product-channels-2026-08-01

"""Emit buyer-intent search queries and free channel checklist for NeXify AI GTM."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHANNELS_PATH = ROOT / "docs" / "go-to-market" / "channels.json"

INTENT_QUERIES = [
    {
        "product": "AI-Agenten / Automation",
        "queries": [
            '"KI Agentur" OR "AI Agentur" gesucht OR Angebot',
            '"Prozessautomatisierung" KI OR LLM Mittelstand',
            '"AI agent" hire OR "looking for" automation agency',
        ],
    },
    {
        "product": "Unternehmenswebsite",
        "queries": [
            '"Website Agentur" B2B OR Mittelstand Angebot',
            '"nieuwe website" bureau OR laten maken B2B',
        ],
    },
    {
        "product": "Shop / Commerce",
        "queries": [
            '"Onlineshop" Agentur OR "webshop laten bouwen"',
            '"PIM" OR "50.000 Artikel" Shop Entwicklung',
        ],
    },
    {
        "product": "Web-App / Portal",
        "queries": [
            '"Kundenportal" entwickeln OR "SaaS MVP" Agentur',
            '"web app" agency hire B2B',
        ],
    },
]

HEALTH_URLS = [
    ("profis.ai", "https://profis.ai/"),
    ("GoodFirms get-listed", "https://www.goodfirms.co/get-listed"),
    ("Clutch tools", "https://clutch.co/tools"),
    (
        "Sortlist NL AI",
        "https://www.sortlist.nl/s/artificial-intelligence/nederland-nl",
    ),
    ("agenturen.app", "https://agenturen.app/"),
    ("AI Rolodex", "https://theairolodex.com/"),
    ("Zukko aanmelden", "https://zukko.nl/bedrijf-aanmelden/"),
    ("NeXify Leistungen", "https://www.nexifyai.cloud/leistungen"),
]


def load_channels() -> dict:
    if not CHANNELS_PATH.exists():
        return {}
    return json.loads(CHANNELS_PATH.read_text(encoding="utf-8"))


def check_url(url: str, timeout: float = 8.0) -> tuple[str, int | None]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "NeXifyAI-GTM-DemandScan/1.0 (+https://www.nexifyai.cloud)"
        },
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return "ok", getattr(resp, "status", 200)
    except urllib.error.HTTPError as e:
        return "http_error", e.code
    except Exception as e:  # noqa: BLE001 — surface any network failure cleanly
        return f"error:{type(e).__name__}", None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--json",
        action="store_true",
        help="Machine-readable JSON output",
    )
    parser.add_argument(
        "--skip-health",
        action="store_true",
        help="Skip outbound URL health probes",
    )
    args = parser.parse_args()

    channels = load_channels()
    now = datetime.now(timezone.utc).isoformat()

    health = []
    if not args.skip_health:
        for name, url in HEALTH_URLS:
            state, code = check_url(url)
            health.append({"name": name, "url": url, "state": state, "code": code})

    pending = [
        c
        for c in channels.get("channels", [])
        if c.get("status") == "pending_human" and c.get("priority") == "P0"
    ]

    report = {
        "generated_at": now,
        "intent_queries": INTENT_QUERIES,
        "p0_pending_human": pending,
        "channel_health": health,
        "notes": [
            "Reddit JSON API often 403 from this VPS — use web search queries instead.",
            "Directory signups need Pascal OTP/Google/LinkedIn; copy is in listing-copy.json.",
            "Do not buy Clutch/GoodFirms sponsorship until free profiles produce measurable inbound.",
        ],
    }

    if args.json:
        json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
        print()
        return 0

    print(f"# NeXify AI GTM Demand Scan — {now}")
    print()
    print("## Buyer-Intent Queries (kostenfrei in Google/DDG/Bing)")
    for block in INTENT_QUERIES:
        print(f"\n### {block['product']}")
        for q in block["queries"]:
            print(f"  - {q}")

    print("\n## P0 Listings — Human OTP needed")
    for c in pending:
        print(f"  - [{c.get('priority')}] {c.get('name')}: {c.get('url')}")

    if health:
        print("\n## Channel reachability")
        for h in health:
            code_display = h["code"] if h["code"] is not None else "-"
            print(f"  - {h['name']}: {h['state']} ({code_display})")

    print("\n## Next")
    print("  1. Paste docs/go-to-market/listing-copy.json into P0 directories")
    print("  2. Collect first client reviews for Clutch/GoodFirms")
    print("  3. Re-run: python3 scripts/gtm-demand-scan.py --json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
