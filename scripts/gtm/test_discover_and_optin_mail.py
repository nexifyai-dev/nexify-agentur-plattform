#!/usr/bin/env python3
# FILE: /scripts/gtm/test_discover_and_optin_mail.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Unit tests for opt-in mail validation + discover demo
# WHY: Guard against accidental cold-mail sends
# BEST-PRACTICE: Pure validation tests; no network
# PITFALL: V-CAC-01 covered by consent checks
# DEPENDS: discover_and_optin_mail.py
# DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
# SESSION: research-free-cac-full-7dd5

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from discover_and_optin_mail import run_discover_demo, run_mail, validate_lead


class TestOptinMail(unittest.TestCase):
    def test_rejects_without_consent(self) -> None:
        self.assertIsNotNone(validate_lead({"email": "a@b.de", "source": "checkliste"}))

    def test_rejects_cold_source(self) -> None:
        self.assertIsNotNone(
            validate_lead(
                {"email": "a@b.de", "consent": True, "source": "bought_list"}
            )
        )

    def test_accepts_optin(self) -> None:
        self.assertIsNone(
            validate_lead(
                {"email": "a@b.de", "consent": True, "source": "checkliste"}
            )
        )

    def test_dry_run_counts(self) -> None:
        leads = [
            {"email": "a@b.de", "consent": True, "source": "checkliste", "name": "A"},
            {"email": "cold@x.de", "consent": False, "source": "checkliste"},
        ]
        stats = run_mail(leads, dry_run=True, limit=5)
        self.assertEqual(stats["dry_run"], 1)
        self.assertEqual(stats["skipped"], 1)
        self.assertEqual(stats["sent"], 0)

    def test_discover_demo(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            n = run_discover_demo(Path(td))
            self.assertGreaterEqual(n, 1)
            files = list(Path(td).glob("discover_*.json"))
            self.assertEqual(len(files), 1)
            data = json.loads(files[0].read_text(encoding="utf-8"))
            self.assertIsInstance(data, list)


if __name__ == "__main__":
    unittest.main()
