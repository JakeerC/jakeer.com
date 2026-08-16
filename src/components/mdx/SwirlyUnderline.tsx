import { ReactNode } from "react";

interface SwirlyUnderlineProps {
  children: ReactNode;
}

export function SwirlyUnderline({ children }: SwirlyUnderlineProps) {
  return (
    <span className="swirly-underline">
      <span className="swirly-underline__text">{children}</span>
      <svg
        className="swirly-underline__svg"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
