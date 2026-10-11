// Service worker: oyunun dosyalarını telefona kaydeder, böylece internet olmadan da açılır.
const SURUM = "yilan-v1";
const DOSYALAR = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

// Kurulum: dosyaları önbelleğe al
self.addEventListener("install", (olay) => {
  olay.waitUntil(caches.open(SURUM).then((onbellek) => onbellek.addAll(DOSYALAR)));
  self.skipWaiting();
});

// Aktifleşme: eski sürümlerin önbelleğini temizle
self.addEventListener("activate", (olay) => {
  olay.waitUntil(
    caches.keys().then((anahtarlar) =>
      Promise.all(anahtarlar.filter((a) => a !== SURUM).map((a) => caches.delete(a)))
    )
  );
  self.clients.claim();
});

// İstek geldiğinde önce önbelleğe bak, yoksa internetten getir
self.addEventListener("fetch", (olay) => {
  olay.respondWith(
    caches.match(olay.request).then((kayit) => kayit || fetch(olay.request))
  );
});
