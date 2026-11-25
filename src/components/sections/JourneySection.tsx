import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ASSET_MANIFEST } from '../../data/assets';
import { JourneyChapter, SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { AssetFrame } from '../ui/AssetFrame';

const JourneyRow: React.FC<{ chapter: JourneyChapter; idx: number }> = ({ chapter, idx }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [36, -36]
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.06, 1, 1.03]
  );

  const asset = ASSET_MANIFEST[chapter.assetKey];
  const isReversed = idx % 2 === 1;

  const initialMotion = prefersReducedMotion
    ? {}
    : chapter.entrance === 'left'
      ? { opacity: 0, x: -42, clipPath: 'inset(0 18% 0 0)' }
      : chapter.entrance === 'right'
        ? { opacity: 0, x: 42, clipPath: 'inset(0 0 0 18%)' }
        : { opacity: 0, y: 36, clipPath: 'inset(12% 0 0 0)' };

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 items-center gap-10 border-t border-[#302B28]/14 pt-14 lg:grid-cols-12 lg:gap-12"
    >
      {/* Visual Frame */}
      <motion.div
        initial={initialMotion}
        whileInView={{ opacity: 1, x: 0, y: 0, clipPath: 'inset(0 0% 0 0%)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className={`${
          chapter.entrance === 'center'
            ? 'lg:col-span-8'
            : isReversed
              ? 'lg:col-span-6 lg:order-2'
              : 'lg:col-span-6'
        }`}
      >
        <motion.div style={{ y: yOffset }} className="overflow-hidden">
          <motion.div style={{ scale: imageScale }}>
            <AssetFrame
              asset={asset}
              badgeText="Conceptual Photography"
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Editorial Copy */}
      <div
        className={`${
          chapter.entrance === 'center'
            ? 'lg:col-span-4'
            : isReversed
              ? 'lg:col-span-6 lg:order-1 lg:pr-8'
              : 'lg:col-span-6 lg:pl-8'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-bold tracking-[0.22em] text-[#A6192E]">
            {chapter.index}
          </span>
          <span className="h-px w-8 bg-[#B89B63]/75" aria-hidden="true" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[#655D56]">
            {chapter.subtitle}
          </span>
        </div>

        <h3 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-bold uppercase leading-[0.95] text-[#302B28]">
          {chapter.title}
        </h3>

        <p className="mt-5 max-w-md text-base leading-[1.75] text-[#655D56]">
          {chapter.description}
        </p>
      </div>
    </div>
  );
};

export const JourneySection: React.FC = () => {
  const { journey } = SITE_CONFIG;

  return (
    <section
      id="journey"
      className="relative border-t border-[#302B28]/12 bg-[#E8E0D3] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#A6192E]">
            {journey.chapterLabel}
          </span>
          <span className="h-px flex-1 bg-[#302B28]/14" aria-hidden="true" />
        </div>

        <div className="mb-16 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <span className="mb-3 block font-display text-sm font-semibold uppercase tracking-[0.24em] text-[#8E6F38]">
              {journey.subheadings[0]}
            </span>
            <AnimatedHeading
              as="h2"
              mode="stagger-words"
              lines={journey.headingLines}
              accentLastLine
              className="font-display text-[clamp(3.2rem,6.5vw,5.8rem)] font-extrabold uppercase leading-[0.88] text-[#302B28]"
            />
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="border-l-2 border-[#A6192E] pl-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-[#302B28]">
              {journey.subheadings[1]}
            </p>
          </div>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {journey.chapters.map((chapter, idx) => (
            <JourneyRow key={chapter.index} chapter={chapter} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
