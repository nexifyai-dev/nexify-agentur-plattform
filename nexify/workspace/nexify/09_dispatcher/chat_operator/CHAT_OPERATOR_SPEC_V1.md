# CHAT-OPERATOR-SPEC V1

---
**Titel:** Chat Operator Specification — 12-Step Auto-Injection Pipeline  
**Status:** RELEASED  
**Version:** 1.0.0  
**Datum:** 2026-06-10  
**Klassifikation:** INTERNAL — NEXIFY CORE  
**Sprache:** Python/TypeScript Pseudocode  
---

## 1. Übersicht

Der **Chat Operator** ist die zentrale Orchestrierungskomponente des USER-Chat-Driver-Systems.
Er wird durch den `agent:end`-Hook aktiviert und durchläuft eine 12-stufige Pipeline,
um zu entscheiden, ob und welche USER-Nachricht automatisch injiziert wird.

```
agent:end → [1] Hook → [2] Session → [3] Auto → [4] Loop → [5] Policy
                                                                   
           [6] Memory → [7] History → [8] Generate → [9] Inject → [10] Hermes
                                                                   
           [11] Evidence → [12] Kanban → [13] agentmemory → Done
```

---

## 2. Pipeline (Python/TypeScript Pseudocode)

### Step 1 — agent:end-Hook abfangen

```python
# CHAT_OPERATOR_V1.py
# Location: nexify/09_dispatcher/chat_operator/

import asyncio
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

class UserChatDriverState(Enum):
    OFF = "USER_CHAT_DRIVER_OFF"
    ON = "USER_CHAT_DRIVER_ON"
    AUTO_SESSIONS_ONLY = "USER_CHAT_DRIVER_AUTO_SESSIONS_ONLY"
    PAUSED = "USER_CHAT_DRIVER_PAUSED"
    BLOCKED = "USER_CHAT_DRIVER_BLOCKED"
    REVIEW_REQUIRED = "USER_CHAT_DRIVER_REVIEW_REQUIRED"
    ERROR = "USER_CHAT_DRIVER_ERROR"

@dataclass
class AgentEndEvent:
    """Das Event, das der agent:end-Hook liefert."""
    session_id: str
    agent_id: str
    end_reason: str          # "completed" | "error" | "interrupted" | "timeout"
    final_response: str
    token_count: int
    duration_ms: int
    conversation_id: str
    timestamp: datetime


class ChatOperator:
    """
    ChatOperator — Die zentrale Auto-Injektions-Pipeline.
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.loop_guard = LoopGuard(config.get("loop_guard", {}))
        self.policy_gate = PolicyGate(config.get("policy_gate", {}))
        self.evidence_store = EvidenceStore()
        self.kanban = KanbanClient()

    async def on_agent_end(self, event: AgentEndEvent) -> Optional[AutoInjectionResult]:
        """
        [STEP 1] agent:end-Hook abfangen.
        Wird vom System aufgerufen, wenn ein Agent seine Verarbeitung beendet hat.
        """
        self.logger.info(f"[ChatOperator] agent:end received — session={event.session_id}, "
                         f"reason={event.end_reason}")

        # Nur bei "completed" weiterverarbeiten
        if event.end_reason not in ("completed",):
            self.logger.debug(f"[ChatOperator] Skipping — end_reason={event.end_reason}")
            return None

        return await self._run_pipeline(event)
```

### Step 2 — Session-Regeln prüfen

```python
    async def _run_pipeline(self, event: AgentEndEvent) -> Optional[AutoInjectionResult]:
        """
        [STEP 2] Session-Regeln prüfen.
        Ruft die Session ab und prüft, ob die Session überhaupt für Auto geeignet ist.
        """
        session = await self._load_session(event.session_id)
        if not session:
            await self.evidence_store.write(Evidence(
                level="WARN",
                source="chat_operator",
                session_id=event.session_id,
                message="Session not found — aborting auto-injection",
            ))
            return None

        # Session-Typ prüfen (siehe SESSION_AUTO_REGELN_V1.md)
        session_check = await self._check_session_rules(session)
        if not session_check.allowed:
            await self.evidence_store.write(Evidence(
                level="INFO",
                source="chat_operator",
                session_id=event.session_id,
                message=f"Session rules deny auto-injection — reason={session_check.reason}",
                details={"session_type": session.type, "reason": session_check.reason}
            ))
            return None

        self._pipeline_context = PipelineContext(
            event=event,
            session=session,
            session_check=session_check,
        )
        # → weiter zu Step 3
        return await self._step3_check_auto_switch()
```

