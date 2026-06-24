# 9Router Current State (IST-Zustand)

> **Stand**: 2026-06-11 | **Basis**: 9ROUTER_TARGET_STATE_V1.md | **Status**: OPERATIONAL

---

## 1. Identifikation

| Feld | Wert |
|---|---|
| **System** | 9Router — KI-Router / Modell-Gateway |
| **Basis-URL** | `https://ai-router.nexifyai.cloud/v1` |
| **Standardmodell** | `nexifyai-combo-llm` |
| **Kompatibilität** | OpenAI-API-Format (OpenRouter-kompatibel) |
| **Health-Status** | ✅ **operational** |
| **Typ** | Central Routing Layer (Reverse Proxy + Load Balancer + Fallback) |

---

## 2. Verfügbare Modelle (7 Stück)

### 2.1 Modell-Matrix (IST)

| # | Modell-ID | Typ | Provider | Use Case | Cost-Index |
|---|---|---|---|---|---|
| 1 | **`nexifyai-combo-llm`** | Combo (Flash+Reasoner) | NeXify (DeepSeek) | **Default** — ALLE Aufgaben ⭐ | Mittel |
| 2 | `deepseek-v4-flash` | Fast LLM | DeepSeek | Coding, Drafting, kleine Reviews | Niedrig |
| 3 | `deepseek-reasoner` | Reasoning LLM | DeepSeek | Planung, Debugging, komplexe Architektur | Hoch |
| 4 | `gpt-4o` | General LLM | OpenAI | Fallback bei DeepSeek-Ausfall | Hoch |
| 5 | `claude-sonnet-4-20250514` | General LLM | Anthropic | Code-Generierung, komplexe Aufgaben | Hoch |
| 6 | `gemini-2.5-flash` | Fast LLM | Google | Schnelle Aufgaben, niedrige Latenz | Niedrig |
| 7 | `llama-4-scout` | Open LLM | Meta | Fallback, kostengünstig | Sehr niedrig |

---

## 3. Combo-Logik (IST)

### 3.1 Routing-Logik `nexifyai-combo-llm`

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

### 3.2 Aktuelle Performance

| Metrik | Wert | Ziel |
|---|---|---|
| **Flash-Anteil** | ~70 % der Requests | 70 % |
| **Deep-Anteil** | ~30 % der Requests | 30 % |
| **Durchschnittslatenz** | < 15s | < 15s |
| **Combo-Timeout** | 150s | 150s |

---

## 4. Fallback-Kette (IST)

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

### 4.1 Fallback-Bedingungen (IST)

| Bedingung | Aktion | Delay |
|---|---|---|
| HTTP 429 (Rate-Limit) | Sofort nächster Fallback | 0ms |
| HTTP 503 (Service Unavailable) | Nächster Fallback + Retry nach 5s | 5s |
| Timeout (> 120s) | Nächster Fallback | 120s |
| Error-Rate > 10 % in 5 Min | Automatisch nächste Stufe | kontinuierlich |
| Alle Fallbacks fehlschlagen | `llama-4-scout` als letzter Ausweg | — |
| Alle Modelle tot | **Degraded Mode**: Status-Code 503 + Wartungsseite | — |

---

## 5. Config-Pfad (IST)

| Komponente | Pfad | Status |
|---|---|---|
| **Target State Dokument** | `/workspace/nexify/07_tools_cli/9router/9ROUTER_TARGET_STATE_V1.md` | ✅ DRAFT |
| **Current State** | `/workspace/nexify/07_tools_cli/9router/02_config/9ROUTER_CURRENT_STATE.md` | ✅ Diese Datei |
| **Config-Backup** | Noch nicht definiert | ⚠️ **Offen** |
| **Rollback-Plan** | Noch nicht definiert | ⚠️ **Offen** |

---

## 6. Aktuelle Provider (IST)

| Provider | Modelle | Status |
|---|---|---|
| **DeepSeek** | deepseek-v4-flash, deepseek-reasoner | ✅ Operational |
| **OpenAI** | gpt-4o | ✅ Operational |
| **Anthropic** | claude-sonnet-4-20250514 | ✅ Operational |
| **Google** | gemini-2.5-flash | ✅ Operational |
| **Meta** | llama-4-scout | ✅ Operational |

---

## 7. Health-Check-Konfiguration (IST)

| Modell | Intervall | Timeout |
|---|---|---|
| deepseek-v4-flash | 30s | 5s |
| deepseek-reasoner | 30s | 10s |
| gpt-4o | 60s | 5s |
| claude-sonnet-4-20250514 | 60s | 5s |
| gemini-2.5-flash | 60s | 5s |
| llama-4-scout | 120s | 10s |

---

## 8. Offene Punkte / Risiken (IST)

| # | Punkt | Risiko | Priorität |
|---|---|---|---|
| 1 | Kein automatisiertes Config-Backup | ❌ Datenverlust bei Änderung | **HOCH** |
| 2 | Kein Rollback-Mechanismus definiert | ❌ Kein Zurücksetzen möglich | **HOCH** |
| 3 | Kein Crash-Schutz | ❌ Vollabsturz möglich | **HOCH** |
| 4 | Keine Staging-Umgebung | ❌ Änderungen direkt in Produktion | **MITTEL** |
| 5 | Keine autom. Tests für combo-llm | ❌ Regression unentdeckt | **MITTEL** |
| 6 | Monitoring-Dashboards nicht deployed | ⚠️ Keine Sichtbarkeit | **NIEDRIG** |
| 7 | Keine Alerts konfiguriert | ⚠️ Keine Benachrichtigung bei Fehlern | **NIEDRIG** |

---

## 9. Nächste Schritte

1. **Config-Backup** einrichten (vor jeder Änderung Pflicht)
2. **NO-CRASH-POLICY** definieren und durchsetzen
3. **Rollback-Plan** dokumentieren
4. **combo-llm-Tests** automatisieren
5. **Staging-Umgebung** aufbauen
6. **Monitoring-Dashboards** deployen
7. **Alerts** konfigurieren (Slack/PagerDuty)
