# Goose ACC & CLI Plan V1

> **Stand**: 2026-06-10 | **Reviewer**: Subagent 20260610_25 | **Status**: DRAFT

---

## 1. Identifikation

| Feld | Goose CLI | Goose ACC |
|---|---|---|
| **Typ** | Terminal-CLI (manuel) | Orchestrierte Automatisierung |
| **Lizenz** | Apache 2.0 | Apache 2.0 |
| **Repository** | https://github.com/block/goose | https://github.com/block/goose |
| **Technologie** | Rust (CLI) + TypeScript (Extensions) | Rust (Kernel) + TypeScript (Workers) |
| **Stars** | ~15.000 | — |
| **Nutzung** | Pascals Terminal-Interaktion | Worker-Ketten, CI/CD, Batch-Jobs |

---

## 2. Rollenverteilung

| Aspekt | Goose CLI | Goose ACC |
|---|---|---|
| **Betreiber** | Pascal (Mensch) | Automation Controller (System) |
| **Interaktionsform** | Terminal-Kommandozeile | Event-gesteuerte Worker-Chains |
| **Session-Typ** | Chat-Session (interaktiv) | Task (stateless, zustandsgesteuert) |
| **Modell-Routing** | 9Router (Benutzer wählt) | 9Router (Automatisch pro Worker-Typ) |
| **Primäres Werkzeug** | `goose run` | `goose-acc dispatch` |
| **Fehlerbehandlung** | Menschlicher Eingriff | Automatischer Retry + Circuit Breaker |
| **Agentmemory-Integration** | MCP + Skill (per Session) | MCP + Skill (per Task-Phase) |
| **Policy-Gate** | Manuelle Prüfung | Automatische 5-Stufen-Prüfung |

---

## 3. Goose CLI: Pascals Terminal-Interaktion

### 3.1 Betriebskonzept

```bash
# Session starten (Policy Gate vorab manuell durchlaufen)
goose session start --provider 9router --model nexifyai-combo-llm

# Skill laden / Policy Gate Schritt 1
goose skill load nexify-agentmemory

# Arbeit
goose run "Review PR #123"

# Session beenden + Handoff
goose session end --handoff "Review abgeschlossen, nächste Schritte..."
```

### 3.2 agentmemory-Anbindung (MCP)

```json
// ~/.config/goose/config.yaml
[[mcp]]
name = "agentmemory"
transport = "stdio"
command = "npx"
args = ["@nexify/agentmemory-mcp"]

[[mcp]]
name = "agentmemory-local"
transport = "stdio"
command = "npx"
args = ["@nexify/agentmemory-mcp"]
```

### 3.3 Skill-Zwangsladung

Beim Start MUSS `goose skill load nexify-agentmemory` ausgeführt werden.

```markdown
# Skills (CLAUDE.md / GOOSE.md)
- nexify-agentmemory: Pflicht-Skill für Memory-Integration
- nexify-policy-gate: Pflicht-Skill für Policy-Prüfung
- nexify-9router: Optionaler Skill für Routing-Konfiguration
```

### 3.4 Policy Gate (verkürzt für CLI)

```
Goose CLI Start
  → Step 1: Skill nexify-agentmemory laden (AUTO)
  → Step 2: Brain laden (AUTO)
  → Step 3: agentmemory Session-Context laden (AUTO)
  → Step 4: Policy Gate — allowed_actions prüfen (AUTO)
  → Step 5: Evidence-Sammler starten (AUTO)
  → Chat-Bereit
```

### 3.5 Evidence-Pflicht (CLI)

Jede Goose CLI Session erzeugt:

```markdown
# Evidence: GOOSE_CLI_REVIEW_[PROJEKT]_[DATUM].md
## Session
- Agent: Goose CLI vX.Y.Z
- Modell: nexifyai-combo-llm
- Dauer: HH:MM
- Tasks: [Aufgabenliste]

## Policies
- Skill geladen: ✅ nexify-agentmemory
- Brain konsultiert: ✅ (N Entscheidungen)
- Memory aktiv: ✅ (N Einträge)
- Policy Gate: ✅ PASSED

## Ergebnisse
- Erstellte/Geänderte Dateien: [Liste]
- Akzeptierte Vorschläge: [N]
- Offene Fragen: [N]

## Handoff
- memory_id: nexify-session-XXXXX
- summary: ...
```

---

## 4. Goose ACC: Orchestrierte Automatisierung

### 4.1 Architektur

```
Automation Controller
  │
  ├── Task erstellen (Zustandsmaschine)
  │     ├── IDLE → DISPATCH
  │     │
  │     ├── Worker-Chain definieren
  │     │     ├── Worker 1: Code-Analyse
  │     │     ├── Worker 2: Review
  │     │     ├── Worker 3: Test
  │     │     └── Worker 4: Report
  │     │
  │     ├── Jeder Worker = Goose ACC Sub-Task
  │     │     ├── Skill-Zwangsladung (Policy Gate)
  │     │     ├── agentmemory-Sync (Pre/Post)
  │     │     ├── 9Router-Routing (pro Worker-Typ)
  │     │     └── Evidence-Erzeugung
  │     │
  │     └── Abschluss: Handoff an nächsten Worker
  │
  └── Task abschließen
        ├── COMPLETE
        ├── ERROR (Retry/Rollback)
        └── REVIEW (Manuelle Prüfung)
```

### 4.2 Worker-Chain-Definition

