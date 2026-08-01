"use client";

import { useState } from "react";
import {
  LuSearch,
  LuExternalLink,
} from "react-icons/lu";
import TechIcon from "@/components/TechIcon";
import PageHeader from "@/components/PageHeader";
import { FieldControl } from "@/components/FieldControl";
import { Tag } from "@/components/Tag";

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  link: string;
}

export default function ToolsClient({ tools }: { tools: Tool[] }) {
  const categories = [
    "All",
    ...Array.from(new Set(tools.map((t) => t.category))),
  ];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = tools.filter((t) => {
    const matchesQuery =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || t.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <PageHeader
        label="TOOLS"
        title="Developer Tools"
        description="A curated collection of utilities for developers and engineers. The ones I actually use."
        stats={[
          {
            value: tools.length,
            label: "Tools",
          },
          {
            value: categories.length - 1,
            label: "Categories",
          },
        ]}
      />

      <div className="divider mb-10" />

      {/* Search */}
      <div className="mb-6">
        <FieldControl
          type="text"
          placeholder="Search tools…"
          value={query}
          onChange={setQuery}
          leftIcon={<LuSearch size={16} />}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Tag
            key={cat}
            onClick={() => setCategory(cat)}
            variant={category === cat ? "accent" : "default"}
            className="cursor-pointer transition-all hover:opacity-80 px-3 py-1.5 text-[0.72rem] rounded-full"
          >
            <TechIcon tag={cat} />
            {cat} (
            {cat === "All"
              ? tools.length
              : tools.filter((t) => t.category === cat).length}
            )
          </Tag>
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
                  <LuExternalLink
                    size={14}
                    className="shrink-0 opacity-30 group-hover:opacity-70 transition-opacity mt-0.5"
                  />
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {tool.description}
                </p>
              </div>
              <Tag className="self-start px-3 py-1 text-[0.72rem] rounded-full">{tool.category}</Tag>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p style={{ color: "var(--text-muted)" }}>
            No tools match your search.
          </p>
        </div>
      )}
    </div>
  );
}
