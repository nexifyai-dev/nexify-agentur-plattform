// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/chat/route.ts
// NIR: 02.08.2026 06:45
// UPDATED: 02.08.2026 06:45
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Chat SSE endpoint — proxy backend or local advisory stream fallback
// WHY: Live site returned DNS_HOSTNAME_EMPTY 502; widget showed „Verbindung unterbrochen“
// BEST-PRACTICE: Same SSE contract as backend (delta / offer_ready / done)
// PITFALL: V-XX: empty content makes chat-widget throw; always emit at least one delta
// DEPENDS: lib/backend.ts proxyRequest
// DOCS-REF: backend/server.py chat StreamingResponse
// SESSION: website-nav-chat-login-fix

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatBody = { session_id?: string; message?: string; language?: string };

function localAdvice(message: string, language: string): string {
  const msg = (message || "").trim();
  const lower = msg.toLowerCase();
  const nl = language === "nl";
  const en = language === "en";

  const dayRate = "449 €";
  const contact = "/kontakt";
  const callback = "/rueckruf";

  if (/preis|kosten|budget|price|cost|prijs|tarief|tagessatz|rate/.test(lower)) {
    if (nl) {
      return `Ons dagtarief is ${dayRate} netto per werkdag (tot acht planbare uren). Een landingpage is typisch 1 dag, een bedrijfswebsite 2–3 dagen, shops/apps 6–8 dagen. Voor een gerichte inschatting: beschrijf kort uw doel of boek een terugbelafspraak via ${callback}.`;
    }
    if (en) {
      return `Our day rate is ${dayRate} net per working day (up to eight billable hours). A landing page is typically 1 day, a company website 2–3 days, shops/apps 6–8 days. For a scoped estimate, briefly describe your goal or book a call at ${callback}.`;
    }
    return `Unser Tagessatz beträgt ${dayRate} netto pro Arbeitstag (bis zu acht planbare Fachstunden). Eine Landingpage ist typischerweise 1 Tag, eine Unternehmenswebsite 2–3 Tage, Shops/Apps 6–8 Tage. Für eine belastbare Spanne: beschreiben Sie kurz Ihr Ziel – oder buchen Sie einen Rückruf unter ${callback}.`;
  }

  if (/website|webseite|shop|app|automat|agent|landing/.test(lower)) {
    if (nl) {
      return `Dank u. NeXify AI levert websites, shops, web-/mobile-apps en AI-automatisering persoonlijk tegen vast dagtarief. Op basis van „${msg.slice(0, 120)}“ raad ik een kort scope-gesprek aan. Stuur via ${contact} uw bedrijf, doel en deadline – u krijgt doorgaans binnen één werkdag een eerlijke inschatting.`;
    }
    if (en) {
      return `Thanks. NeXify AI delivers websites, shops, web/mobile apps and AI automation personally at a fixed day rate. Based on “${msg.slice(0, 120)}” I recommend a short scope call. Send company, goal and deadline via ${contact} — you usually get an honest estimate within one business day.`;
    }
    return `Danke. NeXify AI liefert Websites, Shops, Web-/Mobile-Apps und AI-Automatisierung persönlich zum festen Tagessatz. Zu „${msg.slice(0, 120)}“ empfehle ich ein kurzes Scope-Gespräch. Schreiben Sie über ${contact} Firma, Ziel und Termin – in der Regel erhalten Sie innerhalb eines Werktags eine ehrliche Aufwandsspanne.`;
  }

  if (nl) {
    return `Ik ben NeXify AI, uw AI-adviseur. Vertel kort wat uw bedrijf doet en of u denkt aan website, shop, app of automatisering – dan geef ik een eerste richting (omvang, dagen, volgende stap). Liever direct spreken? ${callback}. Of stuur een bericht via ${contact}.`;
  }
  if (en) {
    return `I am NeXify AI, your AI advisor. Briefly tell me what your company does and whether you are thinking about a website, shop, app or automation — I will outline scope, days and next steps. Prefer a call? ${callback}. Or write via ${contact}.`;
  }
  return `Ich bin NeXify AI, Ihr AI-Berater. Erzählen Sie kurz, was Ihr Unternehmen macht und ob Sie an Website, Shop, App oder Automatisierung denken – dann skizziere ich Umfang, Arbeitstage und den nächsten Schritt. Lieber telefonieren? ${callback}. Oder schreiben Sie über ${contact}.`;
}

function sseStream(text: string, offerReady: boolean): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  // Chunk into small deltas so the UI typing effect still works
  const chunkSize = 24;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  if (chunks.length === 0) chunks.push("…");

  return new ReadableStream({
    start(controller) {
      for (const content of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", content })}\n\n`));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "offer_ready", ready: offerReady })}\n\n`));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  let body: ChatBody = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.message?.trim()) {
    return NextResponse.json({ error: "Nachricht fehlt." }, { status: 400 });
  }

  // Prefer FastAPI when BACKEND_ORIGIN is a usable URL
  try {
    const upstream = await proxyRequest("/api/chat", new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: request.headers.get("cookie") ?? "" },
      body: JSON.stringify(body),
    }));
    if (upstream && upstream.ok) return upstream;
  } catch {
    // local fallback
  }

  const language = body.language === "nl" || body.language === "en" ? body.language : "de";
  const text = localAdvice(body.message, language);
  const offerReady = /angebot|offerte|offer|preis|kosten|project|projekt/i.test(body.message);

  return new Response(sseStream(text, offerReady), {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
