/* ═══════════════════════════════════════════════════════════
   GROWLY — Global JavaScript v3.0
   ═══════════════════════════════════════════════════════════ */

/* ─── CUSTOM CURSOR (mint dot) ─── */
(function initCursor() {
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let mx = -100, my = -100;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  // Hover state on interactive elements
  const hoverTargets = 'a, button, input, textarea, select, .q-option, .config-chip, .addon-toggle, [onclick], [data-open-questionnaire]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.remove('hovering');
  });
})();

/* ─── PAGE LOADER ─── */
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 500);
    setTimeout(() => loader.remove(), 1100);
  }
});

/* ─── PAGE TRANSITIONS ─── */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });
});

/* ─── NAV ─── */
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}
function closeMobile() {
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── REVEAL ON SCROLL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isDecimal = target % 1 !== 0;
  const duration = 2200;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const current = target * eased;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = '1';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ─── TILT CARDS (desktop only) ─── */
const isMobile = ('ontouchstart' in window) || window.innerWidth < 768;
if (!isMobile) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

/* ─── MAGNETIC BUTTONS ─── */
if (!isMobile) {
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ─── TYPING EFFECT ─── */
(function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const words = JSON.parse(el.dataset.words || '[]');
  if (!words.length) return;
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % words.length;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => {
      el.textContent = words[idx];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 400);
  }, 3000);
})();

/* ═══════ PRICE ANIMATION ═══════ */
function initPriceToggle() {
  const toggle = document.getElementById('addon-anim');
  const priceEl = document.getElementById('base-price');
  if (!toggle || !priceEl) return;
  let active = false;
  toggle.addEventListener('click', () => {
    active = !active;
    toggle.classList.toggle('active', active);
    const from = active ? 449 : 559;
    const to = active ? 559 : 449;
    animPrice(priceEl, from, to);
    priceEl.classList.add('price-burst');
    setTimeout(() => priceEl.classList.remove('price-burst'), 600);
  });
}
function animPrice(el, from, to) {
  const dur = 600, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.addEventListener('DOMContentLoaded', initPriceToggle);

/* ═══════ PACKAGE CONFIGURATOR ═══════ */
function initConfigurator() {
  const el = document.getElementById('config-total');
  if (!el) return;

  const chips = document.querySelectorAll('.config-chip');
  const base = 200; // base monthly

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      recalcTotal();
    });
  });

  function recalcTotal() {
    let total = base;
    chips.forEach(c => {
      if (c.classList.contains('selected')) total += parseInt(c.dataset.price || 0);
    });
    animPrice(el, parseInt(el.textContent), total);
  }
}
document.addEventListener('DOMContentLoaded', initConfigurator);

/* ═══════ QUESTIONNAIRE ═══════ */
function initQuestionnaire() {
  const modal = document.getElementById('questionnaire-modal');
  if (!modal) return;

  const steps = modal.querySelectorAll('.q-step');
  const progressBar = modal.querySelector('.q-progress-fill');
  const totalSteps = steps.length;
  let currentStep = 0;
  const data = {};

  document.querySelectorAll('[data-open-questionnaire]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      showStep(0);
    });
  });
  modal.querySelectorAll('[data-close-questionnaire]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-next]')) {
      const step = steps[currentStep];
      const key = step.dataset.key;
      const input = step.querySelector('input:not([type=hidden]), textarea');
      const selected = step.querySelector('.q-option.selected');

      if (input && input.required && !input.value.trim()) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        return;
      }
      if (input) data[key] = input.value.trim();
      else if (selected) data[key] = selected.dataset.value;

      if (currentStep < totalSteps - 1) { currentStep++; showStep(currentStep); }
    }
    if (e.target.matches('[data-prev]')) {
      if (currentStep > 0) { currentStep--; showStep(currentStep); }
    }
    if (e.target.matches('[data-submit-questionnaire]')) {
      const step = steps[currentStep];
      const ta = step.querySelector('textarea');
      if (ta) data[step.dataset.key] = ta.value.trim();
      submitQ(data);
    }
    if (e.target.closest('.q-option')) {
      const opt = e.target.closest('.q-option');
      opt.closest('.q-options').querySelectorAll('.q-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    }
  });

  function showStep(idx) {
    steps.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i < idx) s.classList.add('prev');
      if (i === idx) s.classList.add('active');
    });
    if (progressBar) progressBar.style.width = ((idx + 1) / totalSteps * 100) + '%';
  }

  function submitQ(d) {
    currentStep = totalSteps - 1;
    showStep(currentStep);
    const subj = encodeURIComponent('Conosciamoci — ' + (d.nome || 'Nuovo contatto'));
    const body = encodeURIComponent(
      `Nome: ${d.nome || '-'}\nEmail: ${d.email || '-'}\nAttività: ${d.attivita || '-'}\nSettore: ${d.settore || '-'}\nObiettivo: ${d.obiettivo || '-'}\nBudget: ${d.budget || '-'}\nNote: ${d.note || '-'}`
    );
    const a = document.createElement('a');
    a.href = `mailto:growly.bsn@gmail.com?subject=${subj}&body=${body}`;
    a.click();
  }
}
document.addEventListener('DOMContentLoaded', initQuestionnaire);

