# FILE: docs/operations/REVOLUT-MERCHANT.md
# NIR: 02.08.2026 10:00
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Ops
# WHAT: Revolut Merchant setup — payments, invoices-as-orders, webhooks, feature matrix.
# WHY: Mandat — no Stripe; Revolut Merchant is the only payment provider.
# BEST-PRACTICE: Keys only in chmod-600 env files or Vercel/GitHub secret stores.
# PITFALL: Keys pasted into chat must be rotated; never commit values.
# DEPENDS: Merchant account approved; production API keys from Revolut Business
# DOCS-REF: https://developer.revolut.com/docs/guides/merchant/introduction

# Revolut Merchant — NeXify payments & invoices

## Mandate

- **Provider:** Revolut Merchant only.
- **No Stripe:** Do not add `stripe` packages, `STRIPE_*` env vars, Stripe webhooks,
  or the Stripe Cursor MCP plugin as a required dependency.
- Official docs: [Merchant introduction](https://developer.revolut.com/docs/guides/merchant/introduction)

## Feature matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Orders / Hosted Checkout (`checkout_url`) | **Enabled** | Portal deposit + invoices |
| Payment links | **Enabled** | Same as order `checkout_url` |
| Invoices (API) | **Enabled (as Orders)** | Merchant API has **no** separate Invoice REST resource; Business UI invoices stay manual. NeXify creates payable “invoices” via orders + line items + DE email |
| Customers API | **Enabled** | Create/list via admin; attached to invoice orders |
| Refunds | **Enabled** | `POST /api/admin/revolut/invoices/{id}/refund` |
| Webhooks (`ORDER_*`) | **Enabled** | `POST /api/webhooks/revolut` (+ HMAC if `REVOLUT_WEBHOOK_SECRET`) |
| Multi-currency | **EUR focus** | Default `EUR` (DACH); other currencies possible via API field |
| Subscriptions | Deferred | Not needed for agency project billing yet |
| Payouts / report runs | Deferred | Ops can use Revolut Business UI / later automation |
| Disputes API | Deferred | Handle in Revolut Business until volume justifies |
| Native Business UI PDF invoices | Deferred / N/A via API | Use checkout link + internal offer PDF |

## Environment variable names (values never in git)

| Name | Role |
|------|------|
| `REVOLUT_API_SECRET_KEY` | Server-side Bearer token (create/retrieve orders) |
| `REVOLUT_API_PUBLIC_KEY` | Client-side / Checkout Widget |
| `REVOLUT_ENV` | `production` or `sandbox` |
| `REVOLUT_API_BASE` | Optional; default `https://merchant.revolut.com` (sandbox: `https://sandbox-merchant.revolut.com`) |
| `REVOLUT_API_VERSION` | Optional; default `2024-09-01` |
| `PAYMENTS_PROVIDER` | Feature flag; `revolut` (default) or `none` to disable |
| `REVOLUT_WEBHOOK_SECRET` | Merchant webhook signing secret (`wsk_…`, not Stripe `whsec_`) |
| `REVOLUT_SECRET_KEY` | Legacy alias for `REVOLUT_API_SECRET_KEY` |

## VPS secret file

Path (canonical):

```text
/etc/nexifyai/revolut-merchant.env
```

Requirements:

- mode `600`, owned by the service user
- loaded by systemd via
  `/etc/systemd/system/nexifyai-backend.service.d/40-revolut-merchant.conf`
  (`EnvironmentFile=-/etc/nexifyai/revolut-merchant.env`)

Example **structure** (placeholders only):

```bash
REVOLUT_API_SECRET_KEY=<from-revolut-business>
REVOLUT_API_PUBLIC_KEY=<from-revolut-business>
REVOLUT_ENV=production
REVOLUT_API_BASE=https://merchant.revolut.com
REVOLUT_API_VERSION=2024-09-01
PAYMENTS_PROVIDER=revolut
# REVOLUT_WEBHOOK_SECRET=<from-webhook-create-response>
```

## Application integration

### Modules

- Client: `backend/revolut_merchant.py`
- Invoices + webhook: `backend/revolut_invoices.py`
- Portal deposit: `POST /api/portal/offers/{id}/pay` → Hosted Checkout
- Status poll: `GET /api/portal/offers/{id}/payment-status`

### Invoice / admin endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/admin/revolut/invoices` | Create invoice (order + DB row) |
| GET | `/api/admin/revolut/invoices` | List local invoices |
| GET | `/api/admin/revolut/invoices/{id}` | Detail (+ live order state) |
| POST | `/api/admin/revolut/invoices/{id}/send` | DE email with payment link |
| POST | `/api/admin/revolut/invoices/{id}/refund` | Full/partial refund |
| POST | `/api/admin/offers/{id}/invoice` | Invoice after accepted/signed offer |
| GET | `/api/admin/revolut/customers` | List Revolut customers |
| POST | `/api/webhooks/revolut` | Order/payment status → DB + AgentMemory |

### Ops CLI

```bash
python3 scripts/revolut-create-invoice.py --from-offer <uuid> --send
python3 scripts/revolut-create-invoice.py \
  --email kunde@firma.de --name "Max Mustermann" \
  --description "NeXify AI – Website-Relaunch" --amount-eur 449 --send
```

### Agent automation

See `.cursor/automations/offer-signed-revolut-invoice.md` —
after signed/accepted offer, agent creates invoice (DE, due date Europe/Berlin).

### Customer copy / timezone

- Invoice descriptions and emails: **Deutsch**
- Due dates: **Europe/Berlin** (`due_at` + `expire_pending_after` on the order)

## MCP / Cursor

- Do **not** enable Stripe MCP in `.cursor/mcp.json` / `.cursor/mcp.json.example`.
- If the Stripe plugin is still installed in the Cursor UI, uninstall it manually
  (Settings → MCP / Plugins). Repo configs do not require it.

## Security / rotation

Keys that appeared in chat or tickets are considered exposed.

1. In Revolut Business → Merchant → Merchant API settings: **re-create**
   production secret (and public if needed).
2. Update `/etc/nexifyai/revolut-merchant.env` (and Vercel `REVOLUT_*` if used).
3. `systemctl daemon-reload && systemctl restart nexifyai-backend`
4. Confirm payments with a small sandbox/live test order.
5. Do **not** store key material in AgentMemory, PRs, issues, or docs.

## Stripe remnants (expected / non-blocking)

| Location | Action |
|----------|--------|
| Historical `nexify/04_evidence/**` JSON | Leave (audit trail) |
| Hermes redaction patterns for `sk_live_` | Keep (defense in depth) |
| Cursor Stripe plugin cache (if present) | Human uninstall in UI |
| Old `STRIPE_*` in foreign customer configs mentioned in governance notes | Out of scope; NeXify app uses Revolut |

## Verify (no secrets in output)

```bash
# Env file exists and is mode 600
stat -c '%a %n' /etc/nexifyai/revolut-merchant.env

# Backend process sees REVOLUT_* names (values redacted)
tr '\0' '\n' < /proc/$(systemctl show -p MainPID --value nexifyai-backend)/environ \
  | grep '^REVOLUT' | sed 's/=.*/=***/'

# Unit tests (offline)
cd backend && python3 -m pytest tests/test_revolut_merchant.py tests/test_revolut_invoices.py -q
```
