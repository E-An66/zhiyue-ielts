const BUILD = "20261009-abandon1";
const CACHE_NAME = `zhiyue-ielts-shell-${BUILD}`;
const APP_SHELL = [
  "./cloud/account.css",
  "./cloud/config.js",
  "./cloud/sync-model.js",
  "./cloud/client.js",
  "./vendor/supabase-2.117.3.js",
  "./update-client.js",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./learning.css",
  "./learning-center.js",
  "./expression-center.js",
  "./cloud/catalogue.js",
  "./practice-studio.js",
  "./vendor/fsrs-5.2.3.js",
  "./manifest.webmanifest",
  "./data/zhongkao-vocab.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const scope = self.registration.scope;
const shellPaths = new Set(APP_SHELL.map(path => new URL(path, scope).pathname));
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async path => {
      const canonical = new URL(path, scope);
      const download = new URL(canonical);
      download.searchParams.set("v", BUILD);
      const response = await fetch(download, { cache: "reload" });
      if (!response.ok) throw new Error(`Shell download failed: ${path}`);
      await cache.put(canonical, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("zhiyue-ielts-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("message", event => {
  if (event.data?.type === "GET_BUILD") event.ports[0]?.postMessage({ build: BUILD });
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  const navigation = event.request.mode === "navigate" && [new URL(scope).pathname, new URL("./index.html", scope).pathname].includes(url.pathname);
  if (!navigation && !shellPaths.has(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const canonical = navigation ? new URL("./index.html", scope) : new URL(url.pathname, url.origin);
    return await cache.match(canonical) || fetch(event.request);
  })());
});
