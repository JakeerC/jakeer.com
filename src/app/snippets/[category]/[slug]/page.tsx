import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import CodeBlock from "@/components/CodeBlock";
import FaqItem from "@/components/FaqItem";
import { snippets } from "@/lib/snippets";

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;

  const catData = snippets[category];
  if (!catData) return notFound();

  const snippet = catData.items.find((item) => item.slug === slug);
  if (!snippet) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        href={`/snippets/${category}`}
        className="inline-flex items-center gap-2 text-sm mb-10 hover:underline underline-offset-4"
        style={{ color: "var(--text-muted)" }}
      >
        <LuArrowLeft size={14} />
        {catData.label} Snippets
      </Link>

      <section className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {snippet.tags?.map(tag => (
              <span key={tag} className="tag text-xs uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <h1
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {snippet.title}
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            {snippet.description}
          </p>
        </div>
        
        <div className="mt-4">
          <CodeBlock code={snippet.code} lang={snippet.lang} />
        </div>

        {snippet.faqs && snippet.faqs.length > 0 && (
          <div className="flex flex-col gap-2 mt-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              FAQ
            </p>
            {snippet.faqs.map((faq) => (
              <FaqItem key={faq.q} {...faq} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
