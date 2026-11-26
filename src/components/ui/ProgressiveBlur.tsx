import React from 'react';
import './ProgressiveBlur.css';

export interface ProgressiveBlurProps {
  /** Edge of the viewport to anchor the progressive blur overlay */
  position?: 'top' | 'bottom';
  /** Base tint color matching the surrounding Arctic Athlete surface */
  backgroundColor?: string;
  /** Optional explicit CSS height override (defaults to responsive CSS settings) */
  height?: string;
  /** Optional explicit blur intensity in px (defaults to 6px desktop / 4px mobile) */
  blurAmount?: number;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Progressive Blur overlay adapted from Skiper UI 41 (`@skiper-ui/skiper41`).
 * Attribution: Skiper UI — https://skiper-ui.com/v1/skiper41
 *
 * Pure CSS implementation using masked backdrop-filter without scroll listeners,
 * keeping pointer interactions unobstructed and central content sharp.
 */
export const ProgressiveBlur: React.FC<ProgressiveBlurProps> = ({
  position = 'top',
  backgroundColor = '#F0F7FA',
  height,
  blurAmount,
  className = '',
}) => {
  const styleVars: React.CSSProperties & Record<string, string> = {
    '--pb-bg': backgroundColor,
  };

  if (height) {
    styleVars['--pb-height'] = height;
  }

  if (typeof blurAmount === 'number') {
    styleVars['--pb-blur-override'] = `${blurAmount}px`;
  }

  return (
    <div
      aria-hidden="true"
      data-skiper-progressive-blur={position}
      className={`skiper-progressive-blur skiper-progressive-blur--${position} ${className}`.trim()}
      style={styleVars}
    />
  );
};
