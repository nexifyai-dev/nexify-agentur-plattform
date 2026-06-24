# Lieferanten- und Tool-Risikoregister — NeXify AI OS
## Version: 1.0 | Stand: 2026-06-23
## Normbasis: ISO 27001 A.14 (Lieferantenbeziehungen), DSGVO Art. 28 (AVV), DSGVO Art. 32 (TOM)

---

## 1. Zweck
Dieses Register erfasst alle externen Dienstleister, Cloud-Dienste und Tools, die personenbezogene Daten verarbeiten oder kritische Infrastruktur für NeXify AI OS bereitstellen. Es dient als Grundlage für Lieferantenrisikobewertung und AVV-Management.

---

## 2. Lieferantenregister

### 2.1 Cloudflare Inc.

| Attribut | Wert |
|---|---|
| **Dienst** | CDN, DDoS-Schutz, Tunnel, AI Gateway, Workers AI, DNS, WAF |
| **Datenart** | HTTP-Header, IP-Adressen, TLS-Metadaten, API-Keys (im Tunnel-Handshake) |
| **Standort (Server)** | Global (Anycast) — Rechenzentren weltweit |
| **Standort (Unternehmen)** | San Francisco, CA, USA |
| **Zertifikate** | ISO 27001, SOC 2 Typ II, SOC 3, PCI DSS Level 1 |
| **AVV-Status** | ✅ AVV abgeschlossen (Standard-Cloudflare-DPA + SCC 2021) |
| **Risiko** | NIEDRIG — Nur Transit-Verkehr, keine persistente Datenspeicherung |
| **Kritisches System** | Ja (Tunnel-Gateway) |
| **Fallback** | Direkte Hetzner-IP-Verbindung |
| **Controls** | IS-11, SE-01, SE-03 |

### 2.2 Vercel Inc.

| Attribut | Wert |
|---|---|
| **Dienst** | WebUI-Hosting (Hermes WebUI), Deployment-Plattform |
| **Datenart** | Sitzungs-Cookies, UI-Konfiguration, Deployment-Logs |
| **Standort** | Global (Vercel Edge Network) — US-Unternehmen |
| **Zertifikate** | SOC 2 Typ II, ISO 27001 |
| **AVV-Status** | ✅ AVV abgeschlossen (Standard-Vercel-DPA + SCC) |
| **Risiko** | NIEDRIG — Nur UI-Hosting, keine persistenten personenbezogenen Daten |
| **Kritisches System** | Nein (kann lokal gehostet werden) |
| **Controls** | IS-01, IS-11 |

### 2.3 GitHub Inc. (Microsoft)

| Attribut | Wert |
|---|---|
| **Dienst** | Quellcode-Verwaltung, CI/CD (GitHub Actions), Issue-Tracking |
| **Datenart** | Quellcode, Konfigurationsdateien, keine direkten PII |
| **Standort** | USA (GitHub Enterprise Cloud) |
| **Zertifikate** | SOC 2 Typ II, ISO 27001, ISO 27701, FedRAMP |
| **AVV-Status** | ✅ AVV in Verhandlung — SCC 2021 anwendbar (Microsoft-DPA) |
| **Risiko** | NIEDRIG — Quellcode ohne Produktivdaten |
| **Kritisches System** | Nein (Git-Selbsthosting möglich) |
| **Controls** | IS-02, SE-01 |

### 2.4 Hetzner Online GmbH

| Attribut | Wert |
|---|---|
| **Dienst** | VPS-Hosting (Root-Server), Cloud-Server, Storage-Box |
| **Datenart** | Alle Produktivdaten: Vektordaten (Qdrant), Dokumente (RAGFlow), Agenten-Logs, Brain-Daten, MongoDB, Redis |
| **Standort** | Nürnberg, Helmstedt, Falkenstein (Deutschland) |
| **Zertifikate** | ISO 27001 (Hetzner Cloud), BSI C5 Typ I |
| **AVV-Status** | ✅ AVV abgeschlossen (Hetzner-ADV-Vertrag) |
| **Risiko** | NIEDRIG — Deutscher Anbieter, ISO 27001, BSI C5 |
| **Kritisches System** | Ja (Primäre Infrastruktur) |
| **Fallback** | Automatischer Failover auf Backup-Server |
| **Controls** | AV-01, AV-02, BC-01, SE-01 |

