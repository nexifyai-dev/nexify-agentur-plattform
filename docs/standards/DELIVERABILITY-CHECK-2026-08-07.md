# Deliverability-Status & Maßnahmen — NeXifyAI (2026-08-07)

**Anlass:** GO-LIVE Live-Produktionsbetrieb (500 Mails/Tag Ziel). Tiefen-Recherche (SearXNG, Firecrawl-MCP) + IST-Checks gegen Best-Practices.

---

## 1. Status-Matrix (E2-verifiziert)

| Faktor | Status | Beleg |
|---|---|---|
| SPF | ✅ | `v=spf1 include:_spf.mail.hostinger.com include:amazonses.com ~all` (dns.google, von außen) |
| MX | ✅ | mx1/mx2.hostinger.com (10/5) |
| DMARC | ✅ | `v=DMARC1; p=quarantine; rua=mailto:nexify.login@gmail.com` |
| **DKIM** | ❌ | Selector default/hostinger/selector1 leer (dns.google) — nur hPanel aktivierbar (MAIL-03, Pascal-Schritte) |
| Opt-out-Link | ✅ (fix) | `/api/outreach/unsubscribe?email=…&token=…` — E2E 3/3 (gültig/falsch/ohne Token), Commit 21427f62; vorher 404 = P0 |
| List-Unsubscribe-Header | ✅ | server.py:742 mailto mit subject=unsubscribe |
| Bounce-Handling | ✅ (fix) | ✗-Adressen → `status='bounced'` + State-Suppression (alle 3 Wellen), Commit 443e77f8 |
| Werbe-Kennzeichnung | ✅ | „gewerbliche Kontaktaufnahme (Werbung)" in allen Templates |
| Plain-Text-Alternative | ✅ | vorhanden (email_lead.py) |
| Sende-Rhythmus | ✅ | 06:00 + 18:00, 30–60s Delay/Mail (natürliche Drossel) |
| Absender-Konsistenz | ✅ | mail@nexifyai.cloud, identische Templates (3 Orte MD5-synchron) |

## 2. Offene Risiken & Maßnahmen

1. **DKIM fehlt (hoch):** Bis Aktivierung Spam-Risiko für Bulk. Maßnahme: hPanel 5 Min (Pascal) → Record bei Cloudflare → E2E (mail-tester.com „DKIM: PASS"). Bis dahin SPF/DMARC als Rückgrat.
2. **Warm-up-Phase (mittel):** Tag 1 = 572 Mails nach nur 72 Vor-Mails — steiler Start ohne Reputations-Aufbau. Empfehlung (Option für Pascal, widerspricht 500/Tag-Direktive): Ramp 7–14 Tage (150 → 250 → 400 → 500), Bounce <2 %, Spam-Complaints <0,1 % überwachen. Hostinger-SMTP + bestehende SPF/DMARC mildern.
3. **Role-based-Adressen (mittel):** Lead-Pool enthält info@/kontakt@/mail@-Adressen — höheres Spam-/Complaint-Risiko. Maßnahme: Enrichment bevorzugt persönliche Adressen; role-based nur mit niedriger Frequenz (bereits 1×-Kontakt) — Empfehlung für LeadGen-Query-Tuning.
4. **Bounce-Monitoring (niedrig):** Bounce-Zähler im Log (✗) vorhanden; nach Bounce-Fix sollten ✗ nur noch neue tote Adressen sein. Ziel: <2 %.
5. **Google Postmaster (optional):** Domain-Verify für nexifyai.cloud einrichten → Spam-Rate/Reputation live. Pascal-Aktion (Domain-Inhaber), 10 Min.

## 3. Recherche-Quellenlage (ehrlich)

- SearXNG-Recherche lief (de/en), die ersten Deliverability-Guide-URLs (messageflow.com, bouncezero.com, postmarkapp.com/guides, support.google.com/mail/answer/8113) waren **404/tot** — verworfen.
- Verwendetes Wissen = etablierte Deliverability-Praktiken (SPF/DKIM/DMARC, Warm-up, Bounce<2 %, Role-based, Opt-out-Pflicht) + verifizierte IST-Fakten oben.
- Kanal-Stand: SearXNG (8090) liefert bei kurzen Queries; Firecrawl-MCP (3003) E3-getestet; Hermes-web-Tools (web_search/web_extract) ohne FIRECRAWL-Env im WebUI-Container → OPS-04.

---

*Erstellt: 2026-08-07, System-CEO. Nächster Check: nach DKIM-Aktivierung + nach 7 Tagen Bulk-Betrieb (Bounce-/Complaint-Review).*
