# FILE: /backend/flowsearch/workflow.py
from __future__ import annotations

from dataclasses import dataclass, field

from .operators import REQUIRED_IDS, apply_operator, load_register


@dataclass
class Workflow:
    steps: list[str] = field(default_factory=list)

    def ensure_gates(self) -> "Workflow":
        """Guarantee required NeXify gate operators are present (order-preserving)."""
        steps = list(self.steps)
        for req in REQUIRED_IDS:
            if req not in steps:
                # gates at start/end: brain/docs first, evidence last
                if req == "evidence":
                    steps.append(req)
                else:
                    steps.insert(0, req)
        # de-dupe while preserving order
        seen: set[str] = set()
        uniq: list[str] = []
        for s in steps:
            if s not in seen:
                seen.add(s)
                uniq.append(s)
        self.steps = uniq
        return self

    def cost(self) -> float:
        reg = load_register()
        return sum(reg[s].cost_weight for s in self.steps if s in reg)

    def run(self, task: dict) -> dict:
        state: dict = {"text": "", "trace": []}
        for op_id in self.steps:
            state = apply_operator(op_id, state, task)
        return state

    def as_dict(self) -> dict:
        return {"steps": list(self.steps), "cost": self.cost()}
