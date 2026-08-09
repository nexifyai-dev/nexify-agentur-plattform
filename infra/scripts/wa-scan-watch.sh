#!/bin/bash
# WhatsApp-Pairing-Scan-Watcher: wartet auf registered=True -> Gateway-Restart + Telegram
# NIR: 09.08.2026 16:28
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# Start: tmux new-session -d -s wawa 'sudo bash /opt/nexifyai/scripts/wa-scan-watch.sh'
ENV=/etc/nexifyai/hermes.env
SESS=/root/.hermes/platforms/whatsapp/session
for i in $(seq 1 4320); do
  if [ -f "$SESS/creds.json" ]; then
    REG=$(python3 -c "import json; print(json.load(open('$SESS/creds.json')).get('registered'))" 2>/dev/null)
    if [ "$REG" = "True" ]; then
      echo "[$(date)] PAIRING OK — restart gateway"
      systemctl restart hermes-gateway
      sleep 10
      # Telegram an Pascal
      TOKEN=$(grep -E '^TELEGRAM_BOT_TOKEN=' $ENV | head -1 | cut -d= -f2-)
      CHAT=$(grep -E '^TELEGRAM_HOME_CHANNEL=' $ENV | head -1 | cut -d= -f2-)
      curl -s --max-time 15 -F "chat_id=$CHAT" --form-string "text=✅ WhatsApp-Pairing erfolgreich! Gateway neu gestartet — Kanal verbindet sich. Danke fürs Scannen." \
        "https://api.telegram.org/bot${TOKEN}/sendMessage" >/dev/null 2>&1
      echo "[$(date)] DONE"
      exit 0
    fi
  fi
  sleep 20
done
echo "[$(date)] WATCHER TIMEOUT (60 min) — kein Scan"
