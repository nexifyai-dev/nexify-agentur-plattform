# NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1

> **Stand**: 2026-06-11 | **Version**: V1 | **Status**: AKTIV | **Typ**: Prompt-Vorlage

---

## 1. Beschreibung

Eigener, prompt-basierter Kompressionsansatz für NeXify-Agenten.
Keine externen Tools nötig — der LLM komprimiert selbst mittels spezifischem Prompt.
Bietet strukturierte Ausgabe für maschinelle Weiterverarbeitung.

### 1.1 Vorteile

| Vorteil | Beschreibung |
|---|---|
| **Keine Installation** | Läuft auf jedem LLM |
| **Kein Latenz-Overhead** | Ein Schritt statt zwei (komprimieren + verarbeiten) |
| **Strukturierte Ausgabe** | Maschinenlesbares Format |
| **Flexibel** | Felder erweiterbar/anpassbar |
| **Kostenlos** | Nur Prompt-Tokens |

### 1.2 Nachteile

| Nachteil | Beschreibung |
|---|---|
| **Qualität abhängig vom LLM** | Schwächere Modelle = schlechtere Kompression |
| **Keine garantierte Kompressionsrate** | Variiert je nach Modell |
| **Prompt-Tokens zählen** | Der Prompt selbst verbraucht Tokens |

---

## 2. Prompt

```
[SYSTEM]
Du bist ein semantischer Kompressor für NeXify-Agenten.
Deine Aufgabe: Reduziere den folgenden Input auf das Wesentliche.
Behalte ALLE sicherheitsrelevanten Informationen.
Entferne: Wiederholungen, Floskeln, unnötige Details, Höflichkeitsfloskeln.
Behalte: Fakten, Entscheidungen, offene Aufgaben, Risiken, Blocker.
Ausgabe NUR im angegebenen JSON-Format. Keine Erklärungen.

FELDER (alle Pflicht, bei Fehlen: null):
- summary: max 3 Sätze — WAS ist passiert?
- facts: string[] — harte Fakten (Daten, Zahlen, Entscheidungen)
- decisions: string[] — getroffene Entscheidungen
- open_tasks: string[] — noch offene Aufgaben
- risks: string[] — Risiken/Warnungen
- blockers: string[] — harte Blocker (nicht lösbar ohne Hilfe)
- source_refs: string[] — Quellen (Dateien, Commits, Tickets)
- systems: string[] — betroffene Systeme
- repos: string[] — betroffene Repositories
- customers: string[] — betroffene Kunden (null wenn keine)
- projects: string[] — betroffene Projekte
- tags: string[] — Tags/Kategorien (max 5)
- priority: "critical" | "high" | "medium" | "low" — Priorität
- brain_relevance: boolean — relevant für Brain-Einträge?
- agentmemory_relevance: boolean — relevant für AgentMemory?
- oracle_relevance: boolean — relevant für Oracle/Regelwerke?
- next_action: string — DER nächste Schritt
- loss_warning: string | null — Warnung, wenn etwas Wichtiges verloren ging

ANTWORTFORMAT (NUR dies, kein weiterer Text):
{
  "compression_version": "NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1",
  "original_tokens": <Zahl>,
  "compressed_tokens": <Zahl>,
  "compression_ratio": <Prozent>,
  "data": { ... FELDER ... }
}

[INPUT]
{INPUT}
```

---

## 3. Ausgabeformat (JSON-Schema)

```json
{
  "compression_version": "string — immer 'NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1'",
  "original_tokens": "number — Token-Anzahl des Inputs",
  "compressed_tokens": "number — Token-Anzahl der Ausgabe",
  "compression_ratio": "number — Prozent eingespart (0–100)",
  "data": {
    "summary": "string — max 3 Sätze",
    "facts": ["string", ...],
    "decisions": ["string", ...],
    "open_tasks": ["string", ...],
    "risks": ["string", ...],
    "blockers": ["string", ...],
    "source_refs": ["string", ...],
    "systems": ["string", ...],
    "repos": ["string", ...],
    "customers": ["string | null", ...],
    "projects": ["string", ...],
    "tags": ["string", ...],
    "priority": "critical | high | medium | low",
    "brain_relevance": "boolean",
    "agentmemory_relevance": "boolean",
    "oracle_relevance": "boolean",
    "next_action": "string",
    "loss_warning": "string | null"
  }
}
```

---

## 4. Anwendungsbeispiel

### 4.1 Input (vor Kompression — 2.500 Tokens)

```
Ich habe heute das 9Router-Config-System analysiert und festgestellt,
dass das Backup vor jeder Änderung Pflicht ist. Die neue NO-CRASH-POLICY
wurde definiert. Es gibt 7 Modelle: nexifyai-combo-llm, deepseek-v4-flash,
deepseek-reasoner, gpt-4o, claude-sonnet-4-20250514, gemini-2.5-flash,
llama-4-scout. Der Fallback ist: combo → gpt-4o → claude → gemini → llama.
Es sind noch keine Alerts konfiguriert, das ist ein mittleres Risiko.
Die Kompression-Dokumentation wurde angefangen. Nächster Schritt ist
die Installation von RTK und Caveman in einer isolierten Umgebung.
...
```

