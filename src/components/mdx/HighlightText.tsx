import { ReactNode } from "react";

interface HighlightTextProps {
  color?: "amber" | "blue" | "green" | "pink";
  children: ReactNode;
}

export function HighlightText({
  color = "amber",
  children,
}: HighlightTextProps) {
  return (
    <mark className={`highlight-text highlight-text--${color}`}>
      {children}
    </mark>
  );
}
