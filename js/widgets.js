// Widget interattivi usati dalle lezioni: { t:'widget', name:'dot' }
const C = { bg: '#10131d', grid: '#222840', a: '#8b7cff', b: '#22d3ee', ok: '#34d399', warn: '#fb7185', text: '#aab2d0' };

function canvas(el, w, h) {
  const c = document.createElement('canvas');
  const r = window.devicePixelRatio || 1;
  c.width = w * r; c.height = h * r; c.style.width = '100%'; c.style.maxWidth = w + 'px'; c.style.aspectRatio = `${w}/${h}`;
  const g = c.getContext('2d'); g.scale(r, r);
  el.appendChild(c);
  return { c, g, w, h };
}
function slider(el, label, min, max, step, val, fmt, on) {
  const row = document.createElement('label');
  row.className = 'slider';
  row.innerHTML = `<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${val}"><output></output>`;
  const inp = row.querySelector('input'), out = row.querySelector('output');
  const upd = () => { out.textContent = fmt(+inp.value); on(+inp.value); };
  inp.addEventListener('input', upd);
  el.appendChild(row); out.textContent = fmt(val);
  return { set: v => { inp.value = v; upd(); }, get: () => +inp.value };
}
function arrow(g, x0, y0, x1, y1, color, w = 3) {
  g.strokeStyle = g.fillStyle = color; g.lineWidth = w; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  const a = Math.atan2(y1 - y0, x1 - x0);
  g.beginPath(); g.moveTo(x1, y1);
  g.lineTo(x1 - 11 * Math.cos(a - 0.4), y1 - 11 * Math.sin(a - 0.4));
  g.lineTo(x1 - 11 * Math.cos(a + 0.4), y1 - 11 * Math.sin(a + 0.4)); g.fill();
}

