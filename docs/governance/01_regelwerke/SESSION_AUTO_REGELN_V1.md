# SESSION-AUTO-REGELN V1

---
**Titel:** Session Auto Rules — Erlaubte und blockierte Session-Typen für Auto-Injektion  
**Status:** RELEASED  
**Version:** 1.0.0  
**Datum:** 2026-06-10  
**Klassifikation:** INTERNAL — NEXIFY CORE  
**Abhängigkeit:** CHAT_OPERATOR_SPEC_V1.md, USER_CHAT_AUTO_ARCHITEKTUR_V1.md  
---

## 1. Prinzip

Nicht jede Session ist für automatische USER-Injektionen geeignet.
Die **Session Auto Rules** definieren, welche Session-Typen automatisch fortgesetzt werden dürfen
und welche explizit blockiert sind.

Die Prüfung erfolgt in Step 2 des Chat Operators (`_check_session_rules`) **vor** Loop Guard und Policy Gate.

```
agent:end → SESSION REGELN → Auto-Schalter → Loop Guard → Policy Gate → Generate
                │
          ✅ ALLOW oder ❌ BLOCK
```

---

## 2. Erlaubte Sessions (✅)

### ✅ Auto-Session

| Attribut | Wert |
|---|---|
| Session-Type | `auto` |
| Auto erlaubt | ✅ Ja |
| Begründung | Speziell für automatische Fortsetzung ausgelegt |
| Loop Guard | Aktiv |
| Limit | Standard (1/3min, 5/h) |
| Beispiel | `session.type == "auto_session"` |

### ✅ ToDo-Session

| Attribut | Wert |
|---|---|
| Session-Type | `todo`, `task` |
| Auto erlaubt | ✅ Ja |
| Begründung | Klare Aufgabenstruktur, Fortschritt messbar |
| Loop Guard | Aktiv |
| Limit | Standard + Task-spezifisch |
| Beispiel | `session.type == "todo" && session.has_todo_context` |

### ✅ Auftragsfach-Session

| Attribut | Wert |
|---|---|
| Session-Type | `auftragsfach`, `assignment` |
| Auto erlaubt | ✅ Ja |
| Begründung | Strukturierte Aufträge mit klarem Ziel |
| Loop Guard | Aktiv |
| Limit | Standard |
| Beispiel | `session.type == "auftragsfach"` |

### ✅ Kanban-linked Session

| Attribut | Wert |
|---|---|
| Session-Type | `kanban-linked`, `kanban_task` |
| Auto erlaubt | ✅ Ja |
| Begründung | Session ist an Kanban-Board gebunden → Fortschritt verfolgbar |
| Loop Guard | Aktiv |
| Limit | Standard + Kanban-Limit |
| Beispiel | `session.kanban_board_id != null` |

### ✅ Sleep-Safe-Autopilot

| Attribut | Wert |
|---|---|
| Session-Type | `sleep_safe`, `autopilot` |
| Auto erlaubt | ✅ Ja |
| Begründung | Für nächtliche/autonome Bearbeitung konzipiert |
| Loop Guard | Aktiv |
| Limit | Erweitert (alle 5min, 10/h) |
| Beispiel | `session.features.includes("sleep_safe_autopilot")` |

### ✅ delegated_pascal_writing_allowed

| Attribut | Wert |
|---|---|
| Session-Type | beliebig (mit Flag) |
| Auto erlaubt | ✅ Ja |
| Begründung | Pascal hat explizit delegiert |
| Loop Guard | Aktiv |
| Limit | Standard |
| Prüfung | `session.metadata.delegated_pascal_writing_allowed == true` |

---

## 3. Blockierte Sessions (❌)

### ❌ Brainstorming

| Attribut | Wert |
|---|---|
| Session-Type | `brainstorming`, `idee`, `idea` |
| Auto erlaubt | ❌ Nein |
| Begründung | Brainstorming erfordert echten User-Input, keine künstliche Fortsetzung |
| Konsequenz | Keine Injektion, keine Ausnahme |
| Beispiel | `session.type == "brainstorming"` |

### ❌ Private/unklare Session

| Attribut | Wert |
|---|---|
| Session-Type | `private`, `unknown`, `undefined` |
| Auto erlaubt | ❌ Nein |
| Begründung | Keine klare Klassifikation → kein automatischer Eingriff |
| Konsequenz | Keine Injektion, Evidence WARN |
| Beispiel | `session.type not in allowed_types` |

### ❌ DONE_TRUE

| Attribut | Wert |
|---|---|
| Session-Type | beliebig |
| Status | `done == true` |
| Auto erlaubt | ❌ Nein |
| Begründung | Session ist abgeschlossen — keine weitere Bearbeitung |
| Konsequenz | Keine Injektion, keine Reaktivierung |
| Prüfung | `session.status == "done" \|\| session.done == true` |

