#!/bin/bash
# FILE: infra/scripts/github-runner-setup.sh
# NIR: 26.07.2026 13:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Einmalig-Einrichtungsskript für GitHub Self-Hosted Runner auf dem VPS
# WHY: Vollautomatische Einrichtung + Prüfung aller Voraussetzungen, Secrets und
#      Compose-Integration. Trennt Audit (read-only) von Apply (--apply).
# BEST-PRACTICE: Audit-first-Ansatz wie bei hermes-github-setup.sh; Token niemals
#                in Git commiten — nur in /etc/nexifyai/secrets.env (chmod 600).
# PITFALL: V-01: GITHUB_PAT braucht Scope `repo` (oder fine-grained: Actions:RW).
#          V-02: docker socket muss der runner-Gruppe zugänglich sein (oder root).
# DEPENDS: docker, docker compose v2, curl, jq, /etc/nexifyai/secrets.env
# DOCS-REF: docs/architecture/GITHUB-RUNNER-VPS.md
set -uo pipefail

APPLY=0; [ "${1:-}" = "--apply" ] && APPLY=1

SECRETS=/etc/nexifyai/secrets.env
REPO_DIR=/opt/nexifyai/repos/nexify-agentur-plattform
COMPOSE_FILE="$REPO_DIR/docker-compose.yml"
TS=$(date +%Y%m%d-%H%M%S)
REPORT_DIR=/root/nexifyai-reports
REPORT="$REPORT_DIR/github-runner-setup-$TS.md"

mkdir -p "$REPORT_DIR"

PASS=0; FAIL=0; FIXED=0

say()   { echo -e "$*" | tee -a "$REPORT"; }
ok()    { PASS=$((PASS+1));  say "✅ $*"; }
bad()   { FAIL=$((FAIL+1));  say "❌ $*"; }
fixed() { FIXED=$((FIXED+1)); say "🔧 $*"; }

say "# GitHub Runner VPS Setup — $TS (apply=$APPLY)"
say ""

# ── Phase 0: Voraussetzungen ─────────────────────────────────────────────────
say "## Phase 0 — Voraussetzungen"

# Docker
if command -v docker &>/dev/null; then
  ok "Docker installiert: $(docker --version)"
else
  bad "Docker fehlt — bitte manuell installieren"
fi

# Docker Compose v2
if docker compose version &>/dev/null; then
  ok "docker compose v2 verfügbar"
elif command -v docker-compose &>/dev/null; then
  ok "docker-compose (v1) verfügbar — v2 empfohlen"
else
  bad "docker compose fehlt"
fi

# curl + jq
for tool in curl jq; do
  if command -v "$tool" &>/dev/null; then
    ok "$tool installiert"
  else
    bad "$tool fehlt"
    if [ $APPLY = 1 ]; then
      apt-get install -y "$tool" && fixed "$tool installiert"
    fi
  fi
done

# ── Phase 1: Secrets ─────────────────────────────────────────────────────────
say ""
say "## Phase 1 — Secrets in $SECRETS"

if [ ! -f "$SECRETS" ]; then
  bad "$SECRETS fehlt — anlegen und GITHUB_PAT eintragen"
else
  PERM=$(stat -c %a "$SECRETS")
  [ "$PERM" = "600" ] \
    && ok "$SECRETS vorhanden (Rechte 600)" \
    || { bad "$SECRETS: Rechte $PERM (soll 600)"; [ $APPLY = 1 ] && chmod 600 "$SECRETS" && fixed "chmod 600 $SECRETS"; }

  if grep -q "^GITHUB_PAT=" "$SECRETS"; then
    ok "GITHUB_PAT in $SECRETS gesetzt"
  else
    bad "GITHUB_PAT fehlt in $SECRETS — Fine-grained PAT mit Actions:RW eintragen:
     echo 'GITHUB_PAT=<token>' >> $SECRETS && chmod 600 $SECRETS"
  fi

  if grep -q "^RUNNER_NAME=" "$SECRETS"; then
    ok "RUNNER_NAME in $SECRETS gesetzt"
  else
    say "⚠️  RUNNER_NAME nicht gesetzt — Standard: nexifyai-vps-runner-\$(hostname)"
    if [ $APPLY = 1 ]; then
      HOSTNAME_VAL=$(hostname)
      echo "RUNNER_NAME=nexifyai-vps-runner-${HOSTNAME_VAL}" >> "$SECRETS"
      fixed "RUNNER_NAME=nexifyai-vps-runner-${HOSTNAME_VAL} in $SECRETS"
    fi
  fi
