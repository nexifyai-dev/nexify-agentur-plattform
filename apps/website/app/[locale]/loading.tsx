/** Locale Suspense fallback — same viewport reserve as root loading (footer CLS). */
export default function Loading() {
  return <div className="min-h-[100svh]" aria-hidden="true" />;
}
