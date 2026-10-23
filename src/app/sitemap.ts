import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getWritingProjections, getSnippetProjections } from "@/lib/content-projections";
import { getAllKnowledgeBases } from "@/lib/mdx";
import { snippetCategories } from "@/lib/constants";

const base = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/snippets`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/notes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const writingRoutes: MetadataRoute.Sitemap = getWritingProjections().map((post) => ({
    url: `${base}/writing/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const snippets = getSnippetProjections();
  const snippetCategoryRoutes: MetadataRoute.Sitemap = snippetCategories.map((cat) => ({
    url: `${base}/snippets/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const snippetDetailRoutes: MetadataRoute.Sitemap = snippets.map((s) => ({
    url: `${base}/snippets/${s.category}/${s.slug}`,
    lastModified: s.date ? new Date(s.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const kbs = getAllKnowledgeBases();
  const noteTopicRoutes: MetadataRoute.Sitemap = kbs.map((kb) => ({
    url: `${base}/notes/${kb.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const noteDetailRoutes: MetadataRoute.Sitemap = kbs.flatMap((kb) =>
    kb.topics.flatMap((topic) =>
      topic.notes.map((note) => ({
        url: `${base}/notes/${kb.slug}/${note.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ),
  );

  return [
    ...staticRoutes,
    ...writingRoutes,
    ...snippetCategoryRoutes,
    ...snippetDetailRoutes,
    ...noteTopicRoutes,
    ...noteDetailRoutes,
  ];
}
