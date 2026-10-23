// Service Worker: macht die App installierbar und offline nutzbar.
// Bei jeder Veröffentlichung CACHE-Version erhöhen, damit Nutzer die neuen Dateien bekommen.
const CACHE = 'ss3d-v1';
const PRECACHE = [
  "./",
  "2k_jupiter.jpg",
  "2k_mars.jpg",
  "2k_mercury.jpg",
  "2k_neptune.jpg",
  "2k_saturn.jpg",
  "2k_sun.jpg",
  "2k_uranus.jpg",
  "2k_venus_surface.jpg",
  "app.js",
  "data-edu.js",
  "data-events.js",
  "data-media.js",
  "data.js",
  "earth_atmos_2048.jpg",
  "earth_clouds_1024.png",
  "earth_normal_2048.jpg",
  "earth_specular_2048.jpg",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "index.html",
  "manifest.webmanifest",
  "moon_1024.jpg",
  "style.css",
  "vendor/three/LICENSE",
  "vendor/three/build/three.module.min.js",
  "vendor/three/examples/jsm/controls/OrbitControls.js",
  "vendor/three/examples/jsm/postprocessing/EffectComposer.js",
  "vendor/three/examples/jsm/postprocessing/MaskPass.js",
  "vendor/three/examples/jsm/postprocessing/Pass.js",
  "vendor/three/examples/jsm/postprocessing/RenderPass.js",
  "vendor/three/examples/jsm/postprocessing/ShaderPass.js",
  "vendor/three/examples/jsm/postprocessing/UnrealBloomPass.js",
  "vendor/three/examples/jsm/renderers/CSS2DRenderer.js",
  "vendor/three/examples/jsm/shaders/CopyShader.js",
  "vendor/three/examples/jsm/shaders/LuminosityHighPassShader.js"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // YouTube & Co. nie cachen
  if (/youtube|ytimg|googlevideo/.test(url.host)) return;
  const sameOrigin = url.origin === location.origin;
  const isCode = sameOrigin && /\.(html|js|css|webmanifest)$|\/$/.test(url.pathname) && !url.pathname.includes('/vendor/');
  if (isCode) {
    // Code: erst Netz (aktuell), sonst Cache (offline)
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  // Bilder, Texturen, Three.js: erst Cache, sonst Netz und merken (auch Wikimedia-Texturen)
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
