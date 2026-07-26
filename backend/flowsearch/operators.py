# FILE: /backend/flowsearch/operators.py
"""Load and apply NeXify operator register (offline-safe)."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
REGISTER_PATH = ROOT / "docs/research/operators/NEXIFY_OPERATOR_REGISTER_V1.json"


@dataclass(frozen=True)
class Operator:
    id: str
    family: str
    required: bool
    description: str
    cost_weight: float


def load_register(path: Path | None = None) -> dict[str, Operator]:
    data = json.loads((path or REGISTER_PATH).read_text(encoding="utf-8"))
    out: dict[str, Operator] = {}
    for raw in data["operators"]:
        op = Operator(
            id=raw["id"],
            family=raw["family"],
            required=bool(raw.get("required")),
            description=raw.get("description", ""),
            cost_weight=float(raw.get("cost_weight", 1.0)),
        )
        out[op.id] = op
    return out


REQUIRED_IDS = ("brain_first", "docs_first", "evidence")


def apply_operator(op_id: str, state: dict[str, Any], task: dict[str, Any]) -> dict[str, Any]:
    """Deterministic offline semantics for each operator."""
    s = dict(state)
    s.setdefault("trace", [])
    s["trace"] = list(s["trace"]) + [op_id]
    text = s.get("text", "")

    if op_id == "brain_first":
        s["brain_ok"] = True
    elif op_id == "docs_first":
        s["docs_ok"] = True
    elif op_id == "generate":
        # Seed draft from task prompt keywords
        topic = task.get("topic", "angebot")
        s["text"] = (
            f"NeXify AI — Entwurf für {topic}. "
            "Wir automatisieren Beratung, Angebot und Umsetzung. "
            "Preisrahmen abhängig vom Scope."
        )
        s["drafts"] = 1
    elif op_id == "structure":
        # Produce JSON-ish structure required by smoke tasks
        s["text"] = json.dumps(
            {
                "summary": (text or "NeXify Automatisierung")[:180],
                "items": [{"name": "Discovery", "days_min": 2, "days_max": 3}],
                "assumptions": ["Scope klar", "Ansprechpartner verfügbar"],
                "next_steps": ["Kickoff", "Ist-Analyse"],
                "price_hint_eur": 2997,
            },
            ensure_ascii=False,
        )
        s["structured"] = True
    elif op_id == "critique":
        s["critique"] = "Prüfe Strukturfelder und Kundenton."
        s["needs_revise"] = "price_hint_eur" not in (s.get("text") or "")
    elif op_id == "revise":
        if s.get("structured") or (s.get("text") or "").strip().startswith("{"):
            try:
                obj = json.loads(s["text"])
            except Exception:
                obj = {"summary": s.get("text", ""), "items": [], "assumptions": [], "next_steps": []}
            obj.setdefault("price_hint_eur", 2997)
            obj["summary"] = (obj.get("summary") or "") + " (revidiert)"
            s["text"] = json.dumps(obj, ensure_ascii=False)
        else:
            s["text"] = (text or "") + " Überarbeitet: klarer CTA und nächste Schritte."
        s["revised"] = True
    elif op_id == "ensemble":
        s["drafts"] = int(s.get("drafts", 1)) + 2
        s["text"] = (text or "Entwurf") + " [ensemble-merge]"
    elif op_id == "verify":
        ok = True
        if task.get("require_json"):
            try:
                obj = json.loads(s.get("text") or "")
                for key in task.get("required_keys", []):
                    if key not in obj:
                        ok = False
            except Exception:
                ok = False
        s["verified"] = ok
    elif op_id == "evidence":
        s["evidence"] = {
            "what": task.get("id", "task"),
            "trace": s.get("trace"),
            "verified": s.get("verified"),
        }
    elif op_id == "secret_scan":
        blob = s.get("text") or ""
        s["secret_clean"] = not bool(re.search(r"sk-[A-Za-z0-9]{10,}|BEGIN OPENSSH PRIVATE KEY", blob))
    else:
        raise KeyError(f"unknown operator: {op_id}")
    return s
