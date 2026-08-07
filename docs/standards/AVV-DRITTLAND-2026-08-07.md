# AVV/Drittland-Risiko LLM-Provider — Bestandsaufnahme + Mitigation (COMPLIANCE-01)

# FILE: docs/standards/AVV-DRITTLAND-2026-08-07.md
# NIR: 07.08.2026 21:10
# UPDATED: 07.08.2026 21:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Core (Compliance)
# WHAT: Dokumentiert Datenflüsse zu LLM-/SaaS-Providern, AVV-/DPA-Status je Verarbeiter,
#       Drittlandtransfer-Risiken (DSGVO Art. 28/44-49) und EU-AI-Act-Art.-50-Lücken.
# WHY: Rechtliche Pflicht: AVV-Status belegbar machen, Drittlandrisiken (China/US/Korea)
#       benennen, Mitigationen verankern. Basis für DPA-Anfragen und Provider-Entscheidungen.
# DEPENDS: ZENTRALE-KONFIGURATION.md (§5 LLM-Stack, §6 Vercel, §8 Env), backend/server.py,
#          backend/ninerouter.py, apps/website/lib/legal/de.ts, 9Router (:20128)
# DOCS-REF: /root/.hermes/cron/output/recht-compliance-ki-agentur-dach-2026-08-06.md
# STATUS: NUR Vorbereitung/Dokumentation — keine Rechtsberatung, kein Rechtsgutachten.

## 1. Zusammenfassung

