"use client";

import { useState } from "react";
import Link from "next/link";
import { DelightSuccess } from "@/components/delight-success";
import { InboundSpeedPromise } from "@/components/inbound-speed-promise";
import { API_BASE, company } from "@/lib/company";
import { useLang } from "@/lib/lang-context";
import { useContent } from "@/lib/content";

/** Minimal SVG icons — kein lucide-react */
const ArrowRight = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const MailIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const TimerIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PhoneCallIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

export function ContactForm() {
  const { lang } = useLang();
  const t = useContent();
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [privacy, setPrivacy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch(`/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: form.company || null, phone: form.phone || null, language: lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "failed");
      setState("success");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return <DelightSuccess lang={lang} variant="contact" compact testId="contact-success" />;
  }

  return (
    <form onSubmit={submit} className="glass space-y-4 p-5 sm:p-8 md:p-10" data-testid="contact-form">
      <InboundSpeedPromise lang={lang} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" required placeholder={t.contact.name} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="contact-name-input" />
        <input className="field" required type="email" placeholder={t.contact.email} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="contact-email-input" />
        <input className="field" placeholder={t.contact.companyField} value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} data-testid="contact-company-input" />
        <input className="field" placeholder={t.contact.phone} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} data-testid="contact-phone-input" />
      </div>
      <textarea className="field min-h-36" required placeholder={t.contact.messagePlaceholder} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} data-testid="contact-message-input" />
      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-500">
        <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-white" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} data-testid="contact-privacy-checkbox" />
        <span>{lang === "nl" ? "Ik heb de privacyverklaring gelezen. *" : "Ich habe die Datenschutzerklärung zur Kenntnis genommen. *"} <Link href="/datenschutz" className="underline hover:text-white">{lang === "nl" ? "Privacyverklaring" : "Datenschutz"}</Link></span>
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-600">{t.contact.b2bNote}</p>
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={state === "sending" || !privacy} data-testid="contact-submit-btn">
          {state === "sending" ? t.contact.sending : t.contact.submit} <ArrowRight />
        </button>
      </div>
      {state === "error" && <p className="text-sm text-red-400" data-testid="contact-error">{t.contact.error} {company.email}</p>}
    </form>
  );
}

export function ContactSidebar() {
  const t = useContent();
  return (
    <div className="space-y-5">
      <div className="glass overflow-hidden">
        <div className="flex items-end gap-4 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(255,255,255,0.07),transparent)] px-6 pt-5">
          <img src="/pascal.png" alt="Pascal Courbois" className="w-24 drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]" data-testid="contact-portrait" />
          <div className="pb-4"><div className="text-sm font-semibold text-white">Pascal Courbois</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">NeXify AI by NeXify</div></div>
        </div>
      </div>
      <div className="glass p-7">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.contact.directTitle}</h2>
        <div className="mt-4 space-y-3">
          <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white" data-testid="contact-email-link"><MailIcon /> {company.email}</a>
          <a href={`tel:${company.phoneHref}`} className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white" data-testid="contact-phone-link"><PhoneIcon /> {company.phone}</a>
        </div>
      </div>
      <div className="glass p-7">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500"><TimerIcon /> {t.contact.responseTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.contact.responseText}</p>
      </div>
      <div className="glass p-7">
        <p className="text-sm leading-relaxed text-zinc-500">{company.legalName}<br />{company.owner}<br />{company.address}<br />{company.postalCity}</p>
      </div>
    </div>
  );
}
