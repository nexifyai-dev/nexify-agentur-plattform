# Hermes CLI Plan V1

> **Stand**: 2026-06-10 | **Reviewer**: Subagent 20260610_25 | **Status**: DRAFT

---

## 1. Identifikation

| Feld | Wert |
|---|---|
| **Projekt** | Hermes CLI |
| **Repository** | https://github.com/Hermes-Org/hermes-cli |
| **Lizenz** | MIT |
| **Technologie** | TypeScript / Node.js |
| **Plattform** | macOS, Linux, Windows |
| **Sterne** | ~8.000 |
| **Letztes Update** | Aktiv (monatliche Releases) |
| **Typ** | Terminal-CLI mit WebUI-Erweiterung |

---

## 2. Provider-Strategie: 9Router (Kein Direkt-DeepSeek)

### 2.1 Grundsatz

> **Hermes CLI benutzt AUSSCHLIESSLICH 9Router als KI-Provider.**
> Kein direkter API-Key für DeepSeek, OpenAI oder andere Provider.
> Sämtliches Routing, Fallback und Rate-Limiting erfolgt zentral über 9Router.

### 2.2 Konfiguration

```yaml
# hermes.config.yaml
provider:
  type: openrouter  # 9Router ist OpenRouter-kompatibel
  baseUrl: https://ai-router.nexifyai.cloud/v1
  apiKey: ${NEXIFY_ROUTER_KEY}
  defaultModel: nexifyai-combo-llm
  models:
    - id: nexifyai-combo-llm
      name: NeXify Combo (Standard)
      type: default
    - id: deepseek-v4-flash
      name: DeepSeek Flash (Schnell)
      type: fast
    - id: deepseek-reasoner
      name: DeepSeek Reasoner (Tief)
      type: reasoning
    - id: gpt-4o
      name: GPT-4o (Fallback)
      type: fallback
    - id: claude-sonnet-4-20250514
      name: Claude Sonnet 4 (Fallback)
      type: fallback

  fallback:
    enabled: true
    strategy: chain  # Kette: combo → gpt-4o → claude
    maxRetries: 3
    timeout: 120s
```

### 2.3 Modell-Auswahl pro Aktivität

| Aktivität | Modell | Begründung |
|---|---|---|
| Chat / Quick-Ask | `nexifyai-combo-llm` | Combo-Effizienz |
| Code-Generierung | `deepseek-v4-flash` | Niedrige Latenz |
| Code-Review | `deepseek-reasoner` | Tiefe Analyse |
| Debugging | `nexifyai-combo-llm` | Flexibel flash→deep |
| Planung | `deepseek-reasoner` | Komplexe Entscheidungen |
| Dokumentation | `deepseek-v4-flash` | Lange Texte, günstig |

### 2.4 Fallback-Verhalten

```
Primär: nexifyai-combo-llm (oder gewähltes Modell)
  ↓ Timeout (30s bei flash, 120s bei reasoner)
→ gpt-4o (OpenAI)
  ↓ Timeout (120s)
→ claude-sonnet-4-20250514 (Anthropic)
  ↓ Timeout (120s)
→ Error: "Alle Provider nicht verfügbar. Bitte später erneut versuchen."
```

---

## 3. agentmemory-Verbindung

### 3.1 MCP-Server-Integration

```yaml
# hermes.config.yaml
mcpServers:
  agentmemory:
    command: npx
    args: ["@nexify/agentmemory-mcp"]
    env:
      AGENTMEMORY_URL: "http://agentmemory.nexifyai.cloud/"
      AGENTMEMORY_TOOLS: "all"
```

### 3.2 Plugin-Integration (tiefer)

```javascript
// plugins/agentmemory.js — Hermes Plugin
module.exports = {
  name: 'agentmemory',
  hooks: {
    async onSessionStart(session) {
      // 1. Lade project memories
      const context = await agentmemory.getContext({
        project: session.project,
        user: session.user
      });

      // 2. Lade handoff falls vorhanden
      const handoff = await agentmemory.search({
        category: 'handoff',
        tags: [`agent:hermes-cli`],
        limit: 1
      });

      // 3. Inject in system prompt
      if (handoff.length > 0) {
        session.systemPrompt += `\n\n[Vorherige Session: ${handoff[0].content}]`;
      }

      return { context, handoff };
    },

    async onToolCall(toolCall, session) {
      // Relevante Memories als Kontext anreichern
      const memories = await agentmemory.search({
        query: toolCall.params?.toString(),
        limit: 3
      });

      return { enrichedContext: memories };
    },

    async onSessionEnd(session) {
      // Handoff für nächste Session
      await agentmemory.handoff({
        sessionId: session.id,
        summary: session.summary,
        artifacts: session.artifacts,
        nextAgent: 'any',
        project: session.project
      });
    },

    async onError(error, session) {
      // Fehler in error_patterns speichern
      await agentmemory.remember({
        content: `Fehler: ${error.message}\nStack: ${error.stack}`,
        category: 'error_pattern',
        metadata: {
          agent: 'hermes-cli',
          session: session.id,
          importance: 3,
          tags: ['error', 'hermes-cli', session.project]
        }
      });
    }
  }
};
```

### 3.3 Session-Lifecycle

