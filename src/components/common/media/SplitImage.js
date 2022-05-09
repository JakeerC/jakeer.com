import * as React from 'react';

export default function SplitImage({ children }) {
  return <div className="grid grid-cols-2 items-start gap-4">{children}</div>;
}

export function Split({ children }) {
  return <div className="!mb-0 flex flex-col space-y-4">{children}</div>;
}
