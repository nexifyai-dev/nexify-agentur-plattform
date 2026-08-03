#!/usr/bin/env python3
# FILE: /scripts/outreach/test_outreach.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Unit tests for outreach cap, GDPR gates, templates, dry-run
# WHY: Safety regressions must fail CI before live mailings
# BEST-PRACTICE: No network; fake sleep; temp dirs
# PITFALL: V-OUT-01: Cap >800 must clamp
# DEPENDS: scripts/outreach/*
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

# Package import via scripts/ on path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from outreach import config as cfg_mod
from outreach import runner
from outreach import store
from outreach import templates_de


class CapTests(unittest.TestCase):
    def test_hard_cap_clamps(self):
        with mock.patch.dict(os.environ, {"OUTREACH_DAILY_CAP": "9999"}, clear=False):
            c = cfg_mod.load_config()
        self.assertEqual(c.daily_cap, cfg_mod.HARD_DAILY_CAP)
        self.assertEqual(cfg_mod.HARD_DAILY_CAP, 800)


class StoreGateTests(unittest.TestCase):
    def test_rejects_purchased_list(self):
        lead = store.normalize_lead(
            {
                "email": "info@acme.test",
                "company": "Acme",
                "source": "purchased_list",
                "source_type": "purchased_list",
                "send_allowed": True,
                "consent": True,
                "status": "outreach_pending",
            }
        )
        self.assertEqual(
            store.validate_for_send(lead, require_send_allowed=True),
            "forbidden_source",
        )

    def test_requires_consent(self):
        lead = store.normalize_lead(
            {
                "email": "info@acme.test",
                "company": "Acme",
                "source": "D01",
                "source_url": "https://example.com",
                "status": "outreach_pending",
                "send_allowed": True,
                "consent": False,
            }
        )
        self.assertEqual(
            store.validate_for_send(lead, require_send_allowed=True),
            "missing_consent",
        )

    def test_requires_send_allowed(self):
        lead = store.normalize_lead(
            {
                "email": "info@acme.test",
                "company": "Acme",
                "source": "D01",
                "source_url": "https://example.com",
                "status": "outreach_pending",
                "send_allowed": False,
                "consent": True,
            }
        )
        self.assertEqual(
            store.validate_for_send(lead, require_send_allowed=True),
            "send_not_allowed",
        )

    def test_ok_when_allowed(self):
        lead = store.normalize_lead(
            {
                "email": "info@acme.test",
                "company": "Acme",
                "source": "checkliste",
                "source_url": "https://example.com",
                "status": "outreach_pending",
                "send_allowed": True,
                "consent": True,
            }
        )
        self.assertIsNone(store.validate_for_send(lead, require_send_allowed=True))
        self.assertTrue(lead["consent"])
        self.assertEqual(lead["legal_basis"], "opt_in_required")  # default until promote


class TemplateTests(unittest.TestCase):
    def test_includes_unsubscribe(self):
        lead = {"company": "Acme GmbH", "service_slug": "websites", "source": "D01"}
        text = templates_de.build_text_body(
            lead,
            booking_url="https://www.nexifyai.cloud/de/kontakt",
            unsubscribe_url="https://www.nexifyai.cloud/api/outreach/unsubscribe?x=1",
        )
        self.assertIn("Abmelden", text)
        self.assertIn("NeXify AI", text)
        html = templates_de.build_html_body(
            lead,
            booking_url="https://www.nexifyai.cloud/de/kontakt",
            unsubscribe_url="https://www.nexifyai.cloud/api/outreach/unsubscribe?x=1",
        )
        self.assertIn("unsubscribe", html)


class RunnerDryRunTests(unittest.TestCase):
    def test_dry_run_sends_zero(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            queue = root / "queue"
            state = root / "state"
            unsub = root / "unsub"
            queue.mkdir()
            state.mkdir()
            unsub.mkdir()
            lead = {
                "email": "ceo@example-b2b.test",
                "company": "Example B2B",
                "source": "checkliste",
                "source_url": "https://example-b2b.test",
                "status": "outreach_pending",
                "send_allowed": True,
                "consent": True,
                "legal_basis": "consent",
                "contact_reason": "Opt-in Checkliste",
            }
            (queue / "batch.jsonl").write_text(
                json.dumps(lead) + "\n", encoding="utf-8"
            )
            c = cfg_mod.OutreachConfig(
                daily_cap=800,
                pace_min_sec=0,
                pace_max_sec=0,
                smtp_host="smtp.hostinger.com",
                smtp_port=465,
                smtp_user="mail@nexifyai.cloud",
                smtp_password="",
                sender_email="mail@nexifyai.cloud",
                sender_name="NeXify AI",
                reply_to="mail@nexifyai.cloud",
                firecrawl_url="http://127.0.0.1:3003",
                firecrawl_api_key="",
                queue_dir=queue,
                state_dir=state,
                unsub_dir=unsub,
                unsubscribe_base_url="https://www.nexifyai.cloud/api/outreach/unsubscribe",
                booking_url="https://www.nexifyai.cloud/de/kontakt",
                live=False,
                enrich=False,
                require_send_allowed=True,
                allow_opt_in_send=False,
            )
            result = runner.run_daily(c, sleep_fn=lambda _s: None)
            self.assertEqual(result.sent, 0)
            self.assertEqual(result.dry_run, 1)
            self.assertIsNone(result.blocked)

    def test_live_without_creds_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            c = cfg_mod.OutreachConfig(
                daily_cap=10,
                pace_min_sec=0,
                pace_max_sec=0,
                smtp_host="smtp.hostinger.com",
                smtp_port=465,
                smtp_user="mail@nexifyai.cloud",
                smtp_password="",
                sender_email="mail@nexifyai.cloud",
                sender_name="NeXify AI",
                reply_to="mail@nexifyai.cloud",
                firecrawl_url="http://127.0.0.1:3003",
                firecrawl_api_key="",
                queue_dir=root / "queue",
                state_dir=root / "state",
                unsub_dir=root / "unsub",
                unsubscribe_base_url="https://www.nexifyai.cloud/api/outreach/unsubscribe",
                booking_url="https://www.nexifyai.cloud/de/kontakt",
                live=True,
                enrich=False,
                require_send_allowed=True,
                allow_opt_in_send=True,
            )
            result = runner.run_daily(c, sleep_fn=lambda _s: None)
            self.assertIsNotNone(result.blocked)
            self.assertIn("missing_smtp", result.blocked or "")


    def test_live_without_opt_in_flag_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            c = cfg_mod.OutreachConfig(
                daily_cap=10,
                pace_min_sec=0,
                pace_max_sec=0,
                smtp_host="smtp.hostinger.com",
                smtp_port=465,
                smtp_user="mail@nexifyai.cloud",
                smtp_password="x",
                sender_email="mail@nexifyai.cloud",
                sender_name="NeXify AI",
                reply_to="mail@nexifyai.cloud",
                firecrawl_url="http://127.0.0.1:3003",
                firecrawl_api_key="",
                queue_dir=root / "queue",
                state_dir=root / "state",
                unsub_dir=root / "unsub",
                unsubscribe_base_url="https://www.nexifyai.cloud/api/outreach/unsubscribe",
                booking_url="https://www.nexifyai.cloud/de/kontakt",
                live=True,
                enrich=False,
                require_send_allowed=True,
                allow_opt_in_send=False,
            )
            result = runner.run_daily(c, sleep_fn=lambda _s: None)
            self.assertIsNotNone(result.blocked)
            self.assertIn("uwg_opt_in", result.blocked or "")
            self.assertEqual(result.sent, 0)



if __name__ == "__main__":
    unittest.main()
