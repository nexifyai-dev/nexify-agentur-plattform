import { company } from "@/lib/company";

// Kanonisches Brand-Logo (design_guidelines.json "logo" + app/icon.svg + Re-Branding 2026-08-09):
// NX-Mark = dunkle Kachel #0c0c0f + Outline + Neon-Lime-Glow, N-Geometrie #C8FF00, Lime-Punkt.
export function LogoMark({ size = 34 }: { size?: number }) {
  const gid = `nx-n-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${gid}-glow`} cx="0.58" cy="0.56" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#C8FF00" stopOpacity="0.18" />
          <stop offset="1" stopColor="#C8FF00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" rx="184" fill="#0c0c0f" />
      <rect width="1024" height="1024" rx="184" fill={`url(#${gid}-glow)`} />
      <rect x="3" y="3" width="1018" height="1018" rx="181" stroke="rgba(255,255,255,0.10)" strokeWidth="6" />
      <g fill="#C8FF00">
        <rect x="164" y="225" width="133" height="574" rx="20" />
        <rect x="346" y="225" width="133" height="574" rx="20" />
        <polygon points="225,225 389,225 840,799 676,799" />
      </g>
      <circle cx="835" cy="189" r="58" fill="#C8FF00" />
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
