# 9Remote — Current State

> **Scope:** `nexify_internal`
> **Category:** `claude-code-infrastructure`
> **Stand:** 2026-06-12
> **Status:** PLANUNG / NOCH NICHT IMPLEMENTIERT

---

## 1. Was ist 9Remote?

9Remote ist ein **web-basiertes Terminal für Claude Code**. Es ersetzt das
bisherige Hermes Agent Remote und erlaubt den Zugriff auf Claude Code CLI
über einen Browser — ohne SSH, ohne lokale Installation.

**Zweck:**
- Claude Code von jedem Gerät mit Browser nutzbar machen
- Hermes Agent Remote ersetzen (das nicht mehr aktiv weiterentwickelt wird)
- Sicheren, authentifizierten Terminal-Zugriff auf dem VPS bereitstellen
- Integration in die NeXify Workstation als Web-Oberfläche

---

## 2. Ist-Zustand (2026-06-12)

| Aspekt | Status |
|--------|--------|
| **9Remote installiert** | NEIN — weder als npm-Paket noch als Binary |
| **9Remote im Path** | NEIN — `which 9remote` und `npm list -g 9remote` leer |
| **Verzeichnis** | `/workspace/nexify/07_tools_cli/9remote/` — existiert (dieses Dokument) |
| **Dokumentation** | In Erstellung (P0-004) |
| **Konfiguration** | Keine |
| **Systemd-Service** | Keiner |
| **Domain/Tunnel** | Keine |
| **Authentifizierung** | Keine |
| **Aktive Nutzung** | Keine |

---

## 3. Abgrenzung zu anderen Komponenten

| Komponente | Rolle | Relation zu 9Remote |
|------------|-------|---------------------|
| **Claude Code CLI** | Primärer Bulk-Executor | 9Remote ist Web-Frontend dafür |
| **Hermes Agent Remote** | Legacy-Web-Terminal | Wird durch 9Remote ersetzt |
| **Goose CLI** | System-CLI / MCP / Runtime | Läuft parallel, kein Ersatz |
| **NeXify Workstation** | Gebrandete Web-Oberfläche | Hostet 9Remote als Feature |
| **9Router** | AI-Provider-Gateway | 9Remote nutzt 9Router für API |
| **Cloudflare Tunnel** | Externer Zugriff | 9Remote wird dahinter betrieben |

---

## 4. Voraussetzungen für Betrieb

- Node.js 20+ (vorhanden)
- Claude Code CLI installiert (vorhanden, v2.1.167)
- 9Router-Zugriff (vorhanden via Cloudflare Tunnel)
- Domain-Subdomain (z.B. `remote.nexifyai.cloud`)
- Cloudflare Tunnel (vorhanden, läuft)
- Systemd-Service für Autostart

---

## 5. Nächste Schritte

1. **9Remote evaluieren** — GitHub/Open Source recherchieren oder entscheiden
   ob Eigenbau über `claude -p` + WebSocket-Tunnel
2. **Architektur-Entscheidung** — siehe `9REMOTE_TARGET_ARCHITECTURE.md`
3. **Installation + Konfiguration**
4. **Security-Policy anwenden** — siehe `9REMOTE_SECURITY_POLICY.md`
5. **Systemd-Service anlegen**
6. **Cloudflare Tunnel konfigurieren**
7. **Test + Freigabe**

---

## 6. Bekannte Risiken

- **Kein existierendes Paket** unter dem Namen `9remote` — möglicherweise
  Eigenentwicklung nötig
- **Sicherheitsrisiko** bei falscher Exposure (Web-Terminal = kritisch)
- **Session-Management** muss isolierte Claude-Code-Sessions pro User
  unterstützen
- **Kein Auth-System** vorhanden — muss vor Inbetriebnahme implementiert
  werden

---

*Erstellt 2026-06-12 im Rahmen von P0-004 (Claude Code CLI + 9Remote Zielbetrieb).*
