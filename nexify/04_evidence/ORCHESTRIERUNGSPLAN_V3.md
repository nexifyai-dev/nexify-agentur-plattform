# ORCHESTRIERUNGSPLAN — NeXify AI Systemaufbau V3
> CEO-Freigabe: Pascal Courbois | Stand: 2026-06-23 21:50 UTC
> Ziel: Vollständiger Live-Betrieb — autonom, sicher, evidenzbasiert

## Priorität: P0 (Sicherheit, Secrets, Produktion, Kunde)

| P0-ID | Lücke | Zuständig | Maßnahme | Deadline |
|-------|-------|-----------|----------|----------|
| P0-1 | Brain 500 Error — Core Knowledge Store down | CTO/Infra | Brain-Health-Recovery: Logs checken, Service neustarten, Root-Cause | 2h |
| P0-2 | Agentmemory: host.docker.internal DNS-Fail | CTO/Infra | host.docker.internal durch Container-IP ersetzen oder Extra-Host eintragen | 2h |
| P0-3 | 9Router Output-Filter Integration (Phase 2) | CTO/Engineer | output-scanner.py als Middleware in 9Router einbauen | 4h |
| P0-4 | Input-Filter auf 9Router deployen | CTO/Engineer | filter-check.py als Middleware in 9Router deployen | 2h |

## Priorität: P1 (Kernfunktion, Auth, Orchestrierung, Kanban)

| P1-ID | Lücke | Zuständig | Maßnahme | Deadline |
|-------|-------|-----------|----------|----------|
| P1-1 | Upload-Scanner für RAGFlow-Dokumente | CTO/Data | prompt-filter auf RAGFlow-Upload-Layer legen | 1 Tag |
| P1-2 | Kill-Switch systemd-Unit + Auto-Start | DevOps | systemd-Unit + Cron-Job für kill-switch Watcher | 1 Tag |
| P1-3 | Work API Erreichbarkeit prüfen | CTO | Health-Check gegen work.nexifyai.cloud automatisieren | 1 Tag |
| P1-4 | Cron-Recovery: age-sync + rate-limit-monitor läuft? | CTO | Cron-Jobs loggen und Gesundheitsstatus | 1 Tag |

## Priorität: P2 (Monitoring, Backup, UI, Tests)

| P2-ID | Lücke | Zuständig | Maßnahme | Deadline |
|-------|-------|-----------|----------|----------|
| P2-1 | Zentrales AI-Aktionslog | Data/QA | Log-Schema definieren, Qdrant-Collection, Dashboard | 2 Tage |
| P2-2 | Systemweite Health-Monitoring | DevOps | Monit/Healthcheck für alle 8 Kernservices | 2 Tage |
| P2-3 | Cloudflare-Tunnel DNS-Prüfung | CTO | DNS-Einträge gegen Live-Tunnel validieren | 2 Tage |
| P2-4 | UI-Konsistenz: Kanban/Profile/Skills/Spaces | QA/Design | UI-Elemente auf work.nexifyai.cloud prüfen | 3 Tage |
| P2-5 | Hermes-Agent-Skills aktualisieren | CTO | CEO-Skills aus 10_evidence/normen nach Hermes bringen | 2 Tage |

## Priorität: P3 (Wissen, Docs, Automatisierung)

| P3-ID | Lücke | Zuständig | Maßnahme | Deadline |
|-------|-------|----------|----------|----------|
| P3-1 | Brain-Konsolidierung (Markdown→Brain→RAGFlow) | Memory/Docs | Alle Regelwerke, Normen, Evidence in Brain + RAGFlow | 1 Woche |
| P3-2 | DSGVO-AVV mit Providern | CISO/Legal | Cloudflare, GitHub, Vercel, Hetzner, DeepSeek AVV | 1 Woche |
| P3-3 | Notfall-Runbook testen | QA/DevOps | Incident-Response-Übung: Kill-Switch, Recovery, Post-Mortem | 1 Woche |
| P3-4 | Kundenprojekt-Trennung automatisieren | DevOps | bookando/studi-ak infra-getrennt deployen | 1 Woche |

## Nächste 30 Minuten (Sofort-Delegation)

1. **P0-1+P0-2 parallel delegieren**: Brain-Recovery + Agentmemory-DNS-Fix
2. **Dann P0-3+P0-4 parallel**: 9Router Input+Output Filter
3. **Review nach 1h**: Evidence prüfen, ggf. Recovery-Team bilden
4. **Dann P1-P3 sequentiell**: Upload-Scanner → Systemd → Monitoring → Docs

---

*Gültig bis zum nächsten CEO-Review-Zyklus (24h)*
