import { useRef, useEffect, useCallback } from 'react';

/**
 * CursorTrail — Premium neon-green glowing particle trail that follows the mouse.
 *
 * Renders on a fixed full-viewport canvas (pointer-events: none) so it
 * overlays everything without blocking interaction.  GPU-friendly: uses a
 * single requestAnimationFrame loop, recycles particles from a pool, and
 * never allocates on every frame.
 */

const MAX_PARTICLES = 60;
const SPAWN_RATE = 3;          // particles per mousemove event
const BASE_LIFE = 40;          // frames a particle lives
const BASE_RADIUS = 3.5;
const GLOW_MULTIPLIER = 4;     // glow ring radius = particle radius * this
const DRIFT_SPEED = 0.6;       // random drift per frame
const FRICTION = 0.97;
const COLOR = { r: 0, g: 255, b: 136 }; // #00ff88

function createParticle(x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * DRIFT_SPEED + 0.2;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: BASE_LIFE + Math.random() * 15,
    maxLife: BASE_LIFE + Math.random() * 15,
    radius: BASE_RADIUS * (Math.random() * 0.6 + 0.6),
    alive: true,
  };
}

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animRef = useRef(null);
  const dimRef = useRef({ w: 0, h: 0 });

  /* ── Spawn new particles on mouse move ── */
  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;

    const pool = particlesRef.current;
    let spawned = 0;

    for (let i = 0; i < pool.length && spawned < SPAWN_RATE; i++) {
      if (!pool[i].alive) {
        const p = createParticle(e.clientX, e.clientY);
        Object.assign(pool[i], p);
        spawned++;
      }
    }

    // If the pool isn't full yet, push new ones
    while (spawned < SPAWN_RATE && pool.length < MAX_PARTICLES) {
      pool.push(createParticle(e.clientX, e.clientY));
      spawned++;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Pre-fill the particle pool with dead particles
    particlesRef.current = Array.from({ length: MAX_PARTICLES }, () => ({
      x: 0, y: 0, vx: 0, vy: 0,
      life: 0, maxLife: 1, radius: 0, alive: false,
    }));

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimRef.current = { w, h };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    /* ── Main cursor glow (large soft orb that sticks to cursor) ── */
    const drawCursorGlow = (mx, my) => {
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
      gradient.addColorStop(0, `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, 0.12)`);
      gradient.addColorStop(0.4, `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, 0.04)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(mx, my, 80, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      const { w, h } = dimRef.current;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw the soft cursor glow orb
      if (mx > 0 && my > 0) {
        drawCursorGlow(mx, my);
      }

      // Update & draw trail particles
      const pool = particlesRef.current;
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.alive) continue;

        p.life -= 1;
        if (p.life <= 0) {
          p.alive = false;
          continue;
        }

        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife; // 1 → 0
        const alpha = progress * 0.8;
        const r = p.radius * progress;

        if (r <= 0.1) continue;

        // Outer glow ring
        const glowR = r * GLOW_MULTIPLIER;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        glow.addColorStop(0, `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, ${alpha * 0.35})`);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    />
  );
}
