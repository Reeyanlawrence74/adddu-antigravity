import React from 'react';
import { SITE_CONFIG } from '../../data/siteConfig';

interface FooterProps {
  demoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Footer: React.FC<FooterProps> = ({ demoMode, onToggleDemoMode }) => {
  return (
    <footer className="border-t border-[#123344]/14 bg-[#D4E8F0] py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-[#006B96]" aria-hidden="true" />
            <span className="font-display text-3xl font-extrabold uppercase tracking-[0.26em] text-[#123344]">
              {SITE_CONFIG.brand.wordmark}
            </span>
          </div>
          <p className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#006B96]">
            {SITE_CONFIG.brand.narrative}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {SITE_CONFIG.navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[#526D7A] transition-colors hover:text-[#006B96]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleDemoMode}
            className="border border-[#123344]/20 bg-[#FFFFFF] px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[#123344] transition-colors hover:border-[#006B96] hover:text-[#006B96]"
          >
            Demo Mode: {demoMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </footer>
  );
};
