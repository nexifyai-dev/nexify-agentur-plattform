# Tenant-/Scope-Regeln für Kanban/Tasks

## Gültig ab: 2026-06-21
## Geprüft durch: Phase 6 Security/Tenant-Audit

---

## 1. tenant-Feld in Board-DB

### tasks.tenant
- **Typ:** TEXT, nullable
- **Verwendung:** Primärer Tenant-Identifier pro Task
- **NULL = global:** Task ist profil-übergreifend sichtbar
- **Nicht-NULL = isoliert:** Nur Tasks mit matching tenant sind im Scope

### evidence_items.tenant  *(migriert 2026-06-21)*
- **Typ:** TEXT, nullable
- **Verwendung:** Erbt von tasks.tenant (task_id → tasks.tenant)
- **Regel:** Beim Anlegen eines evidence_items IMMER tenant aus tasks kopieren
- **Alternative:** Direkt setzen wenn Task keinen tenant hat

### task_reviews.tenant  *(migriert 2026-06-21)*
- **Typ:** TEXT, nullable
- **Verwendung:** Erbt von tasks.tenant (task_id → tasks.tenant)
- **Regel:** Beim Anlegen eines task_reviews IMMER tenant aus tasks kopieren

## 2. Scope-Typen

| Scope-Wert | Bedeutung |
|-----------|-----------|
| NULL | Global — alle Boards/Profile sehen diesen Task |
| `auftragszentrale` | Auftragszentrale-Board |
| `buchhaltung` | Buchhaltungs-Board |
| `customer/{slug}` | Kundenprojekt (Slug = Kundenname) |
| `{board-slug}` | Beliebiges Board |
| `tenant/{uuid}` | Supabase-Tenant (globale Tenant-ID) |

## 3. Regeln für Task-Erstellung

```
WHEN task erstellt:
  IF board == "default" AND board hat tenant:
    tasks.tenant = board.tenant
  ELSE IF board != "default":
    tasks.tenant = board-slug
  ELSE:
    tasks.tenant = NULL (global)
```

## 4. Regeln für Evidence/Review-Erstellung

```
WHEN evidence_item erstellt (task_id = T):
  evidence_items.tenant = T.tenant
  (implizit: T muss existieren)

WHEN task_review erstellt (task_id = T):
  task_reviews.tenant = T.tenant
  (implizit: T muss existieren)
```

## 5. Query-Isolation

Standard-Filter für tenant-bewusste Queries:
```sql
WHERE (tenant IS NULL OR tenant = :current_tenant)
```

## 6. Board-Trennung (Multi-Board)

Jedes Board = separate SQLite-DB unter:
- `~/.hermes/kanban.db` (default)
- `~/.hermes/kanban/boards/{slug}/kanban.db` (andere Boards)

**Isolation:**  
- Kein Cross-Board-DB-Zugriff aus Code  
- Jede DB hat eigene tasks/evidence/reviews  
- tenant-Feld dient als zusätzliche Isolationsebene INNERHALB eines Boards  

## 7. Supabase-Tenant vs Kanban-Tenant

**Supabase-Tenants** (Migration 008):  
- Für Kundenprojekte (White-Label, Multi-Customer)  
- Vollständige RLS-Isolation pro Tenant  
- Eigene Tabellen: tenants, tenant_configs, tenant_members, tenant_branding, tenant_integrations  

**Kanban-Tenants** (Phase 6):  
- Für interne Board-Organisation  
- Einfaches TEXT-Feld in SQLite  
- Keine RLS, keine UUIDs  

**Keine Vermischung erlaubt.** Beide Systeme bleiben getrennt.

## 8. CEO-Profil: Gesperrt

| Profil | Status | execution_permission |
|--------|--------|---------------------|
| ceo | 🔴 GESPERRT (P0-QUARANTINE) | `never` |
| nexify-ceo | ✅ Aktiv (operativ) | Keine Restriktion |

**Grund (ceo):** Secret-Leak in memories/SOUL.md (Zeile 125, 137).  
**Aktion:** API-Key und Webhook-Secret rotieren, Secrets entfernen, dann Quarantine aufheben.

---

## Anhänge

- Migration SQL: `/workspace/nexify/kanban/03_add_tenant_to_evidence_reviews.sql`
- Security Report: `/workspace/nexify/10_evidence/kanban/kanban-tenant-security-report-20260621.md`
