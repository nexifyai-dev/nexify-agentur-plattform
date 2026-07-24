# NeXify AI — Website Monorepo

## Struktur
```
apps/website/    ← Next.js Website (Vercel + optional VPS-Container)
apps/hermes/     ← vendored Hermes-Agent/WebUI (Upstream-Kopie; NeXify-Patches leben auf dem VPS)
apps/paperclip/  ← vendored Paperclip-Automatisierungsplattform (Upstream-Kopie)
backend/         ← Python/FastAPI-Backend (Leads, Angebote, Buchungen, Zahlungen, LLM-Calls)
deploy/          ← Dockerfile, Compose, Traefik-Routes, Scripts
docs/            ← Design-System, Konzepte, Architektur, Governance
infra/           ← Deploy-/Health-Check-Skripte (Alternativpfad zu deploy/)
memory/          ← interne Betriebsnotizen (VPS_INFRA.md, PRD.md) — enthielt Secrets, nie hier committen!
nexify/          ← Governance-/Security-/Norm-Register
fabrik/          ← Fabrik-/Agenten-Definitionen
```
⚠️ Dieses Repo ist ein **Multi-Service-Monorepo**, nicht nur die Website. `memory/` und `nexify/`
gehören zur Angriffsfläche (reguläres Git-Tracking) — Secrets dort niemals im Klartext ablegen.

## Betreiber
- **Website**: nexifyai.cloud (Next.js Standalone)
- **Hermes**: webui.nexifyai.cloud (VPS, separater Container)
- **Paperclip**: app.nexifyai.cloud (VPS, separater Container)

## Deploy
```bash
bash deploy/deploy.sh
```
Zieht main, baut website, startet neu, kopiert Traefik-Routen.
Kein eigener Traefik — nutzt bestehenden (Traefik 3.7.8, host-Netz).

## VPS-Infra
- `/opt/nexifyai-cloud/` — Repo
- `/etc/traefik/dynamic/` — Traefik Dynamic Config
