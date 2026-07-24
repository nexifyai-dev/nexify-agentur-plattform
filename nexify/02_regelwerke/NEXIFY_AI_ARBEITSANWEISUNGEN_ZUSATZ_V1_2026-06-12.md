# NeXify AI — Zusatz V1: Arbeitsanweisungen, Official-Docs-First, Capability-Nutzung und Best-Practice-Betrieb

**Stand:** 2026-06-12  
**Status:** VERBINDLICH — Ergänzung zu Gesamtzielbild V3  
**Owner:** Pascal Courbois / NeXify AI by NeXify — chat it. Automate it.  
**Gültigkeit:** systemweit für NeXify AI, Workstation, Repo, Website, Kundenportal, Agenten, Automationen, Brain, agentmemory, 9Router, MCPs, APIs, Vertrieb, Support, Angebote, Dokumente und Betrieb.

## 1. Zweck dieses Zusatzes

Dieser Zusatz schließt die bisherige Lücke zwischen Zielbild und tatsächlicher Ausführung. Er definiert verbindliche Arbeitsanweisungen dafür, wie jeder Auftrag vorbereitet, ausgeführt, geprüft, dokumentiert, in die Endkontrolle gegeben und anschließend in Brain, agentmemory, Kanban, Evidence und Register zurückgeführt wird.

Der Zusatz gilt besonders für Arbeiten, bei denen externe oder interne Tools konfiguriert, eingebunden oder erweitert werden. Vor jeder solchen Arbeit müssen die offiziellen Dokumentationen und vorhandenen Projektquellen geladen werden. Das gilt exemplarisch für 9Router, aber ebenso für Claude Code, Goose, Hermes, agentmemory, Qdrant, Supabase, Vercel, Cloudflare, Resend, GitHub, Next.js, React, Tailwind/shadcn oder jede andere relevante Lösung.

## 2. Führende Entscheidung

NeXify AI arbeitet nicht aus Erinnerung, Vermutung oder isolierten Screenshots. NeXify AI arbeitet nach einem Docs-first-, Brain-first-, Bestand-first- und Evidence-first-Verfahren.

```text
Ziel verstehen
→ Kontext und Brain laden
→ Bestand und Repo prüfen
→ offizielle Dokumentation laden
→ Möglichkeiten der Lösung vollständig erfassen
→ vorhandene Fähigkeiten maximal sinnvoll nutzen
→ Lösung planen
→ Policy Gate anwenden
→ Umsetzung durchführen
→ Tests und Review ausführen
→ Evidence schreiben
→ Brain/agentmemory/Kanban/Register aktualisieren
→ Folgeaufträge erzeugen
```

## 3. Nicht verhandelbare Arbeitsregel

Keine Tool-Konfiguration, API-Integration, MCP-Integration, Provider-Konfiguration, Deployment-Anpassung, Domain-/DNS-Änderung, Automatisierung, Mailflow, CRM-/Lead-Prozess, Website-/Portal-Funktion oder Workstation-Funktion darf umgesetzt werden, ohne vorher zu prüfen:

1. Was sagt die offizielle Dokumentation aktuell?
2. Welche Möglichkeiten bietet die Lösung vollständig?
3. Welche davon nutzt NeXify bereits?
4. Welche davon fehlen im Zielbild oder Betrieb?
5. Welche Funktionen sparen Kosten, Zeit, Fehler oder manuelle Arbeit?
6. Welche Funktionen verbessern Qualität, Kundenerlebnis, Sicherheit oder Skalierbarkeit?
7. Welche Funktionen sind riskant, gate-pflichtig oder zunächst nur vorzubereiten?
8. Welche Konfigurationen, ENV-Variablen, Secrets, Webhooks, APIs, Modelle, Routen, Jobs oder Rechte sind nötig?
9. Welche Tests beweisen die Integration?
10. Welche Erkenntnisse müssen ins Brain und welche in agentmemory?

## 4. Zielzustand

Jede NeXify-Arbeit erzeugt nicht nur ein Ergebnis, sondern auch verwertbares Betriebswissen. Am Ende jeder Arbeit müssen mindestens diese Artefakte aktualisiert sein:

