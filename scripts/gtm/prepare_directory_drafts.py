#!/usr/bin/env python3
# FILE: scripts/gtm/prepare_directory_drafts.py
# NIR: 02.08.2026 09:30
# UPDATED: 02.08.2026 09:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Erzeugt Draft-Listing-Texte für die nächsten Free-Verzeichnisse
# WHY: Weekly Automation kann PRs öffnen ohne CURSOR_API_KEY / ohne Human-Captcha
# BEST-PRACTICE: NAP aus Master; nur ready_to_submit; keine Secrets
# PITFALL: V-GTM-FREE-02: Status live nur nach Evidence-URL, nie raten
# DEPENDS: docs/gtm/NAP_MASTER_V1.md, OFFER_SNIPPETS_de.md, CHANNEL_REGISTER
# DOCS-REF: docs/gtm/DIRECTORY_SUBMISSION_CHECKLIST.md
# SESSION: free-acquisition-dach-7dd5
"""Prepare directory listing drafts for free DACH acquisition."""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GTM = ROOT / "docs" / "gtm"
EV1 = GTM / "evidence" / "supply-wave1"
EV2 = GTM / "evidence" / "supply-wave2"
OUT = GTM / "evidence" / "directory-drafts"

NAP = {
    "name": "NeXify AI",
    "street": "Graaf van Loonstraat 1E",
    "city": "5921 JA Venlo",
    "country": "Niederlande",
    "phone": "+31 6 133 188 56",
    "email": "mail@nexifyai.cloud",
    "website_base": "https://www.nexifyai.cloud/",
}

# id, name, portal, utm, wave, human_needed
CHANNELS: list[tuple[str, str, str, str, int, bool]] = [
    ("S05", "wlw", "https://www.wlw.de/de/supplier-registration", "wlw", 1, True),
    ("S06", "Gelbe Seiten", "https://www.gelbeseiten.de/starteintrag", "gelbe_seiten", 1, True),
    ("S07", "Das Örtliche", "https://www.dasoertliche.de/", "das_oertliche", 1, True),
    ("S08", "Cylex", "https://web2.cylex.de/", "cylex", 1, False),
    ("S09", "Hotfrog DE", "https://www.hotfrog.de/", "hotfrog", 1, True),
    ("S10", "Firmeneintrag.de", "https://firmeneintrag.de/", "firmeneintrag", 1, False),
    ("S11", "Dienstleistungen24", "https://dienstleistungen24.de/", "dienstleistungen24", 1, True),
    ("S12", "Bizin NL", "https://nl.bizin.eu/nld/", "bizin_nl", 1, True),
    ("S13", "Handelsgids.be", "https://www.handelsgids.be/zaak-aanmelden/", "handelsgids", 1, False),
    ("S14", "Business Vlaanderen", "https://businessvlaanderen.be/aanmelden/", "business_vlaanderen", 1, False),
    ("S15", "Clutch", "https://clutch.co/", "clutch", 1, True),
    ("S16", "Sortlist", "https://www.sortlist.com/", "sortlist", 1, True),
    ("S17", "freelance.de", "https://www.freelance.de/", "freelance_de", 1, True),
    ("S18", "freelancermap", "https://www.freelancermap.de/", "freelancermap", 1, True),
    ("S19", "ProvenExpert", "https://www.provenexpert.com/", "provenexpert", 1, True),
    ("S21", "11880", "https://www.11880.com/", "11880", 2, True),
    ("S22", "GoYellow", "https://www.goyellow.de/", "goyellow", 2, True),
    ("S23", "Yelp DE", "https://www.yelp.de/", "yelp", 2, True),
    ("S24", "Bing Places", "https://www.bingplaces.com/", "bing_places", 2, True),
    ("S25", "Apple Business Connect", "https://businessconnect.apple.com/", "apple_business", 2, True),
    ("S26", "Branchenverzeichnis.org", "https://www.branchenverzeichnis.org/", "branchenverzeichnis", 2, False),
    ("S27", "Kennstdueinen", "https://www.kennstdueinen.de/", "kennstdueinen", 2, False),
    ("S28", "Stadtbranchenbuch", "https://www.stadtbranchenbuch.de/", "stadtbranchenbuch", 2, False),
    ("S29", "Europages", "https://www.europages.de/", "europages", 2, True),
    ("S30", "opensourceprojects.dev", "https://opensourceprojects.dev/", "opensourceprojects", 2, True),
    ("S31", "Indie Hackers", "https://www.indiehackers.com/", "indiehackers", 2, True),
    ("S32", "Product Hunt", "https://www.producthunt.com/", "producthunt", 2, True),
]


