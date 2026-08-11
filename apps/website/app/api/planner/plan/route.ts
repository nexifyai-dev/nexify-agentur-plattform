import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";

export const dynamic = "force-dynamic";
// LLM-Calls (DeepSeek Think-Max via 9Router) brauchen 8–22s; daher maxDuration=60.
export const maxDuration = 60;

type Module = { name: string; description: string; days_min: number; days_max: number };
type Plan = {
  title: string;
  summary: string;
  modules: Module[];
  structure: string[];
  phases: { name: string; text: string }[];
  recommendation: string;
};
type PlanResult = { session_id: string; plan: Plan; days_min: number; days_max: number; price_min: number; price_max: number };

const DAY_RATE = 449;

// Deterministic local fallback in EXACTLY the component contract (PlanResult).
// Never change this shape — apps/website/components/project-planner.tsx renders it.
function localPlan(body: PlannerBody, sessionId: string): PlanResult {
  const typeLabel = body.project_type || "Individuelles Projekt";
  const industry = body.industry || "Ihre Branche";
  const goal = body.goal || "mehr Anfragen";
  const feat = body.features?.length ? body.features.join(", ") : "keine zusätzlichen Funktionen";
  const modules: Module[] = [
    { name: "Konzept & Inhaltsstruktur", description: `Zielgruppengerechte Struktur und Inhalte für ${industry}, ausgerichtet auf: ${goal}.`, days_min: 1, days_max: 1 },
    { name: "Design & Prototyping", description: "Modernes, responsives Design passend zur Marke und Branche.", days_min: 1, days_max: 2 },
    { name: "Entwicklung & Implementierung", description: `Umsetzung von ${typeLabel} inkl. ${feat}.`, days_min: 2, days_max: 4 },
    { name: "Testing & Qualitätssicherung", description: "Funktions-, Responsive- und Ladezeit-Tests auf allen Geräten.", days_min: 1, days_max: 1 },
    { name: "Deployment & Übergabe", description: "Livegang, Einweisung und Dokumentation – persönlich von Pascal Courbois.", days_min: 1, days_max: 1 },
  ];
  const days_min = modules.reduce((s, m) => s + m.days_min, 0);
  const days_max = modules.reduce((s, m) => s + m.days_max, 0);
  return {
    session_id: sessionId,
    plan: {
      title: `${industry}-Projekt: ${goal}`,
      summary: `Gebaut wird ein individuelles Projekt (${typeLabel}) für ${industry}, das gezielt auf Ihr Ziel ausgerichtet ist: ${goal}. Die Umsetzung erfolgt in klar definierten Modulen mit transparenter Preisspanne – inklusive persönlicher Betreuung durch Pascal Courbois.`,
      modules,
      structure: [
        "Startseite mit klarem Nutzenversprechen",
        "Leistungen & Referenzen",
        "Kontakt- & Lead-Formulare",
        "Individuelle Landingpages für Kampagnen",
        "Blog / Wissensbereich für SEO",
        "Datenschutz, Impressum & Rechtliches",
      ],
      phases: [
        { name: "Zielklärung", text: "Gemeinsame Definition von Zielen, Zielgruppe und Erfolgskennzahlen." },
        { name: "Konzept", text: "Struktur, Inhalte und Design-Entwurf werden konkret ausgearbeitet." },
        { name: "Umsetzung", text: "Entwicklung der Module in kurzen, prüfbaren Iterationen." },
        { name: "Tests & Abnahme", text: "Qualitätssicherung und Freigabe durch Sie." },
        { name: "Übergabe", text: "Livegang, Einweisung und Übergabe der Zugänge." },
      ],
      recommendation:
        "Empfehlung: Starten Sie mit der Kernversion (Konzept + Design + Entwicklung) und erweitern Sie später um SEO, KI-Funktionen oder Automatisierung. So investieren Sie fokussiert und sehen schnell erste Ergebnisse.",
    },
    days_min,
    days_max,
    price_min: days_min * DAY_RATE,
    price_max: days_max * DAY_RATE,
  };
}

// Matches what apps/website/components/project-planner.tsx sends.
type PlannerBody = {
  project_type?: string;
  industry?: string;
  goal?: string;
  features?: string[];
  details?: string | null;
  language?: string;
};

export async function POST(request: Request) {
  let body: PlannerBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const sessionId = crypto.randomUUID();

  // Canonical path: FastAPI backend (ai-plan generation). The backend expects
  // exactly this body shape (PlannerIn) and returns the PlanResult contract.
  try {
    const upstream = await proxyPost("/api/planner/plan", body);
    if (upstream && upstream.ok) {
      const text = await upstream.text();
      try {
        const parsed = JSON.parse(text) as PlanResult;
        // Validate the contract so a wrong-shape backend response can never
        // crash the component again.
        if (parsed && parsed.plan && Array.isArray(parsed.plan.modules) && typeof parsed.plan.title === "string") {
          return new Response(text, {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
          });
        }
      } catch {
        // malformed JSON → fall through to local plan
      }
    }
  } catch {
    // backend unreachable/timeout → local plan (never 500)
  }

  return NextResponse.json(localPlan(body, sessionId));
}
