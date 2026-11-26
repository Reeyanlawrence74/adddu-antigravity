export type AssetCategory = 'authentic' | 'conceptual' | 'fallback';

export interface ManagedImageAsset {
  id: string;
  src: string;
  alt: string;
  category: AssetCategory;
  width: number;
  height: number;
  caption: string;
  missingAssetLabel: string;
}

export interface FrameSequenceSpec {
  basePath: string;
  frameCount: number;
  width: number;
  height: number;
  maxCachedFrames: number;
}

export const JUDGE_FRAME_SEQUENCES: Record<'desktop' | 'mobile', FrameSequenceSpec> = {
  desktop: {
    basePath: '/frames/judge/desktop',
    // Original sequence is 190 frames across 7s (~27.14 fps); first 6s (0:00–0:06) = frames 0000..0162 (163 frames)
    frameCount: 163,
    width: 720,
    height: 1280,
    maxCachedFrames: 16,
  },
  mobile: {
    basePath: '/frames/judge/mobile',
    // First 6s (0:00–0:06) = frames 0000..0162 (163 frames)
    frameCount: 163,
    width: 432,
    height: 768,
    maxCachedFrames: 10,
  },
};

export function getJudgeFrameUrl(variant: 'desktop' | 'mobile', index: number): string {
  const padded = String(index).padStart(4, '0');
  return `${JUDGE_FRAME_SEQUENCES[variant].basePath}/frame_${padded}.webp`;
}

export const ASSET_MANIFEST: Record<string, ManagedImageAsset> = {
  heroJudge: {
    id: 'hero-judge',
    src: '/images/hero/judge-portrait.png',
    alt: 'Aditya in his dark navy karate judge blazer, white shirt, yellow KKA tie, and Kerala Karate Association judge badge',
    category: 'authentic',
    width: 819,
    height: 1024,
    caption: 'The Judge — Authentic Portrait',
    missingAssetLabel: 'public/images/hero/judge-portrait.png (Judge uniform portrait)',
  },
  heroFighter: {
    id: 'hero-fighter',
    src: '/images/hero/fighter-portrait.png',
    alt: 'Aditya wearing a traditional white karate gi with a black belt and white karate headband in focused tournament readiness',
    category: 'conceptual',
    width: 819,
    height: 1024,
    caption: 'The Fighter — Conceptual Portrait',
    missingAssetLabel: 'public/images/hero/fighter-portrait.png (Aligned Fighter portrait)',
  },
  aboutPortrait: {
    id: 'about-portrait',
    src: '/images/about/judge-full-portrait.webp',
    alt: 'Full-body portrait of Aditya wearing his official karate judge uniform',
    category: 'authentic',
    width: 960,
    height: 1200,
    caption: 'Authentic Judge Portrait',
    missingAssetLabel: 'public/images/about/judge-full-portrait.webp (Full-body judge uniform photograph)',
  },
  journeyGiBelt: {
    id: 'journey-gi-belt',
    src: '/images/journey/training-01.jpg',
    alt: 'Close-up conceptual documentary photograph of a heavyweight white karate gi and textured black belt knot',
    category: 'conceptual',
    width: 900,
    height: 1200,
    caption: 'Conceptual Photography — Gi & Black Belt Discipline',
    missingAssetLabel: 'public/images/journey/training-01.jpg',
  },
  journeyStanceMats: {
    id: 'journey-stance-mats',
    src: '/images/journey/training-02.jpg',
    alt: 'Low-angle conceptual photograph of bare feet planted firmly on tournament tatami mats',
    category: 'conceptual',
    width: 900,
    height: 1200,
    caption: 'Conceptual Photography — Grounded Stance on Tatami',
    missingAssetLabel: 'public/images/journey/training-02.jpg',
  },
  journeyDojoAtmosphere: {
    id: 'journey-dojo-atmosphere',
    src: '/images/journey/competition-01.jpg',
    alt: 'Atmospheric conceptual photograph of an empty minimalist Japanese karate dojo lit by dawn side-light',
    category: 'conceptual',
    width: 1280,
    height: 720,
    caption: 'Conceptual Photography — Dojo Stillness Before Training',
    missingAssetLabel: 'public/images/journey/competition-01.jpg',
  },
  competitorJacketBack: {
    id: 'competitor-jacket-back',
    src: '/images/achievements/india-jacket-back.webp',
    alt: 'Back-facing authentic photograph of Aditya wearing the white, blue, and black IASK-DO INDIA team jacket',
    category: 'authentic',
    width: 960,
    height: 1200,
    caption: 'Authentic Photograph — IASK-DO INDIA Team Jacket',
    missingAssetLabel: 'public/images/achievements/india-jacket-back.webp (Back-facing IASK-DO INDIA jacket photo)',
  },
  championMedal: {
    id: 'champion-medal',
    src: '/images/achievements/medal-portrait.webp',
    alt: 'Authentic photograph of Aditya holding a medal while wearing his team jacket',
    category: 'authentic',
    width: 960,
    height: 1200,
    caption: 'Authentic Photograph — Holding Earned Medal',
    missingAssetLabel: 'public/images/achievements/medal-portrait.webp (Authentic medal photograph)',
  },
  championTrophySlot: {
    id: 'champion-trophy-slot',
    src: '/images/achievements/trophy-portrait.webp',
    alt: 'Configured trophy slot — defaults to authentic medal photograph until a trophy photograph is supplied',
    category: 'authentic',
    width: 960,
    height: 1200,
    caption: 'Trophy / Medal Feature Slot',
    missingAssetLabel: 'public/images/achievements/trophy-portrait.webp (Optional trophy photograph; uses medal photo fallback)',
  },
};
