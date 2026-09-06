(() => {
  const body = document.body;
  const langBtn = document.getElementById('langBtn');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('navlinks');
  const saved = localStorage.getItem('site-lang');
  let ar = saved === 'ar';

  const applyLanguage = () => {
    document.documentElement.lang = ar ? 'ar' : 'en';
    body.dir = ar ? 'rtl' : 'ltr';
    body.classList.toggle('rtl', ar);
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
      el.textContent = ar ? el.dataset.ar : el.dataset.en;
    });
    if (langBtn) langBtn.textContent = ar ? 'EN' : 'العربية';
  };

  if (langBtn) langBtn.addEventListener('click', () => {
    ar = !ar;
    localStorage.setItem('site-lang', ar ? 'ar' : 'en');
    applyLanguage();
  });

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = 'Menu';
    }));
  }

  applyLanguage();

  // Vercel Web Analytics loader for static HTML. It becomes active when Web Analytics is enabled for the project.
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  if (!document.querySelector('script[data-vercel-analytics]')) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    s.dataset.vercelAnalytics = 'true';
    document.head.appendChild(s);
  }
})();
