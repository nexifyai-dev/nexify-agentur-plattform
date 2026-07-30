# FILE: test_e2e.py — End-to-End Integrationstest
"""E2E: Kompletter 5-Phasen-Zyklus ohne externe Abhängigkeiten."""

from inbox_triage.assessor import ISTSOLLReport, assess_all, delta_from_previous
from inbox_triage.planner import generate_plan, ActionPlan
from inbox_triage.mcp_orchestrator import orchestrate_full_cycle, get_phase_summary
from inbox_triage.reviewer import review_session, generate_optimizations
from inbox_triage.researcher import ResearchBundle, ResearchItem, fetch_all_topics
from inbox_triage.repo_watcher import RepoDigest, RepoEvent, fetch_all_watched


class TestFullCycle:
    """Gesamter Sense→Decide→Act→Verify→Learn-Zyklus."""

    def test_sense_assessment(self):
        """SENSE: IST/SOLL-Assessment."""
        report = assess_all(use_cache=False)
        assert isinstance(report, ISTSOLLReport)
        assert len(report.checks) > 0
        # Mindestens ein Endpoint muss da sein
        names = [c.name for c in report.checks]
        assert any(
            "20128" in n or "9Router" in n or "3113" in n or "AgentMemory" in n
            for n in names
        )

    def test_decide_plan(self):
        """DECIDE: Plan aus Gaps generieren."""
        gaps = ["Service X: down", "API Y: degraded"]
        recs = ["Restart X", "Check Y"]
        bundle = ResearchBundle(topic="AI")
        bundle.items = [
            ResearchItem(url="http://x", title="T", snippet="s", source="firecrawl")
        ]
        digest = RepoDigest(repo="test/repo")
        digest.events = [
            RepoEvent(
                repo="test/repo", event_type="release", title="v1", url="http://x"
            )
        ]

        plan = generate_plan(gaps, recs, [bundle], [digest])
        assert isinstance(plan, ActionPlan)
        assert len(plan.items) > 0
        assert plan.total_estimated_cost > 0
        # Critical items first
        if any(i.priority == "critical" for i in plan.items):
            assert plan.items[0].priority == "critical"

    def test_act_orchestration(self):
        """ACT: MCP-Orchestrator."""
        results = orchestrate_full_cycle({"task": "e2e-test"})
        assert len(results) == 5
        summary = get_phase_summary(results)
        assert "success" in summary
        assert "5 Phasen" in summary

    def test_verify_review(self):
        """VERIFY: Selbst-Review."""
        actions = [
            {"id": "1", "tool": "memory_recall", "result": "ok"},
            {"id": "2", "tool": "assess_all", "result": "ok"},
            {"id": "3", "tool": "firecrawl_search", "error": "timeout"},
        ]
        report = review_session(actions)
        assert len(report.verdicts) == 3
        assert report.pass_rate == 2 / 3
        assert len(report.lessons) == 1

    def test_learn_optimizations(self):
        """LEARN: Optimierungen aus Lessons."""
        from inbox_triage.reviewer import ReviewReport, ReviewVerdict

        report = ReviewReport(pass_rate=0.6)
        report.verdicts = [
            ReviewVerdict(action_id="1", passed=True, evidence="ok"),
            ReviewVerdict(
                action_id="2",
                passed=False,
                evidence="fail",
                what_went_wrong="err",
                lesson="fix it",
            ),
        ]
        opts = generate_optimizations(report)
        assert len(opts) > 0


class TestComponentIntegration:
    """Integration: Komponenten-übergreifend."""

    def test_assessment_to_plan(self):
        """IST/SOLL → Plan."""
        report = ISTSOLLReport()
        report.gaps = ["9Router: down", "AgentMemory: degraded"]
        report.recommendations = ["Restart 9Router", "Check AgentMemory"]
        plan = generate_plan(report.gaps, report.recommendations, [], [])
        assert any("9Router" in item.title for item in plan.items)
        assert any(item.priority == "critical" for item in plan.items)

    def test_plan_includes_cost(self):
        """Plan enthält Cost-Schätzung."""
        plan = generate_plan(["gap1", "gap2"], [], [], [])
        assert plan.total_estimated_cost >= 0

    def test_delta_detection(self):
        """Delta-Erkennung zwischen zwei Reports."""
        prev = ISTSOLLReport()
        prev.gaps = ["old-gap", "fixed-gap"]
        curr = ISTSOLLReport()
        curr.gaps = ["old-gap", "new-gap"]
        result = delta_from_previous(curr, prev.to_dict())
        assert (
            "behoben" in str(result.recommendations).lower()
            or len(result.recommendations) > 0
        )

    def test_research_and_repo_integration(self):
        """Research + Repo-Watch → Plan-Integration."""
        bundles = fetch_all_topics(["AI test topic"], max_per_topic=3)
        digests = fetch_all_watched(["nexifyai-dev/nexify-agentur-plattform"])
        plan = generate_plan([], [], bundles, digests)
        assert isinstance(plan, ActionPlan)
        assert plan.summary != ""
