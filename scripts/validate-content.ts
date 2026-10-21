import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

// ============================================================================
// Schemas
// ============================================================================

export const WritingFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  readTime: z.string().min(1, "Read time is required"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  description: z.string().min(1, "Description is required"),
  featured: z.boolean().optional(),
  image: z.string().min(1).optional(),
  draft: z.boolean().optional(),
});

export const SnippetFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  lang: z.string().min(1, "Language is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    message: 'Level must be "BEGINNER", "INTERMEDIATE", or "ADVANCED"',
  }),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  draft: z.boolean().optional(),
});

export const ToolFrontmatterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  link: z.string().url("Link must be a valid URL"),
  icon: z.string().min(1, "Icon is required"),
  draft: z.boolean().optional(),
});

export const NoteFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  readTime: z.string().min(1, "Read time is required"),
  topic: z.string().min(1, "Topic is required"),
  subtopic: z.string().min(1, "Subtopic is required"),
  order: z.number({ message: "Order must be a number" }),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  draft: z.boolean().optional(),
});

export const NoteIndexJsonSchema = z.object({
  displayOrder: z.number().optional(),
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
  principles: z.array(
    z.object({
      label: z.string().min(1, "Principle label is required"),
      text: z.string().min(1, "Principle text is required"),
    })
  ),
});

export type WritingFrontmatter = z.infer<typeof WritingFrontmatterSchema>;
export type SnippetFrontmatter = z.infer<typeof SnippetFrontmatterSchema>;
export type ToolFrontmatter = z.infer<typeof ToolFrontmatterSchema>;
export type NoteFrontmatter = z.infer<typeof NoteFrontmatterSchema>;
export type NoteIndexJson = z.infer<typeof NoteIndexJsonSchema>;

// Known snippet category slugs / labels (case-insensitive)
export const KNOWN_SNIPPET_CATEGORIES = [
  "react",
  "java",
  "typescript",
  "git",
  "aws",
  "shell",
  "bash",
];

// ============================================================================
// Helpers & Cross-checks
// ============================================================================

export interface ValidationError {
  file: string;
  field?: string;
  message: string;
}

export function extractImageReferences(markdown: string): string[] {
  const images: string[] = [];
  const regex = /!\[.*?\]\((.*?)\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    const rawUrl = match[1].split(/\s+/)[0].trim(); // handle optional title e.g. (url "title")
    if (rawUrl) {
      images.push(rawUrl);
    }
  }
  return images;
}

