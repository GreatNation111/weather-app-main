// Service Worker for Weather Sky PWA
const CACHE_NAME = 'weather-sky-v1.2';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/assets/images/logo.svg',
  '/assets/images/icon-sunny.webp',
  '/assets/images/icon-partly-cloudy.webp',
  '/assets/images/icon-overcast.webp',
  '/assets/images/icon-rain.webp',
  '/assets/images/icon-drizzle.webp',
  '/assets/images/icon-storm.webp',
  '/assets/images/icon-snow.webp',
  '/assets/images/icon-fog.webp',
  '/assets/images/icon-search.svg',
  '/assets/images/icon-units.svg',
  '/assets/images/icon-dropdown.svg',
  '/assets/images/icon-checkmark.svg',
  '/assets/images/icon-loading.svg',
  '/assets/images/icon-error.svg',
  '/assets/images/icon-retry.svg',
  '/assets/images/bg-today-large.svg',
  '/assets/images/bg-today-small.svg',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Install completed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activate completed');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache dynamic requests (API calls)
            if (event.request.url.includes('open-meteo.com')) {
              return caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(event.request.url, fetchResponse.clone());
                  return fetchResponse;
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Fallback for weather API - return cached data if available
            if (event.request.url.includes('open-meteo.com')) {
              return caches.match(event.request)
                .then((cachedResponse) => {
                  if (cachedResponse) {
                    return cachedResponse;
                  }
                  // Return offline page or empty response
                  return new Response(JSON.stringify({
                    error: 'You are offline. Please check your connection.'
                  }), {
                    headers: { 'Content-Type': 'application/json' }
                  });
                });
            }
            
            // For other requests, you could return an offline page
            return caches.match('/offline.html');
          });
      })
  );
});

// Background sync for weather data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-weather-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // This would sync weather data in the background
  // For now, we'll just update the cache
  console.log('Service Worker: Performing background sync');
}