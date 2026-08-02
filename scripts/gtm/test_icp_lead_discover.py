# FILE: /scripts/gtm/test_icp_lead_discover.py
# NIR: 02.08.2026 11:00
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Unit tests for ICP discover + mail templates
# WHY: Guard Top-3 without network
# BEST-PRACTICE: stdlib unittest
# PITFALL: V-TEST-01: Demo emails remain .invalid
# DEPENDS: icp_lead_discover.py
# DOCS-REF: docs/gtm/ICP-HIGH-DEMAND-2026.md
# SESSION: icp-demand-competitor-copy-7dd5

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from icp_lead_discover import demo_hits_for_icp, discover, main as discover_main
from icp_mail_templates import render
from icp_mail_send import validate_lead
from icp_segments import TOP3_SLUGS, list_top_slugs


class IcpDiscoverTests(unittest.TestCase):
    def test_top3_order(self) -> None:
        self.assertEqual(list_top_slugs(3), list(TOP3_SLUGS))

    def test_demo_hits_have_invalid_email(self) -> None:
        for slug in TOP3_SLUGS:
            for hit in demo_hits_for_icp(slug):
                self.assertTrue(str(hit["email"]).endswith(".invalid"))

    def test_discover_demo_pending(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            result = discover("handwerk", demo=True, pending_dir=Path(tmp))
        self.assertGreaterEqual(result["pending_count"], 1)
        self.assertTrue(result["query_pack"]["searches"])

    def test_cli_demo(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            rc = discover_main(["--icp", "top3", "--demo", "--out", tmp])
            self.assertEqual(rc, 0)
            self.assertGreaterEqual(len(list(Path(tmp).glob("icp-discover-*.json"))), 3)

    def test_mail_render(self) -> None:
        subj, body = render("handwerk", firma="Muster Bau", anrede="Herr Schmidt")
        self.assertIn("Muster Bau", subj)
        self.assertIn("449", body)
        self.assertIn("STOP", body)

    def test_validate_requires_gate(self) -> None:
        self.assertIsNotNone(validate_lead({"email": "a@firma.de", "icp": "handwerk"}, "handwerk"))
        self.assertIsNone(validate_lead({"email": "a@firma.de", "consent": True, "icp": "handwerk"}, "handwerk"))


if __name__ == "__main__":
    unittest.main()
