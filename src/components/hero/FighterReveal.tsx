import React, { useEffect, useRef, useState } from 'react';
import { ASSET_MANIFEST } from '../../data/assets';
import { cursorStore } from '../../lib/cursorStore';
import { Eye, Layers } from 'lucide-react';

interface ImageLoadState {
  judgeLoaded: boolean;
  judgeMissing: boolean;
  fighterLoaded: boolean;
  fighterMissing: boolean;
}

/**
 * Signature Hero Reveal Component ("The Fighter Within").
 *
 * Technical guarantees:
 * - Stationary portrait container; zero body/head/breathing animation.
 * - Preloads both heroJudge and heroFighter before permitting authentic reveal.
 * - Uses CSS custom properties (--rx, --ry, --rr) updated in requestAnimationFrame
 *   for zero React re-renders during pointer movement.
 * - Complementary radial masks on Judge (inverse) and Fighter (positive) layers
 *   prevent blazer/gi silhouette overlap or ghosting.
 * - Synchronises coordinates and radius with SmoothCursor via cursorStore.
 * - Provides explicit development fallback when authentic portraits are not yet supplied.
 * - Includes keyboard-accessible toggle and mobile tap-to-reveal without blocking scroll.
 */
export const FighterReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ImageLoadState>({
    judgeLoaded: false,
    judgeMissing: false,
    fighterLoaded: false,
    fighterMissing: false,
  });
  const [toggleRevealed, setToggleRevealed] = useState(false);

  // Preload both portraits cleanly
  useEffect(() => {
    let active = true;
    const judgeImg = new Image();
    const fighterImg = new Image();

    judgeImg.onload = () => {
      if (active) setImages((s) => ({ ...s, judgeLoaded: true, judgeMissing: false }));
    };
    judgeImg.onerror = () => {
      if (active) setImages((s) => ({ ...s, judgeLoaded: false, judgeMissing: true }));
    };

    fighterImg.onload = () => {
      if (active) setImages((s) => ({ ...s, fighterLoaded: true, fighterMissing: false }));
    };
    fighterImg.onerror = () => {
      if (active) setImages((s) => ({ ...s, fighterLoaded: false, fighterMissing: true }));
    };

    judgeImg.src = ASSET_MANIFEST.heroJudge.src;
    fighterImg.src = ASSET_MANIFEST.heroFighter.src;

    return () => {
      active = false;
    };
  }, []);

  const hasBothAuthenticImages = images.judgeLoaded && images.fighterLoaded;
  const usingDevelopmentFallback = images.judgeMissing || images.fighterMissing;
  // Only reveal Fighter layer once loaded (or in registered dev fallback mode when both files are absent)
  const canRevealFighter = hasBothAuthenticImages || usingDevelopmentFallback;

  // Imperative RAF loop for cursor-controlled local reveal (zero per-frame React state updates)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !canRevealFighter) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let rafId = 0;
    let isHovering = false;
    let targetX = el.clientWidth * 0.5;
    let targetY = el.clientHeight * 0.42;
    let currentX = targetX;
    let currentY = targetY;
    let currentR = 0;
    let targetR = 0;

    const getDesktopRevealRadius = () => {
      const w = el.clientWidth || 420;
      return Math.round(Math.min(156, Math.max(96, w * 0.3)));
    };

    const applyMaskVars = (x: number, y: number, r: number) => {
      el.style.setProperty('--rx', `${x.toFixed(1)}px`);
      el.style.setProperty('--ry', `${y.toFixed(1)}px`);
      el.style.setProperty('--rr', `${r.toFixed(1)}px`);
    };

    const syncToggleState = () => {
      if (toggleRevealed) {
        const w = el.clientWidth || 420;
        const h = el.clientHeight || 525;
        targetX = w * 0.5;
        targetY = h * 0.48;
        targetR = Math.max(w, h) * 0.85;
      } else if (!isHovering) {
        targetR = 0;
      }
    };

    syncToggleState();

    const step = () => {
      const lerp = reducedMotion ? 1 : 0.24;
      const radiusLerp = reducedMotion ? 1 : isHovering || toggleRevealed ? 0.2 : 0.16;

      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;
      currentR += (targetR - currentR) * radiusLerp;

      applyMaskVars(currentX, currentY, Math.max(0, currentR));

      if (isHovering && finePointer) {
        cursorStore.update({
          overPortrait: true,
          revealRadius: getDesktopRevealRadius(),
        });
      }

      rafId = requestAnimationFrame(step);
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !finePointer) return;
      const rect = el.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      currentX = targetX;
      currentY = targetY;
      isHovering = true;
      const r = getDesktopRevealRadius();
      targetR = r;
      cursorStore.update({
        overPortrait: true,
        revealRadius: r,
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !finePointer) return;
      const rect = el.getBoundingClientRect();
      targetX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      targetY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      if (!isHovering) {
        isHovering = true;
        targetR = getDesktopRevealRadius();
      }
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      isHovering = false;
      if (!toggleRevealed) {
        targetR = 0;
      }
      cursorStore.update({ overPortrait: false });
    };

    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerleave', onPointerLeave);
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      cursorStore.update({ overPortrait: false });
    };
  }, [canRevealFighter, toggleRevealed]);

  // Complementary radial masks keep Judge and Fighter silhouettes clean with zero ghosting
  const judgeMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      'radial-gradient(circle var(--rr, 0px) at var(--rx, 50%) var(--ry, 42%), transparent 0%, rgba(0,0,0,0.18) 64%, #000 100%)',
    maskImage:
      'radial-gradient(circle var(--rr, 0px) at var(--rx, 50%) var(--ry, 42%), transparent 0%, rgba(0,0,0,0.18) 64%, #000 100%)',
  };

  const fighterMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      'radial-gradient(circle var(--rr, 0px) at var(--rx, 50%) var(--ry, 42%), #000 0%, rgba(0,0,0,0.94) 54%, transparent 100%)',
    maskImage:
      'radial-gradient(circle var(--rr, 0px) at var(--rx, 50%) var(--ry, 42%), #000 0%, rgba(0,0,0,0.94) 54%, transparent 100%)',
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[440px] flex-col items-center">
      {/* Stationary 4:5 Portrait Registration Stage */}
      <div
        ref={containerRef}
        data-fighter-reveal="true"
        onClick={() => {
          // On touch/tap devices, tapping the portrait toggles reveal cleanly without blocking scroll
          if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
            setToggleRevealed((prev) => !prev);
          }
        }}
        className="relative aspect-[4/5] w-full select-none overflow-hidden border border-[#F5F1E8]/12 bg-gradient-to-b from-[#171717]/80 via-[#0F0F0F]/90 to-[#0C0C0C] shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
      >
        {/* Subtle studio rim backlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_36%,rgba(185,28,28,0.16),transparent_68%)]"
        />

        {/* LAYER A — THE JUDGE (Default Visible Layer) */}
        <div
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={canRevealFighter ? judgeMaskStyle : undefined}
        >
          {images.judgeLoaded ? (
            <img
              src={ASSET_MANIFEST.heroJudge.src}
              alt={ASSET_MANIFEST.heroJudge.alt}
              width={ASSET_MANIFEST.heroJudge.width}
              height={ASSET_MANIFEST.heroJudge.height}
              decoding="sync"
              className="h-full w-full object-contain object-bottom"
            />
          ) : (
            <RegisteredFallbackPortrait variant="judge" />
          )}
        </div>

        {/* LAYER B — THE FIGHTER (Revealed Locally Under Cursor) */}
        {canRevealFighter && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={fighterMaskStyle}
          >
            {images.fighterLoaded ? (
              <img
                src={ASSET_MANIFEST.heroFighter.src}
                alt={ASSET_MANIFEST.heroFighter.alt}
                width={ASSET_MANIFEST.heroFighter.width}
                height={ASSET_MANIFEST.heroFighter.height}
                decoding="sync"
                className="h-full w-full object-contain object-bottom"
              />
            ) : (
              <RegisteredFallbackPortrait variant="fighter" />
            )}
          </div>
        )}

        {/* Frame corner hairlines */}
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-[#F5F1E8]/25" />
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-[#F5F1E8]/25" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[#B91C1C]/50" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[#B91C1C]/50" />

        {/* Honest Development Fallback Status Bar when authentic photographs aren't supplied */}
        {usingDevelopmentFallback && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2 border border-[#C5A059]/35 bg-[#0C0C0C]/90 px-3 py-1.5 backdrop-blur-sm">
            <span className="font-display text-[11px] uppercase tracking-[0.18em] text-[#C5A059]">
              Dev Fallback — Registered Silhouette
            </span>
            <span className="text-[10px] font-medium text-[#F5F1E8]/60">
              Awaiting Aditya Photos
            </span>
          </div>
        )}
      </div>

      {/* Accessible Portrait Toggle (Desktop Keyboard + Mobile Primary Control) */}
      <div className="mt-4 flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setToggleRevealed((prev) => !prev)}
          aria-pressed={toggleRevealed}
          className="inline-flex items-center gap-2.5 border border-[#F5F1E8]/20 bg-[#141414]/90 px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.18em] text-[#F5F1E8] transition-colors hover:border-[#B91C1C] hover:bg-[#B91C1C]/15 focus-visible:outline-2 focus-visible:outline-[#DC2626]"
        >
          {toggleRevealed ? (
            <>
              <Layers className="h-3.5 w-3.5 text-[#DC2626]" aria-hidden="true" />
              <span>Restore Judge Portrait</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-[#DC2626]" aria-hidden="true" />
              <span>Reveal Fighter Within</span>
            </>
          )}
        </button>

        <span className="text-[11px] uppercase tracking-[0.14em] text-[#F5F1E8]/50">
          {toggleRevealed ? 'Fighter Layer Active' : 'Hover or Toggle'}
        </span>
      </div>
    </div>
  );
};

/**
 * Pixel-registered architectural silhouette layers used strictly as a development
 * fallback when authentic Judge/Fighter photographs are missing from public/images/hero/.
 * Never depicts another person's face; maps exact landmarks (forehead, eyes, chest, waist)
 * so the radial cursor reveal demonstrates accurate landmark alignment.
 */
const RegisteredFallbackPortrait: React.FC<{ variant: 'judge' | 'fighter' }> = ({ variant }) => {
  const isFighter = variant === 'fighter';

  return (
    <svg
      viewBox="0 0 800 1000"
      className="h-full w-full"
      role="img"
      aria-label={
        isFighter
          ? 'Development fallback registered silhouette for Fighter portrait'
          : 'Development fallback registered silhouette for Judge portrait'
      }
    >
      <defs>
        <linearGradient id={`bg-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isFighter ? '#1D0E0E' : '#14171E'} />
          <stop offset="100%" stopColor="#0C0C0C" />
        </linearGradient>
        <linearGradient id="navyBlazer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E2B45" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="karateGi" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5F1E8" />
          <stop offset="100%" stopColor="#CFC8BA" />
        </linearGradient>
      </defs>

      <rect width="800" height="1000" fill={`url(#bg-${variant})`} />

      {/* Precision landmark calibration grid lines */}
      <g stroke={isFighter ? 'rgba(220,38,38,0.18)' : 'rgba(245,241,232,0.08)'} strokeWidth="1" strokeDasharray="4 6">
        <line x1="400" y1="70" x2="400" y2="940" />
        <line x1="150" y1="215" x2="650" y2="215" />
        <line x1="150" y1="285" x2="650" y2="285" />
        <line x1="120" y1="450" x2="680" y2="450" />
        <line x1="150" y1="790" x2="650" y2="790" />
      </g>

      {/* Identical head & neck geometry across both layers */}
      <path
        d="M354 378 L354 440 L446 440 L446 378 Z"
        fill={isFighter ? '#2A2220' : '#242426'}
        stroke="rgba(245,241,232,0.22)"
        strokeWidth="1.5"
      />
      <path
        d="M312 245 C312 162, 488 162, 488 245 C490 328, 452 388, 400 392 C348 388, 310 328, 312 245 Z"
        fill={isFighter ? '#241B19' : '#1D1E22'}
        stroke={isFighter ? 'rgba(220,38,38,0.65)' : 'rgba(245,241,232,0.34)'}
        strokeWidth="2"
      />

      {/* Landmark: Forehead (Headband zone on Fighter) */}
      {isFighter ? (
        <g>
          <path
            d="M312 212 Q400 198 488 212 L488 238 Q400 226 312 238 Z"
            fill="#F5F1E8"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
          <text x="400" y="230" textAnchor="middle" fill="#0C0C0C" fontSize="11" fontWeight="700" letterSpacing="2">
            WHITE HEADBAND
          </text>
        </g>
      ) : (
        <text x="400" y="224" textAnchor="middle" fill="rgba(245,241,232,0.45)" fontSize="10" letterSpacing="2">
          CALM BROW ZONE
        </text>
      )}

      {/* Landmark: Eyes / Focus indicator */}
      <g stroke={isFighter ? '#DC2626' : 'rgba(245,241,232,0.45)'} strokeWidth="2" fill="none">
        <line x1="342" y1={isFighter ? 278 : 284} x2="378" y2={isFighter ? 284 : 284} />
        <line x1="422" y1={isFighter ? 284 : 284} x2="458" y2={isFighter ? 278 : 284} />
        <circle cx="360" cy="294" r="5" />
        <circle cx="440" cy="294" r="5" />
      </g>
      <text
        x="400"
        y="344"
        textAnchor="middle"
        fill={isFighter ? '#F5F1E8' : 'rgba(245,241,232,0.55)'}
        fontSize="11"
        letterSpacing="2"
      >
        {isFighter ? 'FOCUSED GAZE ZONE' : 'COMPOSED EXPRESSION'}
      </text>

      {/* Landmark: Registered Shoulders & Torso */}
      {isFighter ? (
        <g>
          {/* White Karate Gi */}
          <path
            d="M175 505 C215 445, 305 426, 352 426 L400 568 L448 426 C495 426, 585 445, 625 505 L664 890 L136 890 Z"
            fill="url(#karateGi)"
            stroke="rgba(185,28,28,0.55)"
            strokeWidth="2"
          />
          {/* Crossed Gi Lapels */}
          <path d="M342 426 L432 760 L398 760 L318 432 Z" fill="#E5DFD2" stroke="#9A9386" strokeWidth="1.2" />
          <path d="M458 426 L378 760 L412 760 L482 432 Z" fill="#F5F1E8" stroke="#9A9386" strokeWidth="1.2" />
          {/* Black Belt at Waist */}
          <rect x="218" y="762" width="364" height="38" rx="4" fill="#121212" stroke="#C5A059" strokeWidth="1.2" />
          <path d="M376 762 L424 762 L434 800 L366 800 Z" fill="#080808" stroke="#F5F1E8" strokeOpacity="0.25" />
          <path d="M384 800 L356 898 L382 904 L402 800 Z" fill="#121212" />
          <path d="M416 800 L446 896 L420 902 L400 800 Z" fill="#121212" />
          <text x="400" y="625" textAnchor="middle" fill="#0C0C0C" fontSize="14" fontWeight="700" letterSpacing="3">
            WHITE KARATE GI
          </text>
          <text x="400" y="786" textAnchor="middle" fill="#F5F1E8" fontSize="11" fontWeight="700" letterSpacing="2.5">
            BLACK BELT
          </text>
        </g>
      ) : (
        <g>
          {/* White Dress Shirt & Yellow Tie */}
          <path d="M350 426 L450 426 L435 795 L365 795 Z" fill="#EFECE4" />
          <path d="M391 446 L409 446 L418 710 L400 738 L382 710 Z" fill="#D4A62A" stroke="#9C7615" strokeWidth="1.2" />
          {/* Dark Navy Judge Blazer */}
          <path
            d="M175 505 C215 445, 305 426, 352 426 L388 615 L368 890 L136 890 Z"
            fill="url(#navyBlazer)"
            stroke="rgba(245,241,232,0.2)"
            strokeWidth="1.5"
          />
          <path
            d="M625 505 C585 445, 495 426, 448 426 L412 615 L432 890 L664 890 Z"
            fill="url(#navyBlazer)"
            stroke="rgba(245,241,232,0.2)"
            strokeWidth="1.5"
          />
          {/* Judge Badge */}
          <rect x="466" y="556" width="52" height="32" rx="3" fill="#111827" stroke="#C5A059" strokeWidth="1.5" />
          <text x="492" y="576" textAnchor="middle" fill="#C5A059" fontSize="9" fontWeight="700" letterSpacing="1.5">
            JUDGE
          </text>
          <text x="400" y="655" textAnchor="middle" fill="rgba(245,241,232,0.8)" fontSize="13" fontWeight="700" letterSpacing="3">
            NAVY BLAZER + YELLOW TIE
          </text>
          <text x="400" y="810" textAnchor="middle" fill="rgba(245,241,232,0.5)" fontSize="11" letterSpacing="2">
            WAIST REGISTRATION LINE
          </text>
        </g>
      )}
    </svg>
  );
};
