#!/bin/bash
# FILE: infra/github-runner/entrypoint.sh
# NIR: 26.07.2026 13:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Entrypoint für GitHub Actions Self-Hosted Runner im Docker-Container
# WHY: Registriert den Runner beim Start auto­matisch am Repository, startet den
#      Listener-Loop und de-registriert ihn sauber beim SIGTERM/SIGINT (Container-Stop).
# BEST-PRACTICE: Runner-Token per API live holen (nicht statisch), --ephemeral Flag
#                verhindert, dass Job-Artefakte zwischen Runs akkumulieren.
# PITFALL: V-01: GITHUB_RUNNER_TOKEN ist nur 1h gültig — niemals in Secrets fest hinterlegen.
#          V-02: RUNNER_ALLOW_RUNASROOT=1 ist nötig, weil der Container als root läuft.
# DEPENDS: GITHUB_REPO, GITHUB_RUNNER_TOKEN (oder GITHUB_PAT für API-Abruf),
#          RUNNER_NAME, RUNNER_LABELS, RUNNER_WORKDIR
# DOCS-REF: docs/architecture/GITHUB-RUNNER-VPS.md
set -euo pipefail

REPO="${GITHUB_REPO:-nexifyai-dev/nexify-agentur-plattform}"
RUNNER_NAME="${RUNNER_NAME:-nexifyai-vps-runner-$(hostname)}"
RUNNER_LABELS="${RUNNER_LABELS:-self-hosted,vps,nexifyai,linux,x64}"
RUNNER_WORKDIR="${RUNNER_WORKDIR:-/home/runner/actions-runner/_work}"
RUNNER_DIR="/home/runner/actions-runner"

# ── Token beschaffen ─────────────────────────────────────────────────────────
# Priorität: GITHUB_RUNNER_TOKEN (direkt) > GITHUB_PAT (API-Abruf)
get_token() {
  if [ -n "${GITHUB_RUNNER_TOKEN:-}" ]; then
    echo "$GITHUB_RUNNER_TOKEN"
    return
  fi

  if [ -n "${GITHUB_PAT:-}" ]; then
    echo "🔑 Hole Runner-Token via GitHub API..." >&2
    local resp
    resp=$(curl -sS -X POST \
      -H "Authorization: token ${GITHUB_PAT}" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/${REPO}/actions/runners/registration-token")
    local tok
    tok=$(echo "$resp" | jq -r '.token // empty')
    if [ -z "$tok" ]; then
      echo "❌ Token-Abruf fehlgeschlagen: $resp" >&2
      exit 1
    fi
    echo "$tok"
    return
  fi

  echo "❌ Weder GITHUB_RUNNER_TOKEN noch GITHUB_PAT gesetzt." >&2
  exit 1
}

# ── Runner registrieren ───────────────────────────────────────────────────────
register_runner() {
  local token
  token=$(get_token)

  echo "📋 Registriere Runner '${RUNNER_NAME}' für ${REPO}..."
  cd "$RUNNER_DIR"

  ./config.sh \
    --url "https://github.com/${REPO}" \
    --token "$token" \
    --name "$RUNNER_NAME" \
    --labels "$RUNNER_LABELS" \
    --work "$RUNNER_WORKDIR" \
    --unattended \
    --replace   # überschreibt gleichnamigen Runner ohne Fehler
}

# ── Runner de-registrieren (sauberer Shutdown) ────────────────────────────────
deregister_runner() {
  echo "🛑 SIGTERM — de-registriere Runner..." >&2
  cd "$RUNNER_DIR"

  local token
  token=$(get_token) 2>/dev/null || true

  if [ -n "${token:-}" ]; then
    ./config.sh remove --token "$token" 2>/dev/null || true
  fi
  echo "✅ Runner de-registriert." >&2
  exit 0
}

trap deregister_runner SIGTERM SIGINT

# ── Hauptschleife ────────────────────────────────────────────────────────────
register_runner
echo "🚀 Runner '${RUNNER_NAME}' gestartet — Labels: ${RUNNER_LABELS}"

cd "$RUNNER_DIR"
# run.sh blockiert und wartet auf Jobs; bei SIGTERM (Container-Stop) → trap
./run.sh &
RUNNER_PID=$!

# Warten, damit trap auslösen kann
wait $RUNNER_PID
