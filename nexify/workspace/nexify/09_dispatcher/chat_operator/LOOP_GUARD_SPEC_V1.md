# LOOP-GUARD-SPEC V1

---
**Titel:** Loop Guard — Security-Schleusen für automatische USER-Injektion  
**Status:** RELEASED  
**Version:** 1.0.0  
**Datum:** 2026-06-10  
**Klassifikation:** INTERNAL — NEXIFY CORE  
**Abhängigkeit:** CHAT_OPERATOR_SPEC_V1.md, USER_CHAT_AUTO_ARCHITEKTUR_V1.md  
---

## 1. Zweck

Der **Loop Guard** verhindert, dass der USER-Chat-Driver in Endlosschleifen gerät,
sich wiederholt, sinnlose Nachrichten produziert oder das System missbraucht.
Er ist die erste Sicherheitsschicht vor dem Policy Gate.

```
agent:end → Session → Auto-Schalter → LOOP GUARD → Policy Gate → Generate
                                            │
                                      Entscheidung:
                                      ALLOW oder BLOCK
                                            │
                                      Evidence schreiben
```

---

## 2. Die 6 Loop-Guard-Regeln

### Regel 1 — Rate Limit

**Maximal 1 automatische USER-Message je Session alle 3 Minuten**

```python
class RateLimitRule:
    """
    Regel 1: Rate Limit — maximal 1 Auto-Injektion alle 180 Sekunden.
    """
    MIN_INTERVAL_SECONDS = 180  # 3 Minuten

    async def check(self, session_id: str,
                     last_injection: Optional[datetime]) -> RuleResult:
        if not last_injection:
            return RuleResult(passed=True, reason="no_previous_injection")

        elapsed = (datetime.utcnow() - last_injection).total_seconds()
        if elapsed >= self.MIN_INTERVAL_SECONDS:
            return RuleResult(passed=True,
                              reason=f"rate_ok_{elapsed:.0f}s_since_last")

        wait_remaining = self.MIN_INTERVAL_SECONDS - elapsed
        return RuleResult(
            passed=False,
            reason=f"rate_limit_{wait_remaining:.0f}s_remaining",
            details={
                "elapsed_seconds": elapsed,
                "min_interval_seconds": self.MIN_INTERVAL_SECONDS,
                "wait_remaining_seconds": wait_remaining,
            }
        )
```

**Konsequenz:** BLOCK + Evidence. Kein State-Change.

---

### Regel 2 — Hourly Limit

**Maximal 5 automatische USER-Messages je Session pro Stunde**

```python
class HourlyLimitRule:
    """
    Regel 2: Stündliches Limit — maximal 5 Auto-Injektionen pro Session/Stunde.
    """
    MAX_PER_HOUR = 5

    async def check(self, session_id: str,
                     hourly_count: int) -> RuleResult:
        if hourly_count < self.MAX_PER_HOUR:
            remaining = self.MAX_PER_HOUR - hourly_count
            return RuleResult(passed=True,
                              reason=f"hourly_ok_{remaining}_remaining")

        return RuleResult(
            passed=False,
            reason=f"hourly_limit_reached_{hourly_count}_in_last_hour",
            details={
                "hourly_count": hourly_count,
                "max_per_hour": self.MAX_PER_HOUR,
            }
        )
```

**Konsequenz:** BLOCK + Evidence. State → AUTO_SESSIONS_ONLY bei >4/h.

---

### Regel 3 — Gleicher Hash blockiert

**Wenn der Hash der neuen Nachricht mit einer vorherigen übereinstimmt → BLOCK**

```python
class HashMatchRule:
    """
    Regel 3: Hash-Vergleich — gleicher Inhalt blockiert.
    Verhindert identische Wiederholungen.
    """

    async def check(self, session_id: str,
                     new_message_hash: str,
                     last_5_hashes: List[str]) -> RuleResult:
        if new_message_hash in last_5_hashes:
            return RuleResult(
                passed=False,
                reason=f"duplicate_hash_{new_message_hash[:12]}",
                details={
                    "new_hash": new_message_hash,
                    "matched_hash_index": last_5_hashes.index(new_message_hash),
                    "last_5_hashes": last_5_hashes,
                }
            )

        return RuleResult(passed=True, reason="unique_hash")
```

**Konsequenz:** BLOCK + Evidence. Counter +1.

---

### Regel 4 — Gleicher Stop-Grund dreimal blockiert

