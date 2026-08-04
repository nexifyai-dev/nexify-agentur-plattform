// /api/chat — Live Chat via 9Router
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_DE = `Du bist der KI-Berater von NeXify AI.\n\nUNTERNEHMENSDATEN:\n• NeXify AI by NeXify – Chat it. Automate it.\n• Inhaber: Pascal Courbois\n• Sitz: Venlo (NL), Kunden: DACH + NL\n• Tagessatz: 449 € netto / Arbeitstag\n• max. 8 Fachstunden pro Tag\n\nKOMMUNIKATIONSREGELN (DIN 5008):\n• Professionelle Geschäftskorrespondenz\n• Korrekte Anrede mit "Sie"\n• Absätze durch Leerzeile getrennt\n• Maximal 3–4 Sätze pro Antwort\n• Keine Emojis, keine URLs im Fließtext\n• Button-Vorschläge am Ende: [BTN:Label|/pfad]\n\nBUTTON-VORLAGEN:\n[BTN:Leistungen ansehen|/leistungen]\n[BTN:Preise & Ablauf|/preise]\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Projekt anfragen|/kontakt]`;

export async function POST(request: Request) {
  try {
    const { message, language } = await request.json();
    const msg = (message || "").trim();
    const lang = language === "en" ? "en" : language === "nl" ? "nl" : "de";

    if (!msg) {
      return Response.json({ reply: "Guten Tag!\n\nWie kann ich Ihnen behilflich sein? Ich beantworte Ihre Fragen zu unseren Leistungen, Preisen oder erstelle eine erste Einschätzung für Ihr Projekt.\n\n[BTN:Leistungen ansehen|/leistungen]\n[BTN:Preise & Ablauf|/preise]\n[BTN:Rückruf vereinbaren|/rueckruf]" });
    }

    // API-Key direkt
    const apiKey = process.env.NINEROUTER_API_KEY || "";
    const endpoint = (process.env.NINEROUTER_ENDPOINT || "https://ai-router.nexifyai.cloud/v1").replace(/\/+$/, "");

    if (!apiKey) {
      return Response.json({
        reply: "Guten Tag!\n\nAktuell ist unser Live-Beratungssystem in der Aktivierungsphase. Ich helfe Ihnen gerne auf direktem Wege weiter.\n\nSie erreichen Pascal Courbois persönlich unter mail@nexifyai.cloud oder telefonisch unter +31 6 133 188 56.\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]",
      });
    }

    // Direkter fetch ohne komplexe Fehlerbehandlung
    const response = await fetch(endpoint + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({
        model: "openrouter/deepseek/deepseek-v4-flash-0731",
        messages: [
          { role: "system", content: SYSTEM_DE },
          { role: "user", content: msg },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) {
        // Buttons parsen
        const btnRegex = /\[BTN:([^\]|]+)\|([^\]]+)\]/g;
        const buttons: { label: string; href: string }[] = [];
        let m;
        while ((m = btnRegex.exec(text)) !== null) {
          buttons.push({ label: m[1].trim(), href: m[2].trim() });
        }
        const clean = text.replace(btnRegex, "").trim().replace(/\n{3,}/g, "\n\n");
        return Response.json({ reply: clean || text, buttons: buttons.length > 0 ? buttons : [{ label: "Rückruf vereinbaren", href: "/rueckruf" }, { label: "Leistungen", href: "/leistungen" }] });
      }
    }

    // API-Fehler oder leere Antwort
    const status = response.status;
    return Response.json({
      reply: status === 401 || status === 403
        ? "Guten Tag!\n\nUnser Live-Beratungssystem ist aktuell in Wartung.\n\nPascal Courbois steht Ihnen persönlich zur Verfügung:\n• Telefon: +31 6 133 188 56\n• E-Mail: mail@nexifyai.cloud\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]"
        : "Guten Tag!\n\nVielen Dank für Ihre Anfrage. Pascal Courbois wird sich innerhalb eines Werktages persönlich bei Ihnen melden.\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Leistungen ansehen|/leistungen]",
    });
  } catch {
    return Response.json({ reply: "Guten Tag!\n\nBitte entschuldigen Sie die technische Störung. Sie erreichen uns direkt:\n\n• E-Mail: mail@nexifyai.cloud\n• Telefon: +31 6 133 188 56\n\n[BTN:Rückruf vereinbaren|/rueckruf]\n[BTN:Kontaktformular|/kontakt]" });
  }
}
