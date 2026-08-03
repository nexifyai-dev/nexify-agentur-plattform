# Hostinger MCP (Domains / DNS / VPS)

## Zweck
Cursor-Agenten steuern Hostinger Domains, DNS und VPS über das offizielle
`hostinger-api-mcp`-Paket — **ohne API-Token im Git**.

## Secrets (außerhalb Repo)
| Datei | Mode | Inhalt |
|-------|------|--------|
| `/etc/nexifyai/hostinger-api.env` | `600` | `HOSTINGER_API_TOKEN=…` |

Wrapper: `/opt/nexifyai/scripts/hostinger-mcp-wrapper.sh` (auch in `scripts/`)
lädt nur `HOSTINGER_*` und startet
`npx -y -p hostinger-api-mcp@latest <binary>` (Linux `npx`, nicht `npx.cmd`).

## MCP-Einträge (lokal)
In `.cursor/mcp.json` (gitignored):

- `hostinger-domains` → `hostinger-domains-mcp`
- `hostinger-dns` → `hostinger-dns-mcp`
- `hostinger-vps` → `hostinger-vps-mcp`

`.cursor/mcp.json.example` spiegelt die Keys ohne Secrets.

## Smoke
```bash
test -f /etc/nexifyai/hostinger-api.env && echo env_ok
timeout 3 /opt/nexifyai/scripts/hostinger-mcp-wrapper.sh hostinger-domains-mcp </dev/null
```

## Sicherheit
- Token nie in PR, Docs-Bodies, AgentMemory oder Commits.
- Nach Chat-Exposition: Token in hPanel rotieren und Env-Datei aktualisieren.
- Keine destruktiven VPS-Deletes ohne explizite Freigabe.

## Mail
IMAP/SMTP für `mail@nexifyai.cloud`: `/etc/nexifyai/mail-nexifyai.env` (chmod 600).
