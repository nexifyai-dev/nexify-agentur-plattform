// /api/chat — Live Chat via 9Router
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
      // 9Router hängt gelegentlich Content nach dem JSON an → bis zum letzten } parsen
      const data = JSON.parse(raw.slice(0, raw.lastIndexOf("}") + 1));
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) {
        const out = withButtons(text);
        return Response.json({
          ...out,
          buttons: out.buttons.length > 0 ? out.buttons : [{ label: "Rückruf vereinbaren", href: "/rueckruf" }, { label: "Leistungen", href: "/leistungen" }],
        });
      }
    }

    // API-Fehler oder leere Antwort
    const status = response.status;
    return Response.json(
      withButtons(
        status === 401 || status === 403
          ? "Guten Tag!\n\nUnser Live-Beratungssystem ist aktuell in Wartung.\n\nPascal Courbois steht Ihnen persönlich zur Verfügung:\n• Telefon: +31 6 133 188 56\n• E-Mail: mail@nexifyai.cloud\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]"
          : "Guten Tag!\n\nVielen Dank für Ihre Anfrage. Pascal Courbois wird sich innerhalb eines Werktages persönlich bei Ihnen melden.\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Leistungen ansehen|/leistungen]"
      )
    );
  } catch (e) {
    return Response.json(
      withButtons("Guten Tag!\n\nBitte entschuldigen Sie die technische Störung. Sie erreichen uns direkt:\n\n• E-Mail: mail@nexifyai.cloud\n• Telefon: +31 6 133 188 56\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]")
    );
  }
}
