import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { LiquidButton } from '../ui/LiquidButton';
import { JudgeScrollCanvas } from './JudgeScrollCanvas';

export const AboutSection: React.FC = () => {
  const { about } = SITE_CONFIG;
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative border-t border-[#123344]/12 bg-[#F0F7FA] lg:min-h-[225vh]"
    >
      <div className="lg:sticky lg:top-[58px] lg:flex lg:h-[calc(100svh-58px)] lg:items-start lg:overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-3 pt-10 pb-16 sm:px-8 sm:pt-14 sm:pb-20 lg:h-full lg:px-8 lg:pt-2 lg:pb-0">
          {/* Asymmetrical Editorial Grid — Commanding Left Subject (+69% scale) + Refined Right Story */}
          <div className="grid grid-cols-1 items-center gap-8 lg:h-full lg:grid-cols-12 lg:items-start lg:gap-8">
            {/* Left: Oversized Frameless Scroll-Driven Judge Portrait */}
            <div
              className="flex justify-center lg:col-span-6 lg:h-full lg:items-start lg:justify-center lg:overflow-hidden"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, #000 0%, #000 91%, transparent 100%)',
                maskImage:
                  'linear-gradient(to bottom, #000 0%, #000 91%, transparent 100%)',
              }}
            >
              <JudgeScrollCanvas
                sectionRef={sectionRef}
                className="w-[95vw] max-w-[460px] sm:max-w-[500px] lg:h-[104svh] lg:max-h-[1040px] lg:w-auto lg:max-w-none"
              />
            </div>

            {/* Right: Chapter Label, Heading, Biography & Pillars */}
            <div className="px-2 sm:px-0 lg:col-span-6 lg:self-center lg:py-8 lg:pl-2">
              <div className="mb-6 flex items-center gap-4">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#006B96]">
                  {about.chapterLabel}
                </span>
                <span className="h-px flex-1 bg-[#123344]/12" aria-hidden="true" />
              </div>

              <AnimatedHeading
                as="h2"
                mode="blur-focus"
                lines={about.headingLines}
                accentLastLine
                className="font-display text-[clamp(3rem,6vw,5.4rem)] font-extrabold uppercase leading-[0.9] text-[#123344]"
              />

              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-[#123344] sm:text-xl">
                {about.lead}
              </p>

              <div className="mt-5 max-w-2xl space-y-4 text-base leading-[1.78] text-[#526D7A]">
                {about.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Minimal Editorial Pillars (No SaaS cards) */}
              <div className="mt-9 grid grid-cols-1 gap-7 border-y border-[#123344]/14 py-6 sm:grid-cols-3">
                {about.pillars.map((pillar, idx) => (
                  <div key={pillar.title} className="relative">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#26A9C7]">
                      0{idx + 1}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.04em] text-[#123344]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#526D7A]">
                      {pillar.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <LiquidButton
                  href="#journey"
                  variant="ivory"
                  icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Discover My Story
                </LiquidButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
