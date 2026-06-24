# 9Router Target State V1 — KI-Router für NeXify

> **Stand**: 2026-06-10 | **Reviewer**: Subagent 20260610_25 | **Status**: DRAFT

---

## 1. Identifikation

| Feld | Wert |
|---|---|
| **System** | 9Router — KI-Router / Modell-Gateway |
| **Basis-URL** | `https://ai-router.nexifyai.cloud/v1` |
| **Standardmodell** | `nexifyai-combo-llm` |
| **Kompatibilität** | OpenAI-API-Format (OpenRouter-kompatibel) |
| **Typ** | Central Routing Layer (Reverse Proxy + Load Balancer + Fallback) |

---

## 2. Verfügbare Modelle (7 Stück)

### 2.1 Modell-Matrix

| # | Modell-ID | Typ | Provider | Use Case | Cost-Index |
|---|---|---|---|---|---|
| 1 | **`nexifyai-combo-llm`** | Combo (Flash+Reasoner) | NeXify (DeepSeek) | **Default** — ALLE Aufgaben ⭐ | Mittel |
| 2 | `deepseek-v4-flash` | Fast LLM | DeepSeek | Coding, Drafting, kleine Reviews | Niedrig |
| 3 | `deepseek-reasoner` | Reasoning LLM | DeepSeek | Planung, Debugging, komplexe Architektur | Hoch |
| 4 | `gpt-4o` | General LLM | OpenAI | Fallback bei DeepSeek-Ausfall | Hoch |
| 5 | `claude-sonnet-4-20250514` | General LLM | Anthropic | Code-Generierung, komplexe Aufgaben | Hoch |
| 6 | `gemini-2.5-flash` | Fast LLM | Google | Schnelle Aufgaben, niedrige Latenz | Niedrig |
| 7 | `llama-4-scout` | Open LLM | Meta | Fallback, kostengünstig | Sehr niedrig |

### 2.2 Standardmodell: `nexifyai-combo-llm` im Detail

```
nexifyai-combo-llm:
  routing:
    - model: deepseek-v4-flash
      mode: fast
    - model: deepseek-reasoner
      mode: deep
  logic:
    - Einfache Anfragen (Status, einfaches Lesen): → flash
    - Komplexe Anfragen (Architektur, Debugging): → reasoner
    - Gemischte Anfragen: flash draft → reasoner review
  timeout:
    flash: 30s
    reasoner: 120s
    combo: 150s (flash + reasoner)
```

**Vorteile des Combo-Modells**:
- Kosteneffizienz: 70 % der Anfragen nur flash
- Qualität: 30 % deep + flash-draft/reviewer-review
- Latenz: Durchschnitt < 15s (vs. 60s+ pure reasoner)

---

## 3. Fallback-Strategie

### 3.1 Fallback-Kette

```
Primär: nexifyai-combo-llm (deepseek-v4-flash + deepseek-reasoner)
  ↓ (Timeout / Rate-Limit / Error)
Fallback 1: gpt-4o (OpenAI)
  ↓ (Timeout / Rate-Limit / Error)
Fallback 2: claude-sonnet-4-20250514 (Anthropic)
  ↓ (Timeout / Rate-Limit / Error)
Fallback 3: gemini-2.5-flash (Google)
  ↓ (Timeout / Rate-Limit / Error)
Fallback 4: llama-4-scout (Meta) — letzter Ausweg
```

### 3.2 Fallback-Bedingungen

| Bedingung | Aktion | Delay |
|---|---|---|
| HTTP 429 (Rate-Limit) | Sofort nächster Fallback | 0ms |
| HTTP 503 (Service Unavailable) | Nächster Fallback + Retry nach 5s | 5s |
| Timeout (> 120s) | Nächster Fallback | 120s |
| Error-Rate > 10 % in 5 Min | Automatisch nächste Stufe | kontinuierlich |
| Alle Fallbacks fehlschlagen | `llama-4-scout` als letzter Ausweg | — |
| Alle Modelle tot | **Degraded Mode**: Status-Code 503 + Wartungsseite | — |

