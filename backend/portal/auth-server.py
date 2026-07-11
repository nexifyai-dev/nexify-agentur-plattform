"""NeXifyAI Auth Service v2.1 — Dual JWT Validation (Supabase JWKS + Backend HS256).

Supports two JWT sources:
1. Supabase Auth tokens (ECC P-256 via JWKS) — for Supabase-native auth
2. NeXifyAI Backend tokens (HS256 with JWT_SECRET) — for Vercel app backend auth

This service validates JWTs from either source and provides forward-auth for Traefik.
"""
import hashlib
import hmac
import json
import os
import secrets
import socket
import time
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote, urlencode

import jwt
from jwt import PyJWKClient

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://mdlgodcvpasgplcrkiad.supabase.co")
SUPABASE_JWKS_URL = os.environ.get(
    "SUPABASE_JWKS_URL",
    f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json",
)
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
BACKEND_JWT_SECRET = os.environ.get("JWT_SECRET", "")

_ref = SUPABASE_URL.replace("https://", "").replace("http://", "").split(".")[0]
PROJECT_REF = _ref if _ref else "mdlgodcvpasgplcrkiad"

LOGIN_URL = "https://admin.nexifyai.cloud/auth/login"
COOKIE_MAIN = f"sb-{PROJECT_REF}-auth-token"
COOKIE_LEGACY = "sb-access-token"
COOKIE_BACKEND = "access_token"
_CSRF_TOKENS: dict[str, float] = {}  # csrf_token → expiry timestamp

# ── PBKDF2 Password Verification (for local admin login) ──────────────
_PASSWORD_HASH_B64 = os.environ.get("NEXIFY_AUTH_PASSWORD_HASH", "")
_PASSWORD_SALT_B64 = os.environ.get("NEXIFY_AUTH_SALT", "")
_LOGIN_ATTEMPTS: dict[str, list[float]] = {}  # ip → [attempt timestamps]
_LOGIN_RATE_LIMIT = 5  # max attempts per minute
_LOGIN_RATE_WINDOW = 60  # seconds
_MAX_LOGIN_BODY = 64 * 1024  # reject oversized login POST bodies


def _rate_limited(ip: str) -> bool:
    """Record this attempt for `ip` and report whether it exceeds the window limit.

    Sliding 60s window, 5 attempts. Every POST counts (not just failures) so a
    brute-force loop is throttled regardless of outcome.
    """
    now = time.time()
    attempts = [t for t in _LOGIN_ATTEMPTS.get(ip, []) if now - t < _LOGIN_RATE_WINDOW]
    attempts.append(now)
    _LOGIN_ATTEMPTS[ip] = attempts
    # Bound memory: drop IPs whose attempts have all aged out.
    if len(_LOGIN_ATTEMPTS) > 10000:
        for k in [k for k, v in _LOGIN_ATTEMPTS.items()
                  if all(now - t >= _LOGIN_RATE_WINDOW for t in v)]:
            _LOGIN_ATTEMPTS.pop(k, None)
    return len(attempts) > _LOGIN_RATE_LIMIT

USERS = {
    "mail@nexifyai.cloud": {"email": "mail@nexifyai.cloud", "role": "admin", "name": "Pascal"},
    "pascal": {"email": "mail@nexifyai.cloud", "role": "admin", "name": "Pascal"},
}


def _verify_password(password: str) -> bool:
    if not _PASSWORD_HASH_B64 or not _PASSWORD_SALT_B64:
        return False
    try:
        expected = bytes.fromhex(_PASSWORD_HASH_B64)
        salt = bytes.fromhex(_PASSWORD_SALT_B64)
        test_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
        return hmac.compare_digest(test_hash, expected)
    except Exception:
        return False


