import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MdxContent {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

export function getAllContent(category: string): MdxContent[] {
  const categoryDir = path.join(contentDirectory, category);
  
  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(categoryDir);
  const allContent = fileNames
    .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(categoryDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        frontmatter: data,
        content
      };
    });

  // Sort writing and snippets by date by default
  if (category === "writing" || category === "snippets") {
    return allContent.sort((a, b) => {
      if (!a.frontmatter.date || !b.frontmatter.date) return 0;
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
  }

  return allContent;
}

export function getContentBySlug(category: string, slug: string): MdxContent | null {
  const categoryDir = path.join(contentDirectory, category);
  const fullPathMdx = path.join(categoryDir, `${slug}.mdx`);
  const fullPathMd = path.join(categoryDir, `${slug}.md`);

  let fileContents = "";
  if (fs.existsSync(fullPathMdx)) {
    fileContents = fs.readFileSync(fullPathMdx, 'utf8');
  } else if (fs.existsSync(fullPathMd)) {
    fileContents = fs.readFileSync(fullPathMd, 'utf8');
  } else {
    return null;
  }

  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content
  };
}

export function getAllNotes(): MdxContent[] {
  const notesDir = path.join(contentDirectory, "notes");
  if (!fs.existsSync(notesDir)) return [];
  
  const topics = fs.readdirSync(notesDir).filter(f => fs.statSync(path.join(notesDir, f)).isDirectory());
  const allNotes: MdxContent[] = [];
  
  for (const topic of topics) {
    const topicNotes = getAllContent(`notes/${topic}`);
    allNotes.push(...topicNotes);
  }
  
  return allNotes.sort((a, b) => {
    const orderA = (a.frontmatter.order as number) || 999;
    const orderB = (b.frontmatter.order as number) || 999;
    if (orderA !== orderB) return orderA - orderB;
    return ((a.frontmatter.title as string) || "").localeCompare((b.frontmatter.title as string) || "");
  });
}

// ---------------------------------------------------------------------------
// Dynamic Knowledge Base
// ---------------------------------------------------------------------------

export interface KnowledgeBaseNote {
  slug: string;
  title: string;
  minutes: number;
}

export interface KnowledgeBaseTopic {
  label: string;
  notes: KnowledgeBaseNote[];
}

export interface KnowledgeBase {
  slug: string;
  displayOrder: number;
  label: string;
  description: string;
  icon: string;
  color: string;
  principles: { label: string; text: string }[];
  topics: KnowledgeBaseTopic[];
}

/**
 * Estimate reading time from word count (~200 words/min, minimum 1 minute).
 */
function estimateReadingMinutes(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

/**
 * Build a single KnowledgeBase from its folder.
 * Reads `content/notes/<topicSlug>/index.json` for metadata and
 * scans MDX files to build the topics array grouped by `subtopic` frontmatter.
 */
export function getKnowledgeBase(topicSlug: string): KnowledgeBase | null {
  const topicDir = path.join(contentDirectory, 'notes', topicSlug);

  // Read index.json config
  const configPath = path.join(topicDir, 'index.json');
  if (!fs.existsSync(configPath)) return null;

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as {
    displayOrder?: number;
    label: string;
    description: string;
    icon: string;
    color: string;
    principles: { label: string; text: string }[];
  };

  // Read all MDX notes in this topic folder
  const notes = getAllContent(`notes/${topicSlug}`);

  // Group by subtopic
  const subtopicMap = new Map<string, KnowledgeBaseNote[]>();

  for (const note of notes) {
    const subtopic = (note.frontmatter.subtopic as string) || 'General';
    if (!subtopicMap.has(subtopic)) {
      subtopicMap.set(subtopic, []);
    }
    subtopicMap.get(subtopic)!.push({
      slug: note.slug,
      title: (note.frontmatter.title as string) || note.slug,
      minutes: estimateReadingMinutes(note.content),
    });
  }

  // Sort notes within each subtopic by order (from frontmatter)
  const notesBySlug = new Map(notes.map(n => [n.slug, n]));
  for (const [, groupNotes] of subtopicMap) {
    groupNotes.sort((a, b) => {
      const orderA = (notesBySlug.get(a.slug)?.frontmatter.order as number) || 999;
      const orderB = (notesBySlug.get(b.slug)?.frontmatter.order as number) || 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });
  }

  // Convert map to sorted array of topics
  const topics: KnowledgeBaseTopic[] = Array.from(subtopicMap.entries()).map(
    ([label, groupNotes]) => ({ label, notes: groupNotes })
  );

  return {
    slug: topicSlug,
    displayOrder: config.displayOrder ?? 999,
    label: config.label,
    description: config.description,
    icon: config.icon,
    color: config.color,
    principles: config.principles,
    topics,
  };
}

/**
 * Discover and build all knowledge bases from `content/notes/`.
 * Replaces the hardcoded `knowledgeBases` array in constants.ts.
 */
export function getAllKnowledgeBases(): KnowledgeBase[] {
  const notesDir = path.join(contentDirectory, 'notes');
  if (!fs.existsSync(notesDir)) return [];

  const dirs = fs.readdirSync(notesDir).filter(f =>
    fs.statSync(path.join(notesDir, f)).isDirectory()
  );

  const knowledgeBases: KnowledgeBase[] = [];
  for (const dir of dirs) {
    const kb = getKnowledgeBase(dir);
    if (kb) knowledgeBases.push(kb);
  }

  return knowledgeBases.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Derive admin topic dropdown options from discovered knowledge bases.
 */
export function getAdminTopicOptions(): { label: string; value: string }[] {
  return getAllKnowledgeBases().map(kb => ({
    label: kb.label,
    value: kb.slug,
  }));
}

/**
 * Derive admin subtopic dropdown map from discovered knowledge bases.
 */
export function getAdminSubtopicMap(): Record<string, { label: string; value: string }[]> {
  const result: Record<string, { label: string; value: string }[]> = {};
  for (const kb of getAllKnowledgeBases()) {
    result[kb.slug] = kb.topics.map(t => ({
      label: t.label,
      value: t.label,
    }));
  }
  return result;
}
