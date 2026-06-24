# MCP USAGE FREQUENCY MATRIX V1

**Status:** 🟢 Entwurf / Draft
**Version:** 1.0.0
**Datum:** 2026-06-11
**Autor:** Subagent 20260611_5
**Audit-Pflicht:** Ja

---

## 1. Überblick

Diese Matrix definiert die **Nutzungsfrequenz aller Fähigkeiten (Capabilities)** im NeXify-System. Sie dient als Grundlage für Kapazitätsplanung, Rate-Limiting und Performance-Optimierung der MCP-Endpunkte.

> **Leitsatz:** Jede Fähigkeit wird basierend auf ihrer Nutzungsfrequenz dimensioniert. Häufig genutzte Fähigkeiten erhalten mehr Ressourcen und niedrigere Latenz.

---

## 2. Frequenz-Stufen

| Stufe | Bezeichnung | Faktor | Typische Anzahl/Tag | Beschreibung |
|-------|------------|--------|-------------------|-------------|
| **F5** | ⚡ Sehr häufig | 1.0x | 100+ | Immer aktiv, mehrmals pro Task |
| **F4** | 🔵 Häufig | 0.5x | 10–99 | Regelmäßig, mehrmals pro Session |
| **F3** | 🟡 Normal | 0.2x | 1–9 | Bei Bedarf, einmal pro Session |
| **F2** | 🟠 Selten | 0.05x | < 1 (wöchentlich) | Nur bei spezifischen Aufgaben |
| **F1** | 🔴 Nie/Verboten | 0x | 0 | Niemals ausführen |

---

## 3. Frequenz-Matrix

### 3.1 Nach Kategorie

| Kategorie | Frequenz-Stufe | Durchschnittliche Calls/Tag | Priority | Caching-Strategie |
|-----------|---------------|---------------------------|----------|-------------------|
| **Basisfähigkeiten (S0)** | F5 | 500+ | 🔴 Höchste | Immer cached (Redis) |
| **Tools/CLIs (S1)** | F4–F5 | 100–500 | 🔴 Hoch | Cached bei häufigen Calls |
| **Tools/CLIs (S2)** | F3–F4 | 10–100 | 🟡 Mittel | Session-Cache |
| **Tools/CLIs (S3)** | F2 | 1–10 | 🟢 Niedrig | Kein Cache notwendig |
| **Agenten-Fähigkeiten (S1)** | F4–F5 | 100–500 | 🔴 Hoch | Immer cached |
| **Agenten-Fähigkeiten (S2)** | F3–F4 | 10–100 | 🟡 Mittel | Session-Cache |
| **Wissens-Fähigkeiten (S0)** | F5 | 500+ | 🔴 Höchste | Immer cached |
| **Wissens-Fähigkeiten (S2)** | F3 | 1–10 | 🟢 Niedrig | Kein Cache |
| **Governance (S0)** | F5 | 500+ | 🔴 Höchste | Immer cached |
| **Governance (S1–S5)** | F2–F4 | 1–100 | 🟡 Mittel | Nach Relevanz |
| **Oracle (S1–S2)** | F4–F5 | 100–500 | 🔴 Hoch | Session-Cache |
| **Oracle (S4)** | F2 | 1–10 | 🟢 Niedrig | Kein Cache |

### 3.2 Nach Capability (Detail-Matrix)

