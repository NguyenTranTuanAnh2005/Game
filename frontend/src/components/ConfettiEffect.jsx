import React, { useEffect, useRef } from 'react';

export default function ConfettiEffect({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pastelColors = [
      '#FFB7C5', // Soft pink
      '#FFDEE9', // Pale rose
      '#FFF3B0', // Butter yellow
      '#D8F3DC', // Mint green
      '#D0E8FF', // Baby blue
      '#E8D7F1', // Soft lavender
      '#FFE5D9', // Peach
    ];

    const shapes = ['heart', 'star', 'sakura', 'bubble'];
    const particles = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.45,
        size: Math.random() * 14 + 10,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 1.1) * 16,
        gravity: 0.22,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        opacity: 1,
      });
    }

    let animationFrameId;

    // Helper vẽ trái tim bé nhỏ
    function drawHeart(c, x, y, size, color) {
      c.save();
      c.beginPath();
      c.translate(x, y);
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.5, 0, size);
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.5, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fillStyle = color;
      c.fill();
      c.restore();
    }

    // Helper vẽ ngôi sao nhỏ
    function drawStar(c, x, y, r, color) {
      c.save();
      c.beginPath();
      c.translate(x, y);
      for (let i = 0; i < 5; i++) {
        c.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
        c.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2));
      }
      c.closePath();
      c.fillStyle = color;
      c.fill();
      c.restore();
    }

    // Helper vẽ cánh hoa đào (Sakura)
    function drawSakura(c, x, y, size, color) {
      c.save();
      c.beginPath();
      c.translate(x, y);
      for (let i = 0; i < 5; i++) {
        c.rotate((72 * Math.PI) / 180);
        c.moveTo(0, 0);
        c.quadraticCurveTo(size * 0.4, -size * 0.8, 0, -size);
        c.quadraticCurveTo(-size * 0.4, -size * 0.8, 0, 0);
      }
      c.fillStyle = color;
      c.fill();
      c.restore();
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveCount = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.004;

        if (p.opacity > 0 && p.y < canvas.height + 40) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);

          if (p.shape === 'heart') {
            drawHeart(ctx, p.x, p.y, p.size, p.color);
          } else if (p.shape === 'star') {
            drawStar(ctx, p.x, p.y, p.size * 0.8, p.color);
          } else if (p.shape === 'sakura') {
            drawSakura(ctx, p.x, p.y, p.size * 0.7, p.color);
          } else {
            // Bong bóng tròn
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
