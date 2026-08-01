/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { getContentBySlug } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodeBlock from "@/components/CodeBlock";
import { Tag } from "@/components/Tag";
import Image from "next/image";

const components = {
  pre: (props: any) => {
    // If MDX parses a code block, it usually passes it as <pre><code className="language-xyz">...</code></pre>
    // We can just use our CodeBlock component.
    const codeNode = props.children;
    const codeStr = codeNode?.props?.children || "";
    const className = codeNode?.props?.className || "";
    const lang = className.replace("language-", "") || "typescript";

    return <CodeBlock code={codeStr.trim()} lang={lang} />;
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
export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;

  const post = getContentBySlug("snippets", slug);
  if (!post) return notFound();

  // Optional: check if the tags actually match the category route
  if (!post.frontmatter.tags?.includes(category)) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        href={`/snippets/${category}`}
        className="inline-flex items-center gap-2 text-sm mb-10 hover:underline underline-offset-4"
        style={{ color: "var(--text-muted)" }}
      >
        <LuArrowLeft size={14} />
        {category.charAt(0).toUpperCase() + category.slice(1)} Snippets
      </Link>

      <section className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.frontmatter.tags?.map((tag: string) => (
              <Tag key={tag} size="sm">
                {tag}
              </Tag>
            ))}
          </div>
          <h1
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {post.frontmatter.title}
          </h1>
        </div>

        <div
          className="mt-4 prose prose-sm md:prose-base max-w-none"
          style={{ color: "var(--text-primary)" }}
        >
          <MDXRemote source={post.content} components={components} />
        </div>
      </section>
    </div>
  );
}
