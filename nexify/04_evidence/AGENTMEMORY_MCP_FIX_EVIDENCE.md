---
id: EVIDENCE_AGENTMEMORY_MCP_FIX_001
title: Agentmemory MCP — Fix-Versuch und Status-Evidence
version: 1.0.0
status: COMPLETED
datum: 2026-06-10
tester: Goose AI CLI (NeXify Auto-System)
audit_pflicht: ja
tags: [agentmemory, mcp, fix, evidence]
---

# AGENTMEMORY_MCP_FIX_EVIDENCE

## 1. Ausgangslage

MCP-Start aus `/root/agentmemory/packages/mcp/bin.mjs` scheiterte mit:
```
Cannot find package '@agentmemory/agentmemory' 
```

## 2. Ursachenanalyse

| Aspekt | Ergebnis |
|--------|----------|
| Repo-Struktur | Monorepo: Root = `@agentmemory/agentmemory`, MCP = `@agentmemory/mcp` in `packages/mcp/` |
| MCP-Abhängigkeit | `@agentmemory/agentmemory: ~0.9.0` → nicht in `node_modules` |
| dist/ standalone | ✅ Vorhanden: `/root/agentmemory/dist/standalone.mjs` (v0.9.26) |
| npm install im MCP | ✅ Erfolgreich: `@agentmemory/agentmemory@0.9.27` installiert |
| Globales npm | ✅ `@agentmemory/agentmemory@0.9.26` → linked via `npm i -g .` |
| Standalone-Start | ✅ `node dist/standalone.mjs` → "Standalone MCP server v0.9.26 starting..." |
| packages/mcp Start | ✅ `node bin.mjs` → "Standalone MCP server v0.9.27 starting..." |

## 3. Fix-Entscheidung

| Option | Status | Begründung |
|--------|--------|------------|
| A: Lokales Repo installieren | ✅ Erledigt | `node_modules/@agentmemory/agentmemory` vorhanden |
| B: Globales Paket | ✅ Erledigt | `npm i -g .` → globalk verfügbar |
| C: MCP BLOCKED_CONFIG | ❌ Nicht nötig | MCP standalone startet erfolgreich |

**Ergebnis:** MCP-Fix erfolgreich. MCP standalone startet sowohl aus dist/ als auch aus packages/mcp/.

## 4. Aktuelle MCP-Konfiguration

```
Standalone MCP: node /root/agentmemory/dist/standalone.mjs 
Version: 0.9.26 (dist) / 0.9.27 (packages/mcp)
Modus: stdio (erwartet --stdio, --sse oder --socket)
```

## 5. Integration in Goose

Für Goose-Integration muss der MCP-Server als Subprocess konfiguriert werden
(z.B. in `~/.config/goose/config.yaml` als MCP-Tool-Extension).

---

*Evidence erstellt am 2026-06-10 21:31 UTC | Version 1.0.0 | Audit-Pflichtig*
