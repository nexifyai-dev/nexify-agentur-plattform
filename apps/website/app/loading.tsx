/** Minimal Suspense fallback — no “Wird geladen…” copy that crawlers could misread as page content. */
export default function Loading() {
  return (
    <div className="grid min-h-[40vh] place-items-center" aria-hidden="true">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--text-3)]" />
    </div>
  );
}