def _make_backend_jwt(email: str, role: str) -> str:
    now = int(time.time())
    payload = {
        "type": "access",
        "sub": email,
        "email": email,
        "role": role,
        "iat": now,
        "exp": now + 43200,  # 12h
    }
    return jwt.encode(payload, BACKEND_JWT_SECRET, algorithm="HS256")


# ── Login Page Template ──────────────────────────────────────────────
LOGIN_PAGE = r"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NeXifyAI — Admin Login</title>
<link rel="preconnect" href="https://fonts.bunny.net">
<link href="https://fonts.bunny.net/css2?family=outfit:wght@300;400;500;600;700&family=manrope:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'><rect width='48' height='48' rx='10' fill='%230a0a0c'/><defs><linearGradient id='s' x1='4' y1='4' x2='44' y2='44' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='%23fafafa'/><stop offset='0.45' stop-color='%23a1a1aa'/><stop offset='0.7' stop-color='%23e4e4e7'/><stop offset='1' stop-color='%2371717a'/></linearGradient></defs><path d='M24 4 41 14v20L24 44 7 34V14L24 4Z' stroke='url(%23s)' stroke-width='1.6'/><path d='M17 17 31 31M31 17 17 31' stroke='url(%23s)' stroke-width='2.6' stroke-linecap='round'/><circle cx='24' cy='24' r='3.2' fill='url(%23s)'/></svg>">
<style>
:root{--bg:#09090b;--panel:rgba(255,255,255,0.03);--line:rgba(255,255,255,0.08);--silver:#d4d4d8;--silver2:#a1a1aa;--white:#fafafa;--red-bg:rgba(239,68,68,0.1);--red-line:rgba(239,68,68,0.2);--red-text:#fca5a5}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Manrope',sans-serif;background:var(--bg);color:var(--silver);display:flex;align-items:center;justify-content:center;min-height:100vh;position:relative;overflow:hidden}
body::before{content:"";position:fixed;inset:0;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
body::after{content:"";position:fixed;top:-20%;left:-10%;width:60%;height:60%;background:radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%);pointer-events:none;z-index:0}
.login-box{position:relative;z-index:1;background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:48px 40px;width:100%;max-width:420px;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:0 8px 40px rgba(0,0,0,0.4),0 1px 3px rgba(255,255,255,0.04) inset}
.brand{text-align:center;margin-bottom:36px}
.brand h1{font-family:'Outfit',sans-serif;font-size:26px;font-weight:600;letter-spacing:-0.02em;color:var(--white)}
.brand h1 span.silver{background:linear-gradient(120deg,#e4e4e7,#fff 45%,#c4c4cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700}
.brand h1 span.light{font-weight:300;color:var(--silver2)}
.brand .tagline{font-size:9px;text-transform:uppercase;letter-spacing:0.34em;color:#71717a;margin-top:6px}
.form-group{margin-bottom:20px}
label{display:block;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;color:var(--silver2);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em}
input{width:100%;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid var(--line);border-radius:10px;color:var(--silver);font-family:'Manrope',sans-serif;font-size:15px;outline:none;transition:all 0.25s}
input:focus{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.06);box-shadow:0 0 0 3px rgba(255,255,255,0.04)}
input::placeholder{color:#52525b}
button{width:100%;padding:14px;background:linear-gradient(120deg,#e4e4e7,#ffffff 45%,#c4c4cc);border:none;border-radius:10px;color:#0a0a0a;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.25s;letter-spacing:0.01em;box-shadow:0 4px 16px rgba(255,255,255,0.06)}
button:hover{opacity:0.92;transform:translateY(-1px);box-shadow:0 6px 24px rgba(255,255,255,0.1)}
button:active{transform:translateY(0)}
.error{background:var(--red-bg);border:1px solid var(--red-line);color:var(--red-text);padding:12px 16px;border-radius:10px;margin-bottom:20px;text-align:center;font-size:13px;font-weight:500}
.footer{text-align:center;margin-top:28px;font-size:11px;color:#52525b}
.footer a{color:var(--silver2);text-decoration:none;transition:color 0.2s}
.footer a:hover{color:var(--silver)}
</style>
</head>
<body>
<div class="login-box">
<div class="brand">
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" style="display:block;margin:0 auto 20px;filter:drop-shadow(0 0 20px rgba(255,255,255,0.08))">
  <defs>
    <linearGradient id="ls" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fafafa"/>
      <stop offset="0.45" stop-color="#a1a1aa"/>
      <stop offset="0.7" stop-color="#e4e4e7"/>
      <stop offset="1" stop-color="#71717a"/>
    </linearGradient>
  </defs>
  <path d="M24 4 41 14v20L24 44 7 34V14L24 4Z" stroke="url(#ls)" stroke-width="1.6"/>
  <path d="M17 17 31 31M31 17 17 31" stroke="url(#ls)" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="24" cy="24" r="3.2" fill="url(#ls)"/>
</svg>
<h1><span class="silver">NeX</span>ify <span class="light">AI</span></h1>
<div class="tagline">Admin Dashboard</div>
</div>
<!--ERROR-->
<form method="POST" action="/auth/login">
<input type="hidden" name="csrf_token" value="__CSRF_TOKEN__">
<div class="form-group">
<label>E-Mail oder Benutzername</label>
<input type="text" name="username" required placeholder="mail@nexifyai.cloud" autofocus autocomplete="username">
</div>
<div class="form-group">
<label>Passwort</label>
<input type="password" name="password" required placeholder="••••••••" autocomplete="current-password">
</div>
<button type="submit">Anmelden</button>
</form>
<div class="footer">
<a href="https://www.nexifyai.cloud" target="_blank" rel="noopener">nexifyai.cloud</a>
</div>
</div>
</body>
</html>"""


_jwks_client = PyJWKClient(SUPABASE_JWKS_URL, cache_keys=True, lifespan=3600)


class ReuseHTTPServer(HTTPServer):
    allow_reuse_address = True

    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()


def _parse_cookies(cookie_header):
    cookies = {}
    if not cookie_header:
        return cookies
    for part in cookie_header.split(";"):
        k, _, v = part.strip().partition("=")
        if k:
            cookies[k] = v
    return cookies


def extract_token(cookie_header):
    cookies = _parse_cookies(cookie_header)

    chunked = {}
    prefix = f"{COOKIE_MAIN}."
    for k, v in cookies.items():
        if k.startswith(prefix):
            try:
                idx = int(k[len(prefix):])
                chunked[idx] = v
            except ValueError:
                pass
    if chunked:
        combined = "".join(chunked[i] for i in sorted(chunked))
        return _parse_session_value(combined)

    if COOKIE_MAIN in cookies:
        return _parse_session_value(cookies[COOKIE_MAIN])

    if COOKIE_BACKEND in cookies:
        return ("backend", cookies[COOKIE_BACKEND])

    if COOKIE_LEGACY in cookies:
        return _parse_session_value(cookies[COOKIE_LEGACY])

    return None


def _parse_session_value(raw):
    raw = unquote(raw)
    try:
        session = json.loads(raw)
        if isinstance(session, dict) and "access_token" in session:
            return session["access_token"]
        if isinstance(session, str) and session.startswith("eyJ"):
            return session
    except (json.JSONDecodeError, TypeError):
        pass
    if raw.startswith("eyJ"):
        return raw
    return None


def validate_jwt(token):
    if not token:
        return None

    if isinstance(token, tuple) and token[0] == "backend":
        return _validate_backend_jwt(token[1])

    if isinstance(token, str):
        return _validate_supabase_jwt(token)

    return None


def _validate_backend_jwt(token):
    if not BACKEND_JWT_SECRET:
        return None
    try:
        payload = jwt.decode(
            token,
            BACKEND_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_exp": True},
        )
        if payload.get("type") != "access" and "sub" not in payload:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return {"_expired": True}
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None


def _validate_supabase_jwt(token):
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            options={
                # Supabase JWT aud is "authenticated"; verify_aud disabled because
                # Zitadel tokens use a project-scoped audience. Re-enable with
                # explicit audience once all clients use Supabase Auth exclusively.
                "verify_aud": False,
                "verify_exp": True,
                "verify_iat": True,
            },
        )
        if "sub" not in payload or "iss" not in payload:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return {"_expired": True}
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None


def _extract_role(claims):
    role = claims.get("role", "")
    if not role:
        role = claims.get("user_role", "")
    if not role:
        um = claims.get("user_metadata", {})
        if isinstance(um, dict):
            role = um.get("role", "")
    if not role:
        am = claims.get("app_metadata", {})
        if isinstance(am, dict):
            role = am.get("role", "")
    if not role:
        role = "authenticated" if claims.get("role") == "authenticated" else "user"
    return role


def _redirect_to_login(host, reason=""):
    params = {"redirect_to": f"https://{host}"}
    if reason:
        params["reason"] = reason
    return f"{LOGIN_URL}?{urlencode(params)}"


class AuthHandler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _host(self):
        return (
            self.headers.get("X-Forwarded-Host")
            or self.headers.get("Host")
            or "admin.nexifyai.cloud"
        )

    def _client_ip(self):
        # Behind Cloudflare Tunnel / Traefik, the peer is the proxy — use the
        # forwarded client IP so rate-limiting keys on the real caller.
        xff = self.headers.get("X-Forwarded-For", "")
        if xff:
            return xff.split(",")[0].strip()
        return self.client_address[0] if self.client_address else "unknown"

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/verify":
            return self._verify()
        if path == "/auth/login":
            return self._login_page()
        if path == "/auth/logout":
            return self._logout()
        if path == "/auth/status":
            return self._status()
        if path == "/members":
            return self._members()
        if path == "/health":
            return self.send_json({"status": "ok", "service": "nexify-auth", "version": "2.1"})

        self.send_json({"error": "not found"}, 404)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/auth/login":
            return self._login_post()
        if path == "/auth/logout":
            return self._logout()
        self.send_json({"error": "not found"}, 404)

    def _verify(self):
        cookie_header = self.headers.get("Cookie", "")
        token = extract_token(cookie_header)

        if not token:
            self.send_response(302)
            self.send_header("Location", _redirect_to_login(self._host()))
            self.end_headers()
            return

        claims = validate_jwt(token)
        if not claims or claims.get("_expired"):
            reason = "expired" if claims else "invalid"
            self.send_response(302)
            self.send_header("Location", _redirect_to_login(self._host(), reason))
            self.end_headers()
            return

        email = claims.get("email", "")
        uid = claims.get("sub", "")
        role = _extract_role(claims)

        self.send_response(200)
        self.send_header("X-User-Id", uid)
        self.send_header("X-User-Email", email)
        self.send_header("X-User-Role", role)
        self.send_header("X-Auth-User", uid)
        self.send_header("X-Auth-Email", email)
        self.send_header("X-Auth-Role", role)
        self.end_headers()

    def _logout(self):
        qs = urlparse(self.path).query
        params = parse_qs(qs)
        final = params.get("final", [""])[0] == "true"
        redirect_to = "https://www.nexifyai.cloud/" if final else "https://admin.nexifyai.cloud"

        self.send_response(302)
        for name in [COOKIE_MAIN, COOKIE_LEGACY, COOKIE_BACKEND]:
            for i in range(5):
                suffix = f".{i}" if i > 0 else ""
                self.send_header(
                    "Set-Cookie",
                    f"{name}{suffix}=; Path=/; Domain=.nexifyai.cloud; Max-Age=0; HttpOnly; SameSite=Lax",
                )
        self.send_header("Location", redirect_to)
        self.end_headers()

    def _status(self):
        cookie_header = self.headers.get("Cookie", "")
        token = extract_token(cookie_header)
        claims = validate_jwt(token) if token else None

        if claims and not claims.get("_expired"):
            self.send_json({
                "authenticated": True,
                "user": claims.get("email", ""),
                "role": _extract_role(claims),
                "exp": claims.get("exp", 0),
            })
        else:
            self.send_json({"authenticated": False}, 401)

    def _members(self):
        if not SUPABASE_SERVICE_ROLE_KEY:
            cookie_header = self.headers.get("Cookie", "")
            token = extract_token(cookie_header)
            claims = validate_jwt(token) if token else None
            if claims and not claims.get("_expired"):
                self.send_json([{
                    "id": claims.get("sub", ""),
                    "name": claims.get("user_metadata", {}).get("full_name", claims.get("email", "")),
                    "email": claims.get("email", ""),
                    "role": _extract_role(claims),
                }])
            else:
                self.send_json([])
            return

        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}/auth/v1/admin/users?per_page=50",
                headers={
                    "apikey": SUPABASE_SERVICE_ROLE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
                },
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read())
            users = data.get("users", data if isinstance(data, list) else [])
            members = []
            for u in users:
                members.append({
                    "id": u.get("id", ""),
                    "name": u.get("user_metadata", {}).get("full_name", u.get("email", "")),
                    "email": u.get("email", ""),
                    "role": u.get("app_metadata", {}).get("role", u.get("user_metadata", {}).get("role", "user")),
                })
            self.send_json(members)
        except Exception:
            self.send_json([])


    def _login_page(self, error: str = ""):
        """Serve the login page."""
        csrf = secrets.token_hex(32)
        _CSRF_TOKENS[csrf] = time.time() + 300  # 5 min TTL
        page = LOGIN_PAGE.replace("__CSRF_TOKEN__", csrf)
        if error:
            page = page.replace(
                "<!--ERROR-->",
                f'<div class="error">{error}</div>',
            )
        else:
            page = page.replace("<!--ERROR-->", "")
        self.send_response(200 if not error else 401)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(page.encode())

    def _login_post(self):
        """Handle login form submission. Validates credentials and sets JWT cookie."""
        # Brute-force throttle: 5 attempts / 60s per client IP (every POST counts).
        if _rate_limited(self._client_ip()):
            return self._login_page("Zu viele Versuche — bitte eine Minute warten")

        try:
            content_length = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            content_length = 0
        if content_length <= 0 or content_length > _MAX_LOGIN_BODY:
            return self._login_page("Ungültige Anfrage")
        body = self.rfile.read(content_length).decode("utf-8", "replace")
        params = parse_qs(body)
        username = params.get("username", [""])[0].strip().lower()
        password = params.get("password", [""])[0]
        csrf_token = params.get("csrf_token", [""])[0]

        # Validate CSRF
        csrf_ts = _CSRF_TOKENS.pop(csrf_token, None)
        if not csrf_ts or time.time() > csrf_ts:
            return self._login_page("Sitzung abgelaufen — bitte Seite neu laden")

        # Validate credentials
        user = USERS.get(username)
        if not user or not _verify_password(password):
            return self._login_page("Ungültige Anmeldedaten")

        # Create backend JWT and set cookie
        token = _make_backend_jwt(user["email"], user["role"])
        self.send_response(302)
        self.send_header(
            "Set-Cookie",
            f"access_token={token}; Path=/; Domain=.nexifyai.cloud; HttpOnly; SameSite=Lax; Max-Age=43200; Secure",
        )
        self.send_header("Location", "https://admin.nexifyai.cloud")
        self.end_headers()


if __name__ == "__main__":
    server = ReuseHTTPServer(("127.0.0.1", 8881), AuthHandler)
    print("NeXifyAI Auth v2.1 (Dual JWT) running on :8881")
    server.serve_forever()
