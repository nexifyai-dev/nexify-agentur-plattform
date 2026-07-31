# DECISION: WebUI-Zentrale vs Dashboard-Surface

**NIR:** 31.07.2026 10:50  
**UPDATED:** 31.07.2026 11:33  
**STATUS:** ACCEPTED (Routing-Klarstellung) / Cutover = Preview-Smoke  
**Kategorie:** `platform`  
**SoT:** SOLL-GESAMTKONZEPT §4 · HERMES-WORKSTATION-KONSOLIDIERUNG-PLAN · User-Mandat 2026-07-31  
**Monorepo-Spiegel:** dieses Doc (VPS-Original unter `/opt/nexifyai/docs/decisions/`)

## Entscheidung

1. **Produkt-Arbeitsplatz-Zentrale (Mandat-Name):** `https://webui.nexifyai.cloud/`  
2. **Aktuelle Feature-Shell (IST):** `https://dashboard.nexifyai.cloud/` → Hermes Workspace `127.0.0.1:4001`  
3. **Aktuelle Hermes Agent WebUI (IST):** `https://webui.nexifyai.cloud/` → `:8787` (Auth/Login)

Bis Cutover nach Preview-Smoke bleiben **beide** Hosts online. Zielbild: **eine** native Surface unter dem Mandat-Host `webui.nexifyai.cloud`, die heutige Dashboard-Funktionen (Kanban, Swarm, Memory, Terminal, Jobs) **ohne Iframe-Dauerlösung** trägt.

## Nicht tun

- Kein Live-Patch Prod WebUI App-Code ohne Policy-Pfad  
- Kein Blind-Cutover Traefik/CF ohne Smoke  
- Keine zweiten Control-Dashboards (Portainer-Clones) als Dauerlösung  

## Nächste technische Schritte

| Schritt | Ort | Gate |
|---------|-----|------|
| Feature-Parity-Checkliste Workspace→WebUI | `docs/architecture/WEBUI-FEATURE-PARITY-CHECKLIST-2026-07-31.md` | Smoke |
| Traefik/CF Host-Alias webui → Workspace nach Smoke | Ops | Cutover-Gate |
| Monitoring/OpenDesign/LightRAG als native Views | Workspace Feature-Branch | Design v2 |

## Evidence

- Live Gap: `docs/live/GESAMTSYSTEM-INTEGRATION-GAP-2026-07-31.md`  
- Traefik: `dashboard-subdomain` → hermes-workspace-svc; `webui-subdomain` → hermes-webui  
