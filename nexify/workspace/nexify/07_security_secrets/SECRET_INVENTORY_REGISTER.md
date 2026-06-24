# SECRET_INVENTORY_REGISTER

**Stand:** 2026-06-11  
**Version:** 1.0  
**Status:** Baselineregister – KEINE Klartext-Secret-Werte enthalten

> **WICHTIG:** Dieses Dokument enthält NUR Referenzen/Platzhalter, KEINE Secret-Werte.
> Secrets werden nach Migration ausschließlich im zentralen Secret-Management (Infisical) gespeichert.

---

## Inventarstruktur

| Feld | Beschreibung |
|:-----|:-------------|
| `secret_id` | Eindeutige ID für systeminterne Referenz |
| `secret_name` | Lesbarer Name |
| `secret_type` | API-Key, Token, Passwort, Zertifikat, SSH-Key, Datei |
| `owner_system` | Federführendes System |
| `used_by` | Systeme/Agenten, die das Secret verwenden |
| `source_location` | Pfad oder Ort, wo das Secret aktuell referenziert wird |
| `stored_where` | Aktueller Speicherort |
| `is_present` | ✓ Secret existiert und ist in Verwendung |
| `rotation_supported` | ✓/✗/⚠️ Ob Rotation technisch möglich ist |
| `rotation_frequency` | Soll-Rotationsintervall |
| `last_rotated_known` | Letztes bekanntes Rotationsdatum |
| `risk_level` | CRITICAL / HIGH / MEDIUM / LOW |
| `blast_radius` | Auswirkung bei Kompromittierung |
| `required_for_runtime` | ✓/✗ Ob System ohne Secret ausfällt |
| `fallback_available` | ✓/✗ Ob ein Fallback/Ersatz-Secret existiert |

---

## Inventory

### 1. ANTHROPIC_AUTH_TOKEN

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-001 |
| secret_name | ANTHROPIC_AUTH_TOKEN |
| secret_type | API Token (Bearer) |
| owner_system | Claude Code / DeepSeek Integration |
| used_by | Claude Code CLI, DeepSeek-vermittelte Anfragen |
| source_location | `.env`, `~/.claude/auth.json`, `docker-compose.yml` |
| stored_where | `.env`-Dateien, lokale CLI-Konfiguration |
| is_present | ✓ |
| rotation_supported | ✓ (über Anthropic Console) |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **CRITICAL** |
| blast_radius | Vollzugriff auf Anthropic-API – Kosten, Datenschutz |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 2. ANTHROPIC_API_KEY

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-002 |
| secret_name | ANTHROPIC_API_KEY |
| secret_type | API Key |
| owner_system | NeXify AI Router |
| used_by | NeXify Router, direkte API-Calls an Anthropic |
| source_location | `.env`, `nexify-router/config/` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ (über Anthropic Console) |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **CRITICAL** |
| blast_radius | Vollzugriff auf Anthropic-API |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 3. DEEPSEEK_API_KEY

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-003 |
| secret_name | DEEPSEEK_API_KEY |
| secret_type | API Key |
| owner_system | NeXify AI Router |
| used_by | NeXify Router, DeepSeek-Module |
| source_location | `.env`, `nexify-router/config/` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ (über DeepSeek Dashboard) |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **CRITICAL** |
| blast_radius | Vollzugriff auf DeepSeek-API |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 4. NEXIFY_ROUTER_API_KEY

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-004 |
| secret_name | NEXIFY_ROUTER_API_KEY |
| secret_type | API Key (intern) |
| owner_system | NeXify Router |
| used_by | Interne Agenten, die auf Router zugreifen |
| source_location | `.env`, `docker-compose.yml`, Agent-Configs |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ |
| rotation_frequency | alle 30 Tage |
| last_rotated_known | unbekannt |
| risk_level | **HIGH** |
| blast_radius | Zugriff auf interne API-Router – potenzielle Rekonfiguration |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 5. YOU_API_KEY

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-005 |
| secret_name | YOU_API_KEY |
| secret_type | API Key |
| owner_system | NeXify Web Search Integration |
| used_by | NeXify Router (Web-Search-Modul) |
| source_location | `.env` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ (über You.com Dashboard) |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **MEDIUM** |
| blast_radius | Zugriff auf Web-Search-API – moderate Kosten |
| required_for_runtime | ⚠️ (Recherche-Feature) |
| fallback_available | ✗ |

