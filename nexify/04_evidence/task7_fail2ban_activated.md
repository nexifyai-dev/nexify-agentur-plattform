# Task 7: Fail2Ban aktivieren — Evidence

**Datum:** 2026-06-22 23:40 CEST  
**VPS:** 72.62.152.47 (srv1243952)  
**Status:** ✅ ERFOLGREICH

---

## 1. Installation

```
Package: fail2ban 1.1.0-9 (all)
Dependencies: whois (5.6.6)
Status: Installiert via apt-get
```

## 2. Jail-Konfiguration (`/etc/fail2ban/jail.local`)

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = 22
logpath = %(sshd_log)s
backend = systemd
maxretry = 3
bantime = 3600
```

### Parameter-Erklärung:
| Parameter  | Wert   | Bedeutung                                      |
|------------|--------|-------------------------------------------------|
| bantime    | 3600   | Sperre nach 3 Fehlversuchen: 1 Stunde           |
| findtime   | 600    | Zeitfenster für Fehlversuche: 10 Minuten         |
| maxretry   | 3      | Max. Fehlversuche vor Bann                       |
| port       | 22     | SSH-Standardport                                 |
| backend    | systemd| Journal-basierte Log-Erkennung (modern)          |

## 3. Service-Status

```
fail2ban.service - Fail2Ban Service
  Loaded: loaded (enabled, preset: enabled)
  Active: active (running)
  Main PID: 3015967
  Memory: 15M
```

- **Enabled on Boot:** ✅ `enabled`
- **Service Running:** ✅ `active (running)`

## 4. SSH-Jail-Status

```
Status for the jail: sshd
|- Filter
|  |- Currently failed:  0
|  |- Total failed:      0
`- Actions
   |- Currently banned:  0
   |- Total banned:      0
   `- Banned IP list:
```

- **SSH Jail:** ✅ Aktiv und überwachend
- **Aktive Jails:** 1 (sshd)
- **Currently banned:** 0 (keine IPs gesperrt)

## 5. SSH-Zugang verifiziert

```
sshd.service: active
```

- **SSH funktioniert weiterhin:** ✅ Keine Aussperrung

## 6. Zusammenfassung

| Check                          | Status |
|--------------------------------|--------|
| Fail2Ban installiert           | ✅     |
| Jail-Konfiguration erstellt    | ✅     |
| Service enabled + running      | ✅     |
| SSH-Jail aktiv (sshd)          | ✅     |
| maxretry=3, bantime=3600       | ✅     |
| SSH weiterhin erreichbar       | ✅     |
| Keine Aussperrung              | ✅     |

---

**Result:** Fail2Ban schützt den VPS vor Brute-Force-SSH-Angriffen. Nach 3 fehlgeschlagenen Login-Versuchen innerhalb von 10 Minuten wird die angreifende IP für 1 Stunde gesperrt.