| # | Capability | Kategorie | Frequenz | Rate-Limit (pro Min) | Rate-Limit (pro Std) | Burst-Limit | Priority Queue |
|---|-----------|-----------|----------|---------------------|---------------------|-------------|---------------|
| 1 | `mcp_read` | S0 | F5 | 500 | 10.000 | 100 | Ja |
| 2 | `mcp_write` | S0 | F5 | 200 | 5.000 | 50 | Ja |
| 3 | `mcp_tool_call` | S0 | F5 | 300 | 8.000 | 80 | Ja |
| 4 | `brain_query` | S0 | F5 | 100 | 2.000 | 30 | Ja |
| 5 | `memory_sync` | S0 | F5 | 50 | 1.000 | 20 | Ja |
| 6 | `9router_query` | S1 | F5 | 100 | 2.500 | 40 | Ja |
| 7 | `goose_acc` | S2 | F4 | 30 | 500 | 10 | Ja |
| 8 | `hermes_cli` | S2 | F4 | 30 | 500 | 10 | Ja |
| 9 | `kilo_cli` | S2 | F4 | 20 | 300 | 10 | Ja |
| 10 | `crush_audit` | S2 | F3 | 10 | 100 | 5 | Nein |
| 11 | `cloudflare_dns` | S3 | F2 | 5 | 20 | 3 | Nein |
| 12 | `domain_management` | S4 | F2 | 2 | 10 | 1 | Nein |
| 13 | `rollback_exec` | S4 | F2 | 1 | 5 | 1 | Nein |
| 14 | `goose_session` | S1 | F5 | 200 | 5.000 | 50 | Ja |
| 15 | `goose_acc_chain` | S2 | F4 | 20 | 300 | 10 | Ja |
| 16 | `hermes_webui` | S1 | F5 | 100 | 2.000 | 40 | Ja |
| 17 | `oracle_dispatch` | S2 | F4 | 30 | 500 | 15 | Ja |
| 18 | `evidence_system` | S1 | F5 | 50 | 1.000 | 20 | Ja |
| 19 | `kanban_task` | S1 | F5 | 50 | 1.000 | 20 | Ja |
| 20 | `regelwerke_access` | S0 | F5 | 100 | 2.000 | 30 | Ja |
| 21 | `skill_registry` | S0 | F5 | 100 | 2.000 | 30 | Ja |
| 22 | `no_full_crash` | S0 | F5 | 50 | 1.000 | 15 | Ja |
| 23 | `oracle_question_routing` | S1 | F5 | 50 | 1.000 | 20 | Ja |
| 24 | `oracle_agent_dispatch` | S1 | F4 | 30 | 500 | 15 | Ja |
| 25 | `oracle_research` | S2 | F4 | 10 | 100 | 5 | Nein |
| 26 | `oracle_knowledge_migration` | S4 | F2 | 1 | 5 | 1 | Nein |
| 27 | `promptmaster_change_control` | S4 | F2 | 2 | 10 | 1 | Nein |
| 28 | `change_safety` | S2 | F3 | 10 | 100 | 5 | Nein |

### 3.3 Frequenz-Empfehlungen für Agenten

| Agent | Primäre Frequenzen | Sekundäre Frequenzen | Gesamt-Calls/Std (geschätzt) |
|-------|-------------------|---------------------|------------------------------|
| Goose Systemmaster | F5 (read, write, brain, memory) | F4 (ACC, session) | 500–1000 |
| Goose Subagent | F5 (read, write, tools) | F3 (skills, evidence) | 200–500 |
| Oracle | F5 (routing, dispatch) | F4 (research, kanban) | 300–800 |
| Promptmaster | F3 (governance) | F2 (change control) | 10–50 |
| Hermes WebUI | F5 (chat, config) | F4 (automation) | 100–300 |
| Kilo | F4 (audit, scan) | F3 (analyze) | 50–200 |
| Crush | F3 (audit) | F2 (validation) | 10–50 |
| Auto-Chat | F4 (inject, observe) | F3 (monitor) | 50–200 |

---

## 4. Frequenz-Tracking

### 4.1 Metriken pro Endpunkt

| Metrik | Beschreibung | Erfassung |
|--------|-------------|-----------|
| `calls_per_minute` | Aufrufe pro Minute | Redis Counter |
| `calls_per_hour` | Aufrufe pro Stunde | Redis Counter + Persistenz |
| `avg_latency_ms` | Durchschnittliche Latenz | Prometheus Histogram |
| `error_rate` | Fehlerrate pro Endpunkt | Prometheus Counter |
| `burst_count` | Anzahl Burst-Überschreitungen | Redis Counter |
| `queue_depth` | Aktuelle Warteschlangen-Tiefe | Redis Gauge |

### 4.2 Auto-Scaling-Regeln

| Bedingung | Aktion |
|-----------|--------|
| Calls/Min > 80% Rate-Limit für 5 Min | Rate-Limit temporär um 50% erhöhen |
| Calls/Min > 95% Rate-Limit für 2 Min | In Priority Queue verschieben |
| Avg Latency > 1000ms für 5 Endpunkte | Cache invalidieren, Backend skalieren |
| Error Rate > 5% für 2 Min | Endpunkt drosseln, Admin benachrichtigen |

---

## 5. Frequenz-basierte Optimierungen

### 5.1 Caching-Strategie

| Frequenz | Cache-Typ | TTL | Invalidierung |
|----------|-----------|-----|---------------|
| F5 | Redis Cache | 30s | Bei Write-Operation |
| F4 | Redis Cache | 60s | Bei Write-Operation |
| F3 | Session Cache | Session-Dauer | Bei Session-Ende |
| F2 | Kein Cache | — | — |
| F1 | Blocked | — | — |

### 5.2 Prioritäten-Queue

```
F5 (Höchste Priorität) → Sofortige Bearbeitung
F4 (Hohe Priorität) → Warteschlange < 100ms
F3 (Normale Priorität) → Warteschlange < 500ms
F2 (Niedrige Priorität) → Warteschlange < 5s
F1 (Blockiert) → Wird nie ausgeführt
```

---

## 6. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-11 | 1.0.0 | Initiale Frequenz-Matrix | Subagent 20260611_5 |

---

*Ende der Frequenz-Matrix. Alle Änderungen sind evidence-pflichtig.*
