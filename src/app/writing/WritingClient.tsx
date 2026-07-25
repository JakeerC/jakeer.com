"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search, Filter, Calendar, List, LayoutGrid } from "lucide-react";
import TechIcon from "@/components/TechIcon";
import PageHeader from "@/components/PageHeader";

const posts = [
  {
    slug:     "react-performance-optimization",
    title:    "React Performance Optimization: From Good to Great",
    excerpt:  "Deep dive into memoization, lazy loading, and virtual DOM optimization techniques that cut render time by 60% in production.",
    date:     "Jul 10, 2026",
    readTime: "8 min read",
    tags:     ["React", "Performance", "JavaScript"],
    featured: true,
  },
  {
    slug:     "spring-boot-microservices",
    title:    "Building Resilient Microservices with Spring Boot & Resilience4j",
    excerpt:  "How circuit breakers, bulkheads, and retry patterns keep your financial services alive when dependencies fail.",
    date:     "Jun 28, 2026",
    readTime: "12 min read",
    tags:     ["Java", "Spring Boot", "Microservices"],
    featured: false,
  },
  {
    slug:     "system-design-api-gateway",
    title:    "Designing an API Gateway: Patterns and Anti-Patterns",
    excerpt:  "Rate limiting, auth aggregation, request routing — what a well-designed gateway buys you and where teams go wrong.",
    date:     "Jun 15, 2026",
    readTime: "10 min read",
    tags:     ["System Design", "Architecture"],
    featured: false,
  },
  {
    slug:     "typescript-advanced-types",
    title:    "Advanced TypeScript Patterns for Large Codebases",
    excerpt:  "Conditional types, mapped types, template literal types, and infer — practical patterns that make your types work harder.",
    date:     "Jun 5, 2026",
    readTime: "9 min read",
    tags:     ["TypeScript", "JavaScript"],
    featured: false,
  },
  {
    slug:     "kafka-consumer-groups",
    title:    "Kafka Consumer Groups: What Nobody Tells You",
    excerpt:  "Rebalancing, offset commits, partition assignment strategies — the gaps between the docs and production reality.",
    date:     "May 20, 2026",
    readTime: "11 min read",
    tags:     ["Kafka", "Distributed Systems"],
    featured: false,
  },
  {
    slug:     "postgres-indexing-guide",
    title:    "A Practical Guide to PostgreSQL Indexing",
    excerpt:  "B-Tree vs GIN vs BRIN — when to use each, how to spot missing indexes, and the queries that catch slow paths.",
    date:     "May 8, 2026",
    readTime: "7 min read",
    tags:     ["PostgreSQL", "Database"],
    featured: false,
  },
];

export default function WritingClient() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const featured = posts.find((p) => p.featured)!;
  const rest     = posts.filter((p) => !p.featured);
  const allTags  = Array.from(new Set(posts.flatMap((p) => p.tags)));

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
            label: "Posts Published"
          }
        ]}
      />

      <div className="divider mb-12" />

      {/* ── Featured post ────────────────────────────── */}
      <div className="mb-12">
        <p className="section-label mb-5">FEATURED</p>
        <Link href={`/writing/${featured.slug}`} className="block group">
          <div
            className="card p-7 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8"
          >
            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {featured.tags.map((t) => (
                  <span key={t} className="tag">
                    <TechIcon tag={t} />
                    {t}
                  </span>
                ))}
              </div>
              <h2
                className="font-display text-2xl md:text-3xl font-semibold leading-snug mb-3 group-hover:underline underline-offset-4"
                style={{ color: "var(--text-primary)" }}
              >
                {featured.title}
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                {featured.excerpt}
              </p>
              <div
                className="flex items-center gap-3 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <span>{featured.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {featured.readTime}
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-end">
              <div
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--accent)" }}
              >
                Read <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Search bar ──────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row gap-3 mb-8"
      >
        <div
          className="flex-1 flex items-center gap-3 rounded-xl border px-4 py-2.5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <Search size={16} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search articles, tags, topics…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-50"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium h-full"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            <Filter size={15} />
            Filters
          </button>

          <div className="flex items-center gap-1 p-1 rounded-xl border h-full" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tag filters ─────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          className="tag"
          style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "#fff" }}
        >
          All ({posts.length})
        </button>
        {allTags.map((tag) => (
          <button key={tag} className="tag hover:opacity-80 transition-opacity cursor-pointer">
            <TechIcon tag={tag} />
            {tag}
          </button>
        ))}
      </div>
      
      <p className="text-sm font-mono mb-4" style={{ color: "var(--text-muted)" }}>{posts.length} articles total</p>

      {/* ── Article list/grid ────────────────────────────── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post, i) => (
            <Link key={post.slug} href={`/writing/${post.slug}`} className="block group">
              <article className="card p-6 h-full flex flex-col gap-4">
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className="tag">
                        <TechIcon tag={t} />
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3
                    className="font-display text-base font-semibold leading-snug mb-2 group-hover:underline underline-offset-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {post.excerpt}
                  </p>
                </div>
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col rounded-xl border bg-[var(--card)]" style={{ borderColor: 'var(--border)' }}>
          {rest.map((post, i) => (
            <Link key={post.slug} href={`/writing/${post.slug}`} className={`block group p-5 border-b last:border-b-0`} style={{ borderColor: 'var(--border)' }}>
              <article className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-full sm:w-48 h-28 rounded-lg border flex items-center justify-center shrink-0 transition-opacity group-hover:opacity-90" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                   <TechIcon tag={post.tags[0]} />
                </div>
                
                <div className="flex-1 flex flex-col justify-center h-full py-1">
                  <h3 className="font-display text-lg font-semibold leading-snug mb-2 group-hover:underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
                    <span className="flex items-center gap-1.5 ml-2"><Clock size={13} /> {post.readTime}</span>
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
