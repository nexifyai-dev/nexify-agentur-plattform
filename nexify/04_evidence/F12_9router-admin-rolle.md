# F12: 9Router-Admin-Rolle — Definition

**Status:** ✅ DEFINED
**Datum:** 2026-06-22
**Governance-Agent:** NeXify AI OS

---

## 9Router-Admin (Rolle)

### Definition
Der **9Router-Admin** ist die verantwortliche Rolle für den Betrieb, die Wartung und die Sicherheit des 9Router-Systems — dem zentralen KI-Router für alle LLM-Calls im NeXify-Ökosystem.

### Verantwortlichkeiten

| Bereich | Aufgabe |
|---------|---------|
| **Betrieb** | 24/7-Überwachung des 9Router-Systems |
| **Konfiguration** | Verwaltung der Router-Konfiguration und Endpoint-Routing |
| **Sicherheit** | Zugriffssteuerung und API-Key-Management |
| **Incident Response** | Erste Eskalationsstelle bei 9Router-Ausfall |
| **Kapazität** | Monitoring von LLM-Quotas und Rate-Limits |
| **Updates** | Deployment von Router-Updates und Patches |

### Autoritäten

- ✅ Router-Konfiguration ändern
- ✅ LLM-Provider einbinden/entfernen
- ✅ Rate-Limits anpassen
- ✅ Emergency-Shutdown des Routers
- ❌ Keine Änderung an Business-Logik (→ CEO)
- ❌ Keine Änderung an Sicherheitspolicies (→ Systemmaster)

### Zuordnung

| Attribut | Wert |
|----------|------|
| **Rollen-Typ** | Technische Operations-Rolle |
| **Berichtet an** | Systemmaster |
| **Eskalation bei Ausfall** | Systemmaster → NeXify CEO |
| **Mindestqualifikation** | DevOps/Infrastructure Engineer |
| **Vertretung** | Systemmaster (Fallback) |

### SLA-Anforderungen

- **Reaktionszeit bei Ausfall:** < 15 Minuten
- **Wiederherstellungsziel (RTO):** < 1 Stunde
- **Datenverlust-Toleranz (RPO):** 0 (alle Logs werden gespeichert)

---

**Evidence-Typ:** Rollen-Definition
**Governance-Level:** Operational
**Nächste Review:** 2026-09-22