| Bewertung | Ergebnis |
|---|---|
| Kritischster Verarbeiter | **DeepSeek** (direkte API / via OpenRouter-Routing): Speicherung in **Volksrepublik China**, kein AVV/DPA, kein EU-/US-Residency-Angebot, China ohne EU-Angemessenheitsbeschluss |
| Provider mit belastbarem AVV | OpenRouter (Enterprise-DPA mit EU-SCCs, mutual execution via Trust Portal), Resend (DPA inkl. SCCs), Vercel (DPA inkl. SCCs + UK IDTA), Hostinger (DPA, EU-ansässig) |
| Upstage | Privacy Policy (PIPA + EU/UK-Supplementary, Stand 21.05.2026); Verarbeitung in **AWS US**; expliziter DPA-Pfad nicht öffentlich dokumentiert |
| EU-AI-Act Art. 50 | Chat-Erstkontakt-Offenlegung ✅, /ki-hinweise ✅ (WEB-01); **Lücke:** KI-Hinweise/AVV-Seite nennen veralteten VPS-Hoster („Hetzner" statt Hostinger), keine ZDR-Erwähnung |
| Kern-Mitigation | OpenRouter **ZDR (Zero Data Retention)** aktivieren; PII-Minimierung in Prompts; DPA-Anfrage bei OpenRouter/Upstage; EU-Hosting (Vercel fra1, Hostinger DE) nutzen |

## 2. Bestandsaufnahme: Wo fließen personenbezogene Daten?

| # | Datenfluss | Endpoint/Code | Anbieter-Kette | PII im Prompt/Payload |
|---|---|---|---|---|
| 1 | Website-Chat (KI-Berater) | `apps/website/app/api/chat/route.ts` → `NINEROUTER_ENDPOINT` = `ai-router.nexifyai.cloud/v1` | Vercel (Serverless) → 9Router → **OpenRouter → DeepSeek** | Chat-Nachrichten (Name, E-Mail, Projektbedarf möglich) |
| 2 | Backend-Chat (Stream) | `backend/server.py` `POST /api/chat` → `nine.stream()` → 9Router | Backend (Hostinger-VPS) → **OpenRouter/DeepSeek** | Chat-Historie inkl. vom Nutzer eingegebener Kontaktdaten |
| 3 | AI-Projektplaner | `POST /api/planner/plan` → `llm_complete()` → `PLANNER_PROMPT` + `brief` | → 9Router → **OpenRouter/DeepSeek** | project_type, industry, goal, features, details (Freitext — kann PII enthalten) |
| 4 | Angebots-Erstellung | `POST /api/offers/request` → `OFFER_PROMPT.format(language, **name**)` + Chat-Historie | → 9Router → **OpenRouter/DeepSeek** | **Name, E-Mail, Firma, Telefon** (body.name direkt im Prompt!), Chat-Historie |
| 5 | Embeddings (Vektor-Index) | LightRAG/AgentMemory → Upstage `solar-embedding-1-large` | → **Upstage → AWS (US)** | Dokumentschnipsel/Kontext — je nach Inhalt PII (Lead-/Kunden-Daten in Wissensbasis) |
| 6 | E-Mail-Versand | `backend/server.py` `resend.Emails.send` (Offer-/Follow-up-Mails), Bulk-/Drip-Skripte | **Resend** (US; Versand eu-west-1, Kontodaten US) | Name, E-Mail, Angebotsinhalte, Lead-Daten |
| 7 | Website-Hosting/Serverless | Vercel, Region **fra1 (Frankfurt)** | **Vercel** (US-Konzern, SCCs) | Logs, Serverless-Payloads (Formulardaten bei Proxy-Routen) |
| 8 | VPS + DB | Hostinger VPS srv1243952, Frankfurt | **Hostinger** (EU, DPA) | Supabase-lokal/PostgreSQL — PII-Speicherung (Leads, Chats, Offers) |

**Kernbefund:** PII fließt real in LLM-Prompts (Pfade 1–4: Name/E-Mail bei Angeboten, Freitext-Details beim Planner) und in Embeddings (5). Das ist für die Auftragserfüllung funktional nötig, muss aber per Minimierung + Provider-Wahl abgesichert werden.

## 3. Provider-Matrix (AVV/DPA-Status, Drittland, Quellen)

| Anbieter | Sitz | Rolle | AVV/DPA | Drittland-Transfer | SCCs/DPF/Adequacy | Quellen (Stand) |
|---|---|---|---|---|---|---|
| **OpenRouter, Inc.** | USA (San Francisco) | LLM-Gateway (Router zu 60+ Upstream-Modellen) | **Enterprise-DPA vorhanden** (Exhibit A im Enterprise Access Agreement), mutual execution via Trust Portal — **noch nicht beantragt** | USA (US-Gateway-Infrastruktur; `eu.openrouter.ai` nur Enterprise, nicht default) | EU-SCCs im DPA enthalten; **kein** EU-only-Residency; ZDR (Zero Data Retention) verfügbar | openrouter.ai/privacy (06.07.2026); Zendesk 47828437697051; infercheck.eu (07.04.2026); openrouter.ai/docs/guides/features/zdr |
| **DeepSeek** | VR China | LLM-Inferenz (v4 flash/pro via OpenRouter-Routing) | **Kein AVV/DPA, kein BAA** | **China** — Verarbeitung/Speicherung in PRC; kein EU-Adequacy-Beschluss für China | Keine SCCs angeboten (direkte API); via OpenRouter-Route nur OpenRouter-Layer abgedeckt — **Upstream-Provider nicht durch OpenRouter-DPA erfasst** (infercheck) | cdn.deepseek.com/policies/.../deepseek-privacy-policy.html; sonomos.ai + aipolicydesk (2026): kein DPA/BAA/Residency |
| **Upstage Co., Ltd.** | Südkorea (Seoul) | Embeddings (solar-embedding-1-large), Nicht-LLM-Ausnahme | Privacy Policy (PIPA Art. 30 + **EU/UK-Supplementary Provisions**); **expliziter DPA-Pfad nicht öffentlich dokumentiert** | **Südkorea hat EU-Angemessenheitsbeschluss (2021/2072)** — aber: Verarbeitung in **AWS US** (Subcontractor), d. h. EU→US-Transfer über AWS | AWS US via AWS-DPF/SCCs; Korea selbst: Adequacy | upstage.ai/ko/privacy-policy (Last Revised 21.05.2026); §4 „Personal data transfer abroad": AWS Inc. (US) |
| **Resend (Plus Five Five, Inc.)** | USA | E-Mail-Versand (Offers, Follow-ups, Bulk/Drip) | **DPA inkl. SCCs** (Last update 31.12.2025) | USA — „All account data ... stored in the United States regardless of the sending region" (Versand kann eu-west-1/Irland sein) | EU-SCCs im DPA; Subprozessoren-Liste (15.07.2026): AWS, Anthropic, Cloudflare, Datadog, Google, PlanetScale, RunPod, Stripe, Supabase, Vercel u. a. | resend.com/legal/dpa (31.12.2025); resend.com/legal/subprocessors (15.07.2026); resend.com/docs/dashboard/domains/regions |
| **Vercel, Inc.** | USA | Website-Hosting/Serverless (Region fra1 = Frankfurt) | **DPA inkl. EU-SCCs + UK IDTA** (Last Updated 17.03.2026, eff. 31.03.2026) | USA (US-Konzern) trotz EU-Deployment-Region | EU-SCCs + UK IDTA im DPA | vercel.com/legal/dpa (17.03.2026); eurocomply.app/is-vercel-gdpr-compliant |
| **Hostinger** | EU (Litauen; VPS Frankfurt, DE) | VPS-Infrastruktur (Backend, DB, Dienste) | **DPA (Anhang zur Datenverarbeitung)** | EU-intern (Frankfurt) | EU; Subprozessoren als EU-EMEA-Gesellschaften (AWS EMEA SARL, Google Cloud EMEA, Cloudflare, Anthropic Ireland u. a.) | hostinger.com/de/legal/dpa; scan.meetergo.com/en/vendors/hostinger |
| **Cloudflare, Inc.** | USA | CDN/WAF/DNS (Tunnel, nexifyai.cloud-Domains) | SCCs (in Datenschutzerklärung referenziert) | USA | DPF/SCCs | apps/website/lib/legal/de.ts (Stand 04.08.2026) |

## 4. Risikobewertung

| Risiko | Stufe | Begründung |
|---|---|---|
| DeepSeek direkt (China, kein Adequacy, kein DPA) | **HOCH** | PII-Prompts (Pfad 1–4) können bei Routing auf DeepSeek-Upstream in China verarbeitet werden; OpenRouter-DPA deckt Upstream nicht ab; keine vertragliche Absicherung für DeepSeek-Layer |
| Upstage Embeddings (AWS US) | **MITTEL** | Korea hat Adequacy, aber konkrete Verarbeitung in AWS US → EU→US-Transfer; DPA-Status von Upstage unklar |
| Resend (USA) | **MITTEL** | DPA+SCCs vorhanden, aber alle Kontodaten/E-Mail-Metadaten in US; E-Mail-Inhalte (PII) durchlaufen US-Infrastruktur |
| OpenRouter (USA) | **MITTEL** | DPA+SCCs vorhanden, ZDR verfügbar (nicht aktiviert); US-Gateway-Passage zwingend |
| Vercel (USA) | **NIEDRIG** | DPA+SCCs, EU-Region fra1; verbleibendes US-Konzernrisiko |
| Hostinger (EU) | **NIEDRIG** | EU-ansässig, DPA, Frankfurt |

## 5. Mitigationen

### Kurzfristig (sofort, ohne Kosten)
1. **OpenRouter ZDR aktivieren** — `https://openrouter.ai/settings/privacy` (Zero Data Retention, enforce global): nur noch Zero-Retention-Endpoints routen. Dokumentation: https://openrouter.ai/docs/guides/features/zdr
2. **PII-Minimierung in Prompts:**
   - `backend/server.py` `OFFER_PROMPT.format(..., name=body.name)` → Name durch Pseudonym (z. B. „Interessent", Kundennummer) ersetzen; Name nur in E-Mail/DB, nicht im LLM-Prompt.
   - Systemprompt-Ergänzung für Chat/Planner: „Übermittle keine unnötigen personenbezogenen Daten; bei Bedarf Angaben generalisieren."
3. **Datenschutz-/AVV-Text-Fix:** `apps/website/lib/legal/de.ts` nennt fälschlich „Hetzner GmbH (DE)" (Z. 131, 345) — korrekt: **Hostinger** (VPS Frankfurt, verifiziert ZK §2). + ZDR-Erwähnung in /ki-hinweise §5.
4. **DPA-Anfrage OpenRouter** (Enterprise-DPA via Trust Portal, mutual execution) — Entscheidung Pascal/Compliance, da Enterprise-Tier-Kosten zu prüfen.

### Mittelfristig
5. **Upstage-DPA anfragen** (infosec@upstage.ai; DPO Min Changhyun) — Klärung: AWS-US-Verarbeitung, SCC-/DPF-Absicherung, Embedding-Input-Retention.
6. **EU-Routing prüfen:** OpenRouter `eu.openrouter.ai` (Enterprise) für EU-Verarbeitung; alternativ EU-LLM-Provider für Kundenprompts evaluieren.
7. **Retention begrenzen:** Chat-Historie/Embedding-Kontext automatisierte Löschung nach 12 Monaten (entspricht Datenschutzerklärung, Stand 04.08.2026) technisch verankern.
8. **VVT (Art. 30) pflegen:** `docs/governance/06_sicherheit_policies/VERARBEITUNGSVERZEICHNIS_VVT_ART30_DSGVO.md` um diese Matrix ergänzen.

## 6. EU-AI-Act Art. 50 — Lückenliste

| Pflicht | Status | Nachweis |
|---|---|---|
| KI-Offenlegung bei Chat-Erstkontakt | ✅ | WhatsApp/Website-Chat-Persona („NeXify AI", KI-Hinweis beim Erstkontakt) |
| /ki-hinweise-Seite (Transparenz, Einsatzbereiche, HITL) | ✅ | `apps/website/lib/legal/de.ts` (WEB-01, Commit a780e15f; live per curl 200 verifiziert, Stand 04.08.2026) |
| Provider-Transparenz (welche Modelle/Anbieter/Zweck) | ✅ (teilweise) | Datenschutzseite Z. 118–131 nennt DeepSeek/OpenRouter/Upstage/9Router — **präzisieren:** ZDR-Status + Upstage-AWS-Verarbeitung ergänzen |
| AVV-Seite Sub-Processor-Liste | ⚠️ | Z. 345 nennt „Hetzner GmbH" — **Faktenfehler** (Hostinger); DeepSeek-Direktrisiko (China) nicht eingeordnet |
| KI-generierte Inhalte kennzeichnen | ✅ | Impressum/Datenschutz: „Künstlich generierte Inhalte (KI-Assets) werden gemäß den KI-Hinweisen gekennzeichnet" |

## 7. Offene Punkte / nächste Schritte

1. OpenRouter-ZDR aktivieren (Setting-Click — braucht Pascal/Admin im OpenRouter-Account).
2. DPA-Anfragen OpenRouter + Upstage (E-Mail, Kostenprüfung Enterprise).
3. `OFFER_PROMPT`-PII-Minimierung (Name-Pseudonymisierung) implementieren — separates Entwicklungs-Ticket.
4. Website-Rechtstexte-Fix (Hetzner→Hostinger, ZDR-Erwähnung) — Commit + Vercel-Deploy.
5. VVT-Update mit Provider-Matrix.
6. Alt-Task `t_b750ab55518f` als Duplikat schließen/ignorieren (ersetzt durch t_77c78ba8).

## 8. Quellenverzeichnis (mit Stand/Datum)

1. OpenRouter Privacy Policy — Last Updated **06.07.2026** — https://openrouter.ai/privacy
2. OpenRouter DPA (Enterprise Access Agreement, Exhibit A) — https://openrouter.ai/terms-of-service-enterprise · How-to: https://openrouter.zendesk.com/hc/en-us/articles/47828437697051
3. OpenRouter ZDR — https://openrouter.ai/docs/guides/features/zdr
4. OpenRouter GDPR-Profil (InferCheck, verifiziert **07.04.2026**) — https://infercheck.eu/en/provider/openrouter
5. DeepSeek Privacy Policy — https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html
6. DeepSeek GDPR-Analyse (sonomos.ai, aipolicydesk — 2026): kein DPA/BAA, China-Speicherung
7. Upstage Privacy Policy — Last Revised **21.05.2026** — https://www.upstage.ai/ko/privacy-policy/updated-jun-01-2026 (§4: AWS-US-Subcontractor)
8. Resend DPA — Last update **31.12.2025** — https://resend.com/legal/dpa
9. Resend Subprocessors — **15.07.2026** — https://resend.com/legal/subprocessors · Regions: https://resend.com/docs/dashboard/domains/regions
10. Vercel DPA — Last Updated **17.03.2026** / eff. 31.03.2026 — https://vercel.com/legal/dpa
11. Hostinger DPA — https://www.hostinger.com/de/legal/dpa
12. EU-Angemessenheitsbeschluss Südkorea: Decision 2021/2072 (17.12.2021)
