import React, { useState } from 'react';
import { ManagedImageAsset } from '../../data/assets';

interface AssetFrameProps {
  asset: ManagedImageAsset;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

/**
 * Renders an authentic or conceptual image asset with exact aspect stability.
 * If the physical file has not yet been placed at `asset.src`, it renders a
 * clean editorial placeholder without broken images or fabricated likenesses.
 */
export const AssetFrame: React.FC<AssetFrameProps> = ({
  asset,
  className = '',
  imgClassName = 'h-full w-full object-cover',
  priority = false,
  showBadge = true,
  badgeText,
  fallbackTitle,
  fallbackSubtitle,
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>('loading');

  const computedBadge =
    badgeText ??
    (asset.category === 'conceptual'
      ? 'Conceptual Photography'
      : 'Authentic Photograph');

  return (
    <div
      className={`relative overflow-hidden bg-[#141414] border border-[#F5F1E8]/10 ${className}`}
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
    >
      {status !== 'missing' && (
        <img
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('missing')}
          className={`transition-opacity duration-500 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}

      {status === 'missing' && (
        <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(circle_at_50%_28%,rgba(185,28,28,0.14),rgba(20,20,20,0.96)_72%)] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 border-b border-[#F5F1E8]/10 pb-3">
            <span className="font-display text-xs uppercase tracking-[0.22em] text-[#C5A059]">
              Awaiting Supplied Photo
            </span>
            <span className="h-2 w-2 rounded-full bg-[#B91C1C]" />
          </div>

          <div className="my-auto flex flex-col items-center text-center">
            {/* Minimal Japanese-inspired silhouette framing */}
            <div className="mb-5 flex h-24 w-20 items-center justify-center border border-[#F5F1E8]/15 bg-[#0C0C0C]/70">
              <div className="h-12 w-10 border-t-2 border-x border-[#F5F1E8]/25 rounded-t-full relative">
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 h-4 w-14 border-t border-[#B91C1C]/60" />
              </div>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold uppercase tracking-[0.06em] text-[#F5F1E8]">
              {fallbackTitle ?? asset.caption}
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#F5F1E8]/65">
              {fallbackSubtitle ?? asset.alt}
            </p>
          </div>

          <div className="border-t border-[#F5F1E8]/10 pt-3 text-[11px] font-mono text-[#F5F1E8]/45 break-all">
            Drop file at: {asset.missingAssetLabel}
          </div>
        </div>
      )}

      {showBadge && status === 'loaded' && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 border border-[#F5F1E8]/15 bg-[#0C0C0C]/80 px-2.5 py-1 backdrop-blur-sm">
          <span className="font-display text-[11px] uppercase tracking-[0.18em] text-[#F5F1E8]/80">
            {computedBadge}
          </span>
        </div>
      )}
    </div>
  );
};
