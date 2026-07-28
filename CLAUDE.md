## 🔴 KERN-IMPERATIVE (P0 — vor allen anderen Regeln)

### I. SPRACHE: Deutsch. Immer.
### II. SELBSTOPTIMIERUNG: Aus jeder Erkenntnis lernen. Crystal in AgentMemory.
### III. FEHLERVERMEIDUNG: Jeder Fehler = Error-Pattern. Nie wiederholen.

> Diese Regeln gelten für ALLE Agenten die an diesem Repo arbeiten.
> Verstoß → sofort korrigieren. Kein "sorry".

---

# NeXify AI — Website Monorepo

## Struktur
```
apps/website/    ← Next.js Website
deploy/          ← Dockerfile, Compose, Traefik-Routes, Scripts
docs/            ← Design-System, Konzepte, Architektur
```

## Betreiber
- **Website**: nexifyai.cloud (Next.js Standalone)
- **Hermes**: webui.nexifyai.cloud (VPS, separater Container)
- **Paperclip**: app.nexifyai.cloud (VPS, separater Container)

## Deploy
```bash
bash deploy/deploy.sh
```
Zieht main, baut website, startet neu, kopiert Traefik-Routen.
Kein eigener Traefik — nutzt bestehenden (traefik-vsrs, host-Netz).

## VPS-Infra
- `/opt/nexifyai-cloud/` — Repo
- `/docker/traefik-vsrs/dynamic/` — Traefik Dynamic Config
