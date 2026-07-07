import { Shield, Zap, Clock, FileCheck, Headphones, Check } from "lucide-react";
import { RevealGroup } from "@/components/reveal";

const trustItems = [
  { icon: Shield, label: "Kein Risiko", detail: "Kostenlose Erstberatung" },
  { icon: Zap, label: "Schnell", detail: "Website in 1–3 Tagen" },
  { icon: Clock, label: "Transparent", detail: "Festpreis pro Arbeitstag" },
  { icon: FileCheck, label: "Geprüft", detail: "Tests vor Übergabe" },
  { icon: Headphones, label: "Direkt", detail: "Persönlicher Ansprechpartner" },
  { icon: Check, label: "B2B", detail: "Ausschließlich für Unternehmen" },
];

export function TrustBar() {
  return (
    <section className="py-16 border-b border-[var(--border)]">
      <div className="site-container">
        <RevealGroup stagger={60} className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {trustItems.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex flex-col items-center text-center p-4">
              <Icon className="size-5 text-[var(--text-4)] mb-3" />
              <p className="text-[13px] text-[var(--text-2)] font-medium">{label}</p>
              <p className="font-mono text-[10px] text-[var(--text-4)] mt-1">{detail}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
