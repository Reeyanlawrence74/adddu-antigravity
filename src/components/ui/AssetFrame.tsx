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
      className={`relative overflow-hidden border border-[#123344]/14 bg-[#D4E8F0] shadow-[0_14px_34px_rgba(18,51,68,0.08)] ${className}`}
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
        <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(circle_at_50%_28%,rgba(38,169,199,0.11),rgba(212,232,240,0.96)_72%)] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 border-b border-[#123344]/12 pb-3">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#006B96]">
              Awaiting Supplied Photo
            </span>
            <span className="h-2 w-2 rounded-full bg-[#26A9C7]" />
          </div>

          <div className="my-auto flex flex-col items-center text-center">
            {/* Minimal geometric silhouette framing */}
            <div className="mb-5 flex h-24 w-20 items-center justify-center border border-[#123344]/18 bg-[#F0F7FA]/90">
              <div className="relative h-12 w-10 rounded-t-full border-x border-t border-[#123344]/30">
                <div className="absolute -bottom-5 left-1/2 h-4 w-14 -translate-x-1/2 border-t border-[#006B96]/70" />
              </div>
            </div>
            <p className="font-display text-xl font-bold uppercase tracking-[0.06em] text-[#123344] sm:text-2xl">
              {fallbackTitle ?? asset.caption}
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#526D7A]">
              {fallbackSubtitle ?? asset.alt}
            </p>
          </div>

          <div className="border-t border-[#123344]/12 pt-3 font-mono text-[11px] break-all text-[#526D7A]">
            Drop file at: {asset.missingAssetLabel}
          </div>
        </div>
      )}

      {showBadge && status === 'loaded' && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 border border-[#123344]/15 bg-[#FFFFFF]/90 px-2.5 py-1 backdrop-blur-sm">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[#123344]">
            {computedBadge}
          </span>
        </div>
      )}
    </div>
  );
};
