export interface ResponsiveLayerFrame {
  /** CSS width relative to viewport (e.g. '100vw', '90vw') */
  width: string;
  /** CSS height relative to viewport (e.g. '100svh', '88svh') */
  height: string;
  /** CSS positioning offsets from viewport edges */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** Object-position preserving key faces and athletic subjects */
  objectPosition: string;
  /** Entrance vertical offset (px or %) */
  enterY: string;
  /** Entrance horizontal offset (px or %) */
  enterX?: string;
  /** Subtle scale settle on entrance */
  enterScale: number;
  /** Initial clip-path inset for sharp editorial mask reveal */
  enterClip: string;
  /** Resting clip-path inset */
  restClip: string;
}

export interface PreloaderFrameSpec {
  /** Source photo identifier ('01'..'14') */
  id: string;
  /** Optimized WebP path */
  src: string;
  /** Original high-resolution PNG fallback */
  fallbackSrc: string;
  /** Accessible description of photograph */
  alt: string;
  /** Marks fullscreen base layers that anchor 100% viewport coverage */
  isBaseLayer?: boolean;
  /** Time in ms (relative to montage start) when frame enters */
  enterAtMs: number;
  /** Time in ms when frame exits (stays mounted if final or covered by newer base) */
  exitAtMs?: number;
  /** Entrance transition duration in seconds */
  enterDuration: number;
  /** Stacking layer order (always below central ADITYA typography) */
  zIndex: number;
  /** Desktop composition geometry & choreography */
  desktop: ResponsiveLayerFrame;
  /** Mobile composition geometry & choreography */
  mobile: ResponsiveLayerFrame;
}

export const PRELOADER_CONFIG = {
  /** Display wordmark rendered in the foreground */
  wordmark: 'ADITYA',
  /** Maximum time (ms) to wait for opening asset decode + font readiness */
  maxPreloadWaitMs: 320,
  /** Main preloader montage duration (ms) — matches Skiper 07 2.50s reference */
  montageDurationMs: 2500,
  /** Upward exit transition duration (s) — 2.50s to 3.50s = 3.50s total */
  exitDurationSec: 1.0,
  /** Faster exit duration (s) when user triggers Skip Intro */
  skipExitDurationSec: 0.5,
  /** Reduced-motion brief hold duration (ms) before dismissal */
  reducedMotionHoldMs: 500,
  /** Documented Skiper 07 / Nike reference exit cubic-bezier curve */
  exitEase: [0.785, 0.135, 0.15, 0.86] as const,
  /** Fast, sharp editorial entrance curve for photographic layers */
  layerEase: [0.16, 1, 0.3, 1] as const,
};

/**
 * Curated 14-image montage sequence (non-numerical, visually sequenced).
 *
 * Fullscreen coverage guarantee:
 * Base layers (09 -> 12 -> 04 -> 08 -> 07) each span 100vw x 100svh and remain
 * mounted until the next fullscreen base layer has completely entered, ensuring
 * 100% photographic viewport coverage with zero exposed #080808 gaps.
 *
 * Curated sequence:
 * 09 -> 06 -> 14 -> 01 -> 12 -> 03 -> 11 -> 04 -> 05 -> 13 -> 08 -> 10 -> 02 -> 07
 */
