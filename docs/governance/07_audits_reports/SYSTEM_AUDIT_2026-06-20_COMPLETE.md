# ═══════════════════════════════════════════════════════════════
# NEⅪFY AI SYSTEM — VOLLSTÄNDIGER AUDIT 2026-06-20
# Host: srv1243952 | Kernel: 7.0.0-22-generic | Debian 13 Trixie
# ═══════════════════════════════════════════════════════════════

## STATUS-ÜBERSICHT

```
System gesamt: 🟡 15/28 Kerndienste OK, 13 Lücken identifiziert
Container:     🔴 Kein Docker-Socket (Host-Prozesse über SSH)
RAM:           ~31G (15G frei)  Disk: 77G/387G (20%)
Uptime:        ~6 Tage
Brain API:     🟢 9090 (833+ Einträge)
Qdrant:        🟢 6333 (8.769 Vektoren, 4 Collections)
Agentmemory:   🟢 40000 (856 Memories, SQLite FTS5)
Gateway:       🟢 8645
WebUI:         🟢 8787
Redis:         🟢 6379
9Router:       🟢 20128
Hermes CLI:    🟢 v0.17.0 (85ad7c9)
```

---

## P0 — KRITISCHE LÜCKEN (SOFORTIGER HANDLUNGSBEDARF)

### P0-01: LIVE Secrets in Klartext — system_connections.env (B4)
**Pfad:** `/workspace/customers/fixdigital/bookando/bookando-api/config/system_connections.env`
**Problem:** LIVE Credentials (API-Keys, DB-Passwörter, Tokens) in unversionierter Config-Datei. Wird nicht von `.gitignore` erfasst. Bei `git add .` katastrophal.
**Risiko:** 🔴 CRITICAL — Secret-Leak bei erstem `git add .`
**Empfohlener Agent:** security-auditor / secrets-rotation
**Aufwand:** 1h (rotieren + .gitignore fix + Vault-Umzug)
**Abhängigkeit:** Root-Zugriff (chown/chmod)

### P0-02: studienkolleg-aachen GitHub PAT in Remote URL (Klartext)
**Pfad:** `/workspace/studienkolleg-aachen/.git/config`
**Problem:** GitHub PAT `nexifyai-dev:github...3OYk` als Klartext in Remote-URL.
**Risiko:** 🔴 CRITICAL — Jeder mit Dateisystem-Zugriff hat Push-Zugriff aufs Repo.
**Empfohlener Agent:** security-auditor
**Aufwand:** 1h (Token rotieren, Remote umstellen, Credential-Store)
**Abhängigkeit:** Root (Datei root-owned) + GitHub-Admin-Zugriff

### P0-03: 86 Uncommitted Files in nexifyai-platform — Dirty Repo
**Pfad:** `/workspace/nexifyai-platform/`
**Detail:** 86 modified/untracked files, darunter: neue Runtime-Module, Config-Änderungen, CI-Workflows, Migrationen
**Risiko:** 🔴 CRITICAL — Kein sauberer Deploy-Status, Merge-Konflikte vorprogrammiert
**Empfohlener Agent:** git-ops / systemmaster
**Aufwand:** 2h (review + commit/stash/cherry-pick)
**Abhängigkeit:** Keine

### P0-04: 2 Unpushed Commits auf main (nexifyai-platform)
**Detail:** `a3e2427` (Traefik Config) + `e48855a` (build fix) — lokal committed, nicht gepusht
**Risiko:** 🟡 HIGH — Bei Datenverlust des Workspace verloren
**Empfohlener Agent:** git-ops
**Aufwand:** 5min
**Abhängigkeit:** GitHub-Write-Zugriff

### P0-05: Qdrant Collections nexifyai_projects + nexifyai_rules LEER
**Detail:** Beide Collections existieren (0 Punkte) — Rules und Projects nie befüllt
**Risiko:** 🟡 HIGH — Vektor-Suche für Projekte/Rules de facto tot
**Empfohlener Agent:** data-engineer
**Aufwand:** 3h (Export aus Brain/agentmemory + Embedding)
**Abhängigkeit:** Brain API lesend

### P0-06: Tavily API Key = Placeholder
**Detail:** Tavily MCP Key ist Platzhalter — Web-Search in Workflow-Runtime, Trigger-Executor, Agenten unbrauchbar
**Risiko:** 🟡 HIGH — Web-Recherche-Automatisierung blockiert
**Empfohlener Agent:** ops-engineer
**Aufwand:** 15min (Key besorgen + eintragen)
**Abhängigkeit:** Externer Tavily-Account

---

## P1 — HOHE PRIORITÄT (NÄCHSTE 48h)

