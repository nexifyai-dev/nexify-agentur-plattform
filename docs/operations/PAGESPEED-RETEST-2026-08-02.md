# FILE: docs/operations/PAGESPEED-RETEST-2026-08-02.md
# NIR: 02.08.2026 11:10
# UPDATED: 02.08.2026 11:10
# WHAT: Retest notes after CLS/LCP/llms.txt PageSpeed fixes

## Baseline (mobile PSI, 2026-08-02, Lighthouse 13)

URL: https://www.nexifyai.cloud/

| Category | Before |
|----------|--------|
| Performance | 77 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |
| Agentic Browsing | 1/3 (llms.txt fail) |
| LCP | 2.9s |
| CLS | 0.353 |

## Changes shipped

1. Removed non-composited `.text-silver` `background-position` shimmer → solid `#e4e4e7`
2. Hero LCP content no longer wrapped in `.reveal` (opacity 0 until JS)
3. Font size-adjust fallbacks (`Outfit Fallback` / `Manrope Fallback`)
4. All fixed overlays idle-deferred via `DeferredWidgets` (chat, exit-intent, sticky CTA, cookie)
5. **Footer CLS:** `#main-content` + Suspense `loading` use `min-h: 100svh` so `site-footer` starts below the fold; `content-visibility` on footer
6. Added `/llms.txt` + `/.well-known/llms.txt` (`# NeXify AI` + markdown links)
7. Anonymous `/api/auth/me` → 200 `{}` (no 401 console noise); skip refresh when empty
8. Contrast bumps (`zinc-500` → `zinc-400` on key muted copy)

## CLS strategy (footer 0.48 → ~0)

PSI attributes nearly all CLS to `data-testid="site-footer"` because **main grows after Suspense/hydration** and pushes the footer while it is still in (or entering) the viewport. Overlays were already `position:fixed` and not the root cause.

Fix: reserve a full viewport for main on first paint (`min-h-[100svh]` on `#main-content` and `app/loading.tsx`). Footer starts off-screen; subsequent growth does not score as visible footer shift. Overlays stay fixed and deferred.

## Expected impact

| Metric | Target |
|--------|--------|
| CLS | < 0.1 (footer contribution ≈ 0; was 0.48 desktop / 0.35 mobile) |
| LCP | ≤ 2.5s (desktop already excellent) |
| Performance | ≥ 85 realistic |
| Agentic llms.txt | pass (H1 + markdown links) |

## Retest

1. Deploy, then https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.nexifyai.cloud%2F&form_factor=mobile
2. `curl -sI https://www.nexifyai.cloud/llms.txt | head`
3. Optional: `cd apps/website && npx lighthouse http://127.0.0.1:3000 --only-categories=performance,accessibility --form-factor=mobile --quiet --chrome-flags="--headless=new"`
