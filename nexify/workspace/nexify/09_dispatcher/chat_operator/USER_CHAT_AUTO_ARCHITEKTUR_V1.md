# USER-CHAT-AUTO-ARCHITEKTUR V1

---
**Titel:** User Chat Auto Architecture — Auto-Button & USER-Message-Injection  
**Status:** RELEASED  
**Version:** 1.0.0  
**Datum:** 2026-06-10  
**Klassifikation:** INTERNAL — NEXIFY CORE  
**Owner:** Dispatcher Team — Chat Operator  
---

## 1. Architekturprinzip

Der **USER-Chat-Driver** ist ein automatischer Injektor, der innerhalb des Nexify-Chat-Systems 
als echter User auftritt. Kernprinzip: **Ein sichtbarer Button "Auto: Ein/Aus"** im Chat steuert, 
ob der Agent selbstständig die nächste USER-Message erzeugt und als echte User-Nachricht 
(kein Assistant, kein System) in den Chatverlauf injiziert.

```
┌───────────────────────────────────────────────────────────┐
│                        Chat UI                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Pascal]  Hey, analysiere das Log von heute.      │  │
│  │  [System]  *denkt nach*                             │  │
│  │  [Nexify]  Hier ist die Analyse: ...                │  │
│  │  [FORTSETZUNG — Automatisch fuer Pascal erzeugt]   │  │
│  │  ───────────────────────────────────────────────── │  │
│  │  > Jetzt extrahiere die Fehler und gruppiere sie.   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  [ 🔄 Auto: Ein ]  │  [💬 Nachricht senden]             │
└───────────────────────────────────────────────────────────┘
```

### 1.1 Kennzeichnungspflicht

Jede automatisch erzeugte USER-Message MUSS mit dem Prefix beginnen:

```
[ FORTSETZUNG — Automatisch fuer Pascal erzeugt ]
```

Dies erfüllt:
- **Transparenz** — Pascal sieht sofort, dass die Nachricht nicht von ihm stammt
- **Auditierbarkeit** — Jede Auto-Nachricht ist eindeutig identifizierbar
- **Revidierbarkeit** — Pascal kann Auto-Nachrichten löschen/überschreiben
- **Trennung** — Klare Unterscheidung zu echten User-Nachrichten

### 1.2 Nachrichten-Definition

Eine Auto-generierte USER-Message im System:

```typescript
interface AutoUserMessage {
  role: "user";                         // Echte USER-Rolle
  content: string;                       // Beginnt mit Prefix
  metadata: {
    source: "auto_driver";               // Herkunftskennzeichnung
    auto_version: "1.0.0";
    session_id: string;
    loop_guard_id: string;
    policy_gate_result: string;
    original_trigger: string;            // Was hat die Auto-Generierung ausgelöst?
    correlation_id: string;              // Für Backtracking
    state_at_injection: UserChatDriverState;
    injected_at: ISO8601;
  };
}
```

### 1.3 System-Grenzen

- Auto injiziert **NIE** als System oder Assistant — nur als USER
- Auto überschreibt **NIE** echte User-Nachrichten
- Auto deaktiviert sich bei **manual_pascal_override**
- Jede Auto-Injektion durchläuft **Loop Guard** und **Policy Gate**

---

## 2. Der Auto-Schalter (Button)

### 2.1 UI-Definition

```
┌────────────────────────────────────────────┐
│ [ 🔄 Auto: Ein ]    [ 💬 Nachricht senden ] │
│ [ 🔄 Auto: Aus ]                           │
│ [ 🔄 Auto: Sessions ]                      │
│ [ ⏸️ Auto: Pausiert ]                      │
│ [ 🚫 Auto: Blockiert ]                     │
│ [ 🔍 Auto: Review ]                        │
│ [ ⚠️ Auto: Error]                          │
└────────────────────────────────────────────┘
```

### 2.2 Button-Zustandsübergänge

| Von → Nach | Auslöser | Effekt |
|---|---|---|
| OFF → ON | User klickt / Startup | Auto aktiv für alle Sessions |
| ON → OFF | User klickt | Auto deaktiviert |
| ON → AUTO_SESSIONS_ONLY | System (Regel) | Nur Auto-Session-Typen |
| ON → PAUSED | Confidence < Threshold | Pause, kein neuer Lauf |
| ON → BLOCKED | Loop Guard 3x / Critical | Keine Auto-Injektion |
| ON → REVIEW_REQUIRED | Grenzwertiger Fall | Vorlage zur Prüfung |
| ANY → ERROR | Systemfehler | Fehlerzustand |
| PAUSED → ON | Timeout abgelaufen | Automatische Reaktivierung |

