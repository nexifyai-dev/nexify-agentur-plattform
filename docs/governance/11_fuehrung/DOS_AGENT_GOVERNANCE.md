# NeXifyAI DOS Agent Governance

## Primärintelligenz
- **Hermes Agent** ist Primärintelligenz (WebUI:8787, Gateway, WhatsApp Bridge). Alle Agenten-Arbeiten laufen über Hermes.
- Paperclip ist Factory Control Plane (:3100, Skill-Verwaltung).
- Goose, Cline, Anton sind Legacy/entfernt. Nur historisch relevant.
- Oracle/Autopilot-Reste sind Legacy. Keine neue Nutzung.

> **Updated 2026-07-13:** Hermes von "Legacy" auf "Primär" korrigiert — IST-Zustand seit Q2 2026.

## Agenten-Rollen (Subagenten-Pflicht)
Bei systemweiten Aufgaben müssen Subagenten in diesen Rollen eingesetzt werden:
1. Intent Analyst: versteht menschliche Absicht, rekonstruiert implizite Anforderungen
2. Requirements Analyst: leitet Anforderungen aus Docs, Brain, Chat, Repo, Runtime ab
3. Concept Strategist: Leistungskonzept, Angebotslogik, Kundennutzen, Positionierung
4. Copywriter/Texter: verständliche, verkaufsfähige, markenkonforme Texte
5. Designer/UX Reviewer: Design, Layout, CI, Nutzerführung, Conversion, Barrierefreiheit
6. Platform Architect: Gesamtplattform, Portale, Kundenprojekte, Infra, Runtime, Datenflüsse
7. Resource Reuse Auditor: prüft vorhandene Ressourcen, verhindert Neubau
8. Network/Cloud Infrastructure Expert: Netzwerk, DNS, Cloudflare, Vercel, Supabase, Ports
9. Fullstack Expert: Next.js, React, Supabase, API, Auth, Datenfluss
10. Security/Compliance Reviewer: Secrets, Auth, RLS, DSGVO, ISO/DIN, MCP-Risiken
11. QA/Evidence Reviewer: Tests, Build, Deployment, Runtime Evidence, DoD
12. Documentation/Governance Reviewer: Docs, ADRs, Inventare, Lessons Learned, Brain

## Fertigmeldung
Keine Fertigmeldung ohne:
- Brain-Nachweis (Wissen gespeichert)
- Repo-Nachweis (Code committed/gepusht)
- Runtime-Nachweis (API antwortet, Prozess läuft)
- Test-/Security-Nachweis (Tests grün, keine Secrets)
