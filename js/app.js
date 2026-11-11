import { TRACKS, loadModule, findModule, findTrack, loadAvailable } from './catalog.js';
import * as store from './store.js';
import { runQuiz } from './quiz.js';
import { widgets } from './widgets.js';
import { esc, renderMath, voto } from './util.js';

const view = document.getElementById('view');
const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

/* ---------- helpers progressi ---------- */
const lessonDone = id => (store.getState().lessons[id]?.best ?? 0) >= 0.6;
function moduleProgress(mod) {
  const done = mod.lessons.filter(l => lessonDone(l.id)).length;
  return { done, total: mod.lessons.length, exam: store.getState().exams[mod.id] };
}
function ring(p, size = 56) {
  const r = 22, c = 2 * Math.PI * r;
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 56 56"><circle cx="28" cy="28" r="${r}"/><circle class="v" cx="28" cy="28" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}"/><text x="28" y="32" text-anchor="middle">${p}%</text></svg>`;
}

/* ---------- viste ---------- */
async function home() {
  const mods = await loadAvailable();
  const ids = mods.flatMap(m => [...m.lessons.flatMap(l => l.quiz), ...m.exam].map(q => q.id));
  const due = store.dueIds(ids).length;
  const cards = TRACKS.map(t => {
    const avail = t.modules.filter(m => m.file);
    let done = 0, tot = 0;
    for (const m of avail) { const mod = mods.find(x => x.id === m.id); const p = moduleProgress(mod); done += p.done; tot += p.total; }
    const p = pct(done, tot || 1);
    return `<a class="card track ${t.accent}" href="#/t/${t.id}">
      <div class="icon">${t.icon}</div><div class="grow"><h3>${t.title}</h3><p>${t.blurb}</p>
      <small>${avail.length}/${t.modules.length} moduli disponibili</small></div>${ring(avail.length ? p : 0)}</a>`;
  }).join('');
  view.innerHTML = `<section class="hero fade"><h1>Capire davvero<br><span class="grad">come funziona l'AI</span></h1>
    <p class="lead">Lezioni a schede, quiz, esercizi e verifiche con voto. Un passo alla volta, dalle basi in su.</p></section>
    <section class="grid fade">${cards}</section>
    <section class="fade"><a class="card review ${due ? 'hot' : ''}" href="#/review"><div class="icon">🔁</div><div class="grow"><h3>Ripasso di oggi</h3>
      <p>${due ? `${due} domande da rivedere (ripasso a intervalli)` : 'Niente in scadenza. Quando sbagli o rispondi, le domande tornano al momento giusto.'}</p></div><span class="chev">→</span></a></section>`;
}

async function track(id) {
  const t = findTrack(id); if (!t) return notFound();
  const rows = [];
  for (const m of t.modules) {
    if (m.file) {
      const mod = await loadModule(m), p = moduleProgress(mod);
      rows.push(`<a class="card mod" href="#/m/${m.id}"><div class="grow"><h3>${m.title}</h3><p>${m.blurb}</p>
        <div class="progress"><i style="width:${pct(p.done, p.total)}%"></i></div>
        <small>${p.done}/${p.total} lezioni · ~${m.minutes} min${p.exam ? ` · verifica: <b>${voto(p.exam.best * 100)}/30</b>` : ''}</small></div><span class="chev">→</span></a>`);
    } else {
      rows.push(`<div class="card mod soon"><div class="grow"><h3>${m.title}</h3><p>${m.blurb}</p><small>In arrivo</small></div></div>`);
    }
  }
  view.innerHTML = `<div class="fade"><a class="back" href="#/">← Percorsi</a><h1>${t.icon} ${t.title}</h1><p class="lead">${t.blurb}</p><div class="list">${rows.join('')}</div></div>`;
}

async function module_(id) {
  const meta = findModule(id); if (!meta) return notFound();
  const mod = await loadModule(meta);
  if (!mod) return notFound();
  const p = moduleProgress(mod);
  const lessons = mod.lessons.map((l, i) => {
    const s = store.getState().lessons[l.id];
    return `<a class="card lesson" href="#/l/${mod.id}/${i + 1}"><span class="num ${s && s.best >= 0.6 ? 'done' : ''}">${s && s.best >= 0.6 ? '✓' : i + 1}</span>
      <div class="grow"><h3>${l.title}</h3><small>~${l.minutes} min · ${l.quiz.length} domande${s ? ` · miglior risultato ${Math.round(s.best * 100)}%` : ''}</small></div><span class="chev">→</span></a>`;
  }).join('');
  const ex = p.exam;
  view.innerHTML = `<div class="fade"><a class="back" href="#/t/${mod.track}">← Percorso</a><h1>${mod.title}</h1><p class="lead">${mod.subtitle}</p>
    <div class="list">${lessons}</div>
    <a class="card exam" href="#/exam/${mod.id}"><div class="icon">🎓</div><div class="grow"><h3>Verifica finale</h3>
      <p>${mod.exam.length} domande senza aiuti, con voto in trentesimi.</p>
      <small>${ex ? `Miglior voto: <b>${voto(ex.best * 100)}/30</b> · tentativi: ${ex.runs}` : p.done < p.total ? 'Consigliato dopo aver completato le lezioni' : 'Pronto'}</small></div><span class="chev">→</span></a></div>`;
}

async function lesson(modId, n) {
  const mod = await loadModule(findModule(modId)); if (!mod) return notFound();
  const l = mod.lessons[n - 1]; if (!l) return notFound();
  const blocks = l.blocks.map(blockHtml).join('');
  view.innerHTML = `<article class="fade lesson-page"><a class="back" href="#/m/${mod.id}">← ${mod.title}</a>
    <div class="eyebrow">Lezione ${n} di ${mod.lessons.length}</div><h1>${l.title}</h1>${blocks}
    <section class="quizbox"><h2>Metti alla prova</h2><div id="quizRoot"></div></section>
    <div class="pager">${n > 1 ? `<a class="btn ghost" href="#/l/${mod.id}/${n - 1}">← Precedente</a>` : '<span></span>'}
      ${n < mod.lessons.length ? `<a class="btn" href="#/l/${mod.id}/${n + 1}">Prossima lezione →</a>` : `<a class="btn" href="#/exam/${mod.id}">Verifica finale →</a>`}</div></article>`;
  view.querySelectorAll('[data-widget]').forEach(el => widgets[el.dataset.widget]?.(el));
  renderMath(view);
  runQuiz(document.getElementById('quizRoot'), l.quiz, {
    title: 'Quiz di lezione',
    onDone: (c, t) => store.recordLesson(l.id, c / t),
    doneLabel: (c, t) => (c / t >= 0.6 ? '✅ Lezione completata' : 'Serve almeno il 60% per segnare la lezione come completata'),
  });
}

function blockHtml(b) {
  switch (b.t) {
    case 'p': return `<p>${b.x}</p>`;
    case 'h': return `<h2>${b.x}</h2>`;
    case 'ul': return `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    case 'math': return `<div class="mathblock">\\[${b.x}\\]</div>`;
    case 'def': return `<div class="def"><span class="tag">Definizione</span><b>${b.term}</b><p>${b.x}</p></div>`;
    case 'quote': return `<blockquote>${b.x}${b.by ? `<cite>${b.by}</cite>` : ''}</blockquote>`;
    case 'why': return `<div class="why"><span class="tag">Perché ti serve</span><p>${b.x}</p></div>`;
    case 'widget': return `<figure class="widget"><div data-widget="${b.name}"></div>${b.cap ? `<figcaption>${b.cap}</figcaption>` : ''}</figure>`;
    default: return '';
  }
}

