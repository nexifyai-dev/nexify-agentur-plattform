# FILE: /scripts/gtm/test_competitor_angle_templates.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Unit tests for competitor-angle DE outreach templates + UWG consent gate
# WHY: Guard pain→audit→pilot copy + unsubscribe footer + §7 opt-in
# BEST-PRACTICE: No network; assert ICP angle + legal footer + consent refusal
# PITFALL: V-TEST-OUT-01: Do not assert competitor brand names in output
# DEPENDS: competitor_angle_templates_de.py, icp_competitor_outreach.py
# DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md, docs/gtm/UWG-EMAIL-OPTIN-ONLY.md
# SESSION: strongest-competitors-tactics-7dd5

from __future__ import annotations

import unittest

from competitor_angle_templates_de import build_subject, build_text_body
from icp_competitor_outreach import validate_lead


class TestCompetitorAngles(unittest.TestCase):
    def test_handwerk_angle(self) -> None:
        lead = {"company": "Test GmbH", "icp": "handwerk", "contact_name": "Max"}
        body = build_text_body(
            lead,
            booking_url="https://www.nexifyai.cloud/rueckruf",
            unsubscribe_url="https://www.nexifyai.cloud/kontakt",
        )
        self.assertIn("Audit", body)
        self.assertIn("449", body)
        self.assertIn("Abmelden", body)
        self.assertIn("Baustelle", body)
        self.assertNotIn("Pexon", body)
        self.assertNotIn("AUTIMA", body)

    def test_subject(self) -> None:
        s = build_subject({"company": "Acme"})
        self.assertIn("Acme", s)
        self.assertIn("NeXify AI", s)


class TestUwgConsentGate(unittest.TestCase):
    def test_rejects_missing_consent(self) -> None:
        err = validate_lead(
            {"email": "a@b.de", "source": "optin", "consent": False}
        )
        self.assertIsNotNone(err)
        self.assertIn("consent", err or "")

    def test_rejects_li_without_consent(self) -> None:
        err = validate_lead(
            {
                "email": "a@b.de",
                "source": "optin",
                "legal_basis": "legitimate_interest_b2b",
            }
        )
        self.assertIsNotNone(err)
        self.assertIn("consent", err or "")

    def test_rejects_disallowed_source(self) -> None:
        err = validate_lead(
            {"email": "a@b.de", "consent": True, "source": "scraped-impressum"}
        )
        self.assertIsNotNone(err)
        self.assertIn("source not allowed", err or "")

    def test_accepts_optin(self) -> None:
        err = validate_lead(
            {"email": "a@b.de", "consent": True, "source": "optin"}
        )
        self.assertIsNone(err)


if __name__ == "__main__":
    unittest.main()
