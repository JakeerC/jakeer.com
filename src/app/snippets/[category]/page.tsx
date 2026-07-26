import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import CodeBlock from "@/components/CodeBlock";
import FaqItem from "@/components/FaqItem";

import { snippets } from "@/lib/snippets";


export default async function SnippetCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const cat = snippets[resolvedParams.category] ?? {
    label: resolvedParams.category,
    items: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        href="/snippets"
        className="inline-flex items-center gap-2 text-sm mb-10 hover:underline underline-offset-4"
        style={{ color: "var(--text-muted)" }}
      >
        <LuArrowLeft size={14} />
        All Snippets
      </Link>

      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="section-label mb-3">SNIPPETS / {cat.label.toUpperCase()}</p>
          <h1
            className="font-display font-bold"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)" }}
          >
            {cat.label}
          </h1>
          <p className="mt-4 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Battle-tested {cat.label} utilities, patterns, and building blocks you can paste straight into production code.
          </p>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-4xl" style={{ color: "var(--text-primary)" }}>{cat.items.length}</div>
          <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>SNIPPETS</div>
        </div>
      </div>
      
      <div className="divider mb-12" />

      {/* Snippets */}
      {cat.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[var(--border)] gap-[1px] border border-[var(--border)]">
          {cat.items.map((item) => (
            <Link
              href={`/snippets/${resolvedParams.category}/${item.slug}`}
              key={item.title}
              className="bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] p-6 group flex flex-col transition-colors min-h-[220px]"
            >
              <h2
                className="font-bold mb-2 text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </h2>
              <p className="text-sm mb-6 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                {item.description}
              </p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags?.map(tag => (
                    <span key={tag} className="tag text-[10px] uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-3">
                    <span className="border border-amber-500 text-amber-500 px-2 py-0.5 rounded-sm">
                      {item.level || "INTERMEDIATE"}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {item.date || "Just now"}
                    </span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--accent)" }}>
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {/* Fill the remaining grid slots */}
          {Array.from({ length: (3 - (cat.items.length % 3)) % 3 }).map((_, i) => (
            <div key={`empty-${i}`} className="hidden lg:block bg-[var(--surface-raised)]" />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--text-muted)" }}>No snippets yet — coming soon.</p>
      )}
    </div>
  );
}
