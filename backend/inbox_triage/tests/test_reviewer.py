# FILE: test_reviewer.py — Reviewer Tests
from inbox_triage.reviewer import (
    ReviewVerdict,
    ReviewReport,
    REVIEW_CRITERIA,
    review_action,
    review_session,
    generate_optimizations,
)


class TestReviewVerdict:
    def test_creation_passed(self):
        v = ReviewVerdict(action_id="1", passed=True, evidence="ok")
        assert v.passed
        assert v.evidence == "ok"

    def test_creation_failed(self):
        v = ReviewVerdict(
            action_id="2",
            passed=False,
            evidence="fail",
            what_went_wrong="timeout",
            lesson="retry with backoff",
        )
        assert not v.passed
        assert v.lesson == "retry with backoff"


class TestReviewReport:
    def test_empty(self):
        r = ReviewReport()
        assert r.verdicts == []
        assert r.pass_rate == 0.0
        assert r.lessons == []


class TestReviewCriteria:
    def test_count(self):
        assert len(REVIEW_CRITERIA) == 8

    def test_agentmemory_mentioned(self):
        assert any("AgentMemory" in c for c in REVIEW_CRITERIA)


class TestReviewAction:
    def test_success(self):
        v = review_action({"id": "1", "tool": "memory_recall", "result": "ok"})
        assert v.passed

    def test_failure_with_error(self):
        v = review_action({"id": "2", "tool": "firecrawl_search", "error": "timeout"})
        assert not v.passed
        assert v.lesson != ""

    def test_failure_ok_false(self):
        v = review_action(
            {
                "id": "3",
                "tool": "check_endpoint",
                "ok": False,
                "summary": "connection refused",
            }
        )
        assert not v.passed
        assert v.lesson != ""


class TestReviewSession:
    def test_mixed(self):
        actions = [
            {"id": "1", "tool": "memory_recall", "result": "ok"},
            {"id": "2", "tool": "firecrawl_search", "error": "timeout"},
            {"id": "3", "tool": "health_check", "result": "ok"},
        ]
        report = review_session(actions)
        assert len(report.verdicts) == 3
        assert report.pass_rate == 2 / 3
        assert len(report.lessons) == 1

    def test_all_pass(self):
        actions = [
            {"id": "1", "tool": "test", "result": "ok"},
            {"id": "2", "tool": "test2", "result": "ok"},
        ]
        report = review_session(actions)
        assert report.pass_rate == 1.0
        assert len(report.lessons) == 0

    def test_all_fail(self):
        actions = [
            {"id": "1", "tool": "a", "error": "e1"},
            {"id": "2", "tool": "b", "error": "e2"},
        ]
        report = review_session(actions)
        assert report.pass_rate == 0.0
        assert len(report.lessons) == 2


class TestGenerateOptimizations:
    def test_low_pass_rate(self):
        report = ReviewReport(pass_rate=0.5)
        report.verdicts = [
            ReviewVerdict(action_id="1", passed=True, evidence="ok"),
            ReviewVerdict(
                action_id="2", passed=False, evidence="fail", what_went_wrong="err"
            ),
        ]
        opts = generate_optimizations(report)
        assert len(opts) > 0

    def test_high_pass_rate_no_lessons(self):
        report = ReviewReport(pass_rate=1.0)
        report.verdicts = [
            ReviewVerdict(action_id="1", passed=True, evidence="ok"),
        ]
        opts = generate_optimizations(report)
        # Sollte warnen dass keine Lessons = verdächtig
        assert any("oberflächlich" in o.lower() or "perfekt" in o.lower() for o in opts)


class TestCheckErrorHistory:
    def test_no_secret_returns_false(self):
        """Ohne AgentMemory-Secret → False, 0."""
        from inbox_triage.reviewer import check_error_history

        is_repeated, count = check_error_history("test_tool", "test error")
        assert is_repeated is False
        assert count == 0


class TestSaveErrorPattern:
    def test_no_secret_returns_false(self):
        """Ohne Secret → kein Crash, False."""
        from inbox_triage.reviewer import save_error_pattern

        result = save_error_pattern("test_tool", "test error", "fix it")
        assert result is False  # kein Secret


class TestReviewActionRepeated:
    def test_error_action_saves_pattern(self):
        """review_action bei Fehler → speichert Error-Pattern (versuch es)."""
        from inbox_triage.reviewer import review_action

        v = review_action({"id": "e1", "tool": "test", "error": "unique error XYZ123"})
        assert v.passed is False
        assert v.lesson != ""


class TestAutoBlock:
    def test_no_secret_returns_false(self):
        """Ohne Secret → kein Crash."""
        from inbox_triage.reviewer import _auto_block_repeated_error

        result = _auto_block_repeated_error("test", "error")
        assert result is False
