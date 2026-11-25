import React from 'react';
import { SITE_CONFIG } from '../../data/siteConfig';

interface FooterProps {
  demoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Footer: React.FC<FooterProps> = ({ demoMode, onToggleDemoMode }) => {
  return (
    <footer className="border-t border-[#F5F1E8]/12 bg-[#080808] py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-[#B91C1C]" aria-hidden="true" />
            <span className="font-display text-3xl font-extrabold uppercase tracking-[0.26em] text-[#F5F1E8]">
              {SITE_CONFIG.brand.wordmark}
            </span>
          </div>
          <p className="mt-2 font-display text-xs uppercase tracking-[0.22em] text-[#C5A059]/80">
            {SITE_CONFIG.brand.narrative}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {SITE_CONFIG.navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="font-display text-xs uppercase tracking-[0.18em] text-[#F5F1E8]/55 transition-colors hover:text-[#F5F1E8]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleDemoMode}
            className="border border-[#F5F1E8]/15 bg-[#121212] px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.18em] text-[#F5F1E8]/75 transition-colors hover:border-[#C5A059] hover:text-[#F5F1E8]"
          >
            Demo Mode: {demoMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </footer>
  );
};
