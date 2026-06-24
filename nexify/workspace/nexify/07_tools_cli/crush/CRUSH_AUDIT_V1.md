# CRUSH Audit V1 — Charmbracelet Crush

> **Stand**: 2026-06-10 | **Reviewer**: Subagent 20260610_25 | **Status**: DRAFT

---

## 1. Identifikation

| Feld | Wert |
|---|---|
| **Projekt** | Crush – „Glamourous agentic coding for all 💘" |
| **Repository** | https://github.com/charmbracelet/crush |
| **Sprache** | Go (Terminal-basiert) |
| **Stars** | ~25.200 |
| **Forks** | ~1.800 |
| **Erstellt** | 2025-05-21 |
| **Letztes Update** | 2026-06-10 (aktiv) |
| **Letzte Releases** | nightly (täglich), v0.76.0 (2026-06-05), v0.75.0, v0.74.1 — **sehr hohe Release-Frequenz** |

---

## 2. Lizenz-Prüfung

Crush verwendet die **FSL-1.1 (Functional Source License)**.

- **FSL-1.1 Regelung**: Nach 2 Jahren ab Veröffentlichung wechselt die Lizenz automatisch auf **MIT**.
- **Konsequenz**: Code, der heute (2026-06-10) released wird, ist ab ~2028 MIT-lizenziert.
- **Aktuelle Nutzung**: Für kommerzielle/produktive Nutzung ist die FSL-1.1 zu beachten. Charmbracelet erlaubt i.d.R. nicht-kommerzielle Nutzung sowie Nutzung in Produkten, die nicht direkt mit Charmbracelets Angeboten konkurrieren.
- **NeXify-Bewertung**: **Nutzen unter FSL-1.1 akzeptabel**, sofern kein direkter Wettbewerb zu Charm-Produkten. NeXify bietet keine Terminal-Konkurrenz. **Flagge**: Neu-Evaluierung bei FSL-Lizenzwechsel erforderlich.

---

## 3. Technologie

- **Sprache**: Go (95 %), Shell (5 %)
- **Build**: `go build`, keine Runtime-Dependencies in Python/Node
- **Plattform**: macOS, Linux, Windows (Terminal)
- **UI**: Bubbletea TUI (Charmbracefects eigenes TUI-Framework)
- **Dateisystem**: Lokales Projektverzeichnis, `.crush/` State-Directory

---

## 4. Stärken

| Stärke | Beschreibung |
|---|---|
| **Multi-Model** | Native Unterstützung für OpenAI, Anthropic, Google, Groq, Ollama, OpenRouter |
| **LSP-Kontext** | Nutzt Language Server Protocol für Code-Kontext – Klasse A |
| **MCP-Standard** | Vollständiger MCP-Client: kann MCP-Server laden und Tools nutzen |
| **Sessions** | Session-Management mit Resume (crush session, crush resume) |
| **Crushfile** | YAML-basierte Konfiguration (.crush/config.yaml) |
| **Lokal/Privacy** | Läuft komplett lokal, keine Cloud-Zwang |
| **Edits** | Datei-Editing inkl. `edit`-Tool (syntaxbewusst, semantisch) |
| **Terminal-Exec** | Führt Shell-Befehle aus, sieht Output |
| **Charm-Ökosystem** | Integration mit Charm Cloud, SSH, Git |
| **Release-Frequenz** | Tägliche Nightly + wöchentliche Stable — extrem aktiv |

---

## 5. Schwächen / Risiken

| Schwäche | Risiko | Priorität |
|---|---|---|
| **Terminal-only** | Keine WebUI, keine Operator-Shell im Browser | MEDIUM |
| **FSL-1.1** | Einschränkungen bei kommerzieller Nutzung bis 2028 | HIGH |
| **Kein agentmemory-Plugin** | Keine native Memory-Persistenz außerhalb Session | HIGH |
| **Single-Process** | Kein Worker-Ketten-Modell (kein ACC-Äquivalent) | MEDIUM |
| **Kein REST API** | Kann nur aus Terminal heraus gesteuert werden | MEDIUM |
| **Go-Binary** | Erschwert Integration in Node/TypeScript-Ökosystem | LOW |
| **Token-Verbrauch** | Kein integrierter Cost-Tracker | LOW |

---

## 6. Security-Risiken

| Risiko | Beschreibung | Mitigation |
|---|---|---|
| **Shell Execution** | Crush führt Shell-Befehle aus – Prompt-Injection-Risiko | Policy Gate: `allowed_commands` |
| **Dateizugriff** | Liest/schreibt Dateien im Projektverzeichnis | Sandboxed per Chdir |
| **API-Keys** | API-Keys in `.crush/config.yaml` | File-Berechtigungen (600) |
| **MCP-Plugin-Code** | MCP-Server können beliebigen Code ausführen | Whitelist vertrauenswürdiger MCP-Server |
| **Keine Auth** | Kein integriertes Auth-System | Läuft nur lokal |

---

## 7. Einsatzmodi für NeXify

