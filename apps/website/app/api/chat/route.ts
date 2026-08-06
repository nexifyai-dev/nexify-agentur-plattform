// /api/chat — Live Chat via 9Router + AI-Projektplaner-Integration
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM = {
  de: `Du bist NeXify AI, die Unternehmens-KI von NeXify (Chat it. Automate it.). Du berätst als Experte unsere Kunden, Leads und Besucher. Antworte IMMER auf Deutsch.

UNTERNEHMENSDATEN:
• NeXify AI by NeXify – Chat it. Automate it.
• Inhaber: Pascal Courbois
• Sitz: Venlo (NL), Kunden: DACH + NL
• Tagessatz: 449,00 € netto / Arbeitstag
• max. 8 Fachstunden pro Tag
• Richtwerte: KI-Chat-Agent 3–5 Tage, Terminbuchung 2 Tage, E-Mail-Triage 2–3 Tage, Angebots-Generator 3 Tage, CRM-Integration 4–6 Tage, Wissensdatenbank 3 Tage, Reporting-Dashboard 2 Tage, Betreuung 249,00 €/Monat optional
• Preismodell: Umsetzung nach Aufwand (Tagessatz), keine versteckten Kosten, keine Abo-Pflicht

FORMATIERUNG NACH DIN 5008 (zwingend, Fassung 2020-03):
• Anrede immer mit "Sie", keine "du"-Form; Anrede wird durch Leerzeile vom Text getrennt
• Zahlen: Tausendertrennzeichen als Punkt, Dezimalkomma (Beispiel: 1.350,00 € oder 449,00 € netto)
• Währungssymbol hinter dem Betrag (Beispiel: 1.350,00 €, nicht €1.350,00)
• Datumsformat: TT.MM.JJJJ (Beispiel: 04.08.2026); bei internationalem Kontext JJJJ-MM-TT nach ISO 8601
• Uhrzeit: 09:00 Uhr bis 18:00 Uhr (Doppelpunkt, kein Punkt)
• Abkürzungen mit Leerzeichen nach jedem Punkt: z. B., d. h., u. a., ca. — niemals "z.B." oder "ca."
• Einheiten: 449,00 € netto, 8 Fachstunden, 14 Tage — mit Leerzeichen zwischen Zahl und Einheit
• Absätze durch Leerzeile getrennt, keine HTML-Tags
• Aufzählungen mit Gedankenstrichen (–), nicht mit Sternchen oder Pluszeichen
• Keine Emojis, keine URLs im Fließtext
• Korrekte Zeichensetzung, deutsche Anführungszeichen „…"
• Telefonnummern mit internationaler Vorwahl: +31 6 133 188 56 (Leerzeichen nach Vorwahl)
• Betreff-artige Überschriften ohne Punkt am Ende, durch Leerzeile vom Text getrennt
• Maximal 8 Fachstunden pro Tag, keine Überversprechen

ANTWORTUMFANG (zwingend):
• Jede Antwort: 4–8 Sätze, strukturiert in 2–3 Absätzen
• Erst ein einleitender Satz, dann Details mit konkreten Zahlen/Begriffen, dann ein Abschluss mit nächstem Schritt
• Preisangaben immer mit konkreter Spanne: Minimum und Maximum in Euro
• Keine knappen Ein-Wort-Antworten, keine unvollständigen Sätze
• Am Ende Button-Vorschläge: [BTN:Label|/pfad]

BUTTON-VORLAGEN:
[BTN:Leistungen ansehen|/leistungen]
[BTN:Preise & Ablauf|/preise]
[BTN:Rückruf vereinbaren|/rueckruf]
[BTN:Projekt anfragen|/kontakt]`,
  en: `You are NeXify AI, the corporate AI of NeXify (Chat it. Automate it.). You act as an expert advisor for our customers, leads and visitors. Always answer in English.

COMPANY FACTS:
• NeXify AI by NeXify – Chat it. Automate it.
• Owner: Pascal Courbois
• Based in Venlo (NL), clients: DACH + NL
• Day rate: €449.00 net / working day
• max. 8 billable hours per day
• Typical effort: AI chat agent 3–5 days, appointment booking 2 days, email triage 2–3 days, proposal generator 3 days, CRM integration 4–6 days, knowledge base 3 days, reporting dashboard 2 days, ongoing care €249.00/month optional
• Pricing: implementation by effort (day rate), no hidden costs, no subscription lock-in

FORMATTING (business standard):
• Use "you" (formal)
• Numbers with thousands separator and decimal point (e.g. 1,350.00)
• Currency symbol before amount (e.g. €1,350.00)
• Separate paragraphs with blank lines, no HTML
• Use dashes (–) for lists
• No emojis, no URLs in plain text
• Max 8 billable hours per day, no overpromising

ANSWER LENGTH (required):
• Each answer: 4–8 sentences, structured in 2–3 paragraphs
• Start with one introductory sentence, then details with concrete figures, then a closing with next step
• Price answers always give a concrete range: minimum and maximum in euros
• No one-word answers, no incomplete sentences
• End with button suggestions: [BTN:Label|/path]

BUTTON TEMPLATES:
[BTN:View Services|/leistungen]
[BTN:Pricing|/preise]
[BTN:Book a callback|/rueckruf]
[BTN:Start a project|/kontakt]`,
  nl: `Je bent NeXify AI, de bedrijfs-AI van NeXify (Chat it. Automate it.). Je adviseert als expert onze klanten, leads en bezoekers. Antwoord ALTIJD in het Nederlands.

BEDRIJFSGEGEVENS:
• NeXify AI by NeXify – Chat it. Automate it.
• Eigenaar: Pascal Courbois
• Gevestigd in Venlo (NL), klanten: DACH + NL
• Dagtarief: € 449,00 netto / werkdag
• max. 8 factureerbare uren per dag
• Richtwaarden: AI-chatagent 3–5 dagen, afspraakboeking 2 dagen, e-mailtriage 2–3 dagen, offertegenerator 3 dagen, CRM-integratie 4–6 dagen, kennisbank 3 dagen, rapportagedashboard 2 dagen, beheer € 249,00/maand optioneel
• Prijsmodel: realisatie op basis van inzet (dagtarief), geen verborgen kosten, geen abo-verplichting

FORMATTERING (zakelijke norm, DIN 5008):
• Gebruik "u" (formeel)
• Getallen met punten als duizendtal-scheiding, komma als decimaal (bijv. € 1.350,00)
• Valutateken vóór het bedrag (bijv. € 1.350,00)
• Alinea's gescheiden door lege regel, geen HTML
• Opsommingen met liggende streepjes (–)
• Geen emoji's, geen URL's in platte tekst
• Max 8 factureerbare uren per dag, geen overselling

ANTWOORDLENGTE (verplicht):
• Elk antwoord: 4–8 zinnen, gestructureerd in 2–3 alinea's
• Eerst een inleidende zin, dan details met concrete cijfers, dan een afsluiting met volgende stap
• Prijsantwoorden geven altijd een concrete bandbreedte: minimum en maximum in euro's
• Geen eenwoord-antwoorden, geen onvolledige zinnen
• Eindig met knopvoorstellen: [BTN:Label|/pad]

KNOP-VOORBEELDEN:
[BTN:Diensten bekijken|/leistungen]
[BTN:Prijzen|/preise]
[BTN:Terugbelafspraak maken|/rueckruf]
[BTN:Project starten|/kontakt]`,
} as const;

