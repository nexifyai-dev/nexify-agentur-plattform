#!/usr/bin/env python3
# FILE: /scripts/gtm/icp_lead_discover.py
# NIR: 02.08.2026 11:00
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Segmented lead discover for Top-ICPs — query packs + demo hits
# WHY: Repeatable Neukunden-Suche ohne Paid Scrapers
# BEST-PRACTICE: --demo default path; hits ≠ outreach until Legal Gate
# PITFALL: V-DISC-01: No auto-scrape of private data
# DEPENDS: icp_segments.py, demand_scan_prepare.py
# DOCS-REF: docs/gtm/ICP-HIGH-DEMAND-2026.md
# SESSION: icp-demand-competitor-copy-7dd5

"""Usage:
  python3 scripts/gtm/icp_lead_discover.py --icp handwerk --demo
  python3 scripts/gtm/icp_lead_discover.py --icp top3 --demo --out docs/gtm/evidence/
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from demand_scan_prepare import build_pending, write_pending  # noqa: E402
from icp_segments import ICP_SEGMENTS, TOP3_SLUGS, get_segment, list_top_slugs  # noqa: E402

SERVICE_BY_ICP = {
    "handwerk": "automatisierung",
    "steuerberater": "automatisierung",
    "agenturen": "ai-agenten",
}


def google_search_url(q: str) -> str:
    return f"https://www.google.com/search?q={quote_plus(q)}"


def demo_hits_for_icp(slug: str) -> list[dict[str, Any]]:
    seg = get_segment(slug)
    return [
        {
            "source_id": f"demo-{slug}-01",
            "title": f"{seg['label']} — Beispielbetrieb Nord",
            "url": f"https://example.invalid/{slug}/nord",
            "summary": f"KMU {seg['keywords'][0]} mit öffentlichem Impressum; Admin-Pain erkennbar.",
            "company": f"Demo {seg['label']} Nord GmbH",
            "region": "NRW",
            "service_slug": SERVICE_BY_ICP[slug],
            "budget_hint": "Tagessatz-kompatibel",
            "staffing_only": False,
            "decision_maker_visible": True,
            "remote_ok": True,
            "deadline_days": 30,
            "icp": slug,
            "email": f"info@{slug}-nord.example.invalid",
        },
        {
            "source_id": f"demo-{slug}-02",
            "title": f"{seg['label']} — Beispiel Süd",
            "url": f"https://example.invalid/{slug}/sued",
            "summary": "Website + Kontaktseite; Digitalisierung erwähnt.",
            "company": f"Demo {seg['label']} Süd UG",
            "region": "BY",
            "service_slug": SERVICE_BY_ICP[slug],
            "budget_hint": None,
            "staffing_only": False,
            "decision_maker_visible": True,
            "remote_ok": True,
            "deadline_days": 45,
            "icp": slug,
            "email": f"kontakt@{slug}-sued.example.invalid",
        },
        {
            "source_id": f"demo-{slug}-skip",
            "title": "Zeitarbeit Bodyleasing Großauftrag",
            "url": f"https://example.invalid/{slug}/staffing",
            "summary": "Reine ANÜ ohne Delivery-Scope",
            "company": "Staffing Only AG",
            "region": "DE",
            "service_slug": SERVICE_BY_ICP[slug],
            "staffing_only": True,
            "decision_maker_visible": False,
            "remote_ok": False,
            "icp": slug,
            "email": "hr@staffing.example.invalid",
        },
    ]


def build_query_pack(slug: str) -> dict[str, Any]:
    seg = get_segment(slug)
    return {
        "icp": slug,
        "label": seg["label"],
        "rank": seg["rank"],
        "landing": seg["landing"],
        "keywords": seg["keywords"],
        "exclude": seg["exclude"],
        "directory_seeds": seg["directory_seeds"],
        "searches": [{"query": q, "url": google_search_url(q)} for q in seg["search_queries"]],
    }


def discover(slug: str, *, demo: bool, pending_dir: Path) -> dict[str, Any]:
    pack = build_query_pack(slug)
    hits = demo_hits_for_icp(slug) if demo else []
    records = [build_pending(h) for h in hits] if hits else []
    pending = [r for r in records if r.get("status") == "pending_legal_gate"]
    if pending:
        write_pending(pending, pending_dir / slug)
    return {
        "icp": slug,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "mode": "demo" if demo else "queries_only",
        "query_pack": pack,
        "pending_count": len(pending),
        "skipped_count": len(records) - len(pending),
        "pending": pending,
        "note": (
            "Demo-Hits sind ungültige example.invalid-Adressen — kein Versand."
            if demo
            else "Nur Query-Pack; manuell öffentliche Treffer in JSON speisen."
        ),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="ICP segmented lead discover")
    parser.add_argument("--icp", default="handwerk", help="slug, 'top3', or 'all'")
    parser.add_argument("--demo", action="store_true")
    parser.add_argument("--queries-only", action="store_true")
    parser.add_argument("--out", type=Path, default=ROOT / "docs/gtm/evidence")
    args = parser.parse_args(argv)

    if args.icp in ("top3", "all"):
        n = 3 if args.icp == "top3" else len(ICP_SEGMENTS)
        slugs = list_top_slugs(n)
    else:
        get_segment(args.icp)
        slugs = [args.icp]

    demo = bool(args.demo) and not args.queries_only
    args.out.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    results = []
    for slug in slugs:
        result = discover(slug, demo=demo, pending_dir=args.out / "icp-pending")
        results.append(result)
        out_path = args.out / f"icp-discover-{slug}-{stamp}.json"
        out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {out_path} pending={result['pending_count']}")

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "icps": [r["icp"] for r in results],
        "total_pending": sum(r["pending_count"] for r in results),
        "top3": list(TOP3_SLUGS),
    }
    (args.out / f"icp-discover-summary-{stamp}.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