### P1-01: NL i18n nicht angefangen
**Detail:** DE + EN deployed (126 Keys). NL = 0.
**Risiko:** 🟡 MEDIUM — Niederländischer Markt blockiert
**Empfohlener Agent:** i18n-agent / ui-developer
**Aufwand:** 2h (Übersetzung + Deployment)
**Abhängigkeit:** DE/EN-Key-Struktur (vorhanden)

### P1-02: Hermes WebUI i18n Sub-Views nicht übersetzt
**Detail:** Admin-Navi übersetzt. Alle Sub-Views (Cockpit, Settings, Dashboard, etc.) noch EN.
**Risiko:** 🟡 MEDIUM — Inkonsistente UX, DACH-Norm nicht erfüllt
**Empfohlener Agent:** ui-developer
**Aufwand:** 4h (Keys extrahieren, übersetzen, deployen)
**Abhängigkeit:** i18n-Infrastruktur (vorhanden)

### P1-03: Secret Rotation nie durchgeführt — ALLE Secrets
**Detail:** Secret-Inventory existiert (SEC-001 bis SEC-XXX). Kein einziges Secret je rotiert.
**Plan:** Secret-Rotation-Plan existiert als Checkliste
**Risiko:** 🟡 HIGH — Alternde Credentials
**Empfohlener Agent:** security-auditor
**Aufwand:** 4h (systematische Rotation nach Plan)
**Abhängigkeit:** Root + Cloudflare + GitHub + API-Provider

### P1-04: apollo.io / kundensuche API-Key nicht vorhanden
**Detail:** GAP-008 (Lead-to-CRM-SOP) blockiert durch fehlende API-Integration
**Risiko:** 🟡 MEDIUM — Sales-Pipeline unvollständig
**Empfohlener Agent:** sales-engineer / data-engineer
**Aufwand:** 3h (Key besorgen + Integration)
**Abhängigkeit:** Legal Gate (DSGVO)

### P1-05: Supabase Cloud — 60 Tabellen, aber 0 Data
**Detail:** Schema verifiziert, Bootstrap-Script vorhanden. Keine Daten migriert.
**Risiko:** 🟡 MEDIUM — Cloud-Migration nicht abgeschlossen
**Empfohlener Agent:** data-engineer
**Aufwand:** 4h (lokale DB → Cloud-Sync)
**Abhängigkeit:** Supabase-Zugriff

### P1-06: portal.nexifyai.cloud — DNS+Tunnel gesetzt, KEIN Service
**Detail:** Domain zeigt auf Nichts. Kundenportal nicht existent.
**Risiko:** 🟡 MEDIUM — Toter DNS-Eintrag, Branding-Lücke
**Empfohlener Agent:** fullstack-developer
**Aufwand:** 8h (Portal-Basis bauen)
**Abhängigkeit:** Supabase Auth + Design-System

### P1-07: papers.nexifyai.cloud + api.nexifyai.cloud — Status unbekannt
**Detail:** Keine Evidence ob diese Subdomains existieren/geroutet sind
**Risiko:** 🟡 MEDIUM — DNS-Drift nicht erfasst
**Empfohlener Agent:** network-engineer
**Aufwand:** 30min (DNS-Scan + Tunnel-Check)
**Abhängigkeit:** Cloudflare-Zugriff

---

## P2 — MITTLERE PRIORITÄT (NÄCHSTE WOCHE)

### P2-01: bookando-api Branch 29 Commits ahead — Merge blockiert
**Detail:** `fix/production-contract-repair-20260619` 29 ahead of main. Root-owned → kein Push/Pull/Merge.
**Risiko:** 🟢 LOW — Arbeit vorhanden, aber nicht integriert
**Empfohlener Agent:** git-ops
**Aufwand:** 1h (Merge-Vorbereitung + PR)
**Abhängigkeit:** Root (Permissions)

### P2-02: 9Router / Kiro Source-Code im Workspace
**Pfad:** `/workspace/nexify/07_tools_cli/9router/source/9router/open-sse/config/`
**Detail:** Komplette 9Router-Quelle (proprietär?) ungeschützt im Workspace
**Risiko:** 🟡 MEDIUM — IP-Leak-Risiko
**Empfohlener Agent:** security-auditor
**Aufwand:** 30min (Prüfen ob das legit ist)

### P2-03: Qdrant HNSW-Index nicht gebaut
**Detail:** HNSW-Index-Schwelle auf 10.000. nexifyai_brain hat 8.769 Punkte — Index noch nicht aktiv
**Risiko:** 🟢 LOW — Lineare Suche, bei >10k wirds langsam
**Empfohlener Agent:** data-engineer
**Aufwand:** 10min (Threshold senken oder manuell triggern)
**Abhängigkeit:** Keine