### ❌ BLOCKED_APPROVAL

| Attribut | Wert |
|---|---|
| Session-Type | beliebig |
| Status | `blocked_approval`, `waiting_approval` |
| Auto erlaubt | ❌ Nein |
| Begründung | Session wartet auf externe Freigabe — keine Auto-Fortsetzung |
| Konsequenz | Keine Injektion, Evidence INFO |
| Prüfung | `session.status == "blocked_approval"` |

### ❌ active_stream

| Attribut | Wert |
|---|---|
| Session-Type | `stream`, `live` |
| Auto erlaubt | ❌ Nein |
| Begründung | Aktiver Stream/Live-Session — User ist aktiv, keine Auto-Injektion |
| Konsequenz | Keine Injektion |
| Prüfung | `session.has_active_stream == true` |

### ❌ manual_pascal_override

| Attribut | Wert |
|---|---|
| Session-Type | beliebig |
| Flag | `manual_pascal_override` |
| Auto erlaubt | ❌ Nein |
| Begründung | Pascal hat manuell eingegriffen → Auto wird deaktiviert |
| Konsequenz | Auto-Schalter → OFF, keine weitere Auto-Injektion |
| Prüfung | `session.metadata.manual_pascal_override == true` |
| Dauer | Bis Pascal den Override aufhebt oder Session beendet |

---

## 4. Entscheidungsmatrix

```python
SESSION_AUTO_RULES = {
    "allowed_types": {
        "auto_session":           {"allowed": True,  "reason": "auto_session"},
        "auto":                   {"allowed": True,  "reason": "auto_session"},
        "todo":                   {"allowed": True,  "reason": "todo_session"},
        "task":                   {"allowed": True,  "reason": "task_session"},
        "auftragsfach":           {"allowed": True,  "reason": "auftragsfach_session"},
        "assignment":             {"allowed": True,  "reason": "assignment_session"},
        "kanban-linked":          {"allowed": True,  "reason": "kanban_linked_session"},
        "kanban_task":            {"allowed": True,  "reason": "kanban_task_session"},
        "sleep_safe":             {"allowed": True,  "reason": "sleep_safe_session"},
        "autopilot":              {"allowed": True,  "reason": "autopilot_session"},
    },
    "blocked_types": {
        "brainstorming":          {"allowed": False, "reason": "brainstorming_no_auto"},
        "idee":                   {"allowed": False, "reason": "brainstorming_no_auto"},
        "idea":                   {"allowed": False, "reason": "brainstorming_no_auto"},
        "private":                {"allowed": False, "reason": "private_session_no_auto"},
        "unknown":                {"allowed": False, "reason": "unknown_session_type"},
        "undefined":              {"allowed": False, "reason": "undefined_session_type"},
        "stream":                 {"allowed": False, "reason": "active_stream_no_auto"},
        "live":                   {"allowed": False, "reason": "active_stream_no_auto"},
    },
    "status_rules": {
        "done":                   {"allowed": False, "reason": "session_done"},
        "completed":              {"allowed": False, "reason": "session_done"},
        "blocked_approval":       {"allowed": False, "reason": "blocked_approval"},
        "waiting_approval":       {"allowed": False, "reason": "blocked_approval"},
    },
    "flag_rules": {
        "delegated_pascal_writing_allowed":  {"allowed": True,  "reason": "pascal_delegated"},
        "manual_pascal_override":            {"allowed": False, "reason": "pascal_override"},
        "has_active_stream":                 {"allowed": False, "reason": "active_stream"},
    },
}
```

### 4.1 Prüfreihenfolge

```python
async def _check_session_rules(self, session: Session) -> SessionCheckResult:
    """
    Prüft die Session-Regeln in definierter Reihenfolge:
    1. Status-basierte Regeln (hart)
    2. Flag-basierte Regeln (hart)
    3. Typ-basierte Regeln (weich)
    """

    # 1. Prüfe Status (done, blocked_approval)
    if session.status in SESSION_AUTO_RULES["status_rules"]:
        rule = SESSION_AUTO_RULES["status_rules"][session.status]
        return SessionCheckResult(allowed=False, reason=rule["reason"],
                                  session_type=session.type)

    # 2. Prüfe Flags (manual_pascal_override, active_stream)
    for flag, rule in SESSION_AUTO_RULES["flag_rules"].items():
        if getattr(session, flag, False) or \
           session.metadata.get(flag, False):
            return SessionCheckResult(allowed=rule["allowed"],
                                      reason=rule["reason"],
                                      session_type=session.type)

    # 3. Prüfe Session-Typ
    if session.type in SESSION_AUTO_RULES["blocked_types"]:
        rule = SESSION_AUTO_RULES["blocked_types"][session.type]
        return SessionCheckResult(allowed=False, reason=rule["reason"],
                                  session_type=session.type)

    if session.type in SESSION_AUTO_RULES["allowed_types"]:
        rule = SESSION_AUTO_RULES["allowed_types"][session.type]
        return SessionCheckResult(allowed=True, reason=rule["reason"],
                                  session_type=session.type)

    # 4. Fallback: unbekannter Typ → blockiert
    return SessionCheckResult(allowed=False,
                              reason=f"unknown_session_type_{session.type}",
                              session_type=session.type)
```

