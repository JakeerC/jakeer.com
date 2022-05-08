import clsx from 'clsx';
import * as React from 'react';

export default function Accent({ children, className }) {
  return (
    <span
      className={clsx(
        className,
        'transition-colors',
        'bg-gradient-to-tr from-primary-300/40 via-primary-300/40 to-primary-400/40',
        'dark:from-primary-300 dark:to-primary-400 dark:bg-clip-text dark:text-transparent'
      )}
    >
      {children}
    </span>
  );
}
