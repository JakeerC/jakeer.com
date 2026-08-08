"use client";

import Link from "next/link";
import TechIcon from "./TechIcon";

export interface NotesTopicCardProps {
  readonly slug: string;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly noteCount: number;
  readonly totalReadingTime: number; // in minutes
}

export function NotesTopicCard({
  slug,
  label,
  description,
  icon,
  color,
  noteCount,
  totalReadingTime,
}: NotesTopicCardProps) {
  return (
    <Link
      href={`/notes/${slug}`}
      className="bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] transition-all block group h-full rounded-xl border"
      style={{
        borderColor: "var(--border)",
        "--hover-border-color": color,
      } as React.CSSProperties}
    >
      <article
        className="p-6 md:p-8 h-full flex flex-col cursor-pointer transition-colors"
        style={{
          borderBottom: "4px solid transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.borderBottomColor = color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.borderBottomColor = "transparent";
        }}
      >
        {/* Icon & Label */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: color }}
          >
            <TechIcon tag={icon} size={20} />
          </div>
          <h3
            className="text-lg font-bold leading-snug group-hover:underline underline-offset-4"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </h3>
        </div>

        {/* Description */}
        <div className="flex-1 mb-6">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        </div>

        {/* Meta / Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div
            className="font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {noteCount} notes · {totalReadingTime} min
          </div>
          <div
            className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            style={{ color }}
          >
            Start here <span>→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
