# /nexifyai-commands

Erstelle, pflege und verwalte die NeXifyAI Cursor-Slash-Commands.

**Zielpfad (Windows PC):** `C:\Users\pcour\.cursor\commands\`  
**Repo-Quelle (Single Source of Truth):** `.cursor/commands/` in `nexify-agentur-plattform`  
**Sync:** `deploy/cursor/sync-commands-windows.ps1`

Text nach dem Command = Auftrag, z. B.:
- `/nexifyai-commands list`
- `/nexifyai-commands add vpn-status`
- `/nexifyai-commands update gitlab-oss-mcp`
- `/nexifyai-commands sync-to-pc`
- `/nexifyai-commands audit`

---

## Harte Regeln (immer)

1. **Keine Secrets** in Command-Dateien (keine PAT, Keys, Passwörter).
2. **Ein File = ein Slash-Command** (`name.md` → `/name`). Keine YAML-Frontmatter nötig (Cursor plain markdown).
3. **Repo zuerst:** Änderungen in `.cursor/commands/` committen; danach auf den PC syncen.
4. **Governance:** Production / Secrets / Delete / Live-Deploy → **F32 Freigabe** (nicht autonom).
5. **Workspace nötig:** Cursor muss einen Ordner geöffnet haben (`workspaceId-empty-window` = Open Folder).
6. Commands kurz halten (< ~120 Zeilen). Details in `docs/` / `deploy/` verlinken, nicht kopieren.

---

## Katalog (aktuell)

| Slash | Datei | Zweck |
|-------|-------|--------|
| `/nexifyai-commands` | `nexifyai-commands.md` | Meta: erstellen, pflegen, verwalten |
| `/gitlab-oss-mcp` | `gitlab-oss-mcp.md` | Self-hosted GitLab OSS MCP (nicht gitlab.com) |
| `/nine-router` | `nine-router.md` | 9router OpenAI-Client / Combos / Health |
| `/vpn-ssh` | `vpn-ssh.md` | WireGuard + SSH zum VPS |
| `/governance-f32` | `governance-f32.md` | Autonomie vs. Freigabe-Gate |
| `/pr-flow` | `pr-flow.md` | Branch → PR → Mirror → Staging → main |
| `/mcp-health` | `mcp-health.md` | MCP-Status prüfen / empty-window / Auth |
| `/vps-ops` | `vps-ops.md` | VPS-Checks ohne Production-Schreiben |

---

## Workflow: Erstellen

1. Name wählen: kebab-case, deutsch/englisch klar (`gitlab-oss-mcp`).
2. Datei anlegen: `.cursor/commands/<name>.md`.
3. Aufbau:
   - Titel `# /<name>`
   - Goal (1–2 Sätze)
   - Common Files / Depends
   - Suggested Sequence (nummeriert)
   - Pitfalls / Verbote
4. In diesen Katalog (Tabelle oben) eintragen.
5. Optional: Register `nexify/05_skills/NEXIFY_SKILL_AGENT_COMMAND_HOOK_TEMPLATE_REGISTER.md` um CMD-ID ergänzen.
6. Commit: `docs(cursor): add /<name> command`.
7. Auf PC syncen (siehe unten).

## Workflow: Pflegen

1. Bestehende `.md` öffnen; veraltete URLs/Pfade gegen Live-Docs prüfen.
2. Nach Infra-Änderungen (GitLab, 9router, VPN) **dieselbe Session** Commands updaten.
3. Doppelungen mit `.claude/commands/` vermeiden — Cursor-Commands = Ops/Desktop; Claude-Commands = ECC/Dev-Scaffolds.
4. Nach Pflege: Katalog-Tabelle + `UPDATED`-Datum in `deploy/cursor/README.md`.

## Workflow: Verwalten / Audit

Bei `/nexifyai-commands audit` oder `list`:

1. Alle `.cursor/commands/*.md` listen.
2. Prüfen: Secrets? Tote Links? Fehlende Katalog-Einträge?
3. PC-Ziel: Dateien müssen 1:1 unter `C:\Users\pcour\.cursor\commands\` liegen.
4. MCP-Plugins brauchen Open Folder; sonst `workspaceId-empty-window`.
5. Kurzbericht: OK / Drift / Action.

## Sync auf Windows-PC

```powershell
# Im geklonten Repo (oder nach git pull):
.\deploy\cursor\sync-commands-windows.ps1
# Default-Ziel: $env:USERPROFILE\.cursor\commands
```

Manuell:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.cursor\commands" | Out-Null
Copy-Item -Force .\.cursor\commands\*.md "$env:USERPROFILE\.cursor\commands\"
```

Danach in Cursor `/` tippen → Commands erscheinen. Bei leerem Fenster zuerst **Open Folder**.

---

## Suggested Sequence (wenn Auftrag unklar)

1. Auftrag parsen (`list` | `add` | `update` | `sync-to-pc` | `audit` | freier Text).
2. Repo-Commands und Katalog lesen.
3. Kleinste Änderung (eine Datei oder Sync-Hinweis).
4. Keine Secrets schreiben; Evidence in Summary.
5. Wenn Production-Bezug → `/governance-f32` anwenden.

## Common Files

- `.cursor/commands/*.md`
- `deploy/cursor/README.md`
- `deploy/cursor/sync-commands-windows.ps1`
- `deploy/mcp/gitlab-oss/README.md`
- `docs/operations/REPO-SYNC-STRATEGY.md`
- `docs/governance/01_regelwerke/VERBOTE_UND_PFLICHTREGELN_V2.md`
- `nexify/05_skills/NEXIFY_SKILL_AGENT_COMMAND_HOOK_TEMPLATE_REGISTER.md`
