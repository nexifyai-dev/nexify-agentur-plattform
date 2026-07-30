# FILE: test_researcher.py — Firecrawl-Recherche Tests
from inbox_triage.researcher import (
    ResearchItem,
    ResearchBundle,
    RESEARCH_TOPICS,
    fetch_all_topics,
    fetch_daily_topics,
)


class TestResearchItem:
    def test_creation(self):
        item = ResearchItem(
            url="https://example.com", title="Test", snippet="desc", source="firecrawl"
        )
        assert item.url == "https://example.com"
        assert item.source == "firecrawl"

    def test_defaults(self):
        item = ResearchItem(url="", title="", snippet="", source="web_search")
        assert item.fetched_at == ""


class TestResearchBundle:
    def test_empty(self):
        b = ResearchBundle(topic="test")
        assert b.topic == "test"
        assert b.items == []
        assert b.source_count == 0

    def test_with_items(self):
        b = ResearchBundle(topic="test")
        b.items.append(
            ResearchItem(
                url="https://x.com", title="X", snippet="s", source="firecrawl"
            )
        )
        b.source_count = 1
        assert len(b.items) == 1
        assert b.source_count == 1


class TestTopics:
    def test_not_empty(self):
        assert len(RESEARCH_TOPICS) >= 5

    def test_all_strings(self):
        for t in RESEARCH_TOPICS:
            assert isinstance(t, str)
            assert len(t) > 10


class TestFetchAllTopics:
    def test_returns_bundles(self):
        bundles = fetch_all_topics(RESEARCH_TOPICS[:2], max_per_topic=3)
        assert len(bundles) == 2
        for b in bundles:
            assert isinstance(b, ResearchBundle)
            assert b.topic in RESEARCH_TOPICS[:2]


class TestFetchDailyTopics:
    def test_returns_four_bundles(self):
        bundles = fetch_daily_topics()
        # 3 core + 1 rotating = 4
        assert len(bundles) == 4