async function exam(modId) {
  const mod = await loadModule(findModule(modId)); if (!mod) return notFound();
  view.innerHTML = `<div class="fade"><a class="back" href="#/m/${mod.id}">← ${mod.title}</a><h1>Verifica finale</h1>
    <p class="lead">${mod.exam.length} domande, nessun feedback durante la prova. Il voto compare alla fine.</p><div id="quizRoot"></div></div>`;
  runQuiz(document.getElementById('quizRoot'), mod.exam, {
    exam: true, title: mod.title,
    onDone: (c, t) => store.recordExam(mod.id, c / t),
    doneLabel: (c, t) => `<div class="voto">Voto: <b>${voto(pct(c, t))}/30</b></div>`,
  });
}

async function review() {
  const mods = await loadAvailable();
  const all = mods.flatMap(m => [...m.lessons.flatMap(l => l.quiz), ...m.exam]);
  const dueSet = new Set(store.dueIds(all.map(q => q.id)));
  const due = all.filter(q => dueSet.has(q.id));
  view.innerHTML = `<div class="fade"><h1>Ripasso</h1><p class="lead">${due.length ? `${due.length} domande in scadenza.` : 'Nessuna domanda in scadenza adesso.'}</p><div id="quizRoot"></div></div>`;
  if (due.length) runQuiz(document.getElementById('quizRoot'), due, { title: 'Ripasso' });
  else document.getElementById('quizRoot').innerHTML = `<div class="card"><p>Completa una lezione: ogni domanda rientra nel ripasso dopo 5 ore, 1, 3, 7, 16 e 35 giorni (si azzera se sbagli).</p><a class="btn" href="#/">Vai ai percorsi</a></div>`;
}

