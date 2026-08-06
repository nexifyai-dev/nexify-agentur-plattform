# FILE: /backend/ninerouter.py
# NIR: 25.07.2026 01:55
# UPDATED: 25.07.2026 08:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Zentraler 9router-Client (Config, Allowlist, Fallback, Cost-Brake, Health).
# WHY: Eine Integrationsstelle statt verstreuter NINEROUTER_*/MIMO_*-Logik in server.py/portal.
# BEST-PRACTICE: Alle LLM-Calls OpenAI-kompatibel über 9router; Kundentexte ohne Combo-Leak.
# PITFALL: V-9R-01: deepseek-v4-pro / combo für Kundentexte meiden (reasoning_content-Leak).
# DEPENDS: NINEROUTER_BASE_URL, NINEROUTER_API_KEY|NINEROUTER_KEY, openai.AsyncOpenAI
# DOCS-REF: docs/architecture/9ROUTER_VOLLINTEGRATION.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

"""NeXify 9router Vollintegration — single source for LLM routing in the backend."""

from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass, field
from typing import Any, Literal

from openai import AsyncOpenAI

logger = logging.getLogger("nexify.ninerouter")

Purpose = Literal["customer", "agent", "internal"]

# Customer-facing models: clean content, no reasoning leak.
CUSTOMER_SAFE_MODELS = frozenset(
    {
        "ds/deepseek-v4-flash",
        "openrouter/deepseek/deepseek-v3.2",
        "nexifyai",  # combo alias — prefer flash-first live chain
    }
)

# Never use these directly for customer-facing text generation.
CUSTOMER_UNSAFE_MODELS = frozenset(
    {
        "nexifyai-combo-llm",
        "ds/deepseek-v4-pro",
        "ds/deepseek-v4-pro-max",
        "ds/deepseek-v4-pro-none",
        "ds/deepseek-reasoner",
        "ds/deepseek-chat",  # upstream retired → 400; use v4-flash
        "vercel/glm-5.2",
        "glm-cn/glm-5.2",
    }
)


@dataclass(frozen=True)
class NineRouterConfig:
    base_url: str
    api_key: str
    primary_model: str
    customer_model: str
    fallback_model: str
    health_url: str
    budget_pct: float
    allowlist: frozenset[str] = field(default_factory=frozenset)

    @property
    def configured(self) -> bool:
        return bool(self.base_url and self.api_key)


def _env(*names: str, default: str = "") -> str:
    for name in names:
        val = os.environ.get(name)
        if val:
            return val.strip()
    return default


def load_config() -> NineRouterConfig:
    base_url = _env("NINEROUTER_BASE_URL", "OPENAI_BASE_URL", default="https://ai-router.nexifyai.cloud/v1")
    # W-05: CUSTOM_API_KEY ist der Universal-Key (lokal+remote). NINEROUTER_KEY
    # ist für beide Endpoints tot; NINEROUTER_API_KEY kann in einigen
    # EnvironmentFiles einen alten rotierten Wert tragen. Reihenfolge:
    # CUSTOM_API_KEY zuerst.
    api_key = _env("CUSTOM_API_KEY", "NINEROUTER_API_KEY", "NINEROUTER_KEY", "OPENAI_API_KEY")
    primary = _env("PRIMARY_MODEL", default="nexifyai-combo-llm")
    customer = _env("CUSTOMER_MODEL", default="ds/deepseek-v4-flash")
    fallback = _env("FALLBACK_MODEL", default="ds/deepseek-v4-flash")
    # Prefer dedicated health endpoint; derive from base_url when unset.
    health = _env("NINEROUTER_HEALTH_URL")
    if not health:
        root = base_url.rstrip("/")
        if root.endswith("/v1"):
            root = root[:-3]
        health = f"{root}/api/health" if root.startswith("http") else "http://127.0.0.1:20128/api/health"
    allow_raw = _env("NINEROUTER_MODEL_ALLOWLIST")
    allowlist = frozenset(m.strip() for m in allow_raw.split(",") if m.strip()) if allow_raw else frozenset()
    try:
        budget_pct = float(_env("NINEROUTER_BUDGET_PCT", default="0") or "0")
    except ValueError:
        budget_pct = 0.0
    return NineRouterConfig(
        base_url=base_url,
        api_key=api_key,
        primary_model=primary,
        customer_model=customer,
        fallback_model=fallback,
        health_url=health,
        budget_pct=budget_pct,
        allowlist=allowlist,
    )


class CostBrakeError(RuntimeError):
    """Raised when NINEROUTER_BUDGET_PCT exceeds governance Cost-Brake threshold."""


