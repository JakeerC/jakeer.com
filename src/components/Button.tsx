import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  const baseClasses = "btn inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  const variantClasses = {
    primary: "bg-[var(--btn-bg,var(--accent))] text-[var(--btn-text,var(--bg-primary))] hover:opacity-90",
    secondary: "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent hover:bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
    outline: "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
  };

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="shrink-0 flex items-center justify-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0 flex items-center justify-center">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
