# Goose User-Chat Driver – Architektur

| Feld | Wert |
|------|------|
| **Dokument** | GOOSE_USER_CHAT_DRIVER_ARCHITECTURE.md |
| **Version** | 1.0.0 |
| **Sprache** | Deutsch |
| **Audit-Pflicht** | Ja |
| **Letzte Änderung** | 2026-06-10 |

---

## 1. Zweck

Der Goose User-Chat Driver (GUCD) führt den Goose CLI Chat automatisch. Er überbrückt die Lücke zwischen dem NeXify-Dispatcher (Ebene A – Hermes/Workstation) und der Goose CLI (Ebene B), sodass Pascal keine manuellen Eingaben in der Goose CLI tätigen muss.

Der Driver ist kein CLI-Ersatz, sondern ein **autonomer Chat-Controller** – er beobachtet, entscheidet und injiziert Nachrichten gemäss Policy.

---

## 2. 2-Ebenen-Architektur

```
┌──────────────────────────────────────────────────┐
│  Ebene A – Hermes / Workstation                   │
│  (Dispatcher, Kanban, AgentMemory, Evidence)      │
│                                                    │
│  ContextLoader → PolicyGate → UserMessageBuilder   │
│              ↕                    ↕               │
│         LoopGuard ↔ Config (Rate-Limits)          │
│              ↕                                    │
│         Injector → Observer                       │
└──────────────────────┬───────────────────────────┘
                       │ CLI-Injektion (send-keys)
                       ▼
┌──────────────────────────────────────────────────┐
│  Ebene B – Goose CLI (tmux/screen)                │
│  (Chat-Session, Output, Status)                   │
└──────────────────────────────────────────────────┘
```

### Ebene A: Steuerungsebene
- Läuft als Subprozess des NeXify-Dispatchers
- Hat vollen Zugriff auf AgentMemory, Kanban, Evidence
- Entscheidet **ob**, **wann** und **was** injiziert wird

### Ebene B: Ausführungsebene
- Goose CLI läuft in tmux/screen-Session
- Kein direkter Zugriff auf NeXify – nur CLI-Standardprotokoll
- Output wird von Ebene A beobachtet und analysiert

---

## 3. Komponenten

### 3.1 `session_watcher`
- Überwacht laufende Goose CLI Sessions (tmux/screen/polling)
- Erkennt Status: `RUNNING`, `WAITING`, `INJECTED`, `BLOCKED`, `DONE`, `ERROR`
- Publiziert Statusänderungen an den Dispatcher

### 3.2 `user_chat_driver`
- Hauptlogik: Entscheidet über Injektion von Chat-Nachrichten
- Ruft PolicyGate vor jeder Injektion auf
- Delegiert an LoopGuard für Rate-Limiting-Checks

### 3.3 `cli_injector`
- Führt die tatsächliche Injektion durch (tmux `send-keys`, pty write, etc.)
- Protokolliert jede Injektion mit Timestamp und Payload
- Keine direkte Ausgabe – Output wird via Observer erfasst

### 3.4 `output_observer`
- Beobachtet CLI-Output in Echtzeit
- Extrahiert Status, Fehler, Prompts
- Speist Ergebnisse in LoopGuard und PolicyGate zurück

### 3.5 `loop_guard`
- Zentrale Sicherheitskomponente für Rate-Limiting
- Blockiert Injektionen bei:
  - Rate-Limit-Überschreitung (3/Min, 5/h, 3× gleicher Grund)
  - Aktiver Verarbeitung (keine Injection bei laufender Ausgabe)
  - Gleicher letzter Message (Duplikat-Verbot)
  - Driver-Status OFF/PAUSED
- Automatic Unblock nach 30 Minuten
- Siehe [GOOSE_LOOP_GUARD_RULES.md](./GOOSE_LOOP_GUARD_RULES.md)

### 3.6 `config`
- YAML-basierte Konfiguration
- Alle Rate-Limits, Timeouts, Pfade, Secrets
- Wird beim Start geladen und validiert

---

## 4. Datenfluss

