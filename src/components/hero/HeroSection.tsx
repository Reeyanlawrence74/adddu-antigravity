import React, { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { LiquidButton } from '../ui/LiquidButton';
import { FighterReveal } from './FighterReveal';
import { WaveGridBackground } from './WaveGridBackground';

export interface HeroSectionProps {
  /** Defers mount entrance animation until preloader exit begins */
  entranceReady?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ entranceReady = true }) => {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#F0F7FA] pt-20 pb-5 sm:pt-22 sm:pb-6"
    >
      {/* Interactive Arctic & Ocean Wave Grid Background */}
      <WaveGridBackground containerRef={heroRef} />

      {/* Subtle oversized atmospheric backdrop typography (strictly behind portrait, never over face) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none overflow-hidden text-center"
      >
        <span className="font-display text-[21vw] font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-[#123344]/[0.025]">
          ADITYA
        </span>
      </div>

      {/* Main 3-Part Editorial Composition — Upper-left oversized headline + centred portrait */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-6 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6">
        {/* LEFT SIDE: Upper-left Editorial Identity & Compact Liquid CTA */}
        <div className="order-2 flex flex-col items-start lg:order-1 lg:col-span-4 lg:self-start lg:pt-[clamp(2.25rem,7svh,4.5rem)] lg:pl-2">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-px w-6 bg-[#006B96]" aria-hidden="true" />
            <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#526D7A]">
              {SITE_CONFIG.brand.wordmark}
            </span>
          </div>

          <AnimatedHeading
            as="h1"
            mode="masked-line"
            animateOnMount
            paused={!entranceReady}
            lines={SITE_CONFIG.brand.heroHeadline}
            accentLastLine
            className="font-display text-[clamp(2.9rem,5.2vw,4.9rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#123344]"
          />

          <p className="mt-4 max-w-xs text-sm font-medium tracking-[0.03em] text-[#526D7A] sm:text-base">
            {SITE_CONFIG.brand.heroSubline}
          </p>

          <p className="mt-1.5 max-w-xs text-[10px] font-semibold uppercase tracking-[0.2em] text-[#006B96]/85">
            {SITE_CONFIG.brand.narrative}
          </p>

          <div className="mt-6">
            <LiquidButton
              href="#journey"
              variant="crimson"
              className="!px-5 !py-2.5 [&>span:last-child]:!text-sm [&>span:last-child]:!tracking-[0.15em]"
              icon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Explore My Journey
            </LiquidButton>
          </div>
        </div>

        {/* CENTRE: Dominant Stationary Portrait (~80% Hero Height) with Local Cursor Reveal */}
        <div className="order-1 flex items-center justify-center lg:order-2 lg:col-span-5">
          <FighterReveal />
        </div>

        {/* RIGHT SIDE: Minimal Interactive Discovery Cue */}
        <div className="order-3 flex flex-col items-start lg:col-span-3 lg:items-end lg:text-right">
          <div className="border-l border-[#006B96]/50 pl-3.5 lg:border-l-0 lg:border-r lg:pl-0 lg:pr-3.5">
            <p className="font-display text-lg font-bold uppercase tracking-[0.15em] text-[#123344] sm:text-xl">
              {SITE_CONFIG.brand.heroPromptTitle}
            </p>
            <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-[#526D7A] sm:text-[13px]">
              {SITE_CONFIG.brand.heroPromptCopy}
            </p>
          </div>

          <div className="mt-5 hidden flex-col items-end gap-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#526D7A]/70 lg:flex">
            <span>Forehead → Headband</span>
            <span>Eyes → Focus</span>
            <span>Chest → White Gi</span>
            <span>Waist → Black Belt</span>
          </div>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="relative z-10 mx-auto mt-3 flex w-full max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.26em] text-[#526D7A]/80">
          CHAPTER 01 — THE JUDGE
        </span>
        <a
          href="#about"
          className="group inline-flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-[#123344]/75 transition-colors hover:text-[#006B96]"
        >
          <span>Scroll</span>
          <ArrowDown className="h-3.5 w-3.5 text-[#006B96] transition-transform duration-300 group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
};
