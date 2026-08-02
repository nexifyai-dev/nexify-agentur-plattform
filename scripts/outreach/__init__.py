# FILE: /scripts/outreach/__init__.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Lead-Outreach package (Hostinger cold drip, GDPR-aware)
# WHY: Cursor-Agent daily mailing to scraped B2B leads without Resend quota burn
# BEST-PRACTICE: Hard daily cap ≤800; Hostinger SMTP only for cold; Resend for transactional
# PITFALL: V-OUT-01: Never raise OUTREACH_DAILY_CAP above HARD_DAILY_CAP
# DEPENDS: SMTP_HOST, IMAP_USER, IMAP_PASSWORD | FIRECRAWL_URL
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

"""NeXify AI lead outreach — slow Hostinger SMTP drip for B2B scraped leads."""

__all__ = ["__version__"]
__version__ = "1.0.0"
