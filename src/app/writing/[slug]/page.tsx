import { LuArrowLeft, LuClock, LuCalendar } from "react-icons/lu";
import Link from "next/link";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { Tag } from "@/components/Tag";
import TableOfContents from "@/components/TableOfContents";

import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx/registry";
import { buildMetadata, buildArticleJsonLd } from "@/lib/metadata";
import { getWritingProjections } from "@/lib/content-projections";
import { getRelatedItems, type ContentIdentity } from "@/lib/related-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getContentBySlug("writing", slug);
  if (!post || post.frontmatter.draft) return { title: "Not Found" };
  return buildMetadata({
    title: post.frontmatter.title as string,
    description: post.frontmatter.description as string | undefined,
    canonicalPath: `/writing/${slug}`,
    publishedTime: post.frontmatter.date as string | undefined,
    tags: post.frontmatter.tags as string[] | undefined,
  });
}

// Re-export for backwards compatibility (notes page and other consumers)
export const components = mdxComponents;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = getContentBySlug("writing", resolvedParams.slug);

  if (!post) {
    return notFound();
  }

  const tags = (post.frontmatter.tags as string[]) || [];

  const allWriting = getWritingProjections();
  const currentIdentity: ContentIdentity = {
    kind: "writing",
    slug: resolvedParams.slug,
    tags: (post.frontmatter.tags as string[]) || [],
    date: post.frontmatter.date as string | undefined,
  };
  const relatedCandidates = allWriting.map((w) => ({
    kind: "writing" as const,
    slug: w.slug,
    title: w.title,
    href: `/writing/${w.slug}`,
    tags: w.tags,
    date: w.date,
    score: 0,
    topic: undefined,
    subtopic: undefined,
  }));
  const related = getRelatedItems(currentIdentity, relatedCandidates, 3);

  const jsonLd = buildArticleJsonLd({
    title: post.frontmatter.title as string,
    description: post.frontmatter.description as string | undefined,
    canonicalPath: `/writing/${resolvedParams.slug}`,
    publishedTime: post.frontmatter.date as string | undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Image */}
      <div 
        className="relative w-full aspect-[21/9] sm:aspect-[2/1] md:aspect-[2.5/1] mb-12 rounded-2xl overflow-hidden border" 
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Image 
          src={(post.frontmatter.image as string) || "/placeholder-hero.jpg"} 
          alt={(post.frontmatter.title as string) || "Hero Image"} 
          fill 
          priority
          className="object-cover" 
        />
      </div>

      {/* Back */}
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-sm mb-10 hover:underline underline-offset-4 transition-all"
        style={{ color: "var(--text-muted)" }}
      >
        <LuArrowLeft size={14} />
        All Writing
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((t: string) => (
          <Tag key={t} className="px-3 py-1 text-[0.72rem] rounded-full">
            <TechIcon tag={t} />
            {t}
          </Tag>
        ))}
      </div>

      {/* Title */}
      <h1
        className="font-display font-bold leading-tight mb-6"
        style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          color: "var(--text-primary)",
        }}
      >
        {post.frontmatter.title as string}
      </h1>

      {/* Meta */}
      <div
        className="flex items-center gap-4 text-sm mb-10 pb-10 border-b"
        style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
      >
        <span className="flex items-center gap-1.5">
          <LuCalendar size={13} />
          {post.frontmatter.date as string}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1.5">
          <LuClock size={13} />
          {(post.frontmatter.readTime as string) || "5 min read"}
        </span>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 items-start">
        <div className="min-w-0">
          {/* Content */}
      <article
        className="prose prose-sm md:prose-base"
        style={{ color: "var(--text-primary)" }}
      >
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      {/* Related Writing */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Related Writing
          </h2>
          <div className="flex flex-col gap-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="text-sm font-medium hover:underline underline-offset-4"
                style={{ color: "var(--accent)" }}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer nav */}
      <div
        className="mt-16 pt-8 border-t flex justify-between items-center"
        style={{ borderColor: "var(--border)" }}
      >
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          style={{ color: "var(--accent)" }}
        >
          <LuArrowLeft size={14} />
          Back to Writing
        </Link>
      </div>
      </div>
      
      <TableOfContents />
      </div>
    </div>
  );
}
