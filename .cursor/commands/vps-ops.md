# /vps-ops

Read-first VPS-Betrieb (Hostinger): Status, Logs, Health — ohne unfreigegebene Writes.

## Goal

Infra-Lage klären (GitLab, 9router, Traefik, WireGuard, Docker) und sichere nächste Schritte vorschlagen.

## Depends

- SSH über VPN bevorzugt: `root@10.66.66.1`
- Public IP nur falls nötig
- Secrets aus `/etc/nexifyai/*.env` **nicht** ausgeben

## Suggested Sequence

1. Erreichbarkeit: ping/VPN, SSH Key-Auth.
2. `docker ps`, kritische Ports (`8922` GitLab, `20128` 9router, Traefik 80/443).
3. Health-URLs / `deploy/health-check.sh` falls vorhanden.
4. Logs gezielt (letzte Fehler), keine Token-Dumps.
5. Fixes auf Feature-Branch/Docs; Live-Writes → `/governance-f32`.
6. Reboot nur mit Freigabe (`/var/run/reboot-required` melden).

## Pitfalls

- AppArmor/sshd-Änderungen können Zugang killen — Konsole/Fallback bedenken.
- `GITLAB_URL` lokal `127.0.0.1:8922` vs. public `https://gitlab.nexifyai.cloud` nicht vermischen.
