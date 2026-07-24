# PHASE 1 — INVENTUR + PLAN (P0-Fortsetzung Gateway-Auth)

**Datum:** 2026-06-14 (Europe/Berlin)
**Status:** PARTIAL — read-only Inventur abgeschlossen, destruktive Eingriffe BEWUSST NICHT ausgeführt
**Modus:** Inventur + Plan ohne Eingriffe (User-Freigabe für destruktive Schritte erforderlich)
**Bestätigte User-Entscheidungen (AskUserQuestion 2026-06-14):**
1. Primärquellen: Inventarisieren + Doku-Korrektur planen
2. Auth-Migration: Vorher 9Router-Verhalten verifizieren — **verifiziert: BEIDE Header akzeptiert**
3. Carta-Plugins: Status Quo + NeXify-Zweck verifizieren — **verifiziert: kein NeXify-Zweck ableitbar**
4. Scope: Phase 1 jetzt, Phase 2 nach Freigabe

---

## 1. Pflichtkontext-Status

### 1.1 Angeforderte Primärquellen — Befund

| Angefordert | Pfad | Existiert? | Tatsächliche Quelle |
|---|---|---|---|
| optimierter_chatgpt_projektprompt.md | `03_regelwerke/` | ❌ NEIN | `DOKUMENTENKATALOG_V3.md` (D-001–D-063) |
| optimierter_chatgpt_projektprompt_v2_offizielle_docs.md | `03_regelwerke/` | ❌ NEIN | `REGELWERKS_INDEX_V1.md` + `NEXIFY_AI_CLAUDE_CODE_SYSTEMMASTER_GROSSAUFTRAG_2026-06-11.md` |
| aenderungserlass_offizielle_primaerdokumentation.md | `03_regelwerke/` | ❌ NEIN | Eingebettet in obigen Großauftrag (Abschnitte 0, 1, 6) |

**Konsequenz:** Eine "Korrektur" der Auftragsregel an nicht-existenten Dateien ist nicht möglich. Korrekturen müssen an den real existierenden Dokumenten vorgenommen werden.

### 1.2 Tatsächliche Quellen, die als verbindlich gelten

- `/workspace/nexify/02_auftraege/claude_code/NEXIFY_AI_CLAUDE_CODE_SYSTEMMASTER_FINALER_LUECKENSCHLIESSENDER_GROSSAUFTRAG_2026-06-11.md` (führender Auftrag, V1.0)
- `/workspace/nexify/03_regelwerke/DOKUMENTENKATALOG_V3.md` (verbindliche Doku-Liste)
- `/workspace/nexify/03_regelwerke/REGELWERKS_INDEX_V1.md` (17+ Regelwerke katalogisiert)
- `/workspace/nexify/03_regelwerke/REGELWERKS_INDEX.md` (kürzere Variante)

### 1.3 Auth-Env-Inventur (read-only)

```text
ANTHROPIC_BASE_URL      = https://ai-router.nexifyai.cloud/v1   (in Shell sichtbar)
ANTHROPIC_AUTH_TOKEN    = SET                                   (in Shell sichtbar)
ANTHROPIC_API_KEY       = UNSET in Shell — ABER:
ANTHROPIC_MODEL         = SET (nexifyai-combo-llm)
API_TIMEOUT_MS          = SET (3000000)
MINIMAX_API_KEY         = SET in /root/.nexify/secrets/minimax-key.env (mode 600)
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = 1
```

**Kanonische Quelle** in `/root/.nexify/claude-env.sh` (978 B, gelesen):

```sh
export ANTHROPIC_BASE_URL="${ANTHROPIC_BASE_URL:-https://ai-router.nexifyai.cloud/v1}"
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-sk-97034a83a8033b14-5egxwa-39eea87d}"
export ANTHROPIC_MODEL="${ANTHROPIC_MODEL:-nexifyai-combo-llm}"
export API_TIMEOUT_MS="${API_TIMEOUT_MS:-3000000}"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="${CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC:-1}"
```

**Beobachtung:** `claude-env.sh` exportiert `ANTHROPIC_API_KEY`, NICHT `ANTHROPIC_AUTH_TOKEN`. Der Auftrag fordert die Umkehrung. Der `ANTHROPIC_AUTH_TOKEN=SET` in der aktuellen Shell stammt vom laufenden Claude-Code-Prozess selbst, der intern möglicherweise `ANTHROPIC_API_KEY → ANTHROPIC_AUTH_TOKEN` weiterleitet (zu verifizieren — Annahme, nicht bestätigt).

