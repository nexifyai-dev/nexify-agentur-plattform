# Security Audit — F17 & F18
**Datum:** 2026-06-22
**Agent:** Security Agent (Subagent)
**VPS:** vps (via SSH)

---

## F17: Secret-Rotation

### Status: ⚠️ MANUELL — Keine automatische Rotation

### Secrets-Übersicht (redacted)
| Kategorie | Anzahl Secrets | Letzte Änderung | Alters-Tage (ca.) |
|-----------|---------------|-----------------|-------------------|
| ai | 5 Dateien | 2026-06-15 | 7 |
| baseten | 1 Datei | 2026-06-21 | 1 |
| cloudflare | 6 Dateien | 2026-06-20 | 2 |
| cloudflared-tunnel | 1 Datei | 2026-06-08 | 14 |
| dns | (dir) | 2026-06-11 | 11 |
| email | (dir) | 2026-06-16 | 6 |
| github | 5 Dateien | 2026-06-16 | 6 |
| hostinger | 1 Datei | 2026-06-11 | 11 |
| infra | 1 Datei | 2026-06-08 | 14 |
| monitoring | (dir) | 2026-06-11 | 11 |
| nexify | 4 Dateien | 2026-06-08 | 14 |
| resend | 1 Datei | 2026-06-16 | 6 |
| supabase | 1 Datei | 2026-06-20 | 2 |
| vercel | 2 Dateien | 2026-06-11 | 11 |
| you-com | 1 Datei | 2026-06-11 | 11 |

### Rotation-Mechanismen
- **Crontab:** KEIN Rotation-Job vorhanden (nur monitoring/health-check)
- **Systemd-Timer:** KEIN Rotation-Timer
- **Automatisiertes Script:** KEIN `rotate`/`renew`-Script gefunden
- **Historisch:** Einmaliger manueller Rotations-Versuch für you-com-key (2026-06-07, fehlgeschlagen → processed)

### Befund
- Secrets werden **manuell** erstellt und aktualisiert
- Keine automatische Rotation (weder cron, systemd, noch Script)
- `load-all.sh` lädt alle .env-Files — kein Rotation-Trigger
- **Älteste Secrets:** cloudflared-tunnel-token, infra/root-password, nexify (14 Tage)
- **Risiko:** Bei Kompromittierung keine automatische Sperrung/Rotierung

### Empfehlung
1. **Kurzfristig:** Rotation-Skript erstellen (mindestens für Cloudflare, GitHub, Supabase)
2. **Mittelfristig:** Cron-Job für quartalsweise Rotation einrichten
3. **Langfristig:** HashiCorp Vault oder vergleichbar für automatisierte Rotation

---

## F18: CVE-Scanner

### Status: ❌ KEIN CVE-Scanner installiert

### Geprüfte Scanner
| Scanner | Installiert? | Version |
|---------|-------------|---------|
| Trivy | ❌ Nein | - |
| Grype | ❌ Nein | - |
| Snyk | ❌ Nein | - |
| Lynis | ❌ Nein | - |
| nmap | ❌ Nein | - |
| Docker Scout | ❌ Nein | - |
| ClamAV | ❌ Nein | - |
| AIDE | ❌ Nein | - |
| rkhunter | ❌ Nein | - |

### Vorhandene Security-Maßnahmen
| Maßnahme | Status |
|----------|--------|
| iptables Firewall | ✅ Aktiv (INPUT policy DROP) |
| SSH-Ports restricted | ⚠️ Port 22 offen, localhost-only für interne Services |
| unattended-upgrades | ✅ Installiert (automatische Security-Updates) |
| Fail2Ban | ❌ Nicht aktiv/installed |
| Docker | ✅ v29.5.3 (neueste) |

### Firewall-Konfiguration (iptables)
- **INPUT Policy:** DROP (gut — default deny)
- **Erlaubt:** SSH (22), localhost-only für interne Services (6333, 6379, 8001, etc.)
- **Gesperrt:** Qdrant, Redis, interne Ports von extern explizit DROP
- **FORWARD:** Docker-Chain aktiv, Hermes (8645) erlaubt
- **OUTPUT:** ACCEPT (standard)

### SSH-Konfiguration (⚠️)
- `PermitRootLogin yes` — **RISIKO**
- `PasswordAuthentication` — auf Default (yes) — **RISIKO**
- `PubkeyAuthentication` — auf Default (yes)
- Port 22 — Standard

### Open Ports (extern)
- 22 (SSH)
- 8645 (Hermes)
- 8787 (Python)
- 9091, 9093, 9100, 9115 (Monitoring/Docker)
- 54322, 54324, 54327, 5433 (Docker-Postgres)

---

## Gesamt-Security-Score

| Bereich | Score | Status |
|---------|-------|--------|
| Firewall | 7/10 | ✅ Gut (DROP policy, localhost restrictions) |
| Secret-Rotation | 2/10 | ⚠️ Manuell, keine Automatisierung |
| CVE-Scanning | 0/10 | ❌ Kein Scanner installiert |
| SSH-Härtung | 3/10 | ⚠️ Root-Login erlaubt, Password-Auth default |
| Auto-Updates | 8/10 | ✅ unattended-upgrades aktiv |
| Fail2Ban | 0/10 | ❌ Nicht installiert |
| **Gesamt** | **3.3/10** | ⚠️ Kritische Lücken |

---

## Empfohlene Sofortmaßnahmen (P0)

1. **Fail2Ban installieren** — Brute-Force-Schutz für SSH
2. **SSH härten:** `PermitRootLogin no`, `PasswordAuthentication no`
3. **Trivy installieren** — CVE-Scanner für Docker-Images und Dateisystem
4. **Secret-Rotation-Skript** — mindestens manuell aufrufbar mit Cron-Trigger
5. **Monitoring-Ports absichern** — 9091, 9093, 9100, 9115 nur localhost

---

*Report generiert: 2026-06-22T10:30:00+02:00*
*Evidence-Pfad: /workspace/nexify/10_evidence/security/*
