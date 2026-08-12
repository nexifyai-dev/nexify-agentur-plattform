# CLAUDE.md — Agent Development Guide

## 🔴 KERN-IMPERATIVE (P0 — vor allen anderen Regeln)

### I. SPRACHE: Deutsch. Immer.
### II. SELBSTOPTIMIERUNG: Aus jeder Erkenntnis lernen. Crystal in AgentMemory.
### III. FEHLERVERMEIDUNG: Jeder Fehler = Error-Pattern. Nie wiederholen.

> Diese Regeln gelten für ALLE Agenten die an diesem Repo arbeiten.
> Verstoß → sofort korrigieren. Kein "sorry".

---

**NIR:** 2026-07-24 04:50
**UPDATED:** 2026-08-02 08:16
**PURPOSE:** Instruktionen für AI-Agenten bei Repo-Arbeit
**VERSION:** 1.0

---

## Quickstart für AI-Agenten

### 1. Beim Repo-Start laden

```bash
# Automatisch
skill_view(name='nexifyai-agent-foundation')
read_file(path='/opt/nexifyai/repos/nexify-agentur-plattform/CLAUDE.md')
# Knowledge / FlowSearch Nutzungspflicht (Gate FLOWSEARCH_KNOWLEDGE)
python scripts/check_knowledge_mandate.py
```

**Nutzungspflicht agentische Workflows:**  
`docs/governance/02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md` ·  
`docs/governance/12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md` ·  
OpenReview AFlow `z5uVAKwmjf` (Spiegel: arXiv/GitHub/Synthesis) — **verbindlich**, nicht optional.

### 2. Repo-Kontext

- **Primary Repo:** GitHub (`git@github.com:nexifyai-dev/nexify-agentur-plattform.git`)
- **Mirror:** GitLab (`gitlab.nexifyai.cloud/nexifyai_group/nexifyai`)
- **Sync:** Automatisch via `.github/workflows/mirror-to-gitlab.yml`
- **Branch Pattern:** `main` (stable/default) | `cursor/*-7dd5` / `feature/*` (PR → main) — **kein** aktives `develop`-Staging
- **Governance Primärquelle:** `docs/governance/` (nicht Chat-Charta). Auszug: `docs/governance/CHARTA.md`
- **Pre-Task Gates:** BRAIN_FIRST, DOCS_FIRST, SHARED_STATE, PRE_TASK_CHECKLIST, SECRET_SCAN, TENANT_ISOLATION (+ FLOWSEARCH_KNOWLEDGE bei Workflows)
- **Design verbindlich:** `design_guidelines.json` — Dark/Luxury, Outfit/Manrope, `#0A0A0A`
- **F32 (ungeklärt):** §8 Autonomie vs. Production-Freigabe-Verbot — eskalieren, nicht selbst entscheiden

### 3. Dokumentations-Konvention

**JEDE Datei erhält Header:**

```python
# FILE: /pfad/zur/datei.py
# NIR: DD.MM.YYYY HH:MM
# UPDATED: DD.MM.YYYY HH:MM
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: [Eine Zeile: Was macht diese Datei?]
# WHY: [Warum dieser Ansatz?]
# BEST-PRACTICE: [Optimaler Weg gegenüber Alternativen]
# PITFALL: [V-XX: Bekannte Fehler die vermieden wurden]
# DEPENDS: [Abhängigkeiten: Services, Ports, Env-Vars]
# DOCS-REF: [Link zu offizielle Repo-Doku]
# SESSION: [session-id wenn agentic]
```

### 4. Branches & Commits

**Branch-Namenkonvention:**
```
main              # Default/Production (Merge nur via PR)
cursor/<task>-7dd5 # Cursor-Agent-Branches → Draft-PR → main
feature/*         # Development (PR → main)
bugfix/*          # Hotfix (priority merge)
release/v*        # Release candidates
# develop         # HISTORISCH — nicht mehr Staging-Pfad (CI-Trigger entfernt)
```

**Commit-Nachrichten:**
```
feat(scope): description        # Neue Funktion
fix(scope): description         # Bugfix
docs(scope): description        # Dokumentation
refactor(scope): description    # Umstrukturierung
test(scope): description        # Tests
chore(scope): description       # Keine Code-Änderung
```

**Beispiel:**
```
feat(backend): Add WebSocket support for real-time agents
- Integrates socket.io with FastAPI
- Adds auth middleware for secure connections
- Tested with 100 concurrent clients
Closes #123
```

### 5. Code Review Checklist

Vor JEDEM Commit:

- [ ] Header vollständig (NIR, NAME, TEAM, WHAT, WHY, BEST-PRACTICE, PITFALL, DEPENDS)
- [ ] Inline-Kommentare bei komplexer Logik
- [ ] Tests geschrieben (jest/pytest)
- [ ] Linter bestanden (eslint/black/pylint)
- [ ] Security-Scan OK (GitHub Advanced Security)
- [ ] Secrets NICHT im Code (nur env-vars via `${}`)
- [ ] Dependencies gepinnt (keine `*` in package.json)
- [ ] Documentation aktualisiert (README, docs/)
- [ ] Commit-Nachricht nach Konvention

