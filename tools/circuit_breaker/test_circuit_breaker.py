#!/usr/bin/env python3
"""Tests für den scope-fähigen Circuit Breaker (Stdlib, gemockt, keine echten
systemctl-Calls). Enthält die ursprünglichen Kernlogik-Tests (rückwärts-
kompatibel) plus neue Tests für die geltungsbereich-getrennte Zählung (§12/§7).

    python3 -m unittest test_circuit_breaker -v
"""
from __future__ import annotations

import os
import sys
import unittest
from unittest import mock

sys.path.insert(0, os.path.dirname(__file__))


class CoreLogicTests(unittest.TestCase):
    """Rückwärtskompatibel — evaluate() auf einem Scope-State."""

    def setUp(self):
        os.environ.update({
            "CB_MAX_ITERATIONS_PER_RUN": "5", "CB_MAX_CALLS_PER_HOUR": "100",
            "CB_MAX_CALLS_PER_DAY": "1000", "CB_MAX_BUDGET_PER_DAY_EUR": "1.0",
            "CB_REPETITION_WINDOW": "5", "CB_REPETITION_THRESHOLD": "3",
            "CB_PROGRESS_WINDOW": "4", "CB_TARGET_SYSTEMD_UNIT": "",
        })
        if "circuit_breaker" in sys.modules:
            del sys.modules["circuit_breaker"]
        import circuit_breaker as cb
        self.cb = cb
        self.state = cb._default_state()

    def test_normal_call_is_allowed(self):
        allow, reason = self.cb.evaluate(self.state, "a", "read", {"p": "/x"}, 0.01, "s1")
        self.assertTrue(allow)
        self.assertIsNone(reason)

    def test_iteration_limit_breached(self):
        for i in range(10):
            allow, reason = self.cb.evaluate(self.state, "a", "write", {"i": i}, 0.0, f"s{i}")
        self.assertFalse(allow)
        self.assertIn("Iterationsgrenze", reason)
        self.assertTrue(self.state["paused"])

    def test_budget_limit_breached(self):
        for i in range(5):
            allow, reason = self.cb.evaluate(self.state, "a", "llm", {"i": i}, 0.5, f"s{i}")
        self.assertFalse(allow)
        self.assertIn("Tagesbudget", reason)

    def test_repetition_detected(self):
        for i in range(4):
            allow, reason = self.cb.evaluate(self.state, "a", "sh", {"cmd": "curl x"}, 0.0, f"s{i}")
        self.assertFalse(allow)
        self.assertIn("identische Aktion", reason)

    def test_repetition_not_triggered_when_params_vary(self):
        allow = True
        for i in range(4):
            allow, _ = self.cb.evaluate(self.state, "a", "sh", {"cmd": f"curl x/{i}"}, 0.0, f"s{i}")
        self.assertTrue(allow)

    def test_progress_stall_detected(self):
        for i in range(6):
            allow, reason = self.cb.evaluate(self.state, "a", "poll", {"i": i}, 0.0, "SAME")
        self.assertFalse(allow)
        self.assertIn("kein Zustandswechsel", reason)

    def test_once_paused_stays_blocked(self):
        for i in range(10):
            self.cb.evaluate(self.state, "a", "write", {"i": i}, 0.0, f"s{i}")
        allow, reason = self.cb.evaluate(self.state, "a", "other", {}, 0.0, "s99")
        self.assertFalse(allow)
        self.assertIn("bereits pausiert", reason)

    @mock.patch("subprocess.run")
    def test_target_unit_stop_called_on_breach(self, mock_run):
        os.environ["CB_TARGET_SYSTEMD_UNIT"] = "hermes.service"
        del sys.modules["circuit_breaker"]
        import circuit_breaker as cb
        state = cb._default_state()
        for i in range(10):
            cb.evaluate(state, "a", "write", {"i": i}, 0.0, f"s{i}")
        mock_run.assert_called_once()
        self.assertEqual(mock_run.call_args[0][0], ["systemctl", "stop", "hermes.service"])


class ScopeSeparationTests(unittest.TestCase):
    """Neu (§12/§7): geltungsbereich-getrennte Zählung."""

    def setUp(self):
        os.environ.update({
            "CB_MAX_ITERATIONS_PER_RUN": "3", "CB_MAX_CALLS_PER_HOUR": "1000",
            "CB_MAX_CALLS_PER_DAY": "10000", "CB_MAX_BUDGET_PER_DAY_EUR": "100",
            "CB_REPETITION_THRESHOLD": "999", "CB_PROGRESS_WINDOW": "999",
            "CB_TARGET_SYSTEMD_UNIT": "",
        })
        if "circuit_breaker" in sys.modules:
            del sys.modules["circuit_breaker"]
        import circuit_breaker as cb
        self.cb = cb

    def test_scope_state_isolated(self):
        c = self.cb._default_container()
        a = self.cb.scope_state(c, "projekt/a")
        b = self.cb.scope_state(c, "projekt/b")
        self.assertIsNot(a, b)
        self.assertEqual(set(c["scopes"]), {"projekt/a", "projekt/b"})

    def test_breach_in_one_scope_does_not_pause_other(self):
        c = self.cb._default_container()
        a = self.cb.scope_state(c, "projekt/a")
        b = self.cb.scope_state(c, "projekt/b")
        # Scope A über Iterationslimit treiben (>3)
        for i in range(5):
            self.cb.evaluate(a, "ag", "t", {"i": i}, 0.0, f"s{i}", scope="projekt/a")
        self.assertTrue(a["paused"])
        # Scope B unberührt -> weiterhin erlaubt
        allow, reason = self.cb.evaluate(b, "ag", "t", {"x": 1}, 0.0, "sx", scope="projekt/b")
        self.assertTrue(allow)
        self.assertFalse(b["paused"])

    def test_container_migrates_legacy_single_scope(self):
        # Alt-Format (Ein-Scope-State) wird unter DEFAULT_SCOPE eingehängt.
        import json, tempfile, importlib
        legacy = self.cb._default_state()
        legacy["iteration_count"] = 7
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, "state.json")
            open(p, "w").write(json.dumps(legacy))
            os.environ["CB_STATE_PATH"] = p
            del sys.modules["circuit_breaker"]
            import circuit_breaker as cb
            cont = cb.load_container()
            self.assertIn(cb.DEFAULT_SCOPE, cont["scopes"])
            self.assertEqual(cont["scopes"][cb.DEFAULT_SCOPE]["iteration_count"], 7)
        os.environ.pop("CB_STATE_PATH", None)


if __name__ == "__main__":
    unittest.main(verbosity=2)
