#!/bin/bash
# NeXify AI — Hermes-Agent: GitHub-Workflow-Einrichtung (Audit + Apply)
#
# Ausführen AUF DEM VPS:
#   bash infra/scripts/hermes-github-setup.sh            # Audit (read-only)
#   bash infra/scripts/hermes-github-setup.sh --apply    # einrichten + E2E-Beweis
#
# Richtet den Hermes-Agent so ein, dass er nach demselben Arbeitsprotokoll
# arbeitet wie die Claude-Code-Sessions dieses Repos (siehe
# docs/architecture/HERMES-GITHUB-WORKFLOW.md):
#   Branch → lokal verifizieren → Push → PR mit Beweis-Body → Checks abwarten
#   → Merge → Live-Verifikation. Beweispflicht statt Behauptung.
#
# Voraussetzung (MANUELL, einmalig — niemals ins Repo committen!):
#   Fine-grained GitHub-PAT mit Contents:RW + Pull requests:RW, beschränkt auf
#   nexifyai-dev/nexify-agentur-plattform, als GITHUB_TOKEN=<token> in
#   /etc/nexifyai/secrets.env hinterlegen (chmod 600).
set -uo pipefail

APPLY=0; [ "${1:-}" = "--apply" ] && APPLY=1
TS=$(date +%Y%m%d-%H%M%S)
REPORT_DIR=/root/nexifyai-reports
REPORT="$REPORT_DIR/hermes-github-setup-$TS.md"
BACKUP_DIR=/root/config-backups/$TS-hermes-github
SECRETS=/etc/nexifyai/secrets.env
REPO_DIR=/opt/nexifyai-cloud
PROTOCOL_MARKER="## GITHUB-PROTOKOLL"
mkdir -p "$REPORT_DIR"

PASS=0; FAIL=0; FIXED=0
say()  { echo -e "$*" | tee -a "$REPORT"; }
ok()   { PASS=$((PASS+1)); say "✅ $*"; }
bad()  { FAIL=$((FAIL+1)); say "❌ $*"; }
fixed(){ FIXED=$((FIXED+1)); say "🔧 $*"; }
backup(){ mkdir -p "$BACKUP_DIR"; cp -a "$1" "$BACKUP_DIR/" 2>/dev/null; }

say "# Hermes GitHub-Workflow-Setup — $TS (apply=$APPLY)"

# ── Phase 0: Voraussetzungen ────────────────────────────────────────────────
say ""
say "## Phase 0 — Voraussetzungen"

if [ -f "$SECRETS" ] && grep -q "^GITHUB_TOKEN=" "$SECRETS"; then
  PERM=$(stat -c %a "$SECRETS")
  [ "$PERM" = "600" ] && ok "GITHUB_TOKEN in $SECRETS (Rechte 600)" \
    || { bad "$SECRETS hat Rechte $PERM (soll 600)"; [ $APPLY = 1 ] && chmod 600 "$SECRETS" && fixed "chmod 600 $SECRETS"; }
else
  bad "GITHUB_TOKEN fehlt in $SECRETS — manuell hinterlegen (fine-grained PAT, siehe Skript-Kopf). OHNE Token kein Push/Merge."
fi

if command -v gh >/dev/null; then
  ok "gh CLI installiert ($(gh --version | head -1))"
else
  bad "gh CLI fehlt"
  if [ $APPLY = 1 ]; then
    (type -p wget >/dev/null || apt-get install -y wget >/dev/null) \
      && mkdir -p -m 755 /etc/apt/keyrings \
      && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg > /etc/apt/keyrings/githubcli-archive-keyring.gpg \
      && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
      && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
      && apt-get update -qq && apt-get install -y gh >/dev/null \
      && fixed "gh CLI installiert" || bad "gh-Installation fehlgeschlagen"
  fi
fi

# ── Phase 1: Git-Identität + Auth ───────────────────────────────────────────
say ""
say "## Phase 1 — Git-Identität & Auth (Bot-Identität, Token nie im Repo)"

if git config --global user.email | grep -q "hermes@nexifyai.cloud"; then
  ok "git-Identität gesetzt"
