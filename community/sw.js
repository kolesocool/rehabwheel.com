/* Retire prior public Community offline preview and its cached shell.
   Old preview assets may still remain in a user's personal browser history. */
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(
  Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('rw-community-shell-')).map(k=>caches.delete(k)))),
    self.clients.claim()
  ]).then(()=>self.registration.unregister())
));
// No fetch handler: all future Community pages and assets must be requested online.
