#!/usr/bin/env python3
"""Unit-Tests für den Cloud-Agents-API-Client (gemockt, keine echten HTTP-Calls).

Reine Stdlib (unittest), damit es ohne Zusatzpakete auf dem VPS/CI läuft:
    python3 -m unittest test_client -v
"""
from __future__ import annotations

import base64
import io
import json
import unittest
import urllib.error

from client import CursorAgentsClient, CursorAgentsError


class FakeResponse(io.BytesIO):
    """Kontextmanager-fähige Fake-HTTP-Antwort."""

    def __init__(self, payload):
        super().__init__(payload if isinstance(payload, bytes) else json.dumps(payload).encode())

    def __enter__(self):
        return self

    def __exit__(self, *a):
        self.close()
        return False


class RecordingOpener:
    """Fängt Requests ab und liefert vorbereitete Antworten."""

    def __init__(self, response=None, sse_lines=None, http_error=None):
        self.requests = []
        self._response = response if response is not None else {}
        self._sse_lines = sse_lines
        self._http_error = http_error

    def __call__(self, req, timeout=None):
        self.requests.append(req)
        if self._http_error is not None:
            raise self._http_error
        if self._sse_lines is not None:
            return FakeResponse(b"".join(self._sse_lines))
        return FakeResponse(self._response)


class ClientTests(unittest.TestCase):
    def _client(self, **kw):
        op = RecordingOpener(**kw)
        return CursorAgentsClient(api_key="TESTKEY", opener=op), op

    def test_missing_key_raises(self):
        import os
        old = os.environ.pop("CURSOR_API_KEY", None)
        try:
            with self.assertRaises(ValueError):
                CursorAgentsClient(api_key=None)
        finally:
            if old is not None:
                os.environ["CURSOR_API_KEY"] = old

    def test_basic_auth_header(self):
        c, op = self._client(response={"ok": True})
        c.me()
        got = op.requests[0].headers["Authorization"]
        self.assertEqual(got, "Basic " + base64.b64encode(b"TESTKEY:").decode())

    def test_bearer_auth_header(self):
        op = RecordingOpener(response={"ok": True})
        c = CursorAgentsClient(api_key="TESTKEY", auth="bearer", opener=op)
        c.me()
        self.assertEqual(op.requests[0].headers["Authorization"], "Bearer TESTKEY")

    def test_create_agent_body_and_path(self):
        c, op = self._client(response={"agent": {"id": "bc-1"}})
        c.create_agent("do it", repos=[{"url": "https://github.com/x/y", "startingRef": "main"}],
                       model={"id": "composer-2"}, auto_create_pr=True)
        req = op.requests[0]
        self.assertEqual(req.method, "POST")
        self.assertTrue(req.full_url.endswith("/v1/agents"))
        body = json.loads(req.data)
        self.assertEqual(body["prompt"]["text"], "do it")
        self.assertEqual(body["model"]["id"], "composer-2")
        self.assertTrue(body["autoCreatePR"])
        self.assertEqual(body["repos"][0]["url"], "https://github.com/x/y")

    def test_list_agents_query_encoding(self):
        c, op = self._client(response={"items": []})
        c.list_agents(limit=10, include_archived=False)
        url = op.requests[0].full_url
        self.assertIn("limit=10", url)
        self.assertIn("includeArchived=false", url)

    def test_get_run_path(self):
        c, op = self._client(response={"id": "run-1", "status": "FINISHED"})
        out = c.get_run("bc-1", "run-1")
        self.assertEqual(out["status"], "FINISHED")
        self.assertTrue(op.requests[0].full_url.endswith("/v1/agents/bc-1/runs/run-1"))

    def test_cancel_run_is_post(self):
        c, op = self._client(response={"id": "run-1"})
        c.cancel_run("bc-1", "run-1")
        self.assertEqual(op.requests[0].method, "POST")
        self.assertTrue(op.requests[0].full_url.endswith("/runs/run-1/cancel"))

    def test_http_error_is_wrapped(self):
        err = urllib.error.HTTPError(
            url="x", code=409, msg="Conflict", hdrs=None,
            fp=io.BytesIO(json.dumps({"error": {"code": "agent_busy", "message": "busy"}}).encode()),
        )
        c, op = self._client(http_error=err)
        with self.assertRaises(CursorAgentsError) as ctx:
            c.get_agent("bc-1")
        self.assertEqual(ctx.exception.status, 409)
        self.assertEqual(ctx.exception.code, "agent_busy")

    def test_stream_parses_sse_events(self):
        sse = [
            b"event: status\n", b'data: {"runId":"run-1","status":"RUNNING"}\n', b"id: 1-0\n", b"\n",
            b"event: assistant\n", b'data: {"text":"hi"}\n', b"id: 2-0\n", b"\n",
            b"event: done\n", b"data: {}\n", b"\n",
        ]
        c, op = self._client(sse_lines=sse)
        events = list(c.stream_run("bc-1", "run-1"))
        self.assertEqual(events[0]["event"], "status")
        self.assertEqual(events[0]["data"]["status"], "RUNNING")
        self.assertEqual(events[1]["data"]["text"], "hi")
        self.assertEqual(events[-1]["event"], "done")
        self.assertEqual(op.requests[0].headers["Accept"], "text/event-stream")


if __name__ == "__main__":
    unittest.main(verbosity=2)
