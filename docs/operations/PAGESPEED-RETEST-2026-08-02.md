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
4. Chat + ExitIntent idle-deferred via `DeferredWidgets`
5. Added `/llms.txt` + `/.well-known/llms.txt` (spec-shaped Markdown)
6. Contrast bumps (`zinc-500` → `zinc-400` on key muted copy)

## Expected impact

| Metric | Target |
|--------|--------|
| CLS | < 0.1 (primary) |
| LCP | ≤ 2.5s |
| Performance | ≥ 90 aspirational; ≥ 85 realistic |
| Agentic llms.txt | pass |

## Retest

1. Deploy, then https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.nexifyai.cloud%2F&form_factor=mobile
2. `curl -sI https://www.nexifyai.cloud/llms.txt | head`
3. Optional: `cd apps/website && npx lighthouse http://127.0.0.1:3000 --only-categories=performance,accessibility --form-factor=mobile --quiet --chrome-flags="--headless=new"`
