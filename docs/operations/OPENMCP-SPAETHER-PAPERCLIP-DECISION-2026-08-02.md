# FILE: /docs/operations/OPENMCP-SPAETHER-PAPERCLIP-DECISION-2026-08-02.md
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 10:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Ops
# WHAT: Utilization decision — OpenMCP / Spaether / Paperclip
# WHY: Issue #209 — Smoke NXDOMAIN / Paperclip down; kein neues Produkt
# BEST-PRACTICE: Activate existing stack; document intentional downs; no Hermes cutover
# PITFALL: V-OPS-UTIL-01: Do not revive Paperclip timer without Factory mandate
# DEPENDS: Issue #151, #123, AGENTS.md skill-source rule
# DOCS-REF: docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md section C
# SESSION: open-issues-16-close-7dd5

# Decision: OpenMCP / Spaether / Paperclip (2026-08-02)

**Kein Hermes-Produktions-Cutover.**

| Component | Public DNS | Local | Decision | Next step |
|-----------|------------|-------|----------|-----------|
| OpenMCP | NXDOMAIN | thin allowlist | **KEEP internal / docs-first** | Optional CF-Tunnel + Auth later |
| Spaether | NXDOMAIN | down | **DEPRECATE public** until use-case; keep code | No tunnel without workload |
| Paperclip :3100 | n/a | intentional down | **KEEP Factory skill-source SoT**; no auto-revive | Revive only with mandate |

## Non-goals

Hermes cutover · n8n · neue Paid SaaS · Secrets in diesem Doc

## Follow-ups

#151 utilization · #123 runners/secrets · #125 brain currency

Issue #209 schließt mit Merge dieses Docs.
