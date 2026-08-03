# Booking slots seed (Rückruf-Kalender)

**Issue:** #124 — public `/api/booking/slots` can return `[]` when `nexify_slots` has no free future rows.

## Source of truth

| Layer | Role |
|-------|------|
| Postgres table `nexify_slots` | Canonical store |
| `POST /api/admin/slots` | Admin create (auth required) |
| `GET /api/booking/slots` | Public free slots only (`status=free`, `start_at > now()+2h`) |
| Website `apps/website/app/api/booking/slots` | Proxies backend; honest `[]` fallback if upstream down |
| Admin UI `/admin` → Slots panel | Manual create/delete |

## Reproduce empty calendar

```bash
curl -sS -L https://www.nexifyai.cloud/api/booking/slots
# → [] when no free future slots (or backend unreachable → website returns [])
```

## Seed via script (preferred for staging/ops)

Credentials **only** via environment — never commit or paste into chat logs.

```bash
export BACKEND_URL=https://www.nexifyai.cloud   # API origin that serves /api/*
export ADMIN_EMAIL='…'
export ADMIN_PASSWORD='…'

# Preview ISO timestamps (default)
python3 scripts/seed_booking_slots.py --dry-run --days 5 --per-day 3

# Create
python3 scripts/seed_booking_slots.py --apply --days 5 --per-day 3
```

Acceptance: public list length ≥ 1 and `/rueckruf` shows selectable slots.

## Seed via Admin UI

1. Sign in at `/admin` as admin.
2. Open **Rückruf-Zeitfenster**, pick datetime (Europe/Amsterdam), **Anlegen**.
3. Confirm slot appears under free windows and on `/rueckruf`.

## Out of scope

- Inventing fake appointments in the public Next.js fallback (must stay `[]`).
- Hermes production cutover.
- Printing or committing admin secrets.
