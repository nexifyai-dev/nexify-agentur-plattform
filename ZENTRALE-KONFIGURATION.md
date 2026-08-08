
## 2026-08-08 — M-05a Blog-Serie Teil 1/2: 5 /wissen-Artikel auf 800+ Wörter erweitert + E2E — t_cd7c323d
- **Artikel (alle LIVE, Commit b8778154):** 1) /wissen/was-kostet-ki-chatbot-2026 (→ /leistungen/ki-begleiter) 2) /wissen/ki-automatisierung-kmu-7-gewinne (→ /leistungen/automatisierung) 3) /wissen/whatsapp-marketing-handwerk (→ /leistungen) 4) /wissen/ai-agenten-einfuehrung (→ /leistungen/ai-agenten) 5) /wissen/chatbot-dsgvo (→ /faq, /datenschutz) — je 810–875 Wörter (Vorgabe 800–1.500), Format-Konvention wie Bestand (body/faqs/cta, [Label](/pfad)-Links), FAQPage-Schema, Meta-Description, Sitemap-Einträge.
- **Erweiterung (Ursprung t_42c8cf40 war 440–530 Wörter):** je Artikel +2–4 Absätze mit belegten Marktdaten — DACH-KI-Marktpreise (KI-Beratung 990–4.990 €, Automatisierung 2.490–4.990 €, Pilot 4.990–9.990 €, Multi-Agent 9.990–29.990 €, RAG/Chatbot 8.000–50.000 €, Betrieb 200–2.000 €/Monat; globeriaconsulting.de/digitalmaker.io via AgentMemory dach-b2b-ki-consulting-benchmarks), DMB/Salesforce KI-Index (51,2 % / +54 % YoY / 0,35 % Umsatz / 43 % ohne Plan / Agenten 16,6 %), MIT GenAI Divide (95 % Piloten ohne P&L-Effekt, Partner 2× produktiver), ifo (57 % Daten nicht KI-tauglich, 28 % Trainings), BR-Studie (82 % KI-Informationssuche), Bußgeld-Praxis (20 Mio €/4 %, OpenAI 15 Mio €, Meta 1,2 Mrd €), Meta-Preisliste (11,31 ct, 24h-Fenster, Service kostenlos), Meta Business Agent Platform (docs/references/meta/meta-recherche-2026-08-08.md), BMWK go-digital 50 % / BAFA 3.500 €.
- **E2E (alle live verifiziert):** 5 URLs → HTTP 200; FAQPage-JSON-LD je Seite; interne Links je Artikel → alle 200 (0 kaputt); sitemap.xml enthält alle 5; Negativfall /wissen/nicht-existenter-artikel-test → 404; Duplicate-Check: keine Titel-/Slug-Duplikate (11 Artikel).
- **Deploy:** Push main → deploy-vercel.yml (production) erfolgreich; Vercel-Deploy completed/success.
## 2026-08-08 — M-05b Blog-Serie Teil 2/2: 5 /wissen-Artikel auf 800+ Wörter erweitert + E2E — t_45c5aea8
- **Artikel (alle LIVE, Commit db257704):** 6) /wissen/website-kosten-2026 (→ /preise, /checkliste) 7) /wissen/ki-steuerbuero (→ /branchen/steuerberater) 8) /wissen/automation-roi (→ /preise, /checkliste) 9) /wissen/chatgpt-unternehmen-grenzen (→ /leistungen/ki-plattform) 10) /wissen/was-kostet-web-app-2026 (UPDATE des Bestandsartikels, gleicher Slug — kein Duplikat) — Body je 822–879 Wörter (Vorgabe 800–1.500), FAQPage-Schema, Meta-Description, >=3 interne Links, CTA mit UTM, Sitemap-Einträge (automatisch via wissenArticleSlugs()).
- **Erweiterung (war 226–427 Wörter):** je Artikel +4–7 Absätze mit belegten Marktdaten — website-kosten: Hosting 50–500 €/Jahr, Wartung 50–200 €/Monat, Texterstellung 50–150 €/Seite, Stripe 500–2.000 €, Mitgliederbereich 1.000–5.000 €, Pakete 450–10.000+ €, Lieferzeiten 1–12 Wochen, Freelancer-Tagessatz 300–550 € (webcraftdev 2026, Malt 2026); ki-steuerbuero: E-Mail-Triage 150–300/Tag, 90 % Zuordnung, 2–3 h→<30 min, >95 % Trefferquote, Fristen als häufigster Haftungsschaden, Belegerfassung 15→2–3 min (~85 %), 44,8 % Papier (STAX 2024), Antwortentwürfe 5–15 min→<1 min (~80 %), Bescheidprüfung (dpa-consulting 2026); automation-roi: Ersparnis je Prozess 60–75 %, Fehlerkosten 45 min/Fehler, Wartung 10–15 %/Jahr, extern 1.500–3.000 € vs. No-Code 0–500 € + 3–8 interne Arbeitstage, mittlere Workflows 3.000–8.000 €, unsichtbare Vorarbeiten (IAPME 2026, stakk.agency 2026); chatgpt-grenzen: Safe Harbor 2015 / Privacy Shield 2020 / DPF-Anfechtung, EU AI Act bis 35 Mio € / 7 %, Datenklassen-Trennung, Unternehmensverantwortung Art. 5/24/28 DSGVO (Lurus 2026); web-app: Lieferzeiten 6–12 Wochen, versteckte Posten, SaaS-vs-Eigenbau-Abwägung, Detaillierungs-Kostenregel, laufende Kosten 500–2.500 €/Jahr (webcraftdev 2026), BMWK go-digital 50 % / BAFA 3.500 €.
- **E2E (live verifiziert, neue Deploy-Version):** 5 URLs → HTTP 200; FAQPage+Article-JSON-LD je Seite json.loads-validiert; alle 24 Body-Links → 200 (0 kaputt); Meta-Description vorhanden; sitemap.xml enthält alle 5; Duplicate-Check: je Slug 1× (Artikel 10 = Update, alter Slug erreichbar, keine zweite URL).
- **Gegentest (§5.4) Fakten-Stichprobe:** 3 Zahlen je Artikel gegen Quellen-Cache geprüft (webcraftdev.com, dpa-consulting.de, stakk.agency, lurus.ai — /root/.hermes/cache/web/): 1.500–5.000 €/5.000–50.000 €/10.000–100.000 € ✓, 67 % unterschätzen ✓, 53,6 J/45 %/2,3 %/40.000/89.856 ✓, 50 % IAB/BIBB ✓, 220–400 % ROI ✓, 2 h vs. 6,5 h Baseline ✓, 1,2 Mrd € Meta ✓, 15 Mio € OpenAI ✓, 20 Mio €/4 % ✓, 10.000–100.000 € ✓ — keine erfundenen Zahlen.
- **Deploy:** Push main (d8e6171c) → deploy-vercel.yml (production) erfolgreich; Live-Verifikation nach Deploy (Wortzahl 1.092–1.172 article-Wörter = neue Version).
- **Parallelität:** M-05a (t_cd7c323d) arbeitete im selben Repo — nur eigene Artikel-Datei angefasst, fremde Änderungen (M-05a 800+ Wörter, M-04a /erfahrungen) via merge übernommen, eigener Commit per cherry-pick auf main.

