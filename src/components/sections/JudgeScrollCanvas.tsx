import React, { useEffect, useRef, useState } from 'react';
import { getJudgeFrameUrl, JUDGE_FRAME_SEQUENCES } from '../../data/assets';

interface JudgeScrollCanvasProps {
  /** Outer Chapter 02 section element used for IntersectionObserver & desktop scroll travel */
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

interface DecodedEntry {
  index: number;
  source: ImageBitmap | HTMLImageElement;
  isBitmap: boolean;
  lastUsed: number;
}

const MAX_CONCURRENT_REQUESTS = 4;

/**
 * Removes embedded studio white (#FFFFFF) background via perimeter-seeded flood-fill
 * plus anti-aliased edge feathering & white-halo decontamination.
 *
 * Strictly preserves enclosed white garments (shirt collar, tie emblem, KKA badge center)
 * because only near-white pixels connected to the outer frame perimeter are keyed out.
 */
function keyOutEmbeddedStudioBackground(
  imgData: ImageData,
  width: number,
  height: number
): void {
  const data = imgData.data;
  const totalPixels = width * height;
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const isSeedWhite = (pIdx: number): boolean => {
    const o = pIdx * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const minC = r < g ? (r < b ? r : b) : g < b ? g : b;
    const maxC = r > g ? (r > b ? r : b) : g > b ? g : b;
    return minC >= 228 && maxC - minC <= 22;
  };

  const isFloodWhite = (pIdx: number): boolean => {
    const o = pIdx * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const minC = r < g ? (r < b ? r : b) : g < b ? g : b;
    const maxC = r > g ? (r > b ? r : b) : g > b ? g : b;
    return minC >= 222 && maxC - minC <= 26;
  };

  const trySeed = (pIdx: number) => {
    if (!visited[pIdx] && isSeedWhite(pIdx)) {
      visited[pIdx] = 1;
      queue[tail++] = pIdx;
    }
  };

  // Seed outer perimeter (top, bottom, left, right edges)
  for (let x = 0; x < width; x++) {
    trySeed(x);
    trySeed((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    trySeed(y * width);
    trySeed(y * width + (width - 1));
  }

  // BFS flood-fill through outer connected studio white
  while (head < tail) {
    const curr = queue[head++];
    data[curr * 4 + 3] = 0;

    const x = curr % width;
    const y = (curr - x) / width;

    if (x > 0) {
      const left = curr - 1;
      if (!visited[left] && isFloodWhite(left)) {
        visited[left] = 1;
        queue[tail++] = left;
      }
    }
    if (x < width - 1) {
      const right = curr + 1;
      if (!visited[right] && isFloodWhite(right)) {
        visited[right] = 1;
        queue[tail++] = right;
      }
    }
    if (y > 0) {
      const up = curr - width;
      if (!visited[up] && isFloodWhite(up)) {
        visited[up] = 1;
        queue[tail++] = up;
      }
    }
    if (y < height - 1) {
      const down = curr + width;
      if (!visited[down] && isFloodWhite(down)) {
        visited[down] = 1;
        queue[tail++] = down;
      }
    }
  }

  // Pass 2: 1px–2px anti-aliased edge feathering + white fringe decontamination
  const edgeFringe = new Uint8Array(totalPixels);
  for (let i = 0; i < tail; i++) {
    const bgIdx = queue[i];
    const bx = bgIdx % width;
    const by = (bgIdx - bx) / width;

    if (bx > 0 && !visited[bgIdx - 1]) edgeFringe[bgIdx - 1] = 1;
    if (bx < width - 1 && !visited[bgIdx + 1]) edgeFringe[bgIdx + 1] = 1;
    if (by > 0 && !visited[bgIdx - width]) edgeFringe[bgIdx - width] = 1;
    if (by < height - 1 && !visited[bgIdx + width]) edgeFringe[bgIdx + width] = 1;
  }

  for (let p = 0; p < totalPixels; p++) {
    if (edgeFringe[p]) {
      const o = p * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      const minC = r < g ? (r < b ? r : b) : g < b ? g : b;
      const maxC = r > g ? (r > b ? r : b) : g > b ? g : b;

      // Soften bright anti-aliased silhouette edge pixels and remove white spill
      if (minC >= 165 && maxC - minC <= 36) {
        const avg = (r + g + b) / 3;
        const alphaNorm = Math.max(0, Math.min(1, (236 - avg) / 72));
        data[o + 3] = Math.round(alphaNorm * 255);
        if (alphaNorm > 0.08) {
          const bgMix = 255 * (1 - alphaNorm);
          data[o] = Math.max(0, Math.min(255, Math.round((r - bgMix) / alphaNorm)));
          data[o + 1] = Math.max(0, Math.min(255, Math.round((g - bgMix) / alphaNorm)));
          data[o + 2] = Math.max(0, Math.min(255, Math.round((b - bgMix) / alphaNorm)));
        }
      }
    }
  }

  // Pass 3: Subtle boundary dissolve ONLY on remaining opaque outer pixels (close-ups & ankle edge)
  const sideFeather = 14;
  const topFeather = 12;
  const bottomFeather = 22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    const topFactor = y < topFeather ? y / topFeather : 1;
    const bottomFactor = y > height - 1 - bottomFeather ? (height - 1 - y) / bottomFeather : 1;
    const vFactor = topFactor < bottomFactor ? topFactor : bottomFactor;

    for (let x = 0; x < width; x++) {
      const p = rowOffset + x;
      const o = p * 4;
      if (data[o + 3] === 0) continue;

      const leftFactor = x < sideFeather ? x / sideFeather : 1;
      const rightFactor = x > width - 1 - sideFeather ? (width - 1 - x) / sideFeather : 1;
      const hFactor = leftFactor < rightFactor ? leftFactor : rightFactor;
      const edgeFactor = hFactor < vFactor ? hFactor : vFactor;

      if (edgeFactor < 1) {
        // Smoothstep dissolve prevents sharp rectangular crop edges on close-up frames
        const s = edgeFactor * edgeFactor * (3 - 2 * edgeFactor);
        data[o + 3] = Math.round(data[o + 3] * s);
      }
    }
  }
}

/**
 * Scroll-controlled WebP sequence renderer for Chapter 02 ("Beyond the Uniform").
 *
 * - Trimmed strictly to the first 6 seconds (frames 0000..0162, 163 frames) of the 7s sequence.
 * - Performs non-destructive, edge-connected studio-white background removal per decoded frame
 *   so Aditya stands directly against the Arctic White (#F0F7FA) background without a box.
 * - Uses bounded decoded-frame LRU/distance cache (16 desktop / 10 mobile) with explicit ImageBitmap.close().
 * - Pauses rendering outside viewport and supports reduced-motion static fallback (frame_0162.webp).
 */
export const JudgeScrollCanvas: React.FC<JudgeScrollCanvasProps> = ({
  sectionRef,
  className = '',
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [variant, setVariant] = useState<'desktop' | 'mobile'>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'desktop' : 'mobile'
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [fallbackActive, setFallbackActive] = useState(false);

  // Sync responsive breakpoint (desktop vs mobile sequence) & reduced-motion preference
  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMedia = () => {
      setVariant(desktopQuery.matches ? 'desktop' : 'mobile');
      setReducedMotion(motionQuery.matches);
    };

    syncMedia();
    desktopQuery.addEventListener('change', syncMedia);
    motionQuery.addEventListener('change', syncMedia);
    window.addEventListener('orientationchange', syncMedia, { passive: true });

    return () => {
      desktopQuery.removeEventListener('change', syncMedia);
      motionQuery.removeEventListener('change', syncMedia);
      window.removeEventListener('orientationchange', syncMedia);
    };
  }, []);

  useEffect(() => {
    if (fallbackActive) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      setFallbackActive(true);
      return;
    }

    const spec = JUDGE_FRAME_SEQUENCES[variant];
    const totalFrames = spec.frameCount;
    const maxCache = spec.maxCachedFrames;

    // Reusable offscreen canvas for edge-connected background keying
    const offCanvas = document.createElement('canvas');
    offCanvas.width = spec.width;
    offCanvas.height = spec.height;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    let disposed = false;
    let isNearViewport = false;
    let isInViewport = false;
    let rafId = 0;
    let lastTickMs = performance.now();

    // Scroll & smoothing state
    let targetProgress = reducedMotion ? 1 : 0;
    let smoothProgress = reducedMotion ? 1 : 0;
    let prevTargetProgress = reducedMotion ? 1 : 0;
    let scrollDirection: 1 | -1 = 1;
    let targetFrameIndex = reducedMotion ? totalFrames - 1 : 0;
    let renderedFrameIndex = -1;
    let accessCounter = 0;
    let canvasSizeDirty = true;
    let needsRender = true;
    let consecutiveFailures = 0;

    // Bounded decoded frame store + active fetch controllers
    const cache = new Map<number, DecodedEntry>();
    const inFlight = new Map<number, AbortController>();
    const failedFrames = new Set<number>();

    const releaseEntry = (entry: DecodedEntry) => {
      if (entry.isBitmap) {
        (entry.source as ImageBitmap).close();
      }
    };

    const evictIfNeeded = () => {
      while (cache.size > maxCache) {
        let victimKey: number | null = null;
        let highestEvictScore = -Infinity;

        for (const [idx, entry] of cache.entries()) {
          if (idx === targetFrameIndex || idx === renderedFrameIndex) continue;

          const dist = Math.abs(idx - targetFrameIndex);
          const ahead = (idx - targetFrameIndex) * scrollDirection > 0;
          const directionPenalty = ahead ? 0 : 12;
          const ageScore = (accessCounter - entry.lastUsed) * 0.15;
          const score = dist + directionPenalty + ageScore;

          if (score > highestEvictScore) {
            highestEvictScore = score;
            victimKey = idx;
          }
        }

        if (victimKey === null) break;
        const victim = cache.get(victimKey);
        if (victim) {
          releaseEntry(victim);
          cache.delete(victimKey);
        }
      }
    };

    const computeScrollProgress = (): number => {
      if (reducedMotion) return 1;

      const vh = window.innerHeight || 800;
      if (variant === 'desktop') {
        const rect = section.getBoundingClientRect();
        const stickyOffset = 58;
        const travel = Math.max(1, section.offsetHeight - vh);
        return Math.max(0, Math.min(1, (stickyOffset - rect.top) / travel));
      }

      // Mobile / Tablet: natural vertical flow without sticky trapping
      const box = stage.getBoundingClientRect();
      const startY = vh * 0.94;
      const endY = vh * 0.08;
      const denom = Math.max(1, startY - endY);
      return Math.max(0, Math.min(1, (startY - box.top) / denom));
    };

    const syncCanvasBackingSize = () => {
      const rect = stage.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Cap backing resolution to source sequence dimensions
      const nextW = Math.min(spec.width, Math.max(1, Math.round(cssW * dpr)));
      const nextH = Math.min(spec.height, Math.max(1, Math.round(cssH * dpr)));

      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        canvasSizeDirty = true;
        needsRender = true;
      }
    };

    const drawSource = (source: ImageBitmap | HTMLImageElement, frameIdx: number) => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(source, 0, 0, w, h);
      renderedFrameIndex = frameIdx;
      canvasSizeDirty = false;
      needsRender = false;
    };

