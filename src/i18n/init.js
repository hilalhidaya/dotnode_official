// /src/i18n/init.js
import { initI18n, getLang, setLang, applyTranslations } from './i18n.js';

if (!window.__langBootstrapped) {
  window.__langBootstrapped = true;

  (async () => {
    await initI18n(); // loads dict and applies translations

    const chooseDefaultLang = () => {
      const u = new URL(location.href);
      let lang = u.searchParams.get('language') || localStorage.getItem('lang');
      if (!lang) {
        const nav = (navigator.language || 'es').slice(0, 2);
        lang = nav === 'en' ? 'en' : 'es';
      }
      return lang;
    };

    const ensureLangParamInURL = () => {
      const u = new URL(location.href);
      const current = getLang() || chooseDefaultLang();
      if (u.searchParams.get('language') !== current) {
        u.searchParams.set('language', current);
        history.replaceState({}, '', u.toString());
      }
      document.documentElement.setAttribute('lang', current);
    };

    const propagateLangOnLinks = (root = document) => {
      const lang = getLang() || chooseDefaultLang();
      root.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        if (/^(https?:|mailto:|tel:|#)/i.test(href)) return;
        const u = new URL(href, location.href);
        u.searchParams.set('language', lang);
        a.setAttribute('href', u.pathname + u.search + u.hash);
      });
    };

    const wireSwitchers = () => {
      // SELECT
      const sel = document.querySelector('#lang_select');
      if (sel) {
        sel.value = getLang();
        if (window.__langSelectHandler) sel.removeEventListener('change', window.__langSelectHandler);
        window.__langSelectHandler = (e) => {
          const lang = e.target.value;
          if (!lang || lang === getLang()) return;
          setLang(lang);
        };
        sel.addEventListener('change', window.__langSelectHandler);
      }

      // BUTTON GROUP
      const group = document.querySelector('#lang_switcher');
      const updateButtons = () => {
        if (!group) return;
        const lang = getLang();
        group.querySelectorAll('button[data-lang]').forEach(btn => {
          const active = btn.dataset.lang === lang;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', String(active));
        });
      };
      if (group) {
        group.addEventListener('click', (ev) => {
          const btn = ev.target.closest('button[data-lang]');
          if (!btn) return;
          const lang = btn.dataset.lang;
          if (lang && lang !== getLang()) setLang(lang);
        });
        updateButtons();
        document.addEventListener('language-changed', updateButtons, { passive: true });
      }
    };

    // Observe DOM changes (menus, overlays, etc.)
    const mo = new MutationObserver(() => {
      wireSwitchers();
      propagateLangOnLinks();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    ensureLangParamInURL();
    wireSwitchers();
    propagateLangOnLinks();

    document.addEventListener('language-changed', () => {
      ensureLangParamInURL();
      propagateLangOnLinks();
      document.documentElement.setAttribute('lang', getLang());
      applyTranslations();
    }, { passive: true });
  })();
}
