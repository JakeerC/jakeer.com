"use server";

import { createClient } from "@/lib/supabase/server";
import { Octokit } from "octokit";
import { getGitHubToken, optionalEnv } from "@/lib/env";
import { escapeYamlString } from "@/lib/sanitize";

type DraftMetadata = {
  tags?: string;
  readTime?: string;
  lang?: string;
  level?: string;
  toolCategory?: string;
  link?: string;
  noteTopic?: string;
  noteSubtopic?: string;
  noteOrder?: number;
  images?: { filename: string; base64Data: string }[];
};

export async function getDrafts(archived: boolean = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const query = supabase
    .from("content_drafts")
    .select("id, title, description, category, pr_number, status, updated_at, is_archived")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (archived) {
    query.eq("is_archived", true);
  } else {
    query.or("is_archived.is.null,is_archived.eq.false");
  }

  const { data, error } = await query;

  if (error) {
    if (error.code === "42P01") {
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
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "42P01") {
      console.warn("Table 'content_drafts' does not exist yet. Please run the SQL migration.");
      return null;
    }
    if (error.code === "22P02" || error.code === "PGRST116") {
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
  category: "writing" | "snippets" | "tools" | "notes";
  markdown: string;
  description?: string;
  metadata: DraftMetadata;
  branchName?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const githubToken = getGitHubToken();
  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  let draftId = payload.id;

  // Insert draft initially if new to acquire an ID for deterministic branch naming
  if (!draftId) {
    const { data: inserted, error: insertError } = await supabase
      .from("content_drafts")
      .insert({
        user_id: user.id,
        category: payload.category,
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        markdown: payload.markdown,
        metadata: payload.metadata,
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    draftId = inserted.id;
  }

  // Deterministic branch naming tied to draft ID (Slice 4A)
  const branchName =
    payload.branchName || `content/${payload.category}-${payload.slug}-${draftId}`;

  try {
    // 1. Get branch info / ensure branch exists
    let baseSha = "";
    try {
      const { data: refData } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
      });
      baseSha = refData.object.sha;
    } catch {
      // Branch does not exist yet -> create from default branch
      const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;
      const { data: defaultRef } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`,
      });
      baseSha = defaultRef.object.sha;
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: baseSha,
      });
    }

    // 2. Build tree with sanitized frontmatter values (Slice 4E)
    const tree: Record<string, unknown>[] = [];
    let path = "";
    let frontmatter = "";
    const m = payload.metadata;

    const tagsFormatted = (m.tags || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean)
      .map(escapeYamlString)
      .join(", ");

    if (payload.category === "writing") {
      frontmatter = `---
title: ${escapeYamlString(payload.title)}
date: ${escapeYamlString(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      )}
readTime: ${escapeYamlString(m.readTime || "5 min read")}
tags: [${tagsFormatted}]
description: ${escapeYamlString(payload.description || "")}
---

`;
      path = `content/writing/${payload.slug}.mdx`;
    } else if (payload.category === "snippets") {
      frontmatter = `---
title: ${escapeYamlString(payload.title)}
date: ${escapeYamlString(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      )}
description: ${escapeYamlString(payload.description || "")}
lang: ${escapeYamlString(m.lang || "typescript")}
level: ${escapeYamlString(m.level || "BEGINNER")}
tags: [${tagsFormatted}]
---

`;
      path = `content/snippets/${payload.slug}.mdx`;
    } else if (payload.category === "tools") {
      frontmatter = `---
name: ${escapeYamlString(payload.title)}
description: ${escapeYamlString(payload.description || "")}
category: ${escapeYamlString(m.toolCategory || "Development")}
link: ${escapeYamlString(m.link || "")}
icon: "LuCode"
---

`;
      path = `content/tools/${payload.slug}.mdx`;
    } else if (payload.category === "notes") {
      const topic = m.noteTopic || "uncategorized";
      frontmatter = `---
title: ${escapeYamlString(payload.title)}
description: ${escapeYamlString(payload.description || "")}
readTime: ${escapeYamlString(m.readTime || "5 min read")}
topic: ${escapeYamlString(topic)}
subtopic: ${escapeYamlString(m.noteSubtopic || "")}
order: ${Number(m.noteOrder) || 1}
tags: [${tagsFormatted}]
---

`;
      path = `content/notes/${topic}/${payload.slug}.mdx`;
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
    // force: true is intentional — draft branches are single-author throwaway branches.
    // The admin is the only committer; rebasing onto the latest default branch
    // happens when the PR is created, not on every save.
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
      sha: commitData.sha,
      force: true,
    });

    // 5. Update draft in Supabase (Slice 4B status + Slice 4F owner scoped)
    const { error: updateError } = await supabase
      .from("content_drafts")
      .update({
        category: payload.category,
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        markdown: payload.markdown,
        metadata: payload.metadata,
        branch_name: branchName,
        status: "branch_created",
        updated_at: new Date().toISOString(),
      })
      .eq("id", draftId)
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    return { id: draftId, branchName };
  } catch (err) {
    console.error(`[saveDraftAction] Error saving draft ${draftId}:`, err);
    await supabase
      .from("content_drafts")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", draftId)
      .eq("user_id", user.id);
    throw err;
  }
}

export async function createPRForContent(
  id: string,
  branchName: string,
  title: string,
  category: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const githubToken = getGitHubToken();
  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  // Check for existing open PR on this branch (Slice 4C idempotency)
  const { data: existingPRs } = await octokit.rest.pulls.list({
    owner,
    repo,
    head: `${owner}:${branchName}`,
    state: "open",
  });

  let prNumber: number;
  let prUrl: string;

  if (existingPRs && existingPRs.length > 0) {
    const existing = existingPRs[0];
    await octokit.rest.pulls.update({
      owner,
      repo,
      pull_number: existing.number,
      title: `Add ${category}: ${title}`,
    });
    prNumber = existing.number;
    prUrl = existing.html_url;
  } else {
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const { data: prData } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: `Add ${category}: ${title}`,
      head: branchName,
      base: repoData.default_branch,
      body: `This PR was automatically created from the admin dashboard.`,
    });
    prNumber = prData.number;
    prUrl = prData.html_url;
  }

  // Update Supabase with owner-scoped mutation (Slice 4F) and state transition (Slice 4B)
  await supabase
    .from("content_drafts")
    .update({
      pr_number: prNumber,
      status: "pr_open",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  return { prNumber, prUrl };
}

export async function mergePRAction(id: string, prNumber: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const githubToken = getGitHubToken();
  const octokit = new Octokit({ auth: githubToken });
  const owner = "JakeerC";
  const repo = "jakeer.com";

  await octokit.rest.pulls.merge({
    owner,
    repo,
    pull_number: prNumber,
    merge_method: "squash",
  });

  // Verify PR is actually merged before archiving (Slice 4D)
  const { data: prAfterMerge } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  if (!prAfterMerge.merged) {
    await supabase
      .from("content_drafts")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    throw new Error("PR merge was not confirmed. Draft marked as failed for retry.");
  }

  // Once merge confirmed, archive draft and set status merged
  await supabase
    .from("content_drafts")
    .update({
      status: "merged",
      is_archived: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

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
    .eq("user_id", user.id)
    .single();

  if (draft?.pr_number) {
    const githubToken = optionalEnv("GITHUB_TOKEN");
    if (githubToken) {
      try {
        const octokit = new Octokit({ auth: githubToken });
        await octokit.rest.pulls.update({
          owner: "JakeerC",
          repo: "jakeer.com",
          pull_number: draft.pr_number,
          state: "closed",
        });
      } catch (e) {
        console.error(`Failed to close PR ${draft.pr_number} on GitHub`, e);
      }
    }
  }

  const { error } = await supabase
    .from("content_drafts")
    .update({
      status: "archived",
      is_archived: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
  return { success: true };
}

export async function unarchiveDraftAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("content_drafts")
    .update({
      status: "draft",
      is_archived: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);
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
    .eq("user_id", user.id)
    .single();

  if (draft?.branch_name) {
    const githubToken = optionalEnv("GITHUB_TOKEN");
    if (githubToken) {
      try {
        const octokit = new Octokit({ auth: githubToken });
        await octokit.rest.git.deleteRef({
          owner: "JakeerC",
          repo: "jakeer.com",
          ref: `heads/${draft.branch_name}`,
        });
      } catch (e) {
        console.error(`Failed to delete branch ${draft.branch_name} on GitHub`, e);
      }
    }
  }

  const { error } = await supabase
    .from("content_drafts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
  return { success: true };
}

export async function syncDraftsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const githubToken = getGitHubToken();
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
        pull_number: draft.pr_number,
      });

      if (prData.merged) {
        await supabase
          .from("content_drafts")
          .update({
            status: "merged",
            is_archived: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", draft.id)
          .eq("user_id", user.id);
      } else if (prData.state === "closed") {
        await supabase
          .from("content_drafts")
          .update({
            is_archived: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", draft.id)
          .eq("user_id", user.id);
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
    search: fileName,
  });
  if (error) {
    if (error.message.includes("does not exist") || error.name === "BucketNotFound") {
      return false;
    }
    throw error;
  }

  return data.some((file) => file.name === fileName);
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
    upsert: overwrite,
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
      return [];
    }
    throw error;
  }

  const files = data.filter((item) => item.id != null);

  const filesWithUrls = files.map((file) => {
    const { data: publicUrlData } = supabase.storage.from("assets").getPublicUrl(file.name);
    return {
      name: file.name,
      id: file.id,
      updated_at: file.updated_at,
      created_at: file.created_at,
      metadata: file.metadata,
      url: publicUrlData.publicUrl,
    };
  });

  filesWithUrls.sort((a, b) => {
    const timeA = new Date(a.updated_at || 0).getTime();
    const timeB = new Date(b.updated_at || 0).getTime();
    return timeB - timeA;
  });

  return filesWithUrls;
}
