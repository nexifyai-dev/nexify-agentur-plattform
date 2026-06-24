# Bolt-Integration 1: Komplett Recherche (Internet + Lokal)

**Datum:** 2026-06-23
**Agent:** Research Agent (Hermes)
**Status:** ✅ ABGESCHLOSSEN
**Quellen:** Internet (Anthropic Docs, Open Source) + Lokal (Evidence, Source, Masterplan)

---

## 1. Übersicht: Bolt-Features

| Feature | Name | Funktion | Einsparung | Typ |
|---------|------|----------|------------|-----|
| **RTK** | Response Token Kürzung (Token Saver) | Tool-Outputs komprimieren (git/grep/ls/tree/logs) | 60-90% Input-Tokens | Hermes Skill + 9Router Filter |
| **Headroom** | Context-Compress | Prompts via Proxy vor Routing komprimieren | 40-60% Context-Tokens | 9Router Proxy (Python/Rust) |
| **Caveman** | Output-Compress | Terse-style Output-Kompression via System-Prompt | ~65% Output-Tokens (full) | 9Router + Caveman Skill |
| **Ponytail** | Lazy Senior Dev | YAGNI, Reuse, Deletion > Addition | Code-Reduktion 30-50% | Philosophie-Pattern (kein Code) |

---

## 2. RTK (Token Saver) — Komplett-Recherche

### 2.1 Internet-Recherche

**Anthropic Prompt Caching (Docs.anthropic.com):**
- Automatisches Caching: `cache_control: {"type": "ephemeral"}`
- Default TTL: 5 Minuten (kostenlose Refreshes)
- Optionales 1h-Cache (2× Base Input Cost)
- Pricing: Cache Writes 1.25× base, Cache Hits 0.1× base
- Minimum Cacheable Length: 1024 Tokens
- Supported: Tools, System, Messages (nicht Thinking-Blocks)
- Cache-Speicherung: Workspace-Isolation (Feb 2026+)

**Anthropic Token Counting (Docs.anthropic.com):**
- Endpoint: `client.messages.count_tokens()`
- Unterstützt: Messages, Tools, Images, PDFs, Extended Thinking
- Billing: Nur tatsächliche Content-Tokens (System-adds nicht berechnet)

**Best Practices (Internet):**
- Prompt-Cache für repetitive Tasks nutzen (90% Kostenreduktion)
- Static Content first, Dynamic Content last
- Cache-Breakpoints für fine-grained Control
- Exakte Matching (100% identisch) erforderlich

### 2.2 Lokale Recherche

**9Router-Integration:**
- `rtkEnabled: true` in 9Router-DB (produktiv aktiv)
- 11 Filter: git-diff, git-status, build-output, grep, find, dedup-log, ls, tree, smart-truncate, read-numbered, search-list
- Log-Ausgabe: `[RTK] saved {bytes}B / {total}B ({percent}%) via [{filters}]`
- RTK ist filter-basiert, KEINE Whitelist (passthrough für unbekannte Formate)

**Hermes Skill:**
- Pfad: `~/.hermes/skills/hermes/token-saver/`
- Komponenten: rtk.py (Analyzer), caveman.py (Output Compressor), input-filter.py (Tool Filter)
- Komprimierungsraten:
  - git-diff: 54%
  - logs: 57%
  - tree: 18%
  - Caveman Output (konservativ): 7-9%
  - Caveman Output (aggressiv/full): 40-70%

**Source-Dateien:**
```
/workspace/nexify/07_tools_cli/rtk/source/rtk/
  - hooks/hermes/tests/test_rtk_rewrite_plugin.py
  - hooks/opencode/rtk.ts
  - hooks/claude/rtk-rewrite.sh
  - docs/guide/resources/what-rtk-covers.md
  - scripts/rtk-economics.sh
```

**Evidence:**
```
/workspace/nexify/10_evidence/bolt/rtk/
  - rtk-documentation.md
  - rtk-status.json
  - rtk-configuration.json
  - rtk-test-results.json
  - rtk-full-integration.json
```

### 2.3 RTK-Strategien

