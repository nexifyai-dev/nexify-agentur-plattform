# BRAIN_WRITE_AUTH_BLOCKER

**Datum:** 2026-06-14
**Erstellt durch:** Claude Code (P0-Phase 2, Block A, Abschnitt 8)
**Status:** 🔴 BLOCKED_SECRET — Schreibpfad zu NeXify Brain temporär nicht aus dieser Shell heraus nutzbar
**Schweregrad:** MITTEL — blockiert nicht Block A (Wrapper, Plugins, MCP); betrifft nur Brain-Schreibvorgänge

---

## 1. Befund

Brain-Service `nexify-brain` v1.0 läuft auf `http://127.0.0.1:9090` (PID 1180123, Python, `/opt/nexify/brain/server.py`).

### Read-Status (PASSED)
```bash
curl -sS -m 3 http://127.0.0.1:9090/health
# {"collections":["nexifyai_brain","nexifyai_memories"],"memory_count":812,"schema_version":"1","service":"nexify-brain","status":"ok","uptime":148381,"version":"1.0"}

curl -sS -m 3 -X POST -H "Content-Type: application/json" \
  -d '{"query":"test","limit":1}' http://127.0.0.1:9090/query
# {"collection":null,"count":1,"query":"test","results":[...]}
```
**Ergebnis:** Read funktioniert OHNE Auth. CLAUDE.md und BRAIN_FIRST_POLICY_V1.md werden bestätigt.

### Write-Status (BLOCKED)
```bash
# Ohne Token:
curl -X POST -d '{"collection":"nexifyai_memories","content":"test","id":"x"}' \
  http://127.0.0.1:9090/store
# {"error":"invalid X-Brain-Token"}

# Mit leerem Token:
curl -X POST -H "X-Brain-Token: " -d '{...}' http://127.0.0.1:9090/store
# {"error":"invalid X-Brain-Token"}

# Reindex/Delete gleiches Verhalten.
```

### Service-Auth-Konfiguration
```python
# /opt/nexify/brain/server.py
WRITE_TOKEN = os.environ.get("BRAIN_WRITE_TOKEN", "").strip()
if not WRITE_TOKEN: ...
return self.headers.get("X-Brain-Token", "").strip() == WRITE_TOKEN
```

**Befund:** Der `BRAIN_WRITE_TOKEN` ist im laufenden Brain-Prozess gesetzt (sonst würde der Vergleich IMMER fehlschlagen und das wäre eine andere Fehlermeldung). Aber aus dieser Claude-Session-Shell ist der Token nicht im Env und nicht in den vorhandenen Secret-Dateien zugänglich.

---

## 2. Geprüfte Token-Quellen (alle unzureichend)

| Datei | Größe | Inhalt | Bewertung |
|---|---|---|---|
| `/root/.nexify/secrets/brain-token.env` | 0 B | (leer) | ❌ leer |
| `/root/.nexify/secrets/brain-write.env` | 0 B | (leer) | ❌ leer |
| `/root/.nexify/secrets/brain-write-bot.env` | 0 B | (leer) | ❌ leer |
| `/root/.nexify/secrets/brain-tunnel.env` | 441 B | vermutlich Cloudflare-Tunnel-Token (BRAIN_TUNNEL_TOKEN) | ❌ falsche Quelle (nicht Write-Auth) |
| `/root/.nexify/secrets/brain-tunnel-token.txt` | — | existiert nicht | ❌ fehlt |
| Shell-Env `$X_BRAIN_TOKEN` / `$BRAIN_WRITE_TOKEN` | — | nicht gesetzt | ❌ nicht exportiert |

**Keine Quelle gibt den tatsächlichen `BRAIN_WRITE_TOKEN` preis, der im laufenden PID-1180123-Prozess gesetzt ist.**

---

## 3. Risiko bei eigenmächtiger Erzeugung

Das Anlegen eines neuen `BRAIN_WRITE_TOKEN` würde:
1. den laufenden Brain-Prozess nicht beeinflussen (separater Prozess, eigener Env),
2. weitere Schreibversuche aus dieser Shell weiterhin blockieren (Server vergleicht statisch gegen seinen beim Start gesetzten Token),
3. Token-Drift erzeugen (zwei nicht übereinstimmende Tokens in zwei Systemen),
4. die laufende Auth-Sicherheitskette schwächen.

**Konsequenz:** KEINE Eigenmächtige Token-Erzeugung. User-Aktion erforderlich.

---

## 4. Empfohlener User-Aktion-Plan (siehe `BRAIN_SECRET_RESTORATION_PLAN.md`)

1. `ps -p 1180123 -o pid,cmd` zeigt die laufende Brain-Binary. Der `BRAIN_WRITE_TOKEN` wurde beim Prozessstart (vermutlich via systemd nexify-brain.service) gesetzt.
2. User prüft `systemctl cat nexify-brain.service` → `Environment=`-Zeilen
3. Falls der Token dort definiert ist: Export in eine neue Datei `/root/.nexify/secrets/brain-write.env` (mode 600) — niemals in Klartext-Logs/Evidence
4. Falls nicht: Token aus dem laufenden Prozess extrahieren via `cat /proc/1180123/environ | tr '\0' '\n' | grep BRAIN_WRITE_TOKEN` (Länge prüfen, NICHT loggen) und in die kanonische Secret-Datei überführen
5. Anschließend: `source /root/.nexify/secrets/brain-write.env` in dieser Shell — dann funktioniert `X-Brain-Token: $BRAIN_WRITE_TOKEN`

---

## 5. Kein Blocker für Block A

- Auth-Wrapper funktioniert mit Bearer gegen 9Router, unabhängig von Brain
- Carta-Plugin-Deaktivierung: erfolgreich, MCP-Warnung verschwunden
- Port-Kanonisierung: durchgeführt (Wrapper, claude-env.sh, 9Router-Verifikation 200)
- Pflichtdokument-Mapping: erstellt (`PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14.md`)

Brain-Write-Pfad ist für DOKUMENTATIONS-Schreibvorgänge in dieser Session nicht nutzbar — wird in Phase 3 nach Token-Restoration adressiert.

---

*Ende BRAIN_WRITE_AUTH_BLOCKER. Stand 2026-06-14, erstellt durch Claude Code P0-Phase 2 Block A.*
