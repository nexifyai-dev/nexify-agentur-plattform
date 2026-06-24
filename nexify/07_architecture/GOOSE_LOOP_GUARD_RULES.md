# Goose Loop-Guard-Regeln

| Feld | Wert |
|------|------|
| **Dokument** | GOOSE_LOOP_GUARD_RULES.md |
| **Version** | 1.0.0 |
| **Sprache** | Deutsch |
| **Audit-Pflicht** | Ja |
| **Letzte Änderung** | 2026-06-10 |

---

## 1. Zweck

Der LoopGuard ist die zentrale Sicherheitskomponente des Goose User-Chat Drivers. Er verhindert Endlos-Schleifen, Rate-Limit-Überschreitungen und gefährliche Injektionsmuster. Jede Regel ist hart codiert und kann nur durch Config-Änderung angepasst werden.

---

## 2. Rate-Limits

| Regel-ID | Regel | Limit | Konsequenz |
|----------|-------|-------|-----------|
| **RL-01** | Max Injektionen pro Minute | 3 | Block für 60 Sekunden |
| **RL-02** | Max Injektionen pro Stunde | 5 | Block für 60 Minuten |
| **RL-03** | Max gleicher Injektionsgrund | 3× | Block für 30 Minuten |
| **RL-04** | Min Abstand zwischen Injektionen | 10 Sekunden | Ignoriert, wenn <10s |

### 2.1 Zählweise
- Rate-Limits zählen **erfolgreiche Injektionen** (nicht Versuche)
- Geblockte Injektionen zählen nicht zum Limit
- Zähler werden beim Driver-Neustart zurückgesetzt
- Persistenz in SQLite: Zähler überleben Neustart **nicht**

### 2.2 Implementierung

```python
class RateLimiter:
    def __init__(self, config: dict):
        self.minute_limit = config.get("max_per_minute", 3)
        self.hour_limit = config.get("max_per_hour", 5)
        self.same_reason_limit = config.get("max_same_reason", 3)
        self.min_delay = config.get("min_delay_seconds", 10)
        
        self.minute_counter = deque()
        self.hour_counter = deque()
        self.reason_counter = defaultdict(int)
        self.last_injection_time = 0
    
    def check(self, reason: str = "unknown") -> str:
        """Prüft alle Rate-Limits. Returns PASS oder BLOCKED + Grund."""
        now = time.time()
        
        # RL-01: Pro Minute
        while self.minute_counter and now - self.minute_counter[0] > 60:
            self.minute_counter.popleft()
        if len(self.minute_counter) >= self.minute_limit:
            return "BLOCKED: Rate-Limit pro Minute (3/min)"
        
        # RL-02: Pro Stunde
        while self.hour_counter and now - self.hour_counter[0] > 3600:
            self.hour_counter.popleft()
        if len(self.hour_counter) >= self.hour_limit:
            return "BLOCKED: Rate-Limit pro Stunde (5/h)"
        
        # RL-03: Gleicher Grund
        if self.reason_counter[reason] >= self.same_reason_limit:
            return "BLOCKED: Gleicher Grund 3× (30 Min)"
        
        # RL-04: Min Abstand
        if now - self.last_injection_time < self.min_delay:
            return "BLOCKED: Min-Abstand 10s nicht erreicht"
        
        return "PASS"
```

---

## 3. Blockierte Stop-Reasons

Folgende Injektions-Gründe sind **grundsätzlich blockiert** und führen immer zu BLOCKED:

| ID | Stop-Reason | Begründung |
|----|-------------|-----------|
| **BR-01** | `error_retry` | Fehler dürfen nicht automatisch erneut versucht werden |
| **BR-02** | `unknown_status` | Unbekannter Status = keine Aktion |
| **BR-03** | `force_continue` | Nur manuell erlaubt |
| **BR-04** | `emergency_stop` | Widerspricht Emergency-Stop |
| **BR-05** | `bypass_guard` | Explizit verboten – Sicherheitsumgehung |
| **BR-06** | `test_injection_no_prefix` | Injektion ohne Prefix ist verboten |