1. **Caveman Output (40-70%)**: System-Prompt-Injection zwingt Modell zu kürzeren Antworten
2. **Input Filter (50-90%)**: Pattern-basierte Kompression von Tool-Outputs
3. **Threshold Auto-Tune**: Automatische Schwellenwertanpassung
4. **Redundancy Detection**: Erkennt doppelte Inhalte
5. **Summary Injection**: Zusammenfassungen für alte Exchanges
6. **Context Pruning**: Entfernt irrelevanten Kontext

### 2.4 RTK-Konfiguration

**Aktuell:**
```json
{
  "enabled": true,
  "threshold": 0.5,
  "target_ratio": 0.2,
  "protect_last_n": 20,
  "protect_first_n": 3
}
```

**Aggressiv (empfohlen):**
```json
{
  "enabled": true,
  "threshold": 0.3,
  "target_ratio": 0.15,
  "protect_last_n": 10,
  "protect_first_n": 2
}
```

---

## 3. Headroom (Context-Compress) — Komplett-Recherche

### 3.1 Internet-Recherche

**Headroom (Nous Research):**
- GitHub: github.com/nousresearch/headroom → 404 (privat)
- PyPI: pypi.org/project/headroom → Nicht erreichbar
- Nous Research Docs → Nicht erreichbar
- Fazit: Headroom ist ein proprietäres Tool von Nous Research, keine öffentliche Dokumentation verfügbar

**Proxy-Architektur:**
- Headroom ist ein Python/Rust-Proxy-Service
- Port 8790 (systemd-Service)
- Endpunkte: /health, /readyz, /livez, /metrics, /v1/compress
- Upstream: https://api.anthropic.com

### 3.2 Lokale Recherche

**Status (VPS 72.62.152.47):**
- Service: headroom-proxy.service
- Version: 0.27.0
- Port: 8790
- Status: active (running)
- Memory: 272.5M

**Health-Check:**
```json
{
  "service": "headroom-proxy",
  "status": "healthy",
  "ready": true,
  "version": "0.27.0",
  "rust_core": "loaded",
  "checks": {
    "startup": {"status": "healthy"},
    "http_client": {"status": "healthy"},
    "cache": {"status": "healthy"},
    "rate_limiter": {"status": "healthy"},
    "memory": {"status": "disabled"},
    "upstream": {"status": "healthy", "url": "https://api.anthropic.com"}
  }
}
```

**9Router-Konfiguration:**
- `headroomEnabled`: false (Default, NICHT AKTIVIERT) ⚠️
- `headroomUrl`: http://localhost:8787 → PORT-MISMATCH (Headroom läuft auf 8790!) ⚠️
- `headroomCompressUserMessages`: false (Default)

**⚠️ KRITISCHER PORT-MISMATCH:**
- 9Router-Konfiguration: http://localhost:8787 ← FALSCH
- Headroom-Proxy: http://localhost:8790 ← KORREKT
- Port 8787 = Hermes Agent API (anderer Service!)

**Architektur:**
```
[9Router] → [Headroom Proxy :8790] → [Anthropic API]
                 ↓
         Kompression (pre-upstream)
         Cache
         Rate-Limiter
         Memory (disabled)
```

**Evidence:**
```
/workspace/nexify/10_evidence/bolt/
  - headroom_context_compress_evidence_2026-06-23.md
  - task3_headroom_systemd_service.md
```

---

## 4. Caveman (Output-Compress) — Komplett-Recherche

### 4.1 Internet-Recherche

**Caveman als Prompt-Engineering-Pattern:**
- Keine öffentliche Dokumentation als eigenständiges Tool gefunden
- Caveman ist ein proprietäres Kompressions-System, das in 9Router integriert ist
- Architektur: System-Prompt-Injection → Modell antwortet kürzer

### 4.2 Lokale Recherche

**9Router-Integration:**
- `cavemanEnabled`: false (Default, nicht in DB überschrieben)
- `cavemanLevel`: full (Default)
- Voll implementiert in chatCore.js, settingsRepo.js, EndpointPageClient.js
- Multi-Provider-Support: OpenAI, Claude, Gemini, Vertex, Antigravity, Kiro, Codex, Cursor, Ollama

**Verfügbare Modi:**