```python
    async def _step3_check_auto_switch(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 3] Auto-Schalter prüfen.
        Der Button-Zustand entscheidet, ob Auto-Injektion erlaubt ist.
        """
        auto_state = await self._get_auto_button_state()

        if auto_state == UserChatDriverState.OFF:
            return self._abort("Auto switch is OFF")
        
        if auto_state == UserChatDriverState.PAUSED:
            return self._abort("Auto switch is PAUSED")

        if auto_state == UserChatDriverState.BLOCKED:
            return await self._handle_blocked()

        if auto_state == UserChatDriverState.ERROR:
            return self._abort("Auto switch is in ERROR state — recovery needed")

        if auto_state == UserChatDriverState.REVIEW_REQUIRED:
            return await self._handle_review_required()

        if auto_state == UserChatDriverState.AUTO_SESSIONS_ONLY:
            # Prüfen, ob Session in der Whitelist ist
            if self._pipeline_context.session.id not in self._get_auto_whitelist():
                return self._abort("Session not in AUTO_SESSIONS_ONLY whitelist")

        # auto_state == ON — weiter
        return await self._step4_loop_guard()
```

### Step 4 — Loop Guard prüfen

```python
    async def _step4_loop_guard(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 4] Loop Guard prüfen.
        Loop Guard verhindert Endlosschleifen und Missbrauch.
        """
        loop_check = await self.loop_guard.check(
            session_id=self._pipeline_context.session.id,
            agent_id=self._pipeline_context.event.agent_id,
            end_reason=self._pipeline_context.event.end_reason,
            final_response=self._pipeline_context.event.final_response,
        )

        # Evidence schreiben (egal ob pass/fail)
        await self.evidence_store.write(loop_check.to_evidence())

        if not loop_check.allowed:
            self.logger.warning(f"[ChatOperator] Loop Guard BLOCKED — "
                                f"session={self._pipeline_context.session.id}, "
                                f"reason={loop_check.reason}")

            # Bei 3x Block → Auto auf BLOCKED setzen
            if loop_check.consecutive_blocks >= 3:
                await self._set_auto_button_state(UserChatDriverState.BLOCKED,
                                                  reason="Loop Guard 3x consecutive blocks")
                await self._notify_user("Auto wurde deaktiviert — Loop Guard hat 3x blockiert.")

            return None

        self._pipeline_context.loop_guard_result = loop_check
        return await self._step5_policy_gate()
```

### Step 5 — Policy Gate prüfen

```python
    async def _step5_policy_gate(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 5] Policy Gate prüfen.
        Prüft Kontext, Confidence und weitere Richtlinien.
        """
        policy_check = await self.policy_gate.check(
            session=self._pipeline_context.session,
            event=self._pipeline_context.event,
            loop_guard_result=self._pipeline_context.loop_guard_result,
        )

        await self.evidence_store.write(policy_check.to_evidence())

        if not policy_check.allowed:
            self.logger.info(f"[ChatOperator] Policy Gate DENIED — "
                             f"reason={policy_check.reason}")

            # Bei niedriger Confidence → PAUSED
            if policy_check.reason == "confidence_below_threshold":
                await self._set_auto_button_state(
                    UserChatDriverState.PAUSED,
                    reason=f"Confidence {policy_check.confidence} < threshold",
                    pause_until=datetime.utcnow() + timedelta(seconds=120),
                )
                await self._notify_user("Auto wurde pausiert — Confidence zu niedrig.")

            # Bei grenzwertigem Fall → REVIEW_REQUIRED
            if policy_check.reason == "edge_case":
                await self._set_auto_button_state(
                    UserChatDriverState.REVIEW_REQUIRED,
                    reason="Edge case detected — review required",
                )

            return None

        self._pipeline_context.policy_gate_result = policy_check
        return await self._step6_load_agentmemory()
```

