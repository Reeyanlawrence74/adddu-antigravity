import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ASSET_MANIFEST } from '../../data/assets';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { AssetFrame } from '../ui/AssetFrame';
import { LiquidButton } from '../ui/LiquidButton';

export const AboutSection: React.FC = () => {
  const { about } = SITE_CONFIG;

  return (
    <section
      id="about"
      className="relative border-t border-[#F5F1E8]/10 bg-[#0C0C0C] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Chapter Label */}
        <div className="mb-10 flex items-center gap-4">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#B91C1C]">
            {about.chapterLabel}
          </span>
          <span className="h-px flex-1 bg-[#F5F1E8]/10" aria-hidden="true" />
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left: Authentic Portrait Column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <AssetFrame
              asset={ASSET_MANIFEST.aboutPortrait}
              fallbackTitle="Authentic Full-Body Judge Portrait"
              fallbackSubtitle="Full-body photograph of Aditya wearing his dark navy karate judge blazer, white shirt, yellow tie, and association judge badge."
              className="w-full"
            />
          </motion.div>

          {/* Right: Editorial Biography & Pillars */}
          <div className="lg:col-span-7 lg:pl-4">
            <AnimatedHeading
              as="h2"
              mode="blur-focus"
              lines={about.headingLines}
              accentLastLine
              className="font-display text-[clamp(3rem,6vw,5.4rem)] font-extrabold uppercase leading-[0.9] text-[#F5F1E8]"
            />

            <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-[#F5F1E8]/90 sm:text-xl">
              {about.lead}
            </p>

            <div className="mt-6 space-y-5 max-w-2xl text-base leading-[1.78] text-[#F5F1E8]/70">
              {about.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Minimal Editorial Pillars (No SaaS cards) */}
            <div className="mt-12 grid grid-cols-1 gap-8 border-y border-[#F5F1E8]/12 py-8 sm:grid-cols-3">
              {about.pillars.map((pillar, idx) => (
                <div key={pillar.title} className="relative">
                  <span className="font-display text-xs uppercase tracking-[0.22em] text-[#C5A059]">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.04em] text-[#F5F1E8]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#F5F1E8]/65">
                    {pillar.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
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
    </section>
  );
};
