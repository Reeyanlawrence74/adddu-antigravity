import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PRELOADER_CONFIG,
  PRELOADER_SEQUENCE,
  PreloaderFrameSpec,
} from './preloaderSequence';
import './NikePreloader.css';

export interface NikePreloaderProps {
  /** Called the moment the upward curtain reveal begins (allows hero animations to sync) */
  onExitStart?: () => void;
  /** Called once the preloader has completely exited the viewport */
  onExitComplete: () => void;
  /** Optional custom sequence override for reusability */
  sequence?: PreloaderFrameSpec[];
}

interface ResolvedAssetMap {
  [id: string]: string;
}

/**
 * Preloads and decodes an image with fallback to original PNG if WebP fails.
 */
async function preloadSingleImage(spec: PreloaderFrameSpec): Promise<[string, string]> {
  const tryLoad = (url: string) =>
    new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = async () => {
        try {
          if (typeof img.decode === 'function') {
            await img.decode();
          }
        } catch {
          // decode() may reject on some browsers even after onload; image is still usable
        }
        resolve(url);
      };
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });

  try {
    const resolved = await tryLoad(spec.src);
    return [spec.id, resolved];
  } catch {
    try {
      const fallback = await tryLoad(spec.fallbackSrc);
      return [spec.id, fallback];
    } catch {
      return [spec.id, spec.fallbackSrc];
    }
  }
}

