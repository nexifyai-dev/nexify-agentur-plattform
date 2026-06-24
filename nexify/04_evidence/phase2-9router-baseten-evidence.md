# Phase 2: 9Router-Konfiguration lokalisieren und Baseten-Modell-Route vorbereiten

**Status:** ✅ ABGESCHLOSSEN  
**Datum:** 2026-06-22  
**Autor:** Hermes Agent (Subagent)  
**Auftrag:** Phase 2 — 9Router-Konfiguration analysieren, Hermes-Provider/Model-Konfiguration prüfen, Baseten-Integration bewerten, Konfigurationsvorschlag erarbeiten.

---

## 1. ERGEBNISÜBERSICHT

| Frage | Antwort |
|---|---|
| 9Router läuft? | ✅ Ja, `9router-6kxn-niner-router-1` auf `172.18.0.2:20128` |
| 9Router API erreichbar? | ✅ Ja, via `127.0.0.1:20128` — aber API-Key erforderlich |
| 9Router Provider-System | **Neu:** Registry-basiert (94 Provider), KEIN Baseten registriert |
| Hermes → 9Router? | ✅ Ja, `provider: custom`, `base_url: https://ai-router.nexifyai.cloud/v1` |
| nexify-ceo Default-Modell | `gpt-5.4` — existiert NICHT in 9Router! |
| Baseten in 9Router? | ❌ **Nicht im laufenden Container.** Nur im alten Source-Code (disk) definiert |
| Baseten Credentials found? | ❌ Keine im Workspace, Hermes-Container oder 9Router-Container |
| 401 Error Root Cause | nexify-ceo verlangt `gpt-5.4`, aber 9Router hat nur `nexifyai-combo-llm` registriert |

---

## 2. 9ROUTER-KONFIGURATION (Container)

### 2.1 Container-Details

```yaml
Container: 9router-6kxn-niner-router-1
Image:     (Next.js App — 9Router, open-sse based)
Netzwerk:  9router-6kxn_default
IP:        172.18.0.2
Port:      Host 127.0.0.1:20128 → Container 20128
API-Basis: https://ai-router.nexifyai.cloud/v1
API-Key:   sk-970...10ba (Hermes config) — shared zwischen Hermes und 9Router
```

### 2.2 Provider-Registry (Container)

**Pfad:** `/app/open-sse/providers/registry/index.js` — **94 Provider** importiert  
**Dateien:** z.B. `deepseek.js`, `glm.js`, `glm-cn.js`, `opencode-go.js`, `openai.js`, etc.

**Baseten:** ❌ **NICHT in der Registry enthalten** — Keine `baseten.js` Datei im Verzeichnis.

### 2.3 Provider, die GLM-Modelle anbieten (Alternative zu Baseten)

| Provider | Modelle | URL |
|---|---|---|
| `glm` (Z.AI) | glm-5.2, glm-5.1, glm-5, glm-4.7 | `https://api.z.ai/api/coding/paas/v4/chat/completions` |
| `glm-cn` (BigModel) | glm-5.2, glm-5.1, glm-5, glm-4.7 | `https://open.bigmodel.cn/api/coding/paas/v4/chat/completions` |
| `opencode-go` | glm-5.2, glm-5.1, kimi-k2.7-code, deepseek-v4-pro | `https://opencode.ai/zen/go/v1/chat/completions` |
| `deepseek` (DS) | deepseek-v4-pro, deepseek-v4-flash, deepseek-reasoner | `https://api.deepseek.com/chat/completions` |

### 2.4 9Router unterstützt benutzerdefinierte Provider

```javascript
// Mechanism: openai-compatible-{name} prefix
const OPENAI_COMPATIBLE_PREFIX = "openai-compatible-";
// → Jeder OpenAI-kompatible Endpoint kann als Provider registriert werden
// → base_url aus credentials.providerSpecificData.baseUrl
```

---

## 3. HERMES-KONFIGURATION

### 3.1 Haupt-Config (`/home/hermeswebui/.hermes/config.yaml`)

```yaml
model:
  provider: custom
  base_url: https://ai-router.nexifyai.cloud/v1
  api_key: sk-970...10ba
  default: nexifyai-combo-llm
  api_mode: chat_completions
providers:
  custom:
    api_key: sk-970...10ba
    base_url: https://ai-router.nexifyai.cloud/v1
    models:
    - nexifyai-combo-llm
```

