// Hilfsfunktionen: Log für den Systemcheck, Datei-Downloads, HTML-Escaping
// ===== LOG SYSTEM =====
export const logs = [];
export function addLog(msg, type='info') {
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
export function clearLog(){logs.length=0;const la=document.getElementById('log-area');if(la)la.innerHTML='';document.getElementById('log-count').textContent='0 Zeilen';}
export function exportLogTxt(){const h=`Sonnensystem - Systemcheck\n${new Date().toLocaleString('de-DE')}\n${location.href}\n\n`;const c=logs.map(l=>`[${l.time}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');dlFile(h+c,`systemcheck-${ts()}.txt`,'text/plain');}
export function exportLogJson(){const d={timestamp:new Date().toISOString(),url:location.href,userAgent:navigator.userAgent,log:logs};dlFile(JSON.stringify(d,null,2),`systemcheck-${ts()}.json`,'application/json');}
export function dlFile(c,f,m){const b=new Blob([c],{type:m});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=f;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),2000);}
export function ts(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}-${String(d.getMinutes()).padStart(2,'0')}`;}

export function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
