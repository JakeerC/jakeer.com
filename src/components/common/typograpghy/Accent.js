import clsx from 'clsx';
import * as React from 'react';

export default function Accent({ children, className }) {
  return (
    <span
      className={clsx(
        className,
        'transition-colors',
        'bg-gradient-to-tr from-primary-300 via-primary-300 to-primary-400 bg-clip-text text-transparent',
        'dark:from-primary-200 dark:via-primary-300 dark:to-primary-500 dark:bg-clip-text dark:text-transparent'
      )}
    >
      {children}
    </span>
  );
}
