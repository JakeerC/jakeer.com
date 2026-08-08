import PageHeader from "@/components/PageHeader";
import { NotesTopicCard } from "@/components/NotesTopicCard";
import { knowledgeBases } from "@/lib/constants";

export const metadata = {
  title: "Notes - Knowledge Base | Jakeer Chilakala",
  description:
    "My personal knowledge base and notes on various software engineering topics.",
};

export default function NotesIndexPage() {
  const totalTopics = knowledgeBases.length;
  const totalNotes = knowledgeBases.reduce(
    (acc, kb) => acc + kb.topics.reduce((tAcc, t) => tAcc + t.notes.length, 0),
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <PageHeader
        title="Notes"
        description="My personal knowledge base. A collection of reference material, system design patterns, and notes on various technologies."
        label="KNOWLEDGE BASE"
      />

      <div className="pb-24">
        {/* Stats */}
        <div className="flex gap-6 mb-12">
          <div className="flex flex-col">
            <span
              className="text-3xl font-display font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {totalTopics}
            </span>
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              Topics
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-3xl font-display font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {totalNotes}
            </span>
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              Notes
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {knowledgeBases.map((kb) => {
            const noteCount = kb.topics.reduce(
              (acc, t) => acc + t.notes.length,
              0,
            );
            const readingTime = kb.topics.reduce(
              (acc, t) =>
                acc + t.notes.reduce((nAcc, n) => nAcc + (n.minutes || 0), 0),
              0,
            );

            return (
              <NotesTopicCard
                key={kb.slug}
                slug={kb.slug}
                label={kb.label}
                description={kb.description}
                icon={kb.icon}
                color={kb.color}
                noteCount={noteCount}
                totalReadingTime={readingTime}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
