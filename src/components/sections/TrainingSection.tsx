import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { LiquidButton } from '../ui/LiquidButton';

export const TrainingSection: React.FC<{ demoMode: boolean }> = ({ demoMode }) => {
  const { training } = SITE_CONFIG;
  const visiblePrograms = demoMode
    ? training.programFields
    : training.programFields.filter((item) => !item.pending);

  return (
    <section
      id="training"
      className="relative border-t border-[#F5F1E8]/10 bg-[#0C0C0C] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#B91C1C]">
            {training.chapterLabel}
          </span>
          <span className="h-px flex-1 bg-[#F5F1E8]/10" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Mentorship Philosophy & Benefits */}
          <div className="lg:col-span-6">
            <AnimatedHeading
              as="h2"
              mode="masked-line"
              lines={training.headingLines}
              accentLastLine
              className="font-display text-[clamp(3rem,5.6vw,5rem)] font-extrabold uppercase leading-[0.88] text-[#F5F1E8]"
            />

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#F5F1E8]/75 sm:text-lg">
              {training.lead}
            </p>

            {/* Core Benefits List — clean editorial rows instead of generic rounded cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-[#F5F1E8]/12 pt-8 sm:grid-cols-2">
              {training.benefits.map((benefit, idx) => (
                <div key={benefit.title} className="border-l border-[#B91C1C]/60 pl-4">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-[#C5A059]">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-[0.04em] text-[#F5F1E8]">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#F5F1E8]/65">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <LiquidButton
                href="#contact"
                variant="crimson"
                icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Enquire About Classes
              </LiquidButton>
            </div>
          </div>

          {/* Right Column: Configurable Programme Information */}
          <div className="lg:col-span-6">
            <div className="border border-[#F5F1E8]/12 bg-[#131313] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[#F5F1E8]/12 pb-4">
                <div>
                  <span className="font-display text-xs uppercase tracking-[0.22em] text-[#C5A059]">
                    INSTRUCTION & BATCH INFORMATION
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-[0.04em] text-[#F5F1E8]">
                    Training With Aditya
                  </h3>
                </div>
                {demoMode && (
                  <span className="border border-[#F5F1E8]/15 bg-[#0C0C0C] px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.16em] text-[#F5F1E8]/60">
                    Configurable Fields
                  </span>
                )}
              </div>

              {visiblePrograms.length > 0 ? (
                <dl className="mt-4 divide-y divide-[#F5F1E8]/10">
                  {visiblePrograms.map((item) => (
                    <div key={item.label} className="py-4">
                      <dt className="flex items-center justify-between gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-[#F5F1E8]">
                        <span>{item.label}</span>
                        {item.pending && (
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C5A059]">
                            Info Pending
                          </span>
                        )}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-[#F5F1E8]/65">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-6 text-sm leading-relaxed text-[#F5F1E8]/65">
                  Confirmed class schedules, age tiers, and dojo training locations will be published here upon confirmation.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
