# FILE: /scripts/leads/discover.py
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Discover DACH SMB/agency targets from public Kontakt/Impressum pages
# WHY: Seed compliant B2B outreach without paid lists or personal leak emails
# BEST-PRACTICE: Prefer info@/kontakt@ on company domains; store URL + role hypothesis
# PITFALL: V-LEAD-03: No Firecrawl LLM loops; plain HTTP + regex only
# DEPENDS: schema.py; optional urllib; seeds JSON
# DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md
# SESSION: zero-cost-leads-mailing-7dd5

from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

from .schema import EMAIL_RE, is_business_email, normalize_lead, validate_for_queue

USER_AGENT = "NeXifyAI-LeadDiscover/1.0 (+https://www.nexifyai.cloud; B2B research)"
KONTAKT_PATHS = (
    "/kontakt", "/contact", "/impressum", "/imprint",
    "/about", "/ueber-uns", "/unternehmen", "/firma",
)
MAILTO_RE = re.compile(r"mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})", re.I)
GENERIC_LOCALS = {
    "info", "kontakt", "contact", "office", "hello", "mail",
    "team", "anfrage", "sales", "vertrieb",
}


def _fetch(url: str, timeout: float = 12.0) -> str | None:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            if resp.status >= 400:
                return None
            raw = resp.read(500_000)
            charset = resp.headers.get_content_charset() or "utf-8"
            return raw.decode(charset, errors="replace")
    except (urllib.error.URLError, TimeoutError, ValueError, ssl.SSLError):
        return None


def extract_emails(html: str, company_domain: str | None = None) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    for m in MAILTO_RE.finditer(html or ""):
        em = m.group(1).lower().strip().rstrip(".")
        if em not in seen and is_business_email(em):
            seen.add(em)
            found.append(em)
    for m in EMAIL_RE.finditer(html or ""):
        em = m.group(0).lower().strip().rstrip(".")
        if em in seen or not is_business_email(em):
            continue
        if company_domain and not em.endswith("@" + company_domain):
            local = em.split("@", 1)[0]
            if local not in GENERIC_LOCALS:
                continue
        seen.add(em)
        found.append(em)
    return found


def discover_from_website(
    website: str,
    *,
    company: str = "",
    region: str = "DACH",
    service_slug: str = "ai-agenten",
    role_hypothesis: str = "Geschäftsführung / Marketing",
    contact_reason: str = "",
    do_not_mail: bool = False,
    pause_sec: float = 0.4,
) -> dict[str, Any]:
    base = website.strip()
    if not base.startswith("http"):
        base = "https://" + base
    parsed = urlparse(base)
    domain = parsed.netloc.lower().removeprefix("www.")
    pages = [base.rstrip("/")]
    for path in KONTAKT_PATHS:
        pages.append(urljoin(base.rstrip("/") + "/", path.lstrip("/")))

    emails: list[str] = []
    source_url = base
    for url in pages:
        html = _fetch(url)
        time.sleep(pause_sec)
        if not html:
            continue
        found = extract_emails(html, company_domain=domain)
        if found:
            emails.extend(found)
            source_url = url
            break

    uniq: list[str] = []
    for e in emails:
        if e not in uniq:
            uniq.append(e)
    email = uniq[0] if uniq else ""

    return normalize_lead(
        {
            "company": company or domain.split(".")[0].title(),
            "website": base,
            "email": email,
            "role_hypothesis": role_hypothesis,
            "source": "public_website_kontakt",
            "source_type": "public_website",
            "source_url": source_url,
            "region": region,
            "service_slug": service_slug,
            "contact_reason": contact_reason
            or f"Öffentliche Kontaktseite {source_url} — B2B AI-/Web-Angebot.",
            "status": "researched" if email else "new",
            "send_allowed": False,
            "do_not_mail": do_not_mail,
            "notes": f"emails_found={len(uniq)}",
        }
    )


def load_seed_targets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and "targets" in data:
        return [x for x in data["targets"] if isinstance(x, dict)]
    if isinstance(data, list):
        return [x for x in data if isinstance(x, dict)]
    raise ValueError("seed file must be list or {targets:[...]}")


def discover_from_seeds(
    seed_path: Path,
    *,
    limit: int = 25,
    pause_sec: float = 0.4,
) -> list[dict[str, Any]]:
    targets = load_seed_targets(seed_path)[: max(0, limit)]
    results: list[dict[str, Any]] = []
    for t in targets:
        website = t.get("website") or t.get("url") or ""
        if not website:
            continue
        lead = discover_from_website(
            website,
            company=t.get("company") or "",
            region=t.get("region") or "DACH",
            service_slug=t.get("service_slug") or "ai-agenten",
            role_hypothesis=t.get("role_hypothesis") or "Geschäftsführung / Marketing",
            contact_reason=t.get("contact_reason") or "",
            do_not_mail=bool(t.get("do_not_mail", False)),
            pause_sec=pause_sec,
        )
        if not lead.get("email") and t.get("email") and is_business_email(t["email"]):
            lead["email"] = t["email"].strip().lower()
            lead["status"] = "researched"
            lead["source_url"] = t.get("source_url") or lead.get("source_url")
            lead["notes"] = (lead.get("notes") or "") + ";seed_email"
        if t.get("do_not_mail"):
            lead["do_not_mail"] = True
            lead["status"] = "skipped"
        reason = validate_for_queue(lead)
        if reason and reason.startswith("forbidden"):
            continue
        results.append(lead)
    return results


def github_org_about_hint(org: str) -> dict[str, Any]:
    url = f"https://api.github.com/orgs/{org}"
    html = _fetch(url)
    company = org
    blog = ""
    if html:
        try:
            data = json.loads(html)
            company = data.get("name") or org
            blog = data.get("blog") or data.get("html_url") or ""
        except json.JSONDecodeError:
            blog = f"https://github.com/{org}"
    return normalize_lead(
        {
            "company": company,
            "website": blog or f"https://github.com/{org}",
            "email": "",
            "role_hypothesis": "Engineering / Product Lead",
            "source": "github_org_about",
            "source_type": "github_org",
            "source_url": f"https://github.com/{org}",
            "region": "DACH",
            "service_slug": "web-apps",
            "contact_reason": "GitHub-Org öffentlich — Website/Kontakt nachrecherchieren.",
            "status": "new",
            "send_allowed": False,
            "do_not_mail": True,
        }
    )
