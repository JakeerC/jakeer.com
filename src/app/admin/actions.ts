"use server";

import { createClient } from "@/lib/supabase/server";
import { Octokit } from "octokit";

type DraftMetadata = {
  tags?: string;
  readTime?: string;
  lang?: string;
  level?: string;
  toolCategory?: string;
  link?: string;
  images?: { filename: string; base64Data: string }[];
};

export async function getDrafts(archived: boolean = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const query = supabase
    .from("content_drafts")
    .select("id, title, description, category, pr_number, updated_at, is_archived")
    .order("updated_at", { ascending: false });

  if (archived) {
    query.eq("is_archived", true);
  } else {
    query.or("is_archived.is.null,is_archived.eq.false");
  }

  const { data, error } = await query;

  if (error) {
    if (error.code === '42P01') {
       
      console.warn("Table 'content_drafts' does not exist yet. Please run the SQL migration.");
      return [];
    }
     
    console.error("Supabase error:", error);
    throw error;
  }
  return data;
}

export async function getDraftById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("content_drafts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === '42P01') {
       
      console.warn("Table 'content_drafts' does not exist yet. Please run the SQL migration.");
      return null;
    }
    if (error.code === '22P02' || error.code === 'PGRST116') {
      // 22P02: Invalid input syntax for type uuid (e.g., if ID was 'new' or mangled)
      // PGRST116: JSON object requested, multiple (or no) rows returned
       
      console.warn(`Draft not found or invalid ID: ${id}`);
      return null;
    }
     
    console.error("Supabase error in getDraftById:", JSON.stringify(error, null, 2), error);
    throw error;
  }
  return data;
}

export async function saveDraftAction(payload: {
  id?: string;
  title: string;
  slug: string;
  category: "writing" | "snippets" | "tools";
  markdown: string;
  description?: string;
  metadata: DraftMetadata;
  branchName?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) throw new Error("GITHUB_TOKEN missing in .env.local");

  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  let branchName = payload.branchName;
  let baseSha = "";

  // 1. Get branch info
  if (!branchName) {
    // Create new branch
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    baseSha = refData.object.sha;
    branchName = `content/${payload.category}-${payload.slug}-${Date.now()}`;
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });
  } else {
    // Existing branch
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });
    baseSha = refData.object.sha;
  }

  // 2. Build tree
  const tree: Record<string, unknown>[] = [];
  let path = "";
  let frontmatter = "";
  
  const m = payload.metadata;
  if (payload.category === "writing") {
    frontmatter = `---
title: "${payload.title}"
date: "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}"
readTime: "${m.readTime || "5 min read"}"
tags: [${(m.tags || "").split(",").map((t: string) => `"${t.trim()}"`).filter((t: string) => t !== '""').join(", ")}]
description: "${payload.description || ""}"
---

`;
    path = `content/writing/${payload.slug}.mdx`;
  } else if (payload.category === "snippets") {
    frontmatter = `---
title: "${payload.title}"
date: "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}"
description: "${payload.description || ""}"
lang: "${m.lang || "typescript"}"
level: "${m.level || "BEGINNER"}"
tags: [${(m.tags || "").split(",").map((t: string) => `"${t.trim()}"`).filter((t: string) => t !== '""').join(", ")}]
---

`;
    path = `content/snippets/${payload.slug}.mdx`;
  } else if (payload.category === "tools") {
    frontmatter = `---
name: "${payload.title}"
description: "${payload.description || ""}"
category: "${m.toolCategory || "Development"}"
link: "${m.link || ""}"
icon: "LuCode"
---

`;
    path = `content/tools/${payload.slug}.mdx`;
  }
  
  const fullContent = frontmatter + payload.markdown;
  tree.push({
    path,
    mode: "100644",
    type: "blob",
    content: fullContent,
  });

  // Images
  if (m.images) {
    for (const img of m.images) {
      const { data: blobData } = await octokit.rest.git.createBlob({
        owner,
        repo,
        content: img.base64Data,
        encoding: "base64",
      });
      tree.push({
        path: `public/assets/${img.filename}`,
        mode: "100644",
        type: "blob",
        sha: blobData.sha,
      });
    }
  }

  // 3. Create Tree & Commit
  const { data: treeData } = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: baseSha,
    tree,
  });

  const { data: commitData } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: `Save ${payload.category}: ${payload.title}`,
    tree: treeData.sha,
    parents: [baseSha],
  });

  // 4. Update Ref
  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
    sha: commitData.sha,
    force: true,
  });

  // 5. Save to Supabase
  const dbPayload = {
    user_id: user.id,
    category: payload.category,
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    markdown: payload.markdown,
    metadata: payload.metadata,
    branch_name: branchName,
    updated_at: new Date().toISOString()
  };

  let savedId = payload.id;
  if (payload.id) {
    const { error } = await supabase
      .from("content_drafts")
      .update(dbPayload)
      .eq("id", payload.id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("content_drafts")
      .insert(dbPayload)
      .select("id")
      .single();
    if (error) throw error;
    savedId = data.id;
  }

  return { id: savedId, branchName };
}

