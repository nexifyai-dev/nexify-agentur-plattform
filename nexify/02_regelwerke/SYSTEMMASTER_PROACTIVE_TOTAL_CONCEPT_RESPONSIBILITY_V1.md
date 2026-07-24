# Systemmaster Proactive Total Concept Responsibility V1

**Status**: VERBINDLICH | **Scope**: NEXIFY_INTERNAL | **Gültigkeit**: dauerhaft, systemweit
**Erstellt**: 2026-06-11 | **Letzte Aktualisierung**: 2026-06-11

## 1. Führende Entscheidung

```json
{
  "PROACTIVE_TOTAL_SYSTEM_CONCEPT_RESPONSIBILITY": true,
  "SYSTEMWIDE_REQUIREMENTS_EXTRACTION": true,
  "SYSTEMWIDE_DATA_COLLECTION_AND_EVALUATION": true,
  "CUSTOMER_PROJECT_BOUNDARY_PROTECTION": true,
  "NO_OVERCOMPLEXITY_AS_TARGET_ARCHITECTURE": true,
  "GAP_DETECTION_AND_CLOSURE_REQUIRED": true
}
```

Claude Code trägt die dauerhafte Verantwortung, aus allen vorhandenen Quellen, Ablagen, Regelwerken, Kundendaten, technischen Zuständen und bisherigen Arbeiten ein vollständiges, klares, schlankes und umsetzbares Gesamtkonzept zu bilden, zu pflegen und laufend zu verbessern.

## 2. Erkennungspflicht

Claude Code muss bei jedem Auftrag erkennen:

- Was ist das wirkliche Ziel?
- Welche Gesamtwirkung soll entstehen?
- Welche vorhandenen Quellen wurden übersehen?
- Welche Daten liegen irgendwo im System, wurden aber noch nicht ausgewertet?
- Welche Anforderungen stecken in Chats, Dateien, Reports, Screenshots, Logs?
- Welche Lücken bestehen noch?
- Welche Lösung ist zu komplex?
- Welche Lösung ist einfacher, moderner, robuster?
- Welche Kundenprojekte dürfen nicht in den Kern integriert werden?

## 3. Quellenpflicht

Systemweit prüfen, soweit sicher und erreichbar:

- /workspace/nexify/
- /workspace/Auftragsfach
- /root/.config/goose, /root/.goose, /root/agentmemory
- /app, /workspace
- GitHub-Repos, Vercel, Cloudflare, Supabase, 9Router
- Brain/Qdrant, agentmemory, Oracle, Evidence, Kanban
- Task Registry, Auftragsfach, alte/neue Konzepte
- Screenshots, Logs, Handoffs, Chat-Zusammenfassungen
- Reports von Goose/Claude/Hermes
- P0-/P1-Aufträge, Kundenprojektordner, Archiv

Nicht erreichbare Quellen dokumentieren, kein Stillstand.

## 4. Kundenprojektgrenzen

| Projekt | Scope | Integration in Kern |
|---------|-------|---------------------|
| Studienkolleg Aachen | CUSTOMER_PROJECT | VERBOTEN |
| Affilientportal / Bookando | CUSTOMER_PROJECT | VERBOTEN |

Erlaubt: Verwaltung, Profil, Status, Kanban, Evidence, Repo-/Domain-Status.
Verboten: Code/Kundendaten in Kern, Mischen mit anderen Projekten.

## 5. Komplexitätsreduktion

Vor jeder Umsetzung prüfen:
- Gibt es eine vorhandene Lösung?
- Ist sie zu komplex?
- Kann MCP/CLI/API genutzt werden statt Neubau?
- Kann OSS-Lösung genutzt werden?
- Kann alte Eigenlösung archiviert werden?
- Ist das Ergebnis für Agenten und Menschen verständlich?

Verboten:
- Komplexität fortschreiben
- Mehrere parallele Wahrheiten
- Neue Tools ohne Register
- Neue Agents ohne Zuständigkeit
- Kundenprojektcode in Kern
