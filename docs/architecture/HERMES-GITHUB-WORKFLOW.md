# Hermes-Agent: GitHub-Workflow (Stand 11.07.2026)

Ziel: Der Hermes-Agent arbeitet am Monorepo **exakt nach demselben Protokoll**
wie die Claude-Code-Sessions — Branch, lokale Verifikation mit Beweis, Push,
PR, Checks abwarten, Merge, Live-Verifikation. Kein „sollte funktionieren",
nur belegte Ergebnisse.

## Das Protokoll (Kurzform)

```
Branch (hermes/<thema> von origin/main)
  → Verifizieren VOR Push (Build + Runtime-curl / bash -n / YAML-Parse)
  → Commit (was/warum/wie/bewiesen; nie Secrets — gitleaks-Gate)
  → Push (-u, Retry 2s/4s/8s/16s)
  → PR (gh pr create; Body: Problem → Fix → Verifikation → offene Punkte)
  → Checks abwarten (gh pr checks --watch; Vercel Ready + Secret-Scan grün)
  → Merge (gh pr merge --merge)
  → Live-Verifikation (Deployment-Status, curl-Stichproben, health-check.sh)
  → Ergebnis ins agentmemory (MEMORY-PROTOKOLL)
```

Der vollständige Wortlaut steht als **GITHUB-PROTOKOLL**-Block in jeder
Hermes-SOUL (analog zum MEMORY-PROTOKOLL) und wird vom Setup-Skript
eingepflegt und geprüft.

## Einrichtung

1. **Einmalig manuell** (nie ins Repo!): Fine-grained GitHub-PAT erstellen —
   Repository access: nur `nexifyai-dev/nexify-agentur-plattform`,
   Permissions: `Contents: Read and write`, `Pull requests: Read and write`.
   Als `GITHUB_TOKEN=<token>` in `/etc/nexifyai/secrets.env` eintragen
   (`chmod 600`).
2. Auf dem VPS:
   ```bash
   cd /opt/nexifyai-cloud && git pull origin main
   bash infra/scripts/hermes-github-setup.sh          # Audit
   bash infra/scripts/hermes-github-setup.sh --apply  # Einrichten + Beweis
   ```

Das Skript (idempotent, Backups nach `/root/config-backups/`):
- installiert die `gh` CLI (offizielles apt-Repo),
- setzt die Bot-Git-Identität (`Hermes Agent (NeXify)` / `hermes@nexifyai.cloud`),
- verdrahtet den Token **zur Laufzeit** aus `/etc/nexifyai/secrets.env`
  (git credential helper + systemd-Dropin für `hermes-gateway.service`) —
  der Token landet nie in `.gitconfig` oder im Repo,
- hängt das GITHUB-PROTOKOLL an alle `profiles/*/SOUL.md`,
- **beweist den Roundtrip**: Wegwerf-Branch → Commit → Push → Draft-PR →
  Close + Branch-Delete. Report: `/root/nexifyai-reports/hermes-github-setup-<ts>.md`.

## Sicherheits-Leitplanken

- Der PAT ist auf **ein Repo** und zwei Permissions beschränkt — kein
  Org-weiter Zugriff, kein Actions-/Secrets-Zugriff.
- Merge-Recht bewusst ja (der Betreiber hat autonomes Mergen delegiert),
  aber die Gates bleiben: Vercel-Check + gitleaks-Secret-Scan müssen grün
  sein, sonst verbietet das Protokoll den Merge.
- Bei kompromittiertem Token: im GitHub-UI revoken, neuen Token in
  `/etc/nexifyai/secrets.env` eintragen, `systemctl restart hermes-gateway`.

## Definition of Done

- [ ] Setup-Skript Audit läuft mit 0 offen durch.
- [ ] Roundtrip-Beweis im Report (Push ✓, PR ✓, Close ✓).
- [ ] GITHUB-PROTOKOLL in allen SOULs (Skript listet Abdeckung).
- [ ] Ein realer Hermes-Task hat einen echten PR nach Protokoll erstellt
      und gemergt — mit Verifikations-Beweis im PR-Body.
