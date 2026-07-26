# FILE: /backend/tests/test_ninerouter.py
# WHAT: Unit tests for 9router Vollintegration (no live network, no secrets).

import os
from types import SimpleNamespace

import pytest

import ninerouter as nr


@pytest.fixture(autouse=True)
def _clear_budget(monkeypatch):
    monkeypatch.delenv("NINEROUTER_BUDGET_PCT", raising=False)
    monkeypatch.setenv("NINEROUTER_BASE_URL", "https://ai-router.nexifyai.cloud/v1")
    monkeypatch.setenv("NINEROUTER_API_KEY", "test-key-not-real")
    monkeypatch.setenv("PRIMARY_MODEL", "nexifyai-combo-llm")
    monkeypatch.setenv("CUSTOMER_MODEL", "ds/deepseek-v4-flash")
    monkeypatch.setenv("FALLBACK_MODEL", "ds/deepseek-v4-flash")


def test_load_config_aliases(monkeypatch):
    monkeypatch.delenv("NINEROUTER_API_KEY", raising=False)
    monkeypatch.setenv("NINEROUTER_KEY", "alias-key")
    cfg = nr.load_config()
    assert cfg.api_key == "alias-key"
    assert cfg.base_url.endswith("/v1")
    assert cfg.health_url.endswith("/api/health")


def test_customer_purpose_blocks_combo():
    r = nr.NineRouter(nr.load_config())
    assert r.resolve_model("customer") == "ds/deepseek-v4-flash"
    # Even if explicitly requesting combo for customer, policy rewrites
    assert r.resolve_model("customer", "nexifyai-combo-llm") == "ds/deepseek-v4-flash"


def test_agent_purpose_keeps_combo():
    r = nr.NineRouter(nr.load_config())
    assert r.resolve_model("agent") == "nexifyai-combo-llm"


def test_extract_content_reasoning_salvage():
    msg = SimpleNamespace(content="", reasoning_content="  hello from rc  ", model_extra=None)
    resp = SimpleNamespace(choices=[SimpleNamespace(message=msg)])
    assert nr.NineRouter.extract_content(resp) == "hello from rc"


def test_extract_content_strips_think():
    msg = SimpleNamespace(content="<think>secret</think>visible", reasoning_content=None, model_extra=None)
    resp = SimpleNamespace(choices=[SimpleNamespace(message=msg)])
    assert nr.NineRouter.extract_content(resp) == "visible"


def test_cost_brake_abort(monkeypatch):
    monkeypatch.setenv("NINEROUTER_BUDGET_PCT", "160")
    r = nr.NineRouter(nr.load_config())
    with pytest.raises(nr.CostBrakeError):
        r.check_cost_brake()


def test_cost_brake_p0(monkeypatch):
    monkeypatch.setenv("NINEROUTER_BUDGET_PCT", "210")
    r = nr.NineRouter(nr.load_config())
    with pytest.raises(nr.CostBrakeError, match="P0"):
        r.check_cost_brake()


@pytest.mark.asyncio
async def test_complete_falls_back_on_empty(monkeypatch):
    r = nr.NineRouter(nr.load_config())
    calls = []

    class FakeCompletions:
        async def create(self, **kwargs):
            calls.append(kwargs["model"])
            if kwargs["model"] == "nexifyai-combo-llm":
                msg = SimpleNamespace(content="", reasoning_content=None, model_extra=None)
            else:
                msg = SimpleNamespace(content="ok-fallback", reasoning_content=None, model_extra=None)
            return SimpleNamespace(choices=[SimpleNamespace(message=msg)])

    r.client = SimpleNamespace(chat=SimpleNamespace(completions=FakeCompletions()))
    # Force primary to combo then fallback
    out = await r.complete([{"role": "user", "content": "hi"}], purpose="agent", retries=2)
    assert out == "ok-fallback"
    assert "ds/deepseek-v4-flash" in calls
