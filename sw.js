const V="descubre-v2";
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(["./","./index.html"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function nav(r){const c=await caches.open(V);
const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res});
const hit=await c.match(r,{ignoreSearch:true})||await c.match("./index.html")||await c.match("./");
if(!hit)return net;
return Promise.race([net.catch(()=>hit),new Promise(ok=>setTimeout(()=>ok(hit),2500))])}
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
if(r.mode==="navigate"){e.respondWith(nav(r));return}
e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})))});
