/* ═════════════════════════════════════════════════════════════
   PRATIK SENGUPTA · MAIN JS
   Editorial portfolio · awwwards-level interactions
   ═════════════════════════════════════════════════════════════ */

const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = matchMedia('(hover: none) and (pointer: coarse)').matches;
const root = document.documentElement;

/* ═════ SCAFFOLD · inject interaction elements once ═════ */
(function injectScaffold(){
  const body = document.body;
  if (!document.querySelector('.grain-coarse')) {
    const g = document.createElement('div');
    g.className = 'grain-coarse';
    g.setAttribute('aria-hidden', 'true');
    body.appendChild(g);
  }
  if (!document.querySelector('.raking-light')) {
    const r = document.createElement('div');
    r.className = 'raking-light';
    r.setAttribute('aria-hidden', 'true');
    body.appendChild(r);
  }
  if (!document.querySelector('.aperture')) {
    const a = document.createElement('div');
    a.className = 'aperture';
    a.setAttribute('aria-hidden', 'true');
    body.appendChild(a);
  }
  if (!document.querySelector('.page-transition')) {
    const p = document.createElement('div');
    p.className = 'page-transition';
    p.setAttribute('aria-hidden', 'true');
    body.appendChild(p);
  }
  if (!document.querySelector('.rm-toggle')) {
    const btn = document.createElement('button');
    btn.className = 'rm-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle reading mode');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('data-label', 'Reading mode');
    btn.innerHTML = '<span class="rm-ico" aria-hidden="true"><i></i><i></i><i></i></span>';
    body.appendChild(btn);
  }
})();

/* ═════ LOADER · minimal · single line, fades out ═════ */
(function(){
  root.classList.add('loading');
  const loader = document.getElementById('loader');
  if (!loader) { root.classList.remove('loading'); return; }
  const DURATION = 1200;
  setTimeout(() => {
    loader.classList.add('done');
    root.classList.remove('loading');
  }, DURATION);
})();

/* ═════ LENIS SMOOTH SCROLL ═════ */
let lenis = null;
(function(){
  if (PREFERS_REDUCED || typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    lerp: 0.08,
  });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  window.__lenis = lenis;
})();

/* ═════ SCROLL + POINTER VARS ═════ */
(function(){
  let sx = 0, tx = 0, sy = 0, ty = 0;
  function setScr(){
    const max = document.body.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    root.style.setProperty('--scr', p.toFixed(4));
    // raking light y position: sweeps from top to bottom over the scroll
    const rakeY = 15 + p * 70;
    root.style.setProperty('--rake-y', rakeY.toFixed(1));
  }
  window.addEventListener('scroll', setScr, { passive: true });
  setScr();

  if (!IS_TOUCH) {
    window.addEventListener('pointermove', (e) => {
      tx = (e.clientX / window.innerWidth) - .5;
      ty = (e.clientY / window.innerHeight) - .5;
    }, { passive: true });
    (function pTick(){
      sx += (tx - sx) * 0.08;
      sy += (ty - sy) * 0.08;
      root.style.setProperty('--mx', sx.toFixed(4));
      root.style.setProperty('--my', sy.toFixed(4));
      requestAnimationFrame(pTick);
    })();
  }

  // nav show/hide on scroll direction
  const nv = document.getElementById('nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nv) {
      if (y > lastY + 6 && y > 140) nv.classList.add('hide');
      else if (y < lastY - 6) nv.classList.remove('hide');
    }
    lastY = y;
  }, { passive: true });
})();

/* ═════ RAKING LIGHT · enable after load ═════ */
setTimeout(() => {
  const rl = document.querySelector('.raking-light');
  if (rl) rl.classList.add('on');
}, 1800);

/* ═════ CURSOR APERTURE · follows pointer, scales with velocity ═════ */
(function(){
  if (IS_TOUCH || PREFERS_REDUCED) return;
  const ap = document.querySelector('.aperture');
  if (!ap) return;
  let x = -500, y = -500, tx = -500, ty = -500;
  let lastT = performance.now();
  let lastX = 0, lastY = 0, vel = 0;

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    vel = Math.sqrt(dx * dx + dy * dy) / dt;
    lastT = now; lastX = e.clientX; lastY = e.clientY;
    ap.classList.add('on');
  }, { passive: true });
  window.addEventListener('pointerleave', () => ap.classList.remove('on'));

  (function tick(){
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    ap.style.transform = `translate(${x}px, ${y}px)`;
    // size: 120-220 based on velocity (faster = wider aperture)
    const size = Math.max(120, Math.min(220, 160 + vel * 60));
    ap.style.setProperty('--ap-size', size.toFixed(0));
    vel *= 0.9;
    requestAnimationFrame(tick);
  })();

  // mark paragraphs when aperture passes over them for type-proximity effect
  const pars = document.querySelectorAll('.man-body p, .chap-body p, .cs-deck, .ct-block .val');
  (function proximity(){
    pars.forEach(p => {
      const r = p.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(cx - x, cy - y);
      if (d < 240) p.classList.add('ap-hit');
      else p.classList.remove('ap-hit');
    });
    requestAnimationFrame(proximity);
  })();

  // interactive elements get stronger aperture
  document.querySelectorAll('a, button, .vert, .pr-card, .sw-row').forEach(el => {
    el.addEventListener('mouseenter', () => ap.classList.add('hov'));
    el.addEventListener('mouseleave', () => ap.classList.remove('hov'));
  });
})();

