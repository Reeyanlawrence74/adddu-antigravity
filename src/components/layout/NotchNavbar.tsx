import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

export const NotchNavbar: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = SITE_CONFIG.navigation.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-28% 0px -52% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      {/* Architectural Notch Container */}
      <nav
        aria-label="Primary Navigation"
        className={`pointer-events-auto relative flex w-full max-w-[1220px] items-center justify-between border-x border-b transition-all duration-300 ${
          scrolled
            ? 'border-[#F5F1E8]/15 bg-[#0C0C0C]/92 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md'
            : 'border-[#F5F1E8]/10 bg-[#0C0C0C]/78 backdrop-blur-sm'
        } px-6 py-3 sm:px-8`}
        style={{
          clipPath:
            'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 14px 100%)',
        }}
      >
        {/* Subtle top crimson accent line */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#B91C1C]/80 to-transparent"
        />

        {/* Brand Wordmark */}
        <a
          href="#home"
          className="inline-flex items-center gap-2.5 font-display text-xl font-extrabold uppercase tracking-[0.24em] text-[#F5F1E8] transition-colors hover:text-[#DC2626]"
        >
          <span className="h-2 w-2 bg-[#B91C1C]" aria-hidden="true" />
          <span>{SITE_CONFIG.brand.wordmark}</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {SITE_CONFIG.navigation.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative inline-flex items-center px-3.5 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? 'text-[#F5F1E8]'
                      : 'text-[#F5F1E8]/60 hover:text-[#F5F1E8]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="notch-active-indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-x-3 -bottom-1 h-[2px] bg-[#B91C1C]"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Compact CTA & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center border border-[#B91C1C]/70 bg-[#B91C1C]/15 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-[#F5F1E8] transition-colors hover:border-[#DC2626] hover:bg-[#B91C1C]"
          >
            Get in Touch
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-9 w-9 items-center justify-center border border-[#F5F1E8]/15 bg-[#141414] text-[#F5F1E8] transition-colors hover:border-[#B91C1C] lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="pointer-events-auto absolute inset-x-3 top-[62px] border border-[#F5F1E8]/15 bg-[#0C0C0C]/98 p-5 shadow-2xl backdrop-blur-md lg:hidden"
        >
          <ul className="flex flex-col divide-y divide-[#F5F1E8]/10">
            {SITE_CONFIG.navigation.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-3.5 font-display text-lg font-bold uppercase tracking-[0.18em] ${
                      isActive ? 'text-[#DC2626]' : 'text-[#F5F1E8]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="h-1.5 w-1.5 bg-[#B91C1C]" />
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-4 flex w-full items-center justify-center border border-[#B91C1C] bg-[#B91C1C] py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-[#F5F1E8]"
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
};
