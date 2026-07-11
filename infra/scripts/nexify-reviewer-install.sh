#!/bin/bash
# NeXifyAI — Reviewer-Agent installieren + Review-Gate-Protokoll systemweit ausrollen
#
#   bash infra/scripts/nexify-reviewer-install.sh            # Audit (read-only)
#   bash infra/scripts/nexify-reviewer-install.sh --apply    # installieren + ausrollen
#
# 1. Installiert den 24/7-Reviewer (systemd-Timer alle 5 min).
# 2. Stempelt das REVIEW-GATE-Protokoll in JEDE Agenten-Seele (Hermes-Profile,
#    Paperclip-Fabrik-AGENTS.md) — ab jetzt arbeitet jeder Agent gleich:
#    kein Self-Merge, jeder PR braucht das grüne Urteil des Reviewers.
#
# Voraussetzung (manuell, einmalig): EIGENER Reviewer-Bot-PAT (getrennt vom
# Agenten-Token — Gewaltenteilung!) als REVIEWER_GITHUB_TOKEN und der zugehörige
# Login als NEXIFY_REVIEWER_LOGIN in /etc/nexifyai/secrets.env (chmod 600).
set -uo pipefail

APPLY=0; [ "${1:-}" = "--apply" ] && APPLY=1
TS=$(date +%Y%m%d-%H%M%S)
REPO_DIR=/opt/nexifyai-cloud
SECRETS=/etc/nexifyai/secrets.env
REPORT=/root/nexifyai-reports/reviewer-install-$TS.md
BACKUP=/root/config-backups/$TS-reviewer
MARK="## REVIEW-GATE-PROTOKOLL"
mkdir -p /root/nexifyai-reports
PASS=0; FAIL=0; FIXED=0
say(){ echo -e "$*" | tee -a "$REPORT"; }
ok(){ PASS=$((PASS+1)); say "✅ $*"; }
bad(){ FAIL=$((FAIL+1)); say "❌ $*"; }
fixed(){ FIXED=$((FIXED+1)); say "🔧 $*"; }

say "# Reviewer-Install — $TS (apply=$APPLY)"

# ── Phase 0: Voraussetzungen ────────────────────────────────────────────────
command -v gh >/dev/null && ok "gh CLI vorhanden" || bad "gh CLI fehlt (erst hermes-github-setup.sh laufen lassen)"
command -v python3 >/dev/null && ok "python3 vorhanden" || bad "python3 fehlt"
if grep -q "^REVIEWER_GITHUB_TOKEN=" "$SECRETS" 2>/dev/null; then
  ok "REVIEWER_GITHUB_TOKEN gesetzt"
else
  bad "REVIEWER_GITHUB_TOKEN fehlt in $SECRETS — eigener Bot-PAT nötig (Gewaltenteilung)"
fi
if grep -q "^NEXIFY_REVIEWER_LOGIN=" "$SECRETS" 2>/dev/null; then
  RLOGIN=$(grep ^NEXIFY_REVIEWER_LOGIN= "$SECRETS" | cut -d= -f2-)
  ok "NEXIFY_REVIEWER_LOGIN=$RLOGIN"
  AGENT_LOGIN=$(grep ^NEXIFY_AGENT_LOGIN= "$SECRETS" 2>/dev/null | cut -d= -f2-)
  [ -n "$AGENT_LOGIN" ] && [ "$AGENT_LOGIN" = "$RLOGIN" ] \
    && bad "Reviewer- und Agenten-Login sind IDENTISCH — Gewaltenteilung verletzt, GitHub verbietet Self-Approve" \
    || ok "Reviewer-Login getrennt vom Agenten-Login"
else
  bad "NEXIFY_REVIEWER_LOGIN fehlt in $SECRETS"
fi

