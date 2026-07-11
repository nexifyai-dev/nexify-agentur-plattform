# Autonomer Review-Loop — vollintegrierte Vollautomatisierung (Stand 11.07.2026)

Ziel: Die Agenten (Hermes u. a.) produzieren rund um die Uhr Änderungen; ein
**eigenständiger Reviewer-Agent** prüft jeden PR unabhängig und merged nur, was
die Gates besteht. Kein Mensch muss dazwischenstehen — außer bei Risiko-Pfaden,
die bewusst zur Freigabe eskaliert werden.

## Prinzip: Gewaltenteilung

```
   Agent (Hermes/…)            Reviewer-Agent (eigener Account)
   ─────────────────           ───────────────────────────────
   Branch → verifizieren   →   liest offene PRs (nicht selbst-authored)
   → PR (mit Beleg)            → Gates: Secrets · Beleg · CI grün · mergeable · Risiko
   → NIE Self-Merge            → APPROVE+Merge | REQUEST_CHANGES | needs-human-review
                               ↑___________ Loop alle 5 min (systemd-Timer) __________|
```

Der Reviewer nutzt ein **getrenntes GitHub-Token** (`REVIEWER_GITHUB_TOKEN`,
eigener Bot-Login `NEXIFY_REVIEWER_LOGIN`). Das ist nicht optional: GitHub
verbietet das Approven eigener PRs, und ein Autor darf seine Arbeit nicht selbst
freigeben. Der Reviewer überspringt PRs, deren Autor er selbst ist.

## Die Gates (in `infra/reviewer/nexify_pr_reviewer.py`)

| Gate | Verletzt → |
|---|---|
| CI/Vercel/Secret-Scan grün | rot → REQUEST_CHANGES · pending → warten (nächster Lauf) |
| Kein Merge-Konflikt gegen main | Konflikt → REQUEST_CHANGES (rebasen) |
| Verifikations-Beleg im PR-Body (Statuscode/Test/Build) | fehlt → REQUEST_CHANGES („behauptet ≠ verifiziert") |
| Risiko-Pfade (`.github/`, `secrets`/`.env`, `memory/`, Dockerfile/`deploy/`, `middleware`/`proxy`, `next.config`, History) | berührt → `needs-human-review`, KEIN Auto-Merge |
| Nicht selbst-authored | eigener PR → übersprungen |

Alle grün + geringes Risiko → **APPROVE + Merge**. Idempotent: pro Head-SHA wird
höchstens einmal reviewt (Marker-Kommentar); nach einem Fix-Push prüft der
Reviewer die neue SHA automatisch erneut.

## Alle Agenten arbeiten gleich (REVIEW-GATE-PROTOKOLL)

Der Installer stempelt einen verbindlichen Protokollblock in **jede Agenten-Seele**
(Hermes-Profile-SOULs, Paperclip-Fabrik-AGENTS.md) und die CLI-Hinweise
(CLAUDE.md, .goosehints, MimoCode-AGENTS.md): PR statt Direkt-Push, **kein
Self-Merge**, Beleg im Body, REQUEST_CHANGES beheben, `needs-human-review` nicht
umgehen. Damit ist die Arbeitsweise systemweit identisch.

## Rollout (auf dem VPS)

```bash
# 1. Einmalig manuell: getrennten Reviewer-Bot-PAT anlegen (fine-grained,
#    nur dieses Repo, Contents:RW + Pull requests:RW) und in den Secret-Store:
#      REVIEWER_GITHUB_TOKEN=<pat>
#      NEXIFY_REVIEWER_LOGIN=<bot-login>
#    (in /etc/nexifyai/secrets.env, chmod 600) — NICHT derselbe Account wie die Agenten.
# 2.
cd /opt/nexifyai-cloud && git pull origin main
bash infra/scripts/nexify-reviewer-install.sh          # Audit
bash infra/scripts/nexify-reviewer-install.sh --apply  # Timer + REVIEW-GATE ausrollen
```

## Sicherheits-Leitplanken

- **Auto-Merge nur für Low-Risk.** Alles Infrastruktur-/Secret-/CI-/Routing-Nahe
  eskaliert zwingend an den Menschen (`needs-human-review`) — der Blast-Radius
  autonomer Merges bleibt klein.
- **Getrennte Identität** erzwingt echte Vier-Augen-Trennung.
- **Idempotent + persistent** (`Persistent=true`): verpasste Läufe werden
  nachgeholt, kein Doppel-Review.
- Kill-Switch: `systemctl disable --now nexify-pr-reviewer.timer`.

## Definition of Done

- [ ] Installer-Audit läuft mit 0 offen; Reviewer- und Agenten-Login sind getrennt.
- [ ] Timer aktiv (`systemctl status nexify-pr-reviewer.timer`).
- [ ] Ein realer Roundtrip belegt: Agent öffnet PR → Reviewer approved+merged
      (Low-Risk) bzw. flaggt (High-Risk) — im PR-Verlauf sichtbar.
- [ ] REVIEW-GATE-PROTOKOLL in allen Seelen (Installer-Report).
