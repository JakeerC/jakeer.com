import { ReactNode } from "react";

interface SparkyTextProps {
  children: ReactNode;
}

export function SparkyText({ children }: SparkyTextProps) {
  return <span className="sparky-text">{children}</span>;
}
