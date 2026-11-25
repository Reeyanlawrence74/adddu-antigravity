import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { DEMO_TESTIMONIALS } from '../../data/testimonials';

/**
 * Google-inspired dark editorial testimonial carousel.
 * - Visibly labelled "Sample Testimonials — Demo Content".
 * - Hidden completely when demoMode is false.
 * - Zero fake Google Maps verification badges or aggregate ratings.
 * - Supports prev/next buttons, keyboard navigation, touch swipe,
 *   responsive visible-card counts (1 / 2 / 3), and pause-on-hover/focus autoplay.
 */
export const TestimonialsCarousel: React.FC<{ demoMode: boolean }> = ({
  demoMode,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(3);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount, { passive: true });
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const total = DEMO_TESTIMONIALS.length;
  const maxIndex = Math.max(0, total - visibleCount);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Restrained autoplay when not hovered, focused, or reduced-motion
  useEffect(() => {
    if (!demoMode || isPaused || prefersReducedMotion || maxIndex === 0) return;
    const timer = window.setInterval(handleNext, 6000);
    return () => window.clearInterval(timer);
  }, [demoMode, isPaused, prefersReducedMotion, maxIndex, handleNext]);

  if (!demoMode) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <section
      aria-label="Sample student and parent testimonials"
      className="relative bg-[#0E0E0E] pb-[var(--section-py)] pt-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Header Bar */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block border border-[#C5A059]/45 bg-[#C5A059]/10 px-3 py-1 font-display text-xs uppercase tracking-[0.18em] text-[#C5A059]">
              Sample Testimonials — Demo Content
            </span>
            <h3 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.03em] text-[#F5F1E8] sm:text-4xl">
              Perspectives From the Mat
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="inline-flex h-11 w-11 items-center justify-center border border-[#F5F1E8]/20 bg-[#141414] text-[#F5F1E8] transition-colors hover:border-[#B91C1C] hover:bg-[#B91C1C]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="inline-flex h-11 w-11 items-center justify-center border border-[#F5F1E8]/20 bg-[#141414] text-[#F5F1E8] transition-colors hover:border-[#B91C1C] hover:bg-[#B91C1C]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          className="overflow-hidden"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
            setIsPaused(true);
          }}
          onTouchEnd={(e) => {
            const startX = touchStartX.current;
            const endX = e.changedTouches[0]?.clientX;
            if (startX !== null && endX !== undefined) {
              const delta = endX - startX;
              if (delta < -42) handleNext();
              else if (delta > 42) handlePrev();
            }
            touchStartX.current = null;
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translate3d(-${(activeIndex * 100) / visibleCount}%, 0, 0)`,
            }}
          >
            {DEMO_TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="shrink-0 px-2.5 first:pl-0 last:pr-0"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <article className="flex h-full flex-col justify-between border border-[#F5F1E8]/12 bg-[#141414] p-6">
                  <div>
                    {/* Reviewer Initials + Perspective Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-[#C5A059]/35 bg-[#0C0C0C] font-display text-sm font-bold tracking-[0.08em] text-[#F5F1E8]">
                          {item.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#F5F1E8]">
                            {item.authorLabel}
                          </p>
                          <p className="text-xs text-[#F5F1E8]/50">
                            {item.perspective} · {item.timeframe}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Muted Gold Star Rating */}
                    <div
                      className="mt-4 flex items-center gap-1"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`h-3.5 w-3.5 ${
                            starIdx < item.rating
                              ? 'fill-[#C5A059] text-[#C5A059]'
                              : 'text-[#F5F1E8]/20'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-[1.72] text-[#F5F1E8]/80">
                      “{item.quote}”
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#F5F1E8]/10 pt-3 text-[11px] uppercase tracking-[0.16em] text-[#F5F1E8]/40">
                    Demo Perspective — Not a live Google review
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeIndex === idx}
                aria-label={`Show testimonial group ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 transition-all ${
                  activeIndex === idx
                    ? 'w-8 bg-[#B91C1C]'
                    : 'w-3 bg-[#F5F1E8]/20 hover:bg-[#F5F1E8]/45'
                }`}
              />
            ))}
          </div>
          <span className="font-display text-xs uppercase tracking-[0.18em] text-[#F5F1E8]/45">
            {activeIndex + 1} / {maxIndex + 1}
          </span>
        </div>
      </div>
    </section>
  );
};