else
  bad "git-Identität fehlt/abweichend"
  if [ $APPLY = 1 ]; then
    git config --global user.name  "Hermes Agent (NeXify)"
    git config --global user.email "hermes@nexifyai.cloud"
    fixed "git user.name/user.email gesetzt"
  fi
fi

if [ $APPLY = 1 ] && grep -q "^GITHUB_TOKEN=" "$SECRETS" 2>/dev/null; then
  # gh nutzt GH_TOKEN aus der Umgebung; systemweit für Hermes-Gateway bereitstellen
  DROPIN=/etc/systemd/system/hermes-gateway.service.d/github-token.conf
  if [ ! -f "$DROPIN" ]; then
    mkdir -p "$(dirname "$DROPIN")"
    printf '[Service]\nEnvironmentFile=%s\nEnvironment="GH_TOKEN=${GITHUB_TOKEN}"\n' "$SECRETS" > "$DROPIN"
    systemctl daemon-reload && systemctl restart hermes-gateway.service
    fixed "hermes-gateway: EnvironmentFile-Dropin für GITHUB_TOKEN/GH_TOKEN + Restart"
  else
    ok "hermes-gateway Token-Dropin vorhanden"
  fi
  # git-Credential-Helper: Token aus Secrets-Datei, nie im Klartext in .gitconfig
  git config --global credential."https://github.com".helper \
    '!f() { echo username=x-access-token; echo "password=$(grep ^GITHUB_TOKEN= /etc/nexifyai/secrets.env | cut -d= -f2-)"; }; f'
  fixed "git credential helper liest Token zur Laufzeit aus $SECRETS"
  GH_TOKEN=$(grep ^GITHUB_TOKEN= "$SECRETS" | cut -d= -f2-) gh auth status >/dev/null 2>&1 \
    && ok "gh auth status OK" || bad "gh auth status fehlgeschlagen (Token-Scopes prüfen)"
fi

