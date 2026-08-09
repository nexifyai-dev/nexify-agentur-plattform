import { company } from "@/lib/company";

// Kanonisches Brand-Logo (design_guidelines.json "logo" + app/icon.svg):
// N-Marke = 2 senkrechte Rechtecke + Diagonale, Gradient #d4d4d8→#fafafa,
// Lime-Punkt oben-rechts. NICHT das alte Hexagon-Node-SVG (Falsch-Logo, bis 09.08.2026).
export function LogoMark({ size = 34 }: { size?: number }) {
  const gid = `nx-n-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#0A0A0A" />
      <rect x="7" y="7" width="7" height="34" rx="2" fill={`url(#${gid})`} />
      <rect x="34" y="7" width="7" height="34" rx="2" fill={`url(#${gid})`} />
      <polygon points="7,7 15,7 41,41 33,41" fill={`url(#${gid})`} />
      <circle cx="41" cy="7" r="5" fill="#C8FF00" />
      <circle cx="41" cy="7" r="5" fill="none" stroke="#0A0A0A" strokeWidth="3" />
      <defs>
        <linearGradient id={gid} x1="7" y1="41" x2="41" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d4d4d8" />
          <stop offset="1" stopColor="#fafafa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 sm:gap-3" data-testid="brand-logo">
      <LogoMark size={compact ? 30 : 34} />
      {!compact && (
        <span className="leading-none">
          <span className="block whitespace-nowrap font-[family-name:var(--font-heading)] text-[16px] font-semibold tracking-wide text-white sm:text-[19px]">
            Ne<span className="text-[#C8FF00] font-bold">X</span>ify{" "}
            <span className="font-light text-zinc-400">AI</span>
          </span>
          <span className="mt-1 hidden text-[8.5px] uppercase tracking-[0.34em] text-zinc-500 sm:block">{company.descriptor}</span>
        </span>
      )}
    </span>
  );
}
