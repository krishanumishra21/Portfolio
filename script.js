
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
    title: 'Royal Stay Hotel',
    desc: 'A premium, fully responsive hospitality showcase and booking platform designed for luxury aesthetics and high-conversion client engagement.',
    tags: ['HTML5', 'CSS3 (Vanilla)', 'JavaScript', 'Responsive Design'],
    liveUrl: 'https://royalstayhotelsample.netlify.app',
    badge: 'Commercial Showcase',
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
  {
    num: '04',
    title: 'AutoForge AI',
    desc: 'A multi-agent AutoML platform enabling users to upload CSVs and automatically generate optimized, production-ready machine learning models in seconds with real-time logs.',
    tags: ['React 19', 'FastAPI', 'Scikit-Learn', 'Pandas', 'Multi-Agent AI'],
    url: 'https://github.com/krishanumishra21/Autoforge-ai',
    badge: 'AutoML Platform',
  },
];

const pg = document.getElementById('projects-grid');
projects.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-reveal', '');
  card.setAttribute('data-tilt', '');

  let linksHtml = '';
  if (p.liveUrl) {
    linksHtml += `<a href="${p.liveUrl}" target="_blank" class="pc-link pc-link--accent" data-cursor="link">⚡ Live Demo</a>`;
  }
  if (p.url) {
    linksHtml += `<a href="${p.url}" target="_blank" class="pc-link" data-cursor="link">↗ GitHub</a>`;
  }

  card.innerHTML = `
    ${p.badge ? `<div class="pc-badge">${p.badge}</div>` : ''}
    <div class="pc-num">PROJECT ${p.num}</div>
    <h3>${p.title}</h3>
    <div class="pc-tags">${p.tags.map(t => `<span class="pc-tag">${t}</span>`).join('')}</div>
    <p>${p.desc}</p>
    <div class="pc-links-row">${linksHtml}</div>
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
   CERTIFICATIONS DATA & RENDERING
   ═══════════════════════════════════════════ */
const certifications = [
  {
    title: "Certificate of Merit",
    issuer: "CGC University Mohali",
    date: "Feb 2026",
    desc: "Awarded for demonstrating outstanding academic excellence, exemplary dedication, and remarkable performance during the Vistos event.",
    tags: ["Academic Excellence", "Leadership", "Performance"],
    file: "certificates/cgc-merit-certificate.jpg",
    fileType: "image",
    verifyUrl: ""
  },
  {
    title: "Java Programming Fundamentals",
    issuer: "Infosys Springboard",
    date: "Apr 2026",
    desc: "Comprehensive certification covering Java fundamentals, object-oriented programming concepts, and core language structures.",
    tags: ["Java", "OOPs", "Programming Fundamentals"],
    file: "certificates/infosys-java.pdf",
    fileType: "pdf",
    verifyUrl: "https://verify.onwingspan.com"
  },
  {
    title: "Programming Fundamentals using Python - Part 1",
    issuer: "Infosys Springboard",
    date: "Oct 2025",
    desc: "Certification verifying strong foundational knowledge in Python, including algorithms, control structures, and basic data structures.",
    tags: ["Python", "Algorithms", "Data Structures"],
    file: "certificates/infosys-python.pdf",
    fileType: "pdf",
    verifyUrl: "https://verify.onwingspan.com"
  },
  {
    title: "CRUD Operations in MongoDB",
    issuer: "MongoDB",
    date: "Dec 2025",
    desc: "Hands-on certification from MongoDB verifying skills in creating, reading, updating, and deleting data within MongoDB collections.",
    tags: ["MongoDB", "NoSQL", "CRUD Operations", "Database"],
    file: "certificates/mongodb-crud.pdf",
    fileType: "pdf",
    verifyUrl: "https://www.credly.com/badges/6238719b-2b17-490d-a473-7ead2c06e02c"
  },
  {
    title: "MongoDB Overview: Core Concepts and Architecture",
    issuer: "MongoDB",
    date: "Dec 2025",
    desc: "Certification covering MongoDB core architecture, data modeling, indexing, and fundamental NoSQL database design principles.",
    tags: ["MongoDB", "Database Architecture", "NoSQL", "Data Modeling"],
    file: "certificates/mongodb-overview.pdf",
    fileType: "pdf",
    verifyUrl: "https://www.credly.com/badges/112d59cd-43e0-4ac7-bd46-67aad5a1ace4"
  }
];

const cgGrid = document.getElementById('certificates-grid');
const certModal = document.getElementById('cert-modal');
const certModalTitle = document.getElementById('cert-modal-title');
const certModalDownload = document.getElementById('cert-modal-download');
const certModalBody = document.getElementById('cert-modal-body');
const certModalClose = document.getElementById('cert-modal-close');

certifications.forEach((c, i) => {
  const card = document.createElement('div');
  card.className = 'certificate-card';
  card.setAttribute('data-reveal', '');
  card.setAttribute('data-tilt', '');

  let linksHtml = `<a href="#" class="cert-link cert-link--accent view-cert-btn" data-cursor="link">👁 View Certificate</a>`;
  if (c.verifyUrl) {
    linksHtml += `<a href="${c.verifyUrl}" target="_blank" class="cert-link" data-cursor="link">↗ Verify Credential</a>`;
  }

  card.innerHTML = `
    <div class="cert-issuer-row">
      <div class="cert-issuer">${c.issuer}</div>
      <div class="cert-date">${c.date}</div>
    </div>
    <h3>${c.title}</h3>
    <div class="cert-tags">${c.tags.map(t => `<span class="cert-tag">${t}</span>`).join('')}</div>
    <p>${c.desc}</p>
    <div class="cert-links-row">${linksHtml}</div>
  `;
  
  // View certificate event
  const viewBtn = card.querySelector('.view-cert-btn');
  viewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCertificate(c);
  });

  cgGrid.appendChild(card);

  // 3D tilt
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

  // Cursor hover hooks
  card.setAttribute('data-cursor', 'link');
  card.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  card.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });

  card.style.transitionDelay = `${i * 0.08}s`;
});

function openCertificate(cert) {
  certModalTitle.textContent = cert.title + " — " + cert.issuer;
  certModalDownload.setAttribute('href', cert.file);
  certModalDownload.setAttribute('download', cert.file.split('/').pop());
  
  if (cert.fileType === 'pdf') {
    certModalBody.innerHTML = `<iframe src="${cert.file}" class="cert-iframe"></iframe>`;
  } else {
    certModalBody.innerHTML = `<img src="${cert.file}" alt="${cert.title}" class="cert-img-view" />`;
  }
  
  certModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertificate() {
  certModal.classList.remove('active');
  document.body.style.overflow = '';
  // Clear modal body to stop any loading pdf/iframe
  setTimeout(() => {
    certModalBody.innerHTML = '';
  }, 400);
}

if (certModalClose) {
  certModalClose.addEventListener('click', closeCertificate);
}
if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertificate();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal.classList.contains('active')) {
    closeCertificate();
  }
});

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

/* ═══════════════════════════════════════════
   RESUME MODAL CONTROL
═══════════════════════════════════════════ */
const resumeModal = document.getElementById('resume-modal');
const resumeModalClose = document.getElementById('resume-modal-close');
const resumeLinks = [
  document.getElementById('resume-link'),
  document.getElementById('resume-link-mobile'),
  document.getElementById('resume-btn-hero')
];

function openResume(e) {
  if (e) e.preventDefault();
  resumeModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeResume() {
  resumeModal.classList.remove('active');
  document.body.style.overflow = '';
}

resumeLinks.forEach(link => {
  if (link) link.addEventListener('click', openResume);
});

if (resumeModalClose) {
  resumeModalClose.addEventListener('click', closeResume);
}

if (resumeModal) {
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeResume();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
    closeResume();
  }
});
