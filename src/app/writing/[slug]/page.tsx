/* eslint-disable @typescript-eslint/no-explicit-any */
import { LuArrowLeft, LuClock, LuCalendar } from "react-icons/lu";
import Link from "next/link";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodeBlock from "@/components/CodeBlock";
import Image from "next/image";
import { Tag } from "@/components/Tag";

import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/mdx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getContentBySlug("writing", resolvedParams.slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.frontmatter.title as string,
    description: post.frontmatter.description as string,
  };
}

export const components = {
  h2: (props: any) => (
    <h2
      style={{
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontSize: "1.5rem",
        fontWeight: 700,
        margin: "2.5rem 0 1rem",
        color: "var(--text-primary)",
      }}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      style={{
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontSize: "1.2rem",
        fontWeight: 600,
        margin: "2rem 0 0.75rem",
        color: "var(--text-primary)",
      }}
      {...props}
    />
  ),
  strong: (props: any) => (
    <strong
      style={{ color: "var(--text-primary)", fontWeight: 600 }}
      {...props}
    />
  ),
  code: (props: any) => {
    return (
      <code
        style={{
          background: "var(--tag-bg)",
          border: "1px solid var(--tag-border)",
          borderRadius: "4px",
          padding: "0.15em 0.4em",
          color: "var(--accent)",
          fontSize: "0.85em",
        }}
        {...props}
      />
    );
  },
  li: (props: any) => (
    <li
      style={{ margin: "0.4rem 0", color: "var(--text-secondary)" }}
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      style={{ paddingLeft: "1.25rem", margin: "1rem 0", listStyle: "disc" }}
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      style={{ margin: "1rem 0", color: "var(--text-secondary)" }}
      {...props}
    />
  ),
  pre: (props: any) => {
    const child = props.children;
    if (child && child.props) {
      const className = child.props.className || "";
      const langMatch = className.match(/language-(.*)/);
      const lang = langMatch ? langMatch[1] : "text";

      const codeString =
        typeof child.props.children === "string"
          ? child.props.children
          : Array.isArray(child.props.children)
            ? child.props.children.join("")
            : child.props.children || "";

      return <CodeBlock code={String(codeString).trim()} lang={lang} />;
    }
    return <pre {...props} />;
  },
  img: (props: any) => (
    <Image
      src={props.src}
      alt={props.alt || ""}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      className="rounded-lg border border-[var(--border)] my-6"
    />
  ),
};

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

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
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

      {/* Content */}
      <div
        className="prose prose-sm md:prose-base"
        style={{ color: "var(--text-primary)" }}
      >
        <MDXRemote source={post.content} components={components} />
      </div>

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
  );
}
