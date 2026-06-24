---
ralph_loop_file: true
file_type: regelwerke_konsolidiert
title: NeXify AI OS — Konsolidiertes Regelwerk V1
version: 1.0.0
date: 2026-06-22
status: VERBINDLICH
priority: P0
owner: NeXify CEO (nexify-ceo)
---

# REGELWERKE KONSOLIDIERT V1 — Alle Verbote, Vorgaben, Policies

> **Leitsatz:** Dies ist die Single Source of Truth für alle Verbote und Vorgaben.
> Bei Konflikt zwischen diesem Dokument und Einzelregelwerken gilt die strengere Regel.

---

## 1. ABSOLUTE VERBOTE (P0 — Keine Ausnahme)

### 1.1 Sicherheit

| # | Verbot | Begründung | Enforcement |
|---|--------|------------|-------------|
| V01 | Secrets in Logs, Git, oder Ausgaben platzieren | Credential-Leak | Code-Review + CI + Audit |
| V02 | Root-Passwörter in Klartext speichern | Credential-Leak | Audit (7d) |
| V03 | Ungepatchte CVEs ignorieren (kritisch) | Exploit-Risiko | CVE-Scanner |
| V04 | API-Tokens > 30 Tage ohne Rotation | Credential-Leak | Audit (7d) |
| V05 | SSH-Keys > 90 Tage ohne Rotation | Credential-Leak | Audit (14d) |
| V06 | Brain API von außen erreichbar machen | Exfiltration | Firewall + Audit |
| V07 | Injection-anfällige Prompts in Production | Prompt-Injection | Prompt-Audit (30d) |

### 1.2 Stabilität

| # | Verbot | Begründung | Enforcement |
|---|--------|------------|-------------|
| V08 | Full Crash bei einem Fehler | Stabilität | NO_FULL_CRASH_POLICY |
| V09 | Blocking Confirmations im Autonomous Mode | Workflow-Blocker | NONINTERACTIVE_EXECUTION_POLICY |
| V10 | Single-Points-of-Failure ohne Fallback | Ausfallsicherheit | Architecture-Review |
| V11 | Agent startet Aufgabe ohne Brain-Query | Wissensverlust | BRAIN_FIRST_POLICY |
| V12 | Agent beendet Aufgabe ohne Evidence | Nachvollziehbarkeit | DONE_REGEL |

### 1.3 Bolt-Verbote

| # | Verbot | Begründung | Enforcement |
|---|--------|------------|-------------|
| V13 | Caveman "full" bei SSE-Streams | Beschädigt Frames | Code-Review + CI |
| V14 | RTK bei Evidence-Dateien | Rechtliche Genauigkeit | Audit (14d) |
| V15 | Headroom bei Kundendokumenten | Qualitätsverlust | Manual Gate |
| V16 | Kompression bei Security-Logs | Verlust sicherheitskritischer Daten | Audit (7d) |
| V17 | Ponytail bei Security-Code | Sicherheit > Minimalismus | Security-Audit |

### 1.4 Governance

| # | Verbot | Begründung | Enforcement |
|---|--------|------------|-------------|
| V18 | Production-Prompts ohne Promptmaster ändern | Governance | PROMPTMASTER_GOVERNANCE |
| V19 | Regelwerk ohne Version/Datum/Status | Governance | Regelwerk-Audit (7d) |
| V20 | Undokumentierte Konflikte zwischen Regelwerken | Governance | RULE_CONFLICT_REGISTER |
| V21 | Agent überschreibt fremde Profile | Data-Integrität | Cross-Profile-Guard |

---

## 2. PFLICHTVORGABEN (P0 — Immer einzuhalten)

### 2.1 Prozessvorgaben

