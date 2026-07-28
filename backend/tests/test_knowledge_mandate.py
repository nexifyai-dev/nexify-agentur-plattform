# FILE: /backend/tests/test_knowledge_mandate.py
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def test_check_knowledge_mandate_script_ok():
    proc = subprocess.run(
        [sys.executable, str(ROOT / "scripts/check_knowledge_mandate.py")],
        capture_output=True,
        text=True,
        check=False,
    )
    assert proc.returncode == 0, proc.stdout + proc.stderr
    assert "OK" in proc.stdout


def test_official_register_has_aflow_docs():
    data = json.loads(
        (ROOT / "docs/governance/12_register/official-docs-source-register-v1.json").read_text(encoding="utf-8")
    )
    ids = {s["id"] for s in data["sources"]}
    assert {"DOC-018", "DOC-019", "DOC-020"} <= ids


def test_knowledge_register_mandatory_areas():
    data = json.loads(
        (ROOT / "docs/governance/12_register/knowledge-source-register-v1.json").read_text(encoding="utf-8")
    )
    assert data["mandatory"] is True
    assert data["usage_obligation"] == "FLOWSEARCH_KNOWLEDGE"
    assert "A-FLOW" in {a["id"] for a in data["areas"]}


def test_mandate_helper():
    sys.path.insert(0, str(ROOT / "backend"))
    from flowsearch.mandate import assert_mandate

    assert_mandate()