# ── Phase 1: systemd-Units installieren ─────────────────────────────────────
say ""; say "## Phase 1 — 24/7-Reviewer (systemd-Timer)"
if [ $APPLY = 1 ]; then
  install -m 644 "$REPO_DIR/infra/reviewer/nexify-pr-reviewer.service" /etc/systemd/system/
  install -m 644 "$REPO_DIR/infra/reviewer/nexify-pr-reviewer.timer"   /etc/systemd/system/
  systemctl daemon-reload
  systemctl enable --now nexify-pr-reviewer.timer
  fixed "Reviewer-Timer installiert + aktiviert (alle 5 min)"
  # Erststart-Beweis (Dry-Run, ändert nichts an PRs)
  NEXIFY_REVIEWER_DRYRUN=1 systemctl start nexify-pr-reviewer.service 2>/dev/null || true
  sleep 3
  systemctl is-active --quiet nexify-pr-reviewer.timer && ok "Timer aktiv" || bad "Timer nicht aktiv"
else
  say "(Audit: Units würden nach /etc/systemd/system/ installiert)"
fi

# ── Phase 2: REVIEW-GATE in ALLE Agenten-Seelen ─────────────────────────────
say ""; say "## Phase 2 — Review-Gate-Protokoll in jede Agenten-Seele"
read -r -d '' PROTO <<'EOF' || true

## REVIEW-GATE-PROTOKOLL (verbindlich für JEDEN Agenten — vollintegrierte Automatisierung)

Ab sofort arbeiten alle Agenten identisch. Kein Agent merged eigenen Code ohne
unabhängiges Review:

1. Änderungen IMMER über einen PR nach dem GITHUB-PROTOKOLL (Branch → verifizieren
   mit Beweis → Push → PR mit Verifikations-Abschnitt). Nie direkt auf `main`.
2. **Self-Merge ist verboten.** Den eigenen PR NICHT selbst mergen — der autonome
   Reviewer (`nexify-pr-reviewer`, eigener Account) entscheidet: APPROVE+Merge bei
   grünen Gates, REQUEST_CHANGES sonst, oder Label `needs-human-review` bei
   Risiko-Pfaden (CI, Secrets, memory/, Dockerfiles/deploy, middleware, next.config,
   History-Rewrites).
3. Bei REQUEST_CHANGES: die genannten Punkte beheben, neuen Commit pushen — der
   Reviewer prüft die neue Head-SHA automatisch erneut.
4. Bei `needs-human-review`: auf menschliche Freigabe warten, nicht umgehen.
5. Jeder PR-Body enthält einen echten Verifikations-Beleg (Statuscode, Test,
   Build-Ergebnis) — sonst lehnt der Reviewer ab (Regel „behauptet ≠ verifiziert").
EOF

STAMP_TARGETS=(
  /root/.hermes/profiles/*/SOUL.md
  /var/lib/docker/volumes/paperclip-data/_data/instances/default/companies/*/agents/*/instructions/AGENTS.md
)
CNT=0; MISS=0
for G in "${STAMP_TARGETS[@]}"; do
  for F in $G; do
    [ -f "$F" ] || continue
    CNT=$((CNT+1))
    if grep -q "$MARK" "$F"; then
      :
    else
      MISS=$((MISS+1))
      if [ $APPLY = 1 ]; then
        mkdir -p "$BACKUP"; cp -a "$F" "$BACKUP/$(echo "$F" | tr / _)" 2>/dev/null
        printf '%s\n' "$PROTO" >> "$F"
        fixed "REVIEW-GATE → $F"
      else
        say "   (würde stempeln) $F"
      fi
    fi
  done
done
[ $MISS -eq 0 ] && ok "REVIEW-GATE bereits in allen $CNT Seelen" \
               || say "→ $MISS von $CNT Seelen $( [ $APPLY = 1 ] && echo 'gestempelt' || echo 'offen')"

# CLI-Agenten-Hinweise (Claude Code / Goose / MimoCode nutzen dieselbe Regel via CLAUDE.md/.goosehints/AGENTS.md)
for HINT in /root/CLAUDE.md /root/.goosehints /root/.config/mimocode/AGENTS.md; do
  [ -f "$HINT" ] || continue
  grep -q "$MARK" "$HINT" && ok "REVIEW-GATE in $HINT" || {
    [ $APPLY = 1 ] && printf '%s\n' "$PROTO" >> "$HINT" && fixed "REVIEW-GATE → $HINT" \
                   || say "   (würde stempeln) $HINT"; }
done

say ""; say "## Ergebnis: $PASS OK · $FAIL offen · $FIXED gefixt — Report: $REPORT"
[ $FAIL -eq 0 ] && exit 0 || exit 1
