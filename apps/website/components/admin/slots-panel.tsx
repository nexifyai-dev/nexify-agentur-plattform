"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarPlus, Phone, Trash2 } from "lucide-react";
import { api } from "@/lib/auth";

type Slot = { id: string; start_at: string; duration_min: number; status: string; name: string | null; email: string | null; phone: string | null; company: string | null; topic: string | null; language: string | null };

const fmt = (s: string) => new Date(s).toLocaleString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" });

export function SlotsPanel() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [when, setWhen] = useState("");
  const [duration, setDuration] = useState(30);
  const [state, setState] = useState("");

  const load = useCallback(() => api("/api/admin/slots").then(setSlots).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!when) return;
    setState("saving");
    try {
      const d = await api("/api/admin/slots", { method: "POST", body: JSON.stringify({ slots: [when], duration_min: duration }) });
      setState(d.created ? "created" : "duplicate");
      setWhen("");
      load();
      setTimeout(() => setState(""), 2500);
    } catch (e) {
      setState(e instanceof Error ? e.message : String(e));
    }
  };

  const remove = async (id: string) => {
    await api(`/api/admin/slots/${id}`, { method: "DELETE" });
    load();
  };

  const booked = slots.filter((s) => s.status === "booked" && new Date(s.start_at) > new Date(Date.now() - 864e5));
  const free = slots.filter((s) => s.status === "free" && new Date(s.start_at) > new Date());

  return (
    <div className="space-y-8" data-testid="admin-slots-panel">
      <div className="glass max-w-2xl space-y-3 p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">Neues Rückruf-Zeitfenster anlegen</h3>
        <div className="flex flex-wrap items-center gap-3">
          <input type="datetime-local" className="field !w-auto" value={when} onChange={(e) => setWhen(e.target.value)} data-testid="slot-datetime-input" />
          <select className="field !w-auto" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            <option value={15}>15 Min.</option>
            <option value={30}>30 Min.</option>
            <option value={45}>45 Min.</option>
            <option value={60}>60 Min.</option>
          </select>
          <button className="btn-primary !py-2.5 !text-[13px]" onClick={add} disabled={!when || state === "saving"} data-testid="slot-add-btn">
            <CalendarPlus size={14} /> Anlegen
          </button>
        </div>
        {state === "created" && <p className="text-sm text-emerald-400" data-testid="slot-add-success">Zeitfenster angelegt ✔ – ist sofort auf /rueckruf buchbar</p>}
        {state === "duplicate" && <p className="text-sm text-zinc-400">Zeitfenster existiert bereits.</p>}
        {state && !["saving", "created", "duplicate"].includes(state) && <p className="text-sm text-red-400">{state}</p>}
        <p className="text-xs text-zinc-600">Zeiten gelten für Europe/Amsterdam. Interessenten buchen auf der Seite /rueckruf – Sie und der Interessent erhalten automatisch eine Bestätigungs-E-Mail.</p>
      </div>

      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">Gebuchte Termine ({booked.length})</h3>
        <div className="mt-3 space-y-3">
          {booked.length === 0 && <p className="text-sm text-zinc-600">Keine gebuchten Termine.</p>}
          {booked.map((s) => (
            <div key={s.id} className="glass flex flex-wrap items-center justify-between gap-3 border-emerald-400/20 p-5" data-testid={`slot-booked-${s.id}`}>
              <div>
                <div className="text-[14px] font-semibold text-white">{fmt(s.start_at)} <span className="text-zinc-500">· {s.duration_min} Min.</span></div>
                <div className="mt-1 text-[13px] text-zinc-300">{s.name}{s.company ? ` · ${s.company}` : ""}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-4 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300"><Phone size={11} />{s.phone}</span>
                  <span>{s.email}</span>
                  {s.topic && <span className="text-zinc-500">Thema: {s.topic}</span>}
                </div>
              </div>
              <span className="rounded-full border border-emerald-400/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">Gebucht</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">Freie Zeitfenster ({free.length})</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {free.length === 0 && <p className="text-sm text-zinc-600">Keine freien Zeitfenster – legen Sie oben neue an.</p>}
          {free.map((s) => (
            <div key={s.id} className="glass flex items-center justify-between gap-2 p-4" data-testid={`slot-free-${s.id}`}>
              <span className="text-[13px] text-zinc-300">{fmt(s.start_at)} · {s.duration_min} Min.</span>
              <button className="text-zinc-600 transition-colors hover:text-red-400" onClick={() => remove(s.id)} title="Löschen" data-testid="slot-delete-btn">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
