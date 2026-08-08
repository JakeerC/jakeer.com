"use client";

import { useEffect, useState, useRef } from "react";
import { LuList, LuX } from "react-icons/lu";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents({
  contentSelector = "article",
}: {
  contentSelector?: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll(`${contentSelector} h2, ${contentSelector} h3`)
    );

    const newHeadings = elements.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: Number(el.tagName.substring(1)),
    }));

    setHeadings(newHeadings.filter((h) => h.id && h.text));

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -70% 0px",
    });

    elements.forEach((elem) => observerRef.current?.observe(elem));

    return () => observerRef.current?.disconnect();
  }, [contentSelector]);

  if (headings.length < 2) return null;

  const h2Headings = headings.filter(h => h.level === 2);
  const h2Count = h2Headings.length;

  let activeH2Index = 0;
  if (activeId) {
    const activeIndex = headings.findIndex((h) => h.id === activeId);
    if (activeIndex !== -1) {
      for (let i = activeIndex; i >= 0; i--) {
        if (headings[i].level === 2) {
          activeH2Index = h2Headings.findIndex((h) => h.id === headings[i].id) + 1;
          break;
        }
      }
    }
  }

  const displayIndex = Math.max(1, activeH2Index);

  const TocContent = () => (
    <div className="flex flex-col h-full">
      <p className="section-label mb-4" style={{ color: "var(--accent)" }}>ON THIS PAGE</p>
      
      <div className="relative border-l border-[var(--border)] ml-[1px] pl-4 py-1 flex-1">
        <nav className="flex flex-col gap-4">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={() => setIsOpen(false)}
              className={`block text-sm transition-all truncate ${
                heading.level === 3 ? "pl-4 text-xs" : ""
              } ${
                activeId === heading.id
                  ? "font-semibold text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              title={heading.text}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>

      {h2Count > 0 && (
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 h-[2px] bg-[var(--border)]">
              <div 
                className="absolute top-0 left-0 h-full bg-[var(--accent)] transition-all duration-300" 
                style={{ width: `${(displayIndex / h2Count) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-mono">
              {displayIndex}/{h2Count}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[220px] sticky top-24 self-start">
        <TocContent />
      </aside>

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="toc-fab lg:hidden fixed bottom-6 right-6 p-3 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-lg text-[var(--text-primary)] z-40 hover:bg-[var(--surface-raised)] transition-colors"
        aria-label="Table of Contents"
      >
        <LuList size={20} />
      </button>

      {/* Mobile Slide-out Panel */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="toc-panel relative w-[80%] max-w-sm h-full bg-[var(--bg-primary)] border-l border-[var(--border)] p-6 shadow-2xl overflow-y-auto transform transition-transform">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close Table of Contents"
            >
              <LuX size={20} />
            </button>
            <div className="mt-8">
              <TocContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
