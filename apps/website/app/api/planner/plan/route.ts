import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, description, features } = body;

    const projectTypes: Record<string, { days: number; label: string }> = {
      "landingpage": { days: 1, label: "Landingpage" },
      "website": { days: 2.5, label: "Unternehmenswebsite" },
      "shop": { days: 7, label: "Onlineshop" },
      "enterprise": { days: 12, label: "Enterprise-Commerce" },
      "web-app": { days: 7, label: "Web-App" },
      "mobile-app": { days: 7, label: "Mobile App" },
      "automation": { days: 1, label: "Automatisierung" },
      "ai-agent": { days: 3, label: "AI-Agenten" },
    };

    const project = projectTypes[type] || { days: 5, label: "Individuelles Projekt" };
    const dayRate = 999;
    const priceMin = project.days * dayRate;
    const priceMax = Math.ceil(project.days * 1.3) * dayRate;

    const plan = {
      type: project.label,
      days: project.days,
      priceRange: `${priceMin.toLocaleString("de-DE")} – ${priceMax.toLocaleString("de-DE")} €`,
      dayRate,
      description: description || "",
      features: features || [],
      modules: [
        "Konzept & Architektur",
        "Design & Prototyping",
        "Entwicklung & Implementierung",
        "Testing & Qualitätssicherung",
        "Deployment & Übergabe",
      ],
      nextSteps: "Ihr Projektplan wird innerhalb eines Arbeitstages persönlich geprüft und als verbindliches Angebot per E-Mail zugestellt.",
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(plan);
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
}