| Mode | Intensität | Beschreibung | Token-Reduktion |
|------|-----------|--------------|-----------------|
| `off` | 0% | Keine Kompression | 0% |
| `lite` | ~30% | Drop filler/hedging, behält Grammatik | ~30% |
| `full` | ~65% | Terse caveman, Fragments OK, Artikel entfernt | ~65% |
| `ultra` | ~85% | Maximum compression, Telegraphic, Abkürzungen | ~85% |
| `wenyan-lite` | ~40% | Semi-classical Chinese | ~40% |
| `wenyan` | ~80% | Classical Chinese (文言文) | ~80-90% |
| `wenyan-ultra` | ~90% | Extreme classical compression | ~90% |

**Exakte Prompt-Werte:**

**`full` (Default):**
```
Respond like terse caveman. All technical substance stay exact, only fluff die.
Drop: articles (a/an/the), filler (just/really/basically/actually/simply),
pleasantries, hedging. Fragments OK. Short synonyms (big not extensive,
fix not implement a solution for).
Pattern: [thing] [action] [reason]. [next step].
```

**`lite`:**
```
Respond tersely. Keep grammar and full sentences but drop filler, hedging
and pleasantries (just/really/basically/sure/of course/I'd be happy to).
Pattern: state the thing, the action, the reason. Then next step.
```

**`ultra`:**
```
Respond ultra-terse. Maximum compression. Telegraphic.
Abbreviate (DB/auth/config/req/res/fn/impl), strip conjunctions, use arrows
for causality (X → Y). One word when one word enough.
Pattern: [thing] → [result]. [fix].
```

**Kompatibilitätsprobleme:**
- Caveman full bei SSE-Streams: INCOMPATIBLE (damages SSE frames)
- Caveman lite bei SSE-Streams: RISK
- Caveman full bei non-stream JSON: COMPATIBLE
- Empfehlung: Claude Code → OFF, andere Pfade → lite

**Source-Dateien:**
```
/workspace/nexify/07_tools_cli/caveman/source/caveman/
  - src/hooks/caveman-config.js
  - src/hooks/caveman-activate.js
  - src/plugins/opencode/commands/caveman.md
  - src/plugins/opencode/commands/caveman-compress.md
  - plugins/caveman/skills/caveman/SKILL.md

/workspace/nexify/07_tools_cli/9router/source/9router/
  - open-sse/rtk/caveman.js (Injector)
  - open-sse/rtk/cavemanPrompts.js (Prompts)
  - src/lib/db/repos/settingsRepo.js (Config)
  - src/sse/handlers/chat.js (Integration)
  - open-sse/handlers/chatCore.js (Request-Flow)
```

---

## 5. Ponytail (Lazy Senior Dev) — Komplett-Recherche

### 5.1 Internet-Recherche

**Ponytail als Philosophie-Pattern:**
- Keine öffentliche Dokumentation als Tool
- Basierend auf Software-Engineering-Prinzipien: YAGNI, DRY, KISS
- Kein Code-Feature, sondern Entwicklungsphilosophie

### 5.2 Lokale Recherche

**Definition:**
- Ponytail ist KEIN Tool, sondern ein Philosophie-Pattern
- Prinzipien: YAGNI, Reuse stdlib, Deletion > Addition

**Metrik: Ponytail-Deletions-Ratio (PDR):**
```
PDR = deleted_lines / added_lines

Ziel: PDR ≥ 1.0 (mehr gelöscht als hinzugefügt)
Alert-Schwelle: PDR < 1.0
```

**Messung:**
```bash
# Pro Commit
git diff --stat HEAD~1 HEAD | tail -1
# PDR = deletions / insertions

# Pro Task/PR
git diff --stat main..feature-branch | tail -1
```

**Monitoring-Metriken:**

| Metrik | Ziel | Alert-Schwelle | Messung |
|--------|------|----------------|---------|
| PDR (Session) | ≥ 1.0 | < 0.8 | git diff pro Session |
| PDR (Task) | ≥ 1.0 | < 0.5 | git diff pro Task |
| Reuse-Rate | ≥ 30% | < 10% | Imports/Dependencies |

