export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg-silver" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="0.45" stopColor="#a1a1aa" />
          <stop offset="0.7" stopColor="#e4e4e7" />
          <stop offset="1" stopColor="#71717a" />
        </linearGradient>
        <linearGradient id="lg-silver2" x1="44" y1="4" x2="4" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e4e4e7" />
          <stop offset="1" stopColor="#52525b" />
        </linearGradient>
      </defs>
      <path d="M24 2.5 42.5 13v22L24 45.5 5.5 35V13L24 2.5Z" stroke="url(#lg-silver)" strokeWidth="1.6" />
      <path d="M24 9 36.5 16.2v14.6L24 38 11.5 30.8V16.2L24 9Z" stroke="url(#lg-silver2)" strokeWidth="0.9" opacity="0.55" />
      <path d="M16.5 16.5 31.5 31.5M31.5 16.5l-15 15" stroke="url(#lg-silver)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16.5" cy="16.5" r="2.6" fill="#0a0a0c" stroke="url(#lg-silver)" strokeWidth="1.4" />
      <circle cx="31.5" cy="16.5" r="2.6" fill="#0a0a0c" stroke="url(#lg-silver)" strokeWidth="1.4" />
      <circle cx="16.5" cy="31.5" r="2.6" fill="#0a0a0c" stroke="url(#lg-silver)" strokeWidth="1.4" />
      <circle cx="31.5" cy="31.5" r="2.6" fill="#0a0a0c" stroke="url(#lg-silver)" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="3.4" fill="url(#lg-silver)" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3" data-testid="brand-logo">
      <LogoMark />
      {!compact && (
        <span className="leading-none">
          <span className="block whitespace-nowrap font-[family-name:var(--font-heading)] text-[19px] font-semibold tracking-wide text-white">
            Ne<span className="text-silver font-bold">X</span>ify{" "}
            <span className="font-light text-zinc-400">AI</span>
          </span>
          <span className="mt-1 block text-[8.5px] uppercase tracking-[0.34em] text-zinc-500">Chat it. Automate it.</span>
        </span>
      )}
    </span>
  );
}