export function verifyImageExists(
  imageRef: string,
  baseDir: string,
  rootDir: string
): boolean {
  if (
    imageRef.startsWith("http://") ||
    imageRef.startsWith("https://") ||
    imageRef.startsWith("data:")
  ) {
    return true;
  }

  // Handle absolute path from public web root (e.g. /assets/... or /placeholder-hero.jpg)
  if (imageRef.startsWith("/")) {
    const publicPath = path.join(rootDir, "public", imageRef.replace(/^\//, ""));
    const directPath = path.join(rootDir, imageRef.replace(/^\//, ""));
    return fs.existsSync(publicPath) || fs.existsSync(directPath);
  }

  // Relative path from file
  const relativePath = path.join(baseDir, imageRef);
  return fs.existsSync(relativePath);
}

// ============================================================================
// Content Validator Runner
// ============================================================================

export interface ValidationSummary {
  totalFiles: number;
  writingCount: number;
  snippetCount: number;
  toolCount: number;
  noteCount: number;
  noteIndexCount: number;
  draftCount: number;
  errors: ValidationError[];
}

export function validateAllContent(rootDir: string = process.cwd()): ValidationSummary {
  const contentDir = path.join(rootDir, "content");
  const summary: ValidationSummary = {
    totalFiles: 0,
    writingCount: 0,
    snippetCount: 0,
    toolCount: 0,
    noteCount: 0,
    noteIndexCount: 0,
    draftCount: 0,
    errors: [],
  };

  if (!fs.existsSync(contentDir)) {
    summary.errors.push({
      file: contentDir,
      message: "Content directory does not exist",
    });
    return summary;
  }

  // 1. Validate Writing
  const writingDir = path.join(contentDir, "writing");
  const writingSlugs = new Map<string, string>();
  if (fs.existsSync(writingDir)) {
    const files = fs
      .readdirSync(writingDir)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    for (const file of files) {
      summary.totalFiles++;
      summary.writingCount++;
      const filePath = path.join(writingDir, file);
      const slug = file.replace(/\.mdx?$/, "");

      if (writingSlugs.has(slug)) {
        summary.errors.push({
          file: filePath,
          field: "slug",
          message: `Duplicate writing slug "${slug}". Already defined in ${writingSlugs.get(slug)}`,
        });
      } else {
        writingSlugs.set(slug, filePath);
      }

      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        if (data.draft) summary.draftCount++;

        const parseResult = WritingFrontmatterSchema.safeParse(data);
        if (!parseResult.success) {
          for (const issue of parseResult.error.issues) {
            summary.errors.push({
              file: filePath,
              field: issue.path.join("."),
              message: issue.message,
            });
          }
        }

        // Image check
        if (data.image) {
          if (!verifyImageExists(data.image, writingDir, rootDir)) {
            summary.errors.push({
              file: filePath,
              field: "image",
              message: `Referenced frontmatter image not found: ${data.image}`,
            });
          }
        }
        for (const img of extractImageReferences(content)) {
          if (!verifyImageExists(img, writingDir, rootDir)) {
            summary.errors.push({
              file: filePath,
              field: "content",
              message: `Referenced markdown image not found: ${img}`,
            });
          }
        }
      } catch (err) {
        summary.errors.push({
          file: filePath,
          message: `Failed to parse file: ${(err as Error).message}`,
        });
      }
    }
  }

  // 2. Validate Snippets
  const snippetsDir = path.join(contentDir, "snippets");
  const snippetSlugs = new Map<string, string>();
  if (fs.existsSync(snippetsDir)) {
    const files = fs
      .readdirSync(snippetsDir)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    for (const file of files) {
      summary.totalFiles++;
      summary.snippetCount++;
      const filePath = path.join(snippetsDir, file);
      const slug = file.replace(/\.mdx?$/, "");

      if (snippetSlugs.has(slug)) {
        summary.errors.push({
          file: filePath,
          field: "slug",
          message: `Duplicate snippet slug "${slug}". Already defined in ${snippetSlugs.get(slug)}`,
        });
      } else {
        snippetSlugs.set(slug, filePath);
      }

      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        if (data.draft) summary.draftCount++;

        const parseResult = SnippetFrontmatterSchema.safeParse(data);
        if (!parseResult.success) {
          for (const issue of parseResult.error.issues) {
            summary.errors.push({
              file: filePath,
              field: issue.path.join("."),
              message: issue.message,
            });
          }
        } else {
          // Check that at least one tag corresponds to a known category
          const tags = parseResult.data.tags.map((t) => t.toLowerCase());
          const hasKnownCategory = tags.some((tag) =>
            KNOWN_SNIPPET_CATEGORIES.some(
              (cat) => tag === cat || tag.includes(cat) || cat.includes(tag)
            )
          );
          if (!hasKnownCategory) {
            summary.errors.push({
              file: filePath,
              field: "tags",
              message: `Snippet tags [${parseResult.data.tags.join(
                ", "
              )}] do not match any known snippet category (${KNOWN_SNIPPET_CATEGORIES.join(", ")})`,
            });
          }
        }

        for (const img of extractImageReferences(content)) {
          if (!verifyImageExists(img, snippetsDir, rootDir)) {
            summary.errors.push({
              file: filePath,
              field: "content",
              message: `Referenced markdown image not found: ${img}`,
            });
          }
        }
      } catch (err) {
        summary.errors.push({
          file: filePath,
          message: `Failed to parse file: ${(err as Error).message}`,
        });
      }
    }
  }

  // 3. Validate Tools
  const toolsDir = path.join(contentDir, "tools");
  const toolSlugs = new Map<string, string>();
  if (fs.existsSync(toolsDir)) {
    const files = fs
      .readdirSync(toolsDir)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    for (const file of files) {
      summary.totalFiles++;
      summary.toolCount++;
      const filePath = path.join(toolsDir, file);
      const slug = file.replace(/\.mdx?$/, "");

      if (toolSlugs.has(slug)) {
        summary.errors.push({
          file: filePath,
          field: "slug",
          message: `Duplicate tool slug "${slug}". Already defined in ${toolSlugs.get(slug)}`,
        });
      } else {
        toolSlugs.set(slug, filePath);
      }

      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        if (data.draft) summary.draftCount++;

        const parseResult = ToolFrontmatterSchema.safeParse(data);
        if (!parseResult.success) {
          for (const issue of parseResult.error.issues) {
            summary.errors.push({
              file: filePath,
              field: issue.path.join("."),
              message: issue.message,
            });
          }
        }

        for (const img of extractImageReferences(content)) {
          if (!verifyImageExists(img, toolsDir, rootDir)) {
            summary.errors.push({
              file: filePath,
              field: "content",
              message: `Referenced markdown image not found: ${img}`,
            });
          }
        }
      } catch (err) {
        summary.errors.push({
          file: filePath,
          message: `Failed to parse file: ${(err as Error).message}`,
        });
      }
    }
  }

  // 4. Validate Notes
  const notesDir = path.join(contentDir, "notes");
  if (fs.existsSync(notesDir)) {
    const topicDirs = fs
      .readdirSync(notesDir)
      .filter((f) => fs.statSync(path.join(notesDir, f)).isDirectory());

    for (const topic of topicDirs) {
      const topicPath = path.join(notesDir, topic);
      const indexJsonPath = path.join(topicPath, "index.json");

      // Check index.json
      if (!fs.existsSync(indexJsonPath)) {
        summary.errors.push({
          file: topicPath,
          field: "index.json",
          message: `Topic directory "${topic}" is missing index.json`,
        });
      } else {
        summary.totalFiles++;
        summary.noteIndexCount++;
        try {
          const rawIndex = fs.readFileSync(indexJsonPath, "utf-8");
          const parsedJson = JSON.parse(rawIndex);
          const parseResult = NoteIndexJsonSchema.safeParse(parsedJson);
          if (!parseResult.success) {
            for (const issue of parseResult.error.issues) {
              summary.errors.push({
                file: indexJsonPath,
                field: issue.path.join("."),
                message: issue.message,
              });
            }
          }
        } catch (err) {
          summary.errors.push({
            file: indexJsonPath,
            message: `Failed to parse index.json: ${(err as Error).message}`,
          });
        }
      }

      // Check notes in topic
      const noteFiles = fs
        .readdirSync(topicPath)
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
      const noteSlugs = new Map<string, string>();

      for (const file of noteFiles) {
        summary.totalFiles++;
        summary.noteCount++;
        const filePath = path.join(topicPath, file);
        const slug = file.replace(/\.mdx?$/, "");

        if (noteSlugs.has(slug)) {
          summary.errors.push({
            file: filePath,
            field: "slug",
            message: `Duplicate note slug "${slug}" in topic "${topic}". Already defined in ${noteSlugs.get(slug)}`,
          });
        } else {
          noteSlugs.set(slug, filePath);
        }

        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          const { data, content } = matter(raw);
          if (data.draft) summary.draftCount++;

          const parseResult = NoteFrontmatterSchema.safeParse(data);
          if (!parseResult.success) {
            for (const issue of parseResult.error.issues) {
              summary.errors.push({
                file: filePath,
                field: issue.path.join("."),
                message: issue.message,
              });
            }
          } else {
            // Check topic field matches directory
            if (parseResult.data.topic !== topic) {
              summary.errors.push({
                file: filePath,
                field: "topic",
                message: `Note frontmatter topic "${parseResult.data.topic}" does not match topic directory "${topic}"`,
              });
            }
          }

          for (const img of extractImageReferences(content)) {
            if (!verifyImageExists(img, topicPath, rootDir)) {
              summary.errors.push({
                file: filePath,
                field: "content",
                message: `Referenced markdown image not found: ${img}`,
              });
            }
          }
        } catch (err) {
          summary.errors.push({
            file: filePath,
            message: `Failed to parse file: ${(err as Error).message}`,
          });
        }
      }
    }
  }

  return summary;
}

