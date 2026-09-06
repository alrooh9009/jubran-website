(() => {
  const body = document.body;
  const langBtn = document.getElementById('langBtn');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('navlinks');
  const saved = localStorage.getItem('site-lang');
  let ar = saved === 'ar';

  // Replace the old inline "J" favicon used by the main pages with the new JA identity.
  const installFavicon = () => {
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(el => el.remove());
    [
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
    ].forEach(attrs => {
      const link = document.createElement('link');
      Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
      document.head.appendChild(link);
    });
  };

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

  installFavicon();
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
