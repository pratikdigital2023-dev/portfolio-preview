/* ════════════════════════════════════════════════════════════════
   THEME & DESIGN 2 — motion engine
   Living chevron · snap progress · compass · dwell ToC · marginalia
   ════════════════════════════════════════════════════════════════ */

(function(){
  const PR = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const root = document.documentElement;
  const body = document.body;

  /* ─── Loader · fades after 1.6s ─── */
  const loader = document.getElementById('v2Loader');
  setTimeout(() => { if (loader) loader.classList.add('gone'); }, 1700);
  setTimeout(() => { if (loader) loader.style.display = 'none'; }, 2400);

  /* ─── Lenis smooth scroll inside the snap host (if not snap-broken) ─── */
  // Note: Lenis on a scroll container with snap can fight with the snap.
  // We scope Lenis to window scroll only (the snap host is fixed-height; window does scroll on tall pages).
  // Since our scroll-host IS the body-height container, we let native snap handle it; Lenis is omitted here.
  // However we still want smooth in-page anchor jumps via JS.

  /* ─── Living chevron · pulse all chevrons together on any chevron hover ─── */
  if (!PR) {
    const chevs = document.querySelectorAll('.chev');
    chevs.forEach(ch => {
      ch.addEventListener('mouseenter', () => {
        body.classList.remove('chev-pulse');
        // restart animation
        void body.offsetWidth;
        body.classList.add('chev-pulse');
      });
      ch.addEventListener('animationend', () => body.classList.remove('chev-pulse'));
    });
    // also pulse on the loader chevron's own initial entry
    setTimeout(() => {
      body.classList.add('chev-pulse');
      setTimeout(() => body.classList.remove('chev-pulse'), 1500);
    }, 600);
  }

  /* ─── Reveal-on-enter (.fade-up) ─── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

  /* ─── Room observer · drives compass + ToC active state + horizontal hairline ─── */
  const rooms = Array.from(document.querySelectorAll('.room'));
  const tocLinks = Array.from(document.querySelectorAll('.toc a'));
  const compass = document.getElementById('compass');
  const compassRoman = document.getElementById('compassRoman');
  const compassLabel = document.getElementById('compassLabel');
  const ROMAN = ['I','II','III','IV','V','VI'];
  const LABELS = ['Theorem','Annotation','The integer','The prime','The system','Q.E.D.'];

  const roomIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const idx = parseInt(e.target.dataset.room, 10) - 1;
      if (e.isIntersecting && e.intersectionRatio > 0.5) {
        e.target.classList.add('in-view');
        // sync compass + ToC
        if (compassRoman) compassRoman.textContent = ROMAN[idx] || '';
        if (compassLabel) compassLabel.textContent = LABELS[idx] || '';
        tocLinks.forEach(l => l.classList.toggle('is-here', parseInt(l.dataset.room,10) - 1 === idx));
      }
    });
  }, { threshold: [0.5, 0.75] });
  rooms.forEach(r => roomIO.observe(r));

  /* ─── Show compass + ToC after first scroll, hide while hard-scrolling ─── */
  let scrollTimer;
  let armed = false;
  const toc = document.getElementById('toc');
  function arm() {
    if (armed) return;
    armed = true;
    if (toc) toc.classList.add('on');
    if (compass) compass.classList.add('on');
    const snd = document.getElementById('sndToggle');
    if (snd) snd.classList.add('on-screen');
  }

  let lastY = 0;
  document.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) > 24 && y > 100) arm();
    lastY = y;
  }, { passive: true });

  // Also arm after 1.6s if user hasn't scrolled
  setTimeout(arm, 2200);

  /* ─── Snap-aware anchor scroll · uses native scroll-snap, just smooth-jumps ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: PR ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ─── Sound toggle · placeholder (no audio file yet) ─── */
  const snd = document.getElementById('sndToggle');
  if (snd) {
    let on = false;
    snd.addEventListener('click', () => {
      on = !on;
      snd.setAttribute('aria-pressed', String(on));
      snd.style.color = on ? 'var(--terracotta)' : '';
      snd.style.borderColor = on ? 'var(--terracotta)' : '';
    });
  }

  /* ─── Page transition on internal links (excluding anchors) ─── */
  if (!PR) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        body.style.transition = 'opacity 0.4s ease, transform 0.5s var(--ease, cubic-bezier(0.22,1,0.36,1))';
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
