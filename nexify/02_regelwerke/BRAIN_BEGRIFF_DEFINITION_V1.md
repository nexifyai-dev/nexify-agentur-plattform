---
id: BRAIN_BEGRIFF_DEFINITION_V1
title: Brain-Begriffsdefinition
version: 1.0.0
status: active
created: 2026-06-10
author: NeXify Governance
audit_pflicht: ja
tags: [brain, definition, begriff, kontext]
---

# BRAIN_BEGRIFF_DEFINITION_V1 — Was „Brain“ bedeutet

## 1. Begriffsklärung

**Brain** ist im NeXify-Kontext der gesamte Wissens-, Speicher- und
Entscheidungsaufbau des Systems. Brain ist nicht nur eine Technologie,
sondern ein Architekturprinzip:

> **Brain = agentmemory + Workspace-Dateien + Pending + Evidence + Kanban**

## 2. Technische Schichten

| Schicht | System | Status | Zugriff |
|---------|--------|--------|---------|
| Primär | agentmemory (iii-engine) | ✅ Lokal läuft | Docker :3111 (Auth required) |
| Fallback | Pending-Dateien (JSON) | ✅ Bereit | `/workspace/nexify/12_agentmemory/` |
| Statisch | Workspace-Dateien (Markdown) | ✅ Vollständig | `/workspace/nexify/` |
| Evidence | Alle Aktionen dokumentiert | ✅ Aktiv | `/workspace/nexify/10_evidence/` |
| Alt | Qdrant (wird abgelöst) | 🔴 Abkündigung | Kein Zugriff mehr |

## 3. Nutzungspflicht

Jeder Agent MUSS vor einer Aktion prüfen:

```text
1. Ist agentmemory lesbar?
   → Ja: Memories laden, relevante Kontexte abrufen
   → Nein: Pending-Import prüfen, Workspace-Dateien laden
2. Ist Evidence vorhanden?
   → Ja: Vorherige Entscheidungen prüfen
3. Ist Kanban aktuell?
   → Ja: Task-Status übernehmen
   → Nein: Task-Registry aktualisieren
4. Erst dann: Handeln
```

## 4. Bei Nichterreichbarkeit

Wenn Brain nicht erreichbar ist:

```text
Quelle: <name>
Status: NOT_AVAILABLE
Grund: <ursache>
Risiko: HOCH/MITTEL/NIEDRIG
Ersatzquelle: <pfad>
Folgeauftrag: <task>
```

Nicht raten wenn Brain nicht erreichbar ist.  
Nicht isoliert handeln ohne Systembild.  
Pausieren und dokumentieren.

---

*Version 1.0.0 | 2026-06-10 | Audit-Pflichtig*
