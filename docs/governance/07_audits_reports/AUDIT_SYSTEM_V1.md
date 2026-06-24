---
ralph_loop_file: true
file_type: audit_system
title: NeXify AI OS — Audit-System V1
version: 1.0.0
date: 2026-06-22
status: VERBINDLICH
priority: P0
owner: NeXify CEO (nexify-ceo)
---

# AUDIT-SYSTEM V1 — Prüfzyklen, Checklisten, Verantwortlichkeiten

> **Leitsatz:** Was nicht auditiert ist, ist nicht vertrauenswürdig.
> Jede Änderung löst ein Audit aus. Jeder Agent ist auditierbar.

---

## 1. Audit-Zyklen (Übersicht)

| # | Audit-Typ | Intervall | Nächstes Audit | Owner | Kritikalität |
|---|-----------|-----------|----------------|-------|-------------|
| A01 | Regelwerk-Audit | 7 Tage | 2026-06-29 | Systemmaster | 🔴 CRITICAL |
| A02 | Skill-Audit | 14 Tage | 2026-07-06 | Systemmaster | 🔴 CRITICAL |
| A03 | Prompt-Audit | 30 Tage | 2026-07-22 | Promptmaster | 🟡 HIGH |
| A04 | MCP-Audit | 7 Tage | 2026-06-29 | Systemmaster | 🟡 HIGH |
| A05 | Tool/CLI-Audit | 14 Tage | 2026-07-06 | Systemmaster | 🟡 HIGH |
| A06 | Security-Audit | 7 Tage | 2026-06-29 | Systemmaster | 🔴 CRITICAL |
| A07 | Memory-Audit | 7 Tage | 2026-06-29 | Systemmaster | 🔴 CRITICAL |
| A08 | Agentenketten-Audit | 14 Tage | 2026-07-06 | Systemmaster | 🟡 HIGH |
| A09 | DONE-Audit | Bei Abschluss | Per-Task | Ausführender Agent | 🔴 CRITICAL |
| A10 | Bolt-Audit | 7 Tage | 2026-06-29 | 9Router-Admin | 🟡 HIGH |
| A11 | Brain-Sync-Audit | 7 Tage | 2026-06-29 | Systemmaster | 🔴 CRITICAL |
| A12 | Evidence-Audit | 14 Tage | 2026-07-06 | Systemmaster | 🟡 HIGH |

---

## 2. Audit-Checklisten

### 2.1 A01 — Regelwerk-Audit (7 Tage)

```
□ REGELWERKS_INDEX_V1.md existiert und ist lesbar
□ Alle aufgeführten Dateien existieren physisch
□ Kein Regelwerk ohne Version/Datum/Status im Header
□ RULE_CONFLICT_REGISTER aktuell (keine neuen Konflikte)
□ Keine verwaisten Regelwerke (existiert, aber nicht im Index)
□ Keine doppelten Regelwerke (gleicher Inhalt, verschiedene Dateien)
□ Alle Regelwerke haben OWNER definiert
□ Änderungen seit letztem Audit dokumentiert
□ Bolt-Regelwerke (RTK/Caveman/Headroom/Ponytail) enthalten
```

**Evidence-Template:** `audit_regelwerk_<datum>.md`  
**Ausnahme-Handling:** Fehlendes Regelwerk → SOFORT Ticket + Eskalation

### 2.2 A02 — Skill-Audit (14 Tage)

```
□ Alle Skills in 05_skills/ haben SKILL.md
□ Input/Output-Definition vorhanden
□ Security-Scan durchgeführt (keine hardcoded secrets)
□ Tests vorhanden → Coverage ≥ 80%
□ Version aktuell (nicht älter als 90 Tage)
□ Skill wird tatsächlich genutzt (kein Dead-Skill)
□ Bolt-Integration: RTK-Outputs wenn möglich
□ Skill-Dependencies dokumentiert
```

**Evidence-Template:** `audit_skills_<datum>.md`

### 2.3 A03 — Prompt-Audit (30 Tage)

```
□ Kein Prompt mit Injection-Risiko
□ Kein Prompt mit hardcoded Secrets/Tokens
□ Prompt-Versionierung vorhanden
□ Output-Validierung definiert
□ Caveman-Modus korrekt gesetzt (ON/OFF je nach Kontext)
□ Headroom-Kompression korrekt konfiguriert
□ Prompt erfüllt seinen Zweck (Stichprobe)
□ Prompt-Changelog seit letztem Audit
```

**Owner:** Promptmaster (NUR Promptmaster darf Production-Prompts ändern)

### 2.4 A04 — MCP-Audit (7 Tage)

```
□ Alle konfigurierten MCP-Server antworten
□ Authentifizierung gültig
□ Rate-Limits definiert und eingehalten
□ Error-Handling vorhanden (kein Crash bei Timeout)
□ Logs auf Auffälligkeiten geprüft
□ Keine verwaisten MCP-Einträge
```

### 2.5 A05 — Tool/CLI-Audit (14 Tage)

```
□ Alle Tools in 07_tools_cli/ funktional
□ 9Router erreichbar (nexifyai-combo-llm)
□ RTK-Modus korrekt (ON für Tool-Outputs)
□ Headroom-Endpoint erreichbar (/v1/compress)
□ Caveman-Modus korrekt (OFF für SSE, moderat für Rest)
□ CLI-Wrapper funktional
□ Keine verwaisten Tools
```

### 2.6 A06 — Security-Audit (7 Tage)

