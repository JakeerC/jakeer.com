import { getKnowledgeBase } from "@/lib/mdx";
import { NotesSidebar } from "@/components/NotesSidebar";
import { notFound } from "next/navigation";

export default async function TopicLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const knowledgeBase = getKnowledgeBase(topic);

  if (!knowledgeBase) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[220px_minmax(0,1fr)_220px] xl:gap-16">
        {/* Left Sidebar */}
        <div>
          <NotesSidebar knowledgeBase={knowledgeBase} topics={knowledgeBase.topics} />
        </div>

        {/* Main Content Area (spans the rest of the layout) */}
        {children}
      </div>
    </div>
  );
}

