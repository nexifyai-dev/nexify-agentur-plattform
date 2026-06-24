# Brain Query/Store/Retrieve/Delete Test — Evidence

**Datum (Berlin):** 2026-06-11 14:00 +0200
**Agent:** Claude Code

## Testprotokoll

### A. Query Test
- Endpoint: POST /query auf http://127.0.0.1:9090
- Query: "NeXify Workspace Agentur Operator Systemmaster"
- Collection: nexifyai_brain
- Ergebnis: 3 Treffer, darunter Operational Blockers Report, NeXify Identity, Fertigstellungsdefinition
- Status: ✅ PASS

### B. Store Test
- Endpoint: POST /store auf http://127.0.0.1:9090
- Collection: nexifyai_memories
- Content: BRAIN_TEST_ENTRY_20260611_115739 (temporärer Test-Eintrag)
- Auth: X-Brain-Token gesetzt
- Ergebnis: created, ID 96f95b597fbc4ddb
- Status: ✅ PASS

### C. Retrieve Test
- Query nach Test-Eintrag in nexifyai_memories
- Ergebnis: 1 Treffer, vollständige Metadaten
- Status: ✅ PASS

### D. Delete / Cleanup
- DELETE /delete/96f95b597fbc4ddb
- Ergebnis: deleted
- Status: ✅ PASS

## Fazit
Alle vier Kernfunktionen (Query, Store, Retrieve, Delete) funktionieren einwandfrei.
Brain API ist produktiv nutzbar.