```yaml
# goos-ac-chain.yaml
chain:
  - id: code_analysis
    worker: goose-acc
    model: deepseek-v4-flash
    task: "Analysiere Code-Änderungen in $PR"
    policy_gate: true
    memory_sync: true
    evidence: true

  - id: code_review
    worker: goose-acc
    model: deepseek-reasoner
    task: "Führe Security-Review durch"
    depends_on: [code_analysis]
    policy_gate: true
    memory_sync: true
    evidence: true

  - id: test_generation
    worker: goose-acc
    model: deepseek-v4-flash
    task: "Generiere Tests für Änderungen"
    depends_on: [code_analysis]
    policy_gate: true
    memory_sync: true
    evidence: true

  - id: report
    worker: goose-acc
    model: nexifyai-combo-llm
    task: "Erstelle Zusammenfassungs-Report"
    depends_on: [code_review, test_generation]
    policy_gate: true
    memory_sync: true
    evidence: true

  - id: pr_comment
    worker: goose-acc
    model: deepseek-v4-flash
    task: "Kommentiere PR mit Ergebnissen"
    depends_on: [report]
    policy_gate: false  # Nur Formatieren, kein Gate nötig
    memory_sync: true
    evidence: true
```

### 4.3 agentmemory-Anbindung (MCP + Skill)

```yaml
# goos-ac-config.yaml
memory:
  provider: agentmemory
  url: http://agentmemory.nexifyai.cloud/
  mcp_server:
    command: npx
    args: ["@nexify/agentmemory-mcp"]
  sync:
    pre_task: true    # Vor jedem Worker: Context laden
    post_task: true   # Nach jedem Worker: Ergebnis speichern
    handoff: true     # Worker-Übergabe: Handoff schreiben
  skills:
    - nexify-agentmemory  # Pflicht-Skill
    - nexify-policy-gate   # Pflicht-Skill
    - nexify-evidence      # Pflicht-Skill
```

### 4.4 Policy Gate (automatisiert)

```
Worker Start
  → Step 1: Skill-Zwangsladung (3 Skills)
  → Step 2: Brain-Kontext laden (Projekt-Architektur)
  → Step 3: agentmemory Context laden (vorherige Worker)
  → Step 4: Policy Gate
       → allowed_actions: [read, write, execute, review]
       → allowed_files: [package.json, src/**]
       → allowed_commands: [npm, git, go, cargo]
  → Step 5: Evidence öffnen
  → Worker ausführen
  → Ergebnisse in Evidence schreiben
  → agentmemory Handoff
  → Worker abschließen
```

### 4.5 Evidence-Pflicht (ACC)

Jeder Goose ACC Worker erzeugt automatisch:

```markdown
# Evidence: GOOSE_ACC_WORKER_[WORKER_ID]_[TASK_ID].md
## Worker
- ID: [worker_id]
- Task: [task_beschreibung]
- Modell: [modell]
- Dauer: [dauer]
- Status: [success|error|review]

## Policy Gate
- Skill: ✅ [3/3 Skills geladen]
- Brain: ✅ [N Entscheidungen]
- Memory: ✅ [N Einträge vor/nach]
- Policy: ✅ PASSED

## Ergebnisse
- Eingabe: [Kontext]
- Ausgabe: [Ergebnis]
- Dateien: [Geänderte Dateien]
- Metriken: [Tokens, Cost, Latency]

## Handoff
- Nächster Worker: [worker_id]
- Memory-ID: nexify-chain-XXXXX
```

---

## 5. Modell-Routing (9Router)

### 5.1 CLI-Routing

| Aktivität | Modell | Begründung |
|---|---|---|
| Chat/Recherche | `nexifyai-combo-llm` | Schnell + Tief bei Bedarf |
| Code-Generierung | `deepseek-v4-flash` | Niedrige Latenz, guter Code |
| Code-Review | `deepseek-reasoner` | Tiefe Analyse nötig |
| Planung | `nexifyai-combo-llm` | Flexibel |
| Debugging | `deepseek-reasoner` | Logisches Denken nötig |

### 5.2 ACC-Routing

| Worker-Typ | Modell | Begründung |
|---|---|---|
| code_analysis | `deepseek-v4-flash` | Schnell, große Dateien |
| code_review | `deepseek-reasoner` | Security + Korrektheit |
| test_generation | `deepseek-v4-flash` | Template-basiert |
| report | `nexifyai-combo-llm` | Zusammenfassung |
| pr_comment | `deepseek-v4-flash` | Kurz, präzise |

---

## 6. Fazit

| Aspekt | Goose CLI | Goose ACC |
|---|---|---|
| **Zweck** | Pascals tägliche Arbeit | Automatisierte Pipelines |
| **Interaktion** | Mensch im Loop | Headless Automation |
| **agentmemory** | MCP + Skill | MCP + Skill + Chain-Handoff |
| **Policy Gate** | Automatisch + Manuell | Vollautomatisch |
| **Evidence** | Pro Session | Pro Worker |
| **Modell-Routing** | Benutzer-gesteuert | Automatisch pro Worker-Typ |
| **9Router** | Primärer Provider | Primärer Provider |
| **Handoff** | Session-Ende | Worker-zu-Worker |

**Empfehlung**: ✅ **Goose CLI als primäres Terminal-Tool für Pascal.** Goose ACC als Automatisierungs-Engine für CI/CD und Batch-Jobs. Beide mit 9Router + agentmemory + Policy Gate. Evidence-Pflicht für alle Aktionen.