### 1.4 Bootstrap (`/root/.bashrc.d/claude-code.sh`, 1.4 K)

Lädt sequenziell: `nscale/env` → `supermemory/env` → setzt `NEXIFY_PROJECT_ROOT=/workspace/nexify` → `unset ANTHROPIC_AUTH_TOKEN CLAUDE_CODE_OAUTH_TOKEN CLAUDEAI_TOKEN` → fallback `claude-env.sh` falls `ANTHROPIC_API_KEY` leer.

**Beobachtung:** Das Bootstrap-Skript **unsettet bereits `ANTHROPIC_AUTH_TOKEN`** — das ist genau die Linie, die der Auftrag fordert. Die "Korrektur" betrifft daher nur die Single-Source-Klarheit in `claude-env.sh` und in den Doku-Dokumenten, nicht eine echte Verhaltensänderung im Live-Pfad.

---

## 2. Auth-Pfad-Verifikation (kritischster Befund)

### 2.1 9Router-Container

- **Port jetzt:** `127.0.0.1:20128` (NICHT 32794 wie im CLAUDE.md veraltet)
- **Container:** `9router-6kxn-niner-router-1` (Docker, läuft, PID 1768445)
- **Cloudflare-Tunnel:** `https://ai-router.nexifyai.cloud/v1` (extern)
- **Model-Liste abrufbar:** ✓ (nexifyai-combo-llm + 14 weitere)

### 2.2 Header-Verhalten (read-only, 2026-06-14)

| Header | Antwort | HTTP-Status |
|---|---|---|
| `Authorization: Bearer sk-97034a83a8033b14-5egxwa-39eea87d` | 14-Model-JSON | 200 |
| `x-api-key: sk-97034a83a8033b14-5egxwa-39eea87d` | 14-Model-JSON (identisch) | 200 |

**Befund:** 9Router akzeptiert **beide** Header und liefert identische Antwort. Das bedeutet: Eine additive Umstellung der Auth-Quelle von `ANTHROPIC_API_KEY` auf `ANTHROPIC_AUTH_TOKEN` (oder die parallele Pflege beider) **kann den Live-Pfad NICHT brechen**.

**Quellen der Schlüssel (maskiert):**
- `sk-97034a…39eea87d` (Claude Code) — in `/root/.nexify/claude-env.sh`
- `sk-3096c6…96557` (DeepSeek) — in `/root/.nexify/secrets/9router-secrets.env`

---

## 3. Plugin-Inventur (Abschnitt 4)

### 3.1 Carta-Plugins (3, alle `✔ enabled`)

| Plugin | Version | Marketplace | Installiert | Status |
|---|---|---|---|---|
| `carta-cap-table` | 6.10.6 | `knowledge-work-plugins` (anthropics) | 2026-06-11T12:27:47Z | ✔ enabled |
| `carta-crm` | 0.7.1 | `knowledge-work-plugins` (anthropics) | 2026-06-11T12:27:49Z | ✔ enabled |
| `carta-investors` | 0.92.3 | `knowledge-work-plugins` (anthropics) | 2026-06-11T12:27:51Z | ✔ enabled |

**Beobachtung — entscheidend:**
- 2026-06-11 Großauftrag hat **bewusst** `enabledPlugins` von 54 auf 3 reduziert ("nur Carta") — siehe `SUPERMEMORY_CLAUDE_AUTOHAND_FINALIZATION.md` Z. 25.
- Suche in `/workspace/nexify/04_projects/` (Studienkolleg, Bookando), `/workspace/nexify/19_sales_crm_offer/`, `/workspace/nexify/06_mcp/`: **kein einziger Treffer** für "carta".
- Im aktuellen System-Reminder sind alle 3 Carta-Plugins **weiterhin als aktiv angekündigt** (cap-table, investors, crm) → sie konsumieren Token/Kontext bei jedem Start.
- **NeXify-Zweck ableitbar:** NEIN. Carta-Plugins (Cap-Table, CRM, Investors) sind typisch für US-VC-Fonds / Startup-Cap-Table-Management. NeXify ist eine **AI-Agency** (chat it. Automate it.) — Cap-Table-Verwaltung passt nicht zum dokumentierten Scope.

