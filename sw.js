// Service Worker for WeatherNow PWA
const CACHE_NAME = 'weathernow-v1.0';
const STATIC_CACHE = 'static-v1';

// ===== STATIC ASSETS - EXACT PATHS FOR GITHUB PAGES =====
const STATIC_ASSETS = [
  // Main HTML and app files
  '/weather-app-main/',
  '/weather-app-main/index.html',
  '/weather-app-main/styles.css',
  '/weather-app-main/script.js',
  '/weather-app-main/manifest.json',
  
  // PWA Icons and logos
  '/weather-app-main/assets/images/icon-sunny.webp',
  '/weather-app-main/assets/images/logo.svg',
  
  // Weather icons (all of them)
  '/weather-app-main/assets/images/icon-sunny.webp',
  '/weather-app-main/assets/images/icon-partly-cloudy.webp',
  '/weather-app-main/assets/images/icon-overcast.webp',
  '/weather-app-main/assets/images/icon-rain.webp',
  '/weather-app-main/assets/images/icon-drizzle.webp',
  '/weather-app-main/assets/images/icon-storm.webp',
  '/weather-app-main/assets/images/icon-snow.webp',
  '/weather-app-main/assets/images/icon-fog.webp',
  
  // UI icons
  '/weather-app-main/assets/images/icon-search.svg',
  '/weather-app-main/assets/images/icon-units.svg',
  '/weather-app-main/assets/images/icon-dropdown.svg',
  '/weather-app-main/assets/images/icon-checkmark.svg',
  '/weather-app-main/assets/images/icon-loading.svg',
  '/weather-app-main/assets/images/icon-error.svg',
  '/weather-app-main/assets/images/icon-retry.svg',
  
  // Background images
  '/weather-app-main/assets/images/bg-today-large.svg',
  '/weather-app-main/assets/images/bg-today-small.svg'
];

// ===== INSTALL EVENT - Cache all static assets =====
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing and caching static assets...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching', STATIC_ASSETS.length, 'static assets');
        
        // Try to cache all assets, but don't fail if some miss
        return cache.addAll(STATIC_ASSETS)
          .then(() => {
            console.log('Service Worker: All static assets cached successfully');
          })
          .catch((error) => {
            console.log('Service Worker: Some assets failed to cache:', error);
            // Don't fail the installation - cache what we can
          });
      })
      .then(() => {
        console.log('Service Worker: Install completed');
        // Activate immediately without waiting
        return self.skipWaiting();
      })
  );
});

// ===== ACTIVATE EVENT - Clean up old caches =====
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating and cleaning old caches...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any old caches that aren't our current one
          if (cacheName !== STATIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activate completed');
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// ===== FETCH EVENT - Serve from cache or network =====
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If found in cache, return cached version
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise, fetch from network
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((fetchResponse) => {
            // For API calls, cache the response for offline use
            if (event.request.url.includes('open-meteo.com')) {
              const apiResponse = fetchResponse.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(event.request.url, apiResponse);
                  console.log('Service Worker: Cached API response:', event.request.url);
                });
            }
            return fetchResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Network failed, serving fallback:', error);
            
            // For API requests, return a basic offline response
            if (event.request.url.includes('open-meteo.com')) {
              return new Response(JSON.stringify({
                offline: true,
                message: 'You are offline. Please check your connection.'
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            
            // For other failed requests, you could return an offline page
            // For now, let the error propagate
            throw error;
          });
      })
  );
});

// ===== BACKGROUND SYNC (Optional - for future enhancements) =====
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-weather-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // This would be for background weather data updates
  // For now, just log that sync happened
  console.log('Service Worker: Background sync completed at', new Date().toISOString());
}

// ===== MESSAGE HANDLING (Optional - for future enhancements) =====
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});