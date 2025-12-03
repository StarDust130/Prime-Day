self.__WB_DISABLE_DEV_LOGS = true;
const WB_MANIFEST = self.__WB_MANIFEST || [];

const CACHE_NAME = "prime-day-static-v1";
const PRECACHE_ROUTES = ["/manifest.json", "/favicon.ico"];
const STATIC_PATTERNS = [/^\/_next\/static\//, /^\/icons\//];
const DEV_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalDev = DEV_HOSTS.has(self.location.hostname);

self.addEventListener("install", (event) => {
  if (isLocalDev) {
    event.waitUntil(self.skipWaiting());
    return;
  }

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ROUTES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  if (isLocalDev) {
    event.waitUntil(self.clients.claim());
    return;
  }

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

if (!isLocalDev) {
  self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") {
      return;
    }

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
      return;
    }

    const matchesStaticRoute =
      STATIC_PATTERNS.some((pattern) => pattern.test(url.pathname)) ||
      PRECACHE_ROUTES.includes(url.pathname);

    if (!matchesStaticRoute) {
      return;
    }

    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cachedResponse || Response.error());
        })
      )
    );
  });
}
