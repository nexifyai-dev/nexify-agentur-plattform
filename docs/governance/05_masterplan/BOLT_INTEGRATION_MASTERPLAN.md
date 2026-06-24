---
ralph_loop_file: true
file_type: bolt_integration_masterplan
title: NeXify AI OS — Bolt-Integration Masterplan
version: 1.0.0
date: 2026-06-22
status: VERBINDLICH
priority: P0
owner: NeXify CEO (nexify-ceo)
---

# BOLT-INTEGRATION MASTERPLAN V1

> **Leitsatz:** Bolt-Features (RTK, Headroom, Caveman, Ponytail) sind KEINE Optionen.
> Sie sind Pflichtbestandteil jedes Ablaufs im NeXify AI OS.

---

## 1. Bolt-Features — Definition

| Feature | Name | Funktion | Einsparung | Quelle |
|---------|------|----------|------------|--------|
| **RTK** | Response Token Kürzung | Tool-Outputs (git/grep/ls/tree/logs) komprimieren | 60-90% Input-Tokens | 9Router open-sse/rtk |
| **Headroom** | Context-Compress | Prompts via `/v1/compress` vor Routing komprimieren | 40-60% Context-Tokens | 9Router compress |
| **Caveman** | Output-Compress | Terse-style Output-Kompression | ~65% Output-Tokens | 9Router open-sse/rtk/caveman |
| **Ponytail** | Lazy Senior Dev | YAGNI, reuse stdlib, deletion > addition | Code-Reduktion 30-50% | Philosophie-Pattern |

---

## 2. Integration in ALLE Abläufe

### 2.1 Ablauf: Aufgabenannahme (DOS GATE Prozess)

```
AGENT_EMPFÄNGT_AUFGABE
  │
  ├─[RTK]     → Tool-Outputs bei Kontext-Sammlung komprimieren
  ├─[Headroom] → Eingehende Aufgabenbeschreibung via /v1/compress komprimieren
  ├─[Caveman] → ZWISCHENERGEBNISSE in terse-style speichern
  └─[Ponytail] → Prüfen: Existiert Lösung schon? Skill vorhanden? OSS?
```

**Verantwortlich:** Ausführender Agent  
**Evidence:** `evidence_bolt_pre_analysis_<task_id>.json`

### 2.2 Ablauf: Brain-Query (BRAIN_FIRST_POLICY)

```
AGENT_FRAGT_BRAIN
  │
  ├─[Headroom] → Brain-Query-Prompt vor Senden komprimieren
  ├─[RTK]      → Brain-Response (JSON) komprimieren
  └─[Caveman]  → Brain-Summary in terse-style notieren
```

**Verantwortlich:** Ausführender Agent  
**Config:** `headroom.compress=true`, `rtk.mode=tool-output`

### 2.3 Ablauf: Code-Entwicklung

```
AGENT_SCHREIBT_CODE
  │
  ├─[Ponytail] → VORHER: YAGNI-Check. Braucht es das wirklich?
  ├─[Ponytail] → Bibliotheken prüfen: stdlib/OSS/lokale Module?
  ├─[Ponytail] → Deletion over Addition: Kann Code gelöscht werden?
  ├─[RTK]      → git diff/status/log Outputs komprimieren
  ├─[Caveman]  → Code-Review-Outputs in terse-style
  └─[Ponytail] → NACHER: Mehr gelöscht als hinzugefügt? ✅
```

**Verantwortlich:** Ausführender Agent  
**Evidence:** `evidence_ponytail_<task_id>.md` — muss Zeilen-Diff zeigen

### 2.4 Ablauf: Dateisystem-Operationen

```
AGENT_GREIFT_AUF_DATEISYSTEM_ZU
  │
  ├─[RTK] → ls, tree, find, stat → komprimiert
  ├─[RTK] → cat, head, tail → komprimiert (nur nicht-kritische Dateien)
  └─[Headroom] → Bei vielen Dateien: Context vorab komprimieren
```

**Ausnahme:** Regelwerke, Evidence, Kundendokumente → KEINE Kompression  
**Verantwortlich:** Ausführender Agent

### 2.5 Ablauf: Git-Operationen

```
AGENT_NUTZT_GIT
  │
  ├─[RTK] → git log --oneline → 90% weniger Tokens
  ├─[RTK] → git diff → 60% weniger Tokens
  ├─[RTK] → git status → 80% weniger Tokens
  └─[RTK] → git show → 70% weniger Tokens
```

**Verantwortlich:** Ausführender Agent  
**Config:** `rtk.git=true` (immer aktiv)

### 2.6 Ablauf: Audit / Evidence-Erstellung

```
AGENT_ERSTELLT_EVIDENCE
  │
  ├─[Caveman] → OFF (Rechtliche Genauigkeit)
  ├─[RTK]     → OFF (Vollständigkeit erforderlich)
  └─[Headroom] → OFF (Keine Kompression bei Evidence)
```

**Verantwortlich:** Ausführender Agent  
**Regel:** Evidence = IMMER unkomprimiert. Keine Ausnahme.

### 2.7 Ablauf: Monitoring / Log-Analyse