---

## 5. Regel-Tabelle (Übersicht)

| Session-Typ | Status | Flags | Auto erlaubt | Begründung |
|---|---|---|---|---|
| auto_session | — | — | ✅ | Auto-Session |
| todo/task | — | — | ✅ | Aufgaben-Session |
| auftragsfach | — | — | ✅ | Auftrags-Session |
| kanban-linked | — | — | ✅ | Kanban-gebunden |
| sleep_safe | — | — | ✅ | Autopilot-fähig |
| *beliebig* | — | delegated_writing | ✅ | Pascal hat delegiert |
| brainstorming | — | — | ❌ | Kein künstlicher Input |
| private | — | — | ❌ | Privatsphäre |
| unknown | — | — | ❌ | Nicht klassifiziert |
| *beliebig* | done | — | ❌ | Abgeschlossen |
| *beliebig* | blocked_approval | — | ❌ | Wartet auf Freigabe |
| stream/live | — | active_stream | ❌ | User aktiv |
| *beliebig* | — | manual_override | ❌ | User greift ein |

---

## 6. Sonderfälle

### 6.1 gemischte Sessions

Eine Session kann mehrere Typen kombinieren:

```python
session = {
    "type": "auto_session",
    "metadata": {
        "delegated_pascal_writing_allowed": True
    }
}
# → ✅ Auto erlaubt (beide Regeln erlauben)
```

### 6.2 Konflikt-Regel

Wenn erlaubte und blockierte Regeln gleichzeitig greifen:

```python
session = {
    "type": "task",          # ✅ eigentlich erlaubt
    "status": "done"         # ❌ blockiert
}
# → ❌ Blockiert (Status hat Vorrang vor Typ)
```

**Prinzip:** `Status > Flags > Typ` — restriktivste Regel gewinnt.

### 6.3 Override-Verhalten

- `manual_pascal_override` deaktiviert **sofort** Auto für diese Session
- Wirkt sich **nicht** auf andere Sessions aus
- Hebt sich auf, wenn Pascal explizit `delegated_pascal_writing_allowed` setzt
- Oder wenn die Session beendet / neu gestartet wird

---

## 7. Konfiguration

```yaml
session_auto_rules:
  enabled: true
  strict_mode: true
  allow_delegated_override: true
  allowed_types:
    - auto_session
    - auto
    - todo
    - task
    - auftragsfach
    - assignment
    - kanban-linked
    - kanban_task
    - sleep_safe
    - autopilot
  blocked_types:
    - brainstorming
    - idee
    - idea
    - private
    - unknown
    - undefined
    - stream
    - live
  blocked_statuses:
    - done
    - completed
    - blocked_approval
    - waiting_approval
  blocking_flags:
    - manual_pascal_override
    - has_active_stream
  allowing_flags:
    - delegated_pascal_writing_allowed
```

---

## 8. Testfälle

| Test Session | Erwartung |
|---|---|
| `{type: "auto_session"}` | ✅ ALLOW |
| `{type: "todo"}` | ✅ ALLOW |
| `{type: "auftragsfach"}` | ✅ ALLOW |
| `{type: "task", kanban_board_id: "kb_1"}` | ✅ ALLOW |
| `{type: "sleep_safe"}` | ✅ ALLOW |
| `{type: "task", metadata: {delegated_pascal_writing_allowed: true}}` | ✅ ALLOW |
| `{type: "brainstorming"}` | ❌ BLOCK |
| `{type: "private"}` | ❌ BLOCK |
| `{type: "todo", status: "done"}` | ❌ BLOCK (Status) |
| `{type: "auto_session", status: "blocked_approval"}` | ❌ BLOCK (Status) |
| `{type: "auto_session", metadata: {manual_pascal_override: true}}` | ❌ BLOCK (Flag) |
| `{type: "stream", has_active_stream: true}` | ❌ BLOCK (Flag) |
| `{type: "unknown_type"}` | ❌ BLOCK (Fallback) |
