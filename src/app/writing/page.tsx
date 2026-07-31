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
    title: post.frontmatter.title || "",
    excerpt: post.frontmatter.description || "",
    date: post.frontmatter.date || "",
    readTime: post.frontmatter.readTime || "",
    tags: post.frontmatter.tags || [],
    featured: post.frontmatter.featured || false,
  }));
  
  return <WritingClient posts={posts} />;
}
