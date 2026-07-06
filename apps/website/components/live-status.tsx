export function LiveStatus() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="font-mono text-[10px] text-[var(--text-3)] uppercase tracking-[.1em]">Jetzt verfügbar</span>
    </div>
  );
}
