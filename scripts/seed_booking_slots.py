#!/usr/bin/env python3
# FILE: scripts/seed_booking_slots.py
# NIR: 02.08.2026 09:05
# UPDATED: 02.08.2026 09:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Seed future free Rückruf slots via POST /api/admin/slots (env credentials)
# WHY: Production /api/booking/slots returns [] when nexify_slots has no free future rows
# BEST-PRACTICE: Credentials only from env; never print secrets; dry-run by default
# PITFALL: V-SEC: do not hardcode admin passwords; V-TZ: Europe/Amsterdam wall times
# DEPENDS: ADMIN_EMAIL, ADMIN_PASSWORD, BACKEND_URL (or REACT_APP_BACKEND_URL)
# DOCS-REF: docs/operations/BOOKING-SLOTS-SEED.md, backend/booking.py
# SESSION: booking-slots-seed-7dd5

"""Seed deterministic demo/ops booking slots through the admin API.

Usage:
  export BACKEND_URL=https://www.nexifyai.cloud   # or api origin that mounts /api
  export ADMIN_EMAIL=...
  export ADMIN_PASSWORD=...
  python3 scripts/seed_booking_slots.py --dry-run
  python3 scripts/seed_booking_slots.py --apply --days 10 --per-day 3

Never prints credential values. Exits non-zero on auth/API failure.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

try:
    import requests
except ImportError:  # pragma: no cover
    print("error: requests required (pip install requests)", file=sys.stderr)
    sys.exit(2)

TZ = ZoneInfo("Europe/Amsterdam")
DEFAULT_HOURS = (10, 14, 16)  # local wall-clock hours


def backend_url() -> str:
    raw = (
        os.environ.get("BACKEND_URL")
        or os.environ.get("REACT_APP_BACKEND_URL")
        or os.environ.get("NEXT_PUBLIC_BACKEND_URL")
        or ""
    ).rstrip("/")
    if not raw:
        print(
            "error: set BACKEND_URL (or REACT_APP_BACKEND_URL) to the API origin",
            file=sys.stderr,
        )
        sys.exit(2)
    return raw


def require_admin() -> tuple[str, str]:
    email = os.environ.get("ADMIN_EMAIL", "").strip()
    password = os.environ.get("ADMIN_PASSWORD", "").strip()
    if not email or not password:
        print(
            "error: set ADMIN_EMAIL and ADMIN_PASSWORD (values never logged)",
            file=sys.stderr,
        )
        sys.exit(2)
    return email, password


def build_slot_isos(days: int, per_day: int, start_offset_days: int) -> list[str]:
    """Build ISO timestamps with Amsterdam TZ, ≥2h from now (public list filter)."""
    now = datetime.now(TZ)
    hours = list(DEFAULT_HOURS[: max(1, min(per_day, len(DEFAULT_HOURS)))])
    # If more per_day requested, fill remaining hours 09–17 excluding taken
    if per_day > len(hours):
        for h in range(9, 18):
            if h not in hours:
                hours.append(h)
            if len(hours) >= per_day:
                break
    hours = hours[:per_day]

    out: list[str] = []
    day = now.date() + timedelta(days=max(1, start_offset_days))
    made_days = 0
    while made_days < days:
        # Skip weekends for business-hours demo slots
        if day.weekday() < 5:
            for h in hours:
                dt = datetime(day.year, day.month, day.day, h, 0, tzinfo=TZ)
                if dt > now + timedelta(hours=2):
                    out.append(dt.isoformat())
            made_days += 1
        day += timedelta(days=1)
    return out


def login(session: requests.Session, base: str, email: str, password: str) -> None:
    r = session.post(
        f"{base}/api/auth/login",
        json={"email": email, "password": password},
        timeout=30,
    )
    if r.status_code != 200:
        print(
            f"error: admin login failed status={r.status_code} (body redacted)",
            file=sys.stderr,
        )
        sys.exit(1)


def main() -> int:
    ap = argparse.ArgumentParser(description="Seed booking slots via admin API")
    ap.add_argument(
        "--dry-run",
        action="store_true",
        default=True,
        help="Print planned slots only (default)",
    )
    ap.add_argument(
        "--apply",
        action="store_true",
        help="Actually POST slots (requires admin env)",
    )
    ap.add_argument("--days", type=int, default=5, help="Business days to seed")
    ap.add_argument("--per-day", type=int, default=3, help="Slots per business day")
    ap.add_argument(
        "--start-offset-days",
        type=int,
        default=1,
        help="First slot day offset from today (default tomorrow)",
    )
    ap.add_argument("--duration-min", type=int, default=30)
    args = ap.parse_args()
    apply = bool(args.apply)
    # --apply wins over default dry-run
    dry = not apply

    slots = build_slot_isos(args.days, args.per_day, args.start_offset_days)
    print(f"planned_slots={len(slots)} duration_min={args.duration_min} dry_run={dry}")
    for s in slots:
        print(f"  {s}")

    if dry:
        print("ok: dry-run only; re-run with --apply to create")
        return 0

    base = backend_url()
    email, password = require_admin()
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    login(session, base, email, password)

    r = session.post(
        f"{base}/api/admin/slots",
        json={"slots": slots, "duration_min": args.duration_min},
        timeout=60,
    )
    if r.status_code != 200:
        print(
            f"error: create slots failed status={r.status_code} (body redacted)",
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        data = r.json()
    except json.JSONDecodeError:
        print("error: non-JSON response from admin slots", file=sys.stderr)
        sys.exit(1)

    created = data.get("created", 0)
    skipped = data.get("skipped", 0)
    print(f"ok: created={created} skipped={skipped}")

    pub = session.get(f"{base}/api/booking/slots", timeout=30)
    if pub.status_code == 200:
        try:
            n = len(pub.json())
        except json.JSONDecodeError:
            n = -1
        print(f"ok: public_slots_count={n}")
        if n < 1:
            print(
                "warn: public list still empty — check TZ filter (+2h) and DB connectivity",
                file=sys.stderr,
            )
            return 1
    else:
        print(f"warn: public slots status={pub.status_code}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
