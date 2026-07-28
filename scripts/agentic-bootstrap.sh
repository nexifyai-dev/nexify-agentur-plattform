#!/usr/bin/env bash
# FILE: /scripts/agentic-bootstrap.sh
# WHAT: Session-Start für Agentic AI Mode — Vorgaben laden, Health, Deviation-Scan.
# WHY: Einheitlicher Einstieg für Cursor Cloud-Agent, Desktop und VPS-SSH.
# BEST-PRACTICE: Decide → Act → Verify → Learn ohne Chat-Gate (Voll-Autonomie).
# DOCS-REF: docs/operations/AGENTIC-AI-MODE.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
NC='\033[0m'

say()  { echo -e "$*"; }
ok()   { say "${GRN}✅${NC} $*"; }
warn() { say "${YLW}⚠️${NC}  $*"; }
bad()  { say "${RED}❌${NC} $*"; }

say "\n# Agentic AI Mode — Bootstrap"
say "Repo: nexifyai-dev/nexify-agentur-plattform"
say "Kategorie: platform | Design-SoT: docs/governance + CHARTA.md\n"

# --- 1. Vorgaben (Force-Load) ---
say "## 1. Vorgaben"
for f in AGENTS.md CHARTA.md agent-config.yaml docs/operations/REPO-SYNC-STRATEGY.md; do
  if [[ -f "$f" ]]; then ok "$f"; else bad "fehlt: $f"; fi
done

# --- 2. MCP lokal (Beispiel → aktiv) ---
say "\n## 2. MCP-Konfiguration"
if [[ ! -f .cursor/mcp.json ]]; then
  if [[ -f .cursor/mcp.json.example ]]; then
    cp .cursor/mcp.json.example .cursor/mcp.json
    warn ".cursor/mcp.json aus Example erzeugt — Secrets ausschließlich per Env bereitstellen"
  else
    bad ".cursor/mcp.json.example fehlt"
  fi
else
  ok ".cursor/mcp.json vorhanden"
fi

if git ls-files --error-unmatch .cursor/mcp.json >/dev/null 2>&1; then
  bad ".cursor/mcp.json ist git-getrackt — git rm --cached .cursor/mcp.json ausführen"
fi

# --- 3. GitHub CLI ---
say "\n## 3. GitHub (Source of Truth)"
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    ok "gh authentifiziert — $(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo 'repo?')"
  else
    warn "gh nicht authentifiziert — GitHub MCP Plugin oder gh auth login"
  fi
else
  warn "gh CLI fehlt"
fi

# --- 4. GitLab OSS ---
say "\n## 4. GitLab OSS (VPS CI/CD)"
# Built-in Cursor GitLab MCP ≠ OSS
warn "Built-in Cursor 'Gitlab' MCP = SaaS/OAuth — für VPS 'gitlab-oss' in .cursor/mcp.json nutzen"
if [[ -x scripts/gitlab-oss-smoke.sh ]]; then
  bash scripts/gitlab-oss-smoke.sh || warn "gitlab-oss-smoke.sh meldete Fehler"
else
  warn "scripts/gitlab-oss-smoke.sh fehlt"
fi
if [[ -x scripts/ensure-gitlab-remote.sh ]]; then
  bash scripts/ensure-gitlab-remote.sh || true
fi

# --- 5. AgentMemory ---
say "\n## 5. AgentMemory (Pflicht-Brain)"
for url in "http://127.0.0.1:3111/agentmemory/livez" "http://127.0.0.1:3113/health"; do
  if curl -sf --max-time 2 "$url" >/dev/null 2>&1; then
    ok "erreichbar: $url"
  else
    warn "nicht erreichbar: $url (VPS/Remote oder Action blocked)"
  fi
done

# --- 6. Deviation-Scan ---
say "\n## 6. SOLL-Deviation-Scan"
if python3 scripts/soll-deviation-scan.py; then
  ok "Deviation-Scan: keine ERROR-Severity"
else
  bad "Deviation-Scan: ERROR(s) — test_reports/soll-deviation-scan.json"
fi

# --- 7. Knowledge mandate (optional gate) ---
say "\n## 7. Knowledge/FlowSearch Mandate"
if python3 scripts/check_knowledge_mandate.py 2>/dev/null; then
  ok "check_knowledge_mandate.py"
else
  warn "check_knowledge_mandate.py fehlgeschlagen oder nicht ausführbar"
fi

say "\n## Nächste Schritte"
say "- Branch: cursor/<task>-7dd5 | Commit: conventional"
say "- PR → GitHub CI → mirror-to-gitlab → GitLab deploy:vps"
say "- Session-Ende: memory_save (AgentMemory) wenn Worker erreichbar"
say "- Cursor-Command: /pr-flow | /mcp-health | /gitlab-oss-mcp\n"
