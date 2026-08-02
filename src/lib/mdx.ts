import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MdxContent {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

export function getAllContent(category: "writing" | "snippets" | "tools"): MdxContent[] {
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

export function getContentBySlug(category: "writing" | "snippets" | "tools", slug: string): MdxContent | null {
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
