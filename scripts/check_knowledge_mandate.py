#!/usr/bin/env python3
# FILE: /scripts/check_knowledge_mandate.py
# WHAT: Enforce FlowSearch/Knowledge Vollintegration + Nutzungspflicht (Gate 07).
"""Exit 0 if mandatory knowledge/flowsearch artifacts exist and are consistent."""

from __future__ import annotations
import os
os.environ.setdefault("TZ", "Europe/Berlin")

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_PATHS = [
    ROOT / "docs/governance/12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md",
    ROOT / "docs/governance/12_register/knowledge-source-register-v1.json",
    ROOT / "docs/governance/02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md",
    ROOT / "docs/governance/01_regelwerke/FLOWSEARCH_KNOWLEDGE_FIRST_REGEL_V1.md",
    ROOT / "docs/research/AFLOW_ADAS_NEXIFY_SYNTHESIS.md",
    ROOT / "docs/research/operators/NEXIFY_OPERATOR_REGISTER_V1.json",
    ROOT / "backend/flowsearch/__init__.py",
    ROOT / "backend/flowsearch/mcts.py",
    ROOT / "backend/flowsearch/operators.py",
]

REQUIRED_DOC_IDS = {"DOC-018", "DOC-019", "DOC-020"}
REQUIRED_KS_IDS = {"KS-AFLOW-OR", "KS-AFLOW-NX", "KS-OP-REG", "KS-FLOW-PKG"}


def main() -> int:
    errors: list[str] = []
    for path in REQUIRED_PATHS:
        if not path.exists():
            errors.append(f"missing: {path.relative_to(ROOT)}")

    official = ROOT / "docs/governance/12_register/official-docs-source-register-v1.json"
    knowledge = ROOT / "docs/governance/12_register/knowledge-source-register-v1.json"
    try:
        docs = {s["id"] for s in json.loads(official.read_text(encoding="utf-8"))["sources"]}
        missing_docs = REQUIRED_DOC_IDS - docs
        if missing_docs:
            errors.append(f"official register missing IDs: {sorted(missing_docs)}")
    except Exception as e:
        errors.append(f"official register unreadable: {e}")

    try:
        ks = json.loads(knowledge.read_text(encoding="utf-8"))
        if not ks.get("mandatory"):
            errors.append("knowledge register mandatory!=true")
        ids = {s["id"] for s in ks.get("sources", [])}
        missing_ks = REQUIRED_KS_IDS - ids
        if missing_ks:
            errors.append(f"knowledge register missing IDs: {sorted(missing_ks)}")
        areas = {a["id"] for a in ks.get("areas", [])}
        if "A-FLOW" not in areas:
            errors.append("knowledge register missing area A-FLOW")
    except Exception as e:
        errors.append(f"knowledge register unreadable: {e}")

    # Package import check
    sys.path.insert(0, str(ROOT / "backend"))
    try:
        import flowsearch  # noqa: F401
        from flowsearch.operators import load_register

        reg = load_register()
        for op in ("generate", "brain_first", "evidence"):
            if op not in reg:
                errors.append(f"operator register missing {op}")
    except Exception as e:
        errors.append(f"flowsearch import failed: {e}")

    # OpenReview id must be referenced in synthesis or knowledge JSON
    blob = ""
    for p in (
        ROOT / "docs/research/AFLOW_ADAS_NEXIFY_SYNTHESIS.md",
        ROOT / "docs/governance/12_register/knowledge-source-register-v1.json",
    ):
        if p.exists():
            blob += p.read_text(encoding="utf-8")
    if "z5uVAKwmjf" not in blob:
        errors.append("OpenReview forum id z5uVAKwmjf not referenced in mandatory knowledge files")

    if errors:
        print("FLOWSEARCH_KNOWLEDGE mandate FAIL:")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("FLOWSEARCH_KNOWLEDGE mandate OK (Vollintegration + Nutzungspflicht)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
