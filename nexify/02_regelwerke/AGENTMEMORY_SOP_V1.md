# NeXify AI — agentmemory SOP V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Governance / NeXify AI
**Klassifikation:** nexify_internal

---

## 1. Zweck

agentmemory speichert arbeitsnahen Kontext für laufende Sessions.
Es ergänzt Brain (kanonisches Langzeitwissen) um temporären Arbeitskontext.

## 2. Schichten

| Schicht | Typ | Haltbarkeit | Inhalt |
|---------|-----|-------------|--------|
| Brain | Kanonisch | Dauerhaft | Regeln, Entscheidungen, Architektur |
| agentmemory | Arbeitsnah | Session + | Laufende Tasks, Kontext, Findings |
| Evidence | Nachweis | Dauerhaft | Abgeschlossene Tasks, Prüfpfade |

## 3. Schreib-Regel

Nach jeder abgeschlossenen Task:

1. Relevante Erkenntnisse in agentmemory speichern
2. Kanonisches Wissen in Brain speichern
3. Evidence-Datei schreiben

## 4. Sync-Regel

| Quelle | Ziel | Trigger |
|--------|------|---------|
| agentmemory → Brain | Wöchentlich oder bei Task-Abschluss | Automations-Cron |
| Brain → agentmemory | Bei Session-Start | agentmemory MCP Query |

## 5. Format

```json
{
  "content": "Kurze Zusammenfassung",
  "metadata": {
    "kind": "observation",
    "project": "nexify_internal",
    "type": "decision|finding|note"
  }
}
```

## 6. Gate

agentmemory ohne Sync-Policy gilt als nicht betriebsbereit.
