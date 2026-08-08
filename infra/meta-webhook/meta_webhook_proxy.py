#!/usr/bin/env python3
"""Meta-Webhook-Proxy (NeXifyAI): nimmt Meta-Webhooks (Messenger/Instagram/WhatsApp) an,
beantwortet den Verify-Handshake (GET hub.*), validiert X-Hub-Signature-256 (HMAC mit
App-Secret) und leitet Events an den Hermes-Gateway-Webhook (POST) weiter.

Betrieb: uvicorn meta_webhook_proxy:app --host 0.0.0.0 --port 8092
Konfiguration über Env (hermes.env):
  META_APP_SECRET        — HMAC-Validierung eingehender Events
  META_WEBHOOK_VERIFY    — Verify-Token für den Meta-Handshake (eigener Wert, frei wählbar)
  HERMES_WEBHOOK_URL     — Ziel-POST (Hermes-Webhook-Route, z. B. http://127.0.0.1:8644/webhooks/meta)
  HERMES_WEBHOOK_SECRET  — HMAC-Secret der Hermes-Route (wird als X-Hub-Signature-256 mitgesendet)
"""
import hashlib
import hmac
import json
import os
import urllib.request

from fastapi import FastAPI, Query, Request, Response

app = FastAPI(title="Meta-Webhook-Proxy NeXifyAI")

def env(k, default=""):
    return os.environ.get(k) or default

@app.get("/webhooks/meta")
async def verify(mode: str = Query(None, alias="hub.mode"),
                 challenge: str = Query(None, alias="hub.challenge"),
                 verify_token: str = Query(None, alias="hub.verify_token")):
    """Meta-Verify-Handshake: GET ?hub.mode=subscribe&hub.challenge=...&hub.verify_token=..."""
    if mode == "subscribe" and verify_token == env("META_WEBHOOK_VERIFY"):
        return Response(content=challenge or "", media_type="text/plain")
    return Response(content="Verification failed", status_code=403)

@app.post("/webhooks/meta")
async def receive(request: Request):
    body = await request.body()
    sig = request.headers.get("X-Hub-Signature-256", "")
    expected = "sha256=" + hmac.new(env("META_APP_SECRET").encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return Response(content="Invalid signature", status_code=403)
    payload = json.loads(body or b"{}")
    # Meta verlangt sofortiges 200, sonst Retries
    target = env("HERMES_WEBHOOK_URL")
    if target:
        try:
            data = json.dumps({"source": "meta", "payload": payload}).encode()
            sig2 = "sha256=" + hmac.new(env("HERMES_WEBHOOK_SECRET").encode(), data, hashlib.sha256).hexdigest()
            req = urllib.request.Request(target, data=data, headers={"Content-Type": "application/json",
                                                                      "X-Hub-Signature-256": sig2})
            with urllib.request.urlopen(req, timeout=15) as r:
                print(f"Forwarded to Hermes: HTTP {r.status}")
        except Exception as e:
            print(f"Forward-Fehler: {e}")
    return {"received": True, "object": payload.get("object")}
