#!/usr/bin/env python3
# FILE: apps/webui-preview/lightrag-panel/serve.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Preview static server + same-origin proxy to LightRAG Origin :9622
# WHY: Parität AgentMemory-Panel; CORS-frei ohne Prod Hermes Cutover
# BEST-PRACTICE: Proxy /lightrag/* → upstream root paths; forward X-API-Key; never log secrets
# PITFALL: Bridge :9621 auth differs — Origin :9622 + X-API-Key is SoT for inserts
# DEPENDS: LIGHTRAG_URL (default http://127.0.0.1:9622)
# DOCS-REF: apps/webui-preview/agentmemory-panel/README.md · Issue #141
# SESSION: production-readiness-close-7dd5

"""Preview-only LightRAG panel server (prod_patch_allowed: false)."""

from __future__ import annotations

import http.client
import http.server
import os
import socketserver
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
UPSTREAM = os.environ.get("LIGHTRAG_URL", "http://127.0.0.1:9622").rstrip("/")
PORT = int(os.environ.get("LR_PANEL_PORT", "8793"))
HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        sys_stderr = __import__("sys").stderr
        path = getattr(self, "path", "")
        safe = path.split("?", 1)[0]
        sys_stderr.write("%s - %s\n" % (self.address_string(), safe))

    def _proxy(self) -> None:
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/lightrag/"):
            self.send_error(404, "Only /lightrag/* is proxied")
            return
        upstream_path = parsed.path[len("/lightrag") :] or "/"
        target = UPSTREAM + upstream_path
        if parsed.query:
            target += "?" + parsed.query
        length = int(self.headers.get("Content-Length", "0") or 0)
        body = self.rfile.read(length) if length > 0 else None
        req = urllib.request.Request(target, data=body, method=self.command)
        for key, value in self.headers.items():
            if key.lower() in HOP_BY_HOP:
                continue
            req.add_header(key, value)
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                payload = resp.read()
                self.send_response(resp.status)
                for key, value in resp.headers.items():
                    if key.lower() in HOP_BY_HOP:
                        continue
                    self.send_header(key, value)
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(payload)
        except urllib.error.HTTPError as err:
            payload = err.read()
            self.send_response(err.code)
            self.send_header(
                "Content-Type", err.headers.get("Content-Type", "application/json")
            )
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)
        except (urllib.error.URLError, TimeoutError, http.client.HTTPException) as err:
            msg = (
                '{"error":"upstream_unreachable","detail":%r}' % (str(err),)
            ).encode()
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(msg)))
            self.end_headers()
            self.wfile.write(msg)

    def do_GET(self) -> None:  # noqa: N802
        if self.path.startswith("/lightrag/"):
            self._proxy()
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path.startswith("/lightrag/"):
            self._proxy()
            return
        self.send_error(405, "POST only for /lightrag/*")

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "X-API-Key, Authorization, Content-Type")
        self.end_headers()


def main() -> None:
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"LightRAG panel preview http://127.0.0.1:{PORT}/")
        print(f"Proxy /lightrag/* → {UPSTREAM}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
