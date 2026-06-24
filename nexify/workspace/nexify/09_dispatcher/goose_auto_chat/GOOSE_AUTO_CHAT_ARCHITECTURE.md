# GOOSE_AUTO_CHAT Architektur

**Dokument:** GOOSE_AUTO_CHAT_ARCHITECTURE.md  
**Version:** 1.0.0  
**Status:** Freigegeben  
**Stand:** 2026-06-10  
**Audit-Pflicht:** JA — Jede Änderung an diesem Dokument muss auditiert und versioniert werden.

---

## Inhaltsverzeichnis

1. [Systemübersicht](#1-systemübersicht)
2. [Data Flow](#2-data-flow)
3. [2-Ebenen-Architektur](#3-2-ebenen-architektur)
4. [Technische Komponentenbeschreibung](#4-technische-komponentenbeschreibung)
5. [Sicherheitsarchitektur](#5-sicherheitsarchitektur)
6. [Abhängigkeiten zu bestehenden NeXify-Komponenten](#6-abhängigkeiten-zu-bestehenden-nexify-komponenten)

---

## 1. Systemübersicht

### 1.1 Komponentendiagramm

```
┌────────────────────────────────────────────────────────────────────┐
│                        GOOSE AUTO CHAT                             │
│                         Orchestrator                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │  Context      │   │  Policy      │   │  Message              │   │
│  │  Collector   │──▶│  Gate        │──▶│  Builder              │   │
│  └──────────────┘   └──────────────┘   └──────────┬───────────┘   │
│                                                    │               │
│                                                    ▼               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │  Observer     │◀──│  Injector    │◀──│  Goose-CLI            │   │
│  │  (Feedback)  │   │  (Send)     │   │  Interface            │   │
│  └──────────────┘   └──────────────┘   └──────────────────────┘   │
│                                                    │               │
│                                                    ▼               │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   Session Manager (SQLite)                  │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐ │   │
│  │  │ RUNNING │ │ WAITING │ │ STUCK   │ │ DONE    │ │ERROR│ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────┘ │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              GOOSE_USER_CHAT_DRIVER_* Switch               │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │   │
│  │  │IDLE  │ │INIT  │ │ACTIVE│ │PAUSED│ │STOP  │ │ERROR │   │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architekturprinzipien

- **Trennung von Steuerung und Ausführung** — Der Orchestrator steuert, die Goose-CLI führt aus.
- **Zustandsbehaftete Sessions** — Jede Session wird über einen vollständigen Lebenszyklus verfolgt.
- **Policies als Gate** — Keine Nachricht passiert das System ohne Policy-Prüfung.
- **Observe, don't guess** — Der Observer sammelt echte Rückmeldungen, keine Annahmen.

---

## 2. Data Flow

### 2.1 Hauptdatenfluss (vollständiger Zyklus)

```
[Kontext sammeln]                  → [Policy Gate]
       │                                      │
       ▼                                      ▼
  System-Info,                         Prüfung: Darf die
  letzte Antwort,                      Nachricht gesendet
  Historie                             werden?
       │                                      │
       │                                      ▼
       │                              [Message Builder]
       │                                      │
       │                                      ▼
       │                              Prompt zusammenbauen
       │                              (Kontext + Anweisung)
       │                                      │
       │                                      ▼
       │                              [Injector → Goose-CLI]
       │                                      │
       │                                      ▼
       │                              [Observer]
       │                                      │
       ▼                                      ▼
  Nächster Zyklus ◀────────────────── Rückmeldung auswerten
```

### 2.2 Data Flow im Detail

| Schritt | Komponente | Beschreibung | Eingabe | Ausgabe |
|---------|-----------|-------------|---------|---------|
| 1 | Context Collector | Sammelt relevanten Kontext | Session-ID, Umgebungsvariablen | Kontext-Objekt (JSON) |
| 2 | Policy Gate | Validiert und autorisiert | Kontext-Objekt | Genehmigtes Kontext-Objekt oder REJECTED |
| 3 | Message Builder | Erzeugt Goose-kompatiblen Prompt | Genehmigter Kontext + Template | Fertige Nachricht (String) |
| 4 | Injector | Sendet Nachricht an Goose-CLI | Nachricht + Session-Config | Sendestatus (OK/FAIL) |
| 5 | Observer | Empfängt und analysiert Antwort | Raw-Antwort von Goose-CLI | Strukturiertes Feedback |
| 6 | Session Manager | Aktualisiert Session-State | Feedback + Session-ID | Neuer Status (SQLite) |

### 2.3 Fehlerfluss

```
[Injector FAIL] ──▶ [Session Manager] ──▶ Status = ERROR
                         │
                         ▼
                  [Retry-Entscheidung]
                         │
               ┌─────────┴──────────┐
               ▼                    ▼
          Retry möglich        Kein Retry
               │                    │
               ▼                    ▼
          [Injector]          [Alert + Log]
```

---

## 3. 2-Ebenen-Architektur

### 3.1 Ebene A: Hermes / Workstation (Steuerungsebene)

| Aspekt | Beschreibung |
|--------|-------------|
| **Rolle** | Strategische Steuerung, Policy-Entscheidungen, Monitoring |
| **Ausführung** | Läuft auf Hermes (Workstation) als persistenter Service |
| **Komponenten** | Policy Gate, Context Collector (Management), Observer UI |
| **Datenhaltung** | SQLite-Datenbank mit allen Sessions (zentral) |
| **Netzwerk** | Verbindung zu Ebene B über gesicherten Kanal (TLS/mTLS) |
| **Verantwortung** | Entscheidet **ob**, **wann** und **wie** eine Nachricht gesendet wird |
| **Hochverfügbarkeit** | Single-Instance (Workstation), Wiederanlauf bei Crash |

### 3.2 Ebene B: Goose CLI (Ausführungsebene)

| Aspekt | Beschreibung |
|--------|-------------|
| **Rolle** | Technische Ausführung, Message-Injection, Antwort-Rückgabe |
| **Ausführung** | 1× Goose CLI Auto-Chat Instanz pro verwalteter Umgebung |
| **Komponenten** | Injector, Context Collector (technisch), Observer (Raw) |
| **Datenhaltung** | Keine persistente Datenhaltung — nur transienter Puffer |
| **Netzwerk** | Lokale Ausführung oder via SSH auf Zielsystem |
| **Verantwortung** | Führt die **technische Kommunikation** mit dem Zielsystem durch |
| **Skalierung** | 1:1 mit verwalteten Umgebungen |

### 3.3 Kommunikation zwischen Ebene A und Ebene B

```
Ebene A (Hermes)
┌──────────────────────┐
│  Policy Gate         │
│  Session Manager     │
│  Observer (UI)       │
└─────────┬────────────┘
          │ TLS/mTLS
          ▼
Ebene B (Goose CLI - Ziel-Umgebung)
┌──────────────────────┐
│  Injector            │
│  Goose CLI Auto Chat │
│  Observer (Raw)      │
└──────────────────────┘
```

### 3.4 Entscheidungsmatrix: Welche Ebene macht was?

| Aufgabe | Ebene A | Ebene B |
|---------|---------|---------|
| Session anlegen | ✅ | ❌ |
| Policy-Prüfung | ✅ | ❌ |
| Nachricht senden | ❌ | ✅ |
| Antwort empfangen | ❌ | ✅ |
| Antwort auswerten | ✅ | ❌ |
| Status speichern | ✅ | ❌ |
| Alarme auslösen | ✅ | ❌ |
| Kontext sammeln (Management) | ✅ | ❌ |
| Kontext sammeln (technisch) | ❌ | ✅ |
| Retry-Entscheidung | ✅ | ❌ |
| Notfall-Stopp | ✅ | ✅ (nachrangig) |

---

## 4. Technische Komponentenbeschreibung

### 4.1 Context Collector

- **Typ:** Python Klasse `ContextCollector`
- **Datei:** `src/context_collector.py`
- **Aufgabe:** Sammelt alle relevanten Informationen vor dem Bau einer Nachricht
- **Quellen:**
  - Letzte GPT-Antwort (aus Session-Historie)
  - System-Status (CPU, Memory, Disk via `psutil`)
  - Fehler-Logs der letzten Session
  - Umgebungsvariablen (`GOOSE_*`)
  - Zeitstempel und Session-Dauer
- **Ausgabeformat:**
  ```json
  {
    "session_id": "uuid",
    "last_response": "...",
    "system_status": {"cpu": 45, "memory": 62},
    "errors": [],
    "timestamp": "2026-06-10T19:00:00Z",
    "duration_sec": 3600
  }
  ```

### 4.2 Policy Gate

- **Typ:** Python Klasse `PolicyGate`
- **Datei:** `src/policy_gate.py`
- **Aufgabe:** Validiert, ob eine Nachricht gesendet werden darf
- **Prüfungen:**
  - Rate-Limit (max. N Nachrichten pro Zeitfenster)
  - Content-Filter (keine sensiblen Daten)
  - Session-State (nur bei RUNNING senden)
  - Safety-Guard (Notfall-Stopp nicht aktiv)
  - Loop-Guard (max. identische Nachrichten in Folge)
- **Ausgabeformat:**
  ```json
  {
    "decision": "ALLOW" | "REJECT",
    "reason": "string",
    "checks": {
      "rate_limit": true,
      "content_filter": true,
      "session_state": true,
      "safety_guard": true,
      "loop_guard": true
    }
  }
  ```

### 4.3 Message Builder

- **Typ:** Python Klasse `MessageBuilder`
- **Datei:** `src/message_builder.py`
- **Aufgabe:** Baut eine Goose-kompatible Nachricht aus Kontext und Template
- **Templates:**
  - `standard`: Normale Chat-Nachricht
  - `analysis`: Bitte um Analyse
  - `action`: Handlungsaufforderung
  - `status`: Status-Update an Goose
- **Besonderheiten:**
  - Maximale Nachrichtenlänge (konfigurierbar, Default: 4000 Tokens)
  - Kontext-Compression bei Überschreitung
  - Automatische Escaping von Sonderzeichen
  - Hinzufügen von Metadaten-Header

### 4.4 Injector

- **Typ:** Python Klasse `Injector`
- **Datei:** `src/injector.py`
- **Aufgabe:** Sendet Nachrichten an die Goose-CLI und empfängt Antworten
- **Schnittstelle:** Subprocess (stdin/stdout) oder HTTP-API
- **Methoden:**
  - `send(message)` → Sendet Nachricht
  - `receive(timeout)` → Wartet auf Antwort
  - `cancel()` → Bricht laufende Operation ab
- **Timeout:** Konfigurierbar (Default: 30s), Überschreitung → Status=STUCK
- **Retry-Logik:** 3 Versuche mit exponentiellen Backoff (1s, 2s, 4s)

### 4.5 Observer

- **Typ:** Python Klasse `Observer`
- **Datei:** `src/observer.py`
- **Aufgabe:** Analysiert Antworten und erzeugt strukturiertes Feedback
- **Analysefelder:**
  - `success`: War die Antwort erfolgreich? (bool)
  - `content`: Antworttext
  - `tokens_used`: Token-Anzahl
  - `duration`: Antwortzeit in ms
  - `errors`: Fehlerliste
  - `suggested_action`: Nächster Schritt
- **Feedbacksystem:**
  - Positives Feedback → Session bleibt RUNNING
  - Negatives Feedback → Session wird analysiert (→ STUCK/ERROR)
  - Neutrales Feedback → Session bleibt WAITING

### 4.6 Session Manager

- **Typ:** Python Klasse `SessionManager`
- **Datei:** `src/session_manager.py`
- **Datenbank:** SQLite (`data/sessions.db`)
- **Schema:**
  ```sql
  CREATE TABLE sessions (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'RUNNING',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      context_json TEXT,
      history TEXT,
      error_count INTEGER DEFAULT 0,
      max_errors INTEGER DEFAULT 5
  );
  ```
- **Methoden:**
  - `create_session()` → Legt neue Session an
  - `get_session(id)` → Liefert Session-Objekt
  - `update_status(id, status, reason)` → Aktualisiert Status
  - `recover_session(id)` → Versucht Wiederherstellung

---

## 5. Sicherheitsarchitektur

### 5.1 Kommunikationssicherheit

| Bereich | Maßnahme |
|---------|----------|
| Ebene A ↔ B | TLS 1.3, gegenseitige Authentifizierung (mTLS) |
| SQLite-Datenbank | Dateiberechtigungen (0600), kein Netzwerkzugriff |
| Kontext-Daten | Keine Passwörter, Secrets nur via Environment-Variablen |
| Logging | Keine sensiblen Daten in Logs (Filter aktiv) |

### 5.2 Zugriffskontrolle

- **Policy Gate** ist der einzige Einstiegspunkt für ausgehende Nachrichten
- **Kontext-Zugriff** nur für autorisierte Komponenten (Context Collector, Message Builder)
- **Session-Daten** sind nicht von außen zugänglich (außer Hermes-Admin-UI)
- **Goose-CLI** hat keine direkte Datenbankverbindung

### 5.3 Audit-Trail

- Jede Statusänderung wird mit Zeitstempel und Grund geloggt
- Jede Policy-Entscheidung (ALLOW/REJECT) wird dokumentiert
- Jeder Fehler wird mit Stacktrace in der Session gespeichert
- Log-Retention: 90 Tage, dann Rotation

### 5.4 Notfall-Mechanismen

- **Kill-Switch:** `GOOSE_USER_CHAT_DRIVER_KILL_SWITCH` → sofortiger Stop aller aktiven Sessions
- **Rate-Limit-Override:** Nur via Hermes-Admin-Konsole
- **Force-Stop:** Überschreibt alle Policy-Prüfungen, stoppt sofort

---

## 6. Abhängigkeiten zu bestehenden NeXify-Komponenten

### 6.1 Direkte Abhängigkeiten

| NeXify-Komponente | Art der Abhängigkeit | Kritikalität |
|-------------------|---------------------|-------------|
| `02_hermes_core` | Hermes-API für Context Collector (System-Status) | Hoch |
| `03_domain_model` | Session-Datenstruktur, Policy-Definitionen | Hoch |
| `05_workstation` | Deployment-Ziel für Ebene A | Mittel |
| `07_monitoring` | Metrik-Export für Observer-Daten | Mittel |
| `08_security` | TLS-Konfiguration, mTLS-Zertifikate | Hoch |

### 6.2 Indirekte Abhängigkeiten

| NeXify-Komponente | Beschreibung | Kritikalität |
|-------------------|-------------|-------------|
| `01_infrastructure` | Netzwerk-Routing zwischen Ebenen | Mittel |
| `04_domain_services` | Policy-Templates (werden wiederverwendet) | Niedrig |
| `06_deployment` | CI/CD-Pipelines für Deployment | Niedrig |

### 6.3 Datenformate / Schnittstellen

- **Context-Objekt:** JSON, kompatibel mit `02_hermes_core` Context-Schema
- **Session-ID:** UUID v4, Format gemäß `03_domain_model` Session-Definition
- **Policy-Entscheidungen:** Enum, definiert in `03_domain_model/policy.py`
- **Log-Format:** Strukturiertes JSON, kompatibel mit `07_monitoring` Log-Aggregator
- **Metriken:** Prometheus-Format, via `07_monitoring/metrics` Endpunkt

### 6.4 Deployment-Matrix

```
┌──────────────────┬──────────────────────┬──────────────────────┐
│ Komponente       │ Ebene A (Hermes)     │ Ebene B (Zielsystem)│
├──────────────────┼──────────────────────┼──────────────────────┤
│ Context Collector│ Management-Variant   │ Technische-Variant  │
│ Policy Gate      │ Vollständig          │ Nicht vorhanden     │
│ Message Builder  │ Vollständig          │ Nicht vorhanden     │
│ Injector         │ Nicht vorhanden      │ Vollständig         │
│ Observer         │ UI + Analyse         │ Raw-Collector       │
│ Session Manager  │ Vollständig          │ Nicht vorhanden     │
└──────────────────┴──────────────────────┴──────────────────────┘
```

---

## 7. Versionshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-10 | NeXify Dev | Initiale Version |

---

*Ende des Dokuments GOOSE_AUTO_CHAT_ARCHITECTURE.md*  
*Audit-Pflicht: Dieses Dokument unterliegt der Audit-Pflicht gemäß NeXify QM-Richtlinie QM-007.*
