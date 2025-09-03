// /src/i18n/i18n.js
let currentLang = null;
let dict = {};

const HAS_VITE_GLOB = typeof import.meta !== 'undefined' && typeof import.meta.glob === 'function';
const dictLoaders = HAS_VITE_GLOB ? import.meta.glob('./*.json') : null;

const SKIP_TEXT_TAGS = new Set(['HTML','HEAD','BODY','META','LINK','SCRIPT','STYLE']);

// ---- utils ----
function getFromDict(key) {
  if (!key) return null;
  if (dict && Object.prototype.hasOwnProperty.call(dict, key) && typeof dict[key] === 'string') {
    return dict[key];
  }
  const parts = key.split('.');
  let cur = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
    else return null;
  }
  return typeof cur === 'string' ? cur : null;
}

function setHtmlLang(lang) {
  try { document.documentElement.setAttribute('lang', lang); } catch {}
}

// ---- load dict (Vite build OR raw /src/) ----
async function loadDict(lang) {
  lang = (lang || 'es').toLowerCase();
  try {
    if (HAS_VITE_GLOB) {
      // Bundled: Vite will include JSONs
      let key = `./${lang}.json`;
      let loader = dictLoaders[key];
      if (!loader) {
        console.warn(`[i18n] Missing ${key}, falling back to './es.json'`);
        key = './es.json';
        loader = dictLoaders[key];
        lang = 'es';
      }
      const mod = await loader();
      dict = (mod && (mod.default ?? mod)) || {};
    } else {
      // Raw /src/: fetch JSON relative to this file
      const url = new URL(`./${lang}.json`, import.meta.url);
      const res = await fetch(url.href, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load ${url.href}`);
      dict = await res.json();
    }
    currentLang = lang;
    try { localStorage.setItem('lang', currentLang); } catch {}
    setHtmlLang(currentLang);
    applyTranslations();
    try { document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: currentLang } })); } catch {}
  } catch (e) {
    console.error('[i18n] loadDict error:', e);
  }
}

// ---- public API ----
export function getLang() {
  if (currentLang) return currentLang;
  try { const htmlLang = document.documentElement.getAttribute('lang'); if (htmlLang) return htmlLang; } catch {}
  return 'es';
}

export async function initI18n() {
  const u = new URL(location.href);
  const urlLang = (u.searchParams.get('language') || '').toLowerCase();
  let stored = '';
  try { stored = (localStorage.getItem('lang') || '').toLowerCase(); } catch {}
  const browser = ((navigator.language || 'es').slice(0, 2) || 'es').toLowerCase();
  const lang = (urlLang || stored || browser || 'es').toLowerCase();
  await setLang(lang);
}

export async function setLang(lang) {
  const next = (lang || 'es').toLowerCase();
  if (next === currentLang && dict && Object.keys(dict).length) return;
  await loadDict(next);
}

// ---- non-destructive writers ----
function setTextNonDestructive(el, value) {
  if (value == null) return;
  const isFormCtrl = ('value' in el) && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
  if (!el.children || el.children.length === 0) {
    if (!isFormCtrl) el.textContent = value;
    return;
  }
  const targetSel = el.getAttribute('data-i18n-target');
  if (targetSel) {
    const t = el.querySelector(targetSel);
    if (t) { t.textContent = value; return; }
  }
  const t2 = el.querySelector('[data-i18n-text]');
  if (t2) { t2.textContent = value; return; }
  // otherwise skip to avoid breaking structure
}

function setHTML(el, value) {
  if (value == null) return;
  el.innerHTML = value;
}

export function applyTranslations(root = document) {
  if (!root) return;

  root.querySelectorAll('[data-i18n]').forEach(el => {
    if (SKIP_TEXT_TAGS.has(el.tagName)) return;
    const key = el.getAttribute('data-i18n');
    const mode = el.getAttribute('data-i18n-mode'); // 'text' | 'html' | 'skip'
    const value = getFromDict(key);
    if (value == null) return;
    if (mode === 'skip') return;
    if (mode === 'html') { setHTML(el, value); return; }
    setTextNonDestructive(el, value);
  });

  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const raw = el.getAttribute('data-i18n-attr') || '';
    const pairs = raw.split(',').map(s => s.trim()).filter(Boolean);
    pairs.forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (!attr || !key) return;
      const value = getFromDict(key);
      if (value != null) el.setAttribute(attr, value);
    });
  });

  setHtmlLang(getLang());
}

/** withLangParams: string URL or plain object */
export function withLangParams(input, lang = getLang() || (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'es') {
  if (typeof input === 'string') {
    const href = input; if (!href) return href;
    try {
      const u = new URL(href, location.href);
      if (u.origin !== location.origin && /^https?:/i.test(u.protocol)) return href;
      if (/^(mailto:|tel:)/i.test(href)) return href;
      u.searchParams.set('language', lang);
      return u.origin === location.origin ? (u.pathname + u.search + u.hash) : u.toString();
    } catch { return href; }
  } else if (input && typeof input === 'object') {
    return { ...input, language: lang };
  }
  return input;
}
