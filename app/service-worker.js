let cacheName = 'v2';

self.addEventListener('install', function(event) {
	self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(
        [
        '/app/index.html',
        '/app/service-worker.js',
      	'/app/scripts/app.js',
      	'/app/scripts/main.js',
      	'/app/gallery/eagle.jpg',
      	'/app/gallery/bird1.jpg',
      	'/app/gallery/bird2.jpg'

        ]
      );
    }).catch(error => {console.log(error);})
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [cacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Cache hit - return response
            if (response) {
                console.log(`Found ${event.request.url} in cache`);
                return response;
            }
 
            console.log(`Network request for ${event.request.url}`);
 
            return fetch(event.request).then(response => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
 
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
 
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            });
        }).catch(error => {
            console.log(`Fetch error: ${error}`);
        })
    );
});