# NEXIFY CAPABILITY MCP SOURCE REGISTER V1

**Stand**: 2026-06-11  
**Status**: DRAFT  
**Owner**: NeXify Architecture Team  
**Classification**: Internal

---

## Sektion 1: MCP-Quellen

| mcp_id | name | source_type | source_url | protocol | transport | capabilities | auth_required | risk_level | status | evidence_ref |
|--------|------|-------------|------------|----------|-----------|--------------|---------------|------------|--------|--------------|
| MCP-001 | agentmemory | local Python MCP | `memory://agentmemory/` | memory-store | local IPC | Memory/State-Management – persistenter Agent-Speicher, Embedding-Suche, kontextuelles Recall | yes | HIGH | DRAFT | `/evidence/mcp-001-arch.md` |
| MCP-002 | 9router | remote/API MCP | `https://api.9router.ai/v1` | REST/HTTP | HTTPS | AI Router/Model-Dispatch – LLM-Routing, Fallback-Chains, Modell-Auswahl | yes | CRITICAL | DRAFT | `/evidence/mcp-002-router-spec.md` |
| MCP-003 | filesystem | built-in | `file:///` | file-protocol | stdio | File-Operationen – read/write/move/copy/list, File-Watcher | no | LOW | REGISTERED | `/evidence/mcp-003-fs.md` |
| MCP-004 | github | built-in | `https://api.github.com` | REST/HTTP | HTTPS | Repository-Management – Issues, PRs, Commits, Code-Review, Actions | yes | MEDIUM | REGISTERED | `/evidence/mcp-004-github.md` |
| MCP-005 | brave-search | built-in | `https://api.search.brave.com` | REST/HTTP | HTTPS | Web Search – Internetsuche, News, Zusammenfassungen | yes | MEDIUM | REGISTERED | `/evidence/mcp-005-brave.md` |
| MCP-006 | NeXify Capability MCP | custom | `mcp://nexify/capability/` | capability-registry | stdio/gRPC | Tool/Workflow-Registry – Capability-Erkennung, Permission-Prüfung, Workflow-Dispatch | yes | HIGH | DRAFT | `/evidence/mcp-006-capability.md` |
| MCP-007 | Oracle MCP | planned | `mcp://nexify/oracle/` | question-dispatch | gRPC | Question/Knowledge/Dispatch – Intent-Klassifikation, Wissensabfrage, Agent-Dispatch | yes | HIGH | PLANNED | `/evidence/mcp-007-oracle.md` |
| MCP-008 | Secret Management MCP | planned | `mcp://nexify/secret/` | secret-store | gRPC/HSM | Secret Rotation/Access – Credential-Lifecycle, Vault-Integration, Audit-Logging | yes | CRITICAL | PLANNED | `/evidence/mcp-008-secret.md` |

### Legende

| Feld | Beschreibung |
|------|-------------|
| `mcp_id` | Eindeutige ID des MCP im NeXify-Register |
| `source_type` | Herkunft: local Python MCP, remote/API MCP, built-in, custom, planned |
| `protocol` | Kommunikationsprotokoll für den Datenaustausch |
| `transport` | Netzwerk- oder Interprozess-Transport-Layer |
| `auth_required` | Authentifizierung erforderlich (yes/no) |
| `risk_level` | Risikoeinstufung nach NeXify Risk Model (LOW / MEDIUM / HIGH / CRITICAL) |
| `status` | Reifegrad: DRAFT / REGISTERED / PLANNED / DEPRECATED |
| `evidence_ref` | Pfad zum Architektur-/Nachweisdokument |

---

## Sektion 2: Capability-Kategorien

