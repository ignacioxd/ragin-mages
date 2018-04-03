/* global Promise */
const RM_CACHE = 'raginmages-cache-v5';

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames
        .filter(n => n.startsWith('raginmages-') && !RM_CACHE)
        .map(n => caches.delete(n))
      )
    )
  );
});

self.addEventListener('fetch', e => {
  const requestUrl = new URL(e.request.url);

  if(requestUrl.origin === location.origin) {
    if(requestUrl.pathname === '/') {
      e.respondWith(caches.match('/index.html'));
      return;
    }
  }
  // if(requestUrl.pathname.startsWith('/assets/')) {
  //   e.respondWith(fetchAsset(e.request));
  //   return;
  // }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

self.addEventListener('message', e => {
  if(e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if(e.data.action === 'deleteCache') {
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames
        .filter(n => n.startsWith('raginmages-'))
        .map(n => caches.delete(n))
      )
    )
  }
  if(e.data.action === 'loadAssets') {
    caches.open(RM_CACHE).then(function(cache) {
      if(e.data.assets.cache) {
        cache.addAll(e.data.assets.cache);
      }
      if(e.data.assets.image) {
        let imageUrls = [];
        e.data.assets.image.forEach(function(image) {
          imageUrls.push('assets/' + image.texture);
        })
        cache.addAll(imageUrls);
      }
      if(e.data.assets.spritesheet) {
        let spritesheetUrls = [];
        e.data.assets.spritesheet.forEach(function(spritesheet) {
          spritesheetUrls.push('assets/' + spritesheet.texture);
        })
        cache.addAll(spritesheetUrls);
      }
      if(e.data.assets.atlas) {
        let atlasUrls = [];
        e.data.assets.atlas.forEach(function(atlas) {
          atlasUrls.push('assets/' + atlas.texture);
        })
        cache.addAll(atlasUrls);
      }
      if(e.data.assets.tileMap) {
        let tileMapJsons = [];
        e.data.assets.tileMap.forEach(function(tileMap) {
          tileMapJsons.push('assets/' + tileMap.data);
        })
        cache.addAll(tileMapJsons);
      }
      if(e.data.assets.json) {
        let jsonUrls = [];
        e.data.assets.json.forEach(function(json) {
          jsonUrls.push('assets/' + json.data);
        })
        cache.addAll(jsonUrls);
      }
      if(e.data.assets.html) {
        let htmlUrls = [];
        e.data.assets.html.forEach(function(html) {
          htmlUrls.push('assets/' + html.data);
        })
        cache.addAll(htmlUrls);
      }
    })
  }
});
  
// function fetchAsset(req) {
//   return caches.open(RM_CACHE).then(cache =>
//     cache.match(req.url).then(res =>
//       res ? res : fetch(req).then(netRes => {
//         cache.put(req.url, netRes.clone());
//         return netRes;
//       })
//     )
//   );
// }