def brand_short() -> str:
    path = GTM / "OFFER_SNIPPETS_de.md"
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    # Prefer NAP short description fallback
    nap = GTM / "NAP_MASTER_V1.md"
    if nap.exists():
        m = re.search(
            r"## Kurzbeschreibung \(DE[^\n]*\n\n(.+)",
            nap.read_text(encoding="utf-8"),
        )
        if m:
            return m.group(1).strip().split("\n")[0][:300]
    return (
        "NeXify AI entwickelt Premium-Websites, Onlineshops, Web-Apps und "
        "AI-Automatisierungen für Unternehmen in DACH und den Niederlanden – "
        "persönlich verantwortet, AI-gestützt, zum festen Tagessatz von 449 € netto."
    )


def evidence_status(cid: str, wave: int) -> str:
    folder = EV1 if wave == 1 else EV2
    if not folder.exists():
        return "missing"
    matches = list(folder.glob(f"{cid}-*.md"))
    if not matches:
        return "missing"
    body = matches[0].read_text(encoding="utf-8")
    m = re.search(r"\*\*Status:\*\*\s*`([^`]+)`", body)
    return (m.group(1) if m else "unknown").strip()


def pick_next(limit: int) -> list[tuple[str, str, str, str, int, bool]]:
    out: list[tuple[str, str, str, str, int, bool]] = []
    for row in CHANNELS:
        st = evidence_status(row[0], row[4])
        if st in {"ready_to_submit", "missing", "unknown"}:
            out.append(row)
        if len(out) >= limit:
            break
    return out


def render_draft(row: tuple[str, str, str, str, int, bool], short: str) -> str:
    cid, name, portal, utm, wave, human = row
    website = (
        f"{NAP['website_base']}?utm_source={utm}"
        f"&utm_medium=listing&utm_campaign=brand"
    )
    return f"""# Draft Listing — {cid} {name}

**Generated:** {dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%MZ")}  
**Wave:** {wave}  
**Status:** ready_to_submit  
**Portal:** {portal}  
**utm_source:** `{utm}`  
**Human nötig:** {"ja (Login/Captcha/Verify)" if human else "meist nein — Agent/Owner kann submitten"}

## Copy-Paste Felder

| Feld | Wert |
|------|------|
| Name | {NAP["name"]} |
| Straße | {NAP["street"]} |
| PLZ Ort | {NAP["city"]} |
| Land | {NAP["country"]} |
| Telefon | {NAP["phone"]} |
| E-Mail | {NAP["email"]} |
| Website | {website} |
| Kategorie | Webentwicklung / Digitalagentur / IT-Dienstleistungen |
| Kurzbeschreibung | {short} |

## Human-Schritte

1. Portal öffnen: {portal}
2. Nur Free/Basic wählen — Premium ablehnen
3. Felder einfügen (NAP exakt)
4. Captcha / E-Mail-Confirm falls nötig
5. Evidence aktualisieren: `docs/gtm/evidence/supply-wave{wave}/{cid}-*.md`
6. Channel-Register Status → `submitted` / später `live`

## Warnungen

- Gelbe Seiten: **kein** Starteintrag-Abo
- Keine Secrets committen
- Kein Spam in Communities (S31/S32 = Value first)
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--limit", type=int, default=3)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    short = brand_short()
    picked = pick_next(args.limit)
    if not picked:
        print("no_channels_pending")
        return 0

    OUT.mkdir(parents=True, exist_ok=True)
    week = dt.datetime.now(dt.timezone.utc).strftime("%Y-W%W")
    paths: list[Path] = []
    for row in picked:
        path = OUT / f"{week}_{row[0]}_{row[3]}.md"
        body = render_draft(row, short)
        if args.dry_run:
            print(f"dry_run {path.name}")
        else:
            path.write_text(body, encoding="utf-8")
            print(f"wrote {path.relative_to(ROOT)}")
        paths.append(path)

    index = OUT / f"{week}_INDEX.md"
    lines = [
        f"# Directory Drafts {week}",
        "",
        f"Generated {dt.datetime.now(dt.timezone.utc).isoformat()}",
        "",
        "Nächste Free-Listings (Agent-Draft → Human ggf. Submit):",
        "",
    ]
    for p, row in zip(paths, picked):
        lines.append(f"- [{row[0]} {row[1]}]({p.name}) — human={row[5]}")
    lines.append("")
    lines.append("Siehe `docs/gtm/FREE-ACQUISITION-PLAYBOOK-DACH.md`.")
    lines.append("")
    if not args.dry_run:
        index.write_text("\n".join(lines), encoding="utf-8")
        print(f"wrote {index.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
