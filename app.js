import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { TEXTURES, ALL_TEXTURES, COMETS, POI_DATA, INFO_DATA, MOON_DATA, PLANETS, MEDIA_DATA, EVENTS, EVENT_TYPES, getEventsSorted, ORBITAL_ELEMENTS, SPIN_HOURS } from './data.js';

// ===== LOG SYSTEM =====
const logs = [];
function addLog(msg, type='info') {
  const t = new Date().toLocaleTimeString('de-DE');
  logs.push({ time: t, message: msg, type });
  const la = document.getElementById('log-area');
  if (la) {
    const l = document.createElement('div');
    l.className = 'log-line ' + type;
    l.innerHTML = `<span class="time">[${t}]</span> ${msg}`;
    la.appendChild(l);
    la.scrollTop = la.scrollHeight;
    document.getElementById('log-count').textContent = logs.length + ' Zeilen';
  }
}
function clearLog(){logs.length=0;const la=document.getElementById('log-area');if(la)la.innerHTML='';document.getElementById('log-count').textContent='0 Zeilen';}
function exportLogTxt(){const h=`Sonnensystem - Systemcheck\n${new Date().toLocaleString('de-DE')}\n${location.href}\n\n`;const c=logs.map(l=>`[${l.time}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');dlFile(h+c,`systemcheck-${ts()}.txt`,'text/plain');}
function exportLogJson(){const d={timestamp:new Date().toISOString(),url:location.href,userAgent:navigator.userAgent,log:logs};dlFile(JSON.stringify(d,null,2),`systemcheck-${ts()}.json`,'application/json');}
function dlFile(c,f,m){const b=new Blob([c],{type:m});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=f;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),2000);}
function ts(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}-${String(d.getMinutes()).padStart(2,'0')}`;}

// ===== GLOBAL CONSTANTS (must be defined before first use) =====
const NOTES_KEY = 'ss3d_notes';
let simDate = new Date();

// ===== SYSTEMCHECK =====
let textureStatus = {};
let systemHealth = {webgl:null,three:null,storage:null,fps:null,fallbackUsed:0};
let funcResults = [];

function funcOk(name, ok, info, group='Funktion'){
  funcResults.push({name, ok:!!ok, info:info||'', group});
  addLog(`${ok?'✓':'✗'} ${name}: ${info|| (ok?'OK':'Fehler')}`, ok?'ok':'error');
}

async function runSystemCheck() {
  clearLog();
  funcResults = [];
  textureStatus = {};
  addLog('Systemcheck gestartet – Umgebung, Funktionen, Texturen', 'info');
  const cl = document.getElementById('check-list');
  if(cl) cl.innerHTML = '';
  const fl = document.getElementById('func-list');
  if(fl) fl.innerHTML = '';

  addLog('— Umgebung —', 'info');
  systemHealth.webgl = checkWebGL();
  funcOk('WebGL', systemHealth.webgl.ok, systemHealth.webgl.info, 'Umgebung');
  systemHealth.three = await checkThreeCdn();
  funcOk('Three.js (lokal)', systemHealth.three.ok, systemHealth.three.ok?'geladen':'fehlt', 'Umgebung');
  systemHealth.storage = checkLocalStorage();
  funcOk('LocalStorage', systemHealth.storage.ok, systemHealth.storage.info||'', 'Umgebung');
  addLog('FPS-Stichprobe…', 'info');
  systemHealth.fps = await sampleFps(800);
  funcOk('FPS', systemHealth.fps >= 15, `≈ ${systemHealth.fps} FPS`, 'Umgebung');

  addLog('— Szene & Objekte —', 'info');
  try {
    funcOk('Scene', !!(typeof scene!=='undefined' && scene), scene?`Kinder: ${scene.children.length}`:'fehlt', 'Szene');
    funcOk('Kamera', !!(typeof camera!=='undefined' && camera), camera?`FOV ${camera.fov}`:'fehlt', 'Szene');
    funcOk('Renderer', !!(typeof renderer!=='undefined' && renderer), renderer?'WebGLRenderer':'fehlt', 'Szene');
    funcOk('Composer / Bloom', !!(typeof composer!=='undefined' && composer), 'Postprocessing', 'Szene');
    funcOk('OrbitControls', !!(typeof controls!=='undefined' && controls), 'Maus/Touch', 'Szene');
    funcOk('CSS2D Labels', !!(typeof labelRenderer!=='undefined' && labelRenderer), 'Beschriftungen', 'Szene');
    funcOk('Sonnenlicht', !!(typeof sunLight!=='undefined' && sunLight), sunLight?`I=${sunLight.intensity}`:'fehlt', 'Szene');
    funcOk('Sonne (Mesh)', !!(typeof sunMesh!=='undefined' && sunMesh), 'Shader + Corona', 'Szene');
    funcOk('Planeten', PLANETS.length>0 && PLANETS.every(p=>p._mesh), `${PLANETS.length} Körper`, 'Szene');
    const moonDataCount = Object.values(MOON_DATA).reduce((n,a)=>n+(a?a.length:0),0);
    const moonLoaded = PLANETS.reduce((n,p)=>n+(p._moonsLoaded?p._moons.length:0),0);
    funcOk('Monde (Lazy-Load)', moonDataCount>0, `${moonDataCount} in Daten · ${moonLoaded} geladen`, 'Szene');
    funcOk('ensureMoons()', typeof ensureMoons==='function', 'Lazy-Load aktiv', 'Szene');
    funcOk('Kometen', typeof cometObjects!=='undefined' && cometObjects.length>0, `${cometObjects?cometObjects.length:0} Kometen`, 'Szene');
    funcOk('Satelliten', typeof issMesh!=='undefined' && !!issMesh && typeof hubbleMesh!=='undefined' && !!hubbleMesh, 'ISS + Hubble', 'Szene');
    funcOk('Asteroidengürtel', typeof asteroidInstanced!=='undefined' && !!asteroidInstanced, 'InstancedMesh', 'Szene');
    funcOk('Kuipergürtel', typeof kuiperInstanced!=='undefined' && !!kuiperInstanced, 'InstancedMesh', 'Szene');
    funcOk('Klickbare Objekte', typeof clickableObjects!=='undefined' && clickableObjects.length>0, `${clickableObjects?clickableObjects.length:0} Meshes`, 'Szene');
  } catch(e){ funcOk('Szene-Block', false, String(e.message||e), 'Szene'); }

  addLog('— Daten —', 'info');
  try {
    funcOk('PLANETS', Array.isArray(PLANETS)&&PLANETS.length>=8, `${PLANETS.length} Einträge`, 'Daten');
    funcOk('MOON_DATA', !!MOON_DATA && Object.keys(MOON_DATA).length>0, `${Object.keys(MOON_DATA).length} Systeme`, 'Daten');
    funcOk('COMETS', Array.isArray(COMETS)&&COMETS.length>0, `${COMETS.length} Kometen`, 'Daten');
    funcOk('INFO_DATA', !!INFO_DATA && Object.keys(INFO_DATA).length>0, `${Object.keys(INFO_DATA).length} Infos`, 'Daten');
    funcOk('POI_DATA', !!POI_DATA && Object.keys(POI_DATA).length>0, `${Object.keys(POI_DATA).length} Körper mit POIs`, 'Daten');
    funcOk('TEXTURES / ALL_TEXTURES', Array.isArray(ALL_TEXTURES)&&ALL_TEXTURES.length>0, `${ALL_TEXTURES.length} URLs`, 'Daten');
    const hasPluto = PLANETS.some(p=>p.name==='Pluto');
    funcOk('Pluto', hasPluto, hasPluto?'in PLANETS':'fehlt', 'Daten');
  } catch(e){ funcOk('Daten-Block', false, String(e.message||e), 'Daten'); }

  addLog('— UI —', 'info');
  const uiIds = [
    ['sidebar','Seitenleiste'],['sb-panels','Panel-Inhalt'],['planet-list','Schnellnavigation'],
    ['search-input','Suche'],['btn-pause','Pause'],['btn-syscheck','Systemcheck-Button'],
    ['focus-panel','Fokus-Panel'],['info-panel','Info-Panel'],
    ['sim-clock','Simulations-Uhr'],['btn-clock-play','Play/Pause-Uhr'],
    ['clock-picker','Zeit-Einstellung'],['float-host','Fenster-Host'],
    ['ui-reveal','UI-Einblenden'],['btn-photo','Foto'],['btn-hide-ui','UI aus'],
    ['btn-ui-mode','Menü-Modus'],['btn-theme','Theme'],
    ['route-from','Route Start'],['route-to','Route Ziel'],['btn-calc-route','Route berechnen'],
    ['notes-list','Notizen-Liste'],['btn-add-note','Notiz erstellen'],
    ['sun-intensity','Licht: Sonne'],['speed-slider','Sim-Geschwindigkeit'],
    ['fps-display','FPS-Anzeige']
  ];
  uiIds.forEach(([id,label])=>{
    const el=document.getElementById(id);
    funcOk(label, !!el, el?'DOM OK':`#${id} fehlt`, 'UI');
  });

  addLog('— Funktionstests —', 'info');

  try {
    const before = sunLight.intensity;
    const s = collectLightSettings();
    funcOk('Licht-Export (collect)', s && typeof s.sunIntensity==='number', `sunIntensity=${s.sunIntensity}`, 'Funktion');
    applyLightSettings({sunIntensity: before});
    sunLight.intensity = before;
    funcOk('Licht-Anwenden', Math.abs(sunLight.intensity-before)<0.01, 'zurückgesetzt', 'Funktion');
  } catch(e){ funcOk('Licht-System', false, String(e.message||e), 'Funktion'); }

  try {
    fillRouteSelects();
    const rf=document.getElementById('route-from');
    const rt=document.getElementById('route-to');
    const nFrom=rf?rf.options.length:0;
    const nTo=rt?rt.options.length:0;
    funcOk('Route-Auswahllisten', nFrom>10 && nTo>10, `${nFrom} / ${nTo} Optionen`, 'Funktion');
    if(rf && rt){
      rf.value='Erde'; rt.value='Mars';
      const pa=getBodyWorldPos('Erde');
      const pb=getBodyWorldPos('Mars');
      funcOk('Route-Positionen', !!(pa&&pb), pa&&pb?`Distanz≈${pa.distanceTo(pb).toFixed(2)}`:'Position fehlt', 'Funktion');
      drawRoute('Erde','Mars');
      funcOk('Route zeichnen', !!(typeof routeLine!=='undefined' && routeLine), 'Kurve in Szene', 'Funktion');
      clearRouteVisual();
      funcOk('Route löschen', !routeLine, 'entfernt', 'Funktion');
    }
  } catch(e){ funcOk('Route-System', false, String(e.message||e), 'Funktion'); }

  try {
    const prev=localStorage.getItem(NOTES_KEY);
    const testNote={id:'__syscheck__',title:'Syscheck',text:'test',ts:Date.now(),cam:{x:0,y:10,z:20},target:{x:0,y:0,z:0}};
    const arr=JSON.parse(localStorage.getItem(NOTES_KEY)||'[]');
    arr.push(testNote);
    localStorage.setItem(NOTES_KEY, JSON.stringify(arr));
    const back=JSON.parse(localStorage.getItem(NOTES_KEY)||'[]');
    const found=back.some(n=>n.id==='__syscheck__');
    localStorage.setItem(NOTES_KEY, prev||'[]');
    notes=JSON.parse(localStorage.getItem(NOTES_KEY)||'[]');
    if(typeof renderNotes==='function') renderNotes();
    funcOk('Notizen speichern/laden', found, 'LocalStorage Roundtrip', 'Funktion');
  } catch(e){ funcOk('Notizen-System', false, String(e.message||e), 'Funktion'); }

  try {
    const earth=PLANETS.find(p=>p.name==='Erde');
    funcOk('Fokus vorbereitet', !!(earth&&earth._mesh&&typeof enterFocusMode==='function'), 'enterFocusMode', 'Funktion');
    funcOk('Kameraflug', typeof camFlight!=='undefined' || typeof updateCamFlight==='function', 'updateCamFlight', 'Funktion');
  } catch(e){ funcOk('Fokus-System', false, String(e.message||e), 'Funktion'); }

  try {
    funcOk('Suchindex', typeof searchIndex!=='undefined' && searchIndex.length>0, `${searchIndex?searchIndex.length:0} Einträge`, 'Funktion');
  } catch(e){ funcOk('Suche', false, String(e.message||e), 'Funktion'); }

  try {
    updateClockDisplay();
    const d=document.getElementById('clock-date');
    const t=document.getElementById('clock-time');
    funcOk('Simulations-Uhr', d&&t&&d.textContent!=='—'&&t.textContent!=='—', `${d?d.textContent:''} ${t?t.textContent:''}`, 'Funktion');
    funcOk('Zeitsteuerung', typeof setPaused==='function' && typeof SPEED_PRESETS!=='undefined', `${SPEED_PRESETS.length} Stufen`, 'Funktion');
  } catch(e){ funcOk('Uhr/Zeit', false, String(e.message||e), 'Funktion'); }

  try {
    funcOk('Theme-Umschalter', typeof setTheme==='function', 'setTheme', 'Funktion');
    funcOk('Fenster-Modus', typeof setFloatMode==='function', 'setFloatMode', 'Funktion');
    funcOk('Foto-Button', !!document.getElementById('btn-photo'), 'Screenshot ohne UI', 'Funktion');
  } catch(e){ funcOk('UI-Modi', false, String(e.message||e), 'Funktion'); }

  try {
    const all=typeof collectAllSettings==='function'?collectAllSettings():null;
    funcOk('Einstellungen exportieren', !!(all&&all.light&&all.ui), all?`v${all.version}`:'fehlt', 'Funktion');
  } catch(e){ funcOk('Settings-Export', false, String(e.message||e), 'Funktion'); }

  try {
    const toggles=document.querySelectorAll('.toggle-row[data-target]');
    funcOk('Ansicht-Toggles', toggles.length>=5, `${toggles.length} Schalter`, 'Funktion');
  } catch(e){ funcOk('Toggles', false, String(e.message||e), 'Funktion'); }

  addLog(`— Texturen (${ALL_TEXTURES.length}) —`, 'info');
  const texResults = await Promise.all(ALL_TEXTURES.map(t => checkTex(t)));
  let texOk=0, texMiss=0, texOptMiss=0;
  texResults.forEach(r => {
    if (r.status==='ok') texOk++;
    else { texMiss++; if(!r.tex.required) texOptMiss++; }
  });
  funcOk('Texturen gesamt', texMiss===0 || texOk>0, `${texOk} OK, ${texMiss} fehlend`, 'Texturen');
  const fb = countTextureFallbacks();
  systemHealth.fallbackUsed = fb.procedural + fb.failed;
  funcOk('Texturen geladen (Runtime)', fb.loaded>=0, `${fb.loaded} geladen · ${fb.failed} fehlgeschlagen · ${fb.pending} ausstehend`, 'Texturen');
  funcOk('Fallback-Texturen', true, `${fb.procedural} Körper mit prozeduralem Fallback`, 'Texturen');

  const allTests = funcResults;
  const nOk = allTests.filter(t=>t.ok).length;
  const nFail = allTests.filter(t=>!t.ok).length;
  const nTotal = allTests.length;

  document.getElementById('stat-total').textContent = nTotal;
  document.getElementById('stat-ok').textContent = nOk;
  document.getElementById('stat-missing').textContent = nFail;
  document.getElementById('stat-optional').textContent = texOptMiss;

  setHealthCard('health-webgl', systemHealth.webgl.ok, systemHealth.webgl.ok ? 'OK' : 'Fehler');
  setHealthCard('health-three', systemHealth.three.ok, systemHealth.three.ok ? 'OK' : 'Offline');
  setHealthCard('health-storage', systemHealth.storage.ok, systemHealth.storage.ok ? 'OK' : 'Gesperrt');
  setHealthCard('health-fps', systemHealth.fps >= 20, String(systemHealth.fps));

  const ib = document.getElementById('syscheck-icon');
  const t = document.getElementById('syscheck-title');
  const st = document.getElementById('syscheck-subtitle');
  if (nFail === 0) {
    ib.className = 'icon-box ok';
    ib.innerHTML = '<svg class="ico xl"><use href="#i-check"/></svg>';
    t.textContent = 'Alles OK';
    st.textContent = `${nOk}/${nTotal} Tests bestanden · ~${systemHealth.fps} FPS`;
  } else {
    ib.className = 'icon-box warn';
    ib.innerHTML = '<svg class="ico xl"><use href="#i-warn"/></svg>';
    t.textContent = nFail===1?'1 Problem':`${nFail} Probleme`;
    st.textContent = `${nOk}/${nTotal} OK · bitte Log prüfen`;
  }
  const btn = document.getElementById('btn-syscheck');
  const b = document.getElementById('syscheck-badge');
  btn.classList.remove('ok','warn');
  if (nFail === 0) { btn.classList.add('ok'); b.textContent = 'OK'; }
  else { btn.classList.add('warn'); b.textContent = nFail + ' !'; }

  document.getElementById('check-count').textContent = texResults.length + ' Texturen';
  const fc = document.getElementById('func-count');
  if(fc) fc.textContent = nTotal + ' Tests';

  renderHealthList();
  renderFuncList();
  renderCheckList();
  addLog(`Systemcheck fertig: ${nOk}/${nTotal} OK`, nFail? 'error':'ok');
}

function setHealthCard(id, ok, text){
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = text;
  el.parentElement.classList.toggle('ok-card', !!ok);
  el.parentElement.classList.toggle('missing-card', !ok);
}

function checkWebGL(){
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
    if(!gl) return {ok:false, info:'kein Kontext'};
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'unbekannt';
    const ver = gl.getParameter(gl.VERSION) || '';
    return {ok:true, info:`${ver.split(' ')[0]} · ${renderer}`};
  } catch(e){ return {ok:false, info:String(e.message||e)}; }
}

async function checkThreeCdn(){
  try {
    const urls = [ resolveAsset('vendor/three/build/three.module.min.js') ];
    for(const u of urls){
      try {
        const r = await fetch(u, {method:'HEAD', mode:'cors'});
        if(r.ok) return {ok:true, url:u};
        const r2 = await fetch(u, {mode:'cors', method:'GET', headers:{'Range':'bytes=0-64'}});
        if(r2.ok || r2.status===206) return {ok:true, url:u};
      } catch(_){}
    }
    if(typeof THREE !== 'undefined') return {ok:true, url:'in-page'};
    return {ok:false};
  } catch(e){ return {ok:false}; }
}

function checkLocalStorage(){
  try {
    const k='__ss3d_test__';
    localStorage.setItem(k,'1');
    localStorage.removeItem(k);
    return {ok:true, info:'rw'};
  } catch(e){ return {ok:false, info:String(e.message||e)}; }
}

