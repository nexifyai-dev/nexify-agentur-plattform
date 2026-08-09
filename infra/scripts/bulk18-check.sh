#!/bin/bash
# Bulk-18:01-Verify (erster Resend-Lauf) — Ergebnis an Pascal via Telegram
# NIR: 09.08.2026 17:39
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

LOG=/var/log/nexifyai/bulk-send.log
ENV=/etc/nexifyai/hermes.env
for i in $(seq 1 60); do
  if [ -f "$LOG" ] && [ "$(stat -c %Y "$LOG")" -gt "$(date -d '18:00' +%s)" ]; then break; fi
  sleep 30
done
RESULT=$(tail -25 "$LOG" | grep -E "Done\.|SMTP-Error|Error|✓|Resend|resend" | tail -6)
COUNT=$(echo "$RESULT" | grep -c "✓")
DONE=$(echo "$RESULT" | grep -oE "Done\.[^)]*" | head -1)
TOKEN=$(grep -E '^TELEGRAM_BOT_TOKEN=' $ENV | head -1 | cut -d= -f2-)
CHAT=$(grep -E '^TELEGRAM_HOME_CHANNEL=' $ENV | head -1 | cut -d= -f2-)
MSG="📬 Bulk-18:01-Lauf (1. Resend-Lauf):
Mails ✓: $COUNT
$DONE
Letzte Zeilen:
$(echo "$RESULT" | head -4)"
curl -s --max-time 20 -F "chat_id=$CHAT" --form-string "text=$MSG" "https://api.telegram.org/bot${TOKEN}/sendMessage" >/dev/null 2>&1
echo "BULK18-CHECK DONE: $COUNT mails, $DONE"
