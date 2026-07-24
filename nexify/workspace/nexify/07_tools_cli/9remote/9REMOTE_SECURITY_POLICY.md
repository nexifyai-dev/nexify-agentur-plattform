# 9Remote — Security Policy

> **Scope:** `nexify_internal`
> **Category:** `claude-code-infrastructure`
> **Stand:** 2026-06-12
> **Status:** PLANUNGSDOKUMENT
> **Klassifikation:** INTERN — Keine Weitergabe an Kunden

---

## 1. Grundsätze

1. **Web-Terminal = Kritisch** — Jeder Fehler erlaubt Shell-Zugriff auf den VPS
2. **Defense in Depth** — Keine einzelne Schutzschicht darf ausreichen
3. **Least Privilege** — Claude Code läuft mit minimal nötigen Rechten
4. **Zero Trust** — Auch interne Anfragen werden authentifiziert
5. **Audit** — Jede Aktion ist nachvollziehbar
6. **Keine Secrets über WebSocket** — Tokens, Keys, Passwörter maskieren

---

## 2. Netzwerk-Sicherheit

| Maßnahme | Umsetzung | Status |
|----------|-----------|--------|
| **Kein direkter Port** | 9Remote nur auf localhost:3400 | Plan |
| **Cloudflare Tunnel** | Einziger externer Zugang | Plan |
| **TLS 1.3** | Automatisch via Cloudflare | Plan |
| **DDoS-Schutz** | Cloudflare + rate-limit | Plan |
| **IP-Whitelist** | Optional für interne Nutzer | Optional |

**Firewall-Regeln (iptables/nftables):**
```bash
# Nur localhost-Zugriff auf 9Remote
iptables -A INPUT -p tcp --dport 3400 -s 127.0.0.1 -j ACCEPT
iptables -A INPUT -p tcp --dport 3400 -j DROP
```

---

## 3. Authentifizierung

### 3.1 Cloudflare Access (Zero Trust)
- **Empfohlen für Produktion**
- Erzwingt OIDC/SSO vor Erreichen des 9Remote-Endpunkts
- Nutzt Cloudflares Access-Kontrollen (E-Mail, Gruppe, Gerät)

### 3.2 JWT-Auth (Backup/Offline)
- JWT wird nach Login ausgestellt
- Secret: `/root/.nexify/secrets/9remote-jwt-secret.env` (mode 600)
- Ablauf: 8 Stunden (configurabel)
- Session-Token im HttpOnly-Cookie (nicht via JS lesbar)
- CSRF-Token für State-Mutations-Endpunkte

### 3.3 Auth-Header für API
```
Authorization: Bearer <jwt-token>
X-9Remote-Session: <session-id>
```

### 3.4 Login-Methoden

| Methode | Phase | Hinweis |
|---------|-------|---------|
| Cloudflare Access | Produktion | Single-Sign-On, kein eigenes Passwort |
| Pre-Shared JWT | Prototyp | Einfach, aber weniger sicher |
| SSH-Key-Auth | Zukunft | Für Power-User |

---

## 4. Session-Sicherheit

### 4.1 Session-Isolation
- **Jeder User bekommt eigene Claude-Code-Session**
- Kein gemeinsamer Prozess oder Workspace
- Session-Unterbrechung → Prozess wird terminiert
- Timeout nach 30 Minuten Inaktivität → Session-Close

### 4.2 Session-Daten
- Session-Status nur im Arbeitsspeicher (RAM)
- Keine Session-Daten auf Disk (außer Audit-Log)
- Historie wird nach Session-Ende gelöscht

---

## 5. Claude-Code-Restriktionen

Wenn Claude Code via 9Remote gestartet wird, gilt:

| Restriktion | Umsetzung |
|-------------|-----------|
| **Read-Only Modus** | Default; Write nur nach explizitem Auth-Check |
| **Kein Git Push** | `git push` blockiert via `allow`/`deny` |
| **Keine Production-Deployments** | Kein `vercel deploy`, kein `docker compose up` |
| **Kein Secret-Zugriff** | `~/.nexify/secrets/` nicht einsehbar |
| **Kein Root** | Claude Code läuft als normaler User |
| **Kein Docker-Zugriff** | Kein `docker` Command ohne Freigabe |
| **Kein Systemd-Management** | Kein `systemctl` ohne Autorisierung |

**Default-Modus:** `claude` mit `--dangerously-skip-permissions` ist **verboten**.
9Remote startet Claude Code immer mit Permission-Prompts aktiv.

---

## 6. Audit-Logging

| Ereignis | Log-Ziel | Retention |
|----------|----------|-----------|
| Login/Logout | /var/log/9remote/auth.log | 90 Tage |
| Session-Start/End | /var/log/9remote/sessions.log | 90 Tage |
| Kommandos (anonymisiert) | /var/log/9remote/commands.log | 30 Tage |
| Fehlversuche | /var/log/9remote/errors.log | 90 Tage |
| Security-Ereignisse | /var/log/9remote/security.log | 1 Jahr |

**Log-Format (JSON):**
```json
{
  "timestamp": "2026-06-12T10:00:00Z",
  "event": "session_start",
  "user": "pascal",
  "session_id": "abc123",
  "ip": "127.0.0.1",
  "user_agent": "Mozilla/5.0..."
}
```

Keine Secrets, Tokens oder Keys in Logs.
Kommandos werden **anonymisiert** (Token/Key-Werte durch `***` ersetzt).

---

## 7. Rate-Limiting

| Endpunkt | Limit | Zeitfenster |
|----------|-------|-------------|
| `/login` | 5 Versuche | 15 Minuten |
| `/api/*` | 100 Requests | 1 Minute |
| WebSocket | 10 Verbindungen | 1 Minute pro IP |
| Global | 1000 Requests | 1 Minute |

Bei Überschreitung: HTTP 429 + 15 Minuten Sperre.

---

## 8. Backup/Notfall

| Szenario | Maßnahme |
|----------|----------|
| **Auth-Ausfall** | Fallback auf lokalen SSH-Zugriff |
| **9Remote-Crash** | Automatischer Restart via systemd |
| **Security-Incident** | Port schließen, Tunnel deaktivieren, Logs sichern |
| **Session-Verlust** | User meldet sich neu an; alte Session terminiert |

---

## 9. Implementierungs-Checkliste

- [ ] Cloudflare Access konfigurieren
- [ ] JWT-Secret generieren und ablegen (`/root/.nexify/secrets/9remote-jwt-secret.env`)
- [ ] Auth-Middleware implementieren
- [ ] Rate-Limiting konfigurieren
- [ ] Audit-Log einrichten
- [ ] `deny`-Liste für Claude-Code-Kommandos
- [ ] Security-Test vor Produktion
- [ ] Dokumentation für Nutzer

---

*Erstellt 2026-06-12 im Rahmen von P0-004 (Claude Code CLI + 9Remote Zielbetrieb).
Ergänzt `9REMOTE_CURRENT_STATE.md` und `9REMOTE_TARGET_ARCHITECTURE.md`.*
