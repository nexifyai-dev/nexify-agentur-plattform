# NeXify AI OS — Memory-Retention-Policy

**Version:** 1.0  
**Datum:** 2026-06-22  
**Status:** DEFINED  

---

## 1. Übersicht

Die Memory-Retention-Policy definiert die Aufbewahrungsfristen für die drei Memory-Schichten des NeXify AI OS.

## 2. Memory-Schichten & Retention-Zeiträume

| Schicht | Zweck | Retention | Lösch-Strategie |
|---|---|---|---|
| **Brain** | Kanonisches Langzeitwissen | **365 Tage** | Soft-Delete → Archiv → Hard-Delete |
| **Qdrant** | Suchindex (Vektor-Embeddings) | **180 Tage** | Automatische Bereinigung + Re-Index |
| **AgentMemory** | Runtime-Erfahrung & Sessions | **30 Tage** | Automatische Löschung nach Ablauf |

## 3. Brain — 365 Tage

### Regeln
- Einträge mit `created_at > 365 Tage` werden als **kandidaten** markiert
- **NICHT automatisch gelöscht** — Brain ist kanonisch
- Nach 300 Tagen: Warnung an Admin
- Nach 365 Tagen: Soft-Delete (auf `archived` setzen)
- Nach 400 Tagen: Hard-Delete (nur nach manueller Freigabe)

### Geschützte Kategorien
- System-Konfigurationen (nie löschen)
- User-Präferenzen (nie löschen)
- Core-Skills (nie löschen)

### Aktueller Bestand
- **1.252 Einträge** (Stand: Migration)
- Geschätzt betroffen nach 365 Tagen: ~0 (neue Installation)

## 4. Qdrant — 180 Tage

### Regeln
- Points mit `timestamp > 180 Tage` werden automatisch gelöscht
- Wöchentliche Bereinigung (Cron: Sonntag 03:00 UTC)
- Vor Löschung: Export als JSON-Backup
- Re-Indexierung der verbleibenden Points nach Bereinigung

### Filter-Kriterien
```
DELETE FROM qdrant WHERE:
  - timestamp < (NOW - 180 days)
  - AND access_count < 5
  - AND NOT tagged_as('permanent')
```

### Aktueller Bestand
- **~18.841 Points** (Stand: Migration)

## 5. AgentMemory — 30 Tage

### Regeln
- Sessions älter als 30 Tage werden automatisch gelöscht
- Tägliche Bereinigung (Cron: 04:00 UTC)
- Vor Löschung: JSON-Backup → `/workspace/nexify/backups/agentmemory/`
- Nur Sessions mit `status: completed` oder `status: failed` werden gelöscht

### Filter-Kriterien
```
DELETE FROM agentmemory WHERE:
  - last_activity < (NOW - 30 days)
  - AND session_status IN ('completed', 'failed')
  - AND NOT flagged_as('important')
```

## 6. Backup-Strategie vor Löschung

| Schicht | Backup-Format | Backup-Ort | Aufbewahrung |
|---|---|---|---|
| Brain | SQLite Dump | `/workspace/nexify/backups/brain/` | 90 Tage |
| Qdrant | JSON Export | `/workspace/nexify/backups/qdrant/` | 60 Tage |
| AgentMemory | JSON Export | `/workspace/nexify/backups/agentmemory/` | 30 Tage |

## 7. Sicherheitsregeln

1. **Keine Datenverluste** — Backup MUSS vor Löschung existieren
2. **Geschützte Einträge** werden nie gelöscht
3. **Manuelle Override** möglich via CLI
4. **Audit-Log** für alle Löschvorgänge
5. **Rollback** möglich innerhalb der Backup-Aufbewahrungszeit

---

*Erstellt von: Memory Agent (P2-Task 10)*
