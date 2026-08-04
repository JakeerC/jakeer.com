import React from 'react';

export type TagVariant = 'default' | 'accent' | 'outline' | 'ghost';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  size?: TagSize;
  leftIcon?: React.ReactNode;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({
  className = '',
  variant = 'default',
  size = 'md',
  leftIcon,
  children,
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-mono font-medium rounded transition-colors whitespace-nowrap cursor-default";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] uppercase tracking-wider",
    md: "px-2.5 py-1 text-[11px]",
    lg: "px-3 py-1.5 text-xs"
  };

  const variantClasses = {
    default: "bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-secondary)]",
    accent: "bg-[var(--accent)] border-[var(--accent)] text-black",
    outline: "bg-transparent border border-[var(--border)] text-[var(--text-secondary)]",
    ghost: "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
  };

  return (
    <span
      ref={ref}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-1.5 shrink-0">{leftIcon}</span>}
      {children}
    </span>
  );
});

Tag.displayName = 'Tag';
