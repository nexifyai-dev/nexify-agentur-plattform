"use client";

import { useState } from "react";
import { Mail, Pencil, Phone, Trash2, X } from "lucide-react";
import { api } from "@/lib/auth";
import { fmtDate } from "@/components/admin/panels";

export type Lead = { id: string; name: string; email: string; company: string | null; phone: string | null; language: string; message: string; source: string; status: string; created_at: string };

const SOURCE_LABEL: Record<string, string> = { contact: "Kontaktformular", chat_offer: "KI-Berater", portal_request: "Kundenportal", manual: "Manuell", callback: "Rückruf-Termin", email: "E-Mail-Eingang" };
const STATUS_OPTIONS = [["new", "Neu"], ["contacted", "Kontaktiert"], ["qualified", "Qualifiziert"], ["won", "Gewonnen"], ["lost", "Verloren"]] as const;
const STATUS_LABEL: Record<string, string> = Object.fromEntries(STATUS_OPTIONS);

function LeadCard({ l, onChanged, onEmail }: { l: Lead; onChanged: () => void; onEmail: (email: string, name: string) => void }) {
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ name: l.name ?? "", email: l.email ?? "", company: l.company ?? "", phone: l.phone ?? "", language: l.language ?? "de", status: l.status ?? "new", message: l.message ?? "" });
  const [state, setState] = useState("");

  const save = async () => {
    setState("saving");
    try {
      await api(`/api/admin/leads/${l.id}`, { method: "PUT", body: JSON.stringify({ ...f, company: f.company || null, phone: f.phone || null }) });
      setState("");
      setEdit(false);
      onChanged();
    } catch (e) {
      setState(e instanceof Error ? e.message : String(e));
    }
  };

  const remove = async () => {
    if (!window.confirm(`Lead „${l.name}“ wirklich löschen?`)) return;
    await api(`/api/admin/leads/${l.id}`, { method: "DELETE" });
    onChanged();
  };

  if (edit) {
    return (
      <div className="glass space-y-3 p-5" data-testid={`admin-lead-edit-${l.id}`}>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field !py-2.5 !text-[13px]" placeholder="Name" value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} data-testid="lead-edit-name" />
          <input className="field !py-2.5 !text-[13px]" type="email" placeholder="E-Mail" value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} data-testid="lead-edit-email" />
          <input className="field !py-2.5 !text-[13px]" placeholder="Firma" value={f.company} onChange={(e) => setF((x) => ({ ...x, company: e.target.value }))} />
          <input className="field !py-2.5 !text-[13px]" placeholder="Telefon" value={f.phone} onChange={(e) => setF((x) => ({ ...x, phone: e.target.value }))} data-testid="lead-edit-phone" />
          <select className="field !py-2.5 !text-[13px]" value={f.language} onChange={(e) => setF((x) => ({ ...x, language: e.target.value }))}>
            <option value="de">Deutsch</option>
            <option value="nl">Nederlands</option>
          </select>
          <select className="field !py-2.5 !text-[13px]" value={f.status} onChange={(e) => setF((x) => ({ ...x, status: e.target.value }))} data-testid="lead-edit-status">
            {STATUS_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
        <textarea className="field min-h-16 !text-[13px]" placeholder="Notiz / Nachricht" value={f.message} onChange={(e) => setF((x) => ({ ...x, message: e.target.value }))} />
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-primary !px-5 !py-2 !text-[12px]" onClick={save} disabled={state === "saving" || !f.name || !f.email} data-testid="lead-edit-save">
            {state === "saving" ? "Speichert …" : "Speichern"}
          </button>
          <button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => setEdit(false)}>
            <X size={13} /> Abbrechen
          </button>
          <button className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-4 py-2 text-[12px] font-semibold text-red-300 hover:border-red-400/60" onClick={remove} data-testid="lead-delete-btn">
            <Trash2 size={13} /> Löschen
          </button>
        </div>
        {state && state !== "saving" && <p className="text-xs text-red-400">{state}</p>}
      </div>
    );
  }

  return (
    <div className="glass flex flex-wrap items-center justify-between gap-3 p-5" data-testid={`admin-lead-${l.id}`}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold text-white">{l.name}</span>
          {l.company && <span className="text-[13px] text-zinc-500">· {l.company}</span>}
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${l.status === "won" ? "border-emerald-400/40 text-emerald-300" : l.status === "lost" ? "border-red-400/40 text-red-300" : "border-white/15 text-zinc-500"}`}>
            {STATUS_LABEL[l.status] ?? l.status}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5"><Mail size={11} className="text-zinc-600" />{l.email}</span>
          {l.phone && <span className="inline-flex items-center gap-1.5" data-testid="lead-phone"><Phone size={11} className="text-zinc-600" />{l.phone}</span>}
          <span className="uppercase text-zinc-600">{l.language}</span>
          <span className="text-zinc-600">{fmtDate(l.created_at)}</span>
        </div>
        {l.message && <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-zinc-400">{l.message}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full border border-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{SOURCE_LABEL[l.source] ?? l.source}</span>
        <button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => setEdit(true)} data-testid="lead-edit-btn">
          <Pencil size={13} /> Bearbeiten
        </button>
        <button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => onEmail(l.email, l.name)} data-testid="admin-lead-mail-btn">
          <Mail size={13} /> Kontaktieren
        </button>
      </div>
    </div>
  );
}

export function LeadsPanel({ leads, onChanged, onEmail }: { leads: Lead[]; onChanged: () => void; onEmail: (email: string, name: string) => void }) {
  if (leads.length === 0) return <p className="text-sm text-zinc-600">Keine Leads vorhanden.</p>;
  return (
    <div className="space-y-3" data-testid="admin-leads-panel">
      {leads.map((l) => <LeadCard key={l.id} l={l} onChanged={onChanged} onEmail={onEmail} />)}
    </div>
  );
}
