"use client";

import { useState } from "react";
import { Search, ExternalLink, Key, Shield, Wrench, Code2, Globe } from "lucide-react";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";

const tools = [
  {
    slug:        "json-formatter",
    name:        "JSON Formatter",
    description: "Format, validate, and minify JSON. Detects errors and highlights the problematic line.",
    icon:        Code2,
    category:    "Development",
    link:        "https://jsonformatter.curiousconcept.com",
  },
  {
    slug:        "regex-tester",
    name:        "Regex Tester",
    description: "Test and debug regular expressions in real-time with match highlighting and explanations.",
    icon:        Key,
    category:    "Development",
    link:        "https://regex101.com",
  },
  {
    slug:        "jwt-decoder",
    name:        "JWT Decoder",
    description: "Decode and verify JWT tokens — inspect header, payload, and signature without sending data to a server.",
    icon:        Shield,
    category:    "Security",
    link:        "https://jwt.io",
  },
  {
    slug:        "cron-parser",
    name:        "Cron Expression Parser",
    description: "Human-readable descriptions for cron schedules. See exactly when your job will run next.",
    icon:        Wrench,
    category:    "Development",
    link:        "https://crontab.guru",
  },
  {
    slug:        "base64",
    name:        "Base64 Encoder / Decoder",
    description: "Encode or decode Base64 strings client-side — no data leaves your browser.",
    icon:        Key,
    category:    "Development",
    link:        "https://www.base64decode.org",
  },
  {
    slug:        "url-encoder",
    name:        "URL Encoder",
    description: "Encode and decode URL components quickly — useful when debugging query strings.",
    icon:        Globe,
    category:    "Development",
    link:        "https://www.urlencoder.org",
  },
  {
    slug:        "diff-checker",
    name:        "Diff Checker",
    description: "Compare two blocks of text side by side and see exactly what changed.",
    icon:        Code2,
    category:    "Development",
    link:        "https://www.diffchecker.com",
  },
  {
    slug:        "http-status",
    name:        "HTTP Status Reference",
    description: "Quick reference for all HTTP status codes — meanings, when to use them, and common mistakes.",
    icon:        Globe,
    category:    "Development",
    link:        "https://httpstatuses.io",
  },
  {
    slug:        "ssl-checker",
    name:        "SSL Certificate Checker",
    description: "Inspect SSL/TLS certificates, check expiry, and verify the chain for any hostname.",
    icon:        Shield,
    category:    "Security",
    link:        "https://www.ssllabs.com/ssltest",
  },
];

const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

export default function ToolsPage() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");

  const filtered = tools.filter((t) => {
    const matchesQuery    = t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || t.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="section-label mb-3">TOOLS</p>
          <h1
            className="font-display font-bold"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", color: "var(--text-primary)" }}
          >
            Developer Tools
          </h1>
          <p
            className="mt-2 text-base max-w-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            A curated collection of utilities for developers and engineers. The ones I actually use.
          </p>
        </div>
        <div className="flex gap-8 md:text-right">
          <div>
            <span
              className="font-display font-bold block"
              style={{ fontSize: "3rem", color: "var(--accent)", lineHeight: 1 }}
            >
              {tools.length}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Tools
            </span>
          </div>
          <div>
            <span
              className="font-display font-bold block"
              style={{ fontSize: "3rem", color: "var(--accent)", lineHeight: 1 }}
            >
              {categories.length - 1}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Categories
            </span>
          </div>
        </div>
      </div>

      <div className="divider mb-10" />

      {/* Search */}
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-2.5 mb-6"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <Search size={16} style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search tools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-50"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="tag cursor-pointer transition-all hover:opacity-80"
            style={
              category === cat
                ? { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff" }
                : {}
            }
          >
            <TechIcon tag={cat} />
            {cat} ({cat === "All" ? tools.length : tools.filter((t) => t.category === cat).length})
          </button>
        ))}
      </div>

      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Tool grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tool) => {
          return (
            <a
              key={tool.slug}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 group flex flex-col gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--surface-raised)" }}
              >
                <TechIcon tag={tool.name} size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3
                    className="font-semibold group-hover:underline underline-offset-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {tool.name}
                  </h3>
                  <ExternalLink
                    size={14}
                    className="shrink-0 opacity-30 group-hover:opacity-70 transition-opacity mt-0.5"
                  />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {tool.description}
                </p>
              </div>
              <span className="tag self-start">{tool.category}</span>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p style={{ color: "var(--text-muted)" }}>No tools match your search.</p>
        </div>
      )}
    </div>
  );
}
