navigator.serviceWorker.register('/service-worker.js')
  .then(function(registration) {
    console.log('Service worker registration successful with scope: ', registration.scope);
  }).catch(function(error) {
    console.log('Service worker registration failed: ', error);
  });


self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})