# FILE: test_mcp_orchestrator.py — MCP Orchestrator Tests
from inbox_triage.mcp_orchestrator import (
    MCPServer,
    MCPStatus,
    MCPCall,
    OrchestrationReport,
    WORKFLOW_MCP_MATRIX,
    get_mcp_status,
    orchestrate_phase,
    orchestrate_full_cycle,
    get_phase_summary,
)


class TestMCPServer:
    def test_count(self):
        assert len(list(MCPServer)) == 9

    def test_agentmemory_exists(self):
        assert MCPServer.AGENTMEMORY.value == "agentmemory"


class TestMCPStatus:
    def test_creation(self):
        s = MCPStatus(server=MCPServer.AGENTMEMORY, enabled=True, healthy=True)
        assert s.enabled
        assert s.healthy


class TestMCPCall:
    def test_creation(self):
        c = MCPCall(server=MCPServer.FIRECRAWL, action="search", params={"q": "test"})
        assert c.server == MCPServer.FIRECRAWL
        assert c.action == "search"


class TestOrchestrationReport:
    def test_empty(self):
        r = OrchestrationReport()
        assert r.calls == []
        assert r.success_count == 0
        assert r.fail_count == 0


class TestWorkflowMatrix:
    def test_all_phases_have_servers(self):
        for phase in ["sense", "decide", "act", "verify", "learn"]:
            assert len(WORKFLOW_MCP_MATRIX[phase]) > 0, f"{phase} has no MCP servers"

    def test_agentmemory_in_all_phases(self):
        for phase, servers in WORKFLOW_MCP_MATRIX.items():
            assert MCPServer.AGENTMEMORY in servers, f"AgentMemory missing in {phase}"


class TestGetMCPStatus:
    def test_returns_all(self):
        status = get_mcp_status()
        assert len(status) == 9
        assert "agentmemory" in status
        assert status["agentmemory"].enabled


class TestOrchestratePhase:
    def test_sense_phase(self):
        report = orchestrate_phase("sense", {"task": "test"})
        assert report.success_count > 0
        assert len(report.calls) > 0

    def test_unknown_phase(self):
        report = orchestrate_phase("nonexistent")
        assert report.success_count == 0
        assert report.calls == []


class TestOrchestrateFullCycle:
    def test_returns_five_phases(self):
        results = orchestrate_full_cycle({"task": "test"})
        assert len(results) == 5
        for phase in ["sense", "decide", "act", "verify", "learn"]:
            assert phase in results

    def test_summary(self):
        results = orchestrate_full_cycle()
        summary = get_phase_summary(results)
        assert "success" in summary
        assert "fail" in summary
        assert "5 Phasen" in summary
