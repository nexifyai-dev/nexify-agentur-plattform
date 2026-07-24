# SECRET_MANAGEMENT_TARGET_ARCHITECTURE

## Zielarchitektur für zentrale Secret-Verwaltung in NeXify

**Stand:** 2026-06-11  
**Status:** Vorschlag / Target  
**Version:** 1.0

---

## 1. Anforderungskatalog

| ID | Anforderung | Priorität | Beschreibung |
|:---|:------------|:----------|:-------------|
| F-001 | Zentrale Speicherung | MUSS | Alle Secrets an einem Ort, kein Verteilen über .env-Dateien |
| F-002 | Referenzierung | MUSS | Apps/Agenten referenzieren Secrets über ID statt Hardcoding |
| F-003 | Maskierung | MUSS | Secrets werden in Logs/Outputs automatisch maskiert |
| F-004 | Rotation | MUSS | Secrets müssen (halb-)automatisch rotierbar sein |
| F-005 | Self-Hosting | MUSS | System läuft auf eigener Infrastruktur |
| F-006 | CLI-Fähigkeit | MUSS | Vollständige CLI-Steuerung für CI/CD und Automation |
| F-007 | MCP/Agent-Fähigkeit | SOLL | Anbindung an MCP-fähige Agenten möglich |
| F-008 | Audit-Logs | MUSS | Jeder Zugriff wird protokolliert (wer, wann, welches Secret) |
| F-009 | Backup/Restore | MUSS | Vollständige Backup- und Restore-Funktionalität |
| F-010 | Break-Glass | MUSS | Notfallzugriff ohne normale Autorisierung, mit Audit-Pflicht |
| F-011 | Least Privilege | MUSS | Feingranulare Zugriffsrechte pro Secret |
| F-012 | CI/CD-Integration | SOLL | Nahtlose Einbindung in CI/CD-Pipelines |
| F-013 | Kostenfrei | MUSS | Open-Source-Lizenz, keine versteckten Kosten |
| F-014 | Verschlüsselung at rest | MUSS | Secrets ruhen verschlüsselt |
| F-015 | Verschlüsselung in transit | MUSS | TLS für alle API-Zugriffe |
| F-016 | Hochverfügbarkeit | SOLL | Ausfallsicherheit durch Clustering |

---

## 2. Kandidatenprüfung

### 2.1 Doppler Free

| Kriterium | Bewertung |
|:----------|:----------|
| Kostenfrei | ✓ (Free Tier bis 5 Secrets, eingeschränkt) |
| Self-hostbar | ✗ (SaaS only) |
| CLI-fähig | ✓ (doppler CLI) |
| MCP/Agent-fähig | ⚠️ (über API möglich) |
| Audit-Logs | ✓ |
| Rotation | ⚠️ (manuell) |
| Backup/Restore | ⚠️ (über API exportierbar) |
| Break-Glass | ✗ |
| Least Privilege | ✓ (Umgebungen/Projekte) |
| **Fazit** | Wegen fehlendem Self-Hosting und kostenintensivem Free Tier nicht geeignet. |

### 2.2 Infisical Community

| Kriterium | Bewertung |
|:----------|:----------|
| Kostenfrei | ✓ (Community Edition, voll Open Source) |
| Self-hostbar | ✓ (Docker Compose / Kubernetes) |
| CLI-fähig | ✓ (infisical CLI) |
| MCP/Agent-fähig | ✓ (REST API + SDKs) |
| Audit-Logs | ✓ |
| Rotation | ✓ (Secret-Rotation-Feature) |
| Backup/Restore | ✓ (Export/Import über CLI) |
| Break-Glass | ⚠️ (über Approval Workflows) |
| Least Privilege | ✓ (Rollen, Umgebungen, Ordner) |
| CI/CD | ✓ (Native Integrationen) |
| **Fazit** | Sehr gut geeignet. Einzige Schwäche: Break-Glass nur eingeschränkt. |

### 2.3 HashiCorp Vault OSS

| Kriterium | Bewertung |
|:----------|:----------|
| Kostenfrei | ✓ (OSS, keine Enterprise-Features) |
| Self-hostbar | ✓ (Binary, Docker, K8s) |
| CLI-fähig | ✓ (vault CLI) |
| MCP/Agent-fähig | ✓ (REST API + Agent Sidecar) |
| Audit-Logs | ✓ |
| Rotation | ✓ (Dynamic Secrets + Static Leases) |
| Backup/Restore | ✓ (Raft Snapshot / Auto-Unseal) |
| Break-Glass | ⚠️ (Emergency Seal/Unseal) |
| Least Privilege | ✓ (Policies, Namespaces) |
| CI/CD | ✓ (Agent-Cache, Token-Helper) |
| **Fazit** | Extrem mächtig, aber hohe Betriebskomplexität. Break-Glass unzureichend dokumentiert in OSS. |