async function stats() {
  const mods = await loadAvailable();
  const s = store.getState();
  const att = Object.values(s.attempts);
  const right = att.reduce((a, x) => a + x.right, 0), wrong = att.reduce((a, x) => a + x.wrong, 0);
  const rows = mods.map(m => {
    const p = moduleProgress(m);
    return `<tr><td>${m.title}</td><td>${p.done}/${p.total}</td><td>${p.exam ? `<b>${voto(p.exam.best * 100)}/30</b>` : '—'}</td></tr>`;
  }).join('');
  const taken = mods.map(m => s.exams[m.id]).filter(Boolean);
  const media = taken.length ? (taken.reduce((a, e) => a + voto(e.best * 100), 0) / taken.length).toFixed(1) : '—';
  view.innerHTML = `<div class="fade"><h1>Voti e progressi</h1>
    <div class="grid stats"><div class="card stat"><b>${media}</b><span>media verifiche /30</span></div>
    <div class="card stat"><b>${att.length}</b><span>domande incontrate</span></div>
    <div class="card stat"><b>${pct(right, right + wrong)}%</b><span>risposte corrette</span></div></div>
    <table class="tbl"><thead><tr><th>Modulo</th><th>Lezioni</th><th>Verifica</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

async function account() {
  const u = store.getUser(), conf = store.supabaseConfigured();
  const stat = { local: 'solo su questo browser', syncing: 'sincronizzazione…', synced: 'sincronizzato ✓', error: 'errore di sincronizzazione' }[store.getSyncStatus()];
  if (!conf) {
    view.innerHTML = `<div class="fade"><h1>Account</h1><div class="card"><p>Supabase non è ancora configurato: i progressi restano <b>solo in questo browser</b>.</p>
      <p>Per salvarli online e usarli da più dispositivi: crea un progetto Supabase, esegui <code>supabase/schema.sql</code> e inserisci URL e anon key in <code>js/config.js</code>. Istruzioni nel README.</p></div></div>`;
    return;
  }
  if (u) {
    view.innerHTML = `<div class="fade"><h1>Account</h1><div class="card"><p>Connesso come <b>${esc(u.email)}</b></p><p>Stato: <b>${stat}</b></p>
      <div class="btnrow"><button class="btn ghost" id="out">Esci</button></div></div></div>`;
    document.getElementById('out').onclick = () => store.signOut();
    return;
  }
  view.innerHTML = `<div class="fade"><h1>Accedi</h1><form class="card auth" id="af"><label>Email<input type="email" name="email" required autocomplete="email"></label>
    <label>Password<input type="password" name="password" required minlength="8" autocomplete="current-password"></label>
    <div class="btnrow"><button class="btn" data-m="in">Accedi</button><button class="btn ghost" data-m="up">Registrati</button></div><p class="msg" id="msg"></p></form></div>`;
  const f = document.getElementById('af'), msg = document.getElementById('msg');
  f.onsubmit = async e => {
    e.preventDefault();
    const mode = e.submitter?.dataset.m || 'in', d = new FormData(f);
    msg.textContent = '…';
    if (mode === 'in') { const err = await store.signIn(d.get('email'), d.get('password')); msg.textContent = err || ''; if (!err) location.hash = '#/'; }
    else { const r = await store.signUp(d.get('email'), d.get('password')); msg.textContent = r.error || (r.needsConfirm ? 'Controlla la mail per confermare, poi accedi.' : 'Registrato.'); if (!r.error && !r.needsConfirm) location.hash = '#/'; }
  };
}

function notFound() { view.innerHTML = '<div class="fade"><h1>Pagina non trovata</h1><a class="btn" href="#/">Torna ai percorsi</a></div>'; }

/* ---------- router ---------- */
const routes = [
  [/^#\/?$/, home], [/^#\/t\/(\w+)$/, track], [/^#\/m\/(\w+)$/, module_],
  [/^#\/l\/(\w+)\/(\d+)$/, (m, n) => lesson(m, +n)], [/^#\/exam\/(\w+)$/, exam],
  [/^#\/review$/, review], [/^#\/stats$/, stats], [/^#\/account$/, account],
];
let renderToken = 0;
async function route() {
  const h = location.hash || '#/', token = ++renderToken;
  const section = h === '#/' ? 'home' : ['review', 'stats', 'account'].find(k => h.startsWith('#/' + k)) || 'home';
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.dataset.nav === section));
  for (const [re, fn] of routes) {
    const m = h.match(re);
    if (m) { try { await fn(...m.slice(1)); } catch (e) { console.error(e); view.innerHTML = `<div class="fade"><h1>Errore</h1><pre>${esc(e.message)}</pre></div>`; } break; }
  }
  if (token === renderToken) window.scrollTo({ top: 0 });
}

async function updateChrome() {
  const link = document.getElementById('accountLink'), u = store.getUser();
  link.textContent = u ? `${u.email.split('@')[0]} · ${store.getSyncStatus() === 'synced' ? '●' : '○'}` : 'Account';
  const mods = await loadAvailable();
  const n = store.dueIds(mods.flatMap(m => [...m.lessons.flatMap(l => l.quiz), ...m.exam].map(q => q.id))).length;
  const b = document.getElementById('dueBadge'); b.hidden = !n; b.textContent = n;
}

window.addEventListener('hashchange', route);
store.subscribe(() => { updateChrome(); if (location.hash === '#/account') route(); });
route();
updateChrome();
store.initAuth().then(() => { updateChrome(); if (location.hash === '#/account') route(); });
