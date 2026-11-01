// Baut eine einzelne, eigenständige HTML-Datei (sonnensystem-mobil.html).
// Alles steckt in der Datei: Code, Three.js, CSS und die lokalen Texturen.
// Sie läuft ohne Webserver, z. B. direkt vom Handy-Speicher geöffnet.
//
// Aufruf im Projektordner:  npx --yes esbuild@0.24.0 --version  (einmalig)
//                           node tools/build-single.mjs
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'sonnensystem-mobil.html');

let esbuild;
try { esbuild = createRequire(join(process.cwd(), 'x.js'))('esbuild'); }
catch { esbuild = await import('esbuild'); }

const read = f => readFileSync(join(root, f), 'utf8');
const mime = f => f.endsWith('.png') ? 'image/png' : 'image/jpeg';
const dataUri = f => `data:${mime(f)};base64,${readFileSync(join(root, f)).toString('base64')}`;

// 1) Quellen in einen Temp-Ordner kopieren und dort anpassen
const tmp = mkdtempSync(join(tmpdir(), 'ss-single-'));
for (const f of ['app.js', 'data.js', 'data-edu.js', 'data-events.js', 'data-media.js', 'util.js', 'orbits.js']) {
  cpSync(join(root, f), join(tmp, f));
}

// Lokale Texturen als data:-URLs einbetten
let data = readFileSync(join(tmp, 'data.js'), 'utf8');
data = data.replace(/url:'([\w.-]+\.(?:jpg|png))'/g, (m, f) => `url:'${dataUri(f)}'`);
writeFileSync(join(tmp, 'data.js'), data);

let app = readFileSync(join(tmp, 'app.js'), 'utf8');
const patch = (from, to) => {
  if (!app.includes(from)) throw new Error('Patch-Stelle nicht gefunden: ' + from);
  app = app.replace(from, to);
};
// Systemcheck: Three.js ist eingebettet, nichts zu laden
patch('async function checkThreeCdn(){', "async function checkThreeCdn(){ return {ok:true, url:'eingebettet'};");
// Kein Service Worker in der Einzeldatei
patch("navigator.serviceWorker.register('sw.js')", 'Promise.resolve()');
writeFileSync(join(tmp, 'app.js'), app);

// 2) Bündeln (three + Addons aus vendor/)
const vendor = join(root, 'vendor/three');
const result = await esbuild.build({
  entryPoints: [join(tmp, 'app.js')],
  bundle: true, format: 'iife', minify: true, write: false, target: 'es2020',
  legalComments: 'none',
  plugins: [{
    name: 'three-vendor',
    setup(b) {
      b.onResolve({ filter: /^three$/ }, () => ({ path: join(vendor, 'build/three.module.min.js') }));
      b.onResolve({ filter: /^three\/addons\// }, a => ({ path: join(vendor, 'examples/jsm', a.path.slice('three/addons/'.length)) }));
    }
  }]
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

// 3) HTML zusammensetzen
let html = read('index.html');
const cut = (re, to = '') => {
  if (!re.test(html)) throw new Error('HTML-Stelle nicht gefunden: ' + re);
  html = html.replace(re, to);
};
cut(/<script>\s*\(function\(\)\{\s*var path = location\.pathname;[\s\S]*?<\/script>\n/);
cut(/<link rel="stylesheet" href="style\.css">/, () => `<style>\n${read('style.css')}\n</style>`);
cut(/<link rel="manifest"[^>]*>\n/);
cut(/<link rel="icon"[^>]*>/, `<link rel="icon" type="image/png" href="${dataUri('icons/icon-192.png')}">`);
cut(/<link rel="apple-touch-icon"[^>]*>/, `<link rel="apple-touch-icon" href="${dataUri('icons/apple-touch-icon.png')}">`);
cut(/<script type="importmap">[\s\S]*?<\/script>\s*/);
cut(/<script type="module" src="app\.js"><\/script>/, () => `<script>\n${js}\n</script>`);

writeFileSync(OUT, html);
console.log(`Fertig: ${OUT} (${(Buffer.byteLength(html) / 1048576).toFixed(1)} MB)`);
