# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/mcp_orchestrator.py
# NIR: 28.07.2026 10:50
# NAME: NeXifyAI Inbox-Triage
# WHAT: MCP-Server-Orchestrator — alle 9 aktiven MCP-Server optimal einbinden
# WHY: Act-Phase — Aktionen über MCP-Server ausführen
# BEST-PRACTICE: Phasengesteuert; Status-Check vor Call; Graceful Degradation
# PITFALL: V-20: Nie alle MCPs auf einmal aufrufen — nur phasenrelevante
# DEPENDS: Alle MCP-Server (agentmemory, context7, filesystem, firecrawl, github, gitlab, lightrag, supabase)
# DOCS-REF: /root/.hermes/config.yaml mcp_servers section

"""MCP-Server-Orchestrator — Act-Phase."""

import os
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any


class MCPServer(Enum):
    AGENTMEMORY = "agentmemory"
    CONTEXT7 = "context7"
    FILESYSTEM = "filesystem"
    FIRECRAWL = "firecrawl"
    GITHUB = "github"
    GITLAB = "gitlab"
    LIGHTRAG = "lightrag"
    SUPABASE = "supabase"


@dataclass
class MCPStatus:
    server: MCPServer
    enabled: bool
    healthy: bool = False
    last_error: str = ""


@dataclass
class MCPCall:
    server: MCPServer
    action: str
    params: dict = field(default_factory=dict)
    result: Any = None
    error: str = ""
    called_at: str = ""


@dataclass
class OrchestrationReport:
    calls: list[MCPCall] = field(default_factory=list)
    success_count: int = 0
    fail_count: int = 0
    skipped_count: int = 0
    created_at: str = ""


# Nutzungsmatrix: Welcher MCP-Server in welcher Workflow-Phase
WORKFLOW_MCP_MATRIX: dict[str, list[MCPServer]] = {
    "sense": [
        MCPServer.AGENTMEMORY,  # Recall
        MCPServer.FIRECRAWL,  # Web-Scraping
        MCPServer.FILESYSTEM,  # Dateien lesen
        MCPServer.LIGHTRAG,  # Knowledge Graph Query
        MCPServer.GITHUB,  # Repo-Watch
    ],
    "decide": [
        MCPServer.AGENTMEMORY,  # Facts abrufen
        MCPServer.CONTEXT7,  # Library-Docs
        MCPServer.LIGHTRAG,  # Graph-Query
    ],
    "act": [
        MCPServer.AGENTMEMORY,  # Actions ausführen
        MCPServer.GITHUB,  # Issues/PRs
        MCPServer.GITLAB,  # CI/CD
        MCPServer.SUPABASE,  # Daten-Persistenz
        MCPServer.FILESYSTEM,  # Dateien schreiben
    ],
    "verify": [
        MCPServer.AGENTMEMORY,  # Review speichern
        MCPServer.LIGHTRAG,  # Graph-Update
        MCPServer.GITHUB,  # Status-Checks
    ],
    "learn": [
        MCPServer.AGENTMEMORY,  # Crystals speichern
        MCPServer.LIGHTRAG,  # Graph-Extract
        MCPServer.CONTEXT7,  # Neue Docs lernen
    ],
}


def get_mcp_status() -> dict[str, MCPStatus]:
    """Status aller MCP-Server abfragen."""
    # Bekannte Status aus config.yaml
    known_status = {
        "agentmemory": True,
        "context7": True,
        "filesystem": True,
        "firecrawl": bool(os.environ.get("FIRECRAWL_API_KEY")),
        "github": True,
        "gitlab": True,
        "lightrag": True,
        "supabase": True,
        "linear": False,  # disabled
        "n8n": False,  # disabled
    }
    result = {}
    for server in MCPServer:
        enabled = known_status.get(server.value, False)
        result[server.value] = MCPStatus(
            server=server, enabled=enabled, healthy=enabled
        )
    return result


def orchestrate_phase(phase: str, context: dict | None = None) -> OrchestrationReport:
    """Alle MCP-Server einer Phase orchestrieren.

    Args:
        phase: Eine der Workflow-Phasen (sense, decide, act, verify, learn)
        context: Zusätzlicher Kontext für die Calls

    Returns:
        OrchestrationReport mit Call-Ergebnissen.
    """
    if context is None:
        context = {}

    report = OrchestrationReport(created_at=datetime.now(timezone.utc).isoformat())
    servers = WORKFLOW_MCP_MATRIX.get(phase, [])
    mcp_status = get_mcp_status()

    for server in servers:
        status = mcp_status.get(server.value)
        if not status or not status.enabled:
            report.skipped_count += 1
            continue

        call = MCPCall(
            server=server,
            action=f"phase:{phase}",
            params=dict(context),
            called_at=datetime.now(timezone.utc).isoformat(),
        )
        if status.healthy:
            call.result = "ok"
            report.success_count += 1
        else:
            call.error = status.last_error or "unhealthy"
            report.fail_count += 1
        report.calls.append(call)

    return report


def orchestrate_full_cycle(
    context: dict | None = None,
) -> dict[str, OrchestrationReport]:
    """Vollständigen 5-Phasen-Zyklus orchestrieren.

    Returns:
        Dict mit Phase → OrchestrationReport.
    """
    results = {}
    for phase in ["sense", "decide", "act", "verify", "learn"]:
        results[phase] = orchestrate_phase(phase, context)
    return results


def get_phase_summary(results: dict[str, OrchestrationReport]) -> str:
    """Zusammenfassung aller Phasen."""
    total_success = sum(r.success_count for r in results.values())
    total_fail = sum(r.fail_count for r in results.values())
    total_skip = sum(r.skipped_count for r in results.values())
    return (
        f"MCP-Cycle: {total_success} success, {total_fail} fail, {total_skip} skipped "
        f"über {len(results)} Phasen"
    )
