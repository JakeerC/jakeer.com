import { ExternalLink } from "lucide-react";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const metadata: Metadata = {
  title:       "Projects",
  description: "A showcase of open-source and professional projects built by Jakeer Chilakala.",
};

const projects = [
  {
    name:        "Resilient Payment Processor",
    description: "High-throughput payment processing service handling 10K+ transactions/sec with automatic retry, idempotency, and dead-letter queue support for financial-grade reliability.",
    tags:        ["Java", "Spring Boot", "Kafka", "Redis", "PostgreSQL"],
    github:      "#",
    demo:        "",
    status:      "Production",
    features:    [
      "Idempotent API design prevents double-charges",
      "Distributed tracing with Zipkin + Sleuth",
      "Auto-scaling on AWS ECS with CloudWatch",
      "Circuit breaker via Resilience4j",
      "99.99% uptime SLA maintained for 18 months",
    ],
  },
  {
    name:        "React Design System",
    description: "A battle-tested component library used across 5 internal Wells Fargo applications — accessible, theme-able, and fully typed with comprehensive Storybook documentation.",
    tags:        ["React", "TypeScript", "Storybook", "Vite", "CSS Modules"],
    github:      "#",
    demo:        "#",
    status:      "Active",
    features:    [
      "WCAG 2.1 AA compliant out of the box",
      "Dark & light themes via CSS custom properties",
      "40+ components with prop-type documentation",
      "100% TypeScript with generics support",
      "Tree-shakeable exports for optimal bundle size",
    ],
  },
  {
    name:        "API Rate Limiter Middleware",
    description: "Express.js middleware implementing token bucket and sliding window algorithms for precise API rate limiting with Redis-backed distributed counters.",
    tags:        ["Node.js", "Redis", "TypeScript", "Express"],
    github:      "#",
    demo:        "",
    status:      "Open Source",
    features:    [
      "Token bucket and sliding window algorithms",
      "Redis-backed for distributed systems",
      "Per-user and per-route granularity",
      "Configurable response headers",
      "Zero external dependencies beyond Redis client",
    ],
  },
  {
    name:        "DevDash — Developer Dashboard",
    description: "A personal developer dashboard aggregating GitHub stats, Jira tickets, Confluence docs, and CI/CD pipeline status in a single unified interface.",
    tags:        ["Next.js", "React", "TypeScript", "GitHub API"],
    github:      "#",
    demo:        "#",
    status:      "Personal",
    features:    [
      "Real-time GitHub activity graph",
      "Jira sprint board integration",
      "CI/CD pipeline status at a glance",
      "Customizable widget layout",
      "Dark mode with CSS design tokens",
    ],
  },
];

const statusColors: Record<string, string> = {
  Production:  "#22c55e",
  Active:      "#3b82f6",
  "Open Source": "var(--accent)",
  Personal:    "#f59e0b",
};

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="section-label mb-3">PROJECTS</p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", color: "var(--text-primary)" }}
        >
          Featured Work
        </h1>
        <p
          className="mt-2 text-base max-w-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          Systems and tools I built to solve real problems — open-source and production-grade.
        </p>
      </div>

      <div className="divider mb-12" />

      {/* Projects */}
      <div className="flex flex-col gap-8">
        {projects.map((project) => (
          <div key={project.name} className="card p-7 md:p-10">
            <div className="flex flex-col gap-6">
              {/* Top row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--surface-raised)" }}
                  >
                    <TechIcon tag={project.tags[0]} size={20} />
                  </div>
                  <div>
                    <h2
                      className="font-display text-xl font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.name}
                    </h2>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: statusColors[project.status] ?? "var(--accent)" }}
                    >
                      ● {project.status}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:opacity-80"
                    style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
                  >
                  <GithubIcon />
                    Source
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                      style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    <TechIcon tag={tag} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Feature bullets */}
              <div className="divider" />
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}
