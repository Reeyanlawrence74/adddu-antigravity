import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

export type TextAnimationMode =
  | 'blur-focus'
  | 'masked-line'
  | 'stagger-words'
  | 'tracking-settle';

interface AnimatedHeadingProps {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3';
  mode?: TextAnimationMode;
  className?: string;
  accentLastLine?: boolean;
  delay?: number;
  /** Set true for above-the-fold hero headings so they animate immediately on mount */
  animateOnMount?: boolean;
  /** Pause entrance animation while a fullscreen preloader covers the viewport */
  paused?: boolean;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  lines,
  as = 'h2',
  mode = 'masked-line',
  className = '',
  accentLastLine = false,
  delay = 0,
  animateOnMount = false,
  paused = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.12 });
  const shouldAnimate = !paused && (animateOnMount || inView);
  const Tag = as;

  if (prefersReducedMotion) {
    return (
      <Tag className={className}>
        {lines.map((line, index) => (
          <span
            key={line + index}
            className={`block ${
              accentLastLine && index === lines.length - 1 ? 'text-[#006B96]' : ''
            }`}
          >
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <div ref={containerRef}>
      {mode === 'blur-focus' && (
        <Tag className={className}>
          {lines.map((line, index) => (
            <motion.span
              key={line + index}
              initial={{ opacity: 0, filter: 'blur(12px)', y: 18 }}
              animate={
                shouldAnimate
                  ? { opacity: 1, filter: 'blur(0px)', y: 0 }
                  : { opacity: 0, filter: 'blur(12px)', y: 18 }
              }
              transition={{
                duration: 0.72,
                delay: delay + index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`block ${
                accentLastLine && index === lines.length - 1 ? 'text-[#006B96]' : ''
              }`}
            >
              {line}
            </motion.span>
          ))}
        </Tag>
      )}

      {mode === 'stagger-words' && (
        <Tag className={className}>
          {lines.map((line, lineIdx) => {
            const words = line.split(' ');
            return (
              <span
                key={line + lineIdx}
                className={`block ${
                  accentLastLine && lineIdx === lines.length - 1 ? 'text-[#006B96]' : ''
                }`}
              >
                {words.map((word, wordIdx) => (
                  <span
                    key={word + wordIdx}
                    className="mr-[0.22em] inline-block overflow-hidden align-top"
                  >
                    <motion.span
                      initial={{ y: '105%', opacity: 0 }}
                      animate={
                        shouldAnimate
                          ? { y: '0%', opacity: 1 }
                          : { y: '105%', opacity: 0 }
                      }
                      transition={{
                        duration: 0.65,
                        delay: delay + lineIdx * 0.12 + wordIdx * 0.055,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            );
          })}
        </Tag>
      )}

      {mode === 'tracking-settle' && (
        <Tag className={className}>
          {lines.map((line, index) => (
            <motion.span
              key={line + index}
              initial={{ opacity: 0, letterSpacing: '0.14em', y: 14 }}
              animate={
                shouldAnimate
                  ? { opacity: 1, letterSpacing: '-0.015em', y: 0 }
                  : { opacity: 0, letterSpacing: '0.14em', y: 14 }
              }
              transition={{
                duration: 0.82,
                delay: delay + index * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`block ${
                accentLastLine && index === lines.length - 1 ? 'text-[#006B96]' : ''
              }`}
            >
              {line}
            </motion.span>
          ))}
        </Tag>
      )}

      {mode === 'masked-line' && (
        <Tag className={className}>
          {lines.map((line, index) => (
            <span key={line + index} className="block overflow-hidden">
              <motion.span
                initial={{ y: '108%', opacity: 0 }}
                animate={
                  shouldAnimate
                    ? { y: '0%', opacity: 1 }
                    : { y: '108%', opacity: 0 }
                }
                transition={{
                  duration: 0.72,
                  delay: delay + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`block ${
                  accentLastLine && index === lines.length - 1 ? 'text-[#006B96]' : ''
                }`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </Tag>
      )}
    </div>
  );
};
