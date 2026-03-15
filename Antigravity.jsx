import React, { useEffect, useRef } from 'react';

const Antigravity = ({
  count = 250,
  magnetRadius = 150,
  ringRadius = 16,
  waveSpeed = 1,
  waveAmplitude = 1,
  particleSize = 3, // Increased default
  lerpSpeed = 0.05, // Smoother lerp
  color = "#5b21b6",
  autoAnimate = true,
  particleVariance = 2.5,
  rotationSpeed = 0.1,
  depthFactor = 1.5,
  pulseSpeed = 2,
  particleShape = "circle", // Default to circle for cleaner look
  fieldStrength = 40,
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x: x,
          y: y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: (Math.random() + 0.8) * particleSize, // Minimum size boosted
          phase: Math.random() * Math.PI * 2,
          angle: Math.random() * Math.PI * 2,
          // Varied ring radius so they don't concentrate
          r: ringRadius * (0.5 + Math.random() * 2), 
          opacity: 0.2 + Math.random() * 0.6,
        });
      }
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const drawParticles = (time) => {
      ctx.clearRect(0, 0, width, height);
      
      const t = time * 0.001;

      particles.forEach((p) => {
        if (autoAnimate) {
          // Orbital motion around origin
          p.angle += rotationSpeed * 0.01;
          
          const wave = Math.sin(t * waveSpeed + p.phase) * waveAmplitude;
          const targetX = p.originX + Math.cos(p.angle) * p.r + wave * 10;
          const targetY = p.originY + Math.sin(p.angle) * p.r + wave * 10;

          // Magnet effect
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < magnetRadius) {
            const force = (1 - dist / magnetRadius) * fieldStrength;
            p.vx += (dx / dist) * force * 0.05;
            p.vy += (dy / dist) * force * 0.05;
          }

          // Soft lerping
          p.vx += (targetX - p.x) * lerpSpeed;
          p.vy += (targetY - p.y) * lerpSpeed;

          // Friction
          p.vx *= 0.85;
          p.vy *= 0.85;
          
          p.x += p.vx;
          p.y += p.vy;

          // Pulse
          const pulse = Math.sin(t * pulseSpeed + p.phase) * depthFactor;
          const currentSize = Math.max(1, p.size + pulse);

          // Render with softness
          ctx.beginPath();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = color;
          
          if (particleShape === "box") {
            ctx.fillRect(p.x - currentSize / 2, p.y - currentSize / 2, currentSize, currentSize);
          } else {
            ctx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Add subtle glow to larger or closer particles
          if (currentSize > 3) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
          } else {
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    drawParticles(0);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, magnetRadius, ringRadius, waveSpeed, waveAmplitude, particleSize, lerpSpeed, color, autoAnimate, rotationSpeed, depthFactor, pulseSpeed, particleShape, fieldStrength]);

  return (
    <canvas
      ref={canvasRef}
      className="antigravity-canvas"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default Antigravity;