### 6. AGENTMEMORY_SECRET

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-006 |
| secret_name | AGENTMEMORY_SECRET |
| secret_type | API Key / Auth Token |
| owner_system | NeXify Agent Memory |
| used_by | Agent Memory Service |
| source_location | `.env`, `agent-memory/config.yml` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ |
| rotation_frequency | alle 30 Tage |
| last_rotated_known | unbekannt |
| risk_level | **HIGH** |
| blast_radius | Zugriff auf Agenten-Gedächtnis – potenziell sensible Konversationen |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 7. CUSTOM_API_KEY (Hermes)

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-007 |
| secret_name | CUSTOM_API_KEY (Hermes) |
| secret_type | API Key |
| owner_system | Hermes (Custom Agent) |
| used_by | Hermes-Agent, Hermes-spezifische Module |
| source_location | `.env`, `hermes/config/` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **HIGH** |
| blast_radius | Vollzugriff auf Hermes-Agent |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 8. OPENAI_API_KEY

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-008 |
| secret_name | OPENAI_API_KEY |
| secret_type | API Key |
| owner_system | NeXify AI Router |
| used_by | NeXify Router, OpenAI-Module |
| source_location | `.env`, `nexify-router/config/` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ (über OpenAI Dashboard) |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **CRITICAL** |
| blast_radius | Vollzugriff auf OpenAI-API – Kosten, Datenschutz |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 9. SSH-Keys

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-009 |
| secret_name | SSH-Private-Keys |
| secret_type | SSH Private Key (Datei) |
| owner_system | NeXify Infrastruktur |
| used_by | SSH-Authentifizierung für Server, Git, Deployment |
| source_location | `~/.ssh/id_*`, `~/.ssh/config` |
| stored_where | Dateisystem (lokale Keys) |
| is_present | ✓ (falls vorhanden) |
| rotation_supported | ✓ (Neugenerierung möglich) |
| rotation_frequency | alle 180 Tage |
| last_rotated_known | unbekannt |
| risk_level | **CRITICAL** |
| blast_radius | Vollzugriff auf SSH-Ziele – Server-Kompromittierung |
| required_for_runtime | ✓ |
| fallback_available | ⚠️ (PubKey kann neu deployt werden) |

### 10. Cloudflare API Tokens

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-010 |
| secret_name | Cloudflare API Tokens |
| secret_type | API Token |
| owner_system | NeXify Infrastruktur (DNS/CDN) |
| used_by | DNS-Management, SSL/TLS-Zertifikate, CDN-Konfiguration |
| source_location | `.env`, `cloudflare-config/` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ (über Cloudflare Dashboard) |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **HIGH** |
| blast_radius | DNS/CDN-Manipulation – Ausfallrisiko |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 11. Supabase Keys

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-011 |
| secret_name | Supabase Keys (anon + service_role) |
| secret_type | API Key |
| owner_system | NeXify Database |
| used_by | Supabase Client, Backend-Dienste |
| source_location | `.env`, `supabase/config.toml` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ (über Supabase Dashboard) |
| rotation_frequency | alle 90 Tage (service_role) / alle 180 Tage (anon) |
| last_rotated_known | unbekannt |
| risk_level | **CRITICAL** |
| blast_radius | service_role: Vollzugriff auf DB – Datenverlust/-diebstahl |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 12. Resend Keys

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-012 |
| secret_name | Resend API Keys |
| secret_type | API Key |
| owner_system | NeXify Notification (E-Mail) |
| used_by | E-Mail-Versand (Transaktionsmails, Benachrichtigungen) |
| source_location | `.env`, `notification-service/config.yml` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ (über Resend Dashboard) |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **MEDIUM** |
| blast_radius | Spam-Versand über NeXify-Domain – Reputationsschaden |
| required_for_runtime | ⚠️ (nur E-Mail-Features) |
| fallback_available | ✗ |

