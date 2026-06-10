// Force clear all old caches on install
const CACHE = 'oriem-lab-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network first — never serve stale JS/HTML
self.addEventListener('fetch', e => {
  if (e.request.url.includes('generativelanguage.googleapis.com') ||
      e.request.url.includes('firestore.googleapis.com') ||
      e.request.url.includes('firebase')) return;
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
