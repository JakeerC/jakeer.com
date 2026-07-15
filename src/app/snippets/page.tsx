import Link from "next/link";
import { Code2, Terminal, GitBranch, Cloud, Cpu, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Snippets",
  description: "Ready-to-use code snippets for React, Java, Spring Boot, Git, AWS, and more.",
};

const categories = [
  { slug: "react",        label: "React",        icon: Globe,     count: 12, description: "Hooks, patterns, optimization" },
  { slug: "java",         label: "Java",         icon: Cpu,       count: 8,  description: "Spring Boot, streams, patterns" },
  { slug: "typescript",   label: "TypeScript",   icon: Code2,     count: 10, description: "Types, generics, utilities" },
  { slug: "git",          label: "Git",          icon: GitBranch, count: 15, description: "Aliases, workflows, fixups" },
  { slug: "aws",          label: "AWS CLI",      icon: Cloud,     count: 9,  description: "S3, EC2, IAM, Lambda" },
  { slug: "shell",        label: "Shell / Bash",  icon: Terminal,  count: 11, description: "One-liners, scripts, utils" },
];

export default function SnippetsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="section-label mb-3">SNIPPETS</p>
          <h1
            className="font-display font-bold"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", color: "var(--text-primary)" }}
          >
            Code Snippets
          </h1>
          <p
            className="mt-2 text-base max-w-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Copy-paste ready snippets organized by category. No fluff, just the code.
          </p>
        </div>
        <div className="text-right">
          <span
            className="font-display font-bold block"
            style={{ fontSize: "3rem", color: "var(--accent)", lineHeight: 1 }}
          >
            {categories.reduce((s, c) => s + c.count, 0)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Total Snippets
          </span>
        </div>
      </div>

      <div className="divider mb-12" />

      {/* Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/snippets/${cat.slug}`}
              className="card p-6 group flex flex-col gap-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--surface-raised)" }}
                >
                  <Icon size={22} style={{ color: "var(--accent)" }} />
                </div>
                <span
                  className="font-display font-bold text-3xl"
                  style={{ color: "var(--accent)", opacity: 0.2 }}
                >
                  {cat.count}
                </span>
              </div>
              <div>
                <h2
                  className="font-semibold mb-1 group-hover:underline underline-offset-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cat.label}
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {cat.description}
                </p>
              </div>
              <div
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: "var(--accent)" }}
              >
                {cat.count} snippets →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
