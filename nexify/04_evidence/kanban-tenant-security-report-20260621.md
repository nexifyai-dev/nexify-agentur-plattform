# Security-Report: Kanban/Tasks Tenant-Prüfung (Phase 6)
**Datum:** 2026-06-21
**Profil:** nexify-ceo (aktiv)

## 1. tasks.tenant - Board-DB Analyse

| Aspekt | Status |
|--------|--------|
| tenant-Feld in tasks | ✅ VORHANDEN (TEXT, nullable) |
| Aktuelle tenant-Werte | Alle 14 Tasks → NULL |
| Tenant-Index | ✅ idx_tasks_tenant erstellt |
| Board-Trennung | Nur "default" Board aktiv |

**Bewertung:** Tenant-Feld existiert in tasks, aber alle Werte NULL. Keine tenant-basierte Aufteilung aktiv. Board-Isolation (multi-board) ist möglich aber nicht genutzt.

## 2. CEO-Profil Sperrstatus

| Aspekt | Status |
|--------|--------|
| Profil | ceo |
| execution_permission | `never` ✅ GESPERRT |
| security_lock | `"P0-QUARANTINE — Secret-Leak in memories/SOUL.md"` |
| NOT_READY.md | ✅ Vorhanden — vollständige QUARANTINE |
| Aktives Profil | nexify-ceo (funktionsfähig, agentur-admin default) |
| API-Key in ceo/config.yaml | Referenz: `${OPENAI_API_KEY}` (Env-Var, kein Plaintext) |
| API-Key in nexify-ceo/config.yaml | ⚠️ `sk-970...10ba` (hartcodiert, aber maskiert im Output) |

**Bewertung:** ceo-Profil ist korrekt gesperrt (`execution_permission: never`). Secret-Leak (SOUL.md Zeile 125, 137) dokumentiert in NOT_READY.md. Quarantine-Massnahmen: API-Key rotieren, Webhook-Secret rotieren, Secrets aus SOUL.md entfernen.

**⚠️ HINWEIS:** nexify-ceo/config.yaml enthält API-Key in Klartext (sk-970...). Security-Audit empfohlen.

## 3. nexify-ceo Profil Status

| Aspekt | Status |
|--------|--------|
| execution_permission | Nicht gesetzt (keine Einschränkung) |
| Operatives Profil? | ✅ Ja — voll funktionsfähig |
| Modelle | nexifyai-combo-llm, glm-5, glm-5-flash |
| Provider | custom (ai-router.nexifyai.cloud) |
| Kanban-Dispatch | Via agentur-admin (active_profile) |

**Bewertung:** nexify-ceo ist das aktive CEO-Profil. Keine execution_permission-Restriktion. Arbeitet operativ.

## 4. Secret-Referenzen in Kanban-Daten

| Tabelle | Geprüft | Secrets gefunden |
|---------|---------|-----------------|
| tasks.title | 14 Tasks | ❌ Keine |
| tasks.body | 14 Tasks | ❌ Keine |
| task_comments.body | 0 Comments | ❌ Keine |
| evidence_items.description | 1 Item | ❌ Keine |
| evidence_items.title | 1 Item | ❌ Keine |

**Geprüfte Pattern:** OpenAI API Keys (sk-...), GitHub Tokens (ghp_/gho_/ghu_), Slack Tokens (xox[baprs]-...), AWS Keys (AKIA...), Private Keys (BEGIN PRIVATE KEY), Passwörter, API-Key-Patterns.

**Bewertung:** ✅ Keine Secrets in Kanban-Daten gefunden.

## 5. Tenant/Scope-Konzept für evidence_items + task_reviews

### Datenmodell-Erweiterung
- **evidence_items.tenant** (TEXT) — neu migriert ✅
- **task_reviews.tenant** (TEXT) — neu migriert ✅

### Tenant/Scope-Regeln
1. **tasks.tenant** ist der primäre Tenant-Identifier (Projekt/Board)
2. **evidence_items.tenant** erbt von dazugehörigem task.tenant
3. **task_reviews.tenant** erbt von dazugehörigem task.tenant
4. Bei tenant=NULL: "global" / profil-übergreifend sichtbar
5. Board-Isolation (multi-board) ist der empfohlene Weg für strikte Trennung

### Scope-Typen
| Scope | Bedeutung | Beispiele |
|-------|-----------|-----------|
| global | Kein Tenant — alle Profile sehen Tasks | System-Tasks |
| auftragszentrale | Auftragszentrale-Board | AZ-001 bis AZ-008 |
| buchhaltung | Buchhaltungs-Board | Rechnungs-Tasks |
| customer/{slug} | Kundenprojekt-Isolation | Kunde-X, Kunde-Y |

## 6. Prüfung: Globales Supabase-Tenant-Schema

Supabase hat eigenes Tenant-System (Migration 008):
- **tenants** Tabelle: UUID PK, organization_id, name, slug, domain, status
- **tenant_configs**: key/value pro tenant
- **tenant_members**: profile → tenant Zuordnung
- **tenant_branding**: White-Label pro tenant
- **tenant_integrations**: OAuth/Credentials pro tenant
- **Row Level Security**: Alle Tabellen via RLS geschützt

**ADR-013:** Vollständige Tenant-Isolation (Option B) für Kundenprojekte — separate Repos/Deployments/Datenbanken.

**Kanban-Board-DB:** Ist NICHT Teil des Supabase-Tenant-Systems. Nutzt eigenes tenant-Feld in SQLite.

**Bewertung:** Keine Vermischung — Supabase-Tenants sind für Kundenprojekte, Kanban-tenant für interne Board-Organisation. Zwei separate Systeme.

## 7. Board-Trennung: Sicherheit

| Board | Sicherheit | Status |
|-------|-----------|--------|
| default (aktiv) | ✅ Einzige Board — alle Tasks sichtbar | OK |
| Multi-Board | ✅ Architektur unterstützt Isolation pro Board | Nicht aktiv |
| Cross-Board-Zugriff | ✅ Nicht möglich — jedes Board = separate DB | OK |

**Empfehlung:** Für strikte Trennung zwischen Auftragszentrale, Buchhaltung, etc.:
1. Separate Boards anlegen (`hermes kanban board create <slug>`)
2. Board-spezifische Profile zuweisen
3. Tenant-Feld bei Task-Erstellung setzen

## 8. Migrations-Status

| Tabelle | tenant-Feld | Status |
|---------|------------|--------|
| tasks | ✅ Bereits vorhanden | OK |
| evidence_items | ✅ Neu hinzugefügt | ✅ MIGRIERT |
| task_reviews | ✅ Neu hinzugefügt | ✅ MIGRIERT |

Migration SQL: `/workspace/nexify/kanban/03_add_tenant_to_evidence_reviews.sql`

## Zusammenfassung

1. ✅ tasks.tenant existiert und ist nutzbar (alle NULL → keine Aufteilung aktiv)
2. ✅ ceo-Profil korrekt gesperrt (execution_permission: never, P0-QUARANTINE)
3. ✅ nexify-ceo als operatives Profil aktiv
4. ✅ Keine Secrets in Kanban-Daten gefunden
5. ✅ Tenant-Feld zu evidence_items + task_reviews migriert
6. ✅ Supabase-Tenants getrennt von Kanban-Tenants
7. ✅ Multi-Board-Architektur bereit, aber nicht aktiv
8. ✅ Migrations-SQL erstellt und angewendet
