import { NextRequest, NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ message: "Ungültige Anfrage." }, { status: 400 }); }

  if (clean(body.website, 200)) return NextResponse.json({ message: "Anfrage entgegengenommen." });

  const name = clean(body.name, 120);
  const business = clean(body.company, 160);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 80);
  const projectType = clean(body.projectType, 120);
  const message = clean(body.message, 5000);
  const privacy = clean(body.privacy, 40);

  if (!name || !business || !EMAIL.test(email) || !message || privacy !== "accepted") {
    return NextResponse.json({ message: "Bitte füllen Sie alle Pflichtfelder korrekt aus." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "support@nexify-automate.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "NeXify AI Website <website@nexify-automate.com>";
  if (!apiKey) return NextResponse.json({ message: "Der Formularversand ist noch nicht konfiguriert. Bitte senden Sie Ihre Anfrage direkt an support@nexify-automate.com." }, { status: 503 });

  const safe = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] ?? char);
  const html = `<h1>Neue B2B-Projektanfrage</h1><p><strong>Name:</strong> ${safe(name)}</p><p><strong>Unternehmen:</strong> ${safe(business)}</p><p><strong>E-Mail:</strong> ${safe(email)}</p><p><strong>Telefon:</strong> ${safe(phone || "—")}</p><p><strong>Projektart:</strong> ${safe(projectType || "—")}</p><h2>Nachricht</h2><p>${safe(message).replace(/\n/g, "<br>")}</p>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Projektanfrage: ${projectType || "NeXify AI"} — ${business}`, html }),
  });

  if (!response.ok) return NextResponse.json({ message: "Der Versand ist aktuell nicht möglich. Bitte nutzen Sie support@nexify-automate.com." }, { status: 502 });
  return NextResponse.json({ message: "Vielen Dank. Ihre Anfrage wurde sicher übermittelt." });
}