### Step 6 — agentmemory laden

```python
    async def _step6_load_agentmemory(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 6] agentmemory laden.
        Holt das agentmemory der Session als Kontext für die Message-Generierung.
        """
        try:
            memory = await self._load_agentmemory(self._pipeline_context.session.id)
            self._pipeline_context.agentmemory = memory
            self._pipeline_context.agentmemory_hash = self._hash(memory)

            if not memory or len(memory.get("entries", [])) == 0:
                self.logger.debug(f"[ChatOperator] agentmemory empty — "
                                  f"session={self._pipeline_context.session.id}")
                # Leeres Memory ist okay — trotzdem weitermachen

        except Exception as e:
            self.logger.error(f"[ChatOperator] Failed to load agentmemory: {e}")
            await self.evidence_store.write(Evidence(
                level="ERROR",
                source="chat_operator",
                session_id=self._pipeline_context.session.id,
                message=f"Failed to load agentmemory: {str(e)}",
            ))
            return None

        return await self._step7_load_history()
```

### Step 7 — relevante Historie laden

```python
    async def _step7_load_history(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 7] relevante Historie laden.
        Lädt die letzten N Nachrichten der Session als Kontext.
        """
        try:
            history = await self._load_session_history(
                session_id=self._pipeline_context.session.id,
                limit=self.config.get("history_limit", 20),
            )
            self._pipeline_context.history = history

            self._pipeline_context.last_user_message = self._find_last_user_message(history)
            self._pipeline_context.last_assistant_message = self._find_last_assistant_message(history)

        except Exception as e:
            self.logger.error(f"[ChatOperator] Failed to load history: {e}")
            await self.evidence_store.write(Evidence(
                level="ERROR",
                source="chat_operator",
                session_id=self._pipeline_context.session.id,
                message=f"Failed to load history: {str(e)}",
            ))
            return None

        return await self._step8_generate_message()
```

### Step 8 — nächste USER-Message erzeugen

```python
    async def _step8_generate_message(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 8] nächste USER-Message erzeugen.
        Verwendet LLM/9Router, um die nächste sinnvolle User-Nachricht zu generieren.
        """
        ctx = self._pipeline_context

        prompt = self._build_generation_prompt(
            session=ctx.session,
            history=ctx.history,
            agentmemory=ctx.agentmemory,
            last_user_message=ctx.last_user_message,
            last_assistant_message=ctx.last_assistant_message,
            final_response=ctx.event.final_response,
        )

        try:
            message = await self._call_llm_or_9router(prompt)

            # Prefix anfügen
            prefix = self.config.get("message_prefix",
                "[ FORTSETZUNG — Automatisch fuer Pascal erzeugt ]")
            message = f"{prefix}\n\n{message.strip()}"

            # Validierung
            if not self._validate_message(message):
                self.logger.warning(f"[ChatOperator] Generated message invalid — "
                                    f"session={ctx.session.id}")
                return None

            # Länge prüfen
            max_len = self.config.get("max_message_length", 4000)
            if len(message) > max_len:
                message = message[:max_len]
                self.logger.warning(f"[ChatOperator] Truncated message to {max_len} chars")

            ctx.generated_message = message
            ctx.message_hash = self._hash(message)

        except Exception as e:
            self.logger.error(f"[ChatOperator] Message generation failed: {e}")
            await self.evidence_store.write(Evidence(
                level="ERROR",
                source="chat_operator",
                session_id=ctx.session.id,
                message=f"Message generation failed: {str(e)}",
            ))
            # State auf PAUSED setzen
            await self._set_auto_button_state(UserChatDriverState.PAUSED,
                                              reason="Message generation failed")
            return None

        return await self._step9_inject_message()
```

