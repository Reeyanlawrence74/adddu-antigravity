import React, { useCallback, useRef } from 'react';

type ButtonVariant = 'crimson' | 'ivory' | 'charcoal';
type ButtonSize = 'sm' | 'md';

interface BaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: React.ReactNode;
}

type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type LiquidButtonProps = AnchorProps | NativeButtonProps;

const VARIANT_STYLES: Record<
  ButtonVariant,
  {
    base: string;
    wave: string;
    sheen: string;
    text: string;
  }
> = {
  crimson: {
    base: 'border-[#FFFFFF]/35 bg-[#006B96]/86 backdrop-blur-md shadow-[0_10px_26px_rgba(0,107,150,0.24),inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(18,51,68,0.26)] hover:border-[#26A9C7]/85 hover:shadow-[0_14px_32px_rgba(0,107,150,0.32),inset_0_1px_0_rgba(255,255,255,0.55)]',
    wave: 'bg-gradient-to-t from-[#004D6D] via-[#006B96] to-[#26A9C7]/80',
    sheen: 'via-[#FFFFFF]/35',
    text: 'text-[#FFFFFF] group-hover:text-[#FFFFFF]',
  },
  ivory: {
    base: 'border-[#123344]/22 bg-[#FFFFFF]/72 backdrop-blur-md shadow-[0_8px_24px_rgba(18,51,68,0.08),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(18,51,68,0.08)] hover:border-[#006B96]/75 hover:shadow-[0_12px_28px_rgba(0,107,150,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]',
    wave: 'bg-gradient-to-t from-[#005B80] via-[#006B96] to-[#26A9C7]/85',
    sheen: 'via-[#26A9C7]/28',
    text: 'text-[#123344] group-hover:text-[#FFFFFF]',
  },
  charcoal: {
    base: 'border-[#123344]/22 bg-[#D4E8F0]/74 backdrop-blur-md shadow-[0_8px_24px_rgba(18,51,68,0.09),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(18,51,68,0.1)] hover:border-[#006B96]/75 hover:shadow-[0_12px_28px_rgba(0,107,150,0.2)]',
    wave: 'bg-gradient-to-t from-[#005B80] via-[#006B96] to-[#26A9C7]/85',
    sheen: 'via-[#FFFFFF]/35',
    text: 'text-[#123344] group-hover:text-[#FFFFFF]',
  },
};

const SIZE_STYLES: Record<ButtonSize, { container: string; label: string }> = {
  sm: {
    container: 'px-4 py-1.5',
    label: 'text-xs tracking-[0.18em]',
  },
  md: {
    container: 'px-7 py-3.5',
    label: 'text-base tracking-[0.16em]',
  },
};

/**
 * Liquid Glass CTA button inspired by Vengeance UI, adapted to the Arctic Athlete palette.
 * Combines frosted glass translucency, specular rim reflections, pointer-reactive light,
 * and fluid wave hover physics with reduced-motion and touch-press support.
 */
export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  variant = 'crimson',
  size = 'md',
  className = '',
  icon,
  ...props
}) => {
  const styles = VARIANT_STYLES[variant];
  const sizing = SIZE_STYLES[size];
  const hostRef = useRef<HTMLElement | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = hostRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--lx', `${x.toFixed(1)}%`);
    el.style.setProperty('--ly', `${y.toFixed(1)}%`);
  }, []);

  const inner = (
    <>
      {/* Subtle pointer-tracked liquid glass refraction highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(120px circle at var(--lx, 50%) var(--ly, 50%), rgba(255,255,255,0.26), transparent 72%)',
        }}
      />
      {/* Organic dual liquid waves rising on hover */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-[-16%] bottom-[-230%] h-[222%] rounded-[42%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[84%] group-hover:rotate-[3deg] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0 ${styles.wave}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-[-22%] bottom-[-244%] h-[222%] rounded-[38%] opacity-70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[88%] group-hover:-rotate-[5deg] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0 ${styles.wave}`}
      />
      {/* Diagonal liquid glass reflection sweep */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[150%] skew-x-[-22deg] bg-gradient-to-r from-transparent ${styles.sheen} to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[320%] motion-reduce:hidden`}
      />
      {/* Top glass specular hairline */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFFFFF]/75 to-transparent"
      />
      {/* Foreground label + icon (kept last-child for slot selector compatibility) */}
      <span
        className={`relative z-10 inline-flex items-center gap-3 font-display font-semibold uppercase transition-colors duration-200 ${sizing.label} ${styles.text}`}
      >
        <span>{children}</span>
        {icon && (
          <span className="inline-flex transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
            {icon}
          </span>
        )}
      </span>
    </>
  );

  const sharedClasses = `group relative inline-flex items-center justify-center overflow-hidden border transition-[border-color,box-shadow,transform,background-color] duration-300 active:scale-[0.97] active:translate-y-[1px] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-[#006B96] focus-visible:outline-offset-3 ${sizing.container} ${styles.base} ${className}`;

  if ('href' in props && props.href !== undefined) {
    const { href, onPointerMove, ...anchorRest } = props as AnchorProps;
    return (
      <a
        ref={(node) => {
          hostRef.current = node;
        }}
        href={href}
        onPointerMove={(e) => {
          handlePointerMove(e);
          onPointerMove?.(e);
        }}
        className={sharedClasses}
        data-interactive="true"
        {...anchorRest}
      >
        {inner}
      </a>
    );
  }

  const { onPointerMove, type, ...buttonRest } = props as NativeButtonProps;
  return (
    <button
      ref={(node) => {
        hostRef.current = node;
      }}
      type={type ?? 'button'}
      onPointerMove={(e) => {
        handlePointerMove(e);
        onPointerMove?.(e);
      }}
      className={sharedClasses}
      data-interactive="true"
      {...buttonRest}
    >
      {inner}
    </button>
  );
};
