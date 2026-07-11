"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, Phone, Timer } from "lucide-react";
import { API_BASE, company } from "@/lib/company";
import { useLang } from "@/lib/lang-context";
import { useContent } from "@/lib/content";

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
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: form.company || null, phone: form.phone || null, language: lang }),
      });
      if (!res.ok) throw new Error("failed");
      setState("success");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="glass flex h-full flex-col items-center justify-center gap-4 p-10 text-center" data-testid="contact-success">
        <CheckCircle2 size={44} className="text-emerald-400" />
        <p className="max-w-md leading-relaxed text-zinc-300">{t.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass space-y-4 p-8 md:p-10" data-testid="contact-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" required placeholder={t.contact.name} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="contact-name-input" />
        <input className="field" required type="email" placeholder={t.contact.email} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="contact-email-input" />
        <input className="field" placeholder={t.contact.companyField} value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} data-testid="contact-company-input" />
        <input className="field" placeholder={t.contact.phone} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} data-testid="contact-phone-input" />
      </div>
      <textarea className="field min-h-36" required placeholder={t.contact.messagePlaceholder} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} data-testid="contact-message-input" />
      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-500">
        <input type="checkbox" required className="mt-0.5 accent-white" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} data-testid="contact-privacy-checkbox" />
        <span>
          {lang === "nl" ? "Ik heb de privacyverklaring gelezen. *" : "Ich habe die Datenschutzerklärung zur Kenntnis genommen. *"}{" "}
          <Link href="/datenschutz" className="underline hover:text-white">{lang === "nl" ? "Privacyverklaring" : "Datenschutz"}</Link>
        </span>
      </label>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-zinc-600">{t.contact.b2bNote}</p>
        <button type="submit" className="btn-primary" disabled={state === "sending" || !privacy} data-testid="contact-submit-btn">
          {state === "sending" ? t.contact.sending : t.contact.submit} <ArrowRight size={15} />
        </button>
      </div>
      {state === "error" && (
        <p className="text-sm text-red-400" data-testid="contact-error">
          {t.contact.error} {company.email}
        </p>
      )}
    </form>
  );
}

export function ContactSidebar() {
  const t = useContent();
  return (
    <div className="space-y-5">
      <div className="glass overflow-hidden">
        <div className="flex items-end gap-4 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(255,255,255,0.07),transparent)] px-6 pt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pascal.png" alt="Pascal Courbois" className="w-24 drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]" data-testid="contact-portrait" />
          <div className="pb-4">
            <div className="text-sm font-semibold text-white">Pascal Courbois</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">NeXify AI by NeXify</div>
          </div>
        </div>
      </div>
      <div className="glass p-7">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.contact.directTitle}</h2>
        <div className="mt-4 space-y-3">
          <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white" data-testid="contact-email-link">
            <Mail size={16} className="text-zinc-500" /> {company.email}
          </a>
          <a href={`tel:${company.phoneHref}`} className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white" data-testid="contact-phone-link">
            <Phone size={16} className="text-zinc-500" /> {company.phone}
          </a>
        </div>
      </div>
      <div className="glass p-7">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          <Timer size={13} /> {t.contact.responseTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.contact.responseText}</p>
      </div>
      <div className="glass p-7">
        <p className="text-sm leading-relaxed text-zinc-500">
          {company.legalName}
          <br />
          {company.owner}
          <br />
          {company.address}
          <br />
          {company.postalCity}
        </p>
      </div>
    </div>
  );
}