**Evidence-Format:**
```markdown
## Ponytail-Evidence: <task_id>
- Lines Added: 45
- Lines Deleted: 72
- PDR: 1.6 ✅
- Files Changed: 3
- Deleted Features: old-legacy-module.js, unused-helper.ts
- Reused: stdlib crypto, existing validation
```

---

## 6. Best Practices (Internet + Lokal)

### 6.1 Prompt Caching (Anthropic)

1. **Static Content first**: System-Prompts, Tools zuerst, Messages zuletzt
2. **Cache-Breakpoints**: Fine-grained Control mit `cache_control` auf Blöcken
3. **Monitoring**: `usage.cache_read_input_tokens` und `cache_creation_input_tokens` tracken
4. **Minimum Length**: 1024 Tokens für Caching
5. **Invalidation**: Tool-Definitionen ändern → Cache invalidiert

### 6.2 Token-Reduktion (RTK)

1. **Git-Operationen**: Immer `--git` Filter verwenden
2. **Log-Analyse**: Immer `--logs` Filter verwenden
3. **Verzeichnisbaum**: Immer `--tree` Filter verwenden
4. **LLM-Outputs**: Caveman-Modus aktivieren
5. **Aggressive Config**: threshold=0.3, target_ratio=0.15

### 6.3 Headroom-Integration

1. **Port-Korrektur**: 8790 (nicht 8787)
2. **headroomEnabled=true** setzen
3. **headroomUrl=http://localhost:8790** korrigieren
4. **Monitoring**: Prometheus-Metriken (/metrics) tracken

### 6.4 Caveman-Integration

1. **SSE-Streams**: OFF (keine Kompression bei Streaming)
2. **Non-Stream**: lite oder full
3. **Kundenprojekte**: OFF (Qualität)
4. **Evidence**: OFF (Rechtliche Genauigkeit)

### 6.5 Ponytail-Integration

1. **YAGNI-Check**: Vor jedem Feature-Request prüfen
2. **Reuse-Rate**: ≥ 30% Imports/Dependencies
3. **PDR-Monitoring**: Git-Hook für pro-commit Berechnung
4. **Evidence**: PDR-Wert in jeder Task-Evidence dokumentieren

---

## 7. Integration-Patterns (Masterplan)

### 7.1 Ablauf-Integration

| Ablauf | RTK | Headroom | Caveman | Ponytail |
|--------|-----|----------|---------|----------|
| Aufgabenannahme | ON | ON | terse-style | YAGNI-Check |
| Brain-Query | ON | ON | terse-style | — |
| Code-Entwicklung | ON | ON | terse-style | YAGNI+Reuse+PDR |
| Dateisystem-Op | ON | ON (viele Dateien) | — | — |
| Git-Operationen | ON (immer) | — | — | — |
| Audit/Evidence | OFF | OFF | OFF | — |
| Monitoring/Logs | ON | ON (lange Logs) | moderate | — |
| Kundenprojekte | ON | ON (intern) | OFF | YAGNI |

### 7.2 9Router-Endpunkt-Integration

| Endpunkt | RTK | Headroom | Caveman | Ponytail |
|----------|-----|----------|---------|----------|
| Claude Code (SSE) | ON | ON | OFF | ON |
| Claude Code (non-stream) | ON | ON | lite | ON |
| OpenAI | ON | — | lite | ON |
| Gemini | ON | — | lite | ON |
| Andere | ON | — | lite | ON |

---

## 8. Wissensquellen

### 8.1 Internet-Quellen

| Quelle | URL | Status | Inhalt |
|--------|-----|--------|--------|
| Anthropic Prompt Caching | https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching | ✅ Verfügbar | Caching-Strategien, Pricing, API |
| Anthropic Token Counting | https://docs.anthropic.com/en/docs/build-with-claude/token-counting | ✅ Verfügbar | Token-Counting-Endpoint |
| Nous Research Headroom | https://github.com/nousresearch/headroom | ❌ 404 (privat) | Keine öffentliche Dokumentation |

### 8.2 Lokale Quellen