    const findClosestCachedFrame = (desired: number): DecodedEntry | null => {
      let closest: DecodedEntry | null = null;
      let bestDist = Infinity;
      for (const [idx, entry] of cache.entries()) {
        const d = Math.abs(idx - desired);
        if (d < bestDist) {
          bestDist = d;
          closest = entry;
        }
      }
      if (closest) closest.lastUsed = ++accessCounter;
      return closest;
    };

    const decodeAndKeyFrame = async (blob: Blob): Promise<DecodedEntry['source']> => {
      let rawSource: ImageBitmap | HTMLImageElement;

      if (typeof createImageBitmap === 'function') {
        rawSource = await createImageBitmap(blob);
      } else {
        const objectUrl = URL.createObjectURL(blob);
        try {
          rawSource = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image();
            el.decoding = 'async';
            el.onload = () => resolve(el);
            el.onerror = () => reject(new Error('Image decode failed'));
            el.src = objectUrl;
          });
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      }

      if (!offCtx) return rawSource;

      // Key out embedded white background into true alpha transparency
      offCtx.clearRect(0, 0, spec.width, spec.height);
      offCtx.drawImage(rawSource, 0, 0, spec.width, spec.height);
      if (typeof ImageBitmap !== 'undefined' && rawSource instanceof ImageBitmap) {
        rawSource.close();
      }

