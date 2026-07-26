import { LuArrowLeft, LuClock, LuCalendar } from "react-icons/lu";
import Link from "next/link";
import TechIcon from "@/components/TechIcon";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodeBlock from "@/components/CodeBlock";

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

const components = {
  h2: (props: any) => <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: "1.5rem", fontWeight: 700, margin: "2.5rem 0 1rem", color: "var(--text-primary)" }} {...props} />,
  h3: (props: any) => <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: "1.2rem", fontWeight: 600, margin: "2rem 0 0.75rem", color: "var(--text-primary)" }} {...props} />,
  strong: (props: any) => <strong {...props} />,
  code: (props: any) => {
    return <code style={{ background: "var(--tag-bg)", border: "1px solid var(--tag-border)", borderRadius: "4px", padding: "0.15em 0.4em", color: "var(--accent)", fontSize: "0.85em" }} {...props} />;
  },
  li: (props: any) => <li style={{ margin: "0.4rem 0", color: "var(--text-secondary)" }} {...props} />,
  ul: (props: any) => <ul style={{ paddingLeft: "1.25rem", margin: "1rem 0", listStyle: "disc" }} {...props} />,
  p: (props: any) => <p style={{ margin: "1rem 0", color: "var(--text-secondary)" }} {...props} />,
  pre: (props: any) => {
    const child = props.children;
    if (child && child.props) {
      const className = child.props.className || "";
      const langMatch = className.match(/language-(.*)/);
      const lang = langMatch ? langMatch[1] : "text";
      
      const codeString = typeof child.props.children === 'string' 
        ? child.props.children 
        : Array.isArray(child.props.children) 
          ? child.props.children.join('') 
          : child.props.children || "";

      return <CodeBlock code={String(codeString).trim()} lang={lang} />;
    }
    return <pre {...props} />;
  }
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
        <LuArrowLeft size={14} />
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
          <LuCalendar size={13} />
          {article.date}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1.5">
          <LuClock size={13} />
          {article.readTime}
        </span>
      </div>

      {/* Content */}
      <div
        className="prose prose-sm md:prose-base"
        style={{ color: "var(--text-primary)" }}
      >
        <MDXRemote source={article.content} components={components} />
      </div>

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
          <LuArrowLeft size={14} />
          Back to Writing
        </Link>
      </div>
    </div>
  );
}
