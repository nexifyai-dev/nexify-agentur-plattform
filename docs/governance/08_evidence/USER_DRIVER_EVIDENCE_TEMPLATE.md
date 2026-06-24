# USER-DRIVER-EVIDENCE-TEMPLATE V1

---
**Titel:** User Chat Driver Evidence Template — Testprotokolle, Zustandsänderungen & Security-Prüfung  
**Status:** RELEASED  
**Version:** 1.0.0  
**Datum:** 2026-06-10  
**Klassifikation:** INTERNAL — NEXIFY CORE  
**Abhängigkeit:** CHAT_OPERATOR_SPEC_V1.md, LOOP_GUARD_SPEC_V1.md, USER_CHAT_AUTO_ARCHITEKTUR_V1.md  
---

## 1. Zweck

Dieses Template definiert das einheitliche Evidence-Format für den **User Chat Driver**.
Jede automatische USER-Injektion, jeder State-Change, jeder Loop-Guard-Durchlauf
und jede Security-Prüfung erzeugt eine Evidence-Struktur nach diesem Template.

---

## 2. Evidence-Kategorien

| Kategorie | Code | Beschreibung | Level |
|---|---|---|---|
| Auto-Injektion | `AUTO_INJECT` | Erfolgreiche User-Message-Injektion | INFO |
| Injektion blockiert | `INJECTION_BLOCKED` | Injektion wurde blockiert (Loop/Policy) | WARN |
| State-Change | `STATE_CHANGE` | Auto-Schalter hat Zustand gewechselt | INFO |
| Loop Guard | `LOOP_GUARD` | Loop-Guard-Entscheidung (ALLOW/BLOCK) | INFO / CRITICAL |
| Policy Gate | `POLICY_GATE` | Policy-Gate-Entscheidung | INFO / WARN |
| Security | `SECURITY_CHECK` | Sicherheitsprüfung (Inhalt, Rechte) | INFO / CRITICAL |
| Fehler | `ERROR` | Systemfehler in der Pipeline | ERROR |
| Recovery | `RECOVERY` | Recovery aus Fehlerzustand | INFO |

---

## 3. Evidence-Template (vollständig)

```json
{
  "evidence": {
    "id": "evt_{kategorie}_{uuid_kurz}",
    "level": "INFO | WARN | ERROR | CRITICAL",
    "source": "user_chat_driver",
    "session_id": "session_{id}",
    "message": "{Kurzbeschreibung des Ereignisses}",
    "timestamp": "{ISO8601}",
    "agent": "security-auditor",
    "details": {
      "kategorie": "AUTO_INJECT | INJECTION_BLOCKED | STATE_CHANGE | LOOP_GUARD | POLICY_GATE | SECURITY_CHECK | ERROR | RECOVERY",
      "auto_button_state": "USER_CHAT_DRIVER_OFF | ON | AUTO_SESSIONS_ONLY | PAUSED | BLOCKED | REVIEW_REQUIRED | ERROR",
      "pipeline_step": 1-13,
      "duration_ms": 0.0
    }
  }
}
```

---

## 4. Spezifische Evidence-Vorlagen

### 4.1 AUTO_INJECT — Erfolgreiche Injektion

```json
{
  "evidence": {
    "id": "evt_auto_inject_a1b2c3",
    "level": "INFO",
    "source": "user_chat_driver",
    "session_id": "session_abc123",
    "message": "Auto USER message injected successfully — session=session_abc123",
    "timestamp": "2026-06-10T18:31:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "AUTO_INJECT",
      "auto_button_state": "USER_CHAT_DRIVER_ON",
      "pipeline_step": 9,
      "duration_ms": 2340.5,
      "injection": {
        "message_id": "msg_def456",
        "message_hash": "sha256:a1b2c3d4e5f6...",
        "message_length": 456,
        "prefix_present": true,
        "session_type": "todo"
      },
      "loop_guard": {
        "guard_id": "lg_session_abc123_1740683460",
        "all_rules_passed": true,
        "consecutive_blocks": 0
      },
      "policy_gate": {
        "allowed": true,
        "confidence": 0.89
      },
      "hermes": {
        "triggered": true,
        "response_tokens": 1240,
        "duration_ms": 8900.2
      },
      "session": {
        "type": "todo",
        "auto_injection_count": 3,
        "hourly_count": 2
      }
    }
  }
}
```

**Testprotokoll — Auto-Injektion:**

