/* Rehabwheel Community — privacy-preserving offline shell
   Caches public app code and brand assets only. Activities remain in local browser storage.
   No authentication, telemetry, API responses, or personal data are intercepted or stored.
*/
const CACHE_NAME="rw-community-shell-v1";
const PREFIX="rw-community-shell-";
const SHELL=["/community/","/community/editorial.css","/community/manifest.webmanifest","/rehabwheel_logo.jpg"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname==="/community/"||url.pathname==="/community/index.html"){
    event.respondWith(fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put("/community/",copy)));}
      return response;
    }).catch(()=>caches.match("/community/")));
    return;
  }
  if(url.pathname==="/community/editorial.css"||url.pathname==="/community/manifest.webmanifest"||url.pathname==="/rehabwheel_logo.jpg"||url.pathname.startsWith("/assets/photos/")){
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)));}
      return response;
    })));
  }
});
