/* THEME 2 — motion engine */
(function(){
  const PR = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  /* Loader fade */
  setTimeout(() => { const l = document.getElementById('vLoader'); if (l) l.classList.add('gone'); }, 1500);
  setTimeout(() => { const l = document.getElementById('vLoader'); if (l) l.style.display = 'none'; }, 2300);

  /* Lenis smooth scroll */
  if (!PR && typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08
    });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.__lenis = lenis;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -32, duration: 1.4 });
      });
    });
  }

  /* Reveal-on-enter */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));

  /* Nav hide on scroll down, show on scroll up */
  const nav = document.getElementById('vNav');
  let lastY = 0;
  document.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (!nav) return;
    if (y > lastY + 6 && y > 200) nav.classList.add('hide');
    else if (y < lastY - 6) nav.classList.remove('hide');
    lastY = y;
  }, { passive: true });

  /* Page transitions */
  if (!PR) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
      a.addEventListener('click', e => {
        e.preventDefault();
        body.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        body.style.opacity = '0';
        body.style.transform = 'translateY(-6px)';
        setTimeout(() => { window.location.href = href; }, 360);
      });
    });
    window.addEventListener('pageshow', () => {
      body.style.opacity = '';
      body.style.transform = '';
    });
  }
})();