```
hermes session start
  → Plugin: onSessionStart
    → agentmemory: load_context(project, user)
    → Lade handoff memories
    → Lade project memories
    → Lade user preferences

hermes <command>
  → Plugin: onToolCall
    → agentmemory: search(query, limit=3)
    → Memory als enriched context

hermes session end
  → Summary generieren
  → Plugin: onSessionEnd
    → agentmemory: handoff(session, summary, artifacts)
    → TTL: 7 Tage

Bei Fehler:
  → Plugin: onError
    → agentmemory: remember(error, category=error_pattern)
```

---

## 4. Workstation-Status-Reporting

Hermes CLI meldet regelmäßig Status an agentmemory:

```yaml
# hermes.config.yaml
workstation:
  reporting:
    enabled: true
    interval: 60  # Sekunden
    metrics:
      - cpu_usage
      - memory_usage
      - disk_usage
      - uptime
      - active_sessions
```

**Report-Format:**

```json
{
  "agent": "hermes-cli",
  "workstation_id": "pascal-workstation",
  "timestamp": "2026-06-10T18:00:00Z",
  "status": "active",
  "metrics": {
    "cpu_usage": 45.2,
    "memory_usage": 62.1,
    "disk_usage": 78.3,
    "uptime": 3600,
    "active_sessions": 1
  },
  "current_session": "sess-abc-123",
  "current_task": "Code-Review PR #123"
}
```

**Verwendung**: Monitoring-Dashboard + Dispatcher-Entscheidungsgrundlage.

---

## 5. Session-Management

### 5.1 Session-Erstellung

```bash
hermes session start \
  --project nexiy \
  --model nexifyai-combo-llm \
  --memory auto
```

### 5.2 Session-Resume

```bash
hermes session list
# → Zeigt letzte 10 Sessions mit Status

hermes session resume sess-abc-123
# → Lädt Handoff, stellt Kontext wieder her
```

### 5.3 Session-Parallelität

| Feature | Unterstützt |
|---|---|
| Parallele Sessions | ✅ Ja (max 3) |
| Session-Tagging | ✅ `--tags review,security` |
| Session-Priorität | ✅ `--priority high` |
| Session-Timeout | ✅ Default 30 Min, konfigurierbar |
| Auto-Save | ✅ Alle 5 Minuten |

### 5.4 Handoff-Protokoll

```bash
# Session manuell beenden mit Handoff
hermes session end \
  --handoff "Review abgeschlossen. Nächster Schritt: Implementierung" \
  --next goose-acc \
  --artifacts "{\"files_changed\": [\"src/api.ts\"], \"findings\": 3}"
```

---

## 6. Vergleich mit anderen CLI-Tools

| Kriterium | Hermes CLI | Goose CLI | Kilo CLI | Crush |
|---|---|---|---|---|
| **Provider** | 9Router-only | 9Router + Direkt | 9Router + OpenRouter | Direkt + OpenRouter |
| **agentmemory** | MCP + Plugin | MCP + Skill | MCP + Plugin | MCP |
| **WebUI** | ✅ Ja (separat) | ❌ | ❌ | ❌ |
| **Plugin-System** | ✅ Lifecycle-Hooks | ❌ (Skills) | ✅ JS-Plugins | ❌ |
| **Workstation-Report** | ✅ Built-in | ❌ | ❌ | ❌ |
| **Session-Management** | ✅ Parallel + Resume | ✅ Basic | ✅ Advanced | ✅ Sessions |
| **Lizenz** | MIT | Apache 2.0 | MIT | FSL-1.1 |
| **Stars** | ~8K | ~15K | ~20K | ~25K |

---

## 7. Pilotaufgaben

| # | Aufgabe | Erwartung |
|---|---|---|
| 1 | 9Router-Verbindung testen | Alle 5 Modelle erreichbar, Fallback funktioniert |
| 2 | agentmemory MCP-Integration | Session-Start → Tool-Call → Ergebnis → Handoff |
| 3 | agentmemory Plugin-Integration | Lifecycle-Hooks (Start, ToolCall, End, Error) |
| 4 | Workstation-Reporting | Alle 60s Report in agentmemory |
| 5 | Parallel-Session-Test | 3 Sessions gleichzeitig, kein Konflikt |
| 6 | Handoff Hermes → Goose ACC | Memory bleibt erhalten, Context stimmt |
| 7 | 9Router-Failover-Test | DeepSeek down → automatisch GPT-4o |

---

## 8. Fazit

| Aspekt | Bewertung |
|---|---|
| **9Router-Integration** | ✅ Ausschließlich 9Router — klar und kontrolliert |
| **agentmemory-Integration** | ✅ MCP + Plugin (Lifecycle-Hooks) |
| **Workstation-Reporting** | ✅ Einzigartiges Feature für Monitoring |
| **Session-Management** | ✅ Parallel, Resume, Tagging |
| **WebUI-Integration** | ✅ Hermes WebUI als separate Oberfläche |
| **Lizenz** | ✅ MIT — unbeschränkt |

**Empfehlung**: ✅ **Hermes CLI aufnehmen als sekundäres CLI-Tool** mit Fokus auf 9Router-only-Provider, agentmemory-Lebenszyklus und Workstation-Reporting. Plugin-System erlaubt tiefste Integration von agentmemory.
