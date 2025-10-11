const STATIC_CACHE = 'mercamorelos-static-v1';
const DYNAMIC_CACHE = 'mercamorelos-dynamic-v1';

// Assets that form the "app shell" and are cached on install
const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/vite.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  'https://unpkg.com/heroicons@2.1.1/24/outline/index.js'
];

// Install Event: Cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('Service Worker: Caching App Shell');
      return cache.addAll(APP_SHELL);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event: Intercept network requests and apply caching strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests for caching
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Strategy for API calls: Stale-While-Revalidate
  // Serve from cache immediately if available, then update the cache from the network.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  } 
  // Strategy for other requests (app shell, images, scripts, etc.): Cache First, then Network
  else {
    event.respondWith(
      caches.match(event.request).then(cacheRes => {
        return cacheRes || fetch(event.request).then(fetchRes => {
          // Dynamically cache new assets (like product images) if the request is successful
          return caches.open(DYNAMIC_CACHE).then(cache => {
            if (fetchRes.ok) {
                 cache.put(event.request.url, fetchRes.clone());
            }
            return fetchRes;
          });
        }).catch(() => {
          // Fallback to offline page for navigation requests that fail
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
    );
  }
});
