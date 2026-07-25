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
      {/* ── Featured post ────────────────────────────── */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-5 ml-1" style={{ color: "var(--accent)" }}>FEATURED</p>
        <Link href={`/writing/${featured.slug}`} className="block group">
          <div className="card grid grid-cols-1 md:grid-cols-[1fr_280px] min-h-[300px] overflow-hidden">
            {/* Left side */}
            <div className="p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r transition-colors group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]" style={{ borderColor: 'var(--border)' }}>
              <div className="mb-6">
                <span className="inline-block px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider rounded border" style={{ color: 'var(--accent)', borderColor: 'var(--accent)', backgroundColor: 'transparent' }}>
                  {featured.tags[0].toUpperCase()}
                </span>
              </div>
              
              <h2
                className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-4 group-hover:underline underline-offset-4"
                style={{ color: "var(--text-primary)" }}
              >
                {featured.title}
              </h2>
              
              <p className="text-sm md:text-base leading-relaxed mb-10 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                {featured.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto text-xs md:text-sm font-mono" style={{ color: "var(--text-muted)" }}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {featured.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {featured.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5 font-sans font-medium transition-colors" style={{ color: "var(--accent)" }}>
                  Read <ArrowRight size={14} />
                </div>
              </div>
            </div>
            
            {/* Right side (Topics) */}
            <div className="p-8 md:p-8 flex flex-col justify-center transition-colors group-hover:bg-black/[0.01] dark:group-hover:bg-white/[0.01]">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "var(--accent)" }}>TOPICS</p>
              <div className="flex flex-wrap gap-2">
                {featured.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 text-[11px] font-mono rounded border" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                    {t.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                ))}
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
            <Link key={post.slug} href={`/writing/${post.slug}`} className="block group h-full">
              <article className="card h-full flex flex-col overflow-hidden transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                {/* Hero Image */}
                <div className="w-full h-48 border-b relative shrink-0 overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                   <img src="/placeholder-hero.jpg" alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Primary Category Tag */}
                  <div className="mb-4">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider rounded border" style={{ color: 'var(--accent)', borderColor: 'var(--accent)', backgroundColor: 'transparent' }}>
                      {post.tags[0].toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3
                    className="font-display text-lg font-semibold leading-snug mb-3 group-hover:underline underline-offset-4"
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
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
                  </div>

                  {/* Topics Pills */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(1, 4).map((t) => (
                      <span key={t} className="px-2 py-1 text-[11px] font-mono rounded border transition-colors group-hover:border-gray-400/30" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', backgroundColor: 'transparent' }}>
                        {t.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    ))}
                    {post.tags.length > 4 && (
                      <span className="px-2 py-1 text-[11px] font-mono rounded border transition-colors group-hover:border-gray-400/30" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', backgroundColor: 'transparent' }}>
                        +{post.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {rest.map((post, i) => (
            <Link key={post.slug} href={`/writing/${post.slug}`} className={`block group p-5 border-b last:border-b-0 transition-colors hover:bg-black/5 dark:hover:bg-white/5`} style={{ borderColor: 'var(--border)' }}>
              <article className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-full sm:w-48 h-32 sm:h-28 rounded-lg border overflow-hidden relative shrink-0 transition-opacity group-hover:opacity-90" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                   <img src="/placeholder-hero.jpg" alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
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
