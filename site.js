(() => {
  const body = document.body;
  const langBtn = document.getElementById('langBtn');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('navlinks');
  const saved = localStorage.getItem('site-lang');
  let ar = saved === 'ar';

  const ORCID_URL = 'https://orcid.org/0009-0000-9994-4770';
  const LINKEDIN_URL = 'https://www.linkedin.com/in/jubranalsughayyir';

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

  const installIdentityLinks = () => {
    if (!document.querySelector(`link[rel="me"][href="${ORCID_URL}"]`)) {
      const identityLink = document.createElement('link');
      identityLink.rel = 'me';
      identityLink.href = ORCID_URL;
      document.head.appendChild(identityLink);
    }

    const addSameAsToPerson = value => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) {
        value.forEach(addSameAsToPerson);
        return;
      }
      const type = value['@type'];
      const isPerson = type === 'Person' || (Array.isArray(type) && type.includes('Person'));
      const isJubran = !value.name || String(value.name).toLowerCase().includes('jubran alsughayyir');
      if (isPerson && isJubran) {
        const sameAs = Array.isArray(value.sameAs) ? value.sameAs : (value.sameAs ? [value.sameAs] : []);
        [LINKEDIN_URL, ORCID_URL].forEach(url => {
          if (!sameAs.includes(url)) sameAs.push(url);
        });
        value.sameAs = sameAs;
      }
      Object.values(value).forEach(addSameAsToPerson);
    };

    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        addSameAsToPerson(data);
        script.textContent = JSON.stringify(data);
      } catch (_) {}
    });

    document.querySelectorAll('.footer-links').forEach(footerLinks => {
      if (!footerLinks.querySelector(`a[href="${ORCID_URL}"]`)) {
        const a = document.createElement('a');
        a.href = ORCID_URL;
        a.target = '_blank';
        a.rel = 'me noopener';
        a.textContent = 'ORCID';
        footerLinks.appendChild(a);
      }
    });

    const contactList = document.querySelector('.contact-list');
    if (contactList && !contactList.querySelector(`a[href="${ORCID_URL}"]`)) {
      const row = document.createElement('div');
      row.className = 'contact-row';
      row.innerHTML = `<span>ORCID</span><a href="${ORCID_URL}" target="_blank" rel="me noopener">0009-0000-9994-4770</a>`;
      contactList.appendChild(row);
    }
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
  installIdentityLinks();
  applyLanguage();

  // Vercel Web Analytics for this static site.
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  if (!document.querySelector('script[data-vercel-analytics]')) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    s.dataset.vercelAnalytics = 'true';
    document.head.appendChild(s);
  }

  // Privacy-conscious custom events: track meaningful professional/research engagement only.
  const track = (name, props = {}) => {
    try { window.va('event', { name, data: props }); } catch (_) {}
  };

  const page = location.pathname.split('/').pop() || 'index.html';
  const cleanLabel = a => (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);

  document.addEventListener('click', event => {
    const a = event.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const lower = href.toLowerCase();
    const label = cleanLabel(a);
    const base = { page, label };

    if (/linkedin\.com/.test(lower)) return track('LinkedIn Click', base);
    if (/orcid\.org/.test(lower)) return track('ORCID Click', base);
    if (/ssrn\.com|papers\.ssrn/.test(lower)) return track('SSRN Click', base);
    if (/doi\.org/.test(lower)) return track('DOI Click', base);
    if (/mailto:/.test(lower)) return track('Email Contact', { page });
    if (/\.pdf(?:$|[?#])/.test(lower)) {
      const isCV = /cv|resume|curriculum/.test(lower + ' ' + label.toLowerCase());
      return track(isCV ? 'CV Download' : 'Research PDF', { ...base, file: href.split('/').pop().split('?')[0] });
    }
    if (/performance-shortfalls|data-protection|alice-cls|drm-consumer|loot-boxes|financing-compute|red-flag|saudi-enforcement|technical-proof/.test(lower)) {
      return track('Research Open', { ...base, destination: href.split('?')[0] });
    }
    if (/contact\.html/.test(lower)) return track('Contact Page Click', base);
  }, { capture: true });
})();
