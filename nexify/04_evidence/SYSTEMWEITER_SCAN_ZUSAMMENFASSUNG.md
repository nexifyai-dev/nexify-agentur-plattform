# Recherche 2: Systemweiter Scan — Zusammenfassung

**Datum:** 2026-06-22
**Status:** ✅ Abgeschlossen (mit Einschränkungen)

## Was wurde gescannt

1. **Workspace Root** (/workspace/) — 19 Top-Level-Verzeichnisse, 2,225 MD, 289 Python, 128 JS/TS, 275 JSON Dateien
2. **Nexify Workspace** (/workspace/nexify/) — 53 Unterverzeichnisse, 47 Evidence-Bereiche, 16 Master-Register, 31 Regelwerke
3. **NexifyAI Platform** (/workspace/nexifyai-platform/) — GitHub Monorepo, 30 Docs-Ordner, CI/CD + Security-Tooling
4. **Nexify-AI-Platform Dashboard** (/workspace/nexify-ai-platform/) — Next.js App mit Dashboard, Auth, Automation
5. **Hermes Paperclip Adapter** (/workspace/hermes-paperclip-adapter/) — 13 TypeScript-Source-Dateien, v0.2.1
6. **NexifyAI Orchestrierung** (/workspace/nexifyai/) — Zentralprojekt mit Agent-Config, Ops, Projects
7. **Kundenprojekte** (/workspace/customers/fixdigital/bookando/) — Backend (Python/FastAPI) + Frontend (Next.js) + Project-Control
8. **Studienkolleg Aachen** (/workspace/studienkolleg-aachen/) — 191 MB, Full-Stack
9. **Vorratsgesellschaften** (/workspace/vorratsgesellschaften/) — 963 MB, Next.js Landingpage + Docker
10. **Services** — Brain API (200), Qdrant (200), Hermes WebUI (302)

## Einschränkungen

- **VPS-Scan:** SSH nicht erreichbar (kein Zugang aus Container)
- **Docker-Scan:** Docker nicht verfügbar (Container-Modus)
- **GitHub Repo 3:** nexify-agentur-plattform nicht lokal vorhanden

## Gesamt-Datenvolumen

~7.5 GB auf 387 GB Festplatte (29% belegt)

## Erstellte Evidence-Dateien

- `/workspace/nexify/10_evidence/scan/SYSTEMWEITER_SCAN_REPORT.md` (16.7 KB, vollständiger Report)
- `/workspace/nexify/10_evidence/scan/SYSTEMWEITER_SCAN_ZUSAMMENFASSUNG.md` (diese Datei)
