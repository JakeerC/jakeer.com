"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LuChevronRight, LuChevronDown } from "react-icons/lu";

export interface NotesSidebarProps {
  knowledgeBase: any;
  topics: any[];
}

export function NotesSidebar({ knowledgeBase, topics }: NotesSidebarProps) {
  const pathname = usePathname();
  // Mobile toggle
  const [isOpen, setIsOpen] = useState(false);

  // Group notes by topic label
  const groupedNotes = topics.map((t) => ({
    label: t.label,
    notes: t.notes,
  }));

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-md border w-full justify-between"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
          }}
        >
          <span>Topics Menu</span>
          {isOpen ? <LuChevronDown size={16} /> : <LuChevronRight size={16} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside
        className={`notes-sidebar ${isOpen ? "block" : "hidden lg:block"}`}
      >
        <div className="pr-4 pb-8">
          <h4
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            {knowledgeBase.label} Notes
          </h4>

          <div className="space-y-6">
            <div>
              <Link
                href={`/notes/${knowledgeBase.slug}`}
                className={`block py-1.5 pl-3 border-l-2 text-sm transition-colors ${
                  pathname === `/notes/${knowledgeBase.slug}`
                    ? "notes-sidebar-link--active"
                    : "border-transparent hover:border-[var(--border)] hover:text-[var(--text-primary)] text-[var(--text-secondary)]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Overview
              </Link>
            </div>

            {groupedNotes.map((group, i) => (
              <div key={i}>
                <h5
                  className="text-xs font-bold mb-2 uppercase"
                  style={{ color: "var(--text-primary)" }}
                >
                  {group.label}
                </h5>
                <ul className="space-y-1">
                  {group.notes.map((note: any) => {
                    const href = `/notes/${knowledgeBase.slug}/${note.slug}`;
                    const isActive = pathname === href;
                    return (
                      <li key={note.slug}>
                        <Link
                          href={href}
                          className={`block py-1.5 pl-3 border-l-2 text-sm transition-colors ${
                            isActive
                              ? "notes-sidebar-link--active"
                              : "border-transparent hover:border-[var(--border)] hover:text-[var(--text-primary)] text-[var(--text-secondary)]"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {note.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
