const CACHE = 'portfolio-v24';
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
  './resume.html',
  './src/pages/resume/styles/resume.css',
  './src/pages/resume/model/resume.js',
  './src/shared/lib/ui.js',
  './src/app/styles/experience.css',
  './src/features/accessibility/accessibility.js',
  './assets/fotos/breno.png',
  './assets/projetos/nexusauth.png',
  './assets/projetos/zenith.svg',
  './assets/projetos/arqon/catalogo.png',
  './assets/projetos/arqon/home.png',
  './assets/projetos/arqon/produto.png',
  './assets/projetos/nexly/agenda-demo.webp',
  './assets/projetos/nexly/dashboard-demo.webp',
  './assets/projetos/nexly/estoque-demo.webp',
  './assets/projetos/nexly/pdv-demo.webp',

];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(url => new Request(url, {cache: 'reload'})))).then(() => self.skipWaiting()));
});

self.addEventListener('fetch', event => {
  // Formulários e serviços externos precisam da resposta real da rede.
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request, {ignoreSearch:true})).then(cached => cached || fetch(event.request).catch(async () => {
    if (event.request.mode === 'navigate') {
      const fallback = await caches.match(new URL('404.html', self.registration.scope).href);
      if (fallback) return fallback;
    }
    return Response.error();
  })));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('portfolio-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
