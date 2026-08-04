"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LuArrowRight,
  LuClock,
  LuSearch,
  LuFilter,
  LuCalendar,
  LuList,
  LuLayoutGrid,
} from "react-icons/lu";
import TechIcon from "@/components/TechIcon";
import PageHeader from "@/components/PageHeader";
import { FieldControl } from "@/components/FieldControl";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
}

export default function WritingClient({ posts }: { posts: Post[] }) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const featured = posts.find((p) => p.featured);
  const rest = posts
    .filter((p) => p !== featured)
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery = p.title.toLowerCase().includes(q) ||
                           p.excerpt.toLowerCase().includes(q) ||
                           (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
      const matchesTags = selectedTags.length === 0 || 
                          (p.tags && selectedTags.some(t => p.tags.includes(t)));
      return matchesQuery && matchesTags;
    });
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* ── Page header ─────────────────────────────── */}
      <PageHeader
        label="WRITING"
        title="Writing"
        description="Technical deep-dives, tutorials, and perspectives on software engineering, tooling, and building products."
        stats={[
          {
            value: posts.length,
            label: "Posts Published",
          },
        ]}
      />

      <div className="divider mb-12" />

      {/* ── Featured post ────────────────────────────── */}
      {/* ── Featured post ────────────────────────────── */}
      <div className="mb-12">
        <p
          className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-5 ml-1"
          style={{ color: "var(--accent)" }}
        >
          FEATURED
        </p>
        {featured && (
          <Link
            href={`/writing/${featured.slug}`}
            className="block group border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] min-h-[300px] overflow-hidden">
              {/* Left side */}
              <div className="p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--border)]">
                <div className="mb-6">
                  {featured.tags && featured.tags.length > 0 && (
                    <Tag
                      size="sm"
                      variant="outline"
                      className="font-semibold tracking-wider !border-[var(--accent)] !text-[var(--accent)]"
                    >
                      {featured.tags[0].toUpperCase()}
                    </Tag>
                  )}
                </div>

                <h2
                  className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-4 transition-all duration-300 group-hover:text-[var(--accent)] underline decoration-transparent group-hover:decoration-[var(--accent)] underline-offset-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {featured.title}
                </h2>

                <p
                  className="text-sm md:text-base leading-relaxed mb-10 line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {featured.excerpt}
                </p>

                <div
                  className="flex items-center justify-between mt-auto text-xs md:text-sm font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <LuCalendar size={14} /> {featured.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <LuClock size={14} /> {featured.readTime}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 font-sans font-medium transition-colors"
                    style={{ color: "var(--accent)" }}
                  >
                    Read <LuArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Right side (Topics) */}
              <div className="p-8 md:p-8 flex flex-col justify-center">
                <p
                  className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-5"
                  style={{ color: "var(--accent)" }}
                >
                  TOPICS
                </p>
                <div className="flex flex-wrap gap-2">
                  {(featured.tags || []).map((t) => (
                    <Tag
                      key={t}
                      size="sm"
                      variant="default"
                      className="!bg-[var(--surface)]"
                    >
                      {t.toLowerCase().replace(/\s+/g, "-")}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* ── LuSearch bar ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex-1">
          <FieldControl
            type="text"
            placeholder="Search articles, tags, topics…"
            value={searchQuery}
            onChange={setSearchQuery}
            leftIcon={<LuSearch size={16} />}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isFiltersOpen ? "primary" : "outline"}
            className="h-full rounded-xl"
            leftIcon={<LuFilter size={15} />}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            Filters
          </Button>

          <div
            className="flex items-center gap-1 p-1 rounded-xl border h-full"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              className="px-2 py-1.5"
              aria-label="LuList view"
            >
              <LuList size={16} />
            </Button>
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              className="px-2 py-1.5"
              aria-label="Grid view"
            >
              <LuLayoutGrid size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tag filters ─────────────────────────────── */}
      {isFiltersOpen && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Tag
            variant={selectedTags.length === 0 ? "accent" : "default"}
            className="cursor-pointer px-3 py-1 text-[0.72rem] rounded-full select-none"
            onClick={() => setSelectedTags([])}
          >
            All ({posts.length})
          </Tag>
          {allTags.map((tag) => (
            <Tag
              key={tag}
              variant={selectedTags.includes(tag) ? "accent" : "default"}
              className="hover:opacity-80 transition-opacity cursor-pointer px-3 py-1 text-[0.72rem] rounded-full select-none"
              onClick={() => {
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                );
              }}
            >
              <TechIcon tag={tag} />
              {tag}
            </Tag>
          ))}
        </div>
      )}

      <p
        className="text-sm font-mono mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        {posts.length} articles total
      </p>

      {/* ── Article list/grid ────────────────────────────── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--border)] border border-[var(--border)]">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] transition-colors block group h-full"
            >
              <article className="h-full flex flex-col p-6">
                {/* Hero Image Inset */}
                <div
                  className="w-full h-40 rounded-lg border relative shrink-0 overflow-hidden mb-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <Image
                    src="/placeholder-hero.jpg"
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  {/* Primary Category Tag */}
                  <div className="mb-4">
                    {post.tags && post.tags.length > 0 && (
                      <Tag
                        size="sm"
                        variant="outline"
                        className="font-semibold tracking-wider !border-[var(--accent)] !text-[var(--accent)]"
                      >
                        {post.tags[0].toUpperCase()}
                      </Tag>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display text-lg font-semibold leading-snug mb-3 transition-all duration-300 group-hover:text-[var(--accent)] underline decoration-transparent group-hover:decoration-[var(--accent)] underline-offset-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    className="text-sm leading-relaxed mb-6 line-clamp-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Meta (Date / Read time) */}
                  <div
                    className="flex items-center gap-4 text-xs font-mono mb-5 mt-auto"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="flex items-center gap-1.5">
                      <LuCalendar size={13} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <LuClock size={13} /> {post.readTime}
                    </span>
                  </div>

                  {/* Topics Pills */}
                  <div className="flex flex-wrap gap-2">
                    {(post.tags || []).slice(1, 4).map((t) => (
                      <Tag
                        key={t}
                        size="sm"
                        variant="outline"
                        className="group-hover:border-gray-400/30"
                      >
                        {t.toLowerCase().replace(/\s+/g, "-")}
                      </Tag>
                    ))}
                    {(post.tags || []).length > 4 && (
                      <Tag
                        size="sm"
                        variant="outline"
                        className="group-hover:border-gray-400/30"
                      >
                        +{post.tags.length - 4}
                      </Tag>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {/* Fill the remaining grid slots with empty background */}
          <div className={`hidden ${rest.length % 2 === 1 ? 'md:block' : 'md:hidden'} ${rest.length % 3 !== 0 ? 'lg:block' : 'lg:hidden'} bg-[var(--surface-raised)]`} />
          <div className={`hidden md:hidden ${rest.length % 3 === 1 ? 'lg:block' : 'lg:hidden'} bg-[var(--surface-raised)]`} />
        </div>
      ) : (
        <div
          className="flex flex-col rounded-xl border"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className={`block group p-5 border-b last:border-b-0 transition-colors bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)]`}
              style={{ borderColor: "var(--border)" }}
            >
              <article className="flex flex-col sm:flex-row gap-5 items-start">
                <div
                  className="w-full sm:w-48 h-32 sm:h-28 rounded-lg border overflow-hidden relative shrink-0 transition-opacity group-hover:opacity-90"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <Image
                    src="/placeholder-hero.jpg"
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center h-full py-1">
                  <h3
                    className="font-display text-lg font-semibold leading-snug mb-2 transition-all duration-300 group-hover:text-[var(--accent)] underline decoration-transparent group-hover:decoration-[var(--accent)] underline-offset-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4 line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="flex items-center gap-1.5">
                      <LuCalendar size={13} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5 ml-2">
                      <LuClock size={13} /> {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
