# OPS-04 — FIRECRAWL-Env in WebUI-Container (behoben 2026-08-07)

# FILE: docs/live/OPS-04-FIRECRAWL-WEBUI-CONTAINER-2026-08-07.md
# NIR: 07.08.2026 ~22:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Core / DevOps
# WHAT: web_search/web_extract im hermes-webui-Container aktiviert (lokal :3003)
# WHY: Hermes-Web-Tools lasen FIRECRAWL-Variablen aus Prozess-Umgebung des
#      Containers; /etc/nexifyai/*.env des Hosts war dort nie vorhanden.
# DEPENDS: nexify-firecrawl-api (:3003), Volumen hermes-webui-q5zm_hermes-home
# SESSION: Kanban t_6707d15b (OPS-04)

## Abweichung
Hermes-Web-Tools im WebUI-Container (8787) meldeten
"Web tools are not configured. Set FIRECRAWL_API_KEY ... or FIRECRAWL_API_URL",
obwohl lokale Firecrawl-Instanz (:3003) lief und FIRECRAWL-Keys in
/etc/nexifyai/{credentials,hermes,secrets}.env lagen. Der Firecrawl-MCP
(mcp__firecrawl__firecrawl_scrape) funktionierte bereits.

## Ursache (Kausal, Ebene 2)
- get_env_value() liest os.environ, dann `~/.hermes/.env` (get_env_path =
  get_hermes_home()/".env").
- Container-HERMES_HOME = /home/hermeswebui/.hermes; dessen .env enthielt nur
  DEEPSEEK_API_KEY, WIKI_PATH, BLOGWATCHER_DB — keine FIRECRAWL-Variablen.
- config.yaml: web.use_gateway: false → Direkt-Config (Key/URL) ist der
  einzige Pfad; ohne diese env-Variablen: ValueError.
- Netzwerk: Container läuft im host-Netzwerkmodus → 127.0.0.1:3003 ist
  direkt erreichbar (kein API-URL-Umbau nötig).

## Fix
1. Backup: hermes-webui-q5zm_hermes-home/_data/.env → .env.bak-20260807-firecrawl
2. 3 Zeilen aus /etc/nexifyai/hermes.env (sort -u, dedupliziert) an das
   Volumen-.env angehängt:
   FIRECRAWL_API_KEY / FIRECRAWL_API_URL=http://127.0.0.1:3003 / FIRECRAWL_BASE_URL=http://localhost:3003
   (Keys NIE im Klartext in Code/Commits — Quelle bleibt /etc/nexifyai/hermes.env)
3. Owner auf 1000:1000 (hermeswebui), chmod 600 (Container .env-Fixer verlangt 600)
4. docker restart hermes-webui → healthy

## Nachweis (E1-E3)
- E2: docker exec ... get_env_value("FIRECRAWL_API_KEY") → keylen 35,
  FIRECRAWL_API_URL=http://127.0.0.1:3003,
  check_firecrawl_api_key() → True
- E3 (im Container-Prozess, HERMES_HOME=/home/hermeswebui/.hermes):
  web_search_tool("KI Mittelstand 2026") → 5 Treffer
  web_extract_tool(["https://www.ki-amigo.com/artikel/..."]) → 15781 Zeichen markdown
- curl -H "Authorization: Bearer <key>" :3003/v1/scrape → 200

## Betriebsregel (neu)
Web-Tools-Env wird ausschließlich über das Volumen-.env
/var/lib/docker/volumes/hermes-webui-q5zm_hermes-home/_data/.env gespiegelt.
Bei Rotation eines Keys in /etc/nexifyai/hermes.env: Volumen-.env mitziehen
und Container neu starten. Keys nicht in Docker-Env-Einträge der Compose-Datei
aufnehmen (Kompromittierungsfläche).

## Referenz
HERMES.md MCP-Tabelle: firecrawl-Status von "⏸ disabled (FIRECRAWL_API_KEY fehlt)"
→ "✅ enabled (lokal :3003)" korrigiert.
