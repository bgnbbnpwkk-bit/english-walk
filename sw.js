/* English Walk — Service Worker
   - Auto-updates on every load (skipWaiting + clients.claim)
   - Caches ONLY hash-named static assets (JS/CSS)
   - NEVER caches index.html (prevents stale shell on iOS after swipe-close)
*/
const CACHE = "english-walk-static-v1";

// Matches files that contain a content hash, e.g. app.4f3a9c.js / styles.ab12cd.css
const HASHED_ASSET = /\.[0-9a-f]{6,}\.(js|css)$/i;

self.addEventListener("install", (event) => {
  // Activate this SW immediately, don't wait for old clients to close.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Drop any old caches.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only handle same-origin requests; let cross-origin (Firebase, Gemini, CDNs)
  // go straight to the network.
  if (url.origin !== self.location.origin) return;

  // Never cache the HTML shell — always fetch fresh from the network.
  if (
    url.pathname.endsWith("/") ||
    url.pathname.endsWith("/index.html") ||
    req.mode === "navigate"
  ) {
    event.respondWith(fetch(req));
    return;
  }

  // Cache-first for hash-named static assets only.
  if (HASHED_ASSET.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const resp = await fetch(req);
        if (resp && resp.status === 200) cache.put(req, resp.clone());
        return resp;
      })
    );
    return;
  }

  // Everything else (manifest, icons, non-hashed files): network, no caching.
});