### 2.3 Persistenz

Der Auto-Schalter-Zustand wird persistiert in:

```json
{
  "auto_button": {
    "state": "ON",
    "last_changed": "2026-06-10T18:30:00Z",
    "changed_by": "pascal|system",
    "reason": "user_action|session_rule|error_recovery",
    "auto_sessions_only_whitelist": ["session_abc", "session_def"],
    "pause_until": null | ISO8601
  }
}
```

---

## 3. Zustandsmaschine (6 Stufen + 1)

```
                            ┌─────────┐
                            │  ERROR  │
                            └────┬────┘
                                 │ recovery
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
      ┌──────────┐        ┌─────────────┐       ┌────────────┐
      │   OFF    │◄───────│   ON        │──────►│ AUTO_ONLY  │
      └──────────┘        └──────┬──────┘       └────────────┘
              ▲                  │     ▲                │
              │                  │     │                │
              │           ┌──────▼─────┴──┐             │
              │           │   PAUSED      │             │
              │           └──────┬────────┘             │
              │                  │                      │
              │           ┌──────▼────────┐             │
              │           │   BLOCKED     │             │
              │           └──────┬────────┘             │
              │                  │                      │
              │           ┌──────▼────────────┐         │
              │           │ REVIEW_REQUIRED   │◄────────┘
              │           └───────────────────┘
              │
              └─────────────────────────────────────────
                      OFF schaltet alles aus
```

### 3.1 Zustandsbeschreibungen

| State | Code | Beschreibung | Auto-Injektion | User-Korrektur |
|---|---|---|---|---|
| **OFF** | `USER_CHAT_DRIVER_OFF` | Auto komplett deaktiviert | Nie | Normal |
| **ON** | `USER_CHAT_DRIVER_ON` | Vollautomatisch aktiv | ✅ Ja | Überschreibt Auto |
| **AUTO_SESSIONS_ONLY** | `USER_CHAT_DRIVER_AUTO_SESSIONS_ONLY` | Nur in markierten Sessions | ✅ Ja (whitelist) | Überschreibt Auto |
| **PAUSED** | `USER_CHAT_DRIVER_PAUSED` | Temporär pausiert | ❌ Nein (Timer) | Normal |
| **BLOCKED** | `USER_CHAT_DRIVER_BLOCKED` | Von Loop Guard blockiert | ❌ Nein | Manuelle Freigabe |
| **REVIEW_REQUIRED** | `USER_CHAT_DRIVER_REVIEW_REQUIRED` | Vorlage zur Prüfung | ❌ Nein (vorlegen) | Bestätigung nötig |
| **ERROR** | `USER_CHAT_DRIVER_ERROR` | Systemfehler | ❌ Nie | Recovery nötig |

### 3.2 State Transition Table

```python
TRANSITIONS = {
    OFF:                [ON],
    ON:                 [OFF, AUTO_SESSIONS_ONLY, PAUSED, BLOCKED, REVIEW_REQUIRED, ERROR],
    AUTO_SESSIONS_ONLY: [ON, OFF, PAUSED, BLOCKED, REVIEW_REQUIRED, ERROR],
    PAUSED:             [ON, OFF, BLOCKED, ERROR],
    BLOCKED:            [ON, OFF, ERROR],  # Nur manuelle Freigabe
    REVIEW_REQUIRED:    [ON, OFF, BLOCKED, ERROR],  # Nach manueller Prüfung
    ERROR:              [ON, OFF],  # Recovery
}
```

---

## 4. Datenfluss: Auto-Injektion

### 4.1 Sequenz (vereinfacht)

```
┌──────────┐    ┌──────────────┐    ┌───────────┐    ┌──────────┐
│ Chat End │───►│ Chat Operator │───►│Loop Guard │───►│Policy Gate│
└──────────┘    └──────────────┘    └───────────┘    └──────────┘
                      │                                     │
                      │        ┌──────────────────┐         │
                      │        │  Generate Message │◄────────┘
                      │        └────────┬─────────┘
                      │                 │
                      │        ┌────────▼─────────┐
                      │        │  Inject as USER   │
                      │        └────────┬─────────┘
                      │                 │
                      │        ┌────────▼─────────┐
                      │        │  Save to Session  │
                      │        └────────┬─────────┘
                      │                 │
                      │        ┌────────▼─────────┐
                      │        │  Trigger Hermes   │
                      │        │  Chat Run         │
                      │        └────────┬─────────┘
                      │                 │
                      │        ┌────────▼─────────┐
                      │        │  Write Evidence   │
                      │        └──────────────────┘
```

