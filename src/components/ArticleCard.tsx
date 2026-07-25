import Link from "next/link";
import { Clock } from "lucide-react";
import TechIcon from "./TechIcon";

export interface ArticleCardProps {
  index:    number;
  slug:     string;
  title:    string;
  excerpt:  string;
  date:     string;
  readTime: string;
  tags?:    string[];
}

export default function ArticleCard({ index, slug, title, excerpt, date, readTime, tags }: ArticleCardProps) {
  return (
    <Link href={`/writing/${slug}`} className="block group">
      <article
        className="card p-6 h-full flex flex-col gap-4 cursor-pointer"
      >
        {/* Index */}
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          {String(index).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="flex-1">
          <h3
            className="font-display text-lg font-semibold leading-snug mb-2 group-hover:underline underline-offset-4"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          <p
            className="text-sm leading-relaxed line-clamp-3"
            style={{ color: "var(--text-secondary)" }}
          >
            {excerpt}
          </p>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="tag">
                <TechIcon tag={t} />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span>{date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {readTime}
          </span>
        </div>
      </article>
    </Link>
  );
}
