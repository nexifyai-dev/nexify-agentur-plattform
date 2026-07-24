# Kilo CLI Capability Audit V1

> **Stand**: 2026-06-10 | **Reviewer**: Subagent 20260610_25 | **Status**: DRAFT

---

## 1. Identifikation

| Feld | Wert |
|---|---|
| **Projekt** | Kilo (Kilo CLI) – „All-in-one agentic engineering platform" |
| **Repository** | https://github.com/Kilo-Org/kilocode |
| **Sprache** | TypeScript / JavaScript (NPM) |
| **Stars** | ~20.000 |
| **Forks** | ~2.650 |
| **Erstellt** | 2025-03-10 |
| **Letztes Update** | 2026-06-10 (stündlich aktiv) |
| **Letzte Releases** | v7.3.42 (2026-06-10, pre), v7.3.41, v7.3.40, v7.3.39 — **extrem hohe Release-Frequenz** |
| **Lizenz** | **MIT** — vollständig OSS-freundlich |

---

## 2. Lizenz-Prüfung

| Kriterium | Bewertung |
|---|---|
| **Lizenztyp** | MIT — permissiv |
| **Kommerzielle Nutzung** | ✅ Unbeschränkt |
| **Modifikation** | ✅ Erlaubt |
| **Weitergabe** | ✅ Erlaubt |
| **Haftungsausschluss** | Ja, Standard MIT |
| **NeXify-Kompatibilität** | ✅ **Vollständig** — keine Einschränkungen |

---

## 3. Technologie

- **Sprache**: TypeScript (98 %), JavaScript (2 %)
- **Runtime**: Node.js (>= 18)
- **Paketmanager**: NPM (`npx kilocode`)
- **Plattform**: macOS, Linux, Windows (Terminal)
- **UI**: Terminal-basiert mit reichhaltiger TUI
- **State**: `.kilocode/` Verzeichnis im Projekt-Root

---

## 4. Funktionsumfang

### 4.1 Multi-Model-Support (500+ Modelle)

Kilo unterstützt über 500 Modelle via OpenRouter und direkte Anbieter:

| Provider | Status |
|---|---|
| **OpenRouter** | ✅ 500+ Modelle (einschl. deepseek-reasoner, deepseek-v4-flash) |
| **Anthropic** | ✅ Claude 3.5 Sonnet, Claude 4 Opus |
| **OpenAI** | ✅ GPT-4o, GPT-4.1, o1-preview, o3 |
| **Google** | ✅ Gemini 2.0/2.5 Pro/Flash |
| **Groq** | ✅ Llama 3, Mixtral |
| **Ollama** | ✅ Lokale Modelle |
| **Custom** | ✅ Via OpenRouter-kompatible Endpunkte |

### 4.2 MCP-Server-Marktplatz

| Feature | Beschreibung |
|---|---|
| **MCP-Server-Umfang** | ~500+ verfügbare MCP-Server |
| **Auto-Install** | `kilo mcp add <package>` |
| **MCP Discovery** | Integrierte Suche im Marktplatz |
| **Custom MCP** | Lokale MCP-Server via Konfiguration |
| **MCP-Tool-Execution** | Volle Tool-Nutzung aus Chat/Plan |

### 4.3 Betriebsmodi

| Modus | Beschreibung |
|---|---|
| **Plan-Modus** | `kilo plan` — Erstellt strukturierte Pläne mit Architektur-Entscheidungen |
| **Coder-Modus** | `kilo code` — Führt Implementierung aus |
| **Debugger-Modus** | `kilo debug` — Debugging mit Kontext |
| **Chat-Modus** | `kilo` (Default) — Interaktiver Chat mit Tool-Nutzung |
| **Batch-Modus** | `kilo run <file>` — Scripted Execution |
| **Test-Modus** | `kilo test` — Test-generierung und -ausführung |

### 4.4 Weitere Features

- **Git-Integration**: Commit-Erstellung, Branch-Management, Diff-Analyse
- **Terminal-Execution**: Shell-Befehle mit Output-Parsing
- **Datei-Editing**: Semantisches Editieren mit undo/redo
- **Context-Fenster**: Konfigurierbare Kontext-Größe
- **Sessions**: Resume-fähig (`kilo session resume`)
- **Rules/Instructions**: Projekt-spezifische Rules (`KILO_RULES.md`, `CLAUDE.md`)
- **Custom Tools**: Erweiterbar via MCP und Kilo Extensions

---

## 5. agentmemory-Integration

### 5.1 MCP-Integration

```json
// kilocode.json
{
  "mcpServers": {
    "agentmemory": {
      "command": "npx",
      "args": ["@nexify/agentmemory-mcp"],
      "env": {
        "AGENTMEMORY_URL": "http://agentmemory.nexifyai.cloud/"
      }
    }
  }
}
```

### 5.2 Plugin-Integration