```
ContextLoader
    │
    ▼
PolicyGate ───→ Wer darf was? → BLOCKED/ALLOWED
    │
    ▼
UserMessageBuilder ───→ Baut Chat-Nachricht (Prefix-Pflicht)
    │
    ▼
LoopGuard ───→ Rate-Limit-Check → DELAY/BLOCK/PASS
    │
    ▼
Injector ───→ tmux send-keys / pty write
    │
    ▼
Observer ───→ Liest Output → Status-Updates
    │
    └──→ Zurück zu ContextLoader (Zyklus)
```

**Zyklus-Parameter:**
- Poll-Intervall: 2 Sekunden (konfigurierbar)
- Maximal 1 Injektion pro Durchlauf
- Timeout pro Injektion: 30 Sekunden

---

## 5. Sicherheitsarchitektur

### 5.1 Prefix-Pflicht
Jede injizierte Nachricht MUSS mit einem Prefix beginnen, der die Nachricht als automatisch generiert kennzeichnet.
- Prefix: `[GUCD]` oder `[Auto]`
- Ohne Prefix → Injektion wird von PolicyGate blockiert
- Prefix ist in Config definiert und änderbar

### 5.2 Secret-Sanitization
- Secrets (API-Keys, Tokens, Passwörter) werden NIEMALS in Chat-Nachrichten injiziert
- Secrets werden vor dem Injection-String entfernt
- Erkennung via Pattern-Matching (Config-definierte Patterns)
- Bei Fund: Log-Eintrag + Injektion blockiert

### 5.3 Keine Pascal-Imitation
- Der Driver imitiert NIEMALS Pascal's Schreibstil
- Nachrichten sind als maschinengeneriert erkennbar
- Keine persönlichen Floskeln, Grussformeln oder Emojis, die Pascal imitieren könnten
- Jede Nachricht enthält einen maschinenlesbaren Header

### 5.4 Loop-Guard-Sicherheit
- Hard Limit: 3 Injektionen pro Minute
- Hard Limit: 5 Injektionen pro Stunde
- Hard Limit: 3× gleicher Injektionsgrund → Block
- Automatic Unblock nach 30 Minuten
- Keine Injektion bei `RUNNING`-Status (aktive Verarbeitung)

---

## 6. Integration mit NeXify-System

### 6.1 AgentMemory
- Driver speichert Injektions-Historie in AgentMemory
- ContextLoader holt relevante Kontexte aus AgentMemory
- Format: `gucd::{session_id}::{timestamp}`

### 6.2 Dispatcher
- Driver registriert sich als Subprozess im Dispatcher
- Status-Updates via Dispatcher-Event-System
- Kill-Switch via Dispatcher bei kritischen Fehlern

### 6.3 Kanban
- Injektionen erzeugen Kanban-Einträge (Typ: `auto_chat`)
- Status visualisiert im Kanban-Board
- Manuelles Override via Kanban möglich

### 6.4 Evidence
- Jede Injektion wird als Evidence-Entry gespeichert
- Format: [GOOSE_USER_CHAT_DRIVER_START_EVIDENCE.md](../../10_evidence/goose_auto_chat/GOOSE_USER_CHAT_DRIVER_START_EVIDENCE.md)
- Evidence-Pfad für Audit-Zwecke

---

## 7. Audit & Logging

- Jede Aktion wird mit ISO-8601-Timestamp geloggt
- Log-Level: DEBUG, INFO, WARN, ERROR, FATAL
- Log-Ziel: `syslog` + Datei unter `/workspace/nexify/09_dispatcher/logs/`
- Evidence-Dokumente werden bei jedem Meilenstein aktualisiert
- Audit-Pflicht bedeutet: Alle Entscheidungen müssen nachvollziehbar sein

---

## 8. Deployment

| Phase | Beschreibung | Status |
|-------|-------------|--------|
| Dry-Run | Module erstellt, Logik getestet | ✅ DONE |
| Test-Injection | Erste Injektion in WAITING-Session | 🔜 NÄCHSTE |
| Beobachtung | Output-Observer aktiv | 📋 GEPLANT |
| 24h-Nachweis | 24 Stunden stabiler Betrieb | 📋 GEPLANT |
| Produktion | Volle Freigabe | 📋 GEPLANT |

---

*Ende des Architektur-Dokuments. Version 1.0.0 – Audit-konform.*