- Task-/Kanban-Status;
- Evidence;
- betroffener Registereintrag;
- Brain-/agentmemory-Entscheidung;
- offene Risiken;
- Abbruch- oder Gate-Punkte;
- Tests und Prüfergebnis;
- Folgeaufträge;
- bei Tools: Capability-Mapping;
- bei Konfigurationen: Config-Target-State;
- bei Automationen: Runbook, Healthcheck und Rollback;
- bei Kundenprozessen: Datenschutz-/Rechts-/Outreach-Gate;
- bei Website/Portal/Design: Designsystem- und UX-Abnahme;
- bei Dokumenten: Version, Owner, Zweck, Gültigkeit und nächste Prüfung.

## 5. Geltende Zusatzdateien

Dieser Zusatz besteht aus folgenden verbindlichen Arbeitsdateien:

```text
00_master/NEXIFY_AI_ARBEITSANWEISUNGEN_ZUSATZ_V1_2026-06-12.md
01_docs_first/OFFICIAL_DOCS_FIRST_POLICY_V1.md
01_docs_first/OFFICIAL_DOCS_SOURCE_REGISTER_V1.md
01_docs_first/official-docs-source-register-v1.json
02_sops/SOP_OFFIZIELLE_DOKS_RECHERCHE_KONFIGURATION_V1.md
02_sops/SOP_AUFTRAG_VORBEREITUNG_AUSFUEHRUNG_PRUEFUNG_ENDKONTROLLE_V4.md
02_sops/SOP_TOOL_CAPABILITY_AUSNUTZUNG_V1.md
02_sops/SOP_9ROUTER_OFFICIAL_DOCS_CONFIGURATION_V1.md
02_sops/SOP_BRAIN_MEMORY_VERBINDUNGSABSICHERUNG_V1.md
02_sops/SOP_AUTOMATION_CRON_WORKER_RUNBOOK_V1.md
03_checklisten/CHECKLISTE_DOCS_FIRST_TOOL_INTEGRATION.md
03_checklisten/CHECKLISTE_AUFTRAG_ENDKONTROLLE.md
03_checklisten/CHECKLISTE_BRAIN_MEMORY_EVIDENCE.md
04_register/ARBEITSANWEISUNGEN_REGISTER_V1.md
04_register/arbeitsanweisungen-register-v1.json
05_auftraege/CLAUDE_CODE_SYSTEMMASTER_ZUSATZAUFTRAG_OFFICIAL_DOCS_V1.md
```

## 6. Direkt verbindliche Prioritäten

P0-1: Official-Docs-First-Regel in Claude Code, Goose ACC, Goose CLI, Hermes/Workstation und Agenten-Prompts verankern.  
P0-2: 9Router nicht nur als Modellproxy behandeln, sondern vollständig als Router-, Fallback-, Kosten-, Quota-, Analytics-, RTK-, Provider- und Capability-System erfassen.  
P0-3: Brain/agentmemory-Verbindungen nicht teilweise lassen. Jede Agentenlösung muss nachweisbar lesen, schreiben oder Pending erzeugen.  
P0-4: Automationen nicht als freie Cron-Loops bauen. Jede Automation braucht Owner, Trigger, Gate, Healthcheck, Evidence, Rollback und Endkontrolle.  
P0-5: Website, Kundenportal, Workstation, Angebote, Rechnungen, Mails und Signaturen erhalten ein einheitliches Graphite-Premium-Designsystem und gleiche Dokumentationsregeln.

## 7. Ergebnisdefinition

Dieser Zusatz ist erst technisch fertiggestellt, wenn er:

- im Repo abgelegt ist;
- im Dokumentenkatalog referenziert ist;
- im Arbeitsanweisungsregister enthalten ist;
- als Shell-Installationsdatei verfügbar ist;
- in Claude Code / Systemmaster-Prompt referenziert ist;
- in Brain/agentmemory oder deren Pending-Queues erfasst ist;
- in Kanban als aktive Regelverankerung dokumentiert ist.
