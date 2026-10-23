// Bahnmechanik: Kepler-Gleichung und Positionen aus Bahnelementen (J2000-Näherung)
import * as THREE from 'three';

export const SCENE_AU = 7.0;
export const J2000 = Date.UTC(2000,0,1,12,0,0);

export function julianDaysSinceJ2000(date){ return (date.getTime() - J2000) / 86400000; }
export function deg2rad(d){ return d * Math.PI / 180; }
export function rad2deg(r){ return r * 180 / Math.PI; }
export function solveKepler(M, e){
  // Für sehr exzentrische Bahnen (Kometen) von ±π starten, sonst divergiert Newton
  let E = e<0.8 ? M : (M>=0 ? Math.PI : -Math.PI);
  for(let i=0;i<40;i++){
    const d = E - e*Math.sin(E) - M;
    E -= d / (1 - e*Math.cos(E));
    if(Math.abs(d)<1e-8)break;
  }
  return E;
}
export function keplerPosition(el, date){
  const d = julianDaysSinceJ2000(date);
  const n = 360 / el.period;
  const L = (el.L + n * d) % 360;
  const M = deg2rad(((L - el.ϖ + 540) % 360) - 180);
  return orbitPointFromE(el, solveKepler(M, el.e));
}
// Punkt auf der (geneigten, exzentrischen) Bahn für eine exzentrische Anomalie E
export function orbitPointFromE(el, E){
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

