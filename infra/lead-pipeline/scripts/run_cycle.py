#!/usr/bin/env python3
"""NeXify AI Lead-Pipeline — Automation Cycle

Führt Discovery → Enrichment → Demo → Outreach für 3 Branchen aus.
Nutzbar als Cron-Job oder manueller Trigger.

Usage:
    python scripts/run_cycle.py
    python scripts/run_cycle.py --industries "Restaurants,Arztpraxen,Handwerksbetriebe"
    python scripts/run_cycle.py --region "Berlin" --max-leads 10
"""

import asyncio
import json
import logging
import hashlib
import os
import sys
import time
from datetime import datetime, timezone

import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.phases.discovery import discover_leads
from src.phases.enrichment import enrich_lead
from src.phases.demo_generation import generate_demo
from src.phases.outreach import send_outreach
from src.integrations import supabase_client as db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("run_cycle")

DEFAULT_INDUSTRIES = [
    "Malerbetriebe", "Sanitär-Heizung-Klima", "Elektrobetriebe", "Bauunternehmen",
    "Dachdecker-Zimmerer", "Tischlerei-Schreinerei", "Metallbau-Schlosserei",
    "Garten-Landschaftsbau", "Gebäudereinigung", "Kfz-Werkstätten",
]
DEFAULT_REGION = os.getenv("LEAD_REGION", "Berlin")
DEFAULT_MAX_LEADS = int(os.getenv("LEAD_MAX_PER_INDUSTRY", "5"))

RESULTS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "cycle_results.json",
)

CALENDLY_URL = os.getenv("CALENDLY_URL", "https://nexifyai.cloud/demo-call")
WEBHOOK_URL = os.getenv("MAIL_WEBHOOK_URL", "http://localhost:8901")
CAMPAIGN_DRY_RUN = os.getenv("CAMPAIGN_DRY_RUN", "0") == "1"


async def _send_campaign(results: dict) -> dict:
    """Sendet alle generierten Outreach-Mails via Webhook /campaign/send."""
    if CAMPAIGN_DRY_RUN:
        logger.info("Campaign DRY RUN — no emails sent")
        return {"sent": 0, "failed": 0, "dry_run": True}

    leads_to_send = []
    for ind_data in results.get("industries", {}).values():
        for lead in ind_data.get("leads", []):
            outreach = lead.get("outreach", {})
            if outreach.get("status") in ("generated", "generated_fallback"):
                if outreach.get("recipient") and "@" in outreach.get("recipient", ""):
                    consent_token = hashlib.md5(lead.get("url","").encode()).hexdigest()[:12]
                    lead["consent_token"] = consent_token
                    leads_to_send.append({
                        "contact_email": outreach["recipient"],
                        "subject": outreach.get("subject", ""),
                        "body": outreach.get("body", ""),
                        "calendly_url": CALENDLY_URL,
                        "name": lead.get("lead", "Unbekannt"),
                        "url": lead.get("url", ""),
                    })

    if not leads_to_send:
        logger.info("No leads with valid emails to send")
        return {"sent": 0, "failed": 0}

    # Log all emails that would be sent
    for l in leads_to_send[:5]:  # Max 5 im Log
        logger.info("  → %s <%s>", l["name"][:50], l["contact_email"])
    if len(leads_to_send) > 5:
        logger.info("  ... and %d more", len(leads_to_send) - 5)

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{WEBHOOK_URL}/campaign/send",
                json={"leads": leads_to_send},
            )
            resp.raise_for_status()
            result = resp.json()
            logger.info("Campaign sent: %s", result)
            return result
    except Exception as e:
        logger.error("Campaign send failed: %s", e)
        return {"sent": 0, "failed": len(leads_to_send), "error": str(e)}


async def process_lead(lead: dict) -> dict:
    """Einzelner Lead durch die Pipeline: Enrich → Demo → Outreach."""
    result = {
        "lead": lead.get("business_name", lead.get("name", lead.get("url", "?"))),
        "url": lead.get("url", ""),
        "enrichment": None,
        "demo": None,
        "outreach": None,
    }

    # Phase 2: Enrichment
    try:
        enriched = await enrich_lead(lead)
        result["enrichment"] = enriched.get("status")
        lead = enriched
        # Persist lead in DB
        try:
            await db.insert_lead(lead)
            logger.debug("Lead saved: %s", lead.get("business_name", ""))
        except Exception as dbe:
            logger.warning("DB insert failed (non-fatal): %s", dbe)
    except Exception as e:
        logger.error("Enrichment failed: %s", e)
        result["enrichment"] = f"failed: {e}"
        return result

    # Phase 3: Demo
    try:
        demo = await generate_demo(lead)
        result["demo"] = {
            "status": demo.get("status"),
            "url": demo.get("calendly_url", ""),
        }
    except Exception as e:
        logger.error("Demo failed: %s", e)
        result["demo"] = f"failed: {e}"
        return result

    # Phase 4: Outreach
    try:
        outreach = await send_outreach(lead, demo)
        result["outreach"] = {
            "status": outreach.get("status"),
            "subject": outreach.get("subject"),
            "body": outreach.get("body"),
            "recipient": outreach.get("recipient"),
            "demo_url": outreach.get("demo_url", ""),
        }
    except Exception as e:
        logger.error("Outreach failed: %s", e)
        result["outreach"] = f"failed: {e}"

    return result


