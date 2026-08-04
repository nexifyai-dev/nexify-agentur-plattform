# INCIDENT- & BACKUP/RESTORE-RUNBOOK

**NIR:** 04.08.2026  
**UPDATED:** 04.08.2026  
**OWNER:** tbd — bitte in §1 eintragen  
**STATUS:** Stub (zur Vervollständigung freigegeben)  
**RELATED:** Issue #228 · `docs/governance/GOVERNANCE.md`

---

## §0 Zweck

Dieses Dokument beschreibt das Minimalverfahren für:

1. **Incident Response** — Erkennung, Eskalation, Kommunikation, Post-mortem
2. **Backup & Restore** — Backup-Rhythmus, Restore-Drill, Verifizierung

> ⚠️ **Human-Gate:** DNS-Änderungen (DMARC `rua=`) dürfen ausschließlich von einem
> autorisierten Teammitglied durchgeführt werden. Kein Agent darf DNS-Records ändern.
> Siehe §4.

---

## §1 Runbook-Verantwortliche

| Rolle | Name | Kontakt |
|---|---|---|
| **Runbook Owner** | *(tbd)* | *(tbd)* |
| **Incident Commander** | *(tbd)* | *(tbd)* |
| **Backup Custodian** | *(tbd)* | *(tbd)* |
| **Nächster Restore-Drill** | *(tbd — Datum eintragen)* | — |

---

## §2 Incident Response

### 2.1 Schweregradstufen

| Stufe | Beschreibung | Reaktionszeit |
|---|---|---|
| **P0 – Kritisch** | Produktion vollständig ausgefallen / Datenverlust | < 15 min |
| **P1 – Hoch** | Kernfunktion beeinträchtigt, Workaround vorhanden | < 1 h |
| **P2 – Mittel** | Nicht-kritische Funktion ausgefallen | < 4 h |
| **P3 – Niedrig** | Kosmetisch, kein Nutzungseinfluss | Next sprint |

### 2.2 Ablauf (vereinfacht)

```
1. ERKENNUNG
   - Monitoring-Alert (GitHub Actions / Uptime-Check) oder Nutzermeldung
   - Triage: Schweregrad zuweisen (s. 2.1)

2. ESKALATION
   - P0/P1 → Incident Commander sofort benachrichtigen (Kanal: *(tbd)*)
   - Slack/Kanal: *(tbd)*
   - Status-Seite aktualisieren: *(URL tbd)*

3. DIAGNOSE
   - Logs prüfen: `docker compose logs --tail=200 <service>`
   - CI/CD-Pipeline-Status: GitHub Actions → Repository → Actions-Tab
   - Health-Endpunkte: `GET /api/health` (Website + Backend)

4. BEHEBUNG
   - Rollback (letztes stabiles Deployment): siehe §3.3
   - Hotfix-Branch: `bugfix/<beschreibung>` → PR → main

5. KOMMUNIKATION
   - Intern: Kanal *(tbd)* auf dem Laufenden halten
   - Extern (P0/P1): Status-Seite / Kundenkommunikation innerhalb 30 min

6. POST-MORTEM
   - Dokument in `docs/incidents/YYYY-MM-DD-<titel>.md`
   - Felder: Timeline, Root Cause, Impact, Maßnahmen, Lessons Learned
   - Review innerhalb 48 h nach Behebung
```

### 2.3 Nützliche Befehle

```bash
# Service-Status
docker compose ps

# Live-Logs
docker compose logs -f <service>

# Schnell-Neustart eines Dienstes
docker compose restart <service>

# Health-Check Website
curl -s http://localhost:3000/api/health

# Health-Check Backend
curl -s http://localhost:8000/api/health
```

---

## §3 Backup & Restore

### 3.1 Backup-Übersicht

