import { useRef, useEffect, useCallback } from "react";

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 140;
const PARTICLE_SPEED = 0.35;
const GRID_SPACING = 60;
const GRID_OPACITY = 0.04;
const PARALLAX_STRENGTH = 15;

function createParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
    vy: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
    radius: Math.random() * 1.8 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
  };
}

export default function CyberBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef(null);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  const initParticles = useCallback((width, height) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(width, height)
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimensionsRef.current = { w, h };

      if (particlesRef.current.length === 0) {
        initParticles(w, h);
      } else {
        particlesRef.current.forEach((p) => {
          if (p.x > w) p.x = Math.random() * w;
          if (p.y > h) p.y = Math.random() * h;
        });
      }
    };

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const drawGrid = (w, h, offsetX, offsetY) => {
      ctx.strokeStyle = `rgba(0, 255, 136, ${GRID_OPACITY})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      const startX = (offsetX % GRID_SPACING) - GRID_SPACING;
      const startY = (offsetY % GRID_SPACING) - GRID_SPACING;
      for (let x = startX; x <= w + GRID_SPACING; x += GRID_SPACING) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = startY; y <= h + GRID_SPACING; y += GRID_SPACING) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    };

    const animate = () => {
      const { w, h } = dimensionsRef.current;
      if (w === 0 || h === 0) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const parallaxX = (mouseRef.current.x - 0.5) * PARALLAX_STRENGTH;
      const parallaxY = (mouseRef.current.y - 0.5) * PARALLAX_STRENGTH;

      drawGrid(w, h, parallaxX * 0.5, parallaxY * 0.5);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x + parallaxX - (b.x + parallaxX);
          const dy = a.y + parallaxY - (b.y + parallaxY);
          const distSq = dx * dx + dy * dy;
          const maxDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.25;
            ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x + parallaxX, a.y + parallaxY);
            ctx.lineTo(b.x + parallaxX, b.y + parallaxY);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
        ctx.fill();

        if (p.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            drawX,
            drawY,
            0,
            drawX,
            drawY,
            p.radius * 3
          );
          glow.addColorStop(0, `rgba(0, 255, 136, ${p.opacity * 0.3})`);
          glow.addColorStop(1, "rgba(0, 255, 136, 0)");
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
      aria-hidden="true"
    />
  );
}