**Wenn derselbe Stop-Grund (end_reason) 3x hintereinander → BLOCK**

```python
class StopReasonRule:
    """
    Regel 4: Stop-Grund-Wiederholung — 3x gleicher Grund → BLOCKED.
    """
    MAX_CONSECUTIVE_SAME_REASON = 3

    async def check(self, session_id: str,
                     end_reason: str,
                     last_3_end_reasons: List[str]) -> RuleResult:
        if len(last_3_end_reasons) < self.MAX_CONSECUTIVE_SAME_REASON - 1:
            return RuleResult(passed=True, reason="insufficient_history")

        consecutive_same = all(
            r == end_reason for r in last_3_end_reasons[-(self.MAX_CONSECUTIVE_SAME_REASON-1):]
        )

        if consecutive_same and last_3_end_reasons[-1] == end_reason:
            return RuleResult(
                passed=False,
                reason=f"stop_reason_repeated_3x_{end_reason}",
                details={
                    "end_reason": end_reason,
                    "last_3_reasons": last_3_end_reasons,
                    "consecutive_count": self.MAX_CONSECUTIVE_SAME_REASON,
                }
            )

        return RuleResult(passed=True, reason=f"stop_reason_changed_{end_reason}")
```

**Konsequenz:** BLOCK + Evidence. State → BLOCKED (wenn 3x erreicht).

---

### Regel 5 — Keine Fortsetzung ohne echten Fortschritt

**Wenn die letzte Assistant-Nachricht keinen messbaren Fortschritt enthält → BLOCK**

```python
class ProgressRule:
    """
    Regel 5: Fortschrittsprüfung — nur fortsetzen, wenn echter Fortschritt.
    Prüft, ob die letzte Antwort neue Informationen, Aktionen oder Ergebnisse enthält.
    """

    FORTSCHRITT_INDIKATOREN = [
        "erledigt", "abgeschlossen", "fertig", "done",
        "ergebnis", "resultat", "output", "ausgabe",
        "analysiert", "geprüft", "validiert",
        "erstellt", "generiert", "geschrieben",
        "extrahier", "gruppier", "sortier",
        "- [x]", "✅", "✔️",
        "datei", "file", "erfolgreich",
        "neue", "update", "änderung",
    ]

    KEIN_FORTSCHRITT_INDIKATOREN = [
        "ich bin mir nicht sicher",
        "ich kann nicht",
        "fehler", "error",
        "ich verstehe nicht",
        "nicht möglich",
        "abgebrochen",
    ]

    async def check(self, session_id: str,
                     final_response: str,
                     assistant_message: Optional[str]) -> RuleResult:
        if not assistant_message:
            return RuleResult(passed=False, reason="no_assistant_message_to_continue")

        text = (assistant_message + " " + final_response).lower()

        # Prüfe auf Fortschritt
        has_progress = any(
            ind in text for ind in self.FORTSCHRITT_INDIKATOREN
        )

        # Prüfe auf Anti-Fortschritt
        has_no_progress = any(
            ind in text for ind in self.KEIN_FORTSCHRITT_INDIKATOREN
        )

        if has_no_progress:
            return RuleResult(
                passed=False,
                reason="no_real_progress_anti_indicators_found",
                details={"matched_indicators": self._find_matched(text, self.KEIN_FORTSCHRITT_INDIKATOREN)}
            )

        if not has_progress:
            return RuleResult(
                passed=False,
                reason="no_real_progress_no_indicators_found",
                details={
                    "message_preview": assistant_message[:200],
                }
            )

        return RuleResult(
            passed=True,
            reason=f"progress_detected",
            details={"matched_indicators": self._find_matched(text, self.FORTSCHRITT_INDIKATOREN)}
        )
```

**Konsequenz:** BLOCK + Evidence. Counter +1. Review bei >2x.

---

### Regel 6 — Keine Fortsetzung bei fehlender LLM-/9Router-Fähigkeit

**Wenn LLM/9Router nicht verfügbar oder die Qualität zu niedrig ist → BLOCK**

