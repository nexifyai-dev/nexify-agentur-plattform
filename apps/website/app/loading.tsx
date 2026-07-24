export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-[var(--text-3)] animate-spin" />
        <p className="font-mono text-[11px] text-[var(--text-4)] uppercase tracking-[.12em]">Wird geladen …</p>
      </div>
    </div>
  );
}