### 2.4 Bitwarden CLI / Vaultwarden

| Kriterium | Bewertung |
|:----------|:----------|
| Kostenfrei | ✓ (Vaultwarden als Community Fork) |
| Self-hostbar | ✓ (Vaultwarden Docker) |
| CLI-fähig | ✓ (bw CLI) |
| MCP/Agent-fähig | ⚠️ (Keine native MCP-API) |
| Audit-Logs | ⚠️ (Event Logs eingeschränkt) |
| Rotation | ✗ (Keine Auto-Rotation) |
| Backup/Restore | ✓ (Export/Import) |
| Break-Glass | ✗ |
| Least Privilege | ⚠️ (Collections, aber granular) |
| **Fazit** | Geeignet für Passwort-Management, nicht für Infrastruktur-Secrets. |

### 2.5 SOPS + age (Mozilla SOPS)

| Kriterium | Bewertung |
|:----------|:----------|
| Kostenfrei | ✓ (Open Source) |
| Self-hostbar | ✓ (Lokale Dateien) |
| CLI-fähig | ✓ (sops CLI) |
| MCP/Agent-fähig | ⚠️ (Keine API, nur Datei-basiert) |
| Audit-Logs | ✗ (Kein audit trail) |
| Rotation | ✗ (Manuell via Neuverschlüsselung) |
| Backup/Restore | ✓ (Datei-Backup) |
| Break-Glass | ⚠️ (age-Key vorhanden) |
| Least Privilege | ✗ (Alles-oder-Nichts) |
| **Fazit** | Gut für verschlüsselte Dateien, nicht als zentrales Secret-Management. |

### 2.6 Mozilla SOPS (mit Cloud-KMS)

| Kriterium | Bewertung |
|:----------|:----------|
| Kostenfrei | ✓ (SOPS selbst OSS, KMS kostet) |
| Self-hostbar | ⚠️ (Abhängig von Cloud-KMS) |
| CLI-fähig | ✓ |
| MCP/Agent-fähig | ⚠️ |
| Audit-Logs | ⚠️ (Cloud-KMS Logs, kein App-Scope) |
| Rotation | ✗ |
| **Fazit** | Wie SOPS+age, nur mit Cloud-Backend. Nicht empfohlen. |

---

## 3. Empfehlung

**Empfohlen: Infisical Community Edition (Self-Hosted)**

### Begründung

1. **Vollständig Open Source** – Keine Paywalls oder versteckten Kosten.
2. **Self-Hosting** – Einfach per Docker Compose deploybar.
3. **CLI + REST API** – Vollständig automatisierbar in CI/CD und Agent-Integration.
4. **Audit-Logs** – Jeder Zugriff wird mit Zeitstempel und Identität protokolliert.
5. **Least Privilege** – Rollenbasiert mit Umgebungen (Dev/Staging/Prod).
6. **MCP-Fähigkeit** – REST API erlaubt einfache MCP-Server-Implementierung.
7. **Aktiv maintained** – Regelmäßige Releases und Community-Support.
8. **Secret-Referenzierung** – Kein Hardcoding, nur Environment-Injection und API-Abfragen.

### Kompromisse

| Bereich | Kompromiss | Mitigation |
|:--------|:-----------|:-----------|
| Break-Glass | Nicht nativ | Eigenes Skript mit Infisical-API + manuellem Approval |
| Hochverfügbarkeit | Nur Single-Node | Später auf K8s mit DB-Cluster migrierbar |
| Rotation | Manuell via CLI/API | Eigenes Rotations-Skript auf Basis von GitOps |

### Alternativ-Szenario

Falls Infisical nicht in Frage kommt: **HashiCorp Vault OSS** als Zweitwahl.
Aufwand für Betrieb und Wartung ist ca. 3–5× höher.

---

## 4. Migrationspfad

### Aktueller Zustand (Ist)
```
┌─────────┐     ┌──────────────┐     ┌──────────────┐
│ .env    │────→│ Hardcoded    │────→│ Agenten/Apps │
│ Dateien │     │ in Code      │     │              │
└─────────┘     └──────────────┘     └──────────────┘
```
- Secrets verteilt auf .env-Dateien, docker-compose.yml, CI/CD-Variablen
- Keine Audit-Logs
- Keine Rotation
- Keine Trennung Dev/Staging/Prod

