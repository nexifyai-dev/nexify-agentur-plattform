# FILE: /scripts/outreach/firecrawl_client.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Local Firecrawl OSS enrich client (scrape public company pages)
# WHY: Optional enrichment before outreach; fail-open if Firecrawl down
# BEST-PRACTICE: Prefer FIRECRAWL_URL=http://127.0.0.1:3003 (host→container map)
# PITFALL: V-OUT-04: FIRECRAWL_URL may point at :3002 (container-internal) — use :3003 from host
# DEPENDS: FIRECRAWL_URL, optional FIRECRAWL_API_KEY
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from typing import Any

logger = logging.getLogger("nexify.outreach.firecrawl")


def _headers(api_key: str) -> dict[str, str]:
    h = {"Content-Type": "application/json", "Accept": "application/json"}
    if api_key:
        h["Authorization"] = f"Bearer {api_key}"
    return h


def health(base_url: str, timeout: float = 5.0) -> bool:
    url = base_url.rstrip("/") + "/"
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return 200 <= resp.status < 500
    except Exception as e:
        logger.info("firecrawl health failed: %s", e)
        return False


def scrape(
    base_url: str,
    target_url: str,
    *,
    api_key: str = "",
    timeout: float = 45.0,
) -> dict[str, Any]:
    """POST /v1/scrape — returns markdown/summary snippet or empty dict on failure."""
    if not target_url or not target_url.startswith("http"):
        return {}
    endpoint = base_url.rstrip("/") + "/v1/scrape"
    body = json.dumps(
        {
            "url": target_url,
            "formats": ["markdown"],
            "onlyMainContent": True,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        endpoint, data=body, headers=_headers(api_key), method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            payload = json.loads(resp.read().decode("utf-8", errors="replace"))
    except urllib.error.HTTPError as e:
        logger.warning("firecrawl scrape HTTP %s for %s", e.code, target_url)
        return {"error": f"http_{e.code}"}
    except Exception as e:
        logger.warning("firecrawl scrape failed for %s: %s", target_url, e)
        return {"error": str(e)[:120]}

    data = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(data, dict):
        data = payload if isinstance(payload, dict) else {}
    md = data.get("markdown") or data.get("content") or ""
    title = (data.get("metadata") or {}).get("title") if isinstance(data.get("metadata"), dict) else ""
    summary = " ".join(str(md).split())[:400]
    return {
        "title": title or "",
        "summary": summary,
        "ok": bool(summary),
    }


def enrich_lead(
    lead: dict[str, Any],
    *,
    base_url: str,
    api_key: str = "",
) -> dict[str, Any]:
    """Attach enrichment_summary from website/source_url if missing."""
    if lead.get("enrichment_summary"):
        return lead
    target = lead.get("website") or lead.get("source_url") or ""
    result = scrape(base_url, target, api_key=api_key)
    if result.get("ok"):
        lead = dict(lead)
        title = result.get("title") or ""
        lead["enrichment_summary"] = (
            f"{title}: {result['summary']}" if title else result["summary"]
        )
    return lead
