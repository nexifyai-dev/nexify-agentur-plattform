# Customer Project Isolation Policy — agentur-admin

**Version:** 1.0 | **Status:** ACTIVE | **Gültig ab:** 2026-06-20  
**Verantwortlich:** agentur-admin

---

## 1. Grundsatz

Jeder Kunde erhält eine strikt isolierte Arbeitsumgebung. Keine Vermischung von:
- Code-Repositories
- Secrets und Credentials
- Infrastruktur (Datenbanken, Caches, Queues)
- Deployment-Konfigurationen
- Monitoring-Daten

---

## 2. Verzeichnis-Struktur

```
/workspace/customers/
├── <kunde>/                          # pro Kunde ein Ordner
│   ├── <projekt>/                    # pro Projekt
│   │   ├── frontend/                 # Frontend-Repo (Clone)
│   │   ├── backend/                  # Backend-Repo (Clone)
│   │   ├── docs/                     # Kunden-Pflichtenhefte, Architektur
│   │   │   ├── customer/            # Kunden-Pflichtenheft
│   │   │   └── requirements/         # Traceability-Matrix
│   │   ├── secrets/                  # 🔴 NIEMALS COMMITTEN
│   │   └── .env                      # Nur lokal, in .gitignore
```

### Aktuelle Kunden
| Kunde | Projekte | Root-Pfad |
|-------|----------|-----------|
| FixDigital | bookando | `/workspace/customers/fixdigital/bookando/` |

---

## 3. Secrets-Isolation

1. **Kein Secret verlässt das Kundenverzeichnis** — kein Copy-Paste in Shared-Infra-Skripte
2. **Infrastruktur-Secrets** (`config/`, `.env`) sofort in `.gitignore` aufnehmen
3. **Getrennte .env-Dateien** für jeden Kunden — keine gemeinsame `.env`
4. **Kein Secret in Logs, Shell-History, Claude-Output**
5. **Credentials nur via Environment-Variablen oder Docker Secrets**, nie im Code

---

## 4. Deployment-Isolation

1. **Getrennte Vercel-Projekte** pro Kunde (bookando-de, bookando-de-riw8)
2. **Getrennte Docker-Container** pro Kunde (kein Shared-DB-Container)
3. **Getrennte GitHub-Repositories** (kein Monorepo mit mehreren Kunden)
4. **Getrennte Supabase-Projekte** (Tenant-Separation auf Infrastrukturebene)

---

## 5. Git-Regeln

1. **Jeder Kunde eigenes GitHub-Repo** — kein gemischtes Commit-History
2. **Branch-Naming:** `<kunde>/<feature>` (z.B. `bookando/rate-limiter`)
3. **Keine Cross-Kunden-Commits** in einem Branch
4. **PR-Review-Pflicht** vor main-Merge
5. **Force-Push verboten** auf main-Branches

---

## 6. Prüf-Routine (monatlich)

1. Sind alle `.gitignore` aktuell? (`config/`, `secrets/`, `.env.*` abgedeckt?)
2. Existieren Secrets in Git-History? (`gitleaks detect --no-git`)
3. Sind Kunden-Projektverzeichnisse sauber getrennt?
4. VPS-Zugriffe und Credentials rotiert?

---

## 7. Ausnahmen

Ausnahmen nur mit explizitem OK des agentur-admin:
- Shared Services (9Router, Resend Email) — nutzen URL-basierte Trennung und API-Keys
- Monitoring-Infrastruktur — Metriken aggregiert, nie roh

---

## 8. Incident-Response bei Isolation-Bruch

1. Secret sofort rotieren (neues Passwort/Key generieren)
2. Git-Commit aus History entfernen (`git filter-branch` oder `bfg`)
3. GitHub-Secret-Scanning prüfen
4. Incident-Dokumentation in `/workspace/customers/<kunde>/incidents/`
5. Root-Cause-Analyse innerhalb 24h

---

*Diese Policy wird vom agentur-admin durchgesetzt und bei Verstössen eskalert.*
