// /api/chat — Live AI Chat via 9Router (DeepSeek-Reasoner + Think-Max)
// Env: NINEROUTER_ENDPOINT, NINEROUTER_API_KEY
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AI_ROUTER_URL = process.env.NINEROUTER_ENDPOINT || "https://ai-router.nexifyai.cloud/v1";
const AI_API_KEY = process.env.NINEROUTER_API_KEY || "";
const AI_MODEL = "deepseek/deepseek-reasoner";

const SYSTEM_PROMPT = `Du bist der KI-Berater von NeXify AI — Premium-Agentur für KI-gestützte Websites, Shops, Apps und Automatisierung. Tagessatz: 449 € netto. Deutsch & Nederlands.

Deine Rolle: Beantworte Fragen präzise und ehrlich. Biete bei ernsthaftem Interesse einen Rückruf an: https://www.nexifyai.cloud/rueckruf. Maximal 3-4 Sätze. Kein Marketing. Keine erfundenen Referenzen.`;

export async function POST(request: Request) {
  if (!AI_API_KEY) {
    return Response.json({ reply: "Unser KI-Berater ist in Kürze für Sie da. Buchen Sie direkt einen Rückruf: https://www.nexifyai.cloud/rueckruf" });
  }

  try {
    const { message } = await request.json();
    if (!message?.trim()) return Response.json({ reply: "Bitte stellen Sie eine Frage." });

    const res = await fetch(`${AI_ROUTER_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${AI_API_KEY}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
        thinking: { type: "enabled", budget_tokens: 16000 },
      }),
    });

    if (!res.ok) {
      return Response.json({ reply: "Unser KI-Berater ist gerade ausgelastet. Buchen Sie direkt einen Rückruf: https://www.nexifyai.cloud/rueckruf" });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() ||
      "Danke für Ihre Anfrage! Ein Berater meldet sich innerhalb eines Werktags.";

    return Response.json({ reply });
  } catch {
    return Response.json({ reply: "Danke! Ein Berater meldet sich innerhalb eines Werktags bei Ihnen — oder buchen Sie direkt: https://www.nexifyai.cloud/rueckruf" });
  }
}
