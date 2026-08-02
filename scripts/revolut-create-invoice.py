#!/usr/bin/env python3
# FILE: /scripts/revolut-create-invoice.py
# NIR: 02.08.2026 10:05
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Ops
# WHAT: CLI to create a Revolut Merchant invoice (order + optional email) via admin API.
# WHY: Agents/ops can invoice after signed offer without opening Revolut Business UI.
# BEST-PRACTICE: Pass API base + admin cookie/token via env; never print secrets.
# PITFALL: Do not embed REVOLUT_* keys in argv/logs.
# DEPENDS: requests; BACKEND_URL; ADMIN_ACCESS_TOKEN or session cookie
# DOCS-REF: docs/operations/REVOLUT-MERCHANT.md
# SESSION: cursor/revolut-replace-stripe-7dd5

"""Create a Revolut invoice via the NeXify admin API.

Examples:
  python3 scripts/revolut-create-invoice.py \\
    --email kunde@firma.de --name "Max Mustermann" \\
    --description "NeXify AI – Website-Relaunch" --amount-eur 449 --send

  python3 scripts/revolut-create-invoice.py --from-offer <offer-uuid> --send
"""

from __future__ import annotations

import argparse
import json
import os
import sys

import requests


def main() -> int:
    parser = argparse.ArgumentParser(description="Create Revolut Merchant invoice")
    parser.add_argument(
        "--backend",
        default=os.environ.get("BACKEND_URL")
        or os.environ.get("REACT_APP_BACKEND_URL")
        or "http://127.0.0.1:8901",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("ADMIN_ACCESS_TOKEN") or "",
        help="JWT access token (admin). Or rely on cookie jar via --cookie.",
    )
    parser.add_argument("--cookie", default=os.environ.get("ADMIN_COOKIE") or "")
    parser.add_argument("--from-offer", default="")
    parser.add_argument("--email", default="")
    parser.add_argument("--name", default="")
    parser.add_argument("--company", default="")
    parser.add_argument("--description", default="")
    parser.add_argument("--amount-eur", type=float, default=0.0)
    parser.add_argument("--due-days", type=int, default=14)
    parser.add_argument("--send", action="store_true")
    args = parser.parse_args()

    base = args.backend.rstrip("/")
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if args.token:
        headers["Authorization"] = f"Bearer {args.token}"
    cookies = {}
    if args.cookie:
        # raw Cookie header value, e.g. access_token=...
        for part in args.cookie.split(";"):
            if "=" in part:
                k, v = part.strip().split("=", 1)
                cookies[k] = v

    if args.from_offer:
        url = f"{base}/api/admin/offers/{args.from_offer}/invoice"
        params = {"due_days": args.due_days, "send_email": str(args.send).lower()}
        resp = requests.post(url, headers=headers, cookies=cookies, params=params, timeout=30)
    else:
        if not args.email or args.amount_eur <= 0:
            print("error: --email and --amount-eur required (or --from-offer)", file=sys.stderr)
            return 2
        payload = {
            "customer_email": args.email,
            "customer_name": args.name,
            "company": args.company,
            "description": args.description
            or f"NeXify AI – Rechnung {args.amount_eur:.2f} EUR",
            "amount_minor": int(round(args.amount_eur * 100)),
            "currency": "EUR",
            "due_days": args.due_days,
            "send_email": bool(args.send),
        }
        resp = requests.post(
            f"{base}/api/admin/revolut/invoices",
            headers=headers,
            cookies=cookies,
            json=payload,
            timeout=30,
        )

    if resp.status_code >= 400:
        print(f"error HTTP {resp.status_code}: {resp.text[:500]}", file=sys.stderr)
        return 1

    data = resp.json()
    # Redact nothing sensitive beyond checkout_url (public payment link).
    out = {
        "id": data.get("id"),
        "status": data.get("status"),
        "amount_minor": data.get("amount_minor"),
        "currency": data.get("currency"),
        "due_at": data.get("due_at"),
        "checkout_url": data.get("checkout_url"),
        "revolut_order_id": data.get("revolut_order_id"),
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