### 4.2 Architektur-Schichten

```
┌──────────────────────────────────────────────────────────────┐
│ Layer 4: Chat UI                                             │
│ - Auto-Button (Ein/Aus/Sessions/Pausiert/Blockiert/Review)   │
│ - Anzeige der Auto-Statusleiste                              │
│ - User-Korrektur-Eingriff möglich                            │
├──────────────────────────────────────────────────────────────┤
│ Layer 3: Chat Operator                                       │
│ - agent:end-Hook abfangen                                    │
│ - Session-Regeln prüfen                                      │
│ - Auto-Schalter prüfen                                       │
│ - Loop Guard aufrufen                                        │
│ - Policy Gate aufrufen                                       │
│ - Message generieren                                         │
│ - Message injizieren                                         │
├──────────────────────────────────────────────────────────────┤
│ Layer 2: Loop Guard & Policy Gate                            │
│ - Loop Guard: Rate-Limit, Hash-Check, Fortschritt            │
│ - Policy Gate: Session-Typ, Confidence, Kontext              │
│ - Evidence pro Entscheidung                                  │
├──────────────────────────────────────────────────────────────┤
│ Layer 1: Storage & Session                                   │
│ - Session-Speicher                                           │
│ - agentmemory                                               │
│ - Kanban                                                     │
│ - Evidence-Store                                             │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Security-Aspekte

### 5.1 Injection Security

- **Keine Rechteausweitung** — Auto-Nachricht hat User-Rechte
- **Keine System-Commands** — Content wird vor Injection gescannt
- **Session-Isolation** — Nur die aktuelle Session wird beeinflusst
- **Keine Cross-Session-Injection** — Nur eigene Session

### 5.2 Audit-Trail

Jede Auto-Injektion erzeugt:

```json
{
  "audit_entry": {
    "action": "user_message_auto_injection",
    "session_id": "session_xyz",
    "button_state": "ON",
    "loop_guard_result": "PASS",
    "policy_gate_result": "PASS",
    "message_hash": "sha256:abc123",
    "injected_at": "2026-06-10T18:31:00.000Z",
    "original_trigger": "agent:end",
    "agentmemory_before": "hash_prev",
    "agentmemory_after": "hash_new"
  }
}
```

### 5.3 Notbremse

- **manual_pascal_override** — Pascal schreibt selbst → Auto sofort OFF
- **3x Loop-Guard-Block** → Auto → BLOCKED
- **Emergency-Stop** → Alle Auto-Injektionen sofort stoppen

---

## 6. Fehlerbehandlung

| Fehler | Reaktion | State |
|---|---|---|
| Session nicht gefunden | Evidence ERROR, kein Lauf | ON → ON |
| Loop Guard schlägt fehl | Evidence BLOCK, kein Lauf | ON → ON (Zähler +1) |
| Policy Gate schlägt fehl | Evidence DENY, kein Lauf | ON → ON |
| Message-Generierung fehlschlägt | Evidence ERROR | ON → PAUSED |
| Hermes-Chat fehlschlägt | Evidence ERROR | ON → PAUSED |
| Evidence-Schreiben fehlschlägt | Log ERROR, weiter | ON → ON |
| Loop Guard 3x in Folge | Evidence CRITICAL | ON → BLOCKED |
| Kritischer Systemfehler | Notfall-Stopp | ANY → ERROR |

---

## 7. Konfiguration

```yaml
user_chat_driver:
  enabled: true
  default_state: "ON"
  message_prefix: "[ FORTSETZUNG — Automatisch fuer Pascal erzeugt ]"
  max_auto_per_session: 50
  max_auto_per_hour: 15
  pause_duration_seconds: 120
  auto_sessions_only_mode: false
  review_threshold_confidence: 0.6
  emergency_stop: false
  security:
    scan_injection_content: true
    max_message_length: 4000
    require_prefix: true
    audit_all_injections: true
```

---

## 8. Test Kriterien

- [ ] Button zeigt korrekten State an
- [ ] Auto-Nachricht beginnt mit Prefix
- [ ] Loop Guard blockiert bei >1/3min
- [ ] Policy Gate blockiert bei Brainstorming
- [ ] manual_pascal_override deaktiviert Auto
- [ ] State-Transitionen korrekt
- [ ] Evidence wird geschrieben
- [ ] Recovery aus ERROR möglich
- [ ] BLOCKED nur manuell freigebbar
