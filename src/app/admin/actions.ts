"use server";

import { createClient } from "@/lib/supabase/server";
import { Octokit } from "octokit";

export async function submitContentToGitHub({
  title,
  slug,
  category,
  markdown,
  images,
}: {
  title: string;
  slug: string;
  category: "writing" | "snippets" | "tools";
  markdown: string;
  images: { filename: string; base64Data: string }[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to perform this action.");
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is not set in environment variables. Please add it to your .env.local file.");
  }

  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  // 1. Get default branch SHA
  const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
  const defaultBranch = repoData.default_branch;
  const { data: refData } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
  });
  const baseSha = refData.object.sha;

  // 2. Create new branch
  const branchName = `content/${category}-${slug}-${Date.now()}`;
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  // 3. Create blobs and tree
  const tree: any[] = [];

  // Add the markdown file
  let path = "";
  if (category === "writing") {
    // Frontmatter
    const frontmatter = `---
title: "${title}"
date: "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}"
readTime: "5 min read"
tags: []
---

`;
    path = `content/writing/${slug}.mdx`;
    const fullContent = frontmatter + markdown;
    tree.push({
      path,
      mode: "100644",
      type: "blob",
      content: fullContent,
    });
  } else if (category === "snippets" || category === "tools") {
    path = `content/${category}/${slug}.mdx`;
    tree.push({
      path,
      mode: "100644",
      type: "blob",
      content: markdown,
    });
  }

  // Add images to tree
  for (const img of images) {
    const { data: blobData } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: img.base64Data, // base64 string
      encoding: "base64",
    });
    tree.push({
      path: `public/assets/${img.filename}`,
      mode: "100644",
      type: "blob",
      sha: blobData.sha,
    });
  }

  // 4. Create Tree
  const { data: treeData } = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: baseSha,
    tree,
  });

  // 5. Create Commit
  const { data: commitData } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: `Add new ${category}: ${title}`,
    tree: treeData.sha,
    parents: [baseSha],
  });

  // 6. Update Ref
  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
    sha: commitData.sha,
  });

  // 7. Create Pull Request
  const { data: prData } = await octokit.rest.pulls.create({
    owner,
    repo,
    title: `Add ${category}: ${title}`,
    head: branchName,
    base: defaultBranch,
    body: `This PR adds a new ${category} created from the admin panel.`,
  });

  return { prUrl: prData.html_url };
}
