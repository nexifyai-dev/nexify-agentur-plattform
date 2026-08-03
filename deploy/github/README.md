# FILE: deploy/github/README.md
# NIR: 03.08.2026
# NAME: NeXifyAI Autopilot
# TEAM: NeXifyAI Core
# WHAT: GitHub-Webhook → Hermes-Gateway /webhooks/github-comment
# WHY: Vorgabe v2.0 — alle GitHub-Meldungen (Actions, Issues, PRs, Kommentare) laufen am Gateway auf

# GitHub-Webhook → Hermes Gateway

Alle GitHub-Meldungen (Actions, Issues, PRs, Kommentare, Reviews, alles) werden als
Webhook an den Hermes-Gateway geleitet:

- **Intern:** `http://127.0.0.1:8644/webhooks/github-comment`
- **Öffentlich (Tunnel):** `https://webui.nexifyai.cloud/webhooks/github-comment`
  (siehe `deploy/cloudflare/tunnel-ingress.yml` → `webui.nexifyai.cloud` → `localhost:8644`)
- **Events:** `*` (alle GitHub-Events)

## Einrichtung

```bash
# Voraussetzung: GITHUB_TOKEN mit repo / admin:repo_hook
./deploy/github/install-github-comment-webhook.sh

# Anderes Repo oder andere öffentliche Basis-URL:
./deploy/github/install-github-comment-webhook.sh nexifyai-dev/nexify-agentur-plattform https://webui.nexifyai.cloud
```

Idempotent: läuft der Hook schon, wird nichts doppelt angelegt.

## Verifikation

```bash
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/nexifyai-dev/nexify-agentur-plattform/hooks
# → Hook mit url=https://webui.nexifyai.cloud/webhooks/github-comment, active=true, events=["*"]
```

## Troubleshooting

- **Hook 404/403:** Token braucht `admin:repo_hook` (fine-grained: „Webhooks") oder `repo`.
- **Keine Delivery:** `curl -s -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/nexifyai-dev/nexify-agentur-plattform/hooks/<id>/deliveries`
- **Tunnel down:** Gateway erreichbar? `curl -s http://127.0.0.1:8644/health`
