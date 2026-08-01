import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "System Design Notes",
  description: "Evergreen system design notes — from basics to advanced distributed systems concepts.",
};

import { noteTopics as topics } from "@/lib/constants";

const allNotes = topics.flatMap((t) => t.notes);

export default function NotesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">

      {/* ── Left sidebar ─────────────────────────────── */}
      <aside className="hidden lg:block">
        <p className="section-label mb-4">CONTENTS</p>
        <nav className="flex flex-col gap-4 sticky top-20">
          <Link
            href="#overview"
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-secondary)" }}
          >
            Overview
          </Link>
          {topics.map((topic) => (
            <div key={topic.slug}>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2 mt-3"
                style={{ color: "var(--text-muted)" }}
              >
                {topic.label}
              </p>
              {topic.notes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${topic.slug}/${note.slug}`}
                  className="block text-sm py-0.5 border-l-2 pl-3 hover:opacity-80 transition-all"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  {note.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────────── */}
      <div>
        {/* Header */}
        <div id="overview" className="mb-10">
          <p className="section-label mb-3">KNOWLEDGE BASE</p>
          <h1
            className="font-display font-bold"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)" }}
          >
            System Design Notes
          </h1>
          <p
            className="mt-3 text-base max-w-xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            A reference library that reads like a course. Short, evergreen notes on system design
            concepts ordered from basics to advanced, with real trade-offs from systems like Kafka,
            Redis, and PostgreSQL.
          </p>

          {/* Meta */}
          <div
            className="flex flex-wrap items-center gap-4 mt-5 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <span>{allNotes.length} notes</span>
            <span>·</span>
            <span>{topics.length} topics</span>
            <span>·</span>
            <span>
              {Math.round(allNotes.reduce((s, n) => s + n.minutes, 0) / allNotes.length)} min avg read
            </span>
          </div>
        </div>

        {/* Feature pillars */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px border rounded-2xl overflow-hidden mb-12"
          style={{ background: "var(--border)", borderColor: "var(--border)" }}
        >
          {[
            { label: "DEFINITION FIRST",           text: 'The first sentence answers "what is it". No throat-clearing.' },
            { label: "TRADE-OFFS WITH REAL NUMBERS", text: 'Every note has a trade-off table and a "when NOT to use it" section.' },
            { label: "REVIEWED, NOT ABANDONED",    text: "Every claim is checked against primary sources and re-verified." },
          ].map(({ label, text }) => (
            <div
              key={label}
              className="p-5"
              style={{ background: "var(--surface)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Topics */}
        <p className="section-label mb-6">TOPICS · basics → advanced</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map((topic) => (
            <div key={topic.slug} className="card p-6">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--surface-raised)" }}
                >
                  <TechIcon tag={topic.label} size={18} />
                </div>
                <div>
                  <h2
                    className="font-display font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {topic.label}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {topic.description}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center justify-between text-xs pt-3 border-t"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <span>{topic.notes.length} notes · {topic.notes.reduce((s, n) => s + n.minutes, 0)} min</span>
                <Link
                  href={`/notes/${topic.slug}/${topic.notes[0].slug}`}
                  className="inline-flex items-center gap-1 font-medium hover:underline underline-offset-4"
                  style={{ color: "var(--accent)" }}
                >
                  Start here <LuArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
