// Projects data
const projects = [
  {
    num: '01',
    title: 'Emergency QR Medical Profile',
    desc: 'QR-based system that stores and instantly surfaces critical medical information during emergencies — blood type, allergies, medications — fast enough to save lives.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    url: 'https://github.com/krishanumishra21/emergency-medical-qr'
  },
  {
    num: '02',
    title: 'Aarogya AI',
    desc: 'Full-stack AI healthcare platform unifying patients, doctors, and hospitals. Featured in a published research paper for its system design and accessibility-first approach.',
    tags: ['MERN Stack', 'AI Integration', 'Healthcare'],
    url: 'https://github.com/krishanumishra21/AAROGYA-AI',
    badge: 'Published Research'
  },
  {
    num: '03',
    title: 'Antarman AI',
    desc: 'अंतरमन — AI personality engine that simulates dynamic personas with tunable traits: confidence, empathy, aggression, humor. Characters evolve through conversation over time.',
    tags: ['MERN Stack', 'Prompt Engineering', 'AI'],
    url: 'https://github.com/krishanumishra21/Antarman-ai'
  }
];

const pg = document.getElementById('projects-grid');
projects.forEach(p => {
  const badgeHtml = p.badge
    ? `<span style="display:inline-block;font-family:var(--mono);font-size:.65rem;color:var(--c);border:1px solid rgba(0,229,200,.3);padding:2px 8px;margin-bottom:10px;background:rgba(0,229,200,.06);letter-spacing:.06em">${p.badge}</span><br>`
    : '';
  pg.innerHTML += `
    <div class="project-card">
      ${badgeHtml}
      <div class="project-num">PROJECT ${p.num}</div>
      <h3>${p.title}</h3>
      <div class="tag-row">${p.tags.map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
      <p>${p.desc}</p>
      <a href="${p.url}" target="_blank" class="github-link">↗ View on GitHub</a>
    </div>`;
});

// Footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Hamburger
const hamburger = document.getElementById('hamburger');
const navUl = document.querySelector('nav ul');
hamburger.addEventListener('click', () => navUl.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => navUl.classList.remove('open')));

// Canvas particles
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
const hero = document.getElementById('hero');

function resize() {
  canvas.width = hero.clientWidth;
  canvas.height = hero.clientHeight;
}
resize();
window.addEventListener('resize', resize);

const COUNT = window.innerWidth < 768 ? 50 : 90;
const particles = Array.from({ length: COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - .5) * .4,
  vy: (Math.random() - .5) * .4,
  size: Math.random() * 1.4 + .6,
  pulse: Math.random() * Math.PI * 2
}));

const mouse = { x: -9999, y: -9999 };
hero.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});
hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

let frame = 0;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;

  particles.forEach((p, i) => {
    p.pulse += .022;
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 110) {
      const force = (110 - dist) / 110 * .55;
      p.vx += dx / dist * force;
      p.vy += dy / dist * force;
    }
    p.vx *= .993;
    p.vy *= .993;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    const alpha = .35 + .25 * Math.sin(p.pulse);
    ctx.fillStyle = `rgba(0,229,200,${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        ctx.strokeStyle = `rgba(0,229,200,${(1 - d / 120) * .15})`;
        ctx.lineWidth = .5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
}
animate();

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// Counter animation
const counters = document.querySelectorAll('.stat-num[data-target]');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.getAttribute('data-target');
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
    cObs.unobserve(el);
  });
}, { threshold: .5 });
counters.forEach(c => cObs.observe(c));

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id ? 'var(--c)' : '';
      });
    }
  });
}, { threshold: .4 });
sections.forEach(s => navObs.observe(s));
