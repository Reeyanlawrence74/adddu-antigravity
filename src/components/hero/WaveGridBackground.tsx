import React, { useEffect, useRef } from 'react';

export interface WaveGridBackgroundProps {
  /** Hero container element observed for viewport visibility and passive pointer tracking */
  containerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

interface RippleNode {
  x: number;
  y: number;
  age: number;
  strength: number;
}

/**
 * Lightweight local equivalent of Vengeance UI's Wave Grid Background,
 * adapted to the Japanese Ivory (#F7F4ED), Soft Beige (#E8E0D3), and
 * Japanese Crimson (#A6192E) palette.
 *
 * - Renders an interactive grid of subtly elevated tiles with Gaussian
 *   wavefront ripples driven by cursor trails (and gentle idle ripples).
 * - Zero external dependencies or WebGL overhead.
 * - Strictly pointer-events-none; listens passively on containerRef.
 * - Pauses requestAnimationFrame when outside viewport and honours prefers-reduced-motion.
 */
export const WaveGridBackground: React.FC<WaveGridBackgroundProps> = ({
  containerRef,
  className = '',
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
    let cellSize = 36;

    const MAX_TRAIL = 36;
    const FADE_TIME = 1.8;
    const WAVE_SPEED = 240; // px / sec
    const WAVE_FREQ = 0.042;
    const WAVE_WIDTH = 95;
    const TRAIL_SPACING = 26;

    const trail: RippleNode[] = [];
    let lastPoint: { x: number; y: number } | null = null;
    let timeSinceMove = 0;
    let idleTimer = 0.9;
    let lastTimestamp = performance.now();

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cellSize = width < 640 ? 40 : 34;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (isReduced) {
        drawGrid(0);
      }
    };

    const addIdleRipple = () => {
      const x = width * (0.2 + Math.random() * 0.6);
      const y = height * (0.22 + Math.random() * 0.56);
      if (trail.length >= MAX_TRAIL) trail.shift();
      trail.push({ x, y, age: 0, strength: 0.72 });
    };

    const updateTrail = (deltaSec: number) => {
      const maxAge = FADE_TIME * 3.2;
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += deltaSec;
        if (trail[i].age > maxAge) {
          trail.splice(i, 1);
        }
      }

      timeSinceMove += deltaSec;
      if (timeSinceMove >= 2.2) {
        idleTimer += deltaSec;
        if (idleTimer >= 1.55) {
          addIdleRipple();
          idleTimer = 0;
        }
      }
    };

    const drawGrid = (deltaSec: number) => {
      ctx.clearRect(0, 0, width, height);

      if (!isReduced) {
        updateTrail(deltaSec);
      }

      // Warm Ivory & subtle Soft Beige center wash behind portrait
      const spotlight = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        24,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.52
      );
      spotlight.addColorStop(0, 'rgba(232, 224, 211, 0.52)');
      spotlight.addColorStop(0.45, 'rgba(166, 25, 46, 0.035)');
      spotlight.addColorStop(1, 'rgba(247, 244, 237, 0)');
      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;
      const offsetX = ((width % cellSize) - cellSize) * 0.5;
      const offsetY = ((height % cellSize) - cellSize) * 0.5;
      const gap = 3;
      const tileSize = cellSize - gap;
      const trailCount = trail.length;

      for (let r = 0; r < rows; r++) {
        const baseY = offsetY + r * cellSize;
        const centerY = baseY + cellSize * 0.5;

        for (let c = 0; c < cols; c++) {
          const baseX = offsetX + c * cellSize;
          const centerX = baseX + cellSize * 0.5;

          let waveHeight = 0;
          let totalWeight = 0;

          if (!isReduced && trailCount > 0) {
            for (let i = 0; i < trailCount; i++) {
              const node = trail[i];
              const dx = centerX - node.x;
              const dy = centerY - node.y;
              const dist = Math.hypot(dx, dy);
              const wavefront = WAVE_SPEED * node.age;
              const relDist = dist - wavefront;

              if (Math.abs(relDist) > WAVE_WIDTH * 2.4) continue;

              const windowEnv = Math.exp(-(relDist * relDist) / (WAVE_WIDTH * WAVE_WIDTH));
              const fade = Math.exp(-node.age / FADE_TIME);
              const atten = 1 / (1 + dist * 0.0045);
              const weight = fade * windowEnv * atten * node.strength;

              waveHeight += weight * Math.cos(WAVE_FREQ * relDist);
              totalWeight += weight;
            }
          }

          if (totalWeight > 1) {
            waveHeight /= totalWeight;
          }

          const clamped = Math.max(-1, Math.min(1, waveHeight));
          const positivePeak = Math.max(0, clamped);
          const elevation = clamped * 4.5;
          const drawY = baseY - elevation;

          // Base Warm Ivory / Soft Beige tile border
          const strokeAlpha = 0.065 + positivePeak * 0.19;
          if (positivePeak > 0.06) {
            // Subtle Soft Beige drop shadow beneath elevated tile
            ctx.fillStyle = `rgba(48, 43, 40, ${0.035 * positivePeak})`;
            ctx.fillRect(baseX + 1.5, baseY + 2.5, tileSize, tileSize);

            // Soft Beige to restrained Japanese Crimson crest fill
            const crimsonAlpha = Math.min(0.18, positivePeak * 0.18);
            const beigeAlpha = Math.min(0.42, positivePeak * 0.35);
            ctx.fillStyle = `rgba(232, 224, 211, ${beigeAlpha})`;
            ctx.fillRect(baseX, drawY, tileSize, tileSize);

            ctx.fillStyle = `rgba(166, 25, 46, ${crimsonAlpha})`;
            ctx.fillRect(baseX, drawY, tileSize, tileSize);

            ctx.strokeStyle = `rgba(166, 25, 46, ${strokeAlpha})`;
          } else {
            ctx.strokeStyle = `rgba(48, 43, 40, ${strokeAlpha})`;
          }

          ctx.lineWidth = 1;
          ctx.strokeRect(baseX + 0.5, drawY + 0.5, tileSize - 1, tileSize - 1);
        }
      }
    };

    const tick = (now: number) => {
      if (!isVisible || isReduced) return;
      const deltaSec = Math.min(0.05, Math.max(0.001, (now - lastTimestamp) * 0.001));
      lastTimestamp = now;
      drawGrid(deltaSec);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      cancelAnimationFrame(rafId);
      lastTimestamp = performance.now();
      if (isReduced) {
        drawGrid(0);
      } else if (isVisible) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || isReduced) return;
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let strength = 0.85;
      if (lastPoint) {
        const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
        if (dist < TRAIL_SPACING) return;
        strength = Math.min(1.05, 0.55 + dist / 140);
      }

      if (trail.length >= MAX_TRAIL) trail.shift();
      trail.push({ x, y, age: 0, strength });
      lastPoint = { x, y };
      timeSinceMove = 0;
    };

    const onPointerLeave = () => {
      lastPoint = null;
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
    if (!isReduced) addIdleRipple();
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
    <div
      aria-hidden="true"
      data-wave-grid-background="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Restrained warm vignette blending grid edges seamlessly into Warm Ivory (#F7F4ED) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_36%,#F7F4ED_94%)]" />
    </div>
  );
};

export default WaveGridBackground;
