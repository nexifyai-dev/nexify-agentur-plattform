# NeXify AI — Endkontrollhandbuch V1 (QR-Gate)

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Qualität / NeXify AI
**Klassifikation:** nexify_internal

---

## 1. Zweck

Jeder Task durchläuft ein QR-Gate (Quality Review Gate) vor der Abnahme.
Ohne bestandenes QR-Gate gilt kein Task als DONE.

## 2. QR-Gate-Pflicht

Jeder Task muss folgende Prüfung durchlaufen:

| Schritt | Prüfung | Kriterium |
|---------|---------|-----------|
| QR-01 | Ziel erreicht? | Task-Ziel mit IST vergleichen |
| QR-02 | Tests bestanden? | Alle relevanten Tests grün |
| QR-03 | Evidence geschrieben? | Evidence-Datei existiert und vollständig |
| QR-04 | Risiken dokumentiert? | Bekannte Risiken sind erfasst |
| QR-05 | Rollback-Pfad dokumentiert? | Rollback-Schritte sind klar |
| QR-06 | Brain/agentmemory gesynct? | Relevante Erkenntnisse gespeichert |
| QR-07 | Gate-Pflicht geprüft? | Kein verbotenes Muster verletzt |

## 3. Evidence-Format

Jeder abgeschlossene Task erzeugt eine Evidence-Datei:

```markdown
# Evidence: <Task-ID/Name>

**Datum:** YYYY-MM-DD
**Owner:** <Name>
**Gate bestanden:** ja/nein

## Was wurde gemacht?
- <Liste der Änderungen>

## Was wurde getestet?
- <Tests + Ergebnisse>

## Risiken
- <Bekannte Risiken>

## Rollback
- <Schritte zum Rückgängigmachen>
```

## 4. DONE-Definition

Ein Task gilt nur dann als DONE, wenn:
- Alle QR-Schritte grün
- Evidence existiert
- Brain/agentmemory aktualisiert
- Keine kritischen Risiken offen

## 5. Gate-Verletzungen

Folgende Muster führen zum sofortigen QR-Fail:
- Secrets in Logs, Git, Brain, Evidence
- Produktivänderung ohne Gate
- Fehlender Rollback-Pfad
- Keine Tests bei Code-Änderung
- Dokumentation fehlt bei neuer Komponente
