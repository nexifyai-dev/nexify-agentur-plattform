#!/usr/bin/env python3
# FILE: /opt/nexifyai/scripts/hermes-dash-proxy.py
# NIR: 2026-07-28 10:30
# NAME: NeXifyAI Core
# WHAT: Threaded Reverse-Proxy — Host-Header-Rewrite für Hermes Dashboard hinter CF-Tunnel
# WHY: Hermes Dashboard (Vite) lehnt CF-Tunnel Host-Header ab → Proxy setzt Host:localhost
# DEPENDS: Hermes Dashboard auf localhost:9118
# OPTIMIZED: ThreadingTCPServer (parallel), Streaming (RAM-safe), /health endpoint
# PITFALL: HTTP/1.0-style Connection:close — kein Keep-Alive im Proxy (by design)

import http.server
import socketserver
import urllib.request
import urllib.error
import sys
import os

TARGET_PORT = int(os.environ.get("PROXY_TARGET_PORT", "9118"))
TARGET_HOST = os.environ.get("PROXY_TARGET_HOST", "127.0.0.1")
LISTEN_PORT = int(os.environ.get("PROXY_LISTEN_PORT", "9119"))
LISTEN_HOST = os.environ.get("PROXY_LISTEN_HOST", "127.0.0.1")
CHUNK = 65536


class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self._health()
            return
        self._proxy_request()

    def _health(self):
        """Health-Check — prüft ob Dashboard erreichbar."""
        try:
            req = urllib.request.Request(
                f"http://{TARGET_HOST}:{TARGET_PORT}/", headers={"Host": "localhost"}
            )
            resp = urllib.request.urlopen(req, timeout=5)
            status = "ok" if resp.status in (200, 302, 304) else "degraded"
            resp.close()
        except Exception:
            status = "down"

        self.send_response(200 if status == "ok" else 503)
        self.send_header("Content-Type", "application/json")
        self.send_header("Connection", "close")
        self.end_headers()
        import json

        payload = json.dumps(
            {
                "status": status,
                "target": f"{TARGET_HOST}:{TARGET_PORT}",
                "proxy": f"{LISTEN_HOST}:{LISTEN_PORT}",
            }
        )
        self.wfile.write(payload.encode())

    def _proxy_request(self):
        """Forward request to dashboard with Host:localhost rewrite."""
        try:
            self._do_proxy()
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(e.read())
        except Exception as e:
            self.send_response(502)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(f"Proxy Error: {e}".encode())

    def _do_proxy(self):
        target_url = f"http://{TARGET_HOST}:{TARGET_PORT}{self.path}"

        # Headers kopieren + Host-Rewrite
        headers = {}
        for key, val in self.headers.items():
            headers[key] = val
        headers["Host"] = "localhost"

        # Entferne Header die den Origin verwirren
        for bad in (
            "X-Forwarded-Host",
            "X-Forwarded-Server",
            "X-Forwarded-For",
            "X-Real-Ip",
            "Cf-Connecting-Ip",
            "Cf-Ipcountry",
        ):
            headers.pop(bad, None)

        # Body lesen (nur bei schreibenden Methoden)
        data = None
        if self.command in ("POST", "PUT", "PATCH"):
            length = int(headers.get("Content-Length", 0))
            if length > 0 and length < 10 * 1024 * 1024:  # Max 10MB
                data = self.rfile.read(length)
            # Content-Length wird von urllib automatisch gesetzt — Konflikt vermeiden
            headers.pop("Content-Length", None)

        req = urllib.request.Request(
            target_url, data=data, headers=headers, method=self.command
        )

        resp = urllib.request.urlopen(req, timeout=30)

        # Response-Status
        self.send_response(resp.status)

        # Response-Header forwarden (Hop-by-Hop filtern)
        skip = {
            "connection",
            "keep-alive",
            "proxy-authenticate",
            "proxy-authorization",
            "te",
            "trailers",
            "transfer-encoding",
            "upgrade",
        }

        content_length = None
        is_chunked = False

        for key, val in resp.getheaders():
            low = key.lower()
            if low in skip:
                continue
            if low == "content-length":
                content_length = val
            if low == "transfer-encoding" and "chunked" in val.lower():
                is_chunked = True
            self.send_header(key, val)

        # Connection-Management
        if not content_length and not is_chunked:
            self.send_header("Connection", "close")
        else:
            self.send_header("Connection", "close")  # Explicit close — no keep-alive

        self.end_headers()

        # Body streamen (RAM-safe)
        while True:
            chunk = resp.read(CHUNK)
            if not chunk:
                break
            self.wfile.write(chunk)

        resp.close()

    # Alle HTTP-Methoden
    def do_POST(self):
        self._proxy_request()

    def do_PUT(self):
        self._proxy_request()

    def do_PATCH(self):
        self._proxy_request()

    def do_DELETE(self):
        self._proxy_request()

    def do_HEAD(self):
        self._proxy_request()

    def do_OPTIONS(self):
        self._proxy_request()

    def log_message(self, format, *args):
        if args[1] not in ("200", "304"):
            sys.stderr.write(f"[proxy] {self.client_address[0]} - {format % args}\n")

    # Suppress version_string (security — hide Python version)
    def version_string(self):
        return "NeXifyAI/HermesDashProxy"


class ThreadingProxyServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 128


if __name__ == "__main__":
    os.environ.pop("HERMES_HOME", None)
    server = ThreadingProxyServer((LISTEN_HOST, LISTEN_PORT), ProxyHandler)
    print(
        f"Proxy listening on {LISTEN_HOST}:{LISTEN_PORT} → {TARGET_HOST}:{TARGET_PORT} "
        f"(threaded, backlog={server.request_queue_size})"
    )
    server.serve_forever()
