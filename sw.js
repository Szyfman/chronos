// ── sw.js ─────────────────────────────────────────────────────────────────
// Chronos service worker.
// BUMP THIS VERSION on every deploy that changes any cached file.
const CACHE = 'chronos-v7';

const FILES = [
  './',
  './index.html',
  './src/state.js',
  './src/cards.js',
  './src/trophies.js',
  './src/sfx.js',
  './src/i18n.js',
  './src/game.js',
  './src/ui.js',
  './assets/bgm.mp3',
  './assets/manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request).then(resp => {
        const cl = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, cl));
        return resp;
      }).catch(() => caches.match(e.request))
    )
  );
});