### Step 9 — USER-Message in Session speichern

```python
    async def _step9_inject_message(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 9] USER-Message in Session speichern.
        Schreibt die Nachricht als echte USER-Nachricht in die Session.
        """
        ctx = self._pipeline_context

        try:
            user_message = {
                "role": "user",
                "content": ctx.generated_message,
                "timestamp": datetime.utcnow().isoformat(),
                "metadata": {
                    "source": "auto_driver",
                    "auto_version": "1.0.0",
                    "session_id": ctx.session.id,
                    "loop_guard_id": ctx.loop_guard_result.guard_id,
                    "policy_gate_result": ctx.policy_gate_result.result,
                    "original_trigger": "agent:end",
                    "correlation_id": ctx.event.conversation_id,
                    "state_at_injection": ctx.auto_button_state.value,
                    "injected_at": datetime.utcnow().isoformat(),
                }
            }

            saved_message = await self._save_to_session(ctx.session.id, user_message)
            ctx.saved_message = saved_message

            self.logger.info(f"[ChatOperator] Injected USER message — "
                             f"session={ctx.session.id}, msg_id={saved_message.id}")

        except Exception as e:
            self.logger.error(f"[ChatOperator] Failed to save message to session: {e}")
            await self.evidence_store.write(Evidence(
                level="ERROR",
                source="chat_operator",
                session_id=ctx.session.id,
                message=f"Failed to save message: {str(e)}",
            ))
            return None

        return await self._step10_trigger_hermes()
```

### Step 10 — normalen Hermes-Chatlauf auslösen

```python
    async def _step10_trigger_hermes(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 10] normalen Hermes-Chatlauf auslösen.
        Startet den Standard-Chatlauf, der die neue User-Nachricht verarbeitet.
        """
        ctx = self._pipeline_context

        try:
            hermes_result = await self._call_hermes_chat(
                session_id=ctx.session.id,
                message_id=ctx.saved_message.id,
                user_message=ctx.generated_message,
                trigger="auto_driver",
            )
            ctx.hermes_result = hermes_result

            self.logger.info(f"[ChatOperator] Hermes chat triggered — "
                             f"session={ctx.session.id}, "
                             f"response_tokens={hermes_result.token_count}")

        except Exception as e:
            self.logger.error(f"[ChatOperator] Hermes chat failed: {e}")
            await self.evidence_store.write(Evidence(
                level="ERROR",
                source="chat_operator",
                session_id=ctx.session.id,
                message=f"Hermes chat failed: {str(e)}",
            ))
            # State auf PAUSED setzen
            await self._set_auto_button_state(UserChatDriverState.PAUSED,
                                              reason="Hermes chat failed")
            return None

        return await self._step11_write_evidence()
```

### Step 11 — Evidence schreiben

```python
    async def _step11_write_evidence(self) -> Optional[AutoInjectionResult]:
        """
        [STEP 11] Evidence schreiben.
        Dokumentiert die gesamte Auto-Injektion als Evidence.
        """
        ctx = self._pipeline_context

        try:
            evidence = Evidence(
                level="INFO",
                source="chat_operator",
                session_id=ctx.session.id,
                message=f"Auto USER message injected — loop_guard={ctx.loop_guard_result.guard_id}",
                details={
                    "injection_id": ctx.saved_message.id,
                    "auto_button_state": ctx.auto_button_state.value,
                    "loop_guard": {
                        "allowed": ctx.loop_guard_result.allowed,
                        "guard_id": ctx.loop_guard_result.guard_id,
                        "consecutive_blocks": ctx.loop_guard_result.consecutive_blocks,
                    },
                    "policy_gate": {
                        "allowed": ctx.policy_gate_result.allowed,
                        "confidence": ctx.policy_gate_result.confidence,
                    },
                    "message": {
                        "hash": ctx.message_hash,
                        "length": len(ctx.generated_message),
                        "preview": ctx.generated_message[:150] + "...",
                    },
                    "hermes": {
                        "triggered": True,
                        "token_count": ctx.hermes_result.token_count if ctx.hermes_result else 0,
                    },
                    "session_type": ctx.session.type,
                    "session_rules_allowed": ctx.session_check.allowed,
                    "duration_ms": (datetime.utcnow() - ctx.event.timestamp).total_seconds() * 1000,
                }
            )

            await self.evidence_store.write(evidence)

        except Exception as e:
            self.logger.error(f"[ChatOperator] Failed to write evidence: {e}")
            # Nicht kritisch — trotzdem weitermachen

        return await self._step12_update_kanban_and_memory()
```

