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
    name: (t.frontmatter.name as string) || (t.frontmatter.title as string) || "",
    description: (t.frontmatter.description as string) || "",
    category: (t.frontmatter.category as string) || "Development",
    link: (t.frontmatter.link as string) || "",
  }));

  return <ToolsClient tools={allTools} />;
}
