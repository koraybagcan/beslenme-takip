const CACHE_NAME = 'beslenme-takip-v1';
const ASSETS = [
  '/beslenme-takip/',
  '/beslenme-takip/index.html',
  '/beslenme-takip/manifest.json',
  '/beslenme-takip/logo.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Supabase ve GitHub API isteklerini cache'leme, direkt geçir
  if (e.request.url.includes('supabase.co') || e.request.url.includes('api.github.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request);
    })
  );
});
