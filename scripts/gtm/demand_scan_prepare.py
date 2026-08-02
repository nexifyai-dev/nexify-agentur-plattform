#!/usr/bin/env python3
# FILE: /scripts/gtm/demand_scan_prepare.py
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 07:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Bereitet CRM-Pending-JSON aus Demand-Treffern vor (kein Auto-Versand)
# WHY: Einheitliches Leadscore-/Gate-Schema laut GTM- und Kundensuche-SOP
# BEST-PRACTICE: Nur öffentliche Quellen; Outreach erst nach Legal Gate
# PITFALL: V-GTM-05/06: Script sendet keine Mails und scraped nicht
# DEPENDS: docs/gtm/DEMAND_SEARCH_QUERIES_V1.md
# DOCS-REF: docs/gtm/CONVERSION_LOOP_V1.md
# SESSION: gtm-kostenfrei-angebote-c6e3

"""Demand-Scan → CRM-Pending Vorbereitung.

Usage:
  python3 scripts/gtm/demand_scan_prepare.py --input hits.json --out pending/
  python3 scripts/gtm/demand_scan_prepare.py --demo

Input JSON: Liste von Objekten mit keys:
  source_id, title, url, summary, company (optional), region (optional),
  service_slug (optional), budget_hint (optional), staffing_only (bool),
  decision_maker_visible (bool), remote_ok (bool), deadline_days (optional int)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

MIN_SCORE_PENDING = 50
DAY_RATE_EUR = 449

SERVICE_SLUGS = {
    "landingpages",
    "websites",
    "onlineshops",
    "enterprise-commerce",
    "web-apps",
    "mobile-apps",
    "automatisierung",
    "ai-agenten",
}


def score_hit(hit: dict[str, Any]) -> tuple[int, list[str]]:
    """Leadscore 0–100 laut DEMAND_SEARCH_QUERIES_V1."""
    score = 0
    reasons: list[str] = []

    slug = hit.get("service_slug") or ""
    if slug in SERVICE_SLUGS:
        score += 25
        reasons.append("+25 passende Leistung")
    elif hit.get("title") or hit.get("summary"):
        score += 10
        reasons.append("+10 generischer Digital-Fit")

    if hit.get("budget_hint"):
        score += 20
        reasons.append("+20 Budget/Rahmen angedeutet")

    if hit.get("decision_maker_visible"):
        score += 15
        reasons.append("+15 Entscheider/Firmenkontext")

    region = (hit.get("region") or "").upper()
    if hit.get("remote_ok") or any(x in region for x in ("DE", "AT", "CH", "NL", "BE", "DACH", "EU")):
        score += 15
        reasons.append("+15 DACH/NL/Remote")

    deadline = hit.get("deadline_days")
    if isinstance(deadline, int) and 0 <= deadline < 60:
        score += 15
        reasons.append("+15 Deadline < 60 Tage")

    if not hit.get("agency_middleman_only"):
        score += 10
        reasons.append("+10 kein reiner Zwischenhändler")

    if hit.get("staffing_only"):
        score -= 30
        reasons.append("-30 reines Staffing/ANÜ")

    if hit.get("dumping_price"):
        score -= 40
        reasons.append("-40 Dumping/Billigstbieter")

    return max(0, min(100, score)), reasons


def build_pending(hit: dict[str, Any]) -> dict[str, Any]:
    score, reasons = score_hit(hit)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    contact_reason = (
        f"Öffentlicher Demand-Treffer auf {hit.get('source_id', 'unknown')}: "
        f"{hit.get('title', '').strip() or 'ohne Titel'}. "
        f"Zusammenfassung: {(hit.get('summary') or '')[:280]}"
    )
    return {
        "schema": "nexify.gtm.crm_pending.v1",
        "created_at": now,
        "status": "pending_legal_gate" if score >= MIN_SCORE_PENDING else "below_threshold",
        "score": score,
        "score_reasons": reasons,
        "day_rate_eur": DAY_RATE_EUR,
        "service_slug": hit.get("service_slug"),
        "source": {
            "id": hit.get("source_id"),
            "title": hit.get("title"),
            "url": hit.get("url"),
            "company": hit.get("company"),
            "region": hit.get("region"),
        },
        "contact_reason": contact_reason,
        "outreach_draft_allowed": False,
        "send_allowed": False,
        "notes": (
            "Kein Auto-Versand. Nach Legal/Policy Gate Outreach-Entwurf erzeugen "
            "gemäß SOP_KUNDENSUCHE_LEAD_TO_CRM_OUTREACH_GATE_V3."
        ),
        "utm_hint": (
            f"utm_source={hit.get('source_id', 'demand')}&utm_medium=outbound&utm_campaign="
            f"{hit.get('service_slug') or 'brand'}"
        ),
    }


def load_hits(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and "hits" in data:
        data = data["hits"]
    if not isinstance(data, list):
        raise ValueError("Input must be a JSON list or {\"hits\": [...]}")
    return data


def write_pending(records: list[dict[str, Any]], out_dir: Path) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    for i, rec in enumerate(records, start=1):
        slug = rec.get("service_slug") or "generic"
        src = (rec.get("source") or {}).get("id") or "src"
        name = f"{rec['created_at'][:10]}_{src}_{slug}_{i:02d}.json".replace(":", "")
        path = out_dir / name
        path.write_text(json.dumps(rec, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        written.append(path)
    return written


DEMO_HITS = [
    {
        "source_id": "D01",
        "title": "Next.js Unternehmenswebsite Relaunch KMU",
        "url": "https://www.freelance.de/example-project-website",
        "summary": "Mittelständischer Hersteller sucht Relaunch der B2B-Website inkl. Leistungsseiten und SEO.",
        "company": "Beispiel GmbH",
        "region": "DE-NRW",
        "service_slug": "websites",
        "budget_hint": "Festpreis 2-3 Tage",
        "decision_maker_visible": True,
        "remote_ok": True,
        "deadline_days": 30,
        "staffing_only": False,
    },
    {
        "source_id": "D01",
        "title": "ANÜ Senior Java Entwickler 12 Monate",
        "url": "https://www.freelance.de/example-anue",
        "summary": "Körperleihe ohne Produktlieferung.",
        "region": "DE",
        "service_slug": "web-apps",
        "staffing_only": True,
        "remote_ok": True,
    },
]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="GTM Demand → CRM Pending Vorbereitung")
    parser.add_argument("--input", type=Path, help="JSON-Datei mit Hits")
    parser.add_argument("--out", type=Path, default=Path("docs/gtm/evidence/demand-pending"))
    parser.add_argument("--demo", action="store_true", help="Demo-Hits verarbeiten")
    parser.add_argument("--stdout", action="store_true", help="JSON auf stdout statt Dateien")
    args = parser.parse_args(argv)

    if args.demo:
        hits = DEMO_HITS
    elif args.input:
        hits = load_hits(args.input)
    else:
        parser.error("Either --input or --demo is required")

    records = [build_pending(h) for h in hits]
    pending = [r for r in records if r["status"] == "pending_legal_gate"]
    skipped = [r for r in records if r["status"] != "pending_legal_gate"]

    if args.stdout:
        json.dump({"pending": pending, "skipped": skipped}, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
    else:
        written = write_pending(pending, args.out)
        summary = args.out / "_summary.json"
        summary.write_text(
            json.dumps(
                {
                    "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "total_hits": len(records),
                    "pending_legal_gate": len(pending),
                    "below_threshold": len(skipped),
                    "files": [str(p) for p in written],
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        print(f"pending={len(pending)} skipped={len(skipped)} out={args.out}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
