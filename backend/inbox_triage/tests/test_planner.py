# FILE: test_planner.py — Planner Tests
from inbox_triage.planner import (
    ActionItem,
    ActionPlan,
    generate_plan,
    plan_from_assessment,
    plan_from_research,
    plan_from_repos,
)
from inbox_triage.researcher import ResearchBundle, ResearchItem
from inbox_triage.repo_watcher import RepoDigest, RepoEvent


class TestActionItem:
    def test_creation(self):
        item = ActionItem(
            id="1",
            title="Fix X",
            priority="critical",
            category="fix",
            source="ist-soll",
            detail="x is down",
        )
        assert item.priority == "critical"
        assert item.category == "fix"


class TestActionPlan:
    def test_empty(self):
        plan = ActionPlan()
        assert plan.items == []
        assert plan.total_estimated_cost == 0.0


class TestPlanFromAssessment:
    def test_empty(self):
        items = plan_from_assessment([], [])
        assert items == []

    def test_one_gap(self):
        items = plan_from_assessment(
            ["9Router: down — connection refused"], ["Restart 9Router"]
        )
        assert len(items) == 1
        assert items[0].priority == "critical"
        assert "9Router" in items[0].title

    def test_multiple_gaps(self):
        gaps = ["A: down", "B: degraded", "C: down"]
        items = plan_from_assessment(gaps, [])
        assert len(items) == 3
        critical_count = sum(1 for i in items if i.priority == "critical")
        assert critical_count == 2  # Two "down" = critical


class TestPlanFromResearch:
    def test_with_items(self):
        bundle = ResearchBundle(topic="AI agents")
        bundle.items = [
            ResearchItem(url="http://x", title="T", snippet="s", source="firecrawl")
        ]
        items = plan_from_research([bundle])
        assert len(items) >= 1
        if items:
            assert items[0].source == "firecrawl"


class TestPlanFromRepos:
    def test_with_release(self):
        digest = RepoDigest(repo="test/repo")
        digest.events = [
            RepoEvent(
                repo="test/repo", event_type="release", title="v2.0", url="http://x"
            )
        ]
        items = plan_from_repos([digest])
        assert len(items) >= 1
        if items:
            assert items[0].priority == "high"


class TestGeneratePlan:
    def test_empty(self):
        plan = generate_plan([], [], [], [])
        assert plan.items == []
        assert "0 Aktionen" in plan.summary

    def test_integration(self):
        gaps = ["Service X: down"]
        recs = ["Restart X"]
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
        assert len(plan.items) >= 2
        assert plan.total_estimated_cost > 0
        assert "Aktionen" in plan.summary

    def test_max_items(self):
        gaps = [f"gap-{i}" for i in range(20)]
        plan = generate_plan(gaps, [], [], [], max_items=5)
        assert len(plan.items) <= 5

    def test_dedup(self):
        gaps = ["Same gap: down", "Same gap: down"]
        plan = generate_plan(gaps, [], [], [])
        # Sollte dedupliziert sein
        titles = [i.title for i in plan.items]
        assert len(titles) == len(set(t[:60] for t in titles))
