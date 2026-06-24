# 9Remote — Target Architecture

> **Scope:** `nexify_internal`
> **Category:** `claude-code-infrastructure`
> **Stand:** 2026-06-12
> **Status:** PLANUNGSDOKUMENT

---

## 1. Architektur-Übersicht

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                    │
│          https://remote.nexifyai.cloud                │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS (TLS 1.3)
┌──────────────────────▼──────────────────────────────┐
│              Cloudflare Tunnel (cloudflared)          │
│         /etc/cloudflared/config.yml — ingress         │
│         Host: remote.nexifyai.cloud                   │
│         Service: http://localhost:{9REMOTE_PORT}      │
└──────────────────────┬──────────────────────────────┘
                       │ localhost
┌──────────────────────▼──────────────────────────────┐
│              9Remote Server (Node.js)                 │
│         Port: {9REMOTE_PORT} (z.B. 3400)              │
│         - Express/HTTP-Server                         │
│         - WebSocket (xterm.js / tty.js)               │
│         - Auth-Middleware (JWT + Session)              │
│         - Rate-Limiting + Audit-Log                   │
└──────────────────────┬──────────────────────────────┘
                       │ spawn / PTY
┌──────────────────────▼──────────────────────────────┐
│              Claude Code CLI Session                   │
│         /usr/bin/claude (v2.1.167)                    │
│         Umgebung: neXify claude code nexifyai          │
│         (ANTHROPIC_BASE_URL, ANTHROPIC_MODEL etc.)     │
└──────────────────────┬──────────────────────────────┘
                       │ API via 9Router
┌──────────────────────▼──────────────────────────────┐
│              9Router (AI Provider Gateway)             │
│         https://ai-router.nexifyai.cloud/v1            │
│         Provider: nexifyai-combo-llm                  │
│         (ds/deepseek-reasoner + ds/deepseek-v4-flash) │
└─────────────────────────────────────────────────────┘
```

---

## 2. Komponenten im Detail

### 2.1 9Remote Server

**Technologie-Stack (Vorschlag):**

| Komponente | Technologie | Begründung |
|-----------|-------------|------------|
| Runtime | Node.js 20+ LTS | Bereits installiert |
| HTTP-Server | Express.js | Bewährt, einfach |
| WebSocket | ws + xterm.js | PTY-Terminal-Emulation |
| PTY-Management | node-pty | Claude Code als Subprozess |
| Auth | JWT + Session-Cookie | Zustandslos, einfach |
| Rate-Limiting | express-rate-limit | DDoS-Schutz |
| Audit-Log | winston + File-Rotation | Forensik |
| Config | dotenv + YAML | Flexibel, trennbar |

**Port-Konvention:** `3400` (im Bereich der NeXify-internen Ports)

### 2.2 Claude Code CLI Session

Jeder 9Remote-User bekommt eine **isolierte Claude-Code-Session**:

```
claude -p "9Remote session started for {user}"
```

- Session läuft als Subprozess von 9Remote Server
- PTY wird via `node-pty` oder `tmux` gesteuert
- Session-Isolation: Jeder User hat eigene Claude-Instanz
- Arbeitsverzeichnis: `/home/{user}/workspace/` oder temporär
- Umgebungsvariablen aus `~/.nexify/claude-env.sh`

### 2.3 Authentifizierung (Auth-Flow)

```
1. User öffnet https://remote.nexifyai.cloud
2. 9Remote zeigt Login-Seite (SSO via NeXify-Auth oder JWT-Token)
3. User authentifiziert sich
4. 9Remote erzeugt Session-JWT (Ablauf: 8h)
5. WebSocket-Verbindung wird mit JWT authorisiert
6. Claude Code CLI wird für User gestartet
```

**Auth-Methoden (Rangfolge):**

| Priorität | Methode | Status |
|-----------|---------|--------|
| 1 | OAuth2 / OpenID Connect (Keycloak/Auth0) | Zukunft |
| 2 | JWT mit Pre-Shared-Key | Kurzfristig |
| 3 | Cloudflare Access (Zero Trust) | Alternative |
| 4 | IP-Whitelist (nur interne Nutzung) | Notfall |

**Empfehlung Startphase:** JWT + Cloudflare Access (doppelte Absicherung)

### 2.4 Isolations-Konzept

| Ebene | Isolation | Umsetzung |
|-------|-----------|-----------|
| Netzwerk | Nur via Cloudflare Tunnel | Kein direkter Port-Zugriff |
| Session | Pro User eigene Claude-Instanz | node-pty pro Verbindung |
| Dateisystem | Chroot oder Docker-Container | Optional pro Workspace |
| API | Nur über 9Router (authentisiert) | Kein direkter LLM-Zugriff |
| Audit | Vollständiges Logging | Winston + Journald |

---

## 3. Deployment-Strategie

### Phase 1 — Evaluierung (aktuell)
- [ ] Open-Source-Alternative suchen (z.B. `ttyd`, `wetty`, `shellinabox`)
- [ ] Prüfen ob Eigenbau nötig (claude -p + WebSocket)
- [ ] Security-Review der gewählten Lösung

### Phase 2 — Prototyp
- [ ] 9Remote auf Port 3400 starten (localhost only)
- [ ] Claude-Code-Session via Web-Terminal testen
- [ ] Auth-Middleware implementieren
- [ ] Audit-Log konfigurieren

### Phase 3 — Produktion
- [ ] Cloudflare Tunnel für `remote.nexifyai.cloud` konfigurieren
- [ ] Systemd-Service anlegen
- [ ] Rate-Limiting aktivieren
- [ ] Backup/Restore für Sessions

---

## 4. Ports und Dienste

| Dienst | Port | Bemerkung |
|--------|------|-----------|
| 9Remote | 3400 | Localhost, nie direkt exponiert |
| Cloudflare Tunnel | — | Via cloudflared, kein extra Port |
| 9Router | 32794 (Host) | Extern via Cloudflare Tunnel |
| Brain | 80 (Container) | Extern via Cloudflare Tunnel |

---

## 5. Offene Entscheidungen

1. **Eigenbau vs. Open Source** — ttyd/wetty vs. eigenes Node.js-Projekt
2. **Auth-System** — Cloudflare Access vs. JWT vs. beides
3. **Session-Lifetime** — 8h, 24h oder bis Browser-Close
4. **Multi-User** — Brauchen wir mehrere gleichzeitige Sessions?
5. **Workspace-Persistenz** — Soll Workspace nach Session-Ende erhalten bleiben?

---

*Erstellt 2026-06-12 im Rahmen von P0-004 (Claude Code CLI + 9Remote Zielbetrieb).*