function sampleFps(ms){
  return new Promise(resolve=>{
    let frames=0;
    const t0=performance.now();
    function tick(t){
      frames++;
      if(t-t0>=ms){ resolve(Math.round(frames*1000/(t-t0))); return; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function renderHealthList(){
  const le = document.getElementById('health-list');
  if(!le) return;
  const rows = [
    ['WebGL', systemHealth.webgl?.ok, systemHealth.webgl?.info||'—'],
    ['Three.js (lokal)', systemHealth.three?.ok, systemHealth.three?.ok?'geladen':'fehlt'],
    ['LocalStorage', systemHealth.storage?.ok, systemHealth.storage?.info||'—'],
    ['FPS', systemHealth.fps>=15, `≈ ${systemHealth.fps||'—'} FPS`],
  ];
  le.innerHTML = rows.map(([n,ok,info])=>{
    const cls = ok ? 'ok' : 'missing';
    const icon = ok ? '#i-check' : '#i-warn';
    return `<div class="check-item ${cls}"><div class="check-icon"><svg class="ico" style="width:12px;height:12px"><use href="${icon}"/></svg></div><div class="check-name">${n}</div><div class="check-desc">${info}</div><div class="check-status">${ok?'OK':'!'}</div></div>`;
  }).join('');
}

function renderFuncList(){
  const le = document.getElementById('func-list');
  if(!le) return;
  const groups = {};
  funcResults.forEach(r=>{
    if(!groups[r.group]) groups[r.group]=[];
    groups[r.group].push(r);
  });
  let html = '';
  Object.keys(groups).forEach(g=>{
    html += `<div class="check-section-title" style="margin:8px 0 4px;opacity:0.7;font-size:10px">${g}</div>`;
    groups[g].forEach(r=>{
      const cls = r.ok ? 'ok' : 'missing';
      const icon = r.ok ? '#i-check' : '#i-warn';
      html += `<div class="check-item ${cls}"><div class="check-icon"><svg class="ico" style="width:12px;height:12px"><use href="${icon}"/></svg></div><div class="check-name">${r.name}</div><div class="check-desc">${r.info||''}</div><div class="check-status">${r.ok?'OK':'!'}</div></div>`;
    });
  });
  le.innerHTML = html;
}

async function checkTex(tex) {
  try {
    const r = await fetch(tex.url, { method:'HEAD', mode:'cors' });
    if (r.ok) { textureStatus[tex.name] = 'ok'; return { tex, status:'ok' }; }
    textureStatus[tex.name] = 'missing'; return { tex, status:'missing' };
  } catch (e) {
    try {
      const r2 = await fetch(tex.url, { mode:'cors' });
      if (r2.ok) { textureStatus[tex.name] = 'ok'; return { tex, status:'ok' }; }
    } catch (e2) {}
    textureStatus[tex.name] = 'missing';
    return { tex, status:'missing' };
  }
}
function renderCheckList() {
  const le = document.getElementById('check-list');
  if(!le) return;
  le.innerHTML = '';
  ALL_TEXTURES.forEach(tex => {
    const s = textureStatus[tex.name] || 'pending';
    const item = document.createElement('div');
    item.className = 'check-item ' + (s==='ok' ? 'ok' : s==='missing' ? 'missing' : 'optional');
    let ih = s==='ok'
      ? '<svg class="ico" style="width:12px;height:12px"><use href="#i-check"/></svg>'
      : s==='missing'
        ? '<svg class="ico" style="width:12px;height:12px"><use href="#i-warn"/></svg>'
        : '·';
    const sT = s==='ok' ? 'OK' : s==='missing' ? 'Fehlt' : '-';
    item.innerHTML = `<div class="check-icon">${ih}</div><div class="check-name">${tex.name}</div><div class="check-desc">${tex.category}</div><div class="check-status">${sT}</div>`;
    le.appendChild(item);
  });
}

// ===== SCENE =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.05, 8000);
camera.position.set(0, 30, 55);
// Qualitätsstufe: Handys/Tablets und schwache Geräte bekommen weniger Pixel und günstigere Effekte
const IS_LOW_END = matchMedia('(pointer: coarse)').matches
  || (navigator.hardwareConcurrency||8) <= 4
  || Math.min(screen.width, screen.height) < 600;
const MAX_PIXEL_RATIO = IS_LOW_END ? 1.5 : 2;
let currentPixelRatio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO);
// antialias bringt mit EffectComposer nichts (gerendert wird in Render-Targets) und kostet nur Speicher
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(currentPixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.domElement.style.touchAction = 'none';
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.05;
controls.maxDistance = 1400;
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

// Desktop: MSAA im Render-Target statt Canvas-Antialiasing
const composerTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
  type: THREE.HalfFloatType, samples: IS_LOW_END ? 0 : 4
});
const composer = new EffectComposer(renderer, composerTarget);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.22, 0.4, 0.92);
if(IS_LOW_END){
  // Bloom in halber Auflösung – optisch kaum Unterschied, spart viel GPU-Zeit
  const origBloomSetSize = bloomPass.setSize.bind(bloomPass);
  bloomPass.setSize = (w,h) => origBloomSetSize(Math.max(1,Math.round(w*0.5)), Math.max(1,Math.round(h*0.5)));
}
composer.addPass(bloomPass);
composer.setSize(innerWidth, innerHeight); // Render-Targets auf CSS-Größe × Pixelratio bringen

// ===== LIGHT =====
const sunLight = new THREE.PointLight(0xfff0d0, 5.2, 0, 0);
sunLight.position.set(0,0,0); scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0x1a2230, 0.1); scene.add(ambientLight);
const hemiLight = new THREE.HemisphereLight(0x334455, 0x020208, 0.12);
hemiLight.position.set(0,50,0); scene.add(hemiLight);

// ===== MILKY WAY =====
const milkyWayMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, transparent: true,
  uniforms: { uBright: { value: 1.0 } },
  defines: { OCT: IS_LOW_END ? 4 : 6 },
  vertexShader: `varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform float uBright;
    varying vec3 vDir;
    float hash(vec3 p){p=fract(p*vec3(443.897,441.423,437.195));p+=dot(p,p.yzx+19.19);return fract((p.x+p.y)*p.z);}
    float noise3(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);float n000=hash(i);float n100=hash(i+vec3(1.,0.,0.));float n010=hash(i+vec3(0.,1.,0.));float n110=hash(i+vec3(1.,1.,0.));float n001=hash(i+vec3(0.,0.,1.));float n101=hash(i+vec3(1.,0.,1.));float n011=hash(i+vec3(0.,1.,1.));float n111=hash(i+vec3(1.,1.,1.));return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y),f.z);}
    float fbm(vec3 p){float v=0.;float a=.5;for(int i=0;i<OCT;i++){v+=a*noise3(p);p*=2.;a*=.5;}return v;}
    void main(){
      vec3 dir=normalize(vDir);
      float cx=cos(.55),sx=sin(.55);float cy=cos(1.15),sy=sin(1.15);
      vec3 d=dir;d=vec3(d.x,d.y*cx-d.z*sx,d.y*sx+d.z*cx);d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);
      float bd=abs(d.y);bd+=sin(d.x*1.5)*.04+sin(d.z*2.2)*.025;
      float band=exp(-bd*bd*18.);band*=.18+fbm(d*2.5)*.18;
      float cb=exp(-length(d.xz)*.9)*band;
      float neb=fbm(d*4.);neb=pow(max(neb-.5,0.),2.0);
      vec3 cc=vec3(.22,.20,.18);vec3 dc=vec3(.04,.035,.06);vec3 oc=vec3(.004,.005,.012);
      vec3 col=mix(oc,dc,band);col=mix(col,cc,cb*.3);
      float dust=fbm(d*6.5+50.);dust=smoothstep(.38,.58,dust);col*=mix(1.,.2,dust*band);
      col+=neb*band*vec3(.03,.015,.05);
      col+=vec3(.001,.0015,.004);
      col*=uBright;
      gl_FragColor=vec4(col,1.);
    }`
});
const milkyWaySphere = new THREE.Mesh(new THREE.SphereGeometry(2500, 64, 32), milkyWayMat);
scene.add(milkyWaySphere);

// ===== STARS =====
{
  const g = new THREE.BufferGeometry();
  const n = 6000;
  const p = new Float32Array(n*3);
  const col = new Float32Array(n*3);
  for (let i = 0; i < n*3; i += 3) {
    const r = 1500 + Math.random()*800; // außerhalb des Kuipergürtels, innerhalb der Milchstraßen-Kugel
    const t = Math.random()*Math.PI*2;
    const ph = Math.acos(2*Math.random()-1);
    p[i] = Math.sin(ph)*Math.cos(t)*r;
    p[i+1] = Math.sin(ph)*Math.sin(t)*r;
    p[i+2] = Math.cos(ph)*r;
    const c = 0.7+Math.random()*0.3;
    col[i]=c*0.95; col[i+1]=c*0.95; col[i+2]=c;
  }
  g.setAttribute('position', new THREE.BufferAttribute(p,3));
  g.setAttribute('color', new THREE.BufferAttribute(col,3));
  const starMat=new THREE.PointsMaterial({ size:2.6, vertexColors:true, transparent:true, opacity:0.55, sizeAttenuation:true });
  starMat.userData.baseOpacity=0.55;starMat.userData.baseSize=2.6;
  const starPoints=new THREE.Points(g, starMat);
  scene.add(starPoints);
  window.__starMat=starMat;
}

