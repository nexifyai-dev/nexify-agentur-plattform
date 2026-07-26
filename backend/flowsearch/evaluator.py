# FILE: /backend/flowsearch/evaluator.py
from __future__ import annotations

from .reward import score_state
from .workflow import Workflow

# Minimal NeXify-flavored smoke tasks (offline, no customer PII)
SMOKE_TASKS = [
    {
        "id": "offer_json",
        "topic": "KI-Beratung Angebot",
        "require_json": True,
        "required_keys": ["summary", "items", "assumptions", "next_steps", "price_hint_eur"],
    },
    {
        "id": "chat_blurb",
        "topic": "Website Chat Antwort",
        "require_json": False,
        "min_chars": 60,
    },
]


def evaluate(workflow: Workflow, tasks: list[dict] | None = None, lambda_cost: float = 0.08) -> dict:
    wf = Workflow(steps=list(workflow.steps)).ensure_gates()
    tasks = tasks or SMOKE_TASKS
    scores = []
    details = []
    for task in tasks:
        state = wf.run(task)
        sc = score_state(state, task, wf.cost(), lambda_cost=lambda_cost)
        scores.append(sc)
        details.append({"task": task["id"], "score": sc, "trace": state.get("trace"), "verified": state.get("verified")})
    mean = sum(scores) / max(len(scores), 1)
    return {"mean_score": mean, "cost": wf.cost(), "details": details, "workflow": wf.as_dict()}
