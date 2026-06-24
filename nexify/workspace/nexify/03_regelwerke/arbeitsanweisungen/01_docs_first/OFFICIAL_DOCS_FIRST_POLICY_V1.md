# Official-Docs-First Policy V1

**Stand:** 2026-06-12  
**Status:** VERBINDLICH  
**Gültigkeit:** alle NeXify-AI-Arbeiten mit Tools, APIs, MCPs, CLIs, Frameworks, Deployments, Domains, Providern, Automationen, Mailflows, Datenbanken, Modellen und Integrationen.

## 1. Grundregel

Jede technische oder prozessuale Arbeit beginnt mit der aktuellen offiziellen Dokumentation der betroffenen Lösung. Offizielle Dokumentation bedeutet in Priorität:

1. Hersteller-/Projekt-Dokumentation;
2. offizielles GitHub-Repository;
3. offizielle README, docs, gitbook, examples, changelog, releases;
4. offizielle API-Referenz;
5. offizielle CLI-Hilfe;
6. offizielle Security-/Migration-/Upgrade-Hinweise;
7. erst danach Blogposts, Foren, Videos oder Drittquellen.

## 2. Pflichtablauf

```text
Tool oder Bereich identifizieren
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

Verboten ist:

- Konfiguration aus Erinnerung;
- Blindkopieren alter `.env`- oder YAML-Beispiele;
- Setup aus Blogposts ohne Abgleich mit offizieller Quelle;
- Aktivieren produktiver Routen ohne Auth-/Policy-Prüfung;
- Anbieterfunktionen ignorieren, obwohl sie Kosten, Qualität oder Stabilität verbessern könnten;
- nur Minimalsetup herstellen und Capability-Potenzial nicht erfassen;
- `DONE` melden, obwohl offizielle Docs, Tests oder Evidence fehlen.

## 4. Pflichtdokument je Tool-Konfiguration

Für jede relevante Lösung ist ein Target-State-Dokument zu erstellen oder zu aktualisieren:

```text
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_OFFICIAL_DOCS_AUDIT.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_CAPABILITY_MAP.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_CONFIG_TARGET_STATE.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_TEST_PLAN.md
/workspace/nexify/07_tools_cli/{tool}/{TOOL}_EVIDENCE.md
```

## 5. Official-Docs-Done-Kriterium

Eine Tool-/API-/MCP-/Provider-Arbeit ist erst `DOCS_FIRST_DONE`, wenn nachweisbar dokumentiert ist:

- geladene offizielle Quellen;
- verwendete Version;
- relevante Funktionen;
- bewusst nicht genutzte Funktionen mit Grund;
- Zielkonfiguration;
- Secrets/ENV ohne Wertausgabe;
- Healthchecks;
- Tests;
- Rollback;
- Risiken;
- Folgetasks.