### 3.3 Health-Check-Intervall

| Modell | Intervall | Timeout |
|---|---|---|
| deepseek-v4-flash | 30s | 5s |
| deepseek-reasoner | 30s | 10s |
| gpt-4o | 60s | 5s |
| claude-sonnet-4-20250514 | 60s | 5s |
| gemini-2.5-flash | 60s | 5s |
| llama-4-scout | 120s | 10s |

---

## 4. Hermes-Integration

### 4.1 Konfiguration

```javascript
// hermes.config.yaml
provider: 9router
baseUrl: https://ai-router.nexifyai.cloud/v1
apiKey: ${NEXIFY_ROUTER_KEY}
model: nexifyai-combo-llm
fallbacks:
  - gpt-4o
  - claude-sonnet-4-20250514
  - llama-4-scout
```

### 4.2 Hermes WebUI Routing

```
Hermes WebUI Request
  → 9Router: nexifyai-combo-llm (default)
  → Bei Chat-UI: flash mode (deepseek-v4-flash)
  → Bei Plan/Debug: deep mode (deepseek-reasoner)
  → Fallback bei Timeout: transparent
```

---

## 5. Goose-Integration

### 5.1 Konfiguration

```json
// ~/.config/goose/config.yaml
[[provider]]
name = "9router"
type = "openrouter"
base_url = "https://ai-router.nexifyai.cloud/v1"
api_key = "${NEXIFY_ROUTER_KEY}"
models = [
  { model = "nexifyai-combo-llm", usage = "default" },
  { model = "deepseek-v4-flash", usage = "plan" },
  { model = "deepseek-reasoner", usage = "review" },
]
```

### 5.2 ACC Goose Routing

```
Goose ACC Chain Step
  → 9Router Standard: nexifyai-combo-llm
  → Worker-Typ-basiertes Routing:
    → Code-Worker: deepseek-v4-flash
    → Review-Worker: deepseek-reasoner
    → Plan-Worker: nexifyai-combo-llm
    → Test-Worker: deepseek-v4-flash
```

---

## 6. Monitoring-Plan

### 6.1 Metriken

| Metrik | Beschreibung | Alert-Schwelle |
|---|---|---|
| **`9router_requests_total`** | Alle Requests | — |
| **`9router_latency_seconds`** | Latenz pro Modell | > 30s P95 |
| **`9router_errors_total`** | Fehler pro Modell | > 5 % |
| **`9router_fallbacks_total`** | Fallback-Zähler | > 10 % der Requests |
| **`9router_rate_limits_total`** | Rate-Limit-Treffer | > 1/min |
| **`9router_combo_latency`** | Combo-Latenz (flash+reasoner) | > 150s |
| **`9router_cost_per_request`** | Kosten pro Request | > $0.05 |
| **`9router_model_health`** | Health-Status (0/1) | 0 → Pager |

### 6.2 Dashboards

```
Grafana Dashboard: 9Router Overview
  - Panel 1: Request Rate (RPS) pro Modell
  - Panel 2: Latenz P50/P95/P99 pro Modell
  - Panel 3: Error Rate pro Modell
  - Panel 4: Fallback-Kaskade (Sankey-Diagramm)
  - Panel 5: Kosten pro Tag/Woche/Monat
  - Panel 6: Combo-Modus-Effizienz (flash vs deep ratio)
```

### 6.3 Alerts

| Name | Bedingung | Aktion |
|---|---|---|
| `9router-HighErrorRate` | error_rate > 10 % für 5 Min | Slack + E-Mail |
| `9router-AllFallbacksActive` | Alle Modelle auf Fallback | PagerDuty |
| `9router-HighLatency` | P95 > 30s für 5 Min | Slack |
| `9router-ComboTimeout` | Combo > 150s | Slack |
| `9router-CostSpike` | Kosten > 2x Tagesdurchschnitt | Slack + Report |