Kilo unterstützt JavaScript-Plugins. Ein agentmemory-Plugin könnte:

- `onSessionStart`: Memories laden, Kontext prüfen
- `onToolCall`: Context anreichern
- `onSessionEnd`: Handoff schreiben
- `onError`: Fehler mit Kontext loggen

### 5.3 Lifecycle

```
Kilo Session Start
  → Plugin: load_context(user, project)
  → Memory in System-Prompt injecten
Kilo Tool Call
  → MCP: check_context(tool_call, current_goal)
  → Relevante Memories als Kontext anreichern
Kilo Edit/Command
  → MCP: record(action, result, file, timestamp)
Kilo Session End
  → Plugin: handoff(session_id, summary, artifacts)
  → Memories persistieren
```

---

## 6. 9Router-Integration

```json
// kilocode.json — Provider-Konfiguration
{
  "provider": {
    "name": "openrouter",
    "baseUrl": "https://ai-router.nexifyai.cloud/v1",
    "apiKey": "$NEXIFY_ROUTER_KEY",
    "models": {
      "default": "nexifyai-combo-llm",
      "planning": "deepseek-reasoner",
      "coding": "nexifyai-combo-llm",
      "debugging": "deepseek-reasoner"
    }
  }
}
```

---

## 7. Vergleich mit Alternativen

| Kriterium | Kilo CLI | Goose CLI | Goose ACC | Hermes CLI | Crush | Claude Code |
|---|---|---|---|---|---|---|
| **Stars** | ~20K | ~15K | — | ~8K | ~25K | — |
| **Lizenz** | MIT | Apache 2.0 | Apache 2.0 | MIT | FSL-1.1 | Proprietär |
| **Multi-Model** | 500+ | 200+ | 5 | 100+ | 10+ | 3 |
| **MCP** | ✅ 500+ Server | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Plan-Modus** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Worker-Ketten** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **WebUI** | ❌ | ❌ | ✅ | ✅ (Hermes WebUI) | ❌ | ❌ |
| **agentmemory-ready** | MCP/Plugin | MCP/Skill | MCP/Skill | MCP/Plugin | MCP | ❌ |
| **Terminal-only** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Release-Frequenz** | Täglich | Wöchentlich | — | Monatlich | Täglich | Monatlich |

---

## 8. Pilotaufgaben

| # | Aufgabe | Modus | Erwartung |
|---|---|---|---|
| 1 | READ_ONLY_REVIEW eines NeXify-Moduls | `kilo plan` | Strukturierter Review mit Architekturanalyse |
| 2 | DIFF_REVIEW eines PRs | `kilo code` | Inline-Kommentare, Sicherheitscheck |
| 3 | Implementierung eines neuen MCP-Tools | `kilo code` | Test-first, TypeScript, Dokumentation |
| 4 | Refactoring Legacy-Code | `kilo plan` + `kilo code` | Plan + Schritt-für-Schritt-Refactoring |
| 5 | Test-Suite-Erweiterung | `kilo test` | Edge Cases, Integrationstests |
| 6 | agentmemory-Handoff-Test | Kilo → Goose ACC | Session-übergreifende Memory-Kontinuität |
| 7 | 9Router-Failover-Test | Kilo → 9Router | Modell-Fallback bei Rate-Limits |

---

## 9. Security-Risiken & Mitigation

| Risiko | Beschreibung | Mitigation |
|---|---|---|
| **NPM-Supply-Chain** | 500+ MCP-Server = erhöhte Supply-Chain-Angriffsfläche | Nur geprüfte/gepinnte Pakete |
| **API-Key-Management** | Keys in JSON-Konfiguration | Environment-Variablen erzwingen |
| **Shell-Execution** | Beliebige Shell-Befehle | `allowedCommands`-Whitelist |
| **Plugin-Code** | Plugins haben Dateisystem-Zugriff | Sandbox per Container |
| **Rate-Limit-Bypass** | Multi-Provider könnte Rate-Limits umgehen | Central 9Router-Rate-Limiting |

---

## 10. Fazit

| Aspekt | Bewertung |
|---|---|
| **Lizenz** | ✅ MIT — optimal |
| **Aktivität** | ✅ Extrem aktiv (tägliche Releases) |
| **Multi-Model** | ✅ 500+ Modelle — Marktführer |
| **MCP-Ökosystem** | ✅ 500+ MCP-Server |
| **agentmemory-Integration** | ✅ MCP + Plugin — einfach |
| **9Router-Integration** | ✅ OpenRouter-kompatibel |
| **Skalierung** | ⚠️ Kein Worker-Ketten-Modell |

**Empfehlung**: ✅ **Kilo CLI ist der primäre Coding-Agent für NeXify.** Wegen MIT, aktivster Entwicklung, riesigem MCP-Ökosystem und einfacher agentmemory-Integration. Pilotaufgaben starten mit READ_ONLY_REVIEW und DIFF_REVIEW.
