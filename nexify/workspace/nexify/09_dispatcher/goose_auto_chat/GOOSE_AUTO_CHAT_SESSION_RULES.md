# GOOSE_AUTO_CHAT Session-Regeln

**Dokument:** GOOSE_AUTO_CHAT_SESSION_RULES.md  
**Version:** 1.0.0  
**Status:** Freigegeben  
**Stand:** 2026-06-10  
**Audit-Pflicht:** JA — Jede Änderung an diesem Dokument muss auditiert und versioniert werden.

---

## Inhaltsverzeichnis

1. [Session-Erkennung](#1-session-erkennung)
2. [Status-Modell](#2-status-modell)
3. [Wiederherstellungs-Regeln](#3-wiederherstellungs-regeln)
4. [Session-Lebenszyklus](#4-session-lebenszyklus)
5. [Fehlerbehandlung](#5-fehlerbehandlung)

---

## 1. Session-Erkennung

### 1.1 Datenbank-Schema (SQLite)

Die Session-Verwaltung basiert auf einer SQLite-Datenbank mit folgendem Schema:

```sql
-- Datei: data/sessions.db

CREATE TABLE sessions (
    id              TEXT PRIMARY KEY,                          -- UUID v4
    status          TEXT NOT NULL DEFAULT 'RUNNING',          -- Status-Enum
    created_at      TEXT NOT NULL,                            -- ISO 8601
    updated_at      TEXT NOT NULL,                            -- ISO 8601
    context_json    TEXT,                                     -- serialisierter Kontext
    history         TEXT,                                     -- JSON-Array der Nachrichten
    error_count     INTEGER DEFAULT 0,                        -- Fehlerzähler
    max_errors      INTEGER DEFAULT 5,                        -- max. Fehler vor ERROR
    last_response   TEXT,                                     -- letzte Antwort
    source_system   TEXT DEFAULT 'goose_cli',                 -- Herkunft
    metadata_json   TEXT,                                     -- optionale Metadaten
    lock_version    INTEGER DEFAULT 1                         -- Optimistic Locking
);

CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_source ON sessions(source_system);

CREATE TABLE session_events (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id      TEXT NOT NULL,
    event_type      TEXT NOT NULL,                            -- 'CREATE','UPDATE','ERROR','RECOVER'
    old_status      TEXT,
    new_status      TEXT,
    reason          TEXT,
    created_at      TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE INDEX idx_session_events_session ON session_events(session_id);
CREATE INDEX idx_session_events_created ON session_events(created_at);
```

### 1.2 Erkennungslogik

Eine Session wird in folgenden Fällen erkannt bzw. angelegt:

| Szenario | Aktion | Quelle |
|----------|--------|--------|
| Neuer Goose-Aufruf via Ebene B | `create_session()` mit source=`goose_cli` | Injector-Event |
| Wiederkehrender Agent (gleiche ID) | `get_session(id)` → Session existiert bereits | Session Manager |
| Timeout nach 30s ohne Antwort | `create_session()` mit Status=`STUCK` | Observer (Timeout) |
| Manuelle Session via Hermes-Admin | `create_session()` mit source=`hermes_admin` | Hermes-API |
| System-Neustart mit aktiven Sessions | `recover_sessions()` → Prüfung aller Sessions | Startup-Routine |

### 1.3 Erkennungsregeln

1. **Eindeutigkeit:** Jede Session wird über eine UUID v4 identifiziert. Kollisionen sind ausgeschlossen.
2. **Idempotenz:** Wird `create_session()` mit einer existierenden ID aufgerufen, wird die bestehende Session zurückgegeben.
3. **Lebensdauer:** Eine Session ist maximal 24h gültig. Danach wird sie automatisch auf DONE gesetzt (Archivierung).
4. **Maximale Sessions:** Gleichzeitig maximal 100 aktive Sessions (RUNNING + WAITING). Bei Überschreitung wird die älteste WAITING-Session auf DONE gesetzt.
5. **Validierung:** Jede Session durchläuft eine Schema-Validierung vor dem Speichern.

---

## 2. Status-Modell

### 2.1 Status-Übersicht

```
┌──────────┐
│ RUNNING  │ ◀── Aktive Session, Nachrichten werden gesendet
└────┬─────┘
     │
     ▼
┌──────────┐
│ WAITING  │ ◀── Session wartet auf Antwort oder nächsten Zyklus
└────┬─────┘
     │
     ├──────────────────┐
     ▼                  ▼
┌──────────┐    ┌──────────┐
│ STUCK    │    │ ERROR    │
│ (Timeout)│    │ (Fehler) │
└────┬─────┘    └────┬─────┘
     │               │
     └───────┬───────┘
             ▼
      ┌──────────┐
      │ DONE     │ ◀── Endzustand
      └──────────┘
```

### 2.2 Status-Definitionen

| Status | Beschreibung | Erlaubte Aktionen | Automatische Übergänge |
|--------|-------------|-------------------|----------------------|
| **RUNNING** | Session ist aktiv. Nachrichten werden regulär gesendet und empfangen. | `send`, `receive`, `pause`, `stop` | → WAITING (nach Sendung), → ERROR (bei Fehler) |
| **WAITING** | Session wartet. Keine aktiven Operationen. System erwartet Ereignis oder Zeitablauf. | `resume`, `stop`, `cancel` | → RUNNING (bei Resume/neuer Nachricht), → STUCK (nach Timeout) |
| **STUCK** | Session hat ein Timeout oder hängt. Keine Antwort nach konfigurierbarer Zeit. | `retry`, `recover`, `stop` | → RUNNING (bei erfolgreichem Retry), → ERROR (nach fehlgeschlagenem Retry) |
| **DONE** | Session ist erfolgreich abgeschlossen. Keine weiteren Aktionen möglich. | `view_logs`, `archive` | Keine (Endzustand) |
| **ERROR** | Session hat einen nicht behebbaren Fehler. | `recover`, `stop` | → RUNNING (bei erfolgreicher Recovery), → DONE (bei manuellem Stop) |

### 2.3 Status-Transitionen (vollständig)

```
                 ┌─────────────────────────────┐
                 │                             │
                 ▼                             │
  ┌───────┐  send  ┌───────┐  timeout  ┌───────┐
  │RUNNING│───────→│WAITING│──────────→│ STUCK │
  └───┬───┘       └───┬───┘           └───┬───┘
      │               │                    │
      │  error        │  resume            │  retry (ok)
      ▼               │                    ▼
  ┌───────┐           │              ┌───────────┐
  │ ERROR │           └─────────────→│  RUNNING   │
  └───┬───┘          recover(ok)     └───────────┘
      │                                      ▲
      │  recover(ok)                         │
      └──────────────────────────────────────┘
```

### 2.4 Status-Tabelle (Entscheidungsmatrix)

| Aktueller Status | Erlaubt: senden | Erlaubt: empfangen | Erlaubt: pausieren | Erlaubt: stoppen | Erlaubt: retry | Erlaubt: recover |
|-----------------|:---------------:|:------------------:|:------------------:|:----------------:|:--------------:|:----------------:|
| RUNNING | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| WAITING | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| STUCK | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| DONE | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ERROR | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 3. Wiederherstellungs-Regeln

### 3.1 Wiederherstellungsstrategie (Recovery)

Die Wiederherstellung einer Session erfolgt nach definierten Regeln, abhängig vom aktuellen Status und der Fehlerhistorie.

### 3.2 Recovery aus STUCK

| Bedingung | Aktion | Ergebnis |
|-----------|--------|----------|
| Timeout < 60s und error_count < max_errors | Automatischer Retry (max. 3 Versuche) | → RUNNING bei Erfolg, → ERROR nach 3 Fehlversuchen |
| Timeout ≥ 60s | Manuelle Entscheidung erforderlich (via Hermes-Admin) | → RUNNING (nach Freigabe) oder → DONE (bei Abbruch) |
| `GOOSE_USER_CHAT_DRIVER_RECOVERY_AUTO=true` | Automatischer Retry ohne manuelle Prüfung | → RUNNING (bei Erfolg) |

### 3.3 Recovery aus ERROR

| Bedingung | Aktion | Ergebnis |
|-----------|--------|----------|
| Fehler ist netzwerkbedingt (ConnectionError, Timeout) | Automatischer Retry nach 10s | → RUNNING bei Erfolg |
| Fehler ist inhaltlich (Policy-REJECT, ungültiges Format) | Kein automatischer Retry | → DONE (manuelle Analyse nötig) |
| Fehler ist systemisch (Speicher voll, DB-Fehler) | Alert an Admin, Session pausieren | → WAITING (nach manuellem Eingriff) |
| error_count ≥ max_errors (5) | Keine weiteren Versuche | → DONE (mit Fehler-Log) |

### 3.4 Recovery aus System-Neustart

```python
def recover_sessions():
    """Wird beim Systemstart aufgerufen."""
    active_sessions = db.query(
        "SELECT * FROM sessions WHERE status IN ('RUNNING', 'WAITING', 'STUCK')"
    )
    for session in active_sessions:
        if session.status == 'RUNNING':
            # Prüfen, ob Goose-CLI noch antwortet
            if ping_goose_cli(session.id):
                session.status = 'RUNNING'  # unverändert
            else:
                session.status = 'STUCK'
                session.reason = 'Recovery: Goose-CLI nicht erreichbar'
        elif session.status == 'WAITING':
            # Wartende Sessions bleiben wartend
            session.status = 'WAITING'  # unverändert
        elif session.status == 'STUCK':
            # Automatischer Retry-Versuch
            if try_recover_stuck(session):
                session.status = 'RUNNING'
            else:
                session.status = 'DONE'
                session.reason = 'Recovery fehlgeschlagen'
    db.commit()
```

### 3.5 Recovery-Regeln (vollständige Liste)

| Regel-ID | Bedingung | Aktion | Automatisch? | Priorität |
|----------|-----------|--------|:------------:|:---------:|
| R01 | Timeout in RUNNING | Status → STUCK | ✅ | 1 |
| R02 | STUCK + Timeout < 60s | Retry (max. 3×) | ✅ | 2 |
| R03 | STUCK + Timeout ≥ 60s | Admin-Benachrichtigung | ❌ | 3 |
| R04 | STUCK + Retry erfolgreich | Status → RUNNING | ✅ | 1 |
| R05 | STUCK + 3× Retry fehlgeschlagen | Status → ERROR | ✅ | 2 |
| R06 | ERROR + Netzwerkfehler | Retry nach 10s | ✅ | 2 |
| R07 | ERROR + Inhaltsfehler | Status → DONE | ✅ | 3 |
| R08 | ERROR + Systemfehler | Admin-Alert | ❌ | 1 |
| R09 | error_count ≥ max_errors | Status → DONE | ✅ | 1 |
| R10 | System-Neustart | `recover_sessions()` | ✅ | 0 |

---

## 4. Session-Lebenszyklus

### 4.1 Vollständiger Lebenszyklus

```
Phase 1: INIT
─────────────────────────────────────────────────
  1. Session wird angelegt (created_at, status=RUNNING)
  2. Kontext wird initialisiert
  3. Policy Gate prüft erste Nachricht
  4. Message Builder erstellt ersten Prompt
  Dauer: < 1s

Phase 2: ACTIVE
─────────────────────────────────────────────────
  5. Injector sendet Nachricht
  6. Goose-CLI verarbeitet (Dauer: variabel)
  7. Observer empfängt Antwort
  8. Kontext wird aktualisiert
  9. Nächster Zyklus startet (→ Schritt 5)
  Dauer: Sekunden bis Minuten

Phase 3: COMPLETION
─────────────────────────────────────────────────
  10. Letzte Antwort empfangen
  11. Session wird finalisiert
  12. Historie wird gespeichert
  13. Status → DONE
  Dauer: < 1s

Phase 4: ARCHIVE (optional)
─────────────────────────────────────────────────
  14. Session-Daten werden archiviert (nach 24h)
  15. Datenbank-Eintrag wird komprimiert
  16. Logs werden rotiert
  Dauer: asynchron
```

### 4.2 Lebenszyklus-Diagramm

```
INIT ──→ RUNNING ──→ WAITING ──→ RUNNING ──→ WAITING ──→ ... ──→ DONE
          │            │            │                        │
          │            ├──→ STUCK──→│                        │
          │            │     │      │                        │
          │            │     └──→ ERROR ──→ DONE             │
          │            │              │                      │
          │            └──→ ERROR ────┘                      │
          │                                                  │
          └──────────────────────────────────────────────────┘
```

### 4.3 Timeout-Konfiguration

| Parameter | Default | Min | Max | Beschreibung |
|-----------|---------|-----|-----|-------------|
| `response_timeout` | 30s | 5s | 300s | Max. Wartezeit auf Goose-Antwort |
| `session_timeout` | 24h | 1h | 72h | Maximale Session-Dauer |
| `idle_timeout` | 30min | 5min | 120min | Max. Inaktivität (WAITING) |
| `retry_delay` | 1s | 0.5s | 10s | Basis-Verzögerung zwischen Retries |
| `retry_max_attempts` | 3 | 1 | 10 | Maximale Retry-Versuche |

---

## 5. Fehlerbehandlung

### 5.1 Fehlerkategorien

| Kategorie | Beispiele | Auswirkung | Reaktion |
|-----------|----------|-----------|----------|
| **Netzwerkfehler** | ConnectionError, Timeout, DNS-Fehler | Session → STUCK | Automatischer Retry (R06) |
| **Inhaltsfehler** | Policy-REJECT, ungültiges Format | Session → ERROR | Kein Retry, manuelle Analyse |
| **Systemfehler** | Speicher voll, DB-Error, OOM | Session → ERROR | Admin-Alert, System-Check |
| **Goose-Fehler** | CLI-Absturz, ungültige Antwort | Session → STUCK | Retry + Protokollierung |
| **Konfigurationsfehler** | Fehlende Umgebungsvariablen | Session → ERROR | Kein Start, Log-Eintrag |

### 5.2 Fehlerbehandlungs-Matrix

```
                    ┌──────────────────────────────────────────────┐
                    │              Fehler tritt auf               │
                    └──────────────────┬───────────────────────────┘
                                       ▼
                    ┌──────────────────────────────────────────────┐
                    │         Fehler kategorisieren                │
                    └──────┬──────────┬──────────┬────────────────┘
                           │          │          │
                           ▼          ▼          ▼
                    ┌──────────┐ ┌──────────┐ ┌──────────┐
                    │Netzwerk  │ │ Inhalt   │ │ System   │
                    └────┬─────┘ └────┬─────┘ └────┬─────┘
                         │            │             │
                         ▼            ▼             ▼
                    ┌──────────┐ ┌──────────┐ ┌──────────────┐
                    │ Retry    │ │ DONE     │ │ Admin-Alert  │
                    │ (max 3×) │ │ + Log    │ │ + Log        │
                    └────┬─────┘ └──────────┘ └──────┬───────┘
                         │                            │
                    ┌────┴────┐                      │
                    │         │                      │
                    ▼         ▼                      │
               ┌────────┐ ┌────────┐                 │
               │ Erfolg │ │ Fehler │                 │
               │→RUNNING│ │→ERROR  │                 │
               └────────┘ └────┬───┘                 │
                               │                     │
                               └─────────────────────┘
                                         │
                                         ▼
                                   ┌──────────┐
                                   │ DONE     │
                                   │ (final)  │
                                   └──────────┘
```

### 5.3 Fehler-Logging

Jeder Fehler wird strukturiert geloggt:

```json
{
  "timestamp": "2026-06-10T19:00:00.000Z",
  "level": "ERROR",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "error_type": "NETWORK_TIMEOUT",
  "message": "Antwort von Goose-CLI nach 30s nicht empfangen",
  "retry_count": 1,
  "max_retries": 3,
  "stacktrace": "...",
  "context": {
    "last_status": "WAITING",
    "duration_sec": 30.5,
    "attempted_action": "receive_response"
  }
}
```

### 5.4 Eskalationsstufen

| Stufe | Bedingung | Aktion | Verantwortlich |
|-------|-----------|--------|---------------|
| **INFO** | Einzelfehler, automatisch behoben | Keine Aktion nötig | System |
| **WARNING** | 3+ Fehler in 5 Minuten | Log-Eintrag + Metrik | System |
| **ERROR** | Session → ERROR | Admin-Benachrichtigung (E-Mail) | Admin |
| **CRITICAL** | Systemweiter Fehler (>50% Sessions betroffen) | PagerDuty-Alarm | Team-Lead |

### 5.5 Fehlerprävention

- **Pre-Checks:** Vor jeder Sendung prüft das Policy Gate alle Bedingungen
- **Graceful Degradation:** Bei Systemfehlern werden Sessions pausiert, nicht abgebrochen
- **Rate-Limiting:** Max. 10 Nachrichten pro Minute pro Session
- **Health-Checks:** Alle 60s wird die Goose-CLI-Verbindung geprüft
- **Circuit Breaker:** Bei 5 Fehlern in Folge wird die Verbindung für 60s unterbrochen

---

## 6. Versionshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-10 | NeXify Dev | Initiale Version |

---

*Ende des Dokuments GOOSE_AUTO_CHAT_SESSION_RULES.md*  
*Audit-Pflicht: Dieses Dokument unterliegt der Audit-Pflicht gemäß NeXify QM-Richtlinie QM-007.*