### 4.2 Output (nach Kompression — ~450 Tokens)

```json
{
  "compression_version": "NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1",
  "original_tokens": 2500,
  "compressed_tokens": 450,
  "compression_ratio": 82,
  "data": {
    "summary": "9Router-Config analysiert, NO-CRASH-POLICY definiert. Keine Alerts konfiguriert (Risiko). Kompression-Doku begonnen.",
    "facts": [
      "9Router: 7 Modelle verfügbar",
      "Default: nexifyai-combo-llm (flash+reasoner)",
      "Fallback: gpt-4o → claude-sonnet-4 → gemini-2.5-flash → llama-4-scout",
      "Backup vor Änderung = Pflicht"
    ],
    "decisions": [
      "NO-CRASH-POLICY ist aktiv",
      "Backup-Gates definiert",
      "Read-Only-Evaluation für RTK/Caveman"
    ],
    "open_tasks": [
      "Alerts konfigurieren",
      "RTK in isolierter Umgebung installieren/testen",
      "Caveman in isolierter Umgebung installieren/testen"
    ],
    "risks": [
      "Keine Alerts konfiguriert (mittel)"
    ],
    "blockers": [],
    "source_refs": [
      "/workspace/nexify/07_tools_cli/9router/05_blocker/9ROUTER_NO_CRASH_POLICY.md"
    ],
    "systems": ["9Router"],
    "repos": ["nexify/07_tools_cli"],
    "customers": null,
    "projects": ["9Router-Schutz", "Kompression"],
    "tags": ["9router", "compression", "safety", "policy", "infrastructure"],
    "priority": "high",
    "brain_relevance": true,
    "agentmemory_relevance": true,
    "oracle_relevance": true,
    "next_action": "RTK + Caveman in isolierter Umgebung testen",
    "loss_warning": null
  }
}
```

---

## 5. Felder-Referenz

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `compression_version` | string | ✅ | Version des Kompressions-Prompts |
| `original_tokens` | number | ✅ | Token-Anzahl des Inputs |
| `compressed_tokens` | number | ✅ | Token-Anzahl der Ausgabe |
| `compression_ratio` | number | ✅ | Prozent eingespart (0–100) |
| `summary` | string | ✅ | Max 3 Sätze |
| `facts` | string[] | ✅ | Harte Fakten |
| `decisions` | string[] | ✅ | Getroffene Entscheidungen |
| `open_tasks` | string[] | ✅ | Noch offene Aufgaben |
| `risks` | string[] | ✅ | Risiken/Warnungen |
| `blockers` | string[] | ✅ | Harte Blocker |
| `source_refs` | string[] | ✅ | Quellen |
| `systems` | string[] | ✅ | Betroffene Systeme |
| `repos` | string[] | ✅ | Betroffene Repositories |
| `customers` | string[] or null | ✅ | Betroffene Kunden |
| `projects` | string[] | ✅ | Betroffene Projekte |
| `tags` | string[] | ✅ | Tags (max 5) |
| `priority` | enum | ✅ | critical/high/medium/low |
| `brain_relevance` | boolean | ✅ | Für Brain-Einträge relevant? |
| `agentmemory_relevance` | boolean | ✅ | Für AgentMemory relevant? |
| `oracle_relevance` | boolean | ✅ | Für Oracle/Regelwerke relevant? |
| `next_action` | string | ✅ | Nächster Schritt |
| `loss_warning` | string or null | ✅ | Warnung bei Verlust |

---

## 6. Nutzungsrichtlinien

### 6.1 Wann komprimieren?

- ✅ Input > 1.000 Tokens
- ✅ Zwischenergebnisse in Pipelines
- ✅ Interne Agentenkommunikation
- ✅ Brain-Drafting
- ❌ Command-Outputs (Semantik-Schutz)
- ❌ Finale Ausgaben (müssen vollständig sein)
- ❌ Kundenkommunikation

### 6.2 Qualitätssicherung

| Massnahme | Beschreibung |
|---|---|
| `loss_warning` prüfen | Wenn nicht null → Review erforderlich |
| `compression_ratio` checken | > 90 % → möglicherweise zu aggressiv |
| `priority` validieren | critical/high → immer reviewen |
| `blockers` prüfen | Nicht übersehen |
| Stichproben | Jede 10. Kompression manuell prüfen |

---

## 7. Versionierung

| Version | Datum | Änderung |
|---|---|---|
| **V1** | 2026-06-11 | Initiale Version |

---

## 8. Referenzen

- Siehe auch: `RTK_EVALUATION.md`
- Siehe auch: `CAVEMAN_EVALUATION.md`
- Siehe auch: `compression-policy.json`
