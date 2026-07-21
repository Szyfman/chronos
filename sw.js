const CACHE = 'chronos-v11';

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
    // Cacheia cada arquivo individualmente: um 404 isolado não derruba o install inteiro.
    caches.open(CACHE).then(cache =>
      Promise.all(
        FILES.map(url =>
          cache.add(url).catch(err => {
            console.warn('[sw] falha ao cachear', url, err);
          })
        )
      )
    )
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
    ).then(() => self.clients.claim())
  );
});

// Detecta pedidos de documento/navegação (index.html). No mobile, abrir o app
// ou recarregar gera um request com mode === 'navigate'.
function isHtmlRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

self.addEventListener('fetch', e => {

  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Só lidamos com o mesmo domínio (fontes do Google etc. seguem direto pela rede).
  if (url.origin !== location.origin) return;

  // ── HTML / navegação → NETWORK-FIRST ──────────────────────────────────
  // Garante que uma nova publicação no GitHub Pages apareça imediatamente.
  // Cai para o cache apenas quando offline.
  if (isHtmlRequest(e.request)) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
          }
          return resp;
        })
        .catch(() =>
          caches.match(e.request).then(c => c || caches.match(BASE + 'index.html'))
        )
    );
    return;
  }

  // ── Demais assets → CACHE-FIRST com revalidação em segundo plano ───────
  // Resposta instantânea no mobile + offline, mas atualiza o cache na rede.
  e.respondWith(
    caches.match(e.request).then(cached => {

      const network = fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached);

      return cached || network;
    })
  );
});
