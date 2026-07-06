"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <p className="font-mono text-[11px] text-[var(--text-4)] uppercase tracking-[.12em]">Fehler</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-[-.04em] text-[var(--text-1)]">Etwas ist schiefgelaufen.</h1>
        <p className="mx-auto mt-4 max-w-md text-[14px] text-[var(--text-2)] font-light">
          Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
        </p>
        <button
          onClick={reset}
          className="mt-8 px-5 py-2.5 rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg-surface)] text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-hover)] transition-all"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
