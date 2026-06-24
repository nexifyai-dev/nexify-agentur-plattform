# SECRET_ACCESS_POLICY

**Stand:** 2026-06-11  
**Version:** 1.0  
**Status:** Policy (in Kraft)

> **WICHTIG:** Dieses Dokument enthält NUR Referenzen/Platzhalter, KEINE Secret-Werte.

---

## 1. Grundsätze

### Least Privilege

Jeder Agent, jedes Tool und jeder Mensch erhält **nur die Secrets, die für seine Aufgabe zwingend notwendig sind**. Kein Exzess-Zugriff.

### Trennung der Umgebungen

| Umgebung | Zweck | Secret-Qualität | Zugriffskreis |
|:---------|:------|:----------------|:--------------|
| **DEV** | Entwicklung & Tests | Dummy-Secrets / limitierte Keys | Alle Entwickler |
| **STAGING** | Integrationstests | Echte Secrets (limitierte Rechte) | DevOps + QA |
| **PRODUCTION** | Live-System | Echte Secrets (volle Rechte) | Nur Security + DevOps |
| **SHARED** | Systemübergreifend (z.B. TLS) | Echte Secrets (eingeschränkt) | Nur Infrastruktur-Team |

### Rollenmodell

| Rolle | Beschreibung | Secrets-Zugriff |
|:------|:-------------|:----------------|
| **admin** | Vollzugriff (Menschen) | Alle Secrets, inkl. Rotation, Löschung, Audit |
| **agent** | Maschineller Zugriff (Agenten, CI/CD) | Read-only für zugewiesene Secrets |
| **deploy** | Deployment-Pipelines | Read + Write für Deployment-Secrets |
| **viewer** | Read-only (Monitoring, Audit) | Nur Secret-Namen und Metadaten, KEINE Werte |

---

## 2. Zugriffsmatrix: Welcher Agent/Welches Tool darf welches Secret?

### Agenten-Zugriff

| Secret-ID | Secret-Name | Claude Code | NeXify Router | DeepSeek | Hermes | Auto Chat |
|:----------|:------------|:------------|:--------------|:---------|:-------|:----------|
| SEC-001 | ANTHROPIC_AUTH_TOKEN | ✓ | ✗ | ✓ | ✗ | ✗ |
| SEC-002 | ANTHROPIC_API_KEY | ✗ | ✓ | ✗ | ✗ | ✗ |
| SEC-003 | DEEPSEEK_API_KEY | ✗ | ✓ | ✓ | ✗ | ✗ |
| SEC-004 | NEXIFY_ROUTER_API_KEY | ✗ | ✓ | ✗ | ✓ | ✓ |
| SEC-005 | YOU_API_KEY | ✗ | ✓ | ✗ | ✗ | ✗ |
| SEC-006 | AGENTMEMORY_SECRET | ✗ | ✗ | ✗ | ✗ | ✓ |
| SEC-007 | CUSTOM_API_KEY (Hermes) | ✗ | ✗ | ✗ | ✓ | ✗ |
| SEC-008 | OPENAI_API_KEY | ✗ | ✓ | ✗ | ✗ | ✗ |
| SEC-009 | SSH-Private-Keys | ✗ | ✗ | ✗ | ✗ | ✗ |
| SEC-010 | Cloudflare API Tokens | ✗ | ✗ | ✗ | ✗ | ✗ |
| SEC-011 | Supabase Keys | ✗ | ✓ (anon) | ✗ | ✗ | ✗ |
| SEC-012 | Resend Keys | ✗ | ✗ | ✗ | ✗ | ✗ |
| SEC-013 | Webhook Tokens | ✗ | ✓ | ✗ | ✗ | ✗ |
| SEC-014 | NEXIFY_AUTO_CHAT_INTERNAL_TOKEN | ✗ | ✗ | ✗ | ✗ | ✓ |
| SEC-015 | HERMES_WEBUI_PASSWORD | ✗ | ✗ | ✗ | ✗ | ✗ |
| SEC-017 | TLS/SSL Certificates | ✗ | ✗ | ✗ | ✗ | ✗ |

### CI/CD / Tool-Zugriff

| Secret-ID | Secret-Name | GitHub Actions | Docker Compose | Monitoring | Backup-Script |
|:----------|:------------|:---------------|:---------------|:-----------|:--------------|
| SEC-001 | ANTHROPIC_AUTH_TOKEN | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-002 | ANTHROPIC_API_KEY | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-003 | DEEPSEEK_API_KEY | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-004 | NEXIFY_ROUTER_API_KEY | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-005 | YOU_API_KEY | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-006 | AGENTMEMORY_SECRET | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-007 | CUSTOM_API_KEY (Hermes) | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-008 | OPENAI_API_KEY | ✓ (nur deploy) | ✓ | ✗ | ✗ |
| SEC-009 | SSH-Private-Keys | ✓ (deploy) | ✗ | ✗ | ✓ |
| SEC-010 | Cloudflare API Tokens | ✓ (deploy) | ✗ | ✗ | ✓ |
| SEC-011 | Supabase Keys | ✓ (deploy) | ✓ | ✗ | ✓ |
| SEC-012 | Resend Keys | ✓ (deploy) | ✓ | ✗ | ✗ |
| SEC-013 | Webhook Tokens | ✓ (deploy) | ✓ | ✗ | ✗ |
| SEC-014 | NEXIFY_AUTO_CHAT_INTERNAL_TOKEN | ✓ (deploy) | ✓ | ✗ | ✗ |
| SEC-015 | HERMES_WEBUI_PASSWORD | ✓ (deploy) | ✓ | ✗ | ✗ |
| SEC-017 | TLS/SSL Certificates | ✗ | ✓ | ✓ | ✓ |