### Step 12 — Kanban aktualisieren

```python
    async def _step12_update_kanban_and_memory(self) -> AutoInjectionResult:
        """
        [STEP 12] Kanban aktualisieren & agentmemory aktualisieren.
        """
        ctx = self._pipeline_context

        # Kanban aktualisieren
        try:
            if ctx.session.type in ("task", "kanban-linked"):
                await self.kanban.update_progress(
                    session_id=ctx.session.id,
                    auto_injection_count=ctx.session.auto_injection_count + 1,
                    last_auto_injection=datetime.utcnow().isoformat(),
                )
        except Exception as e:
            self.logger.warning(f"[ChatOperator] Kanban update failed: {e}")

        # agentmemory aktualisieren
        try:
            new_agentmemory = await self._update_agentmemory(
                session_id=ctx.session.id,
                current_memory=ctx.agentmemory,
                new_message=ctx.generated_message,
                hermes_result=ctx.hermes_result,
            )
            ctx.updated_agentmemory = new_agentmemory
        except Exception as e:
            self.logger.warning(f"[ChatOperator] agentmemory update failed: {e}")

        # Ergebnis zusammenbauen
        result = AutoInjectionResult(
            success=True,
            session_id=ctx.session.id,
            injected_message_id=ctx.saved_message.id,
            loop_guard_id=ctx.loop_guard_result.guard_id,
            auto_button_state=ctx.auto_button_state,
            duration_ms=(datetime.utcnow() - ctx.event.timestamp).total_seconds() * 1000,
            hermes_triggered=True,
        )

        self.logger.info(f"[ChatOperator] Pipeline COMPLETE — "
                         f"session={result.session_id}, "
                         f"msg_id={result.injected_message_id}, "
                         f"duration={result.duration_ms:.0f}ms")

        return result
```

---

## 3. Hilfsfunktionen

```python
    async def _load_session(self, session_id: str) -> Optional[Session]:
        """Lädt die Session aus dem Session-Store."""
        ...

    async def _check_session_rules(self, session: Session) -> SessionCheckResult:
        """Prüft Session-Regeln gemäß SESSION_AUTO_REGELN_V1.md."""
        ...

    async def _get_auto_button_state(self) -> UserChatDriverState:
        """Liest den aktuellen Auto-Schalter-Zustand."""
        ...

    async def _set_auto_button_state(self, state: UserChatDriverState, 
                                      reason: str, **kwargs) -> None:
        """Setzt den Auto-Schalter auf einen neuen Zustand."""
        ...

    async def _load_agentmemory(self, session_id: str) -> Dict[str, Any]:
        """Lädt das agentmemory der Session."""
        ...

    async def _load_session_history(self, session_id: str, limit: int) -> List[Message]:
        """Lädt die letzten Nachrichten der Session."""
        ...

    def _find_last_user_message(self, history: List[Message]) -> Optional[Message]:
        """Findet die letzte Nachricht mit role='user'."""
        ...

    def _find_last_assistant_message(self, history: List[Message]) -> Optional[Message]:
        """Findet die letzte Nachricht mit role='assistant'."""
        ...

    def _build_generation_prompt(self, **context) -> str:
        """Baut den Prompt für die Message-Generierung."""
        ...

    async def _call_llm_or_9router(self, prompt: str) -> str:
        """Ruft LLM oder 9Router für die Message-Generierung."""
        ...

    def _validate_message(self, message: str) -> bool:
        """Validiert die generierte Nachricht (Länge, Zeichen, etc.)."""
        ...

    async def _save_to_session(self, session_id: str, message: dict) -> SavedMessage:
        """Speichert die Nachricht in der Session."""
        ...

    async def _call_hermes_chat(self, **params) -> HermesResult:
        """Startet den Hermes-Chatlauf."""
        ...

    async def _update_agentmemory(self, **params) -> Dict[str, Any]:
        """Aktualisiert das agentmemory."""
        ...

    def _hash(self, data: Any) -> str:
        """Erzeugt einen SHA-256 Hash."""
        ...
```

