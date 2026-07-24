# P0-003: 9Router Current State Check

> **Datum**: 2026-06-12  
> **Auftraggeber**: Pascal  
> **Status**: ABGESCHLOSSEN  
> **Evidenz-Typ**: Runtime State + Config Scan  
> **Scope**: NeXify (9Router-6kxn)

---

## 1. 9Router Container

| Eigenschaft | Wert |
|---|---|
| **Container-Name** | `9router-6kxn-niner-router-1` |
| **Image** | `ghcr.io/decolua/9router:latest` |
| **Status** | ✅ Up (seit 3 Minuten nach Neustart, uptime 16h total) |
| **Port-Mapping** | `127.0.0.1:20128 -> 20128/tcp` |
| **Host-Netzwerk** | Standard Docker Bridge, kein Host-Mode |

**Kommando**: `docker ps | grep 9router`  
**Ports**: `docker inspect` → `NetworkSettings.Ports` → `{"20128/tcp": [{"HostIp":"127.0.0.1","HostPort":"20128"}]}`

---

## 2. Verfügbare Modelle

**Quelle**: `/tmp/router_v2.json` (9 Stück) + API-Abfrage `/v1/models` (9 Stück)

| # | Modell-ID | Provider | Typ |
|---|---|---|---|
| 1 | `nexifyai-combo-llm` | Combo (DS Flash + Reasoner) | DEFAULT |
| 2 | `ds/deepseek-v4-pro` | DeepSeek | Pro |
| 3 | `ds/deepseek-v4-pro-max` | DeepSeek | Pro Max |
| 4 | `ds/deepseek-v4-pro-none` | DeepSeek | Pro None |
| 5 | `ds/deepseek-v4-flash` | DeepSeek | Fast LLM |
| 6 | `ds/deepseek-chat` | DeepSeek | Chat |
| 7 | `ds/deepseek-reasoner` | DeepSeek | Reasoning |
| 8 | `nscale/meta-llama/Llama-3.3-70B-Instruct` | NScale | Open LLM |
| 9 | `nscale/Qwen/Qwen2.5-Coder-32B-Instruct` | NScale | Coder LLM |

**API-Abfrage**: `curl http://127.0.0.1:20128/v1/models` → 9 Modelle bestätigt.  
**Hinweis**: Gegenüber IST-Dokument (7 Stück) sind aktuell 9 Modelle registriert. GPT-4o, Claude-Sonnet, Gemini und Llama-4-Scout fehlen/NICHT registriert.

---

## 3. ANTHROPIC_BASE_URL und Claude-Config

### 3.1 Env-Vars (aktiv)

| Variable | Wert | Quelle |
|---|---|---|
| `ANTHROPIC_BASE_URL` | `https://ai-router.nexifyai.cloud/v1` | `~/.profile`, `~/.bashrc` |
| `ANTHROPIC_MODEL` | `nexifyai-combo-llm` | `~/.profile`, `~/.bashrc` |
| `OPENAI_BASE_URL` | `https://api.deepseek.com` | `~/.profile` (separat, für direkten DeepSeek-Zugriff) |

### 3.2 Keine OPENAI_BASE_URL als primäre Claude Config

- `~/.claude/settings.json` enthält **keine** `openai`- oder `OPENAI_BASE_URL`-Einträge
- `ANTHROPIC_BASE_URL` zeigt auf 9Router
- `OPENAI_BASE_URL` existiert nur in `~/.profile` für direkten DeepSeek-Zugriff (nicht für Claude)

---

## 4. 9Router Skills Dir

| Pfad | Status |
|---|---|
| `/workspace/nexify/07_tools_cli/9router/` | ✅ Existiert |
| `/workspace/nexify/07_tools_cli/9router/skills/` | ✅ Neu erstellt (war nicht vorhanden) |

### 4.1 Heruntergeladene Skills von GitHub

| Datei | Größe | Quelle |
|---|---|---|
| `/workspace/nexify/07_tools_cli/9router/skills/9router.SKILL.md` | 2992 Bytes | `raw.githubusercontent.com/decolua/9router/.../skills/9router/SKILL.md` |
| `/workspace/nexify/07_tools_cli/9router/skills/9router-chat.SKILL.md` | 2543 Bytes | `raw.githubusercontent.com/decolua/9router/.../skills/9router-chat/SKILL.md` |

---

## 5. Vorhandene 9Router Config-Dateien

| Datei | Beschreibung |
|---|---|
| `9ROUTER_TARGET_STATE_V1.md` | Ziel-Zustand (V1) |
| `05_blocker/9ROUTER_NO_CRASH_POLICY.md` | No-Crash-Policy |
| `02_config/9ROUTER_CURRENT_STATE.md` | IST-Zustand (veraltet, 7 Modelle) |
| `02_config/9ROUTER_TARGET_STATE_NEXIFYAI_COMBO_LLM.md` | Ziel-Konfiguration Combo-LLM |
| `03_tests/9ROUTER_COMBO_LLM_TEST_PLAN.md` | Testplan Combo-LLM |
| `01_subskills/9router-web-search/NEXIFY_USAGE_RULES.md` | Web-Search Usage Rules |

---

## 6. Abweichungen IST vs. Dokumentation

| Aspekt | Dokumentiert (IST-Dokument) | Tatsächlich (Runtime) | Abweichung |
|---|---|---|---|
| Modelle | 7 | 9 | +2 (ds/deepseek-chat, ds/deepseek-v4-pro-none) |
| GPT-4o | Gelistet | Fehlt | OpenAI nicht aktiv |
| Claude-Sonnet | Gelistet | Fehlt | Anthropic nicht aktiv |
| Gemini 2.5 Flash | Gelistet | Fehlt | Google nicht aktiv |
| Llama-4-Scout | Gelistet | Fehlt | Meta nicht aktiv |

---

## 7. Befehle

```bash
# Container-Status
docker ps | grep 9router

# Port-Inspect
docker inspect $(docker ps -q --filter name=9router) | python3 -c "..."

# Modelle (JSON)
cat /tmp/router_v2.json

# Modelle (API)
curl -s http://127.0.0.1:20128/v1/models

# Env-Vars check
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_MODEL

# Skills-Download
curl -s https://raw.githubusercontent.com/decolua/9router/refs/heads/master/skills/9router/SKILL.md
curl -s https://raw.githubusercontent.com/decolua/9router/refs/heads/master/skills/9router-chat/SKILL.md
```

---

## 8. Risiken

1. **IST-Dokument veraltet**: Zeigt 7 Modelle, Runtime hat 9 (OpenAI/Anthropic/Google/Meta fehlen ganz)
2. **Kein OpenAI/Anthropic-Fallback**: Wenn DeepSeek-Pro-Provider ausfällt, kein automatischer Fallback zu anderen kommerziellen Providern
3. **Port nur localhost**: `127.0.0.1:20128` → kein externer Zugriff ohne Tunnel

---

## 9. Rollback

Nicht anwendbar (reine Lese-/Check-Aktion, keine Änderungen).

---

## 10. Brain-Nutzung

- **Gequeryt**: Nein (reine Runtime-Checks, kein NeXify-Projekt-Kontext nötig)
- **Gespeichert**: Nein
- **Begründung**: Keine Architektur-/Entscheidungs-Änderung, nur Status-Aufnahme