// [BTN:Label|/pfad] aus Text extrahieren → buttons-Array + bereinigter reply-Text
function withButtons(text: string) {
  const btnRegex = /\[BTN:([^\]|]+)\|([^\]]+)\]/g;
  const buttons: { label: string; href: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = btnRegex.exec(text)) !== null) {
    buttons.push({ label: m[1].trim(), href: m[2].trim() });
  }
  const clean = text.replace(btnRegex, "").trim().replace(/\n{3,}/g, "\n\n");
  return { reply: clean || text, buttons };
}

// --- NeXify AI Chat-to-Plan-Integration ---

/** Mapping: Chat-Keywords → Planner-Projekttyp (language-keyed) */
const CHAT_PLAN_TYPES: Record<string, { type: string; lang: string }> = {
  landingpage: { type: "Landingpage", lang: "de" },
  "landing-page": { type: "Landingpage", lang: "en" },
  "landing page": { type: "Landingpage", lang: "nl" },
  website: { type: "Unternehmenswebsite", lang: "de" },
  "corporate website": { type: "Unternehmenswebsite", lang: "en" },
  webseite: { type: "Unternehmenswebsite", lang: "de" },
  bedrijfswebsite: { type: "Unternehmenswebsite", lang: "nl" },
  onlineshop: { type: "Onlineshop", lang: "de" },
  "online-shop": { type: "Onlineshop", lang: "nl" },
  webshop: { type: "Onlineshop", lang: "nl" },
  ecommerce: { type: "Enterprise-Commerce", lang: "de" },
  "e-commerce": { type: "Enterprise-Commerce", lang: "en" },
  enterprise: { type: "Enterprise-Commerce", lang: "de" },
  webapp: { type: "Web-App", lang: "de" },
  "web-app": { type: "Web-App", lang: "en" },
  webapplikatie: { type: "Web-App", lang: "nl" },
  "mobile app": { type: "Mobile App", lang: "de" },
  mobilapp: { type: "Mobile App", lang: "de" },
  automatisierung: { type: "Automatisierung", lang: "de" },
  automation: { type: "Automatisierung", lang: "en" },
  automatisering: { type: "Automatisierung", lang: "nl" },
  "ki-agent": { type: "AI-Agenten", lang: "de" },
  "ai-agent": { type: "AI-Agenten", lang: "en" },
  aiagent: { type: "AI-Agenten", lang: "nl" },
  chatbot: { type: "AI-Agenten", lang: "de" },
  "ki-chatbot": { type: "AI-Agenten", lang: "de" },
};

