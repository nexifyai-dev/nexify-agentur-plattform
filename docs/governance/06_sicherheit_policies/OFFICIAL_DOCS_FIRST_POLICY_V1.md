# Official-Docs-First Policy V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Systemmaster / NeXify AI
**Gültigkeit:** alle NeXify-AI-Arbeiten mit Tools, APIs, MCPs, CLIs, Frameworks, Deployments, Domains, Providern, Automationen, Mailflows, Datenbanken, Modellen und Integrationen.

---

## 1. Grundregel

Jede technische oder prozessuale Arbeit beginnt mit der aktuellen offiziellen Dokumentation der betroffenen Lösung. Offizielle Dokumentation bedeutet in Priorität:

1. Hersteller-/Projekt-Dokumentation
2. Offizielles GitHub-Repository
3. Offizielle README, docs, gitbook, examples, changelog, releases
4. Offizielle API-Referenz
5. Offizielle CLI-Hilfe
6. Offizielle Security-/Migration-/Upgrade-Hinweise
7. Erst danach Blogposts, Foren, Videos oder Drittquellen

## 2. Pflichtablauf

```
Tool/Bereich identifizieren
→ offizielle Quellen laden
→ Version und Aktualität feststellen
→ Funktionen und Grenzen extrahieren
→ Konfigurationsoptionen erfassen
→ Security-/Secret-/Auth-Anforderungen erfassen
→ Kosten-/Quota-/Fallback-Möglichkeiten erfassen
→ NeXify-Nutzung gegen Möglichkeiten abgleichen
→ Zielkonfiguration definieren
→ Tests und Rollback planen
→ Umsetzung ausführen oder Gate-Paket erzeugen
→ Evidence schreiben
→ Register und Brain/agentmemory aktualisieren
```

## 3. Verbotene Arbeitsweisen

- Konfiguration aus Erinnerung
- Blindkopieren alter `.env`- oder YAML-Beispiele
- Setup aus Blogposts ohne Abgleich mit offizieller Quelle
- Aktivieren produktiver Routen ohne Auth-/Policy-Prüfung
- Anbieterfunktionen ignorieren, obwohl sie Kosten/Qualität/Stabilität verbessern
- Nur Minimalsetup und Capability-Potenzial nicht erfassen
- `DONE` melden ohne offizielle Docs, Tests oder Evidence

## 4. Pflichtdokumente je Tool-Konfiguration

```
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_OFFICIAL_DOCS_AUDIT.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_CAPABILITY_MAP.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_CONFIG_TARGET_STATE.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_TEST_PLAN.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_EVIDENCE.md
```

## 5. DOCS_FIRST_DONE-Kriterium

Eine Tool-/API-/MCP-/Provider-Arbeit ist erst DOCS_FIRST_DONE, wenn nachweisbar dokumentiert:

- geladene offizielle Quellen
- verwendete Version
- relevante Funktionen
- bewusst nicht genutzte Funktionen mit Grund
- Zielkonfiguration
- Secrets/ENV ohne Wertausgabe
- Healthchecks
- Tests
- Rollback
- Risiken
- Folgetasks
