import React, { useEffect, useRef } from 'react';

interface InteractiveGridBackgroundProps {
  /** Container element to observe for viewport visibility and pointer tracking */
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Restrained animated crimson dot-grid inspired by Canvas Fractal Grid.
 * - Dot size: ~2.3px, spacing: 25px, opacity: 0.35–0.78
 * - Wave radius: 225px, wave intensity: 32
 * - Pauses RAF when outside viewport; respects prefers-reduced-motion; caps DPR at 1.5.
 */
export const InteractiveGridBackground: React.FC<InteractiveGridBackgroundProps> = ({
  containerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = containerRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReduced = reducedMotionQuery.matches;
    let isVisible = true;
    let rafId = 0;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Smoothed pointer state inside hero
    let pointerX = -9999;
    let pointerY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let pointerActive = false;
    let pointerStrength = 0;

    const SPACING = 25;
    const DOT_RADIUS = 1.25; // ~2.5px diameter
    const WAVE_RADIUS = 225;
    const WAVE_INTENSITY = 32;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (isReduced) {
        drawFrame(0);
      }
    };

    const drawFrame = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);

      // 6.5s subtle crimson ambient gradient breathing
      const t = timeMs * 0.001;
      const cycle = (Math.sin((t / 6.5) * Math.PI * 2) + 1) * 0.5;

      // Restrained warm crimson & beige spotlight behind centre silhouette
      const centerGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.46,
        20,
        width * 0.5,
        height * 0.46,
        Math.max(width, height) * 0.48
      );
      centerGrad.addColorStop(0, `rgba(166, 25, 46, ${0.07 + cycle * 0.035})`);
      centerGrad.addColorStop(0.45, 'rgba(232, 224, 211, 0.42)');
      centerGrad.addColorStop(0.8, 'rgba(247, 244, 237, 0.16)');
      centerGrad.addColorStop(1, 'rgba(247, 244, 237, 0)');
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, width, height);

      // Smooth pointer interpolation
      if (pointerActive) {
        smoothX += (pointerX - smoothX) * 0.14;
        smoothY += (pointerY - smoothY) * 0.14;
        pointerStrength += (1 - pointerStrength) * 0.1;
      } else {
        pointerStrength += (0 - pointerStrength) * 0.06;
      }

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width % SPACING) * 0.5;
      const offsetY = (height % SPACING) * 0.5;

      for (let r = 0; r < rows; r++) {
        const baseY = offsetY + r * SPACING;
        for (let c = 0; c < cols; c++) {
          const baseX = offsetX + c * SPACING;

          let drawX = baseX;
          let drawY = baseY;
          let influence = 0;

          if (!isReduced && pointerStrength > 0.01) {
            const dx = baseX - smoothX;
            const dy = baseY - smoothY;
            const distSq = dx * dx + dy * dy;
            if (distSq < WAVE_RADIUS * WAVE_RADIUS && distSq > 0.001) {
              const dist = Math.sqrt(distSq);
              const norm = 1 - dist / WAVE_RADIUS;
              const ripple = Math.sin(dist * 0.045 - t * 3.2) * 0.5 + 0.5;
              influence = norm * norm * pointerStrength;
              const push = influence * WAVE_INTENSITY * (0.45 + ripple * 0.55);
              drawX += (dx / dist) * push * 0.35;
              drawY += (dy / dist) * push * 0.35;
            }
          }

          // Subtle autonomous harmonic drift
          const wave = isReduced
            ? 0
            : Math.sin(c * 0.24 + t * 0.9) * Math.cos(r * 0.24 - t * 0.7) * 0.5 + 0.5;

          const baseAlpha = 0.15 + wave * 0.16;
          const alpha = Math.min(0.72, baseAlpha + influence * 0.45);
          const radius = DOT_RADIUS + influence * 0.95;

          if (influence > 0.16) {
            ctx.fillStyle = `rgba(166, 25, 46, ${alpha})`;
          } else if (wave > 0.65) {
            ctx.fillStyle = `rgba(166, 25, 46, ${alpha * 0.72})`;
          } else {
            ctx.fillStyle = `rgba(101, 93, 86, ${alpha * 0.52})`;
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = (timeMs: number) => {
      if (!isVisible || isReduced) return;
      drawFrame(timeMs);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      cancelAnimationFrame(rafId);
      if (isReduced) {
        drawFrame(0);
      } else if (isVisible) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      if (!pointerActive) {
        smoothX = pointerX;
        smoothY = pointerY;
        pointerActive = true;
      }
    };

    const onPointerLeave = () => {
      pointerActive = false;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible) {
          startLoop();
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.02 }
    );

    const onMotionChange = () => {
      isReduced = reducedMotionQuery.matches;
      startLoop();
    };

    resize();
    observer.observe(host);
    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', resize, { passive: true });
    reducedMotionQuery.addEventListener('change', onMotionChange);
    startLoop();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
      reducedMotionQuery.removeEventListener('change', onMotionChange);
    };
  }, [containerRef]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Restrained 5% noise texture overlay */}
      <div className="film-grain pointer-events-none absolute inset-0 opacity-[0.05]" />
      {/* Vignette to keep edges warm ivory */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_38%,#F7F4ED_92%)]" />
    </div>
  );
};