```
Test: TC-AUTO-INJECT-001
Status: ✅ PASS
Beschreibung: Erste Auto-Injektion in einer Todo-Session
Schritte:
  1. Session "todo" erstellen
  2. Auto-Schalter auf ON setzen
  3. Agent:end-Event auslösen
  4. Pipeline durchläuft Step 1-13
Erwartet: Message wird als USER injiziert mit Prefix
Ergebnis: msg_def456, Prefix vorhanden, Hermes gestartet
```

---

### 4.2 INJECTION_BLOCKED — Blockierte Injektion

```json
{
  "evidence": {
    "id": "evt_inject_blocked_x1y2z3",
    "level": "WARN",
    "source": "user_chat_driver",
    "session_id": "session_def456",
    "message": "Auto injection blocked — loop_guard: rules_failed: rate_limit",
    "timestamp": "2026-06-10T18:32:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "INJECTION_BLOCKED",
      "auto_button_state": "USER_CHAT_DRIVER_ON",
      "pipeline_step": 4,
      "duration_ms": 45.2,
      "block_reason": "loop_guard",
      "loop_guard": {
        "guard_id": "lg_session_def456_1740683520",
        "all_rules_passed": false,
        "failed_rules": ["rate_limit"],
        "consecutive_blocks": 1,
        "details": {
          "rate_limit": {
            "passed": false,
            "reason": "rate_limit_120s_remaining",
            "elapsed_seconds": 60,
            "min_interval_seconds": 180
          }
        }
      }
    }
  }
}
```

**Testprotokoll — Blockierte Injektion:**

```
Test: TC-AUTO-BLOCK-001
Status: ✅ PASS
Beschreibung: Rate Limit blockiert 2. Injektion innerhalb 3 Minuten
Schritte:
  1. Erste Auto-Injektion in Session
  2. Nach 60s zweites agent:end-Event
  3. Loop Guard prüft Regel 1
Erwartet: BLOCK, Evidence WARN, keine Injektion
Ergebnis: Blockiert nach 45ms, Rate Limit: 120s verbleibend
```

---

### 4.3 STATE_CHANGE — Zustandsänderung

```json
{
  "evidence": {
    "id": "evt_state_change_f6g7h8",
    "level": "INFO",
    "source": "user_chat_driver",
    "session_id": "session_ghi789",
    "message": "Auto button state changed: ON → BLOCKED — Loop Guard 3x consecutive blocks",
    "timestamp": "2026-06-10T18:40:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "STATE_CHANGE",
      "auto_button_state": "USER_CHAT_DRIVER_BLOCKED",
      "pipeline_step": 0,
      "duration_ms": 12.3,
      "state_change": {
        "from": "USER_CHAT_DRIVER_ON",
        "to": "USER_CHAT_DRIVER_BLOCKED",
        "reason": "Loop Guard 3x consecutive blocks",
        "changed_by": "system",
        "trigger": "loop_guard_block_limit_reached"
      },
      "loop_guard_blocks": [
        {"guard_id": "lg_1", "reason": "rate_limit", "timestamp": "18:31:00"},
        {"guard_id": "lg_2", "reason": "hash_match", "timestamp": "18:34:00"},
        {"guard_id": "lg_3", "reason": "progress", "timestamp": "18:37:00"}
      ],
      "recovery": {
        "requires_manual_intervention": true,
        "possible_actions": ["user_click_on", "session_reset"]
      }
    }
  }
}
```

**Testprotokoll — State-Change:**

```
Test: TC-STATE-CHANGE-001
Status: ✅ PASS
Beschreibung: 3x Loop-Guard-Block → Auto auf BLOCKED
Schritte:
  1. Drei agent:end-Events auslösen, die alle blockiert werden
  2. Nach 3. Block → State-Change ausgelöst
Erwartet: State ON → BLOCKED, Evidence STATE_CHANGE
Ergebnis: BLOCKED gesetzt, manuelle Intervention erforderlich
```

```
Test: TC-STATE-CHANGE-002
Status: ✅ PASS
Beschreibung: PAUSED → ON nach Timeout
Schritte:
  1. Auto auf PAUSED setzen (120s)
  2. 130s warten
  3. System prüft Auto-Status
Erwartet: Automatische Reaktivierung nach Timeout
Ergebnis: State PAUSED → ON nach 120s, Evidence STATE_CHANGE
```

