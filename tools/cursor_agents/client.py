#!/usr/bin/env python3
"""Minimaler, abhängigkeitsfreier Client für die Cursor Cloud Agents API v1.

Nur Python-Standardbibliothek (urllib). Auth über einen API-Key aus der
Umgebungsvariable CURSOR_API_KEY (Basic- oder Bearer-Auth, Default: Basic,
passend zu den `-u KEY:`-curl-Beispielen der Doku).

Sicherheitsgrundsatz: Dieser Client *kapselt* die API, startet aber von sich
aus nichts. Agenten-Erstellung (`create_agent`) muss explizit aufgerufen
werden — kein Auto-Launch (Runaway-/Budget-Schutz).

Docs: https://cursor.com/docs (Cloud Agents API v1, öffentliche Beta).
"""
from __future__ import annotations

import base64
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Iterator, Optional

BASE_URL = os.environ.get("CURSOR_API_BASE", "https://api.cursor.com")
DEFAULT_TIMEOUT = float(os.environ.get("CURSOR_API_TIMEOUT", "60"))


class CursorAgentsError(RuntimeError):
    """API-Fehler mit HTTP-Status und (falls vorhanden) Fehlercode/-nachricht."""

    def __init__(self, status: int, code: str | None, message: str, body: str = ""):
        self.status = status
        self.code = code
        self.message = message
        self.body = body
        super().__init__(f"[{status}] {code or ''} {message}".strip())


