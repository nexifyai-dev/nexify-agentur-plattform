# FILE: /scripts/leads/test_leads.py
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Unit tests for lead schema + dry-run mail eligibility
# WHY: CI-safe coverage without live SMTP
# BEST-PRACTICE: No network in default tests
# PITFALL: V-LEAD-07: Do not assert on real third-party inboxes
# DEPENDS: schema, templates_ai_begleiter, mail_batch
# DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md
# SESSION: zero-cost-leads-mailing-7dd5

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from leads.mail_batch import eligible, run_batch
from leads.schema import (
    append_leads, export_csv, is_business_email, load_queue,
    normalize_lead, queue_path, to_outreach_record, validate_for_queue,
)
from leads import templates_ai_begleiter as tpl


class SchemaTests(unittest.TestCase):
    def test_business_email(self):
        self.assertTrue(is_business_email("info@example-gmbh.de"))
        self.assertFalse(is_business_email("max@gmail.com"))

    def test_forbidden_source(self):
        lead = normalize_lead({"company": "X", "email": "info@x.de",
                               "source_type": "purchased_list", "website": "https://x.de"})
        self.assertEqual(validate_for_queue(lead), "forbidden_source:purchased_list")

    def test_queue_roundtrip(self):
        with tempfile.TemporaryDirectory() as td:
            q = queue_path(Path(td))
            added, _ = append_leads(q, [{"company": "Demo GmbH", "website": "https://demo.example",
                                         "email": "info@demo.example", "status": "researched"}])
            self.assertEqual(added, 1)
            csv_path = Path(td) / "out.csv"
            export_csv(csv_path, load_queue(q))
            self.assertIn("Demo GmbH", csv_path.read_text(encoding="utf-8"))

    def test_outreach_map(self):
        lead = normalize_lead({"company": "A", "email": "info@a.example",
                               "website": "https://a.example", "status": "researched", "send_allowed": True})
        self.assertEqual(to_outreach_record(lead)["status"], "outreach_pending")


class TemplateTests(unittest.TestCase):
    def test_template_contains_identity_and_unsub(self):
        body = tpl.build_text_body({"company": "Muster GmbH", "contact_reason": "Test"},
                                   booking_url=tpl.BOOKING_DEFAULT,
                                   unsubscribe_url="https://example/unsub")
        self.assertIn("NeXify AI", body)
        self.assertIn("449", body)
        self.assertIn("rueckruf", body)
        self.assertIn("Abmelden", body)


class MailBatchTests(unittest.TestCase):
    def test_dry_run(self):
        leads = [normalize_lead({"company": "Ok GmbH", "email": "info@ok.example",
                                 "website": "https://ok.example", "status": "researched",
                                 "send_allowed": True})]
        self.assertIsNone(eligible(leads[0]))
        result = run_batch(leads, send=False, limit=5)
        self.assertEqual(result.dry_run, 1)
        self.assertEqual(result.sent, 0)


if __name__ == "__main__":
    unittest.main()
