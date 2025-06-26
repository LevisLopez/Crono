const CACHE_NAME = 'moto-speedometer-v1';
const urlsToCache = [
  '/', // Esto cachea index.html
  'index.html',
  // Si tienes otras fuentes, imágenes o archivos CSS externos, añádelos aquí.
  // Por ejemplo:
  // 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
  // 'https://fonts.gstatic.com/s/orbitron/v31/C8c2XzWWqKxRGEyPzCg1s_Bsx_x0_R.woff2' // Ejemplo de fuente
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Borrar caches antiguos
          }
        })
      );
    })
  );
});