## 2026-08-08 — M-04a /erfahrungen ehrlicher Aufbau (Fake-Zitate entfernt) + Review-Request-Template + GBP/ProvenExpert-Anleitung — t_6881891e
- **GEGENTEST (§5.4):** Die von t_ceb434ff ausgelieferten 3 Kundenstimmen auf /erfahrungen (und /referenzen + Home) hatten KEINE dokumentierte Freigabe — `docs/gtm/evidence/testimonials/` leer (Permission-Pipeline fordert je Stimme eine Freigabe-Datei). → Alle 3 Zitate aus de/en/nl-Content entfernt; Seiten zeigen jetzt ehrlichen Aufbau.
- **/erfahrungen neu (LIVE):** Projekteinblicke (3 anonymisierte Cases aus /referenzen-Bestand), Block „Referenzen auf Anfrage" mit CTA /kontakt, CTAs /audit + /preise (data-testid experiences-cta-*), KEIN Review-Schema, KEIN AggregateRating, keine Sterne-Behauptung. Titel/Description ehrlich („Referenzen, Projekte & ehrliche Einblicke").
- **/referenzen + Home (references-section):** Zitate-Grid entfernt, Home-Sektion jetzt CTA-Band zu /referenzen + /erfahrungen mit ehrlichem Text (home.quotesText neu, de/en/nl).
- **Review-Request-Mail:** Template infra/lead-pipeline/templates/lead_email_review_request.html (CI-konform: Dark/Luxury #0A0A0A, C8FF00-Akzent, Outfit/Manrope, NAP + KvK/BTW/DSGVO/UWG/Art. 50-KI-Hinweis) — bereits vorhanden, verifiziert + Produktions-Kopie nach /usr/local/share/nexifyai-templates/ (MD5 identisch 54c228e6).
- **Anleitung:** docs/gtm/M-04-REVIEW-AUFBAU-ANLEITUNG-2026-08-08.md aktualisiert (Status: ehrlicher Aufbau; Zitate-Reaktivierung erst mit Freigabe-Dateien). GBP-Schritte (business.google.com, Graaf van Loonstraat 1E, 5921 JA Venlo, Kategorie, UTM, Verifizierung) + ProvenExpert (Free-Tarif) enthalten.
- **E2E:** pnpm typecheck grün, lint 0 Errors, Tests 7/7 + 18/18 grün, pnpm build grün (/erfahrungen + /referenzen statisch), Deploy via PR → main → deploy-vercel.yml.

## 2026-08-08 — M-03a Stadt-Landingpages Teil 1/2 (Berlin, Hamburg, München, Köln, Frankfurt am Main) — t_246ecdb2
- **Live:** /stadt/ki-agentur-berlin, /stadt/ki-agentur-hamburg, /stadt/ki-agentur-muenchen, /stadt/ki-agentur-koeln, /stadt/ki-agentur-frankfurt-am-main — HTTP 200, Titel-Muster "KI-Agentur [Stadt] » Gratis KI-Audit | NeXify AI" exakt (Layout-Template liefert Suffix, page ohne — Fix e4cae81f aktiv).
- **URL-Vorgabe:** Slugs auf /stadt/ki-agentur-<stadt> umbenannt (Commit f61b63d0) — entspricht Task-Vorgabe; alte Kurz-Slugs (/stadt/berlin) führen jetzt sauber zu 404 (dynamicParams=false).
- **Content:** Registry lib/gtm/stadt-seo.ts erweitert (Commit 83838d87): je Stadt 4. lokaler Branchen-Service + lokale localNote (Berlin: Startups/Kreativwirtschaft, Hamburg: Logistik/Hafen/Handel, München: Industrie/Mobilität/Versicherung, Köln: Medien/Versicherungen/Handwerk, Frankfurt: Finanz/Kanzleien/Logistik). Sichtbarer Text 457–495 Wörter je Seite (Grenze 400+).
- **Unique-Content-Gegentest (§5.4):** Pairwise Token-Overlap (Jaccard) live gemessen, worst 27,4 % (Berlin–Köln), Grenze 60 % — bestanden. Keine 1:1-Templates.
- **Schema:** LocalBusiness+ProfessionalService (Venlo-Sitz, areaServed=Stadt, kein Fake-Filialnetz), BreadcrumbList, FAQPage — je Seite json.loads-validiert, alle 3 Typen vorhanden.
- **CTAs:** 3 mit UTM (utm_source=stadtseite&utm_medium=organic&utm_campaign=<slug>) — /audit, /preise, /kontakt, live per HTML-Muster verifiziert (HTML-escaped &amp;).
- **Interne Links:** /leistungen, /branchen, /ki-agentur auf jeder Seite.
- **Sitemap:** alle 5 Einträge live (stadtSlugs() dynamisch).
- **Negativfall:** /stadt/ki-agentur-bremen → 404.
- **E2E:** pnpm typecheck grün, Vercel-Deploy (vercel CLI --prod, Project nexifyai-by-nexify) erfolgreich, Live-Verifikation über alle 5 URLs.

## 2026-08-08 — M-03b Stadt-Landingpages Teil 2/2 (Düsseldorf, Stuttgart, Leipzig, Dortmund, Hannover)
- **Live:** /stadt/duesseldorf, /stadt/stuttgart, /stadt/leipzig, /stadt/dortmund, /stadt/hannover — HTTP 200, Titel-Muster "KI-Agentur [Stadt] » Gratis KI-Audit | NeXify AI" exakt.
- **Content:** 10-Städte-Registry (lib/gtm/stadt-seo.ts, Commit 78d169e8) deckt Teil 1+2 ab; je Stadt 400+ Wörter Unique-Content (Doku: max 19 % pairwise Similarity, Grenze 60 %).
- **Fix (Commit e4cae81f):** Titel-Doppel-Suffix behoben — page.tsx gab "| NeXify AI" im title UND Root-Layout-Template "%s | NeXify AI" hängte Suffix an → "…Gratis KI-Audit | NeXify AI | NeXify AI". Jetzt: Template liefert Suffix, page übergibt ohne.
- **Schema:** LocalBusiness+ProfessionalService (Venlo-Sitz, areaServed=Stadt, kein Fake-Filialnetz), BreadcrumbList (3), FAQPage (4) — pro Seite validiert.
- **CTAs:** 3 mit UTM (utm_source=stadtseite&utm_medium=organic&utm_campaign=<slug>) — /audit, /preise, /kontakt.
- **Interne Links:** /leistungen, /branchen, /ki-agentur — alle HTTP 200 (Link-Check über alle 5 Seiten).
- **Sitemap:** alle 5 Einträge live (stadtSlugs() dynamisch, Commit 78d169e8).
- **Negativfall:** /stadt/bremerhaven, /stadt/oberhausen, /stadt/404er-test → 404 (dynamicParams=false).
- **E2E:** pnpm build grün (Next 16.2.12), lokaler Smoke-Test (200 + korrektes Titel-Muster + 404), Deploy via GitHub Action deploy-vercel.yml → production (Run 31273493205, success).

## 2026-08-08 — M-01 E-Book-Lead-Magnet live + Fix /api/ebook (500)
- **Landingpage** /ebook live (PR #365, Commit e05fde89) — 10 Strategien, Opt-in, UTM.
- **Fix:** /api/ebook gab 500 (Vercel-Lambda: SUPABASE_URL=127.0.0.1:8000 unerreichbar,
  JWT_SECRET leer). Lösung: Backend-Endpoint /api/ebook (ebook_endpoint.py, FastAPI :8901)
  + Frontend-Route als Proxy (proxyPost). Commit 595176bc.
- **Backend-Endpoint** schreibt Opt-in-Lead in Drip-Tabelle `leads` (PostgREST,
  Service-Role-JWT mit PGRST_JWT_SECRET + pipeline-Service-Key KGDX…) UND nexify_leads
  (Pool), sendet E-Book-Mail via send_email (Resend→SMTP-Fallback). CI-Mail #111114/Lime.
- **Drip-Trigger:** drip-campaign.py um Opt-in-Filter erweitert (nur source=ebook oder
  metadata.consent=true) — UWG-§7-Compliance: keine Mails an gescrapte firecrawl-Leads.
  Produktionskopien synchronisiert (3 Pfade), Timer aktiv (täglich 00:04).
- **E2E:** api.nexifyai.cloud + www.nexifyai.cloud POST /api/ebook → 200, leadStored+leadNex+mailSent
  (DB belegt). Negativfall (ungültige Mail) → 400. PDF 200 (109 KB). tsc + Build grün.
- **Cleanup:** alle Test-Leads entfernt; e2e-*-Leads auf contacted (kein Drip-Versand).
- **Befund:** hermes.env überschreibt SUPABASE_SERVICE_ROLE_KEY mit sb_secret_*-Key
  (Kong: 401) — Backend liest Service-Key deshalb explizit aus pipeline.env.
