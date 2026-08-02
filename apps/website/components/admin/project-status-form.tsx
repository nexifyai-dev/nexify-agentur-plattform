"use client";

// FILE: apps/website/components/admin/project-status-form.tsx
// NIR: 02.08.2026 11:00
// UPDATED: 02.08.2026 11:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Admin control to update offer lifecycle phase + seed deliverables.
// WHY: Portal timeline needs an operator path without inventing fake progress.
// BEST-PRACTICE: Explicit phase IDs matching backend LIFECYCLE_PHASES.
// PITFALL: Do not auto-advance to rechnung without human confirmation.
// DEPENDS: /api/admin/offers/{id}/project
// DOCS-REF: backend/lifecycle.py
// SESSION: website-gesamtkonzept-kundenportal-7dd5

import { useState } from "react";
import { api } from "@/lib/auth";

const PHASES = ["anfrage", "angebot", "freigabe", "umsetzung", "abnahme", "rechnung"] as const;

export function ProjectStatusForm({ offerId, onDone }: { offerId: string; onDone?: () => void }) {
  const [phase, setPhase] = useState<(typeof PHASES)[number]>("umsetzung");
  const [deliverable, setDeliverable] = useState("");
  const [state, setState] = useState("");

  const submit = async () => {
    setState("sending");
    try {
      const body: Record<string, unknown> = { lifecycle_phase: phase };
      if (deliverable.trim()) {
        body.deliverables = [{ title: deliverable.trim(), status: "ready" }];
      }
      await api(`/api/admin/offers/${offerId}/project`, { method: "PATCH", body: JSON.stringify(body) });
      setState("ok");
      onDone?.();
    } catch (e) {
      setState(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="glass space-y-3 p-4" data-testid="admin-project-status-form">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">Auftrag-Status</h3>
      <select className="field" value={phase} onChange={(e) => setPhase(e.target.value as (typeof PHASES)[number])} data-testid="admin-phase-select">
        {PHASES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input className="field" placeholder="Optional: Deliverable-Titel" value={deliverable} onChange={(e) => setDeliverable(e.target.value)} data-testid="admin-deliverable-input" />
      <button className="btn-primary !py-2.5 !text-[13px]" onClick={submit} disabled={state === "sending"} data-testid="admin-phase-save">
        {state === "sending" ? "Speichern …" : "Status speichern"}
      </button>
      {state === "ok" && <p className="text-sm text-emerald-400">Gespeichert ✔</p>}
      {state && state !== "sending" && state !== "ok" && <p className="text-sm text-red-400">{state}</p>}
    </div>
  );
}
