// Offline helper. Must be named <page name>-sw.js, next to <page name>.html
// (loan.html -> loan-sw.js). The page name is read from this file's own name.
const CACHE = 'tracker-' + location.pathname;
const PAGE = './' + location.pathname.split('/').pop().replace(/-sw\.js$/, '.html');

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./', PAGE])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k.startsWith('tracker-') === false).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (updates arrive), cache when offline.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match(PAGE)))
  );
});
