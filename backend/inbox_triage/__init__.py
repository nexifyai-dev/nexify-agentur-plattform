# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/__init__.py
# NIR: 28.07.2026 10:50
# NAME: NeXifyAI Inbox-Triage
# WHAT: Capture/Discard/Route/Learn Workflow Engine
# WHY: Zentraler Inbox-Worker für Agenten-Dispatch mit 5-Phasen-Kreislauf
# BEST-PRACTICE: TDD, AgentMemory-first, MCP-Orchestrator
# PITFALL: V-15: Niemals ohne memory_recall starten
# DEPENDS: flowsearch, agentmemory, 9router
# DOCS-REF: /opt/nexifyai/docs/architecture/SOLL-GESAMTKONZEPT.md

"""Inbox Triage — Capture / Discard / Route / Learn."""

__version__ = "1.0.0"
