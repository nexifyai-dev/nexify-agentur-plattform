# FILE: /scripts/leads/__init__.py
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Zero-cost DACH lead discovery + queue + mailing package
# WHY: Activate B2B acquisition without paid ads / new SaaS
# BEST-PRACTICE: Public sources only; dry-run default; Hostinger SMTP for cold
# PITFALL: V-LEAD-01: Never harvest personal leak emails; only geschäftliche Kontakt
# DEPENDS: scripts/outreach (SMTP + templates), data/leads or /var/lib/nexifyai/leads
# DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md
# SESSION: zero-cost-leads-mailing-7dd5

"""Zero-cost lead pipeline (discover → queue → mail)."""

__version__ = "1.0.0"
