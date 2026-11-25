import React from 'react';
import { SITE_CONFIG } from '../../data/siteConfig';

interface FooterProps {
  demoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Footer: React.FC<FooterProps> = ({ demoMode, onToggleDemoMode }) => {
  return (
    <footer className="border-t border-[#302B28]/14 bg-[#E8E0D3] py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-[#A6192E]" aria-hidden="true" />
            <span className="font-display text-3xl font-extrabold uppercase tracking-[0.26em] text-[#302B28]">
              {SITE_CONFIG.brand.wordmark}
            </span>
          </div>
          <p className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#8E6F38]">
            {SITE_CONFIG.brand.narrative}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {SITE_CONFIG.navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[#655D56] transition-colors hover:text-[#A6192E]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleDemoMode}
            className="border border-[#302B28]/20 bg-[#FFFFFF] px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[#302B28] transition-colors hover:border-[#A6192E] hover:text-[#A6192E]"
          >
            Demo Mode: {demoMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </footer>
  );
};