/** Plan-Intent-Keywords: wenn eines davon in der Nachricht vorkommt, triggert den Planner */
const PLAN_INTENT_KEYWORDS = [
  "angebot", "offer", "offerte", "preis", "price", "prijs", "kosten", "cost", "kost",
  "projekt planen", "plan project", "project plannen", "brauche", "need", "nodig",
  "erstellen", "erstellung", "create", "bauen", "build", "bouwen",
];

/** Erkennt, ob die Nachricht einen Plan-Intent hat und extrahiert den Projekttyp */
function detectPlanIntent(message: string): { triggered: boolean; projectType: string | null; language: string } {
  const lower = message.toLowerCase();

  // Prüfe auf Plan-Intent-Keywords
  const hasIntent = PLAN_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
  if (!hasIntent) return { triggered: false, projectType: null, language: "de" };

  // Finde Projekttyp-Match (längste Matches zuerst)
  const typeMatches = Object.entries(CHAT_PLAN_TYPES)
    .filter(([kw]) => lower.includes(kw))
    .sort(([a], [b]) => b.length - a.length);

  if (typeMatches.length === 0) return { triggered: false, projectType: null, language: "de" };

  return {
    triggered: true,
    projectType: typeMatches[0][1].type,
    language: typeMatches[0][1].lang,
  };
}

const PLANNER_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.nexifyai.cloud") + "/api/planner/plan";

