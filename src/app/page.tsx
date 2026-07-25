import Link from "next/link";
import {
  ArrowRight,
  ExternalLink, Code2, FileText, Wrench,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import StatCounter from "@/components/StatCounter";
import ArticleCard from "@/components/ArticleCard";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

// ── Sample data (replace with MDX/DB queries later) ──────
const recentPosts = [
  {
    index:    1,
    slug:     "react-performance-optimization",
    title:    "React Performance Optimization: From Good to Great",
    excerpt:  "Deep dive into memoization, lazy loading, and virtual DOM optimization techniques that cut render time by 60% in production.",
    date:     "Jul 10, 2026",
    readTime: "8 min read",
    tags:     ["React", "Performance"],
  },
  {
    index:    2,
    slug:     "spring-boot-microservices",
    title:    "Building Resilient Microservices with Spring Boot & Resilience4j",
    excerpt:  "How circuit breakers, bulkheads, and retry patterns keep your financial services alive when dependencies fail.",
    date:     "Jun 28, 2026",
    readTime: "12 min read",
    tags:     ["Java", "Spring Boot"],
  },
  {
    index:    3,
    slug:     "system-design-api-gateway",
    title:    "Designing an API Gateway: Patterns and Anti-Patterns",
    excerpt:  "Rate limiting, auth aggregation, request routing — what a well-designed gateway buys you and where teams go wrong.",
    date:     "Jun 15, 2026",
    readTime: "10 min read",
    tags:     ["System Design", "Architecture"],
  },
];

const featuredProjects = [
  {
    name:        "Resilient Payment Processor",
    description: "High-throughput payment processing service handling 10K+ transactions/sec with automatic retry, idempotency, and DLQ support.",
    tags:        ["Java", "Spring Boot", "Kafka", "Redis"],
    link:        siteConfig.socials.github,
    features:    ["Idempotent API design", "Distributed tracing with Zipkin", "Auto-scaling on AWS ECS", "99.99% uptime SLA"],
  },
  {
    name:        "React Design System",
    description: "A battle-tested component library used across 5 internal Wells Fargo apps — accessible, theme-able, and fully typed.",
    tags:        ["React", "TypeScript", "Storybook", "Vite"],
    link:        siteConfig.socials.github,
    features:    ["WCAG 2.1 AA compliant", "Dark & light themes", "Comprehensive Storybook docs", "Tree-shakeable exports"],
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* ══════════════════════════════════════════════════
          01 · HERO
      ══════════════════════════════════════════════════ */}
      <section className="min-h-[88vh] flex items-center py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

          {/* Left — text */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <p
              className="section-label animate-fade-in"
              style={{ animationDelay: "0ms" }}
            >
              {siteConfig.name}
            </p>

            {/* Headline */}
            <h1
              className="font-display animate-fade-up"
              style={{
                fontSize:   "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                fontWeight: 700,
                color:      "var(--text-primary)",
                animationDelay: "100ms",
              }}
            >
              {siteConfig.tagline.split(" ").map((word, i) => (
                <span key={i}>
                  {i === siteConfig.tagline.split(" ").length - 1
                    ? <span style={{ color: "var(--accent)" }}>{word}</span>
                    : `${word} `}
                </span>
              ))}
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>

            {/* Bio */}
            <p
              className="text-base md:text-lg leading-relaxed max-w-xl animate-fade-up"
              style={{ color: "var(--text-secondary)", animationDelay: "200ms" }}
            >
              {siteConfig.description}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                href="/writing"
                id="hero-read-blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
              >
                Read the Blog <ArrowRight size={15} />
              </Link>
              <Link
                href="/projects"
                id="hero-view-projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80 active:scale-95"
                style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
              >
                View Projects
              </Link>
            </div>

            {/* Social links */}
            <div
              className="flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: "400ms" }}
            >
              {[
                { href: siteConfig.socials.github,   icon: GithubIcon,   label: "GitHub"   },
                { href: siteConfig.socials.linkedin,  icon: LinkedinIcon,  label: "LinkedIn" },
                { href: siteConfig.socials.twitter,   icon: TwitterIcon,   label: "Twitter"  },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg border transition-all hover:opacity-100 opacity-50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Right — Portrait illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <div
              className="relative w-80 h-80 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              {/* Concentric ring decorations */}
              <div
                className="absolute inset-0 rounded-full border-2 opacity-20"
                style={{ borderColor: "var(--accent)", margin: "12px" }}
              />
              <div
                className="absolute inset-0 rounded-full border opacity-10"
                style={{ borderColor: "var(--accent)", margin: "24px" }}
              />
              {/* Initials avatar placeholder */}
              <div className="text-center">
                <span
                  className="font-display font-bold block"
                  style={{ fontSize: "5rem", color: "var(--accent)", opacity: 0.15, lineHeight: 1 }}
                >
                  JC
                </span>
                <span
                  className="font-display text-lg font-semibold block mt-2"
                  style={{ color: "var(--text-primary)", opacity: 0.6 }}
                >
                  Jakeer
                </span>
                <span
                  className="text-sm font-medium block"
                  style={{ color: "var(--text-muted)" }}
                >
                  Senior SWE · Wells Fargo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          02 · STATS BAR
      ══════════════════════════════════════════════════ */}
      <section
        className="border-y py-10"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {siteConfig.stats.map((stat, i) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          03 · RECENT WRITING
      ══════════════════════════════════════════════════ */}
      <section className="py-20">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">02 · Latest Writing</p>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--text-primary)" }}
            >
              Recent Writing
            </h2>
          </div>
          <Link
            href="/writing"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:underline underline-offset-4"
            style={{ color: "var(--accent)" }}
          >
            All posts <ArrowRight size={14} />
          </Link>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentPosts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
            All posts <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          04 · FEATURED WORK
      ══════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mb-10">
          <p className="section-label mb-3">03 · Selected Work</p>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--text-primary)" }}
          >
            Featured Work
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Systems I built to solve real problems — cleaned up enough to share.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {featuredProjects.map((project) => (
            <div
              key={project.name}
              className="card p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Name + link */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--surface-raised)" }}
                    >
                      <TechIcon tag={project.tags[0]} size={18} />
                    </div>
                    <h3
                      className="font-display text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.name}
                    </h3>
                  </div>

                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        <TechIcon tag={tag} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Feature bullets */}
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
                    {project.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "var(--accent)" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* View source button */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:opacity-80 shrink-0 self-start"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
                >
                  <GithubIcon />
                  View Source
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline underline-offset-4"
            style={{ color: "var(--accent)" }}
          >
            All projects <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          05 · QUICK-ACCESS SECTIONS
      ══════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mb-10">
          <p className="section-label mb-3">04 · Explore</p>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--text-primary)" }}
          >
            What's Here
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon:        Code2,
              label:       "Snippets",
              href:        "/snippets",
              description: "Copy-paste ready code snippets for React, Java, Git, AWS, and more.",
            },
            {
              icon:        Wrench,
              label:       "Developer Tools",
              href:        "/tools",
              description: "A curated collection of utilities I use daily: JSON tools, formatters, converters.",
            },
          ].map(({ icon: Icon, label, href, description }) => (
            <Link
              key={href}
              href={href}
              className="card p-6 group flex flex-col gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--surface-raised)" }}
              >
                <Icon size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <h3
                  className="font-semibold mb-1.5 group-hover:underline underline-offset-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {description}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="mt-auto"
                style={{ color: "var(--accent)", opacity: 0.6 }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          06 · COLLABORATIONS CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label mb-4">05 · Collaborations</p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
            >
              Let's build{" "}
              <span
                className="italic"
                style={{ color: "var(--accent)" }}
              >
                something great
              </span>
              .
            </h2>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              I'm open to consulting, technical writing collaborations, and speaking engagements
              about full-stack engineering, system design, and developer tooling.
            </p>
            <Link
              href="mailto:jakeer@example.com"
              id="cta-contact"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
            >
              Get in touch <ArrowRight size={15} />
            </Link>
          </div>

          {/* Collaboration markdown mock */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: "var(--surface-raised)", borderColor: "var(--border-strong)" }}
          >
            {/* Fake window chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
              <span className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
              <span
                className="ml-2 text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                collaboration.md
              </span>
            </div>
            <div
              className="p-5 text-sm font-mono leading-7"
              style={{ color: "var(--accent)" }}
            >
              <p className="font-semibold">## What I offer</p>
              <p style={{ color: "var(--text-secondary)" }}>
                - Technical consulting & code review
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                - Architecture & system design sessions
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                - Technical blog posts & tutorials
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                - Conference talks & workshops
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                - Open-source contributions
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
