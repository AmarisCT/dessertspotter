// Dessert Spotter offline support: keeps the app shell available with a weak or no connection.
const CACHE = "dessert-spotter-v2";
const SHELL = [
  "./", "./index.html", "./app/", "./app/index.html", "./config.js", "./manifest.webmanifest",
  "./favicon.ico", "./assets/mark-128.webp", "./assets/logo-400.png", "./assets/icon-192.png",
  "./assets/icon-512.png", "./assets/apple-touch-icon.png", "./assets/favicon-32.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // fonts, Yelp proxy, maps: straight to the network
  if (req.mode === "navigate") {
    // Pages: try the network first so updates show up, fall back to the saved copy offline.
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match("./app/index.html")))
    );
    return;
  }
  // Files: use the saved copy when there is one, and save new ones as they load.
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
