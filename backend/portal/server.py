"""NeXifyAI Portal Server — serves static files + landing page + API proxy + SSE."""
import html
import json, logging, os, subprocess, time, threading, queue, urllib.request
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

logging.basicConfig(level=logging.WARNING, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("portal")
from urllib.parse import urlparse

PORT = int(os.environ.get("PORT", 8880))
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

# Alias parity with backend/ninerouter.py — never hardcode secrets.
NINEROUTER_KEY = (
    os.environ.get("NINEROUTER_API_KEY")
    or os.environ.get("NINEROUTER_KEY")
    or os.environ.get("OPENAI_API_KEY")
    or ""
)
_NINEROUTER_BASE = (
    os.environ.get("NINEROUTER_BASE_URL")
    or os.environ.get("OPENAI_BASE_URL")
    or "http://127.0.0.1:20128/v1"
).rstrip("/")
NINEROUTER_ROOT = _NINEROUTER_BASE[:-3] if _NINEROUTER_BASE.endswith("/v1") else _NINEROUTER_BASE
DATABRICKS_PROXY = os.environ.get("DATABRICKS_PROXY", "http://127.0.0.1:9900")
DATABRICKS_MODELS = [
    {"id": "system.ai.glm-5-2", "object": "model", "owned_by": "databricks"},
]

# ── SSE stream ──────────────────────────────────────────────────
_sse_clients: list = []  # list of queue.Queue
_sse_lock = threading.Lock()
SSE_SENTINEL = object()  # sentinel value to signal SSE client disconnect

def _sse_broadcast():
    """Background thread: push system data to all SSE clients every 5s."""
    while True:
        time.sleep(5)
        try:
            payload = _build_sse_payload()
        except Exception:
            log.warning("SSE payload build failed — skipping cycle", exc_info=True)
            continue  # skip malformed payload, don't kill broadcast thread
        with _sse_lock:
            stale = []
            for q in _sse_clients:
                try:
                    q.put_nowait(payload)
                except queue.Full:
                    stale.append(q)
            for q in stale:
                _sse_clients.remove(q)
                # Signal the SSE handler to stop via sentinel value
                try:
                    q.put_nowait(SSE_SENTINEL)
                except queue.Full:
                    pass  # queue completely full; handler will timeout and self-clean

def _build_sse_payload() -> str:
    data = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S+00:00", time.gmtime()),
        "docker": _docker_status(),
        "memory": _memory_status(),
        "load": _load_status(),
        "leads_count": _leads_count(),
        "sessions_count": _sessions_count(),
    }
    return json.dumps(data)

def _docker_status() -> dict:
    try:
        out = subprocess.check_output(
            ["docker", "ps", "--format", "{{.Names}}\t{{.Status}}"],
            timeout=5, text=True
        )
        return dict(line.split("\t", 1) for line in out.strip().split("\n") if "\t" in line)
    except Exception:
        log.warning("_docker_status failed", exc_info=True)
        return {}

