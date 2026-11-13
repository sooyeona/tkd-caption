const CACHE = 'tkd-v29';
const MODEL = 'tkd-model-v2';
const SHELL = ['./', 'index.html', 'app.js', 'fonts.css', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== MODEL).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
  if (url.origin !== location.origin && !isFont) return;
  // AI model + libraries never change: serve from cache, download once
  if (url.origin === location.origin && /\/(models|lib|fonts)\//.test(url.pathname)) {
    e.respondWith(caches.open(MODEL).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }
  // network first (so updates show up), fall back to cache when offline
  e.respondWith(
    // no-cache: always ask GitHub whether the file changed (GitHub Pages otherwise serves a 10-minute-old copy)
    fetch(req, { cache: 'no-cache' }).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
