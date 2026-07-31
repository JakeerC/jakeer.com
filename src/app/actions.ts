"use server";

import { getAllContent } from "@/lib/mdx";

export async function getSearchData() {
  const posts = getAllContent("writing").map(p => ({
    slug: p.slug,
    title: p.frontmatter.title || "",
    excerpt: p.frontmatter.description || ""
  }));

  const snippets = getAllContent("snippets").map(s => ({
    slug: s.slug,
    title: s.frontmatter.title || "",
    description: s.frontmatter.description || "",
    category: (s.frontmatter.tags && s.frontmatter.tags[0]) ? s.frontmatter.tags[0] : "general"
  }));

  const tools = getAllContent("tools").map(t => ({
    slug: t.slug,
    name: t.frontmatter.name || t.frontmatter.title || "",
    description: t.frontmatter.description || "",
    link: t.frontmatter.link || ""
  }));

  return { posts, snippets, tools };
}