def _memory_status() -> dict:
    try:
        with open("/proc/meminfo") as f:
            m = {}
            for line in f:
                if line.startswith("MemTotal:"):
                    m["total_mb"] = str(int(line.split()[1]) // 1024)
                elif line.startswith("MemAvailable:"):
                    m["used_mb"] = str((int(m.get("total_mb", "0")) * 1024 - int(line.split()[1])) // 1024)
            return m
    except Exception:
        log.warning("_memory_status failed", exc_info=True)
        return {"used_mb": "?", "total_mb": "?"}

def _load_status() -> str:
    try:
        return subprocess.check_output(["uptime"], timeout=2, text=True).strip()
    except Exception:
        log.warning("_load_status failed", exc_info=True)
        return "?"

def _leads_count() -> int:
    try:
        req = urllib.request.Request("http://127.0.0.1:8887/api/leads")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            if isinstance(data, list):
                return len(data)
            return len(data.get("leads", data.get("data", [])))
    except Exception:
        log.warning("_leads_count failed", exc_info=True)
        return 0

def _sessions_count() -> int:
    try:
        req = urllib.request.Request("http://127.0.0.1:3113/agentmemory/sessions")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            sessions = data.get("sessions", data if isinstance(data, list) else [])
            return len(sessions)
    except Exception:
        log.warning("_sessions_count failed — returning fallback 0", exc_info=True)
        return 0


def _agentmemory_get(path: str) -> dict:
    """Fetch from agentmemory and return parsed JSON."""
    try:
        req = urllib.request.Request(f"http://127.0.0.1:3113{path}")
        with urllib.request.urlopen(req, timeout=5) as resp:
            return json.loads(resp.read())
    except Exception:
        log.warning("_agentmemory_get failed", exc_info=True)
        return {}


class PortalHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def log_message(self, format, *args):
        pass

    def _check_auth(self) -> bool:
        """Verify Traefik ForwardAuth has authenticated this request.
        Returns True if X-ForwardAuth-Verified header is present (Traefik edge auth)
        or X-User-Id header is present (auth service). Otherwise returns False.
        No localhost bypass — all direct access must carry auth headers."""
        # Traefik ForwardAuth sets X-ForwardAuth-Verified on successful auth
        if self.headers.get("X-ForwardAuth-Verified") == "true":
            return True
        # Fallback: X-User-Id set by auth service
        if self.headers.get("X-User-Id"):
            return True
        return False

    _ALLOWED_ORIGINS = {"https://admin.nexifyai.cloud"}

    def _cors_origin(self) -> str:
        """Return Access-Control-Allow-Origin from allowlist (constant, never echo raw Origin)."""
        origin = self.headers.get("Origin", "")
        # Return the allowlisted constant — avoids HTTP response splitting / header injection
        # from any CR/LF in a crafted Origin while preserving CORS for the known admin UI.
        if origin in self._ALLOWED_ORIGINS:
            return "https://admin.nexifyai.cloud"
        return ""

    @staticmethod
    def _safe_header_value(value: str, default: str) -> str:
        """Strip CR/LF and cap length so proxied headers cannot split HTTP responses."""
        if not value:
            return default
        cleaned = value.replace("\r", "").replace("\n", "").strip()
        if not cleaned:
            return default
        return cleaned[:128]

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # ── health ──
        if path == "/health":
            return self._send_json({"status": "ok", "service": "nexify-portal", "version": "2.0"})

        # ── models ──
        if path == "/api/models":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._serve_models()

        # ── system status ──
        if path == "/api/system/status":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._system_status()

        # ── SSE stream ──
        if path == "/api/sse/events":
            # SSE no auth: EventSource can't send custom headers; data is operational telemetry only.
            # Traefik already excludes this path from auth-forward middleware.
            return self._sse_handler()

        # ── API proxies (GET) ──
        if path == "/api/leads":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._proxy_get("http://127.0.0.1:8900/api/leads/")
        if path == "/api/companies":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._companies()
        if path == "/api/mails":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._send_json([])  # ponytail: placeholder; spaether outreach pipeline active but 0 mails sent yet
        if path == "/api/members":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._members()
        if path == "/api/notifications":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._notifications()
        if path == "/api/sessions":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            data = _agentmemory_get("/agentmemory/sessions")
            sessions = data.get("sessions", [])
            return self._send_json({
                "sessions": sessions,
                "total": len(sessions),
                "active": sum(1 for s in sessions if s.get("status") == "active"),
            })
        if path == "/api/tasks":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            data = _agentmemory_get("/agentmemory/actions")
            actions = data.get("actions", data if isinstance(data, list) else [])
            return self._send_json({
                "actions": actions,
                "total": len(actions),
                "pending": sum(1 for a in actions if a.get("status") == "pending"),
            })
        if path == "/api/brain/notes":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._brain_notes()

        # ── legacy proxy paths ──
        if path == "/api/proxy/9router/health":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._proxy_get(f"{NINEROUTER_ROOT}/api/health")
        if path == "/api/proxy/lightrag/health":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._proxy_get("http://127.0.0.1:9621/health")
        if path == "/api/proxy/agentmemory/health":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._proxy_get("http://127.0.0.1:3113/agentmemory/health")

        # ── Factory proxy (Paperclip Vite dev server) ──
        if path.startswith("/factory"):
            return self._proxy_factory(path)

        # ── demo pages ──
        if path.startswith("/api/demo/"):
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._serve_demo(path.split("/")[-1])

        # ── redirects ──
        if path == "/wissen":
            self.send_response(302)
            self.send_header("Location", "/wissen.html")
            self.end_headers()
            return
        if path == "/router":
            self.send_response(302)
            self.send_header("Location", "/router.html")
            self.end_headers()
            return
        if path == "/models":
            self.send_response(302)
            self.send_header("Location", "/models.html")
            self.end_headers()
            return
        if path == "/mockup":
            self.send_response(302)
            self.send_header("Location", "/mockup.html")
            self.end_headers()
            return
        if path == "/puls":
            self.send_response(302)
            self.send_header("Location", "/puls.html")
            self.end_headers()
            return

        # ── /dashboard/ → SPA fallback (serve index.html for client-side routing) ──
        if path.startswith("/dashboard"):
            return self._serve_dashboard(path)

        # ── SPA fallback for all unmatched paths ──
        # Check if requested file exists; if not, serve index.html for Vue Router
        file_path = os.path.realpath(os.path.join(STATIC_DIR, path.lstrip("/")))
        if not file_path.startswith(os.path.realpath(STATIC_DIR) + os.sep):
            self.send_response(403)
            self.end_headers()
            return
        if os.path.isfile(file_path):
            return super().do_GET()
        # SPA fallback: serve root index.html for client-side routing
        index = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            with open(index, "rb") as f:
                self.wfile.write(f.read())
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/chat":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            self._proxy_chat()
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # ── API methods ────────────────────────────────────────────

    def _system_status(self):
        """Aggregate system health for the dashboard.
        Returns format matching frontend SystemStatus TypeScript interface."""
        backends = {
            "portal": ("http://127.0.0.1:8880/health", 200),
            "auth": ("http://127.0.0.1:8881/health", 200),
            "paperclip": ("http://127.0.0.1:3100/health", 200),
            "lightrag": ("http://127.0.0.1:9621/health", 200),
            "spaether": ("http://127.0.0.1:8900/health", 200),
            "agentmemory": ("http://127.0.0.1:3113/agentmemory/health", 200),
            "9router": (f"{NINEROUTER_ROOT}/api/health", 200),
            "grafana": ("http://127.0.0.1:3000/api/health", 200),
            "prometheus": ("http://127.0.0.1:9090/-/healthy", 200),
        }
        backend_status: dict[str, int] = {}
        # portal is implicitly healthy — this request proves the server is running
        backend_status["portal"] = 200
        for name, (url, _expected) in backends.items():
            if name == "portal":
                continue  # already set above
            try:
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req, timeout=3) as resp:
                    backend_status[name] = resp.status
            except Exception:
                log.warning(f"backend check failed: {name} ({url})", exc_info=True)
                backend_status[name] = 0

        # Docker: return Record<string, string> (container name → status)
        docker_status: dict[str, str] = {}
        try:
            out = subprocess.check_output(
                ["docker", "ps", "--format", "{{.Names}}\\t{{.Status}}"], timeout=5, text=True
            ).strip()
            for line in out.split("\n"):
                if "\t" in line:
                    name, status = line.split("\t", 1)
                    docker_status[name] = status
        except Exception:
            log.warning("docker ps failed in _system_status", exc_info=True)

        # Systemd services
        systemd_status: dict[str, str] = {}
        for svc in ["traefik", "docker"]:
            try:
                out = subprocess.check_output(
                    ["systemctl", "is-active", svc], timeout=3, text=True
                ).strip()
                systemd_status[svc] = out
            except Exception:
                log.warning(f"systemd is-active {svc} failed", exc_info=True)
                systemd_status[svc] = "unknown"

        # node_exporter runs as Docker container, not systemd service
        try:
            out = subprocess.check_output(
                ["docker", "inspect", "nexify-node-exporter", "--format", "{{.State.Status}}"],
                timeout=5, text=True
            ).strip()
            systemd_status["node_exporter"] = out
        except Exception:
            systemd_status["node_exporter"] = "unknown"

        # Memory
        mem_used = mem_total = "?"
        try:
            with open("/proc/meminfo") as f:
                m = {}
                for line in f:
                    if line.startswith("MemTotal:"):
                        m["total"] = int(line.split()[1])
                    elif line.startswith("MemAvailable:"):
                        m["avail"] = int(line.split()[1])
                if "total" in m:
                    mem_total = f"{round(m['total'] / 1024 / 1024, 1)}Gi"
                if "total" in m and "avail" in m:
                    mem_used = f"{round((m['total'] - m['avail']) / 1024 / 1024, 1)}Gi"
        except Exception:
            log.warning("memory info failed in _system_status", exc_info=True)

        # Disk
        disk_used = disk_total = disk_pct = "?"
        try:
            stat = os.statvfs("/")
            total = stat.f_blocks * stat.f_frsize
            free = stat.f_bavail * stat.f_frsize
            used = total - free
            disk_total = f"{round(total / 1024**3, 1)}Gi"
            disk_used = f"{round(used / 1024**3, 1)}Gi"
            disk_pct = f"{round(used / total * 100)}%"
        except Exception:
            log.warning("disk info failed in _system_status", exc_info=True)

        # Uptime
        uptime_str = "?"
        try:
            with open("/proc/uptime") as f:
                secs = int(float(f.read().split()[0]))
                d, r = divmod(secs, 86400)
                h, r = divmod(r, 3600)
                m, _ = divmod(r, 60)
                uptime_str = f"{d}d {h}h {m}m"
        except Exception:
            log.warning("uptime info failed in _system_status", exc_info=True)

        # Prometheus
        prom_up = prom_total = 0
        try:
            req = urllib.request.Request("http://127.0.0.1:9090/api/v1/targets")
            with urllib.request.urlopen(req, timeout=5) as resp:
                targets = json.loads(resp.read())
                prom_total = len(targets.get("data", {}).get("activeTargets", []))
                prom_up = sum(1 for t in targets.get("data", {}).get("activeTargets", [])
                             if t.get("health") == "up")
        except Exception:
            log.warning("prometheus query failed in _system_status", exc_info=True)

        self._send_json({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S+00:00", time.gmtime()),
            "docker": docker_status,
            "systemd": systemd_status,
            "backend": backend_status,
            "resources": {
                "memory": {"used": mem_used, "total": mem_total},
                "disk": {"used": disk_used, "total": disk_total, "pct": disk_pct},
                "uptime": uptime_str,
            },
            "prometheus": {"up": prom_up, "total": prom_total},
        })

    def _sse_handler(self):
        """Server-Sent Events stream with system data every 5s."""
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.end_headers()

        q: queue.Queue = queue.Queue(maxsize=10)  # buffer up to 50s of events
        with _sse_lock:
            _sse_clients.append(q)

        try:
            while True:
                try:
                    payload = q.get(timeout=30)
                    if payload is SSE_SENTINEL:
                        break  # broadcast thread signaled disconnect (queue overflow)
                    self.wfile.write(f"data: {payload}\n\n".encode())
                    self.wfile.flush()
                except queue.Empty:
                    # keepalive ping
                    self.wfile.write(b": ping\n\n")
                    self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            with _sse_lock:
                if q in _sse_clients:
                    _sse_clients.remove(q)

    def _companies(self):
        """Derive company list from leads (spaether has no dedicated companies endpoint)."""
        try:
            req = urllib.request.Request("http://127.0.0.1:8887/api/leads")
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read())
                leads = data.get("leads", data if isinstance(data, list) else [])
        except Exception:
            log.warning("_companies: spaether leads fetch failed", exc_info=True)
            return self._send_json([])

        seen = set()
        companies = []
        for lead in leads:
            name = (lead.get("business_name") or lead.get("company") or "").strip()
            if name and name not in seen:
                seen.add(name)
                companies.append({
                    "name": name,
                    "industry": lead.get("industry", ""),
                    "region": lead.get("region", ""),
                    "score": lead.get("score", 0),
                    "status": lead.get("status", ""),
                    "lead_id": lead.get("id", ""),
                })
        companies.sort(key=lambda c: c.get("name", "").lower())
        self._send_json(companies)

    def _members(self):
        """Return team members from auth service + fallback to known users."""
        try:
            req = urllib.request.Request("http://127.0.0.1:8881/members")
            with urllib.request.urlopen(req, timeout=5) as resp:
                self.send_response(resp.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", self._cors_origin())
                self.end_headers()
                self.wfile.write(resp.read())
                return
        except Exception:
            log.warning("_members: auth service /members not available", exc_info=True)
        # Fallback: empty list (ponytail: upgrade when Zitadel M2M credentials available)
        self._send_json([])

    def _notifications(self):
        """Aggregate notifications from pipeline runs + recent agentmemory actions."""
        items = []
        # Pipeline runs from spaether
        try:
            req = urllib.request.Request("http://127.0.0.1:8900/api/pipeline/runs")
            with urllib.request.urlopen(req, timeout=5) as resp:
                runs = json.loads(resp.read()).get("runs", [])
                for run in runs[:10]:
                    created = run.get("created_at", "")
                    items.append({
                        "id": f"pipeline-{run.get('id','')}",
                        "type": "pipeline",
                        "title": f"Pipeline {run.get('phase','run')} {run.get('status','unknown')}",
                        "description": run.get("error_message") or run.get("results_summary", {}).get("total_found", ""),
                        "timestamp": created,
                        "status": run.get("status", "unknown"),
                        # Dashboard-compatible fields
                        "sender": {"name": "Pipeline", "avatar": {}},
                        "date": created,
                        "body": f"Pipeline {run.get('phase','run')} {run.get('status','unknown')}",
                        "unread": run.get("status") == "failed",
                    })
        except Exception:
            log.warning("_notifications: spaether pipeline fetch failed", exc_info=True)
        # Recent actions from agentmemory
        try:
            data = _agentmemory_get("/agentmemory/actions")
            actions = data.get("actions", data if isinstance(data, list) else [])
            for action in sorted(actions, key=lambda a: a.get("updated_at", ""), reverse=True)[:10]:
                ts = action.get("updated_at", action.get("created_at", ""))
                items.append({
                    "id": f"action-{action.get('id','')}",
                    "type": "task",
                    "title": action.get("title", "Task"),
                    "description": action.get("description", ""),
                    "timestamp": ts,
                    "status": action.get("status", "pending"),
                    # Dashboard-compatible fields
                    "sender": {"name": "Agent", "avatar": {}},
                    "date": ts,
                    "body": action.get("title", "Task"),
                    "unread": False,
                })
        except Exception:
            log.warning("_notifications: agentmemory actions fetch failed", exc_info=True)
        items.sort(key=lambda i: i.get("timestamp", ""), reverse=True)
        self._send_json(items[:20])

    def _brain_notes(self):
        """Fetch notes from LightRAG via POST /query."""
        try:
            body = json.dumps({"query": "list all notes", "mode": "naive"}).encode()
            req = urllib.request.Request(
                "http://127.0.0.1:9621/query",
                data=body,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read())
                self._send_json({"notes": data.get("data", data)})
        except Exception:
            log.warning("_brain_notes failed", exc_info=True)
            self._send_json({"notes": []})

    def _serve_dashboard(self, path):
        """Serve dashboard static files with SPA fallback (path-traversal-safe)."""
        file_path = os.path.realpath(os.path.join(STATIC_DIR, path.lstrip("/")))
        if not file_path.startswith(os.path.realpath(STATIC_DIR) + os.sep):
            self.send_response(403)
            self.end_headers()
            return
        if os.path.isfile(file_path) and not path.endswith("/"):
            return super().do_GET()
        # SPA fallback: serve index.html
        index = os.path.join(STATIC_DIR, "dashboard", "index.html")
        if os.path.isfile(index):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            try:
                with open(index, "rb") as f:
                    self.wfile.write(f.read())
            except (BrokenPipeError, ConnectionResetError, OSError) as e:
                log.warning("dashboard index.html read/write failed: %s", e)
        else:
            self.send_response(404)
            self.end_headers()

    def _serve_models(self):
        models = list(DATABRICKS_MODELS)
        if NINEROUTER_KEY:
            try:
                req = urllib.request.Request(
                    f"{NINEROUTER_ROOT}/v1/models",
                    headers={"Authorization": f"Bearer {NINEROUTER_KEY}"},
                )
                with urllib.request.urlopen(req, timeout=5) as resp:
                    data = json.loads(resp.read())
                    models.extend(data.get("data", []))
            except Exception:
                log.warning("model list failed in _system_status", exc_info=True)
        self._send_json({"object": "list", "data": models})

    def _proxy_chat(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length else b"{}"
        raw = ""
        try:
            data = json.loads(body)
            model_id = data.get("model", "")
            # Force non-streaming
            data["stream"] = False
            body = json.dumps(data).encode()

            if model_id.startswith("system.ai.glm") or "databricks" in model_id.lower():
                backend = DATABRICKS_PROXY
            else:
                backend = NINEROUTER_ROOT

            req = urllib.request.Request(
                f"{backend}/v1/chat/completions",
                data=body,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {NINEROUTER_KEY}",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                raw = resp.read().decode("utf-8")
                # Handle streaming (SSE) responses: extract last data line
                if raw.startswith("data:"):
                    lines = [l.replace("data: ", "").strip() for l in raw.split("\n")
                             if l.startswith("data: ") and l.replace("data: ", "").strip() not in ("[DONE]", "")]
                    raw = lines[-1] if lines else "{}"
                self._send_json(json.loads(raw))
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
            self.end_headers()
            self.wfile.write(e.read())
        except json.JSONDecodeError as je:
            log.warning("_proxy_chat JSON decode failed: %s", je, exc_info=True)
            self._send_json({"error": "upstream_json_error"}, 502)
        except Exception as ex:
            log.warning("_proxy_chat failed: %s", ex, exc_info=True)
            self._send_json({"error": "upstream_error"}, 502)

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _proxy_get(self, url):
        """Proxy a GET request to an internal service."""
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                self.send_header("Content-Type", self._safe_header_value(resp.headers.get("Content-Type", "application/json"), "application/json"))
                self.send_header("Access-Control-Allow-Origin", self._cors_origin())
                self.end_headers()
                self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
            self.end_headers()
            self.wfile.write(e.read() or b"{}")
        except Exception as ex:
            log.warning("_proxy_get failed for %s: %s", url, ex, exc_info=True)
            self._send_json({"error": "proxy_error"}, 502)

    def _proxy_factory(self, path):
        """Proxy /factory/* → Paperclip Vite dev server on :3100, stripping /factory prefix."""
        target_path = path[len("/factory"):] or "/"
        target_url = f"http://127.0.0.1:3100{target_path}"
        try:
            req = urllib.request.Request(target_url)
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                ct = self._safe_header_value(resp.headers.get("Content-Type", "text/html"), "text/html")
                self.send_header("Content-Type", ct)
                self.send_header("Access-Control-Allow-Origin", self._cors_origin())
                self.end_headers()
                try:
                    self.wfile.write(resp.read())
                except (BrokenPipeError, ConnectionResetError) as e:
                    log.warning("_proxy_factory write failed for %s: %s", target_url, e)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header("Content-Type", "text/html")
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
            self.end_headers()
            try:
                self.wfile.write(e.read() or b"")
            except (BrokenPipeError, ConnectionResetError) as e2:
                log.warning("_proxy_factory error-body write failed for %s: %s", target_url, e2)
        except Exception as ex:
            log.warning("_proxy_factory failed for %s: %s", target_url, ex, exc_info=True)
            self._send_json({"error": "factory_proxy_error"}, 502)

    def _serve_demo(self, lead_id):
        """Fetch lead demo_config from Spaether and render as HTML."""
        try:
            req = urllib.request.Request(f"http://127.0.0.1:8900/api/leads/{lead_id}")
            with urllib.request.urlopen(req, timeout=10) as resp:
                lead = json.loads(resp.read())
        except Exception:
            self._send_html(self._demo_error("Lead nicht gefunden"))
            return

        config = lead.get("demo_config", {}) or {}
        biz = config.get("business_name", lead.get("business_name", "Ihr Unternehmen"))
        industry = config.get("industry", lead.get("industry", ""))
        chatbot = config.get("chatbot", {}) or {}
        greeting = chatbot.get("greeting", f"Hallo! Willkommen bei {biz}.")

        html = self._demo_html(biz, industry, greeting, config)
        self._send_html(html)

    def _demo_html(self, biz, industry, greeting, config):
        lp = config.get("landing_page", {}) or {}
        headline = lp.get("headline", f"Intelligente KI-Lösungen für {biz}")
        subtitle = lp.get("subtitle", lp.get("description", "Steigern Sie Ihre Effizienz mit unserer KI-Chatbot-Technologie."))
        return f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{biz} — NeXify AI Demo</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Manrope:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{{--bg:#09090b;--panel:rgba(255,255,255,0.03);--line:rgba(255,255,255,0.08);--silver:#d4d4d8;--silver2:#a1a1aa;--white:#fafafa;--muted:#71717a;--green:#22c55e}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:var(--bg);color:var(--silver);font-family:'Manrope',sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center}}
header{{padding:32px 0;text-align:center}}
h1{{font-family:'Outfit',sans-serif;font-size:32px;color:var(--white)}}
h1 span{{color:var(--silver)}}
h2{{font-family:'Outfit',sans-serif;font-size:20px;color:var(--silver2);margin-top:8px}}
.hero{{max-width:800px;width:90%;margin:24px auto;padding:48px;background:var(--panel);border:1px solid var(--line);border-radius:16px;text-align:center}}
.hero p{{font-size:18px;line-height:1.7;color:var(--silver2)}}
.badge{{display:inline-block;background:var(--green);color:var(--bg);font-size:12px;padding:4px 12px;border-radius:999px;margin-bottom:16px}}
.chat-container{{max-width:800px;width:90%;margin:24px auto 40px;padding:32px;background:var(--panel);border:1px solid var(--line);border-radius:16px}}
.chat-bubble{{padding:12px 16px;border-radius:12px;margin:8px 0;max-width:80%}}
.chat-bot{{background:rgba(255,255,255,0.05);color:var(--silver)}}
.chat-user{{background:linear-gradient(135deg,var(--silver),var(--silver2));color:var(--bg);margin-left:auto;text-align:right}}
.cta{{display:inline-block;padding:14px 36px;border-radius:10px;background:linear-gradient(135deg,var(--white),var(--silver),var(--muted));color:var(--bg);font-family:'Outfit',sans-serif;font-weight:600;text-decoration:none;margin-top:20px;transition:opacity .2s}}
.cta:hover{{opacity:.9}}
.footer{{margin-top:auto;padding:20px;font-size:12px;color:var(--muted);text-align:center}}
</style></head><body>
<header><h1><span>{biz}</span></h1><h2>{industry}</h2></header>
<div class="hero"><span class="badge">KI-Chatbot Demo</span><p>{headline}</p><p style="font-size:16px;margin-top:12px">{subtitle}</p><a href="#chat" class="cta">Jetzt Chatbot testen</a></div>
<div class="chat-container" id="chat">
<div class="chat-bubble chat-bot">{greeting}</div>
<div class="chat-bubble chat-bot" style="margin-top:4px">Wie kann ich Ihnen heute helfen?</div>
</div>
<div class="footer">Powered by <strong>NeXifyAI</strong> · {config.get("template_id", "demo")} · generiert am {config.get("generated_at", "heute")[:10]}</div>
</body></html>"""

    def _demo_error(self, msg):
        return f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Demo nicht verfügbar</title>
<style>body{{background:#09090b;color:#d4d4d8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}}.card{{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px;text-align:center}}h1{{color:#fafafa}}p{{color:#71717a}}a{{color:#a1a1aa}}</style></head>
<body><div class="card"><h1>Demo nicht verfügbar</h1><p>{msg}</p><a href="/">← Dashboard</a></div></body></html>"""

    def _send_html(self, html):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(html.encode())


if __name__ == "__main__":
    # Start SSE broadcaster thread
    threading.Thread(target=_sse_broadcast, daemon=True).start()

    class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
        """Threaded HTTPServer — one thread per request, no single-client blocking."""
        allow_reuse_address = True
    server = ThreadedHTTPServer(("127.0.0.1", PORT), PortalHandler)
    print(f"NeXifyAI Portal running on :{PORT}")
    server.serve_forever()
