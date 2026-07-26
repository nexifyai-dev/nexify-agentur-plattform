#!/usr/bin/env bash
# PRE-TASK CHECKLIST AUTOMATION
# ==============================
# Automatisierte Pre-Task Compliance-Prüfung (6 Gates)
# Basiert auf: SOUL.md 3-Phase Model (Pre-Task), DOS GATES, PASCAL-ARBEITSWEISE
#
# Usage: bash /workspace/nexify/03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh
# Exit:   0 = ALLE 6 Gates grün
#         1 = Gate-Fail(s) — siehe Output
#
# Letztes Audit: 2026-06-20
# Owner: network-engineer

GATES_PASSED=0
GATES_FAILED=0
GATES_SKIPPED=0
REPORT_FILE="/workspace/nexify/10_evidence/pre_task/PRE_TASK_AUDIT_$(date +%Y-%m-%d).md"

echo "╔══════════════════════════════════════════════════╗"
echo "║     PRE-TASK COMPLIANCE — 6 GATES CHECK         ║"
echo "║     $(date '+%Y-%m-%d %H:%M:%S UTC')              ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

mkdir -p "$(dirname "$REPORT_FILE")"
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
    local gate_cmd="$3"
    local gate_fix="$4"

    echo -n "  [GATE $gate_num] $gate_name ... "

    if eval "$gate_cmd" 2>/dev/null; then
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

# ─── GATE 01: Aufgabenverständnis ───
# Prüft: CLAUDE.md existiert und ist lesbar
gate_check "01" "Aufgabenverständnis (CLAUDE.md)" \
    "test -r /workspace/CLAUDE.md || test -r /workspace/nexify/CLAUDE.md || test -r /workspace/nexifyai/CLAUDE.md" \
    "CLAUDE.md fehlt — Projektkontext nicht dokumentiert"

# ─── GATE 02: Zieldefinition ───
# Prüft: MASTER_PLAN.md existiert
gate_check "02" "Zieldefinition (MASTER_PLAN.md)" \
    "test -r /workspace/MASTER_PLAN.md" \
    "MASTER_PLAN.md fehlt — strategisches Ziel nicht definiert"

# ─── GATE 03: Kontext-Prüfung (Brain Query) ───
# Prüft: Brain API antwortet
gate_check "03" "Kontext-Prüfung (Brain API erreichbar)" \
    "curl -sf http://127.0.0.1:9090/health > /dev/null 2>&1 || curl -sf https://brain.nexifyai.cloud/health > /dev/null 2>&1" \
    "Brain API nicht erreichbar — Kontextabfrage blockiert"

# ─── GATE 04: Umgebungserkennung ───
# Prüft: Grundlegende System-Commands funktionieren
gate_check "04" "Umgebungserkennung (System-Befehle)" \
    "which python3 > /dev/null 2>&1 && which curl > /dev/null 2>&1 && which git > /dev/null 2>&1" \
    "Fehlende Basis-Commands — environment-reconnaissance unvollständig"

# ─── GATE 05: Skills + Memory ───
SKILLS_DIR="/home/hermeswebui/.hermes/skills"
# Prüft: Skill-Index existiert (mindestens ein Skill geladen)
gate_check "05" "Skills + Memory verfügbar" \
    "ls \"$SKILLS_DIR\" 2>/dev/null | head -5 | wc -l | grep -q '[1-9]'" \
    "Skills nicht verfügbar — Skill-First-Regel verletzt"

# ─── GATE 06: Tenant-Trennung ───
# Prüft: Customer-Dirs sauber getrennt (existieren und haben Inhalt)
gate_check "06" "Tenant-Trennung (Customer-Isolation)" \
    "test -d /workspace/customers/ && ls /workspace/customers/ 2>/dev/null | grep -q ." \
    "Customer-Isolation fehlt — R09 verletzt"

# ─── GATE 07: FlowSearch / Knowledge Nutzungspflicht (Vollintegration) ───
# Prüft: Knowledge Register + Operator Register + flowsearch package vorhanden
REPO_ROOT="/workspace"
if [ ! -d "$REPO_ROOT/docs/governance" ] && [ -d "$(pwd)/docs/governance" ]; then
  REPO_ROOT="$(pwd)"
fi
gate_check "07" "FLOWSEARCH_KNOWLEDGE (Nutzungspflicht)" \
    "test -r \"$REPO_ROOT/docs/governance/12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md\" \
      && test -r \"$REPO_ROOT/docs/research/operators/NEXIFY_OPERATOR_REGISTER_V1.json\" \
      && test -r \"$REPO_ROOT/docs/research/AFLOW_ADAS_NEXIFY_SYNTHESIS.md\" \
      && test -d \"$REPO_ROOT/backend/flowsearch\" \
      && test -r \"$REPO_ROOT/docs/governance/02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md\" \
      && python3 \"$REPO_ROOT/scripts/check_knowledge_mandate.py\" >/dev/null 2>&1" \
    "FlowSearch/Knowledge nicht vollintegriert — SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1"

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
