# FILE: /backend/tests/test_flowsearch.py
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from flowsearch.evaluator import evaluate
from flowsearch.mcts import search
from flowsearch.operators import load_register
from flowsearch.workflow import Workflow


def test_register_loads_and_has_gates():
    reg = load_register()
    assert "generate" in reg
    assert "brain_first" in reg
    assert reg["brain_first"].required


def test_ensure_gates_appends_missing():
    wf = Workflow(steps=["generate"]).ensure_gates()
    assert wf.steps[0] in {"brain_first", "docs_first"}
    assert "evidence" in wf.steps
    assert "generate" in wf.steps


def test_structure_verify_path_scores_high():
    wf = Workflow(steps=["brain_first", "docs_first", "generate", "structure", "verify", "evidence"])
    result = evaluate(wf)
    assert result["mean_score"] > 0.5
    assert result["details"][0]["verified"] is True


def test_mcts_improves_or_matches_baseline():
    baseline = evaluate(Workflow(steps=["brain_first", "docs_first", "generate", "evidence"]))
    found = search(iterations=30, seed=3)
    assert found["best_score"] >= baseline["mean_score"] - 1e-9
    assert "structure" in found["best_workflow"]["steps"] or found["best_score"] >= baseline["mean_score"]


def test_search_result_serializable(tmp_path):
    found = search(iterations=12, seed=1)
    out = tmp_path / "r.json"
    out.write_text(json.dumps(found), encoding="utf-8")
    data = json.loads(out.read_text())
    assert "best_workflow" in data
    assert isinstance(data["best_workflow"]["steps"], list)
