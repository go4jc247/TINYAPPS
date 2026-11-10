// Offline helper for the landing page only. Network first, cache when offline.
const CACHE = 'tiny-apps';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // Only handle the landing page itself; each app has its own worker.
  const scopePath = new URL('./', location).pathname;
  const isHome = [scopePath, scopePath + 'index.html', scopePath + 'manifest.webmanifest', scopePath + 'icon.png'].includes(url.pathname);
  if (req.method !== 'GET' || url.origin !== location.origin || !isHome) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
