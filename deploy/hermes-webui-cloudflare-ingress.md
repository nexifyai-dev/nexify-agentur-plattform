# FILE: /deploy/hermes-webui-cloudflare-ingress.md
# NIR: 26.07.2026 17:30
# UPDATED: 26.07.2026 17:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Cloudflare-Tunnel-Ingress-Patch, um hermes-dash.nexifyai.cloud auf den
#       bereits laufenden Hermes-WebUI-Dienst zu routen.
# WHY: memory/VPS_INFRA.md:54 listet nur `webui.nexifyai.cloud` und
#      `work.nexifyai.cloud` als Ingress-Hostnamen für Hermes WebUI (:8787).
#      `hermes-dash.nexifyai.cloud` fehlt in dieser Liste komplett — das ist
#      die wahrscheinlichste Ursache dafür, dass hermes-dash.nexifyai.cloud
#      aktuell nicht lädt: die Domain war nie im Tunnel-Ingress verdrahtet.
# BEST-PRACTICE: Laut docs/architecture/DEVIATION-REPORT-2026-07-24.md (I-01)
#      wurde Traefik am 06.07.2026 vom VPS entfernt — Routing läuft exklusiv
#      über Cloudflare Tunnel. Diese Datei patcht daher den Tunnel-Ingress,
#      NICHT eine Traefik-Config (siehe deploy/hermes-webui-routes.yml für
#      die inaktive Traefik-Zieldefinition, falls Traefik reaktiviert wird).
# PITFALL: V-01: memory/VPS_INFRA.md:103 markiert den Haupt-Tunnel als
#      "REMOTE-MANAGED" (source=cloudflare, aktuell Config-Version 27+) —
#      `/root/.cloudflared/config.yml` ist nur Doku/Fallback. Ingress-Änderungen
#      müssen über die Cloudflare-API (`cfd_tunnel/aed8a968…/configurations`,
#      GLOBAL_KEY) oder das Cloudflare-Dashboard vorgenommen werden, NICHT durch
#      Bearbeiten der lokalen YAML-Datei auf dem VPS.
# PITFALL: V-02: memory/VPS_INFRA.md:26-33 dokumentiert einen bekannten
#      Tunnel-Konflikt (zwei cloudflared-Services). Vor jeder Ingress-Änderung
#      `systemctl status cloudflared.service cloudflared-main.service` prüfen —
#      nur `cloudflared-main.service` (Tunnel `aed8a968-ac34-44cf-996d-0d2da8c872d7`)
#      darf aktiv sein.
# DEPENDS: Cloudflare-Tunnel `aed8a968-ac34-44cf-996d-0d2da8c872d7`
#          (cloudflared-main.service); DNS-Zone nexifyai.cloud
#          (2b96bbce5033dd364440906cea99b086); GLOBAL_KEY+EMAIL für Voll-Zugriff.
# DOCS-REF: memory/VPS_INFRA.md, docs/architecture/DEVIATION-REPORT-2026-07-24.md

# hermes-dash.nexifyai.cloud — fehlender Cloudflare-Tunnel-Ingress

## Befund

| Domain | Im Tunnel-Ingress verdrahtet? | Ziel |
|---|---|---|
| `webui.nexifyai.cloud` | ✅ ja (memory/VPS_INFRA.md:54) | Hermes WebUI `127.0.0.1:8787` |
| `work.nexifyai.cloud` | ✅ ja (memory/VPS_INFRA.md:54) | Hermes WebUI `127.0.0.1:8787` |
| `hermes-dash.nexifyai.cloud` | ❌ **fehlt** | — |

`hermes-dash.nexifyai.cloud` taucht in keiner der im Repo dokumentierten Ingress-Listen auf. Wahrscheinlichste Erklärung: DNS/Tunnel-Eintrag wurde nie angelegt (nicht: Dienst abgestürzt).

## Fix — Option A: Cloudflare API (empfohlen, da Tunnel "REMOTE-MANAGED" ist)

```bash
# Aktuelle Ingress-Config lesen (GLOBAL_KEY+EMAIL, siehe backend/.env):
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/zones/2b96bbce5033dd364440906cea99b086/cfd_tunnel/aed8a968-ac34-44cf-996d-0d2da8c872d7/configurations" \
  -H "X-Auth-Email: <GLOBAL_EMAIL>" \
  -H "X-Auth-Key: <GLOBAL_KEY>" \
  -H "Content-Type: application/json" | jq '.result.config.ingress'

# Neue Ingress-Regel VOR dem catch-all `service: http_status:404` einfügen:
#   - hostname: hermes-dash.nexifyai.cloud
#     service: http://localhost:8787
# Dann die VOLLSTÄNDIGE (nicht-partielle) Ingress-Liste per PUT zurückschreiben.
```

## Fix — Option B: Cloudflare Dashboard

1. Zero Trust → Networks → Tunnels → `aed8a968-...` (Main-Tunnel) auswählen
2. **Public Hostname** → **Add a public hostname**
3. Subdomain: `hermes-dash`, Domain: `nexifyai.cloud`
4. Service Type: `HTTP`, URL: `localhost:8787`
5. Speichern — kein Neustart des Tunnels nötig (Remote-Managed Config)

## DNS

Falls noch kein CNAME existiert:

| Typ | Name | Ziel | Proxy |
|-----|------|------|-------|
| CNAME | hermes-dash | `<tunnel-id>.cfargotunnel.com` | ✅ Proxied |

## Verifikation

```bash
curl -sI https://hermes-dash.nexifyai.cloud/health
# Erwartet: 200, gleiche Antwort wie https://webui.nexifyai.cloud/health
```

## Kontext: Zusätzliche, unabhängige Ursache für "Frontend lädt nicht"

`.github/workflows/deploy-vps.yml` hatte bis zu diesem Fix (siehe Commit) einen
YAML-Bug (`if:`-Block-Scalar mit eingebetteten Kommentarzeilen), der die
GESAMTE Workflow-Datei ungültig machte — jeder Deploy zu main seit ~14:00 Uhr
schlug mit 0 ausgeführten Jobs fehl. Das betrifft primär die Website
(nexifyai.cloud → VPS, systemd `nexifyai-website.service` Port 8880 — kein
Vercel mehr; Vercel-Entfernung 2026-08-11) und alle über diese Pipeline
verwalteten Dienste — NICHT direkt Hermes, da Hermes laut memory/VPS_INFRA.md:90
(`/root/hermes-webui-nexify`) außerhalb dieser Repo-Pipeline separat verwaltet
wird. Beide Ursachen (fehlender Ingress + kaputte Deploy-Pipeline) sind
unabhängig voneinander und sollten beide behoben werden.
