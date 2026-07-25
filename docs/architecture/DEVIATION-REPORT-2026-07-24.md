# Abweichungsanalyse: Systemmaster V5/199 vs Ist-Zustand

**Stand:** 2026-07-24T12:28+0200 (DE/Berlin)
**Referenz:** `nexify/00_master/SYSTEMMASTER_TOTAL_CONCEPT_v5_199.md` (2026-06-11T20:45+0200)
**Delta:** 43 Tage seit letzter autoritativer Iteration

---

## KRITISCHE ABWEICHUNGEN (C — blockiert Betrieb)

| ID | Abweichung | Soll | Ist | Seit |
|----|-----------|------|-----|------|
| **C-01** | Governance Bootstrap | AKTIV mit Runtime Validation | BLOCKED (3 Drift Issues) | 192+ |
| **C-02** | Qdrant nexifyai_rules | 403 Vektoren | 0 Vektoren | 157+ |
| **C-03** | Qdrant nexifyai_projects | befüllt | 0 Vektoren | 157+ |
| **C-04** | Brain-Sync operating-data | persistiert | 1 pending (12 Einträge) | 157+ |
| **C-05** | You.com in 9Router | aktiv in Provider-Liste | Fehlt in DB-Eintrag | 157+ |
| **C-06** | 4 leere Workspace-Dirs | befüllt | din_iso, audits, feedback, optimization leer | 157+ |

## HOHE ABWEICHUNGEN (H)

| ID | Abweichung | Soll | Ist | Seit |
|----|-----------|------|-----|------|
| **H-01** | AgentMemory Secret | konfiguriert | fehlt | 157+ |
| **H-02** | Secret Rotation | durchgeführt | pending | 157+ |
| **H-03** | Handoff Outbox | aktiv (Agent→Agent) | leer | 157+ |
| **H-04** | AgentMemory MCP | integriert | nicht integriert | 157+ |
| **H-05** | Goose ACC Daemon | 24/7 Worker | kein Daemon | 157+ |

## INFRASTRUKTUR-ABWEICHUNGEN

| ID | Abweichung | Soll (Systemmaster) | Ist (VPS) | Impact |
|----|-----------|---------------------|-----------|--------|
| **I-01** | Traefik | ✅ OK :80/:443 (Z.41) | ENTFERNT (06.07.) — Cloudflare Tunnel exklusiv | ⚠️ Doku veraltet, GitLab-CI tot |
| **I-02** | 9Router Version | v0.4.71 (Z.39) | v0.5.18 (upgrade) | ✅ Upgrade, Doku-Nachtrag erfolgt |
| **I-03** | MiMo sk-Konto | aktiv | 402 Insufficient balance | ⚠️ Nur Token-Plan aktiv |
| **I-04** | Brain Einträge | 722+45=767 (Z.24) | unbekannt (43 Tage später) | 🔴 Kein aktueller Health-Check |
| **I-05** | Cloudflare Access | FEHLEND für traefik/work/brain | weiterhin offen | 🔴 11 Risiken unverändert |

## REPO-ABWEICHUNGEN

| ID | Abweichung | Soll | Ist |
|----|-----------|------|-----|
| **R-01** | GitHub Repo URL | `NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform` | `nexifyai-dev/nexify-agentur-plattform` |
| **R-02** | Workspace `/workspace/nexify/` | im Repo gespiegelt | NUR auf VPS, nicht im Repository |
| **R-03** | GitLab CI | aktiv (validate→test→deploy) | defekt: validate:traefik referenziert gelöschte Datei, e2e nutzt host.docker.internal |
| **R-04** | GitHub CI | vollständig | nur deploy-vps + secret-scan; kein test/lint/build |
| **R-05** | Colon-Path-Files | keine | 2 Files in History (07_architecture), blockieren Windows-Checkout |

## KANBAN-STAGNATION (seit 157+)

6 Lücken-Tasks (P0-LUECKE-006 bis -010):
- 1 IN_PROGRESS (Customer-Project-Isolation)
- 4 READY (Operations, Source-Coverage, Progress-Audit, Finance)
- 1 implizit (Governance Bootstrap)

---

## BEREITS BEHOBEN (diese Session)

| Fix | Beschreibung |
|-----|-------------|
| I-01 | GitLab CI: tote Traefik-Validate + host.docker.internal entfernt |
| I-02 | 9router-Doku auf v0.5.18 aktualisiert |
| R-03 | GitLab CI repariert: flake8, pytest, deploy-vps |
| R-04 | GitHub CI erstellt: ci.yml (lint + test + TS check) |
| R-05 | Colon-Files aus Worktree entfernt (Tree-Clean-Commit) |
| MCP-01 | github Docker-MCP → github-mcp-server Cloud-Tools migriert |
| MCP-02 | playwright npx-MCP → playwright-browser Cloud-Tools migriert |
| MCP-03 | stripe MCP als HTTP-Cloud hinzugefügt (Key pending) |
| COM-01 | Hermes-SSO Profile: alle 16 via Session-Skript validiert |

---

## NEUE ABWEICHUNG (2026-07-24T14:00+0200)

| ID | Abweichung | Soll | Ist | Impact |
|----|-----------|------|-----|--------|
| **C-07** | VPS SSH-Zugang | Funktionsfähig (Key auth) | BLOCKED — alle 9 lokalen SSH-Keys abgelehnt | 🔴 VPS-Vollprüfung unmöglich, alle C/H-Abweichungen blockiert |

### SSH-Diagnose (2026-07-24)
- Host 72.62.152.47 antwortet auf TCP/22
- ED25519 Host-Key geändert (vorher ECDSA) → VPS wurde neu aufgesetzt oder OS upgraded
- Authentifizierung: publickey,password
- Alle 9 lokalen Keys abgelehnt (nexify_vps, id_ed25519_hostinger_vps, id_ed25519_vps, id_rsa_nexify, id_ed25519, circleci_nexify, nexify_deploy, mydispatch_ed25519, id_ed25519_github)
- Nächste Schritte: Hostinger API-Token oder manueller Key-Upload via Hostinger-Dashboard nötig
- VPS_INFRA.md ist 18 Tage veraltet (Stand 06.07.2026)
