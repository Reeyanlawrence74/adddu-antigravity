import React, { useState } from 'react';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Instagram } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { LiquidButton } from '../ui/LiquidButton';

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="h-4 w-4 text-[#B89B63]" aria-hidden="true" />,
  WhatsApp: <MessageCircle className="h-4 w-4 text-[#B89B63]" aria-hidden="true" />,
  Email: <Mail className="h-4 w-4 text-[#B89B63]" aria-hidden="true" />,
  'Training Location': <MapPin className="h-4 w-4 text-[#B89B63]" aria-hidden="true" />,
};

export const ContactSection: React.FC<{ demoMode: boolean }> = ({ demoMode }) => {
  const { contact } = SITE_CONFIG;
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const visibleChannels = demoMode
    ? contact.channels
    : contact.channels.filter((c) => !c.pending && c.href);

  return (
    <section
      id="contact"
      className="relative border-t border-[#302B28]/12 bg-[#F7F4ED] py-[var(--section-py)]"
    >
      {/* Subtle warm crimson spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(166,25,46,0.07),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-[#A6192E]">
            {contact.chapterLabel}
          </span>
          <span className="h-px flex-1 bg-[#302B28]/12" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AnimatedHeading
              as="h2"
              mode="tracking-settle"
              lines={contact.headingLines}
              accentLastLine
              className="font-display text-[clamp(3.4rem,7.2vw,6.5rem)] font-extrabold uppercase leading-[0.86] text-[#302B28]"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#655D56] sm:text-lg">
              {contact.lead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LiquidButton
                variant="crimson"
                onClick={() => setEnquiryOpen((prev) => !prev)}
                icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              >
                Get in Touch
              </LiquidButton>
            </div>

            {enquiryOpen && (
              <div className="mt-6 max-w-xl border border-[#B89B63]/55 bg-[#FFFFFF] p-5 text-sm leading-relaxed text-[#302B28] shadow-[0_12px_32px_rgba(48,43,40,0.06)]">
                <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-[#8E6F38]">
                  Direct Contact Pending Official Details
                </p>
                <p className="mt-2 text-[#655D56]">
                  No fabricated phone numbers, email addresses, or social profiles are shown. Update{' '}
                  <code className="text-[#302B28]">src/data/siteConfig.ts</code> with Aditya’s verified Instagram, WhatsApp, Email, and Dojo Location to enable direct enquiries.
                </p>
              </div>
            )}
          </div>

          {/* Configurable Contact Directory */}
          <div className="lg:col-span-5">
            {visibleChannels.length > 0 ? (
              <div className="divide-y divide-[#302B28]/12 border-y border-[#302B28]/12">
                {visibleChannels.map((channel) => (
                  <div
                    key={channel.label}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      {CHANNEL_ICONS[channel.label]}
                      <span className="font-display text-base font-bold uppercase tracking-[0.1em] text-[#302B28]">
                        {channel.label}
                      </span>
                    </div>

                    {channel.href && !channel.pending ? (
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#302B28] underline decoration-[#A6192E] underline-offset-4 hover:text-[#A6192E]"
                      >
                        <span>{channel.value}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-xs uppercase tracking-[0.14em] text-[#655D56]">
                        {channel.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-[#302B28]/12 bg-[#FFFFFF] p-6 text-sm text-[#655D56]">
                Official contact channels will appear once verified details are provided.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