/* ═════ TYPE PROXIMITY · hero name responds to cursor distance ═════ */
(function(){
  if (IS_TOUCH || PREFERS_REDUCED) return;
  const name = document.querySelector('.hero-name');
  if (!name) return;
  let raf;
  function update(e) {
    const r = name.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const d = Math.hypot(e.clientX - cx, e.clientY - cy);
    // normalize: closer = higher prox (0-1 scale)
    const prox = Math.max(0, Math.min(1, 1 - d / 600));
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      root.style.setProperty('--prox', prox.toFixed(3));
    });
  }
  window.addEventListener('pointermove', update, { passive: true });
})();

/* ═════ POLAROID IMAGE REVEAL ═════ */
(function(){
  if (PREFERS_REDUCED) return;
  const targets = document.querySelectorAll('.sw-img, .cs-hero, figure.cs-fig, .hero-portrait, .sig-buddha, .signature, .signature-2');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('polaroid-in', 'go');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(el => {
    el.classList.add('polaroid-in');
    io.observe(el);
  });
})();

/* ═════ MAGNETIC LINKS ═════ */
(function(){
  if (IS_TOUCH) return;
  const mags = document.querySelectorAll('.nav ul a, .ct-block a.val, .scroll-ind');
  mags.forEach(el => {
    el.classList.add('mag');
    let raf;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
      });
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
})();

/* ═════ CHAPTER/MET IN-OBSERVER ═════ */
(function(){
  const io2 = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.chapter, .met').forEach(el => io2.observe(el));
})();

/* ═════ MONTAGE · slowed to contemplative pace ═════ */
(function(){
  const mont = document.getElementById('montage');
  if (!mont) return;
  const slides = mont.querySelectorAll('.slide');
  const ticks = document.querySelectorAll('#mTicks span');
  const idx = document.getElementById('mIdx');
  const flash = document.getElementById('mFlash');
  let i = 0, timer = null, paused = false;
  function jump(next){
    slides.forEach(s => s.classList.remove('on'));
    ticks.forEach(t => t.classList.remove('on'));
    slides[next].classList.add('on');
    ticks[next].classList.add('on');
    if (idx) idx.textContent = String(next + 1).padStart(2, '0');
    if (flash) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
    i = next;
  }
  function schedule(){
    clearTimeout(timer);
    // 3-4s contemplative pace (was 0.8-1.5s jumpy)
    const delay = 3000 + Math.random() * 1200;
    timer = setTimeout(() => {
      if (!paused) jump((i + 1) % slides.length);
      schedule();
    }, delay);
  }
  const mio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) schedule();
      else clearTimeout(timer);
    });
  }, { threshold: 0.2 });
  mio.observe(mont);
  mont.addEventListener('click', () => jump((i + 1) % slides.length));
  mont.addEventListener('mouseenter', () => paused = true);
  mont.addEventListener('mouseleave', () => paused = false);
})();

/* ═════ APPLY TWEAKS ═════ */
function applyTweaks(t){
  if (!t) return;
  root.dataset.palette = t.palette;
  root.dataset.accent = t.accent;
  root.dataset.display = t.display;
  root.dataset.grain = String(t.grain);
  root.dataset.cursor = String(t.cursor);
}
if (typeof TWEAKS !== 'undefined') applyTweaks(TWEAKS);

/* ═════ REVEAL ON SCROLL ═════ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.rev').forEach(el => io.observe(el));

/* ═════ NAV COMPACT ON SCROLL ═════ */
(function(){
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('compact', window.scrollY > 40);
  }, { passive: true });
})();

/* ═════ READING MODE TOGGLE ═════ */
(function(){
  const btn = document.querySelector('.rm-toggle');
  if (!btn) return;
  function sync(on){
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('data-label', on ? 'Exit reading' : 'Reading mode');
  }
  const saved = localStorage.getItem('rm');
  if (saved === '1') { root.dataset.rm = 'true'; sync(true); } else { sync(false); }
  btn.addEventListener('click', () => {
    const on = root.dataset.rm === 'true';
    root.dataset.rm = on ? 'false' : 'true';
    sync(!on);
    localStorage.setItem('rm', on ? '0' : '1');
  });
})();

/* ═════ SMOOTH ANCHOR SCROLL ═════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.5 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
  });
});

/* ═════ PAGE TRANSITIONS · ember flash + lift ═════ */
(function(){
  if (PREFERS_REDUCED) return;
  const overlay = document.querySelector('.page-transition');
  // outgoing transition on internal links
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // skip anchors, external, mailto, tel, new-tab
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (a.target === '_blank') return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('page-leaving');
      if (overlay) overlay.classList.add('go');
      setTimeout(() => { window.location.href = href; }, 420);
    });
  });
  // fade in on arrival
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
    if (overlay) overlay.classList.remove('go');
  });
})();
