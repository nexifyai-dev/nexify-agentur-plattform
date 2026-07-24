# 9Router — Claude Code Conversion Evidence

> **Stand**: 2026-06-11T11:43+02:00
> **Session**: 20260611_6 (fortgesetzt)
> **Verantwortlich**: Goose AI
> **Template-Version**: 1.0

---

## 1. Zusammenfassung

Claude Code wurde vollständig von **MiniMax M3** auf **9Router OSS** mit dem
systemweiten Standard-Combo-Modell **nexifyai-combo-llm** umgestellt.

---

## 2. Änderungen im Überblick

### 2.1 Environment-Variablen (bereits in Session 20260611_6 gesetzt)

| Variable | Alter Wert | Neuer Wert |
|---|---|---|
| `ANTHROPIC_BASE_URL` | `https://api.minimax.io/anthropic` | `https://ai-router.nexifyai.cloud/v1` |
| `ANTHROPIC_AUTH_TOKEN` | `$MINIMAX_API_KEY` | `sk-97034a83a8033b14-5egxwa-39eea87d` |
| `ANTHROPIC_MODEL` | `MiniMax-M3` | `nexifyai-combo-llm` |

Quelle: `~/.profile`, `~/.bashrc`, `~/.nexify/claude-env.sh`

### 2.2 Dokumentation korrigiert

| Datei | Änderung |
|---|---|
| `~/.claude/CLAUDE.md` | Model-Sektion: MiniMax M3 → 9Router + nexifyai-combo-llm |
| `~/.claude/CLAUDE-META-CHIEF-ORCHESTRATOR-AUTOPILOT.md` | Führungsebene: 9Router + combo-llm; Modell-Details aktualisiert |
| SHA-256 im CLAUDE.md-Loader | Aktualisiert auf neuen Meta-Prompt-SHA |

### 2.3 NScale als vollwertiger Provider in 9Router OSS

NScale wurde als Provider in die 9Router-Datenbank eingetragen:

| Feld | Wert |
|---|---|
| **Provider-Typ** | `nscale` (built-in in 9Router) |
| **Auth** | API-Key (JWT) |
| **Status** | ✅ Aktiv |
| **Modelle** | `nscale/meta-llama/Llama-3.3-70B-Instruct` |
| | `nscale/Qwen/Qwen2.5-Coder-32B-Instruct` |
| **Endpoint** | `https://aiproxy.infaas-amd-dev.glo1.nscale.com` |

### 2.4 9Router-API-Keys (vollständig)

| Key-Prefix | Name | Erstellt |
|---|---|---|
| `sk-97034a83a8033b14-ijhhux-4a3f10ba` | system | 2026-06-07 |
| `sk-97034a83a8033b14-lun295-ea7fc449` | nutzer | 2026-06-07 |
| `sk-97034a83a8033b14-5egxwa-39eea87d` | claude-code | 2026-06-11 |
| `sk-97034a83a8033b14-evpb1d-ef639619` | goose-ai-cli | 2026-06-10 |

---

## 3. Systemarchitektur (aktuell)

```
Claude Code / Goose AI
       │
       ▼
┌── 9Router OSS ──────────────────────────┐
│  nexifyai-combo-llm (Combo)              │
│  ├── ds/deepseek-reasoner   (round-robin)│
│  └── ds/deepseek-v4-flash   (sticky: 3)  │
│                                          │
│  Provider:                                │
│  ├── DeepSeek  (aktiv)                   │
│  ├── NScale    (aktiv) ✨ NEU            │
│  ├── You.com   (pending)                 │
│  └── OpenRouter (deaktiviert, rate-limited)│
└──────────┬───────────────────────────────┘
           │
           ▼
    https://ai-router.nexifyai.cloud/v1
    (Cloudflare Tunnel → localhost:32794)
```

---

## 4. nexifyai-combo-llm Zusammensetzung

| Combo-ID | Modelle | Strategie |
|---|---|---|
| `nexifyai-combo-llm` | `["ds/deepseek-reasoner", "ds/deepseek-v4-flash"]` | round-robin, sticky: 3 |

Standard-DeepSeek-Konfiguration:
- **BASE_URL**: `https://api.deepseek.com`
- **Modell**: `deepseek/deepseek-v4-flash`
- **API-Key**: `sk-3096c64782334172a87c83c0dab96557`

---

## 5. Sonderfälle (ausserhalb combo-llm)

| Anwendungsfall | Empfohlenes Modell |
|---|---|
| Embeddings | `nscale/Qwen/Qwen3-Embedding-8B` |
| Spezialisierte LLM-Aufgaben | `nscale/meta-llama/Llama-3.3-70B-Instruct` |
| Coding-Aufgaben | `nscale/Qwen/Qwen2.5-Coder-32B-Instruct` |
| Fallback bei Combo-Fehler | Direkter DeepSeek-Zugriff |
| Testing/Evaluation | Beliebiges Einzelmodell via 9Router |

---

## 6. Risikobewertung

| Risiko | Status | Massnahme |
|---|---|---|
| MiniMax M3 wird nicht mehr verwendet | ✅ Beseitigt | Alle Env-Vars und Docs aktualisiert |
| NScale-Token-Lösung umgangen | ✅ Beseitigt | NScale als 9Router-Provider mit API-Key |
| Combo-Modell fällt aus | ⚠️ Akzeptiert | Fallback auf DeepSeek direkt |
| 9Router-Ausfall | ⚠️ Akzeptiert | Claude Code fällt ohne 9Router aus |

---

## 7. Backup-Nachweis

| Backup | Pfad |
|---|---|
| CLAUDE.md | `~/.claude/CLAUDE.md` (Version vor Edit im Git) |
| Meta-Prompt Backup 1 | `~/.claude/CLAUDE-META-CHIEF-ORCHESTRATOR-AUTOPILOT.md.bak-20260611` |
| Meta-Prompt Backup 2 | `~/.claude/CLAUDE-META-CHIEF-ORCHESTRATOR-AUTOPILOT.md.bak-20260611-v2` |
| 9Router-DB | Docker Volume `9router-6kxn_data` |

---

## 8. Nächste Schritte

1. OpenRouter-Provider reaktivieren (rate-limit klären)
2. NScale vision models testen (falls verfügbar)
3. You.com Web Search aktivieren (API-Key prüfen)
4. Regelmässiger 9Router-Health-Check via `check-9router-health.sh`

---

*Ende Evidence. 2026-06-11 | Goose AI | NeXify Internal*