export async function createPRForContent(id: string, branchName: string, title: string, category: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) throw new Error("GITHUB_TOKEN missing in .env.local");

  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
  
  const { data: prData } = await octokit.rest.pulls.create({
    owner,
    repo,
    title: `Add ${category}: ${title}`,
    head: branchName,
    base: repoData.default_branch,
    body: `This PR was automatically created from the admin dashboard.`,
  });

  // Update Supabase
  await supabase
    .from("content_drafts")
    .update({ pr_number: prData.number, updated_at: new Date().toISOString() })
    .eq("id", id);

  return { prNumber: prData.number, prUrl: prData.html_url };
}

export async function mergePRAction(id: string, prNumber: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) throw new Error("GITHUB_TOKEN missing in .env.local");

  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  await octokit.rest.pulls.merge({
    owner,
    repo,
    pull_number: prNumber,
    merge_method: "squash"
  });

  // Once merged, archive the draft
  await supabase
    .from("content_drafts")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", id);

  return { success: true };
}

export async function archiveDraftAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: draft } = await supabase
    .from("content_drafts")
    .select("pr_number")
    .eq("id", id)
    .single();

  if (draft?.pr_number) {
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      try {
        const octokit = new Octokit({ auth: githubToken });
        await octokit.rest.pulls.update({
          owner: "JakeerC",
          repo: "jakeer.com",
          pull_number: draft.pr_number,
          state: "closed"
        });
      } catch (e) {
        console.error(`Failed to close PR ${draft.pr_number} on GitHub`, e);
      }
    }
  }
  
  const { error } = await supabase
    .from("content_drafts")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function unarchiveDraftAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { error } = await supabase
    .from("content_drafts")
    .update({ is_archived: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function deleteDraftAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: draft } = await supabase
    .from("content_drafts")
    .select("branch_name")
    .eq("id", id)
    .single();

  if (draft?.branch_name) {
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      try {
        const octokit = new Octokit({ auth: githubToken });
        await octokit.rest.git.deleteRef({
          owner: "JakeerC",
          repo: "jakeer.com",
          ref: `heads/${draft.branch_name}`
        });
      } catch (e) {
        console.error(`Failed to delete branch ${draft.branch_name} on GitHub`, e);
      }
    }
  }
  
  const { error } = await supabase
    .from("content_drafts")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function syncDraftsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) throw new Error("GITHUB_TOKEN missing");
  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  const { data, error } = await supabase
    .from("content_drafts")
    .select("id, pr_number")
    .or("is_archived.is.null,is_archived.eq.false")
    .not("pr_number", "is", null);
    
  if (error) throw error;

  for (const draft of data) {
    if (!draft.pr_number) continue;
    try {
      const { data: prData } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: draft.pr_number
      });
      
      if (prData.state === "closed" || prData.merged) {
        await supabase
          .from("content_drafts")
          .update({ is_archived: true, updated_at: new Date().toISOString() })
          .eq("id", draft.id);
      }
    } catch (e) {
      console.error(`Failed to sync PR ${draft.pr_number}`, e);
    }
  }
  return { success: true };
}

export async function checkAssetExistsAction(fileName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data, error } = await supabase.storage.from("assets").list("", {
    search: fileName
  });
  if (error) {
    if (error.message.includes("does not exist") || error.name === "BucketNotFound") {
      return false; // Bucket might not exist, but let's assume it doesn't exist
    }
    throw error;
  }
  
  return data.some(file => file.name === fileName);
}

export async function uploadAssetAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  const fileName = formData.get("fileName") as string;
  const overwrite = formData.get("overwrite") === "true";

  if (!file || !fileName) {
    throw new Error("File and fileName are required");
  }
  
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const { data, error } = await supabase.storage.from("assets").upload(fileName, file, {
    upsert: overwrite
  });

  if (error) {
    throw error;
  }
  
  const { data: publicUrlData } = supabase.storage.from("assets").getPublicUrl(fileName);
  return { success: true, url: publicUrlData.publicUrl, path: data.path };
}

export async function getAssetsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase.storage.from("assets").list();
  
  if (error) {
    if (error.message.includes("does not exist") || error.name === "BucketNotFound") {
      return []; // Return empty if bucket not found yet
    }
    throw error;
  }

  // We only want files, not empty folders (sometimes represented as empty objects)
  const files = data.filter(item => item.id != null);
  
  // Get public URLs for each file
  const filesWithUrls = files.map(file => {
    const { data: publicUrlData } = supabase.storage.from("assets").getPublicUrl(file.name);
    return {
      name: file.name,
      id: file.id,
      updated_at: file.updated_at,
      created_at: file.created_at,
      metadata: file.metadata,
      url: publicUrlData.publicUrl
    };
  });

  // Sort by latest updated
  filesWithUrls.sort((a, b) => {
    const timeA = new Date(a.updated_at || 0).getTime();
    const timeB = new Date(b.updated_at || 0).getTime();
    return timeB - timeA;
  });

  return filesWithUrls;
}