### 3.1 Ausnahme
Blockierte Stop-Reasons können **nur manuell** durch Pascal freigegeben werden (via Config `override.blocked_reasons`).

---

## 4. Automatic Unblock

| Regel-ID | Regel | Beschreibung |
|----------|-------|-------------|
| **AU-01** | Automatic Unblock RL-01 | Nach 60 Sekunden |
| **AU-02** | Automatic Unblock RL-02 | Nach 60 Minuten |
| **AU-03** | Automatic Unblock RL-03 | Nach 30 Minuten |
| **AU-04** | Automatic Unblock BR | Nur manuell |
| **AU-05** | Automatic Unblock Config-Change | Bei Reload der Config |

### 4.1 Unblock-Check-Zyklus
Der LoopGuard prüft alle 10 Sekunden, ob ein Automatic Unblock möglich ist.

```python
def check_automatic_unblock(self) -> list:
    """Prüft, ob Blocks aufgehoben werden können. Returns Liste der aufgehobenen Blocks."""
    now = time.time()
    unblocked = []
    
    for block in self.active_blocks:
        if block["type"] == "RL-01" and now - block["since"] > 60:
            unblocked.append(block)
        elif block["type"] == "RL-02" and now - block["since"] > 3600:
            unblocked.append(block)
        elif block["type"] == "RL-03" and now - block["since"] > 1800:
            unblocked.append(block)
    
    for block in unblocked:
        self.active_blocks.remove(block)
        self.logger.info(f"Block aufgehoben: {block['reason']}")
    
    return unblocked
```

---

## 5. Keine Injection bei aktiver Verarbeitung

| Regel-ID | Regel | Beschreibung |
|----------|-------|-------------|
| **AI-01** | Keine Injection bei RUNNING | Goose CLI verarbeitet aktiv |
| **AI-02** | Keine Injection bei BLOCKED | Goose CLI wurde geblockt |
| **AI-03** | Keine Injection bei ERROR | Fehler muss manuell behoben werden |
| **AI-04** | Keine Injection bei DONE | Task ist abgeschlossen |
| **AI-05** | Injection NUR bei WAITING | Nur wenn Goose auf Eingabe wartet |

### 5.1 Status-Erkennung
Der OutputObserver liefert den aktuellen Status. Der LoopGuard blockiert, wenn der Status nicht `WAITING` ist.

```python
def check_status(self, status: str) -> str:
    """Prüft, ob Injektion basierend auf Status erlaubt ist."""
    allowed_statuses = {"WAITING", "INJECTED"}  # INJECTED = Vorbereitung
    if status not in allowed_statuses:
        return f"BLOCKED: Status '{status}' erlaubt keine Injektion"
    return "PASS"
```

---

## 6. Verbot doppelter Eingaben

| Regel-ID | Regel | Beschreibung |
|----------|-------|-------------|
| **DE-01** | Keine doppelten Nachrichten | Gleicher Inhalt innerhalb 5 Minuten |
| **DE-02** | Keine identischen Sessions | Gleicher Session-Name innerhalb 1 Minute |

### 6.1 Prüfung

```python
def check_duplicate(self, message: str, session: str) -> str:
    """Prüft auf Duplikate."""
    now = time.time()
    
    # DE-01: Gleicher Inhalt
    msg_key = hashlib.md5(message.encode()).hexdigest()
    if msg_key in self.recent_messages:
        if now - self.recent_messages[msg_key] < 300:  # 5 Minuten
            return "BLOCKED: Doppelte Nachricht (innerhalb 5 Min)"
    
    # DE-02: Gleiche Session
    if session in self.recent_sessions:
        if now - self.recent_sessions[session] < 60:  # 1 Minute
            return "BLOCKED: Gleiche Session (innerhalb 1 Min)"
    
    self.recent_messages[msg_key] = now
    self.recent_sessions[session] = now
    return "PASS"
```

