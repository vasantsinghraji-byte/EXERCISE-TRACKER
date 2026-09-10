const CACHE='body-tracker-v3-3.3.0';
const ASSETS=['./','./index.html','./app.js','./demos.js','./habit.js','./habit.css','./interface.js','./interface.css','./companion.js','./companion.css','./focus.js','./ATTENTION.md','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('body-tracker-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url),scope=new URL(self.registration.scope);
  const appEntry=url.origin===scope.origin&&(url.pathname===scope.pathname||url.pathname===scope.pathname+'index.html');
  const cached=e.request.mode==='navigate'&&appEntry?caches.match('./index.html'):caches.match(e.request);
  e.respondWith(cached.then(r=>r||fetch(e.request)));
});
