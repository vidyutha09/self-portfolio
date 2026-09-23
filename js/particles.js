/**
 * High-performance ambient particle constellation network
 * Subtle futuristic background with purple, blue, and pink glows
 */
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };
  let particles = [];
  let isRunning = true;

  // Colors aligned with the design palette
  const colors = [
    'rgba(168, 85, 247, 0.45)', // Purple
    'rgba(56, 189, 248, 0.45)',  // Blue
    'rgba(236, 72, 153, 0.40)'   // Pink
  ];

  // Adjust particle count dynamically based on screen width
  function getParticleCount() {
    return window.innerWidth < 768 ? 28 : 55;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 5;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Natural gentle drift
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges seamlessly
      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;

      // Interactive gentle mouse push
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 1.5;
          const directionY = forceDirectionY * force * 1.5;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.draw();
    }
  }

  function init() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    const maxDist = 130;
    const maxDistSq = maxDist * maxDist;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          let dist = Math.sqrt(distSq);
          let opacity = (1 - dist / maxDist) * 0.16;
          ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();

    requestAnimationFrame(animate);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  });

  // Track mouse gently
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Pause when offscreen or tab hidden for battery efficiency
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
    } else {
      isRunning = true;
      animate();
    }
  });

  init();
  animate();
})();