| category_id | name | description | risk_level | approval_required |
|-------------|------|-------------|------------|-------------------|
| CAT-01 | Dateisystem-Operationen | Lesen und Schreiben von Dateien und Verzeichnissen | MEDIUM | false |
| CAT-02 | Netzwerk/API | Externe API-Aufrufe und Netzwerkkommunikation | HIGH | true |
| CAT-03 | Secret/Key-Management | Verwaltung und Zugriff auf Credentials, Schlüssel und Secrets | CRITICAL | true |
| CAT-04 | Modell-Inferenz | LLM-Aufrufe über 9Router – Prompt-Execution und Response-Generierung | MEDIUM | false |
| CAT-05 | Code-Ausführung | Shell-Befehle, Script-Execution und Code-Evaluation | HIGH | true |
| CAT-06 | Datenbank | Datenbank-Operationen: Read, Write, Migrationen | HIGH | true |
| CAT-07 | Kommunikation | Versand von Nachrichten via E-Mail, Simplex, Messenger | MEDIUM | true |
| CAT-08 | Deployment | DNS-Änderungen, Cloud-Infrastruktur, Deployment-Pipelines | CRITICAL | true |
| CAT-09 | Memory/State | Agent-Speicher und Zustandsverwaltung (Brain/Context) | MEDIUM | false |
| CAT-10 | Recherche | Websuche und Research via Brave Search u.ä. | MEDIUM | false |

### Bewertungsmatrix

| Risk Level | Beschreibung | Beispiele | Approval |
|------------|-------------|-----------|----------|
| LOW | Keine messbaren Auswirkungen | Read-only File-Ops | Kein Gate |
| MEDIUM | Begrenzte Auswirkungen, kontrollierbar | Suche, Speicher | Approval nur bei WRITE/EXECUTE |
| HIGH | Signifikante Auswirkungen bei Fehlern | API-Aufrufe, Code-Execution | Immer Approval Gate |
| CRITICAL | Potentiell systemgefährdend | Secrets, Deployment | Multi-Stage Gate + Audit |

---

## Sektion 3: Permission Categories

| perm_id | name | beschreibung | gate_type | audit_required | break_glass |
|---------|------|-------------|-----------|----------------|-------------|
| PERM-READ | Lesender Zugriff | Zugriff auf Ressourcen im Read-Only-Modus | kein Gate | nein | nein |
| PERM-WRITE | Schreibender Zugriff | Erstellen und Ändern von Ressourcen | Code Review | nein | nein |
| PERM-EXECUTE | Ausführung | Ausführen von Operationen, Scripts oder Workflows | Approval Gate | nein | nein |
| PERM-CONFIGURE | Konfigurationsänderung | Änderung von System- und Agent-Konfigurationen | Multi-Stage Gate | ja | nein |
| PERM-DELETE | Löschung | Entfernen von Ressourcen, Dateien oder Konfigurationen | Multi-Stage Gate + Backup | ja | nein |
| PERM-SECRET | Secret-Zugriff | Zugriff auf Secrets, Keys und Credentials | Break Glass + Audit | ja | ja |

### Permission-Hierarchie

```
PERM-READ       ──►  kein Gate
    │
    ▼
PERM-WRITE      ──►  Code Review
    │
    ▼
PERM-EXECUTE    ──►  Approval Gate
    │
    ▼
PERM-CONFIGURE  ──►  Multi-Stage Gate + Audit
    │
    ▼
PERM-DELETE     ──►  Multi-Stage Gate + Backup + Audit
    │
    ▼
PERM-SECRET     ──►  Break Glass + Audit (höchste Stufe)
```

### Gate-Typen

| Gate-Typ | Beschreibung | Dauer |
|----------|-------------|-------|
| Kein Gate | Keine Einschränkung – sofortige Ausführung | instant |
| Code Review | Peer-Review durch zweiten Entwickler | < 4h |
| Approval Gate | Formale Freigabe durch Architect/Security | < 24h |
| Multi-Stage Gate | Mehrstufige Freigabe (Architect → Security → Lead) | < 72h |
| Break Glass + Audit | Notfall-Zugriff mit vollständiger Audit-Trail-Pflicht | < 1h (Notfall) |

---

## Anhang: Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| V1-DRAFT | 2026-06-11 | NeXify Architecture Team | Initiales Register – alle 8 MCPs, 10 Capability-Kategorien, 6 Permission-Levels |

---

*Ende des Dokuments. Dieses Register ist ein lebendes Dokument und wird mit jeder neuen MCP-Quelle oder Capability-Kategorie aktualisiert.*
