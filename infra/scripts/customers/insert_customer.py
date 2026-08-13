#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kunde „Studienkolleg Aachen (W2G Academy GmbH)" in customers-Tabelle anlegen.

# 2026-08-13 (Europe/Berlin): Pascal-Auftrag „KundenGesamt-Lösung" — Studienkolleg wird
# eigenständiger Kunde (bisher nur Projekt im Auftrag von FixDigital Aachen).
# Schema-adaptiv: customers-DDL liegt nicht im Repo → Spalten live aus information_schema.
# Idempotent: ON CONFLICT DO NOTHING — mehrfacher Lauf erzeugt KEINE Duplikate.

Usage (auf Host, Env SUPABASE_DB_* vorhanden, venv mit asyncpg):
    python3 insert_customer.py --apply          # Kunde anlegen
    python3 insert_customer.py --verify         # Bestand prüfen (Gegentest)
    python3 insert_customer.py --dry            # Nur Schema/Spalten zeigen
"""
import argparse
import asyncio
import json
import os
import sys

CANDIDATES = {
    "name": ["name", "customer_name", "company_name"],
    "email": ["email", "contact_email"],
    "company": ["company", "company_name"],
    "address": ["address", "street_address", "full_address"],
    "vat_id": ["vat_id", "tax_id", "vat_number", "ust_id"],
    "contact_name": ["contact_name", "contact_person"],
    "phone": ["phone", "phone_number"],
    "daily_rate_eur": ["daily_rate_eur"],
    "reverse_charge": ["reverse_charge"],
    "status": ["status"],
    "notes": ["notes", "comment"],
}

CUSTOMER = {
    "name": "W2G Academy GmbH (Studienkolleg Aachen)",
    "email": "info@stk-aachen.de",
    "company": "W2G Academy GmbH",
    "address": "Theaterstrasse 24, 52062 Aachen, Deutschland",
    "vat_id": "DE333306663",
    "contact_name": "Laura",
    "daily_rate_eur": 449.00,
    "reverse_charge": True,
    "status": "active",
    "notes": (
        "Eigenstaendiger Kunde seit 2026-08-13 (Pascal-Auftrag); Erstprojekt lief im Auftrag "
        "von FixDigital Aachen (refinanziert); Folgeprojekt AN-2026-0813-001 direkt mit W2G "
        "Academy GmbH; Vorabkasse, Rechnung AN--2025119."
    ),
}


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--verify", action="store_true")
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()

    import asyncpg  # noqa: E402 (Host-venv des Backends hat asyncpg)

    conn = await asyncpg.connect(
        host=os.environ.get("SUPABASE_DB_HOST"),
        port=int(os.environ.get("SUPABASE_DB_PORT", "5432")),
        user=os.environ.get("SUPABASE_DB_USER"),
        password=os.environ.get("SUPABASE_DB_PASSWORD"),
        database=os.environ.get("SUPABASE_DB_NAME", "postgres"),
        ssl="disable"
        if os.environ.get("SUPABASE_DB_SSL", "require").lower()
        in ("0", "false", "disable", "disabled", "off", "no")
        else "require",
    )
    try:
        cols = await conn.fetch(
            "select column_name from information_schema.columns where table_name = 'customers'"
        )
        known = {r["column_name"] for r in cols}
        print(f"customers-Spalten ({len(known)}): {sorted(known)}")

        fields, skipped = {}, []
        for key, value in CUSTOMER.items():
            hit = next((c for c in CANDIDATES.get(key, []) if c in known), None)
            if hit:
                fields[hit] = value
            else:
                skipped.append(key)
        print("Mapped:", json.dumps(fields, ensure_ascii=False, default=str))
        if skipped:
            print("WARNUNG übersprungene Felder (Spalte fehlt):", skipped)

        if args.dry:
            return

        if args.apply:
            if not fields:
                print("ABBRUCH: keine passenden Spalten"); sys.exit(2)
            keys = list(fields)
            ph = ", ".join(f"${i}" for i in range(1, len(keys) + 1))
            sql = (
                f"insert into customers ({', '.join(keys)}) values ({ph}) "
                "on conflict do nothing returning *"
            )
            row = await conn.fetchrow(sql, *[fields[k] for k in keys])
            print("INSERT:", "ANGELEGT" if row else "EXISTIERT BEREITS (idempotent — kein Insert)")

        rows = await conn.fetch(
            "select id, name, email, status, daily_rate_eur, reverse_charge, created_at "
            "from customers order by created_at desc nulls last limit 20"
        )
        print(f"customers aktiv/gesamt (letzte 20):")
        for r in rows:
            print("  ", dict(r))
        cnt = await conn.fetchval(
            "select count(*) from customers where status in ('active','paused') and deleted_at is null"
        )
        print(f"Tagesabrechnung-relevante Kunden: {cnt}")
        hit = await conn.fetchval(
            "select count(*) from customers where lower(coalesce(email,'')) = lower($1)", CUSTOMER["email"]
        )
        print("GEGENTEST:", "BESTANDEN (genau 1 Treffer per E-Mail)" if hit == 1 else f"FEHLGESCHLAGEN (Treffer: {hit})")
        sys.exit(0 if hit == 1 else 1)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
