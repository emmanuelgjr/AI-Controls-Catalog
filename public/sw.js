/*
 * Offline service worker — stale-while-revalidate for same-origin GETs.
 * No analytics, no background sync, no push: this worker only caches.
 */
const CACHE = 'ai-controls-catalog-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const refresh = fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') cache.put(request, response.clone());
          return response;
        })
        .catch(() => undefined);

      if (cached) {
        // Serve from cache immediately; refresh in the background.
        refresh.catch(() => {});
        return cached;
      }
      const network = await refresh;
      if (network) return network;
      // Offline and not cached: for navigations, fall back to the cached app shell.
      if (request.mode === 'navigate') {
        const shell = await cache.match(`${self.registration.scope}`);
        if (shell) return shell;
      }
      return Response.error();
    })
  );
});
