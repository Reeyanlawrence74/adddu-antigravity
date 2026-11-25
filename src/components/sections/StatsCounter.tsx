import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { SITE_CONFIG, StatItem } from '../../data/siteConfig';

const AnimatedNumber: React.FC<{ item: StatItem; trigger: boolean }> = ({
  item,
  trigger,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    if (prefersReducedMotion) {
      setDisplayValue(item.value);
      return;
    }

    let rafId = 0;
    const duration = 1250;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(item.value * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [trigger, item.value, prefersReducedMotion]);

  return (
    <span className="font-display text-[clamp(3.6rem,7vw,6.2rem)] font-extrabold leading-none tracking-[-0.02em] text-[#F5F1E8]">
      {displayValue}
      <span className="text-[#B91C1C]">{item.suffix}</span>
    </span>
  );
};

export const StatsCounter: React.FC<{ demoMode: boolean }> = ({ demoMode }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !demoMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [demoMode]);

  if (!demoMode) return null;

  const { stats } = SITE_CONFIG;

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative border-t border-[#F5F1E8]/10 bg-[#0E0E0E] pt-[var(--section-py)] pb-14"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#B91C1C]">
            {stats.chapterLabel}
          </span>
          <span className="border border-[#C5A059]/45 bg-[#C5A059]/10 px-3 py-1 font-display text-xs uppercase tracking-[0.18em] text-[#C5A059]">
            {stats.demoBadge}
          </span>
        </div>

        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.04em] text-[#F5F1E8] sm:text-4xl">
          {stats.heading}
        </h2>

        {/* Editorial Divided Stat Strip (No excessive SaaS cards) */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-[#F5F1E8]/12 border-y border-[#F5F1E8]/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.items.map((item) => (
            <div key={item.id} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <AnimatedNumber item={item} trigger={hasEntered} />
              <p className="mt-3 font-display text-xl font-bold uppercase tracking-[0.08em] text-[#F5F1E8]">
                {item.label}
              </p>
              <p className="mt-1.5 text-xs text-[#C5A059]/80">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
