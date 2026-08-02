#!/usr/bin/env python3
# FILE: scripts/event-ingest/webhook_receiver_stub.py
# NIR: 02.08.2026 08:30
# UPDATED: 02.08.2026 08:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: VPS Webhook-Ingest Stub → repository_dispatch / Cloud Agent / AgentMemory.
# WHY: Slack/Linear/Sentry/Vercel/Health müssen ohne Desktop in Cursor einlaufen.
# BEST-PRACTICE: Shared-secret header; normalize → GitHub repository_dispatch.
# PITFALL: V-WH-01: Keine Secrets in Logs; dedupe_key Pflicht.
# DEPENDS: EVENT_INGEST_SHARED_SECRET, GITHUB_TOKEN|GH_PAT, CURSOR_API_KEY (optional)
# DOCS-REF: docs/operations/CLOUD-AGENT-EVENT-INGEST.md
# SESSION: cloud-agent-event-ingest-7dd5
"""Minimal stdlib HTTP webhook receiver for VPS (PC-off path).

Bind: 127.0.0.1 only (Traefik/CF tunnel terminates TLS in front).
POST /ingest/{source} with header X-Nexify-Ingest-Secret.

Sources: slack|linear|sentry|vercel|health|gitlab|cloudflare|resend|website|generic
"""

from __future__ import annotations

import hashlib
import json
import os
import sys
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "event-ingest"))

HOST = os.environ.get("EVENT_INGEST_HOST", "127.0.0.1")
PORT = int(os.environ.get("EVENT_INGEST_PORT", "8791"))
SECRET = os.environ.get("EVENT_INGEST_SHARED_SECRET", "")
GH_TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_PAT") or ""
GH_REPO = os.environ.get(
    "EVENT_INGEST_GH_REPO", "nexifyai-dev/nexify-agentur-plattform"
)

SOURCE_TO_DISPATCH = {
    "slack": "slack-alert",
    "linear": "linear-issue",
    "sentry": "sentry-alert",
    "vercel": "vercel-deploy-fail",
    "health": "health-alert",
    "gitlab": "gitlab-ci-fail",
    "cloudflare": "cloudflare-alert",
    "resend": "resend-bounce",
    "website": "website-error",
    "generic": "agent-fix",
}


def _json_response(
    handler: BaseHTTPRequestHandler, code: int, body: dict[str, Any]
) -> None:
    raw = json.dumps(body).encode()
    handler.send_response(code)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(raw)))
    handler.end_headers()
    handler.wfile.write(raw)


def github_repository_dispatch(
    event_type: str, client_payload: dict[str, Any]
) -> dict[str, Any]:
    if not GH_TOKEN:
        return {"ok": False, "error": "GITHUB_TOKEN_or_GH_PAT_missing"}
    payload = {"event_type": event_type, "client_payload": client_payload}
    req = urllib.request.Request(
        f"https://api.github.com/repos/{GH_REPO}/dispatches",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {GH_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            "User-Agent": "nexify-event-ingest",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return {"ok": True, "status": resp.status}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "error": type(exc).__name__}


def normalize(source: str, data: dict[str, Any]) -> dict[str, Any]:
    prompt = data.get("prompt") or data.get("message") or data.get("text")
    if not prompt:
        prompt = (
            f"Inbound {source} alert: {json.dumps(data, ensure_ascii=False)[:3500]}"
        )
    dedupe = str(
        data.get("dedupe_key")
        or data.get("id")
        or hashlib.sha256(f"{source}:{prompt}".encode()).hexdigest()[:16]
    )
    return {
        "prompt": str(prompt)[:8000],
        "dedupe_key": dedupe,
        "source": source,
        "auto_pr": bool(data.get("auto_pr", True)),
        "meta": {
            k: data.get(k)
            for k in ("url", "project", "severity", "issue", "channel")
            if k in data
        },
    }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args: Any) -> None:  # noqa: A003
        sys.stderr.write("[event-ingest] " + (fmt % args) + "\n")

    def do_GET(self) -> None:  # noqa: N802
        if self.path in ("/health", "/livez"):
            _json_response(self, 200, {"status": "ok", "service": "event-ingest"})
            return
        _json_response(self, 404, {"error": "not_found"})

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        parts = [p for p in parsed.path.split("/") if p]
        if len(parts) != 2 or parts[0] != "ingest":
            _json_response(self, 404, {"error": "use_POST_/ingest/{source}"})
            return
        source = parts[1].lower()
        if source not in SOURCE_TO_DISPATCH:
            _json_response(
                self,
                400,
                {"error": "unknown_source", "allowed": sorted(SOURCE_TO_DISPATCH)},
            )
            return

        provided = (
            self.headers.get("X-Nexify-Ingest-Secret")
            or self.headers.get("X-Webhook-Secret")
            or ""
        )
        if not SECRET or provided != SECRET:
            _json_response(self, 401, {"error": "unauthorized"})
            return

        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            data = json.loads(raw.decode() or "{}")
        except json.JSONDecodeError:
            _json_response(self, 400, {"error": "invalid_json"})
            return
        if not isinstance(data, dict):
            _json_response(self, 400, {"error": "json_object_required"})
            return

        client_payload = normalize(source, data)
        event_type = SOURCE_TO_DISPATCH[source]
        result = github_repository_dispatch(event_type, client_payload)

        # Optional local cloud launch via dispatch script (VPS has CURSOR_API_KEY)
        local_launch: dict[str, Any] = {"skipped": True}
        if os.environ.get("EVENT_INGEST_LOCAL_LAUNCH", "0") == "1":
            os.environ.setdefault("CLIENT_PAYLOAD", json.dumps(client_payload))
            os.environ.setdefault("DISPATCH_TYPE", event_type)
            try:
                from dispatch_cloud_agent import main as dispatch_main  # type: ignore

                sys.argv = [
                    "dispatch_cloud_agent.py",
                    "--repo-url",
                    f"https://github.com/{GH_REPO}",
                    "--ref",
                    str(data.get("ref") or "main"),
                    "--event-name",
                    "repository_dispatch",
                    "--reason",
                    f"webhook:{source}",
                    "--run-id",
                    client_payload["dedupe_key"],
                ]
                code = dispatch_main()
                local_launch = {"skipped": False, "exit": code}
            except Exception as exc:  # noqa: BLE001
                local_launch = {"skipped": False, "error": type(exc).__name__}

        _json_response(
            self,
            202 if result.get("ok") else 502,
            {
                "accepted": True,
                "source": source,
                "event_type": event_type,
                "dedupe_key": client_payload["dedupe_key"],
                "github_dispatch": result,
                "local_launch": local_launch,
            },
        )


def main() -> int:
    if not SECRET:
        print("EVENT_INGEST_SHARED_SECRET required", file=sys.stderr)
        return 1
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(
        f"event-ingest listening on http://{HOST}:{PORT} (127.0.0.1 only recommended)"
    )
    httpd.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
