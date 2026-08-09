#!/bin/bash
# tagesabrechnung.sh — GDOK §10 Tagesabrechnungskreislauf (pro Arbeitstag)
# NIR: 05.08.2026 16:15
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# MODE=dry (Default): Vorschau der Rechnungsnummer OHNE Konsum. MODE=send: Nummer konsumieren + Invoice anlegen.
set -e
MODE="${MODE:-dry}"
YEAR=$(date +%Y)
DATE=$(date +%F)
DUE=$(date -d "next day 09:00" +%F' 09:00:00' 2>/dev/null || date -d "tomorrow" +%F' 09:00:00')

if [ "$MODE" = "send" ]; then
  CNT=$(sudo docker exec supabase-db sh -c "PGPASSWORD=\$POSTGRES_PASSWORD psql -U postgres -d postgres -tAc \"SELECT count(*) FROM customers WHERE status IN ('active','paused') AND deleted_at IS NULL\"" | head -1)
  if [ "${CNT:-0}" -gt 0 ] 2>/dev/null; then
    INVNO=$(sudo docker exec supabase-db sh -c "PGPASSWORD=\$POSTGRES_PASSWORD psql -U postgres -d postgres -tAc \"SELECT next_invoice_number($YEAR)\" " | head -1)
    echo "Tagesrechnung: $INVNO | Arbeitstag: $DATE | fällig: $DUE | Modus: send"
    sudo docker exec supabase-db sh -c "PGPASSWORD=\$POSTGRES_PASSWORD psql -U postgres -d postgres -tAc \"
      INSERT INTO invoices (invoice_no, customer_id, status, period_start, period_end, net_total, vat_total, gross_total, currency, reverse_charge, due_at, issued_at, payment_status)
      SELECT '$INVNO', id, 'pending', '$DATE', '$DATE', daily_rate_eur, round(daily_rate_eur*0.21,2), round(daily_rate_eur*1.21,2), 'EUR', reverse_charge, '$DUE', now(), 'none'
      FROM customers WHERE status IN ('active','paused') AND deleted_at IS NULL\"" | head -1
    echo "Invoice angelegt: $INVNO (Kunden: $CNT)"
  else
    echo "Keine aktiven Kunden – keine Rechnung, Nummer unverbraucht (Tagesabrechnung sauber)"
  fi
else
  PREVIEW=$(sudo docker exec supabase-db sh -c "PGPASSWORD=\$POSTGRES_PASSWORD psql -U postgres -d postgres -tAc \"SELECT lpad((last_number+1)::text,5,'0') FROM invoice_sequences WHERE year=$YEAR\"" | head -1)
  echo "Dry-Run: nächste Rechnungsnummer (Vorschau, ohne Konsum): NEXIFY-$YEAR-$PREVIEW | Arbeitstag: $DATE | fällig: $DUE"
fi
