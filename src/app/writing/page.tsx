import type { Metadata } from "next";
import WritingClient from "./WritingClient";
import { getAllContent } from "@/lib/mdx";

export const metadata: Metadata = {
  title:       "Writing",
  description: "Technical deep-dives, tutorials, and perspectives on software engineering, tooling, and building products.",
};

export default function WritingPage() {
  const posts = getAllContent("writing").map((post) => ({
    slug: post.slug,
    title: (post.frontmatter.title as string) || "",
    excerpt: (post.frontmatter.description as string) || "",
    date: (post.frontmatter.date as string) || "",
    readTime: (post.frontmatter.readTime as string) || "",
    tags: (post.frontmatter.tags as string[]) || [],
    featured: (post.frontmatter.featured as boolean) || false,
  }));
  
  return <WritingClient posts={posts} />;
}