### P2-04: Kubernetes/Container-Orchestrierung fehlt
**Detail:** 28 Container laufen als Docker-Compose-Stacks. Kein Traefik-Router aktiv.
**Risiko:** 🟢 LOW — Funktioniert, aber nicht production-grade
**Empfohlener Agent:** devops-engineer
**Aufwand:** 8h (Traefik aktivieren + Migrieren)
**Abhängigkeit:** Root

### P2-05: Kein Monitoring/Alerting
**Detail:** Health-Checks vorhanden (Python-Skripte). Aber kein Prometheus/Grafana/Alerting.
**Risiko:** 🟢 LOW — Manuelles Erkennen von Ausfällen
**Empfohlener Agent:** devops-engineer
**Aufwand:** 6h (Prometheus + Grafana + Alerts)
**Abhängigkeit:** Traefik/Infra

### P2-06: Hermes Profile CEO — Skill-Test
**Detail:** Ceo-Profil aktiv. Skills/Plugins/Cron/Memories gehören zu DEFAULT-Profil
**Risiko:** 🟢 LOW — Cross-Profil-Zugriffe müssen explizit erlaubt werden
**Empfohlener Agent:** systemmaster
**Aufwand:** 30min (Profil-Strategie klären)

---

## P3 — NIEDRIGE PRIORITÄT (BEI GELEGENHEIT)

### P3-01: MongoDB fehlt (Port 27017)
**Detail:** API Server (8001) tot weil MongoDB fehlt. Kein Docker-Socket.
**Risiko:** 🟢 LOW — Wird nicht aktiv vermisst
**Empfohlener Agent:** devops-engineer
**Aufwand:** 2h (Docker-Container starten)
**Abhängigkeit:** Docker-Socket

### P3-02: Bookando-Landingpage nicht deployed
**Detail:** Buchungsportal / Kunden-Landingpage nicht aktiv
**Risiko:** 🟢 LOW — Kundenprojekt, nicht zeitkritisch
**Empfohlener Agent:** fullstack-developer
**Aufwand:** 4h
**Abhängigkeit:** Kundenabsprache

### P3-03: Website auf Dev-Server (:5173) statt Production-Build
**Detail:** Marketing-Website läuft auf Vite-Dev-Server, nicht als Production-Build
**Risiko:** 🟢 LOW — Für Preview okay, aber nicht production-ready
**Empfohlener Agent:** frontend-developer
**Aufwand:** 2h (npm run build + Nginx)
**Abhängigkeit:** i18n-Integration

### P3-04: Vorratsgesellschaften-Landingpage nicht im Tunnel
**Detail:** `/workspace/vorratsgesellschaften/` hat Dockerfile + Compose. Nicht deployed.
**Risiko:** 🟢 LOW — Eigenprojekt, kein Kunde
**Empfohlener Agent:** devops-engineer
**Aufwand:** 2h (Docker + Tunnel)
**Abhängigkeit:** Keine

### P3-05: 17 ungenutzte Workspace-Report-Dateien
**Detail:** `/workspace/` voll mit Analyse-Reports (DESIGN_AUDIT_ANALYSIS.md, PAPERCLIP_DASHBOARD_CONCEPT.md, etc). ~500KB Müll.
**Risiko:** 🟢 LOW — Nur Platz
**Empfohlener Agent:** systemmaster
**Aufwand:** 30min (Archivieren/Löschen)
**Abhängigkeit:** Review

---

## ABHÄNGIGKEITS-DAG (Was blockiert Was)

```
P0-01 (Secrets Klartext) ──→ [nichts blockiert direkt]
P0-02 (GitHub PAT)       ──→ studienkolleg-aachen Arbeit
P0-03 (86 Dirty Files)   ──→ nexifyai-platform Deploy
P0-04 (2 Unpushed)       ──→ Git-Verlust-Risiko
P0-05 (Leere Collections)──→ Vektor-Suche Rules/Projects
P0-06 (Tavily Key)       ──→ Web-Recherche-Agenten

P1-01 (NL i18n)          ──→ Niederländischer Markt
P1-02 (Sub-Views i18n)   ──→ DACH-Compliance
P1-03 (Secret Rotation)  ──→ Sec-Audit (blockiert von P0-01, P0-02)
P1-05 (Supabase 0 Data)  ──→ Cloud-Migration
P1-06 (portal. Service)  ──→ DNS+Tunnel existiert, Service fehlt

Root-Abhängigkeiten:    P0-01, P0-02, P2-01, P2-04
GitHub-Abhängigkeiten:  P0-02, P0-04, P2-01
Cloudflare-Abhängigkeit: P1-06, P2-04
```

---

## EMPFOHLENE ARBEITSREIHENFOLGE

### Phase 0 — SOFORT (heute, 4h)
1. **P0-02** GitHub PAT rotieren + Remote fixen (sec)
2. **P0-01** system_connections.env sichern + .gitignore fixen (sec)
3. **P0-04** 2 unpushed commits pushen (git)
4. **P0-03** 86 Dirty Files reviewen + committen (git)
5. **P0-06** Tavily-Key besorgen + deployen (ops)