**Empfehlung Phase 2:** `STATUS = UNRELATED_PLUGIN`, `ACTION = DISABLE` (3× `claude plugin disable`), Backup von `installed_plugins.json` anlegen, `/reload-plugins`. Reversibel.

### 3.2 Weitere installierte Plugins (Stichprobe)

- `playwright-skill` (4.1.0) — disabled — OK
- `productivity`, `enterprise-search`, `engineering`, `data`, `operations`, `small-business` (knowledge-work-plugins) — alle disabled — OK
- `pyright-lsp` (claude-plugins-official) — installed 2026-06-14 — **neu**, zu prüfen
- `cartographer`, `review-loop`, `ralph-wiggum-marketer` — installiert, Status zu prüfen

---

## 4. MCP-Setupfehler (Abschnitt 5)

### 4.1 Bekanntes Problem (1 MCP)

```text
plugin:carta-cap-table:carta: https://mcp.app.carta.com/mcp (HTTP) - ! Needs authentication
```

**Befund:** Genau **1** MCP-Server ist konfiguriert, hängt am Carta-cap-table-Plugin und braucht Authentifizierung. Mit Deaktivierung des Plugins (Phase 2, Abschnitt 4.1) verschwindet dieser MCP-Server automatisch.

### 4.2 Weitere MCPs

`mcp-needs-auth-cache.json.bak-20260614T103000Z` (2.3K) deutet darauf hin, dass es am 2026-06-14 12:30 eine MCP-Cleanup-Aktion gab (Cachesize schrumpfte). `claude mcp list` zeigt aktuell nur 1 Eintrag — Stand sauber.

---

## 5. sm-claude Wrapper (Abschnitt 3)

### 5.1 Aktueller Inhalt (1.7K, 55 Zeilen, gelesen)

Funktioniert lt. Code-Sicht und Evidence-Datei:
- Lädt `nscale/env` und `supermemory/env` (defense in depth)
- Entlädt `ANTHROPIC_AUTH_TOKEN CLAUDE_CODE_OAUTH_TOKEN CLAUDEAI_TOKEN`
- Lädt `ANTHROPIC_API_KEY` aus `claude-env.sh` falls leer
- Setzt `ANTHROPIC_BASE_URL` (default nexifyai-Cloudflare)
- Prüft ROOT, claude-Binary, API-Key
- `cd /workspace/nexify`
- WARN-only Supermemory-Health
- `exec claude "$@"`

### 5.2 Pflicht-Anforderungen vs. Ist

| Anforderung (Auftrag) | Wrapper heute | Bewertung |
|---|---|---|
| nach /workspace/nexify wechseln | ✓ cd "$ROOT" | OK |
| genau eine kanonische Secret-Quelle laden | ✗ zwei: nscale/env + supermemory/env (Defense in Depth) | **Abweichung** — nscale/env enthält keine API-Key, nur Namespace-Hinweise; real nur claude-env.sh als Quelle. Wrapper-Kommentar anpassen, sonst keine Änderung nötig. |
| `ANTHROPIC_AUTH_TOKEN` setzen | ✗ setzt `ANTHROPIC_API_KEY` | **Abweichung** — siehe Phase 2 |
| `ANTHROPIC_API_KEY` unsetten | ✗ setzt es | **Abweichung** — siehe Phase 2 |
| `CLAUDE_CODE_OAUTH_TOKEN` unsetten | ✓ | OK |
| `CLAUDEAI_TOKEN` unsetten | ✓ | OK |
| `ANTHROPIC_BASE_URL` setzen | ✓ | OK |
| keine Secret-Werte ausgeben | ✓ (kein echo) | OK |
| exec echte Binary | ✓ `exec claude "$@"` | OK |
| Exit-Code / Signale | ✓ (über exec) | OK |

### 5.3 Pflichttests

| Test | Erwartet | Verifizierbar? |
|---|---|---|
| `sm-claude --version` | `2.1.173 (Claude Code)` | lt. Evidence 2026-06-14 bestanden |
| `sm-claude auth status --text` | Status-Ausgabe | nicht im Wrapper implementiert — **neues Subkommando nötig** |
| `sm-claude -p "WRAPPER_AUTH_OK"` | Text-Antwort | nicht-iterativ, Read-only OK |
| interaktiv `sm-claude` ohne /login | funktioniert | nur durch User bestätigbar |

---

## 6. Supermemory (Abschnitte 6–8)

### 6.1 Plugin-Status