### 6. Deployment-Workflow

```
1. Branch: cursor/<task>-7dd5 oder feature/xyz (von main)
2. Push + Draft-PR → GitHub
3. GitHub Actions (CI): Tests + Lint + Build
4. GitLab Mirror: mirror-to-gitlab.yml nach Merge/Push
5. Review / Automerges laut Policy wenn CI grün
6. Merge zu main (kein develop-Staging-Pfad)
7. GitLab CI/CD: Build/Test; Deploy laut Policy
```

### 7. Brain Integration

**Vor Arbeitsbeginn:**
```python
# 1. Load project context
memory_recall("nexify-agentur-plattform deployment status")

# 2. Save after completion
memory_save(
    content="Deployed feature XYZ to production. Tested e2e. Zero errors.",
    type="workflow"
)
```

**Schreiben in AgentMemory + LightRAG:**
```python
# Pseudo-code
agentmemory.save(
    entity="deployment-xyz",
    data={"status": "complete", "tests": "passing"},
    review_due="2026-08-01"
)
```

### 8. MCP-Integration

**Verfügbare MCPs (Nutze sie!):**

| MCP | Nutzen |
|-----|--------|
| `github` | Issue/PR-Operationen, Code-Suche |
| `gitlab` | CI/CD-Trigger, Pipeline-Logs, Repository-Ops |
| `lightrag` | Wissensgraph-Queries, Dokumentation-Indexing |
| `agentmemory` | Brain save/recall, Session-Kontext |
| `firecrawl` | Dokumentation-Scraping, Web-Inhalte |
| `supabase` | Datenbank-Queries (wenn nötig) |

**Beispiel:**
```bash
# Before coding
curl -X POST http://127.0.0.1:9621/v1/api/kg_api/query \
  -d '{"query": "platform deployment architecture"}'

# After feature done
curl -X POST http://agentmemory.nexifyai.cloud/api/save \
  -d '{"entity": "feature-xyz", "data": {...}}'
```

### 9. Testing Requirements

**JEDE Änderung braucht Tests:**

- **Frontend:** Jest Snapshots + E2E Playwright
- **Backend:** pytest + coverage >80%
- **Integration:** docker-compose full-stack test
- **Smoke:** curl health-checks

**Run lokal:**
```bash
npm run test                    # Frontend
pytest --cov=app               # Backend
npm run e2e                     # End-to-end
docker-compose up && sleep 10 && npm run smoke-test
```

### 10. Troubleshooting im Repo

**"Merge conflict"**
```bash
git fetch origin
git rebase origin/main
# Fix conflicts in editor
git add .
git rebase --continue
git push -f origin feature/xyz
```

**"Pipeline failed"**
```bash
# Check logs
gitlab-runner logs
cat .gitlab-ci.yml | grep -A 20 "failed_stage"

# Manual run
docker-compose up --build
npm run test
```

**"Secrets exposed"**
```bash
# Revoke
git secret reveal (if using git-secret)
Update GitHub/GitLab secrets immediately
Rotate credentials in /opt/nexifyai/security/keys/
```

---

## Architektur-Übersicht (Agents)

```
┌─────────────────────────────────────────┐
│ Frontend Apps (Next.js, React, Vue)     │
│ vitrine:3000 | konsole:3100 | ...       │
└────────────────┬────────────────────────┘
                 │
┌────────────────v────────────────────────┐
│ Traefik Reverse Proxy (:80, :443)      │
└────────────────┬────────────────────────┘
                 │
┌────────────────v──────────────────────────────┐
│ Backend Services (FastAPI)                    │
│ :3100/api (agents, deployments, webhooks)     │
└────────────────┬───────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
   ┌────v──┐ ┌──v───┐ ┌─v────┐
   │ 9Router│ │Light │ │Agent │
   │:20128  │ │RAG   │ │Memory│
   │        │ │:9621 │ │:3113 │
   └────────┘ └──────┘ └──────┘
```

---

## Aktuelles Status (2026-07-24)

- **Last Sync:** GitHub ↔ GitLab ✅
- **Last Deploy:** main → production ✅
- **CI/CD Status:** All green
- **Documentation:** 95% complete
- **Known Issues:** None blocking

---

**Fragen? Siehe `/docs/` oder `memory_recall("problem statement")`.**


---
## NeXifyAI Integration (28.07.2026 · korrigiert 02.08.2026)
GitLab CI/CD Pipeline aktiv (Mirror von GitHub).
**Dual-Write AgentMemory+LightRAG:** optional via `scripts/brain-dual-write.sh` +
`.githooks/post-commit-dual-write` — **nicht** automatisch überall aktiv (No-op ohne Env /
ohne `core.hooksPath=.githooks`). Ops: `docs/operations/BRAIN-DUAL-WRITE.md`.
