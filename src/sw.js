self.addEventListener('install', e => {
  console.log('sw installed');
});

self.addEventListener('activate', e => {
  console.log('sw activated');
});

self.addEventListener('fetch', e => {
  console.log('sw fetched');
  e.respondWith(fetch(e.request));
});
