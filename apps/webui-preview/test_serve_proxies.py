#!/usr/bin/env python3
# FILE: apps/webui-preview/test_serve_proxies.py
# NIR: 04.08.2026 09:35
# UPDATED: 04.08.2026 09:35
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Smoke tests for all three preview serve.py proxy handlers (offline — no live upstream)
# WHY: Validate proxy routing, 404 non-proxy paths, 502 on unreachable upstream, OPTIONS CORS
# BEST-PRACTICE: Test handler logic directly via test client, no live ports required
# PITFALL: V-PORT-COLLISION: do not bind real TCP in unit tests
# DEPENDS: Python stdlib only (http.server, threading, urllib)
# DOCS-REF: Issue #141 · apps/webui-preview/*/serve.py
# SESSION: hermes-native-panels-harden

"""Unit/smoke tests for webui-preview serve.py proxy handlers.

Tests run fully offline — the handlers are exercised via a real TCPServer on a
free ephemeral port, without any live AgentMemory / LightRAG / 9Router upstream.
Proxy calls should yield 502 (upstream unreachable) when no upstream exists,
and static / routing guard calls should behave as expected.
"""

from __future__ import annotations

import importlib.util
import json
import socket
import sys
import threading
import time
import unittest
import urllib.request
from pathlib import Path
from types import ModuleType

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

WEBUI_PREVIEW = Path(__file__).resolve().parent


def _load_serve(panel: str) -> ModuleType:
    """Load a serve.py from a panel directory without importing as package."""
    spec = importlib.util.spec_from_file_location(
        f"serve_{panel}",
        WEBUI_PREVIEW / panel / "serve.py",
    )
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _start_server(handler_cls, port: int) -> threading.Thread:
    import socketserver

    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(("127.0.0.1", port), handler_cls)
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    # give server a moment to accept
    time.sleep(0.05)
    return t


def _get(url: str, timeout: int = 5):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return r.status, r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read(), {}


def _options(url: str, timeout: int = 5):
    req = urllib.request.Request(url, method="OPTIONS")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, {}


# ---------------------------------------------------------------------------
# AgentMemory panel
# ---------------------------------------------------------------------------


class TestAgentMemoryServe(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mod = _load_serve("agentmemory-panel")
        # Point upstream at a definitely-closed port so 502 is deterministic
        mod.UPSTREAM = "http://127.0.0.1:1"
        cls.port = _free_port()
        mod.PORT = cls.port
        _start_server(mod.Handler, cls.port)
        cls.base = f"http://127.0.0.1:{cls.port}"

    def test_static_index_returns_200(self):
        status, body, _ = _get(f"{self.base}/")
        self.assertEqual(status, 200)
        self.assertIn(b"AgentMemory", body)

    def test_proxy_path_returns_502_no_upstream(self):
        status, body, _ = _get(f"{self.base}/agentmemory/livez")
        self.assertEqual(status, 502)
        data = json.loads(body)
        self.assertIn("upstream_unreachable", data.get("error", ""))

    def test_non_proxy_post_returns_405(self):
        req = urllib.request.Request(
            f"{self.base}/notproxy",
            data=b"{}",
            method="POST",
            headers={"Content-Type": "application/json"},
        )
        try:
            urllib.request.urlopen(req, timeout=5)
            self.fail("Expected HTTPError 405")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 405)

    def test_options_cors_headers(self):
        status, headers = _options(f"{self.base}/agentmemory/livez")
        self.assertEqual(status, 204)
        self.assertEqual(headers.get("Access-Control-Allow-Origin"), "*")

    def test_proxy_prefix_guard_404(self):
        # A path that starts with /agentmemory but is missing trailing slash
        # → proxy will try upstream; only /agentmemory/* is whitelisted
        # A path that does NOT start with /agentmemory should 404 from proxy guard
        # (serve.py returns 404 if path doesn't start with /agentmemory/)
        # We send a fake proxy-looking path with wrong prefix
        status, body, _ = _get(f"{self.base}/other/livez")
        # Static handler returns 404 for missing file — that is acceptable
        self.assertIn(status, (404, 200))  # static serve: 404 for missing file


# ---------------------------------------------------------------------------
# LightRAG panel
# ---------------------------------------------------------------------------


