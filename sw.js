// Import Dexie for IndexedDB access
importScripts('https://unpkg.com/dexie@3/dist/dexie.js');

const STATIC_CACHE = 'mercamorelos-static-v1';
const DYNAMIC_CACHE = 'mercamorelos-dynamic-v1';
const API_BASE_URL = '/api'; // Use a relative path to support proxying

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

// Define the database schema for the service worker context
const db = new Dexie('MercaMorelosDB');
db.version(1).stores({
    pendingRegistrations: '++id, email',
});


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
  
  // Strategy for API calls: Network First, falling back to Cache.
  // This ensures data is always fresh when online.
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // If the fetch is successful, update the cache and return the response
          return caches.open(DYNAMIC_CACHE).then(cache => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // If the network fails, try to serve the response from the cache
          return caches.match(event.request);
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


// Sync Event: Handle background synchronization tasks
self.addEventListener('sync', event => {
    if (event.tag === 'sync-new-registrations') {
        console.log('Service Worker: Syncing new registrations.');
        event.waitUntil(syncRegistrations());
    }
});

async function syncRegistrations() {
    try {
        const pending = await db.pendingRegistrations.toArray();
        if (pending.length === 0) {
            return;
        }
        
        console.log(`Service Worker: Found ${pending.length} pending registrations to sync.`);

        for (const registration of pending) {
            const { id, ...payload } = registration;
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    console.log(`Service Worker: Successfully synced registration for ${payload.email}.`);
                    await db.pendingRegistrations.delete(id);
                    
                    self.registration.showNotification('¡Registro completado!', {
                        body: `Tu cuenta en MercaMorelos para ${payload.email} ha sido creada.`,
                        icon: '/icon-192.png'
                    });

                } else {
                    const errorData = await response.json();
                    if (response.status === 400 && errorData.message === 'User already exists') {
                         console.log(`Service Worker: Registration for ${payload.email} failed because user exists. Removing from sync queue.`);
                         await db.pendingRegistrations.delete(id);
                         self.registration.showNotification('Fallo en el registro', {
                             body: `No pudimos registrar ${payload.email} porque ya existe una cuenta.`,
                             icon: '/icon-192.png'
                         });
                    } else {
                        console.error(`Service Worker: Failed to sync registration for ${payload.email}. Status: ${response.status}`, errorData);
                    }
                }
            } catch (error) {
                console.error(`Service Worker: Network error during sync for ${payload.email}. Will retry later.`, error);
                 // We don't delete the item, so it will be retried on the next sync event.
            }
        }
    } catch (error) {
        console.error('Service Worker: Error during registration sync process.', error);
    }
}