import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Article" };

// Sample article content — replace with MDX/CMS later
const article = {
  title:    "React Performance Optimization: From Good to Great",
  date:     "Jul 10, 2026",
  readTime: "8 min read",
  tags:     ["React", "Performance", "JavaScript"],
  content: `
React apps can become sluggish over time — not because React is slow, but because of how we use it. In this post, we'll explore the most impactful optimizations you can apply today.

## Why React Re-renders

React re-renders a component when:
- Its **state** changes
- Its **props** change (by reference)
- Its **parent** re-renders

The key insight: most performance issues come from **unnecessary re-renders** — renders triggered by reference changes, not value changes.

## 1. useMemo and useCallback

\`\`\`tsx
// Before — new reference on every render
const filteredItems = items.filter(item => item.active);

// After — memoized
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);
\`\`\`

Use \`useCallback\` for functions you pass as props to memoized children:

\`\`\`tsx
const handleClick = useCallback((id: string) => {
  dispatch({ type: "SELECT", payload: id });
}, [dispatch]);
\`\`\`

## 2. React.memo for Pure Components

Wrap components that receive the same props frequently:

\`\`\`tsx
const ListItem = React.memo(({ item }: { item: Item }) => (
  <li>{item.name}</li>
));
\`\`\`

## 3. Code Splitting

Use dynamic imports for heavy components:

\`\`\`tsx
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});
\`\`\`

## Key Takeaways

- Profile first with React DevTools before optimizing
- \`useMemo\` is for expensive computations, not all values
- \`React.memo\` only helps when props are stable references
- Code splitting should be your first win — it's free
  `,
};

export default function ArticlePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-sm mb-10 hover:underline underline-offset-4 transition-all"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={14} />
        All Writing
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {article.tags.map((t) => (
          <span key={t} className="tag">
            <TechIcon tag={t} />
            {t}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1
        className="font-display font-bold leading-tight mb-6"
        style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}
      >
        {article.title}
      </h1>

      {/* Meta */}
      <div
        className="flex items-center gap-4 text-sm mb-10 pb-10 border-b"
        style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
      >
        <span className="flex items-center gap-1.5">
          <Calendar size={13} />
          {article.date}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} />
          {article.readTime}
        </span>
      </div>

      {/* Content */}
      <div
        className="prose prose-sm md:prose-base"
        style={{ color: "var(--text-primary)" }}
        dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
      />

      {/* Footer nav */}
      <div
        className="mt-16 pt-8 border-t flex justify-between items-center"
        style={{ borderColor: "var(--border)" }}
      >
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          style={{ color: "var(--accent)" }}
        >
          <ArrowLeft size={14} />
          Back to Writing
        </Link>
      </div>
    </div>
  );
}

// Simple markdown-to-html for demo (replace with MDX in production)
function formatContent(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 style="font-family: \'Playfair Display\', serif; font-size: 1.5rem; font-weight: 700; margin: 2.5rem 0 1rem; color: var(--text-primary);">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-family: \'Playfair Display\', serif; font-size: 1.2rem; font-weight: 600; margin: 2rem 0 0.75rem; color: var(--text-primary);">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\`\`\`tsx?\n([\s\S]*?)\`\`\`/g, (_, code) => `<pre style="background:var(--surface-raised);border:1px solid var(--border);border-radius:0.75rem;padding:1.25rem 1.5rem;overflow-x:auto;margin:1.5rem 0;"><code style="font-family:JetBrains Mono,monospace;font-size:0.85rem;color:var(--text-primary);">${escapeHtml(code.trim())}</code></pre>`)
    .replace(/\`([^`]+)\`/g, '<code style="background:var(--tag-bg);border:1px solid var(--tag-border);border-radius:4px;padding:0.15em 0.4em;color:var(--accent);font-size:0.85em;">$1</code>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.4rem 0;color:var(--text-secondary);">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul style="padding-left:1.25rem;margin:1rem 0;list-style:disc;">${m}</ul>`)
    .replace(/\n\n/g, '</p><p style="margin:1rem 0;color:var(--text-secondary);">')
    .replace(/^(.)/m, '<p style="margin:1rem 0;color:var(--text-secondary);">$1');
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
