#!/usr/bin/env python3
# FILE: apps/webui-preview/agentmemory-panel/serve.py
# NIR: 02.08.2026 08:55
# UPDATED: 02.08.2026 08:55
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Preview static server + same-origin proxy to AgentMemory REST :3111
# WHY: Browser CORS blocks direct :8792 → :3111; preview must call real REST without Prod Hermes patch
# BEST-PRACTICE: Reverse-proxy only /agentmemory/*; forward Authorization; never log secrets
# PITFALL: V-AM-CORS: raw http.server cannot reach :3111 from browser without this proxy
# DEPENDS: AGENTMEMORY_URL (default http://127.0.0.1:3111), optional AGENTMEMORY_SECRET via client Bearer
# DOCS-REF: https://agent-memory.dev/ · apps/webui-preview/agentmemory-panel/README.md
# SESSION: hermes-ui-decision-followup

"""Preview-only AgentMemory panel server (prod_patch_allowed: false)."""

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
UPSTREAM = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111").rstrip("/")
PORT = int(os.environ.get("AM_PANEL_PORT", "8792"))
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
        # Avoid echoing Authorization / bodies
        sys_stderr = __import__("sys").stderr
        path = getattr(self, "path", "")
        safe = path.split("?", 1)[0]
        sys_stderr.write("%s - %s\n" % (self.address_string(), safe))

    def _proxy(self) -> None:
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/agentmemory/"):
            self.send_error(404, "Only /agentmemory/* is proxied")
            return
        target = UPSTREAM + parsed.path
        if parsed.query:
            target += "?" + parsed.query
        length = int(self.headers.get("Content-Length", "0") or 0)
        body = self.rfile.read(length) if length > 0 else None
        req = urllib.request.Request(target, data=body, method=self.command)
        for key, value in self.headers.items():
            lk = key.lower()
            if lk in HOP_BY_HOP:
                continue
            req.add_header(key, value)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
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
        if self.path.startswith("/agentmemory/"):
            self._proxy()
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path.startswith("/agentmemory/"):
            self._proxy()
            return
        self.send_error(405, "POST only for /agentmemory/*")

    def do_PUT(self) -> None:  # noqa: N802
        if self.path.startswith("/agentmemory/"):
            self._proxy()
            return
        self.send_error(405)

    def do_DELETE(self) -> None:  # noqa: N802
        if self.path.startswith("/agentmemory/"):
            self._proxy()
            return
        self.send_error(405)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
        )
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.end_headers()


def main() -> None:
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"AgentMemory panel preview http://127.0.0.1:{PORT}/")
        print(f"Proxy /agentmemory/* → {UPSTREAM}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
