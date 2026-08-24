// FunLearn PWA Service Worker (Cache First, Network Fallback Strategy)
const CACHE_NAME = "funlearn-pwa-v1";
const STATIC_ASSETS = [
  "/",
  "/teacher",
  "/manifest.json",
  "/favicon.ico",
];

// Install: Pre-cache static app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Pre-caching static app shell assets...");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Some assets failed to pre-cache:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache First, Network Fallback for core assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignore non-GET requests and Supabase API calls
  if (request.method !== "GET" || request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately
        return cachedResponse;
      }

      // Fallback to network and cache dynamic JS/CSS/image chunks
      return fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is HTML navigation, fallback to root /
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
        });
    })
  );
});

// Background Sync Handler
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-funlearn-progress") {
    console.log("[SW] Background sync triggered by browser!");
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "TRIGGER_BACKGROUND_SYNC" });
        });
      })
    );
  }
});
