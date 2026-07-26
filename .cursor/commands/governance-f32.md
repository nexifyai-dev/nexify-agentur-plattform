# /governance-f32

Autonomie-Grenze: was Agenten allein dürfen vs. was **menschliche Freigabe (F32)** braucht.

## Goal

Kein stilles Production-Schreiben, keine Secret-Rotation „nebenbei“, kein Live-Deploy ohne Gate.

## Gilt als F32 / Eskalation (nicht autonom)

- Production Deploy / main-Merge ohne Review-Pfad
- Secrets erzeugen/rotieren/löschen; Vault; PAT in Prod-Dateien
- VPS Reboot, Firewall-Drop, destruktive Docker/DB-Ops
- Live MCTS / FlowSearch / Cron die Prod anfassen
- Kundendaten an unfreigegebene Modelle/Tools
- Delete von Persistenz (Volumes, Git force auf shared branches)

Siehe: `docs/governance/01_regelwerke/VERBOTE_UND_PFLICHTREGELN_V2.md` (V01–V08 u. a.)

## Autonom erlaubt (mit Evidence)

- Feature-Branch, Docs, Tests, Staging-Vorschläge
- Read-only Diagnostics (Health, Logs ohne Secrets dumpen)
- PR/Draft anlegen; CI grün machen
- Offline-Analysen / Register-Updates

## Suggested Sequence

1. Aktion klassifizieren: autonom | Freigabe nötig.
2. Wenn Freigabe: klar fragen, Rollback nennen, **nicht** vorweg ausführen.
3. Evidence behalten (Diff, Testausgabe, Links) — V05.
4. Nie Secrets in Chat/Repo (V01).
