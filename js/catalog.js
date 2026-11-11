// Catalogo dei percorsi. I moduli con `file` hanno già contenuti, gli altri sono in arrivo.
export const TRACKS = [
  {
    id: 'ai', title: 'AI e LLM, dalle fondamenta', icon: '🧠', accent: 'violet',
    blurb: 'Dalla matematica ai transformer, fino a immagini, video, audio e multimodali.',
    modules: [
      { id: 'ai0', title: 'Matematica: ripasso lampo', blurb: 'Vettori, matrici, derivate, probabilità e softmax: gli attrezzi che servono dopo.', minutes: 60, file: 'ai0' },
      { id: 'ai1', title: 'Machine learning', blurb: 'Loss, gradient descent, overfitting, generalizzazione.' },
      { id: 'ai2', title: 'Reti neurali', blurb: 'Neuroni, backpropagation, embeddings.' },
      { id: 'ai3', title: 'LLM e transformer', blurb: 'Tokenizzazione, attention, pretraining, fine-tuning, RLHF, inferenza, RAG, agenti.' },
      { id: 'ai4', title: 'Modelli per immagini', blurb: 'CNN, VAE, GAN, diffusion, CLIP, text-to-image.' },
      { id: 'ai5', title: 'Video', blurb: 'Diffusion temporale e coerenza tra frame.' },
      { id: 'ai6', title: 'Audio', blurb: 'Spettrogrammi, riconoscimento vocale, sintesi vocale.' },
      { id: 'ai7', title: 'Vision e multimodali', blurb: 'Come un modello vede e unisce testo, immagini e audio.' },
      { id: 'ai8', title: "AI nei prodotti da vendere", blurb: 'Costi, allucinazioni, valutazione, licenze di modelli e dati.' },
    ],
  },
  {
    id: 'sec', title: 'Vibecoding e sicurezza', icon: '🛡️', accent: 'cyan',
    blurb: 'Progettare app con AI e proteggerle: segreti, auth, privacy, normativa.',
    modules: [
      { id: 'sec1', title: 'Come funziona il web', blurb: 'Client/server, API, database, deploy.' },
      { id: 'sec2', title: 'Vibecoding fatto bene', blurb: "Progettare con l'AI e dove sbaglia." },
      { id: 'sec3', title: 'Sicurezza applicativa', blurb: 'Segreti, auth, RLS, OWASP Top 10, prompt injection, dipendenze.' },
      { id: 'sec4', title: 'Privacy e normativa', blurb: 'GDPR, cookie e consenso, analytics, font ed embed esterni, privacy policy.' },
      { id: 'sec5', title: 'Vendere un prodotto', blurb: 'Pagamenti, licenze, responsabilità, checklist pre-lancio.' },
    ],
  },
];

const cache = {};
export async function loadModule(meta) {
  if (!meta.file) return null;
  if (!cache[meta.id]) {
    const mod = (await import(`../content/${meta.file}.js`)).default;
    mod.lessons.forEach((l, li) => {
      l.id = `${mod.id}.${li + 1}`;
      l.quiz.forEach((q, qi) => (q.id = `${l.id}.q${qi + 1}`));
    });
    mod.exam.forEach((q, qi) => (q.id = `${mod.id}.e${qi + 1}`));
    cache[meta.id] = mod;
  }
  return cache[meta.id];
}

export function allModules() { return TRACKS.flatMap(t => t.modules.map(m => ({ ...m, track: t.id }))); }
export function findModule(id) { return allModules().find(m => m.id === id); }
export function findTrack(id) { return TRACKS.find(t => t.id === id); }
export async function loadAvailable() {
  return Promise.all(allModules().filter(m => m.file).map(loadModule));
}
