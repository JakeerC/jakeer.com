import { LuClock, LuCalendar } from "react-icons/lu";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/mdx";
import { knowledgeBases } from "@/lib/constants";
import TableOfContents from "@/components/TableOfContents";

// Import identical custom MDX components used in writing
import { components } from "@/app/writing/[slug]/page";

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ topic: string; slug: string }>;
}): Promise<Metadata> {
  const { topic, slug } = await params;
  const note = getContentBySlug(`notes/${topic}`, slug);
  if (!note) return { title: "Not Found" };
  return {
    title: `${note.frontmatter.title} | ${knowledgeBases.find((k) => k.slug === topic)?.label} Notes`,
    description: (note.frontmatter.description as string) || "Note",
  };
}

export default async function NoteDetailPage({
  params,
}: {
  readonly params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  const note = getContentBySlug(`notes/${topic}`, slug);

  if (!note) {
    return notFound();
  }

  return (
    <>
      <div className="min-w-0">
        {/* Title */}
        <h1
          className="font-display font-bold leading-tight mb-6"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            color: "var(--text-primary)",
          }}
        >
          {note.frontmatter.title as string}
        </h1>

        {/* Meta */}
        <div
          className="flex items-center gap-4 text-sm mb-10 pb-10 border-b"
          style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
        >
          {note.frontmatter.date ? (
            <>
              <span className="flex items-center gap-1.5">
                <LuCalendar size={13} />
                {note.frontmatter.date as string}
              </span>
              <span>·</span>
            </>
          ) : null}
          <span className="flex items-center gap-1.5">
            <LuClock size={13} />
            {(note.frontmatter.readTime as string) || "5 min read"}
          </span>
        </div>

        {/* Content */}
        <article
          className="prose prose-sm md:prose-base"
          style={{ color: "var(--text-primary)" }}
        >
          <MDXRemote source={note.content} components={components} />
        </article>
      </div>

      <TableOfContents breakpoint="xl" />
    </>
  );
}