[ -d "$REPO_DIR/.git" ] && ok "Repo-Checkout $REPO_DIR vorhanden" \
  || { bad "$REPO_DIR fehlt"; [ $APPLY = 1 ] && git clone https://github.com/nexifyai-dev/nexify-agentur-plattform "$REPO_DIR" && fixed "Repo geklont"; }

# ── Phase 2: GITHUB-PROTOKOLL in alle Hermes-SOULs ──────────────────────────
say ""
say "## Phase 2 — GITHUB-PROTOKOLL in Hermes-SOULs (wie MEMORY-PROTOKOLL)"

read -r -d '' PROTOCOL <<'EOF' || true

## GITHUB-PROTOKOLL (Pflicht für jede Code-/Config-Änderung am Monorepo)

Arbeite exakt nach diesem Ablauf — kein Schritt darf übersprungen werden:

1. **Branch**: Nie direkt auf `main` arbeiten. `git fetch origin main &&
   git checkout -B hermes/<kurzbeschreibung> origin/main`.
2. **Verifizieren VOR jedem Push** (Beweispflicht): Für die Website
   `cd apps/website && yarn install --frozen-lockfile && yarn build`, dann den
   Standalone-Server starten und betroffene Routen mit curl prüfen (Statuscode
   UND Inhalt). Für Skripte `bash -n`, für YAML einen Parser. Was nicht
   verifiziert wurde, gilt als nicht funktionierend.
3. **Commit**: Aussagekräftig — WAS kaputt war, WARUM, WIE gefixt, WOMIT
   bewiesen. Niemals Secrets committen (gitleaks-Gate bricht den Push ab).
4. **Push**: `git push -u origin <branch>`. Bei Netzfehlern bis 4× mit
   2s/4s/8s/16s Backoff wiederholen.
5. **PR**: `gh pr create` mit Body-Struktur Problem → Fix → Verifikation
   (mit echten Messwerten/Statuscodes) → offene Punkte.
6. **Checks abwarten**: `gh pr checks <nr> --watch`. Erst mergen, wenn der VPS-Deploy (deploy-vps.yml) grün ist und der Secret-Scan grün ist. Bei Rot: selbst diagnostizieren, fixen,
   erneut pushen — nicht liegen lassen.
7. **Merge**: `gh pr merge <nr> --merge`. Danach Live-Verifikation (Website:
   Production-Deployment-Status + Stichproben-curl; VPS-Dienste:
   infra/scripts/health-check.sh) und Ergebnis ins agentmemory schreiben
   (MEMORY-PROTOKOLL).
8. **Fehlschlag ist ein Ergebnis**: Wenn etwas nicht klappt, den Befund mit
   Log-Auszug dokumentieren (agentmemory + Report) — niemals stiller Abbruch.

**Pflichtlektüre vor der ersten Aufgabe** (im Repo unter `docs/architecture/`):
`HERMES-ONBOARDING-LEARN-FROM-CLAUDE.md` (die Arbeitsmethode mit echten
Beispielen) und `HERMES-TASK-QUEUE.md` (die offenen Aufgaben mit exakten
Schritten, Definition of Done und Risiko-Leitplanke). Arbeite die Queue in
Prioritätsreihenfolge ab; T6 (History-Purge) bleibt gesperrt bis zur Freigabe.
EOF

for SOUL in /root/.hermes/profiles/*/SOUL.md; do
  [ -f "$SOUL" ] || continue
  if grep -q "$PROTOCOL_MARKER" "$SOUL"; then
    ok "$(dirname "$SOUL" | xargs basename): GITHUB-PROTOKOLL vorhanden"
  else
    bad "$(dirname "$SOUL" | xargs basename): GITHUB-PROTOKOLL fehlt"
    if [ $APPLY = 1 ]; then
      backup "$SOUL"; printf '%s\n' "$PROTOCOL" >> "$SOUL"
      fixed "$(dirname "$SOUL" | xargs basename): Protokoll angehängt"
    fi
  fi
done

# ── Phase 3: E2E-Beweis (nur --apply): Branch→Commit→Push→PR→Close ─────────
say ""
say "## Phase 3 — E2E-Beweis (Roundtrip mit Wegwerf-Branch)"
if [ $APPLY = 1 ] && grep -q "^GITHUB_TOKEN=" "$SECRETS" 2>/dev/null; then
  export GH_TOKEN=$(grep ^GITHUB_TOKEN= "$SECRETS" | cut -d= -f2-)
  cd "$REPO_DIR" || exit 1
  git fetch origin main >/dev/null 2>&1
  TB="hermes/selftest-$TS"
  git checkout -B "$TB" origin/main >/dev/null 2>&1
  echo "$TS" > .hermes-selftest && git add .hermes-selftest
  git -c user.name="Hermes Agent (NeXify)" -c user.email="hermes@nexifyai.cloud" \
      commit -qm "test: hermes github-workflow selftest $TS (wird sofort geschlossen)"
  if git push -u origin "$TB" >/dev/null 2>&1; then
    ok "Push als Hermes OK"
    PRURL=$(gh pr create --draft --title "SELFTEST hermes-github $TS (bitte ignorieren)" \
            --body "Automatischer Roundtrip-Beweis. Wird sofort geschlossen." 2>/dev/null)
    if [ -n "$PRURL" ]; then
      ok "PR erstellt: $PRURL"
      gh pr close "$PRURL" --delete-branch >/dev/null 2>&1 \
        && ok "PR geschlossen + Branch gelöscht — Roundtrip komplett bewiesen" \
        || bad "PR-Close fehlgeschlagen (manuell aufräumen: $PRURL)"
    else
      bad "PR-Erstellung fehlgeschlagen (Token-Scope Pull requests:RW prüfen)"
    fi
  else
    bad "Push fehlgeschlagen (Token-Scope Contents:RW prüfen)"
  fi
  git checkout main >/dev/null 2>&1; git branch -D "$TB" >/dev/null 2>&1
else
  say "(übersprungen — Audit-Modus oder kein Token.)"
fi

say ""
say "## Ergebnis: $PASS OK · $FAIL offen · $FIXED gefixt — Report: $REPORT"
[ $FAIL = 0 ] && exit 0 || exit 1
