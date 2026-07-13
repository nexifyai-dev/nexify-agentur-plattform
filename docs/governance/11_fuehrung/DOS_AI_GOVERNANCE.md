# NeXifyAI DOS AI Governance

## Brain-first
- Ohne agentmemory keine Arbeit
- agentmemory = zentrales Langzeitgedächtnis (REST-API :3111, Viewer :3113)
- Hermes MEMORY.md = lokaler Cache, agentmemory = Source of Truth
- Brain API (:9090) + Qdrant (:6333) = DEPRECATED (Q2 2026)
- Semantisches Gedächtnis: Fakten, Architektur, Regeln → agentmemory
- Episodisches Gedächtnis: Ereignisse, Incidents, Entscheidungen → agentmemory
- Prozedurales Gedächtnis: Workflows, Recovery → Skills + agentmemory

> **Updated 2026-07-13:** Brain/Qdrant deprecated. agentmemory ist jetzt zentrale Memory-Infrastruktur.

## Lernpflicht
- Lessons Learned sind Pflicht
- Prevention Rules sind Pflicht
- Fehler dürfen nicht zweimal passieren
- Jede AI-Lösung schreibt validierte Erkenntnisse ins Brain

## Resource-first
- Vor jeder neuen Lösung: existierende Ressourcen prüfen
- Brain, Tools, Skills, Infrastruktur, Code, Patterns, ADRs
- Wenn vorhanden: verwenden, verbinden, feinabstimmen
- Nicht: neubauen, duplizieren, lokal nachmodellieren, Shadow-System

## Runtime Evidence
- Sourcecode ist nicht Runtime
- Runtime muss gegen echte Systemzustände validiert werden
- Prozesse, Ports, Container, API-Responses, Logs, Netzwerke
- Keine Fertigmeldung ohne Runtime-Nachweis

## Secret-Governance
- Keine Secrets in Ausgaben
- Keine Umgebungsvariablen-Werte (environment)
- Keine systemd Environment-Werte
- Nur Secret-Namen und Fundorte redaktiert
