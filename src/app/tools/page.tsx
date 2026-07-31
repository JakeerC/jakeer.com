import type { Metadata } from "next";
import ToolsClient from "./ToolsClient";
import { getAllContent } from "@/lib/mdx";

export const metadata: Metadata = {
  title:       "Tools",
  description: "A curated collection of utilities for developers and engineers.",
};

export default function ToolsPage() {
  const allTools = getAllContent("tools").map(t => ({
    slug: t.slug,
    name: t.frontmatter.name || t.frontmatter.title || "",
    description: t.frontmatter.description || "",
    category: t.frontmatter.category || "Development",
    link: t.frontmatter.link || "",
  }));

  return <ToolsClient tools={allTools} />;
}
