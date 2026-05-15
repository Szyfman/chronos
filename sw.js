const CACHE = 'chronos-v9';

const BASE = '/chronos/';

const FILES = [
  BASE,
  BASE + 'index.html',

  BASE + 'src/state.js',
  BASE + 'src/cards.js',
  BASE + 'src/trophies.js',
  BASE + 'src/sfx.js',
  BASE + 'src/i18n.js',
  BASE + 'src/game.js',
  BASE + 'src/ui.js',

  BASE + 'assets/bgm.mp3',
  BASE + 'assets/manifest.json',
  BASE + 'assets/icon-192.png',
  BASE + 'assets/icon-512.png',
  BASE + 'assets/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );

  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', e => {

  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {

      if (cached) return cached;

      return fetch(e.request).then(resp => {

        // Não cachear erros/404
        if (!resp || resp.status !== 200) {
          return resp;
        }

        const url = new URL(e.request.url);

        // Cachear apenas mesmo domínio
        if (url.origin === location.origin) {

          const clone = resp.clone();

          caches.open(CACHE).then(cache => {
            cache.put(e.request, clone);
          });
        }

        return resp;
      });
    })
  );
});