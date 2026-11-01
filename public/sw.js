// Memory Bible : petit « service worker » pour l'appli installée sur l'écran d'accueil.
// Toujours le réseau d'abord (le jeu reste à jour après chaque mise en ligne) ;
// si le réseau manque, la dernière version gardée sur le téléphone.
const CACHE = "memory-bible-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((rep) => {
        if (rep.ok) {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(req, copie));
        }
        return rep;
      })
      .catch(() =>
        caches.match(req).then((r) => r || (req.mode === "navigate" ? caches.match("/") : undefined) || Response.error())
      )
  );
});
