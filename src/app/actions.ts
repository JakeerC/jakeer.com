"use server";

import { getAllContent } from "@/lib/mdx";

export async function getSearchData() {
  const posts = getAllContent("writing").map(p => ({
    slug: p.slug,
    title: p.frontmatter.title || "",
    excerpt: p.frontmatter.description || ""
  }));

  const snippets = getAllContent("snippets").map(s => {
    const tags = s.frontmatter.tags as string[] | undefined;
    return {
      slug: s.slug,
      title: s.frontmatter.title as string || "",
      description: s.frontmatter.description as string || "",
      category: (tags && tags.length > 0) ? tags[0] : "general"
    };
  });

  const tools = getAllContent("tools").map(t => ({
    slug: t.slug,
    name: t.frontmatter.name || t.frontmatter.title || "",
    description: t.frontmatter.description || "",
    link: t.frontmatter.link || ""
  }));

  return { posts, snippets, tools };
}