| # | Vorgabe | Beschreibung | Prüfpunkt |
|---|---------|--------------|-----------|
| P01 | Brain-First | Vor JEDER Aufgabe Brain befragen | DOS GATE G03 |
| P02 | DOS GATES (G01-G17) | Alle 17 Gates durchlaufen vor Ausführung | Gate G17 |
| P03 | Evidence-Pflicht | Nach JEDER Aufgabe Evidence erstellen | DONE_REGEL |
| P04 | Memory-Pflicht | Relevante Ergebnisse ins Memory | MEMORY_PFLICHT |
| P05 | Skill-First | Vor Neubau: Skill vorhanden? | SKILL_FIRST_REGEL |
| P06 | Kanban-Sync | Statusänderung → Kanban aktualisieren | Per-Task |
| P07 | Customer-Boundary | Kundenprojekte sauber getrennt | CUSTOMER_PROJECT |

### 2.2 Bolt-Vorgaben

| # | Vorgabe | Beschreibung | Prüfpunkt |
|---|---------|--------------|-----------|
| P08 | RTK aktiv | Tool-Outputs IMMER komprimiert | Bolt-Audit (7d) |
| P09 | Headroom aktiv | Context IMMER via /v1/compress | Bolt-Audit (7d) |
| P10 | Caveman moderat | Output-Kompression moderat (nicht full) | Bolt-Audit (7d) |
| P11 | Ponytail-YAGNI | Vor Neubau: Existiert es schon? | DOS GATE G03 |
| P12 | Ponytail-Deletion | Code-Änderung: Mehr gelöscht als hinzugefügt? | DONE_REGEL |
| P13 | Bolt-Ausnahmen | Evidence, Kundendokumente, Security → OFF | Audit (14d) |

### 2.3 Qualitätsvorgaben

| # | Vorgabe | Beschreibung | Prüfpunkt |
|---|---------|--------------|-----------|
| P14 | Skill-Tests | Coverage ≥ 80% | Skill-Audit (14d) |
| P15 | Code-Qualität | Keine TODOs in Production | Code-Review |
| P16 | Dokumentation | Jede Komponente hat README/SKILL.md | Skill-Audit (14d) |
| P17 | Versionierung | Alles hat Version im Header | Regelwerk-Audit (7d) |

---

## 3. POLICIES (Verlinkt)

| Policy | Datei | Status | Letztes Audit |
|--------|-------|--------|---------------|
| GLOBAL_POLICY_V1 | 03_regelwerke/GLOBAL_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| NO_FULL_CRASH_POLICY_V1 | 03_regelwerke/NO_FULL_CRASH_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| NONINTERACTIVE_EXECUTION_POLICY_V1 | 03_regelwerke/NONINTERACTIVE_EXECUTION_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| BRAIN_FIRST_POLICY_V1 | 03_regelwerke/BRAIN_FIRST_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| PROMPTMASTER_GOVERNANCE_V1 | 03_regelwerke/PROMPTMASTER_GOVERNANCE_V1.md | 🟢 Aktiv | 2026-06-10 |
| CHANGE_MANAGEMENT_POLICY_V1 | 03_regelwerke/CHANGE_MANAGEMENT_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| INCIDENT_RESPONSE_POLICY_V1 | 03_regelwerke/INCIDENT_RESPONSE_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| ECONOMIC_DECISION_POLICY_V1 | 03_regelwerke/ECONOMIC_DECISION_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| BACKUP_RESTORE_DR_POLICY_V1 | 03_regelwerke/BACKUP_RESTORE_DR_POLICY_V1.md | 🟢 Aktiv | 2026-06-10 |
| SYSTEMMASTER_PROACTIVE_TOTAL_CONCEPT_RESPONSIBILITY_V1 | 03_regelwerke/... | 🟢 Aktiv | 2026-06-10 |

---

## 4. BOLT-SPEZIFISCHE REGELN

### 4.1 RTK-Regeln

```
RTK_RULE_01: Tool-Outputs (git/grep/ls/tree/logs/find) → RTK IMMER aktiv
RTK_RULE_02: RTK bei Evidence-Dateien → DEAKTIVIERT
RTK_RULE_03: RTK bei Kundendokumenten → DEAKTIVIERT
RTK_RULE_04: RTK-Token-Ersparnis-Ziel → ≥ 60%
RTK_RULE_05: RTK-Status → Bestandteil jedes Bolt-Audits
```