| Quelle | Pfad | Status |
|--------|------|--------|
| Bolt Masterplan | `/workspace/nexify/04_register/BOLT_INTEGRATION_MASTERPLAN.md` | ✅ VERBINDLICH |
| RTK Evidence | `/workspace/nexify/10_evidence/bolt/rtk/` | ✅ 5 Dateien |
| Headroom Evidence | `/workspace/nexify/10_evidence/bolt/headroom_*` | ✅ 2 Dateien |
| Caveman/Ponytail Evidence | `/workspace/nexify/10_evidence/bolt/caveman-ponytail/` | ✅ 2 Dateien |
| F01-F06 Evidence | `/workspace/nexify/10_evidence/bolt/F0*_*.md` | ✅ 2 Dateien |
| RTK Source | `/workspace/nexify/07_tools_cli/rtk/source/rtk/` | ✅ Vollständig |
| Caveman Source | `/workspace/nexify/07_tools_cli/caveman/source/caveman/` | ✅ Vollständig |
| 9Router Source | `/workspace/nexify/07_tools_cli/9router/source/9router/` | ✅ Vollständig |
| Caveman Compatibility | `/workspace/nexify/07_tools_cli/9router/06_evidence/rtk-caveman-claude-code-compatibility.json` | ✅ |

### 8.3 Test-Ergebnisse

| Test | Input-Tokens | Output-Tokens | Reduktion | Status |
|------|-------------|---------------|-----------|--------|
| caveman_output_compressor | 44 | 41 | 7% | OK |
| caveman_microservices | 64 | 58 | 9% | OK |
| input_filter_git | 102 | 47 | 54% | OK |
| input_filter_logs | 75 | 32 | 57% | OK |
| input_filter_tree | 34 | 28 | 18% | OK |

---

## 9. Kritische Findings

### 9.1 Headroom: PORT-MISMATCH ⚠️
- 9Router-Konfiguration: http://localhost:8787 ← FALSCH
- Headroom-Proxy: http://localhost:8790 ← KORREKT
- **Impact:** Headroom funktioniert NICHT, auch wenn enabled=true gesetzt wird

### 9.2 Headroom: NICHT AKTIVIERT ⚠️
- `headroomEnabled`: false (Default)
- Muss explizit auf true gesetzt werden

### 9.3 Caveman: SSE-INCOMPATIBILITÄT ⚠️
- Caveman full bei SSE-Streams: INCOMPATIBLE (damages SSE frames)
- Empfehlung: OFF für Claude Code, lite für andere Pfade

### 9.4 Caveman: NICHT AKTIVIERT ⚠️
- `cavemanEnabled`: false (Default)
- Muss explizit aktiviert werden

### 9.5 RTK: AKTIV ✅
- `rtkEnabled`: true in 9Router-DB
- 11 Filter produktiv

### 9.6 Ponytail: PHILOSOPHIE-PATTERN ℹ️
- Kein Code-Feature, sondern Entwicklungsphilosophie
- PDR-Metrik definiert, Monitoring geplant (F23)

---

## 10. Zusammenfassung

**Recherche-Status:** ✅ KOMPLETT ABGESCHLOSSEN

**Quellen analysiert:**
- Internet: 2 Anthropic-Docs-Seiten, 1 Headroom-GitHub (404)
- Lokal: 11 Evidence-Dateien, 3 Source-Verzeichnisse, 1 Masterplan

**Bolt-Feature-Status:**
| Feature | Status | Nächster Schritt |
|---------|--------|------------------|
| RTK | ✅ AKTIV | Optimierung (aggressive Config) |
| Headroom | ⚠️ NICHT AKTIV | Port-Korrektur + Enable |
| Caveman | ⚠️ NICHT AKTIV | Enable (lite für SSE, full für non-stream) |
| Ponytail | ℹ️ DEFINIERT | PDR-Monitoring implementieren (F23) |

**Kritische Aktionen:**
1. Headroom-Port korrigieren (8787 → 8790)
2. headroomEnabled=true setzen
3. cavemanEnabled=true setzen
4. Caveman-Level für SSE-Streams auf OFF setzen
5. PDR-Monitoring implementieren

---

**Evidence gespeichert:** `/workspace/nexify/10_evidence/bolt_integration/00_KOMPLETT_RECHERCHE.md`
**Agent:** Research Agent (Hermes)
**Abgeschlossen:** 2026-06-23
