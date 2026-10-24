"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  saveDraftAction,
  createPRForContent,
  mergePRAction,
  archiveDraftAction,
  unarchiveDraftAction,
  deleteDraftAction,
} from "../actions";
import { FieldControl } from "../../../components/FieldControl";
import { Button } from "../../../components/Button";
import { useRouter } from "next/navigation";
import { AssetManager } from "./AssetManager";
import { FormattingHelp } from "./FormattingHelp";

const Editor = dynamic(() => import("./EditorWrapper"), { ssr: false });

import {
  ADMIN_TAG_OPTIONS as TAG_OPTIONS,
  ADMIN_CATEGORY_OPTIONS as CATEGORY_OPTIONS,
  ADMIN_LANG_OPTIONS as LANG_OPTIONS,
  ADMIN_LEVEL_OPTIONS as LEVEL_OPTIONS,
  ADMIN_TOOL_CATEGORY_OPTIONS as TOOL_CATEGORY_OPTIONS,
} from "../../../lib/constants";

interface AdminClientProps {
  readonly initialData?: any;
  readonly topicOptions?: readonly { readonly label: string; readonly value: string }[];
  readonly subtopicMap?: Readonly<Record<string, readonly { readonly label: string; readonly value: string }[]>>;
}

export function AdminClient({
  initialData,
  topicOptions = [],
  subtopicMap = {},
}: Readonly<AdminClientProps>) {
  const router = useRouter();

  const [id, setId] = useState<string | undefined>(initialData?.id);
  const [branchName, setBranchName] = useState<string | null>(
    initialData?.branch_name || null,
  );
  const [prNumber, setPrNumber] = useState<number | null>(
    initialData?.pr_number || null,
  );
  const [prUrl, setPrUrl] = useState("");

  const [category, setCategory] = useState<
    "writing" | "snippets" | "tools" | "notes"
  >(initialData?.category || "writing");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  // Metadata
  const m = initialData?.metadata || {};
  const [selectedTags, setSelectedTags] = useState<string[]>(
    m.tags ? m.tags.split(",").map((t: string) => t.trim()) : [],
  );
  const [readTime, setReadTime] = useState(
    m.readTime ? Number.parseInt(m.readTime) : 5,
  );
  const [lang, setLang] = useState(m.lang || "");
  const [level, setLevel] = useState(m.level || "BEGINNER");
  const [toolCategory, setToolCategory] = useState(
    m.toolCategory || "Development",
  );
  const [link, setLink] = useState(m.link || "");
  const [noteTopic, setNoteTopic] = useState(m.noteTopic || "");
  const [noteSubtopic, setNoteSubtopic] = useState(m.noteSubtopic || "");
  const [noteOrder, setNoteOrder] = useState(
    m.noteOrder ? Number.parseInt(m.noteOrder) : 1,
  );
  const [markdown, setMarkdown] = useState(initialData?.markdown || "");
  const [images, setImages] = useState<
    { filename: string; base64Data: string }[]
  >(m.images || []);

  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchived, setIsArchived] = useState(
    initialData?.is_archived || false,
  );
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isDirty, setIsDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasRecovery, setHasRecovery] = useState(false);
  const [recoverySnapshot, setRecoverySnapshot] = useState<any>(null);

  // Check for local recovery snapshot on mount
  useEffect(() => {
    try {
      const recoveryKey = `draft_recovery_${id || "new"}`;
      const saved = localStorage.getItem(recoveryKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.markdown && parsed.markdown !== (initialData?.markdown || "")) {
          setTimeout(() => {
            setRecoverySnapshot(parsed);
            setHasRecovery(true);
          }, 0);
        }
      }
    } catch {
      // localStorage may fail in private browsing
    }
  }, [id, initialData]);

  // Save local recovery snapshot on changes
  useEffect(() => {
    if (!title && !markdown) return;
    setTimeout(() => setIsDirty(true), 0);
    try {
      const recoveryKey = `draft_recovery_${id || "new"}`;
      const snapshot = {
        title,
        slug,
        markdown,
        description,
        category,
        timestamp: Date.now(),
      };
      localStorage.setItem(recoveryKey, JSON.stringify(snapshot));
    } catch {
      // ignore
    }
  }, [id, title, slug, markdown, description, category]);

  // Protect against unsaved navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Close drawers on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isAssetDrawerOpen) setIsAssetDrawerOpen(false);
        if (isHelpDrawerOpen) setIsHelpDrawerOpen(false);
      }
    };
    if (isAssetDrawerOpen || isHelpDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isAssetDrawerOpen, isHelpDrawerOpen]);

  const restoreRecovery = () => {
    if (recoverySnapshot) {
      if (recoverySnapshot.title) setTitle(recoverySnapshot.title);
      if (recoverySnapshot.slug) setSlug(recoverySnapshot.slug);
      if (recoverySnapshot.markdown) setMarkdown(recoverySnapshot.markdown);
      if (recoverySnapshot.description) setDescription(recoverySnapshot.description);
      if (recoverySnapshot.category) setCategory(recoverySnapshot.category);
      setHasRecovery(false);
      setStatusMessage("Restored unsaved local changes.");
    }
  };

  const discardRecovery = () => {
    try {
      localStorage.removeItem(`draft_recovery_${id || "new"}`);
    } catch {
      // ignore
    }
    setHasRecovery(false);
  };

  const handleImageUpload = async (image: File) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    const mime = image.type || (
      image.name.endsWith(".png") ? "image/png" :
      image.name.endsWith(".jpg") || image.name.endsWith(".jpeg") ? "image/jpeg" :
      image.name.endsWith(".gif") ? "image/gif" :
      image.name.endsWith(".webp") ? "image/webp" : ""
    );

    if (!ALLOWED_TYPES.includes(mime)) {
      alert("Unsupported image type. Only PNG, JPEG, GIF, and WebP are allowed.");
      throw new Error("Unsupported image type");
    }

    if (image.size > MAX_SIZE) {
      alert("Image is too large. Maximum size is 5MB.");
      throw new Error("Image too large");
    }

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

  const {
    handleSave,
    handleCreatePR,
    handlePublish,
    handleArchive,
    handleUnarchive,
    handleDelete,
  } = useAdminActions({
    id,
    setId,
    branchName,
    setBranchName,
    prNumber,
    setPrNumber,
    setPrUrl,
    title,
    slug,
    category,
    markdown,
    description,
    selectedTags,
    readTime,
    lang,
    level,
    toolCategory,
    link,
    noteTopic,
    noteSubtopic,
    noteOrder,
    images,
    setIsSaving,
    setIsCreatingPR,
    setIsPublishing,
    setIsArchiving,
    setIsArchived,
    setIsDeleting,
    router,
  });

  const showDescription = ["writing", "snippets", "tools", "notes"].includes(category);
  const showTags = ["writing", "snippets", "notes"].includes(category);
  const showReadTime = ["writing", "notes"].includes(category);
  const showLanguageLevel = category === "snippets";
  const showToolFields = category === "tools";
  const showNotesFields = category === "notes";

  return (
    <div
      className={`mx-auto px-6 py-16 transition-all duration-300 ${isFullWidth ? "max-w-full" : "max-w-4xl"}`}
    >
      <div className="flex items-center justify-between mb-8">
        <h1
          className="font-display font-bold leading-tight"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--text-primary)",
          }}
        >
          {initialData ? "Edit Draft" : "New Content"}
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsFullWidth(!isFullWidth)}
            variant="outline"
          >
            {isFullWidth ? "Collapse Width" : "Full Width"}
          </Button>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div
        className="flex items-center mb-8 border-b pb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className={`flex items-center ${currentStep === 1 ? "text-[var(--accent)] font-semibold" : "text-[var(--text-secondary)]"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border ${currentStep === 1 ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)]"}`}
          >
            {currentStep === 2 ? "✓" : "1"}
          </div>
          Details
        </div>
        <div className="flex-1 h-px bg-[var(--border)] mx-4"></div>
        <div
          className={`flex items-center ${currentStep === 2 ? "text-[var(--accent)] font-semibold" : "text-[var(--text-secondary)]"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border ${currentStep === 2 ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)]"}`}
          >
            2
          </div>
          Content
        </div>
      </div>

      <div className="space-y-6">
        {/* Accessible live status region */}
        <div aria-live="polite" className="sr-only">
          {statusMessage}
        </div>

        {hasRecovery && (
          <div
            role="status"
            className="p-4 rounded-xl flex items-center justify-between border mb-4 text-sm"
            style={{
              background: "var(--surface-raised)",
              borderColor: "var(--accent)",
              color: "var(--text-primary)",
            }}
          >
            <div>
              <span className="font-semibold" style={{ color: "var(--accent)" }}>
                Unsaved local changes detected
              </span>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                A recovery copy from your previous session was found on this device.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={restoreRecovery}>
                Restore
              </Button>
              <Button size="sm" variant="outline" onClick={discardRecovery}>
                Discard
              </Button>
            </div>
          </div>
        )}
        {prUrl && (
          <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md">
            Success! View your PR here:{" "}
            <a
              href={prUrl}
              target="_blank"
              rel="noreferrer"
              className="underline font-medium"
            >
              {prUrl}
            </a>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col space-y-4">
            <FieldControl
              label="Category"
              type="select"
              value={category}
              onChange={(val) => setCategory(val)}
              options={CATEGORY_OPTIONS}
            />
            <FieldControl
              label="Title"
              type="text"
              value={title}
              placeholder="E.g. My New Post"
              onChange={(val) => {
                setTitle(val);
                if (
                  !slug ||
                  slug ===
                    title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "")
                ) {
                  setSlug(
                    val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, ""),
                  );
                }
              }}
            />
            <FieldControl
              label="Slug"
              type="text"
              value={slug}
              placeholder="my-new-post"
              onChange={setSlug}
            />

            {showDescription && (
              <FieldControl
                label="Description"
                type="text"
                value={description}
                placeholder="Short excerpt or description"
                onChange={setDescription}
              />
            )}

            {showTags && (
              <FieldControl
                label="Tags"
                type="tags"
                value={selectedTags}
                onChange={setSelectedTags}
                options={TAG_OPTIONS}
                placeholder="Select or create tags..."
              />
            )}

            {showReadTime && (
              <FieldControl
                label="Read Time"
                type="range"
                value={readTime}
                onChange={setReadTime}
                min={0}
                max={30}
                description="min read"
              />
            )}

            {showLanguageLevel && (
              <>
                <FieldControl
                  label="Language"
                  type="select"
                  value={lang}
                  onChange={setLang}
                  options={LANG_OPTIONS}
                />
                <FieldControl
                  label="Level"
                  type="select"
                  value={level}
                  onChange={setLevel}
                  options={LEVEL_OPTIONS}
                />
              </>
            )}

            {showToolFields && (
              <>
                <FieldControl
                  label="Tool Category"
                  type="creatable-select"
                  value={toolCategory}
                  onChange={setToolCategory}
                  options={TOOL_CATEGORY_OPTIONS}
                  placeholder="Development, Security, etc."
                />
                <FieldControl
                  label="External Link"
                  type="url"
                  value={link}
                  onChange={setLink}
                  placeholder="https://..."
                />
              </>
            )}

            {showNotesFields && (
              <>
                <FieldControl
                  label="Topic"
                  type="select"
                  value={noteTopic}
                  onChange={(val) => {
                    setNoteTopic(val);
                    setNoteSubtopic("");
                  }}
                  options={[
                    { label: "Select Topic", value: "" },
                    ...topicOptions,
                  ]}
                />
                <FieldControl
                  label="Subtopic"
                  type="creatable-select"
                  value={noteSubtopic}
                  onChange={setNoteSubtopic}
                  options={[
                    { label: "Select Subtopic", value: "" },
                    ...(subtopicMap[noteTopic] || []),
                  ]}
                />
                <FieldControl
                  label="Order"
                  type="number"
                  value={noteOrder}
                  onChange={setNoteOrder}
                  min={1}
                />
              </>
            )}

            <div
              className="flex justify-end pt-4 border-t mt-8"
              style={{ borderColor: "var(--border)" }}
            >
              <Button onClick={() => setCurrentStep(2)}>
                Next: Edit Content
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="markdown-input"
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Content (Markdown)
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsHelpDrawerOpen(true)}
                  >
                    Formatting Help
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAssetDrawerOpen(true)}
                  >
                    Add Asset
                  </Button>
                </div>
              </div>
              <Editor
                markdown={markdown}
                onChange={setMarkdown}
                imageUploadHandler={handleImageUpload}
              />

              {images.length > 0 && (
                <div
                  className="p-4 rounded-xl border mt-6 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-raised)",
                  }}
                >
                  <p
                    className="font-semibold mb-2 text-xs uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Attached Draft Images ({images.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img) => (
                      <div
                        key={img.filename}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
                        style={{
                          borderColor: "var(--border)",
                          background: "var(--surface)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <span className="truncate max-w-[200px]">
                          {img.filename}
                        </span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm"
                          title="Remove image from draft"
                          onClick={() => {
                            setImages((prev) =>
                              prev.filter((i) => i.filename !== img.filename),
                            );
                            setMarkdown((prev: string) =>
                              prev.replace(
                                new RegExp(
                                  `!\\[[^\\]]*\\]\\(/assets/${img.filename}\\)`,
                                  "g",
                                ),
                                "",
                              ),
                            );
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t mt-8"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex gap-2">
                <Button onClick={() => setCurrentStep(1)} variant="outline">
                  Back
                </Button>
                {id && (
                  <>
                    {isArchived ? (
                      <Button
                        onClick={handleUnarchive}
                        disabled={isArchiving || isDeleting || isSaving}
                        variant="outline"
                      >
                        {isArchiving ? "Unarchiving..." : "Unarchive"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleArchive}
                        disabled={isArchiving || isDeleting || isSaving}
                        variant="outline"
                      >
                        {isArchiving ? "Archiving..." : "Archive"}
                      </Button>
                    )}
                    <Button
                      onClick={handleDelete}
                      disabled={isArchiving || isDeleting || isSaving}
                      variant="outline"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                {id && (
                  <Button
                    onClick={() => router.push(`/admin/${id}/preview`)}
                    variant="outline"
                  >
                    Preview
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={
                    isSaving || isPublishing || isArchiving || isDeleting
                  }
                  variant="outline"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>

                <Button
                  onClick={handleCreatePR}
                  disabled={
                    !branchName ||
                    !!prNumber ||
                    isCreatingPR ||
                    isPublishing ||
                    isSaving ||
                    isArchiving ||
                    isDeleting
                  }
                  variant="outline"
                >
                  {isCreatingPR ? "Creating PR..." : "Create PR"}
                </Button>

                <Button
                  onClick={handlePublish}
                  disabled={
                    !prNumber ||
                    isPublishing ||
                    isSaving ||
                    isArchiving ||
                    isDeleting
                  }
                >
                  {isPublishing ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isAssetDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity"
          onClick={() => setIsAssetDrawerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Asset Manager"
            className="w-full sm:w-1/2 lg:w-1/3 sm:min-w-[400px] h-full bg-[var(--bg-primary)] p-6 shadow-xl border-l border-[var(--border)] animate-in slide-in-from-right flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Asset Manager
              </h2>
              <button
                type="button"
                aria-label="Close Asset Manager"
                onClick={() => setIsAssetDrawerOpen(false)}
                className="text-xl font-bold p-2 hover:bg-black/5 rounded text-[var(--text-primary)]"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AssetManager
                onSelect={(url) => {
                  navigator.clipboard.writeText(`![Image](${url})`);
                  alert(
                    "Image URL copied to clipboard! You can paste it in the editor.",
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isHelpDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity"
          onClick={() => setIsHelpDrawerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Formatting Help"
            className="w-full sm:w-1/2 lg:w-1/3 sm:min-w-[400px] h-full bg-[var(--bg-primary)] p-6 shadow-xl border-l border-[var(--border)] animate-in slide-in-from-right flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Formatting Help
              </h2>
              <button
                type="button"
                aria-label="Close Formatting Help"
                onClick={() => setIsHelpDrawerOpen(false)}
                className="text-xl font-bold p-2 hover:bg-black/5 rounded text-[var(--text-primary)]"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <FormattingHelp />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function useAdminActions({
  id,
  setId,
  branchName,
  setBranchName,
  prNumber,
  setPrNumber,
  setPrUrl,
  title,
  slug,
  category,
  markdown,
  description,
  selectedTags,
  readTime,
  lang,
  level,
  toolCategory,
  link,
  noteTopic,
  noteSubtopic,
  noteOrder,
  images,
  setIsSaving,
  setIsCreatingPR,
  setIsPublishing,
  setIsArchiving,
  setIsArchived,
  setIsDeleting,
  router,
}: any) {
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
      noteTopic,
      noteSubtopic,
      noteOrder,
      images,
    },
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
      try {
        localStorage.removeItem(`draft_recovery_${res.id}`);
        localStorage.removeItem("draft_recovery_new");
      } catch {}
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

  const handleArchive = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to archive this draft?")) return;
    setIsArchiving(true);
    try {
      await archiveDraftAction(id);
      alert("Archived successfully!");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      alert("Error archiving: " + e.message);
      setIsArchiving(false);
    }
  };

  const handleUnarchive = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to unarchive this draft?"))
      return;
    setIsArchiving(true);
    try {
      await unarchiveDraftAction(id);
      alert("Unarchived successfully!");
      setIsArchived(false);
    } catch (e: any) {
      alert("Error unarchiving: " + e.message);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (
      !window.confirm("Are you sure you want to permanently delete this draft?")
    )
      return;
    setIsDeleting(true);
    try {
      await deleteDraftAction(id);
      alert("Deleted successfully!");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      alert("Error deleting: " + e.message);
      setIsDeleting(false);
    }
  };

  return {
    handleSave,
    handleCreatePR,
    handlePublish,
    handleArchive,
    handleUnarchive,
    handleDelete,
  };
}
