# Sicherheitsvorfall: Klartext-Zugangsdaten in Git (2026-07-11)

## Befund

`memory/test_credentials.md` war seit mindestens Commit `fc66d8b7` (06.07.2026) mit
Klartext-Zugangsdaten auf `main` committet und über die GitHub-Remote
(`nexifyai-dev/nexify-agentur-plattform`) abrufbar. Das `.gitignore` schließt zwar
`.env`, `*.pem`, `*.key`, `credentials.json` korrekt aus — die Datei war aber eine
`.md`-Datei mit eingebetteten Klartext-Werten und wurde von keinem der Muster erfasst.

Betroffene Werte (Stand vor dem Scrub in diesem Commit):
1. Admin-Login-Passwort (`mail@nexifyai.cloud`, Live-Admin unter `www.nexifyai.cloud/admin`)
2. Test-Kunden-Passwort (`support@nexify-automate.com`)
3. Service-Admin-API-Token (`X-Admin-Token` / Backend-Env `ADMIN_API_TOKEN`, identisch mit
   `NEXIFY_CRM_API_TOKEN` in der VPS-Datei `/root/.hermes/.env`) — dieser Token hat laut
   `memory/VPS_INFRA.md` Server-zu-Server-Admin-Rechte und wird vom Hermes-Skill `nexify-crm`
   genutzt. Höchste Priorität, da er nicht nur einen Nutzer-Account, sondern eine
   Service-zu-Service-Vertrauensbeziehung betrifft.

Zusätzlich: Im Zuge dieser Session hat der Betreiber das VPS-Root-Passwort im Klartext in
den Chat-Verlauf dieser Session eingefügt (in der Annahme, es werde für einen SSH-Login
gebraucht). Das Passwort wurde nicht weiterverwendet (siehe unten, SSH war technisch nicht
erreichbar) und wird hier bewusst nicht wiederholt — es gilt aber ab dem Moment der Eingabe
als potenziell exponiert (Chat-Historie/Logs) und sollte unabhängig vom Rest dieses Vorfalls
rotiert werden.

## Root Cause

- Kein Secret-Scanning (z. B. gitleaks/trufflehog) als Pre-Commit-Hook oder CI-Gate.
- `nexify/workspace/nexify/07_security_secrets/SECRET_ACCESS_POLICY.md` und
  `SECRET_MANAGEMENT_TARGET_ARCHITECTURE.md` beschreiben eine Ziel-Architektur für
  Secret-Handling, die an dieser Stelle nicht durchgesetzt wurde — ein Governance-Dokument
  ohne mechanische Durchsetzung (exakt das Muster, vor dem die
  `nexifyai-vollbetrieb`-Doktrin in den Masterplan-Erweiterungen warnt: Prompt-Text/Policy
  ersetzt keine technische Kontrolle).
- `memory/` wurde offenbar als "internes Notizverzeichnis" behandelt, nicht als Teil der
  Angriffsfläche — ist aber reguläres Git-Tracking im selben Repo wie der Produktivcode.

## Sofortmaßnahmen (in diesem Commit durchgeführt)

- `memory/test_credentials.md`: Klartext-Werte durch Platzhalter ersetzt, Rotationshinweis
  ergänzt. **Das entfernt die Werte nur aus dem Arbeitsbaum ab jetzt — sie bleiben in der
  Git-Historie (Commits `fc66d8b7`, `e3d4668f`, `8c61ba7d`) einsehbar, solange keine
  History-Bereinigung erfolgt.**

## Offene Maßnahmen (Entscheidung/Ausführung durch Betreiber bzw. mit VPS-Zugriff)

1. **Rotieren, nicht nur verstecken** — mit Priorität in dieser Reihenfolge:
   - `ADMIN_API_TOKEN` / `NEXIFY_CRM_API_TOKEN` (Backend-`.env` UND `/root/.hermes/.env`
     auf dem VPS gleichzeitig ändern, sonst bricht der `nexify-crm`-Skill)
   - Admin-Passwort (`mail@nexifyai.cloud`)
   - Test-Kunden-Passwort
   - VPS-Root-Passwort (wegen Chat-Exposition in dieser Session) — danach idealerweise
     komplett auf Key-only-Auth umstellen und Passwort-Login für `root` deaktivieren
     (`PasswordAuthentication no` in `sshd_config`), siehe Gesamtplan.
2. **Git-History-Bereinigung** (separate, bewusste Entscheidung nötig — schreibt Historie um,
   invalidiert bestehende Clones/Forks, erfordert Force-Push): `git filter-repo` oder BFG
   Repo-Cleaner auf `memory/test_credentials.md` anwenden, danach koordinierten Force-Push
   mit allen Mitwirkenden abstimmen. **Nicht ohne explizite Freigabe ausführen.**
3. **Prävention**: Pre-Commit-/CI-Secret-Scan (gitleaks) einführen, siehe Gesamtplan
   Abschnitt „Governance & Secret-Management".
4. GitHub-Repo-Sichtbarkeit prüfen (privat/öffentlich) und Zugriffsliste der Collaborator
   gegen Notwendigkeit abgleichen.

## Status

Offen, bis alle Punkte unter „Offene Maßnahmen" abgeschlossen und mit Beweis (nicht nur
Behauptung) dokumentiert sind — konsistent mit der im Repo etablierten Beweispflicht-Regel
aus den Masterplan-Dokumenten.
