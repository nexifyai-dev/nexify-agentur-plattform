#!/usr/bin/env python3
# FILE: /scripts/gtm/test_demand_scan_prepare.py
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 07:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Unit tests für Demand-Scan Leadscore und Pending-Schema
# WHY: Score-Regressionen verhindern falsche CRM-Pending-Flut
# BEST-PRACTICE: pytest oder unittest ohne Netz
# PITFALL: V-GTM-05: Staffing-Hits dürfen nicht pending werden
# DEPENDS: scripts/gtm/demand_scan_prepare.py
# DOCS-REF: docs/gtm/DEMAND_SEARCH_QUERIES_V1.md
# SESSION: gtm-kostenfrei-angebote-c6e3

import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("demand_scan_prepare.py")
spec = importlib.util.spec_from_file_location("demand_scan_prepare", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)


class DemandScanPrepareTests(unittest.TestCase):
    def test_demo_website_hit_is_pending(self):
        hit = mod.DEMO_HITS[0]
        rec = mod.build_pending(hit)
        self.assertEqual(rec["status"], "pending_legal_gate")
        self.assertGreaterEqual(rec["score"], mod.MIN_SCORE_PENDING)
        self.assertEqual(rec["day_rate_eur"], 449)
        self.assertFalse(rec["send_allowed"])
        self.assertFalse(rec["outreach_draft_allowed"])

    def test_staffing_hit_below_threshold(self):
        hit = mod.DEMO_HITS[1]
        rec = mod.build_pending(hit)
        self.assertEqual(rec["status"], "below_threshold")
        self.assertLess(rec["score"], mod.MIN_SCORE_PENDING)

    def test_dumping_penalty(self):
        hit = {
            "source_id": "D01",
            "title": "Website billig",
            "service_slug": "websites",
            "remote_ok": True,
            "dumping_price": True,
        }
        score, reasons = mod.score_hit(hit)
        self.assertTrue(any("-40" in r for r in reasons))
        self.assertLess(score, mod.MIN_SCORE_PENDING)


if __name__ == "__main__":
    unittest.main()
