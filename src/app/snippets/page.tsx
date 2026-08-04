import Link from "next/link";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title:       "Snippets",
  description: "Ready-to-use code snippets for React, Java, Spring Boot, Git, AWS, and more.",
};

import { snippetCategories as categories } from "@/lib/constants";

export default function SnippetsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <PageHeader
        label="SNIPPETS"
        title="Code Snippets"
        description="Copy-paste ready snippets organized by category. No fluff, just the code."
        stats={[
          {
            value: categories.reduce((s, c) => s + c.count, 0),
            label: "Total Snippets"
          }
        ]}
      />

      <div className="divider mb-12" />

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[var(--border)] gap-[1px] border border-[var(--border)]">
        {categories.map((cat) => {
          return (
            <Link
              key={cat.slug}
              href={`/snippets/${cat.slug}`}
              className="bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] p-6 group flex flex-col gap-5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--surface-raised)" }}
                >
                  <TechIcon tag={cat.label} size={22} />
                </div>
              </div>
              <div>
                <h2
                  className="font-bold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cat.label}
                </h2>
                <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {cat.description}
                </p>
              </div>
              <div
                className="text-xs font-mono font-medium flex items-center gap-1 mt-auto"
                style={{ color: "var(--text-muted)" }}
              >
                {cat.count} snippets
              </div>
            </Link>
          );
        })}
        {/* Fill the remaining grid slots */}
        <div className={`hidden ${categories.length % 2 === 1 ? 'sm:block' : 'sm:hidden'} ${categories.length % 4 !== 0 ? 'lg:block' : 'lg:hidden'} bg-[var(--surface-raised)]`} />
        <div className={`hidden sm:hidden ${[1, 2].includes(categories.length % 4) ? 'lg:block' : 'lg:hidden'} bg-[var(--surface-raised)]`} />
        <div className={`hidden sm:hidden ${categories.length % 4 === 1 ? 'lg:block' : 'lg:hidden'} bg-[var(--surface-raised)]`} />
      </div>
    </div>
  );
}