### Phase 1: Inventory & Analyse (Woche 1–2)
- [ ] Alle Secrets identifizieren und in SECRET_INVENTORY_REGISTER.md dokumentieren
- [ ] Abhängigkeiten zwischen Secrets und Systemen ermitteln
- [ ] Berechtigungsmatrix erstellen (wer braucht was)

### Phase 2: Infrastruktur aufsetzen (Woche 2–3)
- [ ] Infisical auf Docker-Server deployen (docker-compose)
- [ ] Ersten Admin-Account anlegen
- [ ] Backup-Strategie einrichten (tägliches Backup der DB)
- [ ] TLS-Zertifikat für Infisical-API konfigurieren
- [ ] CLI-Authentifizierung einrichten

### Phase 3: Secrets migrieren (Woche 3–4)
- [ ] Secrets in Infisical anlegen (mit Umgebungen Dev/Staging/Prod)
- [ ] CI/CD-Variablen durch Infisical-Referenzen ersetzen
- [ ] Agenten-Konfigurationen umstellen (MCP-Client → Infisical-CLI)
- [ ] docker-compose.yml auf Infisical-Referenzen umstellen
- [ ] Testlauf: Alle Systeme laufen mit Infisical-Referenzen

### Phase 4: Altsysteme deaktivieren (Woche 4)
- [ ] .env-Dateien aus Production-Zugriff entfernen
- [ ] Hardcodierte Secrets aus Code entfernen (durch Referenzen ersetzen)
- [ ] Alte CI/CD-Variablen löschen
- [ ] Audit-Pfad verifizieren

### Phase 5: Betrieb (Woche 4+)
- [ ] Rotation nach Plan durchführen
- [ ] Regelmäßige Audits
- [ ] Break-Glass-Übungen
- [ ] Backup-Restore-Tests

---

## 5. Architektur-Diagramm (ASCII-Art)

```
                              ┌──────────────────────────────────────┐
                              │          NeXify Infrastruktur         │
                              └──────────────────────────────────────┘

                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                          INFISICAL (Self-Hosted)                           │
│  ┌──────────────────────────────────────────────────────────────────┐     │
│  │                         Secret Store                             │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │ Dev      │  │ Staging  │  │ Prod     │  │ Shared   │        │     │
│  │  │ Secrets  │  │ Secrets  │  │ Secrets  │  │ (TLS etc)│        │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │     │
│  └──────────────────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────────────────┐     │
│  │                         Audit-Log                                │     │
│  │  [2026-06-11 10:00] User: agent-router | Action: read | Secret: │     │
│  │  [2026-06-11 10:01] User: deploy-bot  | Action: write | Secret: │     │
│  └──────────────────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────────────────┐     │
│  │                         Zugriffskontrolle                        │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │ Admin    │  │ Agent    │  │ CI/CD    │  │ Viewer   │        │     │
│  │  │ Full     │  │ Read-only│  │ Read/Write│  │ Read-only│        │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │     │
│  └──────────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────┘
          │                    │                     │
          ▼                    ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│   Agenten    │    │ CI/CD (GH)   │    │ Menschen (Devs)  │
│ ┌──────────┐ │    │ ┌──────────┐ │    │ ┌──────────────┐ │
│ │ Claude   │ │    │ │ Deploy   │ │    │ │ SSH/API-Zgr. │ │
│ │ DeepSeek │ │    │ │ Pipeline │ │    │ │ Admin-Konsole│ │
│ │ Router   │ │    │ │ Tests    │ │    │ └──────────────┘ │
│ └──────────┘ │    │ └──────────┘ │    └──────────────────┘
└──────────────┘    └──────────────┘
       │                    │
       ▼                    ▼
┌──────────────────────────────────────────────────┐
│              CLI/API-Zugriff                      │
│  infisical run --command="node app.js"            │
│  curl -H "Authorization: Bearer $TOKEN" ...       │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│              Backup/Restore                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ DB-Dump  │───→│ Verschl. │───→│ S3/GCS   │   │
│  │ täglich  │    │ Export   │    │ Cold     │   │
│  └──────────┘    └──────────┘    └──────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │ Break-Glass: Manuelles Ausführen eines    │   │
│  │ Scripts, das auf Infisical-API zugreift   │   │
│  │ und im Audit-Log dokumentiert wird.       │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## 6. Nächste Schritte

1. [ ] Entscheidung für Infisical oder Alternative finalisieren
2. [ ] Test-Instanz aufsetzen (Docker Compose)
3. [ ] Erste Secrets migrieren (niedriges Risiko)
4. [ ] Rollback-Plan validieren
5. [ ] Produktions-Rollout planen

---

**Dokument erstellt von:** NeXify Security Engineering  
**Nächstes Review:** 2026-07-11
