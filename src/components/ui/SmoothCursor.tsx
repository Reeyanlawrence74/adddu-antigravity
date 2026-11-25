import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cursorStore } from '../../lib/cursorStore';

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
  restDelta: number;
}

export interface SmoothCursorProps {
  cursor?: React.ReactNode;
  springConfig?: SpringConfig;
}

const DEFAULT_SPRING_CONFIG: SpringConfig = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.001,
};

/**
 * Magic UI DefaultCursorSVG adapted to the Ivory & Crimson theme.
 */
export const DefaultCursorSVG: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={32}
    viewBox="0 0 50 54"
    fill="none"
    style={{ filter: 'drop-shadow(0 3px 8px rgba(48, 43, 40, 0.22))' }}
  >
    <path
      d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
      fill="#A6192E"
    />
    <path
      d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
      stroke="#F7F4ED"
      strokeWidth={2.4}
    />
  </svg>
);

/**
 * Magic UI Smooth Cursor (`motion/react` physics + velocity rotation)
 * integrated with the Ivory & Crimson theme, with automatic handoff to
 * the original portrait reveal cursor inside `[data-fighter-reveal="true"]`.
 */
export const SmoothCursor: React.FC<SmoothCursorProps> = ({
  cursor = <DefaultCursorSVG />,
  springConfig = DEFAULT_SPRING_CONFIG,
}) => {
  const [enabled, setEnabled] = useState(false);

  // Magic UI spring-driven motion values (zero React re-renders per frame)
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  });
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const magicCursorRef = useRef<HTMLDivElement>(null);
  const revealRingRef = useRef<HTMLDivElement>(null);
  const revealLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    const evaluateSupport = () => {
      const hasTouch = coarsePointerQuery.matches || window.innerWidth < 1024;
      const canUse = finePointerQuery.matches && !reducedMotionQuery.matches && !hasTouch;
      setEnabled(canUse);
      if (!canUse) {
        document.documentElement.classList.remove('custom-cursor-active');
        cursorStore.update({ cursorActive: false });
      }
    };

    evaluateSupport();
    finePointerQuery.addEventListener('change', evaluateSupport);
    reducedMotionQuery.addEventListener('change', evaluateSupport);
    coarsePointerQuery.addEventListener('change', evaluateSupport);
    window.addEventListener('resize', evaluateSupport, { passive: true });

    return () => {
      finePointerQuery.removeEventListener('change', evaluateSupport);
      reducedMotionQuery.removeEventListener('change', evaluateSupport);
      coarsePointerQuery.removeEventListener('change', evaluateSupport);
      window.removeEventListener('resize', evaluateSupport);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId = 0;
    let ringRafId = 0;
    let visible = false;
    let inPortrait = false;
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;
    let currentSize = 34;

    let lastMousePos = { x: 0, y: 0 };
    let lastTimestamp = performance.now();
    let previousAngle = 0;
    let accumulatedRotation = 0;
    let scaleResetTimer: number | undefined;

    const syncVisibility = () => {
      const magicEl = magicCursorRef.current;
      const ringEl = revealRingRef.current;
      const labelEl = revealLabelRef.current;

      if (magicEl) {
        const showMagic = visible && !inPortrait;
        magicEl.style.opacity = showMagic ? '1' : '0';
        magicEl.style.visibility = showMagic ? 'visible' : 'hidden';
      }

      if (ringEl) {
        const showRevealRing = visible && inPortrait;
        ringEl.style.opacity = showRevealRing ? '1' : '0';
        ringEl.style.visibility = showRevealRing ? 'visible' : 'hidden';
      }

      if (labelEl) {
        labelEl.style.opacity = visible && inPortrait ? '1' : '0';
      }
    };

    const updateVelocity = (x: number, y: number) => {
      const now = performance.now();
      const dt = now - lastTimestamp;
      if (dt <= 0) return;

      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 1) {
        const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        let angleDiff = currentAngle - previousAngle;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation += angleDiff;
        rotation.set(accumulatedRotation);
        previousAngle = currentAngle;

        scale.set(0.95);
        window.clearTimeout(scaleResetTimer);
        scaleResetTimer = window.setTimeout(() => {
          scale.set(1);
        }, 140);
      }

      lastMousePos = { x, y };
      lastTimestamp = now;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        // Immediately disable on any touch input
        visible = false;
        document.documentElement.classList.remove('custom-cursor-active');
        cursorStore.update({ cursorActive: false });
        syncVisibility();
        return;
      }

      const targetEl = e.target as HTMLElement | null;
      const portraitBoundary = targetEl?.closest('[data-fighter-reveal="true"]');
      const nextInPortrait = Boolean(portraitBoundary);
      const isInteractive = Boolean(
        targetEl?.closest(
          'a, button, input, textarea, select, [role="button"], [data-interactive="true"]'
        )
      );

      targetX = e.clientX;
      targetY = e.clientY;

      if (!visible) {
        visible = true;
        currentX = e.clientX;
        currentY = e.clientY;
        lastMousePos = { x: e.clientX, y: e.clientY };
        cursorX.jump(e.clientX);
        cursorY.jump(e.clientY);
        document.documentElement.classList.add('custom-cursor-active');
        cursorStore.update({ cursorActive: true });
      }

      if (nextInPortrait !== inPortrait) {
        inPortrait = nextInPortrait;
        if (inPortrait) {
          currentX = e.clientX;
          currentY = e.clientY;
        } else {
          cursorX.jump(e.clientX);
          cursorY.jump(e.clientY);
        }
      }

      cursorStore.update({
        clientX: e.clientX,
        clientY: e.clientY,
        overInteractive: isInteractive,
      });

      if (!inPortrait) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          cursorX.set(e.clientX);
          cursorY.set(e.clientY);
          updateVelocity(e.clientX, e.clientY);
        });
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }

      syncVisibility();
    };

    const onPointerLeave = () => {
      visible = false;
      inPortrait = false;
      syncVisibility();
    };

    const unsubscribeStore = cursorStore.subscribe((snap) => {
      if (snap.overPortrait !== inPortrait) {
        inPortrait = snap.overPortrait;
        syncVisibility();
      }
    });

    // Keep the existing portrait reveal ring smoothly synchronised inside `[data-fighter-reveal="true"]`
    const animateRevealRing = () => {
      const snap = cursorStore.getSnapshot();
      if (inPortrait || snap.overPortrait) {
        currentX += (targetX - currentX) * 0.34;
        currentY += (targetY - currentY) * 0.34;
        const targetSize = snap.revealRadius * 1.65;
        currentSize += (targetSize - currentSize) * 0.18;

        if (revealRingRef.current) {
          revealRingRef.current.style.width = `${currentSize}px`;
          revealRingRef.current.style.height = `${currentSize}px`;
          revealRingRef.current.style.transform = `translate3d(${currentX - currentSize / 2}px, ${currentY - currentSize / 2}px, 0)`;
        }
      }
      ringRafId = requestAnimationFrame(animateRevealRing);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    ringRafId = requestAnimationFrame(animateRevealRing);

    return () => {
      unsubscribeStore();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(ringRafId);
      window.clearTimeout(scaleResetTimer);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [enabled, cursorX, cursorY, rotation, scale]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Magic UI Smooth Cursor (Active everywhere EXCEPT Aditya's portrait reveal area) */}
      <motion.div
        ref={magicCursorRef}
        data-magic-smooth-cursor="true"
        style={{
          position: 'fixed',
          left: smoothX,
          top: smoothY,
          translateX: '-50%',
          translateY: '-15%',
          rotate: rotation,
          scale,
          pointerEvents: 'none',
          opacity: 0,
          visibility: 'hidden',
          willChange: 'transform',
        }}
      >
        {cursor}
      </motion.div>

      {/* Original Portrait Reveal Cursor (Active ONLY inside Aditya's portrait reveal area) */}
      <div
        ref={revealRingRef}
        data-portrait-reveal-cursor="true"
        className="pointer-events-none fixed left-0 top-0 flex items-end justify-center rounded-full border border-[#A6192E]/80 bg-[#A6192E]/[0.06] shadow-[0_0_24px_rgba(166,25,46,0.14)] will-change-transform"
        style={{ opacity: 0, visibility: 'hidden', width: 218, height: 218 }}
      >
        <span
          ref={revealLabelRef}
          className="mb-2.5 select-none font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-[#302B28]/80 transition-opacity duration-150"
          style={{ opacity: 0 }}
        >
          WITHIN
        </span>
      </div>
    </div>
  );
};
