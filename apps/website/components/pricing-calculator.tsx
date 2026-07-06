"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/site-data";
import { euro } from "@/lib/utils";

export function PricingCalculator() {
  const [days, setDays] = useState(3);
  const numbers = useMemo(() => {
    const net = days * company.dayRate;
    const vat = net * company.vatRate;
    return { net, vat, gross: net + vat };
  }, [days]);

  return (
    <div className="pricing-calculator" role="group" aria-label="Projektrechner">
      <div>
        <p className="kicker">Projekt-Rechner</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Transparenz statt Paketnebel.</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-2)] font-light">Wählen Sie die geplanten Arbeitstage. Der tatsächliche Umfang wird vor Projektstart anhand von Funktionen, Inhalten, Integrationen und Abnahme definiert.</p>
      </div>
      <div className="day-control" role="group" aria-label="Anzahl Arbeitstage">
        <Button variant="outline" size="icon" onClick={() => setDays((d) => Math.max(1, d - 1))} aria-label="Arbeitstag entfernen" disabled={days <= 1}><Minus className="size-4" /></Button>
        <div aria-live="polite"><strong>{days}</strong><span>{days === 1 ? "Arbeitstag" : "Arbeitstage"}</span></div>
        <Button variant="outline" size="icon" onClick={() => setDays((d) => Math.min(60, d + 1))} aria-label="Arbeitstag hinzufügen" disabled={days >= 60}><Plus className="size-4" /></Button>
      </div>
      <div className="price-results" aria-live="polite" aria-atomic="true">
        <div><span>Netto</span><strong>{euro(numbers.net)}</strong></div>
        <div><span>21 % BTW</span><strong>{euro(numbers.vat)}</strong></div>
        <div className="total"><span>Brutto bei 21 % BTW</span><strong>{euro(numbers.gross)}</strong></div>
      </div>
      <p className="text-xs leading-5 text-[var(--text-4)]">Bei grenzüberschreitenden B2B-Leistungen innerhalb der EU kann bei gültiger Umsatzsteuer-ID Reverse Charge gelten. Dann wird keine niederländische BTW berechnet.</p>
    </div>
  );
}