class NineRouter:
    """OpenAI-compatible client wrapper with model policy + fallbacks."""

    def __init__(self, config: NineRouterConfig | None = None):
        self.config = config or load_config()
        self.client = AsyncOpenAI(
            base_url=self.config.base_url or None,
            api_key=self.config.api_key or "missing-key",
        )

    def resolve_model(self, purpose: Purpose = "internal", explicit: str | None = None) -> str:
        if explicit:
            model = explicit
        elif purpose == "customer":
            model = self.config.customer_model
        elif purpose == "agent":
            model = self.config.primary_model
        else:
            model = self.config.primary_model

        if self.config.allowlist and model not in self.config.allowlist:
            logger.warning("model %s not in allowlist; falling back to %s", model, self.config.fallback_model)
            model = self.config.fallback_model

        if purpose == "customer" and model in CUSTOMER_UNSAFE_MODELS:
            logger.warning(
                "customer purpose refused unsafe model %s → %s",
                model,
                self.config.customer_model
                if self.config.customer_model not in CUSTOMER_UNSAFE_MODELS
                else "ds/deepseek-v4-flash",
            )
            safe = self.config.customer_model
            if safe in CUSTOMER_UNSAFE_MODELS:
                safe = "ds/deepseek-v4-flash"
            model = safe
        return model

    def check_cost_brake(self) -> None:
        pct = self.config.budget_pct
        if pct <= 0:
            return
        if pct > 200:
            raise CostBrakeError(f"P0 Cost-Brake: budget {pct}% > 200% — escalate")
        if pct > 150:
            raise CostBrakeError(f"Cost-Brake: budget {pct}% > 150% — task abort")
        if pct >= 80:
            logger.warning("Cost-Brake warning: budget at %.1f%% — prefer cheaper models", pct)

    @staticmethod
    def extract_content(resp: Any) -> str:
        msg = resp.choices[0].message
        content = (msg.content or "").strip()
        if not content:
            # DeepSeek Think-Max liefert bei JSON-Tasks manchmal NUR
            # reasoning_content. Reasoning ist weder Kundentext noch gültiges
            # JSON (V-9R-01) — niemals als content verwenden. Leerer String
            # löst Retry im Caller aus statt kaputtes JSON zu liefern.
            return ""
        if "<think>" in content:
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.S).strip()
        return content

    async def complete(
        self,
        messages: list[dict],
        *,
        purpose: Purpose = "internal",
        model: str | None = None,
        max_tokens: int = 4000,
        retries: int = 3,
        thinking: dict | None = None,
    ) -> str:
        self.check_cost_brake()
        primary = self.resolve_model(purpose, model)
        chain = [primary]
        if self.config.fallback_model and self.config.fallback_model not in chain:
            chain.append(self.config.fallback_model)

        last_err: Exception | None = None
        for attempt in range(retries):
            use_model = chain[min(attempt, len(chain) - 1)]
            try:
                kwargs: dict[str, Any] = dict(model=use_model, messages=messages, max_tokens=max_tokens)
                if thinking is not None:
                    # JSON-Tasks: kein Reasoning nötig → schneller + sauberer
                    # content (Think-Max liefert sonst leeren content).
                    # OpenAI-SDK: unbekannte Felder nur via extra_body.
                    kwargs["extra_body"] = {"thinking": thinking}
                resp = await self.client.chat.completions.create(**kwargs)
                content = self.extract_content(resp)
                if content:
                    if use_model != primary:
                        logger.info("llm_complete served via fallback model %s", use_model)
                    return content
                last_err = RuntimeError(f"empty LLM response from {use_model}")
            except CostBrakeError:
                raise
            except Exception as e:
                last_err = e
            logger.warning(
                "llm_complete attempt %s/%s failed (%s); next model=%s",
                attempt + 1,
                retries,
                last_err,
                chain[min(attempt + 1, len(chain) - 1)],
            )
        assert last_err is not None
        raise last_err

    async def stream(self, messages: list[dict], *, purpose: Purpose = "customer", max_tokens: int = 3000):
        self.check_cost_brake()
        primary = self.resolve_model(purpose)
        try:
            return await self.client.chat.completions.create(
                model=primary,
                messages=messages,
                max_tokens=max_tokens,
                stream=True,
            )
        except Exception as e:
            fb = self.config.fallback_model
            if not fb or fb == primary:
                raise
            logger.warning("primary stream failed (%s); routing via fallback (%s)", e, fb)
            return await self.client.chat.completions.create(
                model=fb,
                messages=messages,
                max_tokens=max_tokens,
                stream=True,
            )

    async def health(self) -> dict[str, Any]:
        import urllib.request

        status: dict[str, Any] = {
            "configured": self.config.configured,
            "base_url": self.config.base_url,
            "primary_model": self.config.primary_model,
            "customer_model": self.config.customer_model,
            "fallback_model": self.config.fallback_model,
            "budget_pct": self.config.budget_pct,
            "reachable": False,
            "http_status": None,
        }
        if not self.config.health_url:
            return status
        try:
            req = urllib.request.Request(self.config.health_url, method="GET")
            with urllib.request.urlopen(req, timeout=5) as resp:  # noqa: S310 — operator-controlled URL
                status["http_status"] = resp.status
                status["reachable"] = 200 <= resp.status < 300
        except Exception as e:
            status["error"] = str(e)
        return status


# Process-wide singleton used by server.py
router = NineRouter()
