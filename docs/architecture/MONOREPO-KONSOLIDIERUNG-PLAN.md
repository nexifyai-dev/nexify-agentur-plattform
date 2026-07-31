# Monorepo-Konsolidierung — Plan (SoT im Ziel-Repo)

**NIR:** 31.07.2026 10:55  
**STATUS:** BINDING Plan  
**Decision:** `/opt/nexifyai/docs/decisions/DECISION-2026-07-26-MONOREPO-AGENTUR-PLATTFORM.md`  
**Ziel-Repo:** `nexifyai-dev/nexify-agentur-plattform`  
**Lokal:** `/opt/nexifyai/repos/nexify-agentur-plattform`  
**Ops-Pointer:** `/opt/nexifyai/docs/architecture/MONOREPO-KONSOLIDIERUNG-PLAN.md`

## Zielbild

Alle Feature-Entwicklung nur hier. Andere `nexifyai-dev/*` Repos = **read-only** Inventar/Migrationsquellen → danach Archive + README-Pointer. Keine parallelen Feature-Repos.

## Apps im Monorepo (IST 2026-07-31)

| App-Pfad | Rolle |
|----------|-------|
| `apps/website` | Marketing-Website (PR47 Emergent SoT) |
| `apps/hermes` | Hermes WebUI / Agent Surface |
| `apps/paperclip` | Factory (Tree; Runtime Gate blocked) |
| `backend/` | NeXify FastAPI (:8901) + OpenAPI |

## GitHub Org Inventar — Einbeziehung (2026-07-31 via `gh repo list`)

### Platform-Kern (Migration / Runtime-Fork — Features nur via Monorepo)

| Repo | Rolle | Monorepo-Status |
|------|-------|-----------------|
| `nexify-agentur-plattform` | **Feature-SoT** | aktiv |
| `hermes-webui` / `hermes-webui-nexify` | WebUI-Quellen | apps/hermes; Cutover Policy |
| `hermes-agent` | Runtime-Fork (≠ NousResearch awesome) | Runtime VPS; keine Parallel-Features |
| `agentmemory` | Brain-Fork | Runtime :3111; Docs/Clients → Monorepo |
| `LightRAG` | RAG-Fork | Runtime :9622 |
| `9router` | Router-Fork | Runtime :20128 |
| `paperclip` / `paperclip-by-nexifyai` | Factory | apps/paperclip; Gate revive |
| `open-design` / `html-anything` | OpenDesign | Runtime :3002; native View pending |
| `nexify-portal` / `nexifyai-cockpit` | Portal/Cockpit | Backend/Portal-Pfade im Monorepo |
| `lead-pipeline` | Lead-Ops | separat Runtime OK; Spec-Pointer |
| `skills-plugins-connectoren-befehle` | Skills-Inventar | Factory/Skills Sync — kein Parallel-App |
| `nexifyai-cloud` | Infra Scripts | Ops außerhalb App-Monorepo OK |

### Bewusst draußen / Archive-Kandidaten

| Repo | Begründung |
|------|------------|
| `root-9router-runtime-snapshot` | Secrets/Runtime-DB — nie App-Monorepo |
| `awesome-*` / `awesome-n8n*` | Inventar/Abbau; NousResearch Hermes nicht übernehmen |
| Kunden-Repos (`bookando-*`, `studienkolleg-*`, `lv-ai`, …) | customer-Isolation |
| Legacy Website-Duplikate | PR47/apps/website gewinnt |

### VPS-only (noch nicht auf GitHub Org)

`1backend`, `openmcp`, `openapi-generator`, Headroom/Caveman-Tooling — **Neuintegrations-Actions**; Imports nur in Monorepo nach Spec.

## Sync

```
GitHub SoT (Actions CI + mirror-to-gitlab.yml)
    → GitLab OSS VPS (Spiegel / Deploy-CI)
```

Details: `docs/operations/REPO-SYNC-STRATEGY.md`

## WebUI-Zentrale

Mandat-Host: `https://webui.nexifyai.cloud/`  
IST-Shell: `https://dashboard.nexifyai.cloud/` (:4001)  
Decision: `/opt/nexifyai/docs/decisions/DECISION-2026-07-31-WEBUI-ZENTRALE-VS-DASHBOARD.md`  
Gap: `/opt/nexifyai/docs/live/GESAMTSYSTEM-INTEGRATION-GAP-2026-07-31.md`

## Nächste Migrations-Wellen (klein, Evidence-first)

1. OpenDesign/html-anything → native Workspace-View Spec + Preview  
2. Monitoring Grafana native View (Traefik Backend :3000 verifiziert)  
3. Dual-Write Hook AM↔LightRAG als tracked `.githooks`  
4. OpenMCP/1Backend Spec → `services/` stubs nur nach ICD  

Keine Massen-Moves ohne Spec-Trace (DIN/ISO HOTFIX min).
