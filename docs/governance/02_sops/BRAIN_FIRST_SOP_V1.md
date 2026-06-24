# NeXify AI — Brain-First SOP V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Governance / NeXify AI
**Klassifikation:** nexify_internal

---

## 1. Zweck

Sicherstellen, dass jeder relevante Arbeitsschritt durch Brain-Wissen fundiert ist.

## 2. Geltungsbereich

Jeder Agent (Claude Code, Goose CLI, Goose ACC) vor jeder nicht-trivialen Aktion.

## 3. Ablauf

```
1. Brain Health prüfen: GET /api/brain/health
2. Brain Query: POST /api/brain/query mit Task-Keywords
3. Ergebnisse prüfen → Relevante Einträge laden
4. Aktion durchführen
5. Neue Erkenntnisse: POST /api/brain/store
```

## 4. Query-Format

```bash
curl -X POST https://brain.nexifyai.cloud/api/brain/query \
  -H "Content-Type: application/json" \
  -d '{"query": "<task-keywords>", "collection": "nexifyai_brain", "limit": 5}'
```

## 5. Store-Format

```json
{
  "collection": "nexifyai_brain",
  "content": "Kurze prägnante Zusammenfassung der Erkenntnis",
  "metadata": {
    "category": "<kategorie>",
    "source": "<datei-pfad>",
    "tags": ["tag1", "tag2"]
  }
}
```

## 6. Ausnahmen

- Meta-Fragen, einfache Berechnungen, Statusabfragen ohne Entscheidungsrelevanz
- Brain nicht erreichbar: nur read-only Analyse, keine riskanten Änderungen

## 7. Gate

Ohne Brain-Query vor relevanter Arbeit gilt die Arbeit als nicht abgenommen.