---

## 4. Datenklassen

```python
@dataclass
class PipelineContext:
    event: AgentEndEvent
    session: Session
    session_check: SessionCheckResult
    auto_button_state: UserChatDriverState = None
    loop_guard_result: Optional[LoopGuardResult] = None
    policy_gate_result: Optional[PolicyGateResult] = None
    agentmemory: Optional[Dict] = None
    agentmemory_hash: Optional[str] = None
    history: Optional[List[Message]] = None
    last_user_message: Optional[Message] = None
    last_assistant_message: Optional[Message] = None
    generated_message: Optional[str] = None
    message_hash: Optional[str] = None
    saved_message: Optional[SavedMessage] = None
    hermes_result: Optional[HermesResult] = None
    updated_agentmemory: Optional[Dict] = None

@dataclass
class AutoInjectionResult:
    success: bool
    session_id: str
    injected_message_id: Optional[str] = None
    loop_guard_id: Optional[str] = None
    auto_button_state: Optional[UserChatDriverState] = None
    duration_ms: float = 0.0
    hermes_triggered: bool = False
    error: Optional[str] = None

@dataclass
class SessionCheckResult:
    allowed: bool
    reason: Optional[str] = None
    session_type: Optional[str] = None
```

---

## 5. Fehlerszenarien

| Szenario | Step | Reaktion |
|---|---|---|
| Session nicht gefunden | Step 2 | Abbruch, Evidence WARN |
| Auto OFF | Step 3 | Abbruch (stumm) |
| Loop Guard blockiert | Step 4 | Abbruch, Evidence, Counter +1 |
| Loop Guard 3x | Step 4 | State → BLOCKED |
| Policy Gate denied | Step 5 | Abbruch, ggf. State-Change |
| agentmemory leer | Step 6 | Weiter mit leerem Memory |
| Generation fehlschlägt | Step 8 | Abbruch, State → PAUSED |
| Save fehlschlägt | Step 9 | Abbruch, State → PAUSED |
| Hermes fehlschlägt | Step 10 | Abbruch, State → PAUSED |
| Evidence fehlschlägt | Step 11 | Non-fatal, weiter |
| Kanban fehlschlägt | Step 12 | Non-fatal, weiter |

---

## 6. Interfaces

### Input (agent:end-Hook)

```typescript
interface AgentEndEvent {
  sessionId: string;
  agentId: string;
  endReason: "completed" | "error" | "interrupted" | "timeout";
  finalResponse: string;
  tokenCount: number;
  durationMs: number;
  conversationId: string;
  timestamp: string; // ISO8601
}
```

### Output

```typescript
interface AutoInjectionResult {
  success: boolean;
  sessionId: string;
  injectedMessageId?: string;
  loopGuardId?: string;
  autoButtonState?: UserChatDriverState;
  durationMs: number;
  hermesTriggered: boolean;
  error?: string;
}
```

---

## 7. Konfiguration

```yaml
chat_operator:
  enabled: true
  history_limit: 20
  max_message_length: 4000
  message_prefix: "[ FORTSETZUNG — Automatisch fuer Pascal erzeugt ]"
  generation_timeout_ms: 15000
  hermes_timeout_ms: 60000
  auto_pause_on_error: true
  pause_duration_seconds: 120
  loop_guard:
    min_interval_seconds: 180
    max_per_hour: 5
    max_consecutive_blocks: 3
  policy_gate:
    min_confidence: 0.7
    review_threshold: 0.6
```
