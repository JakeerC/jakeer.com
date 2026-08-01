"use client";

import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { Button } from "./Button";

export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      <Button
        onClick={() => setOpen(!open)}
        variant="ghost"
        className="w-full flex justify-between px-5 py-3.5 text-left text-[var(--text-primary)]"
        rightIcon={open ? <LuChevronUp size={15} /> : <LuChevronDown size={15} />}
      >
        {q}
      </Button>
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
