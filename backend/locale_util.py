# FILE: backend/locale_util.py
# NIR: 02.08.2026 09:50
# UPDATED: 02.08.2026 09:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Backend
# WHAT: Accept-Language Parser — Default immer Deutsch (de)
# WHY: DACH-first; NL/EN nur bei explizitem Client-Wunsch
# BEST-PRACTICE: q-Werte respektieren, aber fehlender Header → de
# PITFALL: Browser-NL am Firmensitz darf Acquisition nicht umbiegen (Website-Middleware)
# DEPENDS: Starlette Request headers
# DOCS-REF: docs/operations/LOCALE-DE-STANDARD.md
# SESSION: locale-de-standard-7dd5

"""Locale helpers for NeXify backend (default: German)."""

from __future__ import annotations

SUPPORTED = ("de", "en", "nl")
DEFAULT_LOCALE = "de"


def parse_accept_language(header: str | None, default: str = DEFAULT_LOCALE) -> str:
    """Pick best supported locale from Accept-Language; default German."""
    if not header or not header.strip():
        return default

    candidates: list[tuple[float, str]] = []
    for part in header.split(","):
        raw = part.strip()
        if not raw:
            continue
        token, _, rest = raw.partition(";")
        lang = token.strip().lower().replace("_", "-")
        primary = lang.split("-", 1)[0]
        q = 1.0
        if "q=" in rest:
            try:
                q = float(rest.split("q=", 1)[1].split(",")[0].strip())
            except ValueError:
                q = 0.0
        if primary in SUPPORTED:
            candidates.append((q, primary))

    if not candidates:
        return default
    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates[0][1]
