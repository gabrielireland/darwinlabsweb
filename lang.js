// lang.js
document.addEventListener('DOMContentLoaded', () => {
  const langButtons = {
    es: document.getElementById('lang-es'),
    en: document.getElementById('lang-en')
  };

  const updateInternalLinks = (lang) => {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      // ignore anchors and special schemes
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      try {
        const u = new URL(href, location.href);
        // only touch same-origin links; leave external links alone
        if (u.origin === location.origin) {
          u.searchParams.set('lang', lang);
          a.setAttribute('href', u.href); // keep full URL (origin + path + search + hash)
        }
      } catch (e) {
        // ignore malformed URLs
      }
    });
  };

  const setLanguage = (lang) => {
    try { localStorage.setItem('dg_lang', lang); } catch(e) {}
    document.documentElement.lang = lang;

    // buttons
    Object.values(langButtons).forEach(btn => btn && btn.classList.remove('active'));
    if (langButtons[lang]) langButtons[lang].classList.add('active');

    // show/hide content
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.classList.toggle('hidden', el.dataset.lang !== lang);
    });

    // placeholders
    const phAttr = `data-lang-${lang}-placeholder`;
    document.querySelectorAll(`[${phAttr}]`).forEach(el => {
      el.placeholder = el.getAttribute(phAttr);
    });

    // update current URL without reload
    try {
      const cur = new URL(location.href);
      cur.searchParams.set('lang', lang);
      history.replaceState({}, '', cur.pathname + cur.search + cur.hash);
    } catch(e) {}

    // update links for future navigation
    updateInternalLinks(lang);
  };

  // Initial lang: URL > localStorage > browser default
  const urlLangRaw = new URLSearchParams(location.search).get('lang');
  const urlLang = (urlLangRaw === 'en' || urlLangRaw === 'es') ? urlLangRaw : null;
  let savedLang = null;
  try { savedLang = localStorage.getItem('dg_lang'); } catch(e) {}
  const defaultLang = (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
  const initialLang = urlLang || (savedLang === 'en' || savedLang === 'es' ? savedLang : null) || defaultLang;

  // Wire buttons
  if (langButtons.es) langButtons.es.addEventListener('click', () => setLanguage('es'));
  if (langButtons.en) langButtons.en.addEventListener('click', () => setLanguage('en'));

  // Apply now
  setLanguage(initialLang);

  // Mobile menu (optional)
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }

  // Reveal-on-scroll (optional)
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, {threshold: 0.1}).observe(el);
    } else { el.classList.add('is-visible'); }
  });
});
