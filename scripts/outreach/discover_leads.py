#!/usr/bin/env python3
# FILE: /scripts/outreach/discover_leads.py
# NIR: 02.08.2026 11:10
# UPDATED: 02.08.2026 11:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Discover public B2B contact emails from seed websites → outreach queue
# WHY: Zero-cost lead pipeline; Impressum/Kontakt only (research / warm path)
# BEST-PRACTICE: Public pages only; NEVER set consent/send_allowed for cold email
# PITFALL: V-OUT-DISC-01/UWG-01: Discovery ≠ send permission (§7 UWG)
# DEPENDS: stdlib urllib
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: neukunden-max-zero-cost-7dd5

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from outreach.config import REPO_ROOT, load_config  # noqa: E402

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
SKIP_DOMAINS = {
    "example.com",
    "example.org",
    "sentry.io",
    "wixpress.com",
    "schema.org",
    "nexifyai.cloud",
}
CONTACT_PATHS = ("/impressum", "/kontakt", "/contact", "/imprint", "/")


def _fetch(url: str, timeout: int = 12) -> str:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "NeXifyAI-LeadDiscover/1.0 (+https://www.nexifyai.cloud)"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read(500_000)
    return raw.decode("utf-8", errors="replace")


def _emails_from_html(html: str) -> list[str]:
    found: list[str] = []
    for m in EMAIL_RE.finditer(html):
        email = m.group(0).lower().rstrip(".")
        domain = email.split("@", 1)[-1]
        if domain in SKIP_DOMAINS:
            continue
        if any(x in email for x in (".png", ".jpg", ".css", ".js")):
            continue
        local = email.split("@", 1)[0]
        if local in {"noreply", "no-reply", "mailer-daemon"}:
            continue
        if email not in found:
            found.append(email)
    return found


def discover_one(website: str) -> dict | None:
    base = website.rstrip("/")
    if not base.startswith("http"):
        base = "https://" + base
    emails: list[str] = []
    source_url = base
    for path in CONTACT_PATHS:
        url = base + path if path != "/" else base
        try:
            html = _fetch(url)
        except (urllib.error.URLError, TimeoutError, ValueError):
            continue
        emails = _emails_from_html(html)
        if emails:
            source_url = url
            break
    if not emails:
        return None
    email = emails[0]
    host = urllib.request.urlparse(base).hostname or base
    return {
        "id": f"disc-{host}-{email.split('@')[0]}",
        "email": email,
        "company": host.replace("www.", ""),
        "website": base,
        "source": "discover_public_impressum",
        "source_url": source_url,
        "source_type": "public_b2b",
        # §7 UWG: discovery is NOT consent — mail only after express opt-in
        "legal_basis": "none_pending_opt_in",
        "consent": False,
        "consent_recorded_at": None,
        "status": "scraped",
        "send_allowed": False,
        "service_slug": "ai-begleiter",
        "contact_reason": (
            "Öffentliche Impressum-/Kontaktseite — NUR Recherche/Warm-Intro; "
            "kein Cold-Mail ohne Einwilligung (§7 UWG)"
        ),
        "template": "ai_begleiter",
        "discovered_at": datetime.now(timezone.utc).isoformat(),
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Discover public B2B leads → queue")
    p.add_argument(
        "--seed",
        default=str(REPO_ROOT / "scripts/outreach/fixtures/seed_websites.txt"),
    )
    p.add_argument("--limit", type=int, default=20)
    p.add_argument("--out", default="")
    args = p.parse_args(argv)

    seed_path = Path(args.seed)
    if not seed_path.is_file():
        print(f"missing seed file: {seed_path}", file=sys.stderr)
        return 2

    websites = [
        ln.strip()
        for ln in seed_path.read_text(encoding="utf-8").splitlines()
        if ln.strip() and not ln.strip().startswith("#")
    ][: max(1, args.limit)]

    cfg = load_config()
    cfg.queue_dir.mkdir(parents=True, exist_ok=True)
    cfg.state_dir.mkdir(parents=True, exist_ok=True)
    out = Path(args.out) if args.out else (
        cfg.queue_dir / f"discovered-{datetime.now(timezone.utc).strftime('%Y%m%d')}.jsonl"
    )
    out.parent.mkdir(parents=True, exist_ok=True)

    leads: list[dict] = []
    for site in websites:
        lead = discover_one(site)
        if lead:
            leads.append(lead)
            print(f"ok {site} -> [redacted]@{lead['email'].split('@')[1]}")
        else:
            print(f"skip {site}")

    with out.open("w", encoding="utf-8") as f:
        for lead in leads:
            f.write(json.dumps(lead, ensure_ascii=False) + "\n")

    print(json.dumps({"written": len(leads), "out": str(out)}, ensure_ascii=False))
    return 0 if leads else 1


if __name__ == "__main__":
    raise SystemExit(main())
