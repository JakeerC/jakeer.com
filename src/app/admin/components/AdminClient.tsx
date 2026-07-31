"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { submitContentToGitHub } from "../actions";

const Editor = dynamic(() => import("./EditorWrapper"), { ssr: false });

export function AdminClient({ session }: { session: any }) {
  const [category, setCategory] = useState<"writing" | "snippets" | "tools">("writing");
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
  const [images, setImages] = useState<{ filename: string; base64Data: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prUrl, setPrUrl] = useState("");
  const [isFullWidth, setIsFullWidth] = useState(false);

  const handleImageUpload = async (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(",")[1];
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
        
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
        link
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
    <div className={`mx-auto px-6 py-16 transition-all duration-300 ${isFullWidth ? "max-w-full" : "max-w-4xl"}`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}>
          Admin Dashboard
        </h1>
        <button
          onClick={() => setIsFullWidth(!isFullWidth)}
          className="px-4 py-2 text-sm border rounded-md"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        >
          {isFullWidth ? "Collapse Width" : "Full Width"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Create New Content
          </h2>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Logged in
          </div>
        </div>

      {prUrl && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md">
          Success! View your PR here: <a href={prUrl} target="_blank" rel="noreferrer" className="underline font-medium">{prUrl}</a>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="border p-2 rounded-md"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
          >
            <option value="writing">Writing / Blog</option>
            <option value="snippets">Snippet</option>
            <option value="tools">Tool</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Auto-generate slug
              if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
              }
            }}
            placeholder="E.g. My New Post"
            className="border p-2 rounded-md"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Slug</label>
          <input 
            type="text" 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-new-post"
            className="border p-2 rounded-md"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(category === "writing" || category === "snippets" || category === "tools") && (
          <div className="flex flex-col space-y-2 col-span-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short excerpt or description"
              className="border p-2 rounded-md w-full"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
            />
          </div>
        )}

        {(category === "writing" || category === "snippets") && (
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Tags</label>
            <div className="flex flex-wrap gap-2">
              {[
                "React", "JavaScript", "TypeScript", "Next.js", "Node.js", "Java", "Spring Boot", 
                "System Design", "Architecture", "Kafka", "Distributed Systems", "PostgreSQL", 
                "Database", "Performance", "CSS", "Tailwind", "Git", "AWS", "Shell / Bash"
              ].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${selectedTags.includes(tag) ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-transparent'}`}
                  style={!selectedTags.includes(tag) ? { color: "var(--text-secondary)", borderColor: "var(--border)" } : {}}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {category === "writing" && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium flex justify-between" style={{ color: "var(--text-primary)" }}>
              <span>Read Time</span>
              <span className="font-mono text-[var(--accent)]">{readTime} min read</span>
            </label>
            <input 
              type="range" 
              min="0"
              max="30"
              value={readTime}
              onChange={(e) => setReadTime(parseInt(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        )}

        {category === "snippets" && (
          <>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Language</label>
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="border p-2 rounded-md"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              >
                <option value="">Select Language</option>
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="tsx">TSX / React</option>
                <option value="jsx">JSX</option>
                <option value="java">Java</option>
                <option value="bash">Bash / Shell</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="sql">SQL</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Level</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="border p-2 rounded-md"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </>
        )}

        {category === "tools" && (
          <>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Tool Category</label>
              <input 
                type="text" 
                value={toolCategory}
                onChange={(e) => setToolCategory(e.target.value)}
                placeholder="Development, Security, etc."
                className="border p-2 rounded-md"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>External Link</label>
              <input 
                type="url" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="border p-2 rounded-md"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Content (Markdown)</label>
        <Editor markdown={markdown} onChange={setMarkdown} imageUploadHandler={handleImageUpload} />
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}
        >
          {isSubmitting ? "Creating PR..." : "Publish to GitHub"}
        </button>
      </div>
    </div>
    </div>
  );
}
