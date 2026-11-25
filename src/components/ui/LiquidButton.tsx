import React from 'react';

type ButtonVariant = 'crimson' | 'ivory' | 'charcoal';

interface BaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
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
    hoverText: string;
  }
> = {
  crimson: {
    base: 'border-[#B91C1C] bg-[#B91C1C]/15 text-[#F5F1E8]',
    wave: 'bg-[#B91C1C]',
    hoverText: 'group-hover:text-[#F5F1E8]',
  },
  ivory: {
    base: 'border-[#F5F1E8]/40 bg-transparent text-[#F5F1E8]',
    wave: 'bg-[#F5F1E8]',
    hoverText: 'group-hover:text-[#0C0C0C]',
  },
  charcoal: {
    base: 'border-[#F5F1E8]/20 bg-[#292929]/70 text-[#F5F1E8]',
    wave: 'bg-[#DC2626]',
    hoverText: 'group-hover:text-[#F5F1E8]',
  },
};

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  variant = 'crimson',
  className = '',
  icon,
  ...props
}) => {
  const styles = VARIANT_STYLES[variant];

  const inner = (
    <>
      {/* Liquid fill rising organically on hover */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-[-15%] bottom-[-140%] h-[220%] rounded-[42%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[52%] group-hover:rotate-[4deg] ${styles.wave}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-[-20%] bottom-[-155%] h-[220%] rounded-[38%] opacity-60 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[56%] group-hover:-rotate-[6deg] ${styles.wave}`}
      />
      {/* Subtle top specular rim */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F5F1E8]/35 to-transparent"
      />
      <span
        className={`relative z-10 inline-flex items-center gap-3 font-display text-base font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${styles.hoverText}`}
      >
        <span>{children}</span>
        {icon && (
          <span className="inline-flex transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </>
  );

  const sharedClasses = `group relative inline-flex items-center justify-center overflow-hidden border px-7 py-3.5 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#DC2626] focus-visible:outline-offset-3 ${styles.base} ${className}`;

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorRest } = props as AnchorProps;
    return (
      <a href={href} className={sharedClasses} data-interactive="true" {...anchorRest}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type={(props as NativeButtonProps).type ?? 'button'}
      className={sharedClasses}
      data-interactive="true"
      {...(props as NativeButtonProps)}
    >
      {inner}
    </button>
  );
};