async def run_cycle(
    industries: list[str] | None = None,
    region: str = DEFAULT_REGION,
    max_leads_per_industry: int = DEFAULT_MAX_LEADS,
) -> dict:
    """Haupt-Cycle: Über 3 Branchen iterieren, Pipeline durchführen.

    Args:
        industries: Liste von Branchen (default: DEFAULT_INDUSTRIES)
        region: Region
        max_leads_per_industry: Max Leads pro Branche

    Returns:
        Dict mit Summary-Statistiken
    """
    industries = industries or DEFAULT_INDUSTRIES

    results = {
        "started_at": datetime.now(timezone.utc).isoformat(),
        "region": region,
        "industries": {},
        "summary": {
            "total_discovered": 0,
            "total_enriched": 0,
            "total_demo": 0,
            "total_outreach": 0,
            "total_failed": 0,
        },
    }

    t_start = time.monotonic()

    for industry in industries:
        logger.info("=== Industry: %s ===", industry)
        industry_results = []

        # Phase 1: Discovery
        try:
            leads = await discover_leads(industry, region, max_leads_per_industry)
            logger.info("Discovered %d leads for %s", len(leads), industry)
        except Exception as e:
            logger.error("Discovery failed for %s: %s", industry, e)
            results["industries"][industry] = {"error": str(e), "leads": []}
            continue

        results["summary"]["total_discovered"] += len(leads)

        # Phase 2-4: Enrich → Demo → Outreach pro Lead (sequential, rate-limit friendly)
        for lead in leads:
            lead_result = await process_lead(lead)
            industry_results.append(lead_result)

            if lead_result.get("enrichment") == "enriched":
                results["summary"]["total_enriched"] += 1
            _demo = lead_result.get("demo")
            _outreach = lead_result.get("outreach")
            if isinstance(_demo, dict) and _demo.get("status") == "generated":
                results["summary"]["total_demo"] += 1
            if isinstance(_outreach, dict) and _outreach.get("status") in ("generated", "generated_fallback"):
                results["summary"]["total_outreach"] += 1

        results["industries"][industry] = {
            "count": len(leads),
            "leads": industry_results,
        }

    elapsed = time.monotonic() - t_start
    results["completed_at"] = datetime.now(timezone.utc).isoformat()
    results["elapsed_seconds"] = round(elapsed, 1)
    results["summary"]["total_failed"] = sum(
        1 for ind in results["industries"].values()
        for l in ind.get("leads", [])
        if any(isinstance(v, str) and "failed" in v for v in l.values())
    )

    # Send campaign via webhook
    campaign_result = await _send_campaign(results)
    results["campaign"] = campaign_result

    # Save results
    with open(RESULTS_FILE, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False, default=str)

    logger.info(
        "Cycle complete in %.1fs — %d discovered, %d enriched, %d demos, %d outreach",
        elapsed,
        results["summary"]["total_discovered"],
        results["summary"]["total_enriched"],
        results["summary"]["total_demo"],
        results["summary"]["total_outreach"],
    )

    return results


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Lead-Pipeline Automation Cycle")
    parser.add_argument(
        "--industries",
        default=None,
        help="Comma-separated industries (default: Handwerksbetriebe,Restaurants,Arztpraxen)",
    )
    parser.add_argument("--region", default=DEFAULT_REGION, help="Target region")
    parser.add_argument(
        "--max-leads",
        type=int,
        default=DEFAULT_MAX_LEADS,
        help="Max leads per industry",
    )
    args = parser.parse_args()

    industries = None
    if args.industries:
        industries = [s.strip() for s in args.industries.split(",") if s.strip()]

    results = asyncio.run(run_cycle(industries, args.region, args.max_leads))

    print(json.dumps(results["summary"], indent=2))


if __name__ == "__main__":
    main()
