// FILE: apps/website/lib/mail.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 11:20
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Optional Resend HTTP fallback + delight customer confirmations
// WHY: Live /api/contact and /api/offers/request returned 502 with broken backend proxy
// BEST-PRACTICE: Prefer FastAPI; Resend only if RESEND_API_KEY is set — never fake success
// PITFALL: V-XX: never log message bodies or API keys
// DEPENDS: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
// DOCS-REF: docs/gtm/ONBOARDING-EMAIL-TEMPLATES.md
// SESSION: neukunden-begeisterung-7dd5

const TO = () => process.env.CONTACT_TO_EMAIL || "mail@nexifyai.cloud";
const FROM = () => process.env.CONTACT_FROM_EMAIL || "NeXify AI Website <website@nexifyai.cloud>";
const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || "https://www.nexifyai.cloud";

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

async function resendSend(payload: {
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM(),
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      ...(payload.reply_to ? { reply_to: payload.reply_to } : {}),
    }),
  });
  return res.ok;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function customerDelightHtml(name: string, kind: "contact" | "offer" | "lead_magnet"): string {
  const site = SITE();
  const n = esc(name);
  const intro =
    kind === "lead_magnet"
      ? "vielen Dank für Ihr Interesse an der Website-/KI-Checkliste. Wir senden die Liste zu (PDF wird ergänzt) und melden uns bei Fragen persönlich."
      : kind === "offer"
        ? "vielen Dank für Ihre Angebotsanfrage. Wir bereiten eine transparente Aufwandsspanne vor."
        : "vielen Dank für Ihre Anfrage. Wir prüfen Ihr Vorhaben persönlich — ehrlich, ohne Umsatzdruck.";
  return `
    <div style="font-family:Manrope,Arial,sans-serif;background:#0A0A0A;color:#E0E0E0;padding:32px">
      <p style="font-family:Outfit,Arial,sans-serif;font-size:22px;font-weight:300;color:#fff">Danke, ${n}.</p>
      <p>${intro}</p>
      <p><strong>Rückmeldung · Ziel:</strong> persönliche Antwort in der Regel innerhalb eines Werktags — oft schneller. Kein Fake-SLA.</p>
      <p>Nächste Schritte:</p>
      <ul>
        <li>Rückruf buchen: <a href="${site}/rueckruf" style="color:#fff">${site}/rueckruf</a></li>
        <li>Übersicht: <a href="${site}/danke?variant=${kind === "lead_magnet" ? "lead_magnet" : kind}" style="color:#fff">${site}/danke</a></li>
        <li>WhatsApp: <a href="https://wa.me/31613318856" style="color:#fff">wa.me/31613318856</a></li>
      </ul>
      <p style="color:#A1A1AA;font-size:13px">Pascal Courbois · NeXify AI · mail@nexifyai.cloud</p>
    </div>
  `;
}

export async function sendContactNotification(input: {
  name?: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  message: string;
  language?: string;
  type?: string;
}): Promise<boolean> {
  const name = input.name?.trim() || "Ohne Name";
  const html = `
    <h2>Neue Kontaktanfrage (Website)</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>E-Mail:</strong> ${esc(input.email)}</p>
    <p><strong>Firma:</strong> ${esc(input.company || "—")}</p>
    <p><strong>Telefon:</strong> ${esc(input.phone || "—")}</p>
    <p><strong>Typ:</strong> ${esc(input.type || "contact")}</p>
    <p><strong>Sprache:</strong> ${esc(input.language || "de")}</p>
    <hr/>
    <pre style="white-space:pre-wrap;font-family:sans-serif">${esc(input.message)}</pre>
  `;
  const adminOk = await resendSend({
    to: TO(),
    subject: `Kontakt: ${name}`,
    html,
    reply_to: input.email,
  });
  if (!adminOk) return false;

  const kind = input.type === "lead_magnet" ? "lead_magnet" : "contact";
  await resendSend({
    to: input.email,
    subject:
      kind === "lead_magnet"
        ? "Ihre Checkliste folgt – NeXify AI"
        : "Wir haben Ihre Anfrage erhalten – NeXify AI",
    html: customerDelightHtml(name, kind),
  }).catch(() => false);

  return true;
}

export async function sendOfferRequestNotification(input: {
  name?: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  language?: string;
  session_id?: string;
  /** @deprecated not in backend OfferRequestIn — ignored if present */
  type?: string;
  description?: string;
  features?: string[];
}): Promise<boolean> {
  const name = input.name?.trim() || "Ohne Name";
  const features = (input.features || []).map(esc).join(", ") || "—";
  const html = `
    <h2>Neue Angebotsanfrage (Website)</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>E-Mail:</strong> ${esc(input.email)}</p>
    <p><strong>Firma:</strong> ${esc(input.company || "—")}</p>
    <p><strong>Telefon:</strong> ${esc(input.phone || "—")}</p>
    <p><strong>Session:</strong> ${esc(input.session_id || "—")}</p>
    <p><strong>Typ (legacy):</strong> ${esc(input.type || "—")}</p>
    <p><strong>Features (legacy):</strong> ${features}</p>
    <p><strong>Sprache:</strong> ${esc(input.language || "de")}</p>
    <hr/>
    <pre style="white-space:pre-wrap;font-family:sans-serif">${esc(input.description || "")}</pre>
  `;
  const adminOk = await resendSend({
    to: TO(),
    subject: `Angebot: ${name}`,
    html,
    reply_to: input.email,
  });
  if (!adminOk) return false;

  await resendSend({
    to: input.email,
    subject: "Ihre Angebotsanfrage ist eingegangen – NeXify AI",
    html: customerDelightHtml(name, "offer"),
  }).catch(() => false);

  return true;
}