export const NikePreloader: React.FC<NikePreloaderProps> = ({
  onExitStart,
  onExitComplete,
  sequence = PRELOADER_SEQUENCE,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [assetsReady, setAssetsReady] = useState(false);
  const [resolvedSrcs, setResolvedSrcs] = useState<ResolvedAssetMap>(() =>
    Object.fromEntries(sequence.map((item) => [item.id, item.src]))
  );
  // Immediately anchor the opening fullscreen base frame so 0.00s never shows a blank screen
  const [visibleMask, setVisibleMask] = useState<string>(() =>
    sequence.map((_, index) => (index === 0 ? '1' : '0')).join('')
  );
  const [isExiting, setIsExiting] = useState(false);
  const [skipTriggered, setSkipTriggered] = useState(false);
  const [fitScale, setFitScale] = useState(1);

  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const exitStartedRef = useRef(false);
  const exitCompletedRef = useRef(false);
  const exitBackupTimerRef = useRef<number | null>(null);

  // Track responsive viewport breakpoint cleanly
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Lock background scroll while preloader is mounted and restore on unmount
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;

    htmlEl.style.overflow = 'hidden';
    bodyEl.style.overflow = 'hidden';

    return () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Preload & decode opening frames immediately (bounded at maxPreloadWaitMs),
  // while decoding remaining frames concurrently ahead of their scheduled entrance.
  useEffect(() => {
    let active = true;
    const immediateFrames = sequence.slice(0, 2);
    const queuedFrames = sequence.slice(2);

    if (queuedFrames.length > 0) {
      Promise.all(queuedFrames.map(preloadSingleImage)).then((entries) => {
        if (!active) return;
        setResolvedSrcs((prev) => ({
          ...prev,
          ...Object.fromEntries(entries),
        }));
      });
    }

    const immediateReady = Promise.all([
      Promise.all(immediateFrames.map(preloadSingleImage)),
      document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve(),
    ]).then(([entries]) => {
      if (!active) return;
      setResolvedSrcs((prev) => ({
        ...prev,
        ...Object.fromEntries(entries),
      }));
      setAssetsReady(true);
    });

    const timeoutId = window.setTimeout(() => {
      if (active) setAssetsReady(true);
    }, PRELOADER_CONFIG.maxPreloadWaitMs);

    void immediateReady;

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [sequence]);

  // Calibrate wordmark width so ADITYA fills ~88-92% viewport width without clipping
  const recalibrateWordmark = useCallback(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const prevTransform = el.style.transform;
    el.style.transform = 'none';
    const naturalWidth = el.scrollWidth;
    el.style.transform = prevTransform;

    if (naturalWidth <= 0) return;

    const vw = window.innerWidth;
    const targetRatio = vw >= 768 ? 0.9 : 0.92;
    const maxAllowedRatio = 0.95;
    const targetWidth = vw * targetRatio;
    const rawScale = targetWidth / naturalWidth;
    const maxScale = (vw * maxAllowedRatio) / naturalWidth;
    const clampedScale = Math.min(maxScale, Math.max(0.7, Math.min(1.25, rawScale)));

    setFitScale(Number(clampedScale.toFixed(4)));
  }, []);

  useLayoutEffect(() => {
    recalibrateWordmark();
    let active = true;
    document.fonts?.ready?.then(() => {
      if (active) recalibrateWordmark();
    });
    window.addEventListener('resize', recalibrateWordmark, { passive: true });
    return () => {
      active = false;
      window.removeEventListener('resize', recalibrateWordmark);
    };
  }, [recalibrateWordmark, assetsReady]);

  const finalizeExit = useCallback(() => {
    if (exitCompletedRef.current) return;
    exitCompletedRef.current = true;
    if (exitBackupTimerRef.current !== null) {
      window.clearTimeout(exitBackupTimerRef.current);
      exitBackupTimerRef.current = null;
    }
    onExitComplete();
  }, [onExitComplete]);

  const triggerExit = useCallback(
    (viaSkip = false) => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      if (viaSkip) setSkipTriggered(true);
      setIsExiting(true);
      onExitStart?.();

      const durationMs = prefersReducedMotion
        ? 350
        : (viaSkip
            ? PRELOADER_CONFIG.skipExitDurationSec
            : PRELOADER_CONFIG.exitDurationSec) * 1000;

      exitBackupTimerRef.current = window.setTimeout(finalizeExit, durationMs + 180);
    },
    [finalizeExit, onExitStart, prefersReducedMotion]
  );

  useEffect(() => {
    return () => {
      if (exitBackupTimerRef.current !== null) {
        window.clearTimeout(exitBackupTimerRef.current);
      }
    };
  }, []);

  // Keyboard Escape support for Skip Intro
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerExit(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [triggerExit]);

  // 2.50s Montage clock: updates React state only when frame visibility changes
  useEffect(() => {
    if (!assetsReady) return;

    if (prefersReducedMotion) {
      const holdTimer = window.setTimeout(() => {
        triggerExit(false);
      }, PRELOADER_CONFIG.reducedMotionHoldMs);
      return () => window.clearTimeout(holdTimer);
    }

    let rafId = 0;
    let lastMask = '';
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;

      const nextMask = sequence
        .map((frame) => {
          const entered = elapsed >= frame.enterAtMs;
          const exited = frame.exitAtMs !== undefined && elapsed >= frame.exitAtMs;
          return entered && !exited ? '1' : '0';
        })
        .join('');

      if (nextMask !== lastMask) {
        lastMask = nextMask;
        setVisibleMask(nextMask);
      }

      if (elapsed >= PRELOADER_CONFIG.montageDurationMs) {
        triggerExit(false);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [assetsReady, prefersReducedMotion, sequence, triggerExit]);

  const visibleFrames = useMemo(() => {
    if (prefersReducedMotion) {
      return [sequence[sequence.length - 1]];
    }

    return sequence.filter((_, index) => visibleMask[index] === '1');
  }, [prefersReducedMotion, sequence, visibleMask]);

  const exitTransition = useMemo(() => {
    if (prefersReducedMotion) {
      return { duration: 0.3, ease: 'easeOut' as const };
    }
    return {
      duration: skipTriggered
        ? PRELOADER_CONFIG.skipExitDurationSec
        : PRELOADER_CONFIG.exitDurationSec,
      ease: PRELOADER_CONFIG.exitEase,
    };
  }, [prefersReducedMotion, skipTriggered]);

  return (
    <motion.section
      key="aditya-nike-preloader"
      aria-label="Aditya introduction sequence"
      aria-busy={!isExiting}
      className="nike-preloader-root"
      initial={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
      animate={
        isExiting
          ? prefersReducedMotion
            ? { opacity: 0 }
            : { y: '-100%' }
          : prefersReducedMotion
            ? { opacity: 1 }
            : { y: '0%' }
      }
      transition={exitTransition}
      onAnimationComplete={() => {
        if (isExiting) {
          finalizeExit();
        }
      }}
    >
      <div className="nike-preloader-stage">
        {/* Photographic Montage Layers (100% fullscreen coverage behind ADITYA) */}
        {visibleFrames.map((frame, idx) => {
          const layout = isMobile ? frame.mobile : frame.desktop;
          const resolvedUrl = resolvedSrcs[frame.id] ?? frame.src;
          const isOpeningBase = idx === 0 && frame.enterAtMs === 0;

          return (
            <motion.div
              key={frame.id}
              className="nike-preloader-frame"
              style={{
                zIndex: frame.zIndex,
                width: layout.width,
                height: layout.height,
                top: layout.top,
                bottom: layout.bottom,
                left: layout.left,
                right: layout.right,
              }}
              initial={
                prefersReducedMotion || isOpeningBase
                  ? {
                      y: '0%',
                      x: '0%',
                      scale: isOpeningBase && !prefersReducedMotion ? layout.enterScale : 1,
                      clipPath: layout.restClip,
                      opacity: 1,
                    }
                  : {
                      y: layout.enterY,
                      x: layout.enterX ?? '0%',
                      scale: layout.enterScale,
                      clipPath: layout.enterClip,
                      opacity: 1,
                    }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : {
                      y: '0%',
                      x: '0%',
                      scale: 1,
                      clipPath: layout.restClip,
                      opacity: 1,
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: frame.enterDuration,
                      ease: PRELOADER_CONFIG.layerEase,
                    }
              }
            >
              <img
                src={resolvedUrl}
                alt={frame.alt}
                className="nike-preloader-img"
                style={{ objectPosition: layout.objectPosition }}
                draggable={false}
                decoding="sync"
                loading="eager"
              />
            </motion.div>
          );
        })}

        {/* Central Dominant Typography — Preserved Unchanged */}
        <div className="nike-preloader-wordmark-layer">
          <div className="nike-preloader-wordmark-mask">
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { y: '22%', opacity: 0, scale: 1.05 }
              }
              animate={{ y: '0%', opacity: 1, scale: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <h1
                ref={wordmarkRef}
                className="nike-preloader-wordmark"
                style={{ transform: `scale(${fitScale})` }}
              >
                {PRELOADER_CONFIG.wordmark}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Discreet Accessible Skip Intro Control */}
        <button
          type="button"
          onClick={() => triggerExit(true)}
          aria-label="Skip intro animation"
          className="nike-preloader-skip"
        >
          <span>Skip Intro</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};
