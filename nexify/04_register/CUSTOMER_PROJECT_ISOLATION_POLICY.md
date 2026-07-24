# Customer Project Isolation Policy — NeXify AI OS
## Version: 1.0 | Status: BINDING | Erstellt: 2026-06-23
## JSON-Pendant: `04_projects/customer-project-isolation-policy.json`

---

## 1. Zweck und Geltungsbereich
Diese Policy stellt die strikte Trennung zwischen Kundenprojekten (CUSTOMER_PROJECT) und dem NeXify-Kernsystem (NEXIFY_INTERNAL) sicher. Sie verhindert Daten-Leaks, Code-Vermischung und unbeabsichtigte Abhängigkeiten.

**Geltungsbereich:** Alle Kundenprojekte, die unter dem CUSTOMER_PROJECT-Scope geführt werden.

---

## 2. Registrierte Kundenprojekte

| ID | Projekt | Repo-Typ | Deployment | Scope |
|---|---|---|---|---|
| CP-001 | Studienkolleg Aachen | GitHub (privat) | GitHub Pages | CUSTOMER_PROJECT |
| CP-002 | Affilientportal / Bookando | GitHub (privat) | app.bookando.de | CUSTOMER_PROJECT |

---

## 3. Trennungsregeln

### 3.1 Code-Trennung
| Regel | Status |
|---|---|
| Kundenprojekt-Code in `/workspace/nexify/` kopieren | ❌ VERBOTEN |
| Kundenprojekt-Logik als NeXify-Standard ausrollen | ❌ VERBOTEN |
| Kopien nur in Kundenprojekt-Repos | ✅ ERLAUBT |

### 3.2 Daten-Trennung
| Regel | Status |
|---|---|
| Kundendaten ins allgemeine Brain (nexifyai_brain) mischen | ❌ VERBOTEN |
| Kunden-PII in Logs, Evidence oder Handoffs | ❌ VERBOTEN |
| Brain-Metadaten: nur Projektstatus, keine Inhaltsdaten | ✅ ERLAUBT |
| Brain-Einträge mit Scope CUSTOMER_PROJECT, Kategorie customer-data | ✅ ERLAUBT |

### 3.3 Agenten-Trennung
| Regel | Status |
|---|---|
| Kundenprojekt-Agenten in `/root/.claude/agents/` | ❌ VERBOTEN |
| Kundenprojekt-Skills in `/root/.claude/skills/` | ❌ VERBOTEN |
| Kundenprojekte nutzen projektlokale `.claude/` Ordner | ✅ ERLAUBT |

### 3.4 Secret-Trennung
| Regel | Status |
|---|---|
| Kunden-Secrets in `/root/.nexify/secrets/` | ❌ VERBOTEN |
| Kunden-API-Keys in Host-Umgebungsvariablen | ❌ VERBOTEN |
| Kunden-Secrets nur in projektlokalen `.env` Dateien (nie committed) | ✅ ERLAUBT |

### 3.5 Tool/MCP-Trennung
| Regel | Status |
|---|---|
| Kundenprojekte installieren globale MCP-Server | ❌ VERBOTEN |
| Kundenprojekt-Webhooks in globaler Infrastruktur | ❌ VERBOTEN |
| Tools pro Projekt: lokal installiert, projektweit deklariert | ✅ ERLAUBT |

---

## 4. Gemeinsame Infrastruktur (Shared Services)

| Service | Erlaubt | Bedingung |
|---|---|---|
| Hostinger VDS | ✅ | Getrennte Docker-Compose Projekte |
| Cloudflare DNS | ✅ | Getrennte Zonen |
| Vercel | ✅ | Getrennte Teams/Projekte |
| Brain (Read) | ✅ | Nur Metadaten |
| 9Router | ✅ | Getrennte API-Keys |
| Resend | ✅ | Getrennte API-Keys |

---

## 5. Verbotene Aktivitäten (Zusammenfassung)

1. Code/Libraries von Kundenprojekt in Kern übernehmen
2. Kundendaten in Brain/Agentmemory ohne Scope-Tag
3. Kundenlogik als NeXify-Standard ausrollen
4. Kundenprojekt in Workstation integrieren
5. Kunden-Secrets mit Klarwerten speichern
6. Kundenprojekte untereinander vermischen

---

## 6. Audit-Regeln

- **Audit-Pfad pro Projekt:** `10_evidence/customer_projects/{CP-ID}/`
- **Isolations-Check bei jedem Deploy:** Pflicht
- **Verstoß-Schweregrad:** P0-Incident (sofortige Eskalation)

---

## 7. Review-Zyklus
Diese Policy wird bei jedem neuen Kundenprojekt, bei Deployments und quartalsweise überprüft.

---

## 8. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---|---|---|---|
| 1.0.0 | 2026-06-23 | Systemmaster | Initiale Fassung — MD-Pendant zu JSON |

---

*Ende CUSTOMER_PROJECT_ISOLATION_POLICY*