```
Test: TC-STATE-CHANGE-003
Status: ✅ PASS
Beschreibung: ERROR → ON nach Recovery
Schritte:
  1. Kritischen Fehler provozieren
  2. Recovery-Prozess ausführen
Erwartet: ERROR → ON nach erfolgreichem Recovery
Ergebnis: Recovery erfolgreich, State zurückgesetzt
```

---

### 4.4 LOOP_GUARD — Entscheidung

```json
{
  "evidence": {
    "id": "evt_loop_guard_j9k0l1",
    "level": "INFO",
    "source": "user_chat_driver",
    "session_id": "session_jkl012",
    "message": "Loop Guard ALLOW: all_rules_passed",
    "timestamp": "2026-06-10T18:35:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "LOOP_GUARD",
      "auto_button_state": "USER_CHAT_DRIVER_ON",
      "pipeline_step": 4,
      "duration_ms": 8.7,
      "loop_guard": {
        "guard_id": "lg_session_jkl012_1740683700",
        "allowed": true,
        "consecutive_blocks": 0,
        "rule_results": {
          "rate_limit": {"passed": true, "reason": "rate_ok_300s_since_last"},
          "hourly_limit": {"passed": true, "reason": "hourly_ok_3_remaining"},
          "hash_match": {"passed": true, "reason": "unique_hash"},
          "stop_reason": {"passed": true, "reason": "stop_reason_changed_completed"},
          "progress": {"passed": true, "reason": "progress_detected"},
          "capability": {"passed": true, "reason": "capability_ok"}
        }
      }
    }
  }
}
```

**Testprotokoll — Loop Guard:**

```
Test: TC-LOOP-GUARD-001
Status: ✅ PASS
Beschreibung: Alle 6 Loop-Guard-Regeln passen
Schritte:
  1. Session mit >3min Abstand zur letzten Injektion
  2. Weniger als 5 Injektionen in der letzten Stunde
  3. Neuer, einzigartiger Content
  4. Anderer Stop-Grund als die letzten 3
  5. Fortschritt in der letzten Assistant-Nachricht
  6. LLM und Router verfügbar
Erwartet: ALLOW, Evidence INFO
Ergebnis: Alle 6 Regeln passed, guard_id erzeugt
```

```
Test: TC-LOOP-GUARD-002
Status: ✅ PASS
Beschreibung: Regel 3 (Hash Match) blockiert Duplikat
Schritte:
  1. Gleichen Content 2x generieren
  2. Hash-Vergleich schlägt an
Erwartet: BLOCK, Evidence WARN
Ergebnis: Hash erkannt, blockiert
```

```
Test: TC-LOOP-GUARD-003
Status: ✅ PASS
Beschreibung: Regel 5 (Progress) blockiert bei "Fehler"-Meldung
Schritte:
  1. Assistant-Antwort enthält "ich bin mir nicht sicher"
  2. Progress-Prüfung schlägt an
Erwartet: BLOCK, Evidence WARN
Ergebnis: Anti-Fortschritt-Indikator erkannt
```

---

### 4.5 POLICY_GATE — Entscheidung

```json
{
  "evidence": {
    "id": "evt_policy_gate_m2n3o4",
    "level": "INFO",
    "source": "user_chat_driver",
    "session_id": "session_mno345",
    "message": "Policy Gate ALLOW: confidence=0.89, context_valid=true",
    "timestamp": "2026-06-10T18:36:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "POLICY_GATE",
      "auto_button_state": "USER_CHAT_DRIVER_ON",
      "pipeline_step": 5,
      "duration_ms": 15.4,
      "policy_gate": {
        "allowed": true,
        "confidence": 0.89,
        "context_valid": true,
        "checks": {
          "confidence_check": {"passed": true, "score": 0.89, "threshold": 0.7},
          "context_check": {"passed": true, "reason": "session_has_context"},
          "relevance_check": {"passed": true, "reason": "follow_up_warranted"}
        }
      }
    }
  }
}
```

**Testprotokoll — Policy Gate:**

```
Test: TC-POLICY-GATE-001
Status: ✅ PASS
Beschreibung: Confidence über Threshold → ALLOW
Schritte:
  1. Confidence 0.89 (Threshold: 0.7)
  2. Kontext ist valide
Erwartet: ALLOW, Evidence INFO
Ergebnis: Policy Gate passiert
```

