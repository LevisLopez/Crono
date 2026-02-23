const CACHE_NAME = 'moto-speedometer-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './service-worker.js',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-144x144.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
  'https://fonts.gstatic.com/s/orbitron/v31/PpjWSgNDLSzNZQnEw_D5b_qF12.woff2'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Opcional, pero útil
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Abriendo caché y añadiendo archivos...');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[SW] Error al cachear:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  console.log('[SW] Interceptando fetch:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        return new Response('Sin conexión disponible.', {
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});


