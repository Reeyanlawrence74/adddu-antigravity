import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award } from 'lucide-react';
import { ASSET_MANIFEST } from '../../data/assets';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { AssetFrame } from '../ui/AssetFrame';
import { LiquidButton } from '../ui/LiquidButton';

export const AchievementSection: React.FC<{ demoMode: boolean }> = ({ demoMode }) => {
  const { champion } = SITE_CONFIG;

  const visibleFields = demoMode
    ? champion.fields
    : champion.fields.filter((f) => !f.pending);

  return (
    <section
      id="achievements"
      className="relative border-t border-[#123344]/12 bg-[#D4E8F0] py-[var(--section-py)]"
    >
      {/* Restrained cyan/ocean radial ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(38,169,199,0.14),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#006B96]">
            {champion.chapterLabel}
          </span>
          <span className="h-px flex-1 bg-[#006B96]/25" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left: Editorial Headline + Configurable Achievement Matrix */}
          <div className="lg:col-span-7">
            <AnimatedHeading
              as="h2"
              mode="blur-focus"
              lines={champion.headingLines}
              accentLastLine
              className="font-display text-[clamp(3.2rem,6.4vw,5.8rem)] font-extrabold uppercase leading-[0.88] text-[#123344]"
            />

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#526D7A] sm:text-lg">
              {champion.lead}
            </p>

            {/* Configurable Achievement & Credential Rows */}
            <div className="mt-10 divide-y divide-[#123344]/14 border-y border-[#123344]/14">
              {visibleFields.length > 0 ? (
                visibleFields.map((field) => (
                  <div
                    key={field.label}
                    className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                  >
                    <div className="flex items-center gap-2.5 sm:w-64 sm:shrink-0">
                      <Award className="h-4 w-4 shrink-0 text-[#006B96]" aria-hidden="true" />
                      <span className="font-display text-base font-bold uppercase tracking-[0.08em] text-[#123344]">
                        {field.label}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm leading-relaxed text-[#123344]">
                        {field.value}
                      </p>
                      {field.note && (
                        <p className="mt-1 text-xs text-[#526D7A]">{field.note}</p>
                      )}
                    </div>

                    {field.pending && (
                      <span className="self-start border border-[#26A9C7]/55 bg-[#FFFFFF]/85 px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-[#006B96]">
                        Pending Details
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-6 text-sm text-[#526D7A]">
                  Verified competition records and officiating credentials will appear here once published.
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <LiquidButton
                href="#training"
                variant="crimson"
                icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Explore Training
              </LiquidButton>
              <LiquidButton href="#contact" variant="ivory">
                View Achievements Enquiry
              </LiquidButton>
            </div>
          </div>

          {/* Right: Central Authentic Medal Portrait + Configurable Trophy Slot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="border border-[#006B96]/25 bg-[#FFFFFF] p-3 shadow-[0_18px_48px_rgba(18,51,68,0.09)]">
              <AssetFrame
                asset={ASSET_MANIFEST.championMedal}
                fallbackTitle="Authentic Medal Photograph"
                fallbackSubtitle="Photograph of Aditya holding his medal while wearing the team jacket. Also serves as the reserved trophy feature slot until an authentic trophy photo is supplied."
              />
              <div className="mt-3 flex items-center justify-between border-t border-[#123344]/12 pt-3 text-xs">
                <span className="font-display font-semibold uppercase tracking-[0.18em] text-[#006B96]">
                  Medal & Reserved Trophy Slot
                </span>
                <span className="text-[#526D7A]">Configurable Visual</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
