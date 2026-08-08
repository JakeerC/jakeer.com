import Link from "next/link";
import { LuArrowRight, LuCode, LuFileText, LuWrench } from "react-icons/lu";
import { siteConfig } from "@/lib/config";
import StatCounter from "@/components/StatCounter";
import ArticleCard from "@/components/ArticleCard";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";
import { Tag } from "@/components/Tag";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

import { recentPosts, featuredProjects } from "@/lib/constants";
import { FaFile, FaGithub, FaLinkedin } from "react-icons/fa";

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
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                fontWeight: 700,
                color: "var(--text-primary)",
                animationDelay: "100ms",
              }}
            >
              {siteConfig.tagline.split(" ").map((word, i) => (
                <span key={i}>
                  {i === siteConfig.tagline.split(" ").length - 1 ? (
                    <span style={{ color: "var(--accent)" }}>{word}</span>
                  ) : (
                    `${word} `
                  )}
                </span>
              ))}
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>

            {/* Bio */}
            <p
              className="text-base md:text-lg leading-relaxed max-w-xl animate-fade-up"
              style={{
                color: "var(--text-secondary)",
                animationDelay: "200ms",
              }}
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
                style={{
                  background: "var(--text-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                Read the Blog <LuArrowRight size={15} />
              </Link>
              <Link
                href="/projects"
                id="hero-view-projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80 active:scale-95"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
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
                {
                  href: siteConfig.socials.github,
                  icon: FaGithub,
                  label: "GitHub",
                },
                {
                  href: siteConfig.socials.linkedin,
                  icon: FaLinkedin,
                  label: "LinkedIn",
                },
                {
                  href: siteConfig.socials.resume,
                  icon: FaFile,
                  label: "Resume",
                },
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
                  style={{
                    fontSize: "5rem",
                    color: "var(--accent)",
                    opacity: 0.15,
                    lineHeight: 1,
                  }}
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
            <StatCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={i * 100}
            />
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
            <p
              className="text-xs font-mono font-semibold mb-3 tracking-[0.15em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              02 . LATEST WRITING
            </p>
            <h2
              className="font-display font-semibold"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                color: "var(--text-primary)",
              }}
            >
              Recent Writing
            </h2>
          </div>
          <Link
            href="/writing"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-secondary)" }}
          >
            All posts <LuArrowRight size={14} />
          </Link>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
          {recentPosts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            All posts <LuArrowRight size={14} />
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
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "var(--text-primary)",
            }}
          >
            Featured Work
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Systems I built to solve real problems — cleaned up enough to share.
          </p>
        </div>

        <div className="flex flex-col border border-[var(--border)] bg-[var(--border)] gap-[1px]">
          {featuredProjects.map((project) => (
            <div
              key={project.name}
              className="p-6 md:p-8 bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Name + link */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--surface)" }}
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
                      <Tag
                        key={tag}
                        className="px-3 py-1 text-[0.72rem] rounded-full"
                      >
                        <TechIcon tag={tag} />
                        {tag}
                      </Tag>
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
                  style={{
                    borderColor: "var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                >
                  <FaGithub />
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
            All projects <LuArrowRight size={14} />
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
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "var(--text-primary)",
            }}
          >
            What is Here
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[var(--border)] border border-[var(--border)]">
          {[
            {
              icon: LuCode,
              label: "Snippets",
              href: "/snippets",
              description:
                "Copy-paste ready code snippets for React, Java, Git, AWS, and more.",
            },
            {
              icon: LuWrench,
              label: "Developer Tools",
              href: "/tools",
              description:
                "A curated collection of utilities I use daily: JSON tools, formatters, converters.",
            },
            {
              icon: LuFileText,
              label: "Writing",
              href: "/writing",
              description:
                "Technical deep-dives, tutorials, and perspectives on software engineering.",
            },
          ].map(({ icon: Icon, label, href, description }) => (
            <Link
              key={href}
              href={href}
              className="bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] transition-colors p-6 group flex flex-col gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--surface)" }}
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
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {description}
                </p>
              </div>
              <LuArrowRight
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
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "var(--text-primary)",
                lineHeight: 1.1,
              }}
            >
              Let&apos;s build{" "}
              <span className="italic" style={{ color: "var(--accent)" }}>
                something great
              </span>
              .
            </h2>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              I&apos;m open to consulting, technical writing collaborations, and
              speaking engagements about full-stack engineering, system design,
              and developer tooling.
            </p>
            <Link
              href="mailto:jakeer@example.com"
              id="cta-contact"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg-primary)",
              }}
            >
              Get in touch <LuArrowRight size={15} />
            </Link>
          </div>

          {/* Collaboration markdown mock */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "var(--surface-raised)",
              borderColor: "var(--border-strong)",
            }}
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
