import { LuExternalLink } from "react-icons/lu";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";
import { Tag } from "@/components/Tag";
import PageHeader from "@/components/PageHeader";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const metadata: Metadata = {
  title:       "Projects",
  description: "A showcase of open-source and professional projects built by Jakeer Chilakala.",
};

import { projects, statusColors } from "@/lib/constants";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <PageHeader
        label="PROJECTS"
        title="Featured Work"
        description="Systems and tools I built to solve real problems — open-source and production-grade."
      />

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
                      <LuExternalLink size={14} />
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
                  <Tag key={tag} className="px-3 py-1 text-[0.72rem] rounded-full">
                    <TechIcon tag={tag} />
                    {tag}
                  </Tag>
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
