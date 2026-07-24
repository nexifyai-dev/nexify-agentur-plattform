# Cloudflare Services Phase 3 — Evidence
**Datum:** 2026-06-23
**Account ID:** a112f895c19e0d65f6f64b3e89f747f8
**Domain:** nexifyai.cloud

---

## 1. DNS Zone ✅
| Feld | Wert |
|------|------|
| Zone ID | `2b96bbce5033dd364440906cea99b086` |
| Status | active |
| Plan | Free Website ($0) |
| Registrar | Hostinger Operations, UAB |
| Nameservers | brynne.ns.cloudflare.com, carmelo.ns.cloudflare.com |
| Activated | 2026-05-13 |

## 2. DNS Records ⚠️
- **Status:** Auth-Fehler (HTTP 10000)
- **Grund:** Token hat Zone-Read, aber DNS-Records-Read schlägt fehl
- **Möglich:** Token ist account-scoped, nicht zone-scoped für DNS-Records
- **Workaround:** Token-Berechtigungen manuell in Cloudflare Dashboard prüfen

## 3. Pages Project ✅ ERSTELLT
| Feld | Wert |
|------|------|
| Name | `nexify-landingpage` |
| Project ID | `eb80c855-3440-4d3f-aa0c-3b2bcbc4a4f9` |
| Subdomain | `nexify-landingpage.pages.dev` |
| Production Branch | `main` |
| Created | 2026-06-23T04:08:25Z |
| Build Image | v3 (standard) |
| Usage Model | standard |

**Status:** Bereits deployed (kein Code hochgeladen, nur Projekt-Shell erstellt)

## 4. Queue ⚠️ NICHT ERSTELLT
| Feld | Wert |
|------|------|
| Versuchter Name | `nexify-async` |
| Fehlertyp | 11003 - "Queue name '' is invalid" |
| Status | Persistent trotz korrektem JSON-Payload |
| Mögliche Ursache | Queues = Workers Paid Feature ($5/Monat) oder Token-Permission fehlt |

**Nächste Schritte:**
1. Workers Paid Plan aktivieren ($5/Monat) oder
2. Token mit `queues:write` Permission neu ausstellen

## 5. Workers Scripts ✅
| Script | Modified |
|--------|----------|
| cloudflare-relay | 2026-06-07T21:49:57Z |

## 6. Bestehende Pages Projects ✅
- `nexify-landingpage` (eb80c855-3440-4d3f-aa0c-3b2bcbc4a4f9)

## 7. Bestehende Queues ✅
- Keine vorhanden (leere Liste)

---

## Gesamtübersicht

| Service | Status | ID/Details |
|---------|--------|------------|
| DNS Zone | ✅ Active | 2b96bbce5033dd364440906cea99b086 |
| DNS Records | ⚠️ Auth-Fehler | Token-Permission prüfen |
| Pages Project | ✅ Erstellt | nexify-landingpage.pages.dev |
| Queue | ❌ Failed | Workers Paid Plan nötig |
| Workers | ✅ Vorhanden | cloudflare-relay |

## Kosten
- DNS + Pages: **$0 (Free Tier)**
- Queue: **$5/Monat (Workers Paid)** — nur nötig wenn Queues benötigt werden

## Nächste Schritte
1. DNS-Records: Token mit zone-scope Permission neu ausstellen
2. Queues: Workers Paid Plan aktivieren oder alternative Message Queue nutzen
3. Pages: Code-Deployment via Git-Integration oder Direct Upload