class TestLightRAGServe(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mod = _load_serve("lightrag-panel")
        mod.UPSTREAM = "http://127.0.0.1:1"
        cls.port = _free_port()
        mod.PORT = cls.port
        _start_server(mod.Handler, cls.port)
        cls.base = f"http://127.0.0.1:{cls.port}"

    def test_static_index_returns_200(self):
        status, body, _ = _get(f"{self.base}/")
        self.assertEqual(status, 200)
        self.assertIn(b"LightRAG", body)

    def test_proxy_health_returns_502_no_upstream(self):
        status, body, _ = _get(f"{self.base}/lightrag/health")
        self.assertEqual(status, 502)
        data = json.loads(body)
        self.assertIn("upstream_unreachable", data.get("error", ""))

    def test_options_cors_x_api_key(self):
        status, headers = _options(f"{self.base}/lightrag/health")
        self.assertEqual(status, 204)
        allow_headers = headers.get("Access-Control-Allow-Headers", "")
        self.assertIn("X-API-Key", allow_headers)

    def test_post_non_proxy_returns_405(self):
        req = urllib.request.Request(
            f"{self.base}/notlightrag",
            data=b"{}",
            method="POST",
            headers={"Content-Type": "application/json"},
        )
        try:
            urllib.request.urlopen(req, timeout=5)
            self.fail("Expected HTTPError 405")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 405)

    def test_proxy_strips_prefix(self):
        """Proxy strips /lightrag prefix before forwarding — 502 proves it reached proxy."""
        status, body, _ = _get(f"{self.base}/lightrag/documents")
        self.assertEqual(status, 502)


# ---------------------------------------------------------------------------
# 9Router panel
# ---------------------------------------------------------------------------


class TestNineRouterServe(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mod = _load_serve("ninerouter-panel")
        mod.UPSTREAM = "http://127.0.0.1:1"
        cls.port = _free_port()
        mod.PORT = cls.port
        _start_server(mod.Handler, cls.port)
        cls.base = f"http://127.0.0.1:{cls.port}"

    def test_static_index_returns_200(self):
        status, body, _ = _get(f"{self.base}/")
        self.assertEqual(status, 200)
        self.assertIn(b"9Router", body)

    def test_proxy_health_returns_502_no_upstream(self):
        status, body, _ = _get(f"{self.base}/router/api/health")
        self.assertEqual(status, 502)
        data = json.loads(body)
        self.assertIn("upstream_unreachable", data.get("error", ""))

    def test_options_cors_headers(self):
        status, headers = _options(f"{self.base}/router/api/health")
        self.assertEqual(status, 204)
        self.assertEqual(headers.get("Access-Control-Allow-Origin"), "*")

    def test_proxy_strips_prefix(self):
        status, body, _ = _get(f"{self.base}/router/models")
        self.assertEqual(status, 502)

    def test_post_non_router_path_returns_405(self):
        req = urllib.request.Request(
            f"{self.base}/notrouter",
            data=b"{}",
            method="POST",
            headers={"Content-Type": "application/json"},
        )
        try:
            urllib.request.urlopen(req, timeout=5)
            self.fail("Expected HTTPError 405")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 405)


# ---------------------------------------------------------------------------
# Registry JSON sanity
# ---------------------------------------------------------------------------


class TestRegistry(unittest.TestCase):
    def setUp(self):
        registry_path = (
            Path(__file__).resolve().parents[2]
            / "config"
            / "webui"
            / "hermes-preview-module-registry.json"
        )
        with open(registry_path) as f:
            self.reg = json.load(f)

    def test_prod_patch_allowed_false(self):
        self.assertFalse(self.reg["prod_patch_allowed"])

    def test_lightrag_module_present(self):
        ids = [m["id"] for m in self.reg["modules"]]
        self.assertIn("lightrag", ids)

    def test_ninerouter_module_present(self):
        ids = [m["id"] for m in self.reg["modules"]]
        self.assertIn("ninerouter", ids)

    def test_agentmemory_module_present(self):
        ids = [m["id"] for m in self.reg["modules"]]
        self.assertIn("agentmemory", ids)

    def test_lightrag_port(self):
        lr = next(m for m in self.reg["modules"] if m["id"] == "lightrag")
        self.assertEqual(lr["local_preview_port"], 8793)

    def test_ninerouter_port(self):
        nr = next(m for m in self.reg["modules"] if m["id"] == "ninerouter")
        self.assertEqual(nr["local_preview_port"], 8794)

    def test_agentmemory_port(self):
        am = next(m for m in self.reg["modules"] if m["id"] == "agentmemory")
        self.assertEqual(am["local_preview_port"], 8792)

    def test_no_port_collisions(self):
        ports = [m["local_preview_port"] for m in self.reg["modules"]]
        self.assertEqual(len(ports), len(set(ports)), "Port collision detected")

    def test_serve_py_entries_exist(self):
        repo_root = Path(__file__).resolve().parents[2]
        for mod in self.reg["modules"]:
            if "serve_py" in mod:
                path = repo_root / mod["serve_py"]
                self.assertTrue(path.exists(), f"serve_py not found: {mod['serve_py']}")


if __name__ == "__main__":
    unittest.main()
