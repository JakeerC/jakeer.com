import { describe, it, expect, vi } from 'vitest';
import { normalizeTagSlug, getWritingProjections, getSnippetCategoryCount } from '../content-projections';

// Mock the mdx module
vi.mock('../mdx', () => ({
  getAllContent: vi.fn((category: string) => {
    if (category === 'writing') return [
      { slug: 'post-one', frontmatter: { title: 'Post One', description: 'Desc', date: '2026-01-01', readTime: '5 min read', tags: ['React', 'TypeScript'] }, content: '' },
      { slug: 'post-draft', frontmatter: { title: 'Draft Post', draft: true, date: '2026-02-01', tags: [] }, content: '' },
    ];
    if (category === 'snippets') return [
      { slug: 'hook-one', frontmatter: { title: 'Hook', description: '', date: '', lang: 'typescript', level: 'BEGINNER', tags: ['react'] }, content: '' },
      { slug: 'java-thing', frontmatter: { title: 'Java', description: '', date: '', lang: 'java', level: 'INTERMEDIATE', tags: ['Java'] }, content: '' },
    ];
    return [];
  }),
  getContentBySlug: vi.fn(),
}));

describe('normalizeTagSlug', () => {
  it('lowercases and trims', () => {
    expect(normalizeTagSlug('React')).toBe('react');
  });
  it('handles spaces', () => {
    expect(normalizeTagSlug('React JS')).toBe('react-js');
  });
  it('handles mixed case', () => {
    expect(normalizeTagSlug('TypeScript')).toBe('typescript');
  });
});

describe('getWritingProjections', () => {
  it('filters out drafts', () => {
    const results = getWritingProjections();
    expect(results.find(p => p.slug === 'post-draft')).toBeUndefined();
    expect(results.find(p => p.slug === 'post-one')).toBeDefined();
  });
  it('returns typed projections', () => {
    const [first] = getWritingProjections();
    expect(first.title).toBe('Post One');
    expect(first.tags).toEqual(['React', 'TypeScript']);
  });
});

describe('getSnippetCategoryCount', () => {
  it('counts snippets by normalized category', () => {
    expect(getSnippetCategoryCount('react')).toBe(1);
    expect(getSnippetCategoryCount('java')).toBe(1);
  });
  it('is case-insensitive', () => {
    expect(getSnippetCategoryCount('React')).toBe(1);
    expect(getSnippetCategoryCount('JAVA')).toBe(1);
  });
  it('returns 0 for non-existent categories', () => {
    expect(getSnippetCategoryCount('nonexistent')).toBe(0);
  });
});