### 4.2 Headroom-Regeln

```
HEADROOM_RULE_01: Eingehende Prompts → via /v1/compress komprimieren
HEADROOM_RULE_02: Kundendokumente → KEINE Kompression
HEADROOM_RULE_03: Evidence → KEINE Kompression
HEADROOM_RULE_04: Headroom-Endpoint → MUSS erreichbar sein (Health-Check)
HEADROOM_RULE_05: Kompressionsrate-Ziel → ≥ 40%
```

### 4.3 Caveman-Regeln

```
CAVEMAN_RULE_01: Default-Modus → moderate
CAVEMAN_RULE_02: SSE-Stream (Claude Code) → OFF (zwingend)
CAVEMAN_RULE_03: Non-Stream JSON → moderate oder full
CAVEMAN_RULE_04: Evidence → OFF (zwingend)
CAVEMAN_RULE_05: Kundenprojekt-Output → OFF (zwingend)
CAVEMAN_RULE_06: Security-Logs → OFF (zwingend)
CAVEMAN_RULE_07: Globale Einstellung "full" → VERBOTEN
```

### 4.4 Ponytail-Regeln

```
PONYTAIL_RULE_01: YAGNI → Nur implementieren was beauftragt wurde
PONYTAIL_RULE_02: Reuse → stdlib/OSS/lokale Module VOR Neubau
PONYTAIL_RULE_03: Deletion > Addition → Mehr Zeilen gelöscht als hinzugefügt
PONYTAIL_RULE_04: KISS → Einfachste Lösung die funktioniert
PONYTAIL_RULE_05: Security-Code → PONYTAIL DEAKTIVIERT (Sicherheit > Minimalismus)
PONYTAIL_RULE_06: Prüfung → Vor JEDEM Code-Commit: YAGNI-Check
```

---

## 5. REGELKONFLIKT-RESOLUTION

Bei Konflikt zwischen Regelwerken gilt:

```
1. Sicherheitsregeln > Alles andere
2. P0-Policies > P1-Richtlinien > P2-Empfehlungen
3. Spezifische Regel > Allgemeine Regel
4. Strengere Regel > Lockerere Regel
5. Neuere Version > Ältere Version
```

**Dokumentation:** Jeder Konflikt wird in `RULE_CONFLICT_REGISTER` eingetragen.

---

## 6. Prüfpunkte-Matrix

| Regelwerk | Geprüft von | Intervall | Nächstes Prüfung |
|-----------|-------------|-----------|------------------|
| Absolute Verbote (V01-V21) | Systemmaster | 7 Tage | 2026-06-29 |
| Pflichtvorgaben (P01-P17) | Systemmaster | 7 Tage | 2026-06-29 |
| Bolt-Regeln | 9Router-Admin | 7 Tage | 2026-06-29 |
| Policies | Systemmaster | 30 Tage | 2026-07-22 |
| Konflikt-Register | Systemmaster | 7 Tage | 2026-06-29 |

---

## 7. Owner & Accountability

| Regelbereich | Owner | Eskalation |
|-------------|-------|------------|
| Sicherheitsverbote (V01-V07) | NeXify CEO | — |
| Stabilitätsverbote (V08-V12) | Systemmaster | NeXify CEO |
| Bolt-Verbote (V13-V17) | 9Router-Admin | NeXify CEO |
| Governance-Verbote (V18-V21) | Promptmaster/Systemmaster | NeXify CEO |
| Prozessvorgaben (P01-P07) | Systemmaster | NeXify CEO |
| Bolt-Vorgaben (P08-P13) | 9Router-Admin | NeXify CEO |
| Qualitätsvorgaben (P14-P17) | Systemmaster | NeXify CEO |

---

*Generiert: 2026-06-22 | Nächstes Gesamt-Audit: 2026-06-29*
