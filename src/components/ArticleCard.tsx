import Link from "next/link";

export interface ArticleCardProps {
  index: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags?: string[];
}

export default function ArticleCard({
  index,
  slug,
  title,
  excerpt,
  date,
  readTime,
}: ArticleCardProps) {
  return (
    <Link
      href={`/writing/${slug}`}
      className="bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)] transition-colors block group h-full"
    >
      <article className="p-6 md:p-8 h-full flex flex-col cursor-pointer">
        {/* Index */}
        <span
          className="text-xs font-mono font-semibold mb-5 block"
          style={{ color: "var(--accent)" }}
        >
          {String(index).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="flex-1 mb-8">
          <h3
            className="text-lg font-semibold leading-snug mb-3 group-hover:underline underline-offset-4"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {excerpt}
          </p>
        </div>

        {/* Meta */}
        <div
          className="font-mono text-xs mt-auto"
          style={{ color: "var(--text-muted)" }}
        >
          {date} · {readTime}
        </div>
      </article>
    </Link>
  );
}
