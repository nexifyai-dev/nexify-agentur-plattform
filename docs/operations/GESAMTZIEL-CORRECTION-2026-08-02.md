# FILE: docs/operations/GESAMTZIEL-CORRECTION-2026-08-02.md
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Architecture
# WHAT: Gesamtziel vs IST — systematische Fehler + Korrektur-Priorität
# WHY: Agents lieferten „Done“-Signale (Automationen, Audits) während Produktpfad stockte
# DEPENDS: design_guidelines.json, CHARTA.md, docs/governance/, scripts/project-runs-smoke.sh
# DOCS-REF: .cursor/rules/10-hermes-consolidation.mdc
# SESSION: gesamziel-correction-7dd5

## SOLL (binding)

| # | Ziel |
|---|------|
| 1 | **Eine WebUI**: Hermes Agent WebUI (nesquena) → NeXify AI Workstation (Kanban, Auftragsfach, Dispatcher, Automation, Chat-Driver, Teams, Approval, Evidence) |
| 2 | **Native** 9Router, AgentMemory (11 Views), LightRAG — **kein Iframe-forever** |
| 3 | Öffentliche Website davor (gleiche Brand: Dark/Luxury, Outfit/Manrope, „chat it. Automate it.“) |
| 4 | Cursor = Control Plane · VPS = Runtime |
| 5 | **HARD STOP**: kein Hermes-Prod-Cutover ohne Endabnahme |
| 6 | Ausgeschlossen: n8n, Nous `0xNyk/awesome-hermes-agent` |

## IST (Probe 2026-08-02 ~09:15 CEST)

| Pfad | Status | Hinweis |
|------|--------|---------|
| `www` health + `/de` | ✅ | Vercel live |
| `api` health/full + DB pool | ✅ | Supabase pool ok; email_agent errors>0 |
| Contact POST | ✅ | Lead erstellt |
| Planner | ✅ | lokale Schätzung |
| Booking slots | ✅ **jetzt** 21 free | war leer → Marketing live ohne Kalender |
| Auth `/api/auth/me` | 🟡 | 401 ohne Session (erwartet); Login-Validierung 422 |
| Chat `/de/chat` | 🟡 | 308→`/chat` 200; kein End-to-End Agent-Chat-Beweis |
| Hermes Gateway `:8644` | ✅ | systemd active (war DOWN) |
| AgentMemory `:3111` / LightRAG `:9622` | ✅ | Live |
| 9Router `:20128/v1/models` | ✅ | `/health` 404 = falscher Probe-Pfad |
| Circuit Breaker `:8912/check` | ✅ | `/health` 404 = falscher Probe-Pfad |
| Dual-Write Hook | ❌→fix | `core.hooksPath=.githooks` aber **kein** `post-commit` (nur `*-dual-write`) → nie gelaufen |
| Project-MCP `memory_smart_search` | ❌ | leere Recalls (Subset/Scope) |
| Paperclip `:3100` | ❌ | empty tree / revive blockiert — **nicht** priorisieren |
| Dual Dashboards | 🟡 | webui + dashboard parallel; Cutover gesperrt |

## Fehler (systemisch — mit Evidenz)

1. **Automation-Theater bei #123 Secrets-Gap** — Workflows/Dependabot/Event-Ingest als „Done“, obwohl Hosted-Secrets + Runner fehlen → Fake-Fortschritt.
2. **Dual-Write behauptet, Hook tot** — Docs/CLAIMS „post-commit Dual-Write aktiv“; Git führt nur Dateien namens `post-commit` aus.
3. **Project-MCP Brain leer** — Agents planen ohne Shared State; user-AM hat Wissen, Project-MCP nicht.
4. **Paperclip-/Dashboard-Revive vs. leerer Tree** — Kapazität gegen totes Ziel statt Website+API+Booking.
5. **CI skip-as-success** — Vercel-Deploy „grün“ ohne Credentials (teilweise gefixt #147).
6. **Booking leer, Marketing live** — Conversion-Pfad kaputt trotz schöner Site.
7. **Audit-Schwarm > Ship** — Utilization/SEO/Graphite-Audits parallel; kein verpflichtender „project runs“ Smoke.
8. **Legacy Graphite Premium** in `nexify/**/GESAMTZIELBILD*` verwirrt Agents trotz `design_guidelines.json`.
9. **Enabled-but-down** Services (Gateway) — Health-Timer existieren, aber Agents prüften falsche Pfade (`/health` vs `/check`, `/v1/models`).
10. **Over-scope OpenMCP/MetaGPT** — Specs ohne Runtime-Nutzen für Kundenpfad.

## Korrektur-Priorität (was „läuft“ bedeutet)

**Definition of Done (Produkt, nicht Repo-Hygiene):**

```text
bash scripts/project-runs-smoke.sh   # MUST exit 0
```

Muss grün: www + api + booking slots>0 + contact + planner + gateway + AM + LightRAG + CB `/check`.

### Top-Fixes (dieser Branch / Runtime)

| Fix | Artefakt |
|-----|----------|
| Wahrheit Dual-Write + echter Hook | `scripts/brain-dual-write.sh`, `.githooks/post-commit`, `docs/operations/BRAIN-DUAL-WRITE.md` |
| Booking seed + keepalive | `scripts/seed_booking_slots.py`, `scripts/booking-slots-keepalive.sh` |
| Pflicht-Smoke „project runs“ | `scripts/project-runs-smoke.sh` |
| Gateway + Spend-Guard | `scripts/gateway-spend-guard.sh` + systemd timer |
| Graphite-Deprecation | Banner in Legacy-GESAMTZIELBILD |

### Depriorisieren / nicht weiter füttern

- Paperclip revive (#150) — blocked_no_app_tree
- Cursor Automations drafts (#137) ohne #123 Secrets
- OpenMCP/MetaGPT Vollausbau vor Website+Chat+Booking Stabilität
- Zombie-Branch-Cleanup (#131) — Hygiene, nicht Blocker für „läuft“
- Dual-Dashboard Cutover — HARD STOP bis Endabnahme (#141 bleibt)

### Human-Gates (bleiben)

- [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123) Actions secrets & runner
- Hermes Prod-Cutover

## Research-Notiz (2026-08-02)

- **Next.js 16 / Vercel:** Secrets nie `NEXT_PUBLIC_`; Security-Headers; Preview Protection; Cache explizit — Site hat Headers bereits.
- **Booking:** Pre-seeded slots + atomare DB-Reservation (`FOR UPDATE` / conditional UPDATE) — unser Admin-Seed-Pfad schließt die leere-Liste-Lücke; Concurrency später härten.
- **GH required checks:** Summary-Job statt Matrix-Namen; skip≠fake-success für Deploy-Jobs.
- **Hermes WebUI:** Basis = **nesquena/hermes-webui** (nicht Nous awesome-list); Two-container Agent+WebUI Muster; Cutover isoliert.

## Verwandte PRs / Issues

- Booking seed: #124 / PR sibling `cursor/booking-slots-seed-7dd5`
- Brain alignment: #125 / `cursor/brain-docs-alignment-7dd5`
- CI signal: #147 merged (skip-as-success)
- Decision Hermes bleiben: #141
