"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { saveDraftAction, createPRForContent, mergePRAction } from "../actions";
import { FieldControl } from "../../../components/FieldControl";
import { Button } from "../../../components/Button";
import { useRouter } from "next/navigation";
import { AssetManager } from "./AssetManager";

const Editor = dynamic(() => import("./EditorWrapper"), { ssr: false });

import {
  ADMIN_TAG_OPTIONS as TAG_OPTIONS,
  ADMIN_CATEGORY_OPTIONS as CATEGORY_OPTIONS,
  ADMIN_LANG_OPTIONS as LANG_OPTIONS,
  ADMIN_LEVEL_OPTIONS as LEVEL_OPTIONS,
} from "../../../lib/constants";

export function AdminClient({ initialData }: { initialData?: any }) {
  const router = useRouter();
  
  const [id, setId] = useState<string | undefined>(initialData?.id);
  const [branchName, setBranchName] = useState<string | null>(initialData?.branch_name || null);
  const [prNumber, setPrNumber] = useState<number | null>(initialData?.pr_number || null);
  const [prUrl, setPrUrl] = useState("");

  const [category, setCategory] = useState<"writing" | "snippets" | "tools">(
    initialData?.category || "writing",
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  
  // Metadata
  const m = initialData?.metadata || {};
  const [selectedTags, setSelectedTags] = useState<string[]>(
    m.tags ? m.tags.split(",").map((t: string) => t.trim()) : []
  );
  const [readTime, setReadTime] = useState(m.readTime ? parseInt(m.readTime) : 5);
  const [lang, setLang] = useState(m.lang || "");
  const [level, setLevel] = useState(m.level || "BEGINNER");
  const [toolCategory, setToolCategory] = useState(m.toolCategory || "Development");
  const [link, setLink] = useState(m.link || "");
  const [markdown, setMarkdown] = useState(initialData?.markdown || "");
  const [images, setImages] = useState<{ filename: string; base64Data: string }[]>(m.images || []);

  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);

  const handleImageUpload = async (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(",")[1];
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
        setImages((prev) => [...prev, { filename, base64Data }]);
        resolve(`/assets/${filename}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  };

  const getPayload = () => ({
    id,
    title,
    slug,
    category,
    markdown,
    description,
    branchName,
    metadata: {
      tags: selectedTags.join(","),
      readTime: `${readTime} min read`,
      lang,
      level,
      toolCategory,
      link,
      images
    }
  });

  const handleSave = async () => {
    if (!title || !slug || !markdown) {
      alert("Please fill in title, slug, and content.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await saveDraftAction(getPayload());
      setId(res.id);
      setBranchName(res.branchName);
      alert("Saved successfully! Draft pushed to Github branch.");
    } catch (e: any) {
      alert("Error saving: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePR = async () => {
    if (!id || !branchName) return;
    setIsCreatingPR(true);
    try {
      const res = await createPRForContent(id, branchName, title, category);
      setPrNumber(res.prNumber);
      setPrUrl(res.prUrl);
      alert("Pull Request created successfully!");
    } catch (e: any) {
      alert("Error creating PR: " + e.message);
    } finally {
      setIsCreatingPR(false);
    }
  };

  const handlePublish = async () => {
    if (!id || !prNumber) return;
    setIsPublishing(true);
    try {
      await mergePRAction(id, prNumber);
      alert("Published successfully!");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      alert("Error publishing: " + e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className={`mx-auto px-6 py-16 transition-all duration-300 ${isFullWidth ? "max-w-full" : "max-w-4xl"}`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}>
          {initialData ? "Edit Draft" : "New Content"}
        </h1>
        <Button onClick={() => setIsFullWidth(!isFullWidth)} variant="outline">
          {isFullWidth ? "Collapse Width" : "Full Width"}
        </Button>
      </div>

      <div className="space-y-6">
        {prUrl && (
          <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md">
            Success! View your PR here:{" "}
            <a href={prUrl} target="_blank" rel="noreferrer" className="underline font-medium">{prUrl}</a>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FieldControl label="Category" type="select" value={category} onChange={(val) => setCategory(val)} options={CATEGORY_OPTIONS} />
          <FieldControl
            label="Title"
            type="text"
            value={title}
            placeholder="E.g. My New Post"
            onChange={(val) => {
              setTitle(val);
              if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")) {
                setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
              }
            }}
          />
          <FieldControl label="Slug" type="text" value={slug} placeholder="my-new-post" onChange={setSlug} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(category === "writing" || category === "snippets" || category === "tools") && (
            <div className="col-span-2">
              <FieldControl label="Description" type="text" value={description} placeholder="Short excerpt or description" onChange={setDescription} />
            </div>
          )}

          {(category === "writing" || category === "snippets") && (
            <div className="col-span-2">
              <FieldControl label="Tags" type="tags" value={selectedTags} onChange={setSelectedTags} options={TAG_OPTIONS} placeholder="Select or create tags..." />
            </div>
          )}

          {category === "writing" && (
            <FieldControl label="Read Time" type="range" value={readTime} onChange={setReadTime} min={0} max={30} description="min read" />
          )}

          {category === "snippets" && (
            <>
              <FieldControl label="Language" type="select" value={lang} onChange={setLang} options={LANG_OPTIONS} />
              <FieldControl label="Level" type="select" value={level} onChange={setLevel} options={LEVEL_OPTIONS} />
            </>
          )}

          {category === "tools" && (
            <>
              <FieldControl label="Tool Category" type="text" value={toolCategory} onChange={setToolCategory} placeholder="Development, Security, etc." />
              <FieldControl label="External Link" type="url" value={link} onChange={setLink} placeholder="https://..." />
            </>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Content (Markdown)</label>
            <Button size="sm" variant="outline" onClick={() => setIsAssetDrawerOpen(true)}>
              Upload Asset
            </Button>
          </div>
          <Editor markdown={markdown} onChange={setMarkdown} imageUploadHandler={handleImageUpload} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-8" style={{ borderColor: "var(--border)" }}>
          <Button
            onClick={handleSave}
            disabled={isSaving || isPublishing || !!prNumber}
            variant="outline"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button
            onClick={handleCreatePR}
            disabled={!branchName || !!prNumber || isCreatingPR || isPublishing || isSaving}
            variant="outline"
          >
            {isCreatingPR ? "Creating PR..." : "Create PR"}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={!prNumber || isPublishing || isSaving}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {isAssetDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
          <div className="w-[500px] h-full bg-[var(--bg-primary)] p-6 shadow-xl border-l border-[var(--border)] animate-in slide-in-from-right flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Asset Manager</h2>
              <button type="button" onClick={() => setIsAssetDrawerOpen(false)} className="text-xl font-bold p-2 hover:bg-black/5 rounded text-[var(--text-primary)]">&times;</button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AssetManager onSelect={(url) => {
                navigator.clipboard.writeText(`![Image](${url})`);
                alert("Image URL copied to clipboard! You can paste it in the editor.");
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
