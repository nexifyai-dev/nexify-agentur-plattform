"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/auth";
import { eur } from "@/components/admin/panels";

export function CreateOfferForm({ onDone }: { onDone: () => void }) {
  const [f, setF] = useState({ name: "", email: "", company: "", language: "de", title: "", intro: "" });
  const [items, setItems] = useState([{ name: "", description: "", days_min: 1, days_max: 1 }]);
  const [state, setState] = useState("");
  const total = items.reduce((s, i) => s + (Number(i.days_min) + Number(i.days_max)) / 2, 0) * 999;

  const submit = async () => {
    setState("sending");
    try {
      await api("/api/admin/offers/create", {
        method: "POST",
        body: JSON.stringify({ ...f, company: f.company || null, items: items.filter((i) => i.name.trim()).map((i) => ({ ...i, days_min: Number(i.days_min), days_max: Number(i.days_max) })) }),
      });
      setState("sent");
      setF({ name: "", email: "", company: "", language: "de", title: "", intro: "" });
      setItems([{ name: "", description: "", days_min: 1, days_max: 1 }]);
      onDone();
    } catch (e) {
      setState(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="glass max-w-3xl space-y-3 p-6" data-testid="admin-create-offer-form">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Kundenname *" value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} data-testid="co-name" />
        <input className="field" type="email" placeholder="Kunden-E-Mail *" value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} data-testid="co-email" />
        <input className="field" placeholder="Firma" value={f.company} onChange={(e) => setF((x) => ({ ...x, company: e.target.value }))} />
        <select className="field" value={f.language} onChange={(e) => setF((x) => ({ ...x, language: e.target.value }))}>
          <option value="de">Deutsch</option>
          <option value="nl">Nederlands</option>
        </select>
      </div>
      <input className="field" placeholder="Angebotstitel *" value={f.title} onChange={(e) => setF((x) => ({ ...x, title: e.target.value }))} data-testid="co-title" />
      <textarea className="field min-h-20" placeholder="Persönliche Einleitung" value={f.intro} onChange={(e) => setF((x) => ({ ...x, intro: e.target.value }))} />
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid gap-2 rounded-xl bg-white/[0.03] p-3 sm:grid-cols-[1.2fr_1.6fr_70px_70px]">
            <input className="field !py-2 !text-[13px]" placeholder="Position *" value={it.name} onChange={(e) => setItems((arr) => arr.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} data-testid={`co-item-name-${i}`} />
            <input className="field !py-2 !text-[13px]" placeholder="Beschreibung" value={it.description} onChange={(e) => setItems((arr) => arr.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
            <input className="field !py-2 !text-[13px]" type="number" min={0.5} step={0.5} value={it.days_min} onChange={(e) => setItems((arr) => arr.map((x, j) => (j === i ? { ...x, days_min: Number(e.target.value) } : x)))} title="Tage min" />
            <input className="field !py-2 !text-[13px]" type="number" min={0.5} step={0.5} value={it.days_max} onChange={(e) => setItems((arr) => arr.map((x, j) => (j === i ? { ...x, days_max: Number(e.target.value) } : x)))} title="Tage max" />
          </div>
        ))}
        <button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => setItems((arr) => [...arr, { name: "", description: "", days_min: 1, days_max: 1 }])}>
          <Plus size={13} /> Position hinzufügen
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-sm text-zinc-400">Richtpreis: <b className="text-white">{eur(Math.round(total))}</b> netto</span>
        <button className="btn-primary !py-2.5 !text-[13px]" onClick={submit} disabled={!f.name || !f.email || !f.title || state === "sending"} data-testid="co-submit">
          {state === "sending" ? "Wird gesendet …" : "Angebot erstellen & senden (PDF + Portal)"}
        </button>
      </div>
      {state === "sent" && <p className="text-sm text-emerald-400" data-testid="co-success">Angebot versendet ✔ (E-Mail mit PDF + Konto-Einladung)</p>}
      {state && state !== "sending" && state !== "sent" && <p className="text-sm text-red-400">{state}</p>}
    </div>
  );
}

export function ProspectForm() {
  const [f, setF] = useState({ name: "", email: "", company: "", phone: "", language: "de", note: "" });
  const [state, setState] = useState("");
  const submit = async () => {
    setState("sending");
    try {
      const d = await api("/api/admin/prospects", { method: "POST", body: JSON.stringify({ ...f, company: f.company || null, phone: f.phone || null, note: f.note || null }) });
      setState(d.status === "invited" ? "invited" : d.note ?? "ok");
      setF({ name: "", email: "", company: "", phone: "", language: "de", note: "" });
    } catch (e) {
      setState(e instanceof Error ? e.message : String(e));
    }
  };
  return (
    <div className="glass max-w-2xl space-y-3 p-6" data-testid="admin-prospect-form">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Name *" value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} data-testid="pr-name" />
        <input className="field" type="email" placeholder="E-Mail *" value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} data-testid="pr-email" />
        <input className="field" placeholder="Firma" value={f.company} onChange={(e) => setF((x) => ({ ...x, company: e.target.value }))} />
        <input className="field" placeholder="Telefon" value={f.phone} onChange={(e) => setF((x) => ({ ...x, phone: e.target.value }))} data-testid="pr-phone" />
      </div>
      <select className="field" value={f.language} onChange={(e) => setF((x) => ({ ...x, language: e.target.value }))}>
        <option value="de">Deutsch</option>
        <option value="nl">Nederlands</option>
      </select>
      <textarea className="field min-h-16" placeholder="Interne Notiz" value={f.note} onChange={(e) => setF((x) => ({ ...x, note: e.target.value }))} />
      <p className="text-xs text-zinc-600">Der Interessent erhält eine professionelle Willkommens-E-Mail mit dem Hinweis auf die persönliche Aufnahme und der Einladung, ein Passwort für das Kundenportal zu vergeben.</p>
      <button className="btn-primary !py-2.5 !text-[13px]" onClick={submit} disabled={!f.name || !f.email || state === "sending"} data-testid="pr-submit">
        {state === "sending" ? "Wird angelegt …" : "Interessent anlegen & einladen"}
      </button>
      {state === "invited" && <p className="text-sm text-emerald-400" data-testid="pr-success">Interessent angelegt – Willkommens-E-Mail mit Einladung versendet ✔</p>}
      {state && !["sending", "invited"].includes(state) && <p className="text-sm text-zinc-400">{state}</p>}
    </div>
  );
}
