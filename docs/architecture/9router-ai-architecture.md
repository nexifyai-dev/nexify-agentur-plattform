# NeXify AI — 9router AI-Architektur

> **Gesamtabstimmung / Vollintegration:** [`9ROUTER_VOLLINTEGRATION.md`](./9ROUTER_VOLLINTEGRATION.md)  
> **Code-SSOT:** `backend/ninerouter.py`

## Überblick
9router (v0.5.18) ist der zentrale AI-Modell-Router auf dem VPS unter `ai-router.nexifyai.cloud`.
Er aggregiert mehrere Provider hinter einer OpenAI-kompatiblen API (live: 60+ Modell-IDs inkl. Aliase).

## Zugang
| Zugang | URL | Port |
|--------|-----|------|
| Extern (Cloudflare) | `https://ai-router.nexifyai.cloud/v1` | 443 |
| VPS-intern | `http://127.0.0.1:20128/v1` | 20128 |
| Compose | `/docker/9router-6kxn/` | – |

## Eigenmodell-Combo `nexifyai-combo-llm`
Die Combo-Kette routet automatisch durch (primär → fallback):
1. `ds/deepseek-v4-pro` (DeepSeek, primär)
2. `ds/ds-max` (DeepSeek)
3. `xmtp/mimo-v2.5-pro` (Xiaomi MiMo Token-Plan, AMS-Region)
4. `vercel/glm-5.2` (Vercel AI Gateway)

Bei leerem `content` (deepseek-v4-pro-Eigenheit → `reasoning_content`) salvaged das Backend.

## Beteiligte Provider
- **DeepSeek** – primärer Chat/Reasoning
- **Xiaomi MiMo** – Token-Plan (tp-), AMS-Region
- **NScale** – skalierbares Hosting
- **Codex** – OAuth (nexify.login@gmail.com)
- **Vercel AI Gateway** – Gateway glm-5.2
- **You.com** – Websuche
- **AI Proxy (eigen)** – Platzhalter für Eigenmodelle

## Hermes-Integration
Alle 16 Hermes-Profile nutzen 9router via:
```yaml
provider: openai-api
base_url: http://localhost:20128/v1
api_key: <system-key>
default_model: nexifyai-combo-llm
```

## Backend-Integration (`backend/ninerouter.py` → `server.py`)
```python
NINEROUTER_BASE_URL = https://ai-router.nexifyai.cloud/v1
PRIMARY_MODEL   = nexifyai-combo-llm   # agents / Hermes
CUSTOMER_MODEL  = ds/deepseek-chat     # website chat / offers / planner
FALLBACK_MODEL  = ds/deepseek-chat
# Retries with real model switch + reasoning_content salvage + <think> strip
# Cost-Brake via NINEROUTER_BUDGET_PCT; health via GET /api/health/llm
```

## Webhook Gateway
Die 4 Webhook-Subscriptions laufen auf dem VPS:
- `http://localhost:8644/webhooks/aktuelle-logs`
- `http://localhost:8644/webhooks/telegram`
- `http://localhost:8644/webhooks/github-comment`
- `http://localhost:8644/webhooks/nexify-global` (Wildcard `*`)

## Wichtige Hinweise
- `deepseek-v4-pro` legt Text in `reasoning_content` → `content` leer → NICHT direkt nutzen für Kundentexte
- Für saubere Chat-Texte: `ds/deepseek-chat` (→ deepseek-v4-flash)
- MiMo sk-Konto: 402 Insufficient balance → nur Token-Plan (tp-) aktiv
- Combo meiden für Kundentexte (glm-5.2 leakt Reasoning)
