# FILE: backend/lifecycle.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Pure offer lifecycle phase helpers (offline-testable).
# WHY: Kundenportal Auftrag-Status without FastAPI/DB imports in unit lane.
# BEST-PRACTICE: No I/O; deterministic derivation.
# PITFALL: Keep phase IDs in sync with portal API.
# DEPENDS: none
# DOCS-REF: apps/website/components/portal-project-panel.tsx
# SESSION: website-gesamtkonzept-kundenportal-7dd5

from __future__ import annotations

LIFECYCLE_PHASES = (
    "anfrage",
    "angebot",
    "freigabe",
    "umsetzung",
    "abnahme",
    "rechnung",
)

DEFAULT_ACCOUNT_MANAGER = {
    "name": "Pascal Courbois",
    "email": "mail@nexifyai.cloud",
    "phone": "+31 6 133 188 56",
    "role": "Account Manager",
}


def derive_lifecycle_phase(row) -> str:
    """Derive phase from explicit column or offer/payment status."""
    try:
        explicit = row["lifecycle_phase"]
    except Exception:
        explicit = None
    if explicit in LIFECYCLE_PHASES:
        return explicit
    try:
        status = (row["status"] or "").lower()
    except Exception:
        status = ""
    try:
        pay = (row["payment_status"] or "").lower()
    except Exception:
        pay = ""
    if pay == "completed":
        return "umsetzung"
    if status == "accepted":
        return "freigabe"
    if status in ("sent", "followed_up"):
        return "angebot"
    return "anfrage"


def lifecycle_timeline(current: str) -> list:
    labels_de = {
        "anfrage": "Anfrage",
        "angebot": "Angebot",
        "freigabe": "Freigabe",
        "umsetzung": "Umsetzung",
        "abnahme": "Abnahme",
        "rechnung": "Rechnung",
    }
    try:
        idx = LIFECYCLE_PHASES.index(current)
    except ValueError:
        idx = 0
    out = []
    for i, phase in enumerate(LIFECYCLE_PHASES):
        state = "done" if i < idx else ("current" if i == idx else "upcoming")
        out.append({"id": phase, "label": labels_de[phase], "state": state})
    return out