---

## 7. API-Spezifikation

### 7.1 Chat Completions (OpenAI-kompatibel)

```http
POST https://ai-router.nexifyai.cloud/v1/chat/completions
Content-Type: application/json
Authorization: Bearer ${NEXIFY_ROUTER_KEY}

{
  "model": "nexifyai-combo-llm",
  "messages": [
    {"role": "system", "content": "Du bist ein KI-Assistent..."},
    {"role": "user", "content": "Erkläre das Konzept..."}
  ],
  "temperature": 0.7,
  "max_tokens": 4096,
  "stream": true
}
```

### 7.2 Custom 9Router-Header

| Header | Zweck |
|---|---|
| `X-9Router-Mode` | `fast` (nur flash), `deep` (nur reasoner), `combo` (default) |
| `X-9Router-Timeout` | Timeout in Sekunden |
| `X-9Router-Client` | Client-Identifikation (z.B. `hermes-webui`, `goose-acc`) |
| `X-9Router-Session` | Session-ID für Tracking |

---

## 8. Zielarchitektur

```
┌──────────────────────────────────────────────────────────────────────┐
│                          NeXify Agenten                              │
├──────────┬──────────┬──────────┬──────────┬──────────┬───────────────┤
│ Goose    │ Goose    │ Kilo CLI │ Hermes   │ Hermes   │ Crush         │
│ CLI      │ ACC      │          │ CLI      │ WebUI    │               │
└──────────┴──────────┴──────────┴──────────┴──────────┴───────────────┘
       │          │          │          │          │          │
       └──────────┴──────────┴──────────┴──────────┴──────────┘
                                │
                    ┌───────────▼────────────┐
                    │      9Router            │
                    │  ai-router.nexifyai.cloud│
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │ Combo Router     │  │
                    │  │ (flash/reasoner) │  │
                    │  └──────────────────┘  │
                    │  ┌──────────────────┐  │
                    │  │ Fallback Chain   │  │
                    │  │ (5 Stufen)       │  │
                    │  └──────────────────┘  │
                    │  ┌──────────────────┐  │
                    │  │ Health-Checker   │  │
                    │  │ (alle 30-120s)   │  │
                    │  └──────────────────┘  │
                    └────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
   ┌────▼────┐           ┌──────▼──────┐          ┌─────▼─────┐
   │ DeepSeek  │           │   OpenAI    │          │  Anthropic │
   │ v4-flash  │           │   GPT-4o    │          │  Sonnet 4  │
   │ reasoner  │           │             │          │            │
   └──────────┘           └────────────┘          └───────────┘
        │                       │                       │
   ┌────▼────┐           ┌──────▼──────┐          ┌─────▼─────┐
   │  Google  │           │    Meta     │          │  (Reserve)  │
   │ Gemini   │           │  Llama 4    │          │             │
   │ 2.5 Flash│           │  Scout      │          │             │
   └──────────┘           └────────────┘          └───────────┘
```

---

## 9. Fazit

| Aspekt | Bewertung |
|---|---|
| **Modell-Vielfalt** | ✅ 7 Modelle, 5 Provider |
| **Combo-Strategie** | ✅ nexifyai-combo-llm (flash + reasoner) |
| **Fallback** | ✅ 4-stufige Kette + letzter Ausweg |
| **OpenAI-Kompatibel** | ✅ Alle Agenten können integrieren |
| **Monitoring** | ✅ Metriken, Dashboards, Alerts |
| **Risiko** | ⚠️ Single-Point-of-Failure (9Router selbst) |

**Empfehlung**: ✅ **9Router als zentrales KI-Gateway etablieren.** `nexifyai-combo-llm` als Standard setzen. Alle Agenten MÜSSEN via 9Router routen (kein Direktzugriff auf Provider). Monitoring-Setup priorisieren.
