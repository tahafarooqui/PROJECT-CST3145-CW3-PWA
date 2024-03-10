var CACHE_NAME = "education-v1";
var urlsToCache = [
    "index.html",
    "/src/assets/global.css",
    "/src/assets/bootstrap.min.css",
    "/src/assets/bootstrap-icons/font/bootstrap-icons.min.css",
    "/src/main.js",
    "/src/assets/bootstrap.bundle.min.js",
    "images/icon-192.png",
    "images/icon-512.png",
    "assets/img/science.png",
    "assets/img/history.png",
    "assets/img/programming.png",
    "assets/img/geography.png",
    "assets/img/chemistry.png",
    "assets/img/computer.png",
    "assets/img/marketing.png",
    "assets/img/psychology.png",
    "assets/img/language.png",
    "assets/img/art.png",
    "assets/img/economics.png",
    "assets/img/music.png",
    "assets/img/environment.png",
    "assets/img/philosophy.png",
    "assets/img/sociology.png",
    "assets/img/business.png",
    "assets/img/health.png",
    "assets/img/astronomy.png",
    "assets/img/literature.png"    
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});