### 3.2 Profile «nexify-ceo» (`~/.hermes/profiles/nexify-ceo/config.yaml`)

```yaml
webui:
  dashboard:
    enabled: auto
    url: http://127.0.0.1:9119
model:
  default: gpt-5.4
agent:
  reasoning_effort: high
```

**Problem:** Das Profil überschreibt `model.default` auf `gpt-5.4`, aber verwendet KEINEN eigenen Provider/base_url.  
→ Hermes sendet `gpt-5.4` Requests an 9Router (`https://ai-router.nexifyai.cloud/v1`)  
→ 9Router kennt dieses Modell nicht → 401/404 Fehler

### 3.3 Umgebungsvariablen (Hermes Container)

```bash
HERMES_WEBUI_GATEWAY_BASE_URL=http://127.0.0.1:8645
HERMES_API_URL=http://127.0.0.1:8645
OPENAI_API_KEY=[REDACTED]
HERMES_WEBUI_GATEWAY_API_KEY=[REDACTED]
NEXIFYAI_API_KEY=[REDACTED]
```

**Kein** `BASETEN_API_KEY` oder ähnliches gefunden.

---

## 4. BASETEN-STATUS

### 4.1 Im lokalen Source-Code (disk) vorhanden, aber alt

**Pfad:** `/workspace/nexify/07_tools_cli/9router/source/9router/open-sse/config/providers.js`

```javascript
// Zeile 433:
baseten: { baseUrl: "https://inference.baseten.co/v1/chat/completions", format: "openai" },
```

**Pfad:** `/workspace/nexify/07_tools_cli/9router/source/9router/open-sse/config/providerModels.js`

```javascript
// Zeile 768-771:
baseten: [
  { id: "deepseek-ai/DeepSeek-R1", name: "DeepSeek R1" },
  { id: "meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B" },
],
```

**Wichtig:** Der Source-Code auf Disk ist eine **ältere Version** des 9Router, die eine **andere Config-Struktur** verwendet (statische `config/providers.js` + `config/providerModels.js`). Der laufende Container hat eine **neuere Registry-basierte Struktur** (`registry/{id}.js`).

### 4.2 Im laufenden Container: ❌ NICHT vorhanden

- Keine `baseten.js` in `/app/open-sse/providers/registry/`
- `config/providers.js` hat nur 19 Zeilen (Barrel-Import, enthält kein Baseten)
- `config/providerModels.js` hat kein Baseten
- Kein Baseten-API-Key in Umgebungsvariablen

### 4.3 Baseten Credentials

- `/workspace/.nexify/secrets/` enthält nur `system_connections.env.backup` (Bookando-Konfiguration)
- **Kein** Baseten-API-Key oder Secret im Workspace, Hermes-Container oder 9Router-Container gefunden

---

## 5. ROOT CAUSE: 401-FEHLER IN HERMES WEBUI (nexify-ceo)

### 5.1 Fehlerbild

```
Hermes WebUI zeigt nexify-ceo 401: "Authentication failed: HTTP 401: Missing Authentication header"
Provider scheint "Default" + Modell "GLM 5.2"
```

### 5.2 Analyse

1. **nexify-ceo Profil** setzt `model.default: gpt-5.4`
2. **WebUI Dashboard** URL: `http://127.0.0.1:9119` (lokal im Hermes-Container)
3. Der Hermes WebUI-Client (Dashboard auf Port 9119) versucht, Requests an den Hermes Gateway (`127.0.0.1:8645`) zu senden
4. Der Gateway routet an den konfigurierten Provider (`custom` = 9Router)
5. 9Router kennt kein Modell `gpt-5.4` → liefert 401/404

**Alternativ:** Der WebUI-Dashboard könnte direkt versuchen, den Provider (9Router) anzusprechen, ohne korrekte Auth-Header zu setzen.

### 5.3 Lösungsidee

- `model.default` im nexify-ceo Profil auf ein existierendes 9Router-Modell setzen (z.B. `nexifyai-combo-llm`)
- Oder einen dedicated 9Router-API-Key für die WebUI-Kommunikation konfigurieren
- Oder direkt die WebUI Dashboard-Authentifizierung korrigieren (basic_auth in Hermes Config)

---

## 6. KONFIGURATIONSVORSCHLAG: Baseten als 9Router-Provider