### 2.5 Supabase Inc.

| Attribut | Wert |
|---|---|
| **Dienst** | PostgreSQL-Datenbank, Auth, Storage, Realtime, Edge Functions |
| **Datenart** | Auth-Daten, Projektdaten, Konfiguration |
| **Standort** | US-Unternehmen; Hosting konfigurierbar |
| **Zertifikate** | SOC 2 Typ II, ISO 27001 |
| **AVV-Status** | ✅ AVV abgeschlossen (Supabase DPA + SCC 2021) |
| **Risiko** | NIEDRIG — Self-hosted (lokale Supabase-Instanz auf Hetzner-VPS) |
| **Kritisches System** | Nein |
| **Controls** | DP-01, DP-02 |

### 2.6 Resend Inc.

| Attribut | Wert |
|---|---|
| **Dienst** | E-Mail-Versand (Transaktions-E-Mails) |
| **Datenart** | E-Mail-Adressen, E-Mail-Inhalte (keine sensiblen Daten) |
| **Standort** | US-Unternehmen (API — keine persistente Datenspeicherung) |
| **Zertifikate** | SOC 2 Typ II |
| **AVV-Status** | ✅ AVV abgeschlossen (Resend DPA + SCC 2021) |
| **Risiko** | NIEDRIG — Nur E-Mail-Übermittlung, minimale PII |
| **Kritisches System** | Nein |
| **Controls** | DP-01, DP-03 |

### 2.7 DeepSeek (深度求索)

| Attribut | Wert |
|---|---|
| **Dienst** | LLM-API (DeepSeek-V4-Flash, DeepSeek-Reasoner via 9Router) |
| **Datenart** | Prompt-Texte (keine PII), API-Metadaten |
| **Standort** | China (Peking/Hangzhou) |
| **Zertifikate** | Keine internationalen Zertifikate bekannt |
| **AVV-Status** | ⚠️ Kein AVV — Standard-AGB nur Chinesisch/Englisch |
| **Risiko** | HOCH — Chinesischer Anbieter, keine EU-DSGVO-Konformität, keine AVV |
| **Kritisches System** | Ja (Primärer LLM-Anbieter via 9Router) |
| **Risikominderung** | Prompt-Filterung (keine PII in Prompts); 9Router als Proxy; Datenminimierung |
| **Controls** | AI-01, AI-02, DP-03, SE-01 |
| **Nächster Schritt** | AVV anfordern oder Alternativanbieter evaluieren |

### 2.8 nscale

| Attribut | Wert |
|---|---|
| **Dienst** | Container-Orchestrierung, Deployment-Automatisierung |
| **Datenart** | Container-Konfiguration, keine PII |
| **Standort** | Europa (Open Source) |
| **Zertifikate** | Keine (Open-Source-Tool) |
| **AVV-Status** | ✅ Nicht erforderlich — Open-Source-Tool, keine Datenverarbeitung |
| **Risiko** | NIEDRIG — Selbstgehostet, keine Datenübertragung |
| **Kritisches System** | Nein |
| **Controls** | SE-01 |

### 2.9 OpenRouter

| Attribut | Wert |
|---|---|
| **Dienst** | LLM-API-Router (Fallback zu mehreren Modellen) |
| **Datenart** | Prompt-Texte, API-Keys |
| **Standort** | US-Unternehmen |
| **Zertifikate** | Keine spezifischen bekannt |
| **AVV-Status** | ⚠️ Kein dedizierter AVV — Standard-AGB |
| **Risiko** | MITTEL — US-Anbieter ohne spezifisches DPA; nur als Fallback genutzt |
| **Kritisches System** | Nein (Fallback) |
| **Risikominderung** | Nur bei 9Router-Ausfall aktiv; Prompt-Filterung |
| **Controls** | AI-01, DP-03 |

---

