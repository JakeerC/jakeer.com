import { knowledgeBases } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import TechIcon from "@/components/TechIcon";

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const kb = knowledgeBases.find((k) => k.slug === topic);
  if (!kb) return { title: "Not Found" };
  return {
    title: `${kb.label} Notes | Jakeer Chilakala`,
    description: kb.description,
  };
}

export default async function TopicOverviewPage({
  params,
}: {
  readonly params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const knowledgeBase = knowledgeBases.find((kb) => kb.slug === topic);

  if (!knowledgeBase) {
    notFound();
  }

  const noteCount = knowledgeBase.topics.reduce(
    (acc, t) => acc + t.notes.length,
    0
  );
  const readingTime = knowledgeBase.topics.reduce(
    (acc, t) =>
      acc + t.notes.reduce((nAcc, n) => nAcc + (n.minutes || 0), 0),
    0
  );

  return (
    <div className="max-w-3xl xl:col-span-2">
      {/* Hero */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: knowledgeBase.color }}
          >
            <TechIcon tag={knowledgeBase.icon} size={32} />
          </div>
          <div>
            <span
              className="text-xs font-bold tracking-widest uppercase mb-1 block"
              style={{ color: knowledgeBase.color }}
            >
              Knowledge Base
            </span>
            <h1
              className="text-4xl md:text-5xl font-display font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {knowledgeBase.label} Notes
            </h1>
          </div>
        </div>

        <p
          className="text-lg md:text-xl leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          {knowledgeBase.description}
        </p>

        <div className="flex gap-6">
          <div className="flex flex-col">
            <span
              className="text-2xl font-display font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {noteCount}
            </span>
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              Notes
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-2xl font-display font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {readingTime}
            </span>
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              Min Read
            </span>
          </div>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {knowledgeBase.principles.map((principle) => (
          <div
            key={principle.label}
            className="p-6 rounded-xl border bg-[var(--bg-secondary)]"
            style={{ borderColor: "var(--border)" }}
          >
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: knowledgeBase.color }}
            >
              {principle.label}
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {principle.text}
            </p>
          </div>
        ))}
      </div>

      {/* Sub-Topics */}
      <div className="space-y-12">
        {knowledgeBase.topics.map((subtopic) => (
          <section key={subtopic.label}>
            <h2
              className="text-2xl font-display font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              {subtopic.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subtopic.notes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${knowledgeBase.slug}/${note.slug}`}
                  className="p-5 rounded-lg border bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] transition-all group block"
                  style={{ borderColor: "var(--border)" }}
                >
                  <h3
                    className="font-semibold mb-2 group-hover:underline underline-offset-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {note.title}
                  </h3>
                  <div
                    className="text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {note.minutes} min read
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
