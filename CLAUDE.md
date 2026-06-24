# NeXify AI — Monorepo Cloud

> **EIN Repository, DREI Apps, EIN VPS-Deployment.**
> Owner: Hermes Agent (expert-dev)
> Stand: 2026-06-24

---

## Architektur

```
nexifyai-cloud/
├── apps/
│   ├── hermes-webui/        ← Hermes Agent (Python/Flask, Port 8787)
│   ├── paperclip/           ← Paperclip AI (TypeScript/pnpm, Port 3100)
│   └── website/             ← NeXify Website (Next.js 16, Port 3000)
│
├── deploy/                  ← Docker + Reverse-Proxy + Nginx
│   ├── docker/              ← Container-Definitionen
│   ├── nginx/               ← Nginx-Configs (Website + Admin)
│   └── traefik/             ← Traefik-Dynamic-Config
│
├── infra/                   ← Betrieb
│   ├── scripts/             ← deploy.sh, health-check.sh
│   └── .env.vps             ← VPS-Umgebungsvariablen (mode 600)
│
├── design/                  ← Design-System + Konzepte
│   ├── tokens/              ← CSS-Tokens (Graphite Premium)
│   └── css/                 ← Layout + Primitives + Premium
│
├── docs/                    ← Projektdokumentation
│   ├── architecture/        ← VPS-Blueprints, Migration, System-Architektur
│   ├── concepts/            ← Gesamtkonzept, Pflichtenheft, Kalkulation
│   └── design/              ← Design-Vorgaben, Audit, Quality-Gates
│
├── .github/workflows/       ← CI/CD Pipeline
├── CLAUDE.md                ← Diese Datei
├── docker-compose.yml       ← Top-Level Compose (ruft deploy/ auf)
└── README.md                ← Kurzbeschreibung
```

## 10 Monorepo-Regeln

1. **Kein Secret im Code.** API-Keys nur in `infra/.env.vps` (mode 600) oder GitHub Secrets.
2. **Kein direkter Write in /workspace.** Monorepo-Arbeit nur in `~/monorepo/`.
3. **Feature-Branches.** `feat/*` für Entwicklung, `main` für Produktion, `fix/*` für Hotfixes.
4. **apps/-Boundary.** Jede App lebt in `apps/<name>/`. Keine codeübergreifenden Imports.
5. **Subtree-Pflege.** `apps/hermes-webui` und `apps/paperclip` sind Git-Subtrees. Keine direkten Rewrites der subtree-History.
6. **Design-Docs sind Source of Truth.** `docs/concepts/` und `docs/design/` vor UI-Änderungen lesen.
7. **VPS-First.** Deployment via Docker-Compose auf VPS (72.62.152.47). Kein Vercel.
8. **Health-Gates.** Jeder Deploy durchläuft: Build → Smoke-Test → Health-Check → Rollback-fähig.
9. **Tests + Docs sync.** Änderungen → Tests + Docs aktualisieren.
10. **Tenant-Trennung.** Kundenprojekte bleiben in `/workspace/customers/`. Dieses Repo ist reine NeXify-Infrastruktur.

## VPS-Infrastruktur (72.62.152.47)

**Bestehender Traefik (`traefik-vsrs`) übernimmt Reverse-Proxy + TLS.**
- Dynamic-Config-Verzeichnis: `/docker/traefik-vsrs/dynamic/`
- Let's Encrypt: Volume `traefik-vsrs_traefik-letsencrypt`
- Host-Netzwerk-Modus, `providers.docker=true` + `providers.file.watch=true`
- **Kein eigener Traefik starten.** Monorepo-Services binden auf `127.0.0.1:<port>`.
- Dynamic-Config `deploy/traefik/dynamic-monorepo.yml` wird via `deploy.sh` nach `/docker/traefik-vsrs/dynamic/nexifyai-monorepo.yml` kopiert → Traefik lädt automatisch neu.

**Bestehende Routes (nicht überschreiben):**
- `work.nexifyai.cloud` → Hermes (aktuell 32769)
- `chat.nexifyai.cloud` → Open WebUI (3080)
- `api.nexifyai.cloud` → Nexify API (8001)
- `nexifyai.cloud` → Website Preview (3020)
- `vorschau.nexifyai.cloud` → Website Preview (3020)

**Neue Monorepo-Routes:**
- `nexifyai.cloud` → Website (127.0.0.1:3000) — **ersetzt aktuelles Preview**
- `webui.nexifyai.cloud` → Hermes (127.0.0.1:8787)
- `app.nexifyai.cloud` → Paperclip (127.0.0.1:3100)

## Docker-Compose-Dienste

| Service | Container | Port | Health | Traefik-Route |
|---------|-----------|------|--------|---------------|
| `website` | nexify-website | 127.0.0.1:3000 | `/api/health` | `nexifyai.cloud` |
| `hermes-webui` | nexify-hermes | 127.0.0.1:8787 | `/health` | `webui.nexifyai.cloud` |
| `paperclip` | nexify-paperclip | 127.0.0.1:3100 | `/api/health` | `app.nexifyai.cloud` |

**Traefik:** Bestehend (`traefik-vsrs`), nicht Teil dieses Compose.

## Governance & Betriebsabläuche (docs/governance/)

Alle Regelwerke, SOPs, Policies, Workflows und Produktionsabläufe sind unter `docs/governance/` integriert.

Hauptkategorien:
- `01_regelwerke/` — Kern-Regeln, Verbote, Normenregister
- `02_sops/` — Standard Operating Procedures (7 SOPs + 2 Register)
- `03_checklisten/` — Pre-Task (6 Gates), Post-Go-Live, Compliance
- `06_sicherheit_policies/` — Security, Tenant-Isolation, Change-Management, DR
- `07_audits_reports/` — System-Audits, Deviation-Reports
- `10_quality_gates/` — Production-Gates, HITL-Gate, CI-CD-Compliance
- `13_betriebshandbuch/` — Betriebsanleitung V3, Normalbetrieb
- `14_production/` — Production-Skripte, Docker-Compose, Cron-Register

Zentrale Dokumente:
- `docs/governance/GOVERNANCE.md` — Übersicht + Produktionsablauf + Incident-Response
- `docs/governance/03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh` — 6-Gate-Check
- `docs/governance/01_regelwerke/VERBOTE_UND_PFLICHTREGELN_V2.md` — Verbindliche Verbote

**Verpflichtend:** Vor jeder Aufgabe: `bash docs/governance/03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh`

## Workflow

1. Lokal in `~/monorepo/` entwickeln
2. Pre-Task 6 Gates ausführen (`PRE_TASK_CHECKLIST_AUTOMATION.sh`)
3. Docker-Compose up für lokale Tests
4. Feature-Branch pushen → GitHub Actions build & smoke
5. PR nach `main` → Merge → Automatischer Deploy auf VPS
6. Health-Check nach Deploy + Rollback bei Failure

## Skills (laden vor Arbeit)

- `nexify-system-architecture`
- `software-architecture`
- `docker-expert`
- `nextjs-best-practices`
