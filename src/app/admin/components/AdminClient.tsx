"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { submitContentToGitHub } from "../actions";
import { FieldControl } from "../../../components/FieldControl";
import { Button } from "../../../components/Button";

const Editor = dynamic(() => import("./EditorWrapper"), { ssr: false });

import {
  ADMIN_TAG_OPTIONS as TAG_OPTIONS,
  ADMIN_CATEGORY_OPTIONS as CATEGORY_OPTIONS,
  ADMIN_LANG_OPTIONS as LANG_OPTIONS,
  ADMIN_LEVEL_OPTIONS as LEVEL_OPTIONS,
} from "../../../lib/constants";

export function AdminClient({ session }: { session: any }) {
  const [category, setCategory] = useState<"writing" | "snippets" | "tools">(
    "writing",
  );
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [readTime, setReadTime] = useState(5);
  const [lang, setLang] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [toolCategory, setToolCategory] = useState("Development");
  const [link, setLink] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [images, setImages] = useState<
    { filename: string; base64Data: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prUrl, setPrUrl] = useState("");
  const [isFullWidth, setIsFullWidth] = useState(false);

  const handleImageUpload = async (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(",")[1];
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;

        // Add to our image tracking array
        setImages((prev) => [...prev, { filename, base64Data }]);

        // Return the asset path that will be used in the PR
        resolve(`/assets/${filename}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  };

  const handleSubmit = async () => {
    if (!title || !slug || !markdown) {
      alert("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    setPrUrl("");
    try {
      const res = await submitContentToGitHub({
        title,
        slug,
        category,
        markdown,
        images,
        description,
        tags: selectedTags.join(","),
        readTime: `${readTime} min read`,
        lang,
        level,
        toolCategory,
        link,
      });
      setPrUrl(res.prUrl);
      alert("Pull Request created successfully!");
    } catch (e: any) {
      console.error(e);
      alert("Error creating PR: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Admin Dashboard
        </h1>
        <Button
          onClick={() => setIsFullWidth(!isFullWidth)}
          variant="outline"
        >
          {isFullWidth ? "Collapse Width" : "Full Width"}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Create New Content
          </h2>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Logged in
          </div>
        </div>

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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(category === "writing" ||
            category === "snippets" ||
            category === "tools") && (
            <div className="col-span-2">
              <FieldControl
                label="Description"
                type="text"
                value={description}
                placeholder="Short excerpt or description"
                onChange={setDescription}
              />
            </div>
          )}

          {(category === "writing" || category === "snippets") && (
            <div className="col-span-2">
              <FieldControl
                label="Tags"
                type="tags"
                value={selectedTags}
                onChange={setSelectedTags}
                options={TAG_OPTIONS}
                placeholder="Select or create tags..."
              />
            </div>
          )}

          {category === "writing" && (
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

          {category === "snippets" && (
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

          {category === "tools" && (
            <>
              <FieldControl
                label="Tool Category"
                type="text"
                value={toolCategory}
                onChange={setToolCategory}
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
        </div>

        <div className="flex flex-col space-y-2">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Content (Markdown)
          </label>
          <Editor
            markdown={markdown}
            onChange={setMarkdown}
            imageUploadHandler={handleImageUpload}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating PR..." : "Publish to GitHub"}
          </Button>
        </div>
      </div>
    </div>
  );
}
