// /api/chat — Live Chat via 9Router (DeepSeek-Reasoner)
// Gibt strukturierte Antworten mit Buttons zurück
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AI_ROUTER_URL = process.env.NINEROUTER_ENDPOINT || "https://ai-router.nexifyai.cloud/v1";
const AI_API_KEY = process.env.NINEROUTER_API_KEY || "";
const AI_MODEL = "deepseek/deepseek-reasoner";

const SYSTEM_PROMPT = `Du bist Pascal's KI-Berater bei NeXify AI — einer Premium-Agentur für Websites, Shops, Apps und KI-Automatisierung.

PERSÖNLICHKEIT:
- Freundlich, kompetent, auf den Punkt. Wie ein guter Berater im Erstgespräch.
- Sprich den Kunden mit "Sie" an. Kein Marketing-Sprech.
- Maximal 2-3 kurze Sätze. Dann eine konkrete Frage oder Angebot.

WICHTIGE INFOS:
- Tagessatz: 449 € netto / Arbeitstag
- Keine versteckten Kosten, keine Agentur-Aufschläge
- Pascal persönlich setzt um — kein anonymer Projektmanager
- Sitz in Venlo (NL), Kunden in DACH + NL
- Rückruf: https://www.nexifyai.cloud/rueckruf

ANTWORT-FORMAT:
Gib am Ende jeder Antwort eine von 4 Button-Optionen an. Format: [BTN:Label|/pfad]

Buttons die du verwenden kannst:
- [BTN:Leistungen ansehen|/leistungen]
- [BTN:Preise & Ablauf|/preise]
- [BTN:Rückruf vereinbaren|/rueckruf]
- [BTN:Projekt anfragen|/kontakt]
- [BTN:Referenzen zeigen|/referenzen]
- [BTN:FAQ lesen|/faq]

BEISPIEL:
"Gerne! Eine moderne Website mit 5-8 Seiten liegt typisch bei 5-10 Tagen, also ca. 2.245-4.490 € netto. Soll ich Ihnen die genauen Leistungen zeigen?
[BTN:Leistungen ansehen|/leistungen]
[BTN:Rückruf vereinbaren|/rueckruf]"

KEINE rohen URLs im Text nennen — dafür sind die Buttons da.`;

export async function POST(request: Request) {
  // Fallback mit Buttons wenn kein API-Key
  if (!AI_API_KEY) {
    return Response.json({
      reply: "Noch einen Moment — unser Live-KI-Berater wird gerade aktiviert. Pascal ist aber jetzt für Sie erreichbar:",
      buttons: [
        { label: "Rückruf vereinbaren", href: "/rueckruf" },
        { label: "Projekt anfragen", href: "/kontakt" },
      ],
    });
  }

  try {
    const { message } = await request.json();
    if (!message?.trim()) {
      return Response.json({
        reply: "Was kann ich für Sie tun? Hier ein paar Vorschläge:",
        buttons: [
          { label: "Leistungen ansehen", href: "/leistungen" },
          { label: "Preise & Ablauf", href: "/preise" },
          { label: "Rückruf vereinbaren", href: "/rueckruf" },
        ],
      });
    }

    const res = await fetch(`${AI_ROUTER_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${AI_API_KEY}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 350,
        temperature: 0.7,
        thinking: { type: "enabled", budget_tokens: 16000 },
      }),
    });

    if (!res.ok) {
      return Response.json({
        reply: "Ich bin gerade kurz in einer Besprechung. Pascal meldet sich aber direkt bei Ihnen — oder buchen Sie einfach selbst einen Termin:",
        buttons: [
          { label: "Rückruf buchen", href: "/rueckruf" },
          { label: "Projekt anfragen", href: "/kontakt" },
        ],
      });
    }

    const data = await res.json();
    const rawReply = data?.choices?.[0]?.message?.content?.trim();

    if (!rawReply) {
      return Response.json({
        reply: "Gute Frage! Am besten besprechen wir das direkt — Pascal kann Ihnen eine realistische Einschätzung für Ihr Projekt geben.",
        buttons: [
          { label: "Rückruf vereinbaren", href: "/rueckruf" },
          { label: "Projekt anfragen", href: "/kontakt" },
        ],
      });
    }

    // Buttons aus [BTN:Label|/pfad] parsen
    const btnRegex = /\[BTN:([^\]|]+)\|([^\]]+)\]/g;
    const buttons: { label: string; href: string }[] = [];
    let match;
    while ((match = btnRegex.exec(rawReply)) !== null) {
      buttons.push({ label: match[1].trim(), href: match[2].trim() });
    }

    // Text ohne Button-Markup
    const cleanReply = rawReply.replace(btnRegex, '').trim().replace(/\n{3,}/g, '\n\n');

    return Response.json({
      reply: cleanReply || rawReply,
      buttons: buttons.length > 0 ? buttons : [
        { label: "Rückruf vereinbaren", href: "/rueckruf" },
        { label: "Leistungen ansehen", href: "/leistungen" },
      ],
    });
  } catch {
    return Response.json({
      reply: "Entschuldigung, ich hatte gerade einen kurzen Aussetzer. Pascal ist aber für Sie da — hier die schnellsten Wege:",
      buttons: [
        { label: "Rückruf buchen", href: "/rueckruf" },
        { label: "Projekt anfragen", href: "/kontakt" },
      ],
    });
  }
}