## 3. Risikoübersicht

| Lieferant | Gesamtrisiko | Datenrisiko | Standortrisiko | AVV-Risiko | Abhängigkeitsrisiko |
|---|---|---|---|---|---|
| Cloudflare | 🟢 NIEDRIG | 🟢 | 🟡 (USA) | 🟢 | 🟡 (Kritisch) |
| Vercel | 🟢 NIEDRIG | 🟢 | 🟡 (USA) | 🟢 | 🟢 |
| GitHub | 🟢 NIEDRIG | 🟢 | 🟡 (USA) | 🟡 (In Verhandlung) | 🟢 |
| Hetzner | 🟢 NIEDRIG | 🟢 | 🟢 (DE) | 🟢 | 🟡 (Kritisch) |
| Supabase | 🟢 NIEDRIG | 🟢 | 🟢 (Self-hosted) | 🟢 | 🟢 |
| Resend | 🟢 NIEDRIG | 🟢 | 🟡 (USA) | 🟢 | 🟢 |
| **DeepSeek** | 🟠 HOCH | 🟢 | 🔴 (China) | 🔴 (Kein AVV) | 🟡 (Kritisch) |
| nscale | 🟢 NIEDRIG | 🟢 | 🟢 (EU/OSS) | 🟢 | 🟢 |
| **OpenRouter** | 🟡 MITTEL | 🟢 | 🟡 (USA) | 🟡 (Kein DPA) | 🟢 |

---

## 4. AVV-Status-Matrix

| Lieferant | AVV vorhanden? | Basis | SCC 2021 | Letzte Prüfung | Nächste Prüfung |
|---|---|---|---|---|---|
| Cloudflare | ✅ Ja | Cloudflare DPA | Ja | 2026-06 | 2026-12 |
| Vercel | ✅ Ja | Vercel DPA | Ja | 2026-06 | 2026-12 |
| GitHub | ⚠️ In Verhandlung | Microsoft DPA | Ja (anwendbar) | 2026-06 | 2026-09 |
| Hetzner | ✅ Ja | Hetzner ADV-Vertrag | EU-Standard | 2026-06 | 2027-06 |
| Supabase | ✅ Ja | Supabase DPA | Ja | 2026-06 | 2026-12 |
| Resend | ✅ Ja | Resend DPA | Ja | 2026-06 | 2026-12 |
| DeepSeek | ❌ Kein AVV | — | — | 2026-06 | 2026-07 (Mahnung) |
| nscale | — Nicht erforderlich | Open Source | — | — | — |
| OpenRouter | ⚠️ Kein dediziertes DPA | Standard-AGB | — | 2026-06 | 2026-09 |

---

## 5. Maßnahmenplan

| Priorität | Maßnahme | Lieferant | Verantwortlich | Fällig |
|---|---|---|---|---|
| P0 | AVV von DeepSeek anfordern | DeepSeek | DSB | 2026-07-23 |
| P0 | Alternativanbieter für DeepSeek evaluieren (EU-Anbieter) | DeepSeek | AI-Lead | 2026-08-23 |
| P1 | GitHub-AVV finalisieren | GitHub | DSB | 2026-09-23 |
| P1 | OpenRouter-DPA prüfen und ggf. anfordern | OpenRouter | DSB | 2026-09-23 |
| P1 | Lieferanten-Audit-Programm aufsetzen | Alle | QMB | 2026-09-23 |
| P2 | Prompt-Filter-Wirksamkeit auditieren | DeepSeek, OpenRouter | Sec-Ops | 2026-12-23 |
| P2 | Jährliches Lieferanten-Review | Alle | QMB | 2027-06-23 |

---

## 6. Metadaten

| Attribut | Wert |
|---|---|
| Erstellungsdatum | 2026-06-23 |
| Erfasste Lieferanten | 9 |
| AVV-vollständig | 5/9 |
| AVV-fehlend | 1/9 (DeepSeek) |
| Höchstes Risiko | DeepSeek (China, kein AVV) |
| Nächstes Review | 2026-12-23 |
| Verantwortlich | DSB (Philipp Gros) |
