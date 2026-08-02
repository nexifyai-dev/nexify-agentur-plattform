/** Suspense fallback: reserve full viewport so site-footer stays below the fold (CLS). */
export default function Loading() {
  return <div className="min-h-[100svh]" aria-hidden="true" />;
}
