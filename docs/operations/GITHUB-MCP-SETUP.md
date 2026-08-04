# GitHub MCP Plugin — Setup & Scopes

**Stand:** 2026-08-04  
**Issue:** nexifyai-dev/nexify-agentur-plattform#126  
**Zweck:** Laptop-off Cursor-Autonomie — Issues/PRs/Actions ohne lokale `gh`-CLI-Session.

---

## Übersicht

Der offizielle GitHub MCP Server (`@modelcontextprotocol/server-github`,
`plugin-github-github`) ermöglicht Cursor (lokal + Cloud Agents) den vollständigen
Zugriff auf GitHub-Ressourcen via MCP-Protokoll — unabhängig davon, ob der Laptop
eingeschaltet ist.

---

## Einrichtung (5-Minuten-Aktion)

### 1. Personal Access Token (PAT) erstellen

GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
(oder classic tokens) → **Generate new token**

**Empfohlene Scopes (classic PAT):**

| Scope | Begründung |
|-------|-----------|
| `repo` | Vollzugriff auf Repositories (Code, Issues, PRs, Branches) |
| `workflow` | GitHub Actions Workflows lesen + triggern |
| `read:org` | Org-Mitgliedschaft und Teams lesen |
| `read:user` | Eigenes Profil (für Cursor-Authentifizierung) |

> **Minimal-Scopes** (read-only): `repo:status`, `public_repo`, `read:org`  
> **Kein** `admin:org`, `delete_repo` oder `admin:enterprise` — nicht nötig.

**Fine-grained token (empfohlen für Produktion):**
- Repository access: `nexifyai-dev/nexify-agentur-plattform` (oder All repositories)
- Permissions:
  - Contents: Read and write
  - Issues: Read and write
  - Pull requests: Read and write
  - Actions: Read and write
  - Metadata: Read-only (immer aktiv)
  - Checks: Read-only

### 2. Token als Umgebungsvariable setzen

```bash
# Lokal (~/.bashrc oder ~/.zshrc):
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."

# Oder in /etc/nexifyai/github-mcp.env (VPS):
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
```

> ⚠️ **Niemals** den Token direkt in `.cursor/mcp.json` oder in ein Commit schreiben.

### 3. `.cursor/mcp.json` einrichten

```bash
# Im Repo-Root:
cp .cursor/mcp.json.example .cursor/mcp.json
# .cursor/mcp.json ist in .gitignore — wird nicht committet
```

Die `github`-Sektion in `.cursor/mcp.json.example` lautet:

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
  }
}
```

### 4. Cursor neu starten / MCP neu laden

- Cursor → **Settings → MCP** → Server-Liste prüfen → `github` sollte erscheinen.
- Oder: Command Palette → `MCP: Reload Servers`.

---

## Smoke-Test

Nach der Einrichtung folgende Aktionen via Cursor Agent / Chat ausführen:

```
# 1. Offene PRs listen
list open pull requests in nexifyai-dev/nexify-agentur-plattform

# 2. Draft Issue erstellen (Smoke-Test)
create a draft issue in nexifyai-dev/nexify-agentur-plattform
  title: "[MCP Smoke] GitHub MCP connectivity test"
  body: "Automatischer Smoke-Test via GitHub MCP plugin. Kann geschlossen werden."
  labels: ["smoke-test"]

# 3. Issue direkt schließen
close the issue just created
```

Wenn alle drei Aktionen ohne `gh`-CLI-Session funktionieren → MCP aktiv und authentifiziert ✅

---

## Cloud Agents (Cursor Cloud / laptop-off)

Für vollständige laptop-off-Autonomie müssen Secrets in GitHub Actions hinterlegt sein:

| Secret | Wert | Zweck |
|--------|------|-------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | PAT (wie oben) | Cloud Agent → GitHub MCP |

Workflow: `.github/workflows/event-to-cloud-agent.yml` übergibt den Token an den
Cloud Agent als Umgebungsvariable. Secrets-Setup: [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123).

---

## Bekannte Einschränkungen

- **Org OAuth**: Wenn die Org SSO erzwingt, muss der PAT nach der Erstellung für
  die Org autorisiert werden: GitHub → Token → *Configure SSO → Authorize*.
- **Fine-grained tokens + Org**: Org-Owner muss Fine-grained tokens erlauben
  (Org Settings → Personal access tokens → Allow fine-grained tokens).
- **Projects V2**: `project` scope (classic) oder `read:project` erforderlich —
  nicht in den Minimalscopes enthalten. Bei Bedarf ergänzen.

---

## Verwandte Dokumente

- `.cursor/mcp.json.example` — kanonische MCP-Konfiguration (ohne Secrets)
- `docs/operations/GITHUB-ACTIONS-SECRET-REGISTRY.md` — Actions-Secrets-Register
- `docs/operations/GITHUB-CURSOR-CONTROL-PLANE-STATUS.md` — Gesamtstatus GitHub ↔ Cursor
- Issue [#126](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/126) — Tracking
- Issue [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123) — Actions Secrets
- Issue [#127](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/127) — Cloud Webhook Secrets
