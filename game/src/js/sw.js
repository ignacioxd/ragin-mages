/* global Promise */
const STATIC_CACHE = 'gosch-static-cache-v1';
const ASSETS_CACHE = 'gosch-assets-cache-v1';
const CACHES = [
  STATIC_CACHE,
  ASSETS_CACHE
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache =>
        cache.addAll([
          '/index.html',
          'js/phaser.min.js',
          'js/game.js',
          'css/main.css',
        ])
      )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames
        .filter(n => n.startsWith('gosch-') && !CACHES.includes(n))
        .map(n => caches.delete(n))
      )
    )
  );
});

self.addEventListener('fetch', e => {
  const requestUrl = new URL(e.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      e.respondWith(caches.match('/index.html'));
      return;
    }
  }
  if (requestUrl.pathname.startsWith('/assets/')) {
    e.respondWith(fetchAsset(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

self.addEventListener('message', e => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

function fetchAsset(req) {
  return caches.open(ASSETS_CACHE).then(cache =>
    cache.match(req.url).then(res =>
      res ? res : fetch(req).then(netRes => {
        cache.put(req.url, netRes.clone());
        return netRes;
      })
    )
  );
}
