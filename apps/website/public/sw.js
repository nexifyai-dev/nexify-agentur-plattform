/* FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/public/sw.js
 * NIR: 02.08.2026 06:55
 * UPDATED: 02.08.2026 06:55
 * WHAT: Minimal PWA SW — offline shell only, never cache HTML navigations
 * WHY: Cache-all GET previously could serve stale shells and break Header/Footer nav
 * PITFALL: V-XX: never cache /api or document navigations
 */
const CACHE = "nexify-v2";
const SHELL = ["/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api")) return;

  const accept = e.request.headers.get("accept") || "";
  const isNavigate = e.request.mode === "navigate" || accept.includes("text/html");

  // Navigations: network-only (fallback to home shell offline). Never put HTML in cache.
  if (isNavigate) {
    e.respondWith(fetch(e.request).catch(() => caches.match("/").then((m) => m || Response.error())));
    return;
  }

  // Static assets only: network-first, then cache
  if (!/\.(?:js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf|webmanifest)$/i.test(url.pathname) && !SHELL.includes(url.pathname)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
