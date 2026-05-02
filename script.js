/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loader-text');
let loadPct = 0;
const loadInterval = setInterval(() => {
  loadPct += Math.random() * 18;
  if (loadPct >= 100) { loadPct = 100; clearInterval(loadInterval); }
  loaderText.textContent = Math.floor(loadPct) + '%';
  if (loadPct === 100) {
    setTimeout(() => {
      loader.classList.add('done');
      initReveal();
    }, 300);
  }
}, 80);

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateCursor() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('[data-cursor="link"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });
});

/* ═══════════════════════════════════════════
   NAV SCROLL
═══════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ═══════════════════════════════════════════
   HAMBURGER
═══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mm-link').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ═══════════════════════════════════════════
   HERO CANVAS — PARTICLE FIELD
═══════════════════════════════════════════ */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const heroEl = document.getElementById('hero');

function resizeCanvas() {
  canvas.width = heroEl.clientWidth;
  canvas.height = heroEl.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 110;

const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - .5) * .35,
  vy: (Math.random() - .5) * .35,
  size: Math.random() * 1.4 + .5,
  pulse: Math.random() * Math.PI * 2,
  hue: Math.random() > .85 ? 220 : 174,
}));

const mouse = { x: -9999, y: -9999 };
heroEl.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});
heroEl.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

let frame = 0;
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;

  particles.forEach((p, i) => {
    p.pulse += .02;
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 120) {
      const f = (120 - dist) / 120 * .5;
      p.vx += (dx / dist) * f;
      p.vy += (dy / dist) * f;
    }
    p.vx *= .992; p.vy *= .992;
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    const alpha = .3 + .25 * Math.sin(p.pulse);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 110) {
        ctx.strokeStyle = `hsla(174,100%,60%,${(1 - d / 110) * .12})`;
        ctx.lineWidth = .5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
function initReveal() {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));
}

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════ */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.getAttribute('data-target');
    let cur = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(t);
    }, 35);
    counterObs.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ═══════════════════════════════════════════
   3D TILT CARDS
═══════════════════════════════════════════ */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    const rotY = ((x - cx) / cx) * 6;
    const rotX = -((y - cy) / cy) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => card.style.transition = '', 600);
  });
});

/* ═══════════════════════════════════════════
   MAGNETIC CURSOR GLOW ON CARDS
═══════════════════════════════════════════ */
document.querySelectorAll('.project-card, .research-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ═══════════════════════════════════════════
   PROJECTS DATA
═══════════════════════════════════════════ */
const projects = [
  {
    num: '01',
    title: 'Emergency QR Medical Profile',
    desc: 'QR-based system that stores and instantly surfaces critical medical information during emergencies — blood type, allergies, medications — fast enough to save lives.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    url: 'https://github.com/krishanumishra21/emergency-medical-qr',
  },
  {
    num: '02',
    title: 'Aarogya AI',
    desc: 'Full-stack AI healthcare platform unifying patients, doctors, and hospitals. Featured in a published research paper for its system design and accessibility-first approach.',
    tags: ['MERN Stack', 'AI Integration', 'Healthcare'],
    url: 'https://github.com/krishanumishra21/AAROGYA-AI',
    badge: 'Published Research',
  },
  {
    num: '03',
    title: 'Antarman AI',
    desc: 'अंतरमन — AI personality engine simulating dynamic personas with tunable traits: confidence, empathy, aggression, and humor. Characters evolve through conversation.',
    tags: ['MERN Stack', 'Prompt Engineering', 'AI'],
    url: 'https://github.com/krishanumishra21/Antarman-ai',
  },
];

const pg = document.getElementById('projects-grid');
projects.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-reveal', '');
  card.setAttribute('data-tilt', '');
  card.innerHTML = `
    ${p.badge ? `<div class="pc-badge">${p.badge}</div>` : ''}
    <div class="pc-num">PROJECT ${p.num}</div>
    <h3>${p.title}</h3>
    <div class="pc-tags">${p.tags.map(t => `<span class="pc-tag">${t}</span>`).join('')}</div>
    <p>${p.desc}</p>
    <a href="${p.url}" target="_blank" class="pc-link" data-cursor="link">↗ View on GitHub</a>
  `;
  pg.appendChild(card);

  // Re-attach tilt to dynamically added cards
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    card.style.transform = `perspective(800px) rotateX(${-((y-cy)/cy)*5}deg) rotateY(${((x-cx)/cx)*5}deg) translateZ(4px)`;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });

  // Add cursor
  card.setAttribute('data-cursor', 'link');
  card.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  card.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });

  // Stagger reveal
  card.style.transitionDelay = `${i * 0.1}s`;
});

// Re-run observers for dynamic cards
setTimeout(() => {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
  }, { threshold: .1 });
  document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => revealObs.observe(el));
}, 100);

/* ═══════════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════════ */
document.getElementById('fyear').textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════
   ACTIVE NAV HIGHLIGHTING
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === '#' + e.target.id;
        a.style.color = active ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: .4 });
sections.forEach(s => activeObs.observe(s));

/* ═══════════════════════════════════════════
   CURSOR BLINK CODE WINDOW
═══════════════════════════════════════════ */
// Already handled by CSS animation
