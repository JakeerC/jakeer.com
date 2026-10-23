import { getAllContent, getContentBySlug } from './mdx';

export interface WritingProjection {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}

export interface SnippetProjection {
  slug: string;
  title: string;
  description: string;
  date: string;
  lang: string;
  level: string;
  tags: string[];
  category: string; // first normalized tag
  draft?: boolean;
}

export interface ToolProjection {
  slug: string;
  name: string;
  description: string;
  category: string;
  link: string;
  icon?: string;
}

export interface NoteProjection {
  slug: string;
  title: string;
  description: string;
  readTime?: string;
  topic: string;
  subtopic: string;
  order?: number;
  tags: string[];
  date?: string;
}

export function normalizeTagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function getWritingProjections(): WritingProjection[] {
  return getAllContent('writing')
    .filter(item => !item.frontmatter.draft)
    .map(item => ({
      slug: item.slug,
      title: (item.frontmatter.title as string) || item.slug,
      description: (item.frontmatter.description as string) || '',
      date: (item.frontmatter.date as string) || '',
      readTime: (item.frontmatter.readTime as string) || '5 min read',
      tags: ((item.frontmatter.tags as string[]) || []),
      image: item.frontmatter.image as string | undefined,
      draft: item.frontmatter.draft as boolean | undefined,
    }));
}

export function getRecentWriting(count = 3): WritingProjection[] {
  return getWritingProjections().slice(0, count);
}

export function getPublicWritingBySlug(slug: string): WritingProjection | null {
  const item = getContentBySlug('writing', slug);
  if (!item || item.frontmatter.draft) return null;
  return {
    slug: item.slug,
    title: (item.frontmatter.title as string) || slug,
    description: (item.frontmatter.description as string) || '',
    date: (item.frontmatter.date as string) || '',
    readTime: (item.frontmatter.readTime as string) || '5 min read',
    tags: (item.frontmatter.tags as string[]) || [],
    image: item.frontmatter.image as string | undefined,
  };
}

export function getSnippetProjections(): SnippetProjection[] {
  return getAllContent('snippets')
    .filter(item => !item.frontmatter.draft)
    .map(item => {
      const tags = (item.frontmatter.tags as string[]) || [];
      return {
        slug: item.slug,
        title: (item.frontmatter.title as string) || item.slug,
        description: (item.frontmatter.description as string) || '',
        date: (item.frontmatter.date as string) || '',
        lang: (item.frontmatter.lang as string) || '',
        level: (item.frontmatter.level as string) || '',
        tags,
        category: tags.length > 0 ? normalizeTagSlug(tags[0]) : 'general',
        draft: item.frontmatter.draft as boolean | undefined,
      };
    });
}

export function getSnippetCategoryCount(categorySlug: string): number {
  return getSnippetProjections().filter(
    s => normalizeTagSlug(s.tags[0] ?? '') === normalizeTagSlug(categorySlug)
  ).length;
}

export function getPublicSnippetBySlug(slug: string): SnippetProjection | null {
  const item = getContentBySlug('snippets', slug);
  if (!item || item.frontmatter.draft) return null;
  const tags = (item.frontmatter.tags as string[]) || [];
  return {
    slug: item.slug,
    title: (item.frontmatter.title as string) || slug,
    description: (item.frontmatter.description as string) || '',
    date: (item.frontmatter.date as string) || '',
    lang: (item.frontmatter.lang as string) || '',
    level: (item.frontmatter.level as string) || '',
    tags,
    category: tags.length > 0 ? normalizeTagSlug(tags[0]) : 'general',
  };
}

export function getToolProjections(): ToolProjection[] {
  return getAllContent('tools').map(item => ({
    slug: item.slug,
    name: (item.frontmatter.name as string) || (item.frontmatter.title as string) || item.slug,
    description: (item.frontmatter.description as string) || '',
    category: (item.frontmatter.category as string) || '',
    link: (item.frontmatter.link as string) || '',
    icon: item.frontmatter.icon as string | undefined,
  }));
}
