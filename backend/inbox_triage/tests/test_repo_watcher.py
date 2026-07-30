# FILE: test_repo_watcher.py — GitHub Repo Watcher Tests
from inbox_triage.repo_watcher import (
    RepoEvent,
    RepoDigest,
    WATCH_REPOS,
    fetch_all_watched,
    fetch_daily_watched,
)


class TestRepoEvent:
    def test_creation(self):
        e = RepoEvent(
            repo="test/repo",
            event_type="release",
            title="v1.0",
            url="https://github.com/test/repo/releases/tag/v1.0",
        )
        assert e.repo == "test/repo"
        assert e.event_type == "release"
        assert e.title == "v1.0"

    def test_defaults(self):
        e = RepoEvent(repo="a/b", event_type="commit", title="fix", url="")
        assert e.at == ""


class TestRepoDigest:
    def test_empty(self):
        d = RepoDigest(repo="test/repo")
        assert d.repo == "test/repo"
        assert d.events == []

    def test_with_events(self):
        d = RepoDigest(repo="test/repo")
        d.events.append(
            RepoEvent(
                repo="test/repo", event_type="release", title="v1", url="http://x"
            )
        )
        assert len(d.events) == 1


class TestWatchRepos:
    def test_not_empty(self):
        assert len(WATCH_REPOS) >= 4

    def test_contains_nexify(self):
        assert any("nexify" in r.lower() for r in WATCH_REPOS)


class TestFetchAllWatched:
    def test_returns_digests(self):
        digests = fetch_all_watched(WATCH_REPOS[:2])
        assert len(digests) == 2
        for d in digests:
            assert isinstance(d, RepoDigest)


class TestFetchDailyWatched:
    def test_returns_at_least_three(self):
        digests = fetch_daily_watched()
        assert len(digests) >= 3
