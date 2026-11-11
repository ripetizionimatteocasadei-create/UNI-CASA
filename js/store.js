import { CONFIG } from './config.js';

const KEY = 'uni-casa-progress-v1';
const DAY = 86400000;
const INTERVALS = [0.2, 1, 3, 7, 16, 35]; // giorni, ripasso a intervalli (Leitner)

const empty = () => ({ attempts: {}, lessons: {}, exams: {}, updated: 0 });
let state = load();
let sb = null;
let user = null;
let syncStatus = 'local'; // local | syncing | synced | error
let syncTimer = null;
const listeners = new Set();

function load() {
  try { return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return empty(); }
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
function emit() { listeners.forEach(f => f()); }
export function subscribe(f) { listeners.add(f); return () => listeners.delete(f); }

function save() {
  state.updated = Date.now();
  persist();
  scheduleSync();
  emit();
}

function newest(x, y, key) { return !x ? y : !y ? x : (x[key] >= y[key] ? x : y); }
function merge(a, b) {
  const out = empty();
  for (const k of new Set([...Object.keys(a.attempts), ...Object.keys(b.attempts)]))
    out.attempts[k] = newest(a.attempts[k], b.attempts[k], 'last');
  for (const k of new Set([...Object.keys(a.lessons), ...Object.keys(b.lessons)]))
    out.lessons[k] = newest(a.lessons[k], b.lessons[k], 'best');
  for (const k of new Set([...Object.keys(a.exams), ...Object.keys(b.exams)]))
    out.exams[k] = newest(a.exams[k], b.exams[k], 'best');
  out.updated = Math.max(a.updated || 0, b.updated || 0);
  return out;
}

/* ---------- progressi ---------- */
export const getState = () => state;

export function recordAnswer(qid, ok) {
  const a = state.attempts[qid] || { box: 0, right: 0, wrong: 0 };
  a.last = Date.now();
  if (ok) { a.right++; a.box = Math.min(a.box + 1, INTERVALS.length - 1); }
  else { a.wrong++; a.box = 0; }
  a.due = a.last + INTERVALS[a.box] * DAY;
  state.attempts[qid] = a;
  save();
}

export function recordLesson(id, score) {
  const prev = state.lessons[id];
  state.lessons[id] = {
    best: Math.max(score, prev?.best ?? 0),
    runs: (prev?.runs ?? 0) + 1,
    date: Date.now(),
  };
  save();
}

export function recordExam(moduleId, score) {
  const prev = state.exams[moduleId];
  state.exams[moduleId] = {
    best: Math.max(score, prev?.best ?? 0),
    lastScore: score,
    runs: (prev?.runs ?? 0) + 1,
    date: Date.now(),
  };
  save();
}

export function dueIds(ids) {
  const now = Date.now();
  return ids.filter(id => state.attempts[id] && state.attempts[id].due <= now);
}

export function resetAll() { state = empty(); save(); }

/* ---------- Supabase ---------- */
export const supabaseConfigured = () => !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
export const getUser = () => user;
export const getSyncStatus = () => syncStatus;

export async function initAuth() {
  if (!supabaseConfigured()) return;
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');
    sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    const { data } = await sb.auth.getSession();
    await setUser(data.session?.user ?? null);
    sb.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
  } catch (e) {
    console.error('Supabase non disponibile', e);
    syncStatus = 'error';
    emit();
  }
}

async function setUser(u) {
  const changed = (u?.id ?? null) !== (user?.id ?? null);
  user = u;
  if (u && changed) await pull();
  syncStatus = u ? syncStatus : 'local';
  emit();
}

async function pull() {
  syncStatus = 'syncing'; emit();
  const { data, error } = await sb.from('progress').select('data').eq('user_id', user.id).maybeSingle();
  if (error) { syncStatus = 'error'; emit(); return; }
  if (data?.data) { state = merge(state, data.data); persist(); }
  await push();
}

async function push() {
  if (!sb || !user) return;
  syncStatus = 'syncing'; emit();
  const { error } = await sb.from('progress').upsert({
    user_id: user.id, data: state, updated_at: new Date().toISOString(),
  });
  syncStatus = error ? 'error' : 'synced';
  if (error) console.error(error);
  emit();
}

function scheduleSync() {
  if (!sb || !user) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(push, 1200);
}

export async function signIn(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return error?.message ?? null;
}
export async function signUp(email, password) {
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return { error: error.message };
  return { needsConfirm: !data.session };
}
export async function signOut() { await sb.auth.signOut(); }
