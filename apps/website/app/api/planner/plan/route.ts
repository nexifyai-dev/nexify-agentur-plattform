import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";

export const dynamic = "force-dynamic";

const PROJECT_TYPES: Record<string, { days: number; label: string }> = {
  landingpage: { days: 1, label: "Landingpage" },
  website: { days: 2.5, label: "Unternehmenswebsite" },
  shop: { days: 7, label: "Onlineshop" },
  enterprise: { days: 12, label: "Enterprise-Commerce" },
  "web-app": { days: 7, label: "Web-App" },
  "mobile-app": { days: 7, label: "Mobile App" },
  automation: { days: 1, label: "Automatisierung" },
  "ai-agent": { days: 3, label: "AI-Agenten" },
};

function localEstimate(type: string, description: string, features: string[]) {
  const project = PROJECT_TYPES[type] || { days: 5, label: "Individuelles Projekt" };
  const dayRate = 999;
  const priceMin = project.days * dayRate;
  const priceMax = Math.ceil(project.days * 1.3) * dayRate;
  return {
    type: project.label,
    days: project.days,
    priceRange: `${priceMin.toLocaleString("de-DE")} – ${priceMax.toLocaleString("de-DE")} €`,
    dayRate,
    description,
    features,
    modules: [
      "Konzept & Architektur",
      "Design & Prototyping",
      "Entwicklung & Implementierung",
      "Testing & Qualitätssicherung",
      "Deployment & Übergabe",
    ],
    nextSteps:
      "Ihr Projektplan wird innerhalb eines Arbeitstages persönlich geprüft und als verbindliches Angebot per E-Mail zugestellt.",
    generatedAt: new Date().toISOString(),
    estimate: "local" as const,
  };
}

export async function POST(request: Request) {
  let body: { type?: string; description?: string; features?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  // Prefer the canonical backend planner when configured; the planner is a
  // non-lead calculator, so fall back to a deterministic local estimate rather
  // than failing if the backend is unset or unreachable.
  try {
    const upstream = await proxyPost("/api/planner/plan", body);
    if (upstream && upstream.ok) return upstream;
  } catch {
    // fall through to local estimate
  }

  return NextResponse.json(localEstimate(body.type ?? "", body.description ?? "", body.features ?? []));
}
