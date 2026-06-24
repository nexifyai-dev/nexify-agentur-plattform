# MEMORY_PFLICHT V1 — agentmemory als zentrale Memory-Schicht

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja
**Übergeordnetes Regelwerk:** NeXify AI Global Rules — Memory-Pflicht (Rang 4)

---

## 1. Zweck

Diese Regel definiert **agentmemory als die zentrale und einzige Memory-Schicht**
für alle Agenten im NeXify-System. Lokales, agenten-spezifisches Gedächtnis
außerhalb von agentmemory ist nicht erlaubt. Alle relevanten Interaktionen,
Entscheidungen und Zustände müssen in agentmemory persistiert werden.

> **Leitsatz:** Ein Agent ohne Memory-Sync ist ein Agent ohne Gedächtnis.
> agentmemory = das kollektive Gedächtnis des Systems.

---

## 2. Kernregel

```
Jeder Agent MUSS:
  1. VOR Arbeitsbeginn: agentmemory synchronisieren (Zustand laden)
  2. WÄHREND der Arbeit: relevante Ereignisse in agentmemory erfassen
  3. NACH der Arbeit: agentmemory synchronisieren (Zustand speichern)
```

---

## 3. agentmemory-Pflichten

### 3.1 Vor Arbeitsbeginn (Pre-Sync)

| Aktion | Beschreibung | Frequenz |
|--------|--------------|----------|
| Memory laden | agentmemory-Repository öffnen und letzten Zustand laden | Vor jeder Aufgabe |
| Historie prüfen | Relevante Vergangenheits-Einträge zur aktuellen Aufgabe abrufen | Vor jeder Aufgabe |
| Kontext wiederherstellen | Offene Tasks, letzte Entscheidungen, aktive Kontexte laden | Vor jeder Aufgabe |
| Sync-Status prüfen | Letzten Sync-Zeitstempel validieren | Vor jeder Aufgabe |

**Wenn Pre-Sync fehlschlägt:**
- ❌ Memory nicht ladbar → Aufgabe pausieren, System-Admin informieren
- ❌ Sync > 1h zurück → Warnung ausgeben, Sync erzwingen
- ❌ Inkonsistenz erkannt → Recovery-Prozess starten

### 3.2 Während der Arbeit (Live-Sync)

Folgende Ereignisse lösen einen **sofortigen Memory-Sync** aus:

| Ereignis | Grund |
|----------|-------|
| Entscheidung getroffen | Nachvollziehbarkeit sicherstellen |
| Fehler aufgetreten | Fehleranalyse ermöglichen |
| Aufgabe abgeschlossen | DONE-Kriterium 4 erfüllen |
| Kontextwechsel | Zustand vor Wechsel sichern |
| Externer Call | Ergebnisse persistieren |
| Policy Gate durchlaufen | Gate-Ergebnis sichern |

### 3.3 Nach Arbeitsende (Post-Sync)

| Aktion | Beschreibung |
|--------|--------------|
| Finaler Sync | Kompletten Arbeitszustand in agentmemory sichern |
| Evidence-Verknüpfung | Memory-Einträge mit Evidence-Datei verknüpfen |
| Task-Status | Offene/abgeschlossene Tasks im Memory markieren |
| Cleanup | Temporäre Daten bereinigen |

---

## 4. Datenstruktur in agentmemory

Jeder Memory-Eintrag folgt dieser Struktur:

```yaml
entry:
  id: "mem-20260610-001"
  timestamp: "2026-06-10T18:42:00Z"
  agent: "agent-name"
  type: "decision" | "action" | "error" | "state" | "context" | "evidence"
  task_id: "TASK-001"
  
  content:
    summary: "Kurze Beschreibung des Eintrags"
    details: "Detaillierte Informationen"
    result: "Ergebnis/Konsequenz"
  
  context:
    brain_ref: "Verweis auf Brain-Kontext"
    skill_ref: "Verwendeter Skill"
    policy_gate: "PG-ID"
  
  links:
    evidence: ["/evidence/ev-001.md"]
    tasks: ["TASK-001"]
    dependencies: ["mem-20260610-000"]
  
  tags: ["tag1", "tag2"]
```

---

## 5. Verbotenes

| ❌ Verboten | Begründung | Konsequenz |
|-------------|------------|------------|
| Agenten-lokales Gedächtnis | Umgeht zentrale Persistenz | Memory gilt als nicht synchronisiert |
| Memory-Sync überspringen | Datenverlust möglich | Task gilt als nicht DONE |
| agentmemory ohne Check nutzen | Veralteter Zustand | Pre-Sync vor Nutzung |
| Memory-Einträge ohne Evidence | Nicht nachvollziehbar | Eintrag wird beim Audit markiert |

---

## 6. Sync-Intervalle

| Intervall | Typ | Max. Zeit zwischen Syncs |
|-----------|-----|-------------------------|
| 🔴 Kritisch | Entscheidungen, Fehler | Sofort (ereignisgesteuert) |
| 🟡 Hoch | Aktive Arbeit | Max. 15 Minuten |
| 🟢 Normal | Kontext, Status | Max. 1 Stunde |
| ⚪ Niedrig | Historische Daten | Max. 1 Tag |

---

## 7. Verhältnis zu anderen Regeln

| Regelwerk | Bezug |
|-----------|-------|
| GLOBAL_POLICY_V1 | Memory-Prüfung = Stufe 3 des Policy Gates |
| DONE_REGEL_V1 | Memory-Sync = DONE-Kriterium 4 |
| AUDIT_MASTER_V1 | Memory-Integrität ist audit-pflichtig |
| EVIDENCE_TEMPLATE_V1 | Evidence enthält Memory-Sync-Status |

---

## 8. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiale Version — Memory-Mandat | NeXify Governance |

---

*Diese Regel implementiert das Memory-Pflicht-Prinzip aus den NeXify AI Global Rules.*