async function callPlanner(projectType: string, message: string, language: string) {
  // Extrahiere Branche und Ziel aus der Nachricht (einfache Heuristik)
  const industryPatterns: Record<string, RegExp> = {
    de: /(?:für|für eine[nr]?|branche|praxis|kanzlei|agentur|handel|bau|arzt|zahnarzt|maschinenbau|industrie|gastronomie|hotel|einzelhandel|logistik|bildung|versicherung|immobilien)\s+(\S+(?:\s+\S+){0,4})/i,
    en: /(?:for a[n]?|industry|practice|agency|retail|construction|doctor|dentist|engineering|manufacturing|logistics|education|insurance|real\s*estate)\s+(\S+(?:\s+\S+){0,4})/i,
    nl: /(?:voor een|branche|praktijk|bureau|handel|bouw|arts|tandarts|machinebouw|industrie|logistiek|onderwijs|verzekering|vastgoed)\s+(\S+(?:\s+\S+){0,4})/i,
  };

  const goalPatterns: Record<string, RegExp> = {
    de: /(?:ziel|erreichen|anfragen|verkauf|mehr|online|kunden|termin|buchung|automatisieren|optimieren|steigern)\s+(\S+(?:\s+\S+){0,10})/i,
    en: /(?:goal|achieve|inquiries|sales|more|online|customers|appointment|booking|automate|optimize|increase)\s+(\S+(?:\s+\S+){0,10})/i,
    nl: /(?:doel|bereiken|aanvragen|verkoop|meer|online|klanten|afspraak|boeking|automatiseren|optimaliseren|verhogen)\s+(\S+(?:\s+\S+){0,10})/i,
  };

  const lang = language || "de";
  const industryMatch = message.match(industryPatterns[lang] || industryPatterns.de);
  const goalMatch = message.match(goalPatterns[lang] || goalPatterns.de);

  const body: Record<string, unknown> = {
    project_type: projectType,
    industry: industryMatch?.[1] || "Unbekannte Branche",
    goal: goalMatch?.[1] || message.slice(0, 120),
    features: [],
    details: message.slice(0, 500),
    language: lang,
  };

  const res = await fetch(PLANNER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Planner failed: ${res.status}`);
  return res.json();
}

export async function POST(request: Request) {
  try {
    const { message, language } = await request.json();
    const msg = (message || "").trim();
    const lang = language === "en" ? "en" : language === "nl" ? "nl" : "de";

    if (!msg) {
      return Response.json(
        withButtons("Guten Tag!\n\nWie kann ich Ihnen behilflich sein? Ich beantworte Ihre Fragen zu unseren Leistungen, Preisen oder erstelle eine erste Einschätzung für Ihr Projekt.\n\n[BTN:Leistungen ansehen|/leistungen]\n[BTN:Preise & Ablauf|/preise]\n[BTN:Rückruf vereinbaren|/rueckruf]")
      );
    }

    // --- NeXify AI: Plan-Intent-Erkennung ---
    const planIntent = detectPlanIntent(msg);
    if (planIntent.triggered && planIntent.projectType) {
      try {
        const planResult = await callPlanner(planIntent.projectType, msg, lang);
        const planText = `${planResult.plan.summary}\n\nModule & Preisspanne:\n${planResult.plan.modules.map((m: { name: string; days_min: number; days_max: number }) => `– ${m.name}: ${m.days_min === m.days_max ? m.days_min : `${m.days_min}–${m.days_max}`} Tag(e) · ${m.days_min === m.days_max ? `${(m.days_min * 449).toLocaleString("de-DE")} €` : `${(m.days_min * 449).toLocaleString("de-DE")} – ${(m.days_max * 449).toLocaleString("de-DE")} €`}`).join("\n")}\n\nRichtpreis gesamt: ${planResult.price_min.toLocaleString("de-DE")} – ${planResult.price_max.toLocaleString("de-DE")} € netto\n\n[BTN:Verbindliches Angebot per E-Mail|/angebot?session=${planResult.session_id}]\n[BTN:Preise & Ablauf|/preise]\n[BTN:Rückruf vereinbaren|/rueckruf]`;

        const out = withButtons(planText);
        return Response.json({
          type: "plan",
          plan: planResult,
          ...out,
        });
      } catch (e) {
        console.error("Planner integration error:", e);
        // Fallback: normaler Chat
      }
    }

    // API-Key direkt
    const apiKey = process.env.NINEROUTER_API_KEY || "";
    const endpoint = (process.env.NINEROUTER_ENDPOINT || "https://ai-router.nexifyai.cloud/v1").replace(/\/+$/, "");

    if (!apiKey) {
      return Response.json(
        withButtons("Guten Tag!\n\nAktuell ist unser Live-Beratungssystem in der Aktivierungsphase. Ich helfe Ihnen gerne auf direktem Wege weiter.\n\nSie erreichen Pascal Courbois persönlich unter mail@nexifyai.cloud oder telefonisch unter +31 6 133 188 56.\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]")
      );
    }

    // Direkter fetch ohne komplexe Fehlerbehandlung
    const response = await fetch(endpoint + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({
        model: "ds/deepseek-v4-flash",
        messages: [
          { role: "system", content: SYSTEM[lang] },
          { role: "user", content: msg },
        ],
        max_tokens: 1000,
        temperature: 0.6,
        thinking: { type: "enabled", budget_tokens: 16000 },
      }),
    });

    if (response.ok) {
      const raw = await response.text();
      const data = JSON.parse(raw.slice(0, raw.lastIndexOf("}") + 1));
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) {
        const out = withButtons(text);
        return Response.json({
          type: "text",
          ...out,
          buttons: out.buttons.length > 0 ? out.buttons : [{ label: "Rückruf vereinbaren", href: "/rueckruf" }, { label: "Leistungen", href: "/leistungen" }],
        });
      }
    }

    const status = response.status;
    return Response.json({
      type: "text",
      ...withButtons(
        status === 401 || status === 403
          ? "Guten Tag!\n\nUnser Live-Beratungssystem ist aktuell in Wartung.\n\nPascal Courbois steht Ihnen persönlich zur Verfügung:\n• Telefon: +31 6 133 188 56\n• E-Mail: mail@nexifyai.cloud\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]"
          : "Guten Tag!\n\nVielen Dank für Ihre Anfrage. Pascal Courbois wird sich innerhalb eines Werktages persönlich bei Ihnen melden.\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Leistungen ansehen|/leistungen]"
      ),
    });
  } catch (e) {
    return Response.json({
      type: "text",
      ...withButtons("Guten Tag!\n\nBitte entschuldigen Sie die technische Störung. Sie erreichen uns direkt:\n\n• E-Mail: mail@nexifyai.cloud\n• Telefon: +31 6 133 188 56\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]"),
    });
  }
}
