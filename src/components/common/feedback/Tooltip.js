import clsx from 'clsx';
import * as React from 'react';
import { Tooltip as TippyTooltip } from 'react-tippy';

export default function Tooltip({
  content,
  children,
  className,
  spanClassName,
  withUnderline = false,
  ...rest
}) {
  return (
    <TippyTooltip
      trigger="mouseenter"
      interactive
      html={
        <div
          className={clsx(
            className,
            'inline-block rounded-md bg-slate-100 p-2 text-gray-600 shadow-md dark:bg-dark dark:text-gray-200',
            'border dark:border-gray-600 '
          )}
        >
          {content}
        </div>
      }
      {...rest}
    >
      {withUnderline ? (
        <span
          className={clsx(spanClassName, 'underline')}
          style={{ textDecorationStyle: 'dotted' }}
        >
          {children}
        </span>
      ) : (
        <>{children}</>
      )}
    </TippyTooltip>
  );
}
