"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, Send, Sparkles, Wrench, XCircle } from "lucide-react";
import { api } from "@/lib/auth";
import { ChatMarkdown } from "@/components/chat-markdown";

type Msg = { id: string; role: string; content: string; created_at: string };
type Task = { id: string; title: string; instruction: string; run_at: string; status: string; result: string | null };

const fmt = (s: string) => new Date(s).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });

function ActionChip({ content }: { content: string }) {
  let a: { tool?: string; ok?: boolean; summary?: string } | null = null;
  try { a = JSON.parse(content); } catch { return null; }
  if (!a?.tool) return null;
  return (
    <div className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] ${a.ok ? "border-white/15 text-zinc-400" : "border-red-400/40 text-red-300"}`}>
      <Wrench size={11} className="shrink-0" />
      <span className="font-bold">{a.tool}</span>
      <span className="truncate text-zinc-500">{a.summary}</span>
    </div>
  );
}

export function AgentChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);

  const setMsgsIfChanged = useCallback((next: Msg[]) => {
    setMsgs((prev) => {
      if (prev.length === next.length && prev[prev.length - 1]?.id === next[next.length - 1]?.id) return prev;
      return next;
    });
  }, []);

  const load = useCallback(() => {
    api("/api/admin/agent/history").then(setMsgsIfChanged).catch(() => {});
    api("/api/admin/agent/tasks").then(setTasks).catch(() => {});
  }, [setMsgsIfChanged]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || msgs.length === lastCount.current) return;
    lastCount.current = msgs.length;
    el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setMsgs((m) => [...m, { id: `tmp-${Date.now()}`, role: "user", content: text, created_at: new Date().toISOString() }]);
    try {
      const res = await api("/api/admin/agent/chat", { method: "POST", body: JSON.stringify({ message: text }) });
      if (res.status === "busy") {
        setMsgs((m) => [...m, { id: `busy-${Date.now()}`, role: "assistant", content: "Ich arbeite gerade noch an einem anderen Auftrag – einen Moment bitte.", created_at: new Date().toISOString() }]);
        setBusy(false);
        return;
      }
      for (let i = 0; i < 120; i++) {
        await new Promise((r) => setTimeout(r, 2500));
        api("/api/admin/agent/history").then(setMsgsIfChanged).catch(() => {});
        const st = await api("/api/admin/agent/status").catch(() => ({ busy: true }));
        if (!st.busy) break;
      }
    } catch (e) {
      setMsgs((m) => [...m, { id: `err-${Date.now()}`, role: "assistant", content: `Fehler: ${e instanceof Error ? e.message : String(e)}`, created_at: new Date().toISOString() }]);
    }
    setBusy(false);
    load();
  };

  const cancelTask = async (id: string) => {
    await api(`/api/admin/agent/tasks/${id}/cancel`, { method: "POST" });
    load();
  };

  const pending = tasks.filter((t) => t.status === "pending");
  const doneTasks = tasks.filter((t) => t.status !== "pending").slice(0, 10);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]" data-testid="admin-agent-panel">
      <div className="glass flex flex-col p-0">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
            <Sparkles size={16} className="text-zinc-200" />
          </span>
          <div>
            <div className="text-[14px] font-semibold text-white">NeXify Operations-Agent</div>
            <div className="text-[11px] text-zinc-500">Vollzugriff auf CRM, Angebote, Tickets, Termine & E-Mail · plant eigene Folge-Tasks</div>
          </div>
        </div>
          <div ref={boxRef} className="h-[480px] space-y-3 overflow-y-auto p-5" data-testid="agent-messages">
          {msgs.length === 0 && (
            <div className="space-y-2 text-[13px] leading-relaxed text-zinc-500">
              <p>Beispiele, was Sie mir auftragen können:</p>
              <p>„Kontaktiere max@firma.de und kläre, ob er noch Interesse am Angebot hat.“</p>
              <p>„Lege für nächste Woche Mo–Fr jeweils 10:00 und 15:00 Rückruf-Slots an.“</p>
              <p>„Fasse alle offenen Tickets zusammen und beantworte die einfachen direkt.“</p>
              <p>„Erstelle ein Angebot für eine Landingpage an anna@shop.nl auf Niederländisch und sende es.“</p>
              <p>„Prüfe in 2 Tagen, ob Kunde X gezahlt hat – wenn nicht, erinnere ihn freundlich.“</p>
            </div>
          )}
          {msgs.map((m) =>
            m.role === "action" ? (
              <div key={m.id}><ActionChip content={m.content} /></div>
            ) : (
              <div key={m.id} className={`max-w-[92%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${m.role === "user" ? "ml-auto border border-white/15 bg-white/[0.07] text-white" : "bg-white/[0.03] text-zinc-300"}`} data-testid={`agent-msg-${m.role}`}>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">{m.role === "user" ? "Sie" : "Agent"}</span>
                {m.role === "user" ? <span className="whitespace-pre-wrap">{m.content}</span> : <ChatMarkdown content={m.content} />}
              </div>
            )
          )}
          {busy && (
            <div className="flex items-center gap-2 text-[13px] text-zinc-500" data-testid="agent-busy">
              <span className="inline-block size-2 animate-pulse rounded-full bg-zinc-300" />
              Agent arbeitet – liest Daten, führt Aktionen aus …
            </div>
          )}
        </div>
        <div className="flex gap-2 border-t border-white/10 p-4">
          <textarea
            className="field max-h-32 min-h-[46px] resize-none !py-3 !text-[13.5px]"
            placeholder="Auftrag an den Agenten … (Enter = senden, Shift+Enter = Zeilenumbruch)"
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            data-testid="agent-chat-input"
          />
          <button className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 text-black disabled:opacity-40" onClick={send} disabled={!input.trim() || busy} data-testid="agent-chat-send">
            <Send size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass p-5">
          <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            <CalendarClock size={13} /> Geplante Tasks ({pending.length})
          </h3>
          <div className="mt-3 space-y-2" data-testid="agent-pending-tasks">
            {pending.length === 0 && <p className="text-[13px] text-zinc-600">Keine anstehenden Tasks. Der Agent legt sie selbst an, wenn Sie ihm Nachverfolgung auftragen.</p>}
            {pending.map((t) => (
              <div key={t.id} className="rounded-xl bg-white/[0.03] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[13px] font-semibold text-white">{t.title}</div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">Fällig: {fmt(t.run_at)}</div>
                  </div>
                  <button className="shrink-0 text-zinc-600 transition-colors hover:text-red-400" onClick={() => cancelTask(t.id)} title="Stornieren" data-testid={`agent-task-cancel-${t.id}`}>
                    <XCircle size={15} />
                  </button>
                </div>
                <p className="mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-zinc-400">{t.instruction}</p>
              </div>
            ))}
          </div>
        </div>
        {doneTasks.length > 0 && (
          <div className="glass p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">Erledigte Tasks</h3>
            <div className="mt-3 space-y-2">
              {doneTasks.map((t) => (
                <div key={t.id} className="rounded-xl bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-zinc-300">{t.title}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${t.status === "done" ? "border-emerald-400/40 text-emerald-300" : t.status === "cancelled" ? "border-white/15 text-zinc-500" : "border-red-400/40 text-red-300"}`}>{t.status}</span>
                  </div>
                  {t.result && <div className="mt-1.5 line-clamp-4 text-[12px] leading-relaxed text-zinc-500"><ChatMarkdown content={t.result} /></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