```
□ /root/.nexify/secrets/ → Keine Leaks in Logs/Git
□ CVE-Check: kritische Abhängigkeiten
□ SSH-Keys rotiert (nicht älter als 90 Tage)
□ API-Tokens rotiert (nicht älter als 30 Tage)
□ Cloudflare Tunnel aktiv und TLS gültig
□ Keine offenen Ports ohne Rechtfertigung
□ Injection-Tests auf externe Endpunkte
□ Brain API nur von localhost erreichbar
```

### 2.7 A07 — Memory-Audit (7 Tage)

```
□ Brain (127.0.0.1:9090) erreichbar, 472+ Einträge
□ Qdrant (127.0.0.1:6333) erreichbar, 4 Collections
□ Agentmemory-Sync aktuell (nicht älter als 24h)
□ Keine korrupten Einträge (Spot-Check 10%)
□ Keine doppelten Einträge
□ Memory-PFLICHT_V1 wird befolgt
```

### 2.8 A08 — Agentenketten-Audit (14 Tage)

```
□ Alle Agenten definieren OWN Verantwortlichkeit
□ Eskalationswege dokumentiert und aktuell
□ Keine Zirkular-Abhängigkeiten
□ Error-Handling bei Agentenausfall definiert
□ Agent-Registry (CLAUDE_AGENT_REGISTRY.md) aktuell
□ Bolt-Compliance in Agentenketten (RTK/Headroom/Caveman/Ponytail)
```

### 2.9 A09 — DONE-Audit (Per-Task)

```
□ Alle DOS GATES (G01-G17) durchlaufen und grün
□ Evidence erstellt und gespeichert
□ Brain-Sync durchgeführt
□ Kanban/Task-Registry aktualisiert
□ Regelwerke geprüft und eingehalten
□ Ponytail: Mehr gelöscht als hinzugefügt? (wenn Code-Task)
□ RTK: Tool-Outputs komprimiert?
□ Qualität: Akzeptanzkriterien erfüllt?
```

### 2.10 A10 — Bolt-Audit (7 Tage)

```
□ RTK aktiv und konfiguriert (9Router)
□ Headroom (/v1/compress) erreichbar
□ Caveman-Modus korrekt pro Endpunkt
□ Ponytail-Regeln in CLAUDE.md verankert
□ Token-Ersparnis ≥ 50% (Monatsmittel)
□ Keine Kompression bei Evidence/Kundendokumenten
□ SSE-Stream-Kompatibilität: Caveman OFF bei Claude Code
□ Bolt-Metriken in Monitoring-Dashboard
```

---

## 3. Audit-Report-Template

```markdown
# AUDIT-REPORT — [AUDIT_TYP] — [DATUM]

## Metadaten
- Audit-Typ: [A01-A12]
- Geprüft von: [Agent/Owner]
- Zeitraum: [Von] bis [Bis]
- Kritikalität: [CRITICAL/HIGH/MEDIUM]

## Ergebnis
- Status: [✅ BESTANDEN / ⚠️ MIT MÄNGELN / ❌ NICHT BESTANDEN]
- Punkte geprüft: [X/Y]
- Punkte bestanden: [X/Y]

## Findings
| # | Finding | Schwere | Status | Aktion |
|---|---------|---------|--------|--------|
| 1 | ... | 🔴/🟡/🟢 | OPEN/FIXED | ... |

## Empfehlungen
1. ...
2. ...

## Nächstes Audit
- Datum: [YYYY-MM-DD]
- Fokus: [Spezifische Prüfpunkte]
```

---

## 4. Eskalationsmatrix

| Situation | Eskalation | Zeitrahmen |
|-----------|------------|------------|
| Regelwerk fehlt | → Systemmaster → NeXify CEO | < 4h |
| Security-Leak | → NeXify CEO SOFORT | < 1h |
| Brain nicht erreichbar | → Systemmaster | < 2h |
| 9Router down | → 9Router-Admin | < 2h |
| Audit nicht durchgeführt | → Systemmaster → NeXify CEO | < 24h |
| Bolt-Compliance < 80% | → 9Router-Admin → NeXify CEO | < 24h |

---

## 5. Automatisierung

| Audit | Automatisierbar | Tool | Trigger |
|-------|----------------|------|---------|
| A01 Regelwerk | ✅ Ja | Script | Cron (7d) |
| A02 Skills | ✅ Ja | Script | Cron (14d) |
| A03 Prompts | ⚠️ Teilweise | Manual + Script | Cron (30d) |
| A04 MCP | ✅ Ja | Health-Check | Cron (7d) |
| A05 Tools | ✅ Ja | Health-Check | Cron (14d) |
| A06 Security | ⚠️ Teilweise | CVE-Scanner + Manual | Cron (7d) |
| A07 Memory | ✅ Ja | Brain-API-Check | Cron (7d) |
| A08 Agentenketten | ⚠️ Teilweise | Registry-Check | Cron (14d) |
| A09 DONE | ✅ Ja | Gate-Check | Per-Task |
| A10 Bolt | ✅ Ja | 9Router-Status | Cron (7d) |
| A11 Brain-Sync | ✅ Ja | Brain-API-Check | Cron (7d) |
| A12 Evidence | ⚠️ Teilweise | File-Check | Cron (14d) |

---

## 6. Verantwortlichkeiten

| Rolle | Audit-Verantwortung | Eskalation an |
|-------|---------------------|---------------|
| **Systemmaster** | A01, A02, A04, A05, A06, A07, A08, A11, A12 | NeXify CEO |
| **Promptmaster** | A03 | NeXify CEO |
| **9Router-Admin** | A10 | NeXify CEO |
| **Ausführender Agent** | A09 (per Task) | Systemmaster |
| **NeXify CEO** | Gesamtverantwortung, Meta-Audit | — |

---

*Generiert: 2026-06-22 | Nächstes Meta-Audit: 2026-06-29*
