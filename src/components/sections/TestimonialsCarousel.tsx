import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { DEMO_TESTIMONIALS } from '../../data/testimonials';

/**
 * Google-inspired light ivory editorial testimonial carousel.
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
      className="relative bg-[#E8E0D3] pb-[var(--section-py)] pt-8"
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
            <span className="inline-block border border-[#B89B63]/55 bg-[#FFFFFF]/80 px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.18em] text-[#8E6F38]">
              Sample Testimonials — Demo Content
            </span>
            <h3 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.03em] text-[#302B28] sm:text-4xl">
              Perspectives From the Mat
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="inline-flex h-11 w-11 items-center justify-center border border-[#302B28]/20 bg-[#FFFFFF] text-[#302B28] transition-colors hover:border-[#A6192E] hover:bg-[#A6192E] hover:text-[#FFFFFF]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="inline-flex h-11 w-11 items-center justify-center border border-[#302B28]/20 bg-[#FFFFFF] text-[#302B28] transition-colors hover:border-[#A6192E] hover:bg-[#A6192E] hover:text-[#FFFFFF]"
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
                <article className="flex h-full flex-col justify-between border border-[#302B28]/12 bg-[#FFFFFF] p-6 shadow-[0_12px_32px_rgba(48,43,40,0.06)]">
                  <div>
                    {/* Reviewer Initials + Perspective Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-[#B89B63]/55 bg-[#F7F4ED] font-display text-sm font-bold tracking-[0.08em] text-[#302B28]">
                          {item.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#302B28]">
                            {item.authorLabel}
                          </p>
                          <p className="text-xs text-[#655D56]">
                            {item.perspective} · {item.timeframe}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Champagne Gold Star Rating */}
                    <div
                      className="mt-4 flex items-center gap-1"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`h-3.5 w-3.5 ${
                            starIdx < item.rating
                              ? 'fill-[#B89B63] text-[#B89B63]'
                              : 'text-[#302B28]/20'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-[1.72] text-[#302B28]/88">
                      “{item.quote}”
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#302B28]/10 pt-3 text-[11px] uppercase tracking-[0.16em] text-[#655D56]">
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
                    ? 'w-8 bg-[#A6192E]'
                    : 'w-3 bg-[#302B28]/20 hover:bg-[#302B28]/45'
                }`}
              />
            ))}
          </div>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[#655D56]">
            {activeIndex + 1} / {maxIndex + 1}
          </span>
        </div>
      </div>
    </section>
  );
};
