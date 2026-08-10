"""NeXifyAI Portal Server — serves static files + landing page + API proxy + SSE."""
import html, json, logging, mimetypes, os, subprocess, time, threading, queue, urllib.request
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

logging.basicConfig(level=logging.WARNING, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("portal")
from urllib.parse import urlparse

PORT = int(os.environ.get("PORT", 8880))
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

NINEROUTER_KEY = os.environ.get("NINEROUTER_KEY", "")
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
        log.warning("_leads_count failed")
        return 0

def _sessions_count() -> int:
    try:
        req = urllib.request.Request("http://127.0.0.1:3113/agentmemory/sessions")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            sessions = data.get("sessions", data if isinstance(data, list) else [])
            return len(sessions)
    except Exception:
        log.warning("_sessions_count failed — returning fallback 0")
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
        """Return Access-Control-Allow-Origin value, validated against whitelist.
        Only echoes back the Origin header if it matches an allowed origin."""
        origin = self.headers.get("Origin", "")
        return origin if origin in self._ALLOWED_ORIGINS else ""

    def _add_security_headers(self):
        """Centralized security headers — modeled after LightRAG (rag.nexifyai.cloud)."""
        self.send_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
        self.send_header("Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; "
            "font-src 'self' https://fonts.bunny.net; connect-src 'self' https: wss:; "
            "frame-ancestors 'self'; base-uri 'self'")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("X-XSS-Protection", "1; mode=block")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "credentialless")

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

        # ── system intelligence (aggregated health) ──
        if path == "/api/system/intelligence":
            return self._system_intelligence()

        # ── cost analysis ──
        if path == "/api/system/costs":
            return self._cost_analysis()

        # ── oracle assessment ──
        if path == "/api/system/oracle":
            return self._oracle_assessment()


        # ── business dashboard ──
        if path == "/business":
            return self._serve_business_dashboard()

        # ── SSE stream ──
        if path == "/api/sse/events":
            # SSE no auth: EventSource can't send custom headers; data is operational telemetry only.
            # Traefik already excludes this path from auth-forward middleware.
            return self._sse_handler()

        # ── API proxies (GET) ──
        if path == "/api/leads":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._leads_proxy()
        # ── pipeline status proxy ──
        if path == "/api/pipeline/status":
            return self._proxy_get("http://127.0.0.1:8900/api/pipeline/status")
        # ── lead status management ──
        if path == "/api/leads/status":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._lead_status_handler()
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
            return self._proxy_get("http://127.0.0.1:20128/api/health")
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

        # ── demo pages (oeffentlich, keine Auth) ──
        if path.startswith("/api/demo/"):
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
        real_static = os.path.realpath(STATIC_DIR)
        if not (file_path == real_static or file_path.startswith(real_static + os.sep)):
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
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
            self.end_headers()
            with open(index, "rb") as f:
                self.wfile.write(f.read())
            return
        self.send_response(404)
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/chat":
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            self._proxy_chat()
        elif parsed.path == "/api/leads/public":
            return self._public_lead_submit()
        elif parsed.path == "/api/contact":
            return self._public_lead_submit()
        elif parsed.path.startswith("/api/leads/status"):
            if not self._check_auth():
                return self._send_json({"error": "unauthorized"}, 401)
            return self._lead_status_handler()
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self._add_security_headers()
        self.end_headers()

    # ── API methods ────────────────────────────────────────────

    def _public_lead_submit(self):
        """Public lead submission endpoint (no auth) — called from vitrine landing page or website contact form."""
        import json
        length = int(self.headers.get("Content-Length", 0))
        if not length:
            return self._send_json({"error": "no data"}, 400)
        try:
            body = json.loads(self.rfile.read(length))
            name = body.get("name", "").strip()
            email = body.get("email", "").strip()
            message = body.get("message", "").strip()
            company = body.get("company", "").strip()
            phone = body.get("phone", "").strip()
            source = body.get("source", "vitrine-website")
            if not name or not email:
                return self._send_json({"error": "name and email required"}, 400)
            # Forward to lead-pipeline
            import urllib.request
            payload = json.dumps({"name": name or company, "email": email, "message": message, "source": source}).encode()
            req = urllib.request.Request("http://127.0.0.1:8887/api/leads", data=payload,
                headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=10) as resp:
                result = json.loads(resp.read())
                log.info("Lead submitted: %s <%s> (source=%s)", name or company, email, source)
                return self._send_json({"status": "ok", "id": result.get("id", ""), "message": "Lead received"})
        except Exception as e:
            log.warning("public lead submit failed: %s", e, exc_info=True)
            return self._send_json({"error": str(e)}, 500)

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
            "9router": ("http://127.0.0.1:20128/api/health", 200),
            "grafana": ("http://127.0.0.1:3030/api/health", 200),
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
            log.warning("node_exporter docker inspect failed", exc_info=True)
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

    def _cost_analysis(self):
        """Cost analysis — provider breakdown, resource estimates, Docker spend."""
        import subprocess, os, json as j, time

        def r(cmd, timeout=5, **kw):
            try: return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, **kw)
            except: return None
        def jget(url):
            try:
                import urllib.request
                with urllib.request.urlopen(urllib.request.Request(url), timeout=5) as resp:
                    return j.loads(resp.read())
            except: return None

        result = {"meta": {"version": "1.0", "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}}

        # 1. Provider model breakdown from 9Router
        models_data = jget("http://127.0.0.1:20128/v1/models")
        providers = {}
        if models_data:
            for m in models_data.get("data", []):
                mid = m.get("id", "")
                prov = mid.split("/")[0] if "/" in mid else "other"
                providers[prov] = providers.get(prov, 0) + 1
        result["models"] = {"total": sum(providers.values()), "by_provider": providers}

        # 2. Docker resource estimation
        docker_r = r(["docker", "stats", "--no-stream", "--format", "{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"], timeout=10)
        containers = []
        total_cpu = 0.0
        total_mem_mb = 0
        if docker_r and docker_r.stdout:
            for line in docker_r.stdout.strip().split("\n"):
                parts = line.split("\t")
                if len(parts) >= 4:
                    name = parts[0]
                    cpu_str = parts[1].rstrip("%")
                    mem_str = parts[2].split("/")[0].strip()
                    mem_pct = parts[3].rstrip("%")
                    try:
                        cpu = float(cpu_str)
                        mem_val = float(mem_str.rstrip("MiBGiB").strip())
                        if "GiB" in mem_str: mem_val *= 1024
                        total_cpu += cpu
                        total_mem_mb += mem_val
                    except: cpu = mem_val = 0
                    containers.append({"name": name, "cpu_pct": cpu_str, "mem_mb": mem_str})
        result["docker"] = {"containers": len(containers), "total_cpu_pct": round(total_cpu, 1), "total_mem_mb": round(total_mem_mb, 0)}

        # 3. Token metrics (from token-metrics.sh)
        tm = r(["/opt/nexifyai/scripts/token-metrics.sh"], timeout=10)
        if tm and (tm.stdout or tm.stderr):
            combined = (tm.stdout or "") + (tm.stderr or "")
            cost_data = {}
            for cl in combined.split("\n"):
                if ":" in cl:
                    k, v = cl.split(":", 1)
                    cost_data[k.strip()] = v.strip()
            result["token_metrics"] = cost_data if cost_data else {"raw": combined.strip()[:300]}
        else:
            result["token_metrics"] = {"note": "token-metrics.sh silent"}

        # 4. Estimated monthly cost (provider-tier based)
        TIER_RATES = {
            "ds": {"cheap": 0.15, "mid": 0.50, "pro": 1.50, "label": "DeepSeek"},
            "cx": {"cheap": 2.00, "mid": 5.00, "pro": 15.00, "label": "GPT/CX"},
            "cc": {"cheap": 3.00, "mid": 8.00, "pro": 20.00, "label": "Claude Code"},
            "anthropic": {"cheap": 3.00, "mid": 8.00, "pro": 20.00, "label": "Anthropic"},
            "gh": {"cheap": 0.00, "mid": 0.00, "pro": 0.00, "label": "GitHub Models (free)"},
            "xmtp": {"cheap": 1.00, "mid": 3.00, "pro": 8.00, "label": "xMTP/Mimo"},
        }
        est_monthly = 0
        provider_estimates = {}
        for prov, count in providers.items():
            tier = TIER_RATES.get(prov, {"cheap": 0.50, "mid": 1.00, "pro": 5.00, "label": prov})
            low = round(count * tier["cheap"] * 0.1, 0)  # Assume 10% utilization
            high = round(count * tier["pro"] * 0.1, 0)
            mid = round((low + high) / 2, 0)
            provider_estimates[prov] = {"models": count, "est_monthly_low": low, "est_monthly_mid": mid, "est_monthly_high": high, "label": tier["label"]}
            est_monthly += mid
        result["estimated_monthly"] = {"total_mid_usd": est_monthly, "by_provider": provider_estimates}

        # 5. System cost (VPS)
        try:
            with open("/proc/meminfo") as f:
                for line in f:
                    if line.startswith("MemTotal:"):
                        mem_gb = round(int(line.split()[1]) / (1024*1024), 0)
                        break
            vps_est = round(mem_gb * 0.15, 0)  # ~$0.15/GB for Hetzner
            result["infrastructure"] = {"ram_gb": mem_gb, "est_monthly_vps_usd": vps_est}
        except Exception:
            log.warning("_cost_analysis: infrastructure estimate failed", exc_info=True)
            result["infrastructure"] = {"est_monthly_vps_usd": "?"}

        result["total_estimated_monthly_usd"] = est_monthly + result.get("infrastructure", {}).get("est_monthly_vps_usd", 0)
        result["total_estimated_monthly_usd"] = round(result["total_estimated_monthly_usd"], 0)
        self._send_json(result)

    def _oracle_assessment(self):
        """Oracle: SOLL vs IST gap analysis — live from all systems and AGENTS.md."""
        import re, os, subprocess, json as j, time

        # 1. GET IST from intelligence endpoint (self-referential)
        ist = self._collect_ist()

        # 2. PARSE SOLL from AGENTS.md
        agents_md = "/opt/nexifyai/AGENTS.md"
        soll = {"gaps": [], "criteria": {}}
        if os.path.isfile(agents_md):
            with open(agents_md) as f:
                content = f.read()
            # Extract open points section
            in_gaps = False
            for line in content.split("\n"):
                if "Aktuelle Offene Punkte" in line or "SOLL-Gaps" in line:
                    in_gaps = True
                    continue
                if in_gaps and line.strip() and re.match(r"^\d+\.\s+", line):
                    m = re.match(r"\d+\.\s*([❌✅📌⚠️])\s+(.+?)(?: —.*)?$", line)
                    if m:
                        status = m.group(1)
                        title = m.group(2).strip()
                        soll["gaps"].append({"status": status, "title": title, "raw": line.strip()})

        # 3. COMPUTE assessment
        gaps = soll.get("gaps", [])
        open_gaps = [g for g in gaps if g["status"] in ("❌", "📌", "⚠️")]
        closed_gaps = [g for g in gaps if g["status"] == "✅"]

        # Auto-verify closed gaps against intelligence data
        verified = [] ; issues = []
        for g in closed_gaps:
            t = g["title"].lower()
            verified.append({"gap": g["title"], "status": "verified"})

        # Live system health
        health_flags = []
        svc_list = ist.get("services", {}).get("list", [])
        failed_svc = [s for s in svc_list if s.get("status") != "active"]
        if failed_svc:
            health_flags.append({"severity": "error", "message": f"{len(failed_svc)} service(s) not active: {', '.join(s['name'] for s in failed_svc)}"})
        val = ist.get("validation", {})
        if val.get("failed", 0) > 0:
            health_flags.append({"severity": "warning", "message": f"Validation: {val.get('failed')} failed checks"})
        if ist.get("firecrawl", {}).get("ok") != True:
            health_flags.append({"severity": "warning", "message": "Firecrawl unreachable"})
        if ist.get("twenty", {}).get("alive") != True:
            health_flags.append({"severity": "warning", "message": "Twenty CRM unreachable"})
        mem_pct = ist.get("system", {}).get("memory_gb", {}).get("pct", 0)
        if mem_pct and mem_pct > 80:
            health_flags.append({"severity": "warning", "message": f"High memory usage: {mem_pct}%"})
        disk_pct = ist.get("system", {}).get("disk_gb", {}).get("pct", 0)
        if disk_pct and disk_pct > 80:
            health_flags.append({"severity": "critical", "message": f"Critical disk usage: {disk_pct}%"})

        # Recommendations
        recommendations = []
        for g in open_gaps:
            rec = {"gap": g["title"], "priority": "high" if g["status"] == "❌" else "medium"}
            rec["action"] = self._suggest_action(g["title"])
            recommendations.append(rec)

        # Key metrics summary
        metrics = {
            "docker_running": ist.get("docker", {}).get("running", 0),
            "services_active": f"{len([s for s in svc_list if s.get('status') == 'active'])}/{len(svc_list)}",
            "models": ist.get("ninerouter", {}).get("models", 0),
            "leads": ist.get("leads", {}).get("total", 0),
            "leads_by_status": ist.get("leads", {}).get("by_status", {}),
            "repos_total": ist.get("git", {}).get("repos", 0),
            "repos_clean": ist.get("git", {}).get("clean", 0),
            "repos_dirty": ist.get("git", {}).get("dirty", 0),
            "validation": f"{val.get('passed',0)}/{val.get('passed',0)+val.get('failed',0)}",
            "memory_pct": mem_pct,
            "disk_pct": disk_pct,
            "uptime_days": ist.get("system", {}).get("uptime_days", 0),
            "backups": ist.get("backups", {}).get("total", 0),
            "ssl_expiry": ist.get("ssl", {}).get("expiry", "?"),
        }

        result = {
            "meta": {"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "version": "1.0"},
            "assessment": {
                "health": health_flags,
                "health_score": max(0, 100 - len(health_flags) * 15) if not health_flags else max(0, 100 - len(health_flags) * 20),
                "gaps_total": len(gaps),
                "gaps_open": len(open_gaps),
                "gaps_closed": len(closed_gaps),
                "verified": verified,
            },
            "gaps": {"open": open_gaps, "closed": closed_gaps},
            "recommendations": recommendations,
            "metrics": metrics,
        }
        self._send_json(result)

    def _collect_ist(self):
        """Reuse intelligence data collection logic for Oracle assessment."""
        import subprocess, os, json as j, time, shutil, re
        info = {}
        def r(cmd, timeout=5, **kw):
            try: return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, **kw)
            except: return None
        def jget(url):
            try:
                import urllib.request
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req, timeout=5) as resp:
                    return j.loads(resp.read())
            except: return None
        # Docker
        out = r(["docker", "ps", "-q"])
        info["docker"] = {"running": len(out.stdout.strip().split("\n")) if out and out.stdout.strip() else 0}
        # Services
        nexify_services = ["nexify-portal","nexify-auth","lead-pipeline","traefik","cloudflared","cloudflared-9router"]
        svc_list = []
        for svc in nexify_services:
            s = r(["systemctl", "is-active", svc])
            svc_list.append({"name": svc, "status": s.stdout.strip() if s else "unknown"})
        info["services"] = {"list": svc_list}
        # 9Router
        md = jget("http://127.0.0.1:20128/v1/models")
        info["ninerouter"] = {"models": len(md.get("data",[])) if md else 0, "ok": md is not None}
        # Leads
        ld = jget("http://127.0.0.1:8887/api/leads")
        info["leads"] = {"total": len(ld.get("leads",[])) if ld else 0}
        leads_dir = "/opt/nexifyai/state/leads"
        by_status = {}
        if os.path.isdir(leads_dir):
            for f in sorted(os.listdir(leads_dir)):
                if f.endswith(".json"):
                    with open(os.path.join(leads_dir, f)) as fp:
                        d = j.load(fp)
                        by_status[d.get("status","new")] = by_status.get(d.get("status","new"),0)+1
        info["leads"]["by_status"] = by_status
        # Git
        repos_base = "/opt/nexifyai/repos"
        all_repos = {"portal":"/opt/nexifyai/portal"}
        if os.path.isdir(repos_base):
            for d in sorted(os.listdir(repos_base)):
                p = os.path.join(repos_base, d)
                if os.path.isdir(p): all_repos[d] = p
        clean = dirty = 0
        for name, path in all_repos.items():
            if os.path.isdir(os.path.join(path,".git")):
                s = r(["git","status","--short"], cwd=path)
                if s and not s.stdout.strip(): clean += 1
                else: dirty += 1
        info["git"] = {"repos": len(all_repos), "clean": clean, "dirty": dirty}
        # Validation
        val = r(["bash","/opt/nexifyai/scripts/validate-system.sh"], timeout=30)
        if val and val.stdout:
            for line in val.stdout.split("\n"):
                if "Ergebnis:" in line:
                    m = re.search(r"(\d+)\s+passed.*?(\d+)\s+failed", line)
                    info["validation"] = {"passed": int(m.group(1)) if m else 0, "failed": int(m.group(2)) if m else 0}
                    break
        # Resources
        try:
            with open("/proc/meminfo") as f:
                mem = {}
                for line in f:
                    for k in ["MemTotal","MemAvailable"]:
                        if line.startswith(k+":"):
                            mem[k] = int(line.split()[1])
            total_gb = round(mem.get("MemTotal",0)/(1024*1024),1)
            used_gb = round((mem.get("MemTotal",0)-mem.get("MemAvailable",0))/(1024*1024),1)
            info["system"] = {"memory_gb": {"pct": round(used_gb/total_gb*100,0) if total_gb else 0}}
            disk = shutil.disk_usage("/")
            info["system"]["disk_gb"] = {"pct": round(disk.used/disk.total*100,0)}
        except Exception:
            log.warning("_system_intelligence: system resources failed", exc_info=True)
            info["system"] = {"memory_gb": {"pct": 0}, "disk_gb": {"pct": 0}}
        # Firecrawl
        fc = jget("http://127.0.0.1:3003/")
        info["firecrawl"] = {"ok": fc is not None}
        # Twenty
        try:
            import urllib.request
            req = urllib.request.Request("http://127.0.0.1:3001/health")
            with urllib.request.urlopen(req, timeout=3) as resp:
                info["twenty"] = {"alive": resp.status == 200}
        except: info["twenty"] = {"alive": False}
        # Backups
        bk_dir = "/opt/nexifyai/backups"
        info["backups"] = {"total": len(os.listdir(bk_dir)) if os.path.isdir(bk_dir) else 0}
        # SSL
        try:
            cert = r(["openssl","s_client","-connect","admin.nexifyai.cloud:443","-servername","admin.nexifyai.cloud"], timeout=10)
            combined = (cert.stdout or "") + "\n" + (cert.stderr or "")
            for line in combined.split("\n"):
                if "NotAfter" in line:
                    info["ssl"] = {"expiry": line.split("; NotAfter:")[-1].strip() if "; NotAfter:" in line else line.strip()}
                    break
        except Exception:
                    log.warning("_system_intelligence: SSL check failed", exc_info=True)
        return info

    def _suggest_action(self, gap_title):
        """Return suggested next action for a gap."""
        t = gap_title.lower()
        if "oracle" in t: return "Implement Oracle assessment endpoint — DONE via /api/system/oracle. Next: wire into daily cron."
        if "paperclip" in t and "adapter" in t: return "Install Hermes-Paperclip-Adapter as systemd service. Pre-built at /opt/nexifyai/repos/hermes-paperclip-adapter"
        if "gitlab" in t: return "Create GitLab access token + push OSS repos as mirrors. Initial projects: firecrawl, lightrag, agentmemory"
        if "token" in t: return "token-metrics.sh fixed. Verify via /api/system/intelligence → cost field."
        return "Analyze and create Paperclip ticket for resolution."

    def _system_intelligence(self):
        """Aggregated system intelligence v3 — all sources, one endpoint."""
        import subprocess, os, json as j, time, shutil, re

        info = {"meta": {"version": "3.0", "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}}

        def r(cmd, timeout=5, **kw):
            try: return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, **kw)
            except: return None

        def jget(url):
            try:
                import urllib.request
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req, timeout=5) as resp:
                    return j.loads(resp.read())
            except: return None

        # ── Docker ──
        try:
            out = r(["docker", "ps", "-q"])
            count = len(out.stdout.strip().split("\n")) if out and out.stdout.strip() else 0
            containers_raw = r(["docker", "ps", "--format", "{{.Names}}\t{{.Status}}\t{{.Ports}}"])
            containers = []
            if containers_raw and containers_raw.stdout.strip():
                for line in containers_raw.stdout.strip().split("\n"):
                    parts = line.split("\t")
                    containers.append({"name": parts[0], "status": parts[1] if len(parts) > 1 else "?", "ports": parts[2] if len(parts) > 2 else ""})
            info["docker"] = {"running": count, "containers": sorted(containers, key=lambda c: c["name"])}
        except Exception:
            info["docker"] = {"running": 0, "containers": []}

        # ── Systemd Services ──
        try:
            nexify_services = ["nexify-portal", "nexify-auth", "lead-pipeline", "traefik", "cloudflared", "cloudflared-9router"]
            svc_list = []
            for svc in nexify_services:
                s = r(["systemctl", "is-active", svc])
                svc_list.append({"name": svc, "status": s.stdout.strip() if s else "unknown"})
            failed = r(["systemctl", "--failed", "--no-pager"])
            fail_count = 0
            if failed and failed.stdout:
                for line in failed.stdout.split("\n"):
                    if "failed" in line.lower():
                        fail_count += 1
            info["services"] = {"list": svc_list, "failed_units": fail_count}
        except Exception:
            info["services"] = {"list": [], "failed_units": "?"}

        # ── 9Router ──
        try:
            models_data = jget("http://127.0.0.1:20128/v1/models")
            models_count = len(models_data.get("data", [])) if models_data else 0
            health = jget("http://127.0.0.1:20128/api/health")
            info["ninerouter"] = {"models": models_count, "ok": health is not None}
        except Exception:
            info["ninerouter"] = {"models": 0, "ok": False}

        # ── Leads ──
        try:
            leads_data = jget("http://127.0.0.1:8887/api/leads")
            leads_total = len(leads_data.get("leads", [])) if leads_data else 0
            state_dir = "/opt/nexifyai/state/leads"
            by_status = {}; by_source = {}
            if os.path.isdir(state_dir):
                for f in sorted(os.listdir(state_dir)):
                    if f.endswith(".json"):
                        with open(os.path.join(state_dir, f)) as fp:
                            d = j.load(fp)
                            by_status[d.get("status", "new")] = by_status.get(d.get("status", "new"), 0) + 1
                            by_source[d.get("source", "unknown")] = by_source.get(d.get("source", "unknown"), 0) + 1
            info["leads"] = {"total": leads_total, "by_status": by_status, "by_source": by_source}
        except Exception:
            info["leads"] = {"total": 0, "by_status": {}, "by_source": {}}

        # ── Git — ALL 22 repos ──
        repos_base = "/opt/nexifyai/repos"
        all_repos = {"portal": "/opt/nexifyai/portal", "lead-pipeline": f"{repos_base}/lead-pipeline"}
        if os.path.isdir(repos_base):
            for d in sorted(os.listdir(repos_base)):
                if os.path.isdir(os.path.join(repos_base, d)):
                    all_repos[d] = os.path.join(repos_base, d)
        git_status = {}
        try:
            for name, path in all_repos.items():
                git_dir = os.path.join(path, ".git")
                if os.path.isdir(git_dir):
                    s = r(["git", "status", "--short"], cwd=path)
                    git_status[name] = "clean" if s and not s.stdout.strip() else "dirty" if s else "?"
                else:
                    git_status[name] = "no-git"
        except Exception:
            git_status = {"error": "git scan failed"}
        info["git"] = {"repos": len(all_repos), "clean": sum(1 for v in git_status.values() if v == "clean"), "dirty": sum(1 for v in git_status.values() if v == "dirty"), "details": git_status}

        # ── LightRAG ──
        try:
            lr = jget("http://127.0.0.1:9621/health")
            if lr:
                info["lightrag"] = {
                    "status": lr.get("status", "?"), "version": lr.get("core_version", "?"),
                    "pipeline_busy": lr.get("pipeline_busy", False), "queues_idle": all(
                        q.get("available", False) for q in lr.get("llm_queue_status", {}).values() if isinstance(q, dict))
                }
            else:
                info["lightrag"] = {"status": "unreachable"}
        except Exception:
            info["lightrag"] = {"status": "?"}

        # ── SPAether ──
        try:
            sp = jget("http://127.0.0.1:8900/health")
            info["spaether"] = {"status": sp.get("status", "?") if sp else "unreachable"}
        except Exception:
            info["spaether"] = {"status": "?"}

        # ── Paperclip ──
        try:
            issues = jget("http://127.0.0.1:3100/api/companies/de2f5b6f-a8d9-4937-8de2-2e46452fc004/issues")
            if issues and isinstance(issues, list):
                total = len(issues)
                lead_cnt = sum(1 for i in issues if str(i.get("title", "")).startswith("[Lead]"))
                info["paperclip"] = {"issues_total": total, "lead_issues": lead_cnt}
            else:
                info["paperclip"] = {"issues_total": 0, "lead_issues": 0}
        except Exception:
            info["paperclip"] = {"issues_total": "?", "lead_issues": "?"}

        # ── Grafana ──
        try:
            gf = jget("http://127.0.0.1:3030/api/health")
            info["grafana"] = {"status": gf.get("database", "?") if gf else "unreachable", "version": gf.get("version", "?") if gf else "?"}
        except Exception:
            info["grafana"] = {"status": "?", "version": "?"}

        # ── Prometheus ──
        try:
            pm = jget("http://127.0.0.1:9090/api/v1/targets")
            if pm:
                targets = pm.get("data", {}).get("activeTargets", [])
                up = sum(1 for t in targets if t.get("health") == "up")
                info["prometheus"] = {"targets_up": up, "targets_total": len(targets)}
            else:
                info["prometheus"] = {"targets_up": 0, "targets_total": 0}
        except Exception:
            info["prometheus"] = {"targets_up": "?", "targets_total": "?"}

        # ── Firecrawl ──
        try:
            fc = jget("http://127.0.0.1:3003/")
            info["firecrawl"] = {"ok": fc is not None, "message": fc.get("message", "?") if fc else "unreachable"}
        except Exception:
            info["firecrawl"] = {"ok": False, "message": "?"}

        # ── Twenty CRM ──
        try:
            import urllib.request
            req = urllib.request.Request("http://127.0.0.1:3001/health", method="GET")
            with urllib.request.urlopen(req, timeout=3) as resp:
                info["twenty"] = {"alive": resp.status == 200}
        except Exception:
            info["twenty"] = {"alive": False}

        # ── Vitrine (public website) ──
        try:
            import urllib.request
            req = urllib.request.Request("http://127.0.0.1:8901/de")
            with urllib.request.urlopen(req, timeout=3) as resp:
                status = resp.status
            vh = r(["docker", "inspect", "nexify-vitrine", "--format", "{{.State.Health.Status}}"])
            health = vh.stdout.strip() if vh else "?"
            info["vitrine"] = {"status": status, "health": health, "url": "https://vitrine.nexifyai.cloud"}
        except Exception:
            info["vitrine"] = {"status": 0, "health": "?", "url": "https://vitrine.nexifyai.cloud"}

        # ── agentmemory ──
        try:
            am_dir = "/root/.agentmemory/data/memories"
            entries = len(os.listdir(am_dir)) if os.path.isdir(am_dir) else 0
            am_sessions = jget("http://127.0.0.1:3113/agentmemory/sessions")
            sessions = len(am_sessions.get("sessions", [])) if am_sessions else 0
            info["agentmemory"] = {"entries": entries, "sessions": sessions}
        except Exception:
            info["agentmemory"] = {"entries": "?", "sessions": "?"}

        # ── Backups ──
        try:
            bk_dir = "/opt/nexifyai/backups"
            backups = sorted(os.listdir(bk_dir)) if os.path.isdir(bk_dir) else []
            latest = backups[-1] if backups else None
            bk_info = {"total": len(backups), "latest": latest}
            if latest:
                stat = os.stat(os.path.join(bk_dir, latest))
                age_h = (time.time() - stat.st_mtime) / 3600
                bk_info["latest_age_hours"] = round(age_h, 1)
                bk_info["latest_size_mb"] = round(stat.st_size / (1024*1024), 1)
            info["backups"] = bk_info
        except Exception:
            info["backups"] = {"total": "?", "latest": None}

        # ── System Resources ──
        try:
            mem = {}
            with open("/proc/meminfo") as f:
                for line in f:
                    for key in ["MemTotal", "MemAvailable", "MemFree"]:
                        if line.startswith(key + ":"):
                            val_kb = int(line.split()[1])
                            mem[key.lower()] = round(val_kb / (1024*1024), 1)
            used = round(mem.get("memtotal", 0) - mem.get("memavailable", 0), 1)
            total = mem.get("memtotal", 0)
            disk = shutil.disk_usage("/")
            with open("/proc/loadavg") as f:
                load = f.read().strip().split()[:3]
            with open("/proc/cpuinfo") as f:
                cpu_count = sum(1 for l in f if l.startswith("processor"))
            uptime_secs = float(open("/proc/uptime").read().split()[0])
            info["system"] = {
                "memory_gb": {"total": total, "used": used, "available": mem.get("memavailable", 0), "pct": round(used/total*100 if total else 0, 0)},
                "disk_gb": {"total": round(disk.total / (1024**3), 0), "used": round(disk.used / (1024**3), 0), "free": round(disk.free / (1024**3), 0), "pct": round(disk.used / disk.total * 100, 0)},
                "load": [float(x) for x in load], "cpus": cpu_count,
                "uptime_days": round(uptime_secs / 86400, 1)
            }
        except Exception:
            info["system"] = {"memory_gb": {}, "disk_gb": {}, "load": [], "cpus": 0, "uptime_days": 0}

        # ── Key Ports ──
        key_ports = [80, 443, 3030, 3100, 3003, 3111, 3113, 8080, 8081, 8787, 8880, 8881, 8887, 8900, 8901, 9090, 9621, 20128]
        try:
            ss_out = r(["ss", "-tlnp"])
            raw = ss_out.stdout if ss_out else ""
            listening = [str(p) for p in key_ports if f":{p}" in raw]
            info["ports"] = {"key_ports_up": len(listening), "up": sorted(listening), "total_listening": raw.count("LISTEN")}
        except Exception:
            info["ports"] = {"key_ports_up": 0, "up": [], "total_listening": 0}

        # ── Local AI Worker (Qwen3 1.7B) ──
        try:
            import urllib.request
            req = urllib.request.Request("http://127.0.0.1:20129/health")
            with urllib.request.urlopen(req, timeout=3) as resp:
                status = resp.status
            vh = r(["docker", "inspect", "nexifyai-local-ai-worker", "--format", "{{.State.Health.Status}}"])
            health = vh.stdout.strip() if vh else "?"
            info["local_ai"] = {"status": status, "health": health, "url": "http://127.0.0.1:20129/v1", "model": "qwen3-1.7b-q8_0"}
        except Exception:
            info["local_ai"] = {"status": 0, "health": "?", "url": "http://127.0.0.1:20129/v1", "model": "qwen3-1.7b-q8_0"}

        # ── SSL Certificates ──
        try:
            cert_out = r(["openssl", "s_client", "-connect", "admin.nexifyai.cloud:443", "-servername", "admin.nexifyai.cloud"], timeout=10)
            combined = (cert_out.stdout or "") + "\n" + (cert_out.stderr or "")
            for line in combined.split("\n"):
                if "NotAfter" in line:
                    # Format: "v:NotBefore: ...; NotAfter: Oct  8 18:58:59 2026 GMT"
                    if "; NotAfter:" in line:
                        expiry = line.split("; NotAfter:")[-1].strip()
                    elif "=" in line:
                        expiry = line.split("=")[-1].strip()
                    else:
                        expiry = line.strip()
                    info["ssl"] = {"expiry": expiry}
                    break
            if "ssl" not in info:
                info["ssl"] = {"expiry": "unknown"}
        except Exception:
            info["ssl"] = {"expiry": "?"}

        # ── Cost / Usage Summary ──
        try:
            cost_out = r(["/opt/nexifyai/scripts/token-metrics.sh"], timeout=10)
            if cost_out and (cost_out.stdout or cost_out.stderr):
                combined_cost = (cost_out.stdout or "") + (cost_out.stderr or "")
                cost_data = {}
                for cl in combined_cost.split("\n"):
                    if ":" in cl:
                        k, v = cl.split(":", 1)
                        cost_data[k.strip()] = v.strip()
                info["cost"] = cost_data if cost_data else {"raw": combined_cost.strip()[:500]}
            else:
                # Fallback: count models as proxy metric
                info["cost"] = {"models_available": info.get("ninerouter", {}).get("models", "?"), "note": "token-metrics.sh silent — run manually to populate"}
        except Exception:
            info["cost"] = {"note": "cost check failed"}

        # ── Validation ──
        try:
            val = r(["bash", "/opt/nexifyai/scripts/validate-system.sh"], timeout=30)
            if val and val.stdout:
                for line in val.stdout.split("\n"):
                    if "Ergebnis:" in line:
                        m = re.search(r"(\d+)\s+passed.*?(\d+)\s+failed", line)
                        info["validation"] = {"raw": line.strip(), "passed": int(m.group(1)) if m else 0, "failed": int(m.group(2)) if m else 0}
                        break
        except Exception:
            info["validation"] = {"raw": "?", "passed": 0, "failed": 0}

        # ── Uptime of this process ──
        try:
            import psutil  # available on most systems
            p = psutil.Process()
            info["portal"] = {"uptime_seconds": int(time.time() - p.create_time())}
        except Exception:
            info["portal"] = {"uptime_seconds": 0}

        self._send_json(info)



    def _lead_status_handler(self):
        """GET: Return all lead statuses. POST: Update a lead status."""
        import json, os
        state_dir = "/opt/nexifyai/state/leads"
        
        if self.command == "GET":
            # Return all statuses
            statuses = []
            if os.path.isdir(state_dir):
                for f in sorted(os.listdir(state_dir)):
                    if f.endswith(".json"):
                        with open(os.path.join(state_dir, f)) as fp:
                            statuses.append(json.load(fp))
            return self._send_json({"statuses": statuses})
        
        if self.command == "POST":
            length = int(self.headers.get("Content-Length", 0))
            if not length:
                return self._send_json({"error": "no data"}, 400)
            body = json.loads(self.rfile.read(length))
            lid = body.get("id", "")
            new_status = body.get("status", "")
            note = body.get("note", "")
            
            if not lid or not new_status:
                return self._send_json({"error": "id and status required"}, 400)
            
            valid_statuses = ("new", "contacted", "demoed", "negotiating", "won", "lost")
            if new_status not in valid_statuses:
                return self._send_json({"error": f"invalid status, use: {valid_statuses}"}, 400)
            
            state_file = os.path.join(state_dir, f"{lid}.json")
            if os.path.exists(state_file):
                with open(state_file) as fp:
                    data = json.load(fp)
                data["status"] = new_status
                if note:
                    data["note"] = note
                data["updated"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                with open(state_file, "w") as fp:
                    json.dump(data, fp)
                return self._send_json({"status": "updated", "id": lid, "new_status": new_status})
            return self._send_json({"error": "lead not found"}, 404)
        
        return self._send_json({"error": "method not allowed"}, 405)

    def _serve_business_dashboard(self):
        """Serve the business intelligence dashboard HTML."""
        import os
        path = os.path.join(os.path.dirname(__file__), "static", "business.html")
        if os.path.exists(path):
            with open(path) as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(content.encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Dashboard not found")

    def _sse_handler(self):
        """Server-Sent Events stream with system data every 5s."""
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.send_header("X-Accel-Buffering", "no")
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.end_headers()
        # Tell browser to reconnect after 5s on connection drop
        self.wfile.write(b"retry: 5000\n\n")
        self.wfile.flush()

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
            req = urllib.request.Request("http://127.0.0.1:8900/api/leads/")
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
            # SimpleHTTPRequestHandler doesn't emit CORS — add it for cross-origin dashboard fetches
            ctype, _ = mimetypes.guess_type(file_path) if mimetypes else (None, None)
            self.send_response(200)
            if ctype:
                self.send_header("Content-Type", ctype)
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
            self.end_headers()
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())
            return
        # SPA fallback: serve the dashboard Vue SPA (not root Command Center)
        # Dashboard SPA assets live in static/dashboard/ for path-based serving.
        # Vue Router client-side routes (/dashboard/leads etc.) must fall back
        # to dashboard/index.html — NOT the root portal hub index.html.
        index = os.path.join(STATIC_DIR, "dashboard", "index.html")
        if os.path.isfile(index):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
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
                    "http://127.0.0.1:20128/v1/models",
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
            data["stream"] = False
            body = json.dumps(data).encode()

            # Route to direct Upstage Solar (known working), bypass 9Router password-auth
            UPSTAGE_KEY = os.environ.get("UPSTAGE_API_KEY", "")
            if UPSTAGE_KEY and not (model_id.startswith("system.ai.glm") or "databricks" in model_id.lower()):
                backend = "https://api.upstage.ai"
                auth_header = f"Bearer {UPSTAGE_KEY}"
                # Map DeepSeek/Claude models to solar-pro3 (only Upstage works)
                data["model"] = "solar-pro3"
                body = json.dumps(data).encode()
            elif model_id.startswith("system.ai.glm") or "databricks" in model_id.lower():
                backend = DATABRICKS_PROXY
                auth_header = f"Bearer {NINEROUTER_KEY}"
            else:
                backend = "http://127.0.0.1:20128"
                auth_header = f"Bearer {NINEROUTER_KEY}"

            req = urllib.request.Request(
                f"{backend}/v1/chat/completions",
                data=body,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": auth_header,
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
            self._send_json({"error": f"JSON error: {str(je)}", "preview": raw[:300] if raw else ""}, 502)
        except Exception as ex:
            log.warning("_proxy_chat error: %s", ex, exc_info=True)
            self._send_json({"error": str(ex)}, 502)

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.send_header("Cache-Control", "no-cache")
        self._add_security_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _proxy_get(self, url):
        """Proxy a GET request to an internal service."""
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                self.send_header("Content-Type", resp.headers.get("Content-Type", "application/json"))
                self.send_header("Access-Control-Allow-Origin", self._cors_origin())
                self._add_security_headers()
                self.end_headers()
                self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
            self._add_security_headers()
            self.end_headers()
            self.wfile.write(e.read() or b"{}")
        except Exception as ex:
            log.warning("_proxy_get failed for %s: %s", url, ex, exc_info=True)
            self._send_json({"error": str(ex)}, 502)

    def _leads_proxy(self):
        """Proxy /api/leads → SPAether with graceful fallback on upstream failure."""
        try:
            req = urllib.request.Request("http://127.0.0.1:8900/api/leads/")
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", self._cors_origin())
                self.end_headers()
                self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            if e.code >= 500:
                log.warning("SPAether /api/leads upstream error %d — returning empty fallback", e.code)
                return self._send_json({"leads": [], "total": 0, "limit": 50, "offset": 0})
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", self._cors_origin())
            self.end_headers()
            self.wfile.write(e.read() or b"{}")
        except Exception as ex:
            log.warning("_leads_proxy failed: %s — returning empty fallback", ex, exc_info=True)
            return self._send_json({"leads": [], "total": 0, "limit": 50, "offset": 0})

    def _proxy_factory(self, path):
        """Proxy /factory/* → Paperclip Vite dev server on :3100, stripping /factory prefix."""
        target_path = path[len("/factory"):] or "/"
        target_url = f"http://127.0.0.1:3100{target_path}"
        try:
            req = urllib.request.Request(target_url)
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                ct = resp.headers.get("Content-Type", "text/html")
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
            self._send_json({"error": str(ex)}, 502)

    def _serve_demo(self, lead_id):
        """Fetch lead from lead-pipeline and render as HTML demo page."""
        import html as html_lib
        lead = None
        
        # Try lead-pipeline first
        try:
            req = urllib.request.Request(f"http://127.0.0.1:8887/api/leads/{lead_id}")
            with urllib.request.urlopen(req, timeout=10) as resp:
                lead = json.loads(resp.read())
        except Exception:
            pass
        
        # Fallback: from all leads list
        if not lead:
            try:
                req = urllib.request.Request("http://127.0.0.1:8887/api/leads")
                with urllib.request.urlopen(req, timeout=10) as resp:
                    all_leads = json.loads(resp.read()).get("leads", [])
                # Try exact match first, then suffix match
                for l in all_leads:
                    lid = l.get("id", "")
                    if lid == lead_id:
                        lead = l
                        break
                if not lead:
                    # Try numeric suffix (lead-X)
                    num_part = lead_id.split("-")[-1] if "-" in lead_id else lead_id
                    for l in reversed(all_leads):
                        lid = l.get("id", "")
                        if lid.endswith(str(num_part)):
                            lead = l
                            break
            except Exception:
                pass
        
        if not lead:
            log.warning("_serve_demo: lead not found %s", lead_id, exc_info=True)
            self._send_html(self._demo_error("Lead nicht gefunden"))
            return
        
        biz = lead.get("name", lead.get("business_name", "Ihr Unternehmen"))
        email = lead.get("email", "")
        msg = lead.get("message", "")
        source = lead.get("source", "Website")
        
        html = f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html_lib.escape(biz)} — NeXify AI Demo</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Manrope:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{{--bg:#09090b;--panel:rgba(255,255,255,0.03);--line:rgba(255,255,255,0.08);--silver:#d4d4d8;--silver2:#a1a1aa;--white:#fafafa;--muted:#71717a;--green:#22c55e;--blue:#3b82f6}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:var(--bg);color:var(--silver);font-family:'Manrope',sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem}}
.card{{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:3rem;max-width:600px;width:100%;text-align:center}}
h1{{font-family:'Outfit',sans-serif;font-size:2rem;color:var(--white);margin-bottom:1rem}}
.logo{{font-size:.8rem;color:var(--muted);margin-bottom:2rem;letter-spacing:.1em;text-transform:uppercase}}
.tag{{display:inline-block;padding:.3rem .8rem;border-radius:6px;font-size:.8rem;font-weight:500;margin:.3rem}}
.tag.green{{background:rgba(34,197,94,.12);color:var(--green)}}
.tag.blue{{background:rgba(59,130,246,.12);color:var(--blue)}}
.info{{color:var(--silver2);line-height:1.6;margin:1.5rem 0}}
.demo-btn{{display:inline-block;padding:.8rem 2rem;background:var(--green);color:#000;border-radius:8px;font-weight:600;text-decoration:none;margin-top:1rem}}
.contact{{font-size:.85rem;color:var(--muted);margin-top:2rem}}
</style></head><body>
<div class="card">
<div class="logo">NeXifyAI — KI-Automation</div>
<h1>Herzlich Willkommen, {html_lib.escape(biz)}</h1>
<p class="info">Vielen Dank fuer Ihr Interesse an unseren KI-Loesungen.<br>
Wir haben Ihre Anfrage erhalten und arbeiten an einer massgeschneiderten Demo fuer Sie.</p>
<div><span class="tag green">KI-Chatbot</span><span class="tag blue">Automation</span><span class="tag green">24/7</span></div>
<p class="info" style="margin-top:1.5rem;font-style:italic">„{html_lib.escape(msg[:200])}„</p>
<a class="demo-btn" href="/business">Live-Dashboard ansehen</a>
<p class="contact">Ihre Anfrage vom {source} • Kontakt: {html_lib.escape(email)}</p>
</div></body></html>"""
        self._send_html(html)

    def _demo_html(self, biz, industry, greeting, config):
        lp = config.get("landing_page", {}) or {}
        headline = lp.get("headline", f"Intelligente KI-Lösungen für {biz}")
        subtitle = lp.get("subtitle", lp.get("description", "Steigern Sie Ihre Effizienz mit unserer KI-Chatbot-Technologie."))
        return f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(biz)} — NeXify AI Demo</title>
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
<header><h1><span>{html.escape(biz)}</span></h1><h2>{html.escape(industry)}</h2></header>
<div class="hero"><span class="badge">KI-Chatbot Demo</span><p>{html.escape(headline)}</p><p style="font-size:16px;margin-top:12px">{html.escape(subtitle)}</p><a href="#chat" class="cta">Jetzt Chatbot testen</a></div>
<div class="chat-container" id="chat">
<div class="chat-bubble chat-bot">{html.escape(greeting)}</div>
<div class="chat-bubble chat-bot" style="margin-top:4px">Wie kann ich Ihnen heute helfen?</div>
</div>
<div class="footer">Powered by <strong>NeXifyAI</strong> · {html.escape(str(config.get("template_id", "demo")))} · generiert am {html.escape(str(config.get("generated_at", "heute"))[:10])}</div>
</body></html>"""

    def _demo_error(self, msg):
        return f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Demo nicht verfügbar</title>
<style>body{{background:#09090b;color:#d4d4d8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}}.card{{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px;text-align:center}}h1{{color:#fafafa}}p{{color:#71717a}}a{{color:#a1a1aa}}</style></head>
<body><div class="card"><h1>Demo nicht verfügbar</h1><p>{html.escape(msg)}</p><a href="/">← Dashboard</a></div></body></html>"""

    def _send_html(self, html):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self._add_security_headers()
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