### 6.1 Variante A: Baseten als `openai-compatible-baseten` (Empfohlen)

9Router unterstützt custom OpenAI-kompatible Provider via Prefix:

| Parameter | Wert |
|---|---|
| Provider-Id | `openai-compatible-baseten` |
| base_url | `https://model-<id>.api.baseten.co` (`https://inference.baseten.co`) |
| Auth Schema | `Authorization: Bearer <baseten-api-key>` |
| Format | `openai` |
| Model-ID | `<deployed-model-name>` (z.B. `deepseek-ai/DeepSeek-R1`) |

**Vorteile:** Kein Neubau der 9Router-Registry nötig, funktioniert out-of-the-box mit dem openai-compatible Mechanismus.

**Config in Hermes (`~/.hermes/profiles/nexify-ceo/config.yaml`):**
```yaml
model:
  provider: openai-compatible-baseten
  base_url: https://model-xxxx.api.baseten.co
  api_key: <baseten-api-key>
  default: <model-name>
providers:
  openai-compatible-baseten:
    api_key: <baseten-api-key>
    base_url: https://model-xxxx.api.baseten.co
    models:
    - <model-name>
```

### 6.2 Variante B: Baseten als 9Router-Registry-Eintrag

1. Neue Datei `/app/open-sse/providers/registry/baseten.js` erstellen
2. Eintrag in `/app/open-sse/providers/registry/index.js` hinzufügen
3 API-Key als Umgebungsvariable oder im 9Router-Credential-Store ablegen

**Template:**
```javascript
export default {
  id: "baseten",
  priority: 70,
  alias: "baseten",
  display: {
    name: "Baseten",
    icon: "deployed_code",
    color: "#111827",
    textIcon: "BT",
    website: "https://baseten.co",
  },
  category: "apikey",
  authType: "apikey",
  transport: {
    baseUrl: "https://inference.baseten.co/v1/chat/completions",
    format: "openai",
  },
  models: [
    { id: "deepseek-ai/DeepSeek-R1", name: "DeepSeek R1" },
    { id: "meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B" },
  ],
};
```

### 6.3 Variante C: Hermes direkt auf Baseten (ohne 9Router)

Hermes kann Baseten direkt als Provider nutzen (OpenAI-kompatibel):

```yaml
model:
  provider: custom  # oder openai-compatible-baseten
  base_url: https://model-<id>.api.baseten.co/environments/production/sync/v1
  api_key: <baseten-api-key>
  default: <model-name>
```

**Nachteil:** Kein 9Router-Fallback, kein Routing, keine Combo-Logik.

### 6.4 Empfehlung

**Variante A** (openai-compatible-baseten) ist der schnellste Weg:
- Kein 9Router-Neubuild/Redeploy nötig
- 9Router behandelt den Provider automatisch als OpenAI-kompatibel
- Hermes kann direkt darauf zeigen oder 9Router als Zwischenschicht nutzen
- Voraussetzung: **Baseten-API-Key beschaffen und in Hermes/9Router-Konfiguration eintragen**

---

## 7. NÄCHSTE SCHRITTE (Phase 3)

1. **Baseten-API-Key beschaffen** (existiert nicht im Workspace)
2. **Entscheidung:** Direkt (Variante C) oder via 9Router (Variante A/B)?
3. **nexify-ceo Modell-Korrektur:** `model.default` von `gpt-5.4` auf existierendes Modell ändern
4. **Konfiguration umsetzen** und testen
5. **Evidence aktualisieren**

---

## 8. QUELLEN

| Quelle | Pfad |
|---|---|
| Hermes Haupt-Config | `~/.hermes/config.yaml` (Container: `/home/hermeswebui/.hermes/config.yaml`) |
| nexify-ceo Profil | `~/.hermes/profiles/nexify-ceo/config.yaml` |
| 9Router Provider Registry | Container: `/app/open-sse/providers/registry/` |
| 9Router Alias-Map | Container: `/app/open-sse/config/appConstants.js` |
| 9Router Source (alt, disk) | `/workspace/nexify/07_tools_cli/9router/source/9router/` |
| Baseten Training Reference | `/workspace/nexify/10_evidence/2026-06-21_BASETEN_TRAINING_REFERENCE.md` |
| 9Router Current State | `/workspace/nexify/07_tools_cli/9router/02_config/9ROUTER_CURRENT_STATE.md` |
