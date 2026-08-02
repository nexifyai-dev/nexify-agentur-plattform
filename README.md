# NeXify AI by NeXify — chat it. Automate it.

Öffentliche Agentur-Website und Plattform-Monorepo für **NeXify AI**.

| | |
|---|---|
| **Live** | [https://www.nexifyai.cloud](https://www.nexifyai.cloud) |
| **API** | [https://api.nexifyai.cloud](https://api.nexifyai.cloud) |
| **Vercel** | [https://nexify-agentur-plattform.vercel.app](https://nexify-agentur-plattform.vercel.app) |
| **GitHub (SoT)** | [nexifyai-dev/nexify-agentur-plattform](https://github.com/nexifyai-dev/nexify-agentur-plattform) |
| **GitLab (Mirror)** | `gitlab.nexifyai.cloud/nexifyai_group/nexifyai` |

Dieses Repo enthält die **öffentliche Website** (`apps/website`), ein **FastAPI-Backend** (`backend/`) und Agenten-/Ops-Artefakte. Brain-Dienste (AgentMemory, LightRAG, 9Router, Hermes Runtime) laufen **extern auf dem VPS** — ihr Quellcode liegt nicht hier.

---

## Was ist drin

| Bereich | Pfad | Rolle |
|---------|------|--------|
| Website | `apps/website/` | Next.js 16 · React 19 · Tailwind v4 · DE/NL — primäres, lokal lauffähiges Produkt |
| Backend | `backend/` | FastAPI (Ops, CRM, Angebote, Health) — lokal degradiert ohne Postgres/IMAP |
| Hermes App | `apps/hermes/` | Hermes-Agent-WebUI (Workstation-Basis, Cutover nur nach Freigabe) |
| Paperclip | `apps/paperclip/` | Factory / Skills-Quelle (Port 3100 auf dem VPS) |
| Preview | `apps/webui-preview/` | Native Panel-Stubs (kein Iframe-Zielprodukt) |
| Governance | `docs/governance/` | Verbindliche Regeln & SOPs (Primärquelle) |
| Design | `design_guidelines.json` | Dark/Luxury · Outfit/Manrope · `#0A0A0A` |
| Deploy | `deploy/` | Dockerfiles, MCP, Cursor/SSH-Hilfen — **kein** `deploy/docker-compose.yml` |
| Root Compose | `docker-compose.yml` | Harness/CI-Infra, **nicht** der Produkt-Stack |

**Sprachen-Mix (ungefähre Repo-Realität):** TypeScript/TSX (Website), Python (Backend/Agentik), Markdown (Governance), YAML (CI/Deploy).

**Packages (GHCR):** `ghcr.io/nexifyai-dev/nexify-agentur-plattform` mit Tags `website-*`, `backend-*`, `hermes-*` (siehe `.github/workflows/build.yml`). npm-Paketname Website: `nexifyai-agency-website` (privat).

---

## Quickstart

### Voraussetzungen

- Node.js 20+ und **pnpm** ≥ 9
- Optional: Python 3.12 + venv (Backend)
- Docker nur, wenn du die Root-Harness-Compose brauchst (nicht nötig für Website-Dev)

### Website (empfohlen)

```bash
git clone git@github.com:nexifyai-dev/nexify-agentur-plattform.git
cd nexify-agentur-plattform

pnpm --dir apps/website install
pnpm --dir apps/website dev
# → http://localhost:3000
# Health: GET /api/health → {"status":"ok"}
# / bleibt unprefixed; Legacy /de|/en|/nl → 308 zurück auf unprefixed Route
```

Weitere Befehle (lint / typecheck / test / build): `.cursor/skills/website-dev/SKILL.md` bzw. `apps/website/README.md`.

Ohne Backend liefert `/api/planner/plan` eine lokale Schätzung; `/api/contact` und `/api/offers/request` antworten bewusst mit Fehler, bis `BACKEND_ORIGIN` und/oder `RESEND_API_KEY` gesetzt sind.

### Backend (optional, degradiert lokal)

```bash
# einmalig: python3.12-venv, venv außerhalb des Repos
# Demo-Pfad für StaticFiles (sonst Boot-Crash):
#   sudo mkdir -p /opt/nexifyai/repos/lead-pipeline/demos
cd backend
uvicorn server:app --host 0.0.0.0 --port 8000
# Health: GET /api/health → status ok, db oft "unavailable"
```

Details und Stolpersteine: `AGENTS.md` (Abschnitt „Cursor Cloud specific instructions“).

---

## Dual-VCS & Deploy

```
GitHub (Source of Truth)  →  PR, Actions CI, Vercel Deploy
        │
        │  .github/workflows/mirror-to-gitlab.yml
        ▼
GitLab OSS (Mirror)       →  CI, VPS-Deploy-Pfad
```

- **Website Production:** Vercel (`deploy-vercel.yml` auf `main`) + Live unter `www.nexifyai.cloud`
- **API:** `api.nexifyai.cloud` (Backend auf VPS)
- **Sync-Doku:** `docs/operations/REPO-SYNC-STRATEGY.md`

Branch-Konvention: `main` (stable) · `feature/*` / `cursor/<task>-7dd5` (Entwicklung). Commits: Conventional Commits (`feat`, `fix`, `docs`, …).

---

## Design & Governance

- **Brand:** NeXify AI by NeXify — *chat it. Automate it.*
- **Design SoT:** `design_guidelines.json` (Dark/Luxury). Nicht die ältere „Graphite Premium“-Linie aus Legacy-Docs unter `nexify/`.
- **Governance-Hierarchie:** `docs/governance/` > `CHARTA.md` > `.cursor/rules/` > `AGENTS.md`
- **Agenten-Einstieg:** `AGENTS.md`, `CLAUDE.md`, `bash scripts/agentic-bootstrap.sh`

---

## Was nicht in diesem Repo liegt

- AgentMemory, LightRAG, 9Router, Circuit Breaker, Hermes-Gateway/Headroom — **externe Runtime** auf dem VPS
- Produktives Cutover an Hermes ohne explizite Endabnahme
- `n8n` (abgeschafft) und Fremdprojekte wie `0xNyk/awesome-hermes-agent`

---

## Dokumentation

| Dokument | Zweck |
|----------|--------|
| [`docs/README.md`](docs/README.md) | Docs-Index |
| [`docs/governance/`](docs/governance/) | Regeln, SOPs, Register |
| [`docs/operations/`](docs/operations/) | Sync, agentic Mode, Ops |
| [`docs/architecture/`](docs/architecture/) | Architektur & Integrationspläne |
| [`AGENTS.md`](AGENTS.md) | Cursor-/Cloud-Agent-Hinweise |
| [`apps/website/README.md`](apps/website/README.md) | Website-Dev |

---

## Security

- Secrets nur über Env / CI Secrets — niemals committen
- Secret-Scan: `.github/workflows/secret-scan.yml`
- Keine Public-IP-Binds für Brain-Dienste; Reachability über Tunnel/Proxy

---

## License

Proprietary — NeXify AI / NeXify, 2026

---

**Aktualisiert:** 2026-08-02 · Öffentliche Docs & GitHub About an IST angeglichen
