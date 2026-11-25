import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ASSET_MANIFEST } from '../../data/assets';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { AssetFrame } from '../ui/AssetFrame';

/**
 * Chapter 04 — The Competitor
 *
 * Desktop behaviour:
 * - Natural vertical document scrolling drives a horizontal track on the right,
 *   while the back-facing IASK-DO INDIA portrait stays sticky on the left.
 * - Uses ResizeObserver to compute exact horizontal travel distance so there is
 *   no unexpected blank space after release and zero scroll hijacking.
 * Mobile behaviour:
 * - Clean vertical header + touch-swipeable horizontal strip (snap-x) preserving
 *   uninterrupted vertical document scrolling.
 */
export const CompetitionGallery: React.FC = () => {
  const { competitor } = SITE_CONFIG;
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const [maxTranslateX, setMaxTranslateX] = useState(0);
  const [sectionHeightPx, setSectionHeightPx] = useState<number>(2100);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Measure horizontal travel distance responsively after layout & image load
  useEffect(() => {
    const updateMeasurements = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setMaxTranslateX(overflow);

      // Exact sticky container height = 100vh + horizontal travel distance (tightly bounded)
      const vh = window.innerHeight || 800;
      setSectionHeightPx(Math.round(vh + Math.max(400, overflow)));
    };

    updateMeasurements();

    const ro = new ResizeObserver(updateMeasurements);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener('resize', updateMeasurements, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateMeasurements);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: stickyStageRef,
    offset: ['start start', 'end end'],
  });

  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -maxTranslateX]
  );

  const progressScale = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const count = competitor.slides.length;
    const idx = Math.min(count - 1, Math.max(0, Math.floor(latest * count * 0.99)));
    setActiveSlideIndex(idx);
  });

  return (
    <section
      id="competitor"
      className="relative border-t border-[#123344]/12 bg-[#F0F7FA]"
    >
      {/* DESKTOP STICKY + SCROLL-LINKED HORIZONTAL SEQUENCE */}
      <div
        ref={stickyStageRef}
        className="relative hidden lg:block"
        style={{ height: `${sectionHeightPx}px` }}
      >
        <div className="sticky top-0 flex h-screen w-full items-start overflow-hidden pt-24 pb-8">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-start gap-10 px-8">
            {/* Sticky Left Portrait: Back-facing IASK-DO INDIA Jacket */}
            <div className="col-span-5 flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#006B96]">
                  {competitor.chapterLabel}
                </span>
                <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[#26A9C7]">
                  IASK-DO INDIA
                </span>
              </div>

              <AssetFrame
                asset={ASSET_MANIFEST.competitorJacketBack}
                fallbackTitle="IASK-DO INDIA — Back Portrait"
                fallbackSubtitle="Authentic back-facing photograph of Aditya wearing the white, blue, and black IASK-DO INDIA team jacket."
                className="max-h-[60vh] w-full"
              />

              <p className="mt-3 text-xs text-[#526D7A]">
                {competitor.jacketNotice}
              </p>
            </div>

            {/* Right: Editorial Heading, Progress Bar & Horizontally Moving Track */}
            <div className="col-span-7 flex flex-col overflow-hidden">
              <div className="mb-6 flex items-end justify-between gap-6">
                <div>
                  <AnimatedHeading
                    as="h2"
                    mode="tracking-settle"
                    lines={competitor.headingLines}
                    accentLastLine
                    className="font-display text-[clamp(2.5rem,4.2vw,3.9rem)] font-extrabold uppercase leading-[0.88] text-[#123344]"
                  />
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-[#526D7A]">
                    {competitor.subtitle}
                  </p>
                </div>

                {/* Minimal Gallery Progress Indicator */}
                <div className="shrink-0 text-right">
                  <span className="font-display text-2xl font-bold tracking-[0.12em] text-[#123344]">
                    0{activeSlideIndex + 1}
                    <span className="text-[#526D7A]/60"> / 0{competitor.slides.length}</span>
                  </span>
                  <div className="mt-2 h-[2px] w-28 overflow-hidden bg-[#123344]/15">
                    <motion.div
                      style={{ scaleX: progressScale, transformOrigin: 'left' }}
                      className="h-full w-full bg-[#006B96]"
                    />
                  </div>
                </div>
              </div>

              {/* Horizontal Viewport */}
              <div ref={viewportRef} className="w-full overflow-hidden">
                <motion.div
                  ref={trackRef}
                  style={{ x: translateX }}
                  className="flex w-max gap-5 will-change-transform"
                >
                  {competitor.slides.map((slide) => (
                    <article
                      key={slide.index}
                      className="flex w-[330px] xl:w-[360px] shrink-0 flex-col border border-[#123344]/12 bg-[#FFFFFF] p-3.5 shadow-[0_14px_34px_rgba(18,51,68,0.07)]"
                    >
                      <AssetFrame
                        asset={ASSET_MANIFEST[slide.assetKey]}
                        badgeText={slide.badge}
                        className="max-h-[340px] w-full"
                      />
                      <div className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em]">
                        <span className="text-[#006B96]">{slide.eyebrow}</span>
                        <span className="text-[#526D7A]">{slide.index}</span>
                      </div>
                      <h3 className="mt-1.5 font-display text-2xl font-bold uppercase tracking-[0.04em] text-[#123344]">
                        {slide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#526D7A]">
                        {slide.body}
                      </p>
                    </article>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET CLEAN VERTICAL + SWIPEABLE SEQUENCE */}
      <div className="px-5 py-16 sm:px-8 lg:hidden">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#006B96]">
          {competitor.chapterLabel}
        </span>

        <AnimatedHeading
          as="h2"
          mode="tracking-settle"
          lines={competitor.headingLines}
          accentLastLine
          className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.88] text-[#123344]"
        />

        <p className="mt-4 text-sm leading-relaxed text-[#526D7A]">
          {competitor.subtitle}
        </p>

        <div className="mt-8">
          <AssetFrame
            asset={ASSET_MANIFEST.competitorJacketBack}
            fallbackTitle="IASK-DO INDIA — Back Portrait"
            fallbackSubtitle="Authentic back-facing photograph of Aditya wearing the white, blue, and black IASK-DO INDIA team jacket."
          />
          <p className="mt-2.5 text-xs text-[#526D7A]">{competitor.jacketNotice}</p>
        </div>

        {/* Accessible horizontal swipe strip */}
        <div
          aria-label="Competitor visual chapters"
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        >
          {competitor.slides.map((slide) => (
            <article
              key={slide.index}
              className="w-[82vw] max-w-[340px] shrink-0 snap-start border border-[#123344]/12 bg-[#FFFFFF] p-3.5 shadow-[0_12px_28px_rgba(18,51,68,0.07)]"
            >
              <AssetFrame
                asset={ASSET_MANIFEST[slide.assetKey]}
                badgeText={slide.badge}
              />
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em]">
                <span className="text-[#006B96]">{slide.eyebrow}</span>
                <span className="text-[#526D7A]">{slide.index}</span>
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase text-[#123344]">
                {slide.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#526D7A]">
                {slide.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
