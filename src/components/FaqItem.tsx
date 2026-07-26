"use client";

import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {q}
        {open ? <LuChevronUp size={15} /> : <LuChevronDown size={15} />}
      </button>
      {open && (
        <div
          className="px-5 py-3 text-sm border-t"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          {a}
        </div>
      )}
    </div>
  );
}