```python
class CapabilityRule:
    """
    Regel 6: Fähigkeitsprüfung — LLM/9Router muss verfügbar und leistungsfähig sein.
    """
    MIN_CONFIDENCE_SCORE = 0.6

    async def check(self, session_id: str,
                     llm_available: bool,
                     router_available: bool,
                     last_generation_quality: Optional[float]) -> RuleResult:
        if not llm_available and not router_available:
            return RuleResult(
                passed=False,
                reason="no_llm_or_router_available",
                details={
                    "llm_available": llm_available,
                    "router_available": router_available,
                }
            )

        if last_generation_quality is not None:
            if last_generation_quality < self.MIN_CONFIDENCE_SCORE:
                return RuleResult(
                    passed=False,
                    reason=f"generation_quality_too_low_{last_generation_quality:.2f}",
                    details={
                        "quality_score": last_generation_quality,
                        "min_required": self.MIN_CONFIDENCE_SCORE,
                    }
                )

        return RuleResult(
            passed=True,
            reason="capability_ok",
            details={
                "llm_available": llm_available,
                "router_available": router_available,
                "quality_score": last_generation_quality,
            }
        )
```

**Konsequenz:** BLOCK + Evidence. State → PAUSED bei fehlendem LLM.

---

## 3. LoopGuard Klasse (vollständig)

```python
@dataclass
class RuleResult:
    passed: bool
    reason: str
    details: Dict[str, Any] = field(default_factory=dict)

@dataclass
class LoopGuardResult:
    allowed: bool
    reason: str
    guard_id: str
    consecutive_blocks: int
    rule_results: Dict[str, RuleResult]
    session_id: str
    checked_at: datetime = field(default_factory=datetime.utcnow)

    def to_evidence(self) -> "Evidence":
        return Evidence(
            level="CRITICAL" if not self.allowed else "INFO",
            source="loop_guard",
            session_id=self.session_id,
            message=f"Loop Guard {'ALLOW' if self.allowed else 'BLOCK'}: {self.reason}",
            details={
                "guard_id": self.guard_id,
                "allowed": self.allowed,
                "reason": self.reason,
                "consecutive_blocks": self.consecutive_blocks,
                "rule_results": {
                    name: {"passed": r.passed, "reason": r.reason}
                    for name, r in self.rule_results.items()
                },
            }
        )


class LoopGuard:
    """
    Loop Guard — 6 Sicherheitsregeln gegen Endlosschleifen.
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.rules = {
            "rate_limit": RateLimitRule(),
            "hourly_limit": HourlyLimitRule(),
            "hash_match": HashMatchRule(),
            "stop_reason": StopReasonRule(),
            "progress": ProgressRule(),
            "capability": CapabilityRule(),
        }
        self._session_state: Dict[str, Dict] = {}

    async def check(self, session_id: str, agent_id: str,
                     end_reason: str,
                     final_response: str) -> LoopGuardResult:
        """
        Führt alle 6 Loop-Guard-Regeln aus.
        """
        state = self._get_or_create_session_state(session_id)
        guard_id = f"lg_{session_id}_{int(datetime.utcnow().timestamp())}"

        rule_results = {}

        # Regel 1: Rate Limit
        rule_results["rate_limit"] = await self.rules["rate_limit"].check(
            session_id, state.get("last_injection")
        )

        # Regel 2: Hourly Limit
        rule_results["hourly_limit"] = await self.rules["hourly_limit"].check(
            session_id, self._count_in_last_hour(state)
        )

        # Regel 3: Hash Match
        new_hash = self._generate_hash(final_response)
        rule_results["hash_match"] = await self.rules["hash_match"].check(
            session_id, new_hash, state.get("last_5_hashes", [])
        )

        # Regel 4: Stop Reason
        rule_results["stop_reason"] = await self.rules["stop_reason"].check(
            session_id, end_reason, state.get("last_3_end_reasons", [])
        )

        # Regel 5: Progress
        last_assistant = state.get("last_assistant_message")
        rule_results["progress"] = await self.rules["progress"].check(
            session_id, final_response, last_assistant
        )

        # Regel 6: Capability
        rule_results["capability"] = await self.rules["capability"].check(
            session_id,
            llm_available=state.get("llm_available", True),
            router_available=state.get("router_available", True),
            last_generation_quality=state.get("last_generation_quality"),
        )

        # Gesamtentscheidung: ALLE Regeln müssen passen
        all_passed = all(r.passed for r in rule_results.values())
        failed_rules = [name for name, r in rule_results.items() if not r.passed]

        if all_passed:
            self._update_session_state_on_success(state, new_hash, end_reason, final_response)
            return LoopGuardResult(
                allowed=True,
                reason="all_rules_passed",
                guard_id=guard_id,
                consecutive_blocks=0,
                rule_results=rule_results,
                session_id=session_id,
            )
        else:
            consecutive = state.get("consecutive_blocks", 0) + 1
            state["consecutive_blocks"] = consecutive
            return LoopGuardResult(
                allowed=False,
                reason=f"rules_failed: {', '.join(failed_rules)}",
                guard_id=guard_id,
                consecutive_blocks=consecutive,
                rule_results=rule_results,
                session_id=session_id,
            )

    def _get_or_create_session_state(self, session_id: str) -> Dict:
        if session_id not in self._session_state:
            self._session_state[session_id] = {
                "last_injection": None,
                "injection_timestamps": [],
                "last_5_hashes": [],
                "last_3_end_reasons": [],
                "last_assistant_message": None,
                "consecutive_blocks": 0,
                "llm_available": True,
                "router_available": True,
                "last_generation_quality": None,
            }
        return self._session_state[session_id]

    def _update_session_state_on_success(self, state: Dict, new_hash: str,
                                          end_reason: str,
                                          final_response: str):
        state["last_injection"] = datetime.utcnow()
        state["injection_timestamps"].append(datetime.utcnow())
        state["last_5_hashes"] = (state.get("last_5_hashes", []) + [new_hash])[-5:]
        state["last_3_end_reasons"] = (state.get("last_3_end_reasons", []) + [end_reason])[-3:]
        state["last_assistant_message"] = final_response
        state["consecutive_blocks"] = 0

    def _count_in_last_hour(self, state: Dict) -> int:
        now = datetime.utcnow()
        one_hour_ago = now - timedelta(hours=1)
        return sum(1 for t in state.get("injection_timestamps", []) if t > one_hour_ago)

    def _generate_hash(self, content: str) -> str:
        import hashlib
        return hashlib.sha256(content.encode()).hexdigest()
```

