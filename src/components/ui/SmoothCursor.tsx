import React, { useEffect, useRef, useState } from 'react';
import { cursorStore } from '../../lib/cursorStore';

/**
 * Spring-interpolated custom cursor inspired by Magic UI Smooth Cursor.
 * - Disabled automatically on coarse/touch devices and when prefers-reduced-motion is enabled.
 * - Never hides the native cursor until initialised and active.
 * - Morphs into a circular reveal lens synced with the hero FighterReveal mask.
 */
export const SmoothCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluateSupport = () => {
      const hasTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth < 1024;
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
    window.addEventListener('resize', evaluateSupport, { passive: true });

    return () => {
      finePointerQuery.removeEventListener('change', evaluateSupport);
      reducedMotionQuery.removeEventListener('change', evaluateSupport);
      window.removeEventListener('resize', evaluateSupport);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId = 0;
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;
    let currentSize = 34;
    let visible = false;

    const activateCursor = () => {
      if (!visible) {
        visible = true;
        document.documentElement.classList.add('custom-cursor-active');
        cursorStore.update({ cursorActive: true });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      targetX = e.clientX;
      targetY = e.clientY;
      activateCursor();

      const targetEl = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        targetEl?.closest('a, button, input, textarea, select, [role="button"], [data-interactive="true"]')
      );

      cursorStore.update({
        clientX: e.clientX,
        clientY: e.clientY,
        overInteractive: isInteractive,
      });
    };

    const onPointerLeave = () => {
      visible = false;
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const animate = () => {
      const snap = cursorStore.getSnapshot();

      // When over portrait, snap tightly to FighterReveal mask coordinates
      const stiffness = snap.overPortrait ? 0.34 : 0.2;
      currentX += (targetX - currentX) * stiffness;
      currentY += (targetY - currentY) * stiffness;

      const targetSize = snap.overPortrait
        ? snap.revealRadius * 1.65
        : snap.overInteractive
          ? 52
          : 34;
      currentSize += (targetSize - currentSize) * 0.18;

      if (ringRef.current && dotRef.current) {
        if (visible) {
          ringRef.current.style.opacity = '1';
          dotRef.current.style.opacity = snap.overPortrait ? '0' : '1';
        }

        ringRef.current.style.width = `${currentSize}px`;
        ringRef.current.style.height = `${currentSize}px`;
        ringRef.current.style.transform = `translate3d(${currentX - currentSize / 2}px, ${currentY - currentSize / 2}px, 0)`;

        if (snap.overPortrait) {
          ringRef.current.style.borderColor = 'rgba(166, 25, 46, 0.78)';
          ringRef.current.style.backgroundColor = 'rgba(166, 25, 46, 0.06)';
          ringRef.current.style.boxShadow = '0 0 24px rgba(166, 25, 46, 0.14)';
        } else if (snap.overInteractive) {
          ringRef.current.style.borderColor = 'rgba(48, 43, 40, 0.78)';
          ringRef.current.style.backgroundColor = 'rgba(166, 25, 46, 0.1)';
          ringRef.current.style.boxShadow = 'none';
        } else {
          ringRef.current.style.borderColor = 'rgba(48, 43, 40, 0.42)';
          ringRef.current.style.backgroundColor = 'transparent';
          ringRef.current.style.boxShadow = 'none';
        }

        dotRef.current.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;

        if (labelRef.current) {
          labelRef.current.style.opacity = snap.overPortrait ? '1' : '0';
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-end justify-center rounded-full border transition-[border-color,background-color] duration-200 will-change-transform"
        style={{ opacity: 0, width: 34, height: 34 }}
      >
        <span
          ref={labelRef}
          className="mb-2.5 select-none font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-[#302B28]/80 transition-opacity duration-200"
          style={{ opacity: 0 }}
        >
          WITHIN
        </span>
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-[#A6192E] will-change-transform"
        style={{ opacity: 0 }}
      />
    </div>
  );
};
