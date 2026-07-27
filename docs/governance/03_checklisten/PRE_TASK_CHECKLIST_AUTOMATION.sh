#!/usr/bin/env bash
# FILE: /docs/governance/03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh
# NIR: 20.06.2026
# UPDATED: 27.07.2026 12:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Prüft die sieben verbindlichen Pre-Task-Gates portabel.
# WHY: Dieselben Gates müssen im VPS-Workspace und in eigenständigen Clones funktionieren.
# BEST-PRACTICE: Pfade aus dem Skriptstandort ableiten und Runtime-Pfade nur als Overrides nutzen.
# PITFALL: V-GATE-01: Keine fest verdrahteten /workspace- oder Benutzerpfade.
# DEPENDS: curl, git, python3, AgentMemory, Governance-Register
# DOCS-REF: docs/governance/02_sops/SOP_PRE_TASK_COMPLIANCE_V1.md
# SESSION: copilot-cli-6ad64251

set -u

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd -- "$SCRIPT_DIR/../../.." && pwd)}"
MASTER_PLAN_PATH="${MASTER_PLAN_PATH:-$REPO_ROOT/docs/governance/05_masterplan/MASTER_PLAN.md}"
SHARED_STATE_PATH="${SHARED_STATE_PATH:-$REPO_ROOT/docs/governance/12_register/SHARED_AGENT_STATE.json}"
ISOLATION_POLICY_PATH="${ISOLATION_POLICY_PATH:-$REPO_ROOT/docs/governance/06_sicherheit_policies/CUSTOMER_PROJECT_ISOLATION_POLICY.md}"
CUSTOMERS_ROOT="${CUSTOMERS_ROOT:-/workspace/customers}"

if [[ -d /workspace/nexify/10_evidence/pre_task ]]; then
    DEFAULT_REPORT_DIR=/workspace/nexify/10_evidence/pre_task
else
    DEFAULT_REPORT_DIR="${TMPDIR:-/tmp}/nexify-pre-task-evidence"
fi
REPORT_DIR="${PRE_TASK_REPORT_DIR:-$DEFAULT_REPORT_DIR}"
REPORT_FILE="$REPORT_DIR/PRE_TASK_AUDIT_$(date +%F).md"

GATES_PASSED=0
GATES_FAILED=0
GATES_SKIPPED=0
echo "╔══════════════════════════════════════════════════╗"
echo "║     PRE-TASK COMPLIANCE — 7 GATES CHECK         ║"
echo "║     $(date '+%Y-%m-%d %H:%M:%S UTC')              ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

mkdir -p "$REPORT_DIR"
echo "# Pre-Task Audit Report" > "$REPORT_FILE"
echo "**Datum:** $(date '+%Y-%m-%d %H:%M:%S UTC')" >> "$REPORT_FILE"
echo "**Exit:** \$? (wird am Ende gesetzt)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## Gate-Ergebnisse" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Gate | Status | Details |" >> "$REPORT_FILE"
echo "|------|--------|---------|" >> "$REPORT_FILE"

gate_check() {
    local gate_num="$1"
    local gate_name="$2"
    local gate_fix="$3"
    shift 3

    echo -n "  [GATE $gate_num] $gate_name ... "

    if "$@" 2>/dev/null; then
        echo "✅ PASS"
        GATES_PASSED=$((GATES_PASSED + 1))
        echo "| G$gate_num | ✅ PASS | $gate_name |" >> "$REPORT_FILE"
    else
        echo "❌ FAIL"
        echo "     Fix: $gate_fix"
        GATES_FAILED=$((GATES_FAILED + 1))
        echo "| G$gate_num | ❌ FAIL | $gate_name — Fix: $gate_fix |" >> "$REPORT_FILE"
    fi
}

gate_brain_context() {
    local url
    local urls="${BRAIN_HEALTH_URLS:-http://127.0.0.1:3113/health https://agentmemory.nexifyai.cloud/health}"

    test -r "$SHARED_STATE_PATH" || return 1
    for url in $urls; do
        if curl -fsS --max-time 5 "$url" >/dev/null; then
            return 0
        fi
    done
    return 1
}

gate_skills() {
    local candidate

    if [[ -n "${SKILLS_DIR:-}" ]]; then
        find "$SKILLS_DIR" -mindepth 1 -maxdepth 2 -name SKILL.md -print -quit | grep -q .
        return
    fi

    for candidate in "$HOME/.agents/skills" "$HOME/.hermes/skills" /home/hermeswebui/.hermes/skills; do
        if [[ -d "$candidate" ]] && find "$candidate" -mindepth 1 -maxdepth 2 -name SKILL.md -print -quit | grep -q .; then
            return 0
        fi
    done
    return 1
}

gate_tenant_isolation() {
    test -r "$ISOLATION_POLICY_PATH" || return 1

    if find "$REPO_ROOT" -mindepth 1 -maxdepth 4 -type d -path '*/customers/*' -print -quit | grep -q .; then
        return 1
    fi

    if [[ -d "$CUSTOMERS_ROOT" ]]; then
        find "$CUSTOMERS_ROOT" -mindepth 1 -maxdepth 1 -type d -print -quit | grep -q .
        return
    fi

    return 0
}

gate_check "01" "Aufgabenverständnis (CLAUDE.md)" \
    "CLAUDE.md fehlt — Projektkontext nicht dokumentiert" \
    test -r "$REPO_ROOT/CLAUDE.md"

gate_check "02" "Zieldefinition (MASTER_PLAN.md)" \
    "MASTER_PLAN.md fehlt — strategisches Ziel nicht definiert" \
    test -r "$MASTER_PLAN_PATH"

gate_check "03" "Kontext-Prüfung (Brain API erreichbar)" \
    "AgentMemory oder Shared Agent State nicht erreichbar" \
    gate_brain_context

gate_check "04" "Umgebungserkennung (System-Befehle)" \
    "Fehlende Basis-Commands — environment-reconnaissance unvollständig" \
    bash -c 'command -v python3 >/dev/null && command -v curl >/dev/null && command -v git >/dev/null'

gate_check "05" "Skills + Memory verfügbar" \
    "Kein Skill-Verzeichnis mit SKILL.md gefunden" \
    gate_skills

gate_check "06" "Tenant-Trennung (Customer-Isolation)" \
    "Isolation-Policy fehlt oder Kundeninhalt liegt im Kern-Repository" \
    gate_tenant_isolation

gate_check "07" "FLOWSEARCH_KNOWLEDGE (Nutzungspflicht)" \
    "FlowSearch/Knowledge nicht vollintegriert — SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1" \
    python3 "$REPO_ROOT/scripts/check_knowledge_mandate.py"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  Ergebnis: $GATES_PASSED passed, $GATES_FAILED failed, $GATES_SKIPPED skipped  ║"
echo "╚══════════════════════════════════════════════════╝"

echo "" >> "$REPORT_FILE"
echo "## Zusammenfassung" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- ✅ Bestanden: $GATES_PASSED" >> "$REPORT_FILE"
echo "- ❌ Fehlgeschlagen: $GATES_FAILED" >> "$REPORT_FILE"
echo "- ⏭️  Übersprungen: $GATES_SKIPPED" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "*Report auto-generated by PRE_TASK_CHECKLIST_AUTOMATION.sh*" >> "$REPORT_FILE"

exit $GATES_FAILED