---

## 7. Verbot bei gleicher letzter Message

| Regel-ID | Regel | Beschreibung |
|----------|-------|-------------|
| **GL-01** | Gleiche letzte Ausgabe | Wenn Output identisch mit vorherigem → keine Injektion |
| **GL-02** | Kein Fortschritt nach Injektion | 3× gleicher Output nach Injektion → BLOCKED |

**Begründung:** Wenn die Goose CLI dieselbe Ausgabe wiederholt, könnte eine Injektion den Loop verstärken.

---

## 8. Verbot bei Driver OFF/PAUSED

| Regel-ID | Regel | Beschreibung |
|----------|-------|-------------|
| **DO-01** | Driver MODE=OFF | Keine Injektion, keine Beobachtung |
| **DO-02** | Driver MODE=PAUSED | Beobachtung läuft, keine Injektion |
| **DO-03** | Driver MODE=OBSERVE_ONLY | Nur Beobachtung, keine Injektion |
| **DO-04** | Driver MODE=AUTO | Volle Autonomie (Standard) |

### 8.1 Config-Struktur

```yaml
driver:
  mode: AUTO                    # OFF | PAUSED | OBSERVE_ONLY | AUTO
  auto_resume_after: 300       # Sekunden (PAUSED → AUTO nach 5 Min)
```

---

## 9. Recovery-Verhalten

| Szenario | Recovery | Timeout |
|----------|----------|---------|
| LoopGuard blockiert > 30 Min | Automatic Unblock | 30 Min |
| 5× BLOCKED in 10 Min | Driver setzt auf PAUSED | Manuell |
| Crash des Drivers | Neustart + State-Recovery | 30 Sek |
| tmux-Session verloren | Reconnect (3 Versuche) | 90 Sek |
| Rate-Limit erreicht | Automatic Unblock | 30–60 Min |
| Config fehlerhaft | Fallback auf Default-Config | Sofort |

### 9.1 Crash-Recovery

```python
def recover_from_crash(self):
    """Stellt State nach Crash wieder her."""
    try:
        state = self.load_state()
        if state["mode"] == "AUTO":
            self.logger.warning("Crash erkannt – Starte in AUTO-Modus")
            # Rate-Limits zurücksetzen nach Crash
            self.rate_limiter.reset()
            self.logger.info("Rate-Limits zurückgesetzt (Crash-Recovery)")
        return True
    except Exception as e:
        self.logger.error(f"Recovery fehlgeschlagen: {e}")
        self.set_mode("PAUSED")
        return False
```

---

## 10. Übersicht aller Regeln

| Kürzel | Regel | Härte | Automatischer Unblock |
|--------|-------|-------|----------------------|
| RL-01 | 3/Min | Hart | 60 Sek |
| RL-02 | 5/h | Hart | 60 Min |
| RL-03 | 3× gleicher Grund | Hart | 30 Min |
| RL-04 | 10s Abstand | Weich | 10 Sek |
| BR-01..06 | Blockierte Reasons | Hart | ❌ Manuell |
| AU-01..05 | Auto Unblock | System | N/A |
| AI-01..05 | Status-Check | Hart | Statuswechsel |
| DE-01..02 | Duplikat-Check | Hart | 5 Min / 1 Min |
| GL-01..02 | Gleiche Message | Mittel | 30 Sek |
| DO-01..04 | Driver Mode | Hart | Config-Änderung |

---

## 11. Logging & Audit

Jeder Block wird geloggt:
```
[2026-06-10 19:19:00] [WARN] [LOOPGUARD] BLOCKED: Rate-Limit pro Minute (3/min) | Reason: continue | Session: goose-cli-main
[2026-06-10 19:20:00] [INFO] [LOOPGUARD] UNBLOCKED: RL-01 nach 60s | Session: goose-cli-main
```

---

*Ende der Loop-Guard-Regeln. Version 1.0.0 – Audit-konform.*
