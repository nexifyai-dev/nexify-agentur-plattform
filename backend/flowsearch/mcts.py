# FILE: /backend/flowsearch/mcts.py
"""UCT/MCTS-lite over operator sequences (AFlow-inspired, offline)."""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field

from .evaluator import evaluate
from .operators import REQUIRED_IDS, load_register
from .workflow import Workflow

EXPANDABLE = ("generate", "structure", "critique", "revise", "ensemble", "verify", "secret_scan")


@dataclass
class Node:
    steps: tuple[str, ...]
    parent: "Node | None" = None
    children: list["Node"] = field(default_factory=list)
    visits: int = 0
    value_sum: float = 0.0

    @property
    def mean(self) -> float:
        return self.value_sum / self.visits if self.visits else 0.0


def _uct(node: Node, child: Node, c: float = 1.2) -> float:
    if child.visits == 0:
        return float("inf")
    return child.mean + c * math.sqrt(math.log(node.visits + 1) / child.visits)


def _expand(node: Node, rng: random.Random) -> Node:
    reg = load_register()
    used = set(node.steps)
    candidates = [op for op in EXPANDABLE if op in reg and op not in used]
    if not candidates:
        # allow terminate / no-op child = same steps
        child = Node(steps=node.steps, parent=node)
        node.children.append(child)
        return child
    pick = rng.choice(candidates)
    # insert before evidence if present, else append
    steps = list(node.steps)
    if "evidence" in steps:
        idx = steps.index("evidence")
        steps.insert(idx, pick)
    else:
        steps.append(pick)
    child = Node(steps=tuple(steps), parent=node)
    node.children.append(child)
    return child


def search(iterations: int = 40, seed: int = 7, lambda_cost: float = 0.08) -> dict:
    rng = random.Random(seed)
    root = Node(steps=tuple(REQUIRED_IDS[:2] + ("generate",) + REQUIRED_IDS[2:]))
    # root already has brain_first, docs_first, generate, evidence
    best_score = -1e9
    best_wf: list[str] = list(root.steps)
    trajectory: list[dict] = []

    for i in range(iterations):
        node = root
        # select
        while node.children and all(c.visits > 0 for c in node.children):
            node = max(node.children, key=lambda ch: _uct(node, ch))
        # expand
        if node.visits > 0 or node is root:
            node = _expand(node, rng)
        # evaluate
        wf = Workflow(steps=list(node.steps)).ensure_gates()
        result = evaluate(wf, lambda_cost=lambda_cost)
        score = result["mean_score"]
        # backup
        cur: Node | None = node
        while cur is not None:
            cur.visits += 1
            cur.value_sum += score
            cur = cur.parent
        trajectory.append({"iter": i, "score": score, "steps": list(wf.steps)})
        if score > best_score:
            best_score = score
            best_wf = list(wf.steps)

    final = evaluate(Workflow(steps=best_wf), lambda_cost=lambda_cost)
    return {
        "best_score": best_score,
        "best_workflow": final["workflow"],
        "evaluation": final,
        "iterations": iterations,
        "trajectory_tail": trajectory[-5:],
    }