export const widgets = {
  dot(el) {
    const { g, w, h } = canvas(el, 520, 280);
    const info = document.createElement('div'); info.className = 'readout mono';
    let angA = 20, angB = 70, lenB = 1.2;
    const S = 95, ox = w / 2, oy = h / 2 + 10;
    const draw = () => {
      g.fillStyle = C.bg; g.fillRect(0, 0, w, h);
      g.strokeStyle = C.grid; g.lineWidth = 1;
      for (let x = ox % 40; x < w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = oy % 40; y < h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      const ra = angA * Math.PI / 180, rb = angB * Math.PI / 180;
      const a = [Math.cos(ra), Math.sin(ra)], b = [lenB * Math.cos(rb), lenB * Math.sin(rb)];
      arrow(g, ox, oy, ox + a[0] * S, oy - a[1] * S, C.a);
      arrow(g, ox, oy, ox + b[0] * S, oy - b[1] * S, C.b);
      g.font = '14px Inter'; g.fillStyle = C.a; g.fillText('a (lunghezza 1)', ox + a[0] * S + 8, oy - a[1] * S);
      g.fillStyle = C.b; g.fillText('b', ox + b[0] * S + 8, oy - b[1] * S);
      const dot = a[0] * b[0] + a[1] * b[1], cos = dot / (1 * lenB);
      info.innerHTML = `a·b = <b style="color:${dot < 0 ? C.warn : C.ok}">${dot.toFixed(3)}</b> &nbsp; |a||b|cosθ = ${lenB.toFixed(2)}·cos(${((angB - angA + 360) % 360).toFixed(0)}°) &nbsp; cos θ = <b>${cos.toFixed(3)}</b>`;
    };
    slider(el, 'angolo di a', 0, 360, 1, angA, v => v + '°', v => { angA = v; draw(); });
    slider(el, 'angolo di b', 0, 360, 1, angB, v => v + '°', v => { angB = v; draw(); });
    slider(el, 'lunghezza di b', 0.2, 2, 0.05, lenB, v => v.toFixed(2), v => { lenB = v; draw(); });
    el.appendChild(info); draw();
  },

  gd(el) {
    const { g, w, h } = canvas(el, 520, 260);
    const info = document.createElement('div'); info.className = 'readout mono';
    let lr = 0.2, x = 3, trail = [3];
    const f = v => v * v, X0 = -4, X1 = 4, Y1 = 16;
    const px = v => 20 + (v - X0) / (X1 - X0) * (w - 40), py = v => h - 20 - Math.min(v, Y1 * 1.2) / Y1 * (h - 40);
    const draw = () => {
      g.fillStyle = C.bg; g.fillRect(0, 0, w, h);
      g.strokeStyle = C.grid; g.beginPath(); g.moveTo(px(0), 0); g.lineTo(px(0), h); g.stroke();
      g.strokeStyle = C.a; g.lineWidth = 2.5; g.beginPath();
      for (let v = X0; v <= X1; v += 0.05) (v === X0 ? g.moveTo : g.lineTo).call(g, px(v), py(f(v)));
      g.stroke();
      trail.forEach((v, i) => {
        g.fillStyle = i === trail.length - 1 ? C.warn : C.b; g.globalAlpha = i === trail.length - 1 ? 1 : 0.5;
        g.beginPath(); g.arc(px(v), py(f(v)), i === trail.length - 1 ? 7 : 4, 0, 7); g.fill();
      }); g.globalAlpha = 1;
      const diverge = Math.abs(x) > 50;
      info.innerHTML = `f(x)=x² &nbsp; x = <b>${diverge ? '∞ (diverge)' : x.toFixed(4)}</b> &nbsp; f'(x)=2x &nbsp; fattore per passo = |1−2η| = <b style="color:${Math.abs(1 - 2 * lr) < 1 ? C.ok : C.warn}">${Math.abs(1 - 2 * lr).toFixed(2)}</b>`;
    };
    const step = () => { x = x - lr * 2 * x; trail.push(Math.max(-4, Math.min(4, x))); if (trail.length > 40) trail.shift(); draw(); };
    const lrS = slider(el, 'learning rate η', 0.01, 1.2, 0.01, lr, v => v.toFixed(2), v => { lr = v; draw(); });
    const row = document.createElement('div'); row.className = 'btnrow';
    row.innerHTML = '<button class="btn">Un passo</button><button class="btn">10 passi</button><button class="btn ghost">Reset</button>';
    const [b1, b10, br] = row.querySelectorAll('button');
    b1.onclick = step; b10.onclick = () => { for (let i = 0; i < 10; i++) step(); };
    br.onclick = () => { x = 3; trail = [3]; draw(); };
    el.appendChild(row); el.appendChild(info); draw(); void lrS;
  },

  softmax(el) {
    const bars = document.createElement('div'); bars.className = 'bars';
    const info = document.createElement('div'); info.className = 'readout mono';
    const names = ['gatto', 'cane', 'pizza', 'luna'];
    const z = [2.0, 1.0, 0.2, -1.0]; let T = 1;
    const draw = () => {
      const e = z.map(v => Math.exp(v / T)), s = e.reduce((a, b) => a + b, 0), p = e.map(v => v / s);
      const H = -p.reduce((a, v) => a + (v > 0 ? v * Math.log2(v) : 0), 0);
      bars.innerHTML = p.map((v, i) => `<div class="bar"><span>${names[i]}</span><div class="track"><i style="width:${(v * 100).toFixed(1)}%"></i></div><b class="mono">${(v * 100).toFixed(1)}%</b></div>`).join('');
      info.innerHTML = `Σp = ${p.reduce((a, b) => a + b, 0).toFixed(3)} &nbsp; entropia = <b>${H.toFixed(2)}</b> bit (max ${Math.log2(4)})`;
    };
    names.forEach((n, i) => slider(el, `logit «${n}»`, -4, 6, 0.1, z[i], v => v.toFixed(1), v => { z[i] = v; draw(); }));
    slider(el, 'temperatura T', 0.1, 3, 0.05, T, v => v.toFixed(2), v => { T = v; draw(); });
    el.appendChild(bars); el.appendChild(info); draw();
  },
};