// ============================================================================
// CLI Runner
// ============================================================================

export function runCli(): void {
  console.log("🔍 Validating content files...");
  const summary = validateAllContent(process.cwd());

  console.log(`\nFound ${summary.totalFiles} content files:`);
  console.log(`  • Writing: ${summary.writingCount}`);
  console.log(`  • Snippets: ${summary.snippetCount}`);
  console.log(`  • Tools: ${summary.toolCount}`);
  console.log(`  • Notes: ${summary.noteCount} (across ${summary.noteIndexCount} topics)`);
  if (summary.draftCount > 0) {
    console.log(`  • Drafts: ${summary.draftCount} (validated)`);
  }

  if (summary.errors.length > 0) {
    console.error(`\n❌ Content validation failed with ${summary.errors.length} error(s):\n`);
    for (const error of summary.errors) {
      const relPath = path.relative(process.cwd(), error.file);
      const fieldStr = error.field ? ` [field: ${error.field}]` : "";
      console.error(`  - ${relPath}${fieldStr}: ${error.message}`);
    }
    process.exit(1);
  }

  console.log("\n✅ All content files are valid!\n");
  process.exit(0);
}

// Only run CLI if invoked directly
if (
  process.argv[1] &&
  (process.argv[1].endsWith("validate-content.ts") ||
    process.argv[1].endsWith("validate-content.js"))
) {
  runCli();
}
