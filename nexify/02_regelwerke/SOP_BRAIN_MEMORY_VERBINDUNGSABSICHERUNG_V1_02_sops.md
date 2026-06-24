# SOP — Brain-, agentmemory- und Wissensverbindung absichern V1

## Zweck

NeXify-Agenten dürfen nicht mit Teilwissen arbeiten. Vor jeder relevanten Arbeit muss feststehen, ob Brain und agentmemory erreichbar, korrekt konfiguriert und passend genutzt werden.

## Rollen

```text
Brain = geprüftes, langfristiges, semantisches Wissen / Qdrant / Oracle / Evidence-Kanon
agentmemory = agentennaher Arbeitskontext, Sessions, Handoffs, Zwischenstände
Dateisystem = sichtbare operative Wissensablage
Kanban = operative Aufgabenwahrheit
Evidence = Nachweis
```

## Pflichtcheck vor Arbeit

1. Brain Health.
2. Qdrant Health.
3. Embedding Endpoint.
4. Collection-Status.
5. Query-Test.
6. Store-Test, falls intern und erlaubt.
7. agentmemory Health.
8. MCP-/API-Zugriff.
9. Pending-Queue vorhanden.
10. Import-/Reindex-Pfad vorhanden.

## Statuslogik

```text
BRAIN_OK
BRAIN_QUERY_ONLY
BRAIN_STORE_BLOCKED
BRAIN_UNAVAILABLE_PENDING_ACTIVE
AGENTMEMORY_OK
AGENTMEMORY_LOCAL_ONLY
AGENTMEMORY_MCP_BLOCKED
MEMORY_PENDING_ACTIVE
```

## Mindestregel

Wenn Brain oder agentmemory nicht erreichbar sind, wird nicht gestoppt, sofern sichere Arbeit möglich ist. Stattdessen:

- lokale Quellen laden;
- Pending-Dateien schreiben;
- Recovery-Task erzeugen;
- Risiko dokumentieren;
- keine Fake-Done-Meldung.