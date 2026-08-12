# NeXify AI by NeXify — chat it. Automate it.

Kurzkonzept für die Agentur- und Operations-Plattform in diesem Monorepo.

## Produkt (IST)

- **Öffentliche Website:** `apps/website` (Next.js) — Live: https://www.nexifyai.cloud · Host-VPS (systemd `nexifyai-website.service`, Port 8880, kein Vercel)
- **API:** FastAPI unter `backend/` — https://api.nexifyai.cloud
- **Workstation-Ziel:** eine native Hermes-basierte WebUI (Konsolidierung; Cutover nur nach Freigabe)
- **Brand / Design:** `design_guidelines.json` — Dark/Luxury, Outfit/Manrope, `#0A0A0A` (nicht „Graphite Premium“)

## Repository-Struktur (relevant)

```
apps/website/     → Marketing- & Agentur-Website
apps/hermes/      → Hermes Agent WebUI (Basis Workstation)
apps/paperclip/   → Factory / Skills
backend/          → FastAPI
docs/governance/  → Verbindliche Governance (Primärquelle)
design_guidelines.json
```

Legacy-Ordner `nexify/` enthält historisches Wissens-/Regelwerksmaterial; bei Widerspruch gewinnen `docs/governance/` und Root-Artefakte.

## Standards (Richtlinien)

- ISO 27001 / 42001 / 27701 / 23894 — Sicherheit, KI, Datenschutz, Risiko
- EU AI Act / DSGVO — regulatorisch
- DIN 5008 — Schriftverkehr
- WCAG 2.2 — Barrierefreiheit
- OWASP Top 10 for LLM & Agentic AI — Security

## Infrastruktur (Kurz)

- Dual-VCS: GitHub SoT ↔ GitLab Mirror — siehe `docs/operations/REPO-SYNC-STRATEGY.md`
- Brain-Dienste (9Router, AgentMemory, LightRAG, …) laufen auf dem VPS, **nicht** als Quellcode in diesem Repo
- CI: GitHub Actions (+ Mirror/GitLab); Website-Deploy: `deploy-vps.yml` + Host-Timer `nexifyai-website-sync.timer`

## Prinzipien

- Docs-first und Evidence vor Abschluss
- OSS/vorhandene Infra vor neuen Diensten
- Mandantentrennung: NeXify-intern / Kundenprojekte / Infrastruktur
- Keine Fake-„production ready“-Claims ohne Testbeweis
