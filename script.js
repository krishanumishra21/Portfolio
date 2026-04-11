// Skills
const skills = ['HTML','CSS','JavaScript','Python','C','C++','React','Node.js','MongoDB','Express.js','Postman API'];
const sg = document.getElementById('skills-grid');
skills.forEach(s => {
  const d = document.createElement('div');
  d.className = 'skill-tag';
  d.textContent = s;
  sg.appendChild(d);
});

// Projects
const projects = [
  {
    title: 'Emergency QR Medical Profile',
    desc: 'QR-based system storing essential medical information for emergency situations. Fast, reliable, and life-saving.',
    tags: ['React', 'Node.js', 'MongoDB'],
    url: 'https://github.com/krishanumishra21/emergency-medical-qr'
  },
  {
    title: 'Aarogya AI',
    desc: 'AI-powered digital healthcare platform connecting patients, doctors, and hospitals into one unified system for smarter, accessible care.',
    tags: ['MERN', 'AI', 'Healthcare'],
    url: 'https://github.com/krishanumishra21/AAROGYA-AI'
  },
  {
    title: 'Antarman AI',
    desc: 'अंतरमन simulates dynamic AI personalities with a trait-based prompt engine. Users create personas with confidence, empathy, aggression, and humor that evolve over time.',
    tags: ['MERN', 'AI', 'Personality Engine'],
    url: 'https://github.com/krishanumishra21/Antarman-ai'
  }
];
const pg = document.getElementById('projects-grid');
projects.forEach(p => {
  pg.innerHTML += `
    <div class="project-card">
      <h3>${p.title}</h3>
      <div class="tag-row">${p.tags.map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
      <p>${p.desc}</p>
      <a href="${p.url}" target="_blank" class="github-link">↗ View on GitHub</a>
    </div>`;
});

// Canvas particle animation
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
const hero = document.getElementById('hero');

function resize() {
  canvas.width = hero.clientWidth;
  canvas.height = hero.clientHeight;
}
resize();
window.addEventListener('resize', resize);

const COUNT = window.innerWidth < 768 ? 55 : 100;
let particles = Array.from({ length: COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - .5) * .45,
  vy: (Math.random() - .5) * .45,
  size: Math.random() * 1.5 + .8,
  pulse: Math.random() * Math.PI * 2
}));

let mouse = { x: -9999, y: -9999 };
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
    p.pulse += .025;

    // Mouse repel
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 100) {
      const force = (100 - dist) / 100 * .6;
      p.vx += dx / dist * force;
      p.vy += dy / dist * force;
    }

    p.vx *= .995;
    p.vy *= .995;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    const alpha = .4 + .3 * Math.sin(p.pulse);
    ctx.fillStyle = `rgba(0,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        const a = (1 - d / 130) * .18;
        ctx.strokeStyle = `rgba(0,255,255,${a})`;
        ctx.lineWidth = .6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });

  // Scanline sweep
  if (frame % 2 === 0) {
    const scanY = ((frame * .4) % (canvas.height + 40)) - 20;
    const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(.5, 'rgba(0,255,255,0.03)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 30, canvas.width, 60);
  }

  requestAnimationFrame(animate);
}
animate();

// Typing animation
const phrases = ['console.log("Hello World!");', 'npm start', 'git commit -m "init"'];
let pi = 0, ci = 0, deleting = false;
const typed = document.getElementById('typed-text');

function typeLoop() {
  const phrase = phrases[pi];
  if (!deleting) {
    typed.textContent = phrase.slice(0, ci++);
    if (ci > phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typed.textContent = phrase.slice(0, ci--);
    if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
typeLoop();

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});