// ===== TEXTUREN =====
function makeProcTex(opts){
  const {baseColor=0xaaaaaa,spotColors=[],spotCount=40,spotMaxSize=20,lineColor=null,lineCount=0,noiseAmount=.15,bands=null}=opts;
  const c=document.createElement('canvas');c.width=512;c.height=256;
  const x=c.getContext('2d');
  x.fillStyle='#'+baseColor.toString(16).padStart(6,'0');x.fillRect(0,0,512,256);
  if(bands){for(let y=0;y<256;y++){const bp=Math.sin(y*.15)*.5+.5;const bc=bands[Math.floor(bp*bands.length)]||bands[0];x.fillStyle='#'+bc.toString(16).padStart(6,'0');x.globalAlpha=.3;x.fillRect(0,y,512,1);}x.globalAlpha=1;}
  if(lineColor&&lineCount>0){x.strokeStyle='#'+lineColor.toString(16).padStart(6,'0');for(let i=0;i<lineCount;i++){x.lineWidth=.5+Math.random()*2;x.beginPath();const sY=Math.random()*256;x.moveTo(0,sY);for(let j=0;j<10;j++)x.lineTo(j*51,sY+(Math.random()-.5)*40);x.stroke();}}
  for(let i=0;i<spotCount;i++){const px=Math.random()*512,py=Math.random()*256;const r=2+Math.random()*spotMaxSize;const color=spotColors.length>0?spotColors[Math.floor(Math.random()*spotColors.length)]:0xffffff;const a=Math.random()*noiseAmount+.1;x.fillStyle='rgba('+((color>>16)&0xff)+','+((color>>8)&0xff)+','+(color&0xff)+','+a+')';x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill();}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function getPlanetFallback(name){
  switch(name){
    case'Merkur':return makeProcTex({baseColor:0x8a7a6a,spotColors:[0x5a4a3a,0xa89888],spotCount:100,spotMaxSize:12,noiseAmount:.4});
    case'Venus':return makeProcTex({baseColor:0xe8c688,spotColors:[0xd8a868,0xf0d8a8],spotCount:60,spotMaxSize:30,noiseAmount:.2});
    case'Erde':return makeProcTex({baseColor:0x2a6fdb,spotColors:[0x3a8f3a,0xc8b878,0xffffff],spotCount:80,spotMaxSize:25,noiseAmount:.5});
    case'Mars':return makeProcTex({baseColor:0xc1440e,spotColors:[0x8a2a08,0xe88a5a,0xffffff],spotCount:80,spotMaxSize:20,noiseAmount:.4});
    case'Jupiter':return makeProcTex({baseColor:0xd8b890,spotColors:[0xa88060,0xf0e0c0],spotCount:40,spotMaxSize:30,noiseAmount:.25,bands:[0xd8b890,0xe8c8a0,0xc8a878,0xf0dcc0]});
    case'Saturn':return makeProcTex({baseColor:0xe8d6a0,spotColors:[0xd0b880],spotCount:30,spotMaxSize:40,noiseAmount:.15,bands:[0xe8d6a0,0xf0e0b8,0xd8c090,0xe8d4a0]});
    case'Uranus':return makeProcTex({baseColor:0x8ee0e5,spotColors:[0x70c8d0],spotCount:20,spotMaxSize:40,noiseAmount:.1});
    case'Neptun':return makeProcTex({baseColor:0x2e5fe8,spotColors:[0x1a4ac8,0x5080f8],spotCount:30,spotMaxSize:30,noiseAmount:.2});
    case'Ceres':return makeProcTex({baseColor:0x8a7a6a,spotColors:[0x5a4a3a],spotCount:100,spotMaxSize:12,noiseAmount:.5});
    case'Pluto':return makeProcTex({baseColor:0xc8b8a8,spotColors:[0x8a7a6a,0xe8d8c8],spotCount:60,spotMaxSize:20,noiseAmount:.4});
    case'Eris':return makeProcTex({baseColor:0xd8d0c8,spotColors:[0xa8a098,0xf0e8e0],spotCount:40,spotMaxSize:16,noiseAmount:.3});
    case'Haumea':return makeProcTex({baseColor:0xe8dcc8,spotColors:[0xc8b8a0,0xf5edd8],spotCount:30,spotMaxSize:18,noiseAmount:.25});
    case'Makemake':return makeProcTex({baseColor:0xc4a070,spotColors:[0x8a6a40,0xe0c090],spotCount:35,spotMaxSize:14,noiseAmount:.35});
    default:return makeProcTex({baseColor:0xaaaaaa});
  }
}
function getMoonTex(name){
  switch(name){
    case'Io':return makeProcTex({baseColor:0xe8d24a,spotColors:[0xd83a1a,0xff8a3a],spotCount:60,spotMaxSize:25,noiseAmount:.4});
    case'Europa':return makeProcTex({baseColor:0xe8e4d8,spotColors:[0xc8a880],spotCount:20,spotMaxSize:8,lineColor:0xa86848,lineCount:40});
    case'Ganymed':return makeProcTex({baseColor:0x9a8a78,spotColors:[0x6a5a4a,0xb0a090],spotCount:70,spotMaxSize:30});
    case'Kallisto':return makeProcTex({baseColor:0x5a4a3a,spotColors:[0xd8d0c0],spotCount:120,spotMaxSize:15,noiseAmount:.5});
    case'Titan':return makeProcTex({baseColor:0xd89040,spotColors:[0xe8a860],spotCount:30,spotMaxSize:40});
    case'Enceladus':return makeProcTex({baseColor:0xf0f4f8,spotColors:[0xd0d8e0],spotCount:15,spotMaxSize:15});
    case'Triton':return makeProcTex({baseColor:0xd8c8c0,spotColors:[0xe8b0a0],spotCount:40,spotMaxSize:20});
    case'Phobos':case'Deimos':return makeProcTex({baseColor:0x6a5a4a,spotColors:[0x4a3a2a],spotCount:80,spotMaxSize:12,noiseAmount:.5});
    case'Mimas':return makeProcTex({baseColor:0xc8c8c8,spotColors:[0x8a8a8a],spotCount:30,spotMaxSize:20});
    case'Tethys':case'Dione':case'Rhea':return makeProcTex({baseColor:0xd0d0c8,spotColors:[0xb0b0a8],spotCount:40,spotMaxSize:18});
    case'Hyperion':return makeProcTex({baseColor:0xa89888,spotColors:[0x6a5a4a],spotCount:90,spotMaxSize:20,noiseAmount:.5});
    case'Iapetus':return makeProcTex({baseColor:0x8a7a6a,spotColors:[0x3a2a1a],spotCount:50,spotMaxSize:25});
    case'Phoebe':return makeProcTex({baseColor:0x5a4a3a,spotColors:[0x3a2a1a],spotCount:60,spotMaxSize:12});
    case'Miranda':case'Ariel':case'Umbriel':case'Titania':case'Oberon':return makeProcTex({baseColor:0xb0b0b0,spotColors:[0x808080],spotCount:40,spotMaxSize:20});
    case'Nereid':case'Proteus':return makeProcTex({baseColor:0x8a8a9a,spotColors:[0x5a5a6a],spotCount:40,spotMaxSize:15});
    case'Amalthea':return makeProcTex({baseColor:0xb85a3a,spotColors:[0x8a3a1a],spotCount:50,spotMaxSize:12});
    case'Charon':return makeProcTex({baseColor:0x9a9a9a,spotColors:[0x6a6a6a],spotCount:40,spotMaxSize:20});
    case'Mond':return makeProcTex({baseColor:0xb0b0b0,spotColors:[0x707070],spotCount:80,spotMaxSize:15,noiseAmount:.4});
    default:return makeProcTex({baseColor:0xaaaaaa});
  }
}

const texLoader = new THREE.TextureLoader();
let totalTextures = 0, loadedCount = 0;
const texLoadStatus = {};
const _texUrlByName = Object.fromEntries(ALL_TEXTURES.map(t => [t.name, t.url]));
function resolveAsset(path){
  if(!path) return path;
  if(/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = (typeof window !== 'undefined' && window.__APP_BASE__) ? window.__APP_BASE__ : './';
  return base.replace(/\/?$/, '/') + path.replace(/^\//, '');
}
function regTex(filename){
  totalTextures++;
  texLoadStatus[filename] = 'pending';
  const url = _texUrlByName[filename] || resolveAsset(filename);
  return texLoader.load(url,()=>{texLoadStatus[filename]='ok';loadedCount++;chkLoaded();},undefined,()=>{texLoadStatus[filename]='fail';loadedCount++;chkLoaded();});
}
function chkLoaded(){if(loadedCount>=totalTextures)document.getElementById('loading').style.display='none';}
// Spätestens nach 8 s ausblenden, auch wenn externe Texturen (Wikimedia) noch hängen
setTimeout(()=>{const l=document.getElementById('loading');if(l)l.style.display='none';},8000);
function countTextureFallbacks(){
  let loaded=0, failed=0, pending=0, procedural=0;
  Object.values(texLoadStatus).forEach(s=>{
    if(s==='ok')loaded++;
    else if(s==='fail')failed++;
    else pending++;
  });
  PLANETS.forEach(p=>{
    if(!p.texture && !p.isEarth) procedural++;
    else if(p.texture && texLoadStatus[p.texture]==='fail') procedural++;
  });
  return {loaded, failed, pending, procedural, total:Object.keys(texLoadStatus).length};
}

// ===== SONNE =====
const sunGroup = new THREE.Group();
scene.add(sunGroup);
const sunMat = new THREE.ShaderMaterial({
  uniforms:{uTime:{value:0},uTex:{value:null},uHasTex:{value:0}},
  transparent:false,
  depthWrite:true,
  vertexShader:`varying vec2 vUv;varying vec3 vNormal;varying vec3 vViewDir;
    void main(){vUv=uv;vNormal=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vViewDir=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform float uTime;uniform sampler2D uTex;uniform float uHasTex;
    varying vec2 vUv;varying vec3 vNormal;varying vec3 vViewDir;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
    float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
    void main(){
      vec2 uv=vUv*vec2(4.0,2.0);
      float t1 = uTime * 0.08;
      float t2 = uTime * 0.19;
      float n1=fbm(uv*4.5+vec2(t1, t1*0.7));
      float n2=fbm(uv*2.0-vec2(t2*0.6, t1*0.4));
      float n3=fbm(uv*0.9+vec2(t1*0.3, t2*0.2));
      float boil=fbm(uv*9.0+vec2(sin(t2*1.3), cos(t2*0.9)))*0.5;
      float detail=n1*0.45+n2*0.25+n3*0.15+boil*0.15;
      float fleck=fbm(uv*0.85+vec2(t1*0.2, 0.0));
      vec3 deep=vec3(0.78,0.32,0.04);
      vec3 mid=vec3(1.0,0.70,0.20);
      vec3 bright=vec3(1.0,0.94,0.62);
      vec3 color=mix(deep,mid,detail);
      color=mix(color,bright,smoothstep(0.5,0.88,detail)*0.5);
      if(fleck<0.36){color*=mix(0.45,1.0,smoothstep(0.1,0.36,fleck));}
      if(uHasTex>0.5){
        vec3 texC=texture2D(uTex,vUv).rgb;
        color=mix(color,texC*vec3(1.15,1.05,0.85),0.72);
      }
      float nd=max(dot(vNormal,vViewDir),0.0);
      float limb=pow(clamp(nd,0.0,1.0),0.42);
      color*=0.28+0.72*limb;
      float rim=pow(1.0-nd,1.8);
      color+=vec3(1.0,0.78,0.25)*rim*0.55;
      float flicker=0.97+0.03*sin(uTime*3.1+nd*8.0);
      color*=flicker;
      float microFlicker = 0.94 + 0.08*fbm(uv*7.0 + vec2(uTime*0.7, uTime*0.5));
      color *= microFlicker;
      gl_FragColor=vec4(color,1.0);
    }`
});
(function(){
  const url=_texUrlByName['sunmap.jpg'];
  if(!url)return;
  texLoader.load(url,tex=>{
    tex.colorSpace=THREE.SRGBColorSpace;
    sunMat.uniforms.uTex.value=tex;
    sunMat.uniforms.uHasTex.value=1;
  });
})();
const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(1.6,64,64), sunMat);
sunMesh.userData = { planetName:'Sonne', type:'sun', mesh:sunMesh };
sunGroup.add(sunMesh);

function makeCorona(size, stops, opacity=1.0){
  const c=document.createElement('canvas');c.width=c.height=512;
  const x=c.getContext('2d');
  const grad=x.createRadialGradient(256,256,0,256,256,256);
  for(const[pos,color]of stops)grad.addColorStop(pos,color);
  x.fillStyle=grad;x.fillRect(0,0,512,512);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  const mat=new THREE.SpriteMaterial({map:tex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity});
  const s=new THREE.Sprite(mat);s.scale.set(size,size,1);return s;
}
const coronaSprites=[];
const coronaBase=[
  {size:4.2,op:0.95,stops:[[0,'rgba(255,240,180,0.7)'],[.2,'rgba(255,220,120,0.45)'],[.45,'rgba(255,190,80,0.22)'],[.7,'rgba(255,150,50,0.07)'],[1,'rgba(255,100,20,0)']]},
  {size:6.5,op:0.7,stops:[[0,'rgba(255,230,140,0.28)'],[.25,'rgba(255,200,90,0.14)'],[.55,'rgba(255,160,50,0.05)'],[1,'rgba(255,80,0,0)']]},
  {size:10.0,op:0.45,stops:[[0,'rgba(255,210,110,0.10)'],[.35,'rgba(255,170,60,0.04)'],[1,'rgba(255,80,0,0)']]},
  {size:14.0,op:0.25,stops:[[0,'rgba(255,190,80,0.04)'],[.4,'rgba(255,140,40,0.015)'],[1,'rgba(255,60,0,0)']]}
];
coronaBase.forEach(cfg=>{
  const spr=makeCorona(cfg.size,cfg.stops,cfg.op);
  spr.userData.baseOp=cfg.op;spr.userData.baseSize=cfg.size;spr.userData.flare=false;
  coronaSprites.push(spr);sunGroup.add(spr);
});

// Asymmetrische Flare-Texturen
function makeFlareTex(seed=0){
  const c=document.createElement('canvas');c.width=512;c.height=512;
  const x=c.getContext('2d');
  const cx=256, cy=256;
  const g=x.createRadialGradient(cx,cy,0,cx,cy,256);
  g.addColorStop(0,'rgba(255,255,230,0.95)');
  g.addColorStop(0.08,'rgba(255,240,170,0.55)');
  g.addColorStop(0.22,'rgba(255,210,100,0.20)');
  g.addColorStop(0.5,'rgba(255,160,40,0.05)');
  g.addColorStop(1,'rgba(255,100,0,0)');
  x.fillStyle=g;x.fillRect(0,0,512,512);
  const rayCount = 10 + Math.floor(Math.random()*8);
  for(let i=0;i<rayCount;i++){
    const angle = (i/rayCount)*Math.PI*2 + (Math.random()-0.5)*0.9;
    const len = 60 + Math.random()*160;
    const width = 2 + Math.random()*14;
    const alpha = 0.15 + Math.random()*0.4;
    const color = Math.random()<0.6 ? '255,230,150' : (Math.random()<0.5 ? '255,180,90' : '255,255,220');
    x.save();
    x.translate(cx,cy);
    x.rotate(angle);
    const lg = x.createLinearGradient(0,0,0,-len);
    lg.addColorStop(0, `rgba(${color},${alpha})`);
    lg.addColorStop(0.5, `rgba(${color},${alpha*0.4})`);
    lg.addColorStop(1, `rgba(${color},0)`);
    x.fillStyle = lg;
    x.beginPath();
    x.moveTo(-width,0);
    x.quadraticCurveTo(-width*0.3, -len*0.7, 0, -len);
    x.quadraticCurveTo(width*0.3, -len*0.7, width, 0);
    x.closePath();
    x.fill();
    x.restore();
  }
  for(let i=0;i<18;i++){
    const a = Math.random()*Math.PI*2;
    const r = 90 + Math.random()*110;
    const pr = 8 + Math.random()*22;
    const alpha = 0.05 + Math.random()*0.15;
    x.save();
    x.translate(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
    const rg = x.createRadialGradient(0,0,0,0,0,pr);
    rg.addColorStop(0, `rgba(255,220,140,${alpha})`);
    rg.addColorStop(1, 'rgba(255,180,80,0)');
    x.fillStyle = rg;
    x.beginPath();x.arc(0,0,pr,0,Math.PI*2);x.fill();
    x.restore();
  }
  const t=new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const flareTextures = [makeFlareTex(), makeFlareTex(), makeFlareTex(), makeFlareTex()];
for(let i=0;i<4;i++){
  const mat = new THREE.SpriteMaterial({
    map: flareTextures[i],
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.30
  });
  const spr = new THREE.Sprite(mat);
  const sz = 5.0 + i*1.8;
  spr.scale.set(sz,sz,1);
  spr.userData = {
    baseOp: 0.22 + i*0.05,
    baseSize: sz,
    flare: true,
    phase: i*1.7,
    rotSpeed: (i%2===0?1:-1) * (0.04 + Math.random()*0.08),
    pulseSpeed: 0.8 + Math.random()*0.7,
    wobbleSeed: Math.random()*100,
    wobbleAxis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
    wobbleAmp: 0.04 + Math.random()*0.06
  };
  coronaSprites.push(spr);
  sunGroup.add(spr);
}
let lightState={corona:1.35,coronaSize:1.15,bloom:0.22,mw:0.85,hemi:0.12,stars:1.15,cometTail:0.85,cometComa:0.7,cometCore:0.6,satGlow:1.3};

const sunLabel = new CSS2DObject(document.createElement('div'));
sunLabel.element.className='planet-label';
sunLabel.element.textContent='Sonne';
sunLabel.position.set(0,2.2,0);
sunGroup.add(sunLabel);

// ===== ORBIT-POSITIONEN =====
const SCENE_AU = 7.0;
const J2000 = Date.UTC(2000,0,1,12,0,0);

function julianDaysSinceJ2000(date){ return (date.getTime() - J2000) / 86400000; }
function deg2rad(d){ return d * Math.PI / 180; }
function rad2deg(r){ return r * 180 / Math.PI; }
function solveKepler(M, e){
  // Für sehr exzentrische Bahnen (Kometen) von ±π starten, sonst divergiert Newton
  let E = e<0.8 ? M : (M>=0 ? Math.PI : -Math.PI);
  for(let i=0;i<40;i++){
    const d = E - e*Math.sin(E) - M;
    E -= d / (1 - e*Math.cos(E));
    if(Math.abs(d)<1e-8)break;
  }
  return E;
}
function keplerPosition(el, date){
  const d = julianDaysSinceJ2000(date);
  const n = 360 / el.period;
  const L = (el.L + n * d) % 360;
  const M = deg2rad(((L - el.ϖ + 540) % 360) - 180);
  return orbitPointFromE(el, solveKepler(M, el.e));
}
// Punkt auf der (geneigten, exzentrischen) Bahn für eine exzentrische Anomalie E
function orbitPointFromE(el, E){
  const cosE = Math.cos(E), sinE = Math.sin(E);
  const xv = el.a * (cosE - el.e);
  const yv = el.a * Math.sqrt(1 - el.e*el.e) * sinE;
  const v = Math.atan2(yv, xv);
  const r = Math.sqrt(xv*xv + yv*yv);
  const ϖ = deg2rad(el.ϖ), Ω = deg2rad(el.Ω), i = deg2rad(el.i);
  const θ = v + ϖ - Ω;
  const xh = r * (Math.cos(Ω)*Math.cos(θ) - Math.sin(Ω)*Math.sin(θ)*Math.cos(i));
  const yh = r * (Math.sin(Ω)*Math.cos(θ) + Math.cos(Ω)*Math.sin(θ)*Math.cos(i));
  const zh = r * (Math.sin(θ)*Math.sin(i));
  return new THREE.Vector3(xh * SCENE_AU, zh * SCENE_AU, yh * SCENE_AU);
}

function updatePlanetPositions(date){
  PLANETS.forEach(pd=>{
    const el = ORBITAL_ELEMENTS[pd.name];
    if(!el || !pd._system || !pd._pivot) return;
    const pos = keplerPosition(el, date);
    pd._pivot.rotation.set(0,0,0);
    pd._system.position.copy(pos);
  });
}
function updatePlanetSpins(date, dtDays){
  PLANETS.forEach(pd=>{
    if(!pd._mesh) return;
    const hours = SPIN_HOURS[pd.name];
    if(!hours) return;
    const degPerDay = 360 / (Math.abs(hours)/24);
    const sign = hours < 0 ? -1 : 1;
    pd._mesh.rotation.y += sign * deg2rad(degPerDay * dtDays);
  });
  if(sunMesh){
    const h = SPIN_HOURS['Sonne']||609;
    sunMesh.rotation.y += deg2rad(360/(h/24) * dtDays);
  }
}

// ===== PLANETEN =====
const planetMeshes=[],moonMeshes=[],allMoons=[],satelliteMeshes=[],clickableObjects=[];
const orbitsGroup=new THREE.Group();scene.add(orbitsGroup);
const moonOrbitsGroup=new THREE.Group();moonOrbitsGroup.visible=false;scene.add(moonOrbitsGroup);
clickableObjects.push(sunMesh); // Sonne war vorher nicht antippbar

PLANETS.forEach(pd=>{
  const pivot=new THREE.Group();scene.add(pivot);
  const system=new THREE.Group();system.position.x=pd.distance;pivot.add(system);
  let map;
  if(pd.isEarth)map=regTex('earth_atmos_2048.jpg');
  else if(pd.texture)map=regTex(pd.texture);
  const mp={};
  if(map){map.colorSpace=THREE.SRGBColorSpace;mp.map=map;}else mp.map=getPlanetFallback(pd.name);
  if(pd.isEarth){
    mp.normalMap=regTex('earth_normal_2048.jpg');
    mp.normalScale=new THREE.Vector2(.8,.8);
    mp.specularMap=regTex('earth_specular_2048.jpg');
    mp.specular=new THREE.Color(0x444444);mp.shininess=15;
  }else mp.shininess=8;
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(pd.radius,48,48),new THREE.MeshPhongMaterial(mp));
  mesh.rotation.z=pd.tilt;
  mesh.userData={planetName:pd.name,type:'planet',data:pd,mesh:mesh};
  system.add(mesh);planetMeshes.push(mesh);clickableObjects.push(mesh);
  if(pd.isEarth){
    const atmo=new THREE.Mesh(new THREE.SphereGeometry(pd.radius*1.06,48,48),new THREE.ShaderMaterial({
      vertexShader:`varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`varying vec3 vN;void main(){float i=pow(0.7-dot(vN,vec3(0.0,0.0,1.0)),2.0);gl_FragColor=vec4(0.35,0.65,1.0,1.0)*i;}`,
      blending:THREE.AdditiveBlending,side:THREE.BackSide,transparent:true
    }));
    system.add(atmo);
    const clouds=new THREE.Mesh(new THREE.SphereGeometry(pd.radius*1.01,48,48),new THREE.MeshPhongMaterial({
      map:regTex('earth_clouds_1024.png'),transparent:true,opacity:.45,depthWrite:false
    }));
    system.add(clouds);mesh.userData.clouds=clouds;
  }
  if(pd.hasRings){
    const ringGeo=new THREE.RingGeometry(pd.radius*1.4,pd.radius*2.4,128);
    const c=document.createElement('canvas');c.width=512;c.height=1;
    const x=c.getContext('2d');
    for(let i=0;i<512;i++){const n=.6+Math.random()*.4;const gap=(i>180&&i<220)?.15:1;const alpha=Math.min(1,n*gap);x.fillStyle=`rgba(220,200,150,${alpha})`;x.fillRect(i,0,1,1);}
    const ringTex=new THREE.CanvasTexture(c);
    const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({map:ringTex,side:THREE.DoubleSide,transparent:true,opacity:.85}));
    ring.rotation.x=Math.PI/2;mesh.add(ring);
  }
  const lbl=new CSS2DObject(document.createElement('div'));
  lbl.element.className='planet-label';lbl.element.textContent=pd.name;
  lbl.position.set(0,pd.radius+.25,0);system.add(lbl);
  const el0=ORBITAL_ELEMENTS[pd.name];
  const orbitPts=[];
  if(el0){
    // Echte Ellipse mit Neigung – vorher Kreise, Merkur/Pluto lagen sichtbar neben ihrer Bahnlinie
    for(let i=0;i<=256;i++)orbitPts.push(orbitPointFromE(el0,(i/256)*Math.PI*2));
  }else{
    const orbR=pd.distance;
    for(let i=0;i<=128;i++){const a=(i/128)*Math.PI*2;orbitPts.push(new THREE.Vector3(Math.cos(a)*orbR,0,Math.sin(a)*orbR));}
  }
  const orbitLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPts),new THREE.LineBasicMaterial({color:0x334466,transparent:true,opacity:.5}));
  orbitsGroup.add(orbitLine);
  pd._orbitLine=orbitLine;
  pd._pivot=pivot;pd._system=system;pd._mesh=mesh;pd._moons=[];pd._moonsLoaded=false;
});

function ensureMoons(pd){
  if(!pd||pd._moonsLoaded)return pd?pd._moons:[];
  const moons=MOON_DATA[pd.name]||[];
  const moonObjects=[];
  const system=pd._system;
  moons.forEach(md=>{
    const moonPivot=new THREE.Group();moonPivot.rotation.z=.09;system.add(moonPivot);
    let moonMat;
    if(md.tex)moonMat=new THREE.MeshPhongMaterial({map:regTex(md.tex),shininess:5});
    else moonMat=new THREE.MeshPhongMaterial({map:getMoonTex(md.name),shininess:5});
    const moonMesh=new THREE.Mesh(new THREE.SphereGeometry(pd.radius*md.radius,16,16),moonMat);
    const moonDist=pd.radius*md.distance;
    moonMesh.position.x=moonDist;
    moonMesh.userData={planetName:md.name,type:'moon',parentName:pd.name,moonName:md.name,mesh:moonMesh};
    moonPivot.add(moonMesh);moonMeshes.push(moonMesh);allMoons.push(moonMesh);clickableObjects.push(moonMesh);
    const mlbl=new CSS2DObject(document.createElement('div'));
    mlbl.element.className='moon-label';mlbl.element.textContent=md.name;
    mlbl.position.set(0,pd.radius*md.radius+.08,0);moonMesh.add(mlbl);
    const mOrbitPts=[];
    for(let i=0;i<=64;i++){const a=(i/64)*Math.PI*2;mOrbitPts.push(new THREE.Vector3(Math.cos(a)*moonDist,0,Math.sin(a)*moonDist));}
    moonOrbitsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mOrbitPts),new THREE.LineBasicMaterial({color:0x2a4466,transparent:true,opacity:.35})));
    moonObjects.push({mesh:moonMesh,pivot:moonPivot,data:md});
  });
  pd._moons=moonObjects;
  pd._moonsLoaded=true;
  return moonObjects;
}
function ensureMoonsByName(planetName){
  const pd=PLANETS.find(p=>p.name===planetName);
  return ensureMoons(pd);
}

updatePlanetPositions(simDate);

// Satelliten
const earthPlanet=PLANETS.find(p=>p.name==='Erde');
const issGroup=new THREE.Group();earthPlanet._system.add(issGroup);
const issMat=new THREE.MeshPhongMaterial({color:0xffcc44,emissive:0x553300,emissiveIntensity:1,shininess:80});
issMat.userData.baseEmissiveIntensity=1;
const issMesh=new THREE.Mesh(new THREE.BoxGeometry(.03,.015,.008),issMat);
issMesh.position.set(.28,.05,0);
issMesh.userData={planetName:'ISS',type:'satellite',mesh:issMesh};
issGroup.add(issMesh);satelliteMeshes.push(issMesh);clickableObjects.push(issMesh);

const hubbleGroup=new THREE.Group();earthPlanet._system.add(hubbleGroup);
const hubbleMat=new THREE.MeshPhongMaterial({color:0xaaaaaa,emissive:0x111111,emissiveIntensity:1,shininess:100});
hubbleMat.userData.baseEmissiveIntensity=1;
const hubbleMesh=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.04,12),hubbleMat);
hubbleMesh.position.set(.35,-.03,0);hubbleMesh.rotation.z=Math.PI/2;
hubbleMesh.userData={planetName:'Hubble',type:'satellite',mesh:hubbleMesh};
hubbleGroup.add(hubbleMesh);satelliteMeshes.push(hubbleMesh);clickableObjects.push(hubbleMesh);

// Asteroiden (Hauptgürtel 2,2–3,3 AE, gleicher Maßstab wie die Planeten)
const asteroidBelt=new THREE.Group();scene.add(asteroidBelt);
const asteroidCount=2500;
const asteroidGeo=new THREE.DodecahedronGeometry(.03,0);
const asteroidMat=new THREE.MeshPhongMaterial({color:0x9a8a7a,shininess:3});
const asteroidInstanced=new THREE.InstancedMesh(asteroidGeo,asteroidMat,asteroidCount);
asteroidInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);asteroidBelt.add(asteroidInstanced);
const asteroidData=[];const dummy=new THREE.Object3D();
for(let i=0;i<asteroidCount;i++){asteroidData.push({angle:Math.random()*Math.PI*2,radius:(2.2+Math.random()*1.1)*SCENE_AU,yOffset:(Math.random()-.5)*1.6,rotSpeed:.05+Math.random()*.05,scale:.5+Math.random()*1.5});}

// Kuiper (30–50 AE)
const kuiperBelt=new THREE.Group();scene.add(kuiperBelt);
const kuiperCount=1500;
const kuiperGeo=new THREE.DodecahedronGeometry(.22,0);
const kuiperMat=new THREE.MeshPhongMaterial({color:0xaaccee,shininess:10,emissive:0x112244});
const kuiperInstanced=new THREE.InstancedMesh(kuiperGeo,kuiperMat,kuiperCount);
kuiperInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);kuiperBelt.add(kuiperInstanced);
const kuiperData=[];
for(let i=0;i<kuiperCount;i++){kuiperData.push({angle:Math.random()*Math.PI*2,radius:(30+Math.random()*20)*SCENE_AU,yOffset:(Math.random()-.5)*30,rotSpeed:.01+Math.random()*.02,scale:.5+Math.random()*1.5});}

// KOMETEN
const cometsGroup=new THREE.Group();scene.add(cometsGroup);
const cometObjects=[];
// Kometen im selben Maßstab wie die Planeten (vorher 1 AE = 1,8 statt 7 → Perihel lag innerhalb der Merkurbahn).
// Sehr lange Bahnen werden optisch gestaucht: Perihel bleibt echt, Aphel wird auf max. 60 AE begrenzt.
const AU=SCENE_AU, COMET_MAX_APHEL=60;
function cometShape(cd){
  const q=cd.a*(1-cd.e), Q=cd.a*(1+cd.e);
  if(Q<=COMET_MAX_APHEL)return {a:cd.a,e:cd.e};
  const Q2=COMET_MAX_APHEL;
  return {a:(q+Q2)/2,e:(Q2-q)/(Q2+q)};
}
COMETS.forEach(cd=>{
  const orbitGroup=new THREE.Group();
  orbitGroup.rotation.y=cd.node;
  orbitGroup.rotation.z=cd.incl;
  orbitGroup.rotation.y+=cd.peri;
  cometsGroup.add(orbitGroup);
  const shp=cometShape(cd);
  const a=shp.a*AU;
  const b=a*Math.sqrt(1-shp.e*shp.e);
  const c=a*shp.e;
  const orbitPts=[];
  for(let i=0;i<=512;i++){const th=(i/512)*Math.PI*2;const x=a*Math.cos(th)-c;const z=b*Math.sin(th);orbitPts.push(new THREE.Vector3(x,0,z));}
  const cOrbitGeo=new THREE.BufferGeometry().setFromPoints(orbitPts);
  const cOrbitMat=new THREE.LineDashedMaterial({color:0x334466,transparent:true,opacity:0.45,dashSize:1.2,gapSize:0.8});
  const cOrbitLine=new THREE.Line(cOrbitGeo,cOrbitMat);
  cOrbitLine.computeLineDistances();
  orbitGroup.add(cOrbitLine);
  const cometPivot=new THREE.Group();orbitGroup.add(cometPivot);
  const nucR=Math.max(cd.radius*0.12,0.012);
  const nucMat=new THREE.MeshStandardMaterial({color:0x6a6a72,emissive:0x1a2228,emissiveIntensity:0.35,roughness:0.92,metalness:0.05});
  nucMat.userData.baseEmissive=0x1a2228;
  const nucGeo=new THREE.IcosahedronGeometry(nucR,1);
  const pos=nucGeo.attributes.position;
  for(let i=0;i<pos.count;i++){
    const sx=0.85+Math.random()*0.35;
    const sy=0.75+Math.random()*0.4;
    const sz=0.85+Math.random()*0.3;
    pos.setXYZ(i, pos.getX(i)*sx, pos.getY(i)*sy, pos.getZ(i)*sz);
  }
  nucGeo.computeVertexNormals();
  const nucleus=new THREE.Mesh(nucGeo,nucMat);
  nucleus.userData={planetName:cd.shortName,type:'comet',cometData:cd,mesh:nucleus};
  cometPivot.add(nucleus);
  const comaSize=nucR*6;
  const cc=document.createElement('canvas');cc.width=cc.height=128;
  const cctx=cc.getContext('2d');
  const cgrad=cctx.createRadialGradient(64,64,0,64,64,64);
  cgrad.addColorStop(0,'rgba(210,230,240,0.55)');
  cgrad.addColorStop(0.25,'rgba(160,190,210,0.22)');
  cgrad.addColorStop(0.55,'rgba(100,140,170,0.08)');
  cgrad.addColorStop(1,'rgba(40,60,80,0)');
  cctx.fillStyle=cgrad;cctx.fillRect(0,0,128,128);
  const comaTex=new THREE.CanvasTexture(cc);comaTex.colorSpace=THREE.SRGBColorSpace;
  const comaMat=new THREE.SpriteMaterial({map:comaTex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.28});
  comaMat.userData.baseOpacity=0.28;
  const coma=new THREE.Sprite(comaMat);
  coma.userData.baseScale=comaSize;
  coma.scale.set(comaSize,comaSize,1);cometPivot.add(coma);
  function makeTailTex(r,g,b){
    const cv=document.createElement('canvas');cv.width=32;cv.height=256;
    const cx=cv.getContext('2d');
    const gr=cx.createLinearGradient(16,0,16,256);
    gr.addColorStop(0,`rgba(${r},${g},${b},0)`);
    gr.addColorStop(0.08,`rgba(${r},${g},${b},0.35)`);
    gr.addColorStop(0.35,`rgba(${r},${g},${b},0.12)`);
    gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
    cx.fillStyle=gr;cx.fillRect(0,0,32,256);
    const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;
  }
  const dustLen=Math.max(nucR*28,0.55);
  const ionLen=Math.max(nucR*42,0.8);
  const dustMat=new THREE.SpriteMaterial({map:makeTailTex(180,165,130),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.32});
  dustMat.userData.baseOpacity=0.32;
  const dustTail=new THREE.Sprite(dustMat);
  dustTail.scale.set(nucR*2.2,dustLen,1);
  dustTail.userData.baseW=nucR*2.2;dustTail.userData.baseH=dustLen;
  cometPivot.add(dustTail);
  const ionMat=new THREE.SpriteMaterial({map:makeTailTex(90,140,180),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.26});
  ionMat.userData.baseOpacity=0.26;
  const ionTail=new THREE.Sprite(ionMat);
  ionTail.scale.set(nucR*1.1,ionLen,1);
  ionTail.userData.baseW=nucR*1.1;ionTail.userData.baseH=ionLen;
  cometPivot.add(ionTail);
  const lbl=new CSS2DObject(document.createElement('div'));
  lbl.element.className='comet-label';lbl.element.textContent=cd.shortName;
  lbl.position.set(0,cd.radius*3,0);cometPivot.add(lbl);
  // Perihel-Zeitpunkt (falls bekannt) → Position folgt der Simulationsuhr wie bei den Planeten
  const tPeri=cd.perihelion?Date.parse(cd.perihelion+'T00:00:00Z'):J2000;
  cometObjects.push({data:cd,orbitGroup,cometPivot,nucleus,coma,dustTail,ionTail,a,b,c,e:shp.e,tPeri,periodMs:cd.period*365.25*86400000});
  clickableObjects.push(nucleus);
});

// ===== FOCUS MODE =====
function switchFocusRightTab(tab){
  document.querySelectorAll('.fr-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  document.querySelectorAll('.fr-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===tab));
}
document.addEventListener('click',e=>{
  const tab=e.target.closest('.fr-tab');
  if(tab) switchFocusRightTab(tab.dataset.tab);
});

function renderMedia(objectName){
  const media = (MEDIA_DATA && MEDIA_DATA[objectName]) || {images:[],videos:[]};
  const g=document.getElementById('media-gallery');
  const v=document.getElementById('media-videos');
  if(!g||!v)return;
  const imgs=media.images||[];
  const vids=media.videos||[];
  if(imgs.length===0){
    g.innerHTML='<div class="media-empty">Keine Bilder hinterlegt</div>';
  } else {
    g.innerHTML=imgs.map((im,i)=>`
      <div class="media-card" data-idx="${i}">
        <img src="${im.url}" alt="${escapeHtml(im.title)}" loading="lazy" referrerpolicy="no-referrer">
        <div class="mc-title">${escapeHtml(im.title)}</div>
        <div class="mc-credit">${escapeHtml(im.credit||'')}</div>
      </div>`).join('');
    g.querySelectorAll('.media-card').forEach(card=>{
      card.addEventListener('click',()=>{
        const im=imgs[+card.dataset.idx];
        openLightbox(im.url, im.title+(im.credit?' · '+im.credit:''));
      });
    });
  }
  if(vids.length===0){
    v.innerHTML='<div class="media-empty">Keine Videos hinterlegt</div>';
  } else {
    v.innerHTML=vids.map(vid=>{
      const id=vid.youtube;
      const lang=vid.lang==='de'?'Deutsch':'Englisch';
      return `<div class="video-card">
        <div class="vc-title">${escapeHtml(vid.title)}</div>
        <div class="vc-meta">${lang} · YouTube</div>
        <iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${escapeHtml(vid.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
        <a class="vc-link" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">Auf YouTube öffnen ↗</a>
      </div>`;
    }).join('');
  }
}
function openLightbox(url, cap){
  const lb=document.getElementById('media-lightbox');
  document.getElementById('lb-img').src=url;
  document.getElementById('lb-cap').textContent=cap||'';
  lb.classList.remove('hidden');
}
function closeLightbox(){
  const lb=document.getElementById('media-lightbox');
  if(!lb)return;
  lb.classList.add('hidden');
  document.getElementById('lb-img').src='';
}
// Lightbox direkt an <body> hängen: im Fokus-Panel erbte sie pointer-events:none und lag unter Leiste/Uhr
{const lb=document.getElementById('media-lightbox');if(lb&&lb.parentElement!==document.body)document.body.appendChild(lb);}
document.getElementById('lb-close')?.addEventListener('click',closeLightbox);
document.getElementById('media-lightbox')?.addEventListener('click',e=>{
  if(e.target.id==='media-lightbox')closeLightbox();
});

let currentEdu=null;
function renderEduBlock(info){
  const box=document.getElementById('focus-edu');
  const empty=document.getElementById('edu-empty');
  const schoolTab=document.getElementById('tab-school');
  if(!box)return;
  const edu=info&&info.edu;
  document.querySelectorAll('.fl-tab').forEach(t=>t.classList.toggle('active',t.dataset.ftab==='info'));
  document.querySelectorAll('.fl-panel').forEach(p=>p.classList.toggle('active',p.dataset.fpanel==='info'));
  if(!edu){
    box.classList.add('hidden');
    if(empty) empty.classList.add('show');
    if(schoolTab) schoolTab.style.opacity='0.45';
    currentEdu=null;
    return;
  }
  currentEdu=edu;
  box.classList.remove('hidden');
  if(empty) empty.classList.remove('show');
  if(schoolTab) schoolTab.style.opacity='1';
  const sub=document.getElementById('edu-subjects');
  if(sub) sub.innerHTML=(edu.subjects||[]).map(s=>`<span>${s}</span>`).join('');
  document.querySelectorAll('.edu-tab').forEach(t=>t.classList.toggle('active',t.dataset.level==='haupt'));
  showEduLevel('haupt');
  const tip=document.getElementById('edu-tip');
  if(tip) tip.textContent=edu.tip||'';
}
document.addEventListener('click',e=>{
  const t=e.target.closest('.fl-tab');
  if(!t)return;
  const id=t.dataset.ftab;
  document.querySelectorAll('.fl-tab').forEach(x=>x.classList.toggle('active',x===t));
  document.querySelectorAll('.fl-panel').forEach(p=>p.classList.toggle('active',p.dataset.fpanel===id));
});
function showEduLevel(level){
  if(!currentEdu)return;
  const body=document.getElementById('edu-body');
  const text=currentEdu[level]||currentEdu.haupt||'';
  body.textContent=text;
  document.querySelectorAll('.edu-tab').forEach(t=>t.classList.toggle('active',t.dataset.level===level));
}
document.addEventListener('click',e=>{
  const tab=e.target.closest('.edu-tab');
  if(!tab)return;
  showEduLevel(tab.dataset.level);
});

let focusMode=null;
const poiMarkers=[];
function latLonToVec3(lat,lon,radius){
  const phi=(90-lat)*Math.PI/180;
  const theta=(lon+180)*Math.PI/180;
  const x=-radius*Math.sin(phi)*Math.cos(theta);
  const z=radius*Math.sin(phi)*Math.sin(theta);
  const y=radius*Math.cos(phi);
  return new THREE.Vector3(x,y,z);
}
function clearPoiMarkers(){
  poiMarkers.forEach(m=>{
    if(m.mesh&&m.mesh.parent)m.mesh.parent.remove(m.mesh);
    if(m.label&&m.label.parent)m.label.parent.remove(m.label);
  });
  poiMarkers.length=0;
}
function createPoiMarker(poi,parentMesh,planetRadius){
  const pos=latLonToVec3(poi.lat,poi.lon,planetRadius*1.005);
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(planetRadius*0.025,12,12),new THREE.MeshBasicMaterial({color:0x33ccff}));
  sphere.position.copy(pos);parentMesh.add(sphere);
  const div=document.createElement('div');
  div.className='poi-marker-label';div.textContent=poi.name;
  const labelObj=new CSS2DObject(div);
  labelObj.position.copy(pos.clone().multiplyScalar(1.15));
  parentMesh.add(labelObj);
  return {mesh:sphere,label:labelObj,poi,parent:parentMesh};
}
function enterFocusMode(mesh){
  if(mesh&&mesh.userData){
    if(mesh.userData.type==='planet'){
      const pd=PLANETS.find(p=>p.name===mesh.userData.planetName);
      if(pd)ensureMoons(pd);
    } else if(mesh.userData.type==='moon'&&mesh.userData.parentName){
      ensureMoonsByName(mesh.userData.parentName);
    }
  }
  const ud=mesh.userData;
  const isMoon=ud.type==='moon';
  const isComet=ud.type==='comet';
  const planetName=isMoon?ud.parentName:ud.planetName;
  const objectName=isMoon?ud.moonName:planetName;
  const isEarth=planetName==='Erde'&&!isMoon&&!isComet;
  const pois=isEarth?POI_DATA['Erde']:(POI_DATA[objectName]||[]);
  const info=INFO_DATA[objectName]||{icon:'○',name:objectName,subtitle:'Objekt',desc:'',stats:{},fact:''};
  focusMode={name:objectName,type:isComet?'comet':(isMoon?'moon':'planet'),parentPlanet:planetName,mesh:mesh,isEarth:isEarth,pois:pois,planetRadius:mesh.geometry.parameters.radius||0.1,markers:[],activePoi:null};
  document.getElementById('info-panel').classList.remove('show');
  if(isMobileLayout()){
    // Mobil: Menü schließen, damit die Fokus-Ansicht frei ist
    document.getElementById('sidebar').classList.add('collapsed');
    document.querySelectorAll('.sb-tab[data-panel]').forEach(t=>t.classList.remove('active'));
  }
  document.getElementById('focus-panel').classList.add('show');

  // Panels starten IMMER minimiert – User öffnet gezielt über Pills
  document.getElementById('focus-left').classList.add('minimized');
  document.getElementById('focus-right').classList.add('minimized');
  document.getElementById('focus-restore-left').style.display='flex';
  document.getElementById('focus-restore-right').style.display='flex';

  document.getElementById('focus-glyph').textContent=info.icon||'○';
  document.getElementById('focus-name').textContent=info.name||objectName;
  document.getElementById('focus-subtitle').textContent=info.subtitle||'';
  document.getElementById('focus-desc').textContent=info.desc||'';
  const grid=document.getElementById('focus-grid');grid.innerHTML='';
  if(info.stats){for(const[key,val]of Object.entries(info.stats)){const s=document.createElement('div');s.className='focus-stat';s.innerHTML=`<div class="focus-stat-label">${key}</div><div class="focus-stat-value">${val}</div>`;grid.appendChild(s);}}
  const factEl=document.getElementById('focus-fact');
  if(info.fact){factEl.style.display='block';factEl.innerHTML=`<span class="fact-title">Besonderheit</span>${info.fact}`;}else factEl.style.display='none';
  renderEduBlock(info);
  renderPoiList(pois);
  renderMedia(objectName);
  switchFocusRightTab('poi');
  clearPoiMarkers();
  if(pois.length>0&&!isEarth&&!isComet){
    pois.forEach(poi=>{const m=createPoiMarker(poi,mesh,focusMode.planetRadius);focusMode.markers.push(m);poiMarkers.push(m);});
  }
  const worldPos=new THREE.Vector3();
  mesh.getWorldPosition(worldPos);
  const targetDist=Math.max(focusMode.planetRadius*(isComet?18:4.5), isComet?0.55:0.3);
  // Kamera auf die beleuchtete Seite (Richtung Sonne) setzen, sonst sieht man oft nur die Nachtseite
  const toSun=worldPos.lengthSq()>1e-6?worldPos.clone().negate().normalize():new THREE.Vector3(0,0,1);
  const side=new THREE.Vector3().crossVectors(toSun,new THREE.Vector3(0,1,0)).normalize();
  const camOffset=toSun.multiplyScalar(0.8).add(side.multiplyScalar(0.45)).add(new THREE.Vector3(0,0.35,0)).normalize().multiplyScalar(targetDist);
  const targetCamPos=worldPos.clone().add(camOffset);
  camFlight={startTime:performance.now(),duration:1600,startCam:camera.position.clone(),endCam:targetCamPos.clone(),startTarget:controls.target.clone(),endTarget:worldPos.clone(),onComplete:()=>{controls.minDistance=Math.max(focusMode.planetRadius*1.2,0.02);controls.maxDistance=Math.max(focusMode.planetRadius*30,5);}};
}
function exitFocusMode(){
  clearPoiMarkers();
  const mv=document.getElementById('media-videos');
  if(mv)mv.innerHTML='';
  closeLightbox();
  focusMode=null;
  document.getElementById('focus-panel').classList.remove('show');
  document.getElementById('focus-left').classList.remove('expanded');
  document.getElementById('focus-right').classList.remove('expanded');
  document.getElementById('focus-left').classList.remove('minimized');
  document.getElementById('focus-right').classList.remove('minimized');
  document.getElementById('focus-restore-left').style.display='none';
  document.getElementById('focus-restore-right').style.display='none';
  controls.minDistance=0.05;controls.maxDistance=1400;
  const targetCamPos=new THREE.Vector3(0,30,55);
  camFlight={startTime:performance.now(),duration:1500,startCam:camera.position.clone(),endCam:targetCamPos.clone(),startTarget:controls.target.clone(),endTarget:new THREE.Vector3(0,0,0)};
}
function renderPoiList(pois,filterText=''){
  const listEl=document.getElementById('poi-list');
  if(!listEl)return;
  listEl.innerHTML='';
  if(!pois||pois.length===0){listEl.innerHTML=`<div class="poi-empty">Keine Orte hinterlegt</div>`;return;}
  const ft=(filterText||'').toLowerCase().trim();
  const filtered=ft
    ?pois.filter(p=>(p.name||'').toLowerCase().includes(ft)||(p.cat||'').toLowerCase().includes(ft))
    :pois;
  if(filtered.length===0){listEl.innerHTML=`<div class="poi-empty">Keine Treffer für "${filterText}"</div>`;return;}
  filtered.forEach(poi=>{
    const item=document.createElement('div');item.className='poi-item';
    const latStr=Math.abs(poi.lat).toFixed(1)+'°'+(poi.lat>=0?'N':'S');
    const lonStr=Math.abs(poi.lon).toFixed(1)+'°'+(poi.lon>=0?'O':'W');
    item.innerHTML=`<div class="poi-icon">${poi.icon||'◆'}</div><div class="poi-text"><div class="poi-name">${poi.name}</div><div class="poi-coords">${latStr}, ${lonStr}</div></div><div class="poi-category">${poi.cat||''}</div>`;
    item.addEventListener('click',()=>{document.querySelectorAll('.poi-item').forEach(i=>i.classList.remove('active'));item.classList.add('active');focusOnPoi(poi);});
    listEl.appendChild(item);
  });
}
function focusOnPoi(poi){
  if(!focusMode)return;
  let marker=focusMode.markers.find(m=>m.poi===poi);
  if(!marker){marker=createPoiMarker(poi,focusMode.mesh,focusMode.planetRadius);focusMode.markers.push(marker);poiMarkers.push(marker);}
  const worldPos=new THREE.Vector3();marker.mesh.getWorldPosition(worldPos);
  const planetCenter=new THREE.Vector3();focusMode.mesh.getWorldPosition(planetCenter);
  const dir=worldPos.clone().sub(planetCenter).normalize();
  const camDist=focusMode.planetRadius*2.8;
  const targetCamPos=worldPos.clone().add(dir.multiplyScalar(camDist));
  camFlight={startTime:performance.now(),duration:1300,startCam:camera.position.clone(),endCam:targetCamPos.clone(),startTarget:controls.target.clone(),endTarget:worldPos.clone()};
}
let camFlight=null;
function updateCamFlight(now){
  if(!camFlight)return;
  const t=Math.min(1,(now-camFlight.startTime)/camFlight.duration);
  const e=t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  camera.position.lerpVectors(camFlight.startCam,camFlight.endCam,e);
  controls.target.lerpVectors(camFlight.startTarget,camFlight.endTarget,e);
  if(t>=1){if(camFlight.onComplete)camFlight.onComplete();camFlight=null;}
}

// UI HANDLER
let paused=true,simSpeed=1.0;
const SPEED_PRESETS=[1,60,3600,86400,86400*30,86400*365];
const VISUAL_MULT=[1,2,5,15,60,200];
let speedPresetIdx=0;

document.querySelectorAll('.sb-tab[data-panel]').forEach(tab=>{
  tab.addEventListener('click',()=>{
    if(document.body.classList.contains('float-mode'))return;
    const panel=tab.dataset.panel;
    const sb=document.getElementById('sidebar');
    const isActive=tab.classList.contains('active');
    const isOpen=!sb.classList.contains('collapsed');
    if(isActive && isOpen){
      sb.classList.add('collapsed');
      tab.classList.remove('active');
      return;
    }
    document.querySelectorAll('.sb-tab[data-panel]').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.sb-section').forEach(s=>s.classList.toggle('active',s.dataset.panel===panel));
    sb.classList.remove('collapsed');
  });
});

const btnCollapseSb = document.getElementById('btn-collapse-sidebar');
if(btnCollapseSb){
  btnCollapseSb.addEventListener('click',()=>{
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
}
const btnClosePanel=document.getElementById('btn-close-panel');
if(btnClosePanel)btnClosePanel.addEventListener('click',()=>{
  document.getElementById('sidebar').classList.add('collapsed');
  document.querySelectorAll('.sb-tab[data-panel]').forEach(t=>t.classList.remove('active'));
});
document.getElementById('btn-toggle-labels').addEventListener('click',function(){
  document.getElementById('sidebar').classList.toggle('icons-only');
  this.classList.toggle('active');
});

document.getElementById('btn-pause').addEventListener('click',function(){
  setPaused(!paused);
});
document.getElementById('btn-reset').addEventListener('click',()=>{
  camera.position.set(0,30,55);controls.target.set(0,0,0);controls.update();
});

document.getElementById('btn-min-left').addEventListener('click',()=>{
  document.getElementById('focus-left').classList.add('minimized');
  document.getElementById('focus-restore-left').style.display='flex';
});
document.getElementById('btn-min-right').addEventListener('click',()=>{
  document.getElementById('focus-right').classList.add('minimized');
  document.getElementById('focus-restore-right').style.display='flex';
});
// Mobil: immer nur ein Fokus-Fenster gleichzeitig, sonst wird es zu eng
function minimizeFocusBox(side){
  document.getElementById('focus-'+side).classList.add('minimized');
  document.getElementById('focus-restore-'+side).style.display='flex';
}
document.getElementById('focus-restore-left').addEventListener('click',()=>{
  if(isMobileLayout())minimizeFocusBox('right');
  document.getElementById('focus-left').classList.remove('minimized');
  document.getElementById('focus-restore-left').style.display='none';
});
document.getElementById('focus-restore-right').addEventListener('click',()=>{
  if(isMobileLayout())minimizeFocusBox('left');
  document.getElementById('focus-right').classList.remove('minimized');
  document.getElementById('focus-restore-right').style.display='none';
});
// Mobil: Fokus-Fenster als Wisch-Panel. Kopfzeile nach oben ziehen = groß, nach unten = einklappen
function initFocusSwipe(boxId, side){
  const box=document.getElementById(boxId);
  const handle=box&&box.querySelector('.focus-header, .poi-header');
  if(!handle)return;
  let start=null;
  handle.addEventListener('pointerdown',e=>{
    if(!isMobileLayout()||e.target.closest('button,input'))return;
    start={y:e.clientY,id:e.pointerId};
    try{handle.setPointerCapture(e.pointerId);}catch(_){}
  });
  handle.addEventListener('pointermove',e=>{
    if(!start||e.pointerId!==start.id)return;
    const dy=e.clientY-start.y;
    box.style.transform=dy>0?`translateY(${Math.min(dy,200)}px)`:'';
  });
  const end=e=>{
    if(!start||e.pointerId!==start.id)return;
    const dy=e.clientY-start.y; start=null;
    box.style.transform='';
    if(dy>60){box.classList.remove('expanded');minimizeFocusBox(side);}
    else if(dy<-40){box.classList.add('expanded');}
    else if(Math.abs(dy)<6){box.classList.toggle('expanded');}
  };
  handle.addEventListener('pointerup',end);
  handle.addEventListener('pointercancel',end);
}
initFocusSwipe('focus-left','left');
initFocusSwipe('focus-right','right');
document.getElementById('btn-focus-exit')?.addEventListener('click',()=>{
  if(focusMode) exitFocusMode();
});
document.querySelectorAll('.toggle-row').forEach(row=>{
  row.addEventListener('click',()=>{
    const target=row.dataset.target;
    row.classList.toggle('active');
    const on=row.classList.contains('active');
    switch(target){
      case'orbits':orbitsGroup.visible=on;break;
      case'labels':labelRenderer.domElement.style.display=on?'':'none';break;
      case'moons':allMoons.forEach(m=>m.visible=on);break;
      case'moonOrbits':moonOrbitsGroup.visible=on;break;
      case'satellites':satelliteMeshes.forEach(s=>s.visible=on);break;
      case'asteroids':asteroidBelt.visible=on;beltsDirty=true;break;
      case'kuiper':kuiperBelt.visible=on;beltsDirty=true;break;
      case'comets':cometsGroup.visible=on;break;
      case'milkyway':milkyWaySphere.visible=on;break;
    }
  });
});
document.getElementById('speed-slider').addEventListener('input',function(){
  speedPresetIdx=Math.round(parseFloat(this.value));
  simSpeed=SPEED_PRESETS[speedPresetIdx]||1;
  updateSpeedLabels();
});

function tempLabel(t){return t<0.2?'Sehr warm':t<0.4?'Warm':t<0.6?'Ausgewogen':t<0.8?'Neutral':'Kalt';}
function applySunTemp(t){
  const warm=new THREE.Color(0xff9a44),balanced=new THREE.Color(0xfff6e0),cool=new THREE.Color(0xf0f8ff);
  let color;
  if(t<0.5)color=warm.clone().lerp(balanced,t*2);else color=balanced.clone().lerp(cool,(t-0.5)*2);
  sunLight.color.copy(color);
}
function applyCorona(){
  coronaSprites.forEach(s=>{
    if(s.userData.flare)return;
    s.material.opacity=s.userData.baseOp*lightState.corona;
    const sz=s.userData.baseSize*lightState.coronaSize;
    s.scale.set(sz,sz,1);
  });
}
function applyCometLights(){
  cometObjects.forEach(co=>{
    if(co.dustTail&&co.dustTail.material)co.dustTail.material.opacity=(co.dustTail.material.userData.baseOpacity||0.14)*lightState.cometTail;
    if(co.ionTail&&co.ionTail.material)co.ionTail.material.opacity=(co.ionTail.material.userData.baseOpacity||0.16)*lightState.cometTail;
    if(co.coma&&co.coma.material)co.coma.material.opacity=(co.coma.material.userData.baseOpacity||0.45)*lightState.cometComa;
    if(co.nucleus&&co.nucleus.material)co.nucleus.material.emissiveIntensity=0.25+0.4*lightState.cometCore;
  });
}
function applyStarLights(){
  const sm=window.__starMat;
  if(sm){sm.opacity=sm.userData.baseOpacity*lightState.stars;sm.size=sm.userData.baseSize*(0.7+0.3*lightState.stars);}
}
function applySatLights(){
  if(issMesh&&issMesh.material)issMesh.material.emissiveIntensity=lightState.satGlow;
  if(hubbleMesh&&hubbleMesh.material)hubbleMesh.material.emissiveIntensity=lightState.satGlow*0.6;
}
function collectLightSettings(){
  return {
    sunIntensity: +document.getElementById('sun-intensity').value,
    sunTemp: +document.getElementById('sun-temp').value,
    corona: +document.getElementById('corona').value,
    coronaSize: +document.getElementById('corona-size').value,
    exposure: +document.getElementById('exposure').value,
    ambient: +document.getElementById('ambient').value,
    hemi: +document.getElementById('hemi').value,
    bloom: +document.getElementById('bloom').value,
    milkyWay: +document.getElementById('mw-bright').value,
    stars: +document.getElementById('stars-bright').value,
    cometTail: +document.getElementById('comet-tail').value,
    cometComa: +document.getElementById('comet-coma').value,
    cometCore: +document.getElementById('comet-core').value,
    satGlow: +document.getElementById('sat-glow').value
  };
}
function applyLightSettings(s){
  if(s.sunIntensity!=null){sunLight.intensity=s.sunIntensity;document.getElementById('sun-intensity').value=s.sunIntensity;document.getElementById('sun-intensity-val').textContent=(+s.sunIntensity).toFixed(1);}
  if(s.sunTemp!=null){const t=s.sunTemp/100;document.getElementById('sun-temp').value=s.sunTemp;applySunTemp(t);document.getElementById('sun-temp-val').textContent=tempLabel(t);}
  if(s.corona!=null){lightState.corona=s.corona;document.getElementById('corona').value=s.corona;document.getElementById('corona-val').textContent=(+s.corona).toFixed(2);}
  if(s.coronaSize!=null){lightState.coronaSize=s.coronaSize;document.getElementById('corona-size').value=s.coronaSize;document.getElementById('corona-size-val').textContent=(+s.coronaSize).toFixed(2);}
  applyCorona();
  if(s.exposure!=null){renderer.toneMappingExposure=s.exposure;document.getElementById('exposure').value=s.exposure;document.getElementById('exposure-val').textContent=(+s.exposure).toFixed(2);}
  if(s.ambient!=null){ambientLight.intensity=s.ambient;document.getElementById('ambient').value=s.ambient;document.getElementById('ambient-val').textContent=(+s.ambient).toFixed(2);}
  if(s.hemi!=null){hemiLight.intensity=s.hemi;lightState.hemi=s.hemi;document.getElementById('hemi').value=s.hemi;document.getElementById('hemi-val').textContent=(+s.hemi).toFixed(2);}
  if(s.bloom!=null){bloomPass.strength=s.bloom;lightState.bloom=s.bloom;document.getElementById('bloom').value=s.bloom;document.getElementById('bloom-val').textContent=(+s.bloom).toFixed(2);}
  if(s.milkyWay!=null){lightState.mw=s.milkyWay;document.getElementById('mw-bright').value=s.milkyWay;document.getElementById('mw-val').textContent=(+s.milkyWay).toFixed(2);milkyWaySphere.visible=s.milkyWay>0.02;if(milkyWayMat.uniforms&&milkyWayMat.uniforms.uBright)milkyWayMat.uniforms.uBright.value=s.milkyWay;}
  if(s.stars!=null){lightState.stars=s.stars;document.getElementById('stars-bright').value=s.stars;document.getElementById('stars-val').textContent=(+s.stars).toFixed(2);applyStarLights();}
  if(s.cometTail!=null){lightState.cometTail=s.cometTail;document.getElementById('comet-tail').value=s.cometTail;document.getElementById('comet-tail-val').textContent=(+s.cometTail).toFixed(2);}
  if(s.cometComa!=null){lightState.cometComa=s.cometComa;document.getElementById('comet-coma').value=s.cometComa;document.getElementById('comet-coma-val').textContent=(+s.cometComa).toFixed(2);}
  if(s.cometCore!=null){lightState.cometCore=s.cometCore;document.getElementById('comet-core').value=s.cometCore;document.getElementById('comet-core-val').textContent=(+s.cometCore).toFixed(2);}
  if(s.cometTail!=null||s.cometComa!=null||s.cometCore!=null)applyCometLights();
  if(s.satGlow!=null){lightState.satGlow=s.satGlow;document.getElementById('sat-glow').value=s.satGlow;document.getElementById('sat-glow-val').textContent=(+s.satGlow).toFixed(2);applySatLights();}
}

document.getElementById('sun-intensity').addEventListener('input',function(){
  sunLight.intensity=parseFloat(this.value);
  document.getElementById('sun-intensity-val').textContent=parseFloat(this.value).toFixed(1);
});
document.getElementById('sun-temp').addEventListener('input',function(){
  const t=parseFloat(this.value)/100;
  applySunTemp(t);
  document.getElementById('sun-temp-val').textContent=tempLabel(t);
});
document.getElementById('corona').addEventListener('input',function(){
  lightState.corona=parseFloat(this.value);
  document.getElementById('corona-val').textContent=lightState.corona.toFixed(2);
  applyCorona();
});
document.getElementById('corona-size').addEventListener('input',function(){
  lightState.coronaSize=parseFloat(this.value);
  document.getElementById('corona-size-val').textContent=lightState.coronaSize.toFixed(2);
  applyCorona();
});
document.getElementById('exposure').addEventListener('input',function(){
  renderer.toneMappingExposure=parseFloat(this.value);
  document.getElementById('exposure-val').textContent=parseFloat(this.value).toFixed(2);
});
document.getElementById('ambient').addEventListener('input',function(){
  ambientLight.intensity=parseFloat(this.value);
  document.getElementById('ambient-val').textContent=parseFloat(this.value).toFixed(2);
});
document.getElementById('hemi').addEventListener('input',function(){
  hemiLight.intensity=parseFloat(this.value);
  lightState.hemi=parseFloat(this.value);
  document.getElementById('hemi-val').textContent=parseFloat(this.value).toFixed(2);
});
document.getElementById('bloom').addEventListener('input',function(){
  bloomPass.strength=parseFloat(this.value);
  lightState.bloom=parseFloat(this.value);
  document.getElementById('bloom-val').textContent=parseFloat(this.value).toFixed(2);
});
document.getElementById('mw-bright').addEventListener('input',function(){
  lightState.mw=parseFloat(this.value);
  document.getElementById('mw-val').textContent=lightState.mw.toFixed(2);
  milkyWaySphere.visible=lightState.mw>0.02;
  if(milkyWayMat.uniforms&&milkyWayMat.uniforms.uBright)milkyWayMat.uniforms.uBright.value=lightState.mw;
});
document.getElementById('stars-bright').addEventListener('input',function(){
  lightState.stars=parseFloat(this.value);
  document.getElementById('stars-val').textContent=lightState.stars.toFixed(2);
  applyStarLights();
});
document.getElementById('comet-tail').addEventListener('input',function(){
  lightState.cometTail=parseFloat(this.value);
  document.getElementById('comet-tail-val').textContent=lightState.cometTail.toFixed(2);
  applyCometLights();
});
document.getElementById('comet-coma').addEventListener('input',function(){
  lightState.cometComa=parseFloat(this.value);
  document.getElementById('comet-coma-val').textContent=lightState.cometComa.toFixed(2);
  applyCometLights();
});
document.getElementById('comet-core').addEventListener('input',function(){
  lightState.cometCore=parseFloat(this.value);
  document.getElementById('comet-core-val').textContent=lightState.cometCore.toFixed(2);
  applyCometLights();
});
document.getElementById('sat-glow').addEventListener('input',function(){
  lightState.satGlow=parseFloat(this.value);
  document.getElementById('sat-glow-val').textContent=lightState.satGlow.toFixed(2);
  applySatLights();
});
document.getElementById('btn-export-light').addEventListener('click',()=>{
  const settings=collectLightSettings();
  const text=JSON.stringify(settings,null,2);
  document.getElementById('light-export-box').value=text;
  const status=document.getElementById('light-export-status');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>{status.textContent='✓ In Zwischenablage kopiert – hier einfügen und senden';}).catch(()=>{status.textContent='Unten markieren und kopieren';});
  }else{status.textContent='Unten markieren und kopieren';}
});
const PRESETS={
  day:{sunIntensity:5.2,sunTemp:38,corona:1.35,coronaSize:1.15,exposure:0.95,ambient:0.1,hemi:0.12,bloom:0.22,milkyWay:0.85,stars:1.15,cometTail:0.85,cometComa:0.7,cometCore:0.6,satGlow:1.3},
  dawn:{sunIntensity:3.8,sunTemp:15,corona:1.5,coronaSize:1.25,exposure:0.92,ambient:0.09,hemi:0.11,bloom:0.26,milkyWay:0.75,stars:0.95,cometTail:1.2,cometComa:1.15,cometCore:1.1,satGlow:1.25},
  night:{sunIntensity:2.0,sunTemp:78,corona:0.7,coronaSize:0.9,exposure:0.75,ambient:0.05,hemi:0.06,bloom:0.12,milkyWay:1.25,stars:1.4,cometTail:0.95,cometComa:0.85,cometCore:0.9,satGlow:1.6},
  cinema:{sunIntensity:6.5,sunTemp:32,corona:1.55,coronaSize:1.3,exposure:1.1,ambient:0.07,hemi:0.08,bloom:0.32,milkyWay:0.7,stars:0.9,cometTail:1.35,cometComa:1.25,cometCore:1.3,satGlow:1.5}
};
document.querySelectorAll('.preset-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const p=PRESETS[btn.dataset.preset];if(!p)return;
    applyLightSettings(p);
  });
});
(function bootLights(){
  try{
    applySunTemp(0.38);
    applyCorona();
    applyCometLights();
    applyStarLights();
    applySatLights();
    if(milkyWayMat.uniforms&&milkyWayMat.uniforms.uBright)milkyWayMat.uniforms.uBright.value=0.85;
  }catch(e){}
})();

const syscheckOverlay=document.getElementById('syscheck-overlay');
document.getElementById('btn-syscheck').addEventListener('click',async()=>{
  syscheckOverlay.classList.add('show');renderCheckList();await runSystemCheck();renderCheckList();
});
document.getElementById('close-syscheck').addEventListener('click',()=>syscheckOverlay.classList.remove('show'));
syscheckOverlay.addEventListener('click',e=>{if(e.target===syscheckOverlay)syscheckOverlay.classList.remove('show');});
document.getElementById('btn-export-txt').addEventListener('click',exportLogTxt);
document.getElementById('btn-export-json').addEventListener('click',exportLogJson);
document.getElementById('btn-rerun-check').addEventListener('click',async()=>{renderCheckList();await runSystemCheck();renderCheckList();});
document.getElementById('btn-download-missing').addEventListener('click',()=>{
  const missing=ALL_TEXTURES.filter(t=>textureStatus[t.name]==='missing');
  if(missing.length===0)return;
  openDownloader();
});
document.getElementById('btn-back').addEventListener('click',exitFocusMode);
document.getElementById('poi-search-btn').addEventListener('click',()=>{
  if(!focusMode)return;
  renderPoiList(focusMode.pois,document.getElementById('poi-search-input').value);
});
document.getElementById('poi-search-input').addEventListener('input',function(){
  if(!focusMode)return;
  renderPoiList(focusMode.pois,this.value);
});

// SEARCH
const searchInput=document.getElementById('search-input');
const searchList=document.getElementById('search-list');
const searchResult=document.getElementById('search-result');
const searchIndex=[];
searchIndex.push({name:'Sonne',target:sunMesh});
PLANETS.forEach(pd=>{
  searchIndex.push({name:pd.name,target:pd._mesh});
  (MOON_DATA[pd.name]||[]).forEach(md=>{searchIndex.push({name:md.name,parentName:pd.name});});
});
searchIndex.push({name:'ISS',target:issMesh});
searchIndex.push({name:'Hubble',target:hubbleMesh});
COMETS.forEach(cd=>{searchIndex.push({name:cd.shortName,cometName:cd.name});});
searchIndex.forEach(item=>{const opt=document.createElement('option');opt.value=item.name;searchList.appendChild(opt);});
function normalize(str){return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');}
document.getElementById('btn-search').addEventListener('click',searchObject);
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();searchObject();}});
function searchObject(){
  const q=searchInput.value.trim();if(!q)return;
  const nq=normalize(q);
  let match=null;
  for(const it of searchIndex)if(normalize(it.name)===nq){match=it;break;}
  if(!match)for(const it of searchIndex)if(normalize(it.name).includes(nq)){match=it;break;}
  if(!match){searchResult.textContent='Nicht gefunden';searchResult.style.color='rgba(255,140,140,0.9)';return;}
  searchResult.textContent='Gefunden: '+match.name;
  searchResult.style.color='rgba(160,200,255,0.9)';
  if(match.cometName){const co=cometObjects.find(c=>c.data.name===match.cometName);if(co)enterFocusMode(co.nucleus);return;}
  let targetMesh=match.target;
  if(!targetMesh&&match.parentName){
    const parent=PLANETS.find(p=>p.name===match.parentName);
    if(parent){
      ensureMoons(parent);
      const moonObj=parent._moons.find(m=>m.data.name===match.name);
      if(moonObj)targetMesh=moonObj.mesh;
    }
  }
  if(targetMesh)enterFocusMode(targetMesh);
}

// QUICK NAV
(function buildPlanetList(){
  const list=document.getElementById('planet-list');
  if(!list)return;
  list.innerHTML='';
  function addGroup(title){
    const lab=document.createElement('div');
    lab.className='section-label nav-group';
    lab.textContent=title;
    list.appendChild(lab);
  }
  function addItem(it){
    const el=document.createElement('div');
    el.className='planet-item';
    el.innerHTML=`<div class="p-icon">${it.icon}</div><div><div class="p-name">${it.name}</div><div class="p-sub">${it.sub}</div></div>`;
    el.addEventListener('click',()=>{
      const mesh=typeof it.target==='function'?it.target():it.target;
      if(mesh)enterFocusMode(mesh);
    });
    list.appendChild(el);
  }
  addGroup('Stern');
  addItem({name:'Sonne',icon:'☉',sub:'Stern',target:()=>sunMesh});
  addGroup('Planeten');
  PLANETS.forEach(pd=>{
    addItem({name:pd.name,icon:(INFO_DATA[pd.name]||{}).icon||'○',sub:pd.isDwarf?'Zwergplanet':'Planet',target:()=>pd._mesh});
  });
  addGroup('Satelliten');
  addItem({name:'ISS',icon:'🛰️',sub:'Erdorbit',target:()=>issMesh});
  addItem({name:'Hubble',icon:'🔭',sub:'Weltraumteleskop',target:()=>hubbleMesh});
  addGroup('Monde');
  PLANETS.forEach(pd=>{
    (MOON_DATA[pd.name]||[]).forEach(md=>{
      addItem({
        name:md.name,
        icon:(INFO_DATA[md.name]||{}).icon||'☾',
        sub:'Mond · '+pd.name,
        target:()=>{
          const parent=PLANETS.find(p=>p.name===pd.name);
          if(!parent)return null;
          ensureMoons(parent);
          const m=parent._moons.find(x=>x.data.name===md.name);
          return m?m.mesh:null;
        }
      });
    });
  });
  addGroup('Kometen');
  COMETS.forEach(cd=>{
    addItem({
      name:cd.shortName,
      icon:'☄',
      sub:cd.name,
      target:()=>{
        const co=cometObjects.find(x=>x.data.shortName===cd.shortName||x.data.name===cd.name);
        return co?co.nucleus:null;
      }
    });
  });
})();

// NOTES
let notes=JSON.parse(localStorage.getItem(NOTES_KEY)||'[]');
let editingNoteId=null;

function saveNotes(){localStorage.setItem(NOTES_KEY,JSON.stringify(notes));try{fillRouteSelects();}catch(e){}}
function renderNotes(){
  const list=document.getElementById('notes-list');
  const empty=document.getElementById('notes-empty');
  if(!list)return;
  list.innerHTML='';
  if(notes.length===0){empty.classList.remove('hidden');return;}
  empty.classList.add('hidden');
  notes.slice().reverse().forEach(n=>{
    const card=document.createElement('div');
    card.className='note-card';
    const date=new Date(n.ts).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'});
    card.innerHTML=`<div class="note-card-title">${escapeHtml(n.title||'Ohne Titel')}</div>
      <div class="note-card-text">${escapeHtml(n.text||'')}</div>
      <div class="note-card-meta">${date}</div>
      <button class="note-card-del" title="Löschen"><svg class="ico" style="width:12px;height:12px"><use href="#i-trash"/></svg></button>`;
    card.addEventListener('click',e=>{
      if(e.target.closest('.note-card-del'))return;
      flyToNote(n);
    });
    card.querySelector('.note-card-del').addEventListener('click',e=>{
      e.stopPropagation();
      notes=notes.filter(x=>x.id!==n.id);
      saveNotes();renderNotes();
    });
    list.appendChild(card);
  });
}
function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function flyToNote(n){
  if(focusMode)exitFocusMode();
  camFlight={
    startTime:performance.now(),duration:1400,
    startCam:camera.position.clone(),
    endCam:new THREE.Vector3(n.cam.x,n.cam.y,n.cam.z),
    startTarget:controls.target.clone(),
    endTarget:new THREE.Vector3(n.target.x,n.target.y,n.target.z)
  };
}
function openNoteModal(note){
  editingNoteId=note?note.id:null;
  document.getElementById('note-modal-title').textContent=note?'Notiz bearbeiten':'Neue Notiz';
  document.getElementById('note-title-input').value=note?note.title:'';
  document.getElementById('note-text-input').value=note?note.text:'';
  document.getElementById('note-modal').classList.add('show');
  setTimeout(()=>document.getElementById('note-title-input').focus(),50);
}
function closeNoteModal(){document.getElementById('note-modal').classList.remove('show');editingNoteId=null;}
document.getElementById('btn-add-note').addEventListener('click',()=>openNoteModal(null));
document.getElementById('close-note-modal').addEventListener('click',closeNoteModal);
document.getElementById('btn-cancel-note').addEventListener('click',closeNoteModal);
document.getElementById('btn-save-note').addEventListener('click',()=>{
  const title=document.getElementById('note-title-input').value.trim()||'Ohne Titel';
  const text=document.getElementById('note-text-input').value.trim();
  const cam={x:camera.position.x,y:camera.position.y,z:camera.position.z};
  const target={x:controls.target.x,y:controls.target.y,z:controls.target.z};
  if(editingNoteId){
    const n=notes.find(x=>x.id===editingNoteId);
    if(n){n.title=title;n.text=text;n.cam=cam;n.target=target;n.ts=Date.now();}
  }else{
    notes.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),title,text,cam,target,ts:Date.now()});
  }
  saveNotes();renderNotes();closeNoteModal();
});
document.getElementById('note-modal').addEventListener('click',e=>{if(e.target.id==='note-modal')closeNoteModal();});
renderNotes();

// ============================================================
// FLOATING UI / ROUTE / PHOTO / THEME
// ============================================================
const UI_MODE_KEY='ss3d_ui_mode';
const UI_THEME_KEY='ss3d_theme';
const PANEL_POS_KEY='ss3d_panel_pos';

const ROUTE_AU_KM=149597870.7;
const BODY_AU={
  'Sonne':0,'Merkur':0.387,'Venus':0.723,'Erde':1,'Mond':1.00257,
  'Mars':1.524,'Ceres':2.77,'Jupiter':5.203,'Saturn':9.537,
  'Uranus':19.19,'Neptun':30.07,'Pluto':39.48,'Eris':67.8,'Haumea':43.1,'Makemake':45.8,'Styx':39.48,'Nix':39.48,'Kerberos':39.48,'Hydra':39.48,
  'Phobos':1.524,'Deimos':1.524,
  'Io':5.203,'Europa':5.203,'Ganymed':5.203,'Kallisto':5.203,'Amalthea':5.203,
  'Mimas':9.537,'Enceladus':9.537,'Tethys':9.537,'Dione':9.537,'Rhea':9.537,
  'Titan':9.537,'Hyperion':9.537,'Iapetus':9.537,'Phoebe':9.537,
  'Miranda':19.19,'Ariel':19.19,'Umbriel':19.19,'Titania':19.19,'Oberon':19.19,
  'Triton':30.07,'Nereid':30.07,'Proteus':30.07,
  'Charon':39.48,
  'ISS':1,'Hubble':1
};
COMETS.forEach(cd=>{
  const peri=cd.a&&cd.e!=null?(cd.a*(1-cd.e)):cd.a||5;
  BODY_AU[cd.shortName]=peri;
  BODY_AU[cd.name]=peri;
});

let routeLine=null,routeGlow=null,selectedRouteSpeed='walk';

function formatDuration(hours){
  if(!isFinite(hours)||hours<0)return '—';
  if(hours<1/60)return (hours*3600).toFixed(1)+' s';
  if(hours<1)return (hours*60).toFixed(1)+' min';
  if(hours<48)return hours.toFixed(1)+' h';
  const d=hours/24;
  if(d<365)return d.toFixed(1)+' Tage';
  const y=d/365.25;
  if(y<1000)return y.toFixed(2)+' Jahre';
  if(y<1e6)return (y/1000).toFixed(2)+' Tsd. Jahre';
  return (y/1e6).toFixed(2)+' Mio. Jahre';
}
function formatDist(km){
  if(km<1e6)return km.toLocaleString('de-DE',{maximumFractionDigits:0})+' km';
  const au=km/ROUTE_AU_KM;
  if(au<10)return au.toFixed(3)+' AE ('+ (km/1e6).toFixed(1)+' Mio. km)';
  return au.toFixed(2)+' AE';
}

function getBodyWorldPos(name){
  if(name&&name.startsWith('📝')){
    const title=name.replace(/^📝\s*/,'');
    const list=window.__routeNotes||notes||[];
    const n=list.find(x=>(x.title||'Notiz')===title);
    if(n&&n.cam) return new THREE.Vector3(n.cam.x,n.cam.y,n.cam.z);
    if(n&&n.pos) return new THREE.Vector3(n.pos.x,n.pos.y,n.pos.z);
    return null;
  }
  if(name==='Sonne'){const v=new THREE.Vector3();sunMesh.getWorldPosition(v);return v;}
  const pd=PLANETS.find(p=>p.name===name);
  if(pd&&pd._mesh){const v=new THREE.Vector3();pd._mesh.getWorldPosition(v);return v;}
  for(const p of PLANETS){
    const list=MOON_DATA[p.name]||[];
    if(!list.some(md=>md.name===name))continue;
    ensureMoons(p);
    const m=p._moons.find(x=>x.data.name===name);
    if(m){const v=new THREE.Vector3();m.mesh.getWorldPosition(v);return v;}
  }
  if(name==='ISS'&&issMesh){const v=new THREE.Vector3();issMesh.getWorldPosition(v);return v;}
  if(name==='Hubble'&&hubbleMesh){const v=new THREE.Vector3();hubbleMesh.getWorldPosition(v);return v;}
  const co=cometObjects.find(x=>x.data.shortName===name||x.data.name===name);
  if(co){const v=new THREE.Vector3();co.nucleus.getWorldPosition(v);return v;}
  return null;
}

function clearRouteVisual(){
  routeFlight=null;routeCurvePts=null;
  if(routeLine){scene.remove(routeLine);routeLine.geometry.dispose();routeLine.material.dispose();routeLine=null;}
  if(routeGlow){scene.remove(routeGlow);routeGlow.geometry.dispose();routeGlow.material.dispose();routeGlow=null;}
  controls.enabled = true;
}

let routeCurvePts=null;
let routeFlight=null;

function drawRoute(fromName,toName){
  clearRouteVisual();
  routeCurvePts=null;
  const a=getBodyWorldPos(fromName),b=getBodyWorldPos(toName);
  if(!a||!b)return null;
  const mid=a.clone().add(b).multiplyScalar(0.5);
  const lift=a.distanceTo(b)*0.15;
  mid.add(mid.clone().normalize().multiplyScalar(lift||0.5));
  const curve=new THREE.QuadraticBezierCurve3(a,mid,b);
  const pts=curve.getPoints(80);
  routeCurvePts=pts;
  const geo=new THREE.BufferGeometry().setFromPoints(pts);
  routeLine=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x66ddff,transparent:true,opacity:0.95}));
  scene.add(routeLine);
  const glowGeo=new THREE.BufferGeometry().setFromPoints(pts);
  routeGlow=new THREE.Line(glowGeo,new THREE.LineBasicMaterial({color:0xaaddff,transparent:true,opacity:0.25,linewidth:2}));
  scene.add(routeGlow);
  return pts;
}
function startRouteFlight(){
  if(!routeCurvePts||routeCurvePts.length<2)return;
  if(focusMode)exitFocusMode();
  const pts=routeCurvePts;
  const duration=Math.min(12000, Math.max(4000, pts[0].distanceTo(pts[pts.length-1])*180));
  routeFlight={
    startTime:performance.now(),
    duration,
    pts,
    startCam:camera.position.clone(),
    startTarget:controls.target.clone()
  };
  controls.enabled = false;
}
function updateRouteFlight(now){
  if(!routeFlight)return;
  const t=Math.min(1,(now-routeFlight.startTime)/routeFlight.duration);
  const e=t*t*(3-2*t);
  const pts=routeFlight.pts;
  const idx=e*(pts.length-1);
  const i=Math.floor(idx);
  const f=idx-i;
  const p0=pts[Math.min(i,pts.length-1)];
  const p1=pts[Math.min(i+1,pts.length-1)];
  const pos=p0.clone().lerp(p1,f);
  const lookIdx=Math.min(pts.length-1, i+Math.max(2,Math.floor((pts.length-1)*0.04)));
  const look=pts[lookIdx].clone();
  const outward = pos.clone().normalize();
  const upOffset = outward.multiplyScalar(Math.max(0.6, pos.length()*0.035));
  camera.position.copy(pos.clone().add(upOffset));
  camera.up.set(0,1,0);
  camera.lookAt(look);
  controls.target.copy(look);
  if(t>=1){
    routeFlight=null;
    controls.enabled = true;
    controls.update();
  }
}

function calcRoute(){
  const from=document.getElementById('route-from').value;
  const to=document.getElementById('route-to').value;
  const res=document.getElementById('route-result');
  if(!from||!to||from===to){
    res.classList.add('show');
    res.innerHTML='<div class="rr-title">Bitte Start und Ziel wählen</div>';
    return;
  }
  const auA=BODY_AU[from];
  const auB=BODY_AU[to];
  let km;
  if(auA!=null&&auB!=null){
    const diff=Math.abs(auA-auB);
    const sum=auA+auB;
    km=((diff+sum)*0.5)*ROUTE_AU_KM;
    if(diff<1e-6)km=Math.max(auA,0.001)*0.01*ROUTE_AU_KM;
  }else{
    const pa=getBodyWorldPos(from),pb=getBodyWorldPos(to);
    if(!pa||!pb){res.classList.add('show');res.innerHTML='<div class="rr-title">Position unbekannt</div>';return;}
    const simDist=pa.distanceTo(pb);
    km=(simDist/SCENE_AU)*ROUTE_AU_KM;
  }
  const chip=document.querySelector('.speed-chip.active');
  const kmh=chip?parseFloat(chip.dataset.kmh):5;
  const speedName=chip?chip.textContent.split('\n')[0].replace(/^\S+\s/,'').trim():'Zu Fuß';
  const hours=km/kmh;
  drawRoute(from,to);
  res.classList.add('show');
  res.innerHTML=`<div class="rr-title">${from} → ${to}</div>
    <div class="rr-row"><span>Distanz (ca.)</span><span class="rr-val">${formatDist(km)}</span></div>
    <div class="rr-row"><span>Tempo</span><span class="rr-val">${chip?chip.innerText.replace(/\s+/g,' '):'—'}</span></div>
    <div class="rr-row"><span>Reisezeit</span><span class="rr-val">${formatDuration(hours)}</span></div>
    <button type="button" class="action-btn full" id="btn-fly-route" style="margin-top:10px">✈ Route abfliegen</button>
    <div style="margin-top:8px;font-size:10.5px;opacity:0.7">Die Kurve zeigt die Verbindung in der 3D-Ansicht. Zeiten sind Näherungen.</div>`;
  const flyBtn=document.getElementById('btn-fly-route');
  if(flyBtn)flyBtn.addEventListener('click',()=>startRouteFlight());
}

function fillRouteSelects(){
  const groups=[];
  groups.push({label:'Stern',items:['Sonne']});
  groups.push({label:'Planeten',items:PLANETS.map(p=>p.name)});
  groups.push({label:'Satelliten',items:['ISS','Hubble']});
  const moonItems=[];
  Object.keys(MOON_DATA).forEach(parent=>{
    (MOON_DATA[parent]||[]).forEach(m=>moonItems.push(m.name));
  });
  groups.push({label:'Monde',items:[...new Set(moonItems)]});
  groups.push({label:'Kometen',items:COMETS.map(c=>c.shortName)});
  try{
    const nlist=JSON.parse(localStorage.getItem(NOTES_KEY)||'[]');
    if(nlist.length){
      groups.push({label:'Notizen',items:nlist.map(n=>'📝 '+ (n.title||'Notiz'))});
      window.__routeNotes=nlist;
    }
  }catch(e){window.__routeNotes=[];}

  function optionsHtml(){
    return groups.map(g=>{
      const opts=g.items.map(n=>`<option value="${n}">${n}</option>`).join('');
      return `<optgroup label="${g.label}">${opts}</optgroup>`;
    }).join('');
  }
  ['route-from','route-to'].forEach((id,i)=>{
    const sel=document.getElementById(id);
    if(!sel)return;
    const prev=sel.value;
    sel.innerHTML=optionsHtml();
    if(prev && [...sel.options].some(o=>o.value===prev)) sel.value=prev;
    else sel.value=i===0?'Erde':'Mars';
  });
}

document.querySelectorAll('.speed-chip').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.speed-chip').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedRouteSpeed=btn.dataset.speed;
  });
});
const btnCalc=document.getElementById('btn-calc-route');
if(btnCalc)btnCalc.addEventListener('click',calcRoute);
const btnClearR=document.getElementById('btn-clear-route');
if(btnClearR)btnClearR.addEventListener('click',()=>{clearRouteVisual();const r=document.getElementById('route-result');r.classList.remove('show');r.innerHTML='';});
fillRouteSelects();

// --- Floating panel system ---
const PANEL_DEFS=[
  {id:'nav',title:'Navigation',icon:'#i-planet'},
  {id:'demo',title:'Demo-Tour',icon:'#i-play'},
  {id:'view',title:'Anzeige',icon:'#i-eye'},
  {id:'sim',title:'Simulation',icon:'#i-clock'},
  {id:'light',title:'Licht-Studio',icon:'#i-light'},
  {id:'notes',title:'Notizen',icon:'#i-note'},
  {id:'events',title:'Ereignisse',icon:'#i-calendar'},
  {id:'route',title:'Route planen',icon:'#i-route'},
  {id:'tools',title:'Wartung',icon:'#i-wrench'}
];
const floatState={};
let dragInfo=null;

function loadPanelPos(){
  try{return JSON.parse(localStorage.getItem(PANEL_POS_KEY)||'{}');}catch(e){return {};}
}
function savePanelPos(){
  const out={};
  PANEL_DEFS.forEach(p=>{
    const st=floatState[p.id];
    if(st&&st.el)out[p.id]={x:parseFloat(st.el.style.left)||0,y:parseFloat(st.el.style.top)||0,closed:!!st.closed,minimized:!!st.minimized};
  });
  localStorage.setItem(PANEL_POS_KEY,JSON.stringify(out));
}

function buildFloatWindows(){
  const host=document.getElementById('float-host');
  const dock=document.getElementById('float-dock');
  if(!host)return;
  host.innerHTML='';
  dock.innerHTML='';
  const saved=loadPanelPos();
  PANEL_DEFS.forEach((def,i)=>{
    const section=document.querySelector(`.sb-section[data-panel="${def.id}"]`);
    if(!section)return;
    const win=document.createElement('div');
    win.className='float-win';
    win.dataset.panel=def.id;
    const pos=saved[def.id]||{};
    const defaultX=60+ (i%3)*20;
    const defaultY=12+ (i%4)*24;
    win.style.left=(pos.x!=null?pos.x:defaultX)+'px';
    win.style.top=(pos.y!=null?pos.y:defaultY)+'px';
    win.innerHTML=`<div class="float-hd" data-drag="${def.id}">
      <div class="fh-icon"><svg class="ico"><use href="${def.icon}"/></svg></div>
      <div class="fh-title">${def.title}</div>
      <button class="fh-btn" data-min="${def.id}" title="Minimieren"><svg class="ico"><use href="#i-minimize"/></svg></button>
      <button class="fh-btn close" data-close="${def.id}" title="Schließen"><svg class="ico"><use href="#i-close"/></svg></button>
    </div><div class="float-bd" data-bd="${def.id}"></div>`;
    host.appendChild(win);
    floatState[def.id]={el:win,closed:!!pos.closed,minimized:!!pos.minimized,section};
    if(pos.closed)win.style.display='none';
    if(pos.minimized){win.classList.add('minimized');addDockChip(def);}
  });
  host.addEventListener('pointerdown',onFloatPointerDown);
  host.addEventListener('click',onFloatClick);
}

function addDockChip(def){
  const dock=document.getElementById('float-dock');
  if([...dock.children].some(c=>c.dataset.panel===def.id))return;
  const chip=document.createElement('button');
  chip.className='dock-chip';
  chip.dataset.panel=def.id;
  chip.title=def.title;
  chip.innerHTML=`<svg class="ico"><use href="${def.icon}"/></svg>`;
  chip.addEventListener('click',()=>restoreFloat(def.id));
  dock.appendChild(chip);
}
function removeDockChip(id){
  const dock=document.getElementById('float-dock');
  [...dock.children].filter(c=>c.dataset.panel===id).forEach(c=>c.remove());
}
function moveSectionToFloat(id){
  const st=floatState[id];
  if(!st)return;
  const bd=st.el.querySelector('[data-bd="'+id+'"]');
  const section=document.querySelector(`.sb-section[data-panel="${id}"]`);
  if(section&&bd&&section.parentElement!==bd){
    while(section.firstChild)bd.appendChild(section.firstChild);
  }
}
function moveSectionToSidebar(id){
  const st=floatState[id];
  if(!st)return;
  const bd=st.el.querySelector('[data-bd="'+id+'"]');
  const section=document.querySelector(`.sb-section[data-panel="${id}"]`);
  if(section&&bd){
    while(bd.firstChild)section.appendChild(bd.firstChild);
  }
}
function onFloatPointerDown(e){
  const hd=e.target.closest('.float-hd');
  if(!hd||e.target.closest('.fh-btn'))return;
  const id=hd.dataset.drag;
  const st=floatState[id];
  if(!st)return;
  const win=st.el;
  dragInfo={
    id,
    ox:e.clientX-parseFloat(win.style.left||0),
    oy:e.clientY-parseFloat(win.style.top||0)
  };
  win.style.zIndex=200;
  const move=ev=>{
    if(!dragInfo)return;
    if(ev.cancelable)ev.preventDefault();
    let x=ev.clientX-dragInfo.ox,y=ev.clientY-dragInfo.oy;
    x=Math.max(0,Math.min(window.innerWidth-80,x));
    y=Math.max(0,Math.min(window.innerHeight-40,y));
    win.style.left=x+'px';win.style.top=y+'px';
  };
  const up=()=>{
    dragInfo=null;savePanelPos();
    window.removeEventListener('pointermove',move);
    window.removeEventListener('pointerup',up);
    window.removeEventListener('pointercancel',up);
  };
  window.addEventListener('pointermove',move,{passive:false});
  window.addEventListener('pointerup',up);
  window.addEventListener('pointercancel',up);
}
function onFloatClick(e){
  const min=e.target.closest('[data-min]');
  const cl=e.target.closest('[data-close]');
  if(min)minimizeFloat(min.dataset.min);
  if(cl)closeFloat(cl.dataset.close);
}
function minimizeFloat(id){
  const st=floatState[id];if(!st)return;
  st.minimized=true;st.el.classList.add('minimized');
  const def=PANEL_DEFS.find(p=>p.id===id);
  if(def)addDockChip(def);
  savePanelPos();
}
function closeFloat(id){
  const st=floatState[id];if(!st)return;
  st.closed=true;st.minimized=false;st.el.style.display='none';st.el.classList.remove('minimized');
  removeDockChip(id);
  savePanelPos();
}
function restoreFloat(id){
  const st=floatState[id];if(!st)return;
  st.closed=false;st.minimized=false;
  st.el.style.display='';st.el.classList.remove('minimized');
  st.el.style.zIndex=200;
  removeDockChip(id);
  savePanelPos();
}

function setFloatMode(on){
  const current = document.body.classList.contains('float-mode');
  if(!!on === current) return;

  document.body.classList.toggle('float-mode', on);
  localStorage.setItem(UI_MODE_KEY, on?'float':'sidebar');

  if(on){
    if(!Object.keys(floatState).length) buildFloatWindows();
    PANEL_DEFS.forEach(p => { try{ moveSectionToFloat(p.id); }catch(e){ console.warn(e); } });
    PANEL_DEFS.forEach(p => {
      const st = floatState[p.id];
      if(!st || !st.el) return;
      if(st.closed) st.el.style.display='none';
      else if(st.minimized){ st.el.classList.add('minimized'); addDockChip(p); }
      else { st.el.style.display=''; st.el.classList.remove('minimized'); }
    });
    document.getElementById('sidebar').classList.add('collapsed');
  } else {
    PANEL_DEFS.forEach(p => { try{ moveSectionToSidebar(p.id); }catch(e){ console.warn(e); } });
    const host = document.getElementById('float-host');
    const dock = document.getElementById('float-dock');
    if(host) host.innerHTML='';
    if(dock) dock.innerHTML='';
    Object.keys(floatState).forEach(k => delete floatState[k]);
    const sb = document.getElementById('sidebar');
    sb.classList.remove('collapsed');
    if(!document.querySelector('.sb-section.active')){
      const first = document.querySelector('.sb-section[data-panel="nav"]');
      if(first) first.classList.add('active');
      const firstTab = document.querySelector('.sb-tab[data-panel="nav"]');
      if(firstTab) firstTab.classList.add('active');
    }
  }
}

document.getElementById('btn-ui-mode').addEventListener('click', () => {
  if(matchMedia('(max-width:900px)').matches) return;
  try {
    setFloatMode(!document.body.classList.contains('float-mode'));
  } catch(err) {
    console.error('Float-Mode Fehler:', err);
    document.body.classList.remove('float-mode');
  }
});

function setTheme(light){
  document.body.classList.toggle('theme-light',light);
  localStorage.setItem(UI_THEME_KEY,light?'light':'dark');
}
document.getElementById('btn-theme').addEventListener('click',()=>{
  setTheme(!document.body.classList.contains('theme-light'));
});

document.getElementById('btn-hide-ui').addEventListener('click',()=>{
  document.body.classList.add('ui-hidden');
  document.getElementById('ui-reveal').style.display='flex';
});
document.getElementById('ui-reveal').addEventListener('click',()=>{
  document.body.classList.remove('ui-hidden');
  document.getElementById('ui-reveal').style.display='none';
});

document.getElementById('btn-photo').addEventListener('click',()=>{
  const wasHidden=document.body.classList.contains('ui-hidden');
  document.body.classList.add('ui-hidden');
  document.getElementById('ui-reveal').style.display='none';
  requestAnimationFrame(()=>{
    composer.render();
    labelRenderer.render(scene,camera);
    try{
      const url=renderer.domElement.toDataURL('image/png');
      const a=document.createElement('a');
      a.href=url;a.download=`sonnensystem-${ts()}.png`;
      document.body.appendChild(a);a.click();document.body.removeChild(a);
    }catch(err){console.warn(err);}
    if(!wasHidden){
      document.body.classList.remove('ui-hidden');
    }else{
      document.getElementById('ui-reveal').style.display='flex';
    }
  });
});

if(localStorage.getItem(UI_THEME_KEY)==='light')setTheme(true);
if(localStorage.getItem(UI_MODE_KEY)==='float' && !matchMedia('(max-width:900px)').matches){
  setTimeout(()=>setFloatMode(true),0);
}

// --- Full settings export/import ---
function collectAllSettings(){
  return {
    version:2,
    exportedAt:new Date().toISOString(),
    light: collectLightSettings(),
    ui:{mode:document.body.classList.contains('float-mode')?'float':'sidebar', theme:document.body.classList.contains('theme-light')?'light':'dark'},
    notes: JSON.parse(localStorage.getItem(NOTES_KEY)||'[]')
  };
}
const btnExportAll=document.getElementById('btn-export-all');
if(btnExportAll)btnExportAll.addEventListener('click',()=>{
  const data=collectAllSettings();
  dlFile(JSON.stringify(data,null,2),`sonnensystem-settings-${ts()}.json`,'application/json');
  try{navigator.clipboard.writeText(JSON.stringify(data,null,2));}catch(e){}
});
const btnImportAll=document.getElementById('btn-import-all');
const importFile=document.getElementById('import-file');
if(btnImportAll&&importFile){
  btnImportAll.addEventListener('click',()=>importFile.click());
  importFile.addEventListener('change',async()=>{
    const f=importFile.files&&importFile.files[0];
    if(!f)return;
    try{
      const text=await f.text();
      const data=JSON.parse(text);
      if(data.light) applyLightSettings(data.light);
      if(data.ui){
        if(data.ui.theme==='light') setTheme(true); else setTheme(false);
        if(data.ui.mode==='float' && !matchMedia('(max-width:900px)').matches) setFloatMode(true); else setFloatMode(false);
      }
      if(Array.isArray(data.notes)){
        notes=data.notes;
        saveNotes();
        renderNotes();
        fillRouteSelects();
      }
      addLog('Einstellungen importiert','ok');
    }catch(err){alert('Import fehlgeschlagen: '+err.message);}
    importFile.value='';
  });
}

// --- Tastatur ---
window.addEventListener('keydown',e=>{
  const tag=(e.target&&e.target.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea'||tag==='select')return;
  if(e.key==='Escape'){
    if(focusMode) exitFocusMode();
  } else if(e.key==='h'||e.key==='H'){
    if(document.body.classList.contains('ui-hidden')){
      document.body.classList.remove('ui-hidden');
      document.getElementById('ui-reveal').style.display='none';
    } else {
      document.body.classList.add('ui-hidden');
      document.getElementById('ui-reveal').style.display='flex';
    }
  } else if(e.key==='p'||e.key==='P'){
    document.getElementById('btn-photo').click();
  }
});

// --- Erster Besuch: Hinweis ausblenden ---
(function(){
  const key='ss3d_hint_seen';
  const hint=document.getElementById('controls-hint');
  if(!hint)return;
  if(localStorage.getItem(key)){
    hint.style.display='none';
  } else {
    const hide=()=>{hint.style.opacity='0';setTimeout(()=>{hint.style.display='none';},600);localStorage.setItem(key,'1');};
    setTimeout(hide,8000);
    hint.addEventListener('click',hide);
  }
})();

// Sidebar tab in float mode restores panel
document.querySelectorAll('.sb-tab[data-panel]').forEach(tab=>{
  tab.addEventListener('click',()=>{
    if(!document.body.classList.contains('float-mode'))return;
    const id=tab.dataset.panel;
    if(floatState[id])restoreFloat(id);
  });
});

// KLICK & DOPPELKLICK
const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();
function isMobileLayout(){return matchMedia('(max-width:900px)').matches;}
let clickTimeout=null,lastClickedObject=null;
// Tipp-Erkennung: nur Ein-Finger-Gesten ohne Bewegung zählen (Pinch/Zwei-Finger-Pan löst keinen Klick aus)
const activePointers=new Map();
let gesture=null;
const TAP_MOVE_PX=8, PICK_RADIUS_PX=matchMedia('(pointer: coarse)').matches?28:14;
renderer.domElement.addEventListener('pointerdown',e=>{
  activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(activePointers.size===1) gesture={x:e.clientX,y:e.clientY,t:performance.now(),multi:false,moved:false};
  else if(gesture) gesture.multi=true;
});
renderer.domElement.addEventListener('pointermove',e=>{
  if(!gesture||!activePointers.has(e.pointerId))return;
  if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>TAP_MOVE_PX)gesture.moved=true;
});
function endPointer(e){activePointers.delete(e.pointerId);if(activePointers.size===0&&e.type!=='pointerup')gesture=null;}
renderer.domElement.addEventListener('pointercancel',endPointer);
renderer.domElement.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')endPointer(e);});

function isShown(o){while(o){if(!o.visible)return false;o=o.parent;}return true;}
function setPointerNdc(clientX,clientY){
  const r=renderer.domElement.getBoundingClientRect();
  mouse.x=((clientX-r.left)/r.width)*2-1;
  mouse.y=-((clientY-r.top)/r.height)*2+1;
  return r;
}
// Erst exakter Raycast, sonst nächstes Objekt im Bildschirm-Radius (kleine Monde, ISS, Kometen)
const _pv=new THREE.Vector3();
function pickObject(list,clientX,clientY){
  const r=setPointerNdc(clientX,clientY);
  raycaster.setFromCamera(mouse,camera);
  const vis=list.filter(isShown);
  const hits=raycaster.intersectObjects(vis,false);
  if(hits.length>0)return hits[0].object;
  let best=null,bestD=PICK_RADIUS_PX;
  for(const o of vis){
    o.getWorldPosition(_pv);
    _pv.project(camera);
    if(_pv.z<-1||_pv.z>1)continue;
    const sx=r.left+(_pv.x+1)/2*r.width, sy=r.top+(1-_pv.y)/2*r.height;
    const d=Math.hypot(sx-clientX,sy-clientY);
    if(d<bestD){bestD=d;best=o;}
  }
  return best;
}
renderer.domElement.addEventListener('pointerup',e=>{
  const g=gesture;
  activePointers.delete(e.pointerId);
  if(activePointers.size===0)gesture=null;
  if(!g||g.multi||g.moved||activePointers.size>0)return;
  if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>TAP_MOVE_PX)return;
  // Mobil: Tipp in die Szene schließt ein offenes Menü-Panel
  const sbEl=document.getElementById('sidebar');
  if(isMobileLayout()&&sbEl&&!sbEl.classList.contains('collapsed')){
    sbEl.classList.add('collapsed');
    document.querySelectorAll('.sb-tab[data-panel]').forEach(t=>t.classList.remove('active'));
    return;
  }
  if(focusMode){
    const marker=focusMode.markers.length?(()=>{const m=pickObject(focusMode.markers.map(m=>m.mesh),e.clientX,e.clientY);return m&&focusMode.markers.find(x=>x.mesh===m);})():null;
    if(marker){
      document.querySelectorAll('.poi-item').forEach(i=>i.classList.remove('active'));
      document.querySelectorAll('.poi-item').forEach(it=>{const n=it.querySelector('.poi-name');if(n&&n.textContent===marker.poi.name)it.classList.add('active');});
      focusOnPoi(marker.poi);
    }
    return;
  }
  const obj=pickObject(clickableObjects,e.clientX,e.clientY);
  if(!obj)return;
  const name=obj.userData.planetName;

  // Haptisches Feedback
  if(navigator.vibrate) { try{ navigator.vibrate(8); }catch(e){} }

  if(lastClickedObject===obj){
    clearTimeout(clickTimeout);clickTimeout=null;lastClickedObject=null;
    enterFocusMode(obj);
    return;
  }
  lastClickedObject=obj;
  clearTimeout(clickTimeout);
  const delay=350;
  clickTimeout=setTimeout(()=>{previewObject=obj;showInfoPreview(name);lastClickedObject=null;},delay);
});
function showInfoPreview(name){
  if(!name)return;
  const info=INFO_DATA[name]||{icon:'○',name,subtitle:'Objekt',desc:'',fact:''};
  document.getElementById('info-glyph').textContent=info.icon||'○';
  document.getElementById('info-name').textContent=info.name||name;
  document.getElementById('info-subtitle').textContent=info.subtitle||'';
  document.getElementById('info-desc').textContent=info.desc||'';
  document.getElementById('info-panel').classList.add('show');
}
document.getElementById('close-info').addEventListener('click',()=>document.getElementById('info-panel').classList.remove('show'));
let previewObject=null;
document.getElementById('btn-info-focus')?.addEventListener('click',()=>{
  if(previewObject)enterFocusMode(previewObject);
});

// ANIMATION
let frameCount=0,lastFpsTime=performance.now();
let beltsDirty=true;
const _dirAway=new THREE.Vector3();
// Wenn es dauerhaft ruckelt: Auflösung schrittweise senken (bis 1.0)
let lowFpsSeconds=0;
function adaptQuality(fps){
  if(document.hidden)return;
  if(fps<28){lowFpsSeconds++;}else{lowFpsSeconds=0;}
  if(lowFpsSeconds>=3 && currentPixelRatio>1){
    currentPixelRatio=Math.max(1,+(currentPixelRatio-0.25).toFixed(2));
    renderer.setPixelRatio(currentPixelRatio);
    composer.setPixelRatio(currentPixelRatio);
    onResize();
    lowFpsSeconds=0;
    addLog(`Auflösung reduziert auf ${currentPixelRatio}× (niedrige FPS)`,'warn');
  }
}
const fpsEl=document.getElementById('fps-display');
let simTime=0;
const clock=new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);
  const dt=clock.getDelta();
  const vis=paused?0:(VISUAL_MULT[speedPresetIdx]||1);
  if(!paused){
    simTime+=dt*vis;
    simDate=new Date(simDate.getTime()+dt*1000*(SPEED_PRESETS[speedPresetIdx]||1));
    updateClockDisplay();
  }
  if(sunMat.uniforms&&sunMat.uniforms.uTime)sunMat.uniforms.uTime.value=performance.now()*0.001;
  updatePlanetPositions(simDate);
  const dtDays = paused ? 0 : (dt * (SPEED_PRESETS[speedPresetIdx]||1) / 86400);
  updatePlanetSpins(simDate, dtDays);
  PLANETS.forEach(pd=>{
    const isFocused=focusMode&&((focusMode.type==='planet'&&focusMode.name===pd.name)||(focusMode.type==='moon'&&focusMode.parentPlanet===pd.name));
    if(pd._mesh.userData.clouds)pd._mesh.userData.clouds.rotation.y+=0.0006*dt*60*(paused?0:1);
    if(pd._moons&&!isFocused)pd._moons.forEach(m=>{m.pivot.rotation.y+=m.data.speed*0.012*dt*60*vis;m.mesh.rotation.y+=0.01*dt*60*vis;});
  });
  issGroup.rotation.y+=0.08*dt*60*vis;issGroup.rotation.z=0.5;
  hubbleGroup.rotation.y-=0.06*dt*60*vis;hubbleGroup.rotation.z=-0.3;
  cometObjects.forEach(co=>{
    // Mittlere Anomalie aus Datum → exzentrische Anomalie (Kepler). Perihel liegt bei theta=0.
    const a=co.a,b=co.b,c=co.c;
    let Mc=((simDate.getTime()-co.tPeri)/co.periodMs)%1; if(Mc<0)Mc+=1;
    Mc=Mc*Math.PI*2; if(Mc>Math.PI)Mc-=Math.PI*2;
    const theta=solveKepler(Mc,co.e);
    const x=a*Math.cos(theta)-c;
    const z=b*Math.sin(theta);
    co.cometPivot.position.set(x,0,z);
    const r=Math.sqrt(x*x+z*z);
    const prox=Math.max(0.12,Math.min(1.0,5.5/Math.max(r,0.5)));
    const lenScale=0.55+1.3*prox;
    const dirAway=_dirAway.set(x,0,z).normalize();
    const dH=co.dustTail.userData.baseH*lenScale;
    const iH=co.ionTail.userData.baseH*lenScale*1.15;
    co.dustTail.scale.set(co.dustTail.userData.baseW*(0.8+0.4*prox), dH, 1);
    co.ionTail.scale.set(co.ionTail.userData.baseW*(0.7+0.35*prox), iH, 1);
    co.dustTail.position.copy(dirAway).multiplyScalar(dH*0.42);
    co.ionTail.position.copy(dirAway).multiplyScalar(iH*0.45);
    if(co.dustTail.material)co.dustTail.material.opacity=(co.dustTail.material.userData.baseOpacity||0.32)*lightState.cometTail*(0.4+0.4*prox);
    if(co.ionTail.material)co.ionTail.material.opacity=(co.ionTail.material.userData.baseOpacity||0.26)*lightState.cometTail*(0.35+0.4*prox);
    const cs=(co.coma.userData.baseScale||0.2)*(0.55+0.45*prox);
    co.coma.scale.set(cs,cs,1);
  });

  // Corona + Flare: flimmern, pulsieren, rotieren, wobbeln
  const tNow=performance.now()*0.001;
  coronaSprites.forEach(s=>{
    if(!s.userData.flare)return;
    const u = s.userData;
    const f1 = Math.sin(tNow * u.pulseSpeed + u.phase);
    const f2 = Math.sin(tNow * u.pulseSpeed * 1.7 + u.phase * 1.3);
    const f3 = Math.sin(tNow * u.pulseSpeed * 0.4 + u.phase * 0.7);
    const pulse = 0.55 + 0.25*f1 + 0.15*f2 + 0.05*f3;
    s.material.opacity = u.baseOp * lightState.corona * pulse;
    const sizeWob = 1 + 0.12*Math.sin(tNow*1.1 + u.phase*2.3) + 0.06*Math.sin(tNow*3.1 + u.phase*0.5);
    const sz = u.baseSize * lightState.coronaSize * sizeWob;
    s.scale.set(sz, sz, 1);
    s.material.rotation = tNow * u.rotSpeed + u.phase;
    const wob = Math.sin(tNow*2.3 + u.wobbleSeed);
    s.position.copy(u.wobbleAxis).multiplyScalar(wob * u.wobbleAmp * lightState.coronaSize);
  });

  // Gürtel nur neu berechnen, wenn sich etwas bewegt (vorher 4000 Matrizen pro Frame, auch bei Pause)
  const beltsMove = vis>0 || beltsDirty;
  beltsDirty = false;
  if(asteroidBelt.visible && beltsMove){
    for(let i=0;i<asteroidCount;i++){const a=asteroidData[i];a.angle+=a.rotSpeed*dt*vis;dummy.position.set(Math.cos(a.angle)*a.radius,a.yOffset,Math.sin(a.angle)*a.radius);dummy.rotation.set(a.angle*2,a.angle*3,a.angle);dummy.scale.setScalar(a.scale);dummy.updateMatrix();asteroidInstanced.setMatrixAt(i,dummy.matrix);}
    asteroidInstanced.instanceMatrix.needsUpdate=true;
  }
  if(kuiperBelt.visible && beltsMove){
    for(let i=0;i<kuiperCount;i++){const k=kuiperData[i];k.angle+=k.rotSpeed*dt*vis;dummy.position.set(Math.cos(k.angle)*k.radius,k.yOffset,Math.sin(k.angle)*k.radius);dummy.rotation.set(k.angle*2,k.angle*2,0);dummy.scale.setScalar(k.scale);dummy.updateMatrix();kuiperInstanced.setMatrixAt(i,dummy.matrix);}
    kuiperInstanced.instanceMatrix.needsUpdate=true;
  }
  updateCamFlight(performance.now());
  updateRouteFlight(performance.now());
  if(!routeFlight) controls.update();
  composer.render();
  labelRenderer.render(scene,camera);
  frameCount++;
  const now=performance.now();
  if(now-lastFpsTime>=1000){fpsEl.textContent='FPS: '+frameCount;adaptQuality(frameCount);frameCount=0;lastFpsTime=now;}
}

// ===== EREIGNISSE / ZEITSPRUNG =====
let eventFilter='all';
let selectedEvent=null;

function formatEventDate(iso){
  try{
    const d=new Date(iso);
    return d.toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'})+' UTC';
  }catch(e){return iso;}
}

function renderEventsList(){
  const list=document.getElementById('events-list');
  if(!list)return;
  const all=getEventsSorted();
  const filtered=all.filter(ev=>{
    if(eventFilter==='all')return true;
    if(eventFilter==='other')return !['eclipse_solar','eclipse_lunar','meteor','mission'].includes(ev.type);
    return ev.type===eventFilter;
  });
  list.innerHTML=filtered.map(ev=>{
    const t=EVENT_TYPES[ev.type]||{label:ev.type,icon:'•'};
    return `<div class="event-item" data-id="${ev.id}">
      <div class="ei-top"><span class="ei-type">${t.icon} ${t.label}</span><span class="ei-date">${formatEventDate(ev.date)}</span></div>
      <div class="ei-title">${escapeHtml(ev.title)}</div>
    </div>`;
  }).join('') || '<div class="media-empty">Keine Ereignisse</div>';
  list.querySelectorAll('.event-item').forEach(el=>{
    el.addEventListener('click',()=>{
      const ev=EVENTS.find(x=>x.id===el.dataset.id);
      if(ev) showEventDetail(ev);
    });
  });
}

function showEventDetail(ev){
  selectedEvent=ev;
  const box=document.getElementById('event-detail');
  if(!box)return;
  const t=EVENT_TYPES[ev.type]||{label:ev.type};
  const imgs=(ev.images||[]).map(im=>`<img src="${im.url}" alt="" loading="lazy" referrerpolicy="no-referrer"><div style="font-size:10px;opacity:0.6;margin-bottom:6px">${escapeHtml(im.title||'')} · ${escapeHtml(im.credit||'')}</div>`).join('');
  const vids=(ev.videos||[]).map(v=>`<a href="https://www.youtube.com/watch?v=${v.youtube}" target="_blank" rel="noopener">${escapeHtml(v.title)} (${v.lang||'en'}) ↗</a>`).join('');
  box.classList.remove('hidden');
  box.innerHTML=`
    <h4>${escapeHtml(ev.title)}</h4>
    <div class="ed-meta">${t.icon||''} ${t.label} · ${formatEventDate(ev.date)}<br>${escapeHtml(ev.visibility||'')}</div>
    <div class="ed-desc">${escapeHtml(ev.desc||'')}</div>
    ${ev.school?`<div class="ed-school"><b>Schule:</b> ${escapeHtml(ev.school)}</div>`:''}
    <div class="ed-actions">
      <button type="button" id="btn-event-jump">⏱ Zur Zeit springen</button>
      ${ev.demo?`<button type="button" class="secondary" id="btn-event-demo">🔭 Demo-Ausrichtung</button>`:''}
      ${(ev.bodies&&ev.bodies[0])?`<button type="button" class="secondary" id="btn-event-focus">Fokus ${escapeHtml(ev.bodies[0])}</button>`:''}
    </div>
    <div class="ed-media">${imgs}${vids?`<div class="ed-videos">${vids}</div>`:''}</div>
  `;
  document.getElementById('btn-event-jump')?.addEventListener('click',()=>jumpToEvent(ev,false));
  document.getElementById('btn-event-demo')?.addEventListener('click',()=>jumpToEvent(ev,true));
  document.getElementById('btn-event-focus')?.addEventListener('click',()=>{
    jumpToEvent(ev,false);
    const name=ev.bodies[0];
    const mesh=findMeshByName(name);
    if(mesh)enterFocusMode(mesh);
  });
}

function findMeshByName(name){
  if(name==='Sonne')return sunMesh;
  const p=PLANETS.find(x=>x.name===name);
  if(p)return p._mesh;
  for(const p of PLANETS){
    if((MOON_DATA[p.name]||[]).some(m=>m.name===name)){
      ensureMoons(p);
      const m=p._moons.find(x=>x.data.name===name);
      if(m)return m.mesh;
    }
  }
  const co=cometObjects.find(c=>c.data.shortName===name||c.data.name===name);
  if(co)return co.nucleus;
  if(name==='ISS')return issMesh;
  if(name==='Hubble')return hubbleMesh;
  return null;
}

function jumpToEvent(ev, withDemo){
  const d=new Date(ev.date);
  if(!isNaN(d.getTime())){
    simDate=d;
    updateClockDisplay();
    setPaused(true);
    updateSpeedLabels();
  }
  if(withDemo && ev.demo){
    applyEventDemo(ev);
  }
}

function applyEventDemo(ev){
  if(ev.demo==='solar_eclipse' || ev.demo==='lunar_eclipse'){
    ensureMoonsByName('Erde');
    const earth=PLANETS.find(p=>p.name==='Erde');
    if(earth){
      const wp=new THREE.Vector3();
      earth._mesh.getWorldPosition(wp);
      camFlight={
        startTime:performance.now(),duration:1400,
        startCam:camera.position.clone(),
        endCam:wp.clone().add(new THREE.Vector3(0,1.2,4)),
        startTarget:controls.target.clone(),
        endTarget:wp.clone()
      };
    }
  } else if(ev.demo==='opposition'){
    const body=ev.bodies&&ev.bodies[0];
    const mesh=findMeshByName(body);
    if(mesh)enterFocusMode(mesh);
  }
}

document.addEventListener('click',e=>{
  const f=e.target.closest('.ev-filter');
  if(!f)return;
  eventFilter=f.dataset.filter;
  document.querySelectorAll('.ev-filter').forEach(b=>b.classList.toggle('active',b===f));
  renderEventsList();
});

function initEventsUI(){ renderEventsList(); }

// ===== SIM CLOCK =====
const SPEED_LABELS=['Echtzeit (1:1)','1 Min/s','1 Std/s','1 Tag/s','1 Monat/s','1 Jahr/s'];
function updateSpeedLabels(){
  const idx=Math.max(0,Math.min(SPEED_LABELS.length-1, speedPresetIdx|0));
  const lab=SPEED_LABELS[idx]||(simSpeed+'×');
  const sv=document.getElementById('speed-val');
  if(sv)sv.textContent=lab;
  const cl=document.getElementById('clock-speed-label');
  if(cl)cl.textContent=(paused?'Pause · ':'')+lab;
  const sl=document.getElementById('speed-slider');
  if(sl&&String(sl.value)!==String(speedPresetIdx))sl.value=speedPresetIdx;
}
function updateClockDisplay(){
  const d=simDate;
  const dateEl=document.getElementById('clock-date');
  const timeEl=document.getElementById('clock-time');
  if(!dateEl||!timeEl)return;
  dateEl.textContent=d.toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
  timeEl.textContent=d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
function setPaused(p){
  paused=!!p;
  const play=document.getElementById('btn-clock-play');
  if(play)play.textContent=paused?'▶':'❚❚';
  const bp=document.getElementById('btn-pause');
  if(bp){
    bp.innerHTML=paused
      ?'<svg class="ico"><use href="#i-play"/></svg> <span class="btn-text">Weiter</span>'
      :'<svg class="ico"><use href="#i-pause"/></svg> <span class="btn-text">Pause</span>';
    bp.classList.toggle('active',paused);
  }
  updateSpeedLabels();
}
function openClockPicker(){
  const d=simDate;
  document.getElementById('cp-year').value=d.getFullYear();
  document.getElementById('cp-month').value=d.getMonth()+1;
  document.getElementById('cp-day').value=d.getDate();
  document.getElementById('cp-hour').value=d.getHours();
  document.getElementById('cp-min').value=d.getMinutes();
  document.getElementById('clock-picker').classList.remove('hidden');
}
function applyClockPicker(){
  const y=+document.getElementById('cp-year').value;
  const mo=+document.getElementById('cp-month').value;
  const da=+document.getElementById('cp-day').value;
  const h=+document.getElementById('cp-hour').value;
  const mi=+document.getElementById('cp-min').value;
  simDate=new Date(y,mo-1,da,h,mi,0);
  updateClockDisplay();
  document.getElementById('clock-picker').classList.add('hidden');
}
document.getElementById('sim-clock')?.addEventListener('click',openClockPicker);
document.getElementById('cp-close')?.addEventListener('click',()=>document.getElementById('clock-picker').classList.add('hidden'));
document.getElementById('cp-now')?.addEventListener('click',()=>{simDate=new Date();openClockPicker();});
document.getElementById('cp-apply')?.addEventListener('click',applyClockPicker);
document.getElementById('btn-clock-play')?.addEventListener('click',()=>setPaused(!paused));
document.getElementById('btn-speed-down')?.addEventListener('click',()=>{
  speedPresetIdx=Math.max(0,speedPresetIdx-1);
  simSpeed=SPEED_PRESETS[speedPresetIdx];
  updateSpeedLabels();
});
document.getElementById('btn-speed-up')?.addEventListener('click',()=>{
  speedPresetIdx=Math.min(SPEED_PRESETS.length-1,speedPresetIdx+1);
  simSpeed=SPEED_PRESETS[speedPresetIdx];
  updateSpeedLabels();
});
simSpeed=SPEED_PRESETS[0];
speedPresetIdx=0;
setPaused(true);
updateClockDisplay();
updateSpeedLabels();

// ===== DEMO-MODUS =====
const DEMO_SCRIPT = [
  { title:'Willkommen', text:'Tour durch das Sonnensystem. Positionen sind genäherte Echtzeit-Bahnen. Unten die Uhr zeigt „jetzt".', duration:6500, action:()=>{ try{exitFocusMode();}catch(e){} setPaused(true); simDate=new Date(); updateClockDisplay(); updatePlanetPositions(simDate); camFlight={startTime:performance.now(),duration:1800,startCam:camera.position.clone(),endCam:new THREE.Vector3(0,35,60),startTarget:controls.target.clone(),endTarget:new THREE.Vector3(0,0,0)}; }},
  { title:'Die Sonne', text:'Doppeltipp auf Objekte öffnet Infos. Tab „Schule": Texte für Haupt-, Real- und Gymnasium.', duration:7500, action:()=>{ enterFocusMode(sunMesh); }},
  { title:'Merkur', text:'Innerer Planet. Bei Echtzeit (1:1) bewegen sich die Bahnen sehr langsam – so ist es in der Realität.', duration:7000, action:()=>{ const m=PLANETS.find(p=>p.name==='Merkur'); if(m) enterFocusMode(m._mesh); }},
  { title:'Erde & Mond', text:'Unser Zuhause. Monde werden erst beim Fokus geladen. Galerie und Videos: rechtes Panel (Icons antippen).', duration:7500, action:()=>{ const m=PLANETS.find(p=>p.name==='Erde'); if(m){ ensureMoons(m); enterFocusMode(m._mesh);} }},
  { title:'Zeit & Ereignisse', text:'Uhr unten: Play und Geschwindigkeit. Menü „Ereignisse": Finsternisse mit Zeitsprung (z. B. 12.08.2026).', duration:8000, action:()=>{ try{exitFocusMode();}catch(e){} }},
  { title:'Ende', text:'UI ausblenden: Button „Aus" (Auge) unten in der Leiste oder Taste H. Foto: P. Demo unter „Demo" neu starten.', duration:6500, action:()=>{ try{exitFocusMode();}catch(e){} simDate=new Date(); updatePlanetPositions(simDate); updateClockDisplay(); }}
];
let demoState={active:false,index:0,paused:false,timer:null,stepStart:0};
function startDemo(){
  if(demoState.active) stopDemo();
  demoState={active:true,index:0,paused:false,timer:null,stepStart:performance.now()};
  document.getElementById('demo-overlay')?.classList.add('active');
  runDemoStep(0);
}
function stopDemo(){
  demoState.active=false;
  if(demoState.timer) clearTimeout(demoState.timer);
  document.getElementById('demo-overlay')?.classList.remove('active');
  setPaused(true);
}
function runDemoStep(i){
  if(!demoState.active)return;
  if(i<0)i=0;
  if(i>=DEMO_SCRIPT.length){ stopDemo(); return; }
  demoState.index=i;
  const step=DEMO_SCRIPT[i];
  const lab=document.getElementById('demo-step-label');
  if(lab)lab.textContent=`Schritt ${i+1} / ${DEMO_SCRIPT.length}`;
  const ti=document.getElementById('demo-title'); if(ti)ti.textContent=step.title;
  const te=document.getElementById('demo-text'); if(te)te.textContent=step.text;
  const bar=document.getElementById('demo-progress-bar'); if(bar)bar.style.width=((i+1)/DEMO_SCRIPT.length*100)+'%';
  const pb=document.getElementById('demo-pause'); if(pb)pb.textContent=demoState.paused?'Weiter':'Pause';
  try{ step.action&&step.action(); }catch(err){ console.warn(err); }
  demoState.stepStart=performance.now();
  if(demoState.timer) clearTimeout(demoState.timer);
  if(!demoState.paused) demoState.timer=setTimeout(()=>runDemoStep(i+1), step.duration);
}
function demoTogglePause(){
  if(!demoState.active)return;
  demoState.paused=!demoState.paused;
  const pb=document.getElementById('demo-pause'); if(pb)pb.textContent=demoState.paused?'Weiter':'Pause';
  if(demoState.paused){ if(demoState.timer) clearTimeout(demoState.timer); }
  else {
    const step=DEMO_SCRIPT[demoState.index];
    const left=Math.max(1200,(step.duration||6000)-(performance.now()-demoState.stepStart));
    demoState.timer=setTimeout(()=>runDemoStep(demoState.index+1), left);
  }
}
document.getElementById('btn-start-demo')?.addEventListener('click',startDemo);
document.getElementById('btn-demo-quick')?.addEventListener('click',()=>{
  // Bei Klick direkt starten (Rail-Tab muss nicht geöffnet werden)
  startDemo();
});
document.getElementById('demo-stop')?.addEventListener('click',stopDemo);
document.getElementById('demo-pause')?.addEventListener('click',demoTogglePause);
document.getElementById('demo-next')?.addEventListener('click',()=>{ if(demoState.active){ if(demoState.timer)clearTimeout(demoState.timer); runDemoStep(demoState.index+1);} });
document.getElementById('demo-prev')?.addEventListener('click',()=>{ if(demoState.active){ if(demoState.timer)clearTimeout(demoState.timer); runDemoStep(demoState.index-1);} });

document.getElementById('demo-progress')?.addEventListener('click',e=>{
  if(!demoState.active)return;
  const rect=e.currentTarget.getBoundingClientRect();
  const rel=(e.clientX-rect.left)/rect.width;
  const target=Math.round(rel*(DEMO_SCRIPT.length-1));
  if(demoState.timer)clearTimeout(demoState.timer);
  runDemoStep(target);
});

document.getElementById('btn-hide-ui')?.addEventListener('click',()=>{
  if(demoState.active)stopDemo();
});

// ===== ERSTER BESUCH: Sidebar öffnen =====
(function(){
  const key='ss3d_first_visit_seen';
  if(!localStorage.getItem(key)){
    // Auf dem Handy würde das Panel die ganze Szene verdecken
    if(matchMedia('(max-width:900px)').matches){localStorage.setItem(key,'1');return;}
    const sb=document.getElementById('sidebar');
    if(sb) sb.classList.remove('collapsed');
    localStorage.setItem(key,'1');
  }
})();

// ===== FOCUS HINT TOAST (nur einmalig) =====
(function(){
  const KEY = 'ss3d_focus_hint_seen';
  const panel = document.getElementById('focus-panel');
  if(!panel) return;
  const obs = new MutationObserver(()=>{
    if(panel.classList.contains('show') && !localStorage.getItem(KEY)){
      localStorage.setItem(KEY, '1');
      showFocusHint();
    }
  });
  obs.observe(panel, {attributes:true, attributeFilter:['class']});
})();

function showFocusHint(){
  const div = document.createElement('div');
  div.className = 'focus-hint-toast';
  div.innerHTML = `
    <b>Tipp:</b> Oben links <b>Info & Schule</b>, oben rechts <b>Orte & Medien</b> antippen.<br>
    <span style="opacity:0.8">Schultexte → Tab „🎓 Schule" · Videos → Tab „▶️ Videos"</span>
  `;
  document.body.appendChild(div);
  setTimeout(()=>div.classList.add('show'), 50);
  setTimeout(()=>{
    div.classList.remove('show');
    setTimeout(()=>div.remove(), 400);
  }, 6000);
}

try{initEventsUI();}catch(e){}
animate();

function onResize(){
  const w=document.documentElement.clientWidth;
  const h=document.documentElement.clientHeight;
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setSize(w,h);
  labelRenderer.setSize(w,h);
  composer.setSize(w,h);
}
addEventListener('resize',onResize);
addEventListener('orientationchange',()=>setTimeout(onResize,200));

if(matchMedia('(hover: none)').matches){
  document.getElementById('controls-hint').innerHTML='<b>1 Finger</b> drehen · <b>2 Finger</b> zoomen<br><b>2 Finger ziehen</b> verschieben<br><b>Doppeltipp</b> Fokus';
}

// DOWNLOADER
const dlOverlay=document.getElementById('downloader-overlay');
function openDownloader(){dlOverlay.classList.add('show');}
function closeDownloader(){dlOverlay.classList.remove('show');}
document.getElementById('close-downloader').addEventListener('click',closeDownloader);
dlOverlay.addEventListener('click',e=>{if(e.target===dlOverlay)closeDownloader();});
function createDlCard(tex,group){
  const card=document.createElement('div');
  card.className='dl-card';card.dataset.name=tex.name;
  card.innerHTML=`<div class="dl-icon">${tex.icon}</div><div class="dl-info"><div class="dl-name">${tex.name}</div><div class="dl-desc">${tex.desc}</div><div class="dl-progress"><div class="dl-progress-fill"></div></div><div class="dl-status"></div></div><button class="dl-btn" title="Herunterladen"><svg class="ico"><use href="#i-download"/></svg></button>`;
  const btn=card.querySelector('.dl-btn');
  const status=card.querySelector('.dl-status');
  const fill=card.querySelector('.dl-progress-fill');
  btn.addEventListener('click',()=>downloadOne(tex,btn,status,fill,card));
  document.getElementById(group).appendChild(card);
}
TEXTURES.earth.forEach(t=>createDlCard(t,'dl-grid-earth'));
TEXTURES.planets.forEach(t=>createDlCard(t,'dl-planets-grid'));
TEXTURES.moons.forEach(t=>createDlCard(t,'dl-grid-moons'));
async function downloadOne(tex,btn,status,fill,card){
  btn.disabled=true;btn.innerHTML='...';
  status.className='dl-status loading';status.textContent='Lade...';
  fill.style.width='30%';
  try{
    const r=await fetch(tex.url);if(!r.ok)throw new Error('HTTP '+r.status);
    const total=parseInt(r.headers.get('content-length')||'0',10);
    const reader=r.body.getReader();
    const chunks=[];let received=0;
    while(true){const{done,value}=await reader.read();if(done)break;chunks.push(value);received+=value.length;if(total>0){const pct=Math.min(100,Math.round(received/total*100));fill.style.width=pct+'%';status.textContent=`Lade... ${pct}%`;}}
    const blob=new Blob(chunks);
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=tex.name;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url),3000);
    btn.innerHTML='<svg class="ico"><use href="#i-check"/></svg>';
    status.className='dl-status ok';status.textContent='Fertig';
    fill.style.width='100%';card.classList.add('done');
  }catch(err){
    btn.innerHTML='<svg class="ico"><use href="#i-warn"/></svg>';
    btn.disabled=false;
    status.className='dl-status err';status.textContent='Fehler';
    fill.style.width='0%';
  }
}
async function downloadGroup(list){
  for(const tex of list){
    const card=document.querySelector(`.dl-card[data-name="${tex.name}"]`);
    if(!card||card.classList.contains('done'))continue;
    const btn=card.querySelector('.dl-btn');
    const status=card.querySelector('.dl-status');
    const fill=card.querySelector('.dl-progress-fill');
    await downloadOne(tex,btn,status,fill,card);
    await new Promise(r=>setTimeout(r,250));
  }
}
document.getElementById('dl-all').addEventListener('click',async()=>{await downloadGroup(TEXTURES.earth);await downloadGroup(TEXTURES.planets);await downloadGroup(TEXTURES.moons);});
document.getElementById('dl-earth').addEventListener('click',()=>downloadGroup(TEXTURES.earth));
document.getElementById('dl-planets').addEventListener('click',()=>downloadGroup(TEXTURES.planets));
document.getElementById('dl-moons').addEventListener('click',()=>downloadGroup(TEXTURES.moons));
// PWA: Service Worker registrieren (nur über http/https, nicht bei file://)
if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
  addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(err=>console.warn('Service Worker:',err));});
}
