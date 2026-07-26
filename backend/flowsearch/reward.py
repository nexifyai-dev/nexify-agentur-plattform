# FILE: /backend/flowsearch/reward.py
"""Reward = quality − λ·cost − gate penalties (AFlow cost-awareness + NeXify gates)."""

from __future__ import annotations

import json
from typing import Any


def score_state(state: dict[str, Any], task: dict[str, Any], workflow_cost: float, lambda_cost: float = 0.08) -> float:
    quality = 0.0

    # Gate rewards
    if state.get("brain_ok"):
        quality += 0.15
    else:
        quality -= 0.5
    if state.get("docs_ok"):
        quality += 0.15
    else:
        quality -= 0.5
    if state.get("evidence"):
        quality += 0.15
    else:
        quality -= 0.35

    if task.get("require_json"):
        try:
            obj = json.loads(state.get("text") or "")
            keys = task.get("required_keys", [])
            hit = sum(1 for k in keys if k in obj)
            quality += 0.4 * (hit / max(len(keys), 1))
            if state.get("verified"):
                quality += 0.25
            if state.get("revised"):
                quality += 0.1
        except Exception:
            quality -= 0.4
    else:
        text = state.get("text") or ""
        if len(text) >= int(task.get("min_chars", 40)):
            quality += 0.35
        if "NeXify" in text:
            quality += 0.15

    if state.get("secret_clean") is False:
        quality -= 1.0

    return quality - lambda_cost * workflow_cost