/* ═══════ FAQ ═══════ */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ═══════ THREE.JS ═══════ */
(function initThreeScene() {
  const canvas = document.getElementById('global-canvas');
  if (!canvas) return;
  const isMob = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  if (isMob && isLowEnd) { canvas.style.display = 'none'; return; }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMob });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMob ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 150);
  camera.position.z = 6;

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const pCount = isMob ? 80 : 180;
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3] = (Math.random()-0.5)*18;
    pPos[i*3+1] = (Math.random()-0.5)*12;
    pPos[i*3+2] = (Math.random()-0.5)*10;
    const m = Math.random() > 0.45;
    pCol[i*3] = m?0:0.42; pCol[i*3+1] = m?0.96:0.25; pCol[i*3+2] = m?0.77:1;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.04, vertexColors: true, transparent: true, opacity: 0.65, sizeAttenuation: true
  }));
  scene.add(particles);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.35, isMob?12:18, isMob?40:70),
    new THREE.MeshBasicMaterial({ color: 0x6C3FFF, wireframe: true, transparent: true, opacity: 0.08 })
  );
  torus.position.set(4, -1, -3);
  scene.add(torus);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00F5C4, wireframe: true, transparent: true, opacity: 0.1 })
  );
  ico.position.set(-4.5, 1.5, -2);
  scene.add(ico);

  const oct = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.MeshBasicMaterial({ color: 0x8B6AFF, wireframe: true, transparent: true, opacity: 0.1 })
  );
  oct.position.set(2, 3, -4);
  scene.add(oct);

  const lp = [];
  for (let i = 0; i < (isMob?15:30); i++) {
    const x = (Math.random()-0.5)*14, y = (Math.random()-0.5)*10, z = (Math.random()-0.5)*6;
    lp.push(new THREE.Vector3(x,y,z));
    lp.push(new THREE.Vector3(x+(Math.random()-0.5)*4, y+(Math.random()-0.5)*3, z+(Math.random()-0.5)*2));
  }
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(lp),
    new THREE.LineBasicMaterial({ color: 0x6C3FFF, transparent: true, opacity: 0.04 })
  );
  scene.add(lines);

  let mouseX=0, mouseY=0, scrollY=0;
  if (!isMob) {
    window.addEventListener('mousemove', e => {
      mouseX = (e.clientX/window.innerWidth-0.5)*2;
      mouseY = (e.clientY/window.innerHeight-0.5)*2;
    });
  }
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const so = scrollY * 0.001;
    particles.rotation.y = t*0.03+mouseX*0.08;
    particles.rotation.x = t*0.01+mouseY*0.04;
    particles.position.y = -so*2;
    torus.rotation.x = t*0.2; torus.rotation.y = t*0.15+mouseX*0.05;
    torus.position.y = -1+Math.sin(t*0.3)*0.5-so;
    ico.rotation.x = t*0.3; ico.rotation.z = t*0.2;
    ico.position.y = 1.5+Math.sin(t*0.4+1)*0.4-so;
    oct.rotation.x = t*0.25; oct.rotation.y = t*0.35;
    oct.position.y = 3+Math.sin(t*0.35+2)*0.3-so;
    lines.rotation.y = t*0.015; lines.position.y = -so*1.5;
    renderer.render(scene, camera);
  }
  animate();
})();
