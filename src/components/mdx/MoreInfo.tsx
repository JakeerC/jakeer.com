"use client";

import { ReactNode, useState, useCallback } from "react";

interface MoreInfoProps {
  info: string;
  children: ReactNode;
}

export function MoreInfo({ info, children }: MoreInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <span className="more-info">
      <span className="more-info__text">{children}</span>
      <button
        type="button"
        className="more-info__trigger"
        onClick={handleToggle}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={`More info: ${info}`}
        aria-expanded={isOpen}
      >
        *
      </button>
      {isOpen && (
        <span className="more-info__tooltip" role="tooltip">
          {info}
        </span>
      )}
    </span>
  );
}
