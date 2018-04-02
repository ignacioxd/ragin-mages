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
  if(e.data.cache) {
    caches.open(RM_CACHE).then(function(cache) {
      cache.addAll(e.data.cache);
    });
  }
  if(e.data.image) {
    let imageUrls = [];
    e.data.image.forEach(function(image) {
      imageUrls.push('assets/' + image.texture);
    })

    caches.open(RM_CACHE).then(function(cache) {
      cache.addAll(imageUrls);
    });
  }
  if(e.data.spritesheet) {
    let spritesheetUrls = [];
    e.data.spritesheet.forEach(function(spritesheet) {
      spritesheetUrls.push('assets/' + spritesheet.texture);
    })

    caches.open(RM_CACHE).then(function(cache) {
      cache.addAll(spritesheetUrls);
    });
  }
  if(e.data.atlas) {
    let atlasUrls = [];
    e.data.atlas.forEach(function(atlas) {
      atlasUrls.push('assets/' + atlas.texture);
    })

    caches.open(RM_CACHE).then(function(cache) {
      cache.addAll(atlasUrls);
    });
  }
  if(e.data.tileMap) {
    let tileMapJsons = [];
    e.data.tileMap.forEach(function(tileMap) {
      tileMapJsons.push('assets/' + tileMap.data);
    })

    caches.open(RM_CACHE).then(function(cache) {
      cache.addAll(tileMapJsons);
    });
  }
  if(e.data.json) {
    let jsonUrls = [];
    e.data.json.forEach(function(json) {
      jsonUrls.push('assets/' + json.data);
    })

    caches.open(RM_CACHE).then(function(cache) {
      cache.addAll(jsonUrls);
    });
  }
  if(e.data.html) {
    let htmlUrls = [];
    e.data.html.forEach(function(html) {
      htmlUrls.push('assets/' + html.data);
    })

    caches.open(RM_CACHE).then(function(cache) {
      cache.addAll(htmlUrls);
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
