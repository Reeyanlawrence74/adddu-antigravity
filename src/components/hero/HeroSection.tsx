import React, { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { LiquidButton } from '../ui/LiquidButton';
import { FighterReveal } from './FighterReveal';
import { InteractiveGridBackground } from './InteractiveGridBackground';

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#0C0C0C] pt-24 pb-8 sm:pt-28 sm:pb-10"
    >
      {/* Interactive crimson dot-grid background */}
      <InteractiveGridBackground containerRef={heroRef} />

      {/* Subtle oversized atmospheric backdrop typography (strictly behind portrait, never over face) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none overflow-hidden text-center"
      >
        <span className="font-display text-[21vw] font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-[#F5F1E8]/[0.025]">
          ADITYA
        </span>
      </div>

      {/* Main 3-Part Editorial Composition */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6">
        {/* LEFT SIDE: Narrative Identity & Primary Liquid CTA */}
        <div className="order-2 flex flex-col items-start lg:order-1 lg:col-span-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B91C1C]" aria-hidden="true" />
            <span className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-[#F5F1E8]/80">
              {SITE_CONFIG.brand.wordmark}
            </span>
          </div>

          <AnimatedHeading
            as="h1"
            mode="masked-line"
            animateOnMount
            lines={SITE_CONFIG.brand.heroHeadline}
            accentLastLine
            className="font-display text-[clamp(3.6rem,7.2vw,6.4rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-[#F5F1E8]"
          />

          <p className="mt-5 max-w-sm text-base font-medium tracking-[0.04em] text-[#F5F1E8]/75 sm:text-lg">
            {SITE_CONFIG.brand.heroSubline}
          </p>

          <p className="mt-2 max-w-sm text-xs uppercase tracking-[0.22em] text-[#C5A059]/90">
            {SITE_CONFIG.brand.narrative}
          </p>

          <div className="mt-8">
            <LiquidButton
              href="#journey"
              variant="crimson"
              icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Explore My Journey
            </LiquidButton>
          </div>
        </div>

        {/* CENTRE: Signature Stationary Waist-Up Portrait with Local Cursor Reveal */}
        <div className="order-1 flex items-center justify-center lg:order-2 lg:col-span-5">
          <FighterReveal />
        </div>

        {/* RIGHT SIDE: Interactive Discovery Cue */}
        <div className="order-3 flex flex-col items-start lg:col-span-3 lg:items-end lg:text-right">
          <div className="border-l-2 border-[#B91C1C] pl-4 lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-4">
            <p className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-[#F5F1E8] sm:text-3xl">
              {SITE_CONFIG.brand.heroPromptTitle}
            </p>
            <p className="mt-2.5 max-w-[260px] text-sm leading-relaxed text-[#F5F1E8]/70">
              {SITE_CONFIG.brand.heroPromptCopy}
            </p>
          </div>

          <div className="mt-6 hidden flex-col items-end gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#F5F1E8]/45 lg:flex">
            <span>Forehead → Headband</span>
            <span>Eyes → Focus</span>
            <span>Chest → White Gi</span>
            <span>Waist → Black Belt</span>
          </div>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="relative z-10 mx-auto mt-6 flex w-full max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <span className="font-display text-[11px] uppercase tracking-[0.26em] text-[#F5F1E8]/40">
          CHAPTER 01 — THE JUDGE
        </span>
        <a
          href="#about"
          className="group inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.24em] text-[#F5F1E8]/65 transition-colors hover:text-[#F5F1E8]"
        >
          <span>Scroll</span>
          <ArrowDown className="h-3.5 w-3.5 text-[#B91C1C] transition-transform duration-300 group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
};
