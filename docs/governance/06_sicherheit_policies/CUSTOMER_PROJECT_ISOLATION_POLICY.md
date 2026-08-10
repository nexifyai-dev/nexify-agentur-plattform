# Customer Project Isolation Policy V1

**Status**: VERBINDLICH | **Scope**: CUSTOMER_PROJECT | **Gültigkeit**: dauerhaft
**Erstellt**: 2026-06-11

## 1. Grundsatz

Kundenprojekte sind strikt vom NeXify-Kernsystem zu trennen. Diese Policy definiert
die harten Grenzen für Daten, Code, Repos, Memory, Agenten und Tools.

## 2. Registrierte Kundenprojekte

| ID | Name | Repo | Deployment | Scope |
|----|------|------|-----------|-------|
| CP-001 | Studienkolleg Aachen | GitHub (privat) | GitHub Pages | CUSTOMER_PROJECT |
| CP-002 | Affilientportal / Bookando | GitHub (privat) | app.bookando.de | CUSTOMER_PROJECT |

## 3. Harte Trennregeln

### 3.1 Code-Trennung
- ❌ Kundenprojekt-Code darf **nie** in `/workspace/nexify/` kopiert werden
- ❌ Kundenprojekt-Logik darf **nie** als NeXify-Standard ausgerollt werden
- ✅ Kopien existieren nur in Kundenprojekt-Repos

### 3.2 Daten-Trennung
- ❌ Kundendaten dürfen **nie** ins allgemeine Brain (`nexifyai_brain`) gemischt werden
- ❌ Kunden-PII darf **nie** in Logs, Evidence oder Handoffs auftauchen
- ✅ Brain-Metadaten: nur Projektstatus, keine Inhaltsdaten
- ✅ Kunden-Brain-Einträge: Brain-Scope `CUSTOMER_PROJECT`, Kategorie `customer-data`

### 3.3 Agenten-Trennung
- ❌ Keine Kundenprojekt-Agenten im globalen `/root/.claude/agents/`
- ❌ Keine Kundenprojekt-Skills im globalen `/root/.claude/skills/`
- ✅ Kundenprojekte nutzen projektlokale `.claude/` Ordner

### 3.4 Secret-Trennung
- ❌ Kunden-Secrets dürfen **nie** in `/root/.nexify/secrets/` liegen
- ❌ Kunden-API-Keys dürfen **nie** in Umgebungsvariablen des Host-Systems
- ✅ Kunden-Secrets nur in projektlokalen `.env` Dateien (nie committed)

### 3.5 Tool/MCP-Trennung
- ❌ Kundenprojekte dürfen **keine** globalen MCP-Server installieren
- ❌ Keine Kundenprojekt-Webhooks in globaler Infrastruktur
- ✅ Tools pro Projekt: lokal installiert, projektweit deklariert

## 4. Erlaubte Shared Infrastructure

| Infrastruktur | Erlaubt | Bedingung |
|--------------|---------|-----------|
| Hostinger VDS | ✅ | Getrennte Docker-Compose Projekte |
| Cloudflare DNS | ✅ | Getrennte Zonen |
| Brain (Read) | ✅ | Nur Metadaten |
| 9Router | ✅ | Getrennte API-Keys |
| Resend | ✅ | Getrennte API-Keys |

## 5. Erlaubte Verwaltungstätigkeiten

- Projektprofil anlegen/pflegen
- Kundenanforderungen erfassen (getrenntes Register)
- Projektstatus verfolgen
- Aufgaben planen (eigenes Kanban-Board)
- Evidence dokumentieren
- Repo-/Deployment-/Domain-Status tracken
- Support-Historie strukturieren
- Liefergegenstände verwalten
- Risiken dokumentieren

## 6. Verbotene Tätigkeiten

- Code/Libraries von Kundenprojekt in Kern übernehmen
- Kundendaten in Brain/Agentmemory ohne Scope-Tag
- Kundenlogik als NeXify-Standard ausrollen
- Kundenprojekt in Workstation integrieren
- Kunden-Secrets mit Klarwerten speichern
- Kundenprojekte untereinander vermischen

## 7. Audit-Regeln

- Jedes Kundenprojekt hat einen eigenen Audit-Pfad
- Isolation wird bei jedem Deploy geprüft
- Verstösse gegen diese Policy sind P0-Incidents

---

*Ende Customer Project Isolation Policy V1*