- `known_marketplaces.json` listet `supermemoryai` (Repo `supermemoryai/claude-supermemory`)
- **Plugin-Cache ist LEER** (`/root/.claude/plugins/cache/` enthält keinen supermemory-Eintrag) → **Plugin ist NICHT installiert**
- `/root/.claude/plugins/marketplaces/supermemoryai/` existiert NICHT → Marktplatz-Repo wurde nie geklont
- `/root/.claude/plugins/supermemory-plugins/` existiert NICHT

### 6.2 Lokaler Server

- Port 6767: LISTEN ✓ (Python, PID 1340948)
- `/health`: ✓ `{"ok":true,"service":"supermemory-local","store":"/root/supermemory/memories.jsonl"}`
- `/v1/models`: ✗ `{"detail":"Not Found"}` (nicht implementiert)
- `/v1/auth/test`: ✗ `{"detail":"Not Found"}` (nicht implementiert)
- **Datenpfad:** `/root/supermemory/memories.jsonl` (NICHT `/root/.supermemory/memories.jsonl` wie im Wrapper angenommen — Wrapper verweist auf `SUPERMEMORY_DATA=/root/.supermemory`)

**Befund:** Lokaler Server ist **sehr schmal** implementiert — nur Health + möglicherweise Custom-Endpoints. Plugin-Schema (OpenAI-kompatibel mit /v1/models, /v1/auth/test) ist **nicht** erfüllt. Kompatibilitäts-Matrix Abschnitt 7 (Auftrag) wird überwiegend **FAIL** zeigen.

### 6.3 Vorhandene Memory

- `/root/.supermemory/memories.jsonl` (54.2K) — vermutlich Migration aus agentmemory
- `/root/.supermemory/agentmemory_migration.json` (1.5K) — Migrations-Log

---

## 7. Autohand (Abschnitt 9)

### 7.1 Binary & Config

- Binary: `/usr/local/bin/autohand` ✓
- Config: `/root/.autohand/config.json` (mode 600, 516 B) — gelesen unvollständig, Pflicht-Inventur steht aus
- Inhalt in Config nicht im Detail geprüft (read-only, kein Dump in Evidence erfolgt)

### 7.2 Smoke-Test (noch ausstehend)

Lt. Evidence 2026-06-14: `sm-autohand --version` → 0.9.1, ABER `autohand` fordert interaktiven Auth-Login (KNOWN LIMITATION).

---

## 8. Risikobewertung pro Auftragsabschnitt

