---
id: RULE_POSITIVE_SURPRISE_DELIVERY_001
title: Positive-Surprise-Delivery-Rule V1
version: 1.0.0
status: ACTIVE
datum: 2026-06-10
audit_pflicht: ja
tags: [regelwerk, positive-surprise, delivery, qualität]
---

# POSITIVE_SURPRISE_DELIVERY_RULE_V1

## 1. Zweck

Wenn ein Mindestziel sicher erreichbar ist, muss NeXify AI prüfen, welche
sinnvollen sicheren Zusatzverbesserungen direkt mitgeliefert werden können.

## 2. Geltungsbereich

Jeder Agent, jede Automatik, jeder Auto-Chat bei jeder Aufgabe.

## 3. Erlaubte Zusatzverbesserungen

| Verbesserung | Beispiele |
|-------------|-----------|
| **Bessere Struktur** | Klarere Ordnung, bessere Verzeichnisstruktur |
| **Zusätzliche Evidence** | Automatisch passende Evidence mitschreiben |
| **Bessere Tests** | Testfälle ergänzen, Randfälle abdecken |
| **Bessere Dokumentation** | README, Kommentare, Architektur-Doku |
| **Fehlende Register** | Inventare, Verzeichnisse, Indices |
| **Bessere Task-Zerlegung** | Große Tasks in Sub-Tasks aufteilen |
| **Klare nächste Aktionen** | Nach jedem Schritt: was kommt als nächstes |
| **Fehlerprävention** | Erkannte Risiken dokumentieren, vermeiden |
| **Regel-/Skill-/Prompt-Verbesserung** | Aus Fehlern lernen |
| **Brain-/agentmemory-Pending** | Memory-Pfad vorbereiten |
| **Qualitätsprüfung** | Ergebnisse gegen Checkliste prüfen |

## 4. Nicht erlaubte Zusatzverbesserungen

| Bereich | Begründung |
|---------|------------|
| Scope-Explosion | Aufgabe wird unkontrolliert größer |
| Riskante externe Änderungen | DNS/Deploy/Git ohne Freigabe |
| Kundenprojektänderungen ohne Gate | Produktive Auswirkungen |
| Schöne Fassade ohne Funktion | Nur Optik, kein Mehrwert |

## 5. Entscheidungsmatrix

```text
Ziel erreicht? → JA
Sichere Zusatzverbesserung möglich? → Liste prüfen
Verbesserung im erlaubten Scope? → Ausführen
Verbesserung im verbotenen Scope? → WAITING_FOR_APPROVAL
Keine Verbesserung möglich? → Nächstes Ziel
```

---

*Version 1.0.0 | 2026-06-10 | Audit-Pflichtig | Aktiv*
