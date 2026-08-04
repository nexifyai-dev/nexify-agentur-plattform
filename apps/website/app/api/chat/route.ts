// /api/chat — Live AI Chat via 9Router (DeepSeek-V4)
// SSE-Streaming für Chat-Widget, Sprache wird aus dem Chat-Kontext übernommen
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AI_ROUTER_URL = process.env.NINEROUTER_ENDPOINT?.replace(/\/v1$/, "") || "https://ai-router.nexifyai.cloud";
const AI_API_KEY = process.env.NINEROUTER_API_KEY || "";
const AI_MODEL = "openrouter/deepseek/deepseek-v4-flash-0731";

const SYSTEM_PROMPT = `Du bist der KI-Berater von NeXify AI — einer Premium-Agentur für KI-gestützte Websites, Shops, Apps und Automatisierung.

Deine Rolle:
- Beantworte Fragen zu unseren Leistungen (Websites, Shops, Apps, KI-Agenten, Automatisierung)
- Erkläre unseren transparenten Tagessatz: 449 € netto pro Umsetzungstag
- Nenne realistische Zeitrahmen: Landingpage 1-3 Tage, Website 5-10 Tage, Shop 8-20 Tage
- Biete bei ernsthaftem Interesse einen Rückruf an (https://www.nexifyai.cloud/rueckruf)
- Sei präzise, ehrlich und verkaufe nicht aufdringlich
- Bei technischen Detailfragen verweise auf ein persönliches Gespräch

WICHTIG:
- Keine falschen Versprechungen
- Keine erfundenen Referenzen
- Immer auf Deutsch antworten (außer Nutzer schreibt NL/EN)
- Maximal 3-4 Sätze pro Antwort
- Kein Marketing-Blabla`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message?.trim()) return Response.json({ reply: "Bitte stellen Sie eine Frage." });

    // An 9Router senden
    const res = await fetch(`${AI_ROUTER_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const fallback = "Unser KI-Berater ist gerade ausgelastet. Ein Teammitglied meldet sich innerhalb eines Werktags bei Ihnen — oder buchen Sie direkt einen Rückruf: https://www.nexifyai.cloud/rueckruf";
      return Response.json({ reply: fallback });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || 
      "Danke für Ihre Anfrage! Ein Berater meldet sich innerhalb eines Werktags mit einer konkreten Einschätzung.";

    return Response.json({ reply });
  } catch {
    return Response.json({
      reply: "Danke! Ein Berater meldet sich innerhalb eines Werktags mit einer konkreten Einschätzung und einem Terminvorschlag — oder buchen Sie direkt: https://www.nexifyai.cloud/rueckruf",
    });
  }
}