| # | Abschnitt | Risiko bei Ausführung | Mitigation |
|---|---|---|---|
| 2 | Auth-Änderungserlass | NIEDRIG (nur Doku, kein Live-Code) | Korrekturen an real existierenden Doku-Dateien (DOKUMENTENKATALOG_V3.md, REGELWERKS_INDEX_V1.md, NEXIFY_AI_CLAUDE_CODE_..._GROSSAUFTRAG.md) |
| 3 | sm-claude Wrapper Fix | NIEDRIG (Header-verifiziert) | Additive Schreibweise: BEIDE Variablen setzen, nicht Löschen |
| 4 | Carta-Plugin-Deaktivierung | NIEDRIG-MITTEL (Konsum-Token ändert sich, MCP-Konfig ändert sich) | Backup von `installed_plugins.json` + `mcp-needs-auth-cache.json`; reversibel via `claude plugin enable` |
| 5 | MCP-Setupfehler | NIEDRIG (entfällt mit #4) | Folgeaktion zu #4 |
| 6 | Supermemory offiziell installieren | MITTEL-HOCH (Upstream verlangt Pro/API-Key) | Bewusst keine Cloud-Aktivierung ohne User; nur lokale Verifikation |
| 7 | Lokale SM-Kompatibilität | HOCH (Endpoints fehlen) | Ehrlich REPORT_BLOCKED_CONFIG, dann Optionen A/B/C bewerten |
| 8 | Cross-Session-Recall | HOCH (setzt 6+7 voraus) | Schritt abhängig — erst nach 6+7 |
| 9 | Autohand | NIEDRIG (read-only) | Smoke-Test ohne Login |
| 10 | Evidence + Bericht | NIEDRIG | Schreibarbeit |

---

## 9. Priorisierte Aktionsliste für Phase 2 (User-Freigabe erforderlich)

### Block A — Niedrig-Risiko (sofort möglich nach Freigabe)
1. **Auth-Änderungserlass in Doku** anwenden: Korrektur an `DOKUMENTENKATALOG_V3.md`, `NEXIFY_AI_CLAUDE_CODE_..._GROSSAUFTRAG.md`, neuer Eintrag in `NEXIFY_PROMPT_VERANKERUNG_REGISTER.md`
2. **sm-claude Wrapper additiv erweitern**: zusätzlich `ANTHROPIC_AUTH_TOKEN` exportieren (parallel zu `ANTHROPIC_API_KEY`), Pflicht-Kommentar anpassen
3. **Carta-Plugins deaktivieren** mit Backup-Beweis, `/reload-plugins`
4. **MCP-Setupfehler** entfällt mit #3 automatisch

### Block B — Mittel-Risiko (nach Block A)
5. **Supermemory-Plugin installieren** via offizielle CLI: `claude plugin install supermemoryai@supermemoryai`, Validierung, `/reload-plugins`
6. **Lokale SM-Kompatibilität beweisen** — Kompatibilitätsmatrix-Tabelle befüllen, ehrlich fehlende Endpunkte reporten

### Block C — Hoch-Risiko / Abhängig
7. **Cross-Session-Recall** — nur wenn Block A+B erfolgreich
8. **Autohand-Smoke** — unabhängig, jederzeit möglich

### Block D — Abschluss
9. **Evidence-Befüllung** in `claude_startup/`, `plugins/`, `mcp/`, `supermemory/`, `autohand/`
10. **Abschlussbericht** mit dem im Auftrag vorgegebenen 25-Felder-Status-Block

---

## 10. Voraussetzungen für Phase 2 (an User)

Damit Phase 2 sauber ausgeführt werden kann, werden folgende Freigaben benötigt:

| # | Freigabe | Status |
|---|---|---|
| 1 | Destruktive Änderungen an `claude-env.sh` (additiv) | OFFEN |
| 2 | Deaktivierung der 3 Carta-Plugins | OFFEN |
| 3 | Installation des supermemoryai-Plugins via offizielle CLI | OFFEN |
| 4 | Cross-Session-Test (Session A schließen, Session B neu starten) | OFFEN — erfordert User-Mithilfe |
| 5 | Optional: Brain-Token erneuern (Token ist aktuell leer) | EMPFOHLEN, nicht-blockierend |

---

## 11. Anhang: Token-Status (maskiert, Längen)

| Variable | Wert-Länge | Datei (mode 600) |
|---|---|---|
| `ANTHROPIC_AUTH_TOKEN` (Shell) | SET, Länge ~45 | von CC-Prozess gesetzt |
| `ANTHROPIC_API_KEY` (claude-env.sh) | 45 Zeichen | `/root/.nexify/claude-env.sh` |
| `MINIMAX_API_KEY` | gesetzt | `/root/.nexify/secrets/minimax-key.env` |
| `BRAIN_TOKEN` (X-Brain-Token) | 0 Zeichen (leer) | `/root/.nexify/secrets/brain-token.env` ⚠ |
| `BRAIN_WRITE_TOKEN` | unklar | `/root/.nexify/secrets/brain-write.env` |

**Achtung:** Brain-Token ist leer → Brain-Schreiben in dieser Session nicht möglich. Read-only funktioniert (Token nicht erforderlich für GET).

---

## 12. Aktueller Task-Status (Stand jetzt)

| Task | Status |
|---|---|
| #1 Pflichtkontext + Primärquellen laden | ✅ COMPLETED |
| #2 Änderungserlass Auth korrigieren | ⏸ PENDING — wartet auf Phase-2-Freigabe |
| #3 sm-claude Wrapper Auth-Fix | ⏸ PENDING |
| #4 Carta-Plugins untersuchen + deaktivieren | ⏸ PENDING — Zweck-Verifikation ergab: KEIN NeXify-Zweck |
| #5 MCP-Setupfehler schließen | ⏸ PENDING (Folge von #4) |
| #6 Supermemory offiziell installieren | ⏸ PENDING |
| #7 Lokale SM-Kompatibilität beweisen | ⏸ PENDING |
| #8 Cross-Session-Recall | ⏸ PENDING — User-Aktion erforderlich |
| #9 Autohand prüfen | ⏸ PENDING |
| #10 Evidence + Abschlussbericht | ⏸ PENDING |
| #11 Phase 1 Evidence-Bericht | ✅ COMPLETED (dieses Dokument) |

---

**Ende Phase 1.** Nächste Schritte erfordern User-Freigabe gemäß Abschnitt 10.