| Modus | Beschreibung | Geeignet? |
|---|---|---|
| **READ_ONLY_REVIEW** | Code lesend reviewen | ✅ Ja — LSP-Kontext + Browse |
| **PLAN_REVIEW** | Plan erstellen mit Kontext | ✅ Ja — Session-basiert |
| **DIFF_REVIEW** | Diff-basiertes Review | ✅ Ja — Git-Integration |
| **TEST_REVIEW** | Tests laufen lassen + reviewen | ✅ Ja — Shell-Execution |
| **UI_REVIEW** | UI-Code reviewen | ⚠️ Terminal — kein visuelles UI |
| **REFACTOR_REVIEW** | Refactoring durchführen | ✅ Ja — Edit-Tool |

---

## 8. agentmemory-Integrationsplan

> **Ziel**: Crush als vollwertigen NeXify-Agenten mit agentmemory-Persistenz

| Schritt | Aktion | Status |
|---|---|---|
| 1. **MCP-Adapter** | agentmemory als MCP-Server für Crush registrieren (MCP-kompatibel out-of-the-box) | 🔧 Geplant |
| 2. **CLI-Adapter** | `crush tool add` für agentmemory-CLI-Commands | 🔧 Geplant |
| 3. **Session-Hooks** | Pre/Post-Hooks in Crushfile für Memory-Sync | 📋 Entwurf |
| 4. **Policy Gate** | Crush-spezifisches Policy Gate in NeXify Policy Engine | 📋 Entwurf |

### MCP-Adapter-Konfiguration

```yaml
# .crush/config.yaml
mcp_servers:
  agentmemory:
    command: npx
    args:
      - @nexify/agentmemory-mcp
    env:
      AGENTMEMORY_URL: http://agentmemory.nexifyai.cloud/
```

### Session-Lifecycle

```
crush session start
  → agentmemory:load_context()    // Memories laden
  → User-Interaktion
  → crush tool call (MCP)
    → agentmemory:check_context()  // Relevanz prüfen
  → crush edit / shell exec
    → agentmemory:record()         // Ergebnis speichern
crush session end
  → agentmemory:handoff()          // Handoff schreiben
```

---

## 9. Policy Gate für produktive Nutzung

| Regel | Umsetzung |
|---|---|
| **`allowed_commands`** | Nur freigegebene Shell-Befehle (`git`, `npm`, `go`, `cargo`, `deno`, `docker`) |
| **`allowed_mcp_servers`** | Nur geprüfte MCP-Server (agentmemory, nexiy-router, offizielle) |
| **`max_tokens_per_session`** | Budget-Limit (Default: 100.000 Tokens) |
| **`audit_log`** | Jeder Tool-Call wird in agentmemory geloggt |
| **`api_key_origin`** | API-Keys nur aus Umgebungsvariablen, nie aus Dateien |
| **`no_network`** (optional) | Isolierter Modus ohne Netzwerkzugriff |

---

## 10. Evidence-Vorlage: CRUSH_REVIEW_REPORT.md

```markdown
# Crush Review Report — [PROJECT]

**Datum**: [YYYY-MM-DD] | **Reviewer**: [Name] | **Modus**: [READ_ONLY|PLAN|DIFF|TEST|UI|REFACTOR]

## Session Info
- **Crush Version**: v0.XX.X
- **Modell**: [Modell-Name]
- **Projekt**: [Projekt/Repo]
- **Dauer**: [Minuten]

## Ergebnisse
- **Geprüfte Dateien**: [N]
- **Gefundene Issues**: [N] (Critical: X, High: X, Medium: X, Low: X)
- **Akzeptierte Änderungen**: [N]
- **Abgelehnte Vorschläge**: [N]

## Quality Score
| Kategorie | Score (1-10) |
|---|---|
| Korrektheit | X/10 |
| Sicherheit | X/10 |
| Performance | X/10 |
| Wartbarkeit | X/10 |
| Style/Konsistenz | X/10 |

## Kritische Befunde
1. **[CRITICAL]** `file:line` — Beschreibung
2. **[HIGH]** `file:line` — Beschreibung

## agentmemory Handoff
- **Memory-ID**: `mem-XXXXX`
- **Kontext-Pfad**: `/nexify/reviews/crush/[PROJECT]/[DATE]`

## Merge Recommendation
**BLOCK** / **APPROVE WITH SUGGESTIONS** / **APPROVE**
```

---

## 11. Fazit

**Crush ist ein extrem aktives, hochwertiges Terminal-Tool für agentisches Coding.** Mit ~25K Stars, täglichen Releases und Charmbracelet-Qualität ist es ein starker Kandidat für NeXifys lokale Agentenarbeit.

**Kritische Punkte**:
1. FSL-1.1 Lizenz — für produktive Nutzung klären bis 2028
2. Keine native agentmemory-Integration — MCP-Adapter erforderlich
3. Terminal-only — kein WebUI, kein REST API

**Empfehlung**: ✅ **Aufnehmen als lokalen Coding-Agenten** — MCP-Integration priorisieren, Policy Gate definieren, READ_ONLY/PLAN/DIFF/TEST/REFACTOR-Modi aktivieren.