### Menschen-Zugriff

| Secret-ID | Secret-Name | Security-Engineer | DevOps | Developer | Extern |
|:----------|:------------|:------------------|:-------|:----------|:-------|
| Beliebig | Beliebig | ✓ (voll) | ✓ (eingeschränkt) | ⚠️ (DEV only) | ✗ |

---

## 3. Zugriffsarten

| Aktion | Beschreibung | Wem erlaubt? |
|:-------|:-------------|:-------------|
| **read** | Secret-Wert einsehen | Agenten (nur zugewiesene), DevOps |
| **write** | Neuen Secret-Wert anlegen | DevOps, CI/CD (deploy) |
| **rotate** | Secret rotieren (alt → neu) | Security-Engineer, DevOps |
| **delete** | Secret endgültig löschen | Security-Engineer (nach Freigabe) |
| **audit** | Audit-Logs einsehen | Security-Engineer, Viewer |
| **break_glass** | Notfallzugriff | Security-Engineer + DevOps (2 Personen) |

---

## 4. Implementierung in Infisical

### Umgebungen

```
/ (Root)
├── dev
│   ├── SEC-001 (ANTHROPIC_AUTH_TOKEN)   → Agent: Claude Code
│   ├── SEC-002 (ANTHROPIC_API_KEY)      → Agent: NeXify Router
│   ├── ...
│   └── SEC-017 (TLS/SSL)               → Infra-Team
├── staging
│   ├── SEC-001 (ANTHROPIC_AUTH_TOKEN)   → Agent: Claude Code
│   ├── SEC-002 (ANTHROPIC_API_KEY)      → Agent: NeXify Router
│   ├── ...
│   └── SEC-017 (TLS/SSL)               → Infra-Team
└── prod
    ├── SEC-001 (ANTHROPIC_AUTH_TOKEN)   → Agent: Claude Code (read-only)
    ├── SEC-002 (ANTHROPIC_API_KEY)      → Agent: NeXify Router (read-only)
    ├── ...
    └── SEC-017 (TLS/SSL)               → Infra-Team (read-only)
```

### Rollen-Zuweisung in Infisical

| Rolle | Infisical-Rolle | Umgebungen | Berechtigungen |
|:------|:----------------|:-----------|:---------------|
| admin | Owner | alle | Vollzugriff |
| agent | Custom "agent" | dev, staging, prod | read (nur zugewiesene Ordner) |
| deploy | Custom "deploy" | alle | read + write (nur deploy-Ordner) |
| viewer | Member | alle | read (Metadaten, keine Werte) |

### Agenten-Authentifizierung

Jeder Agent bekommt ein eigenes Infisical-Service-Token mit:

- **Maschinenidentität** (z.B. `agent://claude-code`)
- **Scope** auf genau eine Umgebung und genau die benötigten Secrets
- **Kein Password** – Token-basiert, regelmässig rotiert
- **Audit-Pflicht** – Jeder read-Zugriff wird geloggt

```
Beispiel: Service-Token für Claude Code
  Scope: /prod/SEC-001
  Berechtigung: read
  Gültigkeit: 90 Tage
  Rotationspflicht: ja
```

---

## 5. Periodic Review

### Review-Intervalle

| Review-Typ | Intervall | Verantwortlich | Methode |
|:-----------|:----------|:---------------|:--------|
| Zugriffsmatrix | Monatlich | Security-Team | Automatisierter Abgleich mit Ist-Zugriffen |
| Rollen-Prüfung | Vierteljährlich | Security-Team | Rollen-Review mit Team-Leads |
| Berechtigungs-Prüfung | Vierteljährlich | DevOps | Least-Privilege-Check |
| Voll-Audit | Jährlich | Extern | Penetration-Test + Berechtigungs-Audit |

### Review-Prozess

```
Monatlich:
[  ] Alle Service-Tokens auf Gültigkeit prüfen
[  ] Abgelaufene Tokens deaktivieren
[  ] Neue Secrets in Zugriffsmatrix aufnehmen
[  ] Nicht mehr benötigte Secrets entfernen
[  ] Audit-Logs auf Anomalien prüfen

Vierteljährlich:
[  ] Rollen mit Team-Leads abgleichen
[  ] Berechtigungen auf Least-Privilege prüfen
[  ] Break-Glass-Ereignisse des Quartals reviewen
[  ] Zugriffsmatrix aktualisieren
[  ] Policy-Update (falls nötig)

Jährlich:
[  ] Externes Audit
[  ] Penetration-Test
[  ] Vollständige Berechtigungs-Prüfung
[  ] Policy-Review und -Update
```

---

## 6. Sanktionen bei Policy-Verstössen

| Verstoss | Massnahme |
|:---------|:----------|
| Secret ausserhalb der Policy verwendet | Meldung, Nachschulung |
| Secret weitergegeben (nicht autorisiert) | Zugriffsentzug, formelle Verwarnung |
| Secret in Code hardcoded | Automatischer Reject im CI/CD, manuelles Review |
| Audit-Log umgangen | Sicherheitsvorfall, sofortige Sperrung |

---

## 7. Ausnahmen

Ausnahmen von dieser Policy benötigen:

1. **Schriftlichen Antrag** an Security-Team
2. **Begründung** (warum geht es nicht anders?)
3. **Zeitliche Befristung** (max. 30 Tage)
4. **Kompensierende Kontrollen** (zusätzliches Monitoring)
5. **Freigabe** durch CTO

---

**Policy erstellt von:** NeXify Security Engineering  
**Nächstes Review:** 2026-07-11  
**Letzte Überprüfung:** 2026-06-11