export const PRELOADER_SEQUENCE: PreloaderFrameSpec[] = [
  // 0.00-0.25s — Opening (instant fullscreen base + solitary iron contrast)
  {
    id: '09',
    src: '/preloader/optimized/09.webp',
    fallbackSrc: '/preloader/09.png',
    alt: 'Black-belt karate practitioners in deep knife-hand stance on a stormy ocean beach',
    isBaseLayer: true,
    enterAtMs: 0,
    exitAtMs: 920,
    enterDuration: 0.22,
    zIndex: 1,
    desktop: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '38% 42%',
      enterY: '0%',
      enterScale: 1.05,
      enterClip: 'inset(0% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '32% 42%',
      enterY: '0%',
      enterScale: 1.05,
      enterClip: 'inset(0% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '06',
    src: '/preloader/optimized/06.webp',
    fallbackSrc: '/preloader/06.png',
    alt: 'Athlete kneeling over a loaded barbell in quiet dark-gym focus',
    enterAtMs: 140,
    exitAtMs: 920,
    enterDuration: 0.2,
    zIndex: 2,
    desktop: {
      width: '86vw',
      height: '84svh',
      bottom: '0svh',
      left: '0vw',
      objectPosition: '46% 52%',
      enterY: '22%',
      enterScale: 1.06,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '92vw',
      height: '76svh',
      bottom: '0svh',
      left: '0vw',
      objectPosition: '44% 52%',
      enterY: '20%',
      enterScale: 1.06,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },

  // 0.25-1.10s — Rapid buildup (staggered overlaps + continuous base coverage)
  {
    id: '14',
    src: '/preloader/optimized/14.webp',
    fallbackSrc: '/preloader/14.png',
    alt: 'Lineup of black-belt karateka standing shoulder-to-shoulder in fighting guard',
    enterAtMs: 320,
    exitAtMs: 920,
    enterDuration: 0.2,
    zIndex: 3,
    desktop: {
      width: '90vw',
      height: '86svh',
      top: '0svh',
      right: '0vw',
      objectPosition: '50% 34%',
      enterY: '-20%',
      enterScale: 1.05,
      enterClip: 'inset(0% 0% 100% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '94vw',
      height: '78svh',
      top: '0svh',
      right: '0vw',
      objectPosition: '52% 32%',
      enterY: '-18%',
      enterScale: 1.05,
      enterClip: 'inset(0% 0% 100% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '01',
    src: '/preloader/optimized/01.webp',
    fallbackSrc: '/preloader/01.png',
    alt: 'Two karate fighters bowing face-to-face before a tournament referee',
    enterAtMs: 500,
    exitAtMs: 920,
    enterDuration: 0.19,
    zIndex: 4,
    desktop: {
      width: '92vw',
      height: '88svh',
      bottom: '0svh',
      right: '0vw',
      objectPosition: '50% 34%',
      enterY: '18%',
      enterX: '6%',
      enterScale: 1.06,
      enterClip: 'inset(0% 0% 0% 100%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '96vw',
      height: '76svh',
      bottom: '0svh',
      left: '4vw',
      objectPosition: '50% 34%',
      enterY: '16%',
      enterScale: 1.06,
      enterClip: 'inset(0% 0% 0% 100%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '12',
    src: '/preloader/optimized/12.webp',
    fallbackSrc: '/preloader/12.png',
    alt: 'Seven black-belt martial artists holding bo staffs in synchronized low stances',
    isBaseLayer: true,
    enterAtMs: 680,
    exitAtMs: 1420,
    enterDuration: 0.2,
    zIndex: 5,
    desktop: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '48% 36%',
      enterY: '-14%',
      enterScale: 1.06,
      enterClip: 'inset(0% 0% 100% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '40% 35%',
      enterY: '-14%',
      enterScale: 1.06,
      enterClip: 'inset(0% 0% 100% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '03',
    src: '/preloader/optimized/03.webp',
    fallbackSrc: '/preloader/03.png',
    alt: 'Black-belt karate practitioners executing synchronized forward punches in the dojo',
    enterAtMs: 860,
    exitAtMs: 1420,
    enterDuration: 0.19,
    zIndex: 6,
    desktop: {
      width: '90vw',
      height: '88svh',
      bottom: '0svh',
      left: '0vw',
      objectPosition: '36% 42%',
      enterY: '20%',
      enterX: '-5%',
      enterScale: 1.06,
      enterClip: 'inset(0% 100% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '94vw',
      height: '80svh',
      bottom: '0svh',
      left: '0vw',
      objectPosition: '28% 40%',
      enterY: '18%',
      enterScale: 1.06,
      enterClip: 'inset(0% 100% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '11',
    src: '/preloader/optimized/11.webp',
    fallbackSrc: '/preloader/11.png',
    alt: 'Motion-blurred runners striding powerfully beneath harsh stadium lighting',
    enterAtMs: 1020,
    exitAtMs: 1420,
    enterDuration: 0.18,
    zIndex: 7,
    desktop: {
      width: '94vw',
      height: '86svh',
      top: '0svh',
      right: '0vw',
      objectPosition: '50% 52%',
      enterY: '-18%',
      enterScale: 1.07,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '94vw',
      height: '78svh',
      top: '0svh',
      right: '0vw',
      objectPosition: '50% 50%',
      enterY: '-16%',
      enterScale: 1.07,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },

  // 1.10-2.25s — Peak intensity (fastest dense transitions across remaining 7 frames)
  {
    id: '04',
    src: '/preloader/optimized/04.webp',
    fallbackSrc: '/preloader/04.png',
    alt: 'Motion-blurred conditioning runners sprinting past a waterfront',
    isBaseLayer: true,
    enterAtMs: 1180,
    exitAtMs: 1900,
    enterDuration: 0.18,
    zIndex: 8,
    desktop: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '50% 48%',
      enterY: '0%',
      enterX: '6%',
      enterScale: 1.08,
      enterClip: 'inset(0% 0% 0% 100%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '52% 46%',
      enterY: '0%',
      enterX: '6%',
      enterScale: 1.08,
      enterClip: 'inset(0% 0% 0% 100%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '05',
    src: '/preloader/optimized/05.webp',
    fallbackSrc: '/preloader/05.png',
    alt: 'Dojo athletes executing synchronized rising front kicks across the training floor',
    enterAtMs: 1340,
    exitAtMs: 1900,
    enterDuration: 0.18,
    zIndex: 9,
    desktop: {
      width: '90vw',
      height: '90svh',
      bottom: '0svh',
      right: '0vw',
      objectPosition: '38% 36%',
      enterY: '24%',
      enterScale: 1.06,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '94vw',
      height: '82svh',
      bottom: '0svh',
      right: '0vw',
      objectPosition: '28% 36%',
      enterY: '22%',
      enterScale: 1.06,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '13',
    src: '/preloader/optimized/13.webp',
    fallbackSrc: '/preloader/13.png',
    alt: 'Tournament sword duel with blade extended toward kneeling opponent',
    enterAtMs: 1500,
    exitAtMs: 1900,
    enterDuration: 0.18,
    zIndex: 10,
    desktop: {
      width: '94vw',
      height: '88svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '48% 38%',
      enterY: '-20%',
      enterX: '-4%',
      enterScale: 1.06,
      enterClip: 'inset(0% 100% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '96vw',
      height: '78svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '48% 38%',
      enterY: '-18%',
      enterScale: 1.06,
      enterClip: 'inset(0% 100% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '08',
    src: '/preloader/optimized/08.webp',
    fallbackSrc: '/preloader/08.png',
    alt: 'Two fighters suspended mid-air in flying knee strikes against dark mountain backdrop',
    isBaseLayer: true,
    enterAtMs: 1660,
    exitAtMs: 2440,
    enterDuration: 0.2,
    zIndex: 11,
    desktop: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '48% 42%',
      enterY: '18%',
      enterScale: 1.07,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '48% 42%',
      enterY: '18%',
      enterScale: 1.07,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '10',
    src: '/preloader/optimized/10.webp',
    fallbackSrc: '/preloader/10.png',
    alt: 'Tournament fighter executing an explosive spinning high kick in full kumite action',
    enterAtMs: 1840,
    exitAtMs: 2440,
    enterDuration: 0.18,
    zIndex: 12,
    desktop: {
      width: '92vw',
      height: '92svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '50% 34%',
      enterY: '-20%',
      enterScale: 1.07,
      enterClip: 'inset(0% 0% 100% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '96vw',
      height: '82svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '54% 34%',
      enterY: '-18%',
      enterScale: 1.07,
      enterClip: 'inset(0% 0% 100% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
  {
    id: '02',
    src: '/preloader/optimized/02.webp',
    fallbackSrc: '/preloader/02.png',
    alt: 'Karate athlete landing an explosive high kick during tournament combat',
    enterAtMs: 2020,
    exitAtMs: 2440,
    enterDuration: 0.17,
    zIndex: 13,
    desktop: {
      width: '94vw',
      height: '94svh',
      bottom: '0svh',
      right: '0vw',
      objectPosition: '42% 30%',
      enterY: '20%',
      enterScale: 1.08,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '96vw',
      height: '84svh',
      bottom: '0svh',
      right: '0vw',
      objectPosition: '42% 28%',
      enterY: '18%',
      enterScale: 1.08,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },

  // 2.20-2.50s — Final composition & hold before 1.00s upward homepage reveal
  {
    id: '07',
    src: '/preloader/optimized/07.webp',
    fallbackSrc: '/preloader/07.png',
    alt: 'Two black-belt martial artists suspended in a dramatic spotlight throw against pure black',
    isBaseLayer: true,
    enterAtMs: 2190,
    enterDuration: 0.22,
    zIndex: 14,
    desktop: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '50% 48%',
      enterY: '14%',
      enterScale: 1.05,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
    mobile: {
      width: '100vw',
      height: '100svh',
      top: '0svh',
      left: '0vw',
      objectPosition: '52% 46%',
      enterY: '14%',
      enterScale: 1.05,
      enterClip: 'inset(100% 0% 0% 0%)',
      restClip: 'inset(0% 0% 0% 0%)',
    },
  },
];