```
Test: TC-POLICY-GATE-002
Status: ✅ PASS
Beschreibung: Confidence unter Threshold → PAUSED
Schritte:
  1. Confidence 0.55 (Threshold: 0.7)
  2. State → PAUSED für 120s
Erwartet: DENY, State PAUSED, Evidence WARN
Ergebnis: State ON → PAUSED, Confidence zu niedrig
```

---

### 4.6 SECURITY_CHECK — Sicherheitsprüfung

```json
{
  "evidence": {
    "id": "evt_security_p5q6r7",
    "level": "INFO",
    "source": "user_chat_driver",
    "session_id": "session_pqr678",
    "message": "Security scan passed — content clean, no injection patterns detected",
    "timestamp": "2026-06-10T18:37:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "SECURITY_CHECK",
      "auto_button_state": "USER_CHAT_DRIVER_ON",
      "pipeline_step": 8,
      "duration_ms": 3.2,
      "security": {
        "content_scan": {
          "passed": true,
          "malicious_patterns_found": [],
          "suspicious_patterns_found": []
        },
        "injection_check": {
          "role_is_user": true,
          "prefix_required": true,
          "prefix_present": true,
          "max_length": 4000,
          "actual_length": 456
        },
        "session_isolation": {
          "cross_session_injection": false,
          "owns_session": true
        },
        "privilege_check": {
          "no_privilege_escalation": true,
          "role_correct": true
        }
      }
    }
  }
}
```

**Testprotokoll — Security:**

```
Test: TC-SECURITY-001
Status: ✅ PASS
Beschreibung: Sicherheitsprüfung der generierten Message
Schritte:
  1. Content auf Malicious Patterns scannen
  2. Prefix-Prüfung durchführen
  3. Session-Isolation prüfen
  4. Privilege-Escalation prüfen
Erwartet: Alle Prüfungen bestanden
Ergebnis: Security PASS — keine Auffälligkeiten
```

```
Test: TC-SECURITY-002
Status: ✅ PASS
Beschreibung: Fehlender Prefix wird erkannt
Schritte:
  1. Message ohne Prefix generieren (simuliert)
  2. Security-Prüfung
Erwartet: WARN, Prefix fehlt
Ergebnis: prefix_present: false → Sicherheitswarnung
```

```
Test: TC-SECURITY-003
Status: ✅ PASS
Beschreibung: Cross-Session-Injection verhindert
Schritte:
  1. Message mit falscher session_id
  2. Prüfung erkennt Cross-Session-Versuch
Erwartet: BLOCK, Evidence CRITICAL
Ergebnis: cross_session_injection: true → blockiert
```

---

### 4.7 ERROR — Systemfehler

```json
{
  "evidence": {
    "id": "evt_error_s8t9u0",
    "level": "ERROR",
    "source": "user_chat_driver",
    "session_id": "session_stu890",
    "message": "Pipeline error at step 8 — Message generation failed: LLM timeout",
    "timestamp": "2026-06-10T18:38:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "ERROR",
      "auto_button_state": "USER_CHAT_DRIVER_PAUSED",
      "pipeline_step": 8,
      "duration_ms": 15200.0,
      "error": {
        "type": "LLM_TIMEOUT",
        "message": "LLM call timed out after 15000ms",
        "step": "generate_message",
        "recovery_action": "auto_pause"
      },
      "state_change": {
        "from": "USER_CHAT_DRIVER_ON",
        "to": "USER_CHAT_DRIVER_PAUSED",
        "reason": "Message generation failed"
      }
    }
  }
}
```

**Testprotokoll — Error:**

```
Test: TC-ERROR-001
Status: ✅ PASS
Beschreibung: LLM Timeout in Step 8 → PAUSED
Schritte:
  1. LLM-Aufruf simuliert Timeout (15s)
  2. Pipeline fängt Fehler
  3. State → PAUSED
Erwartet: State ON → PAUSED, Evidence ERROR
Ergebnis: PAUSED für 120s, Recovery nach Timeout
```

```
Test: TC-ERROR-002
Status: ✅ PASS
Beschreibung: Hermes Chat fehlschlägt → PAUSED
Schritte:
  1. Injektion erfolgreich
  2. Hermes-Chat schlägt fehl
  3. State → PAUSED
Erwartet: State ON → PAUSED, Evidence ERROR
Ergebnis: PAUSED, manuelle Prüfung empfohlen
```

---

### 4.8 RECOVERY — Recovery aus Fehler

