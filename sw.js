/* ═══════════════════════════════════════════
   BATTERY PWA — Service Worker
   Estratégia: Cache-first para assets estáticos
   Network-first para dados dinâmicos
═══════════════════════════════════════════ */

const CACHE_NAME = 'battery-v1.0.0';
const OFFLINE_URL = '/';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

/* ── Install: pré-cachear assets core ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

/* ── Activate: limpar caches antigos ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* ── Fetch: Stale-while-revalidate para HTML/JS/CSS ── */
self.addEventListener('fetch', event => {
  const { request } = event;

  // Só interceptar GET
  if (request.method !== 'GET') return;

  // Fontes externas: cache-first
  if (request.url.includes('fonts.googleapis.com') ||
      request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // App shell: network-first com fallback para cache
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then(cached => {
          if (cached) return cached;
          // Fallback para a home se navegação
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

/* ── Background Sync: streak e progresso ── */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    // Futura sincronização com Firebase
    console.log('[SW] Background sync: progress');
  }
});

/* ── Push Notifications: streak reminder ── */
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'BATTERY ⚡';
  const options = {
    body: data.body || 'Seu streak está em risco! Carregue uma bateria hoje.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    tag: 'streak-reminder',
    renotify: true,
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Carregar agora' },
      { action: 'dismiss', title: 'Depois' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/');
      })
    );
  }
});
