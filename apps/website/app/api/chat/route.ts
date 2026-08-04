// /api/chat — Live Chat via 9Router (DeepSeek-Reasoner + Think-Max)
// i18n: language-Parameter steuert System-Prompt + Antwort-Sprache
// Env: NINEROUTER_ENDPOINT, NINEROUTER_API_KEY
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AI_ROUTER_URL = process.env.NINEROUTER_ENDPOINT || "https://ai-router.nexifyai.cloud/v1";
const AI_API_KEY = process.env.NINEROUTER_API_KEY || "";
const AI_MODEL = "deepseek/deepseek-reasoner";

const PROMPTS: Record<string, string> = {
  de: `Du bist Pascal's KI-Berater bei NeXify AI — Premium-Agentur für Websites, Shops, Apps und KI-Automatisierung. Tagessatz: 449 € netto/Tag. Sitz in Venlo (NL). Sprich den Kunden mit "Sie" an. Freundlich, kompetent, kurz (2-3 Sätze). Biete Buttons an: [BTN:Label|/pfad]. Keine URLs im Text.`,
  en: `You are Pascal's AI advisor at NeXify AI — a premium agency for websites, shops, apps and AI automation. Day rate: €449 net. Based in Venlo (NL). Be friendly, competent, concise (2-3 sentences). Offer buttons: [BTN:Label|/path]. No URLs in text.`,
  nl: `Je bent Pascal's AI-adviseur bij NeXify AI — een premium bureau voor websites, shops, apps en AI-automatisering. Dagtarief: €449 netto. Gevestigd in Venlo (NL). Wees vriendelijk, competent, kort (2-3 zinnen). Bied knoppen aan: [BTN:Label|/pad]. Geen URLs in tekst.`,
};

export async function POST(request: Request) {
  if (!AI_API_KEY) {
    return Response.json({
      reply: "Noch einen Moment — unser Live-KI-Berater wird gerade aktiviert. Pascal ist jetzt für Sie erreichbar:",
      buttons: [{ label: "Rückruf vereinbaren", href: "/rueckruf" }, { label: "Projekt anfragen", href: "/kontakt" }],
    });
  }

  try {
    const { message, language } = await request.json();
    const lang = (language === "en" || language === "nl") ? language : "de";
    const prompt = PROMPTS[lang] || PROMPTS.de;

    if (!message?.trim()) {
      const emptyReplies: Record<string, { reply: string; buttons: { label: string; href: string }[] }> = {
        de: { reply: "Was kann ich für Sie tun?", buttons: [{label:"Leistungen ansehen",href:"/leistungen"},{label:"Preise & Ablauf",href:"/preise"},{label:"Rückruf vereinbaren",href:"/rueckruf"}] },
        en: { reply: "How can I help you?", buttons: [{label:"View Services",href:"/leistungen"},{label:"Pricing",href:"/preise"},{label:"Book a Call",href:"/rueckruf"}] },
        nl: { reply: "Wat kan ik voor u doen?", buttons: [{label:"Diensten bekijken",href:"/leistungen"},{label:"Prijzen",href:"/preise"},{label:"Afspraak maken",href:"/rueckruf"}] },
      };
      return Response.json(emptyReplies[lang] || emptyReplies.de);
    }

    const res = await fetch(`${AI_ROUTER_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${AI_API_KEY}` },
      body: JSON.stringify({ model: AI_MODEL, messages: [{ role: "system", content: prompt }, { role: "user", content: message }], max_tokens: 350, temperature: 0.7, thinking: { type: "enabled", budget_tokens: 16000 } }),
    });

    if (!res.ok) {
      return Response.json({
        reply: lang === "en" ? "I'm briefly unavailable. Pascal will get back to you — or book a call:" : lang === "nl" ? "Ik ben even niet beschikbaar. Pascal neemt contact met u op — of boek een afspraak:" : "Ich bin gerade kurz in einer Besprechung. Pascal meldet sich direkt bei Ihnen — oder buchen Sie einen Termin:",
        buttons: [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf buchen", href: "/rueckruf" }],
      });
    }

    const data = await res.json();
    const rawReply = data?.choices?.[0]?.message?.content?.trim();
    if (!rawReply) {
      return Response.json({ reply: lang === "en" ? "Good question! Let's discuss this directly — Pascal can give you a realistic estimate." : lang === "nl" ? "Goede vraag! Laten we dit direct bespreken." : "Gute Frage! Am besten besprechen wir das direkt.", buttons: [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf vereinbaren", href: "/rueckruf" }] });
    }

    const btnRegex = /\[BTN:([^\]|]+)\|([^\]]+)\]/g;
    const buttons: { label: string; href: string }[] = [];
    let match;
    while ((match = btnRegex.exec(rawReply)) !== null) {
      buttons.push({ label: match[1].trim(), href: match[2].trim() });
    }
    const cleanReply = rawReply.replace(btnRegex, "").trim().replace(/\n{3,}/g, "\n\n");

    return Response.json({ reply: cleanReply || rawReply, buttons: buttons.length > 0 ? buttons : [{ label: lang === "en" ? "Book a Call" : lang === "nl" ? "Afspraak maken" : "Rückruf vereinbaren", href: "/rueckruf" }] });
  } catch {
    return Response.json({ reply: "Entschuldigung, ich hatte gerade einen kurzen Aussetzer.", buttons: [{ label: "Rückruf buchen", href: "/rueckruf" }] });
  }
}
