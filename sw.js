// Cache versiyonu — her deploy'da güncellenir
const CACHE_NAME = 'beslenme-takip-' + Date.now();

// index.html her zaman network'ten gelsin
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('supabase.co') || e.request.url.includes('api.github.com')) {
    return;
  }
  // index.html ve ana sayfa her zaman network'ten
  if (e.request.url.includes('index.html') || 
      e.request.url.endsWith('/beslenme-takip/') || 
      e.request.url.endsWith('/beslenme-takip')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Diğerleri network first, cache fallback
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
