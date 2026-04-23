/* ═════ LOADER SEQUENCE ═════ */
(function(){
  document.documentElement.classList.add('loading');
  const loader = document.getElementById('loader');
  const bar = document.getElementById('ldBar');
  const count = document.getElementById('ldCount');
  const DURATION = 2600; // total ms before lift
  const start = performance.now();
  function frame(t){
    const p = Math.min(1, (t - start) / DURATION);
    bar.style.width = (p*100).toFixed(1) + '%';
    count.textContent = String(Math.floor(p*100)).padStart(2,'0');
    if(p < 1){ requestAnimationFrame(frame); }
    else{
      setTimeout(()=>{
        loader.classList.add('done');
        document.documentElement.classList.remove('loading');
      }, 240);
    }
  }
  requestAnimationFrame(frame);
})();

/* ═════ SCROLL + POINTER VARS ═════ */
(function(){
  const html = document.documentElement;
  let sx = 0, tx = 0, sy = 0, ty = 0;
  function setScr(){
    const max = document.body.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    html.style.setProperty('--scr', p.toFixed(4));
  }
  window.addEventListener('scroll', setScr, {passive:true});
  setScr();

  window.addEventListener('pointermove', e=>{
    tx = (e.clientX / window.innerWidth) - .5;
    ty = (e.clientY / window.innerHeight) - .5;
  }, {passive:true});
  (function pTick(){
    sx += (tx - sx) * .08;
    sy += (ty - sy) * .08;
    html.style.setProperty('--mx', sx.toFixed(4));
    html.style.setProperty('--my', sy.toFixed(4));
    requestAnimationFrame(pTick);
  })();

  // nav show/hide on scroll direction
  const nv = document.getElementById('nav');
  let lastY = 0;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y > lastY + 6 && y > 140){ nv.classList.add('hide'); }
    else if(y < lastY - 6){ nv.classList.remove('hide'); }
    lastY = y;
  }, {passive:true});
})();

/* ═════ MAGNETIC LINKS ═════ */
(function(){
  const mags = document.querySelectorAll('.nav ul a, .ct-block a.val, .scroll-ind');
  mags.forEach(el=>{
    el.classList.add('mag');
    let raf;
    el.addEventListener('pointermove', e=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        el.style.transform = `translate(${x*.25}px, ${y*.35}px)`;
      });
    });
    el.addEventListener('pointerleave', ()=>{ el.style.transform = ''; });
  });
})();

/* ═════ CHAPTER IN-OBSERVER (for staggered proofs) ═════ */
(function(){
  const io2 = new IntersectionObserver((ents)=>{
    ents.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io2.unobserve(e.target); }
    });
  }, {threshold:.15, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.chapter, .met').forEach(el=>io2.observe(el));
})();

/* ═════ MONTAGE JUMP-CUT ═════ */
(function(){
  const mont = document.getElementById('montage');
  if(!mont) return;
  const slides = mont.querySelectorAll('.slide');
  const ticks = document.querySelectorAll('#mTicks span');
  const idx = document.getElementById('mIdx');
  const flash = document.getElementById('mFlash');
  let i = 0;
  let timer = null;
  let paused = false;

  function jump(next){
    slides.forEach(s=>s.classList.remove('on'));
    ticks.forEach(t=>t.classList.remove('on'));
    slides[next].classList.add('on');
    ticks[next].classList.add('on');
    idx.textContent = String(next+1).padStart(2,'0');
    flash.classList.remove('go');
    void flash.offsetWidth;
    flash.classList.add('go');
    i = next;
  }
  function schedule(){
    clearTimeout(timer);
    const delay = 820 + Math.random()*640; // 820–1460ms — jumpy, uneven
    timer = setTimeout(()=>{
      if(!paused) jump((i+1) % slides.length);
      schedule();
    }, delay);
  }
  // start only when in view
  const mio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ schedule(); } else { clearTimeout(timer); }
    });
  }, {threshold:.2});
  mio.observe(mont);

  // click to advance manually
  mont.addEventListener('click', ()=> jump((i+1) % slides.length));
  mont.addEventListener('mouseenter', ()=> paused = true);
  mont.addEventListener('mouseleave', ()=> paused = false);
})();

/* ═════ APPLY TWEAKS ═════ */
const root = document.documentElement;
function applyTweaks(t){
  root.dataset.palette = t.palette;
  root.dataset.accent = t.accent;
  root.dataset.display = t.display;
  root.dataset.grain = String(t.grain);
  root.dataset.cursor = String(t.cursor);
  // sync buttons
  document.querySelectorAll('#tweaks-panel .opts').forEach(grp=>{
    const key = grp.dataset.key;
    const val = String(t[key]);
    grp.querySelectorAll('button').forEach(b=>{
      b.classList.toggle('active', b.dataset.v === val);
    });
  });
}
applyTweaks(TWEAKS);

/* ═════ REVEAL ON SCROLL ═════ */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{threshold:.14, rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll('.rev').forEach(el=>io.observe(el));

/* ═════ NAV COMPACT ON SCROLL ═════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{
  nav.classList.toggle('compact', window.scrollY > 40);
}, {passive:true});

/* ═════ CURSOR LENS ═════ */
const lens = document.getElementById('lens');
let lx=-100, ly=-100, tx=-100, ty=-100;
window.addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; });
(function tick(){
  lx += (tx-lx)*.22; ly += (ty-ly)*.22;
  lens.style.left = lx+'px'; lens.style.top = ly+'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a, button, .vert, .pr-card').forEach(el=>{
  el.addEventListener('mouseenter', ()=> lens.classList.add('hover'));
  el.addEventListener('mouseleave', ()=> lens.classList.remove('hover'));
});

/* ═════ TWEAKS PANEL + EDIT MODE ═════ */
const panel = document.getElementById('tweaks-panel');

window.addEventListener('message', (e)=>{
  const d = e.data || {};
  if(d.type === '__activate_edit_mode') panel.classList.add('open');
  if(d.type === '__deactivate_edit_mode') panel.classList.remove('open');
});
window.parent.postMessage({type:'__edit_mode_available'}, '*');

document.querySelectorAll('#tweaks-panel .opts').forEach(grp=>{
  grp.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b) return;
    const key = grp.dataset.key;
    let val = b.dataset.v;
    if(grp.dataset.bool) val = (val === "true");
    TWEAKS[key] = val;
    applyTweaks(TWEAKS);
    window.parent.postMessage({type:'__edit_mode_set_keys', edits: {[key]: val}}, '*');
  });
});

/* ═════ SMOOTH ANCHOR SCROLL ═════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 20, behavior:'smooth'}); }
  });
});