class CursorAgentsClient:
    """Dünner HTTP-Client um die Cloud Agents API v1."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = BASE_URL,
        auth: str = "basic",
        timeout: float = DEFAULT_TIMEOUT,
        opener: Any = None,
    ):
        self.api_key = api_key or os.environ.get("CURSOR_API_KEY")
        if not self.api_key:
            raise ValueError("CURSOR_API_KEY fehlt (Env-Variable oder api_key-Argument setzen).")
        self.base_url = base_url.rstrip("/")
        if auth not in ("basic", "bearer"):
            raise ValueError("auth muss 'basic' oder 'bearer' sein.")
        self.auth = auth
        self.timeout = timeout
        # `opener` erlaubt Injektion in Tests; sonst Standard-urlopen.
        self._urlopen = opener or urllib.request.urlopen

    # -- intern ------------------------------------------------------------
    def _auth_header(self) -> str:
        if self.auth == "bearer":
            return f"Bearer {self.api_key}"
        token = base64.b64encode(f"{self.api_key}:".encode()).decode()
        return f"Basic {token}"

    def _request(self, method: str, path: str, body: Any = None, query: dict | None = None) -> Any:
        url = f"{self.base_url}{path}"
        if query:
            clean = {k: v for k, v in query.items() if v is not None}
            if clean:
                url = f"{url}?{urllib.parse.urlencode(clean)}"
        data = json.dumps(body).encode() if body is not None else None
        headers = {"Authorization": self._auth_header(), "Accept": "application/json"}
        if data is not None:
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with self._urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read().decode()
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as exc:
            raw = exc.read().decode() if hasattr(exc, "read") else ""
            code = msg = None
            try:
                parsed = json.loads(raw)
                err = parsed.get("error", parsed)
                code = err.get("code") or err.get("error")
                msg = err.get("message") or err.get("detail")
            except Exception:
                pass
            raise CursorAgentsError(exc.code, code, msg or exc.reason or "HTTP error", raw) from None

    # -- Agenten -----------------------------------------------------------
    def create_agent(self, prompt_text: str, *, model: dict | None = None, name: str | None = None,
                     repos: list[dict] | None = None, env: dict | None = None,
                     auto_create_pr: bool | None = None, mode: str | None = None,
                     mcp_servers: list[dict] | None = None, agent_id: str | None = None,
                     **extra: Any) -> dict:
        payload: dict[str, Any] = {"prompt": {"text": prompt_text}}
        if model is not None: payload["model"] = model
        if name is not None: payload["name"] = name
        if repos is not None: payload["repos"] = repos
        if env is not None: payload["env"] = env
        if auto_create_pr is not None: payload["autoCreatePR"] = auto_create_pr
        if mode is not None: payload["mode"] = mode
        if mcp_servers is not None: payload["mcpServers"] = mcp_servers
        if agent_id is not None: payload["agentId"] = agent_id
        payload.update(extra)
        return self._request("POST", "/v1/agents", body=payload)

    def list_agents(self, *, limit: int | None = None, cursor: str | None = None,
                    pr_url: str | None = None, include_archived: bool | None = None) -> dict:
        return self._request("GET", "/v1/agents", query={
            "limit": limit, "cursor": cursor, "prUrl": pr_url,
            "includeArchived": None if include_archived is None else str(include_archived).lower(),
        })

    def get_agent(self, agent_id: str) -> dict:
        return self._request("GET", f"/v1/agents/{agent_id}")

    def archive_agent(self, agent_id: str) -> dict:
        return self._request("POST", f"/v1/agents/{agent_id}/archive")

    def unarchive_agent(self, agent_id: str) -> dict:
        return self._request("POST", f"/v1/agents/{agent_id}/unarchive")

    def delete_agent(self, agent_id: str) -> dict:
        return self._request("DELETE", f"/v1/agents/{agent_id}")

    # -- Ausführungen ------------------------------------------------------
    def create_run(self, agent_id: str, prompt_text: str, *, mode: str | None = None,
                   mcp_servers: list[dict] | None = None) -> dict:
        payload: dict[str, Any] = {"prompt": {"text": prompt_text}}
        if mode is not None: payload["mode"] = mode
        if mcp_servers is not None: payload["mcpServers"] = mcp_servers
        return self._request("POST", f"/v1/agents/{agent_id}/runs", body=payload)

    def list_runs(self, agent_id: str, *, limit: int | None = None, cursor: str | None = None) -> dict:
        return self._request("GET", f"/v1/agents/{agent_id}/runs", query={"limit": limit, "cursor": cursor})

    def get_run(self, agent_id: str, run_id: str) -> dict:
        return self._request("GET", f"/v1/agents/{agent_id}/runs/{run_id}")

    def cancel_run(self, agent_id: str, run_id: str) -> dict:
        return self._request("POST", f"/v1/agents/{agent_id}/runs/{run_id}/cancel")

    def get_usage(self, agent_id: str, *, run_id: str | None = None) -> dict:
        return self._request("GET", f"/v1/agents/{agent_id}/usage", query={"runId": run_id})

    def stream_run(self, agent_id: str, run_id: str, *, last_event_id: str | None = None) -> Iterator[dict]:
        """Generator über SSE-Ereignisse einer Ausführung: liefert {"event","data","id"}."""
        url = f"{self.base_url}/v1/agents/{agent_id}/runs/{run_id}/stream"
        headers = {"Authorization": self._auth_header(), "Accept": "text/event-stream"}
        if last_event_id:
            headers["Last-Event-ID"] = last_event_id
        req = urllib.request.Request(url, headers=headers, method="GET")
        with self._urlopen(req, timeout=self.timeout) as resp:
            event: dict[str, Any] = {}
            for rawline in resp:
                line = rawline.decode().rstrip("\n").rstrip("\r")
                if line == "":
                    if event:
                        if "data" in event:
                            try: event["data"] = json.loads(event["data"])
                            except Exception: pass
                        yield event
                        event = {}
                    continue
                if line.startswith(":"):
                    continue
                key, _, value = line.partition(":")
                value = value.lstrip(" ")
                if key == "data":
                    event["data"] = (event.get("data", "") + value) if "data" in event else value
                elif key in ("event", "id"):
                    event[key] = value

    # -- Artefakte ---------------------------------------------------------
    def list_artifacts(self, agent_id: str) -> dict:
        return self._request("GET", f"/v1/agents/{agent_id}/artifacts")

    def download_artifact(self, agent_id: str, path: str) -> dict:
        return self._request("GET", f"/v1/agents/{agent_id}/artifacts/download", query={"path": path})

    # -- Metadaten ---------------------------------------------------------
    def me(self) -> dict:
        return self._request("GET", "/v1/me")

    def list_models(self) -> dict:
        return self._request("GET", "/v1/models")

    def list_repositories(self) -> dict:
        return self._request("GET", "/v1/repositories")


def _main(argv: list[str]) -> int:
    import argparse
    p = argparse.ArgumentParser(description="Cursor Cloud Agents API v1 – CLI (liest CURSOR_API_KEY).")
    p.add_argument("--auth", choices=["basic", "bearer"], default="basic")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("me")
    sub.add_parser("models")
    sub.add_parser("repos")
    la = sub.add_parser("list-agents"); la.add_argument("--limit", type=int)
    ga = sub.add_parser("get-agent"); ga.add_argument("agent_id")
    lr = sub.add_parser("list-runs"); lr.add_argument("agent_id"); lr.add_argument("--limit", type=int)
    gr = sub.add_parser("get-run"); gr.add_argument("agent_id"); gr.add_argument("run_id")
    ca = sub.add_parser("create-agent")
    ca.add_argument("prompt"); ca.add_argument("--repo"); ca.add_argument("--ref", default="main")
    ca.add_argument("--model"); ca.add_argument("--auto-pr", action="store_true")
    args = p.parse_args(argv)
    c = CursorAgentsClient(auth=args.auth)
    if args.cmd == "me": out = c.me()
    elif args.cmd == "models": out = c.list_models()
    elif args.cmd == "repos": out = c.list_repositories()
    elif args.cmd == "list-agents": out = c.list_agents(limit=args.limit)
    elif args.cmd == "get-agent": out = c.get_agent(args.agent_id)
    elif args.cmd == "list-runs": out = c.list_runs(args.agent_id, limit=args.limit)
    elif args.cmd == "get-run": out = c.get_run(args.agent_id, args.run_id)
    elif args.cmd == "create-agent":
        repos = [{"url": args.repo, "startingRef": args.ref}] if args.repo else None
        model = {"id": args.model} if args.model else None
        out = c.create_agent(args.prompt, repos=repos, model=model, auto_create_pr=args.auto_pr or None)
    else:
        p.error("unbekannter Befehl")
    print(json.dumps(out, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    import sys
    raise SystemExit(_main(sys.argv[1:]))
