import React, { useEffect, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { LiquidButton } from '../ui/LiquidButton';

export const NotchNavbar: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [linksHidden, setLinksHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  // Smoothly interpolate navigation chrome & links from 1 -> 0 as user scrolls past hero top
  const chromeOpacity = useTransform(scrollY, [80, 380], [1, 0]);
  const linksY = useTransform(scrollY, [80, 380], [0, prefersReducedMotion ? 0 : -8]);

  useMotionValueEvent(chromeOpacity, 'change', (latest) => {
    const shouldHide = latest <= 0.08;
    setLinksHidden((prev) => (prev === shouldHide ? prev : shouldHide));
  });

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
        className={`relative flex w-full max-w-[1220px] items-center justify-between px-6 py-3 sm:px-8 ${
          linksHidden ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        {/* Scroll-interpolated Notch Background, Borders & Top Accent Line */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: chromeOpacity,
            clipPath:
              'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 14px 100%)',
          }}
          className={`pointer-events-none absolute inset-0 border-x border-b transition-colors duration-300 ${
            scrolled
              ? 'border-[#123344]/14 bg-[#F0F7FA]/95 shadow-[0_12px_36px_rgba(18,51,68,0.1)] backdrop-blur-md'
              : 'border-[#123344]/10 bg-[#FFFFFF]/84 shadow-[0_8px_24px_rgba(18,51,68,0.06)] backdrop-blur-sm'
          }`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#006B96]/85 to-transparent"
          />
        </motion.div>

        {/* Brand Wordmark — Remains independently visible & interactive throughout scroll */}
        <a
          href="#home"
          className="pointer-events-auto relative z-10 inline-flex items-center gap-2.5 font-display text-xl font-extrabold uppercase tracking-[0.24em] text-[#123344] transition-colors hover:text-[#006B96]"
        >
          <span className="h-2 w-2 bg-[#006B96]" aria-hidden="true" />
          <span>{SITE_CONFIG.brand.wordmark}</span>
        </a>

        {/* Desktop Links — Gradually fade out with scroll interpolation */}
        <motion.ul
          aria-hidden={linksHidden}
          style={{
            opacity: chromeOpacity,
            y: linksY,
            visibility: linksHidden ? 'hidden' : 'visible',
          }}
          className={`relative z-10 hidden items-center gap-1 lg:flex ${
            linksHidden ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          {SITE_CONFIG.navigation.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  tabIndex={linksHidden ? -1 : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative inline-flex items-center px-3.5 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? 'text-[#123344]'
                      : 'text-[#526D7A] hover:text-[#123344]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="notch-active-indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-x-3 -bottom-1 h-[2px] bg-[#006B96]"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </motion.ul>

        {/* Right Compact CTA (fades with links) & Always-Accessible Mobile Trigger */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            aria-hidden={linksHidden}
            style={{
              opacity: chromeOpacity,
              y: linksY,
              visibility: linksHidden ? 'hidden' : 'visible',
            }}
            className={`hidden sm:block ${linksHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}
          >
            <LiquidButton
              href="#contact"
              variant="ivory"
              size="sm"
              tabIndex={linksHidden ? -1 : undefined}
            >
              Get in Touch
            </LiquidButton>
          </motion.div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center border border-[#123344]/18 bg-[#FFFFFF] text-[#123344] transition-colors hover:border-[#006B96] lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="pointer-events-auto absolute inset-x-3 top-[62px] border border-[#123344]/15 bg-[#F0F7FA]/98 p-5 shadow-[0_20px_48px_rgba(18,51,68,0.16)] backdrop-blur-md lg:hidden"
        >
          <ul className="flex flex-col divide-y divide-[#123344]/10">
            {SITE_CONFIG.navigation.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-3.5 font-display text-lg font-bold uppercase tracking-[0.18em] ${
                      isActive ? 'text-[#006B96]' : 'text-[#123344]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="h-1.5 w-1.5 bg-[#006B96]" />
                  </a>
                </li>
              );
            })}
          </ul>
          <LiquidButton
            href="#contact"
            variant="crimson"
            size="sm"
            onClick={() => setMobileOpen(false)}
            className="mt-4 w-full py-3 [&>span:last-child]:text-sm [&>span:last-child]:tracking-[0.2em]"
          >
            Get in Touch
          </LiquidButton>
        </div>
      )}
    </header>
  );
};