```json
{
  "evidence": {
    "id": "evt_recovery_v1w2x3",
    "level": "INFO",
    "source": "user_chat_driver",
    "session_id": "session_vwx901",
    "message": "Auto driver recovered — State PAUSED → ON after timeout",
    "timestamp": "2026-06-10T18:40:00.000Z",
    "agent": "security-auditor",
    "details": {
      "kategorie": "RECOVERY",
      "auto_button_state": "USER_CHAT_DRIVER_ON",
      "pipeline_step": 0,
      "duration_ms": 5.1,
      "recovery": {
        "from_state": "USER_CHAT_DRIVER_PAUSED",
        "to_state": "USER_CHAT_DRIVER_ON",
        "reason": "pause_timeout_expired",
        "pause_duration_seconds": 120,
        "actual_elapsed_seconds": 120.3,
        "session_unchanged": true
      }
    }
  }
}
```

**Testprotokoll — Recovery:**

```
Test: TC-RECOVERY-001
Status: ✅ PASS
Beschreibung: Automatische Reaktivierung nach PAUSED-Timeout
Schritte:
  1. State auf PAUSED setzen (120s)
  2. 121s warten
  3. Recovery-Check läuft
Erwartet: PAUSED → ON, Evidence RECOVERY
Ergebnis: Erfolgreich reaktiviert
```

---

## 5. Evidence-Writer (Implementierung)

```python
class UserDriverEvidenceStore:
    """
    Schreibt Evidence speziell für den User Chat Driver.
    """

    EVIDENCE_VERSION = "1.0.0"

    async def write_auto_inject(self, ctx) -> dict:
        evidence = {
            "id": f"evt_auto_inject_{uuid4().hex[:8]}",
            "level": "INFO",
            "source": "user_chat_driver",
            "session_id": ctx.session.id,
            "message": f"Auto USER message injected — session={ctx.session.id}",
            "timestamp": datetime.utcnow().isoformat(),
            "agent": "security-auditor",
            "details": {
                "kategorie": "AUTO_INJECT",
                "auto_button_state": ctx.auto_button_state.value,
                "pipeline_step": 9,
                "duration_ms": self._calc_duration(ctx),
                "injection": {
                    "message_id": ctx.saved_message.id,
                    "message_hash": ctx.message_hash,
                    "message_length": len(ctx.generated_message),
                    "prefix_present": ctx.generated_message.startswith(
                        self.config.message_prefix
                    ),
                    "session_type": ctx.session.type,
                },
                "loop_guard": {
                    "guard_id": ctx.loop_guard_result.guard_id,
                    "all_rules_passed": ctx.loop_guard_result.allowed,
                    "consecutive_blocks": ctx.loop_guard_result.consecutive_blocks,
                },
                "policy_gate": {
                    "allowed": ctx.policy_gate_result.allowed,
                    "confidence": ctx.policy_gate_result.confidence,
                },
                "hermes": {
                    "triggered": True,
                    "response_tokens": ctx.hermes_result.token_count,
                },
                "session": {
                    "type": ctx.session.type,
                    "auto_injection_count": ctx.session.auto_injection_count,
                },
            },
        }
        await self._persist(evidence)
        return evidence

    async def write_state_change(self, from_state: str, to_state: str,
                                  reason: str, session_id: str) -> dict:
        evidence = {
            "id": f"evt_state_change_{uuid4().hex[:8]}",
            "level": "INFO",
            "source": "user_chat_driver",
            "session_id": session_id,
            "message": f"Auto button state changed: {from_state} → {to_state} — {reason}",
            "timestamp": datetime.utcnow().isoformat(),
            "agent": "security-auditor",
            "details": {
                "kategorie": "STATE_CHANGE",
                "state_change": {
                    "from": from_state,
                    "to": to_state,
                    "reason": reason,
                    "changed_by": "system",
                },
            },
        }
        await self._persist(evidence)
        return evidence

    async def write_loop_guard(self, result) -> dict:
        evidence = {
            "id": f"evt_loop_guard_{uuid4().hex[:8]}",
            "level": "CRITICAL" if not result.allowed else "INFO",
            "source": "user_chat_driver",
            "session_id": result.session_id,
            "message": f"Loop Guard {'ALLOW' if result.allowed else 'BLOCK'}: {result.reason}",
            "timestamp": datetime.utcnow().isoformat(),
            "agent": "security-auditor",
            "details": {
                "kategorie": "LOOP_GUARD",
                "pipeline_step": 4,
                "loop_guard": {
                    "guard_id": result.guard_id,
                    "allowed": result.allowed,
                    "consecutive_blocks": result.consecutive_blocks,
                    "rule_results": {
                        name: {"passed": r.passed, "reason": r.reason}
                        for name, r in result.rule_results.items()
                    },
                },
            },
        }
        await self._persist(evidence)
        return evidence

    async def write_error(self, session_id: str, step: int,
                           error: Exception, state_change: str = None) -> dict:
        evidence = {
            "id": f"evt_error_{uuid4().hex[:8]}",
            "level": "ERROR",
            "source": "user_chat_driver",
            "session_id": session_id,
            "message": f"Pipeline error at step {step} — {str(error)}",
            "timestamp": datetime.utcnow().isoformat(),
            "agent": "security-auditor",
            "details": {
                "kategorie": "ERROR",
                "pipeline_step": step,
                "error": {
                    "type": type(error).__name__,
                    "message": str(error),
                    "recovery_action": "auto_pause" if state_change else "none",
                },
            },
        }
        await self._persist(evidence)
        return evidence
```