---

## 4. Regel-Matrix

| # | Regel | Prüfung | Härte | State-Change bei Fail |
|---|---|---|---|---|
| 1 | Rate Limit | 3min Abstand | MEDIUM | Keiner |
| 2 | Hourly Limit | 5/h max | MEDIUM | → AUTO_SESSIONS_ONLY |
| 3 | Hash Match | Kein Duplikat | HARD | Keiner |
| 4 | Stop Reason | Max 3x gleich | HARD | → BLOCKED bei 3x |
| 5 | Progress | Fortschritt nötig | HARD | → REVIEW bei >2x |
| 6 | Capability | LLM/Router OK | CRITICAL | → PAUSED |

---

## 5. Evidence-Format (je Entscheidung)

Jede Loop-Guard-Entscheidung erzeugt eine Evidence:

```json
{
  "evidence": {
    "id": "evt_lg_abc123",
    "level": "INFO" | "WARN" | "CRITICAL",
    "source": "loop_guard",
    "session_id": "session_xyz",
    "message": "Loop Guard ALLOW: all_rules_passed",
    "timestamp": "2026-06-10T18:31:00.000Z",
    "details": {
      "guard_id": "lg_session_xyz_1740683460",
      "allowed": true,
      "reason": "all_rules_passed",
      "consecutive_blocks": 0,
      "rule_results": {
        "rate_limit": { "passed": true, "reason": "rate_ok_300s_since_last" },
        "hourly_limit": { "passed": true, "reason": "hourly_ok_3_remaining" },
        "hash_match": { "passed": true, "reason": "unique_hash" },
        "stop_reason": { "passed": true, "reason": "stop_reason_changed_completed" },
        "progress": { "passed": true, "reason": "progress_detected" },
        "capability": { "passed": true, "reason": "capability_ok" }
      }
    }
  }
}
```

---

## 6. Test-Cases

| Test | Erwartung |
|---|---|
| 2 Injektionen in 60s | Regel 1 blockiert |
| 6 Injektionen in 1h | Regel 2 blockiert |
| Selber Content 2x | Regel 3 blockiert (2. Mal) |
| 3x gleicher Stop-Grund | Regel 4 blockiert → State BLOCKED |
| Assistant sagt "Fehler" | Regel 5 blockiert |
| LLM nicht verfügbar | Regel 6 blockiert → State PAUSED |
| Alle Regeln passen | LoopGuard ALLOW |
| Nach Block + neuer User-Input | Counter resettet |
