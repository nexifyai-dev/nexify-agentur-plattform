# Agent-Aktivitäts-Logging Schema (P1-007)
## NeXifyAI Agentur-Plattform

> **Datum:** 2026-07-08 | **Version:** 1.0
> **Kontext:** ISO 27001 A.12.4 (Logging), Accountability, Audit-Trail
> **Status:** AKTIV

---

## 1. Übersicht: Logging-Quellen

| System | Logging-Mechanismus | Retention | Abfrage |
|--------|-------------------|-----------|---------|
| **Paperclip** | `activity_log` Tabelle (Supabase) | 90 Tage | SQL-Query via Supabase |
| **agentmemory** | Audit Trail (memory_audit) | Permanent | `memory_audit` MCP-Call |
| **Hermes Sessions** | Session-DB (SQLite) | 30 Tage | `session_search` |
| **Hermes WebUI** | `/var/log/nexifyai/` | 7 Tage | `cat/tail` |
| **Traefik** | Access-Logs (Docker) | 7 Tage | `docker logs` |
| **9Router** | Kein Logging (Standard) | — | — |
| **DeepCode/Director** | `/var/log/nexifyai/director-generator.log` | 14 Tage | `cat/tail` |

---

## 2. Paperclip activity_log Schema

```sql
CREATE TABLE activity_log (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id   UUID NOT NULL,         -- Tenant-Isolation
    actor_type   TEXT NOT NULL DEFAULT 'system',  -- system|human|agent
    actor_id     TEXT NOT NULL,         -- Agent-ID oder User-ID
    action       TEXT NOT NULL,         -- z.B. 'create', 'update', 'deploy', 'approve'
    entity_type  TEXT NOT NULL,         -- z.B. 'issue', 'agent', 'project', 'config'
    entity_id    TEXT NOT NULL,         -- ID des betroffenen Objekts
    agent_id     UUID,                  -- Verknüpfter Agent (optional)
    details      JSONB,                 -- Zusätzliche Metadaten
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX activity_log_company_created_idx 
    ON activity_log USING btree (company_id, created_at);
```

### Beispiel-Einträge

```json
{
  "company_id": "nexify-internal-uuid",
  "actor_type": "agent",
  "actor_id": "hermes-webui",
  "action": "create",
  "entity_type": "document",
  "entity_id": "VVT_ART30_DSGVO",
  "agent_id": null,
  "details": {
    "document": "VERARBEITUNGSVERZEICHNIS_VVT_ART30_DSGVO.md",
    "systems_count": 13,
    "triggered_by": "automode",
    "action_id": "act_mrc4wlv4_80f11d763da8"
  }
}
```

```json
{
  "company_id": "nexify-internal-uuid",
  "actor_type": "agent",
  "actor_id": "deepcode",
  "action": "approve",
  "entity_type": "change",
  "entity_id": "CH-20260708-006",
  "agent_id": null,
  "details": {
    "change_type": "standard",
    "system": "governance",
    "cab_decision": "post-facto-approved"
  }
}
```

```json
{
  "company_id": "nexify-internal-uuid",
  "actor_type": "system",
  "actor_id": "agentmemory",
  "action": "lease",
  "entity_type": "action",
  "entity_id": "act_mrc665ui_c50ac9e8ccd2",
  "agent_id": null,
  "details": {
    "operation": "acquire",
    "ttl_ms": 600000,
    "agent": "hermes-webui",
    "result": "success"
  }
}
```

---

## 3. Logging-Pflichten (Was MUSS geloggt werden)

| Aktion | System | Log-Level | Pflicht |
|--------|--------|-----------|---------|
| Agent erstellt/ändert Dokument | Paperclip + agentmemory | INFO | ✅ |
| Agent deployed Code | Paperclip + Hermes | INFO | ✅ |
| Agent ändert Config/Secret | Paperclip | WARN | ✅ |
| Agent genehmigt Change | Paperclip | INFO | ✅ |
| Agent erstellt/updated Action | agentmemory | INFO | ✅ |
| Agent leased Action | agentmemory | DEBUG | ✅ |
| LLM-Call (Prompt/Response) | 9Router | WARN (nur Fehler) | ⚠️ |
| Login/Auth-Ereignis | Paperclip | INFO | ✅ |
| P0/P1-Incident | Paperclip + Hermes | ERROR | ✅ |
| Tenant-übergreifender Zugriff | Paperclip | CRITICAL | ✅ |

---

## 4. Abfragen für Audits

### 4.1 Alle Aktionen eines Agenten (letzte 7 Tage)
```sql
SELECT * FROM activity_log 
WHERE actor_id = 'hermes-webui' 
  AND created_at > now() - interval '7 days'
ORDER BY created_at DESC;
```

### 4.2 Alle Tenant-übergreifenden Versuche
```sql
SELECT * FROM activity_log 
WHERE action = 'cross-tenant-access'
ORDER BY created_at DESC;
```

### 4.3 Alle Config-Änderungen (letzte 30 Tage)
```sql
SELECT * FROM activity_log 
WHERE entity_type IN ('config', 'secret', 'env')
  AND created_at > now() - interval '30 days'
ORDER BY created_at DESC;
```

### 4.4 Agentmemory Audit (MCP)
```
memory_audit(limit=50, operation="save")
memory_audit(limit=50, operation="action_update")
```

---

## 5. Log-Rotation & Aufbewahrung

| Quelle | Rotation | Aufbewahrung | Löschung |
|--------|----------|-------------|----------|
| Paperclip activity_log | Monatlich | 90 Tage | Automatisch via Supabase Cron |
| agentmemory Audit | Keine | Permanent | Manuell (Governance) |
| Hermes Sessions | Keine | 30 Tage | Auto-Archive |
| Director-Log | Täglich | 14 Tage | Logrotate |
| Traefik | Täglich | 7 Tage | Docker-Log-Limit |

---

## 6. Versionierung

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-07-08 | Hermes Agent (Automode) | Initiales Logging-Schema |

---

*P1-007: Agent-Aktivitäts-Logging. ISO 27001 A.12.4 Compliance.*