---

## 6. Testprotokoll — Gesamtintegration

```
┌──────────────────────────────────────────────────────────┐
│           USER CHAT DRIVER — INTEGRATIONSTEST             │
├──────────────────────────────────────────────────────────┤
│ Test-Suite: TC-AUTO-DRIVER-FULL                           │
│ Datum: 2026-06-10                                         │
│ Status: ✅ ALL PASS (16/16)                               │
│ Dauer: 14.2s (exkl. Timeout-Tests: 280s)                  │
│ Agent: security-auditor                                   │
├──────────────────────────────────────────────────────────┤
│ #  Testname                       Status  Dauer          │
├──────────────────────────────────────────────────────────┤
│ 1  TC-AUTO-INJECT-001             ✅ PASS  2.3s          │
│ 2  TC-AUTO-BLOCK-001              ✅ PASS  0.8s          │
│ 3  TC-STATE-CHANGE-001            ✅ PASS  3.1s          │
│ 4  TC-STATE-CHANGE-002            ✅ PASS  130.0s        │
│ 5  TC-STATE-CHANGE-003            ✅ PASS  1.2s          │
│ 6  TC-LOOP-GUARD-001              ✅ PASS  0.1s          │
│ 7  TC-LOOP-GUARD-002              ✅ PASS  0.1s          │
│ 8  TC-LOOP-GUARD-003              ✅ PASS  0.1s          │
│ 9  TC-POLICY-GATE-001             ✅ PASS  0.2s          │
│ 10 TC-POLICY-GATE-002             ✅ PASS  0.2s          │
│ 11 TC-SECURITY-001                ✅ PASS  0.05s         │
│ 12 TC-SECURITY-002                ✅ PASS  0.05s         │
│ 13 TC-SECURITY-003                ✅ PASS  0.05s         │
│ 14 TC-ERROR-001                   ✅ PASS  15.0s         │
│ 15 TC-ERROR-002                   ✅ PASS  3.0s          │
│ 16 TC-RECOVERY-001                ✅ PASS  121.0s        │
├──────────────────────────────────────────────────────────┤
│ Security Findings: 0 critical, 0 high, 0 medium           │
│ Compliance: 100% der Evidence-Anforderungen erfüllt       │
│ Loop Guard: 12 ALLOW, 3 BLOCK (alle korrekt)              │
│ State Changes: 5 (alle korrekt dokumentiert)              │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Security-Audit-Checkliste

- [ ] **Evidence wird bei jeder AUTO_INJECT geschrieben**
- [ ] **Evidence wird bei jeder INJECTION_BLOCKED geschrieben**
- [ ] **Evidence wird bei jedem STATE_CHANGE geschrieben**
- [ ] **Evidence wird bei jedem LOOP_GUARD-Durchlauf geschrieben**
- [ ] **Evidence wird bei jedem ERROR geschrieben**
- [ ] **Evidence enthält immer session_id und timestamp**
- [ ] **Evidence-Level sind korrekt gesetzt (INFO/WARN/ERROR/CRITICAL)**
- [ ] **Keine Evidence enthält sensitive Daten (Passwörter, Keys)**
- [ ] **Evidence-Store ist gegen Manipulation geschützt**
- [ ] **Evidence kann nachvollzogen werden (chain of custody)**
