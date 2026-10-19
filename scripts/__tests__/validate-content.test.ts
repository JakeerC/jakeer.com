import { describe, it, expect } from "vitest";
import path from "path";
import {
  WritingFrontmatterSchema,
  SnippetFrontmatterSchema,
  ToolFrontmatterSchema,
  NoteFrontmatterSchema,
  NoteIndexJsonSchema,
  extractImageReferences,
  verifyImageExists,
  validateAllContent,
} from "../validate-content";

describe("Content Validation Schemas", () => {
  describe("WritingFrontmatterSchema", () => {
    it("validates valid writing frontmatter", () => {
      const valid = {
        title: "Test Title",
        date: "Jul 10, 2026",
        readTime: "8 min read",
        tags: ["React", "Performance"],
        description: "A description of the writing",
        featured: true,
        draft: false,
      };
      const result = WritingFrontmatterSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when title is missing", () => {
      const invalid = {
        date: "Jul 10, 2026",
        readTime: "8 min read",
        tags: ["React"],
        description: "A description",
      };
      const result = WritingFrontmatterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("title");
      }
    });

    it("fails when tags array is empty", () => {
      const invalid = {
        title: "Test",
        date: "Jul 10, 2026",
        readTime: "8 min read",
        tags: [],
        description: "A description",
      };
      const result = WritingFrontmatterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("SnippetFrontmatterSchema", () => {
    it("validates valid snippet frontmatter", () => {
      const valid = {
        title: "useDebounce Hook",
        date: "Jul 31, 2026",
        description: "Debounce any value",
        lang: "tsx",
        level: "BEGINNER",
        tags: ["react"],
      };
      const result = SnippetFrontmatterSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when level is not in allowed enum", () => {
      const invalid = {
        title: "useDebounce Hook",
        date: "Jul 31, 2026",
        description: "Debounce any value",
        lang: "tsx",
        level: "EXPERT",
        tags: ["react"],
      };
      const result = SnippetFrontmatterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("BEGINNER");
      }
    });
  });

  describe("ToolFrontmatterSchema", () => {
    it("validates valid tool frontmatter", () => {
      const valid = {
        name: "Base64 Encoder",
        description: "Encode or decode Base64",
        category: "Development",
        link: "https://www.base64decode.org",
        icon: "LuCode",
      };
      const result = ToolFrontmatterSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when link is not a valid URL", () => {
      const invalid = {
        name: "Base64 Encoder",
        description: "Encode or decode Base64",
        category: "Development",
        link: "not-a-valid-url",
        icon: "LuCode",
      };
      const result = ToolFrontmatterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("link");
      }
    });
  });

  describe("NoteFrontmatterSchema", () => {
    it("validates valid note frontmatter", () => {
      const valid = {
        title: "Hooks Best Practices",
        description: "A comprehensive guide",
        readTime: "5 min read",
        topic: "react",
        subtopic: "Optimization",
        order: 2,
        tags: ["react"],
      };
      const result = NoteFrontmatterSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when order is not a number", () => {
      const invalid = {
        title: "Hooks Best Practices",
        description: "A comprehensive guide",
        readTime: "5 min read",
        topic: "react",
        subtopic: "Optimization",
        order: "first",
        tags: ["react"],
      };
      const result = NoteFrontmatterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("NoteIndexJsonSchema", () => {
    it("validates valid index.json configuration", () => {
      const valid = {
        displayOrder: 4,
        label: "React",
        description: "Hooks and render optimization",
        icon: "React",
        color: "#61dafb",
        principles: [
          {
            label: "PERFORMANCE",
            text: "Memoization and lazy loading",
          },
        ],
      };
      const result = NoteIndexJsonSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when principles array is missing or invalid", () => {
      const invalid = {
        label: "React",
        description: "Hooks",
        icon: "React",
        color: "#61dafb",
        principles: "not an array",
      };
      const result = NoteIndexJsonSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});

describe("Cross-checks and image validation", () => {
  it("extracts markdown image references accurately", () => {
    const md = `
# Title
Here is an image: ![Hero](/assets/hero.png)
And another: ![Diagram](https://example.com/diag.svg "Architecture")
Text with no images.
    `;
    const images = extractImageReferences(md);
    expect(images).toEqual(["/assets/hero.png", "https://example.com/diag.svg"]);
  });

  it("handles empty or image-less markdown", () => {
    expect(extractImageReferences("Just plain text with [link](https://foo.com)")).toEqual([]);
  });

  it("treats remote images as existing", () => {
    expect(verifyImageExists("https://example.com/pic.jpg", process.cwd(), process.cwd())).toBe(true);
    expect(verifyImageExists("http://example.com/pic.jpg", process.cwd(), process.cwd())).toBe(true);
    expect(verifyImageExists("data:image/png;base64,123", process.cwd(), process.cwd())).toBe(true);
  });

  it("verifies existing public assets and reports missing assets", () => {
    const rootDir = process.cwd();
    // placeholder-hero.jpg exists in public/
    expect(verifyImageExists("/placeholder-hero.jpg", path.join(rootDir, "content"), rootDir)).toBe(true);
    // non-existent file
    expect(verifyImageExists("/non-existent-image.png", path.join(rootDir, "content"), rootDir)).toBe(false);
  });

  it("validates the entire workspace content without errors", () => {
    const summary = validateAllContent(process.cwd());
    expect(summary.errors).toHaveLength(0);
    expect(summary.totalFiles).toBeGreaterThan(0);
    expect(summary.writingCount).toBe(6);
    expect(summary.snippetCount).toBe(4);
    expect(summary.toolCount).toBe(9);
    expect(summary.noteCount).toBe(22);
    expect(summary.noteIndexCount).toBe(10);
  });
});
