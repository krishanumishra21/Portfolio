const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
const hero = document.getElementById("hero");

function resizeCanvas() {
  canvas.width = hero.clientWidth;
  canvas.height = hero.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 40 : 80;

let particles = [];

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.fillStyle = "#00ffff";
    ctx.fillRect(p.x, p.y, 2, 2);

    particles.forEach(q => {
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        ctx.strokeStyle = "rgba(0,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animate);
}

animate();