```
AGENT_ANALYSIERT_LOGS
  │
  ├─[RTK]      → Log-Outputs komprimieren (50% Ersparnis)
  ├─[Caveman]  → Moderat für Zusammenfassungen
  └─[Headroom] → Bei langen Logs: Vorkompression
```

**Verantwortlich:** Ausführender Agent  
**Ausnahme:** Security-Relevante Logs → Keine Kompression

### 2.8 Ablauf: Kundenprojekte (CUSTOMER_PROJECT)

```
AGENT_ARBEITET_AN_KUNDENPROJEKT
  │
  ├─[Ponytail] → YAGNI: Nur was beauftragt wurde
  ├─[Headroom] → Context komprimieren (nur interne Zwischenschritte)
  ├─[RTK]      → Tool-Outputs komprimieren
  ├─[Caveman]  → OFF für KI-Code-Generierung (Qualität)
  └─[Caveman]  → OFF für alle Kundendokumente
```

**Verantwortlich:** Ausführender Agent  
**Regel:** Kundenoutputs = IMMER in voller Qualität

---

## 3. Bolt-Konfiguration pro 9Router-Endpunkt

| Endpunkt | RTK | Headroom | Caveman | Ponytail |
|----------|-----|----------|---------|----------|
| **Claude Code (SSE-Stream)** | ON (tool-output) | ON | OFF | ON (YAGNI) |
| **Claude Code (non-stream)** | ON | ON | moderate | ON |
| **DeepSeek Reasoner** | ON | ON | moderate | ON |
| **DeepSeek Flash** | ON | ON | moderate | ON |
| **Sonstige** | ON | ON | moderate | ON |
| **Evidence/Pflicht** | OFF | OFF | OFF | N/A |

---

## 4. Implementierungsreihenfolge

| Phase | Bolt-Feature | Zeitraum | Abhängigkeit | Verantwortlich |
|-------|-------------|----------|--------------|----------------|
| P1 | RTK aktivieren | Tag 1 | 9Router konfiguriert | 9Router-Admin |
| P2 | Headroom aktivieren | Tag 1 | /v1/compress Endpoint | 9Router-Admin |
| P3 | Caveman moderate | Tag 2 | Kompatibilitätstest | 9Router-Admin |
| P4 | Ponytail in CLAUDE.md | Tag 1 | Keine | Systemmaster |
| P5 | Automatisierung | Tag 3-5 | P1-P4 | Systemmaster |

---

## 5. Monitoring der Bolt-Nutzung

### 5.1 Metriken (pro Agent-Session)

| Metrik | Ziel | Alert-Schwelle |
|--------|------|----------------|
| RTK-Token-Ersparnis | ≥60% | <40% |
| Headroom-Kompressionsrate | ≥40% | <20% |
| Caveman-Output-Rate | ≥50% | <30% |
| Ponytail-Deletions-Rate | ≥ Zeilen hinzugefügt | < hinzugefügt |

### 5.2 Prüfpunkte

```bash
# Prüfung: Ist RTK aktiv?
curl -s http://127.0.0.1:9090/api/rtk/status

# Prüfung: Ist Headroom konfiguriert?
curl -s http://127.0.0.1:9090/api/compress/status

# Prüfung: Caveman-Modus
curl -s http://127.0.0.1:9090/api/caveman/status
```

---

## 6. Verbotene Bolt-Konfigurationen

| Verbot | Begründung | Enforcement |
|--------|------------|-------------|
| Caveman "full" bei SSE-Stream | Beschädigt Frames → Claude Code defekt | Code-Review + CI |
| RTK bei Evidence-Dateien | Rechtliche Genauigkeit | Audit-Check |
| Headroom bei Kundendokumenten | Qualitätsverlust | Manual Gate |
| Ponytail bei Security-Code | Sicherheit > Minimalismus | Security-Audit |

---

## 7. Abhängigkeiten

```
BOLT_MASTERPLAN
  ├── 9Router (nexifyai-combo-llm) → RTK, Headroom, Caveman
  ├── /v1/compress Endpoint → Headroom
  ├── CLAUDE.md → Ponytail-Regeln
  ├── DOS GATES → Bolt-Checks in Gate G03, G05
  └── AUDIT_SYSTEM_V1 → Bolt-Audit alle 7 Tage
```

---

## 8. Erfolgskriterien

| Kriterium | Ziel | Messung |
|-----------|------|---------|
| Token-Reduktion gesamt | ≥50% | Monatliche Auswertung |
| Bolt-Compliance | 100% | Wöchentliches Audit |
| Qualitätseinbußen | 0 | User-Reports, Audit |
| Claude-Code-Kompatibilität | 100% | E2E-Test |

---

## 9. Owner & Accountability

| Bereich | Owner | Eskalation |
|---------|-------|------------|
| RTK-Config | 9Router-Admin | NeXify CEO |
| Headroom-Config | 9Router-Admin | NeXify CEO |
| Caveman-Config | 9Router-Admin | NeXify CEO |
| Ponytail-Compliance | Jeder Agent | Systemmaster |
| Bolt-Audit | Systemmaster | NeXify CEO |
| Token-Monitoring | Systemmaster | NeXify CEO |

---

*Generiert: 2026-06-22 | Nächster Review: 2026-06-29*