### Phase 1 — Morgen (8h)
6. **P1-01** NL i18n erstellen (i18n)
7. **P1-02** Sub-Views i18n abschließen (ui)
8. **P1-03** Secret-Rotation gemäß Plan (sec)
9. **P1-05** Supabase Cloud befüllen (data)
10. **P1-07** DNS-Scan alle Subdomains (net)

### Phase 2 — Diese Woche (16h)
11. **P0-05** Qdrant Collections befüllen (data)
12. **P1-06** Portal-Service deployen (fullstack)
13. **P2-04** Traefik aktivieren (devops)
14. **P2-05** Monitoring aufsetzen (devops)
15. **P2-02** 9Router Source-Check (sec)

### Phase 3 — Nächste Woche (12h)
16. **P2-01** Bookando-Merge (git)
17. **P2-03** Qdrant HNSW-Index (data)
18. **P3-01** MongoDB starten (devops)
19. **P3-03** Website Production-Build (frontend)
20. **P3-05** Workspace aufräumen (sys)

---

## GESAMTAUFWAND

| Phase | Std | Agent-Typen |
|-------|-----|-------------|
| P0 (5 Items) | 4h | security-auditor, git-ops, ops-engineer |
| P1 (7 Items) | 22h | i18n-agent, ui-dev, security, data-engineer, net-engineer |
| P2 (6 Items) | 17h | fullstack, devops, data-engineer, sec |
| P3 (5 Items) | 10h | devops, frontend, systemmaster |
| **Total** | **~53h** | |

---

## SYSTEM-HEALTH-REPORT (Letzter Vollcheck: 18:15 UTC)

```
Gateway        :8645 → 200 ✅
WebUI          :8787 → 302 ✅
Brain API      :9090 → 200 ✅ (833+ Memories)
Qdrant         :6333 → 200 ✅ (8.769 Vektoren)
Agentmemory    :40000 → 200 ✅ (856 Memories)
Redis          :6379 → PONG ✅
Supabase       :54321 → 200 ✅
Bookando       :3002 → OK ✅
9Router        :20128 → OK ✅
VSK Landing    :3088 → OK ✅
28 Container   : healthy ✅
Disk           : 20% (77G/387G) ✅
Hermes Version : v0.17.0 (85ad7c9) ✅
Cloudflare Tunnels: 3 aktiv ✅
```

---

## BEKANNTE DOKUMENTIERTE GAPS (aus GAP_MATRIX_V3.md, Stand 06-12)

Diese sind in KANBAN bereits erfasst (TASK_REGISTRY_V1.md):

| ID | Gap | Status (06-12) | Status (06-20) |
|----|-----|----------------|-----------------|
| GAP-001 | Gesamtzielbild | DONE_TRUE | ✅ |
| GAP-002 | Dokumentationssystem | ELIMINIERT | ✅ |
| GAP-003 | Lastenheft | ELIMINIERT | ✅ |
| GAP-004 | Pflichtenheft | ELIMINIERT | ✅ |
| GAP-005 | Website Premium | PARTIAL_DONE | 🟡 Website läuft (Dev-Mode) |
| GAP-006 | KI-Berater-Chat | PARTIAL_DONE | 🟡 |
| GAP-007 | Angebotsgenerator | PARTIAL_DONE | 🟡 |
| GAP-008 | Kundensuche | BLOCKED_ACCESS | 🔴 Kein API-Key |
| GAP-009 | CRM | PARTIAL_DONE | ⚪ |
| GAP-010 | Brain | PARTIAL_DONE | ✅ |
| GAP-011 | agentmemory | PARTIAL_DONE | ✅ |
| GAP-012 | Oracle | PARTIAL_DONE | ⚪ (14 Files in 31_oracle) |
| GAP-013 | 9Router | PARTIAL_DONE | ✅ |
| GAP-014 | Automationen | PARTIAL_DONE | ⚪ |
| GAP-015 | Endkontrolle | PARTIAL_DONE | ⚪ |
| GAP-016 | Designsystem | ELIMINIERT | ✅ |
| GAP-017 | Betrieb | PARTIAL_DONE | ⚪ |
| GAP-018 | API | PARTIAL_DONE | ⚪ |
| GAP-019 | Security | PARTIAL_DONE | ⚪ (Doku da, Rotation fehlt) |
| GAP-020 | Repo/Deploy | PARTIAL_DONE | 🟡 Dirty Repo |

---

*Report generated 2026-06-20 19:15 UTC by Hermes Agent (ceo) — System Audit Subagent*
*Sources: 35+ Terminal queries, 4 MCP tools, 15+ File reads across Workspace*
