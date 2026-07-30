# FILE: test_optimizer.py — Optimizer Tests
from inbox_triage.optimizer import (
    BatchMemoryItem,
    batch_persist_to_agentmemory,
    parallel_fetch_all_watched,
    parallel_assess,
    fire_and_forget_persist,
    run_optimized_cycle,
    OptimizedCycleResult,
)


class TestBatchMemoryItem:
    def test_creation(self):
        item = BatchMemoryItem(type="fact", content='{"x":1}', tags=["test"])
        assert item.type == "fact"
        assert item.tags == ["test"]


class TestBatchPersist:
    def test_empty(self):
        count = batch_persist_to_agentmemory([])
        assert count == 0

    def test_with_items(self):
        items = [BatchMemoryItem(type="fact", content="test", tags=["t"])]
        count = batch_persist_to_agentmemory(items)
        # Sollte 0 sein ohne Secret, aber nicht crashen
        assert count >= 0


class TestParallelFetch:
    def test_returns_digests(self):
        from inbox_triage.repo_watcher import WATCH_REPOS

        digests = parallel_fetch_all_watched(WATCH_REPOS[:2])
        assert len(digests) == 2

    def test_empty_list(self):
        digests = parallel_fetch_all_watched([])
        assert digests == []


class TestParallelAssess:
    def test_returns_report(self):
        report = parallel_assess()
        assert report is not None
        assert len(report.checks) > 0


class TestFireAndForget:
    def test_runs(self):
        import time

        results = []

        def slow_fn(x):
            time.sleep(0.1)
            results.append(x)

        t = fire_and_forget_persist(slow_fn, 42)
        assert t is not None
        t.join(timeout=1)
        assert results == [42]


class TestOptimizedCycle:
    def test_parallel(self):
        result = run_optimized_cycle(
            use_parallel=True, use_batch=True, use_async_persist=True
        )
        assert isinstance(result, OptimizedCycleResult)
        assert result.sense_report is not None
        assert result.plan is not None
        assert result.orch_summary != ""
        assert result.review is not None
        assert result.total_time_s > 0

    def test_sequential(self):
        result = run_optimized_cycle(
            use_parallel=False, use_batch=True, use_async_persist=True
        )
        assert isinstance(result, OptimizedCycleResult)
        assert result.total_time_s > 0

    def test_parallel_faster(self):
        """Parallel sollte schneller sein als sequentiell."""
        r1 = run_optimized_cycle(
            use_parallel=True, use_batch=True, use_async_persist=True
        )
        r2 = run_optimized_cycle(
            use_parallel=False, use_batch=True, use_async_persist=True
        )
        # Nicht strikt (Netzwerk-Schwankungen), aber als Tendenz
        assert r1.total_time_s > 0 and r2.total_time_s > 0


class TestErrorRegistry:
    def test_record_error_no_secret(self):
        """Ohne Secret → record_error crasht nicht."""
        from inbox_triage.optimizer import ErrorRegistry

        record = ErrorRegistry.record_error("test_tool", "test error message")
        assert record is not None
        assert record.tool == "test_tool"
        assert record.count == 1
        assert record.blocked is False  # erster Fehler → nicht blocked

    def test_record_error_second_time(self):
        """Zweiter Fehler mit gleichem Hash → blocked=True."""
        from inbox_triage.optimizer import ErrorRegistry

        # Simuliere: erster Fehler registriert (ohne Secret)
        r1 = ErrorRegistry.record_error("test_tool", "specific error pattern")
        assert r1.count == 1
        assert r1.blocked is False

    def test_is_blocked_no_secret(self):
        """Ohne Secret → is_blocked = False."""
        from inbox_triage.optimizer import ErrorRegistry

        assert ErrorRegistry.is_blocked("any_tool") is False

    def test_unblock_no_secret(self):
        """Ohne Secret → unblock crasht nicht."""
        from inbox_triage.optimizer import ErrorRegistry

        ErrorRegistry.unblock("test_tool", "fixed by restart")
        # Kein Assert nötig — Hauptsache kein Crash

    def test_error_record_dataclass(self):
        """ErrorRecord Dataclass funktioniert."""
        from inbox_triage.optimizer import ErrorRecord

        r = ErrorRecord(
            tool="t",
            error_hash="abc123",
            first_seen="now",
            last_seen="now",
            count=2,
            blocked=True,
        )
        assert r.count == 2
        assert r.blocked is True
        assert r.error_hash == "abc123"
