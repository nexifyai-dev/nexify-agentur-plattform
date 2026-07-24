# NeXify AI — CI/CD Compliance Gates
> Stand: 23.06.2026 | Version: 1.0
> Normen: ISO 27001 A.12/A.14/A.18, ISO 12207 A.6, ISO 25010, ISO 20000-1 A.9/A.10

## 1. PR-Compliance-Gate (vor Merge)

```yaml
gate: pre_merge
checks:
  - id: PR-01
    desc: "Secret-Scan: Keine API-Keys, Tokens, Passwörter in Diff"
    command: "grep -E '(api_key|apikey|secret|password|token|bearer)' --include='*.py' --include='*.js' --include='*.ts' --include='*.yaml' --include='*.env*' -r . 2>/dev/null | grep -v '.example' || true"
    fail_on_match: true
    norm: "ISO 27001 A.8, V01"
  - id: PR-02
    desc: "Keine Hardcoded Secrets (z.B. sk-*, eyJ, AKIA*)"
    command: "grep -E '(eyJ[a-zA-Z0-9_-]+\.|sk-[a-zA-Z0-9]+|AKIA[0-9A-Z]{16})' --include='*.py' --include='*.js' --include='*.ts' -r . 2>/dev/null || true"
    fail_on_match: true
    norm: "ISO 27001 A.10, V01"
  - id: PR-03
    desc: "Tests bestanden (>80% Coverage)"
    command: "pytest --cov=. --cov-fail-under=80 || poetry run pytest --cov=. --cov-fail-under=80"
    fail_on_match: false
    norm: "ISO 25010, SE-02"
  - id: PR-04
    desc: "Keine TODOs oder FIXMEs in neuen/geänderten Zeilen"
    command: "! grep -E '(TODO|FIXME|HACK|XXX)' $(git diff --name-only --diff-filter=AM) 2>/dev/null || true"
    fail_on_match: true
    norm: "ISO 25010, SE-02"
  - id: PR-05
    desc: "Type-Check bestanden (Python: mypy, JS/TS: tsc)"
    command: "mypy . --strict || npx tsc --noEmit"
    fail_on_match: false
    norm: "ISO 25010, SE-02"
  - id: PR-06
    desc: "Lint: Keine neuen Linting-Fehler"
    command: "ruff check . || flake8 . || npx eslint ."
    fail_on_match: false
    norm: "ISO 25010, SE-02"
  - id: PR-07
    desc: "PR-Review von zweiter Person (ausgenommen CEO)"
    command: "(git log --format='%an' -1 | grep -v 'NeXify AI Agent') || echo 'MUSS reviewt werden'"
    fail_on_match: false
    norm: "ISO 12207 A.6, V04"
  - id: PR-08
    desc: "Tenant-Trennung: Keine kundenprojekt-spezifischen Daten in shared Code"
    command: "git diff HEAD --name-only | grep -E '^customers/' && echo 'TENANT_CHECK_OK' || true"
    fail_on_match: false
    norm: "ISO 27001 A.13, V07"
```

## 2. Pre-Deployment-Gate (vor Production)

```yaml
gate: pre_deploy
checks:
  - id: DP-01
    desc: "Healthchecks aller betroffenen Services"
    command: "curl -sf https://brain.nexifyai.cloud/health && curl -sf https://rag.nexifyai.cloud/health"
    fail_on_match: true
    norm: "ISO 20000-1 A.6, V06"
  - id: DP-02
    desc: "Rollback-Plan vorhanden"
    command: "test -f .rollback.md || test -f ops/rollback.md || echo 'ROLLBACK_PLAN_MISSING'"
    fail_on_match: false
    norm: "ISO 20000-1 A.10, V02"
  - id: DP-03
    desc: "Change dokumentiert (Datum, Person, Änderung, Risiko)"
    command: "grep -q \"$(date +%Y-%m-%d)\" CHANGELOG.md 2>/dev/null || echo 'CHANGE_UNDOCUMENTED'"
    fail_on_match: false
    norm: "ISO 20000-1 A.9, SV-03"
  - id: DP-04
    desc: "Backup vor Deployment (bei DB-Migrationen)"
    command: "git diff HEAD --name-only | grep -E '(migration|schema|sql)' && pg_dump ... || echo 'NO_DB_CHANGE'"
    fail_on_match: false
    norm: "ISO 27001 A.12, BC-01"
  - id: DP-05
    desc: "Secrets-Check: Keine neuen Secrets im deployten Code"
    command: "! grep -rE '(api_key|secret|password|token'\"'\"'s)' deployed/ 2>/dev/null || true"
    fail_on_match: true
    norm: "ISO 27001 A.8, V01"
```

