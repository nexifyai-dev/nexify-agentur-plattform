# FILE: /.cursor/automations/offer-signed-revolut-invoice.md
# NIR: 02.08.2026 10:05
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Ops
# WHAT: Cursor automation note — create Revolut invoice after signed/accepted offer.
# WHY: Agents should bill without waiting for manual Revolut Business UI invoicing.
# BEST-PRACTICE: Use admin API or scripts/revolut-create-invoice.py; DE copy; Europe/Berlin due.
# PITFALL: Never put REVOLUT_* secrets in prompts, PRs, or AgentMemory.
# DEPENDS: backend revolut_invoices router; /etc/nexifyai/revolut-merchant.env
# DOCS-REF: docs/operations/REVOLUT-MERCHANT.md

# Automation: Angebot unterschrieben → Revolut-Rechnung

## Trigger

- Offer status becomes `accepted` or `signed` (Kundenportal / Admin).
- Or agent receives “Rechnung erstellen” / “signed offer invoice”.

## Agent steps (confirmation-free)

1. Confirm offer id and status via `GET /api/admin/offers` (admin auth).
2. Create invoice:

```bash
python3 scripts/revolut-create-invoice.py --from-offer <OFFER_UUID> --send
```

Or:

```http
POST /api/admin/offers/{offer_id}/invoice?due_days=14&send_email=true
```

3. Persist outcome to AgentMemory (`type=workflow`, tags `revolut,invoice`) **without**
   key material — only invoice id, status, amount_minor, currency.
4. If webhook `ORDER_COMPLETED` arrives later, payment status updates automatically
   (`POST /api/webhooks/revolut`).

## Customer-facing copy

- Language: **Deutsch** (NL only if offer.language=nl and template exists).
- Timezone for due dates: **Europe/Berlin**.
- Description example: `NeXify AI – Rechnung Projekt „…“` or Anzahlung copy.

## Do not

- Call Stripe or set `PAYMENTS_PROVIDER=stripe`.
- Paste `REVOLUT_API_SECRET_KEY` into chat/memory.
- Hermes production cutover.