| Datensystem | Rhythmus | Speicherort | Aufbewahrung |
|---|---|---|---|
| Supabase (Postgres) | täglich automatisch | Supabase Dashboard | 7 Tage (Free) / 30 Tage (Pro) |
| Repository (GitHub) | kontinuierlich (Git) | GitHub + GitLab Mirror | unbegrenzt |
| Vercel-Deployments | bei jedem Push | Vercel | 90 Tage |
| Secrets / Env-Vars | manuell bei Änderung | *(tbd — Passwort-Manager)* | *(tbd)* |
| Uploads / Medien | *(tbd)* | *(tbd)* | *(tbd)* |

> 🔴 **TODO (Owner):** Backup-Speicherort und Retention für Uploads/Medien eintragen.

### 3.2 Restore-Drill

**Frequenz:** Mindestens einmal pro Quartal.  
**Nächster Drill:** *(tbd — Datum in §1 eintragen)*

Drill-Ablauf:
1. Backup-Snapshot identifizieren (Datum + Hash notieren)
2. Restore in Staging-Umgebung durchführen
3. Smoke-Tests ausführen: `npm run smoke-test` (Website) + `pytest tests/smoke/` (Backend)
4. Ergebnis dokumentieren: `docs/incidents/drill-YYYY-MM-DD.md`

### 3.3 Rollback (Deployment)

```bash
# Letztes funktionierendes Deployment auf main feststellen
git log --oneline main | head -10

# Rollback via Revert-Commit (bevorzugt, kein Force-Push)
git revert <commit-sha> --no-edit
git push origin main

# Alternativ: Vercel-Rollback über Dashboard
# Vercel → Project → Deployments → gewünschtes Deployment → "Promote to Production"
```

> ⚠️ **Kein Force-Push auf `main`** — gemäß `CLAUDE.md` Hard-Stop.

### 3.4 Datenbank-Restore (Supabase)

1. Supabase Dashboard → Project → Database → Backups
2. Backup auswählen → „Restore"
3. Downtime einplanen (Restore dauert je nach Größe 5–30 min)
4. Nach Restore: Applikation neu starten + Health-Checks durchführen

---

## §4 DMARC `rua=` — Human-Gate

**Status:** ⏳ Ausstehend — muss von einem autorisierten Teammitglied erledigt werden.

### Hintergrund

Der aktuelle DMARC-Record enthält `rua=mailto:<privates Gmail>`. Dies ist operativ
problematisch, da Aggregate-Reports an eine private Mailbox gehen und bei
Mitarbeiterwechsel nicht mehr zugänglich sind.

### Erforderliche Aktion (Human only)

1. **Shared Mailbox anlegen** (z. B. `dmarc-reports@nexifyai.cloud` oder ähnlich)
2. **DNS-Record aktualisieren:**
   ```
   _dmarc.nexifyai.cloud  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@nexifyai.cloud; ruf=mailto:dmarc-reports@nexifyai.cloud; fo=1"
   ```
3. **Verifizieren:** MXToolbox DMARC-Check oder `dig TXT _dmarc.nexifyai.cloud`
4. **Dieses Dokument aktualisieren:** Datum + durchführende Person eintragen

> **Kein Agent darf DNS-Records oder MX-Konfigurationen ändern.**
> Dieser Schritt ist explizit als Human-Gate klassifiziert (Issue #228, Kommentar @nexifyai-dev).

### Erledigungsvermerk

| Feld | Wert |
|---|---|
| Erledigt am | *(tbd)* |
| Durchgeführt von | *(tbd)* |
| Neue rua-Adresse | *(tbd)* |
| DNS-Propagation geprüft | *(tbd)* |

---

## §5 Weiterführende Dokumente

- `docs/governance/GOVERNANCE.md` — Produktions-Freigabeprozess
- `docs/operations/DAILY-SMOKE.md` — tägliche Health-Checks
- `docs/operations/GITHUB-SECURITY-OVERVIEW.md` — Security-Scanning
- `docs/operations/QUALITY-GATES.md` — Release-Gates
- `docs/incidents/` — Post-mortem-Ablage *(Verzeichnis bei erstem Incident anlegen)*
