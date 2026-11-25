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
    text: string;
  }
> = {
  crimson: {
    base: 'border-[#006B96] bg-[#006B96] hover:border-[#26A9C7]',
    wave: 'bg-[#004D6D]',
    text: 'text-[#FFFFFF] group-hover:text-[#FFFFFF]',
  },
  ivory: {
    base: 'border-[#123344]/30 bg-[#FFFFFF] hover:border-[#006B96]',
    wave: 'bg-[#006B96]',
    text: 'text-[#123344] group-hover:text-[#FFFFFF]',
  },
  charcoal: {
    base: 'border-[#123344]/22 bg-[#D4E8F0] hover:border-[#006B96]',
    wave: 'bg-[#006B96]',
    text: 'text-[#123344] group-hover:text-[#FFFFFF]',
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
        className={`pointer-events-none absolute inset-x-[-15%] bottom-[-228%] h-[220%] rounded-[42%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[84%] group-hover:rotate-[4deg] ${styles.wave}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-[-20%] bottom-[-242%] h-[220%] rounded-[38%] opacity-65 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[88%] group-hover:-rotate-[6deg] ${styles.wave}`}
      />
      {/* Subtle top specular rim */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFFFFF]/65 to-transparent"
      />
      <span
        className={`relative z-10 inline-flex items-center gap-3 font-display text-base font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${styles.text}`}
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

  const sharedClasses = `group relative inline-flex items-center justify-center overflow-hidden border px-7 py-3.5 shadow-[0_8px_22px_rgba(18,51,68,0.08)] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#006B96] focus-visible:outline-offset-3 ${styles.base} ${className}`;

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
