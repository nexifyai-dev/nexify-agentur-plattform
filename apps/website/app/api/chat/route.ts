// /api/chat — Live Chat via 9Router
// Default-Model verifiziert: openrouter/deepseek/deepseek-v4-flash-0731
// Env: NINEROUTER_API_KEY
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AI_URL = (process.env.NINEROUTER_ENDPOINT || "https://ai-router.nexifyai.cloud").replace(/\/v1\/?$/, "") + "/v1";
const AI_KEY = process.env.NINEROUTER_API_KEY || "";
const AI_MODEL = "openrouter/deepseek/deepseek-v4-flash-0731";

const PROMPTS: Record<string, string> = {
  de: `Du bist Pascal's KI-Berater bei NeXify AI. Tagessatz: 449 € netto/Tag. Freundlich, kurz (2-3 Sätze). Biete Buttons an: [BTN:Label|/pfad]`,
  en: `You are Pascal's AI advisor at NeXify AI. Day rate: €449 net. Be friendly, concise (2-3 sentences). Offer buttons: [BTN:Label|/path]`,
  nl: `Je bent Pascal's AI-adviseur bij NeXify AI. Dagtarief: €449 netto. Wees vriendelijk, kort (2-3 zinnen). Bied knoppen: [BTN:Label|/pad]`,
};

export async function POST(request: Request) {
  try {
    const { message, language } = await request.json();
    const lang = (language === "en" || language === "nl") ? language : "de";

    if (!message?.trim()) {
      return Response.json({
        reply: lang === "en" ? "What can I help you with?" : lang === "nl" ? "Wat kan ik voor u doen?" : "Was kann ich für Sie tun?",
        buttons: [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf vereinbaren", href: "/rueckruf" }, { label: lang === "en" ? "View Services" : lang === "nl" ? "Diensten bekijken" : "Leistungen ansehen", href: "/leistungen" }],
      });
    }

    // API-Key vorhanden? Sonst Fallback
    if (!AI_KEY) {
      return Response.json({
        reply: lang === "en" ? "One moment — our live advisor is being activated." : lang === "nl" ? "Een moment — onze live adviseur wordt geactiveerd." : "Einen Moment — unser Live-Berater wird aktiviert. Sie können uns direkt erreichen:",
        buttons: [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf vereinbaren", href: "/rueckruf" }, { label: lang === "en" ? "Contact" : lang === "nl" ? "Contact" : "Kontakt", href: "/kontakt" }],
      });
    }

    const prompt = PROMPTS[lang] || PROMPTS.de;

    const res = await fetch(`${AI_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${AI_KEY}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("9Router error:", res.status, errText.slice(0, 200));
      return Response.json({
        reply: lang === "en" ? "I'll connect you directly with Pascal." : lang === "nl" ? "Ik verbind u direct met Pascal." : "Ich verbinde Sie direkt mit Pascal. Alternativ:",
        buttons: [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf buchen", href: "/rueckruf" }, { label: lang === "en" ? "Send Message" : lang === "nl" ? "Stuur bericht" : "Nachricht senden", href: "/kontakt" }],
      });
    }

    const data = await res.json();
    const rawReply = data?.choices?.[0]?.message?.content?.trim();

    if (!rawReply) {
      return Response.json({ reply: lang === "en" ? "Let me connect you with Pascal for a personal consultation." : lang === "nl" ? "Laat me u doorverbinden met Pascal voor persoonlijk advies." : "Lassen Sie mich Sie direkt mit Pascal verbinden für eine persönliche Beratung.", buttons: [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf vereinbaren", href: "/rueckruf" }] });
    }

    // Buttons parsen
    const btnRegex = /\[BTN:([^\]|]+)\|([^\]]+)\]/g;
    const buttons: { label: string; href: string }[] = [];
    let match;
    while ((match = btnRegex.exec(rawReply)) !== null) {
      buttons.push({ label: match[1].trim(), href: match[2].trim() });
    }
    const cleanReply = rawReply.replace(btnRegex, "").trim().replace(/\n{3,}/g, "\n\n");

    return Response.json({
      reply: cleanReply || rawReply,
      buttons: buttons.length > 0 ? buttons : [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf vereinbaren", href: "/rueckruf" }, { label: lang === "en" ? "View Services" : lang === "nl" ? "Diensten bekijken" : "Leistungen ansehen", href: "/leistungen" }],
    });
  } catch (err) {
    console.error("Chat error:", err);
    return Response.json({ reply: "Entschuldigung — ein technischer Fehler. Bitte versuchen Sie es gleich noch einmal.", buttons: [{ label: "Rückruf buchen", href: "/rueckruf" }] });
  }
}