### 13. Webhook Tokens

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-013 |
| secret_name | Webhook Tokens |
| secret_type | Token (Bearer / HMAC) |
| owner_system | NeXify Router |
| used_by | Externe Integrationen (GitHub, Slack, etc.) |
| source_location | `.env`, `webhook-config/` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ |
| rotation_frequency | alle 30 Tage |
| last_rotated_known | unbekannt |
| risk_level | **HIGH** |
| blast_radius | Unautorisierte Webhook-Aufrufe – potenzielle Fehlauslösungen |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 14. NEXIFY_AUTO_CHAT_INTERNAL_TOKEN

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-014 |
| secret_name | NEXIFY_AUTO_CHAT_INTERNAL_TOKEN |
| secret_type | Internal Auth Token |
| owner_system | NeXify Auto Chat |
| used_by | Auto Chat Service, interne Kommunikation |
| source_location | `.env` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ |
| rotation_frequency | alle 30 Tage |
| last_rotated_known | unbekannt |
| risk_level | **HIGH** |
| blast_radius | Zugriff auf Auto Chat – potenzielle Konversationsmanipulation |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 15. HERMES_WEBUI_PASSWORD

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-015 |
| secret_name | HERMES_WEBUI_PASSWORD |
| secret_type | Passwort |
| owner_system | Hermes WebUI |
| used_by | Hermes WebUI (Benutzeranmeldung) |
| source_location | `.env`, `hermes/webui-config/` |
| stored_where | `.env`-Dateien |
| is_present | ✓ |
| rotation_supported | ✓ |
| rotation_frequency | alle 90 Tage |
| last_rotated_known | unbekannt |
| risk_level | **MEDIUM** |
| blast_radius | Zugriff auf Hermes WebUI – eingeschränkt auf UI-Funktionen |
| required_for_runtime | ✓ |
| fallback_available | ✗ |

### 16. .env-Dateien (allgemein)

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-016 |
| secret_name | .env-Dateien (Sammel-Eintrag) |
| secret_type | Datei (Sammlung mehrerer Secrets) |
| owner_system | NeXify Gesamtsystem |
| used_by | Alle Dienste, Agenten, CI/CD |
| source_location | Diverse `/workspace/`-Pfade, Projektverzeichnisse |
| stored_where | Dateisystem (unkontrolliert) |
| is_present | ✓ |
| rotation_supported | ⚠️ (nur pro Einzelsecret) |
| rotation_frequency | n/a |
| last_rotated_known | unbekannt |
| risk_level | **CRITICAL** |
| blast_radius | Kompletter Systemzugriff bei Kompromittierung einer .env-Datei |
| required_for_runtime | ✓ |
| fallback_available | ⚠️ (nach Migration zu Infisical) |

### 17. TLS/SSL Certificates

| Feld | Wert |
|:-----|:------|
| secret_id | SEC-017 |
| secret_name | TLS/SSL Certificates |
| secret_type | Zertifikat (Datei) |
| owner_system | NeXify Infrastruktur |
| used_by | HTTPS-Server, API-Gateway, Interne Dienste |
| source_location | `/etc/ssl/`, Nginx/Caddy-Configs, `docker-compose.yml` |
| stored_where | Dateisystem |
| is_present | ✓ |
| rotation_supported | ✓ (via Let's Encrypt / Cert-Manager) |
| rotation_frequency | alle 90 Tage (Let's Encrypt) |
| last_rotated_known | unbekannt |
| risk_level | **HIGH** |
| blast_radius | HTTPS-Ausfall oder Man-in-the-Middle |
| required_for_runtime | ✓ |
| fallback_available | ⚠️ (Self-Signed-Fallback möglich) |

---

## Secret-Typen-Übersicht

| Typ | Anzahl | Risk-Level |
|:----|:-------|:-----------|
| API Key / Token | 13 | CRITICAL–MEDIUM |
| SSH Private Key | 1 | CRITICAL |
| Passwort | 1 | MEDIUM |
| Zertifikat | 1 | HIGH |
| Datei (.env) | 1 | CRITICAL |

## Risikoverteilung

| Level | Anzahl | Secrets |
|:------|:-------|:--------|
| **CRITICAL** | 6 | ANTHROPIC_AUTH_TOKEN, ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, OPENAI_API_KEY, SSH-Keys, Supabase Keys (service_role), .env-Dateien |
| **HIGH** | 5 | NEXIFY_ROUTER_API_KEY, AGENTMEMORY_SECRET, CUSTOM_API_KEY (Hermes), Cloudflare API Tokens, TLS/SSL, Webhook Tokens, NEXIFY_AUTO_CHAT_INTERNAL_TOKEN |
| **MEDIUM** | 3 | YOU_API_KEY, Resend Keys, HERMES_WEBUI_PASSWORD |

---

**Keine Klartextwerte enthalten. Nächste Überprüfung: 2026-07-11**
