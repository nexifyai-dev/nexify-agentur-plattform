// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/lib/mail.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 10:40
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Optional Resend HTTP fallback when FastAPI BACKEND_ORIGIN is down
// WHY: Live /api/contact and /api/offers/request returned 502 with broken backend proxy
// BEST-PRACTICE: Prefer FastAPI; Resend only if RESEND_API_KEY is set — never fake success
// PITFALL: V-XX: never log message bodies or API keys
// DEPENDS: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, NEXT_PUBLIC_SITE_URL
// DOCS-REF: apps/website/.env.example
// SESSION: open-issues-16-close-7dd5

const TO = () => process.env.CONTACT_TO_EMAIL || "mail@nexifyai.cloud";
const FROM = () => process.env.CONTACT_FROM_EMAIL || "NeXify AI Website <website@nexifyai.cloud>";

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

function siteBase(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.nexifyai.cloud").trim();
  return raw.replace(/\/$/, "") || "https://www.nexifyai.cloud";
}

const LEAD_MAGNET_PDF_PATH = "/docs/nexify-website-ki-checkliste.pdf";

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
  const isLeadMagnet = (input.type || "").toLowerCase() === "lead_magnet";
  const pdfUrl = `${siteBase()}${LEAD_MAGNET_PDF_PATH}`;
  const html = `
    <h2>${isLeadMagnet ? "Lead-Magnet: Checkliste" : "Neue Kontaktanfrage (Website)"}</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>E-Mail:</strong> ${esc(input.email)}</p>
    <p><strong>Firma:</strong> ${esc(input.company || "—")}</p>
    <p><strong>Telefon:</strong> ${esc(input.phone || "—")}</p>
    <p><strong>Typ:</strong> ${esc(input.type || "contact")}</p>
    <p><strong>Sprache:</strong> ${esc(input.language || "de")}</p>
    ${isLeadMagnet ? `<p><strong>PDF:</strong> <a href="${esc(pdfUrl)}">${esc(pdfUrl)}</a></p>` : ""}
    <hr/>
    <pre style="white-space:pre-wrap;font-family:sans-serif">${esc(input.message)}</pre>
  `;
  const adminOk = await resendSend({
    to: TO(),
    subject: isLeadMagnet ? `Checkliste: ${name}` : `Kontakt: ${name}`,
    html,
    reply_to: input.email,
  });
  if (!adminOk) return false;

  if (isLeadMagnet) {
    await resendSend({
      to: input.email,
      subject: "Ihre Website- & KI-Checkliste – NeXify AI",
      html: `<p>Guten Tag ${esc(name)},</p>
<p>vielen Dank — hier ist Ihre kostenfreie Checkliste als PDF:</p>
<p><a href="${esc(pdfUrl)}">${esc(pdfUrl)}</a></p>
<p>HTML-Version: <a href="${esc(siteBase() + "/docs/nexify-website-ki-checkliste.html")}">${esc(siteBase() + "/docs/nexify-website-ki-checkliste.html")}</a></p>
<p>Nächster Schritt (optional): <a href="${esc(siteBase() + "/rueckruf")}">15-Minuten-Termin</a>.</p>
<p>Mit besten Grüßen<br/>Pascal Courbois · NeXify AI</p>`,
    }).catch(() => false);
  } else {
    await resendSend({
      to: input.email,
      subject: "Wir haben Ihre Anfrage erhalten – NeXify AI",
      html: `<p>Guten Tag ${esc(name)},</p><p>vielen Dank für Ihre Anfrage. Wir melden uns in der Regel innerhalb eines Werktags.</p><p>Mit besten Grüßen<br/>Pascal Courbois · NeXify AI</p>`,
    }).catch(() => false);
  }

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
  return resendSend({
    to: TO(),
    subject: `Angebot: ${name}`,
    html,
    reply_to: input.email,
  });
}
