#!/usr/bin/env python3
"""§12 Circuit Breaker & Notabschaltung — Infrastruktur-Enforcer (scope-fähig).

Läuft UNABHÄNGIG vom Agenten (eigener systemd-Dienst). Nur Stdlib.

Neu ggü. der ersten Fassung: **geltungsbereich-getrennte Zählung** (§7-Namespace,
§12-Lücke geschlossen). Jeder /check darf ein Feld `scope` mitgeben (z. B.
"vps", "projekt/foo"); Budgets/Iterationen/Wiederholung/Fortschritt werden **pro
Scope** gezählt. Ein Breach in einem Scope pausiert nur diesen Scope. Default-
Scope ist "global" (rückwärtskompatibel).

Die Kernfunktion `evaluate()` arbeitet unverändert auf EINEM Scope-State — die
Scope-Verwaltung liegt in der State-/HTTP-Schicht. Dadurch bleiben die
ursprünglichen Unit-Tests gültig.

Endpunkte (nur localhost):
  POST /check   {"actor","tool","params","cost","state_hash","scope"?}
                -> {"allow","reason","paused","scope"}
  GET  /status[?scope=<s>]  -> Zustand (ein Scope oder alle)
  POST /reset   {"token","scope"?}  -> Reset eines Scopes oder aller
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, default))
    except ValueError:
        return default


def _env_float(name: str, default: float) -> float:
    try:
        return float(os.environ.get(name, default))
    except ValueError:
        return default


HOST = os.environ.get("CB_HOST", "127.0.0.1")
PORT = _env_int("CB_PORT", 8912)

STATE_PATH = Path(os.environ.get("CB_STATE_PATH", "/var/lib/circuit-breaker/state.json"))
LOG_PATH = Path(os.environ.get("CB_LOG_PATH", "/var/log/circuit-breaker/circuit-breaker.log"))

MAX_ITERATIONS_PER_RUN = _env_int("CB_MAX_ITERATIONS_PER_RUN", 200)
MAX_CALLS_PER_HOUR = _env_int("CB_MAX_CALLS_PER_HOUR", 500)
MAX_CALLS_PER_DAY = _env_int("CB_MAX_CALLS_PER_DAY", 3000)
MAX_BUDGET_PER_DAY = _env_float("CB_MAX_BUDGET_PER_DAY_EUR", 20.0)

REPETITION_WINDOW = _env_int("CB_REPETITION_WINDOW", 5)
REPETITION_THRESHOLD = _env_int("CB_REPETITION_THRESHOLD", 4)
PROGRESS_WINDOW = _env_int("CB_PROGRESS_WINDOW", 8)

RESET_TOKEN = os.environ.get("CB_RESET_TOKEN", "")
TARGET_UNIT = os.environ.get("CB_TARGET_SYSTEMD_UNIT", "")
DEFAULT_SCOPE = os.environ.get("CB_DEFAULT_SCOPE", "global")

STATE_LOCK = threading.Lock()


def _setup_logging() -> logging.Logger:
    logger = logging.getLogger("circuit-breaker")
    if logger.handlers:            # doppelte Handler bei Re-Import vermeiden
        return logger
    logger.setLevel(logging.INFO)
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    fh = logging.FileHandler(LOG_PATH)
    fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logger.addHandler(fh)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logger.addHandler(sh)
    return logger


log = _setup_logging()


# --- Scope-State (ein Geltungsbereich) -------------------------------------

def _default_state() -> dict:
    now = time.time()
    return {
        "run_start": now,
        "iteration_count": 0,
        "budget_spent_today": 0.0,
        "budget_day_start": now,
        "calls_hour": [],
        "calls_day": [],
        "recent_actions": [],
        "recent_states": [],
        "paused": False,
        "pause_reason": None,
        "paused_at": None,
    }


# --- Scope-Container (alle Geltungsbereiche) -------------------------------

def _default_container() -> dict:
    return {"scopes": {}}


def load_container() -> dict:
    if STATE_PATH.exists():
        try:
            data = json.loads(STATE_PATH.read_text())
            if isinstance(data, dict) and "scopes" in data:
                return data
            # Migration: alter Ein-Scope-State -> unter "global" einhängen
            if isinstance(data, dict) and "iteration_count" in data:
                return {"scopes": {DEFAULT_SCOPE: data}}
        except (json.JSONDecodeError, OSError) as exc:
            log.warning("State defekt (%s) — frischer Zustand.", exc)
    return _default_container()


def save_container(container: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = STATE_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(container))
    tmp.replace(STATE_PATH)


def scope_state(container: dict, scope: str) -> dict:
    return container["scopes"].setdefault(scope, _default_state())


def _hash(value) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, default=str).encode()).hexdigest()[:16]


# --- Kernlogik (unverändert, ein Scope) ------------------------------------

def evaluate(state: dict, actor: str, tool: str, params: dict, cost: float,
             state_hash: str | None, scope: str = DEFAULT_SCOPE):
    """Aktualisiert EINEN Scope-State; liefert (allow, reason)."""
    now = time.time()

    if state["paused"]:
        return False, f"bereits pausiert: {state['pause_reason']}"

    if now - state["budget_day_start"] > 86400:
        state["budget_day_start"] = now
        state["budget_spent_today"] = 0.0

    state["calls_hour"] = [t for t in state["calls_hour"] if now - t < 3600] + [now]
    state["calls_day"] = [t for t in state["calls_day"] if now - t < 86400] + [now]

    state["iteration_count"] += 1
    state["budget_spent_today"] += max(cost, 0.0)

    action_hash = _hash({"actor": actor, "tool": tool, "params": params})
    state["recent_actions"] = (state["recent_actions"] + [{"ts": now, "hash": action_hash}])[-max(REPETITION_WINDOW, PROGRESS_WINDOW):]
    if state_hash is not None:
        state["recent_states"] = (state["recent_states"] + [{"ts": now, "hash": state_hash}])[-PROGRESS_WINDOW:]

    if state["iteration_count"] > MAX_ITERATIONS_PER_RUN:
        return _breach(state, scope, f"Iterationsgrenze ({state['iteration_count']}/{MAX_ITERATIONS_PER_RUN})")
    if len(state["calls_hour"]) > MAX_CALLS_PER_HOUR:
        return _breach(state, scope, f"Stundenlimit ({len(state['calls_hour'])}/{MAX_CALLS_PER_HOUR})")
    if len(state["calls_day"]) > MAX_CALLS_PER_DAY:
        return _breach(state, scope, f"Tageslimit ({len(state['calls_day'])}/{MAX_CALLS_PER_DAY})")
    if state["budget_spent_today"] > MAX_BUDGET_PER_DAY:
        return _breach(state, scope, f"Tagesbudget ({state['budget_spent_today']:.2f}/{MAX_BUDGET_PER_DAY:.2f} EUR)")

    last_n = state["recent_actions"][-REPETITION_THRESHOLD:]
    if len(last_n) == REPETITION_THRESHOLD and len({a["hash"] for a in last_n}) == 1:
        return _breach(state, scope, f"identische Aktion {REPETITION_THRESHOLD}x in Folge (Tool={tool})")

    rs = state["recent_states"]
    if len(rs) == PROGRESS_WINDOW and len({s["hash"] for s in rs}) == 1:
        return _breach(state, scope, f"kein Zustandswechsel über {PROGRESS_WINDOW} Schritte")

    return True, None


def _breach(state: dict, scope: str, reason: str):
    state["paused"] = True
    state["pause_reason"] = reason
    state["paused_at"] = time.time()
    log.warning("CIRCUIT BREAKER AUSGELÖST [scope=%s]: %s", scope, reason)
    _try_stop_target_unit(scope, reason)
    return False, reason


def _try_stop_target_unit(scope: str, reason: str) -> None:
    if not TARGET_UNIT:
        log.info("Kein CB_TARGET_SYSTEMD_UNIT — nur Sperre gesetzt [scope=%s].", scope)
        return
    try:
        subprocess.run(["systemctl", "stop", TARGET_UNIT], check=True, timeout=10,
                       capture_output=True, text=True)
        log.warning("Ziel-Unit '%s' gestoppt [scope=%s]: %s", TARGET_UNIT, scope, reason)
    except FileNotFoundError:
        log.error("systemctl nicht gefunden.")
    except subprocess.CalledProcessError as exc:
        log.error("systemctl stop '%s' fehlgeschlagen: %s", TARGET_UNIT, exc.stderr)
    except subprocess.TimeoutExpired:
        log.error("systemctl stop '%s' Timeout.", TARGET_UNIT)


def _scope_view(state: dict) -> dict:
    return {
        "paused": state["paused"],
        "pause_reason": state["pause_reason"],
        "iteration_count": state["iteration_count"],
        "calls_last_hour": len(state["calls_hour"]),
        "calls_last_day": len(state["calls_day"]),
        "budget_spent_today_eur": round(state["budget_spent_today"], 4),
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "CircuitBreaker/2.0"

    def _send_json(self, code: int, payload: dict) -> None:
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", 0))
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length))

    def do_GET(self):
        if self.path.split("?")[0] == "/status":
            scope = None
            if "?" in self.path:
                from urllib.parse import parse_qs
                scope = parse_qs(self.path.split("?", 1)[1]).get("scope", [None])[0]
            with STATE_LOCK:
                container = load_container()
            limits = {
                "max_iterations_per_run": MAX_ITERATIONS_PER_RUN,
                "max_calls_per_hour": MAX_CALLS_PER_HOUR,
                "max_calls_per_day": MAX_CALLS_PER_DAY,
                "max_budget_per_day_eur": MAX_BUDGET_PER_DAY,
            }
            if scope:
                st = container["scopes"].get(scope) or _default_state()
                self._send_json(200, {"scope": scope, **_scope_view(st), "limits": limits})
            else:
                self._send_json(200, {
                    "scopes": {s: _scope_view(st) for s, st in container["scopes"].items()},
                    "any_paused": any(st["paused"] for st in container["scopes"].values()),
                    "limits": limits,
                })
        else:
            self._send_json(404, {"error": "unknown endpoint"})

    def do_POST(self):
        try:
            body = self._read_json()
        except json.JSONDecodeError:
            self._send_json(400, {"error": "invalid json"})
            return

        if self.path == "/check":
            scope = str(body.get("scope", DEFAULT_SCOPE))
            actor = str(body.get("actor", "unknown"))
            tool = str(body.get("tool", "unknown"))
            params = body.get("params", {})
            cost = float(body.get("cost", 0.0))
            state_hash = body.get("state_hash")
            with STATE_LOCK:
                container = load_container()
                st = scope_state(container, scope)
                allow, reason = evaluate(st, actor, tool, params, cost, state_hash, scope=scope)
                save_container(container)
            self._send_json(200, {"allow": allow, "reason": reason, "paused": st["paused"], "scope": scope})

        elif self.path == "/reset":
            token = str(body.get("token", ""))
            if not RESET_TOKEN or token != RESET_TOKEN:
                log.warning("Reset-Versuch mit ungültigem/fehlendem Token abgelehnt.")
                self._send_json(403, {"error": "invalid token"})
                return
            scope = body.get("scope")
            with STATE_LOCK:
                container = load_container()
                if scope:
                    container["scopes"][scope] = _default_state()
                else:
                    container = _default_container()
                save_container(container)
            log.warning("Reset durchgeführt (scope=%s).", scope or "ALL")
            self._send_json(200, {"status": "reset", "scope": scope or "ALL"})

        else:
            self._send_json(404, {"error": "unknown endpoint"})

    def log_message(self, format, *args):  # noqa: A002
        return


def main() -> None:
    with STATE_LOCK:
        if not STATE_PATH.exists():
            save_container(_default_container())
    log.info("circuit-breaker v2 (scope-fähig) auf %s:%s (Iter<=%s, Std<=%s, Tag<=%s, Budget<=%.2f EUR, Ziel-Unit=%r)",
             HOST, PORT, MAX_ITERATIONS_PER_RUN, MAX_CALLS_PER_HOUR, MAX_CALLS_PER_DAY, MAX_BUDGET_PER_DAY, TARGET_UNIT or None)
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
