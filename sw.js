const CACHE = 'portfolio-v8';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './projects.html',
  './services.html',
  './contact.html',
  './404.html',
  './src/app/data/index.js',
  './src/app/styles/globals.css',
  './src/widgets/hud/hud.css',
  './src/widgets/hud/hud.html',
  './src/widgets/hud/hud.js',
  './src/widgets/loader/loader.css',
  './src/widgets/loader/loader.html',
  './src/widgets/loader/loader.js',
  './src/widgets/modal/modal.css',
  './src/widgets/modal/modal.html',
  './src/pages/galaxy/styles/galaxy.css',
  './src/pages/galaxy/model/galaxy.js',
  './src/pages/about/styles/about.css',
  './src/pages/about/model/about.js',
  './src/pages/projects/styles/projects.css',
  './src/pages/projects/model/projects.js',
  './src/pages/services/styles/services.css',
  './src/pages/services/model/services.js',
  './src/pages/contact/styles/contact.css',
  './src/pages/contact/model/contact.js',
  './src/shared/lib/utils.js',
  './src/features/shortcuts/shortcuts.js',
  './src/features/transitions/transitions.js',
  './favicon.svg',
  './manifest.webmanifest',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(function() {
        return caches.match('./404.html');
      })
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
