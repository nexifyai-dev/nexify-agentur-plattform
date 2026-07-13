# Evidence: System-Integration V3 — 13.07.2026 06:45 CEST

## Aenderungen
1. Vitrine docker-compose: restart:unless-stopped, HEALTHCHECK, Logging-Begrenzung
2. Intelligence API v3 -> 23 Quellen (Vitrine neu: status, health, url)
3. Validate-system.sh: Layer 6 Vitrine-Checks (HTTP 200 + Docker Health)
4. Hostinger Token von config.yaml -> ~/.hermes/.env (P0-Secrets-Fix)
5. Config.yaml: Token-Referenz statt Klartext ($HOSTINGER_API_TOKEN)

## Verifikation
- L1: curl https://vitrine.nexifyai.cloud/de -> 200
- L2: git status portal -> clean
- L3: POST /api/leads/public -> lead-pipeline -> Lead-18 erfasst

## P0-Check
- Secrets: Token in .env statt config.yaml
- Deployment-Gate: Validation 30/30 vor Deploy
- ECC: Kosten ~$31/mo via /api/system/costs
- Falke DONE: Diese Evidence-Datei

## Naechste Schritte
1. GitLab CI/CD Pipeline fuer Vitrine
2. Lead-Engager aktivieren (echte Emails)
3. SEO fuer vitrine.nexifyai.cloud
