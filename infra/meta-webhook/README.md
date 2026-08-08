# Meta-Webhook-Proxy (NeXifyAI)

Empfängt Meta-Webhooks (Messenger / Instagram / WhatsApp Cloud API), beantwortet den
Verify-Handshake, validiert `X-Hub-Signature-256` (HMAC mit `META_APP_SECRET`) und
leitet Events an den Hermes-Gateway-Webhook weiter (dort läuft die AI-Antwort-Pipeline).

## Warum ein Proxy?

- Metas Verify-Handshake ist ein **GET** (`hub.mode/hub.challenge/hub.verify_token`) —
  der Hermes-Webhook-Adapter antwortet nur auf POST.
- Die `X-Hub-Signature-256` von Meta ist HMAC mit dem **App-Secret**; der Proxy
  validiert sie einmal zentral und signiert die Weiterleitung neu (Hermes-Routen-Secret).

## Deployment

```bash
# Dependencies
pip install fastapi uvicorn

# Env (hermes.env, beide Spiegel)
META_WEBHOOK_VERIFY=<frei wählbares Verify-Token>
HERMES_WEBHOOK_URL=http://127.0.0.1:8644/webhooks/meta
HERMES_WEBHOOK_SECRET=<Secret der Hermes-Webhook-Route>

# Start (Host srv1243952, Port 8092)
uvicorn meta_webhook_proxy:app --host 0.0.0.0 --port 8092
```

## Hermes-Seite

```bash
hermes webhook subscribe meta-messenger \
  --prompt "Meta-Event: {payload.object} — {payload.entry[0].changes[0].value}. Beantworte die Anfrage als 'NeXify AI' (Persona, charmant-business, Routing-Regeln §0c)." \
  --deliver log
```

## Meta-Dashboard (nach Token-Freischaltung)

| Produkt | Callback-URL | Verify-Token |
|---|---|---|
| Messenger | `https://api.nexifyai.cloud/webhooks/meta` | `META_WEBHOOK_VERIFY`-Wert |
| Instagram | dito | dito |
| WhatsApp | dito | dito (oder bestehendes `WHATSAPP_CLOUD_VERIFY_TOKEN`) |

## Test (lokal, ohne Meta)

```bash
# Verify-Handshake
curl "http://127.0.0.1:8092/webhooks/meta?hub.mode=subscribe&hub.challenge=12345&hub.verify_token=<META_WEBHOOK_VERIFY>"
# -> 12345

# Event mit gültiger HMAC-Signatur (python):
#   sig = sha256=HMAC(body, META_APP_SECRET)
curl -X POST http://127.0.0.1:8092/webhooks/meta -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: <sig>" -d '{"object":"page","entry":[]}'
# -> {"received": true}
```

## Antwort-Senden (Graph API, nach Page-/System-Token)

`POST https://graph.facebook.com/v22.0/<recipient-id>/messages` (Messenger) bzw.
`POST /v22.0/<phone-number-id>/messages` (WhatsApp) mit `Authorization: Bearer <token>`.
Antwort-Texte: Persona „NeXify AI", Routing §0c (Login → nexifyai.cloud/login, Angebote → /preise, Leistungen → /leistungen, unsicher → /kontakt).
