import React from "react";

interface PageHeaderProps {
  label: string;
  title: string;
  description: string;
  stats?: Array<{
    value: string | number;
    label: string;
  }>;
}

export default function PageHeader({ label, title, description, stats }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
      <div>
        <p className="section-label mb-3">{label}</p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        <p
          className="mt-2 text-base max-w-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      </div>
      {stats && stats.length > 0 && (
        <div className="flex gap-8 md:text-right md:justify-end">
          {stats.map((stat, i) => (
            <div key={i}>
              <span
                className="font-display font-bold block"
                style={{ fontSize: "3rem", color: "var(--accent)", lineHeight: 1 }}
              >
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