      const imgData = offCtx.getImageData(0, 0, spec.width, spec.height);
      keyOutEmbeddedStudioBackground(imgData, spec.width, spec.height);
      offCtx.putImageData(imgData, 0, 0);

      if (typeof createImageBitmap === 'function') {
        return await createImageBitmap(offCanvas);
      }

      const keyedUrl = offCanvas.toDataURL('image/png');
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Keyed image load failed'));
        el.src = keyedUrl;
      });
    };

    const buildPriorityQueue = (): number[] => {
      const order: number[] = [];
      const seen = new Set<number>();

      const push = (idx: number) => {
        if (
          idx < 0 ||
          idx >= totalFrames ||
          seen.has(idx) ||
          cache.has(idx) ||
          inFlight.has(idx) ||
          failedFrames.has(idx)
        ) {
          return;
        }
        seen.add(idx);
        order.push(idx);
      };

      if (reducedMotion) {
        push(totalFrames - 1);
        return order;
      }

      push(targetFrameIndex);
      if (renderedFrameIndex === -1) push(0);

      const forwardWindow = variant === 'desktop' ? 8 : 5;
      const backwardWindow = variant === 'desktop' ? 4 : 2;
      for (let step = 1; step <= forwardWindow; step++) {
        push(targetFrameIndex + scrollDirection * step);
      }
      for (let step = 1; step <= backwardWindow; step++) {
        push(targetFrameIndex - scrollDirection * step);
      }

      if (cache.size < maxCache - 2) {
        const stride = Math.max(12, Math.floor(totalFrames / 8));
        for (let i = 0; i < totalFrames; i += stride) {
          if (Math.abs(i - targetFrameIndex) <= maxCache * 3) {
            push(i);
          }
        }
      }

      return order;
    };

    const abortStaleFetchesIfBusy = () => {
      if (inFlight.size < MAX_CONCURRENT_REQUESTS) return;
      let farthestIdx: number | null = null;
      let maxDist = 14;
      for (const idx of inFlight.keys()) {
        if (idx === 0 || idx === targetFrameIndex) continue;
        const d = Math.abs(idx - targetFrameIndex);
        if (d > maxDist) {
          maxDist = d;
          farthestIdx = idx;
        }
      }
      if (farthestIdx !== null) {
        inFlight.get(farthestIdx)?.abort();
        inFlight.delete(farthestIdx);
      }
    };

    const pumpQueue = () => {
      if (disposed || !isNearViewport) return;

      abortStaleFetchesIfBusy();

      if (inFlight.size >= MAX_CONCURRENT_REQUESTS) return;
      const queue = buildPriorityQueue();

      for (const frameIdx of queue) {
        if (inFlight.size >= MAX_CONCURRENT_REQUESTS) break;
        if (cache.size + inFlight.size >= maxCache + 2 && frameIdx !== targetFrameIndex) {
          if (Math.abs(frameIdx - targetFrameIndex) > (variant === 'desktop' ? 6 : 4)) continue;
        }

        const controller = new AbortController();
        inFlight.set(frameIdx, controller);

        const url = getJudgeFrameUrl(variant, frameIdx);
        fetch(url, { signal: controller.signal, cache: 'force-cache' })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.blob();
          })
          .then((blob) => {
            if (disposed || controller.signal.aborted) return null;
            return decodeAndKeyFrame(blob);
          })
          .then((decoded) => {
            inFlight.delete(frameIdx);
            if (!decoded) return;
            if (disposed || controller.signal.aborted) {
              if ('close' in decoded) decoded.close();
              return;
            }

            consecutiveFailures = 0;
            cache.set(frameIdx, {
              index: frameIdx,
              source: decoded,
              isBitmap: typeof ImageBitmap !== 'undefined' && decoded instanceof ImageBitmap,
              lastUsed: ++accessCounter,
            });
            evictIfNeeded();

            if (frameIdx === targetFrameIndex || renderedFrameIndex === -1) {
              needsRender = true;
              scheduleTick();
            }

            pumpQueue();
          })
          .catch((err) => {
            inFlight.delete(frameIdx);
            if (err?.name === 'AbortError' || disposed) return;
            failedFrames.add(frameIdx);
            consecutiveFailures += 1;
            if (consecutiveFailures >= 6 && renderedFrameIndex === -1) {
              setFallbackActive(true);
            } else {
              pumpQueue();
            }
          });
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      if (disposed) return;

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTickMs) * 0.001));
      lastTickMs = now;

      if (reducedMotion) {
        targetProgress = 1;
        smoothProgress = 1;
      } else {
        const diff = targetProgress - smoothProgress;
        if (Math.abs(diff) < 0.0004) {
          smoothProgress = targetProgress;
        } else {
          const factor = 1 - Math.exp(-18 * dt);
          smoothProgress += diff * factor;
        }
      }

      const desiredIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(smoothProgress * (totalFrames - 1)))
      );

      if (desiredIndex !== targetFrameIndex) {
        targetFrameIndex = desiredIndex;
        needsRender = true;
        pumpQueue();
      }

      if (needsRender || canvasSizeDirty || renderedFrameIndex !== targetFrameIndex) {
        const exact = cache.get(targetFrameIndex);
        if (exact) {
          exact.lastUsed = ++accessCounter;
          if (renderedFrameIndex !== targetFrameIndex || canvasSizeDirty) {
            drawSource(exact.source, targetFrameIndex);
          } else {
            needsRender = false;
          }
        } else {
          const closest = findClosestCachedFrame(targetFrameIndex);
          if (closest) {
            const currentDist =
              renderedFrameIndex >= 0 ? Math.abs(renderedFrameIndex - targetFrameIndex) : Infinity;
            const closestDist = Math.abs(closest.index - targetFrameIndex);
            if (renderedFrameIndex === -1 || canvasSizeDirty || closestDist < currentDist) {
              drawSource(closest.source, closest.index);
            }
          }
          needsRender = false;
        }
      }

      const stillSmoothing = !reducedMotion && Math.abs(targetProgress - smoothProgress) >= 0.0004;
      if (isInViewport && stillSmoothing) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const scheduleTick = () => {
      if (disposed || rafId !== 0) return;
      lastTickMs = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (disposed || reducedMotion) return;
      const next = computeScrollProgress();
      if (Math.abs(next - prevTargetProgress) > 0.0005) {
        scrollDirection = next >= prevTargetProgress ? 1 : -1;
        prevTargetProgress = next;
      }
      targetProgress = next;
      if (renderedFrameIndex === -1) {
        smoothProgress = next;
        targetFrameIndex = Math.min(totalFrames - 1, Math.max(0, Math.round(next * (totalFrames - 1))));
      }

      if (!isNearViewport && window.scrollY > 40) {
        const rect = section.getBoundingClientRect();
        if (rect.top < (window.innerHeight || 800) + 450 && rect.bottom > -450) {
          isNearViewport = true;
        }
      }

      if (isInViewport || isNearViewport) {
        needsRender = true;
        pumpQueue();
        scheduleTick();
      }
    };

    const onResize = () => {
      syncCanvasBackingSize();
      onScroll();
    };

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        const intersecting = entries[0]?.isIntersecting ?? false;
        if (!intersecting) {
          isNearViewport = false;
          return;
        }
        if (window.scrollY <= 40 && !isInViewport) {
          return;
        }
        isNearViewport = true;
        const initial = computeScrollProgress();
        targetProgress = initial;
        smoothProgress = initial;
        prevTargetProgress = initial;
        targetFrameIndex = Math.round(initial * (totalFrames - 1));
        pumpQueue();
        scheduleTick();
      },
      { rootMargin: '450px 0px' }
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        isInViewport = entries[0]?.isIntersecting ?? false;
        if (isInViewport) {
          if (window.scrollY <= 20) {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight || 800;
            // Avoid premature preload if #about merely touches bottom edge at initial hero top
            if (rect.top >= vh - 2) return;
          }
          isNearViewport = true;
          onScroll();
          scheduleTick();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0 }
    );

    const resizeObserver = new ResizeObserver(() => {
      syncCanvasBackingSize();
      scheduleTick();
    });

    syncCanvasBackingSize();
    const initialProgress = computeScrollProgress();
    targetProgress = initialProgress;
    smoothProgress = initialProgress;
    prevTargetProgress = initialProgress;
    targetFrameIndex = Math.round(initialProgress * (totalFrames - 1));

    preloadObserver.observe(section);
    activeObserver.observe(section);
    resizeObserver.observe(stage);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      preloadObserver.disconnect();
      activeObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      for (const controller of inFlight.values()) {
        controller.abort();
      }
      inFlight.clear();

      for (const entry of cache.values()) {
        releaseEntry(entry);
      }
      cache.clear();
    };
  }, [sectionRef, variant, reducedMotion, fallbackActive]);

  const spec = JUDGE_FRAME_SEQUENCES[variant];
  const staticFallbackUrl = getJudgeFrameUrl(variant, spec.frameCount - 1);

  return (
    <div
      ref={stageRef}
      data-judge-scroll-stage="true"
      data-sequence-variant={variant}
      data-active-frames={spec.frameCount}
      className={`relative mx-auto w-full select-none bg-transparent ${className}`}
      style={{ aspectRatio: `${spec.width} / ${spec.height}` }}
    >
      {fallbackActive ? (
        <img
          src={staticFallbackUrl}
          alt="Full-body portrait of Aditya wearing his official Kerala Karate Association judge uniform"
          width={spec.width}
          height={spec.height}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain"
        />
      ) : (
        <canvas
          ref={canvasRef}
          aria-label="Scroll-driven cinematic reveal of Aditya in his official karate judge uniform, transitioning from his Kerala Karate Association badge to a full-body portrait"
          role="img"
          className="block h-full w-full bg-transparent"
        />
      )}
    </div>
  );
};

export default JudgeScrollCanvas;
