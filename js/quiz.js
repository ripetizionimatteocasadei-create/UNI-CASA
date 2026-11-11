import { recordAnswer } from './store.js';
import { renderMath } from './util.js';

const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const parseNum = s => parseFloat(String(s).trim().replace(',', '.'));
const isOk = (q, v) => Math.abs(v - q.answer) <= (q.tol ?? Math.max(0.01 * Math.abs(q.answer), 1e-9));

function prepare(q) {
  if (q.type !== 'mcq') return q;
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map(i => q.options[i]), answer: order.indexOf(q.answer) };
}

/**
 * Esegue un quiz dentro `root`.
 * exam=true: nessun feedback durante la prova, revisione alla fine.
 * onDone(correct, total) viene chiamata a fine quiz (una sola volta).
 */
export function runQuiz(root, questions, { exam = false, title = 'Quiz', onDone, doneLabel } = {}) {
  const qs = shuffle(questions).map(prepare);
  const answers = [];
  let i = 0;

  const header = () => `<div class="qhead"><span>${title}</span><span class="mono">${i + 1}/${qs.length}</span></div>
    <div class="progress"><i style="width:${(i / qs.length) * 100}%"></i></div>`;

  function show() {
    const q = qs[i];
    root.innerHTML = `<div class="quiz fade">${header()}<div class="qtext">${q.q}</div><div class="qbody"></div><div class="qfeed"></div></div>`;
    const body = root.querySelector('.qbody');
    if (q.type === 'mcq') {
      body.innerHTML = q.options.map((o, k) => `<button class="opt" data-k="${k}"><kbd>${k + 1}</kbd><span>${o}</span></button>`).join('');
      body.querySelectorAll('.opt').forEach(b => b.onclick = () => submit(+b.dataset.k, body));
    } else {
      body.innerHTML = `<form class="numform"><input inputmode="decimal" autocomplete="off" placeholder="la tua risposta" autofocus><button class="btn">Verifica</button></form>`;
      const f = body.querySelector('form'), inp = f.querySelector('input');
      f.onsubmit = e => { e.preventDefault(); const v = parseNum(inp.value); if (Number.isNaN(v)) return; submit(v, body); };
      setTimeout(() => inp.focus(), 30);
    }
    renderMath(root);
  }

  function submit(val, body) {
    const q = qs[i];
    const ok = q.type === 'mcq' ? val === q.answer : isOk(q, val);
    answers.push({ q, val, ok });
    recordAnswer(q.id, ok);
    if (exam) return next();
    body.querySelectorAll('button, input').forEach(el => (el.disabled = true));
    if (q.type === 'mcq') body.querySelectorAll('.opt').forEach((b, k) => {
      if (k === q.answer) b.classList.add('right'); else if (k === val) b.classList.add('wrong');
    });
    const feed = root.querySelector('.qfeed');
    feed.innerHTML = `<div class="feedback ${ok ? 'ok' : 'ko'}"><b>${ok ? 'Corretto' : 'Non esattamente'}</b>${!ok && q.type === 'num' ? ` · risposta: <span class="mono">${q.answer}</span>` : ''}<p>${q.explain || ''}</p></div>
      <button class="btn next">${i + 1 < qs.length ? 'Avanti →' : 'Vedi il risultato'}</button>`;
    feed.querySelector('.next').onclick = next;
    feed.querySelector('.next').focus();
    renderMath(feed);
  }

  function next() { i++; i < qs.length ? show() : finish(); }

  function finish() {
    const correct = answers.filter(a => a.ok).length, total = qs.length, pct = Math.round((correct / total) * 100);
    const review = answers.filter(a => !a.ok || exam).map(a => `<li class="${a.ok ? 'ok' : 'ko'}"><div>${a.q.q}</div>
      <small>${a.ok ? '✔' : '✘'} ${a.q.type === 'mcq' ? `Risposta giusta: ${a.q.options[a.q.answer]}` : `Risposta giusta: <span class="mono">${a.q.answer}</span>`}</small>
      <p>${a.q.explain || ''}</p></li>`).join('');
    root.innerHTML = `<div class="quiz fade result">
      <div class="score ${pct >= 70 ? 'good' : pct >= 50 ? 'mid' : 'bad'}"><b>${correct}/${total}</b><span>${pct}%</span></div>
      <p class="lead">${pct >= 90 ? 'Ottimo, concetti solidi.' : pct >= 70 ? 'Bene. Rivedi gli errori e vai avanti.' : 'Da rinforzare: rileggi la lezione e riprova.'}</p>
      ${doneLabel ? `<div class="doneLabel">${doneLabel(correct, total)}</div>` : ''}
      ${review ? `<details ${exam ? 'open' : ''}><summary>${exam ? 'Revisione delle risposte' : 'Cosa rivedere'}</summary><ul class="review">${review}</ul></details>` : ''}
      <div class="btnrow"><button class="btn retry">Riprova</button></div></div>`;
    renderMath(root);
    root.querySelector('.retry').onclick = () => runQuiz(root, questions, { exam, title, onDone, doneLabel });
    onDone?.(correct, total);
  }

  show();
}
