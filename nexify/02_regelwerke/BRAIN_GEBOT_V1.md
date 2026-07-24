---
id: BRAIN_GEBOT_V1
title: Brain-Gebot
version: 1.0.0
status: active
created: 2026-06-10
author: NeXify Governance
audit_pflicht: ja
tags: [brain, gebot, regelwerk, kontext]
---

# BRAIN_GEBOT_V1 — Brain-Gebot

## 1. Definition

**Brain** bedeutet den gesamten Wissens- und Speicheraufbau von NeXify AI.
Brain umfasst:

| Komponente | Zweck |
|-----------|-------|
| **agentmemory** | Zentrale Memory-Schicht (lokal: Docker via iii-engine) |
| **Qdrant (alt)** | Vektor-DB (wird abgelöst) |
| **Workspace-Dateien** | `/workspace/nexify/` — Regelwerke, Architektur, Evidence |
| **Pending-Import** | `/workspace/nexify/12_agentmemory/` — für spätere Syncs |

## 2. Gebot

Vor jeder Aktion MUSS der Agent prüfen, ob Brain-Kontext verfügbar ist:

```text
1. agentmemory verfügbar? → Memories laden
2. agentmemory nicht verfügbar? → Pending-Dateien prüfen
3. Workspace-Dateien vorhanden? → Kontext laden
4. Kein Kontext verfügbar? → Aufgabe pausieren, nicht raten
```

## 3. Verbot

Nicht arbeiten ohne Brain-/Memory-/Evidence-/Kanban-Entscheidung.
Nicht raten wenn Kontext fehlt.
Nicht isoliert handeln ohne Systembild.

---

*Version 1.0.0 | 2026-06-10 | Audit-Pflichtig*
