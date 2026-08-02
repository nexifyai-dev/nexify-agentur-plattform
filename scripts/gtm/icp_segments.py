# FILE: /scripts/gtm/icp_segments.py
# NIR: 02.08.2026 11:00
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Shared ICP segment definitions for discover/mail
# WHY: Single SoT for Top-ICPs
# BEST-PRACTICE: Public sources only; slug matches /branchen/[slug]
# PITFALL: V-ICP-02: Do not scrape behind logins or buy lists
# DEPENDS: docs/gtm/ICP-HIGH-DEMAND-2026.md
# DOCS-REF: scripts/gtm/icp_lead_discover.py
# SESSION: icp-demand-competitor-copy-7dd5

from __future__ import annotations

from typing import Any

DAY_RATE_EUR = 449

ICP_SEGMENTS: dict[str, dict[str, Any]] = {
    "handwerk": {
        "rank": 1,
        "label": "Handwerk / Bau-KMU",
        "score_hint": 4.75,
        "keywords": [
            "Handwerksbetrieb", "SHK", "Elektroinstallateur",
            "Malerbetrieb", "Tischlerei", "Sanitär Heizung", "Dachdecker",
        ],
        "search_queries": [
            "Handwerksbetrieb Impressum Kontakt email Deutschland",
            "SHK Betrieb Website Angebot online NRW",
            "Elektroinstallateur KMU Digitalisierung",
            "site:hwk.de Mitgliederverzeichnis",
            "Handwerk Betriebsseite Kontaktformular",
        ],
        "directory_seeds": [
            "https://www.handwerkskammer.de/",
            "https://www.zdh.de/",
            "https://www.gelbe-seiten.de/branchenbuch/handwerk",
        ],
        "exclude": ["Großkonzern", "Zeitarbeit", "Franchise-Zentrale only"],
        "landing": "/branchen/handwerk",
    },
    "steuerberater": {
        "rank": 2,
        "label": "Steuerberater / Kanzleien",
        "score_hint": 4.50,
        "keywords": [
            "Steuerberater", "Steuerberatung", "Wirtschaftsprüfung KMU",
            "Buchhaltungsbüro", "Lohnbuchhaltung Kanzlei",
        ],
        "search_queries": [
            "Steuerberater Kanzlei Impressum email",
            "Steuerberatung Digitalisierung Belege",
            "Steuerberater KMU DATEV Automation",
            "site:dstv.de",
            "Buchhaltungsbüro Kontakt B2B",
        ],
        "directory_seeds": [
            "https://www.dstv.de/",
            "https://www.steuerberater.de/",
            "https://www.gelbe-seiten.de/branchenbuch/steuerberater",
        ],
        "exclude": ["Big4 Enterprise-only RFP", "Verbraucher-Steuer-App"],
        "landing": "/branchen/steuerberater",
    },
    "agenturen": {
        "rank": 3,
        "label": "Marketing-/Digital-Agenturen",
        "score_hint": 4.40,
        "keywords": [
            "Digitalagentur", "Online-Marketing Agentur", "Webdesign Agentur",
            "Performance Marketing", "Creative Agency DACH",
        ],
        "search_queries": [
            "Digitalagentur Impressum Deutschland",
            "Online Marketing Agentur Partner KI",
            "Webagentur White Label Entwicklung",
            "Performance Agentur Kontakt",
            "Creative Agency DACH Overflow Delivery",
        ],
        "directory_seeds": [
            "https://www.agenturmatching.de/",
            "https://www.sortlist.de/",
            "https://www.gelbe-seiten.de/branchenbuch/werbeagentur",
        ],
        "exclude": ["Pure Media Buying ohne Delivery", "Personalvermittlung"],
        "landing": "/branchen/agenturen",
    },
}

TOP3_SLUGS = ("handwerk", "steuerberater", "agenturen")


def get_segment(slug: str) -> dict[str, Any]:
    if slug not in ICP_SEGMENTS:
        raise KeyError(f"unknown icp slug: {slug}")
    return ICP_SEGMENTS[slug]


def list_top_slugs(n: int = 3) -> list[str]:
    ranked = sorted(ICP_SEGMENTS.items(), key=lambda x: x[1]["rank"])
    return [s for s, _ in ranked[:n]]
