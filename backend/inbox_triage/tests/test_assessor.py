# FILE: test_assessor.py — IST/SOLL Assessment Tests
from inbox_triage.assessor import (
    SystemCheck,
    ISTSOLLReport,
    assess_all,
    delta_from_previous,
    check_endpoint,
)


class TestSystemCheck:
    def test_creation(self):
        c = SystemCheck(name="test", status="ok", detail="works")
        assert c.name == "test"
        assert c.status == "ok"
        assert c.detail == "works"

    def test_defaults(self):
        c = SystemCheck(name="test", status="unknown")
        assert c.detail == ""
        assert c.checked_at == ""


class TestISTSOLLReport:
    def test_empty(self):
        r = ISTSOLLReport()
        assert r.checks == []
        assert r.gaps == []
        assert r.recommendations == []

    def test_to_dict(self):
        r = ISTSOLLReport()
        r.checks.append(SystemCheck(name="9Router", status="ok", detail="HTTP 200"))
        r.checks.append(SystemCheck(name="DB", status="down", detail="timeout"))
        r.gaps = ["DB: down"]
        d = r.to_dict()
        assert len(d["checks"]) == 2
        assert d["checks"][0]["name"] == "9Router"
        assert d["gaps"] == ["DB: down"]
        assert "summary" in d

    def test_summary_counts(self):
        r = ISTSOLLReport()
        r.checks = [
            SystemCheck(name="a", status="ok"),
            SystemCheck(name="b", status="ok"),
            SystemCheck(name="c", status="down"),
        ]
        r.gaps = ["c: down"]
        d = r.to_dict()
        assert "2/3 OK" in d["summary"]
        assert "1 Gaps" in d["summary"]


class TestAssessAll:
    def test_returns_report(self):
        report = assess_all(use_cache=False)
        assert isinstance(report, ISTSOLLReport)
        assert len(report.checks) > 0

    def test_has_endpoints(self):
        report = assess_all(use_cache=False)
        names = [c.name for c in report.checks]
        # Mindestens 9Router sollte da sein
        assert any("9Router" in n for n in names) or any("20128" in n for n in names)

    def test_caching(self):
        # Erstes Mal: kein Cache
        r1 = assess_all(use_cache=False)
        # Zweites Mal: sollte schneller sein (Cache)
        r2 = assess_all(use_cache=True)
        assert len(r2.checks) >= len(r1.checks)


class TestDeltaFromPrevious:
    def test_no_previous(self):
        current = ISTSOLLReport()
        current.gaps = ["gap1", "gap2"]
        result = delta_from_previous(current, None)
        assert result.gaps == ["gap1", "gap2"]

    def test_new_gaps(self):
        current = ISTSOLLReport()
        current.gaps = ["gap1", "gap2"]
        previous = {"gaps": ["gap1"], "checks": []}
        result = delta_from_previous(current, previous)
        assert "gap2" in result.gaps

    def test_resolved_gaps(self):
        current = ISTSOLLReport()
        current.gaps = ["gap1"]
        previous = {"gaps": ["gap1", "gap2"], "checks": []}
        result = delta_from_previous(current, previous)
        assert any("behoben" in r for r in result.recommendations)


class TestEndpointCheck:
    def test_unknown_host(self):
        c = check_endpoint("http://127.255.255.255:19999", timeout=1)
        assert c.status in ("down", "unknown")

    def test_localhost_refused(self):
        c = check_endpoint("http://127.0.0.1:19998", timeout=1)
        assert c.status == "down"