fi

# ── Phase 2: Repo-Verzeichnis ────────────────────────────────────────────────
say ""
say "## Phase 2 — Repo-Verzeichnis $REPO_DIR"

if [ -d "$REPO_DIR/.git" ]; then
  ok "Repo unter $REPO_DIR vorhanden"
  CURRENT_BRANCH=$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")
  ok "Aktueller Branch: $CURRENT_BRANCH"
else
  bad "Repo nicht unter $REPO_DIR — bitte clonen:
   git clone git@github.com:nexifyai-dev/nexify-agentur-plattform.git $REPO_DIR"
fi

# ── Phase 3: Compose-Service ─────────────────────────────────────────────────
say ""
say "## Phase 3 — Docker Compose Service 'github-runner'"

if grep -q "github-runner" "$COMPOSE_FILE" 2>/dev/null; then
  ok "github-runner Service in $COMPOSE_FILE vorhanden"
else
  bad "github-runner Service fehlt in $COMPOSE_FILE — bitte ergänzen (siehe Compose-Datei im Repo)"
fi

# ── Phase 4: Runner-Status ────────────────────────────────────────────────────
say ""
say "## Phase 4 — Runner-Container-Status"

if docker ps --filter name=nexify-github-runner --format '{{.Status}}' 2>/dev/null | grep -q "Up"; then
  ok "nexify-github-runner Container läuft"
else
  say "⚠️  nexify-github-runner läuft nicht"
  if [ $APPLY = 1 ] && [ -f "$COMPOSE_FILE" ]; then
    say "🔧 Starte github-runner via compose..."
    cd "$REPO_DIR"
    docker compose up -d github-runner 2>&1 | tee -a "$REPORT"
    sleep 5
    if docker ps --filter name=nexify-github-runner --format '{{.Status}}' | grep -q "Up"; then
      fixed "nexify-github-runner gestartet"
    else
      bad "Start fehlgeschlagen — Logs:"
      docker logs nexify-github-runner --tail=30 2>&1 | tee -a "$REPORT" || true
    fi
  fi
fi

# ── Phase 5: GitHub API — Runner-Registrierung prüfen ────────────────────────
say ""
say "## Phase 5 — GitHub API Runner-Liste"

if [ -f "$SECRETS" ] && grep -q "^GITHUB_PAT=" "$SECRETS"; then
  PAT=$(grep "^GITHUB_PAT=" "$SECRETS" | cut -d= -f2- | tr -d '"' | head -1)
  RESP=$(curl -sS -H "Authorization: token $PAT" \
    "https://api.github.com/repos/nexifyai-dev/nexify-agentur-plattform/actions/runners" 2>/dev/null || echo '{}')
  COUNT=$(echo "$RESP" | jq '.total_count // 0')
  if [ "$COUNT" -gt 0 ]; then
    ok "GitHub API: $COUNT Runner registriert"
    echo "$RESP" | jq -r '.runners[] | "  - \(.name) [\(.status)] labels: \([.labels[].name] | join(","))"' \
      | tee -a "$REPORT" || true
  else
    say "⚠️  Keine Runner registriert (oder PAT-Fehler)"
    say "   API-Antwort: $(echo "$RESP" | jq -c '.' | head -c 200)"
  fi
else
  say "⚠️  GITHUB_PAT nicht verfügbar — API-Prüfung übersprungen"
fi

# ── Zusammenfassung ───────────────────────────────────────────────────────────
say ""
say "## Ergebnis"
say "| ✅ OK | ❌ Fehler | 🔧 Fixes |"
say "|-------|----------|---------|"
say "| $PASS | $FAIL | $FIXED |"
say ""
say "Report: $REPORT"

if [ $FAIL -gt 0 ]; then
  say ""
  say "⚠️  $FAIL Prüfung(en) fehlgeschlagen — mit --apply beheben oder manuell korrigieren."
  exit 1
fi

say "✅ Alle Prüfungen bestanden."