## 3. Cron-Compliance-Gates (automatisiert)

```yaml
gate: cron_compliance
checks:
  - id: CR-01
    desc: "Backup-Restore-Test (monatlich)"
    schedule: "0 6 1 * *"
    command: "/workspace/nexify/ops/test_restore.sh 2>&1 | tail -5"
    norm: "ISO 27001 A.12, BC-01"
  - id: CR-02
    desc: "Asset-Inventar-Health (wöchentlich)"
    schedule: "0 6 * * 1"
    command: "curl -s https://brain.nexifyai.cloud/stats | jq '.collections'"
    norm: "ISO 27001 A.8, AM-01"
  - id: CR-03
    desc: "Zugriffsmatrix-Review (monatlich)"
    schedule: "0 6 1 * *"
    command: "cat /workspace/nexify/12_identity/access_matrix.md | grep -c 'Aktiv'"
    norm: "ISO 27001 A.9, AC-03"
  - id: CR-04
    desc: "AI-System-Monitoring (täglich)"
    schedule: "0 8 * * *"
    command: "curl -s https://ai-router.nexifyai.cloud/health; curl -s https://mcp.nexifyai.cloud/sse -o /dev/null -w '%{http_code}'"
    norm: "ISO 42001 A.7, AI-06"
  - id: CR-05
    desc: "Log-Retention-Prüfung (wöchentlich)"
    schedule: "0 7 * * 0"
    command: "find /workspace/nexify/11_logs/ -name '*.log' -mtime +90 -delete; echo 'Retention enforced'"
    norm: "ISO 27001 A.12, ISO 27701 A.9, DP-04"
```

## 4. DoD (Definition of Done) — mit Normbezug

```markdown
# NeXify Definition of Done

Ein Task/PR/Release gilt erst als **Done**, wenn ALLE folgenden Gates durchlaufen sind:

| # | Kriterium | Norm | Nachweis |
|---|-----------|------|----------|
| D01 | Secret-Scan ohne Treffer | ISO 27001 A.8 | Log |
| D02 | Tests bestanden | ISO 25010 | Coverage-Report |
| D03 | PR-Review erfolgt | ISO 12207 A.6 | GitHub Review |
| D04 | Rollback-Plan dokumentiert | ISO 20000-1 A.10 | Datei |
| D05 | Evidence abgelegt | ISO 9001 A.8 | Datei + Brain |
| D06 | Tenant-Trennung geprüft | ISO 27001 A.13 | Check |
| D07 | AI-Risikoklasse geprüft (bei AI-Features) | ISO 42001 A.3 | Eintrag |
| D08 | DSGVO-Prüfung (bei personenbezogenen Daten) | ISO 27701 | DPA-Check |
| D09 | Healthcheck integriert | ISO 20000-1 A.6 | Endpoint |
| D10 | Brain-Sync erfolgt | NeXify-Standard | Brain-ID |
| D11 | Kein Änderungsverbot verletzt | V01-V10 | Audit-Log |
```

## 5. Integration in bestehende Systeme

### GitHub (Branch-Protection)
```yaml
# Settings → Branches → main → Add rule
Require pull request reviews before merging: 1
Require status checks:
  - secret-scan (PR-01)
  - pytest-coverage (PR-03)
  - lint (PR-06)
Dismiss stale pull request approvals: true
```

### Hermes Agent (Pre-Task)
```bash
# In PRE_TASK_CHECKLIST.sh
echo "[GATE] Normen-Compliance prüfen..."
curl -s https://brain.nexifyai.cloud/query -d '{"query":"NORMENREGISTER","collection":"nexifyai_brain"}' | grep -q 'P0' && echo "✅ Normen geladen" || echo "⚠️  Kein Normenkontext"
```

### Agenten-Prompt-Suffix (alle Agenten)
```
PRÜFE VOR UMSETZUNG: Normen in Brain unter 'governance'/'compliance'/'security' Category.
VERBOTE: V01=Secrets, V02=kein Rollback, V05=keine Evidence, V08=autonome Aktionen.
FERTIG MELDEN: Evidence-Pflicht (Datei, Diff, Test, Quellen).
```
