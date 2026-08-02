# 🔴 P0 Security Finding — 2026-06-20
# Source: Proactive agentur-admin Scan
# 
# config/system_connections.env in bookando-api enthält LIVE CREDENTIALS:
#   - VPS-IP (145.14.158.198)
#   - DB_PASSWORD (PostgreSQL, 64-char hex)
#   - REDIS_PASSWORD (64-char hex)
#   - QDRANT_API_KEY (64-char hex)
#   - JWT_SECRET_KEY (64-char hex)
#   - JWT_REFRESH_SECRET (64-char hex)
#   - REVOLUT_API_SECRET_KEY (Merchant secret — never commit)
#   - REVOLUT_API_PUBLIC_KEY (Merchant public)
#   - REVOLUT_WEBHOOK_SECRET (optional Merchant webhook signing)
#   (Stripe STRIPE_* / whsec_* are NOT used — see docs/operations/REVOLUT-MERCHANT.md)
#
# UND: config/ ist NICHT in .gitignore
# → Bei git add . oder git add config/ landen Secrets auf GitHub
#
# Fix (via root/sudo):
#   1. .gitignore um config/ und app/node_modules/ ergänzen
#   2. config/system_connections.env auf mode 600 setzen
#   3. Sicherstellen dass config/ nie committed wird
#   4. ggf. system_connections.env verschlüsseln und config/.env.template.encrypted
#
# Siehe auch: /workspace/customers/fixdigital/bookando/bookando-api/config/system_connections.env
# Siehe auch: /workspace/customers/fixdigital/bookando/bookando-api/.gitignore (19 Zeilen, unvollständig)
