# NeXify AI — Arbeitsanweisungen Zusatz V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Pascal Courbois / NeXify AI by NeXify — chat it. Automate it.
**Gültigkeit:** systemweit für NeXify AI, Workstation, Repo, Website, Kundenportal, Agenten, Automationen, Brain, agentmemory, 9Router, MCPs, APIs, Vertrieb, Support, Angebote, Dokumente und Betrieb.

---

## 1. Zweck

Dieser Zusatz schließt die Lücke zwischen Zielbild und tatsächlicher Ausführung. Er definiert verbindliche Arbeitsanweisungen für jeden Auftrag: Vorbereitung, Ausführung, Prüfung, Dokumentation, Endkontrolle und Rückführung in Brain, agentmemory, Kanban, Evidence und Register.

## 2. Führende Entscheidung

NeXify AI arbeitet nicht aus Erinnerung, Vermutung oder isolierten Screenshots.
NeXify AI arbeitet nach einem **Docs-first-, Brain-first-, Bestand-first- und Evidence-first-Verfahren**.

```
Ziel verstehen → Kontext und Brain laden → Bestand und Repo prüfen →
offizielle Dokumentation laden → Möglichkeiten vollständig erfassen →
vorhandene Fähigkeiten maximal nutzen → Lösung planen → Policy Gate →
Umsetzung → Tests und Review → Evidence → Brain/agentmemory/Kanban/Register →
Folgeaufträge
```

## 3. Nicht verhandelbare Arbeitsregel

Keine Tool-Konfiguration, API-Integration, MCP-Integration, Provider-Konfiguration, Deployment-Anpassung, Domain-/DNS-Änderung, Automatisierung, Mailflow, CRM-/Lead-Prozess, Website-/Portal-Funktion oder Workstation-Funktion ohne Prüfung:

1. Offizielle Dokumentation aktuell?
2. Möglichkeiten der Lösung vollständig?
3. Was nutzt NeXify bereits?
4. Was fehlt im Zielbild oder Betrieb?
5. Was spart Kosten, Zeit, Fehler oder manuelle Arbeit?
6. Was verbessert Qualität, Kundenerlebnis, Sicherheit oder Skalierbarkeit?
7. Was ist riskant, gate-pflichtig oder nur vorzubereiten?
8. Welche Konfigurationen, ENV, Secrets, Webhooks, APIs, Modelle sind nötig?
9. Welche Tests beweisen die Integration?
10. Welche Erkenntnisse → Brain? Welche → agentmemory?

## 4. Zielzustand pro Arbeit

Jede Arbeit erzeugt:

- Task-/Kanban-Status
- Evidence
- betroffener Registereintrag
- Brain-/agentmemory-Entscheidung
- offene Risiken
- Abbruch-/Gate-Punkte
- Tests und Prüfergebnis
- Folgeaufträge
- bei Tools: Capability-Mapping
- bei Konfigurationen: Config-Target-State
- bei Automationen: Runbook, Healthcheck, Rollback
- bei Kundenprozessen: Datenschutz-/Rechts-/Outreach-Gate
- bei Website/Portal/Design: Designsystem- und UX-Abnahme
- bei Dokumenten: Version, Owner, Zweck, Gültigkeit, nächste Prüfung

## 5. Verzeichnisstruktur

```
00_master/             - Dieses Dokument
01_docs_first/         - Official-Docs-First Policy + Source Register
02_sops/               - Arbeits-SOPs
03_checklisten/        - Checklisten für Endkontrolle
04_register/           - Arbeitsanweisungen-Register
```

## 6. Direkt verbindliche Prioritäten

- **P0-1**: Official-Docs-First in Claude Code, Goose, Hermes/Workstation und Agenten-Prompts verankern
- **P0-2**: 9Router vollständig als Router-, Fallback-, Kosten-, Quota-, Analytics-, RTK-, Provider- und Capability-System erfassen
- **P0-3**: Brain/agentmemory-Verbindungen nachweisbar lesen/schreiben/Pending erzeugen
- **P0-4**: Automationen mit Owner, Trigger, Gate, Healthcheck, Evidence, Rollback und Endkontrolle
- **P0-5**: Graphite-Premium-Designsystem für alle Frontends

## 7. Ergebnisdefinition

Dieser Zusatz ist technisch fertig, wenn er:

- im Repo abgelegt ist
- im Dokumentenkatalog referenziert ist
- im Arbeitsanweisungsregister enthalten ist
- in Brain/agentmemory oder Pending-Queues erfasst ist
- in Kanban als aktive Regelverankerung dokumentiert ist
